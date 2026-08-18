// Certificado de trilha: a prova de que um percurso inteiro foi concluído.
//
// Diferença deliberada para os certificados de curso que todo mundo já viu:
// este não atesta presença, atesta entrega. Só é emitido quando todos os Labs
// liberados da trilha têm evidência aceita, e a página pública lista o que foi
// produzido — quem abre o link consegue auditar, não só ver um selo.
//
// Módulo puro. A emissão e o código verificável ficam em store.ts.

import type { Track, TrackProgress } from "./tracks";
import type { Severity } from "./evaluation";
import type { Submission } from "./journey";
import { countBySeverity } from "./portfolio-format";

export type CertificateEligibility = {
  eligible: boolean;
  /** Labs liberados da trilha — passos agendados não contam contra o aluno. */
  required: number;
  completed: number;
  missing: number;
};

/**
 * Um Lab agendado não pode travar o certificado: o aluno não tem como
 * concluí-lo. A trilha fecha quando tudo que está liberado foi entregue.
 * Ver [[qa-lab-lancamento-enxuto]].
 */
export function eligibility(progress: TrackProgress): CertificateEligibility {
  const released = progress.steps.filter((step) => step.lab.status === "liberado");
  const completed = released.filter((step) => step.status === "completed").length;
  return {
    eligible: released.length > 0 && completed === released.length,
    required: released.length,
    completed,
    missing: released.length - completed,
  };
}

export type CertificateStats = {
  labs: number;
  evidence: number;
  bySeverity: Array<{ severity: Severity; total: number }>;
  /** Labs da trilha em que houve evidência de severidade alta ou crítica. */
  highImpact: number;
};

export function certificateStats(track: Track, progress: TrackProgress, submissions: Submission[]): CertificateStats {
  const slugs = new Set(progress.steps.map((step) => step.lab.slug));
  const relevant = submissions.filter((item) => slugs.has(item.labSlug));
  const highImpact = new Set(relevant.filter((item) => item.severity === "alta" || item.severity === "critica").map((item) => item.labSlug));
  return {
    labs: eligibility(progress).completed,
    evidence: relevant.length,
    bySeverity: countBySeverity(relevant),
    highImpact: highImpact.size,
  };
}

export type Certificate = {
  code: string;
  trackSlug: string;
  trackName: string;
  holderName: string;
  objective: string;
  outcome: string;
  labs: number;
  evidence: number;
  issuedAt: string;
};

/** Código no formato QAL-XXXX-XXXX. Sem caracteres que se confundem lidos em voz alta. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function certificateCode(random: () => number = Math.random) {
  const block = () => Array.from({ length: 4 }, () => ALPHABET[Math.floor(random() * ALPHABET.length)]).join("");
  return `QAL-${block()}-${block()}`;
}

export function isCertificateCode(value: string) {
  return /^QAL-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/.test(value.toUpperCase());
}

export function normalizeCode(value: string) {
  return value.trim().toUpperCase();
}

/** Texto pronto para o LinkedIn, editável na tela antes de copiar. */
export function certificateLinkedInPost(certificate: Certificate, url: string) {
  return [
    `Concluí a trilha "${certificate.trackName}" no QA Lab Playground. 🎓`,
    "",
    `Não é certificado de assistir aula: cada um dos ${certificate.labs} Labs só fechou depois de uma evidência de teste aceita — passos de reprodução, resultado observado e critérios de aceite confirmados. Foram ${certificate.evidence} evidência(s) registradas no percurso.`,
    "",
    `O que a trilha treina: ${certificate.objective}`,
    "",
    `O que eu consigo fazer agora: ${certificate.outcome}`,
    "",
    `🔗 Certificado e evidências (verificável pelo código ${certificate.code}): ${url}`,
    "",
    "#QA #QualityAssurance #TestesDeSoftware #QualidadeDeSoftware #Testing",
  ].join("\n");
}

/** Campos prontos para colar em "Licenças e certificados" do LinkedIn. */
export function linkedInCredentialFields(certificate: Certificate, url: string) {
  return {
    name: `Trilha ${certificate.trackName} — QA Lab Playground`,
    organization: "QA Lab Playground",
    issued: certificate.issuedAt,
    credentialId: certificate.code,
    credentialUrl: url,
  };
}
