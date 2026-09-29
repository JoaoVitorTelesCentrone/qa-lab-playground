// Avaliação automática da entrega de um Lab.
//
// Mesma função no formulário e na API: o cliente usa para dar feedback antes
// do envio, o servidor usa para decidir se a evidência entra. Nenhuma regra
// mora só no navegador — a API é quem realmente barra.
//
// A entrega é um campo livre. O aluno escreve como quiser e anexa o que quiser;
// a única regra é que exista substância. Um anexo sozinho vale como entrega
// (um vídeo de repro é evidência legítima), mas texto vazio + zero anexo não.

export const MIN_LENGTH = 20;

export type EvidenceDraft = {
  evidence: string;
  /** Quantos arquivos vieram junto. Só a contagem importa para avaliar. */
  attachments: number;
};

export type EvaluationIssue = { field: "evidence"; message: string };

export type Evaluation = {
  passed: boolean;
  issues: EvaluationIssue[];
};

export type Lab101Feedback = {
  mainFindings: number;
  found: Array<"duplicado" | "fora-do-periodo" | "categoria-incorreta" | "valor-negativo">;
  message: string;
};

export function evaluateEvidence(draft: EvidenceDraft): Evaluation {
  const issues: EvaluationIssue[] = [];
  const text = draft.evidence.trim();

  if (text.length === 0 && draft.attachments === 0) {
    issues.push({ field: "evidence", message: "Escreva a evidência ou anexe um arquivo." });
  } else if (text.length > 0 && text.length < MIN_LENGTH && draft.attachments === 0) {
    // Texto curto passa quando vem com anexo: a prova está no arquivo, e
    // exigir redação em cima de um vídeo de reprodução só cria burocracia.
    issues.push({ field: "evidence", message: `Descreva a evidência com pelo menos ${MIN_LENGTH} caracteres ou anexe um arquivo.` });
  }

  return { passed: issues.length === 0, issues };
}

/**
 * Feedback pedagógico específico do Lab 01. Não é um corretor rígido: o aluno
 * pode comprovar um achado por caminhos diferentes e ainda publicar o case.
 * Os três problemas principais geram o retorno positivo; o valor negativo é
 * um caso de borda opcional, portanto sua ausência jamais bloqueia a entrega.
 */
export function evaluateLab101Evidence(evidence: string): Lab101Feedback {
  const text = evidence.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const found: Lab101Feedback["found"] = [];
  const has = (...terms: string[]) => terms.some((term) => text.includes(term));

  if (has("duplic", "#004", "#011", "consultoria")) found.push("duplicado");
  if (has("fora do periodo", "fevereiro", "#009", "2024-02")) found.push("fora-do-periodo");
  if (has("categoria", "manutencao do carro", "#007", "tipo incorreto")) found.push("categoria-incorreta");
  if (has("negativ", "reembolso", "#012")) found.push("valor-negativo");

  const mainFindings = found.filter((item) => item !== "valor-negativo").length;
  if (mainFindings >= 3) {
    return { mainFindings, found, message: "Ótima investigação: você identificou os três problemas principais do Lab 01. O caso de valor negativo é uma borda opcional e não reduz sua conclusão." };
  }
  return { mainFindings, found, message: `Evidência salva. Você documentou ${mainFindings} dos 3 achados principais reconhecidos automaticamente; revise a massa e complemente o case se encontrar mais evidências.` };
}
