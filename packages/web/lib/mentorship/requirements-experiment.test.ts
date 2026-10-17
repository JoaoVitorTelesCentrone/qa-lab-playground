import { describe, expect, test } from "bun:test";
import { canExportRequirements, createRequirementsAttempt, exportRequirementsMarkdown, parseRequirementsDraft, revealRequirements } from "./requirements-experiment";

function answered() {
  const attempt = createRequirementsAttempt();
  attempt.initial = { questions: "Qual é o limite permitido?", scenarios: "Gestora aprova despesa de 100 reais: espero aprovação." };
  return attempt;
}

describe("requirements experiment", () => {
  test("requires an initial response before revealing criteria", () => {
    const empty = createRequirementsAttempt();
    expect(revealRequirements(empty).baseline).toBeNull();
    expect(canExportRequirements(empty)).toBe(false);
    expect(() => exportRequirementsMarkdown(empty)).toThrow();
  });

  test("preserves an independent baseline through revision and repeat reveals", () => {
    const attempt = revealRequirements(answered());
    const initialScenario = attempt.baseline!.scenarios;
    attempt.revised.scenarios = "R2: valor 500,01 deve ser recusado sem alterar o estado.";
    attempt.initial.scenarios = "Tentativa de modificar o original";
    expect(attempt.baseline!.scenarios).toBe(initialScenario);
    expect(revealRequirements(attempt).baseline!.scenarios).toBe(initialScenario);
  });

  test("exports both responses and the reproducibility manifest only after conclusion", () => {
    const attempt = revealRequirements(answered());
    expect(canExportRequirements(attempt)).toBe(false);
    attempt.revised.scenarios = "R2: 500,01 é recusado; estado permanece pendente.";
    attempt.conclusion = "Incluí a fronteira superior por R2. A repetição também pode explicar a mudança.";
    const report = exportRequirementsMarkdown(attempt);
    expect(report).toContain(attempt.baseline!.scenarios);
    expect(report).toContain(attempt.revised.scenarios);
    expect(report).toContain("Seed: expense-approval-01");
    expect(report).toContain("Rubrica: 1.0");
  });

  test("round-trips a draft and rejects incompatible or damaged drafts", () => {
    const attempt = revealRequirements(answered());
    expect(parseRequirementsDraft(JSON.stringify(attempt))).toEqual(attempt);
    for (const raw of ["{", "null", JSON.stringify({ ...attempt, version: "0" }), JSON.stringify({ ...attempt, startedAt: "invalid" }), JSON.stringify({ ...attempt, baseline: {} }), JSON.stringify({ ...attempt, conclusion: "x".repeat(12001) })]) {
      expect(parseRequirementsDraft(raw)).toBeNull();
    }
  });
});
