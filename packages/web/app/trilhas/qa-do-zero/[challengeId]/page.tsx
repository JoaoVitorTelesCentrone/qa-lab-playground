import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { RoadmapChallengeClient } from "@/components/roadmap/roadmap-challenge-client";
import { challengeInstructions, findQaDoZeroChallenge } from "@/lib/roadmap/qa-do-zero";
import { roadmapTypeLabel } from "@/lib/roadmap/labels";

export const dynamic = "force-dynamic";
export default async function QaDoZeroChallengePage({ params }: { params: Promise<{ challengeId: string }> }) {
  const challenge = findQaDoZeroChallenge((await params).challengeId);
  if (!challenge) notFound();

  const instructions = challengeInstructions(challenge);

  return <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
    <Link href="/trilhas/qa-do-zero" className="inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft className="size-4" /> Voltar para QA do Zero</Link>

    <header className="mt-8">
      <p className="text-xs font-bold uppercase tracking-[.14em] text-mint">{challenge.module} · desafio {String(challenge.order).padStart(2, "0")}</p>
      <p className="mt-2 text-xs font-black tracking-wide text-neon">{roadmapTypeLabel(challenge.type)}</p>
      <h1 className="mt-2 text-3xl font-black text-off-white sm:text-5xl">{challenge.title}</h1>
    </header>

    <section className="mt-8">
      <h2 className="text-sm font-bold text-mint">Contexto</h2>
      <p className="mt-2 text-base leading-7 text-[#D9DEE4]">{challenge.context}</p>

      <div className="mt-6 border-t border-white/10 pt-6">
        <h2 className="text-lg font-black text-off-white">Sua missão</h2>
        <p className="mt-2 text-base leading-7 text-[#D9DEE4]">{challenge.prompt}</p>
      </div>

      <div className="mt-6 rounded-xl border border-mint/20 bg-mint/[.05] p-5">
        <h2 className="text-sm font-bold text-mint">O que entregar</h2>
        <p className="mt-2 text-sm leading-6 text-[#D9DEE4]">{challenge.deliverable}</p>
      </div>
    </section>

    <details className="mt-8 rounded-xl border border-white/10 bg-[#171B21] p-5">
      <summary className="cursor-pointer text-sm font-bold text-off-white">Ver roteiro sugerido</summary>
      <ol className="mt-4 grid gap-3 border-t border-white/10 pt-4">
        {instructions.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#AAB2BC]"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/10 font-mono text-xs font-black text-mint">{index + 1}</span>{item}</li>)}
      </ol>
    </details>

    <section className="mt-8">
      <h2 className="text-lg font-black text-off-white">Confira sua resposta</h2>
      <div className="mt-4 grid gap-3">
        {challenge.rubric.map((item) => <p key={item} className="flex gap-3 text-sm leading-6 text-[#AAB2BC]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-neon" />{item}</p>)}
      </div>
    </section>

    <RoadmapChallengeClient challenge={challenge} />
    <Link href="/trilhas/qa-do-zero" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft className="size-4" /> Voltar aos desafios</Link>
  </main>;
}
