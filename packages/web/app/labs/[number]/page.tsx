import Link from "next/link";
import { notFound } from "next/navigation";
import { findLabByNumber, labs } from "@/lib/playground/catalog";

export function generateStaticParams() {
  return labs.map((lab) => ({ number: String(lab.number) }));
}

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const lab = findLabByNumber(Number(number));
  if (!lab) notFound();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/labs" className="text-sm font-bold text-mint">Voltar para labs</Link>
      <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-mint">#{lab.number} | {lab.track} | {lab.status}</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl leading-none text-off-white">{lab.title}</h1>
      <p className="mt-4 text-sm leading-7 text-[#AAB2BC]">{lab.objective}</p>
      <section className="mt-6 rounded-lg border border-white/10 bg-card p-5">
        <h2 className="font-black text-off-white">Especificacao navegavel</h2>
        <dl className="mt-4 grid gap-3 text-sm text-[#AAB2BC]">
          <div><dt className="font-bold text-off-white">Funcionalidade necessaria</dt><dd>{lab.requiredFeature}</dd></div>
          <div><dt className="font-bold text-off-white">Entrega esperada</dt><dd>{lab.delivery}</dd></div>
          <div><dt className="font-bold text-off-white">Dificuldade e tempo</dt><dd>{lab.difficulty}, {lab.minutes} minutos</dd></div>
        </dl>
        <h3 className="mt-5 font-bold text-off-white">Criterios de aceite</h3>
        <ul className="mt-2 grid gap-2 text-sm text-[#AAB2BC]">{lab.acceptanceCriteria.map((item) => <li key={item}>- {item}</li>)}</ul>
        <pre className="mt-5 whitespace-pre-wrap rounded-lg bg-[#101319] p-4 text-xs leading-5 text-[#DDE6EE]">{lab.postPrompt}</pre>
      </section>
    </div>
  );
}
