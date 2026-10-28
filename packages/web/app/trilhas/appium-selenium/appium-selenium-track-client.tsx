"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { setAppiumSeleniumLabCompletion } from "./actions";
import type { AppiumSeleniumModule } from "@/lib/appium-selenium-course";

const STORAGE_KEY = "qa:appium-selenium-track:v1";

function readLocalProgress() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return new Set<string>();
    return new Set(value.filter((item): item is string => typeof item === "string" && /^[a-z0-9-]{1,80}$/.test(item)));
  } catch {
    return new Set<string>();
  }
}

function writeLocalProgress(completed: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  } catch {
    // Sem armazenamento local disponível, o progresso continua visível nesta sessão.
  }
}

export function AppiumSeleniumTrackOverview({ modules, initialCompleted, signedIn }: {
  modules: AppiumSeleniumModule[];
  initialCompleted: string[];
  signedIn: boolean;
}) {
  const [completed, setCompleted] = useState(() => new Set(initialCompleted));

  useEffect(() => {
    if (signedIn) return;
    const validIds = new Set(modules.map((module) => module.id));
    setCompleted(new Set([...readLocalProgress()].filter((id) => validIds.has(id))));
  }, [modules, signedIn]);

  const doneCount = completed.size;
  const percent = Math.round((doneCount / modules.length) * 100);
  const next = modules.find((module) => !completed.has(module.id));

  return <>
    <section className="mt-8 grid overflow-hidden border border-border sm:grid-cols-2" aria-label="Mapa de escolha da ferramenta">
      <div className="bg-card p-5 sm:p-6">
        <p className="text-xs font-semibold text-primary">Appium · dispositivo</p>
        <h2 className="mt-2 text-lg font-bold">Apps nativos e híbridos</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Conecta o teste a Android e iOS por meio do driver da plataforma. Também pode controlar browsers em devices.</p>
        <p className="mt-4 border-t border-border pt-3 font-mono text-xs text-muted-foreground">Android → UiAutomator2 · iOS → XCUITest</p>
      </div>
      <div className="border-t border-border p-5 sm:border-l sm:border-t-0 sm:p-6">
        <p className="text-xs font-semibold text-primary">Selenium · WebDriver</p>
        <h2 className="mt-2 text-lg font-bold">Automação de browser</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">APIs de locators, esperas e interações servem ao browser; o cliente Java do Appium também usa a base WebDriver.</p>
        <p className="mt-4 border-t border-border pt-3 font-mono text-xs text-muted-foreground">Browser desktop · mobile web remoto</p>
      </div>
    </section>

    <section className="mt-8 border-y border-border py-5" aria-label="Progresso da trilha">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{doneCount} de {modules.length} Labs concluídos</p>
          <p className="mt-1 text-sm text-muted-foreground">Pratique em apps e dispositivos autorizados.</p>
        </div>
        <span className="font-mono text-sm text-primary">{percent}%</span>
      </div>
      <div className="mt-3 h-1.5 bg-muted" role="progressbar" aria-label="Progresso da trilha" aria-valuemin={0} aria-valuemax={modules.length} aria-valuenow={doneCount}>
        <div className="h-full bg-primary transition-[width]" style={{ width: `${percent}%` }} />
      </div>
      {!signedIn && <p className="mt-3 text-xs text-muted-foreground">Salvo neste navegador. <Link className="text-primary underline-offset-4 hover:underline" href="/login?next=%2Ftrilhas%2Fappium-selenium">Entre para acompanhar na conta.</Link></p>}
      {signedIn && <p className="mt-3 text-xs text-muted-foreground">Seu progresso está salvo na conta.</p>}
      {next && <Link href={`/trilhas/appium-selenium/${next.id}`} className="mt-4 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline">Continuar: {next.title}</Link>}
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
          <Link className="w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline" href={`/trilhas/appium-selenium/${module.id}`}>{done ? "Revisar Lab" : "Abrir Lab"}</Link>
        </li>;
      })}
    </ol>
  </>;
}

export function AppiumSeleniumCompletionButton({ moduleId, initialCompleted, signedIn }: {
  moduleId: string;
  initialCompleted: boolean;
  signedIn: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!signedIn && readLocalProgress().has(moduleId)) setCompleted(true);
  }, [moduleId, signedIn]);

  function toggleCompletion() {
    const nextValue = !completed;
    setMessage("");
    if (!signedIn) {
      const next = readLocalProgress();
      if (nextValue) next.add(moduleId);
      else next.delete(moduleId);
      writeLocalProgress(next);
      setCompleted(nextValue);
      return;
    }

    startTransition(async () => {
      const result = await setAppiumSeleniumLabCompletion(moduleId, nextValue);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setCompleted(nextValue);
    });
  }

  return <div className="border-y border-border py-5">
    <button type="button" onClick={toggleCompletion} disabled={pending} aria-pressed={completed} className="inline-flex min-h-11 items-center gap-3 border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait disabled:opacity-60">
      <span aria-hidden="true" className={`grid size-5 place-items-center border ${completed ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>{completed ? "✓" : ""}</span>
      {pending ? "Salvando…" : completed ? "Desmarcar conclusão" : "Marcar Lab como concluído"}
    </button>
    {!signedIn && <p className="mt-2 text-xs text-muted-foreground">Salvo apenas neste navegador. <Link href={`/login?next=${encodeURIComponent(`/trilhas/appium-selenium/${moduleId}`)}`} className="text-primary underline-offset-4 hover:underline">Entre para salvar na conta.</Link></p>}
    {message && <p role="alert" className="mt-2 text-sm text-destructive">{message}</p>}
  </div>;
}
