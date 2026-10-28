import { BookOpen, ChevronDown, CircleHelp, Sprout } from "lucide-react";
import type { LessonTheory } from "@/lib/mentorship/lesson-theory-types";

export function LessonReading({ theory, brotoAction }: { theory: LessonTheory; brotoAction?: string }) {
  return <div className="max-w-[68ch] space-y-8 text-base leading-[1.85] text-[#DCE5DF] selection:bg-[#BDE3C9] selection:text-[#13271B]">
    <p className="text-lg font-semibold leading-8 text-off-white">{theory.objective}</p>

    {theory.sections.slice(0, 1).map(section => <TheorySection key={section.title} section={section} />)}

    {theory.sections.length > 1 && <details className="group/theory border-y border-white/15 py-1">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-3 font-semibold text-[#ACDBBC] outline-offset-4 hover:text-off-white focus-visible:outline-2 focus-visible:outline-mint [&::-webkit-details-marker]:hidden">
        Aprofundar a teoria<ChevronDown aria-hidden="true" className="size-4 shrink-0 transition-transform group-open/theory:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="space-y-8 pb-5 pt-3">{theory.sections.slice(1).map(section => <TheorySection key={section.title} section={section} />)}</div>
    </details>}

    {brotoAction && <section className="rounded-xl bg-[#1B3025] p-5 text-[#DDEFE3] sm:p-6">
      <h4 className="flex items-center gap-3 text-lg font-bold leading-7 text-[#BDE3C9]"><Sprout aria-hidden="true" className="size-5 shrink-0" />No BrotoSpace</h4>
      <p className="mt-3">{brotoAction}</p>
    </section>}

    <details className="group/example rounded-xl bg-[#DFE9E1] text-[#203C2B]">
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-xl px-5 py-4 font-bold text-[#15271B] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#1E613C] sm:px-6 [&::-webkit-details-marker]:hidden">
        <BookOpen aria-hidden="true" className="size-5 shrink-0" />
        <span className="flex-1">Exemplo na prática</span>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 transition-transform group-open/example:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="max-w-[65ch] space-y-4 px-5 pb-6 pt-1 text-[0.98rem] leading-7 [text-wrap:pretty] sm:px-6">
        {theory.workedExample.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </details>

    <details className="group/review border-y border-white/15 py-1">
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-sm py-3 font-semibold text-off-white outline-offset-4 hover:text-[#ACDBBC] focus-visible:outline-2 focus-visible:outline-mint [&::-webkit-details-marker]:hidden">
        <CircleHelp aria-hidden="true" className="size-5 shrink-0 text-[#ACDBBC]" />
        <span className="flex-1">Confira seu entendimento</span>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-[#ACDBBC] transition-transform group-open/review:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="space-y-5 pb-5 pt-2">
        <p className="font-semibold text-off-white">{theory.exercise}</p>
        <p className="border-t border-white/10 pt-4 text-[#BCCDC2]"><strong className="mb-1 block font-semibold text-[#ACDBBC]">Uma resposta possível</strong>{theory.answer}</p>
      </div>
    </details>
  </div>;
}

function TheorySection({ section }: { section: LessonTheory["sections"][number] }) {
  return <section>
    <h4 className="text-lg font-bold leading-7 text-off-white">{section.title}</h4>
    <p className="mt-3 whitespace-pre-line">{section.text}</p>
  </section>;
}
