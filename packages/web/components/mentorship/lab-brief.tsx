import { CheckCircle2, ClipboardList, FileCheck2, Flag, Lightbulb, MapPinned } from "lucide-react";
import type { LabBrief as LabBriefContent } from "@/lib/mentorship/lab-briefs";

export function LabBrief({ brief }: { brief: LabBriefContent }) {
  return <article className="mt-7 border border-white/10 bg-[#171B21] p-6 sm:p-8" aria-labelledby="lab-brief-title">
    <div className="flex items-center gap-3 text-mint"><ClipboardList className="size-5" /><p className="text-sm font-bold">Enunciado completo do lab</p></div>
    <h3 id="lab-brief-title" className="mt-3 text-2xl font-black text-off-white">O desafio</h3>
    <p className="mt-4 max-w-4xl text-sm leading-8 text-[#C8CFD7]">{brief.scenario}</p>
    <div className="mt-8 grid gap-6 border-t border-white/10 pt-7 lg:grid-cols-2">
      <div><div className="flex items-center gap-2"><MapPinned className="size-4 text-mint" /><h4 className="font-black text-off-white">Ponto de partida</h4></div><p className="mt-3 text-sm leading-7 text-[#C8CFD7]">{brief.startingPoint}</p></div>
      <div><div className="flex items-center gap-2"><Flag className="size-4 text-mint" /><h4 className="font-black text-off-white">Sua missão</h4></div><p className="mt-3 text-sm leading-7 text-[#C8CFD7]">{brief.mission}</p></div>
    </div>
    <div className="mt-9 grid gap-9 border-t border-white/10 pt-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <div><h4 className="text-lg font-black text-off-white">Passo a passo</h4><ol className="mt-5 grid gap-5">{brief.tasks.map((task, index) => <li key={task} className="grid grid-cols-[36px_1fr] gap-2 text-sm leading-7 text-[#D9DEE4]"><span className="font-mono font-bold text-mint">{String(index + 1).padStart(2, "0")}</span>{task}</li>)}</ol></div>
      <div className="grid content-start gap-7"><section><div className="flex items-center gap-2"><FileCheck2 className="size-4 text-mint" /><h4 className="font-black text-off-white">O que entregar</h4></div><ul className="mt-4 grid gap-3">{brief.evidence.map((item) => <li key={item} className="text-sm leading-6 text-[#C8CFD7]">• {item}</li>)}</ul></section><section className="border-t border-white/10 pt-6"><div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-mint" /><h4 className="font-black text-off-white">Critérios de aceite</h4></div><ul className="mt-4 grid gap-3">{brief.acceptance.map((item) => <li key={item} className="text-sm leading-6 text-[#C8CFD7]">✓ {item}</li>)}</ul></section></div>
    </div>
    <div className="mt-9 border-l-2 border-mint bg-mint/[.04] px-5 py-4"><div className="flex items-center gap-2"><Lightbulb className="size-4 text-mint" /><h4 className="text-sm font-black text-off-white">Para ir além</h4></div><p className="mt-2 text-sm leading-7 text-[#C8CFD7]">{brief.extension}</p></div>
  </article>;
}
