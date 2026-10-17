import { CheckCircle2, ChevronDown, ExternalLink } from "lucide-react";
import { CompleteLessonButton } from "@/components/mentorship/mentorship-actions";
import type { MentorshipLesson } from "@/lib/mentorship/catalog";
import type { LessonTheory } from "@/lib/mentorship/lesson-theory";

type LessonReaderProps = {
  lesson: MentorshipLesson;
  index: number;
  theory?: LessonTheory;
  videoUrl?: string | null;
  materialUrl?: string | null;
  completed: boolean;
  canTrack: boolean;
  showPractice?: boolean;
  defaultOpen?: boolean;
};

export function LessonReader({ lesson, index, theory, videoUrl, materialUrl, completed, canTrack, showPractice = true, defaultOpen }: LessonReaderProps) {
  return (
    <details id={lesson.key} open={defaultOpen ?? index === 0} className="group scroll-mt-36 border-b border-white/15 first:border-t">
      <summary className="flex cursor-pointer list-none items-start gap-4 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint [&::-webkit-details-marker]:hidden">
        <span className="flex size-9 shrink-0 items-center justify-center border border-white/20 text-sm font-bold tabular-nums text-mint">{String(index + 1).padStart(2, "0")}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-bold text-off-white">{lesson.title}</span>
          <span className="mt-1 block text-sm leading-6 text-[#C8CFD7]">{lesson.summary}</span>
          {completed && <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-mint"><CheckCircle2 aria-hidden="true" className="size-4" /> Concluído</span>}
        </span>
        <ChevronDown aria-hidden="true" className="mt-2 size-5 shrink-0 text-mint transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-white/10 pb-8 pt-7 sm:pl-[3.25rem]">
        {theory && (
          <div className="max-w-[72ch]">
            <p className="font-semibold leading-7 text-off-white">Ao terminar, você será capaz de: {theory.objective}</p>
            <div className="mt-8 space-y-9">
              {theory.sections.map((section) => (
                <section key={section.title}>
                  <h4 className="text-lg font-bold text-off-white">{section.title}</h4>
                  <p className="mt-3 whitespace-pre-line text-base leading-8 text-[#C8CFD7]">{section.text}</p>
                </section>
              ))}
            </div>
            {showPractice && <div className="mt-10 space-y-8 border-t border-white/10 pt-8">
              <div>
                <h4 className="text-lg font-bold text-off-white">Exemplo comentado</h4>
                <p className="mt-3 text-base leading-8 text-[#C8CFD7]">{theory.workedExample}</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-off-white">Pratique agora</h4>
                <p className="mt-3 text-base leading-8 text-[#C8CFD7]">{theory.exercise}</p>
                <details className="mt-4 border-t border-white/10 pt-4">
                  <summary className="cursor-pointer font-bold text-mint marker:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">Ver resposta comentada</summary>
                  <p className="mt-4 text-base leading-8 text-[#C8CFD7]">{theory.answer}</p>
                </details>
              </div>
            </div>}
          </div>
        )}

        {(videoUrl || materialUrl || canTrack) && (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
            {videoUrl && <a href={videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-mint hover:text-neon">Assistir vídeo <ExternalLink aria-hidden="true" className="size-3" /></a>}
            {materialUrl && <a href={materialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-mint hover:text-neon">Material complementar <ExternalLink aria-hidden="true" className="size-3" /></a>}
            {canTrack && <CompleteLessonButton lessonKey={lesson.key} completed={completed} />}
          </div>
        )}
      </div>
    </details>
  );
}
