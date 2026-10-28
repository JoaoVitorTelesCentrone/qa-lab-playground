import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { playwrightCourseModules, playwrightCourseResources } from "@/lib/playwright-course";
import { PlaywrightCompletionButton } from "../playwright-track-client";
import { getPlaywrightProgress } from "../progress";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const module = playwrightCourseModules.find((item) => item.id === moduleId);
  return module ? { title: `${module.title} | Trilha Playwright`, description: module.objective } : {};
}

export default async function PlaywrightLabPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const index = playwrightCourseModules.findIndex((item) => item.id === moduleId);
  if (index < 0) notFound();
  const module = playwrightCourseModules[index];
  const progress = await getPlaywrightProgress();
  const previous = playwrightCourseModules[index - 1];
  const next = playwrightCourseModules[index + 1];
  const completed = progress.completed.includes(module.id);

  return <main className="qa-playwright min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <article className="mx-auto max-w-4xl px-5 py-9 sm:px-8 sm:py-12">
      <Link href="/trilhas/playwright" className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Trilha Playwright</Link>
      <header className="mt-8 border-b border-border pb-7">
        <p className="text-sm font-semibold text-primary">Lab {String(index + 1).padStart(2, "0")} · Semana {module.week} · {module.duration}</p>
        <h1 className="qa-page-title mt-3">{module.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{module.objective}</p>
      </header>

      <section className="grid gap-8 py-7 md:grid-cols-[minmax(0,1fr)_15rem]">
        <div><h2 className="text-lg font-bold">Conceitos</h2><ul className="mt-3 flex flex-wrap gap-2">{module.concepts.map((concept) => <li key={concept} className="border border-border px-2.5 py-1 text-xs text-muted-foreground">{concept}</li>)}</ul></div>
        <aside className="border-l border-border pl-5"><p className="text-xs font-semibold text-muted-foreground">Projeto de prática</p><Link href="/shop/products" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline">QA Lab Shop <ExternalLink className="size-3.5" aria-hidden="true" /></Link></aside>
      </section>

      <section className="border-y border-border py-6">
        <h2 className="text-lg font-bold">Prática</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{module.practice}</p>
        <div className="mt-5"><h3 className="text-sm font-semibold">Exemplo de código</h3><p className="mt-1 text-xs text-muted-foreground">Adapte ao projeto criado por você e confira os locators no navegador.</p><pre className="mt-3 max-h-[30rem] overflow-auto border border-border bg-[#0c1210] p-4 text-xs leading-6 text-[#e3eee5] sm:text-sm"><code>{module.code}</code></pre></div>
      </section>

      <section className="grid gap-8 py-7 md:grid-cols-2"><div><h2 className="text-lg font-bold">O que entregar</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{module.deliverable}</p></div><div><h2 className="text-lg font-bold">Revise antes de concluir</h2><ul className="mt-3 grid gap-2">{module.checklist.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground"><span className="text-primary" aria-hidden="true">□</span><span>{item}</span></li>)}</ul></div></section>

      {module.id === "debug-traces-flakiness" && <aside className="mb-7 border-l-2 border-primary/60 pl-4 text-xs leading-5 text-muted-foreground">Trace files can include page content and network details. Keep artifacts private and redact credentials or personal data before sharing.</aside>}
      <PlaywrightCompletionButton moduleId={module.id} initialCompleted={completed} signedIn={progress.signedIn} />
      <nav className="mt-6 flex flex-wrap items-center justify-between gap-4" aria-label="Navegação dos Labs">
        {previous ? <Link href={`/trilhas/playwright/${previous.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Anterior: {previous.title}</Link> : <span />}
        {next ? <Link href={`/trilhas/playwright/${next.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Próximo: {next.title} <ArrowRight className="size-4" aria-hidden="true" /></Link> : <Link href="/trilhas/playwright#projeto-final" className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Ir ao projeto final <ArrowRight className="size-4" aria-hidden="true" /></Link>}
      </nav>
      <details className="mt-8 border-t border-border pt-5"><summary className="cursor-pointer text-sm font-semibold">Documentação oficial para esta trilha</summary><ul className="mt-3 grid gap-2 sm:grid-cols-2">{playwrightCourseResources.map((resource) => <li key={resource.href}><a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3" aria-hidden="true" /></a></li>)}</ul></details>
    </article>
  </main>;
}
