import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { playwrightCourseModules, playwrightCourseOutcomes, playwrightCourseResources, playwrightFinalProject } from "@/lib/playwright-course";
import { PlaywrightTrackOverview } from "./playwright-track-client";
import { getPlaywrightProgress } from "./progress";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Trilha Playwright | QA Lab",
  description: "Aprenda automação web com Playwright: locators, isolamento, cross-browser, traces e CI.",
};

export default async function PlaywrightTrackPage() {
  const progress = await getPlaywrightProgress();
  return <main className="qa-playwright min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/trilhas" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Todas as trilhas</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Trilha prática · Playwright · 8 semanas</p>
        <h1 className="qa-page-title mt-3">Automatize jornadas. Investigue cada falha.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Construa uma suíte web confiável: do primeiro locator até o CI, usando a QA Lab Shop como projeto de prática.</p>
        <Link href="/shop/products" className="mt-5 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline">Abrir a loja de treino ↗</Link>
      </header>

      <section className="mt-8 border-y border-border py-5" aria-label="Fluxo de execução Playwright">
        <div className="grid gap-4 sm:grid-cols-4">
          {[ ["Ação", "o que a pessoa faz"], ["Locator", "como encontra o controle"], ["Expectativa", "o que deve acontecer"], ["Trace", "como investigar a falha"] ].map(([name, detail], index) => <div key={name} className="relative flex gap-3 sm:block">
            <span className="flex size-7 shrink-0 items-center justify-center border border-primary/60 font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
            <div className="sm:mt-3"><h2 className="text-sm font-semibold">{name}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></div>
            {index < 3 && <span className="absolute left-3.5 top-7 h-[calc(100%-1rem)] border-l border-primary/30 sm:left-[2rem] sm:top-3.5 sm:h-0 sm:w-[calc(100%-1rem)] sm:border-l-0 sm:border-t" aria-hidden="true" />}
          </div>)}
        </div>
      </section>

      <PlaywrightTrackOverview modules={playwrightCourseModules} initialCompleted={progress.completed} signedIn={progress.signedIn} />

      <section className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
        <div><h2 className="font-semibold">Projeto inicial</h2><p className="mt-1 text-sm text-muted-foreground">Specs de catálogo e carrinho para ampliar durante os Labs.</p></div>
        <a href="https://github.com/JoaoVitorTelesCentrone/qa-lab-playground/tree/main/examples/playwright-track-starter" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-sm font-semibold text-primary underline-offset-4 hover:border-primary hover:underline">Abrir starter no GitHub <ExternalLink className="size-3.5" aria-hidden="true" /></a>
      </section>

      <section className="mt-12 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_18rem]">
        <div><h2 className="text-xl font-bold">Ao terminar, você vai conseguir</h2><ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">{playwrightCourseOutcomes.map((outcome) => <li key={outcome} className="border-l-2 border-primary/60 pl-3">{outcome}</li>)}</ul></div>
        <div className="border-l border-border pl-5"><h2 className="text-sm font-semibold">Documentação oficial</h2><ul className="mt-3 grid gap-2">{playwrightCourseResources.map((resource) => <li key={resource.href}><a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs leading-5 text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3 shrink-0" aria-hidden="true" /></a></li>)}</ul></div>
      </section>

      <section id="projeto-final" className="mt-10 border border-border bg-card p-5 sm:p-7">
        <p className="text-sm font-semibold text-primary">Projeto final</p><h2 className="mt-2 text-2xl font-bold">{playwrightFinalProject.title}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{playwrightFinalProject.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">{playwrightFinalProject.deliverables.map((deliverable) => <li key={deliverable} className="flex gap-2 text-sm leading-6"><span className="text-primary" aria-hidden="true">✓</span><span>{deliverable}</span></li>)}</ul>
        <h3 className="mt-7 text-sm font-semibold">Critérios de revisão</h3><dl className="mt-3 grid gap-2 sm:grid-cols-2">{playwrightFinalProject.rubric.map((criterion) => <div key={criterion.criterion} className="flex items-start justify-between gap-4 border-t border-border py-2 text-sm"><dt className="text-muted-foreground">{criterion.criterion}</dt><dd className="shrink-0 font-mono text-xs text-primary">{criterion.weight}</dd></div>)}</dl>
      </section>
    </div>
  </main>;
}
