import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { communicationAgileModules, communicationAgileResources } from "@/lib/comunicacao-agil-course";
import { CommunicationAgileCompletionButton } from "../comunicacao-agil-track-client";
import { getCommunicationAgileProgress } from "../progress";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const module = communicationAgileModules.find((item) => item.id === moduleId);
  return module ? { title: `${module.title} | Comunicação e ágil`, description: module.objective } : {};
}

export default async function CommunicationAgileLabPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const index = communicationAgileModules.findIndex((item) => item.id === moduleId);
  if (index < 0) notFound();
  const module = communicationAgileModules[index];
  const progress = await getCommunicationAgileProgress();
  const previous = communicationAgileModules[index - 1];
  const next = communicationAgileModules[index + 1];

  return <main className="qa-comunicacao-agil min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <article className="mx-auto max-w-4xl px-5 py-9 sm:px-8 sm:py-12">
      <Link href="/trilhas/comunicacao-agil" className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Trilha de comunicação</Link>
      <header className="mt-8 border-b border-border pb-7"><p className="text-sm font-semibold text-primary">Lab {String(index + 1).padStart(2, "0")} · Semana {module.week} · {module.duration}</p><h1 className="qa-page-title mt-3">{module.title}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{module.objective}</p></header>
      <section className="py-7"><h2 className="text-lg font-bold">Ideias-chave</h2><ul className="mt-3 flex flex-wrap gap-2">{module.concepts.map((concept) => <li key={concept} className="border border-border px-2.5 py-1 text-xs text-muted-foreground">{concept}</li>)}</ul></section>
      <section className="border-y border-border py-6"><h2 className="text-lg font-bold">Prática</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{module.practice}</p><div className="mt-5"><h3 className="text-sm font-semibold">Exemplo para adaptar</h3><pre className="mt-3 whitespace-pre-wrap border border-border bg-[#0c1210] p-4 text-sm leading-6 text-[#e3eee5]"><code>{module.example}</code></pre></div></section>
      <section className="grid gap-8 py-7 md:grid-cols-2"><div><h2 className="text-lg font-bold">O que entregar</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{module.deliverable}</p></div><div><h2 className="text-lg font-bold">Revise antes de concluir</h2><ul className="mt-3 grid gap-2">{module.checklist.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground"><span className="text-primary" aria-hidden="true">□</span><span>{item}</span></li>)}</ul></div></section>
      <CommunicationAgileCompletionButton moduleId={module.id} initialCompleted={progress.completed.includes(module.id)} signedIn={progress.signedIn} />
      <nav className="mt-6 flex flex-wrap items-center justify-between gap-4" aria-label="Navegação dos Labs">{previous ? <Link href={`/trilhas/comunicacao-agil/${previous.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Anterior: {previous.title}</Link> : <span />}{next ? <Link href={`/trilhas/comunicacao-agil/${next.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Próximo: {next.title} <ArrowRight className="size-4" aria-hidden="true" /></Link> : <Link href="/trilhas/comunicacao-agil#projeto-final" className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Ir ao projeto final <ArrowRight className="size-4" aria-hidden="true" /></Link>}</nav>
      <details className="mt-8 border-t border-border pt-5"><summary className="cursor-pointer text-sm font-semibold">Referências oficiais</summary><ul className="mt-3 grid gap-2 sm:grid-cols-2">{communicationAgileResources.map((resource) => <li key={resource.href}><a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3" aria-hidden="true" /></a></li>)}</ul></details>
    </article>
  </main>;
}
