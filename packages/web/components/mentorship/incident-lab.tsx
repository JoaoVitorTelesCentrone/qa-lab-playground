"use client";

import Link from "next/link";
import { useState } from "react";
import { exportIncidentMarkdown, incidentExperiment, reproduceIncident, runRegressionPack, validatesRegression, type RegressionResult } from "@/lib/mentorship/incident-experiment";

const button = "rounded-lg border border-white/25 px-4 py-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint disabled:cursor-not-allowed disabled:opacity-40";
const count = (value: number) => `${value} ações`;

export function IncidentLab() {
  const [hypothesis, setHypothesis] = useState("");
  const [evidence, setEvidence] = useState("");
  const [reproduction, setReproduction] = useState<ReturnType<typeof reproduceIncident> | null>(null);
  const [results, setResults] = useState<RegressionResult[] | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [notice, setNotice] = useState("");
  const diagnosisReady = hypothesis === "status-filter" && evidence.trim().length >= 20;
  const exportReady = diagnosisReady && validatesRegression(results) && analysis.trim().length >= 30;

  function download() {
    if (!results) return;
    const url = URL.createObjectURL(new Blob([exportIncidentMarkdown(hypothesis, evidence, analysis, results)], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "lab-incidente-regressao.md"; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice("Relatório exportado. Envie-o pela entrega da semana 10 para revisão.");
  }

  return <div className="space-y-12">
    <section aria-labelledby="incident-title"><p className="text-sm font-bold text-mint">1 · Investigue</p><h2 id="incident-title" className="mt-2 text-2xl font-bold">Relato e sinais da release</h2><p className="mt-4 max-w-[70ch] leading-7 text-[#C8CFD7]">{incidentExperiment.summary}</p><pre className="mt-5 overflow-x-auto rounded-lg border border-white/15 bg-[#0B0D11] p-4 text-sm leading-7 text-[#C8CFD7]">{incidentExperiment.logs.join("\n")}</pre><fieldset className="mt-6 max-w-[70ch]"><legend className="font-bold">Hipótese mais consistente com os logs</legend><div className="mt-3 space-y-3">{incidentExperiment.hypotheses.map(item => <label key={item.id} className="flex cursor-pointer gap-3 rounded-lg border border-white/15 p-3"><input type="radio" name="hypothesis" value={item.id} checked={hypothesis === item.id} onChange={event => { setHypothesis(event.target.value); setReproduction(null); setResults(null); }} className="mt-1 accent-[#93FFC8]"/><span>{item.label}</span></label>)}</div></fieldset><label htmlFor="log-evidence" className="mt-5 block max-w-[70ch] font-semibold">Evidência que sustenta ou enfraquece a hipótese<textarea id="log-evidence" rows={4} maxLength={12000} value={evidence} onChange={event => setEvidence(event.target.value)} className="mt-2 w-full rounded-lg border border-white/25 bg-[#101319] p-3 leading-7 text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint" /></label></section>

    <section aria-labelledby="reproduce-title" className="border-t border-white/15 pt-8"><p className="text-sm font-bold text-mint">2 · Reproduza</p><h2 id="reproduce-title" className="mt-2 text-2xl font-bold">Confirme a divergência na versão do incidente</h2><p className="mt-3 max-w-[70ch] leading-7 text-[#C8CFD7]">A reprodução usa o mesmo seed, release e identificador dos logs. Escolha a hipótese correta e cite ao menos um sinal antes de executar.</p><button disabled={!diagnosisReady} className={`${button} mt-5 bg-mint text-[#101319]`} onClick={() => { setReproduction(reproduceIncident()); setNotice("Incidente reproduzido: a diferença corresponde à ação pendente contada como concluída."); }}>Reproduzir incidente</button>{reproduction && <div className="mt-5 grid gap-3 sm:grid-cols-2"><ResultCard label="Esperado pela regra" value={count(reproduction.expectedCount)} status="BASELINE"/><ResultCard label="Observado na release" value={count(reproduction.observedCount)} status="DIVERGENTE"/></div>}</section>

    <section aria-labelledby="regression-title" className="border-t border-white/15 pt-8"><p className="text-sm font-bold text-mint">3 · Impeça a volta</p><h2 id="regression-title" className="mt-2 text-2xl font-bold">Execute o mesmo teste antes e depois da correção</h2><p className="mt-3 max-w-[70ch] leading-7 text-[#C8CFD7]">O pacote inclui o incidente, outra massa com proporção diferente de estados e um contracaso em que todas as ações estão concluídas.</p><button disabled={!reproduction} className={`${button} mt-5 bg-mint text-[#101319]`} onClick={() => { setResults(runRegressionPack()); setNotice("Regressão executada: falha nas duas massas relevantes antes da correção e passa em todos os casos depois."); }}>Executar pacote de regressão</button>{results && <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[46rem] border-collapse text-left text-sm"><thead className="border-y border-white/20 text-[#AAB2BC]"><tr><th className="p-3">Caso</th><th className="p-3 text-right">Esperado</th><th className="p-3 text-right">Antes</th><th className="p-3">Teste</th><th className="p-3 text-right">Depois</th><th className="p-3">Teste</th></tr></thead><tbody>{results.map(item => <tr key={item.caseId} className="border-b border-white/10"><td className="p-3">{item.label}</td><td className="p-3 text-right">{count(item.expectedCount)}</td><td className="p-3 text-right">{count(item.beforeCount)}</td><td className={item.beforePassed ? "p-3 text-mint" : "p-3 text-[#FFAA91]"}>{item.beforePassed ? "PASS" : "FAIL"}</td><td className="p-3 text-right">{count(item.afterCount)}</td><td className={item.afterPassed ? "p-3 text-mint" : "p-3 text-[#FFAA91]"}>{item.afterPassed ? "PASS" : "FAIL"}</td></tr>)}</tbody></table></div>}</section>

    <section aria-labelledby="analysis-title" className="border-t border-white/15 pt-8"><p className="text-sm font-bold text-mint">4 · Feche a cadeia</p><h2 id="analysis-title" className="mt-2 text-2xl font-bold">Explique causa, proteção e limites</h2><label htmlFor="incident-analysis" className="mt-5 block max-w-[70ch] font-semibold">Análise final<textarea id="incident-analysis" rows={6} maxLength={12000} value={analysis} onChange={event => setAnalysis(event.target.value)} className="mt-2 w-full rounded-lg border border-white/25 bg-[#101319] p-3 leading-7 text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint" /></label><p className="mt-2 max-w-[70ch] text-sm leading-6 text-[#AAB2BC]">Relacione o log à causa, explique o papel da variação e do contracaso e limite a conclusão ao defeito controlado. Mínimo de 30 caracteres.</p><button disabled={!exportReady} className={`${button} mt-5 bg-mint text-[#101319]`} onClick={download}>Exportar cadeia de evidências .md</button><p className="mt-4 text-sm leading-7 text-[#C8CFD7]">Exportar não registra conclusão automática. <Link href="/mentoria/semanas/10#enviar" className="text-mint underline">Abrir entrega da semana 10</Link>.</p></section>
    <p role="status" aria-live="polite" className="min-h-6 text-sm text-mint">{notice}</p>
  </div>;
}

function ResultCard({ label, value, status }: { label: string; value: string; status: string }) {
  return <article className="rounded-lg border border-white/20 p-4"><p className="text-sm text-[#AAB2BC]">{label}</p><p className="mt-2 text-xl font-bold">{value}</p><p className="mt-2 font-mono text-xs text-mint">{status}</p></article>;
}
