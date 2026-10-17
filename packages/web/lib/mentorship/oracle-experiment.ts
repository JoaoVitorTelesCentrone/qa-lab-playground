export type ReportVersion = "reference" | "defective";

export const oracleExperiment = {
  id: "business-oracle",
  version: "1.0",
  rubricVersion: "1.0",
  seed: "approved-expenses-01",
  expenses: [
    { id: "D-101", status: "approved", cents: 12000 },
    { id: "D-102", status: "approved", cents: 9550 },
    { id: "D-103", status: "rejected", cents: 6000 },
    { id: "D-104", status: "approved", cents: 6575 },
  ],
} as const;

export type CheckResult = { version: ReportVersion; passed: boolean; actualCents: number; message: string };

export function generateApprovedReport(version: ReportVersion) {
  const rows = version === "reference" ? oracleExperiment.expenses.filter(item => item.status === "approved") : oracleExperiment.expenses;
  return { title: "Despesas aprovadas", totalCents: rows.reduce((total, item) => total + item.cents, 0), generated: true };
}

export function runWeakCheck(): CheckResult[] {
  return (["reference", "defective"] as const).map(version => {
    const report = generateApprovedReport(version);
    return { version, passed: report.generated && report.title.length > 0, actualCents: report.totalCents, message: "o relatório abriu e exibiu um título" };
  });
}

export function runBusinessCheck(expectedCents: number): CheckResult[] {
  if (!Number.isInteger(expectedCents) || expectedCents < 0) throw new Error("O valor esperado deve ser informado em centavos inteiros.");
  return (["reference", "defective"] as const).map(version => {
    const report = generateApprovedReport(version);
    return { version, passed: report.totalCents === expectedCents, actualCents: report.totalCents, message: report.totalCents === expectedCents ? "total igual ao oráculo independente" : "total diferente do oráculo independente" };
  });
}

export function parseMoneyToCents(raw: string) {
  const compact = raw.trim().replace(/\s/g, "").replace(/^R\$/i, "");
  const normalized = compact.includes(",") ? compact.replace(/\./g, "").replace(",", ".") : compact;
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const cents = Math.round(Number(normalized) * 100);
  return Number.isSafeInteger(cents) ? cents : null;
}

export function hasDiscriminatingOracle(results: CheckResult[] | null, expectedCents: number | null) {
  return Boolean(expectedCents === 28125 && results?.find(item => item.version === "reference")?.passed && !results?.find(item => item.version === "defective")?.passed);
}

export function exportOracleMarkdown(expectedCents: number, rationale: string, strongResults: CheckResult[]) {
  if (!hasDiscriminatingOracle(strongResults, expectedCents) || rationale.trim().length < 30) throw new Error("Execute um oráculo válido e explique a decisão antes de exportar.");
  const money = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
  return [
    "# Experimento: o teste verde que não encontra o defeito", "",
    `Lab: ${oracleExperiment.id} | Cenário: ${oracleExperiment.version} | Rubrica: ${oracleExperiment.rubricVersion} | Seed: ${oracleExperiment.seed}`, "",
    "Adaptação didática executada sobre dados sintéticos. O resultado não é evidência de desempenho em produção nem replicação integral de artigo.", "",
    "## Massa de teste", ...oracleExperiment.expenses.map(item => `- ${item.id}: ${item.status}, ${money(item.cents)}`), "",
    "## Teste superficial", ...runWeakCheck().map(item => `- ${item.version}: PASS — ${item.message}; saída observada ${money(item.actualCents)}`), "",
    `## Oráculo de negócio\nEsperado calculado independentemente: ${money(expectedCents)}`,
    ...strongResults.map(item => `- ${item.version}: ${item.passed ? "PASS" : "FAIL"} — observado ${money(item.actualCents)}; ${item.message}`), "",
    "## Justificativa e limites", rationale.trim(), "",
    "## Critérios para revisão do mentor", "- O esperado deriva somente das despesas aprovadas e não reutiliza a função testada.", "- A referência passa e a variante defeituosa falha pelo total incorreto.", "- A justificativa distingue presença da tela de correção do comportamento.", "- O relato limita sua conclusão a este cenário e seed.", "",
  ].join("\n");
}
