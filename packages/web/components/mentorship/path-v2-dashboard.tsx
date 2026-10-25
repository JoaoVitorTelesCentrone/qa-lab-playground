import Link from "next/link";
import { ArrowDown, ArrowRight, CalendarDays, Check, CheckCircle2, Circle, Compass, ExternalLink, NotebookPen } from "lucide-react";
import { MentorshipCertificateAction } from "./certificate-action";
import { MentorshipNav } from "./mentorship-nav";
import { MentorshipNotifications } from "./notifications";
import { mentorshipPathV2, pathV2Assignments, pathV2ChapterHref, pathV2Chapters, pathV2PracticeKey, pathV2Progress } from "@/lib/mentorship/path-v2";
import type { getMentorshipCertificateProgress, getMentorshipDashboard } from "@/lib/mentorship/store";

type Dashboard = NonNullable<Awaited<ReturnType<typeof getMentorshipDashboard>>>;
type Certificate = Awaited<ReturnType<typeof getMentorshipCertificateProgress>>;

function dateLabel(date: string) {
  return new Date(date).toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Sao_Paulo" });
}

export function PathV2Dashboard({ dashboard, certificate, now }: { dashboard: Dashboard; certificate: Certificate; now: number }) {
  const completed = new Set((dashboard.lessons ?? []).filter((row) => row.status === "completed").map((row) => row.lesson_key));
  const latest = new Map<string, string>();
  for (const submission of dashboard.submissions) if (!latest.has(submission.assignmentKey)) latest.set(submission.assignmentKey, submission.status);
  const approved = new Set([...latest].filter(([, status]) => status === "approved").map(([key]) => key));
  const progress = pathV2Progress(completed, approved, completed);
  const next = pathV2Chapters.find(({ chapter }) => chapter.lessonKeys.some((key) => !completed.has(key)) || chapter.practices.some((_, index) => !completed.has(pathV2PracticeKey(chapter, index))) || (chapter.assignmentKey && !approved.has(chapter.assignmentKey))) ?? pathV2Chapters[pathV2Chapters.length - 1];
  const nextSession = (dashboard.sessions ?? []).find((session) => new Date(session.starts_at).getTime() >= now);
  const totalLessons = pathV2Chapters.reduce((sum, item) => sum + item.chapter.lessonKeys.length, 0);
  const totalPractices = pathV2Chapters.reduce((sum, item) => sum + item.chapter.practices.length, 0);
  const lessonsDone = pathV2Chapters.reduce((sum, item) => sum + item.chapter.lessonKeys.filter((key) => completed.has(key)).length, 0);
  const practicesDone = progress.reduce((sum, item) => sum + item.practicesDone, 0);
  const done = dashboard.isComplete && progress.every((item) => item.complete);
  const overall = Math.round((progress.filter((item) => item.complete).length / mentorshipPathV2.length) * 100);
  const nextHref = pathV2ChapterHref(next.module, next.chapter);

  return <main className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 sm:pt-9">
    <MentorshipNav current="/mentoria/app" />

    <header className="relative isolate overflow-hidden rounded-2xl border border-[#405447] bg-[#151C18] p-5 sm:p-8 lg:p-10">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-2/5 bg-[radial-gradient(ellipse_at_top_right,rgba(76,175,114,.16),transparent_70%)]" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,.85fr)] lg:items-end">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#8ED8A7]"><Compass aria-hidden="true" className="size-4" /> {dashboard.cohort?.name ?? "Sua turma"}</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.04] tracking-[-.055em] text-[#F5F7F6]">{done ? "Sua jornada, pronta para ser apresentada." : "Seu próximo passo está aqui."}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#B9C5BD] sm:text-base sm:leading-7">{done ? "Revise o feedback, escolha as evidências que quer publicar e prepare a apresentação do seu case." : `${next.module.title} / ${next.chapter.title}. Avance no seu ritmo, com prática e feedback ligados a cada etapa.`}</p>
          <Link href={nextHref} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#8ED8A7] px-5 text-sm font-bold text-[#102017] transition hover:bg-[#A4E6B6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ED8A7] sm:w-auto">
            {done ? "Rever projeto final" : "Continuar capítulo"}<ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <section aria-label="Resumo da jornada" className="rounded-xl border border-white/10 bg-[#0F1411]/80 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#93A097]">Próxima etapa</p><p className="mt-2 text-lg font-semibold leading-snug text-[#F5F7F6]">{done ? "Percurso concluído" : next.chapter.title}</p><p className="mt-1 text-xs text-[#AAB7AE]">{done ? "Revisão e apresentação" : next.module.title}</p></div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#60866A]/40 bg-[#4CAF72]/10 text-[#9AE0AD]"><NotebookPen aria-hidden="true" className="size-5" /></span>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs"><span className="text-[#AAB7AE]">Módulos completos</span><span className="font-mono font-semibold tabular-nums text-[#D9E9DD]">{progress.filter((item) => item.complete).length} / {mentorshipPathV2.length}</span></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Módulos completos" aria-valuemin={0} aria-valuemax={mentorshipPathV2.length} aria-valuenow={progress.filter((item) => item.complete).length}><div className="h-full rounded-full bg-[#8ED8A7] transition-[width] duration-300" style={{ width: `${overall}%` }} /></div>
          <p className="mt-3 text-[11px] leading-5 text-[#8F9E94]">O percurso avança com aulas, práticas e entregas aprovadas.</p>
        </section>
      </div>
    </header>

    <section aria-label="Seu progresso" className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      <ProgressMetric label="Aulas concluídas" value={`${lessonsDone} / ${totalLessons}`} detail="Conteúdo estudado" />
      <ProgressMetric label="Práticas realizadas" value={`${practicesDone} / ${totalPractices}`} detail="Aplicação por capítulo" />
      <ProgressMetric label="Entregas aprovadas" value={`${dashboard.completedWeeks} / ${pathV2Assignments.length}`} detail="Com revisão do mentor" />
      <ProgressMetric label="Módulos completos" value={`${progress.filter((item) => item.complete).length} / ${mentorshipPathV2.length}`} detail="Percurso por competência" />
    </section>

    <div className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
      <section aria-labelledby="curriculum-title" className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#8ED8A7]">Caderno de prática</p><h2 id="curriculum-title" className="mt-1 text-2xl font-semibold tracking-[-.035em] text-[#F5F7F6]">Seu percurso</h2></div>
          <p className="text-xs text-[#AAB7AE]">{mentorshipPathV2.length} módulos · {pathV2Chapters.length} capítulos</p>
        </div>
        <ol className="mt-3 divide-y divide-white/[.08]">
          {progress.map((item, index) => {
            const moduleChapters = pathV2Chapters.filter((entry) => entry.module.id === item.module.id);
            const moduleIsCurrent = item.module.id === next.module.id;
            return <li key={item.module.id} className="relative pl-7 sm:pl-9">
              <span aria-hidden="true" className={`absolute left-[6px] top-7 h-full w-px ${index === progress.length - 1 ? "hidden" : "bg-white/10"}`} />
              <span aria-hidden="true" className={`absolute left-0 top-6 z-10 flex size-3.5 items-center justify-center rounded-full border ${item.complete ? "border-[#8ED8A7] bg-[#8ED8A7]" : moduleIsCurrent ? "border-[#8ED8A7] bg-[#151C18] ring-4 ring-[#4CAF72]/10" : "border-[#65736A] bg-[#111613]"}`}>{item.complete && <Check className="size-2.5 text-[#102017]" />}</span>
              <details open={moduleIsCurrent} className="group py-3">
                <summary className="flex min-h-[4.25rem] cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-3 py-2 transition hover:bg-white/[.035] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8ED8A7] [&::-webkit-details-marker]:hidden">
                  <span className="flex min-w-0 items-start gap-3">
                    <span className="pt-0.5 font-mono text-[10px] font-semibold tabular-nums text-[#809087]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-[#8ED8A7]">{item.complete ? "Concluído" : moduleIsCurrent ? "Em andamento" : "Na sequência"}</span><span className="mt-1 block text-sm font-semibold leading-5 text-[#E9F0EB] sm:text-base">{item.module.title}</span><span className="mt-1 block text-[11px] leading-5 text-[#93A097]">{item.lessonsDone}/{item.lessonsTotal} aulas · {item.practicesDone}/{item.practicesTotal} práticas · {item.assignmentsDone}/{item.assignmentsTotal} entregas</span></span>
                  </span>
                  <ArrowDown aria-hidden="true" className="size-4 shrink-0 text-[#93A097] transition-transform group-open:rotate-180" />
                </summary>
                <div className="ml-7 mt-2 border-l border-white/10 pl-3 sm:ml-10 sm:pl-4">
                  <p className="max-w-2xl pb-2 text-xs leading-5 text-[#AAB7AE]">{item.module.summary}</p>
                  <ol className="divide-y divide-white/[.06]">
                    {moduleChapters.map(({ chapter }) => {
                      const chapterComplete = chapter.lessonKeys.every((key) => completed.has(key)) && chapter.practices.every((_, practiceIndex) => completed.has(pathV2PracticeKey(chapter, practiceIndex))) && (!chapter.assignmentKey || approved.has(chapter.assignmentKey));
                      const isNext = chapter.id === next.chapter.id;
                      const StatusIcon = chapterComplete ? CheckCircle2 : isNext ? Compass : Circle;
                      const status = chapterComplete ? "Aprovado" : isNext ? "Próximo" : "A fazer";
                      return <li key={chapter.id}>
                        <Link href={pathV2ChapterHref(item.module, chapter)} className={`flex min-h-12 items-center gap-2.5 py-2 text-xs leading-5 transition-colors hover:text-[#A4E6B6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8ED8A7] sm:text-sm ${isNext ? "font-semibold text-[#EDF5EF]" : "text-[#B8C4BC]"}`}>
                          <StatusIcon aria-hidden="true" className={`size-4 shrink-0 ${chapterComplete || isNext ? "text-[#8ED8A7]" : "text-[#68766D]"}`} />
                          <span className="min-w-0 flex-1">{chapter.title}</span>
                          <span className={`shrink-0 text-[9px] font-bold uppercase tracking-[.08em] sm:text-[10px] ${isNext ? "text-[#8ED8A7]" : chapterComplete ? "text-[#93A097]" : "text-[#77847B]"}`}>{status}</span>
                        </Link>
                      </li>;
                    })}
                  </ol>
                  <Link href={`/conteudo/modulos/${item.module.slug}`} className="mt-2 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-[#8ED8A7] underline-offset-4 hover:underline">Ver material do módulo <ArrowRight aria-hidden="true" className="size-3.5" /></Link>
                </div>
              </details>
            </li>;
          })}
        </ol>
      </section>

      <aside className="grid gap-4">
        <section aria-labelledby="session-title" className="overflow-hidden rounded-xl border border-white/10 bg-[#151A17]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3"><CalendarDays aria-hidden="true" className="size-4 text-[#8ED8A7]" /><h2 id="session-title" className="text-sm font-semibold text-[#EDF5EF]">Encontro ao vivo</h2></div>
          <div className="p-4">
            {nextSession ? <>
              <p className="text-base font-semibold leading-snug text-[#F5F7F6]">{nextSession.title}</p>
              <p className="mt-2 text-xs leading-5 text-[#AAB7AE]">Semana {nextSession.week_number} · {dateLabel(nextSession.starts_at)}</p>
              {nextSession.agenda && <p className="mt-3 border-l-2 border-[#53785F] pl-3 text-xs leading-5 text-[#C0CCC3]">{nextSession.agenda}</p>}
              {nextSession.meeting_url && <a href={nextSession.meeting_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-[#61846A] px-3 text-xs font-bold text-[#A4E6B6] transition hover:bg-[#4CAF72]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8ED8A7]">Entrar no encontro <ExternalLink aria-hidden="true" className="size-3.5" /></a>}
            </> : <>
              <p className="text-sm font-semibold text-[#E9F0EB]">A próxima data ainda não foi publicada.</p>
              <p className="mt-2 text-xs leading-5 text-[#AAB7AE]">Enquanto isso, siga pelo próximo capítulo. A agenda e as gravações ficam disponíveis nesta área.</p>
            </>}
            <Link href="/mentoria/encontros" className="mt-3 inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-[#8ED8A7] underline-offset-4 hover:underline">Agenda e gravações <ArrowRight aria-hidden="true" className="size-3.5" /></Link>
          </div>
        </section>

        <section aria-label="Preparação de carreira" className="rounded-xl border border-white/10 bg-[#151A17] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#8ED8A7]">Leve seu trabalho adiante</p>
          <h2 className="mt-2 text-base font-semibold text-[#EDF5EF]">Transforme as entregas em um case.</h2>
          <p className="mt-1.5 text-xs leading-5 text-[#AAB7AE]">Reúna evidências aprovadas e explique as decisões que você tomou.</p>
          <Link href="/mentoria/carreira" className="mt-3 inline-flex min-h-10 items-center gap-1 text-xs font-bold text-[#8ED8A7] underline-offset-4 hover:underline">Materiais de carreira <ArrowRight aria-hidden="true" className="size-3.5" /></Link>
        </section>

      </aside>
    </div>

    <MentorshipCertificateAction initialProgress={certificate} />

    <div className="mt-8"><MentorshipNotifications items={dashboard.notifications ?? []} /></div>
  </main>;
}

function ProgressMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article className="min-w-0 rounded-lg border border-white/10 bg-[#141916] p-3 sm:p-4">
    <p className="text-[10px] font-bold uppercase leading-4 tracking-[.1em] text-[#91A097]">{label}</p>
    <p className="mt-2 font-mono text-lg font-semibold tabular-nums text-[#E8F2EA] sm:text-xl">{value}</p>
    <p className="mt-1 text-[10px] leading-4 text-[#829087]">{detail}</p>
  </article>;
}
