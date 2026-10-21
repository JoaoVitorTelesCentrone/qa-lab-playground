import { createAdminClient } from "@/lib/supabase/admin";
import { MentorshipAccessError, requireStaff } from "@/lib/mentorship/access";
import { notifyMentorshipUsers } from "@/lib/mentorship/store";
import { fail, ok, readJson } from "@/lib/product/api";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await requireStaff("admin");
    const { id } = await params;
    const body = await readJson(request);
    const decision = body.decision === "refund_recorded" ? "refund_recorded" : "activate";
    const note = typeof body.note === "string" ? body.note.trim().slice(0, 2000) : "";
    if (!note) return fail("Registre o que foi verificado e a decisão tomada.", 422);
    if (decision === "refund_recorded" && body.refundConfirmed !== true) return fail("Confirme que o reembolso já foi processado no Mercado Pago.", 422);
    const admin = createAdminClient();
    const { data: order } = await admin.from("mentorship_orders").select("id,user_id,status").eq("id", id).maybeSingle();
    if (!order) return fail("Checkout não encontrado.", 404);
    const { data, error } = await admin.rpc("resolve_paid_mentorship_order", {
      target_order_id: id, target_decision: decision, target_note: note, target_reviewer: user.id,
    });
    if (error) {
      const status = error.message.includes("COHORT_FULL") ? 409 : error.message.includes("ORDER_NOT_RESOLVABLE") ? 409 : 422;
      return fail(error.message.includes("COHORT_FULL") ? "A turma continua cheia. Processe o reembolso no Mercado Pago e registre a decisão." : "Não foi possível registrar a conciliação.", status);
    }
    await notifyMentorshipUsers([order.user_id], {
      kind: "system",
      title: decision === "activate" ? "Sua vaga na Mentoria QA Lab está confirmada" : "Atualização sobre seu pagamento da mentoria",
      body: decision === "activate" ? "Sua matrícula está ativa. Faça o diagnóstico para começar." : "A equipe registrou o reembolso. Confira a confirmação no Mercado Pago.",
      href: decision === "activate" ? "/mentoria/diagnostico" : "/mentoria/inscricao",
    });
    return ok(data);
  } catch (error) {
    if (error instanceof MentorshipAccessError) return fail(error.message, error.status);
    return fail("Não foi possível registrar a conciliação.", 500);
  }
}
