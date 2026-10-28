import { describe, expect, test } from "bun:test";
import { requestedPath, requiresAuthentication } from "./protected-routes";

describe("requiresAuthentication", () => {
  test.each([
    "/mentoria",
    "/mentoria/app",
    "/mentoria/conteudo/1",
    "/conteudo",
    "/conteudo/modulos/fundamentos",
    "/boards",
    "/boards/demo",
    "/boards/6a939b31-2ddc-45d7-b649-062ad33b24f8",
    "/lab/bdd",
  ])("protege %s", (pathname) => {
    expect(requiresAuthentication(pathname)).toBe(true);
  });

  test.each(["/", "/login", "/cadastro", "/mentor", "/mentoria-aberta", "/conteudos", "/lab", "/lab/bdd-public"])(
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
