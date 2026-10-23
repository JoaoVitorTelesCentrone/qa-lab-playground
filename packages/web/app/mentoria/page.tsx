import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bug, ClipboardCheck, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MentorshipLabVisual } from "./mentorship-lab-visual";
import { BrotoInvestigation } from "./broto-investigation";
import { getPublicMentorshipOffers, isOfferOpen } from "@/lib/mentorship/admissions";
import { brotoSpaceSite } from "@/lib/mentorship/brotospace-track";
import { normalizeWaitlistAttribution } from "@/lib/mentorship/waitlist-request";
import "./mentoria.css";

export const metadata = {
  title: "Mentoria QA Lab | Transforme prática em evidência",
  description: "Investigue o Broto Space, receba feedback de mentor e construa um case que mostra seu raciocínio.",
};

const steps = [
  { icon: SearchCheck, title: "Investigue", detail: "Encontre o risco" },
  { icon: Bug, title: "Teste", detail: "Registre a evidência" },
  { icon: ClipboardCheck, title: "Apresente", detail: "Defenda a decisão" },
] as const;

export default async function MentorshipLandingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const waitlistQuery = new URLSearchParams();
  for (const [key, value] of [["utm_source", query.utm_source], ["utm_medium", query.utm_medium], ["utm_campaign", query.utm_campaign]] as const) {
    const normalized = normalizeWaitlistAttribution(first(value));
    if (normalized) waitlistQuery.set(key, normalized);
  }
  const waitlistHref = `/mentoria/lista-de-interesse${waitlistQuery.size ? `?${waitlistQuery}` : ""}`;
  const offers = await getPublicMentorshipOffers();
  const openOffer = offers.find(isOfferOpen);
  const enrollmentHref = openOffer ? `/mentoria/inscricao?offer=${encodeURIComponent(openOffer.id)}${waitlistQuery.size ? `&${waitlistQuery}` : ""}` : waitlistHref;

  return <main className="mentoria-page">
    <section className="mentoria-hero" aria-labelledby="mentoria-title">
      <div className="mentoria-hero-main">
      <div className="mentoria-hero-content">
        <h1 id="mentoria-title">Chegue à próxima entrevista com <em>algo para mostrar.</em></h1>
        <p>Comece no Broto Space, receba feedback humano e construa um case que mostra como você pensa.</p>
        <div className="mentoria-actions">
          <Button asChild size="lg"><Link href={enrollmentHref}>{openOffer ? "Ver turma aberta" : "Entrar na lista de interesse"}<ArrowRight aria-hidden="true" className="size-4" /></Link></Button>
          <Link className="mentoria-text-link" href="#metodo">Veja como funciona <ArrowUpRight aria-hidden="true" size={16} /></Link>
        </div>
      </div>
      <MentorshipLabVisual />
      </div>
      <div className="mentoria-hero-foot" aria-label="Formato da mentoria"><span>12 semanas de prática</span><span>Feedback de mentor</span><span>1 encontro ao vivo por semana</span></div>
    </section>

    <section id="metodo" className="mentoria-method" aria-labelledby="method-title">
      <div className="mentoria-section-head">
        <h2 id="method-title">O que vai para o seu case?</h2>
        <p>Seu raciocínio, do problema à decisão.</p>
      </div>
      <ol className="mentoria-steps">
        {steps.map((step) => <li key={step.title}>
          <span className="mentoria-step-icon"><step.icon aria-hidden="true" size={25} strokeWidth={1.8} /></span>
          <strong>{step.title}</strong>
          <span>{step.detail}</span>
        </li>)}
      </ol>
      <div className="mentoria-outcome">
        <figure className="mentoria-case-visual">
          <Image src="/mentoria/qa-lab-bug-report.webp" alt="Tela do QA Lab com campos para registrar um bug report e descrever como reproduzir o problema" width={849} height={680} sizes="(max-width: 700px) 100vw, 48vw" />
          <figcaption>Exemplo do Lab aberto: registro de uma descoberta no QA Lab.</figcaption>
        </figure>
        <div className="mentoria-outcome-copy">
          <h3>Seu trabalho fica visível.</h3>
          <p>Do Broto Space ao QA Lab: investigue jornadas, registre evidências e transforme suas decisões em um case revisado por mentor.</p>
          <Link href="/conteudo" className="mentoria-text-link">Explorar conteúdo aberto <ArrowUpRight aria-hidden="true" size={16} /></Link>
        </div>
      </div>
    </section>

    <section className="mentoria-real" aria-labelledby="real-title">
      <div className="mentoria-real-copy">
        <h2 id="real-title">Aprenda em um sistema real, com quem vive a área.</h2>
        <p>Explore três superfícies do Broto Space. Em cada uma, uma pergunta de QA vira evidência para discutir com o mentor.</p>
        <a href={brotoSpaceSite.url} target="_blank" rel="noreferrer" className="mentoria-real-link">Conhecer o Broto Space <ArrowUpRight aria-hidden="true" size={17} /></a>
      </div>
      <BrotoInvestigation />
    </section>

    <section id="turmas" className="mentoria-cohort" aria-labelledby="cohort-title">
      <div className="mentoria-cohort-heading">
        <h2 id="cohort-title">Seu próximo passo.</h2>
        <p>{openOffer ? "Conheça a turma e veja as condições para participar." : "Entre na lista e saiba quando a próxima turma abrir."}</p>
      </div>
      <div className="mentoria-cohort-content">
        {openOffer ? <article className="mentoria-offer">
          <span className="mentoria-status"><span /> Inscrições abertas</span>
          <h3>{openOffer.title}</h3>
          <p>{openOffer.summary}</p>
          <div className="mentoria-offer-details"><strong>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: openOffer.currency }).format(openOffer.price)}</strong><span>{openOffer.cohort.name} · início {new Date(`${openOffer.cohort.starts_on}T12:00:00`).toLocaleDateString("pt-BR")} · {Math.max(0, openOffer.cohort.capacity - openOffer.occupied)} vagas</span></div>
          <Button asChild><Link href={enrollmentHref}>Ver condições e se inscrever <ArrowRight aria-hidden="true" className="size-4" /></Link></Button>
        </article> : offers.length === 0 ? <div className="mentoria-waitlist"><span className="mentoria-status"><span /> Próxima turma</span><h3>Inscrições em breve.</h3><p>Datas, vagas e valores serão divulgados aqui.</p><Button asChild className="mt-6"><Link href={waitlistHref}>Entrar na lista <ArrowRight aria-hidden="true" className="size-4" /></Link></Button></div> : <p className="mentoria-closed">As inscrições das turmas publicadas estão fechadas. <Link href={waitlistHref} className="font-bold text-mint underline">Entre na lista</Link> para receber novidades.</p>}
        {offers.filter((offer) => !isOfferOpen(offer)).map((offer) => <article key={offer.id} className="mentoria-past-offer"><h3>{offer.cohort.name}</h3><p>{offer.occupied >= offer.cohort.capacity ? "Turma completa" : "Inscrições fechadas"}</p></article>)}
      </div>
    </section>
  </main>;
}
