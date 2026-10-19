import Link from "next/link";
import { ArrowRight, Check, ChevronDown, ExternalLink } from "lucide-react";
import { mentorshipWeeks } from "@/lib/mentorship/catalog";
import { brotoSpaceSite } from "@/lib/mentorship/brotospace-track";
import { mentorshipThemes, getThemeProgress, getThemeUnits } from "@/lib/mentorship/themes";
import { qualityDeepDives, qualityDimensions } from "@/lib/mentorship/roadmap";
import { getMentorshipDashboard } from "@/lib/mentorship/store";
import type { MentorshipSubmission } from "@/lib/mentorship/types";
import { getSessionUser } from "@/lib/product/store";

export const metadata = {
  title: "Conteúdo QA Lab",
  description: "Estude qualidade de software por temas, com aulas, missões práticas, exemplos e checkpoints.",
};
export const dynamic = "force-dynamic";

export default async function MentorshipContentPage() {
  const user = await getSessionUser();
  const dashboard = user ? await getMentorshipDashboard(user.id) : null;
  const latestByAssignment = new Map<string, MentorshipSubmission>();
  for (const submission of dashboard?.submissions ?? []) {
    if (!latestByAssignment.has(submission.assignmentKey)) latestByAssignment.set(submission.assignmentKey, submission);
  }
  const approvedKeys = new Set([...latestByAssignment.values()].filter((submission) => submission.status === "approved").map((submission) => submission.assignmentKey));
  const currentTheme = dashboard && !dashboard.isComplete && dashboard.enrollment.status !== "completed" ? mentorshipThemes.find((theme) => dashboard.currentWeek >= theme.units[0] && dashboard.currentWeek <= theme.units[1]) : null;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-black tracking-[-.03em] text-off-white sm:text-5xl">Aprenda por temas. Mostre o que sabe fazer.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#C8CFD7] sm:text-lg">6 temas com aulas e missões práticas.</p>
      </header>

      {dashboard ? (
        <section aria-label="Sua próxima ação" className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-white/15 py-5">
          <div>
            <p className="font-semibold text-off-white">{currentTheme ? `Tema ${mentorshipThemes.indexOf(currentTheme) + 1} · ${currentTheme.title}` : "Percurso concluído"}</p>
            <p className="mt-1 text-sm text-[#C8CFD7]">{dashboard.enrollment.status === "paused" ? "Sua matrícula está pausada." : currentTheme ? `Próxima unidade: ${mentorshipWeeks[dashboard.currentWeek - 1]?.title ?? "revisar seu percurso"}.` : "Revise os temas e escolha o que quer aprofundar."}</p>
          </div>
          <Link href={dashboard.enrollment.status === "paused" ? "/mentoria/app" : currentTheme ? `/conteudo/temas/${currentTheme.slug}` : "/mentoria/app"} className="inline-flex min-h-11 items-center gap-2 bg-mint px-4 py-2 text-sm font-bold text-[#101319] hover:bg-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-off-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#101319]">
            {dashboard.enrollment.status === "paused" ? "Ver minha matrícula" : currentTheme ? "Continuar estudando" : "Ver meu painel"}<ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </section>
      ) : (
        <p className="mt-8 border-y border-white/15 py-4 text-sm leading-6 text-[#C8CFD7]">Explore livremente. <Link href="/login?next=/mentoria/app" className="font-semibold text-mint underline underline-offset-4 hover:text-neon">Entre para salvar seu progresso.</Link></p>
      )}

      <ol aria-label="Temas de aprendizagem" className="mt-10 divide-y divide-white/15 border-y border-white/15 sm:mt-14">
        {mentorshipThemes.map((theme, index) => {
          const units = getThemeUnits(theme);
          const progress = getThemeProgress(theme, approvedKeys);
          const current = currentTheme?.id === theme.id;
          const lessons = units.reduce((count, unit) => count + unit.lessons.length, 0);
          return (
            <li key={theme.id} className={`py-7 sm:py-9 ${current ? "-mx-4 bg-mint/[.04] px-4 sm:-mx-6 sm:px-6" : ""}`}>
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_13rem] md:items-start">
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-xs font-bold uppercase tracking-[.14em] text-mint">Tema {index + 1}</span>
                    {current && <span className="text-xs font-semibold text-neon">Seu tema atual</span>}
                    {progress.complete && <span className="inline-flex items-center gap-1 text-xs font-semibold text-mint"><Check aria-hidden="true" className="size-3.5" />Concluído</span>}
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-off-white sm:text-3xl"><Link href={`/conteudo/temas/${theme.slug}`} className="hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">{theme.title}</Link></h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#C8CFD7]">{theme.summary}</p>
                </div>
                <aside className="border-t border-white/10 pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                  <p className="text-xs text-[#AAB2BC]">{lessons} aulas · 2 missões</p>
                  {dashboard && <><p className="mt-3 text-xs font-semibold text-[#C8CFD7]">{progress.approved}/{progress.total} missões aprovadas</p><div className="mt-2 h-1.5 bg-white/10" role="progressbar" aria-label={`Progresso de ${theme.title}`} aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.approved}><div className="h-full bg-mint" style={{ width: `${progress.percent}%` }} /></div></>}
                  <Link href={`/conteudo/temas/${theme.slug}`} className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-mint hover:text-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">{progress.approved ? "Continuar" : "Abrir tema"}<ArrowRight aria-hidden="true" className="size-4" /></Link>
                </aside>
              </div>
            </li>
          );
        })}
      </ol>

      <details className="group mt-14 border-t border-white/20 pt-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint [&::-webkit-details-marker]:hidden">Referências e laboratórios complementares<ChevronDown aria-hidden="true" className="size-5 text-mint transition-transform group-open:rotate-180" /></summary>
        <div className="mt-7 space-y-10 text-sm leading-6 text-[#C8CFD7]">
          <section><h2 className="text-lg font-bold text-off-white">Produto principal: Broto Space</h2><p className="mt-2 max-w-3xl">As 12 missões acompanham a jornada de capturar, organizar, conectar e transformar pensamentos em ação. Use conta e dados de teste; toda evidência deve ser sanitizada.</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">{brotoSpaceSite.publicSurfaces.map((surface) => <a key={surface.href} href={surface.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-mint underline underline-offset-4 hover:text-neon">{surface.title}<ExternalLink aria-hidden="true" className="size-3" /></a>)}</div></section>
          <section><h2 className="text-lg font-bold text-off-white">Dimensões da qualidade</h2><ul className="mt-3 space-y-3">{qualityDimensions.map((dimension) => <li key={dimension.name}><strong className="text-off-white">{dimension.name}:</strong> {dimension.question} <Link href={dimension.href} className="font-semibold text-mint underline underline-offset-4 hover:text-neon">{dimension.where}</Link></li>)}</ul></section>
          <section><h2 className="text-lg font-bold text-off-white">Labs para aprofundar</h2><ul className="mt-3 grid gap-3 sm:grid-cols-2">{qualityDeepDives.map((resource) => <li key={resource.title}><Link href={resource.href} className="font-semibold text-mint underline underline-offset-4 hover:text-neon">{resource.title}</Link><p>{resource.description}</p></li>)}</ul></section>
        </div>
      </details>
    </main>
  );
}
