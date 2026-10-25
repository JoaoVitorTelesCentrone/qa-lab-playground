// Acesso ao Storage dos anexos de evidência.
//
// Isolado do resto do store porque é o único lugar do produto que fala com o
// Storage, e porque deixar isso dentro de store.ts arrastaria o bucket para
// todo import de progresso.
//
// O bucket é privado (migração 0013). O que fica gravado em `attachments` é o
// `path`; a URL é assinada na leitura e vale por pouco tempo. Por isso a `url`
// que sai do upload não serve para guardar — quem renderiza precisa passar
// pelas funções de assinatura daqui.

import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import type { Attachment } from "./journey";
import { isOwnEvidencePath } from "./evidence-attachments";

const BUCKET = "lab-evidence";

/**
 * Uma hora. As páginas que mostram anexo são todas renderizadas sob demanda,
 * então cada visita assina de novo — o prazo só precisa cobrir a leitura de
 * uma sessão, não a validade do link.
 */
const SIGNED_URL_TTL = 60 * 60;

const FILE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg", "image/png": ".png", "image/gif": ".gif",
  "image/webp": ".webp", "video/mp4": ".mp4", "video/webm": ".webm",
  "application/pdf": ".pdf",
};

/**
 * Nome do arquivo dentro do bucket. O primeiro segmento é o id do usuário
 * porque é isso que as policies do Storage checam.
 */
function pathFor(userId: string, labSlug: string, fileType: string) {
  const safeLab = labSlug.replace(/[^a-z0-9-]/gi, "").slice(0, 60) || "lab";
  const extension = FILE_EXTENSIONS[fileType];
  if (!extension) throw new Error("Formato de arquivo não aceito.");
  return `${userId}/${safeLab}/${crypto.randomUUID()}${extension}`;
}

/** A reserva é feita no servidor; a policy do Storage exige o caminho exato. */
export async function reserveEvidenceUpload(userId: string, path: string, size: number, type: string) {
  const admin = createAdminClient();
  const { error } = await admin.rpc("reserve_evidence_upload", {
    owner_id: userId, object_path: path, file_bytes: size, file_type: type,
  });
  if (error) throw new Error(error.message);
}

export function isEvidenceUploadLimitError(error: unknown) {
  return error instanceof Error && (/^Limite de armazenamento da conta:|^Limite diario de envios atingido\.|^Aguarde os envios em andamento/.test(error.message));
}

export async function uploadEvidenceFile(userId: string, labSlug: string, file: File): Promise<Attachment> {
  const supabase = await createClient();
  const path = pathFor(userId, labSlug, file.type);
  await reserveEvidenceUpload(userId, path, file.size, file.type);

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    // Caminho novo a cada upload, então sobrescrever nunca deveria acontecer —
    // se acontecer, é bug, e falhar alto é melhor do que perder o anexo alheio.
    upsert: false,
  });
  if (error) throw new Error(`Não foi possível subir o arquivo: ${error.message}`);

  const [signed] = await signPaths(supabase, [path]);
  return {
    name: file.name.slice(0, 180),
    url: signed ?? "",
    path,
    size: file.size,
    type: file.type,
  };
}

/** Confirm that attachment pointers really exist before they count as evidence. */
export async function evidenceFilesExist(attachments: Attachment[]): Promise<boolean> {
  if (attachments.length === 0) return true;
  const supabase = await createClient();
  const results = await Promise.all(attachments.map((file) => supabase.storage.from(BUCKET).exists(file.path)));
  // Storage's HEAD endpoint reports a missing object as 400 or 404 depending
  // on the Storage version; absence is invalid evidence, not an API outage.
  const failure = results.find((result) => result.error && !("statusCode" in result.error && ["400", "404"].includes(String(result.error.statusCode))));
  if (failure?.error) throw new Error(`Não foi possível conferir o anexo: ${failure.error.message}`);
  return results.every((result) => result.data === true);
}

export async function removeEvidenceFile(path: string) {
  await removeEvidenceFiles([path]);
}

/**
 * Remoção em lote, usada ao editar (anexo tirado da lista) e ao apagar a
 * entrega inteira. Falha aqui não derruba a operação de banco que já aconteceu
 * — o registro sumir e o arquivo ficar é ruim, mas o inverso, abortar a
 * exclusão porque o Storage piscou, é pior.
 */
export async function removeEvidenceFiles(paths: string[]) {
  if (paths.length === 0) return;
  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) console.error(`Anexo não removido do Storage: ${error.message}`);
}

/** Assina em lote. Devolve na mesma ordem; posição sem URL vira string vazia. */
async function signPaths(client: SupabaseClient, paths: string[]): Promise<string[]> {
  if (paths.length === 0) return [];
  const { data, error } = await client.storage.from(BUCKET).createSignedUrls(paths, SIGNED_URL_TTL);
  if (error || !data) {
    console.error(`Não foi possível assinar anexo: ${error?.message ?? "resposta vazia"}`);
    return paths.map(() => "");
  }
  const byPath = new Map(data.map((item) => [item.path ?? "", item.signedUrl ?? ""]));
  return paths.map((path) => byPath.get(path) ?? "");
}

/**
 * Renova a URL dos anexos do próprio aluno. Usa a sessão dele, então a policy
 * de select do Storage é quem autoriza — se o caminho não for da pasta dele,
 * simplesmente não assina.
 */
export async function signOwnAttachments(attachments: Attachment[]): Promise<Attachment[]> {
  if (attachments.length === 0) return attachments;
  const supabase = await createClient();
  return applySigned(await signPaths(supabase, attachments.map((file) => file.path)), attachments);
}

/**
 * Renova a URL dos anexos para leitura anônima da página pública.
 *
 * Aqui a autorização não vem do Storage e sim do nosso código: só chamamos
 * depois de já ter filtrado `published = true`. Sem chave de serviço a página
 * continua de pé, só sem os anexos.
 */
export async function signPublicAttachments(attachments: Attachment[], ownerId: string, labSlug: string): Promise<Attachment[]> {
  if (attachments.length === 0) return attachments;
  const safe = attachments.filter((file) => isOwnEvidencePath(file.path, ownerId, labSlug));
  if (!hasServiceRole() || safe.length === 0) return attachments.map((file) => ({ ...file, url: "" }));
  const admin = createAdminClient();
  const urls = await signPaths(admin, safe.map((file) => file.path));
  const signed = new Map(safe.map((file, index) => [file.path, urls[index] ?? ""]));
  return attachments.map((file) => ({ ...file, url: signed.get(file.path) ?? "" }));
}

/** Assina anexos apos o chamador validar acesso privilegiado (ex.: mentor da turma). */
export async function signAuthorizedAttachments(attachments: Attachment[]): Promise<Attachment[]> {
  if (attachments.length === 0) return attachments;
  if (!hasServiceRole()) return attachments.map((file) => ({ ...file, url: "" }));
  const admin = createAdminClient();
  return applySigned(await signPaths(admin, attachments.map((file) => file.path)), attachments);
}

function applySigned(urls: string[], attachments: Attachment[]): Attachment[] {
  return attachments.map((file, index) => ({ ...file, url: urls[index] ?? "" }));
}
