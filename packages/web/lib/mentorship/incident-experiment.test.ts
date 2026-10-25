import { describe, expect, test } from "bun:test";
import { exportIncidentMarkdown, reproduceIncident, runRegressionPack, validatesRegression } from "./incident-experiment";

describe("incident to regression experiment", () => {
  test("reproduces the release mismatch with traceable metadata", () => {
    expect(reproduceIncident()).toEqual({ expectedCount: 3, observedCount: 4, release: "2026.10.1", correlationId: "corr-broto-7f31" });
  });

  test("fails before the fix, passes after it, and preserves the countercase", () => {
    const results = runRegressionPack();
    expect(results.map(item => item.beforePassed)).toEqual([false, false, true]);
    expect(results.every(item => item.afterPassed)).toBe(true);
    expect(results.map(item => item.afterCount)).toEqual([3, 1, 2]);
    expect(validatesRegression(results)).toBe(true);
  });

  test("exports only a complete evidence chain", () => {
    const results = runRegressionPack();
    expect(() => exportIncidentMarkdown("period", "evidência suficientemente longa", "análise suficientemente longa para revisão", results)).toThrow();
    const report = exportIncidentMarkdown("status-filter", "Os logs mostram quatro ações na contagem, incluindo uma pendente.", "O teste cobre dois conjuntos com ações pendentes e um contracaso, mas não todas as regras do crescimento.", results);
    expect(report).toContain("incidente → correlação → hipótese");
    expect(report).toContain("Variação: uma concluída e duas pendentes");
  });
});
