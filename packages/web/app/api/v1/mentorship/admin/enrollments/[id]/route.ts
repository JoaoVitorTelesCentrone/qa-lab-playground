import { MentorshipAccessError } from "@/lib/mentorship/access";
import { updateEnrollmentAdmin } from "@/lib/mentorship/store";
import { fail, FieldReader, ok, readJson, ValidationError } from "@/lib/product/api";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const status = reader.oneOf("status", ["invited", "active", "paused", "completed", "cancelled"] as const);
    const level = reader.oneOf("level", ["beginner", "intermediate"] as const);
    reader.done();
    return ok(await updateEnrollmentAdmin(id, { status, level }));
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
