"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Plus, X, Check, Circle, GripVertical } from "lucide-react";
import type { PlanData, ChecklistItem } from "@/lib/pdca";
import { generateId, resourceTags, learningTips } from "@/lib/pdca";

interface Props {
  data: PlanData;
  onChange: (data: PlanData) => void;
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

export function StepPlan({ data, onChange, learning }: Props) {
  const [newStep, setNewStep] = useState("");

  function updateHipotese(index: number, value: string) {
    const next = [...data.hipoteses];
    next[index] = value;
    onChange({ ...data, hipoteses: next });
  }

  function addHipotese() {
    onChange({ ...data, hipoteses: [...data.hipoteses, ""] });
  }

  function removeHipotese(index: number) {
    if (data.hipoteses.length <= 3) return;
    onChange({ ...data, hipoteses: data.hipoteses.filter((_, i) => i !== index) });
  }

  function addStep() {
    const t = newStep.trim();
    if (!t) return;
    const item: ChecklistItem = { id: generateId(), texto: t, concluido: false };
    onChange({ ...data, planoInvestigacao: [...data.planoInvestigacao, item] });
    setNewStep("");
  }

  function toggleStep(id: string) {
    onChange({
      ...data,
      planoInvestigacao: data.planoInvestigacao.map(s =>
        s.id === id ? { ...s, concluido: !s.concluido } : s
      ),
    });
  }

  function removeStep(id: string) {
    onChange({ ...data, planoInvestigacao: data.planoInvestigacao.filter(s => s.id !== id) });
  }

  function toggleResource(tag: string) {
    const has = data.recursosNecessarios.includes(tag);
    onChange({
      ...data,
      recursosNecessarios: has
        ? data.recursosNecessarios.filter(r => r !== tag)
        : [...data.recursosNecessarios, tag],
    });
  }

  const validCount = data.hipoteses.filter(h => h.trim()).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hipóteses */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Label>Hipóteses Iniciais</Label>
            <Tip id="plan.hipoteses" active={learning} />
          </div>
          <span className="text-xs text-muted-foreground">
            {validCount}/3 mínimo
          </span>
        </div>

        <div className="space-y-2">
          {data.hipoteses.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <Input
                placeholder={`Hipótese ${i + 1}...`}
                value={h}
                onChange={e => updateHipotese(i, e.target.value)}
                className="flex-1"
              />
              {data.hipoteses.length > 3 && (
                <button onClick={() => removeHipotese(i)} className="shrink-0 rounded p-1 hover:bg-secondary">
                  <X className="size-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={addHipotese} className="gap-1.5">
          <Plus className="size-3.5" /> Adicionar hipótese
        </Button>
      </div>

      {/* Plano de Investigação */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Label>Plano de Investigação</Label>
          <Tip id="plan.investigacao" active={learning} />
        </div>

        {data.planoInvestigacao.length > 0 && (
          <div className="space-y-1.5 rounded-lg border border-border p-3">
            {data.planoInvestigacao.map(item => (
              <div key={item.id} className="flex items-center gap-2 group">
                <button onClick={() => toggleStep(item.id)} className="shrink-0">
                  {item.concluido ? (
                    <Check className="size-4 text-primary" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground/40" />
                  )}
                </button>
                <span className={`flex-1 text-sm ${item.concluido ? "line-through text-muted-foreground" : ""}`}>
                  {item.texto}
                </span>
                <button onClick={() => removeStep(item.id)} className="opacity-0 group-hover:opacity-100 shrink-0 rounded p-0.5 hover:bg-secondary">
                  <X className="size-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Adicionar passo de investigação..."
            value={newStep}
            onChange={e => setNewStep(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addStep()}
            className="flex-1"
          />
          <Button variant="outline" size="sm" onClick={addStep} className="shrink-0">
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Recursos Necessários */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Label>Recursos Necessários</Label>
          <Tip id="plan.recursos" active={learning} />
        </div>
        <div className="flex flex-wrap gap-2">
          {resourceTags.map(tag => {
            const active = data.recursosNecessarios.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleResource(tag)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Critério de Sucesso */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="criterio">Critério de Sucesso</Label>
          <Tip id="plan.criterio" active={learning} />
        </div>
        <Textarea
          id="criterio"
          placeholder="Como saberemos que encontramos a causa raiz?"
          rows={2}
          value={data.criteriosSucesso}
          onChange={e => onChange({ ...data, criteriosSucesso: e.target.value })}
        />
      </div>
    </div>
  );
}
