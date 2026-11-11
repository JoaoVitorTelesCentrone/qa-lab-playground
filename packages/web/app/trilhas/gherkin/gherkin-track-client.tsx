"use client";

import Link from "next/link";
import { AccountLink } from "@/components/auth/account-link";
import { useState, useTransition } from "react";
import { useLocalProgress } from "@/app/trilhas/_components/local-progress";
import { setGherkinLabCompletion } from "./actions";
import type { GherkinTrackModule } from "@/lib/gherkin-course";

const STORAGE_KEY = "qa:gherkin-track:v1";

export function GherkinTrackOverview({ modules, initialCompleted, signedIn }: {
  modules: GherkinTrackModule[];
  initialCompleted: string[];
  signedIn: boolean;
}) {
  const validIds = new Set(modules.map((module) => module.id));
  const [serverCompleted] = useState(() => new Set(initialCompleted.filter((id) => validIds.has(id))));
  const [localCompleted] = useLocalProgress(STORAGE_KEY);
  const completed = signedIn ? serverCompleted : new Set([...localCompleted].filter((id) => validIds.has(id)));

  const doneCount = completed.size;
  const percent = Math.round((doneCount / modules.length) * 100);
  const next = modules.find((module) => !completed.has(module.id));

  return <>
    <section className="mt-9 border-y border-border py-5" aria-label="Progresso da trilha">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{doneCount} de {modules.length} Labs marcados como concluídos</p>
          <p className="mt-1 text-sm text-muted-foreground">A conclusão é uma autoavaliação; use os exemplos para praticar com o time.</p>
        </div>
        <span className="font-mono text-sm text-primary">{percent}%</span>
      </div>
      <div className="mt-3 h-1.5 bg-muted" role="progressbar" aria-label="Progresso da trilha" aria-valuemin={0} aria-valuemax={modules.length} aria-valuenow={doneCount}>
        <div className="h-full bg-primary transition-[width]" style={{ width: `${percent}%` }} />
      </div>
      {!signedIn && <p className="mt-3 text-xs text-muted-foreground">Neste navegador: o progresso fica salvo localmente. <AccountLink className="text-primary underline-offset-4 hover:underline" href="/login?next=%2Ftrilhas%2Fgherkin">Entre para acompanhar sua jornada na conta.</AccountLink></p>}
      {signedIn && <p className="mt-3 text-xs text-muted-foreground">Seu progresso está salvo na conta.</p>}
      {next && <Link href={`/trilhas/gherkin/${next.id}`} className="mt-4 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline">Continuar: {next.title}</Link>}
    </section>

    <ol className="mt-7 divide-y divide-border border-y border-border" aria-label="Labs da trilha">
      {modules.map((module, index) => {
        const done = completed.has(module.id);
        return <li key={module.id} className="grid gap-3 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-center">
          <span className={`font-mono text-sm ${done ? "text-primary" : "text-muted-foreground"}`}>{String(index + 1).padStart(2, "0")}</span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="font-semibold">{module.title}</h2>
              {done && <span className="text-xs text-primary">Concluído</span>}
            </div>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{module.objective}</p>
            <p className="mt-2 text-xs text-muted-foreground">Semana {module.week} · {module.duration}</p>
          </div>
          <Link className="w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline" href={`/trilhas/gherkin/${module.id}`}>{done ? "Revisar Lab" : "Abrir Lab"}</Link>
        </li>;
      })}
    </ol>
  </>;
}

export function GherkinCompletionButton({ moduleId, initialCompleted, signedIn }: {
  moduleId: string;
  initialCompleted: boolean;
  signedIn: boolean;
}) {
  const [serverCompleted, setServerCompleted] = useState(initialCompleted);
  const [localCompleted, updateLocalCompleted] = useLocalProgress(STORAGE_KEY);
  const completed = signedIn ? serverCompleted : localCompleted.has(moduleId);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function toggleCompletion() {
    const nextValue = !completed;
    setMessage("");
    if (!signedIn) {
      updateLocalCompleted((next) => {
        if (nextValue) next.add(moduleId);
        else next.delete(moduleId);
      });
      return;
    }

    startTransition(async () => {
      const result = await setGherkinLabCompletion(moduleId, nextValue);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setServerCompleted(nextValue);
    });
  }

  return <div className="border-y border-border py-5">
    <button type="button" onClick={toggleCompletion} disabled={pending} aria-pressed={completed} className="inline-flex min-h-11 items-center gap-3 border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait disabled:opacity-60">
      <span aria-hidden="true" className={`grid size-5 place-items-center border ${completed ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>{completed ? "✓" : ""}</span>
      {pending ? "Salvando…" : completed ? "Desmarcar conclusão" : "Marcar Lab como concluído"}
    </button>
    <p className="mt-3 max-w-2xl text-xs leading-5 text-muted-foreground">Marque depois de revisar o exemplo e praticar. O QA Lab salva sua autoavaliação; a conversa e a decisão de negócio continuam com seu time.</p>
    {!signedIn && <p className="mt-2 text-xs text-muted-foreground">Salvo apenas neste navegador. <AccountLink href={`/login?next=${encodeURIComponent(`/trilhas/gherkin/${moduleId}`)}`} className="text-primary underline-offset-4 hover:underline">Entre para salvar na conta.</AccountLink></p>}
    {message && <p role="alert" className="mt-2 text-sm text-destructive">{message}</p>}
  </div>;
}
