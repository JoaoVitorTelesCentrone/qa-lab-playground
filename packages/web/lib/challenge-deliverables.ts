export type BugSeverity = "Baixa" | "Média" | "Alta" | "Crítica";

export type BugReport = { id: string; title: string; steps: string; actual: string; expected: string; severity: BugSeverity; evidence?: string };
export type BddScenario = { id: string; feature: string; title: string; given: string; when: string; then: string };
export type E2eCandidate = { id: string; flow: string; priority: "Baixa" | "Média" | "Alta"; decision: "Automatizar" | "Manter manual"; reason: string; assertions: string };

export type CiGateName = "Lint" | "Testes unitários" | "Integração/API" | "E2E crítico" | "Acessibilidade";
export type CiGateStatus = "passed" | "failed" | "not-run";
export type ReleaseDecision = {
  decision: "Liberar" | "Liberar com ressalvas" | "Bloquear";
  rationale: string;
  residualRisk: string;
  monitoring: string;
  gates: Record<CiGateName, CiGateStatus>;
};

export const ciGates: CiGateName[] = ["Lint", "Testes unitários", "Integração/API", "E2E crítico", "Acessibilidade"];
export type ChallengeDeliverables = { bugs: BugReport[]; bdd: BddScenario[]; e2e: E2eCandidate[]; release?: ReleaseDecision | null };
export const emptyDeliverables: ChallengeDeliverables = { bugs: [], bdd: [], e2e: [], release: null };
export const DELIVERABLES_KEY = "qa-lab-expenseflow-deliverables-v1";

export function parseDeliverables(value: string | null): ChallengeDeliverables {
  if (!value) return emptyDeliverables;
  try {
    const parsed = JSON.parse(value) as Partial<ChallengeDeliverables>;
    return {
      bugs: Array.isArray(parsed.bugs) ? parsed.bugs : [],
      bdd: Array.isArray(parsed.bdd) ? parsed.bdd : [],
      e2e: Array.isArray(parsed.e2e) ? parsed.e2e : [],
      release: parsed.release && typeof parsed.release === "object" ? parsed.release as ReleaseDecision : null,
    };
  } catch { return emptyDeliverables; }
}

export function countCompletedStages(value: ChallengeDeliverables) {
  return [value.bugs.length, value.bdd.length, value.e2e.length, value.release ? 1 : 0].filter((count) => count > 0).length;
}

export type ChallengeCheck = { label: string; done: boolean; detail: string };
export function challengeChecklist(value: ChallengeDeliverables): ChallengeCheck[] {
  const bugsWithEvidence = value.bugs.filter((bug) => Boolean(bug.evidence?.trim())).length;
  const hasManualDecision = value.e2e.some((item) => item.decision === "Manter manual");
  const gatesExecuted = value.release ? Object.values(value.release.gates).filter((status) => status !== "not-run").length : 0;
  const releaseHasEvidence = Boolean(value.release && value.release.rationale.trim().length >= 80 && value.release.residualRisk.trim() && value.release.monitoring.trim());
  return [
    { label: "Encontrei pelo menos 5 bugs", done: value.bugs.length >= 5, detail: `${value.bugs.length}/5` },
    { label: "Documentei evidência em todos os bugs", done: value.bugs.length > 0 && bugsWithEvidence === value.bugs.length, detail: `${bugsWithEvidence}/${value.bugs.length}` },
    { label: "Transformei riscos em cenários BDD", done: value.bdd.length > 0, detail: `${value.bdd.length} cenário(s)` },
    { label: "Defini o que automatizar em E2E", done: value.e2e.length > 0, detail: `${value.e2e.length} decisão(ões)` },
    { label: "Justifiquei ao menos uma decisão manual", done: hasManualDecision, detail: hasManualDecision ? "feito" : "pendente" },
    { label: "Registrei os gates de CI", done: gatesExecuted === ciGates.length, detail: `${gatesExecuted}/${ciGates.length} executados` },
    { label: "Tomei uma decisão de release com risco residual", done: releaseHasEvidence, detail: releaseHasEvidence ? value.release!.decision : "pendente" },
  ];
}

export function isChallengeReady(value: ChallengeDeliverables) { return challengeChecklist(value).every((check) => check.done); }
export function countDeliverables(value: ChallengeDeliverables) { return value.bugs.length + value.bdd.length + value.e2e.length + (value.release ? 1 : 0); }

export function exportDeliverables(value: ChallengeDeliverables) {
  const bugReports = value.bugs.length ? value.bugs.map((bug, index) => `## BUG-${String(index + 1).padStart(3, "0")} — ${bug.title}\n\n- **Severidade:** ${bug.severity}\n- **Evidência:** ${bug.evidence || "Não informada"}\n\n### Passos para reproduzir\n${bug.steps}\n\n### Resultado atual\n${bug.actual}\n\n### Resultado esperado\n${bug.expected}`).join("\n\n---\n\n") : "Nenhum bug report registrado.";
  const bdd = value.bdd.length ? value.bdd.map((scenario) => `Funcionalidade: ${scenario.feature}\n\n  Cenário: ${scenario.title}\n    Dado ${scenario.given}\n    Quando ${scenario.when}\n    Então ${scenario.then}`).join("\n\n") : "# Nenhum cenário BDD registrado.";
  const e2e = value.e2e.length ? value.e2e.map((item) => `## ${item.flow}\n\n- **Prioridade:** ${item.priority}\n- **Decisão:** ${item.decision}\n- **Justificativa:** ${item.reason}\n- **Validações:** ${item.assertions}`).join("\n\n---\n\n") : "Nenhuma decisão E2E registrada.";
  const release = value.release ? `# Decisão de release — ExpenseFlow\n\n- **Decisão:** ${value.release.decision}\n- **Gates:**\n${ciGates.map((gate) => `  - ${gate}: ${value.release!.gates[gate]}`).join("\n")}\n\n## Justificativa\n${value.release.rationale}\n\n## Risco residual\n${value.release.residualRisk}\n\n## Monitoramento após release\n${value.release.monitoring}\n` : "# Decisão de release\n\nNenhuma decisão registrada.";
  return { bugReports: `# Bug reports — ExpenseFlow\n\n${bugReports}\n`, bdd: `# language: pt\n\n${bdd}\n`, e2e: `# Estratégia E2E — ExpenseFlow\n\n${e2e}\n`, release };
}
