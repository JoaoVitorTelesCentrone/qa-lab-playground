import { redirect } from "next/navigation";
import { CalendarDays, ExternalLink, PlayCircle } from "lucide-react";
import { MentorshipNav } from "@/components/mentorship/mentorship-nav";
import { WeeklyCommitmentForm } from "@/components/mentorship/mentorship-actions";
import { getMentorshipDashboard } from "@/lib/mentorship/store";
import { orderSessions, type MentorshipSession } from "@/lib/mentorship/sessions";
import { getCurrentTimestamp } from "@/lib/mentorship/time";
import { getSessionUser } from "@/lib/product/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Encontros da turma | Mentoria QA Lab", robots: { index: false, follow: false } };

const date = (value: string) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(value));

function Session({ session, past }: { session: MentorshipSession; past: boolean }) {
  return <article id={`encontro-${session.id}`} className="min-w-0 scroll-mt-24 border-t border-white/15 py-6">
    <p className="text-sm font-semibold text-mint">Semana {session.week_number}</p>
    <h3 className="mt-2 break-words text-xl font-bold text-off-white">{session.title}</h3>
    <p className="mt-2 text-sm leading-6 text-[#AAB2BC]"><time dateTime={session.starts_at}>{date(session.starts_at)}</time> · Horário de Brasília</p>
    {session.agenda && <p className="mt-4 max-w-[70ch] whitespace-pre-wrap break-words text-base leading-7 text-[#C8CFD7]">{session.agenda}</p>}
    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
      {!past && session.meeting_url && <a href={session.meeting_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-mint underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint">Entrar no encontro<ExternalLink aria-hidden="true" className="size-4" /></a>}
      {session.recording_url && <a href={session.recording_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-mint underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint"><PlayCircle aria-hidden="true" className="size-4" />Assistir gravação<span className="sr-only">: {session.title}</span></a>}
    </div>
    {past && !session.recording_url && <p className="mt-2 text-sm text-[#AAB2BC]">A gravação não está disponível. Consulte o mentor para retomar os pontos do encontro.</p>}
    {session.recording_url && session.recording_available_until && <p className="mt-2 text-sm text-[#AAB2BC]">Gravação disponível até {date(session.recording_available_until)}.</p>}
  </article>;
}

export default async function MentorshipSessionsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/mentoria/encontros");
  // Dashboard scopes sessions to the authenticated student's own cohort.
  const dashboard = await getMentorshipDashboard(user.id);
  if (!dashboard) redirect("/mentoria/app");
  const { upcoming, past } = orderSessions(dashboard.sessions, getCurrentTimestamp());
  const active = dashboard.enrollment.status === "active";
  const commitmentSession = upcoming[0];
  const commitment = dashboard.commitments.find((item) => item.week_number === commitmentSession?.week_number);

  return <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
    <MentorshipNav current="/mentoria/encontros" />
    <header className="mt-7 max-w-[70ch]"><p className="text-sm font-semibold text-mint">{dashboard.cohort?.name ?? "Sua turma"}</p><h1 className="mt-2 text-3xl font-black text-off-white sm:text-4xl">Encontros e gravações</h1><p className="mt-4 text-base leading-7 text-[#C8CFD7]">Confira a agenda, prepare suas perguntas e retome o que foi discutido com o mentor. Todos os horários seguem o fuso de Brasília.</p></header>
    <section aria-labelledby="upcoming-heading" className="mt-10"><h2 id="upcoming-heading" className="mb-4 flex items-center gap-2 text-2xl font-bold text-off-white"><CalendarDays aria-hidden="true" className="size-5 shrink-0 text-mint" />Próximos encontros</h2>{upcoming.length ? upcoming.map((session) => <Session key={session.id} session={session} past={false} />) : <p className="border-t border-white/15 py-6 text-base leading-7 text-[#AAB2BC]">Nenhum encontro futuro foi publicado. Você pode continuar estudando e consultar as gravações abaixo.</p>}</section>
    {commitmentSession && <section aria-labelledby="commitment-heading" className="mt-8 border-t border-white/15 pt-6"><h2 id="commitment-heading" className="text-xl font-bold text-off-white">Prepare o encontro da semana {commitmentSession.week_number}</h2><p className="mt-3 max-w-[70ch] text-base leading-7 text-[#C8CFD7]">Registre uma ação ou dúvida para conversar com o mentor. Seu compromisso fica restrito a você e à equipe da turma.</p><div className="mt-5">{active ? <WeeklyCommitmentForm key={commitmentSession.week_number} weekNumber={commitmentSession.week_number} initialValue={commitment?.commitment} /> : <p className="whitespace-pre-wrap text-base leading-7 text-[#AAB2BC]">{commitment?.commitment ?? "Nenhum compromisso registrado."} Sua matrícula permite consultar o histórico; novas entregas estão desabilitadas.</p>}</div></section>}
    <section aria-labelledby="past-heading" className="mt-12"><h2 id="past-heading" className="mb-4 text-2xl font-bold text-off-white">Encontros anteriores</h2>{past.length ? past.map((session) => <Session key={session.id} session={session} past />) : <p className="border-t border-white/15 py-6 text-base leading-7 text-[#AAB2BC]">Os encontros realizados aparecerão aqui. As gravações ficam disponíveis quando publicadas pela equipe.</p>}</section>
  </main>;
}
