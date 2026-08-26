import Link from "next/link";
import { Clock3, CircleX, CircleCheck } from "lucide-react";

export default async function BillingConfirmationPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const approved = status === "approved";
  const failed = status === "failure" || status === "rejected";
  const Icon = approved ? CircleCheck : failed ? CircleX : Clock3;
  const title = approved ? "Pagamento recebido. Estamos liberando seu acesso." : failed ? "O pagamento não foi concluído." : "Seu pagamento está sendo processado.";
  const text = approved ? "A confirmação definitiva chega pelo webhook do Mercado Pago e pode levar alguns instantes." : failed ? "Você pode voltar e tentar novamente com outro meio de pagamento." : "PIX e alguns meios de pagamento podem ficar pendentes até a confirmação.";
  return <main className="mx-auto flex min-h-[65vh] max-w-2xl items-center px-5 py-14"><section className="w-full rounded-2xl border border-white/10 bg-[#171B21] p-8 text-center"><Icon className={`mx-auto size-10 ${approved ? "text-mint" : failed ? "text-coral" : "text-neon"}`} /><h1 className="mt-5 text-3xl font-black text-off-white">{title}</h1><p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#AAB2BC]">{text}</p><Link href={failed ? "/planos" : "/labs"} className="mt-8 inline-flex h-11 items-center rounded-lg bg-neon px-5 text-sm font-black text-[#101319]">{failed ? "Voltar aos planos" : "Ir para os Labs"}</Link></section></main>;
}
