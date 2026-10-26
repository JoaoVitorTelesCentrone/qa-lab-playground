import { describe, expect, test } from "bun:test";
import { buildGherkin } from "./gherkin";

describe("gerador de Gherkin", () => {
  test("preserva exemplos distintos e remove quebras de linha dentro dos passos", () => {
    const result = buildGherkin("Recuperação de senha", "Link válido por 15 minutos", [
      { id: "1", title: "Link válido", given: "uma conta ativa", when: "abro o link\n e defino uma senha", then: "consigo entrar" },
      { id: "2", title: "Link expirado", given: "um link expirado", when: "tento redefinir a senha", then: "recebo uma mensagem de expiração" },
    ]);
    expect(result).toContain("# language: pt\nFuncionalidade: Recuperação de senha");
    expect(result).toContain("Quando abro o link e defino uma senha");
    expect(result.match(/  Cenário:/g)).toHaveLength(2);
    expect(result).toContain("Então recebo uma mensagem de expiração");
  });

  test("não gera cenários incompletos", () => {
    expect(buildGherkin("Login", "", [{ id: "1", title: "Incompleto", given: "usuário", when: "", then: "entro" }])).toBe("");
  });
});
