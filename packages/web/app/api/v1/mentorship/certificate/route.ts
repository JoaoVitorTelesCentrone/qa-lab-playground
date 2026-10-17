import { fail, ok } from "@/lib/product/api";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { issueMentorshipCertificate } from "@/lib/mentorship/store";
import { getSessionUser } from "@/lib/product/store";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getSessionUser();
    if (!user) return fail("Entre na sua conta para emitir seu certificado.", 401);
    const result = await issueMentorshipCertificate(user.id);
    if (!result.certificate) return fail("Conclua as 12 entregas aprovadas e todas as aulas para liberar o certificado.", 409, { approvedAssignments: String(result.approvedAssignments), requiredAssignments: String(result.requiredAssignments), completedLessons: String(result.completedLessons), requiredLessons: String(result.requiredLessons) });
    return ok(result);
  } catch (error) {
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail(error instanceof Error ? error.message : "Erro inesperado.", 500);
  }
}
