import { createPreference, mercadoPagoMentorshipConfigured } from "@/lib/billing/mercado-pago";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { fail, ok, readJson } from "@/lib/product/api";
import { trackEvent } from "@/lib/product/store";
import { normalizeWaitlistAttribution } from "@/lib/mentorship/waitlist-request";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return fail("Entre ou crie uma conta para continuar.", 401);
  const body = await readJson(request);
  if (typeof body.offerId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.offerId) || !Number.isInteger(body.offerVersion) || typeof body.acceptedTerms !== "boolean" || !body.acceptedTerms) {
    return fail("Confira e aceite as condições da turma para continuar.", 422);
  }
  const campaign = body.attribution && typeof body.attribution === "object" && !Array.isArray(body.attribution) ? body.attribution as Record<string, unknown> : {};
  const attribution = {
    utm_source: normalizeWaitlistAttribution(campaign.utm_source),
    utm_medium: normalizeWaitlistAttribution(campaign.utm_medium),
    utm_campaign: normalizeWaitlistAttribution(campaign.utm_campaign),
  };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl || !mercadoPagoMentorshipConfigured() || !hasServiceRole()) return fail("As inscrições pagas ainda não estão configuradas.", 503);
  const admin = createAdminClient();
  const { data: offer, error: offerError } = await admin.from("mentorship_offers")
    .select("id,cohort_id,offer_code,title,summary,price,currency,version,published,cohort:mentorship_cohorts!inner(status)")
    .eq("id", body.offerId).eq("published", true).maybeSingle();
  if (offerError || !offer || !offer.published) return fail("Essa oferta não está disponível.", 404);
  if (offer.version !== body.offerVersion) return fail("As condições desta turma foram atualizadas. Revise e aceite a versão atual para continuar.", 409);
  const cohort = Array.isArray(offer.cohort) ? offer.cohort[0] : offer.cohort;
  if (cohort?.status !== "enrollment") return fail("As inscrições para essa turma estão fechadas.", 409);

  const { data: order, error } = await admin.rpc("reserve_mentorship_order", { target_offer_id: offer.id, target_user_id: user.id, target_offer_version: body.offerVersion });
  if (error || !order) {
    const reason = error?.message ?? "";
    const message = reason.includes("COHORT_FULL") ? "As vagas dessa turma foram preenchidas. Entre na lista de interesse." : reason.includes("ALREADY_ENROLLED") ? "Sua conta já tem matrícula nessa turma." : reason.includes("OFFER_VERSION_CHANGED") ? "As condições desta turma foram atualizadas. Revise e aceite a versão atual para continuar." : reason.includes("ENROLLMENT_NOT_OPEN") || reason.includes("ENROLLMENT_CLOSED") ? "As inscrições para essa turma estão fechadas." : "Não foi possível reservar sua vaga agora.";
    return fail(message, reason.includes("COHORT_FULL") || reason.includes("ALREADY_ENROLLED") || reason.includes("OFFER_VERSION_CHANGED") || reason.includes("ENROLLMENT_CLOSED") ? 409 : 503);
  }
  if (order.status === "approved" && order.enrollment_id) return ok({ checkoutUrl: new URL("/mentoria/app", siteUrl).toString(), enrolled: true });
  if (Object.values(attribution).some(Boolean)) {
    const { error: attributionError } = await admin.from("mentorship_orders").update({
      utm_source: order.utm_source ?? attribution.utm_source,
      utm_medium: order.utm_medium ?? attribution.utm_medium,
      utm_campaign: order.utm_campaign ?? attribution.utm_campaign,
    }).eq("id", order.id).eq("status", "pending");
    if (attributionError) return fail("Não foi possível registrar a origem da inscrição.", 503);
  }
  if (order.checkout_url && order.mercado_pago_preference_id) return ok({ checkoutUrl: order.checkout_url, orderId: order.id, expiresAt: order.reservation_expires_at });

  try {
    const expiry = new Date(order.reservation_expires_at).toISOString();
    const preference = await createPreference({
      itemId: `mentoria-${offer.offer_code}`,
      title: offer.title,
      description: offer.summary || offer.title,
      price: Number(order.amount),
      externalReference: order.id,
      payerEmail: user.email,
      siteUrl,
      successUrl: `${siteUrl.replace(/\/$/, "")}/mentoria/inscricao/status?order=${encodeURIComponent(order.id)}`,
      failureUrl: `${siteUrl.replace(/\/$/, "")}/mentoria/inscricao/status?order=${encodeURIComponent(order.id)}`,
      pendingUrl: `${siteUrl.replace(/\/$/, "")}/mentoria/inscricao/status?order=${encodeURIComponent(order.id)}`,
      expiresAt: expiry,
    });
    const { error: saveError } = await admin.from("mentorship_orders").update({ mercado_pago_preference_id: preference.id, checkout_url: preference.initPoint }).eq("id", order.id).eq("status", "pending");
    if (saveError) throw new Error("Não foi possível salvar o checkout da reserva.");
    await trackEvent(user.id, "mentorship_checkout_started", { cohort: offer.cohort_id, offer: offer.id, ...attribution });
    return ok({ checkoutUrl: preference.initPoint, orderId: order.id, expiresAt: expiry }, 201);
  } catch (cause) {
    return fail(cause instanceof Error ? cause.message : "Não foi possível abrir o checkout.", 502);
  }
}
