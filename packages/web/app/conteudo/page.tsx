import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import LegacyContentPage from "@/app/mentoria/conteudo/page";
import { getMentorshipDashboard } from "@/lib/mentorship/store";
import { labsForModule } from "@/lib/mentorship/lesson-labs";
import { mentorshipPathV2, pathV2Assignments, pathV2ChapterHref, pathV2ChapterDone, pathV2Progress } from "@/lib/mentorship/path-v2";
import { getSessionUser } from "@/lib/product/store";

export const metadata = { title: "Conteúdo por módulos | QA Lab", description: "Estude QA por competências, pratique no Broto e transforme a investigação em evidência." };
export const dynamic = "force-dynamic";


export default async function ContentCatalogPage() {
  const user = await getSessionUser();
  const dashboard = user ? await getMentorshipDashboard(user.id) : null;
  if (dashboard?.enrollment.programVersion === "v1") return <LegacyContentPage />;
  const completed = new Set((dashboard?.lessons ?? []).filter((row) => row.status === "completed").map((row) => row.lesson_key));
  const latest = new Map<string, string>();
  for (const submission of dashboard?.submissions ?? []) if (!latest.has(submission.assignmentKey)) latest.set(submission.assignmentKey, submission.status);
  const approved = new Set([...latest].filter(([, status]) => status === "approved").map(([key]) => key));
  const delivered = new Set(dashboard?.deliveredLabs ?? []);
  const progress = pathV2Progress(completed, approved, delivered);
  const next = progress.find((item) => !item.complete);
  const resumeChapter = next?.module.chapters.find((chapter) => !pathV2ChapterDone(chapter, completed, approved, delivered)) ?? next?.module.chapters[0];
  const journeyComplete = dashboard?.enrollment.programVersion === "v2" && !next;
  const startHref = journeyComplete ? "/mentoria/app" : next && resumeChapter ? pathV2ChapterHref(next.module, resumeChapter) : pathV2ChapterHref(mentorshipPathV2[0], mentorshipPathV2[0].chapters[0]);

  return <main className="ca-shell">
    <header className="ca-map-head">
      <div>
        <h1>Aprenda QA <em>fazendo.</em></h1>
        <p>{dashboard?.enrollment.programVersion === "v2" ? next ? `Próximo módulo: ${next.module.title}.` : "Percurso concluído. Veja seu case e feedback na mentoria." : "Módulos com aulas e Labs, na ordem. Leitura livre; progresso e feedback são da mentoria."}</p>
      </div>
      <div className="ca-hero-actions">
        <Link href={startHref} className="ca-button">{journeyComplete ? "Ver meu case" : dashboard?.enrollment.programVersion === "v2" && next ? "Continuar meu percurso" : "Começar pelo primeiro capítulo"}<ArrowRight aria-hidden="true" className="size-4" /></Link>
      </div>
    </header>

    <section aria-labelledby="modulos-title" className="pb-8">
      <h2 id="modulos-title" className="sr-only">Módulos</h2>
      <ol className="ca-module-list">{mentorshipPathV2.map((module, index) => {
        const item = progress[index];
        const assignmentCount = pathV2Assignments.filter((assignment) => assignment.moduleId === module.id).length;
        return <li key={module.id} className="ca-module-row"><Link href={`/conteudo/modulos/${module.slug}`} aria-label={`Abrir módulo ${index + 1}: ${module.title}`}>
          <span className="ca-module-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <span><strong className="ca-module-title">{module.title}</strong><span className="ca-module-summary">{module.summary}</span></span>
          <span className="ca-module-meta">{module.chapters.length} capítulos · {module.chapters.reduce((sum, chapter) => sum + chapter.lessonKeys.length, 0)} aulas<br />{labsForModule(module).length} Labs · {assignmentCount} {assignmentCount === 1 ? "entrega" : "entregas"}{dashboard?.enrollment.programVersion === "v2" && <><br /><span style={{ color: "var(--ca-green)" }}>{item.complete ? <><Check aria-hidden="true" className="inline size-3" /> Concluído</> : `${item.lessonsDone}/${item.lessonsTotal} aulas concluídas`}</span></>}</span>
          <ArrowUpRight aria-hidden="true" className="ca-module-arrow size-5" />
        </Link></li>;
      })}</ol>
    </section>

    <aside className="ca-case-callout" aria-labelledby="broto-case-title"><div><h2 id="broto-case-title">Um caso acompanha o percurso.</h2><p>Investigue a história fictícia do Broto. Seus dados pessoais ficam fora das evidências.</p></div><Link href="/conteudo/broto" className="inline-flex min-h-12 items-center gap-2">Preparar o caso <ArrowRight aria-hidden="true" className="size-4" /></Link></aside>
    <aside className="ca-case-callout" aria-labelledby="aprofundar-title"><div><h2 id="aprofundar-title">Aprofundar em uma ferramenta.</h2><p>Cursos de Cypress, Playwright, API, k6 e outros, para estudar depois de uma aula ou no seu ritmo.</p></div><Link href="/trilhas" className="inline-flex min-h-12 items-center gap-2">Ver os cursos <ArrowRight aria-hidden="true" className="size-4" /></Link></aside>
    <p className="pb-14 text-sm" style={{ color: "var(--ca-muted)" }}>Encontros seguem o calendário da turma; capítulos ficam abertos para leitura.</p>
  </main>;
}
