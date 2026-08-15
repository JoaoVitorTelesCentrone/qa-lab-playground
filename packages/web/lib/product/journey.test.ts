import { describe, expect, test } from "bun:test";
import { labs } from "@/lib/playground/catalog";
import { regressionPacks } from "@/lib/regression-packs";
import { buildJourney, emptyJourney, type Enrollment, type ScenarioRun, type Submission } from "./journey";

const lab = labs.find((item) => item.status === "liberado")!;
const other = labs.filter((item) => item.status === "liberado" && item.slug !== lab.slug)[0]!;

function enrollment(overrides: Partial<Enrollment> & { labSlug: string }): Enrollment {
  return { status: "started", startedAt: "2026-08-01T10:00:00Z", completedAt: null, updatedAt: "2026-08-01T10:00:00Z", ...overrides };
}

function submission(labSlug: string): Submission {
  return { id: crypto.randomUUID(), labSlug, result: "Total divergente", reproduction: "1. Abrir\n2. Somar", severity: "alta", checklist: [], published: false, createdAt: "2026-08-01T10:00:00Z" };
}

describe("minha jornada", () => {
  test("não inventa progresso para quem acabou de chegar", () => {
    expect(emptyJourney.started).toBe(0);
    expect(emptyJourney.completed).toBe(0);
    expect(emptyJourney.completionRate).toBe(0);
    expect(emptyJourney.recent).toHaveLength(0);
  });

  test("sugere o primeiro Lab liberado quando nada foi tocado", () => {
    expect(emptyJourney.nextLab?.slug).toBe(lab.slug);
  });

  test("prioriza o Lab em andamento sobre um Lab ainda intocado", () => {
    const journey = buildJourney([enrollment({ labSlug: other.slug })], [], []);
    expect(journey.nextLab?.slug).toBe(other.slug);
  });

  test("conta conclusão e evidência de forma independente", () => {
    const journey = buildJourney(
      [
        enrollment({ labSlug: lab.slug, status: "completed", completedAt: "2026-08-02T10:00:00Z", updatedAt: "2026-08-02T10:00:00Z" }),
        enrollment({ labSlug: other.slug }),
      ],
      [submission(lab.slug), submission(lab.slug)],
      [],
    );
    expect(journey.started).toBe(2);
    expect(journey.completed).toBe(1);
    expect(journey.evidence).toBe(2);
    expect(journey.completionRate).toBe(50);
    expect(journey.recent[0].lab.slug).toBe(lab.slug);
    expect(journey.recent[0].submissions).toBe(2);
  });

  test("Labs abandonados não contam como iniciados", () => {
    const journey = buildJourney([enrollment({ labSlug: lab.slug, status: "abandoned" })], [], []);
    expect(journey.started).toBe(0);
    expect(journey.completionRate).toBe(0);
  });

  test("ignora matrícula de um Lab que saiu do catálogo", () => {
    const journey = buildJourney([enrollment({ labSlug: "lab-que-nao-existe" })], [], []);
    expect(journey.recent).toHaveLength(0);
  });

  test("cobre os 4 ambientes e conta cada cenário uma única vez", () => {
    const pack = regressionPacks[0];
    const runs: ScenarioRun[] = [
      { appId: pack.id, scenarioId: pack.scenarios[0].id, status: "passou" },
      { appId: pack.id, scenarioId: pack.scenarios[0].id, status: "falhou" },
      { appId: pack.id, scenarioId: pack.scenarios[1].id, status: "falhou" },
    ];
    const coverage = buildJourney([], [], runs).coverage;
    expect(coverage).toHaveLength(4);
    expect(coverage.every((item) => item.total === 35)).toBe(true);
    const first = coverage.find((item) => item.id === pack.id)!;
    expect(first.executed).toBe(2);
    expect(first.failed).toBe(2);
    expect(first.percent).toBe(Math.round((2 / 35) * 100));
  });
});
