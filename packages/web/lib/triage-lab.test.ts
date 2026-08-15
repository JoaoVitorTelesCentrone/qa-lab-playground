import { describe, expect, test } from "bun:test";
import { buildTriageDraft, scoreTriageReview, triageCases } from "./triage-lab";

describe("Bug Triage Lab", () => {
  test("gera muitos casos de triagem", () => {
    expect(triageCases.length).toBeGreaterThanOrEqual(150);
    expect(new Set(triageCases.map((item) => item.id)).size).toBe(triageCases.length);
  });

  test("pontua decisao alinhada com esperado", () => {
    const item = triageCases[0];
    const result = scoreTriageReview(item, { severity: item.expectedSeverity, priority: item.expectedPriority, decision: item.expectedDecision, owner: "Engenharia", rationale: "Justificativa detalhada conectando impacto, reproducao, evidencia e risco de negocio para decidir a prioridade correta.", nextStep: "Acionar dono tecnico e validar correcao com massa reproduzivel." });
    expect(result.ready).toBe(true);
  });

  test("gera rascunho de triagem", () => {
    const item = triageCases[0];
    const draft = buildTriageDraft(item, { severity: item.expectedSeverity, priority: item.expectedPriority, decision: item.expectedDecision, owner: "QA", rationale: "Justificativa detalhada conectando impacto, reproducao, evidencia e risco de negocio para decidir a prioridade correta.", nextStep: "Validar reproducao e alinhar dono com produto." });
    expect(draft.content).toContain("## Justificativa");
  });
});