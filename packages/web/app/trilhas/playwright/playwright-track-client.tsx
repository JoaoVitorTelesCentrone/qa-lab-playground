"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { setPlaywrightLabCompletion } from "./actions";
import type { PlaywrightTrackModule } from "@/lib/playwright-course";

const STORAGE_KEY = "qa:playwright-track:v1";

function readLocalProgress() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return new Set<string>();
    return new Set(value.filter((item): item is string => typeof item === "string" && /^[a-z0-9-]{1,80}$/.test(item)));
  } catch { return new Set<string>(); }
}

function writeLocalProgress(completed: Set<string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); } catch { /* Progresso fica visível nesta sessão. */ }
}

export function PlaywrightTrackOverview({ modules, initialCompleted, signedIn }: {
  modules: PlaywrightTrackModule[]; initialCompleted: string[]; signedIn: boolean;
}) {
  const validIds = new Set(modules.map((module) => module.id));
  const [completed, setCompleted] = useState(() => new Set(initialCompleted.filter((id) => validIds.has(id))));
  useEffect(() => {
    if (!signedIn) setCompleted(new Set([...readLocalProgress()].filter((id) => validIds.has(id))));
  }, [modules, signedIn]);
  const next = modules.find((module) => !completed.has(module.id));
  const done = modules.filter((module) => completed.has(module.id)).length;
  const percent = modules.length ? Math.round(done / modules.length * 100) : 0;

  return <>
    <section className="mt-8 border-y border-border py-5" aria-label="Progresso da trilha">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold">{done} de {modules.length} Labs concluídos</p><p className="mt-1 text-sm text-muted-foreground">Execute o exercício e revise os critérios antes de marcar.</p></div><span className="font-mono text-sm text-primary">{percent}%</span></div>
      <div className="mt-3 h-1.5 bg-muted" role="progressbar" aria-label="Progresso da trilha" aria-valuemin={0} aria-valuemax={modules.length} aria-valuenow={done}><div className="h-full bg-primary transition-[width]" style={{ width: `${percent}%` }} /></div>
      <p className="mt-3 text-xs text-muted-foreground">{signedIn ? "Seu progresso está salvo na conta." : <>Salvo neste navegador. <Link className="text-primary underline-offset-4 hover:underline" href="/login?next=%2Ftrilhas%2Fplaywright">Entre para acompanhar na conta.</Link></>}</p>
      {next && <Link href={`/trilhas/playwright/${next.id}`} className="mt-4 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline">Continuar: {next.title}</Link>}
    </section>
    <ol className="mt-7 divide-y divide-border border-y border-border" aria-label="Labs da trilha">
      {modules.map((module, index) => <li key={module.id} className="grid gap-3 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-center">
        <span className={`font-mono text-sm ${completed.has(module.id) ? "text-primary" : "text-muted-foreground"}`}>{String(index + 1).padStart(2, "0")}</span>
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-x-3 gap-y-1"><h2 className="font-semibold">{module.title}</h2>{completed.has(module.id) && <span className="text-xs text-primary">Concluído</span>}</div><p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{module.objective}</p><p className="mt-2 text-xs text-muted-foreground">Semana {module.week} · {module.duration}</p></div>
        <Link className="w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline" href={`/trilhas/playwright/${module.id}`}>{completed.has(module.id) ? "Revisar Lab" : "Abrir Lab"}</Link>
      </li>)}
    </ol>
  </>;
}

export function PlaywrightCompletionButton({ moduleId, initialCompleted, signedIn }: {
  moduleId: string; initialCompleted: boolean; signedIn: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  useEffect(() => { if (!signedIn && readLocalProgress().has(moduleId)) setCompleted(true); }, [moduleId, signedIn]);

  function toggleCompletion() {
    const nextValue = !completed;
    setMessage("");
    if (!signedIn) {
      const next = readLocalProgress();
      if (nextValue) next.add(moduleId); else next.delete(moduleId);
      writeLocalProgress(next); setCompleted(nextValue); return;
    }
    startTransition(async () => {
      const result = await setPlaywrightLabCompletion(moduleId, nextValue);
      if (!result.ok) { setMessage(result.error); return; }
      setCompleted(nextValue);
    });
  }

  return <div className="border-y border-border py-5">
    <button type="button" onClick={toggleCompletion} disabled={pending} aria-pressed={completed} className="inline-flex min-h-11 items-center gap-3 border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait disabled:opacity-60"><span aria-hidden="true" className={`grid size-5 place-items-center border ${completed ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>{completed ? "✓" : ""}</span>{pending ? "Salvando…" : completed ? "Desmarcar conclusão" : "Marcar Lab como concluído"}</button>
    <p className="mt-2 text-xs text-muted-foreground">O QA Lab registra sua autoavaliação; a suíte roda no seu projeto, não aqui.</p>
    {!signedIn && <p className="mt-2 text-xs text-muted-foreground">Salvo neste navegador. <Link href={`/login?next=${encodeURIComponent(`/trilhas/playwright/${moduleId}`)}`} className="text-primary underline-offset-4 hover:underline">Entre para salvar na conta.</Link></p>}
    {message && <p role="alert" className="mt-2 text-sm text-destructive">{message}</p>}
  </div>;
}
