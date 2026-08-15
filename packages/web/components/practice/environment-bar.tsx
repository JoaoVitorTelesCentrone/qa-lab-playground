"use client";

// Controles do ambiente de prática: perfil de teste, desvios plantados e
// restauração da massa.
//
// Regra de produto: bugs plantados são explícitos no modo instrutor e ocultos
// no modo aluno. Por isso, com o modo instrutor desligado, a barra informa
// apenas quantos desvios estão ativos — nunca quais — e oferece o sorteio,
// para o aluno investigar sem saber a resposta.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw, ShieldAlert, UserCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { personas } from "@/lib/product/practice/personas";
import { bugsForApp } from "@/lib/product/practice/bugs";
import type { PracticeSettings } from "@/lib/product/practice/store";
import type { PracticeAppId } from "@/lib/product/apps";

export function EnvironmentBar({ appId, settings }: { appId: PracticeAppId; settings: PracticeSettings }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"" | "settings" | "reset">("");
  const [error, setError] = useState("");
  const bugs = bugsForApp(appId);
  const activeHere = bugs.filter((bug) => settings.activeBugs.includes(bug.id));

  async function patch(body: Record<string, unknown>) {
    setBusy("settings"); setError("");
    const response = await fetch("/api/v1/practice/settings", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    setBusy("");
    if (!response.ok) { setError("Não foi possível atualizar o ambiente."); return; }
    router.refresh();
  }

  // Mantém os desvios dos outros ambientes intactos ao mexer neste.
  const othersActive = settings.activeBugs.filter((id) => !bugs.some((bug) => bug.id === id));

  function toggleBug(id: string) {
    const next = settings.activeBugs.includes(id) ? settings.activeBugs.filter((item) => item !== id) : [...settings.activeBugs, id];
    patch({ activeBugs: next });
  }

  function shuffle() {
    const picked = bugs.filter(() => Math.random() < 0.5);
    patch({ activeBugs: [...othersActive, ...picked.map((bug) => bug.id)] });
  }

  async function restore() {
    setBusy("reset"); setError("");
    const response = await fetch("/api/v1/practice/settings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ apps: [appId] }) });
    setBusy("");
    if (!response.ok) { setError("Não foi possível restaurar a massa de teste."); return; }
    router.refresh();
  }

  return <section className="rounded-xl border border-border bg-card p-4 sm:p-5" aria-label="Controles do ambiente de prática">
    <div className="flex flex-wrap items-end gap-4">
      <label className="grid gap-1.5">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><UserCog className="size-3.5" /> Perfil de teste</span>
        <select value={settings.personaId} onChange={(event) => patch({ personaId: event.target.value })} className="input w-56" disabled={busy !== ""}>
          {personas.map((persona) => <option key={persona.id} value={persona.id}>{persona.name}</option>)}
        </select>
      </label>

      <label className="flex items-center gap-2 pb-2.5 text-sm">
        <input type="checkbox" checked={settings.instructor} onChange={(event) => patch({ instructor: event.target.checked })} disabled={busy !== ""} />
        Modo instrutor
      </label>

      <div className="ml-auto flex items-end gap-2 pb-0.5">
        <Button type="button" variant="outline" size="sm" onClick={shuffle} disabled={busy !== ""}><ShieldAlert className="size-3.5" /> Sortear desvios</Button>
        <Button type="button" variant="outline" size="sm" onClick={restore} disabled={busy !== ""}>{busy === "reset" ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCcw className="size-3.5" />} Restaurar massa</Button>
      </div>
    </div>

    <p className="mt-3 text-xs leading-5 text-muted-foreground">{personas.find((persona) => persona.id === settings.personaId)?.description}</p>

    <div className="mt-4 border-t border-border pt-4">
      {settings.instructor
        ? <>
            <p className="text-xs font-medium text-muted-foreground">Desvios plantados neste ambiente</p>
            <ul className="mt-2 grid gap-2">{bugs.map((bug) => {
              const active = settings.activeBugs.includes(bug.id);
              return <li key={bug.id}>
                <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border p-3 text-sm transition hover:bg-accent focus-within:ring-2 focus-within:ring-ring/40">
                  <input type="checkbox" checked={active} onChange={() => toggleBug(bug.id)} disabled={busy !== ""} className="mt-1" />
                  <span>
                    <span className="flex flex-wrap items-center gap-2"><strong className="font-medium">{bug.title}</strong><Badge variant="secondary" className="font-normal">{bug.severity}</Badge></span>
                    <span className="mt-1 block text-xs text-muted-foreground">Sintoma: {bug.symptom}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">Mecanismo: {bug.mechanism}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">Costuma cair no cenário: {bug.scenario}</span>
                  </span>
                </label>
              </li>;
            })}</ul>
          </>
        : <p className="text-xs leading-5 text-muted-foreground">
            {activeHere.length === 0
              ? "Nenhum desvio ativo neste ambiente. Sorteie para praticar investigação sem saber o que procurar."
              : `${activeHere.length} desvio(s) ativo(s) neste ambiente. Quais são fica oculto no modo aluno — investigue e registre a evidência.`}
          </p>}
    </div>

    {error && <p role="alert" className="mt-3 text-xs text-destructive">{error}</p>}
  </section>;
}
