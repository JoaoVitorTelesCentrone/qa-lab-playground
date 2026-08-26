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
    <header className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-mint">QA Lab Pro · catálogo completo</p><h1 className="mt-4 text-4xl font-black text-off-white sm:text-6xl">{fullRoadmapChallenges.length} desafios para provar que você sabe QA.</h1><p className="mt-5 text-lg leading-8 text-[#AAB2BC]">Cada desafio do roadmap original agora tem página própria, roteiro, rubrica e tentativas persistentes. Os desafios autorais de QA do Zero seguem como trilha guiada.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/trilhas/qa-do-zero" className="inline-flex h-11 items-center gap-2 rounded-lg bg-mint px-5 text-sm font-black text-[#101319]">Começar QA do Zero <ArrowRight className="size-4" /></Link><span className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-bold text-[#AAB2BC]"><LockKeyhole className="size-4" /> Acesso Pro</span></div></header>
    <nav aria-label="Filtro por área" className="mt-12 flex flex-wrap gap-2"><Link href="/trilhas/roadmap" className={`rounded-full border px-3 py-2 text-xs font-bold transition ${!selectedArea ? "border-mint/50 bg-mint/10 text-mint" : "border-white/10 bg-[#171B21] text-[#AAB2BC] hover:border-mint/40 hover:text-mint"}`}>Todos os grupos</Link>{areas.map((area) => <Link key={area} href={`/trilhas/roadmap?area=${encodeURIComponent(area)}`} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${selectedArea === area ? "border-mint/50 bg-mint/10 text-mint" : "border-white/10 bg-[#171B21] text-[#AAB2BC] hover:border-mint/40 hover:text-mint"}`}>{area}</Link>)}</nav>
    <p className="mt-4 text-xs text-[#69737E]">{selectedArea ? `Filtrando: ${selectedArea}` : "Exibindo todos os grupos macro"} · {visibleAreas.reduce((total, area) => total + [...grouped.get(area)!.values()].reduce((sum, challenges) => sum + challenges.length, 0), 0)} desafios visíveis</p>
    <section className="mt-6 grid gap-5">{visibleAreas.map((area) => { const modules = grouped.get(area)!; const areaCount = [...modules.values()].reduce((total, challenges) => total + challenges.length, 0); return <details id={`area-${area.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`} key={area} open={Boolean(selectedArea) || area.startsWith("0.")} className="group scroll-mt-28 rounded-2xl border border-mint/20 bg-[#151A20] open:border-mint/40"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6"><span><span className="text-xs font-bold uppercase tracking-[.16em] text-mint">{area}</span><strong className="mt-1 block text-xl text-off-white">{areaCount} desafios <span className="text-sm font-medium text-[#69737E]">· {[...modules.keys()].length} módulos</span></strong></span><BookOpenCheck className="size-5 text-[#8B949E] transition group-open:text-mint" /></summary><div className="grid gap-3 border-t border-white/10 p-3 sm:p-4">{[...modules.entries()].map(([module, challenges]) => { const moduleTitle = roadmapLabel(/^\d\./.test(module) ? module.split(" — ").slice(1).join(" — ") : module.split(" — ")[0]); return <details key={module} className="group/module rounded-xl border border-white/10 bg-[#171B21] open:border-mint/25"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4"><span><span className="text-xs font-bold uppercase tracking-[.16em] text-mint">{challenges.length} desafios</span><strong className="mt-1 block text-base text-off-white">{moduleTitle}</strong></span><BookOpenCheck className="size-4 text-[#69737E] transition group-open/module:text-mint" /></summary><div className="border-t border-white/10 p-3 sm:p-4"><div className="grid gap-3 md:grid-cols-2">{challenges.map((challenge) => <Link key={challenge.id} href={`/trilhas/roadmap/${challenge.id}`} className="group/item relative flex min-h-32 flex-col justify-between rounded-xl border border-white/[.08] bg-[#1C222A] p-4 transition hover:-translate-y-0.5 hover:border-mint/35 hover:bg-[#202932]"><div className="flex items-center justify-between gap-3"><span className="font-mono text-xs font-black text-mint">#{String(challenge.order).padStart(3, "0")}</span><span className="rounded-full bg-neon/10 px-2 py-1 text-[10px] font-black tracking-wide text-neon">{roadmapTypeLabel(challenge.type)}</span></div><p className="mt-4 line-clamp-3 text-sm font-semibold leading-6 text-[#D9DEE4]">{challenge.prompt}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#69737E] transition group-hover/item:text-mint">Abrir desafio <ArrowRight className="size-3.5 transition group-hover/item:translate-x-1" /></span></Link>)}</div></div></details>; })}</div></details>; })}</section>
  </main>;
}
