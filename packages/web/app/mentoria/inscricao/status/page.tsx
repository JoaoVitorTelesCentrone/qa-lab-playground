import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderStatus } from "@/components/mentorship/admission-actions";
import { getSessionUser } from "@/lib/product/store";

export const metadata = { title: "Estado do pagamento | Mentoria QA Lab", robots: { index: false, follow: false } };

export default async function MentorshipOrderStatusPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const [{ order }, user] = await Promise.all([searchParams, getSessionUser()]);
  if (!order || !/^[0-9a-f-]{36}$/i.test(order)) redirect("/mentoria/inscricao");
  if (!user) redirect(`/login?next=${encodeURIComponent(`/mentoria/inscricao/status?order=${order}`)}`);
  return <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20"><Link href="/mentoria" className="text-sm font-semibold text-mint hover:underline">Mentoria QA Lab</Link><section className="mt-7 border border-white/10 bg-[#171B21] p-6 sm:p-9"><p className="text-xs font-bold text-mint">Inscrição da mentoria</p><h1 className="mt-3 text-3xl font-black text-off-white">Acompanhe sua vaga</h1><p className="mt-3 text-sm leading-6 text-[#AAB2BC]">O Mercado Pago confirma o pagamento diretamente com o QA Lab. Esta página consulta o estado registrado para sua conta.</p><OrderStatus orderId={order} /></section></main>;
}
