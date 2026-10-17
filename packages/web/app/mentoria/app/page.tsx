import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, Circle, CircleDot, ClipboardCheck, ExternalLink, PlayCircle, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MentorshipNotifications } from "@/components/mentorship/notifications";
import { MentorshipCertificateAction } from "@/components/mentorship/certificate-action";
import { MentorshipNav } from "@/components/mentorship/mentorship-nav";
import { findMentorshipWeek, mentorshipWeeks } from "@/lib/mentorship/catalog";
import { getMentorshipCertificateProgress, getMentorshipDashboard } from "@/lib/mentorship/store";
import { getCurrentTimestamp } from "@/lib/mentorship/time";
import { getSessionUser } from "@/lib/product/store";

export const metadata = { title: "Minha mentoria | QA Lab" };
export const dynamic = "force-dynamic";

const statusLabel = (status: string) => ({ draft: "Rascunho", submitted: "Aguardando mentor", in_review: "Em revisao", changes_requested: "Ajustes solicitados", approved: "Aprovada" } as Record<string, string>)[status] ?? status;

export default async function MentorshipDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/mentoria/app");
  const dashboard = await getMentorshipDashboard(user.id);
  if (!dashboard) return <NoEnrollmentState email={user.email} />;
  if (dashboard.enrollment.status === "paused") return <BlockedState />;
  if (Object.keys(dashboard.enrollment.diagnosticScore).length === 0) redirect("/mentoria/diagnostico");
  const certificateProgress = await getMentorshipCertificateProgress(user.id);

  const week = findMentorshipWeek(dashboard.currentWeek) ?? mentorshipWeeks[0];
  const latestByAssignment = new Map<string, (typeof dashboard.submissions)[number]>();
  for (const submission of dashboard.submissions) if (!latestByAssignment.has(submission.assignmentKey)) latestByAssignment.set(submission.assignmentKey, submission);
  const currentSubmission = latestByAssignment.get(week.assignment.key);
  const completedLessons = new Set((dashboard.lessons ?? []).filter((item) => item.status === "completed").map((item) => item.lesson_key));
  const totalLessons = mentorshipWeeks.reduce((count, item) => count + item.lessons.length, 0);
  const currentTimestamp = getCurrentTimestamp();
  const nextSession = (dashboard.sessions ?? []).find((session) => new Date(session.starts_at).getTime() >= currentTimestamp);
  const latestRecording = [...(dashboard.sessions ?? [])].reverse().find((session) => session.recording_url);
  const journeyComplete = dashboard.isComplete || dashboard.enrollment.status === "completed";
  const progress = Math.round((dashboard.completedWeeks / dashboard.totalWeeks) * 100);

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <MentorshipNav current="/mentoria/app" />
    <header className="flex flex-wrap items-end justify-between gap-5">
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-mint">{dashboard.cohort?.name ?? "Turma da mentoria"}</p><h1 className="mt-3 text-4xl font-black text-off-white">{journeyComplete ? "Sua jornada está concluída." : "Sua próxima missão começa aqui."}</h1><p className="mt-3 max-w-2xl text-base leading-7 text-[#AAB2BC]">{journeyComplete ? "As 12 entregas aprovadas ficam disponíveis para consulta. Revise seu projeto final e organize o que quer levar para o portfólio." : `Semana ${week.number}: ${week.title}. Seu percurso combina conteúdo, prática e retorno do mentor.`}</p></div>
      <div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="/mentoria/diagnostico">Meu nivel: {dashboard.enrollment.level === "intermediate" ? "intermediario" : "iniciante"}</Link></Button><Button asChild><Link href={`/mentoria/semanas/${journeyComplete ? 12 : week.number}`}>{journeyComplete ? "Rever projeto final" : `Continuar semana ${week.number}`} <ArrowRight className="size-4" /></Link></Button></div>
    </header>

    <section aria-label="Progresso da mentoria" className="mt-9 border-y border-white/10 py-5">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-black text-off-white">Progresso das entregas</h2><p className="mt-1 text-sm text-[#AAB2BC]">{dashboard.completedWeeks} de {dashboard.totalWeeks} semanas aprovadas</p></div><span className="text-sm font-bold tabular-nums text-mint">{progress}%</span></div>
      <div className="mt-4 h-2 overflow-hidden bg-white/10" role="progressbar" aria-label="Progresso das semanas aprovadas" aria-valuemin={0} aria-valuemax={12} aria-valuenow={dashboard.completedWeeks}><div className="h-full bg-mint transition-[width] duration-200" style={{ width: `${progress}%` }} /></div>
      <p className="mt-3 text-xs text-[#8B949E]">Aulas marcadas: {completedLessons.size} de {totalLessons}. A aprovação, não apenas a entrega, conclui cada semana.</p>
    </section>

    {journeyComplete && <section role="status" className="mt-8 border border-mint/25 bg-mint/[.04] p-5"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-mint" /><div><h2 className="font-bold text-off-white">Missões concluídas</h2><p className="mt-1 text-sm leading-6 text-[#C8CFD7]">Seu projeto integrado está na semana 12. Você pode rever o feedback e escolher como apresentar o case no portfólio.</p><Link href="/mentoria/semanas/12#feedback" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon">Abrir projeto final <ArrowRight className="size-4" /></Link></div></div></section>}

    <MentorshipCertificateAction initialProgress={certificateProgress} />
    <section className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/mentoria/carreira" className="border border-white/10 bg-[#171B21] p-5 transition hover:border-mint/40"><p className="text-xs font-bold uppercase tracking-[.16em] text-mint">Materiais de carreira</p><h2 className="mt-2 text-lg font-black text-off-white">Currículo, LinkedIn, pitch e entrevista</h2><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">Templates práticos para apresentar sua experiência em QA.</p></Link><Link href="/mentoria/dinamicas" className="border border-white/10 bg-[#171B21] p-5 transition hover:border-mint/40"><p className="text-xs font-bold uppercase tracking-[.16em] text-neon">People Lab ao vivo</p><h2 className="mt-2 text-lg font-black text-off-white">Preparar uma dinâmica</h2><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">Escolha um cenário de comunicação, feedback ou decisão para levar ao encontro.</p></Link></section>

    {!journeyComplete && <section className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
      <article className="border border-neon/25 bg-neon/[.04] p-6">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-neon">Missão atual · Semana {week.number}</p><h2 className="mt-3 text-2xl font-black text-off-white">{week.assignment.title}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#D9DEE4]">{week.assignment.objective}</p><p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-[#8B949E]">O que entregar</p><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{week.assignment.delivery}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 border border-white/10 px-3 py-2 text-xs font-bold text-[#C8CFD7]"><ClipboardCheck className="size-4 text-mint" />{currentSubmission ? statusLabel(currentSubmission.status) : "Ainda nao iniciada"}</span><span className="text-xs text-[#8B949E]">Prática: {week.assignment.practice.environment} · {week.assignment.practice.estimatedMinutes} min</span></div>
        <Button asChild variant="outline" className="mt-6"><Link href={`/mentoria/semanas/${week.number}`}>Abrir missão da semana <ArrowRight className="size-4" /></Link></Button>
      </article>
      <article className="border border-white/10 bg-[#171B21] p-6">
        <div className="flex items-center gap-3"><CalendarDays className="size-5 text-mint" /><h2 className="text-xl font-black text-off-white">Encontro ao vivo</h2></div>
        {nextSession ? <><p className="mt-4 text-lg font-bold text-off-white">{nextSession.title}</p><p className="mt-2 text-sm text-[#AAB2BC]">Semana {nextSession.week_number} · {new Date(nextSession.starts_at).toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short" })}</p>{nextSession.agenda && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#C8CFD7]">{nextSession.agenda}</p>}{nextSession.meeting_url && <a href={nextSession.meeting_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon">Entrar no encontro <ExternalLink className="size-4" /></a>}</> : latestRecording ? <><p className="mt-4 text-sm leading-6 text-[#AAB2BC]">Nenhum encontro futuro publicado. A gravação mais recente disponível é da semana {latestRecording.week_number}.</p><a href={latestRecording.recording_url!} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-neon hover:text-mint"><PlayCircle className="size-4" /> Assistir gravação</a></> : <><p className="mt-4 text-sm leading-6 text-[#AAB2BC]">A equipe ainda não publicou data ou gravação. O foco previsto para seu próximo encontro:</p><p className="mt-2 text-sm font-bold text-off-white">{week.liveFocus}</p><p className="mt-3 text-xs text-[#8B949E]">A pauta e o link aparecem aqui quando forem publicados.</p></>}
      </article>
    </section>}

    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black text-off-white">As 12 semanas</h2><p className="mt-2 text-sm text-[#AAB2BC]">Abra uma missão para revisar o conteúdo, registrar uma entrega ou consultar feedback.</p></div><span className="text-xs text-[#8B949E]">{dashboard.enrollment.level === "intermediate" ? "Percurso intermediário" : "Percurso iniciante"}</span></div>
      <ol className="mt-5 divide-y divide-white/10 border-y border-white/10">{mentorshipWeeks.map((item) => {
        const submission = latestByAssignment.get(item.assignment.key);
        const isCurrent = !journeyComplete && item.number === dashboard.currentWeek;
        const done = submission?.status === "approved";
        const state = done ? "Aprovada" : submission ? statusLabel(submission.status) : isCurrent ? "Próxima missão" : "Na sequência";
        const Icon = done ? CheckCircle2 : isCurrent ? CircleDot : Circle;
        return <li key={item.assignment.key} className={`flex flex-wrap items-center justify-between gap-4 py-4 ${isCurrent ? "bg-mint/[.035] px-3" : ""}`}>
          <div className="flex min-w-0 items-start gap-3"><Icon className={`mt-1 size-4 shrink-0 ${done || isCurrent ? "text-mint" : "text-[#65707D]"}`} /><div><p className="text-xs font-bold text-[#8B949E]">Semana {item.number} · {item.technicalFocus}</p><h3 className="mt-1 font-bold text-off-white">{item.title}</h3><p className="mt-1 text-xs text-[#AAB2BC]">{item.assignment.title}</p></div></div>
          <div className="flex items-center gap-4"><span className={`text-xs font-bold ${done ? "text-mint" : isCurrent ? "text-neon" : "text-[#8B949E]"}`}>{state}</span><Link href={`/mentoria/semanas/${item.number}`} aria-label={`Abrir semana ${item.number}: ${item.title}`} className="inline-flex items-center gap-1 text-xs font-bold text-mint hover:text-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">{done ? "Rever" : isCurrent ? "Continuar" : "Abrir"}<ArrowRight className="size-3" /></Link></div>
        </li>;
      })}</ol>
    </section>

    <MentorshipNotifications items={dashboard.notifications ?? []} />
  </main>;
}

function NoEnrollmentState({ email }: { email: string }) {
  return <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16"><section className="border border-white/10 bg-[#171B21] p-6 sm:p-10"><UsersRound className="size-6 text-mint" aria-hidden="true" /><h1 className="mt-5 text-3xl font-black tracking-[-.03em] text-off-white">Falta vincular sua matrícula à turma.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#AAB2BC]">Criar uma conta no QA Lab não libera a mentoria automaticamente. O painel aparece depois que a equipe confirma sua participação e associa seu acesso a uma turma.</p><p className="mt-6 text-sm text-[#AAB2BC]">Peça à equipe para conferir este e-mail:</p><p className="mt-2 break-all font-mono text-sm font-bold text-neon">{email}</p><div className="mt-6 flex flex-wrap gap-3"><Button asChild><a href="https://www.linkedin.com/company/qa-lab-oficial/" target="_blank" rel="noreferrer">Falar com a equipe <ExternalLink className="size-4" /></a></Button><Button asChild variant="outline"><Link href="/mentoria">Conhecer a mentoria</Link></Button></div><Link href="/lab" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon">Enquanto isso, praticar nos Labs <ArrowRight className="size-4" /></Link></section></main>;
}

function BlockedState() {
  return <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16"><section role="status" className="border border-coral/30 bg-[#171B21] p-6 sm:p-10"><h1 className="text-3xl font-black text-off-white">Sua matrícula está pausada.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#AAB2BC]">O conteúdo da jornada fica preservado, mas as entregas e o progresso estão temporariamente bloqueados. Fale com a equipe para combinar a retomada do acompanhamento.</p><p className="mt-5 text-sm font-bold text-coral">Seus rascunhos e entregas anteriores continuam salvos.</p><Button asChild className="mt-6"><a href="https://www.linkedin.com/company/qa-lab-oficial/" target="_blank" rel="noreferrer">Falar com a equipe <ExternalLink className="size-4" /></a></Button></section></main>;
}
