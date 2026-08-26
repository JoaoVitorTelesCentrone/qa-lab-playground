import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, FlaskConical, MapPin } from "lucide-react";
import { RoadmapChallengeClient } from "@/components/roadmap/roadmap-challenge-client";
import { findFullRoadmapChallenge } from "@/lib/roadmap/full-catalog.generated";
import { challengeInstructions } from "@/lib/roadmap/qa-do-zero";
import { getBaseChallengeContent } from "@/lib/roadmap/base-content";
import { getFundamentalsContent } from "@/lib/roadmap/fundamentals-content";
import { getRealLifeContent } from "@/lib/roadmap/real-life-content";
import { getAdvancedContent } from "@/lib/roadmap/advanced-content";
import { getChallengeMeta } from "@/lib/roadmap/challenge-meta";
import { roadmapLabel, roadmapTypeLabel } from "@/lib/roadmap/labels";
import { getPracticeAssignment } from "@/lib/roadmap/practice-assignment";

export const dynamic = "force-dynamic";

export default async function FullRoadmapChallengePage({ params }: { params: Promise<{ challengeId: string }> }) {
  const challenge = findFullRoadmapChallenge((await params).challengeId);
  if (!challenge) notFound();
  const instructions = challengeInstructions(challenge);
  const enriched = getBaseChallengeContent(challenge.order) ?? getFundamentalsContent(challenge.module) ?? getRealLifeContent(challenge.module) ?? getAdvancedContent(challenge.module);
  const meta = getChallengeMeta(challenge.module, challenge.type);
  const practice = getPracticeAssignment(challenge);

  return <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
    <Link href="/trilhas/roadmap" className="inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft className="size-4" /> Voltar para o roadmap</Link>

    <header className="mt-8">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-mint">{roadmapLabel(challenge.module)} · desafio {String(challenge.order).padStart(3, "0")}</p>
      <p className="mt-3 text-xs font-black tracking-[.16em] text-neon">{roadmapTypeLabel(challenge.type)}</p>
      <h1 className="mt-3 text-3xl font-black text-off-white sm:text-5xl">{roadmapLabel(challenge.title)}</h1>
    </header>

    <section className="mt-8 overflow-hidden rounded-3xl border border-neon/30 bg-[#151A20]">
      <div className="border-b border-neon/20 bg-neon/[.06] p-5 sm:p-6">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-neon"><FlaskConical className="size-4" /> Comece aqui</p>
        <h2 className="mt-2 text-2xl font-black text-off-white">Faça estas três etapas</h2>
      </div>
      <div className="grid gap-0 divide-y divide-white/10">
        <div className="p-5 sm:p-6"><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-mint"><MapPin className="size-4" /> 1. Onde fazer</p><div className="mt-3 flex flex-wrap items-center justify-between gap-4"><p className="text-lg font-black text-off-white">{practice.environment}</p><Link href={practice.route} className="inline-flex h-11 items-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]">Abrir ambiente <ArrowRight className="size-4" /></Link></div></div>
        <div className="p-5 sm:p-6"><p className="text-xs font-black uppercase tracking-[.14em] text-mint">2. O que fazer</p><p className="mt-3 text-base font-semibold leading-7 text-[#D9DEE4]">{challenge.prompt}</p></div>
        <div className="p-5 sm:p-6"><p className="text-xs font-black uppercase tracking-[.14em] text-mint">3. O que entregar</p><p className="mt-3 text-base leading-7 text-[#D9DEE4]">{practice.evidence}</p></div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 bg-[#101319]/70 px-5 py-4 text-xs text-[#AAB2BC] sm:px-6"><span className="flex items-center gap-2"><Clock3 className="size-4 text-mint" /> {meta.time}</span><span><strong className="text-off-white">Ferramentas:</strong> {meta.tools}</span></div>
    </section>

    <details className="mt-5 rounded-2xl border border-white/10 bg-[#171B21] p-5">
      <summary className="cursor-pointer text-sm font-black text-off-white">Ver preparação e passos detalhados</summary>
      <div className="mt-5 grid gap-6 border-t border-white/10 pt-5 md:grid-cols-2"><div><h3 className="text-sm font-bold text-mint">Antes de começar</h3><ol className="mt-3 grid gap-2">{practice.setup.map((item, index) => <li key={item} className="text-sm leading-6 text-[#AAB2BC]">{index + 1}. {item}</li>)}</ol></div><div><h3 className="text-sm font-bold text-mint">Durante a prática</h3><ol className="mt-3 grid gap-2">{practice.actions.map((item, index) => <li key={item} className="text-sm leading-6 text-[#AAB2BC]">{index + 1}. {item}</li>)}</ol></div></div>
    </details>

    {enriched && <section className="mt-6 grid gap-5"><div className="rounded-2xl border border-mint/20 bg-mint/[.05] p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-mint">Entenda antes de fazer</p><p className="mt-3 text-base leading-7 text-[#D9DEE4]">{enriched.concept}</p></div><div className="rounded-2xl border border-white/10 bg-[#171B21] p-6"><h2 className="text-lg font-black text-off-white">Exemplo simples</h2><p className="mt-3 text-sm leading-7 text-[#AAB2BC]">{enriched.example}</p></div></section>}

    <details className="mt-6 rounded-2xl border border-white/10 bg-[#171B21] p-6"><summary className="cursor-pointer text-lg font-black text-off-white">Ver contexto completo do desafio</summary><div className="mt-5 border-t border-white/10 pt-5"><h2 className="text-xs font-bold uppercase tracking-[.16em] text-[#8B949E]">Contexto</h2><p className="mt-3 text-base leading-7 text-[#D9DEE4]">{challenge.context}</p><h2 className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-[#8B949E]">Entrega original</h2><p className="mt-3 text-sm leading-6 text-[#D9DEE4]">{challenge.deliverable}</p></div></details>

    {enriched && <section className="mt-6 grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-[#171B21] p-6"><h2 className="text-lg font-black text-off-white">Como fazer</h2><ol className="mt-4 grid gap-3">{enriched.steps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-6 text-[#AAB2BC]"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/10 font-mono text-xs font-black text-mint">{index + 1}</span>{step}</li>)}</ol></div><div className="rounded-2xl border border-white/10 bg-[#171B21] p-6"><h2 className="text-lg font-black text-off-white">Confira antes de terminar</h2><ul className="mt-4 grid gap-3">{enriched.evidence.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#AAB2BC]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-neon" />{item}</li>)}</ul><h3 className="mt-6 text-sm font-bold text-off-white">Evite estes erros</h3><ul className="mt-3 grid gap-2">{enriched.commonMistakes.map((item) => <li key={item} className="text-sm leading-6 text-[#AAB2BC]">· {item}</li>)}</ul></div></section>}

    <details className="mt-6 rounded-2xl border border-white/10 bg-[#171B21] p-6"><summary className="cursor-pointer text-lg font-black text-off-white">Roteiro alternativo</summary><ol className="mt-5 grid gap-3 border-t border-white/10 pt-5">{instructions.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#AAB2BC]"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/10 font-mono text-xs font-black text-mint">{index + 1}</span>{item}</li>)}</ol></details>

    <section className="mt-6 rounded-2xl border border-white/10 bg-[#171B21] p-6"><h2 className="text-lg font-black text-off-white">Como avaliar sua entrega</h2><div className="mt-4 grid gap-3">{challenge.rubric.map((item) => <p key={item} className="flex gap-3 text-sm leading-6 text-[#AAB2BC]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-neon" />{item}</p>)}</div></section>
    <RoadmapChallengeClient challenge={challenge} />
  </main>;
}
