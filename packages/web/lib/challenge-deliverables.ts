export type BugSeverity = "Baixa" | "Média" | "Alta" | "Crítica";

export type BugReport = {
  id: string;
  title: string;
  steps: string;
  actual: string;
  expected: string;
  severity: BugSeverity;
  evidence?: string;
};

export type BddScenario = {
  id: string;
  feature: string;
  title: string;
  given: string;
  when: string;
  then: string;
};

export type E2eCandidate = {
  id: string;
  flow: string;
  priority: "Baixa" | "Média" | "Alta";
  decision: "Automatizar" | "Manter manual";
  reason: string;
  assertions: string;
};

export type ChallengeDeliverables = {
  bugs: BugReport[];
  bdd: BddScenario[];
  e2e: E2eCandidate[];
};

export const emptyDeliverables: ChallengeDeliverables = { bugs: [], bdd: [], e2e: [] };
export const DELIVERABLES_KEY = "qa-lab-expenseflow-deliverables-v1";

export function parseDeliverables(value: string | null): ChallengeDeliverables {
  if (!value) return emptyDeliverables;
  try {
    const parsed = JSON.parse(value) as Partial<ChallengeDeliverables>;
    return {
      bugs: Array.isArray(parsed.bugs) ? parsed.bugs : [],
      bdd: Array.isArray(parsed.bdd) ? parsed.bdd : [],
      e2e: Array.isArray(parsed.e2e) ? parsed.e2e : [],
    };
  } catch {
    return emptyDeliverables;
  }
}

export function countCompletedStages(value: ChallengeDeliverables) {
  return [value.bugs.length, value.bdd.length, value.e2e.length].filter((count) => count > 0).length;
}

export type ChallengeCheck = { label: string; done: boolean; detail: string };

/** Single source of truth for "is the challenge complete?" — used by the
 *  conclusion screen and the challenge stepper so they never drift apart. */
export function challengeChecklist(value: ChallengeDeliverables): ChallengeCheck[] {
  const bugsWithEvidence = value.bugs.filter((bug) => Boolean(bug.evidence?.trim())).length;
  const hasManualDecision = value.e2e.some((item) => item.decision === "Manter manual");
  return [
    { label: "Encontrei pelo menos 5 bugs", done: value.bugs.length >= 5, detail: `${value.bugs.length}/5` },
    { label: "Documentei evidência em todos os bugs", done: value.bugs.length > 0 && bugsWithEvidence === value.bugs.length, detail: `${bugsWithEvidence}/${value.bugs.length}` },
    { label: "Transformei riscos em cenários BDD", done: value.bdd.length > 0, detail: `${value.bdd.length} cenário(s)` },
    { label: "Defini o que automatizar em E2E", done: value.e2e.length > 0, detail: `${value.e2e.length} decisão(ões)` },
    { label: "Justifiquei ao menos uma decisão manual", done: hasManualDecision, detail: hasManualDecision ? "feito" : "pendente" },
  ];
}

export function isChallengeReady(value: ChallengeDeliverables): boolean {
  return challengeChecklist(value).every((check) => check.done);
}

export function countDeliverables(value: ChallengeDeliverables) {
  return value.bugs.length + value.bdd.length + value.e2e.length;
}

export function exportDeliverables(value: ChallengeDeliverables) {
  const bugReports = value.bugs.length
    ? value.bugs.map((bug, index) => `## BUG-${String(index + 1).padStart(3, "0")} — ${bug.title}\n\n- **Severidade:** ${bug.severity}\n- **Evidência:** ${bug.evidence || "Não informada"}\n\n### Passos para reproduzir\n${bug.steps}\n\n### Resultado atual\n${bug.actual}\n\n### Resultado esperado\n${bug.expected}`).join("\n\n---\n\n")
    : "Nenhum bug report registrado.";
  const bdd = value.bdd.length
    ? value.bdd.map((scenario) => `Funcionalidade: ${scenario.feature}\n\n  Cenário: ${scenario.title}\n    Dado ${scenario.given}\n    Quando ${scenario.when}\n    Então ${scenario.then}`).join("\n\n")
    : "# Nenhum cenário BDD registrado.";
  const e2e = value.e2e.length
    ? value.e2e.map((item) => `## ${item.flow}\n\n- **Prioridade:** ${item.priority}\n- **Decisão:** ${item.decision}\n- **Justificativa:** ${item.reason}\n- **Validações:** ${item.assertions}`).join("\n\n---\n\n")
    : "Nenhuma decisão E2E registrada.";
  return {
    bugReports: `# Bug reports — ExpenseFlow\n\n${bugReports}\n`,
    bdd: `# language: pt\n\n${bdd}\n`,
    e2e: `# Estratégia E2E — ExpenseFlow\n\n${e2e}\n`,
  };
}
