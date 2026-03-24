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
import type { ActData, PreventiveActionType } from "@/lib/pdca";
import { preventiveTypes, learningTips } from "@/lib/pdca";

interface Props {
  data: ActData;
  onChange: (data: ActData) => void;
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

export function StepAct({ data, onChange, learning }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Correção Imediata */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5">
          <Label className="text-base font-semibold">Correção Imediata</Label>
          <Tip id="act.correcao" active={learning} />
        </div>

        <div className="space-y-3 rounded-lg border border-border p-4">
          <div className="space-y-1.5">
            <Label htmlFor="fix-desc">Descrição da correção</Label>
            <Textarea
              id="fix-desc"
              placeholder="O que precisa ser feito para corrigir o bug..."
              rows={2}
              value={data.correcaoImediata.descricao}
              onChange={e => onChange({ ...data, correcaoImediata: { ...data.correcaoImediata, descricao: e.target.value } })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                placeholder="Nome do responsável..."
                value={data.correcaoImediata.responsavel}
                onChange={e => onChange({ ...data, correcaoImediata: { ...data.correcaoImediata, responsavel: e.target.value } })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prazo">Prazo</Label>
              <Input
                id="prazo"
                type="date"
                value={data.correcaoImediata.prazo}
                onChange={e => onChange({ ...data, correcaoImediata: { ...data.correcaoImediata, prazo: e.target.value } })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ação Preventiva */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5">
          <Label className="text-base font-semibold">Ação Preventiva</Label>
          <Tip id="act.preventiva" active={learning} />
        </div>

        <div className="space-y-3 rounded-lg border border-border p-4">
          <div className="space-y-1.5">
            <Label htmlFor="preventiva-desc">O que fazer para evitar bugs similares?</Label>
            <Textarea
              id="preventiva-desc"
              placeholder="Ação preventiva para o futuro..."
              rows={2}
              value={data.acaoPreventiva.descricao}
              onChange={e => onChange({ ...data, acaoPreventiva: { ...data.acaoPreventiva, descricao: e.target.value } })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Tipo de ação</Label>
            <select
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={data.acaoPreventiva.tipo}
              onChange={e => onChange({ ...data, acaoPreventiva: { ...data.acaoPreventiva, tipo: e.target.value as PreventiveActionType } })}
            >
              {(Object.entries(preventiveTypes) as [PreventiveActionType, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lições Aprendidas */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="licoes">Lições Aprendidas</Label>
          <Tip id="act.licoes" active={learning} />
        </div>
        <Textarea
          id="licoes"
          placeholder="O que você aprendeu com essa análise?"
          rows={3}
          value={data.licoesAprendidas}
          onChange={e => onChange({ ...data, licoesAprendidas: e.target.value })}
        />
      </div>

      {/* Teste de regressão */}
      <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-border p-4 hover:bg-secondary/30 transition-colors">
        <input
          type="checkbox"
          checked={data.testeRegressao}
          onChange={e => onChange({ ...data, testeRegressao: e.target.checked })}
          className="size-4 rounded border-input accent-primary"
        />
        <div>
          <p className="text-sm font-medium">Adicionar caso de teste de regressão?</p>
          <p className="text-xs text-muted-foreground">Marque se um novo teste automatizado deve ser criado para este cenário</p>
        </div>
      </label>
    </div>
  );
}
