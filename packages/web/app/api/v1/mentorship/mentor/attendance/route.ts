import { fail, ok, readJson, FieldReader, ValidationError } from "@/lib/product/api";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { markAttendance } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const sessionId = reader.text("sessionId", { max: 80 });
    const enrollmentId = reader.text("enrollmentId", { max: 80 });
    const status = reader.oneOf("status", ["present", "absent", "excused", "watched_recording"] as const);
    reader.done();
    return ok(await markAttendance({ sessionId, enrollmentId, status }));
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
