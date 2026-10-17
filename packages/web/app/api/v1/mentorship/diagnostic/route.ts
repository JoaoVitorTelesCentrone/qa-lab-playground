import { fail, ok, readJson, FieldReader, ValidationError } from "@/lib/product/api";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { saveDiagnostic } from "@/lib/mentorship/store";
import { getSessionUser, trackEvent } from "@/lib/product/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return fail("Faca login para salvar seu diagnostico.", 401);
  try {
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const level = reader.oneOf("level", ["beginner", "intermediate"] as const);
    const goal = reader.text("goal", { max: 500 });
    reader.done();
    const score = body.score && typeof body.score === "object" && !Array.isArray(body.score) ? body.score as Record<string, unknown> : {};
    return ok(await saveDiagnostic(user.id, { level, goal, score }));
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    await trackEvent(user.id, "api_error", { message: error instanceof Error ? error.message : "Erro inesperado." });
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
