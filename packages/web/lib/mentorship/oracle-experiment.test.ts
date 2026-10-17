import { describe, expect, test } from "bun:test";
import { exportOracleMarkdown, generateApprovedReport, hasDiscriminatingOracle, parseMoneyToCents, runBusinessCheck, runWeakCheck } from "./oracle-experiment";

describe("business oracle experiment", () => {
  test("the superficial check passes in both versions despite divergent totals", () => {
    const results = runWeakCheck();
    expect(results.every(item => item.passed)).toBe(true);
    expect(generateApprovedReport("reference").totalCents).toBe(28125);
    expect(generateApprovedReport("defective").totalCents).toBe(34125);
  });

  test("an independently calculated oracle passes only the reference", () => {
    const results = runBusinessCheck(28125);
    expect(results.find(item => item.version === "reference")?.passed).toBe(true);
    expect(results.find(item => item.version === "defective")?.passed).toBe(false);
    expect(hasDiscriminatingOracle(results, 28125)).toBe(true);
  });

  test("parses Brazilian money without accepting ambiguous input", () => {
    expect(parseMoneyToCents("R$ 281,25")).toBe(28125);
    expect(parseMoneyToCents("281.25")).toBe(28125);
    expect(parseMoneyToCents("28,125")).toBeNull();
    expect(parseMoneyToCents("texto")).toBeNull();
  });

  test("exports only a discriminating result with a meaningful rationale", () => {
    const results = runBusinessCheck(28125);
    expect(() => exportOracleMarkdown(28125, "curto", results)).toThrow();
    const report = exportOracleMarkdown(28125, "Somei apenas registros aprovados e mantive o cálculo separado da função avaliada.", results);
    expect(report).toContain("reference: PASS");
    expect(report).toContain("defective: FAIL");
    expect(report).toContain("Seed: approved-expenses-01");
  });
});
