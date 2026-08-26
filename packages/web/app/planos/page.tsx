import Link from "next/link";
import { CheckCircle2, FlaskConical, ShieldCheck } from "lucide-react";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { billingOffers, hasPaidAccess } from "@/lib/billing/catalog";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "QA Lab Pro", description: "Pratique QA em ambientes reais e construa evidências de competência." };

export default async function PlansPage() {
  let signedIn = false; let paid = false;
  const checkoutReady = Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN && process.env.MERCADO_PAGO_WEBHOOK_SECRET && process.env.SUPABASE_SERVICE_ROLE_KEY);
  // Sem checkout configurado, a área Pro fica aberta para revisão do produto.
  if (!checkoutReady) paid = true;
  if (isSupabaseConfigured()) { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (user) { signedIn = true; const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(); paid = !checkoutReady || hasPaidAccess(data?.plan); } }
  const offer = billingOffers[0];
  return <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8"><section className="mx-auto max-w-3xl text-center"><span className="inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint/[.06] px-3 py-1 text-xs font-bold text-mint"><FlaskConical className="size-3.5" /> QA Lab Pro</span><h1 className="mt-6 text-4xl font-black leading-tight text-off-white sm:text-6xl">Pare de só consumir QA. Comece a provar que sabe fazer.</h1><p className="mt-5 text-base leading-8 text-[#AAB2BC]">Ambientes de prática, bugs plantados, missões e evidências para transformar estudo em repertório profissional.</p></section><section className="mx-auto mt-12 max-w-xl rounded-2xl border border-neon/30 bg-[#171B21] p-7 shadow-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-neon">Oferta de lançamento</p><h2 className="mt-3 text-3xl font-black text-off-white">{offer.title}</h2><p className="mt-3 text-sm leading-6 text-[#AAB2BC]">{offer.description}</p><p className="mt-7 text-5xl font-black text-neon">{offer.displayPrice}</p><p className="mt-2 text-sm text-[#AAB2BC]">Pagamento seguro via Mercado Pago · PIX e cartão</p><div className="mt-7 grid gap-3">{offer.highlights.map((item) => <p key={item} className="flex gap-3 text-sm leading-6 text-[#D9DEE4]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-mint" />{item}</p>)}</div><div className="mt-8">{paid ? <Link href="/trilhas/roadmap" className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-mint px-5 text-sm font-black text-[#101319]">Abrir os 518 desafios</Link> : <CheckoutButton offerId={offer.id} signedIn={signedIn} />}</div><p className="mt-5 flex gap-2 text-xs leading-5 text-[#8B949E]"><ShieldCheck className="size-4 shrink-0 text-mint" />A liberação é feita somente após a confirmação do pagamento pelo Mercado Pago.</p></section></main>;
}
