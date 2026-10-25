export type ReportVersion = "reference" | "defective";

export const oracleExperiment = {
  id: "business-oracle",
  version: "2.0",
  rubricVersion: "1.0",
  seed: "broto-completed-actions-01",
  actions: [
    { id: "A-101", status: "completed" },
    { id: "A-102", status: "completed" },
    { id: "A-103", status: "pending" },
    { id: "A-104", status: "completed" },
  ],
} as const;

export type CheckResult = { version: ReportVersion; passed: boolean; actualCount: number; message: string };

/** Simulação local inspirada no crescimento do BrotoSpace, sem chamadas ao produto. */
export function generateCompletedReport(version: ReportVersion) {
  const rows = version === "reference" ? oracleExperiment.actions.filter(item => item.status === "completed") : oracleExperiment.actions;
  return { title: "Ações concluídas", completedCount: rows.length, generated: true };
}

export function runWeakCheck(): CheckResult[] {
  return (["reference", "defective"] as const).map(version => {
    const report = generateCompletedReport(version);
    return { version, passed: report.generated && report.title.length > 0, actualCount: report.completedCount, message: "o resumo abriu e exibiu um título" };
  });
}

export function runBusinessCheck(expectedCount: number): CheckResult[] {
  if (!Number.isSafeInteger(expectedCount) || expectedCount < 0) throw new Error("Informe uma quantidade inteira e não negativa de ações concluídas.");
  return (["reference", "defective"] as const).map(version => {
    const report = generateCompletedReport(version);
    return { version, passed: report.completedCount === expectedCount, actualCount: report.completedCount, message: report.completedCount === expectedCount ? "contagem igual ao oráculo independente" : "contagem diferente do oráculo independente" };
  });
}

export function parseActionCount(raw: string) {
  const value = raw.trim();
  if (!/^\d+$/.test(value)) return null;
  const count = Number(value);
  return Number.isSafeInteger(count) ? count : null;
}

export function hasDiscriminatingOracle(results: CheckResult[] | null, expectedCount: number | null) {
  return Boolean(expectedCount === 3 && results?.find(item => item.version === "reference")?.passed && !results?.find(item => item.version === "defective")?.passed);
}

export function exportOracleMarkdown(expectedCount: number, rationale: string, strongResults: CheckResult[]) {
  if (!hasDiscriminatingOracle(strongResults, expectedCount) || rationale.trim().length < 30) throw new Error("Execute um oráculo válido e explique a decisão antes de exportar.");
  return [
    "# Experimento: o teste verde que não encontra o defeito", "",
    `Lab: ${oracleExperiment.id} | Cenário: ${oracleExperiment.version} | Rubrica: ${oracleExperiment.rubricVersion} | Seed: ${oracleExperiment.seed}`, "",
    "Simulação local inspirada no crescimento do BrotoSpace. Os estados pertencem ao exercício; não representam execução no produto nem replicação integral de artigo.", "",
    "## Massa de teste", ...oracleExperiment.actions.map(item => `- ${item.id}: ${item.status === "completed" ? "concluída" : "pendente"}`), "",
    "## Teste superficial", ...runWeakCheck().map(item => `- ${item.version}: PASS — ${item.message}; saída observada ${item.actualCount} ações`), "",
    `## Oráculo de negócio\nEsperado calculado independentemente: ${expectedCount} ações concluídas`,
    ...strongResults.map(item => `- ${item.version}: ${item.passed ? "PASS" : "FAIL"} — observado ${item.actualCount} ações; ${item.message}`), "",
    "## Justificativa e limites", rationale.trim(), "",
    "## Critérios para revisão do mentor", "- O esperado considera somente ações concluídas e não reutiliza a função testada.", "- A referência passa e a variante defeituosa falha pela contagem incorreta.", "- A justificativa distingue presença da tela de correção do comportamento.", "- O relato limita sua conclusão a este cenário e seed.", "",
  ].join("\n");
}
