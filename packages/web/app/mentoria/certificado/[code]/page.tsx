import { notFound } from "next/navigation";
import { Award, BadgeCheck } from "lucide-react";
import { mentorshipWeeks } from "@/lib/mentorship/catalog";
import { getMentorshipCertificateByCode } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";

export default async function MentorshipCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const certificate = await getMentorshipCertificateByCode(code);
  if (!certificate) notFound();
  const requiredLessons = mentorshipWeeks.reduce((total, week) => total + week.lessons.length, 0);

  return <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20"><article className="relative overflow-hidden border border-mint/30 bg-[#171B21] p-7 sm:p-12"><div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon via-mint to-neon" /><div className="flex items-center gap-3 text-mint"><Award className="size-7" /><p className="text-xs font-black uppercase tracking-[.2em]">QA Lab · Mentoria</p></div><p className="mt-10 text-sm text-[#AAB2BC]">Certificamos que</p><h1 className="mt-2 text-3xl font-black tracking-tight text-off-white sm:text-5xl">{certificate.holder_name}</h1><p className="mt-5 max-w-2xl text-base leading-8 text-[#D9DEE4]">concluiu a Mentoria QA Lab, demonstrando competências em testes manuais, automação, CI/CD e performance por meio das entregas avaliadas.</p><dl className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2"><div className="bg-[#101319] p-4"><dt className="text-xs text-[#8B949E]">Turma</dt><dd className="mt-1 font-bold text-off-white">{certificate.cohort_name}</dd></div><div className="bg-[#101319] p-4"><dt className="text-xs text-[#8B949E]">Emitido em</dt><dd className="mt-1 font-bold text-off-white"><time dateTime={certificate.issued_at}>{new Date(certificate.issued_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" })}</time></dd></div><div className="bg-[#101319] p-4"><dt className="text-xs text-[#8B949E]">Entregas aprovadas</dt><dd className="mt-1 font-bold text-off-white">{certificate.approved_assignments} de 12</dd></div><div className="bg-[#101319] p-4"><dt className="text-xs text-[#8B949E]">Aulas concluídas</dt><dd className="mt-1 font-bold text-off-white">{certificate.completed_lessons} de {requiredLessons}</dd></div></dl><div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5"><div className="flex items-center gap-2 text-sm font-bold text-mint"><BadgeCheck className="size-5" /> Certificado verificável</div><p className="font-mono text-xs text-[#AAB2BC]">{certificate.code}</p></div></article><p className="mt-5 text-center text-xs leading-5 text-[#8B949E]">A emissão exige 12 entregas aprovadas e conclusão das aulas do programa. Este código identifica o registro público do certificado.</p></main>;
}
