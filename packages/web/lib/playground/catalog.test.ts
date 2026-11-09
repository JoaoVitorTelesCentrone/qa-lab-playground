import { describe, expect, test } from "bun:test";
import { SEMANA_1, findLabByNumber, isLabReleased, labLabel, labs, tracks } from "./catalog";
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
    const liberado = labs.find((lab) => lab.status === "liberado")!;
    expect(isLabReleased(liberado, new Date("2026-08-10T12:00:00.000Z"))).toBe(true);
    expect(isLabReleased(liberado, new Date("2026-08-09T12:00:00.000Z"))).toBe(false);
    expect(isLabReleased({ releaseDate: "2027-01-01" }, new Date("2026-12-31T12:00:00.000Z"))).toBe(false);
  });

  test("todos os Labs estão liberados e os do Broto continuam no caso Broto", () => {
    expect(labs.every((lab) => lab.status === "liberado")).toBe(true);
    expect(labs.length).toBeGreaterThan(130);
    const broto = labs.filter((lab) => lab.requiredFeature === "Broto");
    expect(broto).toHaveLength(56);
    expect(broto.every((lab) => lab.route === "/conteudo/broto")).toBe(true);
    expect(labs.some((lab) => lab.route.startsWith("/financas"))).toBe(false);
  });
});

// Numeração de lançamento: só os três primeiros Labs têm posição própria (01–03),
// para não quebrar URLs e cases já publicados. Os demais mostram o número do catálogo.
describe("numeração de lançamento", () => {
  const launch = [101, 103, 105].map((number) => labs.find((lab) => lab.number === number)!);

  test("os três Labs do lançamento seguem numerados 01, 02, 03", () => {
    expect(launch.map((lab) => lab.position)).toEqual([1, 2, 3]);
    expect(launch.map((lab) => labLabel(lab))).toEqual(["01", "02", "03"]);
    // A rota e o `lab_slug` no banco continuam no número de catálogo.
    expect(launch.map((lab) => lab.slug)).toEqual(["desafio-101", "desafio-103", "desafio-105"]);
  });

  test("os demais Labs mostram o número do catálogo e não têm posição de lançamento", () => {
    const others = labs.filter((lab) => !launch.includes(lab));
    expect(others.length).toBeGreaterThan(0);
    expect(others.every((lab) => lab.position === null)).toBe(true);
    expect(labLabel(labs.find((lab) => lab.number === 102)!)).toBe("102");
  });
});
