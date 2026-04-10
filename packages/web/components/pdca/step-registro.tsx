"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import type { BugRegistro, Severity, Environment } from "@/lib/pdca";
import { severityConfig, environmentConfig, learningTips } from "@/lib/pdca";

interface Props {
  data: BugRegistro;
  onChange: (data: BugRegistro) => void;
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

export function StepRegistro({ data, onChange, learning }: Props) {
  function set<K extends keyof BugRegistro>(key: K, value: BugRegistro[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="titulo">Título do Bug</Label>
          <Tip id="registro.titulo" active={learning} />
        </div>
        <Input id="titulo" placeholder="Ex: Botão de checkout não responde ao clique" value={data.titulo} onChange={e => set("titulo", e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="descricao">Descrição do comportamento observado</Label>
          <Tip id="registro.descricao" active={learning} />
        </div>
        <Textarea id="descricao" placeholder="Descreva o que aconteceu, incluindo passos para reproduzir..." rows={3} value={data.descricao} onChange={e => set("descricao", e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="esperado">Comportamento esperado</Label>
          <Tip id="registro.esperado" active={learning} />
        </div>
        <Textarea id="esperado" placeholder="O que deveria ter acontecido..." rows={2} value={data.comportamentoEsperado} onChange={e => set("comportamentoEsperado", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Label>Ambiente</Label>
            <Tip id="registro.ambiente" active={learning} />
          </div>
          <select
            className="h-9 w-full rounded-lg border border-mint/20 bg-dark-green/40 px-3 text-sm text-off-white"
            value={data.ambiente}
            onChange={e => set("ambiente", e.target.value as Environment)}
          >
            {(Object.entries(environmentConfig) as [Environment, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Label>Severidade</Label>
            <Tip id="registro.severidade" active={learning} />
          </div>
          <select
            className="h-9 w-full rounded-lg border border-mint/20 bg-dark-green/40 px-3 text-sm text-off-white"
            value={data.severidade}
            onChange={e => set("severidade", e.target.value as Severity)}
          >
            {(Object.entries(severityConfig) as [Severity, { label: string; cor: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="evidencia">Evidências (screenshot URL ou link)</Label>
          <Tip id="registro.evidencia" active={learning} />
        </div>
        <Input id="evidencia" placeholder="https://..." value={data.evidenciaUrl} onChange={e => set("evidenciaUrl", e.target.value)} />
      </div>
    </div>
  );
}
