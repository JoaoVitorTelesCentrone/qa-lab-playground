import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { billingOffers, hasPaidAccess } from "@/lib/billing/catalog";
import { labs } from "@/lib/playground/catalog";
import { fullRoadmapChallenges } from "@/lib/roadmap/full-catalog.generated";
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

  // Os números vêm do catálogo: a página nunca promete mais (nem menos) do que existe.
  const releasedLabs = labs.filter((lab) => lab.status === "liberado").length;
  const roadmapCount = fullRoadmapChallenges.length;

  // Só o que o código de fato libera em cada plano. O resto da oferta (os
  // destaques abaixo do preço) vem do catálogo de cobrança.
  const free = [
    `${releasedLabs} Labs com missão, roteiro e entrega de evidência`,
    "Ambientes de prática com falhas plantadas",
    "Conteúdo, trilhas, blog e referências",
    "Portfólio público com os cases que você escolher publicar",
    "Um board de testes pessoal",
  ];
  const pro = [
    `Roadmap com ${roadmapCount} desafios práticos, do básico ao avançado`,
    "Boards de teste adicionais para organizar seus projetos",
    ...offer.highlights,
  ];

  const faq = [
    { q: "Preciso do Pro para começar?", a: `Não. Os ${releasedLabs} Labs, os ambientes de prática e o conteúdo são gratuitos. O Pro é para quem quer ir além com o roadmap completo.` },
    { q: "É uma assinatura?", a: "Não. É um pagamento único, com acesso vitalício ao núcleo Pro já lançado. Não há cobrança recorrente." },
    { q: "Como funciona o pagamento?", a: "O pagamento é feito pelo Mercado Pago, por PIX ou cartão. O acesso é liberado assim que o Mercado Pago confirma o pagamento." },
    { q: "A mentoria está incluída?", a: "Não. A mentoria é um programa separado, com turma, encontros ao vivo e feedback de mentor." },
  ];

  return <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
    <header className="max-w-3xl">
      <p className="text-sm font-semibold text-primary">QA Lab Pro</p>
      <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-6xl">Pare de só consumir QA. Comece a provar que sabe fazer.</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Comece de graça com os Labs. Quando quiser mais prática, o Pro libera o roadmap completo de desafios.</p>
    </header>

    <section aria-labelledby="comparacao-title" className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
      <h2 id="comparacao-title" className="sr-only">O que cada plano inclui</h2>
      <div className="bg-background p-6 sm:p-8">
        <h3 className="text-xl font-bold">Grátis</h3>
        <p className="mt-1 text-sm text-muted-foreground">Para começar a praticar hoje.</p>
        <p className="mt-6 text-3xl font-extrabold tracking-[-0.03em]">R$ 0</p>
        <ul className="mt-6 grid gap-3">{free.map((item) => <li key={item} className="flex gap-3 text-sm leading-6"><Check className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />{item}</li>)}</ul>
        <Link href="/labs" className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-sm border border-border px-5 text-sm font-bold hover:border-primary">Começar pelos Labs</Link>
      </div>
      <div className="bg-card p-6 sm:p-8">
        <h3 className="text-xl font-bold">Pro</h3>
        <p className="mt-1 text-sm text-muted-foreground">{offer.description}</p>
        <p className="mt-6 flex items-baseline gap-2"><span className="text-3xl font-extrabold tracking-[-0.03em] text-primary">{offer.displayPrice}</span><span className="text-sm text-muted-foreground">pagamento único</span></p>
        <p className="mt-6 text-sm font-semibold">Tudo do Grátis, mais:</p>
        <ul className="mt-3 grid gap-3">{pro.map((item) => <li key={item} className="flex gap-3 text-sm leading-6"><Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />{item}</li>)}</ul>
        <div className="mt-8">{paid ? <Link href="/trilhas/roadmap" className="inline-flex h-12 w-full items-center justify-center rounded-sm bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90">Abrir os {roadmapCount} desafios do roadmap</Link> : <CheckoutButton offerId={offer.id} signedIn={signedIn} />}</div>
        <p className="mt-4 flex gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden="true" />Pagamento seguro via Mercado Pago, por PIX ou cartão. A liberação acontece após a confirmação do pagamento.</p>
      </div>
    </section>

    <section aria-labelledby="faq-title" className="mt-16 max-w-3xl">
      <h2 id="faq-title" className="text-2xl font-bold tracking-[-0.02em]">Perguntas frequentes</h2>
      <div className="mt-5 divide-y divide-border border-y border-border">
        {faq.map((item) => <details key={item.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold">{item.q}<span aria-hidden="true" className="text-xl text-muted-foreground transition-transform group-open:rotate-45">+</span></summary>
          <p className="pb-5 text-sm leading-6 text-muted-foreground">{item.a}</p>
        </details>)}
      </div>
    </section>
  </main>;
}
