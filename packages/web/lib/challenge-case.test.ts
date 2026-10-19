import { describe, expect, test } from "bun:test";
import { CHALLENGE_CASE_SUMMARY, CHALLENGE_CASE_TITLE, publicCaseFromRow, validChallengeCaseInput } from "./challenge-case";
import { emptyDeliverables, type ChallengeDeliverables } from "./challenge-deliverables";

const ready: ChallengeDeliverables = {
  bugs: Array.from({ length: 5 }, (_, index) => ({ id: `${index}`, title: `Bug ${index}`, steps: "Abrir", actual: "Falhou", expected: "Funcionar", severity: "Alta", evidence: "Print" })),
  bdd: [{ id: "bdd", feature: "Despesa", title: "Total", given: "há uma despesa", when: "excluo", then: "o total muda" }],
  e2e: [{ id: "e2e", flow: "Cadastro", priority: "Alta", decision: "Manter manual", reason: "Variável", assertions: "Total" }],
  release: { decision: "Bloquear", rationale: "A investigação encontrou um defeito no fluxo crítico e não há evidência suficiente para liberar com segurança.", residualRisk: "Total incorreto", monitoring: "Reexecutar os gates após correção", gates: { Lint: "passed", "Testes unitários": "passed", "Integração/API": "passed", "E2E crítico": "passed", Acessibilidade: "passed" } },
};

describe("case público do ExpenseFlow", () => {
  test("aceita título e resumo dentro dos limites", () => expect(validChallengeCaseInput(CHALLENGE_CASE_TITLE, CHALLENGE_CASE_SUMMARY)).toBe(true));
  test("recusa resumo curto", () => expect(validChallengeCaseInput("Case", "curto")).toBe(false));
  test("nunca expõe case privado ou incompleto", () => {
    expect(publicCaseFromRow({ title: "Case", summary: CHALLENGE_CASE_SUMMARY, snapshot: ready, published: false, updated_at: "2026-01-01" })).toBeNull();
    expect(publicCaseFromRow({ title: "Case", summary: CHALLENGE_CASE_SUMMARY, snapshot: emptyDeliverables, published: true, updated_at: "2026-01-01" })).toBeNull();
  });
  test("retorna somente o snapshot publicado e completo", () => {
    expect(publicCaseFromRow({ title: "Case", summary: CHALLENGE_CASE_SUMMARY, snapshot: ready, published: true, updated_at: "2026-01-01" })?.snapshot.bugs).toHaveLength(5);
  });
});
