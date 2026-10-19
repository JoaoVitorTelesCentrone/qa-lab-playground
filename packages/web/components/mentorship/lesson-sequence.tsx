import Link from "next/link";
import { ArrowRight, BookOpen, Check, ClipboardCheck, FlaskConical, ListChecks, Video } from "lucide-react";
import type { MentorshipWeek } from "@/lib/mentorship/catalog";
import { contentStepHref, getContentSteps } from "@/lib/mentorship/content-steps";

export function LessonSequence({ unit, currentSlug, completedKeys = [], videoKeys = [] }: { unit: MentorshipWeek; currentSlug?: string; completedKeys?: readonly string[]; videoKeys?: readonly string[] }) {
  return <nav aria-label={`Sequência de estudo: ${unit.title}`}>
    <ol className="divide-y divide-white/10">{getContentSteps(unit).map((step) => {
      const lesson = step.kind === "lesson" ? unit.lessons[step.lessonIndex] : null;
      const complete = lesson && completedKeys.includes(lesson.key);
      const hasVideo = lesson && (Boolean(lesson.videoUrl) || videoKeys.includes(lesson.key));
      const Icon = complete ? Check : lesson ? (hasVideo ? Video : BookOpen) : step.slug === "quiz" ? ListChecks : step.slug === "exemplo" ? FlaskConical : ClipboardCheck;
      const format = lesson ? `${lesson.kind === "reading" ? "Leitura" : lesson.kind === "demo" ? "Demonstração" : "Aula"} · ${lesson.duration}` : step.slug === "quiz" ? "Confira o que aprendeu" : step.slug === "exemplo" ? "Veja o raciocínio aplicado" : "Pratique no Broto Space";
      return <li key={step.slug}><Link href={contentStepHref(unit.number, step.slug)} aria-current={currentSlug === step.slug ? "step" : undefined} className={`group flex items-start gap-3 px-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${currentSlug === step.slug ? "bg-mint/10" : "hover:bg-white/[.03]"}`}>
        <Icon aria-hidden="true" className={`mt-1 size-4 shrink-0 ${complete || currentSlug === step.slug ? "text-mint" : "text-[#AAB2BC]"}`} />
        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-off-white group-hover:text-mint">{step.title}</span><span className="mt-1 block text-xs leading-5 text-[#AAB2BC]">{format}{complete ? " · Concluída" : lesson && hasVideo ? " · Vídeo disponível" : lesson && lesson.kind !== "reading" ? " · Leitura disponível" : ""}</span></span>
        <ArrowRight aria-hidden="true" className="mt-1 size-3.5 shrink-0 text-[#AAB2BC]" />
      </Link></li>;
    })}</ol>
  </nav>;
}
