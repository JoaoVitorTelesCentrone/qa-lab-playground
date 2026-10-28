import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { gherkinCourseModules, gherkinCourseOutcomes, gherkinCourseResources, gherkinFinalProject } from "@/lib/gherkin-course";
import { GherkinTrackOverview } from "./gherkin-track-client";
import { getGherkinProgress } from "./progress";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Trilha Gherkin | QA Lab",
  description: "Aprenda BDD e Gherkin da descoberta colaborativa à automação com Cucumber.",
};

export default async function GherkinTrackPage() {
  const progress = await getGherkinProgress();

  return <main className="qa-gherkin min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/trilhas" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Todas as trilhas</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Trilha prática · Gherkin · 8 semanas</p>
        <h1 className="qa-page-title mt-3">Escreva exemplos que o time reconhece.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Comece pela conversa e pelas regras. Depois transforme os exemplos em especificações claras, revisáveis e automatizadas onde fizer sentido.</p>
        <Link href="/lab/bdd" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Abrir o gerador de BDD <ExternalLink className="size-4" aria-hidden="true" /></Link>
      </header>

      <GherkinTrackOverview modules={gherkinCourseModules} initialCompleted={progress.completed} signedIn={progress.signedIn} />

      <section className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <h2 className="font-semibold">Pratique com um projeto inicial</h2>
          <p className="mt-1 text-sm text-muted-foreground">Feature em português, Cucumber.js e um cenário de API somente leitura.</p>
        </div>
        <a href="https://github.com/JoaoVitorTelesCentrone/qa-lab-playground/tree/main/examples/gherkin-track-starter" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-sm font-semibold text-primary underline-offset-4 hover:border-primary hover:underline">Abrir starter no GitHub <ExternalLink className="size-3.5" aria-hidden="true" /></a>
      </section>

      <section className="mt-12 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_18rem]">
        <div>
          <h2 className="text-xl font-bold">Ao terminar, você vai conseguir</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
            {gherkinCourseOutcomes.map((outcome) => <li key={outcome} className="border-l-2 border-primary/60 pl-3">{outcome}</li>)}
          </ul>
        </div>
        <div className="border-l border-border pl-5">
          <h2 className="text-sm font-semibold">Documentação oficial</h2>
          <ul className="mt-3 grid gap-2">
            {gherkinCourseResources.map((resource) => <li key={resource.href}>
              <a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs leading-5 text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3 shrink-0" aria-hidden="true" /></a>
            </li>)}
          </ul>
        </div>
      </section>

      <section id="projeto-final" className="mt-10 border border-border bg-card p-5 sm:p-7">
        <p className="text-sm font-semibold text-primary">Entrega de conclusão</p>
        <h2 className="mt-2 text-2xl font-bold">{gherkinFinalProject.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{gherkinFinalProject.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {gherkinFinalProject.deliverables.map((deliverable) => <li key={deliverable} className="flex gap-2 text-sm leading-6"><span className="text-primary" aria-hidden="true">✓</span><span>{deliverable}</span></li>)}
        </ul>
        <h3 className="mt-7 text-sm font-semibold">Como revisar o projeto</h3>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {gherkinFinalProject.rubric.map((criterion) => <div key={criterion.criterion} className="flex items-start justify-between gap-4 border-t border-border py-2 text-sm">
            <dt className="text-muted-foreground">{criterion.criterion}</dt><dd className="shrink-0 font-mono text-xs text-primary">{criterion.weight}</dd>
          </div>)}
        </dl>
      </section>
    </div>
  </main>;
}
