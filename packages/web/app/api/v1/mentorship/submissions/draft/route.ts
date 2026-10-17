import { fail, ok, readJson, FieldReader, ValidationError } from "@/lib/product/api";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { MentorshipSubmissionValidationError, saveMentorshipDraft } from "@/lib/mentorship/store";
import { getSessionUser } from "@/lib/product/store";
import type { Attachment } from "@/lib/product/journey";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return fail("Faca login para salvar sua entrega.", 401);
  try {
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const assignmentKey = reader.text("assignmentKey", { max: 160 });
    const repositoryUrl = reader.text("repositoryUrl", { max: 1000, required: false });
    const reportUrl = reader.text("reportUrl", { max: 1000, required: false });
    const labSubmissionId = reader.text("labSubmissionId", { max: 80, required: false });
    reader.done();
    const content = body.content && typeof body.content === "object" && !Array.isArray(body.content) ? body.content as Record<string, unknown> : {};
    const attachments = Array.isArray(body.attachments) ? body.attachments as Attachment[] : [];
    return ok(await saveMentorshipDraft(user.id, { assignmentKey, content, repositoryUrl, reportUrl, labSubmissionId, attachments }));
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipSubmissionValidationError) return fail(error.message, 422);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
