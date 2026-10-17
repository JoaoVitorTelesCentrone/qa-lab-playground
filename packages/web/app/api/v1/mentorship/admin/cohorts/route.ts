import { fail, ok, readJson, FieldReader, ValidationError } from "@/lib/product/api";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { createCohort } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const code = reader.text("code", { max: 80 });
    const name = reader.text("name", { max: 160 });
    const startsOn = reader.text("startsOn", { max: 10 });
    const endsOn = reader.text("endsOn", { max: 10 });
    reader.done();
    const capacity = typeof body.capacity === "number" && Number.isInteger(body.capacity) ? body.capacity : 20;
    return ok(await createCohort({ code, name, startsOn, endsOn, capacity }), 201);
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
