import { fail, ok, readJson, FieldReader, ValidationError } from "@/lib/product/api";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { updateWeeklyCommitmentCheckIn } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const reader = new FieldReader(await readJson(request));
    const commitmentId = reader.text("commitmentId", { max: 80 });
    const checkIn = reader.text("checkIn", { max: 1000 });
    reader.done();
    return ok(await updateWeeklyCommitmentCheckIn(commitmentId, checkIn));
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
