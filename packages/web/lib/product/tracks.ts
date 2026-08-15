// Trilhas de aprendizagem.
//
// Uma trilha é uma sequência curada de Labs que forma um percurso completo —
// o aluno sai dela sabendo testar um fluxo de ponta a ponta, não Labs soltos.
// Módulo puro: recebe o progresso já lido do banco e devolve o percurso.

import { labs, type Lab } from "@/lib/playground/catalog";
import type { PracticeAppId } from "./apps";
import type { EnrollmentStatus, LabProgress } from "./journey";

export type Track = {
  slug: string;
  name: string;
  appId: PracticeAppId;
  /** O que a trilha treina. */
  objective: string;
  /** O que o aluno consegue fazer ao terminar. */
  outcome: string;
  /** Labs na ordem do percurso, por número do catálogo. */
  labNumbers: number[];
};

// Fluxos críticos do QA Lab: da descoberta do produto ao pedido confirmado.
// A ordem acompanha o caminho que o cliente percorre na loja, para que cada
// Lab dependa do entendimento construído no anterior.
const criticalFlows: Track = {
  slug: "fluxos-criticos",
  name: "Fluxos críticos",
  appId: "qa-lab",
  objective: "Testar o caminho de compra completo do QA Lab, do catálogo ao pedido confirmado.",
  outcome: "Você consegue cobrir um fluxo de e-commerce ponta a ponta com evidência reproduzível em cada etapa.",
  labNumbers: [1, 11, 21, 23, 29, 33, 35, 39, 41, 43],
};

export const learningTracks: Track[] = [criticalFlows];

export function findTrack(slug: string) {
  return learningTracks.find((track) => track.slug === slug);
}

export type TrackStep = {
  lab: Lab;
  position: number;
  status: EnrollmentStatus | "nao-iniciado";
  submissions: number;
};

export type TrackProgress = {
  track: Track;
  steps: TrackStep[];
  completed: number;
  total: number;
  percent: number;
  /** Primeiro Lab ainda não concluído, ou null quando a trilha acabou. */
  nextLab: Lab | null;
};

export function buildTrackProgress(track: Track, progress: LabProgress[]): TrackProgress {
  const byLab = new Map(progress.map((item) => [item.lab.slug, item]));

  // Um número que saiu do catálogo é descartado em vez de virar um passo vazio.
  const steps = track.labNumbers.flatMap<TrackStep>((number, index) => {
    const lab = labs.find((item) => item.number === number);
    if (!lab) return [];
    const current = byLab.get(lab.slug);
    return [{ lab, position: index + 1, status: current?.status ?? "nao-iniciado", submissions: current?.submissions ?? 0 }];
  });

  const completed = steps.filter((step) => step.status === "completed").length;
  return {
    track,
    steps,
    completed,
    total: steps.length,
    percent: steps.length === 0 ? 0 : Math.round((completed / steps.length) * 100),
    nextLab: steps.find((step) => step.status !== "completed")?.lab ?? null,
  };
}

/** Trilha a que um Lab pertence, para mostrar o percurso dentro do briefing. */
export function trackForLab(labNumber: number) {
  return learningTracks.find((track) => track.labNumbers.includes(labNumber));
}
