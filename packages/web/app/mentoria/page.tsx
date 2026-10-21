import Link from "next/link";
import { ArrowRight, BookOpenText, CheckCircle2, ClipboardCheck, FlaskConical, MessageSquareText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JoinWaitlist } from "@/components/mentorship/admission-actions";
import { getPublicMentorshipOffers, isOfferOpen } from "@/lib/mentorship/admissions";
import { getSessionUser } from "@/lib/product/store";
import { mentorshipPathV2 } from "@/lib/mentorship/path-v2";

export const metadata = { title: "Mentoria QA Lab", description: "Aprenda QA com prática orientada, entregas aplicadas e feedback de mentor." };

export default async function MentorshipLandingPage() {
  const [offers, user] = await Promise.all([getPublicMentorshipOffers(), getSessionUser()]);
  const openOffer = offers.find(isOfferOpen);
  const interestCohort = offers[0]?.cohort_id ?? null;
  return <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
    <section className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
      <div>
        <p className="text-sm font-bold text-mint">Mentoria QA Lab</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-[-.05em] text-off-white sm:text-7xl">Pratique QA com problemas que pedem investigação de verdade.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#AAB2BC]">Aprenda um conceito, investigue um produto, apresente sua evidência e receba feedback de mentor para avançar.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {openOffer ? <Button asChild size="lg"><Link href={`/mentoria/inscricao?offer=${openOffer.id}`}>Ver turma e condições <ArrowRight className="size-4" /></Link></Button> : <Button asChild size="lg" variant="outline"><Link href="/mentoria/inscricao">Ver inscrição e lista de interesse <ArrowRight className="size-4" /></Link></Button>}
          <Button asChild size="lg" variant="outline"><Link href="/conteudo">Explorar conteúdo</Link></Button>
        </div>
      </div>
      <aside className="border-l-2 border-mint/60 pl-6">
        <p className="text-sm font-semibold text-mint">Ao longo da jornada</p>
        <ul className="mt-5 grid gap-3 text-sm leading-6 text-[#D9DEE4]">{["Missões com critérios claros", "Prática aplicada em produtos", "Revisão humana das entregas", "Cases para apresentar seu raciocínio"].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1 size-4 shrink-0 text-mint" />{item}</li>)}</ul>
      </aside>
    </section>

    <section id="turmas" className="py-14" aria-labelledby="cohort-title">
      <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-semibold text-mint">Próximo passo</p><h2 id="cohort-title" className="mt-2 text-3xl font-black text-off-white">Encontre sua turma</h2></div><p className="max-w-xl text-sm leading-6 text-[#AAB2BC]">Datas, valores e vagas aparecem aqui quando uma turma estiver publicada. Sua matrícula só fica ativa depois da confirmação.</p></div>
      {openOffer ? <div className="mt-7 border border-mint/30 bg-mint/[.04] p-6 sm:p-8"><p className="text-xs font-bold text-mint">Inscrições abertas</p><h3 className="mt-3 text-2xl font-black text-off-white">{openOffer.title}</h3><p className="mt-3 max-w-2xl text-sm leading-7 text-[#C8CFD7]">{openOffer.summary}</p><p className="mt-5 text-lg font-black text-off-white">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: openOffer.currency }).format(openOffer.price)}</p><p className="mt-2 text-sm text-[#AAB2BC]">{openOffer.cohort.name} · início {new Date(`${openOffer.cohort.starts_on}T12:00:00`).toLocaleDateString("pt-BR")} · {Math.max(0, openOffer.cohort.capacity - openOffer.occupied)} vagas disponíveis</p><Button asChild className="mt-5"><Link href={`/mentoria/inscricao?offer=${openOffer.id}`}>Ver condições e se inscrever <ArrowRight className="size-4" /></Link></Button></div> : offers.length === 0 ? <div className="mt-7 grid gap-6 border-y border-white/10 py-8 md:grid-cols-[1fr_360px] md:items-center"><div><h3 className="text-xl font-black text-off-white">Nenhuma turma com inscrição aberta</h3><p className="mt-3 max-w-2xl text-sm leading-7 text-[#AAB2BC]">Entre na lista de interesse e receba uma mensagem quando a equipe publicar uma nova turma.</p></div><JoinWaitlist cohortId={interestCohort} signedIn={Boolean(user)} /></div> : <p className="mt-7 border-y border-white/10 py-6 text-sm leading-6 text-[#AAB2BC]">As inscrições para as turmas publicadas estão fechadas. Escolha uma turma abaixo para entrar na lista de interesse.</p>}
      {offers.filter((offer) => !isOfferOpen(offer)).map((offer) => <article key={offer.id} className="mt-5 flex flex-wrap items-center justify-between gap-4 border border-white/10 p-5"><div><p className="text-xs font-semibold text-[#8B949E]">Inscrições fechadas</p><h3 className="mt-2 font-bold text-off-white">{offer.cohort.name}</h3><p className="mt-1 text-sm text-[#AAB2BC]">{offer.occupied >= offer.cohort.capacity ? "Turma completa" : `Início ${new Date(`${offer.cohort.starts_on}T12:00:00`).toLocaleDateString("pt-BR")}`}</p></div><JoinWaitlist cohortId={offer.cohort_id} signedIn={Boolean(user)} /></article>)}
    </section>

    <section className="border-y border-white/10 py-14" aria-labelledby="method-title"><h2 id="method-title" className="text-3xl font-black text-off-white">Como a prática vira aprendizado</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#AAB2BC]">Você leva uma pergunta para o produto, registra o que observou e explica a decisão. O mentor responde à evidência e orienta a próxima tentativa.</p><ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><MethodStep icon={<BookOpenText className="size-5" />} title="Entender" text="Leia o conceito e descubra qual problema ele ajuda a resolver." /><MethodStep icon={<FlaskConical className="size-5" />} title="Investigar" text="Explore uma jornada e prepare os dados que respondem sua pergunta." /><MethodStep icon={<ClipboardCheck className="size-5" />} title="Evidenciar" text="Registre risco, cenário, resultado e limites da investigação." /><MethodStep icon={<MessageSquareText className="size-5" />} title="Evoluir" text="Receba feedback, revise sua entrega e aplique a próxima missão." /></ol></section>

    <section className="grid gap-8 py-14 md:grid-cols-[1fr_1fr]">
      <div><p className="text-sm font-semibold text-mint">Percurso de aprendizagem</p><h2 className="mt-2 text-3xl font-black text-off-white">Sete módulos, da análise à entrega</h2><p className="mt-4 text-sm leading-7 text-[#AAB2BC]">As aulas conectam fundamentos, teste exploratório, API, automação, CI/CD, qualidade e projeto integrado. O diagnóstico ajuda a escolher a profundidade das primeiras entregas.</p><Link href="/conteudo" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-mint hover:underline">Explorar os módulos <ArrowRight className="size-4" /></Link></div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 border-l border-white/10 pl-6">{mentorshipPathV2.map((module, index) => <p key={module.id} className="text-sm leading-6 text-[#D9DEE4]"><span className="mr-2 text-xs font-bold text-mint">{String(index + 1).padStart(2,"0")}</span>{module.title}</p>)}</div>
    </section>
    <section className="flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-8"><div><h2 className="text-xl font-black text-off-white">Um encontro ao vivo por semana</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#AAB2BC]">Conversas sobre comunicação, autonomia, colaboração e apresentação de evidências.</p></div><Video className="size-6 text-mint" aria-hidden="true" /></section>
  </main>;
}

function MethodStep({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <li className="border-t-2 border-mint/60 pt-4"><span className="text-mint" aria-hidden="true">{icon}</span><h3 className="mt-3 font-bold text-off-white">{title}</h3><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{text}</p></li>;
}
