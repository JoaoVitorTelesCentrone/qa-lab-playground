"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Check, X, Circle, Clock } from "lucide-react";
import type { DoData, HypothesisTest, HypothesisStatus } from "@/lib/pdca";
import { learningTips } from "@/lib/pdca";

interface Props {
  data: DoData;
  hipoteses: string[];
  onChange: (data: DoData) => void;
  learning: boolean;
}

function Tip({ id, active }: { id: string; active: boolean }) {
  if (!active) return null;
  const text = learningTips[id];
  if (!text) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="size-3.5 text-amber-500 cursor-help shrink-0" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

const statusIcon: Record<HypothesisStatus, { icon: React.ElementType; class: string }> = {
  pendente:   { icon: Circle, class: "text-muted-foreground/40" },
  confirmada: { icon: Check,  class: "text-green-500" },
  descartada: { icon: X,      class: "text-red-400" },
};

export function StepDo({ data, hipoteses, onChange, learning }: Props) {
  const validHipoteses = hipoteses.filter(h => h.trim());

  function getOrCreateTest(index: number): HypothesisTest {
    const existing = data.testes.find(t => t.hipoteseIndex === index);
    if (existing) return existing;
    return {
      hipoteseIndex: index,
      oQueFoiTestado: "",
      resultado: "",
      status: "pendente",
      timestamp: new Date().toISOString(),
    };
  }

  function updateTest(index: number, partial: Partial<HypothesisTest>) {
    const current = getOrCreateTest(index);
    const updated = { ...current, ...partial, timestamp: new Date().toISOString() };
    const exists = data.testes.some(t => t.hipoteseIndex === index);
    const testes = exists
      ? data.testes.map(t => t.hipoteseIndex === index ? updated : t)
      : [...data.testes, updated];
    onChange({ ...data, testes });
  }

  function cycleStatus(index: number) {
    const current = getOrCreateTest(index);
    const next: HypothesisStatus =
      current.status === "pendente" ? "confirmada" :
      current.status === "confirmada" ? "descartada" : "pendente";
    updateTest(index, { status: next });
  }

  // Timeline: tested hypotheses sorted by timestamp
  const timeline = [...data.testes]
    .filter(t => t.status !== "pendente")
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hypothesis tests */}
      <div className="space-y-4">
        <Label>Testar Hipóteses</Label>

        {validHipoteses.map((h, i) => {
          const test = getOrCreateTest(i);
          const si = statusIcon[test.status];
          const StatusIcon = si.icon;

          return (
            <div key={i} className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{h}</span>
                </div>
                <button
                  onClick={() => cycleStatus(i)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    test.status === "confirmada" ? "border-green-200 bg-green-50 text-green-600" :
                    test.status === "descartada" ? "border-red-200 bg-red-50 text-red-500" :
                    "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <StatusIcon className={`size-3 ${si.class}`} />
                  {test.status === "confirmada" ? "Confirmada" :
                   test.status === "descartada" ? "Descartada" : "Pendente"}
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">O que foi testado?</span>
                    <Tip id="do.teste" active={learning} />
                  </div>
                  <Input
                    placeholder="Descreva o teste realizado..."
                    value={test.oQueFoiTestado}
                    onChange={e => updateTest(i, { oQueFoiTestado: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Resultado encontrado</span>
                    <Tip id="do.resultado" active={learning} />
                  </div>
                  <Input
                    placeholder="O que foi descoberto..."
                    value={test.resultado}
                    onChange={e => updateTest(i, { resultado: e.target.value })}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      {timeline.length > 0 && (
        <div className="space-y-2">
          <Label>Timeline de Investigação</Label>
          <div className="relative pl-6 space-y-3">
            <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-border rounded-full" />
            {timeline.map((t, i) => {
              const si = statusIcon[t.status];
              const StatusIcon = si.icon;
              const label = hipoteses[t.hipoteseIndex] || `Hipótese ${t.hipoteseIndex + 1}`;
              const time = new Date(t.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

              return (
                <div key={i} className="relative flex items-start gap-3">
                  <div className="absolute -left-4 top-1 flex size-4 items-center justify-center rounded-full bg-background border border-border">
                    <StatusIcon className={`size-2.5 ${si.class}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{label}</p>
                    <p className="text-xs text-muted-foreground">{t.resultado || "Sem resultado"}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="size-3" /> {time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Descobertas inesperadas */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="descobertas">Descobertas durante a investigação</Label>
          <Tip id="do.descobertas" active={learning} />
        </div>
        <Textarea
          id="descobertas"
          placeholder="Algo inesperado encontrado durante os testes..."
          rows={3}
          value={data.descobertasInesperadas}
          onChange={e => onChange({ ...data, descobertasInesperadas: e.target.value })}
        />
      </div>
    </div>
  );
}
