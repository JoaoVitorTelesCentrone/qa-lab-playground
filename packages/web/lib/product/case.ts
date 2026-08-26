// Case de QA: a entrega de um Lab virada em artefato de portfólio.
//
// Uma evidência crua não é portfólio — quem lê no LinkedIn não sabe o que era
// o sistema, o que estava em risco nem o que a pessoa validou. O case junta a
// evidência ao briefing do Lab e produz três coisas: a página pública, o
// resumo de capa e o texto do post.
//
// A entrega é texto livre mais anexos, então o que estrutura o case vem do
// briefing do Lab (objetivo, oráculo, roteiro, critérios), não de campos que o
// aluno preencheu separados. O que é dele é a evidência e os arquivos.
//
// Módulo puro: nenhuma leitura de banco aqui. A página pública e o painel
// logado renderizam o mesmo modelo, então o que o aluno revisa antes de
// publicar é exatamente o que o recrutador abre.

import type { SystemChallenge } from "@/lib/system-challenges";
import { labLabel, type Lab } from "@/lib/playground/catalog";
import type { Submission } from "./journey";
import { summarize } from "./portfolio-format";

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
  /** Roteiro do Lab. É o que o Lab pediu, não o que o aluno escreveu. */
  labSteps: string[];
  /** Critérios de aceite do Lab. Mesma origem do roteiro. */
  criteria: string[];
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
    labSteps: challenge.steps,
    criteria: challenge.acceptance,
    createdAt: submission.createdAt,
  };
}

/** Anexos que dão para mostrar embutidos, separados por como renderizam. */
export function attachmentKind(type: string): "image" | "video" | "file" {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  return "file";
}

/**
 * As competências que o case comprova. Não é uma lista genérica de skills: cada
 * item só entra se houver evidência dele na entrega, porque a graça do
 * portfólio é o que a pessoa fez, não o que ela diz saber.
 */
export function caseSkills(item: QaCase): string[] {
  const skills = ["Documentação de evidência"];
  if (item.mode === "investigacao") skills.push("Teste exploratório");
  else skills.push("Validação de fluxo ponta a ponta");

  const attachments = item.submission.attachments;
  if (attachments.some((file) => attachmentKind(file.type) === "video")) skills.push("Evidência em vídeo");
  else if (attachments.some((file) => attachmentKind(file.type) === "image")) skills.push("Evidência visual");
  // Texto longo é o que separa "achei um bug" de um relato que outra pessoa
  // consegue seguir — é o proxy honesto de reprodutibilidade que sobrou.
  if (item.submission.evidence.trim().length >= 400) skills.push("Relato reproduzível");
  return skills;
}

/** Primeira frase da evidência — a manchete do case, em capa e em post. */
export function headline(item: QaCase, max = 180) {
  const text = item.submission.evidence.trim();
  if (text) return summarize(text, max);
  // Entrega só com anexo não tem frase para virar manchete.
  const count = item.submission.attachments.length;
  return count > 0 ? `Evidência em ${count} arquivo(s) anexado(s).` : "Evidência registrada.";
}

export type PostInput = { name: string; url: string; criteria?: number };

/**
 * Texto pronto para o LinkedIn. Fica editável na tela: o post é da pessoa, o
 * produto só tira dela o trabalho de começar da folha em branco.
 *
 * Cortamos os critérios de propósito — o post é a chamada, o case é o
 * conteúdo. Despejar a entrega inteira no feed mata o clique.
 */
export function linkedInPost(item: QaCase, { url, criteria = 3 }: PostInput) {
  const shownCriteria = item.criteria.slice(0, criteria);
  const restCriteria = item.criteria.length - shownCriteria.length;
  const files = item.submission.attachments.length;

  const opening = item.mode === "investigacao"
    ? `Peguei o Lab ${item.label} do QA Lab Playground (${item.area}) para caçar o que estava quebrado — e achei.`
    : `Testei o fluxo completo de ${item.area} no Lab ${item.label} do QA Lab Playground e documentei o que encontrei.`;

  return [
    `${opening}`,
    "",
    `🎯 O que eu tinha que provar: ${item.objective}`,
    "",
    `🔍 O que encontrei: ${headline(item)}`,
    ...(files > 0 ? ["", `📎 ${files} evidência(s) anexada(s) no case.`] : []),
    "",
    ...(shownCriteria.length > 0
      ? ["✅ Critérios do Lab:", ...shownCriteria.map((criterion) => `• ${criterion}`), ...(restCriteria > 0 ? [`• +${restCriteria} critério(s)`] : []), ""]
      : []),
    `📄 Case completo, com a evidência e o oráculo usado: ${url}`,
    "",
    "#QA #QualityAssurance #TestesDeSoftware #QualidadeDeSoftware #Testing",
  ].join("\n");
}

/** Resumo de uma linha para a capa do link (OG image e meta description). */
export function caseSummary(item: QaCase) {
  return `Lab ${item.label} · ${item.area} — ${headline(item, 120)}`;
}
