import { ArrowRight, ExternalLink } from "lucide-react";
import type { MentorshipWeekContent } from "@/lib/mentorship/curriculum";
import type { MentorshipWeek } from "@/lib/mentorship/catalog";
import { getAppliedExample } from "@/lib/mentorship/applied-examples";

export function WeekStudyGuide({ content, practice }: { content: MentorshipWeekContent; practice: MentorshipWeek["assignment"]["practice"] }) {
  const example = getAppliedExample(content.week);

  return (
    <section className="mt-10">
      <div className="max-w-[72ch]">
        <h2 className="text-2xl font-bold text-off-white">O que você vai aprender</h2>
        <ul className="mt-6 grid list-disc gap-3 border-y border-white/10 py-6 pl-5 text-sm leading-6 text-[#C8CFD7] marker:text-mint sm:grid-cols-2 sm:gap-x-8">
          {content.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
        </ul>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-off-white">Fundamentos</h2>
          <div className="mt-6 divide-y divide-white/10">
            {content.concepts.map((concept) => (
              <article key={concept.title} className="py-6 first:pt-0 last:pb-0">
                <h3 className="text-lg font-bold text-off-white">{concept.title}</h3>
                <p className="mt-3 text-base leading-8 text-[#C8CFD7]">{concept.content}</p>
              </article>
            ))}
          </div>
        </div>

        {example && (
          <article className="mt-12 border-t-2 border-mint bg-[#171B21] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-off-white">Exemplo aplicado</h2>
            <dl className="mt-5 space-y-4 text-sm leading-7 text-[#C8CFD7]">
              <div><dt className="font-bold text-mint">Situação</dt><dd>{example.situation}</dd></div>
              <div><dt className="font-bold text-mint">Raciocínio</dt><dd>{example.reasoning}</dd></div>
              <div><dt className="font-bold text-mint">Sua vez</dt><dd>{example.transfer}</dd></div>
              <div><dt className="font-bold text-mint">Evidência</dt><dd>{example.evidence}</dd></div>
            </dl>
          </article>
        )}

        <details className="mt-10 border-y border-white/15 py-5">
          <summary className="cursor-pointer font-bold text-off-white marker:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">Roteiro, checklist e fontes desta semana</summary>
          <div className="mt-7 space-y-8 text-sm leading-7 text-[#C8CFD7]">
            <div>
              <h3 className="font-bold text-off-white">Prática guiada</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 marker:font-bold marker:text-mint">{content.guidedPractice.map((step) => <li key={step}>{step}</li>)}</ol>
            </div>
            <div>
              <h3 className="font-bold text-off-white">Confira se você dominou</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-mint">{content.checkpoints.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h3 className="font-bold text-off-white">Erros comuns</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-mint">{content.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h3 className="font-bold text-off-white">Perguntas para o mentor</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-mint">{content.mentorQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h3 className="font-bold text-off-white">Fontes oficiais</h3>
              <ul className="mt-3 space-y-2">{content.references.map((reference) => <li key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-mint underline underline-offset-4 hover:text-neon">{reference.title} · {reference.organization}<ExternalLink aria-hidden="true" className="size-3" /></a></li>)}</ul>
            </div>
          </div>
        </details>

        <p className="mt-6 text-sm leading-6 text-[#C8CFD7]">Depois da leitura, pratique em <strong className="text-off-white">{practice.environment}</strong> e produza: <strong className="text-off-white">{practice.artifact}</strong>.</p>
        <a href="#praticar" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">Ir para a missão prática <ArrowRight aria-hidden="true" className="size-4" /></a>
      </div>
    </section>
  );
}
