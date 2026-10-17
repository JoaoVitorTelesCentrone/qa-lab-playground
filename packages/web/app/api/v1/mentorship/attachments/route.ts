import { fail, ok, withUser } from "@/lib/product/api";
import { requireEnrollment, MentorshipAccessError } from "@/lib/mentorship/access";
import { findMentorshipAssignment } from "@/lib/mentorship/catalog";
import { uploadEvidenceFile } from "@/lib/product/evidence-storage";
import { ALLOWED_TYPES, MAX_FILE_BYTES, formatBytes } from "@/lib/product/evidence-limits";

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return withUser(async (user) => {
    try {
      await requireEnrollment();
      const form = await request.formData();
      const file = form.get("file");
      const assignmentKey = form.get("assignmentKey");
      if (!(file instanceof File)) return fail("Nenhum arquivo recebido.", 400);
      if (typeof assignmentKey !== "string" || !findMentorshipAssignment(assignmentKey)) return fail("Missao da mentoria invalida.", 404);
      if (file.size === 0) return fail("O arquivo esta vazio.", 400);
      if (file.size > MAX_FILE_BYTES) return fail(`O arquivo excede o limite de ${formatBytes(MAX_FILE_BYTES)}.`, 413);
      if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) return fail("Formato nao aceito. Use imagem, video (mp4/webm) ou PDF.", 415);
      const attachment = await uploadEvidenceFile(user.id, `mentoria-${assignmentKey}`, file);
      return ok(attachment, 201);
    } catch (error) {
      if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
      return fail(error instanceof Error ? error.message : "Nao foi possivel enviar o anexo.", 500);
    }
  });
}
