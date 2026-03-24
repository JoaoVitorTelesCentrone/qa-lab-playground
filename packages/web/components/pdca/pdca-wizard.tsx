"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, Check, Lightbulb } from "lucide-react";
import type { PDCACycle, PDCAStep } from "@/lib/pdca";
import { stepOrder, stepConfig } from "@/lib/pdca";
import { StepRegistro } from "./step-registro";
import { StepPlan } from "./step-plan";
import { StepDo } from "./step-do";
import { StepCheck } from "./step-check";
import { StepAct } from "./step-act";
import { StepRelatorio } from "./step-relatorio";

interface Props {
  cycle: PDCACycle;
  allCycles: PDCACycle[];
  onUpdate: (cycle: PDCACycle) => void;
  onFinish: (cycle: PDCACycle) => void;
  onBack: () => void;
  learning: boolean;
  onToggleLearning: () => void;
}

function canAdvance(step: PDCAStep, cycle: PDCACycle): boolean {
  switch (step) {
    case "registro":
      return cycle.registro.titulo.trim() !== "" && cycle.registro.descricao.trim() !== "";
    case "plan":
      return cycle.plan.hipoteses.filter(h => h.trim()).length >= 3;
    case "do":
      return cycle.do.testes.some(t => t.status !== "pendente");
    case "check":
      return cycle.check.causaRaiz.trim() !== "";
    case "act":
      return cycle.act.correcaoImediata.descricao.trim() !== "";
    case "relatorio":
      return true;
  }
}

export function PDCAWizard({ cycle, allCycles, onUpdate, onFinish, onBack, learning, onToggleLearning }: Props) {
  const currentIdx = stepOrder.indexOf(cycle.stepAtual);
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === stepOrder.length - 1;

  function goTo(step: PDCAStep) {
    onUpdate({ ...cycle, stepAtual: step });
  }

  function prev() {
    if (!isFirst) goTo(stepOrder[currentIdx - 1]);
  }

  function next() {
    if (isLast) {
      onFinish({ ...cycle, status: "concluido", concluidoEm: new Date().toISOString() });
    } else {
      goTo(stepOrder[currentIdx + 1]);
    }
  }

  const cfg = stepConfig[cycle.stepAtual];
  const valid = canAdvance(cycle.stepAtual, cycle);

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-3.5" /> Voltar ao histórico
        </button>
        <button
          onClick={onToggleLearning}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
            learning ? "border-amber-200 bg-amber-50 text-amber-700" : "border-border text-muted-foreground"
          }`}
        >
          <Lightbulb className="size-3" />
          {learning ? "Modo Aprendizado" : "Aprendizado off"}
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1">
        {stepOrder.map((step, i) => {
          const s = stepConfig[step];
          const isActive = step === cycle.stepAtual;
          const isDone = i < currentIdx;
          const isClickable = i <= currentIdx;

          return (
            <div key={step} className="flex items-center flex-1 min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => isClickable && goTo(step)}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all w-full justify-center ${
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : isDone
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "text-muted-foreground/50 border border-transparent"
                    } ${isClickable ? "cursor-pointer hover:bg-secondary" : "cursor-default"}`}
                  >
                    {isDone ? (
                      <Check className="size-3 shrink-0" />
                    ) : (
                      <span className={`size-4 flex items-center justify-center rounded-full text-[10px] font-bold shrink-0 ${
                        isActive ? "bg-primary text-white" : "bg-muted-foreground/20 text-muted-foreground/60"
                      }`}>
                        {i + 1}
                      </span>
                    )}
                    <span className="hidden sm:block truncate">{s.label}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {s.descricao}
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </div>

      {/* Step title */}
      <div>
        <h2 className="text-lg font-bold">{cfg.label}</h2>
        <p className="text-sm text-muted-foreground">{cfg.descricao}</p>
      </div>

      {/* Step content */}
      <div className="min-h-[300px]">
        {cycle.stepAtual === "registro" && (
          <StepRegistro data={cycle.registro} onChange={registro => onUpdate({ ...cycle, registro })} learning={learning} />
        )}
        {cycle.stepAtual === "plan" && (
          <StepPlan data={cycle.plan} onChange={plan => onUpdate({ ...cycle, plan })} learning={learning} />
        )}
        {cycle.stepAtual === "do" && (
          <StepDo data={cycle.do} hipoteses={cycle.plan.hipoteses} onChange={doData => onUpdate({ ...cycle, do: doData })} learning={learning} />
        )}
        {cycle.stepAtual === "check" && (
          <StepCheck data={cycle.check} planData={cycle.plan} doData={cycle.do} onChange={check => onUpdate({ ...cycle, check })} learning={learning} />
        )}
        {cycle.stepAtual === "act" && (
          <StepAct data={cycle.act} onChange={act => onUpdate({ ...cycle, act })} learning={learning} />
        )}
        {cycle.stepAtual === "relatorio" && (
          <StepRelatorio cycle={cycle} allCycles={allCycles} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button variant="outline" size="sm" onClick={prev} disabled={isFirst} className="gap-1.5">
          <ArrowLeft className="size-3.5" /> Anterior
        </Button>

        {!valid && !isLast && (
          <span className="text-xs text-muted-foreground">Preencha os campos obrigatórios para avançar</span>
        )}

        <Button
          size="sm"
          onClick={next}
          disabled={!valid && !isLast}
          className="gap-1.5"
        >
          {isLast ? "Concluir Análise" : "Próximo"}
          {!isLast && <ArrowRight className="size-3.5" />}
        </Button>
      </div>
    </div>
  );
}
