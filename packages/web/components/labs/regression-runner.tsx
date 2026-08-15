"use client";

// Execução dos packs de regressão.
//
// O estado inicial vem do servidor; cada marcação vai para /api/v1/scenarios e
// é refletida na hora (otimista) com rollback se a API recusar. Isso alimenta a
// cobertura mostrada na home e no perfil.

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { regressionPacks } from "@/lib/regression-packs";
import type { ScenarioRun } from "@/lib/product/journey";

const options: Array<{ value: ScenarioRun["status"]; label: string }> = [
  { value: "passou", label: "Passou" },
  { value: "falhou", label: "Falhou" },
  { value: "bloqueado", label: "Bloqueado" },
];

const key = (appId: string, scenarioId: string) => `${appId}:${scenarioId}`;

export function RegressionRunner({ signedIn, initialRuns }: { signedIn: boolean; initialRuns: Record<string, ScenarioRun["status"]> }) {
  const [runs, setRuns] = useState(initialRuns);
  const [error, setError] = useState("");

  async function mark(appId: string, scenarioId: string, status: ScenarioRun["status"]) {
    const id = key(appId, scenarioId);
    const previous = runs[id];
    setRuns((current) => ({ ...current, [id]: status }));
    setError("");
    const response = await fetch("/api/v1/scenarios", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ appId, scenarioId, status }) });
    if (!response.ok) {
      setRuns((current) => {
        const next = { ...current };
        if (previous) next[id] = previous; else delete next[id];
        return next;
      });
      const body = await response.json().catch(() => null);
      setError(body?.error?.message ?? "Não foi possível registrar a execução.");
    }
  }

  return <main className="qa-system"><div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <p className="qa-eyebrow">Qualidade contínua</p>
    <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">Packs de regressão</h1>
    <p className="mt-3 max-w-2xl text-muted-foreground">35 cenários por ambiente de prática, das camadas de UI e validação até acessibilidade, resiliência e segurança.</p>
    {!signedIn && <p className="mt-5 rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground"><Link href="/login?next=/labs/regressao" className="text-primary">Entre na sua conta</Link> para marcar cada execução e acompanhar a cobertura na sua jornada.</p>}
    {error && <p role="alert" className="mt-5 rounded-md border border-destructive/30 p-3 text-sm text-destructive">{error}</p>}

    <div className="mt-8 grid gap-5">{regressionPacks.map((pack) => {
      const executed = pack.scenarios.filter((scenario) => runs[key(pack.id, scenario.id)]).length;
      return <section key={pack.id} id={pack.id} className="rounded-xl border border-border p-5 scroll-mt-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="text-2xl font-semibold">{pack.name}</h2><p className="text-sm text-muted-foreground">{signedIn ? `${executed} de ${pack.scenarios.length} cenários executados` : `${pack.scenarios.length} cenários`}</p></div>
          <Link href={pack.route} className="text-sm text-primary">Abrir ambiente →</Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">{pack.scenarios.map((scenario) => {
          const status = runs[key(pack.id, scenario.id)];
          return <article key={scenario.id} className="rounded-md border border-border p-3 text-sm">
            <strong>{scenario.id} · {scenario.title}</strong>
            <p className="mt-1 text-muted-foreground">{scenario.layer} · {scenario.precondition}</p>
            <ol className="mt-2 list-decimal pl-4 text-muted-foreground">{scenario.steps.map((step) => <li key={step}>{step}</li>)}</ol>
            <p className="mt-2"><b>Esperado:</b> {scenario.expected}</p>
            {signedIn && <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={`Resultado do cenário ${scenario.id}`}>
              {options.map((option) => <Button key={option.value} type="button" size="sm" variant={status === option.value ? "secondary" : "ghost"} aria-pressed={status === option.value} onClick={() => mark(pack.id, scenario.id, option.value)}>{option.label}</Button>)}
            </div>}
          </article>;
        })}</div>
      </section>;
    })}</div>
  </div></main>;
}
