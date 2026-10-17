import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpenCheck, CalendarDays, ClipboardList, ExternalLink } from "lucide-react";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { CommitmentCheckIn } from "@/components/mentorship/commitment-checkin";
import { mentorshipWeeks } from "@/lib/mentorship/catalog";
import { getMentorStudentOverview } from "@/lib/mentorship/store";
import { getCurrentTimestamp } from "@/lib/mentorship/time";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = { invited: "Convidado", active: "Ativo", paused: "Pausado", completed: "Concluído", cancelled: "Cancelado", draft: "Rascunho", submitted: "Aguardando revisão", in_review: "Em revisão", changes_requested: "Ajustes solicitados", approved: "Aprovada", present: "Presente", absent: "Ausente", excused: "Justificado", watched_recording: "Assistiu à gravação" };

export default async function MentorStudentPage({ params }: { params: Promise<{ cohortId: string; enrollmentId: string }> }) {
  const { cohortId, enrollmentId } = await params;
  let overview;
  try { overview = await getMentorStudentOverview(enrollmentId); } catch (error) { if (error instanceof MentorshipAccessError) redirect("/mentoria"); throw error; }
  if (!overview || overview.cohort?.id !== cohortId) notFound();

  const { cohort, enrollment, studentName, submissions, lessons, sessions, attendance, commitments } = overview;
  const pendingReviews = submissions.filter((item) => item.status === "submitted" || item.status === "in_review");
  const currentTimestamp = getCurrentTimestamp();
  const overdue = pendingReviews.filter((item) => item.submitted_at && currentTimestamp - new Date(item.submitted_at).getTime() > 72 * 60 * 60 * 1000);
  const completedLessons = lessons.filter((item) => item.status === "completed").length;
  const totalLessons = mentorshipWeeks.reduce((total, week) => total + week.lessons.length, 0);
  const attendanceBySession = new Map(attendance.map((item) => [item.session_id, item.status]));

  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
    <Link href={`/mentoria/mentor/turmas/${cohortId}`} className="inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft className="size-4" /> Voltar para {cohort.name}</Link>
    <header className="mt-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-mint">Perfil do aluno · {cohort.code}</p><h1 className="mt-3 text-4xl font-black text-off-white">{studentName}</h1><p className="mt-3 text-sm text-[#AAB2BC]">{enrollment.level === "intermediate" ? "Intermediário" : "Iniciante"} · matrícula {statusLabels[enrollment.status] ?? enrollment.status} · desde {enrollment.joined_at ? new Date(enrollment.joined_at).toLocaleDateString("pt-BR") : "ainda não iniciada"}</p></header>
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat icon={<ClipboardList className="size-5" />} label="Entregas aprovadas" value={submissions.filter((item) => item.status === "approved").length} />
      <Stat icon={<BookOpenCheck className="size-5" />} label="Aulas concluídas" value={`${completedLessons}/${totalLessons}`} />
      <Stat icon={<CalendarDays className="size-5" />} label="Encontros registrados" value={attendance.length} />
      <Stat icon={<ClipboardList className="size-5" />} label="Revisões fora do SLA" value={overdue.length} alert={overdue.length > 0} />
    </section>
    {enrollment.goal && <section className="mt-6 rounded-xl border border-white/10 bg-[#171B21] p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#8B949E]">Objetivo registrado no diagnóstico</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#D9DEE4]">{enrollment.goal}</p></section>}

    <section className="mt-6 rounded-xl border border-white/10 bg-[#171B21] p-5"><h2 className="text-lg font-black text-off-white">Compromissos semanais · visíveis ao aluno e à equipe da turma</h2>{commitments.length === 0 ? <p className="mt-2 text-sm text-[#AAB2BC]">O aluno ainda não registrou um compromisso semanal.</p> : <div className="mt-4 divide-y divide-white/10">{commitments.map((commitment) => <article key={commitment.id} className="py-4 first:pt-0 last:pb-0"><p className="text-xs font-bold uppercase tracking-[.12em] text-neon">Semana {commitment.week_number}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#D9DEE4]">{commitment.commitment}</p><CommitmentCheckIn commitmentId={commitment.id} initialCheckIn={commitment.check_in ?? ""} /></article>)}</div>}</section>

    <section className="mt-10"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black text-off-white">Entregas e revisões</h2><p className="mt-1 text-sm text-[#AAB2BC]">Histórico de tentativas, status atual e prazo de revisão de 72 horas.</p></div><span className="text-sm text-[#8B949E]">{submissions.length} tentativa(s)</span></div>
      {submissions.length === 0 ? <p className="mt-4 rounded-xl border border-white/10 bg-[#171B21] p-5 text-sm text-[#AAB2BC]">Este aluno ainda não enviou uma entrega.</p> : <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">{submissions.map((submission) => {
        const week = mentorshipWeeks.find((item) => item.assignment.key === submission.assignment_key);
        const isPending = submission.status === "submitted" || submission.status === "in_review";
        const isOverdue = isPending && submission.submitted_at && currentTimestamp - new Date(submission.submitted_at).getTime() > 72 * 60 * 60 * 1000;
        return <li key={submission.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-neon">{week ? `Semana ${week.number} · ${week.title}` : submission.assignment_key}</p><h3 className="mt-1 font-bold text-off-white">{week?.assignment.title ?? submission.assignment_key}</h3><p className="mt-1 text-sm text-[#AAB2BC]">Tentativa {submission.attempt_number} · {statusLabels[submission.status] ?? submission.status} · enviada em {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString("pt-BR") : "rascunho"}</p>{isOverdue && <p className="mt-1 text-xs font-bold text-coral">Prazo de revisão de 72 horas excedido</p>}</div>{isPending && <Link href={`/mentoria/mentor/entregas/${submission.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon">Revisar entrega <ExternalLink className="size-4" /></Link>}</li>;
      })}</ol>}
    </section>

    <section className="mt-10"><h2 className="text-2xl font-black text-off-white">Aulas e encontros</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{mentorshipWeeks.map((week) => { const completed = new Set(lessons.filter((item) => item.status === "completed").map((item) => item.lesson_key)); const done = week.lessons.filter((lesson) => completed.has(lesson.key)).length; return <article key={week.number} className="border border-white/10 bg-[#171B21] p-4"><p className="text-xs font-bold text-neon">Semana {week.number}</p><h3 className="mt-1 font-bold text-off-white">{week.title}</h3><p className="mt-2 text-sm text-[#AAB2BC]">{done} de {week.lessons.length} aulas concluídas</p></article>; })}</div>
      {sessions.length > 0 && <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">{sessions.map((session) => <li key={session.id} className="flex flex-wrap items-start justify-between gap-3 py-4"><div><p className="font-bold text-off-white">Semana {session.week_number} · {session.title}</p><p className="mt-1 text-xs text-[#AAB2BC]">{new Date(session.starts_at).toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" })}</p>{session.agenda && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#C8CFD7]">{session.agenda}</p>}{session.meeting_url && <a href={session.meeting_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-mint hover:text-neon">Abrir encontro <ExternalLink className="size-3" /></a>}</div><span className="text-sm text-[#AAB2BC]">{attendanceBySession.get(session.id) ? statusLabels[attendanceBySession.get(session.id)!] ?? attendanceBySession.get(session.id) : "Sem presença registrada"}</span></li>)}</ul>}
    </section>
  </main>;
}

function Stat({ icon, label, value, alert = false }: { icon: React.ReactNode; label: string; value: string | number; alert?: boolean }) {
  return <div className={`rounded-xl border bg-[#171B21] p-5 ${alert ? "border-coral/30" : "border-white/10"}`}><span className={alert ? "text-coral" : "text-mint"}>{icon}</span><p className="mt-4 text-xs font-bold uppercase tracking-[.16em] text-[#8B949E]">{label}</p><p className={`mt-2 text-xl font-black ${alert ? "text-coral" : "text-off-white"}`}>{value}</p></div>;
}
