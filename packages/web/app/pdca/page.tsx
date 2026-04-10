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
      <div className="space-y-4 animate-slide-in-up">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-mint/20">
              <SearchCheck className="size-5 text-mint" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-mint italic">
                ANÁLISE PDCA
              </h1>
              <p className="text-sm text-mint/50 uppercase tracking-[0.15em]">
                Investigue bugs com estrutura
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => startNew()} className="gap-1.5">
            <Plus className="size-3.5" /> Nova Análise
          </Button>
        </div>
        <p className="text-sm text-off-white/60 max-w-xl">
          Investigue bugs de forma estruturada usando o ciclo PDCA. Registre, planeje, execute, verifique e documente a causa raiz.
        </p>
      </div>

      {/* Templates */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-off-white/50">Templates para Praticar</h2>
        <div className="grid gap-3 sm:grid-cols-3 stagger">
          {pdcaTemplates.map(t => (
            <button
              key={t.id}
              onClick={() => startNew(t.id)}
              className="group rounded-2xl border border-mint/10 bg-dark-green/40 p-4 text-left transition-all hover:border-mint/30 hover:shadow-lg hover:shadow-mint/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`rounded-lg px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${t.cor}`}>{t.categoria}</span>
              </div>
              <p className="text-sm font-bold text-off-white group-hover:text-mint transition-colors">{t.titulo}</p>
              <p className="text-xs text-off-white/50 mt-1">{t.descricao}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-off-white/50">Badges ({badges.length}/{badgeDefinitions.length})</h2>
        <div className="flex flex-wrap gap-2">
          {badgeDefinitions.map(b => {
            const earned = badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all ${
                  earned
                    ? "border-neon/30 bg-neon/10 text-neon"
                    : "border-mint/10 text-off-white/40"
                }`}
              >
                <Award className={`size-3.5 ${earned ? "text-neon" : "text-off-white/30"}`} />
                {b.titulo}
                {!earned && <span className="text-off-white/30 ml-1">— {b.descricao}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      {cycles.length > 0 && (
        <div className="flex gap-4 text-sm text-off-white/50">
          <span>{cycles.length} análise{cycles.length !== 1 ? "s" : ""} total</span>
          <span className="text-mint/20">|</span>
          <span>{completedCount} concluída{completedCount !== 1 ? "s" : ""}</span>
          <span className="text-mint/20">|</span>
          <span>{cycles.length - completedCount} em andamento</span>
        </div>
      )}

      {/* History */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-off-white/50">Histórico</h2>
        {cycles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-mint/20 py-12 text-center">
            <FileText className="size-8 mx-auto text-off-white/20 mb-3" />
            <p className="text-sm text-off-white/50">Nenhuma análise ainda</p>
            <p className="text-xs text-off-white/30 mt-1">Clique em &quot;Nova Análise&quot; ou escolha um template para começar</p>
          </div>
        ) : (
          <div className="space-y-2 stagger">
            {cycles.map(c => {
              const sev = severityConfig[c.registro.severidade];
              const m = calcularMetricas(c);
              const score = calcularPontuacao(c);

              return (
                <div key={c.id} className="group flex items-center gap-4 rounded-2xl border border-mint/10 bg-dark-green/40 p-4 transition-all hover:border-mint/25">
                  {/* Severity dot */}
                  <span className={`size-2.5 rounded-full shrink-0 ${sev.cor}`} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-off-white truncate">{c.registro.titulo || "Sem título"}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-off-white/50">
                      <span>{new Date(c.iniciadoEm).toLocaleDateString("pt-BR")}</span>
                      {c.status === "concluido" && <span>{m.minutos} min</span>}
                      <span className={c.status === "concluido" ? "text-neon" : "text-[#F4A8A3]"}>
                        {c.status === "concluido" ? "Concluído" : c.stepAtual.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  {c.status === "concluido" && (
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-off-white/50">
                      <div className="h-1.5 w-12 rounded-full bg-off-white/10">
                        <div
                          className={`h-1.5 rounded-full ${score >= 80 ? "bg-neon" : score >= 50 ? "bg-[#F4A8A3]" : "bg-coral"}`}
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
                      className="rounded-lg p-1.5 hover:bg-off-white/10 transition-colors"
                      title={c.status === "concluido" ? "Ver análise" : "Continuar análise"}
                    >
                      {c.status === "concluido" ? <Eye className="size-4 text-off-white/50" /> : <Play className="size-4 text-mint" />}
                    </button>
                    <button
                      onClick={() => deleteCycle(c.id)}
                      className="rounded-lg p-1.5 hover:bg-coral/10 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="size-4 text-off-white/40 hover:text-coral" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Series Badge */}
      <div className="flex justify-end">
        <span className="series-number text-4xl text-off-white/10">
          #08
        </span>
      </div>
    </div>
  );
}
