import Link from "next/link";
import { notFound } from "next/navigation";
import { generativeAIQAModules } from "@/lib/generative-ai-qa-course";
import { getGenerativeAIQAProgress } from "../progress";
import { GenerativeAIQACompletionButton } from "../track-client";

export const dynamic = "force-dynamic";

type LessonProps = { params: Promise<{ moduleId: string }> };

export async function generateMetadata({ params }: LessonProps) {
  const { moduleId } = await params;
  const module = generativeAIQAModules.find((item) => item.id === moduleId);
  return { title: module ? `${module.title} | IA generativa para QA` : "Lab não encontrado | IA generativa para QA" };
}

export default async function GenerativeAIQALessonPage({ params }: LessonProps) {
  const { moduleId } = await params;
  const index = generativeAIQAModules.findIndex((item) => item.id === moduleId);
  if (index < 0) notFound();

  const module = generativeAIQAModules[index];
  const progress = await getGenerativeAIQAProgress();
  const previous = generativeAIQAModules[index - 1];
  const next = generativeAIQAModules[index + 1];

  return <main className="qa-ia-generativa min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <article className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/trilhas/ia-generativa-qa" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Visão geral da trilha</Link>
      <header className="mt-8 border-b border-border pb-7">
        <p className="text-sm font-semibold text-primary">Lab {String(index + 1).padStart(2, "0")} de {generativeAIQAModules.length} · Semana {module.week} · {module.duration}</p>
        <h1 className="qa-page-title mt-3">{module.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{module.objective}</p>
      </header>

      <section className="mt-7">
        <h2 className="text-lg font-bold">Conceitos deste Lab</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {module.concepts.map((concept) => <li key={concept} className="border border-border bg-card px-3 py-1.5 text-xs">{concept}</li>)}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Prática</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{module.practice}</p>
        <div className="mt-4 overflow-hidden border border-border bg-card">
          <div className="border-b border-border px-4 py-2"><span className="text-xs font-semibold">Prompt de partida</span></div>
          <pre className="overflow-x-auto whitespace-pre-wrap p-4 text-xs leading-6 text-foreground sm:text-sm"><code>{module.prompt}</code></pre>
        </div>
        <p className="mt-3 border-l-2 border-primary/60 pl-3 text-sm leading-6"><span className="font-semibold">Sua entrega:</span> <span className="text-muted-foreground">{module.deliverable}</span></p>
      </section>

      <aside className="mt-7 border-l-2 border-primary bg-card px-4 py-3 text-sm leading-6 text-muted-foreground">
        Use somente dados fictícios ou autorizados. Revise sugestões contra requisitos e evidências; a IA não confirma que um sistema foi testado.
      </aside>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Confira seu resultado</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {module.checklist.map((item) => <li key={item} className="border-t border-border py-3 text-sm leading-6 text-muted-foreground"><span className="mr-2 text-primary" aria-hidden="true">✓</span>{item}</li>)}
        </ul>
      </section>

      <div className="mt-8"><GenerativeAIQACompletionButton moduleId={module.id} initialCompleted={progress.completed.includes(module.id)} signedIn={progress.signedIn} /></div>
      <nav className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5" aria-label="Navegação entre Labs">
        {previous ? <Link href={`/trilhas/ia-generativa-qa/${previous.id}`} className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← {previous.title}</Link> : <span />}
        {next ? <Link href={`/trilhas/ia-generativa-qa/${next.id}`} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">Próximo: {next.title} →</Link> : <Link href="/trilhas/ia-generativa-qa#projeto-final" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">Ir ao projeto final →</Link>}
      </nav>
    </article>
  </main>;
}
