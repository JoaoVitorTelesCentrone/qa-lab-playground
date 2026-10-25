import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { findPathV2Module, mentorshipPathV2, pathV2Assignments, pathV2ChapterHref, pathV2PracticeKey } from "@/lib/mentorship/path-v2";
import { getMentorshipDashboard } from "@/lib/mentorship/store";
import { getSessionUser } from "@/lib/product/store";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return mentorshipPathV2.map((courseModule) => ({ module: courseModule.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) { const courseModule = findPathV2Module((await params).module); return { title: courseModule ? `${courseModule.title} | QA Lab` : "Módulo | QA Lab" }; }

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const courseModule = findPathV2Module((await params).module);
  if (!courseModule) notFound();
  const user = await getSessionUser();
  const dashboard = user ? await getMentorshipDashboard(user.id) : null;
  const completed = new Set((dashboard?.lessons ?? []).filter((item) => item.status === "completed").map((item) => item.lesson_key));
  const latest = new Map<string, string>();
  for (const submission of dashboard?.submissions ?? []) if (!latest.has(submission.assignmentKey)) latest.set(submission.assignmentKey, submission.status);
  const resume = courseModule.chapters.find((chapter) => chapter.lessonKeys.some((key) => !completed.has(key)) || chapter.practices.some((_, index) => !completed.has(pathV2PracticeKey(chapter, index))) || (chapter.assignmentKey && latest.get(chapter.assignmentKey) !== "approved")) ?? courseModule.chapters[0];
  const moduleIndex = mentorshipPathV2.indexOf(courseModule);
  const assignmentCount = pathV2Assignments.filter((item) => item.moduleId === courseModule.id).length;
  const completedChapters = courseModule.chapters.filter((chapter) => chapter.lessonKeys.every((key) => completed.has(key)) && chapter.practices.every((_, index) => completed.has(pathV2PracticeKey(chapter, index))) && (!chapter.assignmentKey || latest.get(chapter.assignmentKey) === "approved")).length;

  return <main className="ca-shell ca-interior">
    <Link href="/conteudo" className="ca-back"><ArrowLeft aria-hidden="true" className="size-4" /> Mapa de módulos</Link>
    <header className="ca-interior-hero">
      <div><span className="ca-kicker">Módulo {String(moduleIndex + 1).padStart(2, "0")} / {String(mentorshipPathV2.length).padStart(2, "0")}</span><h1 className="mt-5">{courseModule.title}</h1><p>{courseModule.summary}</p><Link href={pathV2ChapterHref(courseModule, resume)} className="ca-button mt-7">{completedChapters > 0 ? "Continuar módulo" : "Começar módulo"}<ArrowRight aria-hidden="true" className="size-4" /></Link></div>
      <div className="ca-hero-aside"><strong>{String(courseModule.chapters.length).padStart(2, "0")}</strong>capítulos para praticar<br />{assignmentCount} {assignmentCount === 1 ? "entrega avaliada" : "entregas avaliadas"}{dashboard?.enrollment.programVersion === "v2" && <p className="mt-4" style={{ color: "var(--ca-green)" }}>{completedChapters} capítulo(s) concluído(s)</p>}</div>
    </header>
    <section aria-labelledby="chapter-list-heading" className="mt-12"><div className="ca-section-head"><h2 id="chapter-list-heading">Capítulo por capítulo.</h2><p>Leia, experimente e guarde o resultado. A próxima etapa sempre parte do que você já observou.</p></div>
      <ol className="ca-chapter-list">{courseModule.chapters.map((chapter, index) => {
        const lessonsDone = chapter.lessonKeys.filter((key) => completed.has(key)).length;
        const approved = chapter.assignmentKey && latest.get(chapter.assignmentKey) === "approved";
        return <li key={chapter.id}><Link href={pathV2ChapterHref(courseModule, chapter)} aria-label={`Abrir capítulo ${index + 1}: ${chapter.title}`}><span className="ca-chapter-no">{String(index + 1).padStart(2, "0")}</span><span><strong>{chapter.title}</strong><small>{chapter.outcome}</small><small>{chapter.lessonKeys.length} {chapter.lessonKeys.length === 1 ? "aula" : "aulas"} · {chapter.practices.length} {chapter.practices.length === 1 ? "prática" : "práticas"}{chapter.assignmentKey ? " · entrega com feedback" : ""}{dashboard?.enrollment.programVersion === "v2" && <> · {lessonsDone}/{chapter.lessonKeys.length} aulas{chapter.assignmentKey && (approved ? " · aprovada" : " · entrega pendente")}</>}</small></span>{approved ? <Check aria-hidden="true" className="size-5" /> : <ArrowUpRight aria-hidden="true" className="size-5" />}</Link></li>;
      })}</ol>
    </section>
    <nav aria-label="Outros módulos" className="mt-10 flex flex-wrap justify-between gap-4 border-t pt-5 text-sm font-bold" style={{ borderColor: "var(--ca-line)" }}>{moduleIndex > 0 ? <Link href={`/conteudo/modulos/${mentorshipPathV2[moduleIndex - 1].slug}`} className="ca-back"><ArrowLeft aria-hidden="true" className="size-4" />Módulo anterior</Link> : <span />}{moduleIndex < mentorshipPathV2.length - 1 ? <Link href={`/conteudo/modulos/${mentorshipPathV2[moduleIndex + 1].slug}`} className="ca-text-link">Próximo módulo <ArrowRight aria-hidden="true" className="size-4" /></Link> : <Link href="/conteudo" className="ca-text-link">Todos os módulos</Link>}</nav>
  </main>;
}
