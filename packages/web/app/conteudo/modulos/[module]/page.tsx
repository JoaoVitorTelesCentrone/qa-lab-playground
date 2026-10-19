import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  return <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8"><Link href="/conteudo" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft aria-hidden="true" className="size-4" />Todos os módulos</Link>
    <header className="mt-7"><p className="text-sm text-[#AAB2BC]">Módulo {moduleIndex + 1} de {mentorshipPathV2.length}</p><h1 className="mt-2 text-3xl font-black text-off-white sm:text-4xl">{courseModule.title}</h1><p className="mt-3 max-w-[65ch] text-base leading-7 text-[#C8CFD7]">{courseModule.summary}</p><p className="mt-4 text-sm text-[#AAB2BC]">{courseModule.chapters.length} capítulos · {assignmentCount} {assignmentCount === 1 ? "entrega avaliada" : "entregas avaliadas"}</p><Link href={pathV2ChapterHref(courseModule, resume)} className="mt-6 inline-flex min-h-11 items-center gap-2 bg-mint px-5 text-sm font-bold text-[#101319] hover:bg-neon">{completed.size ? "Continuar" : "Começar"} <ArrowRight aria-hidden="true" className="size-4" /></Link></header>
    <ol className="mt-10 divide-y divide-white/15 border-y border-white/15">{courseModule.chapters.map((chapter, index) => {
      const lessonsDone = chapter.lessonKeys.filter((key) => completed.has(key)).length;
      const approved = chapter.assignmentKey && latest.get(chapter.assignmentKey) === "approved";
      return <li key={chapter.id} className="grid gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_9rem]"><div><p className="text-xs font-semibold text-mint">Capítulo {index + 1}</p><h2 className="mt-1 text-xl font-bold text-off-white"><Link href={pathV2ChapterHref(courseModule, chapter)} className="hover:text-mint">{chapter.title}</Link></h2><p className="mt-2 text-sm leading-6 text-[#C8CFD7]">{chapter.outcome}</p><p className="mt-2 text-xs text-[#AAB2BC]">{chapter.lessonKeys.length} {chapter.lessonKeys.length === 1 ? "aula" : "aulas"} · {chapter.practices.length} {chapter.practices.length === 1 ? "prática" : "práticas"}{chapter.assignmentKey ? " · entrega com feedback" : ""}</p></div><div className="flex items-start justify-between gap-3 sm:flex-col sm:items-end"><Link href={pathV2ChapterHref(courseModule, chapter)} className="inline-flex min-h-10 items-center gap-1 text-sm font-bold text-mint hover:text-neon">Abrir <ArrowRight aria-hidden="true" className="size-4" /></Link>{dashboard?.enrollment.programVersion === "v2" && <span className="text-xs text-[#AAB2BC]">{lessonsDone}/{chapter.lessonKeys.length} aulas{chapter.assignmentKey ? approved ? " · aprovada" : " · entrega pendente" : ""}</span>}</div></li>;
    })}</ol>
    <nav aria-label="Outros módulos" className="mt-8 flex justify-between gap-4 text-sm font-bold">{moduleIndex > 0 ? <Link href={`/conteudo/modulos/${mentorshipPathV2[moduleIndex - 1].slug}`} className="text-[#C8CFD7] hover:text-mint">← Módulo anterior</Link> : <span />}{moduleIndex < mentorshipPathV2.length - 1 ? <Link href={`/conteudo/modulos/${mentorshipPathV2[moduleIndex + 1].slug}`} className="text-mint hover:text-neon">Próximo módulo →</Link> : <Link href="/conteudo" className="text-mint">Todos os módulos</Link>}</nav>
  </main>;
}
