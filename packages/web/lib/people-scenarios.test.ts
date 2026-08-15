import { describe, expect, test } from "bun:test";
import { getDailyPeopleScenario, nextPeopleScenario, parsePeopleAttempts, peopleScenarios } from "./people-scenarios";

describe("People Lab", () => {
  test("carrega cenários curados e realistas de rotina QA", () => {
    expect(peopleScenarios.length).toBeGreaterThanOrEqual(10);
    expect(new Set(peopleScenarios.map((item) => item.id)).size).toBe(peopleScenarios.length);
    expect(peopleScenarios.every((item) => item.situation.length > 250)).toBe(true);
    expect(peopleScenarios.every((item) => item.considerations.length === 3)).toBe(true);
  });

  test("seleciona uma situação determinística por dia", () => {
    const first = getDailyPeopleScenario(new Date("2026-06-25T10:00:00"));
    const second = getDailyPeopleScenario(new Date("2026-06-25T22:00:00"));
    const nextDay = getDailyPeopleScenario(new Date("2026-06-26T10:00:00"));

    expect(first.id).toBe(second.id);
    expect(first.id).not.toBe(nextDay.id);
  });

  test("não repete o cenário atual quando existem alternativas", () => {
    expect(nextPeopleScenario(peopleScenarios[0].id, [], () => 0).id).not.toBe(peopleScenarios[0].id);
  });

  test("prioriza cenários ainda não vistos", () => {
    const seen = peopleScenarios.slice(0, -1).map((item) => item.id);
    expect(nextPeopleScenario(null, seen, () => 0).id).toBe(peopleScenarios.at(-1)?.id);
  });

  test("ignora histórico inválido", () => {
    expect(parsePeopleAttempts("inválido")).toEqual([]);
  });
});
