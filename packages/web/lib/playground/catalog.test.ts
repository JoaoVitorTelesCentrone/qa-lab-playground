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

  test("lançamento enxuto: só 3 desafios de Finanças estão liberados", () => {
    const liberados = labs.filter((lab) => lab.status === "liberado");
    expect(liberados).toHaveLength(3);
    expect(liberados.map((lab) => lab.number).sort((a, b) => a - b)).toEqual([101, 103, 105]);
    expect(liberados.every((lab) => lab.route.startsWith("/financas"))).toBe(true);
    expect(labs.filter((lab) => lab.status === "agendado").length).toBe(labs.length - 3);
  });
});

// Numeração de lançamento: o que o aluno lê é a posição na lista de liberação,
// não o índice do catálogo. Ver o comentário de LAUNCH_ORDER em catalog.ts.
describe("numeração de lançamento", () => {
  const released = labs.filter((lab) => lab.status === "liberado");

  test("os Labs liberados são numerados 01, 02, 03… sem buraco", () => {
    expect(released.map((lab) => labLabel(lab))).toEqual(released.map((_, index) => String(index + 1).padStart(2, "0")));
  });

  test("o número lido nunca é o número de catálogo quando eles divergem", () => {
    const first = released[0];
    expect(first.position).toBe(1);
    expect(labLabel(first)).toBe("01");
    expect(first.number).toBeGreaterThan(3);
    // A rota e o `lab_slug` no banco continuam no número de catálogo: é o que
    // deixa a renumeração de vitrine acontecer sem migrar dado nem quebrar link.
    expect(first.slug).toBe(`desafio-${first.number}`);
  });

  test("Lab agendado não tem posição de lançamento", () => {
    const scheduled = labs.filter((lab) => lab.status === "agendado");
    expect(scheduled.length).toBeGreaterThan(0);
    expect(scheduled.every((lab) => lab.position === null)).toBe(true);
  });
});
