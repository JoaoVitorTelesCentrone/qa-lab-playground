import { createAdminClient } from "@/lib/supabase/admin";
import { MentorshipAccessError, requireStaff } from "@/lib/mentorship/access";
import { notifyMentorshipUsers } from "@/lib/mentorship/store";
import { fail, ok, readJson } from "@/lib/product/api";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await requireStaff("admin");
    const { id } = await params;
    const body = await readJson(request);
    const decision = typeof body.decision === "string" ? body.decision : "";
    const source = body.source === "scholarship" ? "scholarship" : "manual";
    const note = typeof body.note === "string" ? body.note.trim().slice(0, 2000) : "";
    const paymentReference = typeof body.paymentReference === "string" ? body.paymentReference.trim().slice(0, 240) : "";
    const cohortId = typeof body.cohortId === "string" && body.cohortId ? body.cohortId : null;
    if (!["confirmed","waitlisted","rejected","cancelled"].includes(decision)) return fail("Ação inválida.", 422);
    if (!note) return fail("Registre o motivo ou observação da decisão.", 422);
    if (decision === "confirmed" && source === "manual" && !paymentReference) return fail("Informe a referência da confirmação financeira. Para bolsa, selecione a origem correspondente.", 422);
    const admin = createAdminClient();
    const { data: application } = await admin.from("mentorship_applications").select("id,user_id,status").eq("id", id).maybeSingle();
    if (!application) return fail("Inscrição não encontrada.", 404);
    const { data, error } = await admin.rpc("activate_mentorship_application", {
      target_application_id: id,
      target_decision: decision,
      target_note: note,
      target_payment_reference: paymentReference || null,
      target_reviewer: user.id,
      target_source: source,
      target_cohort_id: cohortId,
    });
    if (error) {
      const reason = error.message;
      const status = reason.includes("COHORT_FULL") ? 409 : reason.includes("APPLICATION_NOT_FOUND") ? 404 : 422;
      const message = reason.includes("COHORT_FULL") ? "A turma está cheia e não pode receber outra matrícula." : reason.includes("COHORT_REQUIRED") ? "Selecione uma turma para confirmar essa inscrição." : reason.includes("PAYMENT_REFERENCE_REQUIRED") ? "Informe a referência da confirmação financeira." : "Não foi possível atualizar a inscrição.";
      return fail(message, status);
    }
    if (decision === "confirmed") await notifyMentorshipUsers([application.user_id], {
      kind: "system", title: "Sua vaga na Mentoria QA Lab está confirmada",
      body: "Sua matrícula está ativa. Faça o diagnóstico para começar sua jornada.", href: "/mentoria/diagnostico",
    });
    return ok({ applicationId: id, decision, enrollment: data });
  } catch (error) {
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail("Não foi possível atualizar a inscrição.", 500);
  }
}
