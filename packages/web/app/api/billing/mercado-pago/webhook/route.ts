import { NextResponse } from "next/server";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { getPayment, verifyWebhookSignature } from "@/lib/billing/mercado-pago";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = await request.json().catch(() => ({}));
  const paymentId = url.searchParams.get("data.id") ?? (typeof body?.data?.id === "string" || typeof body?.data?.id === "number" ? String(body.data.id) : null);
  const valid = verifyWebhookSignature({ signature: request.headers.get("x-signature"), requestId: request.headers.get("x-request-id"), dataId: paymentId });
  if (!valid) return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  if (!paymentId || !hasServiceRole()) return NextResponse.json({ ok: true });
  try {
    const payment = await getPayment(paymentId);
    const purchaseId = payment.external_reference;
    if (!purchaseId) return NextResponse.json({ ok: true });
    const admin = createAdminClient();
    const { data: mentorshipOrder } = await admin.from("mentorship_orders").select("id,user_id,cohort_id,amount,currency,status,enrollment_id").eq("id", purchaseId).maybeSingle();
    if (mentorshipOrder) {
      const expectedCollectorId = process.env.MERCADO_PAGO_COLLECTOR_ID;
      if (!expectedCollectorId || String(payment.collector_id ?? "") !== expectedCollectorId) throw new Error("Conta recebedora do pagamento não corresponde à configuração da mentoria.");
      if (typeof payment.transaction_amount !== "number" || !Number.isFinite(payment.transaction_amount) || !payment.currency_id) throw new Error("Pagamento sem valor ou moeda para conciliação.");
      const { data: finalized, error: finalizeError } = await admin.rpc("finalize_mentorship_payment", {
        target_order_id: mentorshipOrder.id,
        target_payment_id: String(payment.id),
        target_payment_status: payment.status,
        target_amount: payment.transaction_amount,
        target_currency: payment.currency_id,
      });
      if (finalizeError) throw new Error(finalizeError.message);
      if (mentorshipOrder.status !== "approved" && payment.status === "approved" && finalized?.status === "approved" && finalized?.enrollment_id) {
        await admin.from("activity_events").insert({ user_id: mentorshipOrder.user_id, name: "mentorship_payment_confirmed", props: { cohort: mentorshipOrder.cohort_id, order: mentorshipOrder.id } });
        const { notifyMentorshipUsers } = await import("@/lib/mentorship/store");
        await notifyMentorshipUsers([mentorshipOrder.user_id], {
          kind: "system", title: "Sua vaga na Mentoria QA Lab está confirmada",
          body: "Pagamento confirmado. Faça o diagnóstico para começar sua jornada.", href: "/mentoria/diagnostico",
        });
      }
      return NextResponse.json({ ok: true });
    }
    const { data: purchase } = await admin.from("billing_purchases").select("id,user_id,status").eq("id", purchaseId).maybeSingle();
    if (!purchase) return NextResponse.json({ ok: true });
    if (typeof payment.transaction_amount !== "number" || !Number.isFinite(payment.transaction_amount) || !payment.currency_id) throw new Error("Pagamento sem valor ou moeda para conciliação.");
    const { error: purchaseUpdateError } = await admin.rpc("reconcile_billing_purchase", {
      target_purchase_id: purchase.id,
      target_payment_id: String(payment.id),
      target_payment_status: payment.status,
      target_amount: payment.transaction_amount,
      target_currency: payment.currency_id,
    });
    if (purchaseUpdateError) throw new Error(purchaseUpdateError.message);
    if (purchase.status !== "approved" && payment.status === "approved") {
      await admin.from("activity_events").insert({ user_id: purchase.user_id, name: "pro_payment_confirmed", props: { purchase: purchase.id } });
    }
    return NextResponse.json({ ok: true });
  } catch {
    // O Mercado Pago volta a tentar respostas não-2xx; responda 500 para não
    // perder um pagamento por indisponibilidade transitória da nossa API.
    return NextResponse.json({ error: "Falha ao processar pagamento." }, { status: 500 });
  }
}
