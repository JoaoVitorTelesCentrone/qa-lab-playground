import { theoryExpansion } from "@/lib/mentorship/theory-expansion";

export function TheoryExpansionSection({ week }: { week: number }) {
  const chapter = theoryExpansion[week];
  if (!chapter) return null;

  return (
    <section id="analise" aria-labelledby="analise-title" className="scroll-mt-36 mt-16 border-t border-white/10 pt-10">
      <h2 id="analise-title" className="text-3xl font-black text-off-white">Análise técnica em profundidade</h2>
      <p className="mt-3 max-w-3xl text-base leading-7 text-[#C8CFD7]">
        Use esta leitura para entender as decisões por trás da técnica antes de executar a missão da semana.
      </p>

      <div className="mt-10 space-y-10">
        {chapter.sections.map((section) => (
          <article key={section.title} className="border-b border-white/10 pb-10 last:border-0 last:pb-0">
            <h3 className="max-w-3xl text-xl font-bold text-off-white sm:text-2xl">{section.title}</h3>
            <div className="mt-5 max-w-[72ch] space-y-5 text-base leading-8 text-[#C8CFD7]">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
        ))}
      </div>

      <aside aria-labelledby="analise-caso-title" className="mt-12 max-w-[72ch] border-t-2 border-mint bg-[#171B21] p-6 sm:p-8">
        <h3 id="analise-caso-title" className="text-xl font-bold text-off-white">Caso analisado: {chapter.caseStudy.title}</h3>
        <dl className="mt-6 space-y-5 text-base leading-7 text-[#C8CFD7]">
          <div><dt className="font-bold text-mint">Contexto</dt><dd className="mt-2">{chapter.caseStudy.context}</dd></div>
          <div><dt className="font-bold text-mint">Raciocínio</dt><dd className="mt-2">{chapter.caseStudy.reasoning}</dd></div>
          <div><dt className="font-bold text-mint">Conclusão</dt><dd className="mt-2">{chapter.caseStudy.conclusion}</dd></div>
        </dl>
      </aside>
    </section>
  );
}
