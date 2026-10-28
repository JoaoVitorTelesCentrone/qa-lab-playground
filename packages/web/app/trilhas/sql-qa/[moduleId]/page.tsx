import Link from "next/link";
import { notFound } from "next/navigation";
import { sqlQAModules } from "@/lib/sql-qa-course";
import { getSQLQAProgress } from "../progress";
import { SQLQACompletionButton } from "../track-client";

export const dynamic = "force-dynamic";

type LessonProps = { params: Promise<{ moduleId: string }> };

export async function generateMetadata({ params }: LessonProps) {
  const { moduleId } = await params;
  const module = sqlQAModules.find((item) => item.id === moduleId);
  return { title: module ? `${module.title} | SQL para QA` : "Lab não encontrado | SQL para QA" };
}

export default async function SQLQALessonPage({ params }: LessonProps) {
  const { moduleId } = await params;
  const index = sqlQAModules.findIndex((item) => item.id === moduleId);
  if (index < 0) notFound();

  const module = sqlQAModules[index];
  const progress = await getSQLQAProgress();
  const previous = sqlQAModules[index - 1];
  const next = sqlQAModules[index + 1];

  return <main className="qa-sql-qa min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <article className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/trilhas/sql-qa" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Visão geral da trilha</Link>
      <header className="mt-8 border-b border-border pb-7">
        <p className="text-sm font-semibold text-primary">Lab {String(index + 1).padStart(2, "0")} de {sqlQAModules.length} · Bloco {module.week} · {module.duration}</p>
        <h1 className="qa-page-title mt-3">{module.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{module.objective}</p>
      </header>

      <section className="mt-7">
        <h2 className="text-lg font-bold">Conceitos deste Lab</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {module.concepts.map((concept) => <li key={concept} className="border border-border bg-card px-3 py-1.5 font-mono text-xs">{concept}</li>)}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Prática</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{module.practice}</p>
        <div className="mt-4 overflow-hidden border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-2"><span className="text-xs font-semibold">SQL de referência</span><span className="font-mono text-[10px] text-muted-foreground">PostgreSQL</span></div>
          <pre className="overflow-x-auto p-4 text-xs leading-6 text-foreground sm:text-sm"><code>{module.code}</code></pre>
        </div>
        <p className="mt-3 border-l-2 border-primary/60 pl-3 text-sm leading-6"><span className="font-semibold">Sua entrega:</span> <span className="text-muted-foreground">{module.deliverable}</span></p>
      </section>

      {module.id === "safe-test-data" && <aside className="mt-7 border-l-2 border-primary bg-card px-4 py-3 text-sm leading-6 text-muted-foreground">
        Rode apenas na sessão local preparada pelo starter, com tabelas <code className="font-mono text-foreground">pg_temp</code>. O exemplo termina com <code className="font-mono text-foreground">ROLLBACK</code>; não troque por <code className="font-mono text-foreground">COMMIT</code> nem execute em banco real ou compartilhado.
      </aside>}

      <section className="mt-8">
        <h2 className="text-lg font-bold">Confira sua consulta</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {module.checklist.map((item) => <li key={item} className="border-t border-border py-3 text-sm leading-6 text-muted-foreground"><span className="mr-2 text-primary" aria-hidden="true">✓</span>{item}</li>)}
        </ul>
      </section>

      <div className="mt-8"><SQLQACompletionButton moduleId={module.id} initialCompleted={progress.completed.includes(module.id)} signedIn={progress.signedIn} /></div>
      <nav className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5" aria-label="Navegação entre Labs">
        {previous ? <Link href={`/trilhas/sql-qa/${previous.id}`} className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← {previous.title}</Link> : <span />}
        {next ? <Link href={`/trilhas/sql-qa/${next.id}`} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">Próximo: {next.title} →</Link> : <Link href="/trilhas/sql-qa#projeto-final" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">Ir ao projeto final →</Link>}
      </nav>
    </article>
  </main>;
}
