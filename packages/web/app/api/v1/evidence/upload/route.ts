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
import { uploadEvidenceFile, removeEvidenceFile, isEvidenceUploadLimitError } from "@/lib/product/evidence-storage";
import { ALLOWED_TYPES, MAX_FILE_BYTES, formatBytes } from "@/lib/product/evidence-limits";
import { labs } from "@/lib/playground/catalog";
import { trackEvent } from "@/lib/product/store";

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return withUser(async (user) => {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return uploadFailure(user.id, "invalid_multipart", "Envie o arquivo como multipart/form-data.", 400);
    }

    const file = form.get("file");
    const labSlug = form.get("labSlug");
    if (!(file instanceof File)) return uploadFailure(user.id, "missing_file", "Nenhum arquivo recebido.", 400);
    if (typeof labSlug !== "string" || !labSlug) return uploadFailure(user.id, "missing_lab", "Lab não informado.", 400);

    const lab = labs.find((item) => item.slug === labSlug);
    if (!lab) return uploadFailure(user.id, "lab_not_found", "Lab não encontrado.", 404);
    if (lab.status !== "liberado") return uploadFailure(user.id, "lab_locked", "Este Lab ainda não foi liberado.", 409);

    if (file.size === 0) return uploadFailure(user.id, "empty_file", "O arquivo está vazio.", 400);
    if (file.size > MAX_FILE_BYTES) {
      return uploadFailure(user.id, "file_too_large", `O arquivo tem ${formatBytes(file.size)} e o limite é ${formatBytes(MAX_FILE_BYTES)}.`, 413);
    }
    if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      return uploadFailure(user.id, "unsupported_type", "Formato não aceito. Use imagem (png, jpg, gif, webp), vídeo (mp4, webm) ou PDF.", 415);
    }

    try {
      const attachment = await uploadEvidenceFile(user.id, labSlug, file);
      await trackEvent(user.id, "evidence_upload_succeeded", { lab: labSlug, mimeType: file.type, sizeBytes: file.size });
      return ok(attachment, 201);
    } catch (error) {
      if (isEvidenceUploadLimitError(error)) return uploadFailure(user.id, "upload_limit", (error as Error).message, 429, labSlug);
      await trackEvent(user.id, "evidence_upload_failed", { reason: "storage_error", status: 500, lab: labSlug });
      throw error;
    }
  });
}

async function uploadFailure(userId: string, reason: string, message: string, status: number, lab?: string) {
  await trackEvent(userId, "evidence_upload_failed", { reason, status, ...(lab ? { lab } : {}) });
  return fail(message, status);
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
