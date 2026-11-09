import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { qaTools } from "@/lib/qa-tools";
import { qaToolLabsFor, qaToolLabSpecs } from "@/lib/qa-tool-labs";

export const metadata = { title: "Ferramentas de QA | QA Lab", description: "Bancadas interativas para praticar dados, API, performance, acessibilidade, segurança e fluxos." };

export default function ToolsPage() {
  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
    <Link href="/lab" className="text-xs text-[#9AA4AF] hover:text-white">Meu Lab</Link>
    <header className="mt-7 max-w-3xl border-b border-white/10 pb-8">
      <div className="flex items-center gap-2 text-sm font-semibold text-mint"><Wrench className="size-4" /> Ferramentas interativas</div>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Abra, investigue e veja o resultado.</h1>
      <p className="mt-4 text-base leading-7 text-[#AAB2BC]">{qaTools.length} ferramentas interativas e {qaToolLabSpecs.length} Labs práticos, organizados pelo que cada bancada permite investigar. Use dados sintéticos para produzir evidências sem tocar em sistemas reais.</p>
    </header>
    <nav aria-label="Ir para ferramenta" className="mt-6 flex flex-wrap gap-2">{qaTools.map((tool) => <a key={tool.id} href={`#${tool.id}`} className="rounded-full border border-white/15 px-3 py-2 text-xs text-[#c5cdd5] hover:border-mint/40 hover:text-white">{tool.shortTitle} · {qaToolLabsFor(tool.id).length}</a>)}</nav>
    <section aria-label="Ferramentas e seus Labs" className="mt-8 space-y-8">
      {qaTools.map((tool) => {
        const Icon = tool.icon;
        const toolLabs = qaToolLabsFor(tool.id);
        return <article id={tool.id} key={tool.id} className="scroll-mt-24 overflow-hidden rounded-xl border border-white/10 bg-[#15191f]">
          <header className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-4"><span className={`flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[.03] ${tool.accent}`}><Icon className="size-5" /></span><div><h2 className="text-lg font-bold text-white">{tool.title}</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-[#9AA4AF]">{tool.description}</p></div></div>
            <Link href={`/lab/ferramentas/${tool.id}?lab=${toolLabs[0].number}`} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md bg-mint px-3 text-xs font-black text-[#101319]">Abrir bancada <ArrowRight className="size-4" /></Link>
          </header>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4">
            {toolLabs.map((lab, index) => <li key={lab.number} className="border-b border-white/[.07]"><Link href={`/labs/${lab.number}`} className="group flex min-h-16 items-center gap-3 px-4 py-3 hover:bg-white/[.035]"><span className="font-mono text-[11px] text-[#697581]">{String(index + 1).padStart(2, "0")}</span><span className="text-xs font-medium leading-5 text-[#d1d7dd] group-hover:text-white">{lab.title}</span><ArrowRight className="ml-auto size-3.5 shrink-0 text-[#697581] group-hover:text-mint" /></Link></li>)}
          </ol>
        </article>;
      })}
    </section>
  </main>;
}
