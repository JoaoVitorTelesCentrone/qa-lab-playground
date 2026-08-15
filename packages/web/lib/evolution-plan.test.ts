import { describe, expect, test } from "bun:test";
import { emptyDeliverables } from "./challenge-deliverables";
import { buildEvolutionLabDraft, buildEvolutionPlan, buildEvolutionSummary, getEvolutionEvidenceDraft, getEvolutionLab, toEvolutionMissionId } from "./evolution-plan";

const base = {
  projects: [],
  drafts: [],
  progress: [],
  sessions: [],
  deliverables: emptyDeliverables,
};

describe("evolution plan", () => {
  test("recomenda base quando usuario ainda nao tem contexto nem entregaveis", () => {
    const plan = buildEvolutionPlan(base);
    expect(plan.map((step) => step.id)).toEqual(["setup-project", "investigate-expenseflow", "review-competency-map"]);
    expect(plan[0].status).toBe("Agora");
  });

  test("recomenda fechar bug reports enquanto a entrega investigativa esta incompleta", () => {
    const plan = buildEvolutionPlan({
      ...base,
      projects: [{ status: "active" }],
      deliverables: {
        bugs: [{ id: "1", title: "Total errado", steps: "Abrir", actual: "10", expected: "20", severity: "Alta" }],
        bdd: [],
        e2e: [],
      },
    });
    expect(plan[0].id).toBe("complete-bug-reports");
    expect(plan[0].reason).toContain("1/5 bugs");
  });

  test("avanca para estrategia quando bugs tem evidencia suficiente", () => {
    const bugs = Array.from({ length: 5 }, (_, index) => ({
      id: String(index),
      title: `Bug ${index}`,
      steps: "Passos",
      actual: "Atual",
      expected: "Esperado",
      severity: "Alta" as const,
      evidence: "print.png",
    }));
    const plan = buildEvolutionPlan({ ...base, projects: [{ status: "active" }], deliverables: { bugs, bdd: [], e2e: [] } });
    expect(plan.map((step) => step.id)).toEqual(["risk-strategy", "e2e-automation-decision", "portfolio-export"]);
  });

  test("marca etapa como concluida quando mission_progress tem prefixo evolution", () => {
    const plan = buildEvolutionPlan({
      ...base,
      progress: [{ mission_id: toEvolutionMissionId("setup-project"), status: "completed" }],
    });
    expect(plan[0].done).toBe(true);
    expect(buildEvolutionSummary(plan)).toEqual(expect.objectContaining({ done: 1, total: 3, percent: 33 }));
  });

  test("gera template de evidencia para uma etapa valida", () => {
    const draft = getEvolutionEvidenceDraft("risk-strategy");
    expect(draft?.kind).toBe("test_plan");
    expect(draft?.content).toContain("## Evidencias");
  });

  test("expoe uma missao pratica com tarefas, rubrica e starter", () => {
    const lab = getEvolutionLab("risk-strategy");
    expect(lab?.tasks.length).toBeGreaterThanOrEqual(4);
    expect(lab?.rubric.length).toBeGreaterThanOrEqual(4);
    expect(lab?.starter).toContain("Risco residual");
  });

  test("gera rascunho de entrega do lab com resposta do aluno", () => {
    const draft = buildEvolutionLabDraft(
      "pressure-communication",
      "Minha comunicacao traz evidencia, impacto, opcoes de decisao, recomendacao e acompanhamento com dono definido.",
    );
    expect(draft?.title).toContain("Lab -");
    expect(draft?.content).toContain("## Entrega do aluno");
    expect(draft?.content).toContain("Rubrica usada");
  });
});