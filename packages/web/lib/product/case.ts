// Case de QA: a entrega de um Lab virada em artefato de portfólio.
//
// Uma evidência crua ("resultado + passos + severidade") não é portfólio —
// quem lê no LinkedIn não sabe o que era o sistema, o que estava em risco nem
// o que a pessoa validou. O case junta a evidência ao briefing do Lab e
// produz três coisas: a página pública, o resumo de capa e o texto do post.
//
// Módulo puro: nenhuma leitura de banco aqui. A página pública e o painel
// logado renderizam o mesmo modelo, então o que o aluno revisa antes de
// publicar é exatamente o que o recrutador abre.

import type { SystemChallenge } from "@/lib/system-challenges";
import { labLabel, type Lab } from "@/lib/playground/catalog";
import type { Severity } from "./evaluation";
import type { Submission } from "./journey";
import { reproductionSteps, summarize } from "./portfolio-format";

export const severityLabels: Record<Severity, string> = { baixa: "Baixa", media: "Média", alta: "Alta", critica: "Crítica" };

export type QaCase = {
  submission: Submission;
  /** Número de catálogo — só para montar a rota /labs/[number]. */
  labNumber: number;
  /** O número que o aluno lê ("01"), pela ordem de lançamento. */
  label: string;
  labSlug: string;
  title: string;
  area: string;
  /** "fluxo" valida o caminho feliz; "investigacao" caça o defeito plantado. */
  mode: SystemChallenge["mode"];
  /** A superfície testada — vira o bloco "ambiente" da evidência. */
  route: string;
  difficulty: SystemChallenge["difficulty"];
  objective: string;
  /** O oráculo do Lab: o comportamento esperado contra o qual a evidência foi julgada. */
  expected: string;
  steps: string[];
  criteria: string[];
  severity: Severity;
  createdAt: string;
};

/** Junta evidência e briefing. Devolve null quando o Lab saiu do catálogo. */
export function buildCase(submission: Submission, lab: Lab | undefined, challenge: SystemChallenge | undefined): QaCase | null {
  if (!lab || !challenge) return null;
  return {
    submission,
    labNumber: lab.number,
    label: labLabel(lab),
    labSlug: lab.slug,
    title: lab.title,
    area: challenge.area,
    mode: challenge.mode,
    route: challenge.route,
    difficulty: challenge.difficulty,
    objective: challenge.objective,
    expected: challenge.expected,
    steps: reproductionSteps(submission.reproduction),
    criteria: submission.checklist,
    severity: submission.severity,
    createdAt: submission.createdAt,
  };
}

/**
 * As competências que o case comprova. Não é uma lista genérica de skills: cada
 * item só entra se houver evidência dele na entrega, porque a graça do
 * portfólio é o que a pessoa fez, não o que ela diz saber.
 */
export function caseSkills(item: QaCase): string[] {
  const skills = ["Documentação de evidência", "Classificação de severidade"];
  if (item.mode === "investigacao") skills.push("Teste exploratório");
  else skills.push("Validação de fluxo ponta a ponta");
  if (item.steps.length >= 3) skills.push("Reprodutibilidade de defeito");
  if (item.criteria.length >= 3) skills.push("Critérios de aceite");
  return skills;
}

/** Primeira frase do resultado — a manchete do case, em capa e em post. */
export function headline(item: QaCase, max = 180) {
  return summarize(item.submission.result, max);
}

export type PostInput = { name: string; url: string; steps?: number; criteria?: number };

/**
 * Texto pronto para o LinkedIn. Fica editável na tela: o post é da pessoa, o
 * produto só tira dela o trabalho de começar da folha em branco.
 *
 * Cortamos passos e critérios de propósito — o post é a chamada, o case é o
 * conteúdo. Despejar a entrega inteira no feed mata o clique.
 */
export function linkedInPost(item: QaCase, { url, steps = 4, criteria = 3 }: PostInput) {
  const shown = item.steps.slice(0, steps);
  const restSteps = item.steps.length - shown.length;
  const shownCriteria = item.criteria.slice(0, criteria);
  const restCriteria = item.criteria.length - shownCriteria.length;

  const opening = item.mode === "investigacao"
    ? `Peguei o Lab ${item.label} do QA Lab Playground (${item.area}) para caçar o que estava quebrado — e achei.`
    : `Testei o fluxo completo de ${item.area} no Lab ${item.label} do QA Lab Playground e documentei o que encontrei.`;

  return [
    `${opening}`,
    "",
    `🎯 O que eu tinha que provar: ${item.objective}`,
    "",
    `🐛 O que achei (severidade ${severityLabels[item.severity].toLowerCase()}): ${headline(item)}`,
    "",
    "🔁 Como reproduzir:",
    ...shown.map((step, index) => `${index + 1}. ${step}`),
    ...(restSteps > 0 ? [`(+${restSteps} passo${restSteps > 1 ? "s" : ""} no case completo)`] : []),
    "",
    ...(shownCriteria.length > 0
      ? ["✅ Critérios que validei:", ...shownCriteria.map((criterion) => `• ${criterion}`), ...(restCriteria > 0 ? [`• +${restCriteria} critério(s)`] : []), ""]
      : []),
    `📄 Case completo, com passos e o oráculo usado: ${url}`,
    "",
    "#QA #QualityAssurance #TestesDeSoftware #QualidadeDeSoftware #Testing",
  ].join("\n");
}

/** Resumo de uma linha para a capa do link (OG image e meta description). */
export function caseSummary(item: QaCase) {
  return `Lab ${item.label} · ${item.area} · severidade ${severityLabels[item.severity].toLowerCase()} — ${headline(item, 120)}`;
}
