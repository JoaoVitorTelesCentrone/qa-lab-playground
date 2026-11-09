import { describe, expect, test } from "bun:test";
import { checkDelivery, composeEvidence, draftFromChecklist, emptyDelivery } from "./delivery";
import { evaluateEvidence } from "./evaluation";

const complete = {
  did: "1. Registrei o pensamento na Mente\n2. Saí e voltei pela Home",
  expected: "Encontrar o pensamento no mesmo lugar",
  observed: "O pensamento aparece no topo da lista",
  conclusion: "esperado" as const,
  severity: "" as const,
};

describe("checkDelivery", () => {
  test("entrega vazia não cobre nenhum campo", () => {
    expect(checkDelivery(emptyDelivery).every((check) => !check.ok)).toBe(true);
  });

  test("entrega completa cobre os quatro campos", () => {
    expect(checkDelivery(complete).every((check) => check.ok)).toBe(true);
  });

  test("um anexo vale como resultado observado", () => {
    const observed = checkDelivery({ ...complete, observed: "" }, 1).find((check) => check.id === "observed");
    expect(observed?.ok).toBe(true);
  });

  test("falha sem severidade ainda falta", () => {
    const conclusion = checkDelivery({ ...complete, conclusion: "falha" }).find((check) => check.id === "conclusion");
    expect(conclusion?.ok).toBe(false);
    expect(conclusion?.missing).toContain("severidade");
    expect(checkDelivery({ ...complete, conclusion: "falha", severity: "alta" }).find((check) => check.id === "conclusion")?.ok).toBe(true);
  });
});

describe("composeEvidence", () => {
  test("monta as seções com títulos e passa na regra mínima da API", () => {
    const text = composeEvidence({ ...complete, conclusion: "falha", severity: "alta" });
    expect(text).toContain("## O que fiz");
    expect(text).toContain("## O que aconteceu");
    expect(text).toContain("Encontrei uma falha · severidade alta");
    expect(evaluateEvidence({ evidence: text, attachments: 0 }).passed).toBe(true);
  });

  test("omite seções vazias", () => {
    expect(composeEvidence({ ...emptyDelivery, observed: "Só isso aconteceu" })).toBe("## O que aconteceu\nSó isso aconteceu");
    expect(composeEvidence(emptyDelivery)).toBe("");
  });
});

test("draftFromChecklist numera os passos marcados na ordem do roteiro", () => {
  expect(draftFromChecklist(["A", "B", "C"], [2, 0])).toBe("1. A\n2. C");
});
