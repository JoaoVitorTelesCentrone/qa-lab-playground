import { MentorshipAccessError } from "@/lib/mentorship/access";
import { assignMentorToCohort, removeMentorFromCohort } from "@/lib/mentorship/store";
import { fail, FieldReader, ok, readJson, ValidationError } from "@/lib/product/api";

export const dynamic = "force-dynamic";

function handleError(error: unknown) {
  if (error instanceof ValidationError) return fail(error.message, 422, error.details);
  if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
  return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const cohortId = reader.text("cohortId", { max: 80 });
    const userId = reader.text("userId", { max: 80 });
    const role = reader.oneOf("role", ["lead", "reviewer", "facilitator"] as const);
    reader.done();
    return ok(await assignMentorToCohort({ cohortId, userId, role }), 201);
  } catch (error) { return handleError(error); }
}

export async function DELETE(request: Request) {
  try {
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const cohortId = reader.text("cohortId", { max: 80 });
    const userId = reader.text("userId", { max: 80 });
    reader.done();
    return ok(await removeMentorFromCohort(cohortId, userId));
  } catch (error) { return handleError(error); }
}
