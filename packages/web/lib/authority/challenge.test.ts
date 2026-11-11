import { describe, expect, test } from "bun:test";
import { challenge, formatRelease, isSolutionReleased } from "./challenge";

describe("desafio da semana", () => {
  test("a solução só abre a partir da data configurada", () => {
    const item = { solutionReleaseAt: "2026-11-16T15:00:00Z" };
    expect(isSolutionReleased(item, new Date("2026-11-16T14:59:59Z"))).toBe(false);
    expect(isSolutionReleased(item, new Date("2026-11-16T15:00:00Z"))).toBe(true);
  });

  test("data inválida nunca libera a solução", () => {
    expect(isSolutionReleased({ solutionReleaseAt: "em breve" }, new Date("2030-01-01"))).toBe(false);
  });

  test("o arquivo de conteúdo é coerente", () => {
    expect(challenge.solution).toHaveLength(challenge.bugCount);
    expect(challenge.title).toContain(String(challenge.bugCount));
    expect(Number.isNaN(new Date(challenge.solutionReleaseAt).getTime())).toBe(false);
  });

  test("formata a liberação em UTC", () => {
    expect(formatRelease("2026-11-16T15:00:00Z")).toBe("16 de nov. de 2026, 15:00 UTC");
  });
});
