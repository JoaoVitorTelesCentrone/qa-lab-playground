import Link from "next/link";
import { ArrowRight, BookOpenCheck, LockKeyhole } from "lucide-react";
import { fullRoadmapChallenges } from "@/lib/roadmap/full-catalog.generated";
import { roadmapLabel, roadmapTypeLabel } from "@/lib/roadmap/labels";

export const metadata = { title: "Roadmap Completo | QA Lab Pro", description: "Todos os desafios práticos do roadmap QA Lab." };

export default async function FullRoadmapPage({ searchParams }: { searchParams?: Promise<{ area?: string }> }) {
  const macroFor = (module: string) => {
    const match = module.match(/^(\d)\./);
    if (match) {
      const labels: Record<string, string> = { "1": "1. FUNDAMENTOS", "2": "2. SITUAÇÕES REAIS", "3": "3. HABILIDADES COMPORTAMENTAIS", "4": "4. PENSAMENTO DE QA", "5": "5. CARREIRA E MERCADO" };
      return labels[match[1]] ?? "0. BASE — ENTENDENDO QUALIDADE";
    }
    return "0. BASE — ENTENDENDO QUALIDADE";
  };
  const grouped = new Map<string, Map<string, typeof fullRoadmapChallenges>>();
  for (const challenge of fullRoadmapChallenges) {
    const area = macroFor(challenge.module);
    const modules = grouped.get(area) ?? new Map<string, typeof fullRoadmapChallenges>();
    const challenges = modules.get(challenge.module) ?? [];
    modules.set(challenge.module, [...challenges, challenge]);
    grouped.set(area, modules);
  }
  const areas = [...grouped.keys()];
  const selectedArea = (await searchParams)?.area;
  const visibleAreas = selectedArea && grouped.has(selectedArea) ? [selectedArea] : areas;
  return <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
    <header className="max-w-3xl"><h1 className="text-4xl font-black text-off-white sm:text-6xl">Roadmap de QA</h1><p className="mt-4 text-lg leading-8 text-[#AAB2BC]">Desafios por tema, com roteiro e critérios de avaliação.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/trilhas/qa-do-zero" className="inline-flex h-11 items-center gap-2 rounded-lg bg-mint px-5 text-sm font-black text-[#101319]">Começar QA do Zero <ArrowRight className="size-4" /></Link><span className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-bold text-[#AAB2BC]"><LockKeyhole className="size-4" /> Acesso Pro</span></div></header>
    <nav aria-label="Filtro por área" className="mt-12 flex flex-wrap gap-2"><Link href="/trilhas/roadmap" className={`rounded-full border px-3 py-2 text-xs font-bold transition ${!selectedArea ? "border-mint/50 bg-mint/10 text-mint" : "border-white/10 bg-[#171B21] text-[#AAB2BC] hover:border-mint/40 hover:text-mint"}`}>Todos os grupos</Link>{areas.map((area) => <Link key={area} href={`/trilhas/roadmap?area=${encodeURIComponent(area)}`} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${selectedArea === area ? "border-mint/50 bg-mint/10 text-mint" : "border-white/10 bg-[#171B21] text-[#AAB2BC] hover:border-mint/40 hover:text-mint"}`}>{area}</Link>)}</nav>
    <p className="mt-4 text-sm text-[#AAB2BC]">{visibleAreas.reduce((total, area) => total + [...grouped.get(area)!.values()].reduce((sum, challenges) => sum + challenges.length, 0), 0)} desafios</p>
    <section className="mt-6 grid gap-4">{visibleAreas.map((area) => { const modules = grouped.get(area)!; const areaCount = [...modules.values()].reduce((total, challenges) => total + challenges.length, 0); return <details id={`area-${area.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`} key={area} open={Boolean(selectedArea)} className="group scroll-mt-28 rounded-2xl border border-mint/20 bg-[#151A20] open:border-mint/40"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6"><span><strong className="block text-lg text-off-white sm:text-xl">{area}</strong><span className="mt-1 block text-sm text-[#AAB2BC]">{areaCount} desafios · {[...modules.keys()].length} módulos</span></span><BookOpenCheck className="size-5 text-[#8B949E] transition group-open:text-mint" /></summary><div className="grid gap-2 border-t border-white/10 p-3 sm:p-4">{[...modules.entries()].map(([module, challenges]) => { const moduleTitle = roadmapLabel(/^\d\./.test(module) ? module.split(" — ").slice(1).join(" — ") : module.split(" — ")[0]); return <details key={module} className="group/module rounded-xl border border-white/10 bg-[#171B21] open:border-mint/25"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4"><span><strong className="block text-base text-off-white">{moduleTitle}</strong><span className="mt-1 block text-xs text-[#AAB2BC]">{challenges.length} desafios</span></span><BookOpenCheck className="size-4 text-[#69737E] transition group-open/module:text-mint" /></summary><div className="border-t border-white/10 px-4"><div className="divide-y divide-white/10">{challenges.map((challenge) => <Link key={challenge.id} href={`/trilhas/roadmap/${challenge.id}`} className="group/item flex items-center gap-3 py-3 transition hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"><span className="w-11 shrink-0 font-mono text-xs font-black text-mint">#{String(challenge.order).padStart(3, "0")}</span><span className="min-w-0 flex-1 line-clamp-3 text-sm font-semibold leading-5 text-[#D9DEE4] group-hover/item:text-mint">{roadmapLabel(challenge.prompt)}</span><span className="hidden shrink-0 text-xs font-bold text-neon sm:block">{roadmapTypeLabel(challenge.type)}</span><ArrowRight className="size-4 shrink-0 text-[#69737E] transition group-hover/item:translate-x-1 group-hover/item:text-mint" /></Link>)}</div></div></details>; })}</div></details>; })}</section>
  </main>;
}
