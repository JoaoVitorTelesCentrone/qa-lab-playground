import { fail, ok } from "@/lib/product/api";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { markLessonComplete } from "@/lib/mentorship/store";
import { getSessionUser, trackEvent } from "@/lib/product/store";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, context: { params: Promise<{ lessonKey: string }> }) {
  const user = await getSessionUser();
  if (!user) return fail("Faca login para marcar a aula.", 401);
  try {
    const { lessonKey } = await context.params;
    return ok(await markLessonComplete(user.id, decodeURIComponent(lessonKey)));
  } catch (error) {
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    await trackEvent(user.id, "api_error", { message: error instanceof Error ? error.message : "Erro inesperado." });
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
