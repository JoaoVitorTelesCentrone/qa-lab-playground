import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { findPathV2Lesson, findPathV2Module, mentorshipPathV2, pathV2Assignments, pathV2ChapterDone, pathV2ChapterHref, pathV2ChapterLabs } from "@/lib/mentorship/path-v2";
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
  const approvedKeys = new Set([...latest].filter(([, status]) => status === "approved").map(([key]) => key));
  const delivered = new Set(dashboard?.deliveredLabs ?? []);
  const resume = courseModule.chapters.find((chapter) => !pathV2ChapterDone(chapter, completed, approvedKeys, delivered)) ?? courseModule.chapters[0];
  const moduleIndex = mentorshipPathV2.indexOf(courseModule);
  const assignmentCount = pathV2Assignments.filter((item) => item.moduleId === courseModule.id).length;
  const completedChapters = courseModule.chapters.filter((chapter) => pathV2ChapterDone(chapter, completed, approvedKeys, delivered)).length;

  return <main className="ca-shell ca-interior">
    <Link href="/conteudo" className="ca-back"><ArrowLeft aria-hidden="true" className="size-4" /> Mapa de módulos</Link>
    <header className="ca-interior-hero">
      <div>
        <span className="ca-kicker">Módulo {String(moduleIndex + 1).padStart(2, "0")} / {String(mentorshipPathV2.length).padStart(2, "0")}</span>
        <h1 className="mt-3">{courseModule.title}</h1>
        <p>{courseModule.summary}</p>
        <p className="ca-hero-meta">{courseModule.chapters.length} capítulos · {assignmentCount} {assignmentCount === 1 ? "entrega avaliada" : "entregas avaliadas"}{dashboard?.enrollment.programVersion === "v2" && <> · {completedChapters} concluído(s)</>}</p>
      </div>
      <Link href={pathV2ChapterHref(courseModule, resume)} className="ca-button">{completedChapters > 0 ? "Continuar módulo" : "Começar módulo"}<ArrowRight aria-hidden="true" className="size-4" /></Link>
    </header>
    <section aria-label="Capítulos do módulo">
      <ol className="ca-chapter-list">{courseModule.chapters.map((chapter, index) => {
        const lessonsDone = chapter.lessonKeys.filter((key) => completed.has(key)).length;
        const approved = chapter.assignmentKey && latest.get(chapter.assignmentKey) === "approved";
        const chapterHref = pathV2ChapterHref(courseModule, chapter);
        return <li key={chapter.id}><Link href={chapterHref} aria-label={`Abrir capítulo ${index + 1}: ${chapter.title}`}><span className="ca-chapter-no">{String(index + 1).padStart(2, "0")}</span><span><strong>{chapter.title}</strong><small>{chapter.outcome}</small><small>{chapter.lessonKeys.length} {chapter.lessonKeys.length === 1 ? "aula" : "aulas"} · {pathV2ChapterLabs(chapter).length} {pathV2ChapterLabs(chapter).length === 1 ? "Lab" : "Labs"}{chapter.assignmentKey ? " · entrega com feedback" : ""}{dashboard?.enrollment.programVersion === "v2" && <> · {lessonsDone}/{chapter.lessonKeys.length} aulas{chapter.assignmentKey && (approved ? " · aprovada" : " · entrega pendente")}</>}</small></span>{approved ? <Check aria-hidden="true" className="size-5" /> : <ArrowUpRight aria-hidden="true" className="size-5" />}</Link>
          <ul className="ca-chapter-lessons" aria-label={`Aulas do capítulo ${index + 1}`}>{chapter.lessonKeys.map((key) => <li key={key}><Link href={`${chapterHref}#${key}`}>{findPathV2Lesson(key)?.title ?? "Aula"}</Link></li>)}</ul></li>;
      })}</ol>
    </section>
    <nav aria-label="Outros módulos" className="mt-10 flex flex-wrap justify-between gap-4 border-t pt-5 text-sm font-bold" style={{ borderColor: "var(--ca-line)" }}>{moduleIndex > 0 ? <Link href={`/conteudo/modulos/${mentorshipPathV2[moduleIndex - 1].slug}`} className="ca-back"><ArrowLeft aria-hidden="true" className="size-4" />Módulo anterior</Link> : <span />}{moduleIndex < mentorshipPathV2.length - 1 ? <Link href={`/conteudo/modulos/${mentorshipPathV2[moduleIndex + 1].slug}`} className="ca-text-link">Próximo módulo <ArrowRight aria-hidden="true" className="size-4" /></Link> : <Link href="/conteudo" className="ca-text-link">Todos os módulos</Link>}</nav>
  </main>;
}
