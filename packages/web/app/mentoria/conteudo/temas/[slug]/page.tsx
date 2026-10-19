import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { LessonSequence } from "@/components/mentorship/lesson-sequence";
import { brotoSpaceWeeks } from "@/lib/mentorship/brotospace-track";
import { contentStepHref } from "@/lib/mentorship/content-steps";
import { getMentorshipDashboard } from "@/lib/mentorship/store";
import { findMentorshipTheme, getThemeProgress, getThemeUnits, mentorshipThemes } from "@/lib/mentorship/themes";
import type { MentorshipSubmission } from "@/lib/mentorship/types";
import { getSessionUser } from "@/lib/product/store";

export function generateStaticParams() { return mentorshipThemes.map((theme) => ({ slug: theme.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const theme = findMentorshipTheme((await params).slug);
  return { title: theme ? `${theme.title} | Conteúdo QA Lab` : "Tema | Conteúdo QA Lab", description: theme?.promise };
}

export const dynamic = "force-dynamic";

export default async function MentorshipThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const theme = findMentorshipTheme((await params).slug);
  if (!theme) notFound();
  const user = await getSessionUser();
  const dashboard = user ? await getMentorshipDashboard(user.id) : null;
  const latestByAssignment = new Map<string, MentorshipSubmission>();
  for (const submission of dashboard?.submissions ?? []) if (!latestByAssignment.has(submission.assignmentKey)) latestByAssignment.set(submission.assignmentKey, submission);
  const approvedKeys = new Set([...latestByAssignment.values()].filter((submission) => submission.status === "approved").map((submission) => submission.assignmentKey));
  const completedKeys = (dashboard?.lessons ?? []).filter((lesson) => lesson.status === "completed").map((lesson) => lesson.lesson_key);
  const videoKeys = (dashboard?.lessonContent ?? []).filter((lesson) => lesson.video_url).map((lesson) => lesson.lesson_key);
  const progress = getThemeProgress(theme, approvedKeys);
  const units = getThemeUnits(theme);
  const themeIndex = mentorshipThemes.findIndex((item) => item.id === theme.id);
  const resumeUnit = units.find((unit) => !approvedKeys.has(unit.assignment.key)) ?? units[0];
  const resumeLesson = resumeUnit.lessons.findIndex((lesson) => !completedKeys.includes(lesson.key));
  const resumeHref = contentStepHref(resumeUnit.number, resumeLesson >= 0 ? `teoria-${resumeLesson + 1}` : "quiz");
  const totalLessons = units.reduce((count, unit) => count + unit.lessons.length, 0);
  const completedCount = completedKeys.filter((key) => units.some((unit) => unit.lessons.some((lesson) => lesson.key === key))).length;

  return <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
    <Link href="/conteudo" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft aria-hidden="true" className="size-4" />Todos os temas</Link>
    <header className="mt-6">
      <h1 className="text-3xl font-black tracking-[-.03em] text-off-white sm:text-4xl">{theme.title}</h1>
      <p className="mt-3 max-w-[65ch] text-base leading-7 text-[#C8CFD7]">{theme.promise}</p>
      <p className="mt-4 text-sm text-[#AAB2BC]">Tema {themeIndex + 1} de {mentorshipThemes.length} · {totalLessons} aulas · 2 missões no Broto</p>
      <Link href={resumeHref} className="mt-6 inline-flex min-h-11 items-center gap-2 bg-mint px-5 text-sm font-bold text-[#101319] hover:bg-neon">{completedCount ? "Continuar estudo" : "Começar tema"}<ArrowRight aria-hidden="true" className="size-4" /></Link>
      <Link href="/conteudo/broto" className="ml-0 mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-mint underline underline-offset-4 hover:text-neon sm:ml-5">Ver o caso de treino no Broto <ArrowRight aria-hidden="true" className="size-4" /></Link>
      {dashboard && <p className="mt-3 text-xs text-[#AAB2BC]">{completedCount}/{totalLessons} aulas concluídas · {progress.approved}/{progress.total} missões aprovadas</p>}
    </header>

    <section className="mt-10" aria-label="Aulas e atividades do tema">
      <p className="border-b border-white/15 pb-4 text-sm leading-6 text-[#AAB2BC]">Aulas → Quiz → Exemplo → Missão. Estude por vídeo ou leitura e aplique no Broto.</p>
      {units.map((unit, index) => <section key={unit.number} id={`unidade-${unit.number}`} className="scroll-mt-24 pt-8">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div><h2 className="text-xl font-bold text-off-white">Parte {index + 1}: {unit.title}</h2><p className="mt-2 text-xs leading-5 text-[#AAB2BC]">{unit.lessons.length} aulas · prática de cerca de {brotoSpaceWeeks[unit.number].estimatedMinutes} min</p></div>
          {approvedKeys.has(unit.assignment.key) && <span className="inline-flex items-center gap-1 text-xs font-bold text-mint"><Check aria-hidden="true" className="size-4" />Missão aprovada</span>}
        </div>
        <LessonSequence unit={unit} completedKeys={completedKeys} videoKeys={videoKeys} />
      </section>)}
    </section>

    <details className="mt-10 border-y border-white/15 py-5">
      <summary className="cursor-pointer font-bold text-off-white marker:text-mint">Checkpoint: o que você deve conseguir demonstrar</summary>
      <div className="mt-5 space-y-5 text-sm leading-7 text-[#C8CFD7]">
        <p>{theme.synthesis.brief}</p>
        <ul className="space-y-2">{theme.checkpoint.map((item) => <li key={item} className="flex items-start gap-2"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-mint" />{item}</li>)}</ul>
        <div><h3 className="font-bold text-off-white">Evidências do tema</h3><ul className="mt-2 list-disc space-y-1 pl-5">{theme.synthesis.evidence.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <p><strong className="text-off-white">Para começar:</strong> {theme.synthesis.beginner}</p>
        <p><strong className="text-off-white">Para aprofundar:</strong> {theme.synthesis.intermediate}</p>
      </div>
    </details>
    <nav aria-label="Navegação entre temas" className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm font-bold">
      {themeIndex > 0 ? <Link href={`/conteudo/temas/${mentorshipThemes[themeIndex - 1].slug}`} className="inline-flex min-h-11 items-center gap-1 text-[#C8CFD7] hover:text-mint"><ArrowLeft aria-hidden="true" className="size-4" />Tema anterior</Link> : <span />}
      {themeIndex < mentorshipThemes.length - 1 ? <Link href={`/conteudo/temas/${mentorshipThemes[themeIndex + 1].slug}`} className="inline-flex min-h-11 items-center gap-1 text-mint hover:text-neon">Próximo tema<ArrowRight aria-hidden="true" className="size-4" /></Link> : <Link href="/conteudo" className="text-mint">Todos os temas</Link>}
    </nav>
  </main>;
}
