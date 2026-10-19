import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, Circle, CircleDot, ExternalLink, PlayCircle, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MentorshipCertificateAction } from "@/components/mentorship/certificate-action";
import { PathV2Dashboard } from "@/components/mentorship/path-v2-dashboard";
import { MentorshipNav } from "@/components/mentorship/mentorship-nav";
import { MentorshipNotifications } from "@/components/mentorship/notifications";
import { findMentorshipWeek, mentorshipWeeks } from "@/lib/mentorship/catalog";
import { getMentorshipCertificateProgress, getMentorshipDashboard } from "@/lib/mentorship/store";
import { getCurrentTimestamp } from "@/lib/mentorship/time";
import { getThemeProgress, mentorshipThemes, themeForUnit } from "@/lib/mentorship/themes";
import { getSessionUser } from "@/lib/product/store";

export const metadata = { title: "Minha mentoria | QA Lab" };
export const dynamic = "force-dynamic";

const statusLabel = (status: string) => ({ draft: "Rascunho", submitted: "Aguardando mentor", in_review: "Em revisão", changes_requested: "Ajustes solicitados", approved: "Aprovada" } as Record<string, string>)[status] ?? status;

export default async function MentorshipDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/mentoria/app");
  const dashboard = await getMentorshipDashboard(user.id);
  if (!dashboard) return <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8"><MentorshipNav current="/mentoria/app" /><section className="mt-8 border border-white/10 bg-[#171B21] p-6 sm:p-10"><UsersRound className="size-6 text-mint" aria-hidden="true" /><h1 className="mt-5 text-3xl font-black text-off-white">Sua matrícula ainda não está vinculada a uma turma.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#AAB2BC]">A equipe libera este painel depois de confirmar sua participação e associar sua conta a uma turma.</p><div className="mt-6 flex flex-wrap gap-3"><Button asChild><a href="https://www.linkedin.com/company/qa-lab-oficial/" target="_blank" rel="noreferrer">Falar com a equipe<ExternalLink className="ml-2 size-4" /></a></Button><Button asChild variant="outline"><Link href="/conteudo">Explorar os temas</Link></Button></div></section></main>;
  if (dashboard.enrollment.status === "paused") return <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8"><MentorshipNav current="/mentoria/app" /><section role="status" className="mt-8 border border-coral/30 bg-[#171B21] p-6 sm:p-10"><h1 className="text-3xl font-black text-off-white">Sua matrícula está pausada.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#AAB2BC]">O conteúdo e o histórico das missões permanecem disponíveis. A equipe pode combinar com você a retomada das entregas e do acompanhamento.</p><Button asChild className="mt-6"><a href="https://www.linkedin.com/company/qa-lab-oficial/" target="_blank" rel="noreferrer">Falar com a equipe<ExternalLink className="ml-2 size-4" /></a></Button></section></main>;
  if (Object.keys(dashboard.enrollment.diagnosticScore).length === 0) redirect("/mentoria/diagnostico");

  const certificateProgress = await getMentorshipCertificateProgress(user.id);
  if (dashboard.enrollment.programVersion === "v2") return <PathV2Dashboard dashboard={dashboard} certificate={certificateProgress} now={getCurrentTimestamp()} />;
  const currentUnit = findMentorshipWeek(dashboard.currentWeek) ?? mentorshipWeeks[0];
  const currentTheme = themeForUnit(currentUnit.number) ?? mentorshipThemes[mentorshipThemes.length - 1];
  const currentThemeIndex = mentorshipThemes.findIndex((theme) => theme.id === currentTheme.id);
  const latestByAssignment = new Map<string, (typeof dashboard.submissions)[number]>();
  for (const submission of dashboard.submissions) if (!latestByAssignment.has(submission.assignmentKey)) latestByAssignment.set(submission.assignmentKey, submission);
  const approvedKeys = new Set([...latestByAssignment.values()].filter((submission) => submission.status === "approved").map((submission) => submission.assignmentKey));
  const completedThemes = mentorshipThemes.filter((theme) => getThemeProgress(theme, approvedKeys).complete).length;
  const completedLessons = new Set((dashboard.lessons ?? []).filter((item) => item.status === "completed").map((item) => item.lesson_key));
  const totalLessons = mentorshipWeeks.reduce((count, item) => count + item.lessons.length, 0);
  const nextSession = (dashboard.sessions ?? []).find((session) => new Date(session.starts_at).getTime() >= getCurrentTimestamp());
  const latestRecording = [...(dashboard.sessions ?? [])].reverse().find((session) => session.recording_url);
  const journeyComplete = dashboard.isComplete || dashboard.enrollment.status === "completed";
  const currentSubmission = latestByAssignment.get(currentUnit.assignment.key);
  const overallProgress = Math.round((completedThemes / mentorshipThemes.length) * 100);

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <MentorshipNav current="/mentoria/app" />
    <header className="flex flex-wrap items-end justify-between gap-5">
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-mint">{dashboard.cohort?.name ?? "Turma da mentoria"}</p><h1 className="mt-3 text-4xl font-black text-off-white">{journeyComplete ? "Sua jornada está concluída." : "Sua próxima missão começa aqui."}</h1><p className="mt-3 max-w-2xl text-base leading-7 text-[#AAB2BC]">{journeyComplete ? "Revise as missões, incorpore o feedback e escolha o que quer levar para seu portfólio." : `Tema ${currentThemeIndex + 1}: ${currentTheme.title}. Sua próxima unidade é ${currentUnit.title}.`}</p></div>
      <div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="/mentoria/diagnostico">Meu nível: {dashboard.enrollment.level === "intermediate" ? "intermediário" : "iniciante"}</Link></Button><Button asChild><Link href={journeyComplete ? `/conteudo/temas/${mentorshipThemes[mentorshipThemes.length - 1].slug}` : `/mentoria/semanas/${currentUnit.number}`}>{journeyComplete ? "Rever tema final" : "Continuar missão"}<ArrowRight className="ml-2 size-4" /></Link></Button></div>
    </header>

    <section aria-label="Progresso da mentoria" className="mt-9 border-y border-white/10 py-5">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-black text-off-white">Progresso por tema</h2><p className="mt-1 text-sm text-[#AAB2BC]">{completedThemes} de {mentorshipThemes.length} temas concluídos · {dashboard.completedWeeks} de {dashboard.totalWeeks} missões aprovadas</p></div><span className="text-sm font-bold tabular-nums text-mint">{overallProgress}%</span></div>
      <div className="mt-4 h-2 overflow-hidden bg-white/10" role="progressbar" aria-label="Progresso dos temas concluídos" aria-valuemin={0} aria-valuemax={mentorshipThemes.length} aria-valuenow={completedThemes}><div className="h-full bg-mint transition-[width] duration-200" style={{ width: `${overallProgress}%` }} /></div>
      <p className="mt-3 text-xs text-[#8B949E]">Aulas marcadas: {completedLessons.size} de {totalLessons}. Cada missão é aprovada após a revisão do mentor.</p>
    </section>

    {journeyComplete && <section role="status" className="mt-8 border border-mint/25 bg-mint/[.04] p-5"><div className="flex items-start gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-mint" /><div><h2 className="font-bold text-off-white">Missões concluídas</h2><p className="mt-1 text-sm leading-6 text-[#C8CFD7]">O projeto integrado e as entregas anteriores estão disponíveis para consulta. Revise o feedback e prepare uma apresentação segura do case.</p><Link href="/mentoria/semanas/12#feedback" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon">Abrir feedback do projeto final<ArrowRight className="size-4" /></Link></div></div></section>}

    <MentorshipCertificateAction initialProgress={certificateProgress} />
    <section className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/mentoria/carreira" className="border border-white/10 bg-[#171B21] p-5 transition hover:border-mint/40"><p className="text-xs font-bold uppercase tracking-[.16em] text-mint">Materiais de carreira</p><h2 className="mt-2 text-lg font-black text-off-white">Currículo, LinkedIn, pitch e entrevista</h2><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">Templates para apresentar sua experiência em QA com evidências concretas.</p></Link><Link href="/mentoria/dinamicas" className="border border-white/10 bg-[#171B21] p-5 transition hover:border-neon/40"><p className="text-xs font-bold uppercase tracking-[.16em] text-neon">People Lab ao vivo</p><h2 className="mt-2 text-lg font-black text-off-white">Preparar uma dinâmica</h2><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">Leve um cenário de comunicação, feedback ou decisão para o encontro.</p></Link></section>

    {!journeyComplete && <section className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
      <article className="border border-neon/25 bg-neon/[.04] p-6"><p className="text-xs font-bold uppercase tracking-[.18em] text-neon">Tema {currentThemeIndex + 1} · {currentTheme.title}</p><h2 className="mt-3 text-2xl font-black text-off-white">{currentUnit.assignment.title}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#D9DEE4]">{currentUnit.assignment.objective}</p><p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-[#8B949E]">O que entregar</p><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{currentUnit.assignment.delivery}</p><div className="mt-5 flex flex-wrap items-center gap-3"><span className="border border-white/10 px-3 py-2 text-xs font-bold text-[#C8CFD7]">{currentSubmission ? statusLabel(currentSubmission.status) : "Ainda não iniciada"}</span><span className="text-xs text-[#8B949E]">{currentUnit.assignment.practice.environment} · {currentUnit.assignment.practice.estimatedMinutes} min</span></div><Button asChild variant="outline" className="mt-6"><Link href={`/mentoria/semanas/${currentUnit.number}`}>Abrir missão<ArrowRight className="ml-2 size-4" /></Link></Button><Link href={`/conteudo/temas/${currentTheme.slug}`} className="ml-5 text-sm font-bold text-mint hover:text-neon">Estudar o tema</Link></article>
      <article className="border border-white/10 bg-[#171B21] p-6"><div className="flex items-center gap-3"><CalendarDays aria-hidden="true" className="size-5 text-mint" /><h2 className="text-xl font-black text-off-white">Encontro ao vivo</h2></div>
        {nextSession ? <><p className="mt-4 text-lg font-bold text-off-white">{nextSession.title}</p><p className="mt-2 text-sm text-[#AAB2BC]">Semana {nextSession.week_number} · {new Date(nextSession.starts_at).toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short" })}</p>{nextSession.agenda && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#C8CFD7]">{nextSession.agenda}</p>}{nextSession.meeting_url && <a href={nextSession.meeting_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon">Entrar no encontro<ExternalLink aria-hidden="true" className="size-4" /></a>}</> : latestRecording ? <><p className="mt-4 text-sm leading-6 text-[#AAB2BC]">Nenhum encontro futuro publicado. A gravação mais recente disponível é da semana {latestRecording.week_number}.</p><a href={latestRecording.recording_url!} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-neon hover:text-mint"><PlayCircle aria-hidden="true" className="size-4" />Assistir gravação</a></> : <><p className="mt-4 text-sm leading-6 text-[#AAB2BC]">A equipe ainda não publicou data ou gravação. O foco previsto para o próximo encontro:</p><p className="mt-2 text-sm font-bold text-off-white">{currentUnit.liveFocus}</p><p className="mt-3 text-xs text-[#8B949E]">A pauta e o link aparecem aqui quando forem publicados.</p></>}
      </article>
    </section>}

    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black text-off-white">Seu percurso por temas</h2><p className="mt-2 text-sm text-[#AAB2BC]">Cada tema conecta duas missões. Estude o conjunto ou abra uma missão para enviar e consultar feedback.</p></div><span className="text-xs text-[#8B949E]">{dashboard.enrollment.level === "intermediate" ? "Percurso intermediário" : "Percurso iniciante"}</span></div>
      <ol className="mt-5 divide-y divide-white/10 border-y border-white/10">{mentorshipThemes.map((theme, themeIndex) => {
        const themeProgress = getThemeProgress(theme, approvedKeys);
        const current = !journeyComplete && theme.id === currentTheme.id;
        const units = mentorshipWeeks.filter((unit) => unit.number >= theme.units[0] && unit.number <= theme.units[1]);
        return <li key={theme.id} className={`py-5 ${current ? "bg-mint/[.035] px-3" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-mint">Tema {themeIndex + 1}{current ? " · Atual" : themeProgress.complete ? " · Concluído" : ""}</p><h3 className="mt-1 text-lg font-black text-off-white">{theme.title}</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-[#AAB2BC]">{theme.summary}</p></div><div className="flex items-center gap-4"><span className="text-xs font-semibold text-[#AAB2BC]">{themeProgress.approved}/{themeProgress.total} missões</span><Link href={`/conteudo/temas/${theme.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-mint hover:text-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">Ver tema<ArrowRight aria-hidden="true" className="size-3" /></Link></div></div>
          <ol className="mt-4 grid gap-x-6 sm:grid-cols-2">{units.map((unit, unitIndex) => {
            const submission = latestByAssignment.get(unit.assignment.key);
            const isNext = !journeyComplete && unit.number === dashboard.currentWeek;
            const approved = submission?.status === "approved";
            const Icon = approved ? CheckCircle2 : isNext ? CircleDot : Circle;
            const state = approved ? "Aprovada" : submission ? statusLabel(submission.status) : isNext ? "Próxima missão" : "Na sequência";
            return <li key={unit.assignment.key} className="flex items-center justify-between gap-3 border-t border-white/[.07] py-3"><div className="flex min-w-0 items-start gap-2.5"><Icon aria-hidden="true" className={`mt-0.5 size-4 shrink-0 ${approved || isNext ? "text-mint" : "text-[#65707D]"}`} /><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wide text-[#8B949E]">Missão {unitIndex + 1} · {state}</p><p className="mt-0.5 truncate text-sm font-semibold text-off-white">{unit.assignment.title}</p><p className="mt-0.5 truncate text-xs text-[#AAB2BC]">{unit.technicalFocus}</p></div></div><Link href={`/mentoria/semanas/${unit.number}`} aria-label={`${approved ? "Rever" : "Abrir"} missão ${unit.assignment.title}`} className="shrink-0 text-xs font-bold text-mint hover:text-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">{approved ? "Rever" : isNext ? "Continuar" : "Abrir"}</Link></li>;
          })}</ol>
        </li>;
      })}</ol>
    </section>

    <MentorshipNotifications items={dashboard.notifications ?? []} />
  </main>;
}
