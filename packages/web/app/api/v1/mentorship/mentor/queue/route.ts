import { fail, ok } from "@/lib/product/api";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { mentorQueue } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await mentorQueue());
  } catch (error) {
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
