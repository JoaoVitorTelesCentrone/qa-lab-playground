import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { communicationAgileFinalProject, communicationAgileModules, communicationAgileOutcomes, communicationAgileResources } from "@/lib/comunicacao-agil-course";
import { CommunicationAgileTrackOverview } from "./comunicacao-agil-track-client";
import { getCommunicationAgileProgress } from "./progress";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Comunicação e desenvolvimento ágil | QA Lab",
  description: "Pratique comunicação para QA em refinamentos, Scrum, Kanban, feedback e colaboração com o time.",
};

export default async function CommunicationAgileTrackPage() {
  const progress = await getCommunicationAgileProgress();
  const flow = [["Pedido", "entender valor"], ["Acordo", "exemplos e risco"], ["Entrega", "feedback curto"], ["Aprendizado", "próximo ajuste"]];
  return <main className="qa-comunicacao-agil min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/trilhas" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Todas as trilhas</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Trilha prática · Comunicação e desenvolvimento ágil · 8 semanas</p>
        <h1 className="qa-page-title mt-3">Converse melhor. Entregue qualidade junto.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Pratique as conversas de QA que ajudam um time a entender, decidir, entregar e aprender.</p>
      </header>

      <section className="mt-8 border-y border-border py-5" aria-label="Fluxo de comunicação e qualidade">
        <div className="grid gap-4 sm:grid-cols-4">
          {flow.map(([name, detail], index) => <div key={name} className="relative flex gap-3 sm:block">
            <span className="flex size-7 shrink-0 items-center justify-center border border-primary/60 font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
            <div className="sm:mt-3"><h2 className="text-sm font-semibold">{name}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></div>
            {index < flow.length - 1 && <span className="absolute left-3.5 top-7 h-[calc(100%-1rem)] border-l border-primary/30 sm:left-[2rem] sm:top-3.5 sm:h-0 sm:w-[calc(100%-1rem)] sm:border-l-0 sm:border-t" aria-hidden="true" />}
          </div>)}
        </div>
      </section>

      <CommunicationAgileTrackOverview modules={communicationAgileModules} initialCompleted={progress.completed} signedIn={progress.signedIn} />

      <section className="mt-12 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_18rem]">
        <div><h2 className="text-xl font-bold">Ao terminar, você vai conseguir</h2><ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">{communicationAgileOutcomes.map((outcome) => <li key={outcome} className="border-l-2 border-primary/60 pl-3">{outcome}</li>)}</ul></div>
        <div className="border-l border-border pl-5"><h2 className="text-sm font-semibold">Referências oficiais</h2><ul className="mt-3 grid gap-2">{communicationAgileResources.map((resource) => <li key={resource.href}><a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs leading-5 text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3 shrink-0" aria-hidden="true" /></a></li>)}</ul></div>
      </section>

      <section id="projeto-final" className="mt-10 border border-border bg-card p-5 sm:p-7">
        <p className="text-sm font-semibold text-primary">Projeto final</p><h2 className="mt-2 text-2xl font-bold">{communicationAgileFinalProject.title}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{communicationAgileFinalProject.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">{communicationAgileFinalProject.deliverables.map((deliverable) => <li key={deliverable} className="flex gap-2 text-sm leading-6"><span className="text-primary" aria-hidden="true">✓</span><span>{deliverable}</span></li>)}</ul>
        <h3 className="mt-7 text-sm font-semibold">Critérios de revisão</h3><dl className="mt-3 grid gap-2 sm:grid-cols-2">{communicationAgileFinalProject.rubric.map((criterion) => <div key={criterion.criterion} className="flex items-start justify-between gap-4 border-t border-border py-2 text-sm"><dt className="text-muted-foreground">{criterion.criterion}</dt><dd className="shrink-0 font-mono text-xs text-primary">{criterion.weight}</dd></div>)}</dl>
      </section>
      <p className="mt-5 text-xs text-muted-foreground">Templates para adaptar: <a className="text-primary underline-offset-4 hover:underline" href="https://github.com/JoaoVitorTelesCentrone/qa-lab-playground/tree/main/examples/comunicacao-agil-track-starter" target="_blank" rel="noreferrer">starter de comunicação ágil ↗</a></p>
    </div>
  </main>;
}
