import { describe, expect, test } from "bun:test";
import { emptyDeliverables } from "./challenge-deliverables";
import { validChallengeDeliverables } from "./challenge-account";

describe("cópia privada do ExpenseFlow", () => {
  test("aceita um rascunho válido", () => {
    expect(validChallengeDeliverables(emptyDeliverables)).toBe(true);
    expect(validChallengeDeliverables({ ...emptyDeliverables, bugs: [{ id: "1", title: "Total errado", steps: "Abrir", actual: "Falhou", expected: "Somar", severity: "Alta" }] })).toBe(true);
  });
  test("recusa valores malformados e excesso de registros", () => {
    expect(validChallengeDeliverables({ ...emptyDeliverables, bugs: [{ id: "1", title: "x", severity: "Crítica" }] })).toBe(false);
    expect(validChallengeDeliverables({ ...emptyDeliverables, bugs: Array(101).fill({}) })).toBe(false);
    expect(validChallengeDeliverables({ ...emptyDeliverables, release: { decision: "Publicar", gates: {} } })).toBe(false);
  });
});
