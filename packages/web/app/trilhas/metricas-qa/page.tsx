import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { qaMetricsFinalProject, qaMetricsModules, qaMetricsOutcomes, qaMetricsResources } from "@/lib/qa-metrics-course";
import { QaMetricsTrackOverview } from "./metricas-qa-track-client";
import { getQaMetricsProgress } from "./progress";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Trilha Métricas para QA | QA Lab",
  description: "Defina KPIs de qualidade, interprete DORA e SLOs e monte um scorecard acionável.",
};

export default async function QaMetricsTrackPage() {
  const progress = await getQaMetricsProgress();

  return <main className="qa-metricas-qa min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/trilhas" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Todas as trilhas</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Trilha prática · Métricas para QA · 8 semanas</p>
        <h1 className="qa-page-title mt-3">Meça o que ajuda o time a melhorar.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Aprenda a definir KPIs de qualidade, ler sinais com contexto e transformar dados em decisões — sem ranking individual nem metas copiadas.</p>
      </header>

      <QaMetricsTrackOverview modules={qaMetricsModules} initialCompleted={progress.completed} signedIn={progress.signedIn} />

      <section className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <h2 className="font-semibold">Use o starter do scorecard</h2>
          <p className="mt-1 text-sm text-muted-foreground">Dicionário de métricas, template e dados de exemplo fictícios.</p>
        </div>
        <a href="https://github.com/JoaoVitorTelesCentrone/qa-lab-playground/tree/main/examples/qa-metrics-track-starter" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-sm font-semibold text-primary underline-offset-4 hover:border-primary hover:underline">Abrir starter no GitHub <ExternalLink className="size-3.5" aria-hidden="true" /></a>
      </section>

      <section className="mt-12 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_18rem]">
        <div>
          <h2 className="text-xl font-bold">Ao terminar, você vai conseguir</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
            {qaMetricsOutcomes.map((outcome) => <li key={outcome} className="border-l-2 border-primary/60 pl-3">{outcome}</li>)}
          </ul>
        </div>
        <div className="border-l border-border pl-5">
          <h2 className="text-sm font-semibold">Referências</h2>
          <ul className="mt-3 grid gap-2">
            {qaMetricsResources.map((resource) => <li key={resource.href}>
              <a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs leading-5 text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3 shrink-0" aria-hidden="true" /></a>
            </li>)}
          </ul>
        </div>
      </section>

      <section id="projeto-final" className="mt-10 border border-border bg-card p-5 sm:p-7">
        <p className="text-sm font-semibold text-primary">Entrega de conclusão</p>
        <h2 className="mt-2 text-2xl font-bold">{qaMetricsFinalProject.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{qaMetricsFinalProject.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {qaMetricsFinalProject.deliverables.map((deliverable) => <li key={deliverable} className="flex gap-2 text-sm leading-6"><span className="text-primary" aria-hidden="true">✓</span><span>{deliverable}</span></li>)}
        </ul>
        <h3 className="mt-7 text-sm font-semibold">Como revisar o projeto</h3>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {qaMetricsFinalProject.rubric.map((criterion) => <div key={criterion.criterion} className="flex items-start justify-between gap-4 border-t border-border py-2 text-sm">
            <dt className="text-muted-foreground">{criterion.criterion}</dt><dd className="shrink-0 font-mono text-xs text-primary">{criterion.weight}</dd>
          </div>)}
        </dl>
      </section>
    </div>
  </main>;
}
