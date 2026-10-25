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
