import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { apiTestingTracks, type ApiTestingModule, type ApiTestingTrack } from "@/lib/api-testing-course";
import { ApiLabCompletionButton } from "./track-client";

export function ApiModuleLesson({ module, track, completed, signedIn }: {
  module: ApiTestingModule; track: ApiTestingTrack; completed: boolean; signedIn: boolean;
}) {
  const currentTrack = apiTestingTracks[track];
  const index = currentTrack.modules.findIndex((item) => item.id === module.id);
  const previous = currentTrack.modules[index - 1];
  const next = currentTrack.modules[index + 1];
  return <main className="qa-testes-api min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <article className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href={currentTrack.href} className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Voltar para {currentTrack.title}</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">{track === "fundamentals" ? "Fundamentos de testes de API" : currentTrack.title} · Lab {index + 1} de {currentTrack.modules.length}</p>
        <h1 className="qa-page-title mt-3">{module.title}</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{module.objective}</p>
        <p className="mt-3 text-sm text-muted-foreground">Semana {module.week} · {module.duration}</p>
      </header>

      <section className="mt-8 grid gap-6 border-y border-border py-6 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <h2 className="text-lg font-bold">Prática</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{module.practice}</p>
          <h3 className="mt-7 text-sm font-semibold">Conceitos deste Lab</h3>
          <ul className="mt-3 flex flex-wrap gap-2">{module.concepts.map((concept) => <li key={concept} className="border border-border px-2.5 py-1 text-xs text-muted-foreground">{concept}</li>)}</ul>
        </div>
        <aside className="border-l-2 border-primary/60 pl-4">
          <h2 className="text-sm font-semibold">Sua entrega</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.deliverable}</p>
        </aside>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="border border-border bg-card p-5">
          <h2 className="font-semibold">Confira antes de concluir</h2>
          <ul className="mt-3 grid gap-3">{module.checklist.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" /><span>{item}</span></li>)}</ul>
        </div>
        <div className="border border-border bg-card p-5">
          <h2 className="font-semibold">Exemplo</h2>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-muted-foreground">{module.example}</pre>
        </div>
      </section>

      <div className="mt-8"><ApiLabCompletionButton moduleId={module.id} initialCompleted={completed} signedIn={signedIn} trackHref={currentTrack.href} /></div>
      <nav className="mt-6 flex flex-wrap items-center justify-between gap-4" aria-label="Navegação dos Labs">
        {previous ? <Link href={`${currentTrack.href}/${previous.id}`} className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← {previous.title}</Link> : <span />}
        {next ? <Link href={`${currentTrack.href}/${next.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Próximo Lab <ArrowRight className="size-4" aria-hidden="true" /></Link> : <Link href={currentTrack.href} className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">Ver trilha <ArrowRight className="size-4" aria-hidden="true" /></Link>}
      </nav>
    </article>
  </main>;
}
