"use client";

// Console do instrutor: liga e desliga os desvios plantados de todos os
// ambientes de uma vez.
//
// Só aqui o mecanismo do desvio é escrito por extenso junto do cenário que
// costuma pegá-lo. É a contrapartida da regra de produto: explícito no modo
// instrutor, oculto no modo aluno — por isso a página inteira depende de o modo
// instrutor estar ligado.

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { practiceApps } from "@/lib/product/apps";
import { bugsForApp, plantedBugs } from "@/lib/product/practice/bugs";
import { scenariosForBug } from "@/lib/regression-packs";
import type { PracticeSettings } from "@/lib/product/practice/store";

const severityVariant = { baixa: "ghost", media: "secondary", alta: "outline", critica: "destructive" } as const;

export function InstructorConsole({ settings }: { settings: PracticeSettings }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function patch(body: Record<string, unknown>, tag: string) {
    setBusy(tag); setError("");
    const response = await fetch("/api/v1/practice/settings", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    setBusy("");
    if (!response.ok) { setError("Não foi possível atualizar os desvios."); return; }
    router.refresh();
  }

  const active = settings.activeBugs;
  const toggle = (id: string) => patch({ activeBugs: active.includes(id) ? active.filter((item) => item !== id) : [...active, id] }, id);

  return <main className="qa-system"><div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
    <p className="qa-eyebrow">Modo instrutor</p>
    <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">Desvios plantados</h1>
    <p className="mt-3 max-w-2xl text-muted-foreground">
      Cada desvio tem efeito real no servidor ou no cálculo compartilhado, nunca só um aviso na tela — o aluno consegue reproduzir e provar.
      No modo aluno, o ambiente informa apenas quantos estão ativos.
    </p>

    {!settings.instructor && <p className="mt-6 rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
      O modo instrutor está desligado na sua conta. Ligue-o para que os ambientes também mostrem o mecanismo de cada desvio.{" "}
      <button type="button" className="text-primary underline-offset-4 hover:underline" onClick={() => patch({ instructor: true }, "instructor")}>Ligar agora</button>
    </p>}

    <div className="mt-8 flex flex-wrap items-center gap-2 border-y border-border py-4">
      <span className="text-sm text-muted-foreground">{active.length} de {plantedBugs.length} desvios ativos</span>
      <div className="ml-auto flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" disabled={busy !== ""} onClick={() => patch({ activeBugs: plantedBugs.map((bug) => bug.id) }, "all")}>Ligar todos</Button>
        <Button type="button" size="sm" variant="outline" disabled={busy !== ""} onClick={() => patch({ activeBugs: [] }, "none")}>Desligar todos</Button>
        <Button type="button" size="sm" variant="outline" disabled={busy !== ""} onClick={() => patch({ activeBugs: plantedBugs.filter(() => Math.random() < 0.5).map((bug) => bug.id) }, "shuffle")}>Sortear</Button>
        <Button type="button" size="sm" variant={settings.instructor ? "secondary" : "default"} disabled={busy !== ""} onClick={() => patch({ instructor: !settings.instructor }, "instructor")}>
          {busy === "instructor" && <Loader2 className="size-3.5 animate-spin" />}
          {settings.instructor ? "Desligar modo instrutor" : "Ligar modo instrutor"}
        </Button>
      </div>
    </div>

    {error && <p role="alert" className="mt-4 rounded-md border border-destructive/30 p-3 text-sm text-destructive">{error}</p>}

    <div className="mt-8 grid gap-6">{practiceApps.map((app) => {
      const bugs = bugsForApp(app.id);
      if (bugs.length === 0) return null;

      return <section key={app.id} aria-labelledby={`instrutor-${app.id}`} className="rounded-xl border border-border p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id={`instrutor-${app.id}`} className="text-xl font-semibold">{app.name}</h2>
          <Link href={app.route} className="text-sm text-primary">Abrir ambiente →</Link>
        </div>

        <ul className="mt-4 grid gap-3">{bugs.map((bug) => {
          const on = active.includes(bug.id);
          const scenarios = scenariosForBug(bug.id);

          return <li key={bug.id}>
            <label className={`flex cursor-pointer items-start gap-3 rounded-md border p-3.5 transition focus-within:ring-2 focus-within:ring-ring/40 ${on ? "border-primary/40 bg-primary/5" : "border-border hover:bg-accent"}`}>
              <input type="checkbox" checked={on} onChange={() => toggle(bug.id)} disabled={busy !== ""} className="mt-1" />
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <strong className="font-medium">{bug.title}</strong>
                  <Badge variant={severityVariant[bug.severity]} className="font-normal">{bug.severity}</Badge>
                  {on && <Badge className="font-normal">ativo</Badge>}
                </span>
                <span className="mt-1.5 block text-sm leading-6 text-muted-foreground"><b className="font-medium text-foreground">Sintoma:</b> {bug.symptom}</span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground"><b className="font-medium text-foreground">Mecanismo:</b> {bug.mechanism}</span>
                {scenarios.length > 0 && <span className="mt-2 block text-xs text-muted-foreground">
                  Cai nos cenários: {scenarios.map(({ scenario }) => `${String(scenario.number).padStart(2, "0")} ${scenario.title}`).join(" · ")}
                </span>}
              </span>
            </label>
          </li>;
        })}</ul>
      </section>;
    })}</div>

    <p className="mt-8 text-sm text-muted-foreground">
      Os desvios valem para a sua conta. Para devolver o ambiente ao estado conhecido, use “Restaurar massa” dentro de cada ambiente ou consulte os{" "}
      <Link href="/labs/regressao" className="text-primary">packs de regressão</Link>.
    </p>
  </div></main>;
}
