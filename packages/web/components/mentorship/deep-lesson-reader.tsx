import type { DeepLesson } from "@/lib/mentorship/deep-lessons";

export function DeepLessonReader({ lesson }: { lesson: DeepLesson }) {
  return (
    <div className="mt-16 border-t border-white/10 pt-10">
      <h2 className="text-3xl font-black text-off-white">Entenda o raciocínio</h2>
      <div className="mt-9 max-w-[72ch] space-y-12">
        {lesson.sections.map((section) => (
          <article key={section.title}>
            <h3 className="text-xl font-bold text-off-white">{section.title}</h3>
            <div className="mt-4 space-y-5 text-base leading-8 text-[#C8CFD7]">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
        ))}
      </div>

      <aside className="mt-12 max-w-[72ch] border-t-2 border-mint bg-[#171B21] p-6 sm:p-8">
        <h3 className="text-xl font-bold text-off-white">Exemplo resolvido: {lesson.walkthrough.title}</h3>
        <p className="mt-4 text-base leading-7 text-[#C8CFD7]">{lesson.walkthrough.setup}</p>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-[#C8CFD7] marker:font-bold marker:text-mint">
          {lesson.walkthrough.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <p className="mt-6 border-t border-white/10 pt-5 text-base leading-7 text-off-white"><strong className="text-mint">Conclusão:</strong> {lesson.walkthrough.conclusion}</p>
      </aside>
    </div>
  );
}
