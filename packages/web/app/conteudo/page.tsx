import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Sprout } from "lucide-react";
import LegacyContentPage from "@/app/mentoria/conteudo/page";
import { getMentorshipDashboard } from "@/lib/mentorship/store";
import { mentorshipPathV2, pathV2Assignments, pathV2ChapterHref, pathV2PracticeKey, pathV2Progress } from "@/lib/mentorship/path-v2";
import { getSessionUser } from "@/lib/product/store";

export const metadata = { title: "Conteúdo por módulos | QA Lab", description: "Estude QA por competências, pratique no Broto e transforme a investigação em evidência." };
export const dynamic = "force-dynamic";

const route = [
  { number: "01", title: "Observe", description: "Entenda a jornada antes de testar." },
  { number: "02", title: "Investigue", description: "Escolha riscos e faça perguntas melhores." },
  { number: "03", title: "Registre", description: "Guarde o que aconteceu, com contexto." },
  { number: "04", title: "Decida", description: "Transforme evidência em próximo passo." },
];

export default async function ContentCatalogPage() {
  const user = await getSessionUser();
  const dashboard = user ? await getMentorshipDashboard(user.id) : null;
  if (dashboard?.enrollment.programVersion === "v1") return <LegacyContentPage />;
  const completed = new Set((dashboard?.lessons ?? []).filter((row) => row.status === "completed").map((row) => row.lesson_key));
  const latest = new Map<string, string>();
  for (const submission of dashboard?.submissions ?? []) if (!latest.has(submission.assignmentKey)) latest.set(submission.assignmentKey, submission.status);
  const approved = new Set([...latest].filter(([, status]) => status === "approved").map(([key]) => key));
  const progress = pathV2Progress(completed, approved, completed);
  const next = progress.find((item) => !item.complete);
  const resumeChapter = next?.module.chapters.find((chapter) => chapter.lessonKeys.some((key) => !completed.has(key)) || chapter.practices.some((_, index) => !completed.has(pathV2PracticeKey(chapter, index))) || (chapter.assignmentKey && !approved.has(chapter.assignmentKey))) ?? next?.module.chapters[0];
  const journeyComplete = dashboard?.enrollment.programVersion === "v2" && !next;
  const startHref = journeyComplete ? "/mentoria/app" : next && resumeChapter ? pathV2ChapterHref(next.module, resumeChapter) : pathV2ChapterHref(mentorshipPathV2[0], mentorshipPathV2[0].chapters[0]);

  return <main className="ca-shell">
    <header className="ca-hero">
      <div className="ca-hero-copy">
        <h1 className="ca-display">Aprenda QA <em>fazendo.</em></h1>
        <p className="ca-intro">Aprenda fundamentos de QA, pratique no Broto e transforme descobertas em evidências.</p>
        <div className="ca-hero-actions">
          <Link href={startHref} className="ca-button">{journeyComplete ? "Ver meu case" : dashboard?.enrollment.programVersion === "v2" && next ? "Continuar meu percurso" : "Começar pelo primeiro capítulo"}<ArrowRight aria-hidden="true" className="size-4" /></Link>
          <Link href="/conteudo/broto" className="ca-text-link">Conhecer o caso Broto <Sprout aria-hidden="true" className="size-4" /></Link>
        </div>
        <p className="text-xs leading-6" style={{ color: "var(--ca-muted)" }}>{dashboard?.enrollment.programVersion === "v2" ? next ? `Próximo módulo: ${next.module.title}.` : "Percurso concluído. Veja seu case e feedback na mentoria." : "Leitura livre. Progresso e feedback nas entregas são da mentoria."}</p>
      </div>
      <ol className="ca-route" aria-label="Como se aprende QA no conteúdo">
        {route.map((item) => <li key={item.number} className="ca-route-item"><span className="ca-route-num">/ {item.number}</span><strong className="ca-route-title">{item.title}</strong><span className="ca-route-desc">{item.description}</span></li>)}
      </ol>
    </header>

    <section aria-labelledby="modulos-title" className="pb-8">
      <div className="ca-section-head"><h2 id="modulos-title">Módulos da trilha.</h2></div>
      <ol className="ca-module-list">{mentorshipPathV2.map((module, index) => {
        const item = progress[index];
        const assignmentCount = pathV2Assignments.filter((assignment) => assignment.moduleId === module.id).length;
        return <li key={module.id} className="ca-module-row"><Link href={`/conteudo/modulos/${module.slug}`} aria-label={`Abrir módulo ${index + 1}: ${module.title}`}>
          <span className="ca-module-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <span><strong className="ca-module-title">{module.title}</strong><span className="ca-module-summary">{module.summary}</span></span>
          <span className="ca-module-meta">{module.chapters.length} capítulos<br />{assignmentCount} {assignmentCount === 1 ? "entrega" : "entregas"}{dashboard?.enrollment.programVersion === "v2" && <><br /><span style={{ color: "var(--ca-green)" }}>{item.complete ? <><Check aria-hidden="true" className="inline size-3" /> Concluído</> : `${item.lessonsDone}/${item.lessonsTotal} aulas concluídas`}</span></>}</span>
          <ArrowUpRight aria-hidden="true" className="ca-module-arrow size-5" />
        </Link></li>;
      })}</ol>
    </section>

    <aside className="ca-case-callout" aria-labelledby="broto-case-title"><div><h2 id="broto-case-title">Um caso acompanha o percurso.</h2><p>Investigue a história fictícia do Broto. Seus dados pessoais ficam fora das evidências.</p></div><Link href="/conteudo/broto" className="inline-flex min-h-12 items-center gap-2">Preparar o caso <ArrowRight aria-hidden="true" className="size-4" /></Link></aside>
    <p className="pb-14 text-sm" style={{ color: "var(--ca-muted)" }}>Encontros seguem o calendário da turma; capítulos ficam abertos para leitura.</p>
  </main>;
}
