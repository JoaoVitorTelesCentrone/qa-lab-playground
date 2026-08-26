// POST /api/v1/evidence/upload — sobe um anexo de evidência para o Storage.
//
// O arquivo vai antes da submissão: o formulário faz o upload assim que o
// aluno escolhe o arquivo e guarda só o ponteiro, então a entrega em si
// continua sendo um POST de JSON pequeno. O efeito colateral é que existe
// arquivo órfão quando alguém desiste no meio — trocamos isso de propósito por
// upload com barra de progresso e remoção antes de enviar.
//
// Os limites vivem aqui E no bucket (migração 202606220005): o check do bucket
// é a rede de segurança, este é o que devolve mensagem em português.

import { fail, ok, withUser } from "@/lib/product/api";
import { uploadEvidenceFile, removeEvidenceFile } from "@/lib/product/evidence-storage";
import { ALLOWED_TYPES, MAX_FILE_BYTES, formatBytes } from "@/lib/product/evidence-limits";

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return withUser(async (user) => {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return fail("Envie o arquivo como multipart/form-data.", 400);
    }

    const file = form.get("file");
    const labSlug = form.get("labSlug");
    if (!(file instanceof File)) return fail("Nenhum arquivo recebido.", 400);
    if (typeof labSlug !== "string" || !labSlug) return fail("Lab não informado.", 400);

    if (file.size === 0) return fail("O arquivo está vazio.", 400);
    if (file.size > MAX_FILE_BYTES) {
      return fail(`O arquivo tem ${formatBytes(file.size)} e o limite é ${formatBytes(MAX_FILE_BYTES)}.`, 413);
    }
    if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      return fail("Formato não aceito. Use imagem (png, jpg, gif, webp), vídeo (mp4, webm) ou PDF.", 415);
    }

    const attachment = await uploadEvidenceFile(user.id, labSlug, file);
    return ok(attachment, 201);
  });
}

// DELETE /api/v1/evidence/upload?path=... — remove um anexo que o aluno tirou
// do formulário antes de entregar.
export function DELETE(request: Request) {
  return withUser(async (user) => {
    const path = new URL(request.url).searchParams.get("path");
    if (!path) return fail("Caminho do arquivo não informado.", 400);
    // A policy do Storage já barra caminho de outro usuário, mas responder 403
    // aqui evita depender só dela e dá uma mensagem clara.
    if (!path.startsWith(`${user.id}/`)) return fail("Este arquivo não é seu.", 403);
    await removeEvidenceFile(path);
    return ok({ path });
  });
}
