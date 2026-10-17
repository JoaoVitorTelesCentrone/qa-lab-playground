import { fail, ok, readJson, FieldReader, ValidationError } from "@/lib/product/api";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { MentorshipReviewValidationError, reviewMentorshipSubmission } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const decision = reader.oneOf("decision", ["changes_requested", "approved"] as const);
    const strengths = reader.text("strengths", { max: 3000 });
    const improvements = reader.text("improvements", { max: 3000 });
    const nextAction = reader.text("nextAction", { max: 1000 });
    reader.done();
    const scores = body.scores && typeof body.scores === "object" && !Array.isArray(body.scores) ? body.scores as Record<string, number> : {};
    const { id } = await context.params;
    return ok(await reviewMentorshipSubmission(id, { decision, scores, strengths, improvements, nextAction }), 201);
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipReviewValidationError) return fail(error.message, 422);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
