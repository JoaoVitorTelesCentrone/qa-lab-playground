import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { appiumSeleniumFinalProject, appiumSeleniumModules, appiumSeleniumOutcomes, appiumSeleniumResources } from "@/lib/appium-selenium-course";
import { AppiumSeleniumTrackOverview } from "./appium-selenium-track-client";
import { getAppiumSeleniumProgress } from "./progress";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Trilha Appium e Selenium mobile | QA Lab",
  description: "Automatize apps nativos, híbridos e mobile web com Appium e WebDriver.",
};

export default async function AppiumSeleniumTrackPage() {
  const progress = await getAppiumSeleniumProgress();

  return <main className="qa-appium-selenium min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/trilhas" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Todas as trilhas</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Trilha prática · Appium + Selenium · 8 semanas</p>
        <h1 className="qa-page-title mt-3">Automatize o que acontece no mobile de verdade.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Aprenda WebDriver com Selenium e leve os testes a apps Android, iOS, híbridos e browsers de dispositivos usando Appium.</p>
      </header>

      <AppiumSeleniumTrackOverview modules={appiumSeleniumModules} initialCompleted={progress.completed} signedIn={progress.signedIn} />

      <section className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <h2 className="font-semibold">Comece com o starter Java</h2>
          <p className="mt-1 text-sm text-muted-foreground">Appium Java Client, Selenium WebDriver e teste Android por accessibility id.</p>
        </div>
        <a href="https://github.com/JoaoVitorTelesCentrone/qa-lab-playground/tree/main/examples/appium-selenium-track-starter" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-sm font-semibold text-primary underline-offset-4 hover:border-primary hover:underline">Abrir starter no GitHub <ExternalLink className="size-3.5" aria-hidden="true" /></a>
      </section>

      <section className="mt-12 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_18rem]">
        <div>
          <h2 className="text-xl font-bold">Ao terminar, você vai conseguir</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
            {appiumSeleniumOutcomes.map((outcome) => <li key={outcome} className="border-l-2 border-primary/60 pl-3">{outcome}</li>)}
          </ul>
        </div>
        <div className="border-l border-border pl-5">
          <h2 className="text-sm font-semibold">Documentação oficial</h2>
          <ul className="mt-3 grid gap-2">
            {appiumSeleniumResources.map((resource) => <li key={resource.href}>
              <a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs leading-5 text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3 shrink-0" aria-hidden="true" /></a>
            </li>)}
          </ul>
        </div>
      </section>

      <section id="projeto-final" className="mt-10 border border-border bg-card p-5 sm:p-7">
        <p className="text-sm font-semibold text-primary">Entrega de conclusão</p>
        <h2 className="mt-2 text-2xl font-bold">{appiumSeleniumFinalProject.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{appiumSeleniumFinalProject.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {appiumSeleniumFinalProject.deliverables.map((deliverable) => <li key={deliverable} className="flex gap-2 text-sm leading-6"><span className="text-primary" aria-hidden="true">✓</span><span>{deliverable}</span></li>)}
        </ul>
        <h3 className="mt-7 text-sm font-semibold">Como revisar o projeto</h3>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {appiumSeleniumFinalProject.rubric.map((criterion) => <div key={criterion.criterion} className="flex items-start justify-between gap-4 border-t border-border py-2 text-sm">
            <dt className="text-muted-foreground">{criterion.criterion}</dt><dd className="shrink-0 font-mono text-xs text-primary">{criterion.weight}</dd>
          </div>)}
        </dl>
      </section>
    </div>
  </main>;
}
