import { fail, ok, readJson, FieldReader, ValidationError } from "@/lib/product/api";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { enrollStudent } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const cohortId = reader.text("cohortId", { max: 80 });
    const userId = reader.text("userId", { max: 80 });
    const level = reader.oneOf("level", ["beginner", "intermediate"] as const);
    reader.done();
    return ok(await enrollStudent({ cohortId, userId, level }), 201);
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
