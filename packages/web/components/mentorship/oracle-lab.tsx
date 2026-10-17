"use client";

import Link from "next/link";
import { useState } from "react";
import { exportOracleMarkdown, hasDiscriminatingOracle, oracleExperiment, parseMoneyToCents, runBusinessCheck, runWeakCheck, type CheckResult } from "@/lib/mentorship/oracle-experiment";

const button = "rounded-lg border border-white/25 px-4 py-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint disabled:cursor-not-allowed disabled:opacity-40";
const money = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

export function OracleLab() {
  const [weakResults, setWeakResults] = useState<CheckResult[] | null>(null);
  const [expected, setExpected] = useState("");
  const [strongResults, setStrongResults] = useState<CheckResult[] | null>(null);
  const [rationale, setRationale] = useState("");
  const [notice, setNotice] = useState("");
  const expectedCents = parseMoneyToCents(expected);
  const ready = expectedCents !== null && hasDiscriminatingOracle(strongResults, expectedCents) && rationale.trim().length >= 30;

  function executeStrongCheck() {
    if (expectedCents === null) return;
    const results = runBusinessCheck(expectedCents);
    setStrongResults(results);
    setNotice(hasDiscriminatingOracle(results, expectedCents) ? "O oráculo diferenciou as versões pelo comportamento de negócio." : "Este esperado não protegeu a referência e rejeitou a variante pelo motivo correto. Recalcule usando apenas as despesas aprovadas.");
  }

  function download() {
    if (expectedCents === null || !strongResults) return;
    const url = URL.createObjectURL(new Blob([exportOracleMarkdown(expectedCents, rationale, strongResults)], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "lab-oraculo-de-negocio.md"; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Relatório exportado. Envie-o pela entrega da semana 6 ou use-o na revisão da semana 8.");
  }

  return <div className="space-y-12">
    <section aria-labelledby="mass-title"><p className="text-sm font-bold text-mint">1 · Entenda a massa</p><h2 id="mass-title" className="mt-2 text-2xl font-bold">Qual total o relatório deve mostrar?</h2><p className="mt-3 max-w-[70ch] leading-7 text-[#C8CFD7]">A regra diz: o relatório “Despesas aprovadas” soma somente registros com estado aprovado. Calcule o esperado a partir da tabela, sem usar a saída da função avaliada.</p>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[34rem] border-collapse text-left"><thead className="border-y border-white/20 text-sm text-[#AAB2BC]"><tr><th className="p-3">ID</th><th className="p-3">Estado</th><th className="p-3 text-right">Valor</th></tr></thead><tbody>{oracleExperiment.expenses.map(item => <tr key={item.id} className="border-b border-white/10"><td className="p-3 font-mono">{item.id}</td><td className="p-3">{item.status === "approved" ? "Aprovada" : "Rejeitada"}</td><td className="p-3 text-right">{money(item.cents)}</td></tr>)}</tbody></table></div>
    </section>

    <section aria-labelledby="weak-title" className="border-t border-white/15 pt-8"><p className="text-sm font-bold text-mint">2 · Execute o teste superficial</p><h2 id="weak-title" className="mt-2 text-2xl font-bold">“O relatório abriu” é suficiente?</h2><p className="mt-3 max-w-[70ch] leading-7 text-[#C8CFD7]">Este teste verifica apenas se existe título e se a geração terminou. Ele não conhece a regra da soma.</p><button className={`${button} mt-5 bg-mint text-[#101319]`} onClick={() => { setWeakResults(runWeakCheck()); setNotice("As duas versões ficaram verdes, embora produzam totais diferentes."); }}>Executar teste superficial</button>{weakResults && <Results results={weakResults} />}</section>

    <section aria-labelledby="oracle-title" className="border-t border-white/15 pt-8"><p className="text-sm font-bold text-mint">3 · Crie um oráculo independente</p><h2 id="oracle-title" className="mt-2 text-2xl font-bold">Compare o total com a regra</h2><label htmlFor="expected-total" className="mt-5 block max-w-sm font-semibold">Total esperado das despesas aprovadas<input id="expected-total" inputMode="decimal" placeholder="Ex.: 281,25" className="mt-2 w-full rounded-lg border border-white/25 bg-[#101319] p-3 text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint" value={expected} onChange={event => { setExpected(event.target.value); setStrongResults(null); }} /></label><p className="mt-2 text-sm text-[#AAB2BC]">Aceita reais com vírgula ou ponto. O teste usa o valor informado por você, sem derivá-lo da implementação.</p><button disabled={!weakResults || expectedCents === null} className={`${button} mt-5 bg-mint text-[#101319]`} onClick={executeStrongCheck}>Executar nas duas versões</button>{strongResults && <Results results={strongResults} />}</section>

    <section aria-labelledby="report-title" className="border-t border-white/15 pt-8"><p className="text-sm font-bold text-mint">4 · Explique a evidência</p><h2 id="report-title" className="mt-2 text-2xl font-bold">Por que esse oráculo é confiável?</h2><label htmlFor="rationale" className="mt-5 block max-w-[70ch] font-semibold">Justificativa e limites<textarea id="rationale" rows={6} maxLength={12000} className="mt-2 w-full rounded-lg border border-white/25 bg-[#101319] p-3 leading-7 text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint" value={rationale} onChange={event => setRationale(event.target.value)} /></label><p className="mt-2 max-w-[70ch] text-sm leading-6 text-[#AAB2BC]">Descreva como calculou o esperado, por que o teste superficial enganava e o que uma única massa não permite concluir. Mínimo de 30 caracteres.</p><button disabled={!ready} className={`${button} mt-5 bg-mint text-[#101319]`} onClick={download}>Exportar evidência .md</button><p className="mt-4 text-sm leading-7 text-[#C8CFD7]">Exportar não registra conclusão automática. <Link href="/mentoria/semanas/6#enviar" className="text-mint underline">Abrir entrega da semana 6</Link>.</p></section>
    <p role="status" aria-live="polite" className="min-h-6 text-sm text-mint">{notice}</p>
  </div>;
}

function Results({ results }: { results: CheckResult[] }) {
  return <div className="mt-5 grid gap-3 sm:grid-cols-2">{results.map(result => <article key={result.version} className={`rounded-lg border p-4 ${result.passed ? "border-mint/50" : "border-[#FF8F70]/60"}`}><p className="font-mono text-sm text-[#AAB2BC]">{result.version}</p><p className={`mt-2 text-lg font-bold ${result.passed ? "text-mint" : "text-[#FFAA91]"}`}>{result.passed ? "PASS" : "FAIL"}</p><p className="mt-2 text-sm leading-6 text-[#C8CFD7]">Saída: {money(result.actualCents)} · {result.message}.</p></article>)}</div>;
}
