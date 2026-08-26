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
    const { data: purchase } = await admin.from("billing_purchases").select("id,user_id,plan").eq("id", purchaseId).maybeSingle();
    if (!purchase) return NextResponse.json({ ok: true });
    await admin.from("billing_purchases").update({ status: payment.status, mercado_pago_payment_id: String(payment.id), paid_at: payment.status === "approved" ? new Date().toISOString() : null }).eq("id", purchase.id);
    if (payment.status === "approved") await admin.from("profiles").update({ plan: purchase.plan }).eq("id", purchase.user_id);
    return NextResponse.json({ ok: true });
  } catch {
    // O Mercado Pago volta a tentar respostas não-2xx; responda 500 para não
    // perder um pagamento por indisponibilidade transitória da nossa API.
    return NextResponse.json({ error: "Falha ao processar pagamento." }, { status: 500 });
  }
}
