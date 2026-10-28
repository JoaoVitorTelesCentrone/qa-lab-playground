import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { manualTestingCourses, type ManualTestingTrackSlug } from "@/lib/manual-testing-courses";
import { getManualTestingProgress } from "@/lib/manual-testing-progress";
import { ManualTestingCompletionButton } from "./manual-testing-track-client";

export function getManualTestingLessonMetadata(slug: ManualTestingTrackSlug, moduleId: string) {
  const module = manualTestingCourses[slug].modules.find((item) => item.id === moduleId);
  return module ? { title: `${module.title} | ${manualTestingCourses[slug].title}`, description: module.objective } : {};
}

export async function ManualTestingLessonPage({ slug, moduleId }: { slug: ManualTestingTrackSlug; moduleId: string }) {
  const course = manualTestingCourses[slug];
  const index = course.modules.findIndex((item) => item.id === moduleId);
  if (index < 0) notFound();
  const module = course.modules[index];
  const progress = await getManualTestingProgress(slug);
  const previous = course.modules[index - 1];
  const next = course.modules[index + 1];

  return <main className="qa-manual-testing min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <article className="mx-auto max-w-4xl px-5 py-9 sm:px-8 sm:py-12">
      <Link href={`/trilhas/${slug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> {course.title}</Link>
      <header className="mt-8 border-b border-border pb-7"><p className="text-sm font-semibold text-primary">Lab {String(index + 1).padStart(2, "0")} · Bloco {module.week} · {module.duration}</p><h1 className="qa-page-title mt-3">{module.title}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{module.objective}</p></header>
      <section className="grid gap-8 py-7 md:grid-cols-[minmax(0,1fr)_15rem]">
        <div><h2 className="text-lg font-bold">Conceitos</h2><ul className="mt-3 flex flex-wrap gap-2">{module.concepts.map((concept) => <li key={concept} className="border border-border px-2.5 py-1 text-xs text-muted-foreground">{concept}</li>)}</ul></div>
        <aside className="border-l border-border pl-5"><p className="text-xs font-semibold text-muted-foreground">Ambiente de prática</p><Link href="/shop/products" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline">QA Lab Shop <ExternalLink className="size-3.5" aria-hidden="true" /></Link></aside>
      </section>
      <section className="border-y border-border py-6"><h2 className="text-lg font-bold">Prática</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{module.practice}</p><div className="mt-5"><h3 className="text-sm font-semibold">Exemplo para adaptar</h3><pre className="mt-3 whitespace-pre-wrap border border-border bg-[#0c1210] p-4 text-sm leading-6 text-[#e3eee5]"><code>{module.example}</code></pre></div></section>
      <section className="grid gap-8 py-7 md:grid-cols-2"><div><h2 className="text-lg font-bold">O que entregar</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{module.deliverable}</p></div><div><h2 className="text-lg font-bold">Revise antes de concluir</h2><ul className="mt-3 grid gap-2">{module.checklist.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground"><span className="text-primary" aria-hidden="true">□</span><span>{item}</span></li>)}</ul></div></section>
      <ManualTestingCompletionButton slug={slug} module={module} initialCompleted={progress.completed.includes(module.id)} signedIn={progress.signedIn} />
      <nav className="mt-6 flex flex-wrap items-center justify-between gap-4" aria-label="Navegação dos Labs">{previous ? <Link href={`/trilhas/${slug}/${previous.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Anterior: {previous.title}</Link> : <span />}{next ? <Link href={`/trilhas/${slug}/${next.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Próximo: {next.title} <ArrowRight className="size-4" aria-hidden="true" /></Link> : <Link href={`/trilhas/${slug}#projeto-final`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Ir à prática final <ArrowRight className="size-4" aria-hidden="true" /></Link>}</nav>
      <details className="mt-8 border-t border-border pt-5"><summary className="cursor-pointer text-sm font-semibold">Material de referência</summary><ul className="mt-3 grid gap-2">{course.resources.map((resource) => <li key={resource.href}><a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3" aria-hidden="true" /></a></li>)}</ul></details>
    </article>
  </main>;
}
