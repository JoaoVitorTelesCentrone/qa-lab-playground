import { describe, expect, test } from "bun:test";
import { exportOracleMarkdown, generateCompletedReport, hasDiscriminatingOracle, parseActionCount, runBusinessCheck, runWeakCheck } from "./oracle-experiment";

describe("business oracle experiment", () => {
  test("the superficial check passes in both versions despite divergent totals", () => {
    const results = runWeakCheck();
    expect(results.every(item => item.passed)).toBe(true);
    expect(generateCompletedReport("reference").completedCount).toBe(3);
    expect(generateCompletedReport("defective").completedCount).toBe(4);
  });

  test("an independently calculated oracle passes only the reference", () => {
    const results = runBusinessCheck(3);
    expect(results.find(item => item.version === "reference")?.passed).toBe(true);
    expect(results.find(item => item.version === "defective")?.passed).toBe(false);
    expect(hasDiscriminatingOracle(results, 3)).toBe(true);
    expect(hasDiscriminatingOracle(runBusinessCheck(4), 4)).toBe(false);
    expect(hasDiscriminatingOracle(runBusinessCheck(2), 2)).toBe(false);
  });

  test("accepts only a safe whole action count", () => {
    expect(parseActionCount(" 3 ")).toBe(3);
    expect(parseActionCount("0")).toBe(0);
    for (const value of ["", "-1", "3,5", "3.5", "3e0", "texto", "9007199254740992"]) expect(parseActionCount(value)).toBeNull();
    for (const value of [-1, 1.5, NaN, Infinity]) expect(() => runBusinessCheck(value)).toThrow();
  });

  test("exports only a discriminating result with a meaningful rationale", () => {
    const results = runBusinessCheck(3);
    expect(() => exportOracleMarkdown(3, "curto", results)).toThrow();
    const report = exportOracleMarkdown(3, "Contei apenas ações concluídas e mantive a contagem separada da função avaliada.", results);
    expect(report).toContain("reference: PASS");
    expect(report).toContain("defective: FAIL");
    expect(report).toContain("Seed: broto-completed-actions-01");
    expect(report).toContain("3 ações concluídas");
  });
});
