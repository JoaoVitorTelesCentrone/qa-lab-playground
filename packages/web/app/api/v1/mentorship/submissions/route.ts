import { fail, ok, readJson, FieldReader, ValidationError } from "@/lib/product/api";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { MentorshipSubmissionValidationError, submitMentorshipAssignment } from "@/lib/mentorship/store";
import { getSessionUser, trackEvent } from "@/lib/product/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return fail("Faca login para enviar sua entrega.", 401);
  try {
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const assignmentKey = reader.text("assignmentKey", { max: 160 });
    const reportUrl = reader.text("reportUrl", { max: 1000, required: false });
    const repositoryUrl = reader.text("repositoryUrl", { max: 1000, required: false });
    const labSubmissionId = reader.text("labSubmissionId", { max: 80, required: false });
    reader.done();
    const content = body.content && typeof body.content === "object" && !Array.isArray(body.content) ? body.content as Record<string, unknown> : {};
    const attachments = Array.isArray(body.attachments) ? body.attachments as import("@/lib/product/journey").Attachment[] : [];
    return ok(await submitMentorshipAssignment(user.id, { assignmentKey, content, reportUrl, repositoryUrl, labSubmissionId, attachments }), 201);
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipSubmissionValidationError) return fail(error.message, 422);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    await trackEvent(user.id, "api_error", { message: error instanceof Error ? error.message : "Erro inesperado." });
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
