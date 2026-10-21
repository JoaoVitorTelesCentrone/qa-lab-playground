import { redirect } from "next/navigation";
import { DiagnosticForm } from "@/components/mentorship/mentorship-actions";
import { getEnrollmentForUser } from "@/lib/mentorship/access";
import { getSessionUser } from "@/lib/product/store";

export const metadata = { title: "Diagnostico | Mentoria QA Lab" };

export default async function MentorshipDiagnosticPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/mentoria/diagnostico");
  const enrollment = await getEnrollmentForUser(user.id);
  if (!enrollment || enrollment.status !== "active") redirect("/mentoria/app");
  return <main className="mx-auto max-w-2xl px-5 py-14 sm:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-mint">Primeiro passo</p><h1 className="mt-4 text-4xl font-black text-off-white">Vamos ajustar sua jornada.</h1><p className="mt-4 text-base leading-7 text-[#AAB2BC]">O diagnostico define a profundidade das entregas. Ele nao e uma prova: serve para registrar onde voce esta e o que quer construir.</p><section className="mt-8 rounded-2xl border border-white/10 bg-[#171B21] p-6"><DiagnosticForm /></section></main>;
}
