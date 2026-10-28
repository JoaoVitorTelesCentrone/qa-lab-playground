"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { setManualTestingCompletion } from "../_actions/manual-testing-actions";
import type { ManualTestingCourse, ManualTestingModule, ManualTestingTrackSlug } from "@/lib/manual-testing-courses";

function storageKey(slug: ManualTestingTrackSlug) { return `qa:${slug}:progress:v1`; }

function readLocalProgress(slug: ManualTestingTrackSlug) {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey(slug)) ?? "[]");
    if (!Array.isArray(value)) return new Set<string>();
    return new Set(value.filter((item): item is string => typeof item === "string" && /^[a-z0-9-]{1,80}$/.test(item)));
  } catch { return new Set<string>(); }
}

function writeLocalProgress(slug: ManualTestingTrackSlug, completed: Set<string>) {
  try { localStorage.setItem(storageKey(slug), JSON.stringify([...completed])); } catch { /* Progresso fica visível nesta sessão. */ }
}

export function ManualTestingTrackOverview({ course, initialCompleted, signedIn }: {
  course: ManualTestingCourse; initialCompleted: string[]; signedIn: boolean;
}) {
  const validIds = new Set(course.modules.map((module) => module.id));
  const [completed, setCompleted] = useState(() => new Set(initialCompleted.filter((id) => validIds.has(id))));
  useEffect(() => {
    if (!signedIn) setCompleted(new Set([...readLocalProgress(course.slug)].filter((id) => validIds.has(id))));
  }, [course.slug, signedIn]);
  const next = course.modules.find((module) => !completed.has(module.id));
  const done = course.modules.filter((module) => completed.has(module.id)).length;
  const percent = course.modules.length ? Math.round(done / course.modules.length * 100) : 0;

  return <>
    <section className="mt-8 border-y border-border py-5" aria-label="Progresso da trilha">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold">{done} de {course.modules.length} Labs concluídos</p><p className="mt-1 text-sm text-muted-foreground">Pratique no seu ritmo.</p></div><span className="font-mono text-sm text-primary">{percent}%</span></div>
      <div className="mt-3 h-1.5 bg-muted" role="progressbar" aria-label="Progresso da trilha" aria-valuemin={0} aria-valuemax={course.modules.length} aria-valuenow={done}><div className="h-full bg-primary transition-[width]" style={{ width: `${percent}%` }} /></div>
      <p className="mt-3 text-xs text-muted-foreground">{signedIn ? "Progresso salvo na sua conta." : <>Salvo neste navegador. <Link className="text-primary underline-offset-4 hover:underline" href={`/login?next=%2Ftrilhas%2F${course.slug}`}>Entre para acompanhar na conta.</Link></>}</p>
      {next && <Link href={`/trilhas/${course.slug}/${next.id}`} className="mt-4 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline">Começar por: {next.title}</Link>}
    </section>
    <ol className="mt-7 divide-y divide-border border-y border-border" aria-label={`Labs de ${course.title}`}>
      {course.modules.map((module, index) => <li key={module.id} className="grid gap-3 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-center">
        <span className={`font-mono text-sm ${completed.has(module.id) ? "text-primary" : "text-muted-foreground"}`}>{String(index + 1).padStart(2, "0")}</span>
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-x-3 gap-y-1"><h2 className="font-semibold">{module.title}</h2>{completed.has(module.id) && <span className="text-xs text-primary">Concluído</span>}</div><p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{module.objective}</p><p className="mt-2 text-xs text-muted-foreground">Bloco {module.week} · {module.duration}</p></div>
        <Link className="w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline" href={`/trilhas/${course.slug}/${module.id}`}>{completed.has(module.id) ? "Revisar Lab" : "Abrir Lab"}</Link>
      </li>)}
    </ol>
  </>;
}

export function ManualTestingCompletionButton({ slug, module, initialCompleted, signedIn }: {
  slug: ManualTestingTrackSlug; module: ManualTestingModule; initialCompleted: boolean; signedIn: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  useEffect(() => { if (!signedIn && readLocalProgress(slug).has(module.id)) setCompleted(true); }, [module.id, signedIn, slug]);

  function toggleCompletion() {
    const nextValue = !completed;
    setMessage("");
    if (!signedIn) {
      const next = readLocalProgress(slug);
      if (nextValue) next.add(module.id); else next.delete(module.id);
      writeLocalProgress(slug, next); setCompleted(nextValue); return;
    }
    startTransition(async () => {
      const result = await setManualTestingCompletion(slug, module.id, nextValue);
      if (!result.ok) { setMessage(result.error); return; }
      setCompleted(nextValue);
    });
  }

  return <div className="border-y border-border py-5">
    <button type="button" onClick={toggleCompletion} disabled={pending} aria-pressed={completed} className="inline-flex min-h-11 items-center gap-3 border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait disabled:opacity-60"><span aria-hidden="true" className={`grid size-5 place-items-center border ${completed ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>{completed ? "✓" : ""}</span>{pending ? "Salvando…" : completed ? "Desmarcar conclusão" : "Marcar Lab como concluído"}</button>
    {!signedIn && <p className="mt-2 text-xs text-muted-foreground">Salvo neste navegador. <Link href={`/login?next=${encodeURIComponent(`/trilhas/${slug}/${module.id}`)}`} className="text-primary underline-offset-4 hover:underline">Entre para salvar na conta.</Link></p>}
    {message && <p role="alert" className="mt-2 text-sm text-destructive">{message}</p>}
  </div>;
}
