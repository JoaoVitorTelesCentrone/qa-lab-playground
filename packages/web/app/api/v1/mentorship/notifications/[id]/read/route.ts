import { fail, ok } from "@/lib/product/api";
import { MentorshipAccessError, requireSession } from "@/lib/mentorship/access";
import { markMentorshipNotificationRead } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSession();
    const { id } = await context.params;
    return ok(await markMentorshipNotificationRead(user.id, id));
  } catch (error) {
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
