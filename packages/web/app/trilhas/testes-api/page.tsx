import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { apiTestingFinalProject, apiTestingOutcomes, apiTestingResources, apiTestingTracks } from "@/lib/api-testing-course";
import { ApiTrackModuleList } from "./track-client";
import { getApiTestingProgress } from "./progress";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Testes de API | QA Lab",
  description: "Aprenda estratégia e prática de testes de API com Bruno e Postman.",
};

export default async function ApiTestingTrackPage() {
  const progress = await getApiTestingProgress();
  const fundamentals = apiTestingTracks.fundamentals;
  return <main className="qa-testes-api min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/trilhas" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Todas as trilhas</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Trilha prática · APIs · fundamentos + ferramentas</p>
        <h1 className="qa-page-title mt-3">Teste o contrato. Proteja o fluxo.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Aprenda primeiro a encontrar riscos e validar comportamento. Depois pratique o mesmo raciocínio no Bruno e no Postman.</p>
      </header>

      <section className="mt-8 grid gap-4 border-y border-border py-6 sm:grid-cols-3" aria-label="Estrutura da trilha">
        {[ ["01", "Fundamentos", "Risco, contrato e comportamento"], ["02", "Bruno", "Coleções locais e versionadas"], ["03", "Postman", "Collections, scripts e execução"] ].map(([number, title, detail]) => <div key={number} className="grid grid-cols-[2.5rem_1fr] gap-3"><span className="font-mono text-sm text-primary">{number}</span><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">{detail}</p></div></div>)}
      </section>

      <ApiTrackModuleList modules={fundamentals.modules} initialCompleted={progress.completed} signedIn={progress.signedIn} baseHref={fundamentals.href} />

      <section className="mt-12 border-t border-border pt-8" aria-labelledby="tools-title">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 id="tools-title" className="text-xl font-bold">Escolha sua bancada</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Os fundamentos são comuns. As subtrilhas mostram como organizar, testar e executar a suíte em cada ferramenta.</p></div></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {(["bruno", "postman"] as const).map((track) => <Link key={track} href={apiTestingTracks[track].href} className="group border border-border bg-card p-5 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <p className="text-xs font-semibold text-primary">Subtrilha · {apiTestingTracks[track].modules.length} Labs</p><h3 className="mt-2 text-lg font-bold">{apiTestingTracks[track].title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{apiTestingTracks[track].intro}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">Abrir subtrilha <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
          </Link>)}
        </div>
      </section>

      <section className="mt-12 grid gap-8 border-t border-border pt-8 lg:grid-cols-[1fr_18rem]">
        <div><h2 className="text-xl font-bold">Ao terminar, você vai conseguir</h2><ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">{apiTestingOutcomes.map((outcome) => <li key={outcome} className="border-l-2 border-primary/60 pl-3">{outcome}</li>)}</ul></div>
        <div className="border-l border-border pl-5"><h2 className="text-sm font-semibold">Documentação oficial</h2><ul className="mt-3 grid gap-2">{apiTestingResources.map((resource) => <li key={resource.href}><a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs leading-5 text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3 shrink-0" aria-hidden="true" /></a></li>)}</ul></div>
      </section>

      <section className="mt-10 border border-border bg-card p-5 sm:p-7">
        <p className="text-sm font-semibold text-primary">Projeto final</p><h2 className="mt-2 text-2xl font-bold">{apiTestingFinalProject.title}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{apiTestingFinalProject.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">{apiTestingFinalProject.deliverables.map((item) => <li key={item} className="flex gap-2 text-sm leading-6"><span className="text-primary" aria-hidden="true">✓</span><span>{item}</span></li>)}</ul>
        <h3 className="mt-7 text-sm font-semibold">Critérios de revisão</h3><dl className="mt-3 grid gap-2 sm:grid-cols-2">{apiTestingFinalProject.rubric.map((criterion) => <div key={criterion.criterion} className="flex items-start justify-between gap-4 border-t border-border py-2 text-sm"><dt className="text-muted-foreground">{criterion.criterion}</dt><dd className="shrink-0 font-mono text-xs text-primary">{criterion.weight}</dd></div>)}</dl>
      </section>
    </div>
  </main>;
}
