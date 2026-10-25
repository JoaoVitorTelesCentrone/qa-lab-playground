export type ActionRow = { id: string; status: "completed" | "pending" };
export type RegressionResult = { caseId: string; label: string; expectedCount: number; beforeCount: number; afterCount: number; beforePassed: boolean; afterPassed: boolean };

export const incidentExperiment = {
  id: "incident-to-regression",
  version: "2.0",
  rubricVersion: "1.0",
  seed: "broto-growth-incident-01",
  release: "2026.10.1",
  correlationId: "corr-broto-7f31",
  summary: "No cenário sintético inspirado no BrotoSpace, após a release 2026.10.1 o resumo de crescimento exibiu quatro ações concluídas. O histórico tem três concluídas e uma pendente.",
  logs: [
    "10:14:02 growth.request status=completed period=2026-10 correlation=corr-broto-7f31",
    "10:14:02 action.query completed=3 pending=1 rows=4 correlation=corr-broto-7f31",
    "10:14:02 growth.aggregate input_rows=4 completed_count=4 correlation=corr-broto-7f31",
    "10:14:02 growth.response status=200 correlation=corr-broto-7f31",
  ],
  hypotheses: [
    { id: "period", label: "O filtro de período ocultou uma ação concluída." },
    { id: "status-filter", label: "A contagem recebeu também uma ação pendente." },
    { id: "retry", label: "Um retry duplicou uma ação concluída." },
  ],
} as const;

const originalRows: ActionRow[] = [
  { id: "A-101", status: "completed" }, { id: "A-102", status: "completed" },
  { id: "A-103", status: "pending" }, { id: "A-104", status: "completed" },
];

const cases: Array<{ id: string; label: string; rows: ActionRow[] }> = [
  { id: "incident", label: "Incidente original", rows: originalRows },
  { id: "variation", label: "Variação: uma concluída e duas pendentes", rows: [{ id: "V-1", status: "completed" }, { id: "V-2", status: "pending" }, { id: "V-3", status: "pending" }] },
  { id: "countercase", label: "Contracaso: todas concluídas", rows: [{ id: "C-1", status: "completed" }, { id: "C-2", status: "completed" }] },
];

export function completedCount(rows: ActionRow[], version: "before-fix" | "after-fix") {
  return (version === "after-fix" ? rows.filter(row => row.status === "completed") : rows).length;
}

export function reproduceIncident() {
  return { expectedCount: completedCount(originalRows, "after-fix"), observedCount: completedCount(originalRows, "before-fix"), release: incidentExperiment.release, correlationId: incidentExperiment.correlationId };
}

export function runRegressionPack(): RegressionResult[] {
  return cases.map(item => {
    const expectedCount = item.rows.filter(row => row.status === "completed").length;
    const beforeCount = completedCount(item.rows, "before-fix");
    const afterCount = completedCount(item.rows, "after-fix");
    return { caseId: item.id, label: item.label, expectedCount, beforeCount, afterCount, beforePassed: beforeCount === expectedCount, afterPassed: afterCount === expectedCount };
  });
}

export function validatesRegression(results: RegressionResult[] | null) {
  return Boolean(results && results.length === 3 && results.every(item => item.afterPassed) && !results.find(item => item.caseId === "incident")?.beforePassed && !results.find(item => item.caseId === "variation")?.beforePassed && results.find(item => item.caseId === "countercase")?.beforePassed);
}

export function exportIncidentMarkdown(hypothesis: string, evidence: string, analysis: string, results: RegressionResult[]) {
  if (hypothesis !== "status-filter" || evidence.trim().length < 20 || analysis.trim().length < 30 || !validatesRegression(results)) throw new Error("Complete a cadeia de evidências e execute a regressão antes de exportar.");
  return [
    "# Experimento: do incidente ao teste que impede a volta", "",
    `Lab: ${incidentExperiment.id} | Cenário: ${incidentExperiment.version} | Rubrica: ${incidentExperiment.rubricVersion} | Seed: ${incidentExperiment.seed}`,
    `Release: ${incidentExperiment.release} | Correlação: ${incidentExperiment.correlationId}`, "",
    "Simulação local de crescimento inspirada no BrotoSpace, com ações, logs e versões sintéticos. Não representa um incidente real nem execução no produto externo.", "",
    "## Relato", incidentExperiment.summary, "", "## Logs", ...incidentExperiment.logs.map(log => `- ${log}`), "",
    "## Hipótese confirmada", "A contagem recebeu também uma ação pendente.", evidence.trim(), "",
    "## Execução da regressão", "Quantidades de ações concluídas:", "| Caso | Esperado | Antes | Resultado | Depois | Resultado |", "| --- | ---: | ---: | --- | ---: | --- |",
    ...results.map(item => `| ${item.label} | ${item.expectedCount} | ${item.beforeCount} | ${item.beforePassed ? "PASS" : "FAIL"} | ${item.afterCount} | ${item.afterPassed ? "PASS" : "FAIL"} |`), "",
    "## Análise e limites", analysis.trim(), "", "## Cadeia de revisão", "incidente → correlação → hipótese → reprodução → regressão falhando → correção → regressão passando → contracaso", "",
  ].join("\n");
}
