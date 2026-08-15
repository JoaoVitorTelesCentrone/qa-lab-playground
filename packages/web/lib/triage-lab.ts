export type TriageSeverity = "baixa" | "media" | "alta" | "critica";
export type TriagePriority = "p3" | "p2" | "p1" | "p0";
export type TriageDecision = "corrigir_agora" | "planejar_sprint" | "monitorar" | "fechar_invalido";

export type TriageCase = {
  id: string;
  title: string;
  report: string;
  productArea: string;
  customerImpact: string;
  reproduction: string;
  evidence: string[];
  expectedSeverity: TriageSeverity;
  expectedPriority: TriagePriority;
  expectedDecision: TriageDecision;
  tags: string[];
};

export type TriageReview = {
  severity: TriageSeverity;
  priority: TriagePriority;
  decision: TriageDecision;
  owner: string;
  rationale: string;
  nextStep: string;
};

const areas = ["checkout", "reembolso", "login", "relatorios", "permissoes", "notificacoes", "exportacao", "pagamentos", "perfil", "auditoria"];
const impacts = [
  "bloqueia usuarios pagantes no fluxo principal",
  "gera dado financeiro incorreto para fechamento",
  "afeta poucos usuarios com contorno simples",
  "expoe informacao de outro cliente",
  "causa retrabalho operacional diario",
  "interrompe notificacao importante, mas nao bloqueia acao",
];
const reproductions = ["100% em producao", "intermitente em horario de pico", "somente em contas com permissao especial", "reproduzido em staging com massa especifica", "nao reproduzido ainda", "100% no navegador mobile"];
const titles = ["total divergente", "status incorreto", "permissao ignorada", "duplicidade", "falha de validacao", "timeout", "exportacao vazia", "mensagem enganosa", "filtro inconsistente", "erro de arredondamento"];

function pick<T>(items: T[], index: number) { return items[index % items.length]; }

function expected(index: number): Pick<TriageCase, "expectedSeverity" | "expectedPriority" | "expectedDecision"> {
  if (index % 11 === 0) return { expectedSeverity: "critica", expectedPriority: "p0", expectedDecision: "corrigir_agora" };
  if (index % 5 === 0) return { expectedSeverity: "alta", expectedPriority: "p1", expectedDecision: "corrigir_agora" };
  if (index % 3 === 0) return { expectedSeverity: "media", expectedPriority: "p2", expectedDecision: "planejar_sprint" };
  return { expectedSeverity: "baixa", expectedPriority: "p3", expectedDecision: "monitorar" };
}

export const triageCases: TriageCase[] = Array.from({ length: 180 }, (_, index) => {
  const area = pick(areas, index);
  const exp = expected(index);
  return {
    id: `TRI-${String(index + 1).padStart(3, "0")}`,
    title: `${area}: ${pick(titles, index)} no fluxo`,
    report: `Usuario relata ${pick(titles, index)} ao usar ${area}. O comportamento foi observado ${pick(reproductions, index)} e ainda nao ha decisao de prioridade alinhada com produto.`,
    productArea: area,
    customerImpact: pick(impacts, index),
    reproduction: pick(reproductions, index),
    evidence: [`print_${index + 1}.png`, `log correlation id ${10000 + index}`, index % 2 === 0 ? "relato do suporte" : "video curto do fluxo"],
    tags: [area, exp.expectedPriority, exp.expectedSeverity],
    ...exp,
  };
});

const severityRank: Record<TriageSeverity, number> = { baixa: 1, media: 2, alta: 3, critica: 4 };
const priorityRank: Record<TriagePriority, number> = { p3: 1, p2: 2, p1: 3, p0: 4 };

export function getTriageCase(id: string) { return triageCases.find((item) => item.id === id) ?? null; }

export function scoreTriageReview(testCase: TriageCase, review: TriageReview) {
  let score = 0;
  if (review.severity === testCase.expectedSeverity) score += 20;
  else if (Math.abs(severityRank[review.severity] - severityRank[testCase.expectedSeverity]) === 1) score += 10;
  if (review.priority === testCase.expectedPriority) score += 20;
  else if (Math.abs(priorityRank[review.priority] - priorityRank[testCase.expectedPriority]) === 1) score += 10;
  if (review.decision === testCase.expectedDecision) score += 20;
  if (review.owner.trim().length >= 3) score += 10;
  if (review.nextStep.trim().length >= 20) score += 10;
  if (review.rationale.trim().length >= 120) score += 20;
  return { score: Math.min(100, score), ready: score >= 70, expected: { severity: testCase.expectedSeverity, priority: testCase.expectedPriority, decision: testCase.expectedDecision } };
}

export function buildTriageDraft(testCase: TriageCase, review: TriageReview) {
  const result = scoreTriageReview(testCase, review);
  return {
    title: `Triagem - ${testCase.id} - ${testCase.title}`.slice(0, 120),
    content: [
      `# Triagem ${testCase.id}`,
      "",
      `**Area:** ${testCase.productArea}`,
      `**Score:** ${result.score}/100`,
      `**Severidade:** ${review.severity}`,
      `**Prioridade:** ${review.priority}`,
      `**Decisao:** ${review.decision}`,
      `**Dono:** ${review.owner}`,
      "",
      "## Report original",
      testCase.report,
      "",
      "## Impacto e evidencia",
      `Impacto: ${testCase.customerImpact}`,
      `Reproducao: ${testCase.reproduction}`,
      ...testCase.evidence.map((item) => `- ${item}`),
      "",
      "## Justificativa",
      review.rationale,
      "",
      "## Proximo passo",
      review.nextStep,
    ].join("\n"),
  };
}