import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { CompleteLessonButton, MentorshipPortfolioForm, SubmissionForm } from "@/components/mentorship/mentorship-actions";
import { LessonVideo } from "@/components/mentorship/lesson-video";
import { LessonReading } from "@/components/mentorship/lesson-reading";
import { brotoLessonActions } from "@/lib/mentorship/broto-training-case";
import { extraTheoryV2, findPathV2Assignment, findPathV2Chapter, findPathV2Lesson, findPathV2Module, mentorshipPathV2, pathV2Assignments, pathV2ChapterHref, pathV2Chapters, pathV2PracticeKey } from "@/lib/mentorship/path-v2";
import { lessonTheory } from "@/lib/mentorship/lesson-theory";
import { getOwnMentorshipCase } from "@/lib/mentorship/portfolio";
import { getMentorshipDashboard, listReviewsForSubmissions } from "@/lib/mentorship/store";
import { getSessionUser } from "@/lib/product/store";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return mentorshipPathV2.flatMap((courseModule) => courseModule.chapters.map((chapter) => ({ module: courseModule.slug, chapter: chapter.slug }))); }
export async function generateMetadata({ params }: { params: Promise<{ module: string; chapter: string }> }) { const { module, chapter } = await params; const item = findPathV2Chapter(module, chapter); return { title: item ? `${item.title} | QA Lab` : "Capítulo | QA Lab" }; }

