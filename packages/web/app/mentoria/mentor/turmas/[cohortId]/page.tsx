import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, AlertTriangle, CheckCircle2, ClipboardList, Users } from "lucide-react";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { getMentorCohortOverview } from "@/lib/mentorship/store";
import { getCurrentTimestamp } from "@/lib/mentorship/time";

export const dynamic = "force-dynamic";
export const metadata = { title: "Acompanhamento da turma | QA Lab" };

export default async function MentorCohortPage({ params }: { params: Promise<{ cohortId: string }> }) {
  const { cohortId } = await params;
  let overview;
  try { overview = await getMentorCohortOverview(cohortId); } catch (error) { if (error instanceof MentorshipAccessError) redirect("/mentoria"); throw error; }
  if (!overview) notFound();
  const { cohort, enrollments, submissions, lessons, sessions, attendance } = overview;
  const pendingReviews = submissions.filter((item) => item.status === "submitted" || item.status === "in_review");
  const currentTimestamp = getCurrentTimestamp();
  const overdueReviews = pendingReviews.filter((item) => item.submitted_at && currentTimestamp - new Date(item.submitted_at).getTime() > 72 * 60 * 60 * 1000);

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <Link href="/mentoria/mentor" className="inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft className="size-4" /> Voltar para operação</Link>
    <header className="mt-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-mint">Acompanhamento da turma</p><h1 className="mt-3 text-4xl font-black text-off-white">{cohort.name}</h1><p className="mt-3 text-[#AAB2BC]">{cohort.code} · {enrollments.length} aluno(s) · {sessions.length} encontro(s) publicado(s)</p></header>
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat icon={<Users className="size-5" />} label="Alunos ativos" value={enrollments.filter((item) => item.status === "active").length} />
      <Stat icon={<ClipboardList className="size-5" />} label="Entregas aprovadas" value={submissions.filter((item) => item.status === "approved").length} />
      <Stat icon={<CheckCircle2 className="size-5" />} label="Presenças registradas" value={attendance.length} />
      <Stat icon={<AlertTriangle className="size-5" />} label="Revisões fora do SLA (72h)" value={overdueReviews.length} alert={overdueReviews.length > 0} />
    </section>
    <section className="mt-8 rounded-2xl border border-white/10 bg-[#171B21] p-6"><h2 className="text-lg font-black text-off-white">Agenda e pauta</h2>{sessions.length === 0 ? <p className="mt-2 text-sm text-[#AAB2BC]">Ainda não há encontros publicados para esta turma.</p> : <ol className="mt-4 divide-y divide-white/10">{sessions.map((session) => <li key={session.id} className="flex flex-wrap items-start justify-between gap-4 py-4"><div><p className="font-bold text-off-white">Semana {session.week_number} · {session.title}</p><p className="mt-1 text-sm text-[#AAB2BC]">{new Date(session.starts_at).toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short" })}</p>{session.agenda && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#C8CFD7]">{session.agenda}</p>}</div>{session.meeting_url && <a href={session.meeting_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-mint hover:text-neon">Abrir encontro</a>}</li>)}</ol>}</section>
    <section className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-[#171B21] p-6">
      <div className="mb-5"><h2 className="text-lg font-black text-off-white">Alunos da turma</h2><p className="mt-1 text-sm text-[#AAB2BC]">Abra um perfil para acompanhar entregas, aulas e encontros ao vivo.</p></div>
      <table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-[.14em] text-[#8B949E]"><tr><th className="pb-3 pr-4">Aluno</th><th className="pb-3 pr-4">Nível</th><th className="pb-3 pr-4">Diagnóstico</th><th className="pb-3 pr-4">Aulas</th><th className="pb-3 pr-4">Entregas</th><th className="pb-3">Ao vivo</th></tr></thead>
        <tbody>{enrollments.map((enrollment) => {
          const studentSubmissions = submissions.filter((item) => item.enrollment_id === enrollment.id);
          const studentLessons = lessons.filter((item) => item.enrollment_id === enrollment.id && item.status === "completed");
          const studentAttendance = attendance.filter((item) => item.enrollment_id === enrollment.id);
          const pending = studentSubmissions.filter((item) => item.status === "submitted" || item.status === "in_review");
          const overdue = pending.some((item) => item.submitted_at && currentTimestamp - new Date(item.submitted_at).getTime() > 72 * 60 * 60 * 1000);
          return <tr key={enrollment.id} className="border-b border-white/[.06] last:border-0">
            <td className="py-4 pr-4"><Link href={`/mentoria/mentor/turmas/${cohort.id}/alunos/${enrollment.id}`} className="font-bold text-mint hover:text-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">{enrollment.full_name}<span className="mt-1 block font-mono text-[10px] text-[#65707D]">{enrollment.user_id.slice(0, 8)}…</span></Link></td>
            <td className="py-4 pr-4 text-[#D9DEE4]">{enrollment.level === "intermediate" ? "Intermediário" : "Iniciante"}</td>
            <td className="py-4 pr-4 text-[#AAB2BC]">{Object.keys(enrollment.diagnostic_score ?? {}).length ? "Concluído" : "Pendente"}</td>
            <td className="py-4 pr-4 text-[#AAB2BC]">{studentLessons.length}</td>
            <td className="py-4 pr-4 text-[#AAB2BC]">{studentSubmissions.filter((item) => item.status === "approved").length} aprovadas · {pending.length} aguardando{overdue && <span className="ml-2 text-coral">Fora do SLA</span>}</td>
            <td className="py-4 text-[#AAB2BC]">{studentAttendance.length} registro(s)</td>
          </tr>;
        })}</tbody>
      </table>
    </section>
  </main>;
}

function Stat({ icon, label, value, alert = false }: { icon: React.ReactNode; label: string; value: number; alert?: boolean }) {
  return <div className={`rounded-xl border bg-[#171B21] p-5 ${alert ? "border-coral/30" : "border-white/10"}`}><span className={alert ? "text-coral" : "text-mint"}>{icon}</span><p className="mt-4 text-xs font-bold uppercase tracking-[.16em] text-[#8B949E]">{label}</p><p className={`mt-2 text-xl font-black ${alert ? "text-coral" : "text-off-white"}`}>{value}</p></div>;
}
