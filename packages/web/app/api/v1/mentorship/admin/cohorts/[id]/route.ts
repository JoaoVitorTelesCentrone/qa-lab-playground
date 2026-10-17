import { MentorshipAccessError } from "@/lib/mentorship/access";
import { updateCohortAdmin } from "@/lib/mentorship/store";
import { fail, FieldReader, ok, readJson, ValidationError } from "@/lib/product/api";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const name = reader.text("name", { max: 180 });
    const startsOn = reader.text("startsOn", { max: 10 });
    const endsOn = reader.text("endsOn", { max: 10 });
    const status = reader.text("status", { max: 20 });
    reader.done();
    return ok(await updateCohortAdmin(id, { name, startsOn, endsOn, capacity: Number(body.capacity), status: status as "draft" | "enrollment" | "active" | "completed" | "archived" }));
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
