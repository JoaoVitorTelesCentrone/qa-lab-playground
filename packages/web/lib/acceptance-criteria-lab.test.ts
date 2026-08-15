import { describe, expect, test } from "bun:test";
import { acceptanceItems, buildAcceptanceDraft, scoreAcceptanceSubmission } from "./acceptance-criteria-lab";

describe("Acceptance Criteria Lab", () => {
  test("gera muitos itens ambíguos para praticar", () => {
    expect(acceptanceItems.length).toBeGreaterThanOrEqual(150);
    expect(new Set(acceptanceItems.map((item) => item.id)).size).toBe(acceptanceItems.length);
  });

  test("bloqueia critérios fracos", () => {
    const item = acceptanceItems[0];
    const result = scoreAcceptanceSubmission(item, { criteria: "funcionar", examples: "", edgeCases: "", questions: "", notes: "" });
    expect(result.ready).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
  });

  test("aprova critérios testáveis com exemplos e perguntas", () => {
    const item = acceptanceItems[0];
    const result = scoreAcceptanceSubmission(item, {
      criteria: "Dado um usuario autorizado, quando concluir a acao, entao o sistema salva e mostra sucesso\nDado um usuario sem permissao, quando acessar a acao, entao o sistema bloqueia\nDado dados invalidos, quando tentar salvar, entao campos invalidos sao indicados\nDado uma falha de processamento, quando ocorrer erro, entao a operacao nao altera o estado anterior",
      examples: "Exemplo valido com usuario gestor\nExemplo invalido com usuario sem permissao",
      edgeCases: `${item.hiddenRisks[0]} no limite do fluxo`,
      questions: "Qual perfil exato pode executar essa acao?",
      notes: "Notas de QA conectando regra de negocio, permissao, estado invalido e validacao para orientar desenvolvimento e testes.",
    });
    expect(result.ready).toBe(true);
  });

  test("gera rascunho de critérios", () => {
    const item = acceptanceItems[0];
    const draft = buildAcceptanceDraft(item, { criteria: "Dado x\nQuando y\nEntao z\nDado a", examples: "ex1\nex2", edgeCases: "edge", questions: "pergunta", notes: "observacao longa para QA e produto revisarem antes de desenvolver" });
    expect(draft.content).toContain("## Criterios de aceite");
  });
});