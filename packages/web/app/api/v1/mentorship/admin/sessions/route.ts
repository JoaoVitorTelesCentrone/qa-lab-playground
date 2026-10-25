import { fail, ok, readJson, FieldReader, ValidationError } from "@/lib/product/api";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { createLiveSession } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const cohortId = reader.text("cohortId", { max: 80 });
    const title = reader.text("title", { max: 180 });
    const agenda = reader.text("agenda", { max: 4000 });
    const startsAt = reader.text("startsAt", { max: 40 });
    const endsAt = reader.text("endsAt", { max: 40 });
    const meetingUrl = reader.text("meetingUrl", { max: 500 });
    const recordingUrl = typeof body.recordingUrl === "string" ? body.recordingUrl : undefined;
    const recordingAvailableUntil = typeof body.recordingAvailableUntil === "string" ? body.recordingAvailableUntil : undefined;
    reader.done();
    const weekNumber = typeof body.weekNumber === "number" && Number.isInteger(body.weekNumber) ? body.weekNumber : Number(body.weekNumber);
    return ok(await createLiveSession({ cohortId, weekNumber, title, agenda, startsAt, endsAt, meetingUrl, recordingUrl, recordingAvailableUntil }), 201);
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
