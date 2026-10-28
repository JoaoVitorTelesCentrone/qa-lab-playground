import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { qaMindsetModules, qaMindsetResources } from "@/lib/qa-mindset-course";
import { QAMindsetCompletionButton } from "../qa-mindset-track-client";
import { getQAMindsetProgress } from "../progress";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const module = qaMindsetModules.find((item) => item.id === moduleId);
  return module ? { title: `${module.title} | Mentalidade de QA`, description: module.objective } : {};
}

export default async function QAMindsetLabPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const index = qaMindsetModules.findIndex((item) => item.id === moduleId);
  if (index < 0) notFound();
  const module = qaMindsetModules[index];
  const progress = await getQAMindsetProgress();
  const previous = qaMindsetModules[index - 1];
  const next = qaMindsetModules[index + 1];

  return <main className="qa-mentalidade min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <article className="mx-auto max-w-4xl px-5 py-9 sm:px-8 sm:py-12">
      <Link href="/trilhas/mentalidade-qa" className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Mentalidade de QA</Link>
      <header className="mt-8 border-b border-border pb-7"><p className="text-sm font-semibold text-primary">Lab {String(index + 1).padStart(2, "0")} · Semana {module.week} · {module.duration}</p><h1 className="qa-page-title mt-3">{module.title}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{module.objective}</p></header>
      <section className="py-7"><h2 className="text-lg font-bold">Ideias-chave</h2><ul className="mt-3 flex flex-wrap gap-2">{module.concepts.map((concept) => <li key={concept} className="border border-border px-2.5 py-1 text-xs text-muted-foreground">{concept}</li>)}</ul></section>
      <section className="border-y border-border py-6"><h2 className="text-lg font-bold">Prática</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{module.practice}</p><div className="mt-5"><h3 className="text-sm font-semibold">Exemplo para adaptar</h3><pre className="mt-3 whitespace-pre-wrap border border-border bg-[#0c1210] p-4 text-sm leading-6 text-[#e3eee5]"><code>{module.example}</code></pre></div></section>
      <section className="grid gap-8 py-7 md:grid-cols-2"><div><h2 className="text-lg font-bold">O que entregar</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{module.deliverable}</p></div><div><h2 className="text-lg font-bold">Revise antes de concluir</h2><ul className="mt-3 grid gap-2">{module.checklist.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground"><span className="text-primary" aria-hidden="true">□</span><span>{item}</span></li>)}</ul></div></section>
      <QAMindsetCompletionButton moduleId={module.id} initialCompleted={progress.completed.includes(module.id)} signedIn={progress.signedIn} />
      <nav className="mt-6 flex flex-wrap items-center justify-between gap-4" aria-label="Navegação dos Labs">{previous ? <Link href={`/trilhas/mentalidade-qa/${previous.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Anterior: {previous.title}</Link> : <span />}{next ? <Link href={`/trilhas/mentalidade-qa/${next.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Próximo: {next.title} <ArrowRight className="size-4" aria-hidden="true" /></Link> : <Link href="/trilhas/mentalidade-qa#projeto-final" className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Ir ao projeto final <ArrowRight className="size-4" aria-hidden="true" /></Link>}</nav>
      <details className="mt-8 border-t border-border pt-5"><summary className="cursor-pointer text-sm font-semibold">Referências para continuar</summary><ul className="mt-3 grid gap-2 sm:grid-cols-2">{qaMindsetResources.map((resource) => <li key={resource.href}><a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3" aria-hidden="true" /></a></li>)}</ul></details>
    </article>
  </main>;
}
