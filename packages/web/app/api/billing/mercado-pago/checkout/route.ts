import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBillingOffer } from "@/lib/billing/catalog";
import { createPreference, mercadoPagoConfigured } from "@/lib/billing/mercado-pago";
import { hasServiceRole } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const offer = getBillingOffer(typeof payload.offerId === "string" ? payload.offerId : null);
  if (!offer) return NextResponse.json({ error: "Oferta inválida." }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Faça login para continuar." }, { status: 401 });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl || !mercadoPagoConfigured() || !hasServiceRole()) return NextResponse.json({ error: "O checkout ainda não foi configurado." }, { status: 503 });

  const { data: purchase, error: purchaseError } = await supabase.from("billing_purchases").insert({ user_id: user.id, offer_id: offer.id, plan: offer.plan, amount: offer.price, currency: "BRL", status: "pending" }).select("id").single();
  if (purchaseError || !purchase) return NextResponse.json({ error: "Não foi possível iniciar sua compra." }, { status: 500 });
  try {
    const preference = await createPreference({ title: offer.title, description: offer.description, price: offer.price, externalReference: purchase.id, payerEmail: user.email, siteUrl });
    return NextResponse.json({ checkoutUrl: preference.initPoint });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível iniciar o checkout." }, { status: 502 });
  }
}
