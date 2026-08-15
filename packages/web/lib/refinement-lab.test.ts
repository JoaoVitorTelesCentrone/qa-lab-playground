import { describe, expect, test } from "bun:test";
import { buildRefinementDraft, refinementItems, scoreRefinement } from "./refinement-lab";

describe("Refinement Lab", () => {
  test("gera centenas de PBIs e bugs para pratica", () => {
    expect(refinementItems.length).toBeGreaterThanOrEqual(200);
    expect(refinementItems.some((item) => item.kind === "pbi")).toBe(true);
    expect(refinementItems.some((item) => item.kind === "bug")).toBe(true);
  });

  test("bloqueia refinamento fraco", () => {
    const result = scoreRefinement({ title: "ruim", body: "curto", criteria: "um", questions: "", clarity: 1, testability: 1, value: 1, scope: 1 });
    expect(result.ready).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
  });

  test("aprova refinamento com descricao, criterios e pergunta aberta", () => {
    const result = scoreRefinement({
      title: "Aprovar reembolso com regra de permissao clara",
      body: "Como gestor responsavel por uma equipe, preciso aprovar ou rejeitar reembolsos com base em permissao, limite e justificativa para evitar pagamentos indevidos e manter auditoria do processo.",
      criteria: "Gestor da equipe pode aprovar\nColaborador nao pode aprovar a propria despesa\nRejeicao exige justificativa",
      questions: "Qual limite exige segunda aprovacao?",
      clarity: 5,
      testability: 5,
      value: 5,
      scope: 4,
    });
    expect(result.ready).toBe(true);
  });

  test("gera rascunho de evidencia do refinamento", () => {
    const item = refinementItems[0];
    const draft = buildRefinementDraft(item, {
      title: "Titulo refinado suficiente",
      body: "Descricao refinada com contexto, valor, regra de negocio, limites de escopo e comportamento esperado para orientar produto, engenharia e QA no refinamento.",
      criteria: "Criterio um\nCriterio dois\nCriterio tres",
      questions: "Pergunta aberta",
      clarity: 4,
      testability: 4,
      value: 4,
      scope: 4,
    });
    expect(draft.content).toContain("## Versao refinada");
    expect(draft.title).toContain(item.id);
  });
});