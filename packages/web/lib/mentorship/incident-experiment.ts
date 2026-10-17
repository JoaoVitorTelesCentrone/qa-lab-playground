export type ExpenseRow = { id: string; status: "approved" | "rejected"; cents: number };
export type RegressionResult = { caseId: string; label: string; expectedCents: number; beforeCents: number; afterCents: number; beforePassed: boolean; afterPassed: boolean };

export const incidentExperiment = {
  id: "incident-to-regression",
  version: "1.0",
  rubricVersion: "1.0",
  seed: "finance-incident-01",
  release: "2026.10.1",
  correlationId: "corr-fin-7f31",
  summary: "Após a release 2026.10.1, o relatório de despesas aprovadas exibiu R$ 341,25; a conferência financeira esperava R$ 281,25.",
  logs: [
    "10:14:02 report.request status=approved period=2026-10 correlation=corr-fin-7f31",
    "10:14:02 expense.query approved=3 rejected=1 rows=4 correlation=corr-fin-7f31",
    "10:14:02 report.aggregate input_rows=4 total_cents=34125 correlation=corr-fin-7f31",
    "10:14:02 report.response status=200 correlation=corr-fin-7f31",
  ],
  hypotheses: [
    { id: "rounding", label: "Arredondamento alterou os centavos." },
    { id: "status-filter", label: "A agregação recebeu também registros rejeitados." },
    { id: "retry", label: "Um retry duplicou uma despesa aprovada." },
  ],
} as const;

const originalRows: ExpenseRow[] = [
  { id: "D-101", status: "approved", cents: 12000 }, { id: "D-102", status: "approved", cents: 9550 },
  { id: "D-103", status: "rejected", cents: 6000 }, { id: "D-104", status: "approved", cents: 6575 },
];

const cases: Array<{ id: string; label: string; rows: ExpenseRow[] }> = [
  { id: "incident", label: "Incidente original", rows: originalRows },
  { id: "variation", label: "Outros valores com uma rejeitada", rows: [{ id: "V-1", status: "approved", cents: 4200 }, { id: "V-2", status: "rejected", cents: 9999 }, { id: "V-3", status: "approved", cents: 800 }] },
  { id: "countercase", label: "Contracaso: todos aprovados", rows: [{ id: "C-1", status: "approved", cents: 100 }, { id: "C-2", status: "approved", cents: 200 }] },
];

export function approvedTotal(rows: ExpenseRow[], version: "before-fix" | "after-fix") {
  const selected = version === "after-fix" ? rows.filter(row => row.status === "approved") : rows;
  return selected.reduce((total, row) => total + row.cents, 0);
}

export function reproduceIncident() {
  return { expectedCents: approvedTotal(originalRows, "after-fix"), observedCents: approvedTotal(originalRows, "before-fix"), release: incidentExperiment.release, correlationId: incidentExperiment.correlationId };
}

export function runRegressionPack(): RegressionResult[] {
  return cases.map(item => {
    const expectedCents = item.rows.filter(row => row.status === "approved").reduce((total, row) => total + row.cents, 0);
    const beforeCents = approvedTotal(item.rows, "before-fix");
    const afterCents = approvedTotal(item.rows, "after-fix");
    return { caseId: item.id, label: item.label, expectedCents, beforeCents, afterCents, beforePassed: beforeCents === expectedCents, afterPassed: afterCents === expectedCents };
  });
}

export function validatesRegression(results: RegressionResult[] | null) {
  return Boolean(results && results.length === 3 && results.every(item => item.afterPassed) && !results.find(item => item.caseId === "incident")?.beforePassed && !results.find(item => item.caseId === "variation")?.beforePassed && results.find(item => item.caseId === "countercase")?.beforePassed);
}

export function exportIncidentMarkdown(hypothesis: string, evidence: string, analysis: string, results: RegressionResult[]) {
  if (hypothesis !== "status-filter" || evidence.trim().length < 20 || analysis.trim().length < 30 || !validatesRegression(results)) throw new Error("Complete a cadeia de evidências e execute a regressão antes de exportar.");
  const money = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
  return [
    "# Experimento: do incidente ao teste que impede a volta", "",
    `Lab: ${incidentExperiment.id} | Cenário: ${incidentExperiment.version} | Rubrica: ${incidentExperiment.rubricVersion} | Seed: ${incidentExperiment.seed}`,
    `Release: ${incidentExperiment.release} | Correlação: ${incidentExperiment.correlationId}`, "",
    "Adaptação didática executada sobre incidente, logs e versões sintéticas. Não representa um incidente de produção nem prova redução futura de recorrência.", "",
    "## Relato", incidentExperiment.summary, "", "## Logs", ...incidentExperiment.logs.map(log => `- ${log}`), "",
    "## Hipótese confirmada", "A agregação recebeu também registros rejeitados.", evidence.trim(), "",
    "## Execução da regressão", "| Caso | Esperado | Antes | Resultado | Depois | Resultado |", "| --- | ---: | ---: | --- | ---: | --- |",
    ...results.map(item => `| ${item.label} | ${money(item.expectedCents)} | ${money(item.beforeCents)} | ${item.beforePassed ? "PASS" : "FAIL"} | ${money(item.afterCents)} | ${item.afterPassed ? "PASS" : "FAIL"} |`), "",
    "## Análise e limites", analysis.trim(), "", "## Cadeia de revisão", "incidente → correlação → hipótese → reprodução → regressão falhando → correção → regressão passando → contracaso", "",
  ].join("\n");
}
