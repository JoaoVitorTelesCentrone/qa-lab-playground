import Link from "next/link";
import { ArrowRight, Check, ChevronDown, ExternalLink } from "lucide-react";
import { MentorshipNav } from "@/components/mentorship/mentorship-nav";
import { mentorshipWeeks } from "@/lib/mentorship/catalog";
import { brotoSpaceSite } from "@/lib/mentorship/brotospace-track";
import { getMentorshipWeekContent } from "@/lib/mentorship/curriculum";
import { mentorshipRoadmap, qualityDeepDives, qualityDimensions } from "@/lib/mentorship/roadmap";
import { getMentorshipDashboard } from "@/lib/mentorship/store";
import type { MentorshipSubmission } from "@/lib/mentorship/types";
import { getSessionUser } from "@/lib/product/store";

export const metadata = {
  title: "Roadmap QA Lab: fundamentos e Megazord 2026",
  description: "Trilha integrada de QA com fundamentos, engenharia, dados, automação e caminhos de especialização.",
};
export const dynamic = "force-dynamic";

export default async function MentorshipContentPage() {
  const user = await getSessionUser();
  const dashboard = user ? await getMentorshipDashboard(user.id) : null;
  const latestByAssignment = new Map<string, MentorshipSubmission>();
  for (const submission of dashboard?.submissions ?? []) {
    if (!latestByAssignment.has(submission.assignmentKey)) latestByAssignment.set(submission.assignmentKey, submission);
  }
  const approvedWeeks = mentorshipWeeks.filter(
    (week) => latestByAssignment.get(week.assignment.key)?.status === "approved",
  ).length;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <MentorshipNav current="/mentoria/conteudo" />
      <header className="max-w-3xl">
        <h1 className="text-4xl font-black tracking-[-.03em] text-off-white sm:text-5xl">Roadmap QA Lab</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#C8CFD7] sm:text-lg">Uma trilha de 12 semanas que integra o RoadMapQA e o Megazord 2026. Aprenda fundamentos, pratique engenharia de qualidade e explore aprofundamentos por especialidade.</p>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#AAB2BC]">Os aprofundamentos Megazord ficam recolhidos na terceira aula de cada semana; tópicos avançados estão identificados como especialização.</p>
      </header>

      <nav aria-label="Fases do roadmap" className="mt-8 grid border-y border-white/15 sm:grid-cols-2 lg:grid-cols-3">
        {mentorshipRoadmap.map((stage) => <a key={stage.id} href={`#${stage.id}`} className="group flex min-h-20 items-center justify-between gap-4 border-b border-white/10 px-4 py-4 text-sm font-bold text-off-white last:border-b-0 hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0">
          <span>{stage.title}</span><span className="shrink-0 text-xs font-medium tabular-nums text-[#AAB2BC]">Semanas {stage.weeks[0]}–{stage.weeks[1]}</span>
        </a>)}
      </nav>

      {dashboard ? (
        <section aria-label="Seu progresso" className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-white/15 py-5">
          <div>
            <p className="font-semibold text-off-white">{approvedWeeks} de 12 entregas aprovadas</p>
            <p className="mt-1 text-sm text-[#C8CFD7]">{dashboard.enrollment.status === "paused" ? "Sua matrícula está pausada." : `Você está na semana ${dashboard.currentWeek}.`}</p>
          </div>
          <Link href={dashboard.enrollment.status === "paused" ? "/mentoria/app" : `/mentoria/conteudo/${dashboard.currentWeek}`} className="inline-flex min-h-11 items-center gap-2 bg-mint px-4 py-2 text-sm font-bold text-[#101319] hover:bg-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-off-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#101319]">
            {dashboard.enrollment.status === "paused" ? "Ver minha matrícula" : `Continuar semana ${dashboard.currentWeek}`}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </section>
      ) : (
        <p className="mt-8 border-y border-white/15 py-4 text-sm leading-6 text-[#C8CFD7]">Você pode explorar todas as semanas. Para salvar seu progresso, <Link href="/login?next=/mentoria/app" className="font-semibold text-mint underline underline-offset-4 hover:text-neon">entre na mentoria</Link>.</p>
      )}

      <div className="mt-10 space-y-12 sm:mt-14 sm:space-y-16">
        {mentorshipRoadmap.map((stage) => (
          <section key={stage.id} id={stage.id} aria-labelledby={`${stage.id}-title`} className="scroll-mt-28">
            <div className="border-b border-white/25 pb-5">
              <h2 id={`${stage.id}-title`} className="text-xl font-bold text-off-white sm:text-2xl">{stage.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#C8CFD7]">{stage.summary}</p>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-off-white"><span className="font-bold text-mint">Entrega da fase:</span> {stage.outcome}</p>
              <ul aria-label="Competências da fase" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5 text-[#AAB2BC]">{stage.competencies.map((competency) => <li key={competency} className="before:mr-2 before:text-mint before:content-['•']">{competency}</li>)}</ul>
            </div>
            <ol className="divide-y divide-white/15">
              {stage.weeks.map((number) => {
                const week = mentorshipWeeks[number - 1];
                const content = getMentorshipWeekContent(number);
                const submission = latestByAssignment.get(week.assignment.key);
                const approved = submission?.status === "approved";
                const current = dashboard?.currentWeek === number && !approved;
                return (
                  <li key={number}>
                    <a href={`/mentoria/conteudo/${number}`} aria-label={`Estudar semana ${number}: ${week.title}`} className={`group block py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-[#101319] ${current ? "-mx-4 bg-mint/[.06] px-4" : ""}`}>
                      <span className="flex items-start gap-4 sm:gap-5">
                        <span className={`flex size-11 shrink-0 items-center justify-center border text-sm font-bold tabular-nums ${approved ? "border-mint bg-mint text-[#101319]" : current ? "border-mint text-mint" : "border-white/20 text-[#C8CFD7]"}`}>
                          {approved ? <Check aria-hidden="true" className="size-5" /> : String(number).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="text-lg font-bold text-off-white group-hover:text-mint sm:text-xl">{week.title}</span>
                          {current && <span className="text-xs font-semibold text-mint">Semana atual</span>}
                          {approved && <span className="text-xs font-semibold text-mint">Concluída</span>}
                          </span>
                          <span className="mt-2 block max-w-2xl text-sm leading-6 text-[#C8CFD7]">{content?.promise ?? week.assignment.objective}</span>
                        </span>
                        <ArrowRight aria-hidden="true" className="mt-2 size-5 shrink-0 text-mint transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="mt-4 block text-sm leading-6 text-[#AAB2BC] sm:ml-[3.75rem]">{week.lessons.length} aulas · quiz · exemplo · desafio <span aria-hidden="true" className="mx-2 text-white/30">|</span> Prática: {week.assignment.practice.environment}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      <details className="group mt-14 border-t border-white/20 pt-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint [&::-webkit-details-marker]:hidden">Materiais complementares<ChevronDown aria-hidden="true" className="size-5 text-mint transition-transform group-open:rotate-180" /></summary>
        <div className="mt-7 space-y-10 text-sm leading-6 text-[#C8CFD7]">
          <section>
            <h2 className="text-lg font-bold text-off-white">Projeto das 12 semanas: Broto Space</h2>
            <p className="mt-2 max-w-3xl">Você vai investigar o Broto Space ao longo da mentoria. Confira as páginas públicas antes de começar cada missão.</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">{brotoSpaceSite.publicSurfaces.map((surface) => <a key={surface.href} href={surface.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-mint underline underline-offset-4 hover:text-neon">{surface.title}<ExternalLink aria-hidden="true" className="size-3" /></a>)}</div>
            <p className="mt-3 text-xs text-[#C8CFD7]">Páginas observadas em {brotoSpaceSite.observedOn}. Confirme o comportamento atual ao executar as missões; fluxos privados exigem conta de teste, e carga permanece no lab local.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-off-white">Outras dimensões da qualidade</h2>
            <ul className="mt-3 space-y-3">{qualityDimensions.map((dimension) => <li key={dimension.name}><strong className="text-off-white">{dimension.name}:</strong> {dimension.question} <Link href={dimension.href} className="font-semibold text-mint underline underline-offset-4 hover:text-neon">{dimension.where}</Link></li>)}</ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-off-white">Labs para aprofundar</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">{qualityDeepDives.map((resource) => <li key={resource.title}><Link href={resource.href} className="font-semibold text-mint underline underline-offset-4 hover:text-neon">{resource.title}</Link><p>{resource.description}</p></li>)}</ul>
          </section>
        </div>
      </details>
    </main>
  );
}
