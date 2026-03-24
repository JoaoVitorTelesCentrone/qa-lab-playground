"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchCheck, Plus, Award, Clock, FileText, Trash2, Play, Eye } from "lucide-react";
import type { PDCACycle } from "@/lib/pdca";
import {
  createEmptyCycle,
  calcularPontuacao,
  calcularMetricas,
  severityConfig,
  pdcaTemplates,
  badgeDefinitions,
  verificarBadges,
} from "@/lib/pdca";
import { PDCAWizard } from "@/components/pdca/pdca-wizard";

const STORAGE_KEY = "qa-lab-pdca-cycles";
const LEARNING_KEY = "qa-lab-pdca-learning";

function loadCycles(): PDCACycle[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); }
  catch { return []; }
}

function saveCycles(cycles: PDCACycle[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cycles));
}

function loadLearning(): boolean {
  if (typeof window === "undefined") return true;
  try { return JSON.parse(localStorage.getItem(LEARNING_KEY) ?? "true"); }
  catch { return true; }
}

export default function PDCAPage() {
  const [cycles, setCycles] = useState<PDCACycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [learning, setLearning] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCycles(loadCycles());
    setLearning(loadLearning());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveCycles(cycles);
  }, [cycles, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem(LEARNING_KEY, JSON.stringify(learning));
  }, [learning, loaded]);

  const activeCycle = cycles.find(c => c.id === activeCycleId) ?? null;

  function startNew(templateId?: string) {
    const cycle = createEmptyCycle(templateId);
    setCycles(prev => [cycle, ...prev]);
    setActiveCycleId(cycle.id);
  }

  function updateCycle(updated: PDCACycle) {
    setCycles(prev => prev.map(c => c.id === updated.id ? updated : c));
  }

  function finishCycle(updated: PDCACycle) {
    updateCycle(updated);
    setActiveCycleId(null);
  }

  function deleteCycle(id: string) {
    setCycles(prev => prev.filter(c => c.id !== id));
  }

  // Wizard view
  if (activeCycle) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <PDCAWizard
          cycle={activeCycle}
          allCycles={cycles}
          onUpdate={updateCycle}
          onFinish={finishCycle}
          onBack={() => setActiveCycleId(null)}
          learning={learning}
          onToggleLearning={() => setLearning(l => !l)}
        />
      </div>
    );
  }

  // History view
  const badges = verificarBadges(cycles);
  const completedCount = cycles.filter(c => c.status === "concluido").length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-3 animate-slide-in-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SearchCheck className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Análise PDCA</h1>
          </div>
          <Button size="sm" onClick={() => startNew()} className="gap-1.5">
            <Plus className="size-3.5" /> Nova Análise
          </Button>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl">
          Investigue bugs de forma estruturada usando o ciclo PDCA. Registre, planeje, execute, verifique e documente a causa raiz.
        </p>
      </div>

      {/* Templates */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Templates para Praticar</h2>
        <div className="grid gap-3 sm:grid-cols-3 stagger">
          {pdcaTemplates.map(t => (
            <button
              key={t.id}
              onClick={() => startNew(t.id)}
              className="group rounded-lg border border-border p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.cor}`}>{t.categoria}</span>
              </div>
              <p className="text-sm font-medium group-hover:text-primary transition-colors">{t.titulo}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.descricao}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Badges ({badges.length}/{badgeDefinitions.length})</h2>
        <div className="flex flex-wrap gap-2">
          {badgeDefinitions.map(b => {
            const earned = badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  earned
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-border text-muted-foreground/50"
                }`}
              >
                <Award className={`size-3.5 ${earned ? "text-amber-500" : "text-muted-foreground/30"}`} />
                {b.titulo}
                {!earned && <span className="text-muted-foreground/40 ml-1">— {b.descricao}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      {cycles.length > 0 && (
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{cycles.length} análise{cycles.length !== 1 ? "s" : ""} total</span>
          <span className="text-border">|</span>
          <span>{completedCount} concluída{completedCount !== 1 ? "s" : ""}</span>
          <span className="text-border">|</span>
          <span>{cycles.length - completedCount} em andamento</span>
        </div>
      )}

      {/* History */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Histórico</h2>
        {cycles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center">
            <FileText className="size-8 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma análise ainda</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Clique em &quot;Nova Análise&quot; ou escolha um template para começar</p>
          </div>
        ) : (
          <div className="space-y-2 stagger">
            {cycles.map(c => {
              const sev = severityConfig[c.registro.severidade];
              const m = calcularMetricas(c);
              const score = calcularPontuacao(c);

              return (
                <div key={c.id} className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-primary/20">
                  {/* Severity dot */}
                  <span className={`size-2.5 rounded-full shrink-0 ${sev.cor}`} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.registro.titulo || "Sem título"}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span>{new Date(c.iniciadoEm).toLocaleDateString("pt-BR")}</span>
                      {c.status === "concluido" && <span>{m.minutos} min</span>}
                      <span className={c.status === "concluido" ? "text-green-600" : "text-amber-600"}>
                        {c.status === "concluido" ? "Concluído" : c.stepAtual.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  {c.status === "concluido" && (
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="h-1.5 w-12 rounded-full bg-secondary">
                        <div
                          className={`h-1.5 rounded-full ${score >= 80 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-400"}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span>{score}%</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setActiveCycleId(c.id)}
                      className="rounded p-1.5 hover:bg-secondary transition-colors"
                      title={c.status === "concluido" ? "Ver análise" : "Continuar análise"}
                    >
                      {c.status === "concluido" ? <Eye className="size-4 text-muted-foreground" /> : <Play className="size-4 text-primary" />}
                    </button>
                    <button
                      onClick={() => deleteCycle(c.id)}
                      className="rounded p-1.5 hover:bg-secondary transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
