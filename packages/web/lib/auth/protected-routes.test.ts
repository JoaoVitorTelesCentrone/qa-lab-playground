import { describe, expect, test } from "bun:test";
import { requestedPath, requiresAuthentication } from "./protected-routes";
import { ACCOUNTS_ENABLED } from "@/lib/product/features";

describe("requiresAuthentication", () => {
  test.each([
    "/mentoria/admin",
    "/mentoria/admin/cohorts",
    "/mentoria/app",
    "/mentoria/diagnostico",
    "/mentoria/encontros",
    "/mentoria/inscricao/status",
    "/mentoria/mentor",
    "/mentoria/mentor/turmas/demo",
    "/mentoria/semanas/1",
    "/boards/demo",
    "/boards/6a939b31-2ddc-45d7-b649-062ad33b24f8",
  ])("protege %s", (pathname) => {
    expect(requiresAuthentication(pathname)).toBe(true);
  });

  test("board e gerador de BDD usam a flag de contas", () => {
    expect(requiresAuthentication("/boards")).toBe(ACCOUNTS_ENABLED);
    expect(requiresAuthentication("/lab/bdd")).toBe(ACCOUNTS_ENABLED);
  });

  test.each([
    "/", "/login", "/cadastro", "/mentor", "/mentoria", "/mentoria/inscricao",
    "/mentoria/lista-de-interesse", "/mentoria/certificado/QAM-1234", "/mentoria/conteudo",
    "/mentoria/labs/requisitos", "/mentoria/performance", "/mentoria-aberta", "/conteudos", "/conteudo",
    "/conteudo/modulos/fundamentos", "/conteudo/broto", "/lab", "/lab/bdd-public",
  ])(
    "mantem %s publico",
    (pathname) => {
      expect(requiresAuthentication(pathname)).toBe(false);
    },
  );
});

test("preserva caminho e query para voltar depois do login", () => {
  expect(requestedPath("/conteudo/temas/api", "?aula=2&origem=email")).toBe(
    "/conteudo/temas/api?aula=2&origem=email",
  );
});
