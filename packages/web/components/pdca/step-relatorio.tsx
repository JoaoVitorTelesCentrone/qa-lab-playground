"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Copy, Check, Award, Clock, Target, Search } from "lucide-react";
import type { PDCACycle } from "@/lib/pdca";
import {
  calcularMetricas,
  calcularPontuacao,
  exportarMarkdown,
  severityConfig,
  environmentConfig,
  preventiveTypes,
  stepConfig,
  badgeDefinitions,
  verificarBadges,
} from "@/lib/pdca";

interface Props {
  cycle: PDCACycle;
  allCycles: PDCACycle[];
}

export function StepRelatorio({ cycle, allCycles }: Props) {
  const [copied, setCopied] = useState(false);
  const m = calcularMetricas(cycle);
  const badges = verificarBadges(allCycles);

  async function copyMarkdown() {
    const md = exportarMarkdown(cycle);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function exportPdf() {
    window.print();
  }

  const sev = severityConfig[cycle.registro.severidade];
  const env = environmentConfig[cycle.registro.ambiente];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-mint/10 p-3 text-center">
          <Clock className="size-4 mx-auto mb-1 text-off-white/50" />
          <p className="text-lg font-bold">{m.minutos}<span className="text-xs font-normal text-off-white/50"> min</span></p>
          <p className="text-xs text-off-white/50">Tempo total</p>
        </div>
        <div className="rounded-lg border border-mint/10 p-3 text-center">
          <Target className="size-4 mx-auto mb-1 text-off-white/50" />
          <p className="text-lg font-bold">{m.hipotesesTestadas}</p>
          <p className="text-xs text-off-white/50">Hipóteses testadas</p>
        </div>
        <div className="rounded-lg border border-mint/10 p-3 text-center">
          <Search className="size-4 mx-auto mb-1 text-off-white/50" />
          <p className="text-lg font-bold">{m.profundidadePorques}<span className="text-xs font-normal text-off-white/50">/5</span></p>
          <p className="text-xs text-off-white/50">5 Porquês</p>
        </div>
        <div className="rounded-lg border border-mint/10 p-3 text-center">
          <Award className="size-4 mx-auto mb-1 text-off-white/50" />
          <p className="text-lg font-bold">{m.pontuacao}<span className="text-xs font-normal text-off-white/50">/100</span></p>
          <p className="text-xs text-off-white/50">Pontuação</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-off-white/50">
          <span>Qualidade da documentação</span>
          <span className="font-medium text-off-white">{m.pontuacao}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-off-white/10">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              m.pontuacao >= 80 ? "bg-neon" : m.pontuacao >= 50 ? "bg-[#F4A8A3]" : "bg-coral"
            }`}
            style={{ width: `${m.pontuacao}%` }}
          />
        </div>
      </div>

      {/* Relatório completo */}
      <div className="space-y-5 rounded-lg border border-mint/10 p-5">
        {/* Registro */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className={`size-2 rounded-full ${stepConfig.registro.cor.replace("text-", "bg-")}`} />
            Registro do Bug
          </h3>
          <div className="space-y-1 text-sm">
            <p className="font-medium">{cycle.registro.titulo}</p>
            <p className="text-off-white/50">{cycle.registro.descricao}</p>
            <div className="flex gap-2 pt-1">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${sev.cor} text-white`}>
                {sev.label}
              </span>
              <span className="rounded-full border border-mint/10 px-2 py-0.5 text-xs text-off-white/50">{env}</span>
            </div>
          </div>
        </section>

        <hr className="border-mint/10" />

        {/* Plan */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#F4A8A3]" />
            PLAN — Hipóteses
          </h3>
          <ul className="space-y-1 text-sm text-off-white/50">
            {cycle.plan.hipoteses.filter(h => h.trim()).map((h, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-xs font-mono text-mint mt-0.5">{i + 1}.</span>
                {h}
              </li>
            ))}
          </ul>
          {cycle.plan.recursosNecessarios.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {cycle.plan.recursosNecessarios.map(r => (
                <span key={r} className="rounded-full bg-mint/10 px-2 py-0.5 text-xs text-mint">{r}</span>
              ))}
            </div>
          )}
        </section>

        <hr className="border-mint/10" />

        {/* Do */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className="size-2 rounded-full bg-neon" />
            DO — Resultados
          </h3>
          <div className="space-y-2">
            {cycle.do.testes.filter(t => t.status !== "pendente").map((t, i) => {
              const label = cycle.plan.hipoteses[t.hipoteseIndex] || `Hipótese ${t.hipoteseIndex + 1}`;
              return (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className={`mt-0.5 size-2 rounded-full shrink-0 ${t.status === "confirmada" ? "bg-neon" : "bg-coral"}`} />
                  <div>
                    <span className="font-medium">{label}</span>
                    <span className={`ml-2 text-xs ${t.status === "confirmada" ? "text-neon" : "text-coral"}`}>
                      {t.status === "confirmada" ? "Confirmada" : "Descartada"}
                    </span>
                    {t.resultado && <p className="text-xs text-off-white/50 mt-0.5">{t.resultado}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <hr className="border-mint/10" />

        {/* Check */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className="size-2 rounded-full bg-mint" />
            CHECK — 5 Porquês
          </h3>
          <div className="space-y-2">
            {cycle.check.cincoporques.filter(w => w.resposta.trim()).map((w, i) => (
              <div key={i} className="text-sm">
                <p className="text-xs font-medium text-mint">Porquê #{i + 1}: {w.pergunta}</p>
                <p className="text-off-white/50">{w.resposta}</p>
              </div>
            ))}
          </div>
          {cycle.check.causaRaiz && (
            <div className="rounded-lg bg-mint/10 border border-mint/20 p-3 mt-2">
              <p className="text-xs font-semibold text-mint">Causa Raiz</p>
              <p className="text-sm text-off-white/80">{cycle.check.causaRaiz}</p>
            </div>
          )}
        </section>

        <hr className="border-mint/10" />

        {/* Act */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className="size-2 rounded-full bg-neon" />
            ACT — Ações
          </h3>
          {cycle.act.correcaoImediata.descricao && (
            <div className="text-sm">
              <p className="text-xs font-medium text-off-white/50">Correção Imediata</p>
              <p>{cycle.act.correcaoImediata.descricao}</p>
              <div className="flex gap-3 mt-1 text-xs text-off-white/50">
                {cycle.act.correcaoImediata.responsavel && <span>Responsável: {cycle.act.correcaoImediata.responsavel}</span>}
                {cycle.act.correcaoImediata.prazo && <span>Prazo: {cycle.act.correcaoImediata.prazo}</span>}
              </div>
            </div>
          )}
          {cycle.act.acaoPreventiva.descricao && (
            <div className="text-sm mt-2">
              <p className="text-xs font-medium text-off-white/50">Ação Preventiva ({preventiveTypes[cycle.act.acaoPreventiva.tipo]})</p>
              <p>{cycle.act.acaoPreventiva.descricao}</p>
            </div>
          )}
          {cycle.act.licoesAprendidas && (
            <div className="text-sm mt-2">
              <p className="text-xs font-medium text-off-white/50">Lições Aprendidas</p>
              <p className="text-off-white/50">{cycle.act.licoesAprendidas}</p>
            </div>
          )}
        </section>
      </div>

      {/* Badges ganhos */}
      {badges.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Badges Conquistados</h3>
          <div className="flex flex-wrap gap-2">
            {badgeDefinitions.filter(b => badges.includes(b.id)).map(b => (
              <span key={b.id} className="flex items-center gap-1.5 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs font-medium text-neon">
                <Award className="size-3" /> {b.titulo}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={copyMarkdown} className="gap-1.5">
          {copied ? <Check className="size-3.5 text-neon" /> : <Copy className="size-3.5" />}
          {copied ? "Copiado!" : "Exportar Markdown"}
        </Button>
        <Button variant="outline" size="sm" onClick={exportPdf} className="gap-1.5">
          <Download className="size-3.5" /> Exportar PDF
        </Button>
      </div>
    </div>
  );
}
