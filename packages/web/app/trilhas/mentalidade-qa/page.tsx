import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { qaMindsetCompass, qaMindsetFinalProject, qaMindsetModules, qaMindsetOutcomes, qaMindsetResources } from "@/lib/qa-mindset-course";
import { QAMindsetTrackOverview } from "./qa-mindset-track-client";
import { getQAMindsetProgress } from "./progress";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mentalidade de QA | QA Lab",
  description: "Desenvolva curiosidade, pensamento crítico, visão de risco e aprendizado contínuo na prática de QA.",
};

export default async function QAMindsetTrackPage() {
  const progress = await getQAMindsetProgress();
  return <main className="qa-mentalidade min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/trilhas" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Todas as trilhas</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Trilha de desenvolvimento pessoal · 8 semanas</p>
        <h1 className="qa-page-title mt-3">Mentalidade de QA se pratica.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Aprenda a investigar com curiosidade, comunicar limites e ajudar o time a enxergar riscos antes que virem surpresa.</p>
      </header>

      <section className="mt-8 border-y border-border py-6" aria-labelledby="qa-compass-title">
        <div className="grid gap-6 md:grid-cols-[minmax(12rem,.8fr)_2fr] md:items-center">
          <div className="border-l-2 border-primary py-2 pl-5"><p className="text-xs font-semibold text-primary">Uma bússola, não uma checklist</p><h2 id="qa-compass-title" className="mt-2 max-w-xs text-2xl font-bold leading-tight">O contexto orienta a investigação.</h2></div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{qaMindsetCompass.map((lens) => <li key={lens.name} className="border-t border-border pt-3"><h3 className="text-sm font-semibold">{lens.name}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{lens.question}</p></li>)}</ul>
        </div>
      </section>

      <QAMindsetTrackOverview modules={qaMindsetModules} initialCompleted={progress.completed} signedIn={progress.signedIn} />

      <section className="mt-12 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_18rem]">
        <div><h2 className="text-xl font-bold">Ao terminar, você vai conseguir</h2><ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">{qaMindsetOutcomes.map((outcome) => <li key={outcome} className="border-l-2 border-primary/60 pl-3">{outcome}</li>)}</ul></div>
        <div className="border-l border-border pl-5"><h2 className="text-sm font-semibold">Leitura de referência</h2><ul className="mt-3 grid gap-2">{qaMindsetResources.map((resource) => <li key={resource.href}><a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs leading-5 text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3 shrink-0" aria-hidden="true" /></a></li>)}</ul></div>
      </section>

      <section id="projeto-final" className="mt-10 border border-border bg-card p-5 sm:p-7">
        <p className="text-sm font-semibold text-primary">Projeto final</p><h2 className="mt-2 text-2xl font-bold">{qaMindsetFinalProject.title}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{qaMindsetFinalProject.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">{qaMindsetFinalProject.deliverables.map((deliverable) => <li key={deliverable} className="flex gap-2 text-sm leading-6"><span className="text-primary" aria-hidden="true">✓</span><span>{deliverable}</span></li>)}</ul>
        <h3 className="mt-7 text-sm font-semibold">Critérios de revisão</h3><dl className="mt-3 grid gap-2 sm:grid-cols-2">{qaMindsetFinalProject.rubric.map((criterion) => <div key={criterion.criterion} className="flex items-start justify-between gap-4 border-t border-border py-2 text-sm"><dt className="text-muted-foreground">{criterion.criterion}</dt><dd className="shrink-0 font-mono text-xs text-primary">{criterion.weight}</dd></div>)}</dl>
      </section>
      <p className="mt-5 text-xs text-muted-foreground">Caderno de prática: <a className="text-primary underline-offset-4 hover:underline" href="https://github.com/JoaoVitorTelesCentrone/qa-lab-playground/tree/main/examples/mentalidade-qa-starter" target="_blank" rel="noreferrer">perguntas e registro de investigação ↗</a></p>
    </div>
  </main>;
}