export default async function ChapterPage({ params }: { params: Promise<{ module: string; chapter: string }> }) {
  const { module: moduleSlug, chapter: chapterSlug } = await params;
  const courseModule = findPathV2Module(moduleSlug);
  const chapter = findPathV2Chapter(moduleSlug, chapterSlug);
  if (!courseModule || !chapter) notFound();
  const user = await getSessionUser();
  const dashboard = user ? await getMentorshipDashboard(user.id) : null;
  const canReadHistory = dashboard?.enrollment.programVersion === "v2";
  const canTrack = canReadHistory && dashboard?.enrollment.status === "active";
  const completed = new Set((dashboard?.lessons ?? []).filter((row) => row.status === "completed").map((row) => row.lesson_key));
  const published = new Map((dashboard?.lessonContent ?? []).map((item) => [item.lesson_key, item]));
  const assignment = chapter.assignmentKey ? findPathV2Assignment(chapter.assignmentKey) : null;
  const attempts = assignment ? (dashboard?.submissions ?? []).filter((item) => item.assignmentKey === assignment.key).sort((left, right) => right.attemptNumber - left.attemptNumber) : [];
  const currentSubmission = attempts[0] ?? null;
  const approvedPrevious = assignment?.key === "mentoria.v2.case-final.assignment" ? pathV2Assignments.filter((item) => item.key !== assignment.key && (dashboard?.submissions ?? []).some((submission) => submission.assignmentKey === item.key && submission.status === "approved")).length : 0;
  const finalSubmission = assignment?.key === "mentoria.v2.case-final.assignment" ? attempts.find((item) => item.status === "approved") : null;
  const finalCase = finalSubmission && canReadHistory ? await getOwnMentorshipCase(finalSubmission.id) : null;
  const reviewsBySubmission = canReadHistory && attempts.length ? await listReviewsForSubmissions(user!.id, attempts.map((item) => item.id)) : new Map();
  const index = pathV2Chapters.findIndex((item) => item.chapter.id === chapter.id);
  const next = pathV2Chapters[index + 1];
  const previous = pathV2Chapters[index - 1];
  return <main className="ca-reading"><Link href={`/conteudo/modulos/${courseModule.slug}`} className="ca-back"><ArrowLeft aria-hidden="true" className="size-4" />{courseModule.title}</Link>
    <header className="ca-reading-header"><span className="ca-kicker">Módulo {mentorshipPathV2.indexOf(courseModule) + 1} / Capítulo {String(courseModule.chapters.indexOf(chapter) + 1).padStart(2, "0")}</span><h1 className="mt-5">{chapter.title}</h1><p className="mt-5 text-base">{chapter.outcome}</p><p className="mt-4 text-xs">{chapter.lessonKeys.length} {chapter.lessonKeys.length === 1 ? "aula" : "aulas"} · {chapter.practices.length} {chapter.practices.length === 1 ? "prática" : "práticas"}{assignment ? " · entrega para o mentor" : ""}</p><nav aria-label="Etapas do capítulo" className="mt-6 flex flex-wrap gap-3 text-xs font-bold"><a href="#teoria-heading" className="ca-text-link">01 / Entenda</a><a href="#pratica-heading" className="ca-text-link">02 / Faça</a>{assignment && <a href="#entrega-heading" className="ca-text-link">03 / Mostre</a>}</nav></header>
    <section aria-labelledby="teoria-heading" className="ca-reading-section"><div><span className="ca-kicker">01 / Leitura</span><h2 id="teoria-heading" className="mt-3">Entenda</h2><p className="mt-2 text-sm">Abra uma aula por vez. A leitura, o exemplo e a pergunta de revisão ficam juntos.</p></div><div className="mt-6">{chapter.lessonKeys.map((key, lessonIndex) => {
      const lesson = findPathV2Lesson(key);
      const theory = lessonTheory[key] ?? extraTheoryV2[key]?.theory;
      if (!lesson || !theory) return null;
      const source = /^mentoria\.w(\d+)\.l(\d+)$/.exec(key);
      const brotoAction = source ? brotoLessonActions[Number(source[1])]?.[Number(source[2]) - 1] : undefined;
      const videoUrl = published.get(key)?.video_url || lesson.videoUrl;
      const materialUrl = published.get(key)?.material_url;
      return <details key={key} id={key} name="chapter-lessons" open={lessonIndex === 0} className="group scroll-mt-24 py-2">
        <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20 text-xs font-semibold tabular-nums text-[#BECFC4] group-open:border-mint/40 group-open:bg-mint/15 group-open:text-[#ACDBBC]">{String(lessonIndex + 1).padStart(2, "0")}</span>
          <span className="min-w-0 flex-1"><span role="heading" aria-level={3} className="block text-lg font-bold leading-7 text-off-white">{lesson.title}</span><span className="mt-1 block text-sm text-[#BECFC4]">{lesson.duration}{videoUrl ? " · Vídeo disponível" : ""}</span></span>
          {canTrack && completed.has(key) && <span className="shrink-0 text-xs font-semibold text-mint">Concluída</span>}
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-mint transition-transform group-open:rotate-180" />
        </summary>
        <article className="pb-8 pt-2 sm:pl-12">
          {videoUrl && <div className="mt-2"><LessonVideo url={videoUrl} title={lesson.title} /></div>}
          {materialUrl && <a href={materialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-mint underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint">Abrir material de apoio<span className="sr-only">: {lesson.title}</span><ExternalLink aria-hidden="true" className="size-4" /></a>}
          <div className="mt-5">
            <LessonReading theory={theory} brotoAction={brotoAction ?? chapter.practices[0]?.task} />
            {canTrack ? <div className="mt-6 pt-2"><CompleteLessonButton lessonKey={key} completed={completed.has(key)} /></div> : <p className="mt-6 text-sm leading-6 text-[#BECFC4]">Leitura livre. <Link href="/mentoria" className="font-semibold text-[#ACDBBC] underline underline-offset-4 hover:text-off-white">Entre na mentoria para salvar seu progresso.</Link></p>}
          </div>
        </article>
      </details>;
    })}</div></section>
    <section aria-labelledby="pratica-heading" className="ca-reading-section"><span className="ca-kicker">02 / Experimento</span><h2 id="pratica-heading" className="mt-3">Faça</h2><p className="mt-2 text-sm">Use uma conta e dados de treino. Anote o resultado observável; não envie tokens nem informações pessoais.</p><ol className="ca-step-list">{chapter.practices.map((practice, practiceIndex) => { const practiceKey = pathV2PracticeKey(chapter, practiceIndex); return <li key={practiceKey}><span className="ca-step-no">{String(practiceIndex + 1).padStart(2, "0")}</span><div><p className="font-semibold text-off-white">{practice.task}</p><p>Resultado: {practice.evidence}</p>{canTrack && <div className="mt-3"><CompleteLessonButton lessonKey={practiceKey} completed={completed.has(practiceKey)} /></div>}</div></li>; })}</ol>{chapter.labRoute && <Link href={chapter.labRoute} className="ca-text-link mt-5">Abrir ambiente de prática <ExternalLink aria-hidden="true" className="size-4" /></Link>}</section>
    {assignment && <section aria-labelledby="entrega-heading" className="mt-11 border-t border-white/15 pt-8"><h2 id="entrega-heading" className="text-2xl font-black text-off-white">Mostre o que fez</h2><p className="mt-2 text-sm leading-6 text-[#C8CFD7]">{assignment.delivery}</p>{assignment.key === "mentoria.v2.case-final.assignment" && approvedPrevious < pathV2Assignments.length - 1 && <p role="status" className="mt-4 border border-mint/25 bg-mint/[.04] p-3 text-sm text-[#C8CFD7]">Você já tem {approvedPrevious} de {pathV2Assignments.length - 1} entregas anteriores aprovadas. Pode preparar um rascunho agora; o envio final fica disponível depois das aprovações.</p>}<ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[#C8CFD7]">{assignment.rubric.map((item) => <li key={item}>{item}</li>)}</ul>{canTrack ? <div className="mt-6 border border-white/10 bg-[#171B21] p-5"><SubmissionForm assignmentKey={assignment.key} initialSubmission={currentSubmission} prompts={assignment.prompts} /></div> : <p className="mt-5 text-sm text-[#AAB2BC]">{dashboard?.enrollment.programVersion === "v1" ? "Sua turma segue a trilha anterior; suas entregas continuam no painel da mentoria." : dashboard?.enrollment.status === "paused" ? "Sua matrícula está pausada; o histórico permanece no painel." : "Para enviar e receber feedback, entre na mentoria."} <Link href="/mentoria/app" className="font-semibold text-mint underline">Abrir painel</Link></p>}{attempts.flatMap((attempt) => reviewsBySubmission.get(attempt.id) ?? []).length > 0 && <div className="mt-6"><h3 className="font-bold text-off-white">Feedback do mentor</h3><ul className="mt-3 space-y-3">{attempts.flatMap((attempt) => reviewsBySubmission.get(attempt.id) ?? []).map((review) => <li key={review.id} className="border border-white/10 bg-[#171B21] p-4 text-sm text-[#C8CFD7]"><p className="font-bold text-mint">{review.decision === "approved" ? "Aprovada" : "Ajustes solicitados"}</p><p className="mt-2">{review.nextAction}</p>{review.improvements && <p className="mt-2">A melhorar: {review.improvements}</p>}</li>)}</ul></div>}</section>}
    {finalSubmission && <div className="mt-10"><MentorshipPortfolioForm submissionId={finalSubmission.id} initialTitle={finalCase?.title} initialSummary={finalCase?.summary} initialPublished={finalCase?.published} /></div>}
    <nav aria-label="Capítulos" className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-sm font-bold">{previous ? <Link href={pathV2ChapterHref(previous.module, previous.chapter)} className="inline-flex min-h-11 items-center gap-2 text-[#C8CFD7] hover:text-mint"><ArrowLeft aria-hidden="true" className="size-4" />Anterior</Link> : <span />}{next ? <Link href={pathV2ChapterHref(next.module, next.chapter)} className="inline-flex min-h-11 items-center gap-2 text-mint hover:text-neon">Próximo capítulo <ArrowRight aria-hidden="true" className="size-4" /></Link> : <Link href="/mentoria/app" className="text-mint">Ver conclusão</Link>}</nav>
  </main>;
}
