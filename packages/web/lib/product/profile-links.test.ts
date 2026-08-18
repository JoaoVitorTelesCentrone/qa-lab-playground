import { describe, expect, test } from "bun:test";
import { normalizeProfileLink, profileLinkHandle } from "./profile-links";

describe("links de perfil", () => {
  test("aceita a URL completa e canoniza para https sem query nem barra final", () => {
    expect(normalizeProfileLink("http://www.linkedin.com/in/joao/?utm_source=app", "linkedin")).toBe("https://www.linkedin.com/in/joao");
    expect(normalizeProfileLink("github.com/joao/", "github")).toBe("https://github.com/joao");
  });

  test("aceita só o nome de usuário, com ou sem arroba", () => {
    expect(normalizeProfileLink("@joao", "github")).toBe("https://github.com/joao");
    expect(normalizeProfileLink("joao-centrone", "linkedin")).toBe("https://linkedin.com/in/joao-centrone");
  });

  test("descarta link de outro serviço em vez de rotulá-lo errado", () => {
    expect(normalizeProfileLink("https://exemplo.com/joao", "github")).toBe("");
    expect(normalizeProfileLink("https://github.com/joao", "linkedin")).toBe("");
  });

  test("vazio continua vazio e host sem caminho não é perfil", () => {
    expect(normalizeProfileLink("   ", "github")).toBe("");
    expect(normalizeProfileLink("https://github.com", "github")).toBe("");
  });

  test("o handle mostrado é o caminho, sem host", () => {
    expect(profileLinkHandle("https://www.linkedin.com/in/joao")).toBe("in/joao");
    expect(profileLinkHandle("https://github.com/joao")).toBe("joao");
  });
});
