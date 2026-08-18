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

// Uma trilha por ambiente de prática, com os 10 Labs daquele ambiente na ordem
// em que o aluno precisa entender o domínio: primeiro validar o fluxo normal,
// depois investigar onde ele quebra. Os números vêm do catálogo — Finanças
// 101-110, Agendamentos 111-120 e CRM 121-130.
const financeFlows: Track = {
  slug: "financas-do-zero",
  name: "Finanças ponta a ponta",
  appId: "financas",
  objective: "Testar um controle financeiro completo: lançamento, orçamento, meta e o total que precisa fechar com a lista.",
  outcome: "Você consegue provar que um cálculo exibido diverge dos dados que o alimentam, com evidência reproduzível.",
  labNumbers: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],
};

const bookingFlows: Track = {
  slug: "agenda-sem-conflito",
  name: "Agenda sem conflito",
  appId: "agendamentos",
  objective: "Testar disponibilidade, conflito de horário, reagendamento e cancelamento em uma agenda de serviços.",
  outcome: "Você consegue cobrir regras de disponibilidade e concorrência, e mostrar quando a interface e o servidor discordam.",
  labNumbers: [111, 112, 113, 114, 115, 116, 117, 118, 119, 120],
};

const crmFlows: Track = {
  slug: "funil-comercial",
  name: "Funil comercial",
  appId: "crm",
  objective: "Testar um funil de vendas: contatos, oportunidades, mudança de estágio e as métricas que dependem disso.",
  outcome: "Você consegue rastrear um número de painel até o dado que o origina e provar onde a conta não fecha.",
  labNumbers: [121, 122, 123, 124, 125, 126, 127, 128, 129, 130],
};

/**
 * Trilha desligada no lançamento: por ora o produto é só o catálogo de Labs.
 * Uma sequência curada em cima de três Labs não era um percurso, era um card a
 * mais dizendo a mesma coisa que a lista logo abaixo.
 *
 * Nada foi deletado — as trilhas, o progresso e o certificado continuam no
 * código e testados. Ligar de volta é trocar esta constante para `true`; a
 * rota /labs/trilhas volta a abrir junto (ver proxy.ts).
 */
export const TRACKS_ENABLED = false;

export const learningTracks: Track[] = [criticalFlows, financeFlows, bookingFlows, crmFlows];

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
    // Só sugere um Lab liberado: um passo agendado levaria a sugestão pra
    // waitlist em vez do próximo passo de verdade. Ver [[qa-lab-lancamento-enxuto]].
    nextLab: steps.find((step) => step.status !== "completed" && step.lab.status === "liberado")?.lab ?? null,
  };
}

/**
 * Trilha a que um Lab pertence, para mostrar o percurso dentro do briefing.
 * Ponto único de desligamento: com `TRACKS_ENABLED` falso ninguém acha trilha
 * nenhuma, e o briefing e a conclusão voltam a falar só do Lab.
 */
export function trackForLab(labNumber: number) {
  if (!TRACKS_ENABLED) return undefined;
  return learningTracks.find((track) => track.labNumbers.includes(labNumber));
}

/** A trilha tem pelo menos um Lab liberado — vale mostrar na vitrine. */
export function trackHasReleasedLab(track: Track) {
  return TRACKS_ENABLED && track.labNumbers.some((number) => labs.find((lab) => lab.number === number)?.status === "liberado");
}
