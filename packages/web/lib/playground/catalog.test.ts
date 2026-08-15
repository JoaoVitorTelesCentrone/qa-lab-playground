import { describe, expect, test } from "bun:test";
import { SEMANA_1, findLabByNumber, isLabReleased, labs, tracks } from "./catalog";
import { systemChallenges } from "@/lib/system-challenges";

describe("catálogo de Labs", () => {
  test("um Lab para cada desafio do sistema, sem número repetido", () => {
    expect(labs).toHaveLength(systemChallenges.length);
    expect(new Set(labs.map((lab) => lab.number)).size).toBe(labs.length);
    expect(new Set(labs.map((lab) => lab.slug)).size).toBe(labs.length);
  });

  test("o Lab herda rota, área e critérios de aceite do desafio", () => {
    for (const challenge of systemChallenges.slice(0, 10)) {
      const lab = findLabByNumber(challenge.number)!;
      expect(lab.slug).toBe(challenge.id);
      expect(lab.route).toBe(challenge.route);
      expect(lab.acceptanceCriteria).toEqual(challenge.acceptance);
    }
  });

  test("a trilha vem da área do desafio", () => {
    expect(tracks).toEqual(["UI Automation", "API e Contrato"]);
    expect(labs.every((lab) => tracks.includes(lab.track))).toBe(true);
  });

  test("todo Lab tem conteúdo semanal e tempo de prática declarado", () => {
    expect(labs.every((lab) => lab.content.postSegunda && lab.content.blogQuinta && lab.content.videoSabado)).toBe(true);
    expect(labs.every((lab) => [15, 30, 60, 90].includes(lab.minutes))).toBe(true);
  });

  test("o gate de release compara com a data do Lab", () => {
    expect(SEMANA_1).toBe("2026-08-10");
    expect(isLabReleased(labs[0], new Date("2026-08-10T12:00:00.000Z"))).toBe(true);
    expect(isLabReleased(labs[0], new Date("2026-08-09T12:00:00.000Z"))).toBe(false);
    expect(isLabReleased({ releaseDate: "2027-01-01" }, new Date("2026-12-31T12:00:00.000Z"))).toBe(false);
  });

  test("o catálogo inteiro já está liberado", () => {
    expect(labs.every((lab) => lab.status === "liberado")).toBe(true);
  });
});
