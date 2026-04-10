"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Plus, Check, X, ArrowDown } from "lucide-react";
import type { CheckData, FiveWhyEntry, PlanData, DoData } from "@/lib/pdca";
import { gerarResumoHipoteses, learningTips } from "@/lib/pdca";

interface Props {
  data: CheckData;
  planData: PlanData;
  doData: DoData;
  onChange: (data: CheckData) => void;
  learning: boolean;
}

function Tip({ id, active }: { id: string; active: boolean }) {
  if (!active) return null;
  const text = learningTips[id];
  if (!text) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="size-3.5 text-[#F4A8A3] cursor-help shrink-0" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

export function StepCheck({ data, planData, doData, onChange, learning }: Props) {
  // Auto-generate summary
  const autoResumo = gerarResumoHipoteses(planData, doData);
  const confirmadas = doData.testes.filter(t => t.status === "confirmada").length;
  const descartadas = doData.testes.filter(t => t.status === "descartada").length;
  const pendentes = doData.testes.filter(t => t.status === "pendente").length;

  function updateWhy(index: number, field: keyof FiveWhyEntry, value: string) {
    const next = [...data.cincoporques];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...data, cincoporques: next });
  }

  function addWhy() {
    if (data.cincoporques.length >= 5) return;
    const prev = data.cincoporques[data.cincoporques.length - 1];
    const pergunta = prev?.resposta
      ? `Por que ${prev.resposta.toLowerCase().replace(/\.$/, "")}?`
      : `Por quê?`;
    onChange({ ...data, cincoporques: [...data.cincoporques, { pergunta, resposta: "" }] });
  }

  function removeLastWhy() {
    if (data.cincoporques.length <= 1) return;
    onChange({ ...data, cincoporques: data.cincoporques.slice(0, -1) });
  }

  const canAddMore = data.cincoporques.length < 5 && data.cincoporques[data.cincoporques.length - 1]?.resposta.trim();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Resumo das hipóteses */}
      <div className="space-y-3">
        <Label>Resumo das Hipóteses</Label>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-neon">
            <Check className="size-3" /> {confirmadas} confirmada{confirmadas !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-coral/30 bg-coral/10 px-3 py-1 text-coral">
            <X className="size-3" /> {descartadas} descartada{descartadas !== 1 ? "s" : ""}
          </span>
          {pendentes > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-mint/10 px-3 py-1 text-off-white/50">
              {pendentes} pendente{pendentes !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="rounded-lg border border-mint/10 bg-dark-green/40 p-3">
          <pre className="whitespace-pre-wrap text-xs text-off-white/50 font-mono">{autoResumo || "Nenhuma hipótese testada ainda."}</pre>
        </div>
      </div>

      {/* 5 Porquês */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Label>Análise 5 Porquês</Label>
          <Tip id="check.porques" active={learning} />
        </div>

        <div className="relative space-y-0">
          {data.cincoporques.map((entry, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i > 0 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="size-4 text-off-white/50/30" />
                </div>
              )}

              <div className="rounded-lg border border-mint/10 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/20 text-xs font-bold text-mint">
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium text-off-white/50">Porquê #{i + 1}</span>
                  </span>
                  {i > 0 && i === data.cincoporques.length - 1 && (
                    <button onClick={removeLastWhy} className="text-xs text-off-white/50 hover:text-coral">
                      Remover
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Pergunta</Label>
                  <Textarea
                    value={entry.pergunta}
                    onChange={e => updateWhy(i, "pergunta", e.target.value)}
                    rows={1}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Resposta</Label>
                  <Textarea
                    placeholder="Porque..."
                    value={entry.resposta}
                    onChange={e => updateWhy(i, "resposta", e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {canAddMore && (
            <Button variant="outline" size="sm" onClick={addWhy} className="gap-1.5">
              <Plus className="size-3.5" /> Próximo Porquê ({data.cincoporques.length}/5)
            </Button>
          )}
          {data.cincoporques.length > 0 && data.cincoporques[data.cincoporques.length - 1]?.resposta.trim() && (
            <Button variant="ghost" size="sm" onClick={() => {
              const last = data.cincoporques[data.cincoporques.length - 1];
              if (last?.resposta) onChange({ ...data, causaRaiz: last.resposta });
            }} className="gap-1.5 text-mint">
              <Check className="size-3.5" /> Causa raiz encontrada
            </Button>
          )}
        </div>
      </div>

      {/* Causa Raiz */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="causa">Causa Raiz Identificada</Label>
          <Tip id="check.causa" active={learning} />
        </div>
        <Textarea
          id="causa"
          placeholder="Qual é a causa raiz do bug?"
          rows={2}
          value={data.causaRaiz}
          onChange={e => onChange({ ...data, causaRaiz: e.target.value })}
        />
      </div>

      {/* Evidências */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="evidencia-check">Evidências que comprovam a causa</Label>
          <Tip id="check.evidencia" active={learning} />
        </div>
        <Textarea
          id="evidencia-check"
          placeholder="Que provas você tem de que essa é a causa real?"
          rows={2}
          value={data.evidencia}
          onChange={e => onChange({ ...data, evidencia: e.target.value })}
        />
      </div>
    </div>
  );
}
