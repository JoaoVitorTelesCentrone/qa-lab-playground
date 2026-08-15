import { describe, expect, test } from "bun:test";
import { emptyDeliverables } from "./challenge-deliverables";
import { cicdMissions } from "./cicd-lab";
import { buildLearningProgress } from "./learning-progress";

describe("mapa de competências", () => {
  test("começa sem inventar evidências", () => {
    expect(buildLearningProgress(emptyDeliverables, []).every((item) => item.score === 0)).toBe(true);
  });
  test("converte entregas e situações em progresso", () => {
    const result = buildLearningProgress({ ...emptyDeliverables, bugs: [{ id: "1", title: "Bug", steps: "A", actual: "B", expected: "C", severity: "Alta" }] }, [{ scenarioId: "081", response: "Minha decisão detalhada", createdAt: new Date(0).toISOString() }]);
    expect(result.find((item) => item.id === "investigation")?.score).toBe(20);
    expect(result.find((item) => item.id === "people")?.score).toBeGreaterThan(0);
  });
  test("deriva o progresso de CI/CD das missões resolvidas no lab", () => {
    const result = buildLearningProgress(emptyDeliverables, [], [cicdMissions[0].id, "fantasma"]);
    expect(result.find((item) => item.id === "cicd")?.score).toBe(Math.round((1 / cicdMissions.length) * 100));
    expect(result.find((item) => item.id === "cicd")?.available).toBe(true);
  });
});
