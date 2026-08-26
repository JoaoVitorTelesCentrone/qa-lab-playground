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

const BUCKET = "lab-evidence";

/**
 * Uma hora. As páginas que mostram anexo são todas renderizadas sob demanda,
 * então cada visita assina de novo — o prazo só precisa cobrir a leitura de
 * uma sessão, não a validade do link.
 */
const SIGNED_URL_TTL = 60 * 60;

/** Extensão a partir do nome original; sem ela o Storage serve o arquivo sem tipo. */
function extensionOf(name: string) {
  const match = /\.([a-z0-9]{1,8})$/i.exec(name.trim());
  return match ? `.${match[1].toLowerCase()}` : "";
}

/**
 * Nome do arquivo dentro do bucket. O primeiro segmento é o id do usuário
 * porque é isso que as policies do Storage checam.
 */
function pathFor(userId: string, labSlug: string, fileName: string) {
  const safeLab = labSlug.replace(/[^a-z0-9-]/gi, "").slice(0, 60) || "lab";
  return `${userId}/${safeLab}/${crypto.randomUUID()}${extensionOf(fileName)}`;
}

export async function uploadEvidenceFile(userId: string, labSlug: string, file: File): Promise<Attachment> {
  const supabase = await createClient();
  const path = pathFor(userId, labSlug, file.name);

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
export async function signPublicAttachments(attachments: Attachment[]): Promise<Attachment[]> {
  if (attachments.length === 0) return attachments;
  if (!hasServiceRole()) return attachments.map((file) => ({ ...file, url: "" }));
  const admin = createAdminClient();
  return applySigned(await signPaths(admin, attachments.map((file) => file.path)), attachments);
}

function applySigned(urls: string[], attachments: Attachment[]): Attachment[] {
  return attachments.map((file, index) => ({ ...file, url: urls[index] ?? "" }));
}
