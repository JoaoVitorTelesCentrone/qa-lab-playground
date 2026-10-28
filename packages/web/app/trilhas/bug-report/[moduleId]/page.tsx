import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { bugReportCourseModules, findBugReportModule } from "@/lib/bug-report-course";
import { BugReportCompletionButton } from "../bug-report-track-client";
import { getBugReportProgress } from "../progress";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ moduleId: string }> }) {
  const module = findBugReportModule((await params).moduleId);
  return module ? { title: `${module.title} | Trilha Bug Report`, description: module.objective } : {};
}

export default async function BugReportLabPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const module = findBugReportModule(moduleId);
  if (!module) notFound();

  const progress = await getBugReportProgress();
  const index = bugReportCourseModules.findIndex((item) => item.id === module.id);
  const previous = bugReportCourseModules[index - 1];
  const next = bugReportCourseModules[index + 1];
  const completed = progress.completed.includes(module.id);

  return <main className="qa-bug-report min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <article className="mx-auto max-w-4xl px-5 py-9 sm:px-8 sm:py-12">
      <Link href="/trilhas/bug-report" className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Trilha Bug Report</Link>
      <header className="mt-8 border-b border-border pb-7">
        <p className="text-sm font-semibold text-primary">Lab {String(index + 1).padStart(2, "0")} · Semana {module.week} · {module.duration}</p>
        <h1 className="qa-page-title mt-3">{module.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{module.objective}</p>
      </header>

      <section className="grid gap-8 py-7 md:grid-cols-[minmax(0,1fr)_15rem]">
        <div>
          <h2 className="text-lg font-bold">Conceitos deste Lab</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {module.concepts.map((concept) => <li key={concept} className="border border-border px-2.5 py-1 text-xs text-muted-foreground">{concept}</li>)}
          </ul>
        </div>
        <div className="border-l border-border pl-5">
          <p className="text-xs font-semibold text-muted-foreground">Ferramenta de apoio</p>
          <Link href="/playground/template-bug-report" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline">Template de bug report <ExternalLink className="size-3.5" aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="border-y border-border py-6">
        <h2 className="text-lg font-bold">Prática</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{module.practice}</p>
        <div className="mt-5">
          <h3 className="text-sm font-semibold">Exemplo</h3>
          <pre className="mt-3 max-h-[30rem] overflow-auto border border-border bg-[#111614] p-4 text-xs leading-6 text-[#e3eee5] sm:text-sm"><code>{module.example}</code></pre>
        </div>
      </section>

      <section className="grid gap-8 py-7 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold">O que entregar</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{module.deliverable}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Revise antes de concluir</h2>
          <ul className="mt-3 grid gap-2">
            {module.checklist.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground"><span className="text-primary" aria-hidden="true">□</span><span>{item}</span></li>)}
          </ul>
        </div>
      </section>

      <BugReportCompletionButton moduleId={module.id} initialCompleted={completed} signedIn={progress.signedIn} />

      <nav className="mt-6 flex flex-wrap items-center justify-between gap-4" aria-label="Navegação dos Labs">
        {previous ? <Link href={`/trilhas/bug-report/${previous.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Anterior: {previous.title}</Link> : <span />}
        {next ? <Link href={`/trilhas/bug-report/${next.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Próximo: {next.title}<ArrowRight className="size-4" aria-hidden="true" /></Link> : <Link href="/trilhas/bug-report#projeto-final" className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Ir ao projeto final<ArrowRight className="size-4" aria-hidden="true" /></Link>}
      </nav>
    </article>
  </main>;
}
