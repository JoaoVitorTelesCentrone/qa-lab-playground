export type AcceptanceItem = {
  id: string;
  title: string;
  messyStory: string;
  domain: string;
  persona: string;
  businessRule: string;
  hiddenRisks: string[];
  mustCover: string[];
};

export type AcceptanceSubmission = {
  criteria: string;
  examples: string;
  edgeCases: string;
  questions: string;
  notes: string;
};

const domains = ["ExpenseFlow", "Conta digital", "Marketplace", "Agenda medica", "CRM", "Assinaturas", "Help desk", "Logistica", "Checkout", "Portal educacional"];
const personas = ["colaborador", "gestor", "cliente", "analista financeiro", "operador", "administrador", "suporte", "vendedor"];
const goals = ["aprovar solicitacoes", "filtrar resultados", "cancelar pedidos", "exportar relatorios", "receber notificacoes", "alterar permissoes", "reabrir chamados", "comparar historico", "validar pagamento", "anexar comprovantes"];
const rules = [
  "somente usuarios autorizados podem concluir a acao",
  "datas finais nao podem ser anteriores as iniciais",
  "valores monetarios precisam preservar duas casas decimais",
  "acoes irreversiveis exigem confirmacao explicita",
  "dados sensiveis nao podem aparecer para perfis sem permissao",
  "mudancas de status devem gerar auditoria",
];
const risks = ["permissao", "estado invalido", "duplicidade", "timezone", "mensagem de erro", "auditoria", "limite de valor", "concorrencia"];

function pick<T>(items: T[], index: number) { return items[index % items.length]; }

export const acceptanceItems: AcceptanceItem[] = Array.from({ length: 180 }, (_, index) => {
  const domain = pick(domains, index);
  const persona = pick(personas, index * 2);
  const goal = pick(goals, index * 3);
  const businessRule = pick(rules, index * 5);
  return {
    id: `AC-${String(index + 1).padStart(3, "0")}`,
    title: `${goal} no ${domain}`,
    messyStory: `Como ${persona}, quero ${goal} no ${domain} para melhorar o processo. Tem que funcionar certinho, ser simples e tratar os casos importantes.`,
    domain,
    persona,
    businessRule,
    hiddenRisks: [pick(risks, index), pick(risks, index + 3), pick(risks, index + 5)],
    mustCover: ["fluxo principal", "validacao negativa", "permissao ou perfil", "mensagem/feedback", "estado de borda"],
  };
});

export function getAcceptanceItem(id: string) { return acceptanceItems.find((item) => item.id === id) ?? null; }

function lines(value: string) { return value.split("\n").map((line) => line.trim()).filter(Boolean); }
function hasKeyword(value: string, keywords: string[]) { const lower = value.toLowerCase(); return keywords.some((keyword) => lower.includes(keyword)); }

export function scoreAcceptanceSubmission(item: AcceptanceItem, submission: AcceptanceSubmission) {
  const criteria = lines(submission.criteria);
  const examples = lines(submission.examples);
  const edgeCases = lines(submission.edgeCases);
  const questions = lines(submission.questions);
  let score = 0;
  score += Math.min(30, criteria.length * 8);
  score += Math.min(20, examples.length * 10);
  score += Math.min(15, edgeCases.length * 8);
  score += Math.min(10, questions.length * 5);
  if (hasKeyword(submission.criteria, ["dado", "quando", "entao", "então"])) score += 10;
  if (hasKeyword(`${submission.criteria}\n${submission.edgeCases}`, item.hiddenRisks)) score += 10;
  if (submission.notes.trim().length >= 80) score += 5;
  const missing = [
    criteria.length < 4 ? "ao menos 4 criterios" : null,
    examples.length < 2 ? "ao menos 2 exemplos" : null,
    edgeCases.length < 1 ? "ao menos 1 edge case" : null,
    questions.length < 1 ? "pergunta aberta" : null,
    !hasKeyword(submission.criteria, ["dado", "quando", "entao", "então"]) ? "criterios em formato verificavel" : null,
  ].filter((item): item is string => Boolean(item));
  return { score: Math.min(100, score), ready: score >= 75 && missing.length === 0, missing };
}

export function buildAcceptanceDraft(item: AcceptanceItem, submission: AcceptanceSubmission) {
  const result = scoreAcceptanceSubmission(item, submission);
  return {
    title: `Acceptance Criteria - ${item.id} - ${item.title}`.slice(0, 120),
    content: [
      `# Acceptance Criteria ${item.id}`,
      "",
      `**Dominio:** ${item.domain}`,
      `**Persona:** ${item.persona}`,
      `**Regra de negocio:** ${item.businessRule}`,
      `**Score:** ${result.score}/100`,
      "",
      "## Historia original",
      item.messyStory,
      "",
      "## Criterios de aceite",
      submission.criteria,
      "",
      "## Exemplos",
      submission.examples,
      "",
      "## Edge cases",
      submission.edgeCases,
      "",
      "## Perguntas abertas",
      submission.questions,
      "",
      "## Observacoes de QA",
      submission.notes,
    ].join("\n"),
  };
}