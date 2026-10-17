import { fail, ok, readJson, FieldReader, ValidationError } from "@/lib/product/api";
import { MentorshipAccessError, requireSession } from "@/lib/mentorship/access";
import { saveWeeklyCommitment } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireSession();
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const commitment = reader.text("commitment", { max: 500 });
    reader.done();
    const weekNumber = typeof body.weekNumber === "number" && Number.isInteger(body.weekNumber) ? body.weekNumber : Number(body.weekNumber);
    return ok(await saveWeeklyCommitment(user.id, { weekNumber, commitment }));
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
