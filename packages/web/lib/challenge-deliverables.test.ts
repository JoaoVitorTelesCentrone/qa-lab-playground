import { describe, expect, test } from "bun:test";
import { challengeChecklist, countCompletedStages, countDeliverables, emptyDeliverables, exportDeliverables, isChallengeReady, parseDeliverables, type ChallengeDeliverables } from "./challenge-deliverables";

function makeReady(): ChallengeDeliverables {
  return {
    bugs: Array.from({ length: 5 }, (_, index) => ({ id: `b${index}`, title: `Bug ${index}`, steps: "1", actual: "A", expected: "B", severity: "Alta" as const, evidence: "print.png" })),
    bdd: [{ id: "s1", feature: "Despesas", title: "Cenário", given: "x", when: "y", then: "z" }],
    e2e: [{ id: "e1", flow: "Cadastro", priority: "Alta", decision: "Automatizar", reason: "Crítico", assertions: "ok" }, { id: "e2", flow: "Relatório", priority: "Baixa", decision: "Manter manual", reason: "Instável", assertions: "ok" }],
    release: { decision: "Bloquear", rationale: "Os gates foram executados e há uma falha relevante no fluxo crítico. A evidência ainda não permite aceitar o risco de publicar esta versão.", residualRisk: "Usuários podem registrar despesas inválidas.", monitoring: "Acompanhar correção, rerodar a suíte e revisar a taxa de erro após a publicação.", gates: { Lint: "passed", "Testes unitários": "passed", "Integração/API": "passed", "E2E crítico": "failed", Acessibilidade: "passed" } },
  };
}

describe("entregáveis do desafio", () => {
  test("recupera uma estrutura vazia quando o armazenamento é inválido", () => expect(parseDeliverables("não é json")).toEqual(emptyDeliverables));
  test("preserva listas válidas e completa campos ausentes", () => expect(parseDeliverables('{"bugs":[]}')).toEqual({ bugs: [], bdd: [], e2e: [], release: null }));
  test("conta somente etapas que possuem ao menos uma entrega", () => expect(countCompletedStages({ bugs: [{ id: "1", title: "Bug", steps: "1", actual: "A", expected: "B", severity: "Alta" }], bdd: [], e2e: [{ id: "2", flow: "Login", priority: "Alta", decision: "Automatizar", reason: "Crítico", assertions: "Sucesso" }] })).toBe(2));
  test("exporta artefatos em formatos prontos para versionamento", () => {
    const result = exportDeliverables({ bugs: [{ id: "1", title: "Valor negativo", steps: "Cadastrar -10", actual: "Salva", expected: "Bloqueia", severity: "Alta", evidence: "video.mp4" }], bdd: [{ id: "2", feature: "Despesas", title: "Bloquear valor", given: "uma despesa", when: "informo valor negativo", then: "o cadastro é bloqueado" }], e2e: [{ id: "3", flow: "Cadastro", priority: "Alta", decision: "Automatizar", reason: "Crítico", assertions: "Mensagem e persistência" }] });
    expect(result.bugReports).toContain("BUG-001 — Valor negativo"); expect(result.bdd).toContain("Cenário: Bloquear valor"); expect(result.e2e).toContain("**Decisão:** Automatizar"); expect(result.release).toContain("Nenhuma decisão registrada");
  });
  test("a lista vazia não está pronta e tem todos os itens pendentes", () => { expect(isChallengeReady(emptyDeliverables)).toBe(false); expect(challengeChecklist(emptyDeliverables).every((check) => !check.done)).toBe(true); expect(countDeliverables(emptyDeliverables)).toBe(0); });
  test("uma entrega completa marca todos os critérios e fica pronta", () => { const ready = makeReady(); expect(isChallengeReady(ready)).toBe(true); expect(challengeChecklist(ready).every((check) => check.done)).toBe(true); expect(countDeliverables(ready)).toBe(9); });
  test("sem evidência em todos os bugs o critério de evidência falha", () => { const data = makeReady(); data.bugs[0] = { ...data.bugs[0], evidence: "" }; expect(isChallengeReady(data)).toBe(false); expect(challengeChecklist(data)[1].detail).toBe("4/5"); });
  test("sem nenhuma decisão manual o desafio não fica pronto", () => { const data = makeReady(); data.e2e = data.e2e.filter((item) => item.decision !== "Manter manual"); expect(isChallengeReady(data)).toBe(false); });
  test("gates não executados impedem a conclusão", () => { const data = makeReady(); data.release!.gates["E2E crítico"] = "not-run"; expect(isChallengeReady(data)).toBe(false); });
});
