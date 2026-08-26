import { describe, expect, test } from "bun:test";
import { fullRoadmapChallenges } from "./full-catalog.generated";
import { getPracticeAssignment } from "./practice-assignment";
import { roadmapEnvironments } from "../product/apps";

describe("prática do roadmap", () => {
  test("todos os 518 desafios têm ambiente e tarefa executável", () => {
    expect(fullRoadmapChallenges).toHaveLength(518);
    for (const challenge of fullRoadmapChallenges) {
      const practice = getPracticeAssignment(challenge);
      expect(practice.environment.length).toBeGreaterThan(2);
      expect(practice.route.startsWith("/")).toBe(true);
      expect(practice.setup.length).toBeGreaterThanOrEqual(2);
      expect(practice.actions.length).toBeGreaterThanOrEqual(3);
      expect(practice.evidence.length).toBeGreaterThan(20);
    }
  });

  test("áreas técnicas usam ambientes coerentes", () => {
    const byModule = (prefix: string) => fullRoadmapChallenges.find((item) => item.module.startsWith(prefix))!;
    expect(getPracticeAssignment(byModule("1.8")).route).toBe("/api-playground");
    expect(getPracticeAssignment(byModule("1.12")).route).toBe("/trilhas/cicd");
    expect(getPracticeAssignment(byModule("1.15")).route).toBe("/labs/acessibilidade");
    expect(getPracticeAssignment(byModule("3.1")).route).toBe("/lab/pessoas");
    const cicdPleno = fullRoadmapChallenges.find((item) => item.module.includes("5.3") && item.title === "CI/CD")!;
    expect(getPracticeAssignment(cicdPleno).route).toBe("/trilhas/cicd");
  });

  test("acessibilidade é Lab, não ambiente independente", () => {
    const accessibility = fullRoadmapChallenges.find((item) => item.module.startsWith("1.15"))!;
    expect(getPracticeAssignment(accessibility).route).toBe("/labs/acessibilidade");
    expect(roadmapEnvironments.some((item) => item.route === "/labs/acessibilidade")).toBe(false);
  });

  test("todo ambiente usado pelo roadmap aparece no menu do header", () => {
    const menuRoots = new Set(roadmapEnvironments.map((item) => item.route.split("/")[1]));
    for (const challenge of fullRoadmapChallenges) {
      const routeRoot = getPracticeAssignment(challenge).route.split("/")[1];
      expect(menuRoots.has(routeRoot)).toBe(true);
    }
  });
});
