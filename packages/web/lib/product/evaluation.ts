// Avaliação automática da entrega de um Lab.
//
// Mesma função no formulário e na API: o cliente usa para dar feedback antes
// do envio, o servidor usa para decidir se a evidência entra. Nenhuma regra
// mora só no navegador — a API é quem realmente barra.

export const MIN_LENGTH = 20;
export const severities = ["baixa", "media", "alta", "critica"] as const;
export type Severity = (typeof severities)[number];

export type EvidenceDraft = {
  result: string;
  reproduction: string;
  severity: string;
  /** Critérios de aceite do Lab que o aluno marcou como atendidos. */
  checklist: string[];
};

export type EvaluationIssue = { field: "result" | "reproduction" | "severity" | "checklist"; message: string };

export type Evaluation = {
  passed: boolean;
  issues: EvaluationIssue[];
  /** Critérios de aceite ainda não marcados, na ordem do Lab. */
  missingCriteria: string[];
};

/**
 * `acceptance` são os critérios de aceite do Lab. A entrega só passa quando
 * todos estão marcados — é o que diferencia "concluí" de "cliquei em salvar".
 */
export function evaluateEvidence(draft: EvidenceDraft, acceptance: string[]): Evaluation {
  const issues: EvaluationIssue[] = [];

  if (draft.result.trim().length < MIN_LENGTH) issues.push({ field: "result", message: `Descreva o resultado obtido com pelo menos ${MIN_LENGTH} caracteres.` });
  if (draft.reproduction.trim().length < MIN_LENGTH) issues.push({ field: "reproduction", message: `Descreva os passos de reprodução com pelo menos ${MIN_LENGTH} caracteres.` });
  if (!(severities as readonly string[]).includes(draft.severity)) issues.push({ field: "severity", message: "Escolha a severidade." });

  const marked = new Set(draft.checklist);
  const missingCriteria = acceptance.filter((criterion) => !marked.has(criterion));
  if (missingCriteria.length > 0) issues.push({ field: "checklist", message: `Confirme os ${missingCriteria.length} critério(s) de aceite que faltam.` });

  return { passed: issues.length === 0, issues, missingCriteria };
}
