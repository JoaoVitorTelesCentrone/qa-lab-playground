"use client";

// Execução dos packs de regressão.
//
// O estado inicial vem do servidor; cada marcação vai para /api/v1/scenarios e
// é refletida na hora (otimista) com rollback se a API recusar. Isso alimenta a
// cobertura mostrada na home e no perfil.
//
// Cada cenário aponta para a tela onde ele roda, então o aluno sai da lista
// direto para o ambiente certo. No modo instrutor, o cenário também mostra qual
// desvio plantado ele costuma pegar — no modo aluno isso fica oculto.

import Link from "next/link";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { plantedBugs } from "@/lib/product/practice/bugs";
import { regressionLayers, regressionPacks } from "@/lib/regression-packs";
import type { ScenarioRun } from "@/lib/product/journey";

const options: Array<{ value: ScenarioRun["status"]; label: string }> = [
  { value: "passou", label: "Passou" },
  { value: "falhou", label: "Falhou" },
  { value: "bloqueado", label: "Bloqueado" },
];

const key = (appId: string, scenarioId: string) => `${appId}:${scenarioId}`;

export function RegressionRunner({ signedIn, initialRuns, instructor = false }: {
  signedIn: boolean;
  initialRuns: Record<string, ScenarioRun["status"]>;
  instructor?: boolean;
}) {
  const [runs, setRuns] = useState(initialRuns);
  const [error, setError] = useState("");
  const [layer, setLayer] = useState("");
  const [pending, setPending] = useState("");

  async function mark(appId: string, scenarioId: string, status: ScenarioRun["status"]) {
    const id = key(appId, scenarioId);
    const previous = runs[id];
    // Marcar de novo o mesmo resultado desmarca — dá para desfazer sem apagar
    // a execução inteira.
    const next = previous === status ? undefined : status;

    setRuns((current) => {
      const state = { ...current };
      if (next) state[id] = next; else delete state[id];
      return state;
    });
    setError("");
    setPending(id);

    const response = next
      ? await fetch("/api/v1/scenarios", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ appId, scenarioId, status: next }) })
      : await fetch(`/api/v1/scenarios?appId=${encodeURIComponent(appId)}&scenarioId=${encodeURIComponent(scenarioId)}`, { method: "DELETE" });
    setPending("");

    if (!response.ok) {
      setRuns((current) => {
        const state = { ...current };
        if (previous) state[id] = previous; else delete state[id];
        return state;
      });
      const body = await response.json().catch(() => null);
      setError(body?.error?.message ?? "Não foi possível registrar a execução.");
    }
  }

  return <main className="qa-system"><div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <p className="qa-eyebrow">Qualidade contínua</p>
    <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">Packs de regressão</h1>
    <p className="mt-3 max-w-2xl text-muted-foreground">35 cenários por ambiente de prática, das camadas de UI e validação até acessibilidade, resiliência, segurança e governança. Cada cenário parte da massa de teste restaurada e aponta para a tela onde ele roda.</p>

    {!signedIn && <p className="mt-5 rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground"><Link href="/login?next=/labs/regressao" className="text-primary">Entre na sua conta</Link> para marcar cada execução e acompanhar a cobertura na sua jornada.</p>}
    {error && <p role="alert" className="mt-5 rounded-md border border-destructive/30 p-3 text-sm text-destructive">{error}</p>}

    <div className="mt-8 flex flex-wrap items-end gap-3 border-y border-border py-4">
      <label className="grid gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Camada</span>
        <select value={layer} onChange={(event) => setLayer(event.target.value)} className="input w-52">
          <option value="">Todas as camadas</option>
          {regressionLayers.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <nav aria-label="Ir para um ambiente" className="ml-auto flex flex-wrap gap-2">
        {regressionPacks.map((pack) => <a key={pack.id} href={`#${pack.id}`} className="rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-accent">{pack.name}</a>)}
      </nav>
    </div>

    <div className="mt-8 grid gap-5">{regressionPacks.map((pack) => {
      const scenarios = layer ? pack.scenarios.filter((scenario) => scenario.layer === layer) : pack.scenarios;
      const executed = pack.scenarios.filter((scenario) => runs[key(pack.id, scenario.id)]).length;
      const failed = pack.scenarios.filter((scenario) => runs[key(pack.id, scenario.id)] === "falhou").length;

      return <section key={pack.id} id={pack.id} className="scroll-mt-20 rounded-xl border border-border p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">{pack.name}</h2>
            <p className="text-sm text-muted-foreground">
              {signedIn ? `${executed} de ${pack.scenarios.length} cenários executados` : `${pack.scenarios.length} cenários`}
              {failed > 0 && ` · ${failed} com falha registrada`}
            </p>
          </div>
          <Link href={pack.route} className="text-sm text-primary">Abrir ambiente →</Link>
        </div>

        {scenarios.length === 0
          ? <p className="mt-5 rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">Nenhum cenário desta camada neste ambiente.</p>
          : <div className="mt-5 grid gap-3 md:grid-cols-2">{scenarios.map((scenario) => {
              const id = key(pack.id, scenario.id);
              const status = runs[id];
              const bug = instructor ? plantedBugs.find((item) => item.id === scenario.bugId) : undefined;

              return <article key={scenario.id} className={`rounded-md border p-3.5 text-sm ${status === "falhou" ? "border-destructive/40" : "border-border"}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <strong className="font-medium">{String(scenario.number).padStart(2, "0")} · {scenario.title}</strong>
                  <Badge variant="secondary" className="font-normal">{scenario.layer}</Badge>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground"><b className="font-medium">Pré-condição:</b> {scenario.precondition}</p>
                <ol className="mt-2 list-decimal pl-4 text-muted-foreground">{scenario.steps.map((step) => <li key={step} className="mt-0.5">{step}</li>)}</ol>
                <p className="mt-2.5"><b className="font-medium">Esperado:</b> <span className="text-muted-foreground">{scenario.expected}</span></p>

                <Link href={scenario.route} className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary">
                  <ExternalLink className="size-3" aria-hidden="true" /> Executar em {scenario.route}
                </Link>

                {bug && <p className="mt-3 rounded-md border border-border bg-muted/40 p-2.5 text-xs text-muted-foreground">
                  <b className="font-medium text-foreground">Desvio associado:</b> {bug.title} — {bug.mechanism}
                </p>}

                {signedIn && <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={`Resultado do cenário ${scenario.number} de ${pack.name}`}>
                  {options.map((option) => <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant={status === option.value ? "secondary" : "ghost"}
                    aria-pressed={status === option.value}
                    disabled={pending === id}
                    onClick={() => mark(pack.id, scenario.id, option.value)}
                  >{option.label}</Button>)}
                </div>}
              </article>;
            })}</div>}
      </section>;
    })}</div>
  </div></main>;
}
