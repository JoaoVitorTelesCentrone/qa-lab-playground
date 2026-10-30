import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { sqlQACourseFlow, sqlQAFinalProject, sqlQAModules, sqlQAOutcomes, sqlQAResources } from "@/lib/sql-qa-course";
import { SQLQATrackOverview } from "./track-client";
import { getSQLQAProgress } from "./progress";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "SQL para QA | QA Lab",
  description: "Aprenda SQL com consultas de leitura, validações de dados e exercícios seguros em PostgreSQL.",
};

export default async function SQLQATrackPage() {
  const progress = await getSQLQAProgress();

  return <main className="qa-sql-qa min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/trilhas" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Todas as trilhas</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Trilha prática · SQL para QA · 4 semanas</p>
        <h1 className="qa-page-title mt-3">Use dados para confirmar o que o sistema promete.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Aprenda PostgreSQL do básico a verificações úteis de qualidade: consultar, filtrar, relacionar e investigar dados com segurança.</p>
      </header>

      <aside className="mt-7 border-l-2 border-primary bg-card px-4 py-3 text-sm leading-6 text-muted-foreground">
        Os exercícios usam dados sintéticos e tabelas temporárias locais, inspirados nas jornadas de ideias, desafios e ações do BrotoSpace. Não se conectam ao banco de produção.
      </aside>

      <SQLQATrackOverview modules={sqlQAModules} initialCompleted={progress.completed} signedIn={progress.signedIn} />

      <section className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <h2 className="font-semibold">Prepare o banco local de treino</h2>
          <p className="mt-1 text-sm text-muted-foreground">O starter cria tabelas temporárias e registros fictícios para os Labs.</p>
        </div>
        <a href="https://github.com/JoaoVitorTelesCentrone/qa-lab-playground/tree/main/examples/sql-qa-starter" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 border border-border px-3 text-sm font-semibold text-primary underline-offset-4 hover:border-primary hover:underline">Abrir instruções e starter <ExternalLink className="size-3.5" aria-hidden="true" /></a>
      </section>

      <section className="mt-12 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_18rem]">
        <div>
          <h2 className="text-xl font-bold">Ao terminar, você vai conseguir</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
            {sqlQAOutcomes.map((outcome) => <li key={outcome} className="border-l-2 border-primary/60 pl-3">{outcome}</li>)}
          </ul>
          <h3 className="mt-8 text-sm font-semibold">Um jeito de investigar</h3>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {sqlQACourseFlow.map(([step, question], index) => <li key={step} className="flex gap-3 border-t border-border py-3 text-sm"><span className="font-mono text-primary">0{index + 1}</span><span><strong className="font-semibold">{step}:</strong> <span className="text-muted-foreground">{question}</span></span></li>)}
          </ol>
        </div>
        <div className="border-l border-border pl-5">
          <h2 className="text-sm font-semibold">Referências oficiais</h2>
          <ul className="mt-3 grid gap-2">
            {sqlQAResources.map((resource) => <li key={resource.href}>
              <a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs leading-5 text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3 shrink-0" aria-hidden="true" /></a>
            </li>)}
          </ul>
        </div>
      </section>

      <section id="projeto-final" className="mt-10 border border-border bg-card p-5 sm:p-7">
        <p className="text-sm font-semibold text-primary">Projeto final</p>
        <h2 className="mt-2 text-2xl font-bold">{sqlQAFinalProject.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{sqlQAFinalProject.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {sqlQAFinalProject.deliverables.map((item) => <li key={item} className="flex gap-2 text-sm leading-6"><span className="text-primary" aria-hidden="true">✓</span><span>{item}</span></li>)}
        </ul>
      </section>
    </div>
  </main>;
}
