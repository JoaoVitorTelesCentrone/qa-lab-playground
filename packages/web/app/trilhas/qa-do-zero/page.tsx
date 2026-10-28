import Link from "next/link";
import { ArrowRight, ChevronDown, LockKeyhole } from "lucide-react";
import { qaDoZeroTrack } from "@/lib/roadmap/qa-do-zero";
import { roadmapTypeLabel } from "@/lib/roadmap/labels";

const typeColor = { INVESTIGATE: "text-coral", TEST: "text-neon", BUILD: "text-mint", DECIDE: "text-[#9BC0F5]", COMMUNICATE: "text-[#E9B7FF]" };

export const metadata = { title: "QA do Zero | QA Lab Pro", description: "Trilha prática de fundamentos de qualidade de software." };

export default function QaDoZeroPage() {
  const modules = [...new Set(qaDoZeroTrack.challenges.map((challenge) => challenge.module))];

  return <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
    <header className="max-w-3xl">
      <h1 className="text-4xl font-black text-off-white sm:text-6xl">{qaDoZeroTrack.title}</h1>
      <p className="mt-4 text-lg leading-8 text-[#AAB2BC]">{qaDoZeroTrack.subtitle}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#AAB2BC]">
        <span>{qaDoZeroTrack.challenges.length} desafios</span>
        <span aria-hidden="true">·</span>
        <span>{modules.length} blocos</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs font-bold"><LockKeyhole className="size-3.5" /> Acesso Pro</span>
      </div>
      <details className="mt-5 text-sm">
        <summary className="w-fit cursor-pointer text-mint">O que você vai aprender</summary>
        <p className="mt-2 max-w-2xl leading-6 text-[#AAB2BC]">{qaDoZeroTrack.outcome}</p>
      </details>
    </header>

    <section className="mt-10 grid gap-3" aria-label="Blocos da trilha">
      {modules.map((module, index) => {
        const challenges = qaDoZeroTrack.challenges.filter((challenge) => challenge.module === module);
        return <details key={module} className="group rounded-2xl border border-white/10 bg-[#151A20] open:border-mint/30">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
            <span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wide text-mint">Bloco {String(index + 1).padStart(2, "0")}</span><strong className="mt-1 block text-lg text-off-white sm:text-xl">{module}</strong><span className="mt-1 block text-sm text-[#AAB2BC]">{challenges.length} desafios</span></span>
            <ChevronDown className="size-5 shrink-0 text-[#8B949E] transition group-open:rotate-180 group-open:text-mint" aria-hidden="true" />
          </summary>
          <div className="border-t border-white/10 px-4 sm:px-6">
            <ol className="divide-y divide-white/10">
              {challenges.map((challenge) => <li key={challenge.id}>
                <Link href={`/trilhas/qa-do-zero/${challenge.id}`} className="group/item flex items-center gap-3 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">
                  <span className="w-8 shrink-0 font-mono text-xs font-black text-mint">{String(challenge.order).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1"><strong className="block text-sm font-semibold leading-5 text-[#D9DEE4] group-hover/item:text-mint">{challenge.title}</strong><span className={`mt-1 block text-xs font-bold tracking-wide ${typeColor[challenge.type]}`}>{roadmapTypeLabel(challenge.type)}</span></span>
                  <ArrowRight className="size-4 shrink-0 text-[#69737E] transition group-hover/item:translate-x-1 group-hover/item:text-mint" aria-hidden="true" />
                </Link>
              </li>)}
            </ol>
          </div>
        </details>;
      })}
    </section>
  </main>;
}
