export type RefinementKind = "pbi" | "bug";
export type RefinementSeverity = "baixa" | "media" | "alta" | "critica";
export type RefinementItem = {
  id: string;
  kind: RefinementKind;
  title: string;
  body: string;
  domain: string;
  persona: string;
  risk: string;
  severity: RefinementSeverity;
  flaws: string[];
  expectedSignals: string[];
};

export type RefinementReview = {
  title: string;
  body: string;
  criteria: string;
  questions: string;
  clarity: number;
  testability: number;
  value: number;
  scope: number;
};

const domains = [
  "ExpenseFlow", "Conta digital", "Marketplace", "Agenda medica", "Portal educacional", "CRM comercial", "Logistica", "Assinaturas", "Checkout", "Backoffice financeiro", "App de entregas", "Help desk",
];
const personas = ["colaborador", "gestor", "analista financeiro", "cliente", "operador", "administrador", "suporte", "vendedor", "auditor", "professor"];
const pbiGoals = [
  "acompanhar o status", "corrigir informacoes", "receber notificacoes", "filtrar resultados", "exportar dados", "aprovar uma solicitacao", "cancelar uma operacao", "reabrir um atendimento", "configurar permissoes", "comparar historico",
];
const bugSymptoms = [
  "o total aparece errado", "o botao nao funciona", "a tela fica carregando", "o filtro some com registros", "o usuario recebe mensagem duplicada", "o sistema deixa aprovar sem permissao", "a exportacao vem vazia", "o status muda sozinho", "o anexo nao abre", "a busca retorna dados de outro cliente",
];
const flaws = [
  "sem valor de negocio", "sem regra de negocio", "sem criterio de aceite", "escopo grande demais", "ambiguidade de persona", "nao informa estados de erro", "sem dado de exemplo", "mistura solucao com problema", "nao define prioridade", "nao e reproduzivel",
];

function pick<T>(items: T[], index: number) {
  return items[index % items.length];
}

export const refinementItems: RefinementItem[] = Array.from({ length: 240 }, (_, index) => {
  const kind: RefinementKind = index % 3 === 0 ? "bug" : "pbi";
  const domain = pick(domains, index);
  const persona = pick(personas, index * 2 + 1);
  const severity = pick(["baixa", "media", "alta", "critica"] as const, index * 3);
  const selectedFlaws = [pick(flaws, index), pick(flaws, index + 3), pick(flaws, index + 7)];
  if (kind === "bug") {
    const symptom = pick(bugSymptoms, index);
    return {
      id: `BUG-${String(index + 1).padStart(3, "0")}`,
      kind,
      title: `${domain} com problema`,
      body: `${symptom}. Aconteceu algumas vezes e precisa arrumar logo porque esta ruim para o usuario.`,
      domain,
      persona,
      risk: `Risco de perda de confianca, decisao errada ou retrabalho no fluxo de ${domain}.`,
      severity,
      flaws: selectedFlaws,
      expectedSignals: ["passos de reproducao", "resultado atual", "resultado esperado", "impacto", "ambiente/dados usados"],
    };
  }
  const goal = pick(pbiGoals, index);
  return {
    id: `PBI-${String(index + 1).padStart(3, "0")}`,
    kind,
    title: `Melhorar ${goal}`,
    body: `Como ${persona}, quero ${goal} para facilitar meu trabalho no ${domain}. Deve ficar simples e bonito.`,
    domain,
    persona,
    risk: `Risco de construir uma solucao sem regra verificavel ou sem impacto claro para ${persona}.`,
    severity,
    flaws: selectedFlaws,
    expectedSignals: ["persona clara", "valor de negocio", "regra verificavel", "criterios de aceite", "fora de escopo", "perguntas abertas"],
  };
});

export function getRefinementItem(id: string) {
  return refinementItems.find((item) => item.id === id) ?? null;
}

export function scoreRefinement(review: RefinementReview) {
  const ratings = [review.clarity, review.testability, review.value, review.scope].map((value) => Math.max(0, Math.min(5, Number(value) || 0)));
  const criteriaLines = review.criteria.split("\n").map((line) => line.trim()).filter(Boolean);
  const questionLines = review.questions.split("\n").map((line) => line.trim()).filter(Boolean);
  const contentScore = [review.title.length >= 12, review.body.length >= 120, criteriaLines.length >= 3, questionLines.length >= 1].filter(Boolean).length * 5;
  const ratingScore = ratings.reduce((sum, value) => sum + value, 0) * 4;
  const score = Math.min(100, contentScore + ratingScore);
  return {
    score,
    ready: score >= 72 && criteriaLines.length >= 3 && review.body.length >= 120,
    criteriaCount: criteriaLines.length,
    questionsCount: questionLines.length,
    missing: [
      review.title.length < 12 ? "titulo especifico" : null,
      review.body.length < 120 ? "descricao refinada com contexto e valor" : null,
      criteriaLines.length < 3 ? "ao menos 3 criterios de aceite/verificacao" : null,
      questionLines.length < 1 ? "pergunta aberta para refinamento" : null,
    ].filter((item): item is string => Boolean(item)),
  };
}

export function buildRefinementDraft(item: RefinementItem, review: RefinementReview) {
  const result = scoreRefinement(review);
  return {
    title: `Refinamento - ${item.id} - ${review.title}`.slice(0, 120),
    content: [
      `# Refinamento ${item.id}`,
      "",
      `**Tipo:** ${item.kind === "pbi" ? "PBI" : "Bug"}`,
      `**Dominio:** ${item.domain}`,
      `**Risco:** ${item.risk}`,
      `**Score:** ${result.score}/100`,
      "",
      "## Item original",
      `### ${item.title}`,
      item.body,
      "",
      "## Problemas identificados",
      ...item.flaws.map((flaw) => `- ${flaw}`),
      "",
      "## Versao refinada",
      `### ${review.title}`,
      review.body,
      "",
      "## Criterios de aceite/verificacao",
      review.criteria,
      "",
      "## Perguntas abertas",
      review.questions,
      "",
      "## Autoavaliacao",
      `- Clareza: ${review.clarity}/5`,
      `- Testabilidade: ${review.testability}/5`,
      `- Valor: ${review.value}/5`,
      `- Escopo: ${review.scope}/5`,
    ].join("\n"),
  };
}