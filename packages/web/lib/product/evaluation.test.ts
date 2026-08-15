import { describe, expect, test } from "bun:test";
import { evaluateEvidence, MIN_LENGTH } from "./evaluation";

const acceptance = ["Passos reproduziveis", "Resultado obtido comparado ao esperado", "Evidencia com valor ou mensagem exibida"];
const long = "x".repeat(MIN_LENGTH);

const draft = (overrides: Partial<Parameters<typeof evaluateEvidence>[0]> = {}) => ({ result: long, reproduction: long, severity: "alta", checklist: acceptance, ...overrides });

describe("avaliação automática da evidência", () => {
  test("aprova uma entrega completa", () => {
    const evaluation = evaluateEvidence(draft(), acceptance);
    expect(evaluation.passed).toBe(true);
    expect(evaluation.issues).toHaveLength(0);
    expect(evaluation.missingCriteria).toHaveLength(0);
  });

  test("reprova entrega vazia apontando todos os campos", () => {
    const evaluation = evaluateEvidence({ result: "", reproduction: "", severity: "", checklist: [] }, acceptance);
    expect(evaluation.passed).toBe(false);
    expect(evaluation.issues.map((issue) => issue.field).sort()).toEqual(["checklist", "reproduction", "result", "severity"]);
  });

  test("texto curto não passa como evidência", () => {
    const evaluation = evaluateEvidence(draft({ result: "x".repeat(MIN_LENGTH - 1) }), acceptance);
    expect(evaluation.passed).toBe(false);
    expect(evaluation.issues[0].field).toBe("result");
  });

  test("espaço em branco não conta como texto", () => {
    const evaluation = evaluateEvidence(draft({ reproduction: " ".repeat(MIN_LENGTH + 5) }), acceptance);
    expect(evaluation.passed).toBe(false);
    expect(evaluation.issues.some((issue) => issue.field === "reproduction")).toBe(true);
  });

  test("severidade fora da lista é recusada", () => {
    expect(evaluateEvidence(draft({ severity: "urgentissima" }), acceptance).passed).toBe(false);
  });

  test("lista os critérios que faltam, na ordem do Lab", () => {
    const evaluation = evaluateEvidence(draft({ checklist: [acceptance[1]] }), acceptance);
    expect(evaluation.passed).toBe(false);
    expect(evaluation.missingCriteria).toEqual([acceptance[0], acceptance[2]]);
  });

  test("marcar um critério que não é do Lab não substitui os que faltam", () => {
    const evaluation = evaluateEvidence(draft({ checklist: ["Criterio inventado", "Outro"] }), acceptance);
    expect(evaluation.passed).toBe(false);
    expect(evaluation.missingCriteria).toEqual(acceptance);
  });

  test("Lab sem critérios não exige checklist", () => {
    expect(evaluateEvidence(draft({ checklist: [] }), []).passed).toBe(true);
  });
});
