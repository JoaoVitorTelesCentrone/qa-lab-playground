import { ArrowUpRight, Check, ChevronDown, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { brotoSpaceSite, type BrotoSpaceWeek } from "@/lib/mentorship/brotospace-track";

export function BrotoSpacePractice({ week }: { week: BrotoSpaceWeek }) {
  return <article className="mt-8 border border-neon/25 bg-neon/[.04] p-6 sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="text-xl font-black text-off-white">{week.surface}</h3>
        <p className="mt-1 text-sm text-[#AAB2BC]">Broto Space · {week.estimatedMinutes} min</p>
      </div>
      <a href={brotoSpaceSite.url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 text-sm font-bold text-neon hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">Abrir o Broto <ArrowUpRight aria-hidden="true" className="size-4" /></a>
    </div>

    <p className="mt-4 text-sm leading-6 text-[#C8CFD7]">Use o mesmo caso fictício das aulas. <Link href="/conteudo/broto" className="font-bold text-mint underline underline-offset-4 hover:text-neon">Preparar conta, dados e evidência</Link>.</p>

    <section className="mt-6 border-y border-white/10 py-5">
      <h4 className="font-black text-off-white">Missão</h4>
      <p className="mt-2 max-w-[68ch] text-sm leading-6 text-[#D9DEE4]">{week.objective}</p>
    </section>

    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
      <section>
        <h4 className="font-black text-off-white">Faça</h4>
        <ol className="mt-3 grid gap-3">{week.tasks.map((task, index) => <li key={task} className="grid grid-cols-[20px_1fr] text-sm leading-6 text-[#C8CFD7]"><span className="font-bold tabular-nums text-neon">{index + 1}.</span>{task}</li>)}</ol>
      </section>
      <section className="border-t border-neon/20 pt-4 lg:border-t-0 lg:pt-0">
        <div className="flex items-center gap-2"><FileText aria-hidden="true" className="size-4 text-neon" /><h4 className="font-black text-off-white">Entregue</h4></div>
        <p className="mt-2 text-sm leading-6 text-[#C8CFD7]">{week.evidence}</p>
        <h4 className="mt-5 text-sm font-black text-off-white">Concluído quando</h4>
        <ul className="mt-2 grid gap-2">{week.acceptanceCriteria.map((criterion) => <li key={criterion} className="flex items-start gap-2 text-sm leading-6 text-[#AAB2BC]"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-mint" />{criterion}</li>)}</ul>
      </section>
    </div>

    <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#AAB2BC]"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-mint" /><span>{week.safety}</span></p>

    <details className="group mt-5 border-t border-white/10 pt-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint [&::-webkit-details-marker]:hidden">Se quiser aprofundar<ChevronDown aria-hidden="true" className="size-4 text-neon transition-transform group-open:rotate-180" /></summary>
      <div className="mt-4 grid gap-5 text-sm leading-6 sm:grid-cols-2">
        <div><h5 className="font-bold text-mint">Para começar</h5><p className="mt-1 text-[#C8CFD7]">{week.beginner}</p></div>
        <div><h5 className="font-bold text-neon">Desafio extra</h5><p className="mt-1 text-[#C8CFD7]">{week.intermediate}</p></div>
      </div>
      <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-[#C8CFD7]"><strong className="text-off-white">Pergunta para investigar:</strong> {week.question}</p>
      <p className="mt-3 text-sm leading-6 text-[#AAB2BC]">{week.scenario}</p>
    </details>
  </article>;
}
