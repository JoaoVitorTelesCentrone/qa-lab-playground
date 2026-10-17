import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Inbox } from "lucide-react";
import { AttendanceForm } from "@/components/mentorship/mentorship-actions";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { attendanceOptions, mentorCohorts, mentorQueue } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Fila do mentor | QA Lab" };

export default async function MentorshipMentorPage() {
  let queue;
  let options;
  let cohorts;
  try { [queue, options, cohorts] = await Promise.all([mentorQueue(), attendanceOptions(), mentorCohorts()]); } catch (error) { if (error instanceof MentorshipAccessError) redirect("/mentoria"); throw error; }
  const overdue = queue.submissions.filter((item) => item.sla.state === "overdue");
  const dueSoon = queue.submissions.filter((item) => item.sla.state === "due_soon");

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <header><p className="text-xs font-bold uppercase tracking-[.2em] text-mint">Operação da mentoria</p><h1 className="mt-3 text-4xl font-black text-off-white">Fila de revisões</h1><p className="mt-3 text-[#AAB2BC]">Entregas pendentes em ordem de chegada. O prazo de resposta é de até 72 horas.</p></header>
    <section aria-label="Resumo do SLA" className="mt-7 grid gap-4 sm:grid-cols-3">
      <Stat label="Aguardando revisão" value={queue.submissions.length} />
      <Stat label="Vencem em até 24h" value={dueSoon.length} />
      <Stat label="Fora do prazo" value={overdue.length} alert={overdue.length > 0} />
    </section>
    {overdue.length > 0 && <p role="status" className="mt-4 flex items-start gap-2 border border-coral/30 bg-coral/5 p-4 text-sm leading-6 text-coral"><AlertTriangle className="mt-0.5 size-4 shrink-0" />{overdue.length} entrega(s) passaram do prazo de 72 horas. Elas aparecem primeiro na fila.</p>}

    {cohorts.length > 0 && <section className="mt-8 rounded-2xl border border-white/10 bg-[#171B21] p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-mint">Turmas</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{cohorts.map((cohort) => <Link key={cohort.id} href={`/mentoria/mentor/turmas/${cohort.id}`} className="rounded-xl border border-white/10 bg-[#101319] p-4 transition hover:border-mint/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"><p className="font-bold text-off-white">{cohort.name}</p><p className="mt-1 text-xs text-[#8B949E]">{cohort.code} · {cohort.status}</p></Link>)}</div></section>}

    <section className="mt-8 grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
      <AttendanceForm sessions={options.sessions} enrollments={options.enrollments} />
      <div className="rounded-2xl border border-white/10 bg-[#171B21] p-6">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-black text-off-white">Entregas para revisar</h2><p className="mt-1 text-sm text-[#AAB2BC]">As mais antigas e atrasadas ficam no topo.</p></div><span className="text-xs text-[#8B949E]">{queue.submissions.length} pendente(s)</span></div>
        {queue.submissions.length === 0 ? <div className="py-12 text-center"><Inbox className="mx-auto size-8 text-[#69737E]" /><p className="mt-4 font-bold text-off-white">Nenhuma entrega na fila</p><p className="mt-2 text-sm text-[#AAB2BC]">Quando um aluno enviar uma atividade, ela aparecerá aqui.</p></div> : <ul className="mt-5 grid gap-3">{queue.submissions.map((submission) => {
          const state = submission.sla.state;
          const slaLabel = state === "overdue" ? `${Math.abs(submission.sla.hoursRemaining ?? 0)}h de atraso` : state === "due_soon" ? `vence em ${submission.sla.hoursRemaining}h` : submission.sla.hoursRemaining === null ? "sem prazo" : `${submission.sla.hoursRemaining}h restantes`;
          const slaClass = state === "overdue" ? "border-coral/30 bg-coral/5 text-coral" : state === "due_soon" ? "border-yellow-300/30 bg-yellow-300/5 text-yellow-200" : "border-mint/20 bg-mint/5 text-mint";
          return <li key={submission.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#101319] p-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold uppercase tracking-[.14em] text-neon">{submission.status === "in_review" ? "Em revisão" : "Nova entrega"}</span><span className={`border px-2 py-1 text-[11px] font-bold ${slaClass}`}>{slaLabel}</span></div><p className="mt-2 font-bold text-off-white">{submission.studentName} · {submission.cohortName}</p><p className="mt-1 text-sm text-[#D9DEE4]">{submission.weekTitle}</p><p className="mt-1 text-xs text-[#AAB2BC]">Tentativa {submission.attemptNumber} · enviada em {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString("pt-BR") : "sem data"}</p></div><Link href={`/mentoria/mentor/entregas/${submission.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon">Abrir revisão <ArrowRight className="size-4" /></Link></li>;
        })}</ul>}
      </div>
    </section>
  </main>;
}

function Stat({ label, value, alert = false }: { label: string; value: number; alert?: boolean }) {
  return <div className={`border bg-[#171B21] p-5 ${alert ? "border-coral/30" : "border-white/10"}`}><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8B949E]">{label}</p><p className={`mt-2 text-2xl font-black ${alert ? "text-coral" : "text-off-white"}`}>{value}</p></div>;
}
