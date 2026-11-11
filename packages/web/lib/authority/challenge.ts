import data from "@/content/challenge.json";

/** Um bug do gabarito: o que mandar, o que deveria voltar e o que volta. */
export type ChallengeBug = { title: string; request: string; expected: string; actual: string; why: string };

export type WeeklyChallenge = {
  week: string;
  title: string;
  summary: string;
  publishedAt: string;
  /** ISO com fuso. Antes desta data a solução não existe para o público. */
  solutionReleaseAt: string;
  bugCount: number;
  labHref: string;
  track: string;
  start: string[];
  endpoints: string[];
  solution: ChallengeBug[];
};

/** O desafio da semana vem de content/challenge.json: troque o arquivo toda semana. */
export const challenge: WeeklyChallenge = data;

export function isSolutionReleased(item: Pick<WeeklyChallenge, "solutionReleaseAt">, now = new Date()) {
  const release = new Date(item.solutionReleaseAt);
  return !Number.isNaN(release.getTime()) && now.getTime() >= release.getTime();
}

/** Data de liberação legível, em inglês e UTC, para não depender do fuso do servidor. */
export function formatRelease(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(iso)) + " UTC";
}
