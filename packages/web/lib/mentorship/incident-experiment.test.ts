import { describe, expect, test } from "bun:test";
import { exportIncidentMarkdown, reproduceIncident, runRegressionPack, validatesRegression } from "./incident-experiment";

describe("incident to regression experiment", () => {
  test("reproduces the release mismatch with traceable metadata", () => {
    expect(reproduceIncident()).toEqual({ expectedCents: 28125, observedCents: 34125, release: "2026.10.1", correlationId: "corr-fin-7f31" });
  });

  test("fails before the fix, passes after it, and preserves the countercase", () => {
    const results = runRegressionPack();
    expect(results.map(item => item.beforePassed)).toEqual([false, false, true]);
    expect(results.every(item => item.afterPassed)).toBe(true);
    expect(validatesRegression(results)).toBe(true);
  });

  test("exports only a complete evidence chain", () => {
    const results = runRegressionPack();
    expect(() => exportIncidentMarkdown("rounding", "evidência suficientemente longa", "análise suficientemente longa para revisão", results)).toThrow();
    const report = exportIncidentMarkdown("status-filter", "Os logs mostram quatro linhas na agregação, incluindo uma rejeitada.", "O teste cobre dois conjuntos com rejeitada e um contracaso, mas não todas as regras financeiras.", results);
    expect(report).toContain("incidente → correlação → hipótese");
    expect(report).toContain("Outros valores com uma rejeitada");
  });
});
