import { fail, ok, readJson, FieldReader, ValidationError } from "@/lib/product/api";
import { MentorshipAccessError, requireSession } from "@/lib/mentorship/access";
import { publishMentorshipCase } from "@/lib/mentorship/portfolio";
import { trackEvent } from "@/lib/product/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireSession();
    const body = await readJson(request);
    const reader = new FieldReader(body);
    const submissionId = reader.text("submissionId", { max: 80 });
    const title = reader.text("title", { max: 160 });
    const summary = reader.text("summary", { max: 2000 });
    reader.done();
    if (typeof body.published !== "boolean") return fail("Informe se o case fica publico.", 422, { published: "Campo obrigatorio." });
    const portfolioCase = await publishMentorshipCase(user.id, { submissionId, title, summary, published: body.published });
    if (portfolioCase.published) await trackEvent(user.id, "case_published", { type: "mentorship" });
    return ok(portfolioCase);
  } catch (error) {
    if (error instanceof ValidationError) return fail(error.message, 422, error.details);
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
