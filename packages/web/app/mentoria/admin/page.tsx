import { redirect } from "next/navigation";
import { CalendarDays, ClipboardList, GraduationCap, Users } from "lucide-react";
import { CohortAdminForm, EnrollmentAdminForm, LiveSessionAdminForm } from "@/components/mentorship/admin-actions";
import { CohortMetrics } from "@/components/mentorship/cohort-metrics";
import { AdminManagement } from "@/components/mentorship/admin-management";
import { AdmissionsAdmin } from "@/components/mentorship/admissions-admin";
import { mentorshipWeeks } from "@/lib/mentorship/catalog";
import { MentorshipAccessError, requireStaff } from "@/lib/mentorship/access";
import { getMentorshipAdminOverview } from "@/lib/mentorship/store";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin da mentoria | QA Lab" };

export default async function MentorshipAdminPage() {
  try { await requireStaff("admin"); } catch (error) { if (error instanceof MentorshipAccessError) redirect("/mentoria"); throw error; }
  const overview = await getMentorshipAdminOverview();
  const admin = createAdminClient();
  const [offerResult, applicationResult, orderResult] = await Promise.all([
    admin.from("mentorship_offers").select("id,cohort_id,offer_code,title,summary,price,enrollment_opens_at,enrollment_closes_at,support_contact,terms,cancellation_policy,published,version").order("created_at", { ascending: false }).limit(100),
    admin.from("mentorship_applications").select("id,user_id,cohort_id,status,offer_id,created_at,decision_note,payment_reference").in("status", ["requested","awaiting_payment","waitlisted"]).order("created_at", { ascending: true }).limit(200),
    admin.from("mentorship_orders").select("id,user_id,cohort_id,status,payment_status,amount,currency,mercado_pago_payment_id,created_at,reservation_expires_at").order("created_at", { ascending: false }).limit(200),
  ]);
  const peopleById = new Map(overview.people.map((person) => [person.id, person]));
  const offers = offerResult.data ?? [];
  const applications = (applicationResult.data ?? []).map((application) => ({ ...application, person: peopleById.get(application.user_id) ?? { fullName: application.user_id, email: "" } }));
  const orders = (orderResult.data ?? []).map((order) => ({
    ...order,
    person: peopleById.get(order.user_id) ?? { fullName: order.user_id, email: "" },
    cohort: overview.cohorts.find((cohort) => cohort.id === order.cohort_id) ?? { name: "Turma" },
  }));
  const cohortNames = new Map(overview.cohorts.map((cohort) => [cohort.id, cohort.name]));
  const enrollmentById = new Map(overview.enrollments.map((enrollment) => [enrollment.id, enrollment]));
  const pendingSubmissions = overview.submissions.filter((submission) => ["submitted", "in_review", "changes_requested"].includes(submission.status));
  const activeEnrollments = overview.enrollments.filter((enrollment) => ["invited", "active", "paused"].includes(enrollment.status));
  return <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><header><p className="text-xs font-bold uppercase tracking-[.2em] text-mint">Administracao</p><h1 className="mt-3 text-4xl font-black text-off-white">Operacao completa da mentoria</h1><p className="mt-3 max-w-3xl text-[#AAB2BC]">Acompanhe turmas, alunos, entregas e encontros em um unico lugar. O conteudo das aulas continua no catalogo versionado e recebe os links reais quando as gravacoes forem produzidas.</p></header><section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat icon={<Users className="size-5" />} label="Turmas" value={overview.cohorts.length} /><Stat icon={<GraduationCap className="size-5" />} label="Alunos no fluxo" value={activeEnrollments.length} /><Stat icon={<ClipboardList className="size-5" />} label="Entregas pendentes" value={pendingSubmissions.length} /><Stat icon={<CalendarDays className="size-5" />} label="Encontros publicados" value={overview.sessions.length} /></section><CohortMetrics metrics={overview.cohortMetrics} emailQueue={overview.emailQueue} /><section className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-[#171B21] p-6"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-mint">Visao geral</p><h2 className="mt-2 text-2xl font-black text-off-white">Turmas e progresso</h2></div></div>{overview.cohorts.length === 0 ? <p className="mt-5 text-sm text-[#AAB2BC]">Nenhuma turma criada ainda.</p> : <table className="mt-5 w-full min-w-[850px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-[.14em] text-[#8B949E]"><tr><th className="pb-3 pr-4">Turma</th><th className="pb-3 pr-4">Periodo</th><th className="pb-3 pr-4">Status</th><th className="pb-3 pr-4">Capacidade</th><th className="pb-3 pr-4">Alunos</th><th className="pb-3">Entregas aprovadas</th></tr></thead><tbody>{overview.cohorts.map((cohort) => { const students = overview.enrollments.filter((enrollment) => enrollment.cohort_id === cohort.id); const enrollmentIds = new Set(students.map((student) => student.id)); const approved = overview.submissions.filter((submission) => enrollmentIds.has(submission.enrollment_id) && submission.status === "approved").length; return <tr key={cohort.id} className="border-b border-white/[.06] last:border-0"><td className="py-4 pr-4"><p className="font-bold text-off-white">{cohort.name}</p><p className="mt-1 font-mono text-xs text-[#8B949E]">{cohort.code}</p></td><td className="py-4 pr-4 text-[#AAB2BC]">{cohort.starts_on} → {cohort.ends_on}</td><td className="py-4 pr-4 text-[#D9DEE4]">{cohort.status}</td><td className="py-4 pr-4 text-[#AAB2BC]">{students.length}/{cohort.capacity}</td><td className="py-4 pr-4 text-[#AAB2BC]">{students.filter((student) => ["active", "paused"].includes(student.status)).length} ativos</td><td className="py-4 text-[#AAB2BC]">{approved}</td></tr>; })}</tbody></table>}</section><AdmissionsAdmin cohorts={overview.cohorts} offers={offers} applications={applications} orders={orders} /><section className="mt-10 grid gap-6 lg:grid-cols-2"><CohortAdminForm /><EnrollmentAdminForm cohorts={overview.cohorts} people={overview.people} /><LiveSessionAdminForm cohorts={overview.cohorts} /></section><AdminManagement cohorts={overview.cohorts} people={overview.people} enrollments={overview.enrollments} mentorLinks={overview.cohortStaff} sessions={overview.sessions} lessons={mentorshipWeeks.flatMap((week) => week.lessons.map((lesson) => ({ key: lesson.key, title: lesson.title, week: week.number })))} lessonContent={overview.lessonContent} /></main>;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div className="rounded-xl border border-white/10 bg-[#171B21] p-5"><span className="text-mint">{icon}</span><p className="mt-4 text-xs font-bold uppercase tracking-[.16em] text-[#8B949E]">{label}</p><p className="mt-2 text-2xl font-black text-off-white">{value}</p></div>; }
