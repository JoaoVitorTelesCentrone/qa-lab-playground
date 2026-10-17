import { MentorshipAccessError } from "@/lib/mentorship/access";
import { updateLiveSessionAdmin } from "@/lib/mentorship/store";
import { fail, FieldReader, ok, readJson, ValidationError } from "@/lib/product/api";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const title = reader.text("title", { max: 180 });
    const agenda = reader.text("agenda", { max: 4000 });
    const startsAt = reader.text("startsAt", { max: 40 });
    const endsAt = reader.text("endsAt", { max: 40 });
    const meetingUrl = reader.text("meetingUrl", { max: 500 });
    const recordingUrl = typeof body.recordingUrl === "string" ? body.recordingUrl : undefined;
    const recordingAvailableUntil = typeof body.recordingAvailableUntil === "string" ? body.recordingAvailableUntil : undefined;
    reader.done();
    return ok(await updateLiveSessionAdmin(id, { title, agenda, startsAt, endsAt, meetingUrl, recordingUrl, recordingAvailableUntil }));
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
