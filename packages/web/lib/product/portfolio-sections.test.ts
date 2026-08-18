import { describe, expect, it } from "bun:test";
import { moveSection, normalizeSectionBody, normalizeSectionTitle, SECTION_LIMITS, sortSections, visibleSections, type PortfolioSection } from "./portfolio-sections";

const section = (id: string, patch: Partial<PortfolioSection> = {}): PortfolioSection => ({
  id, title: id, body: "conteúdo", position: 0, visible: true, ...patch,
});

describe("normalizeSectionTitle", () => {
  it("colapsa espaços e corta no limite", () => {
    expect(normalizeSectionTitle("  Certificações   e   cursos ")).toBe("Certificações e cursos");
    expect(normalizeSectionTitle("a".repeat(90))).toHaveLength(SECTION_LIMITS.title);
  });
});

describe("normalizeSectionBody", () => {
  it("mantém parágrafos e remove excesso de linhas em branco", () => {
    expect(normalizeSectionBody("um\r\n\r\n\r\n\r\ndois")).toBe("um\n\ndois");
  });

  it("corta no limite do corpo", () => {
    expect(normalizeSectionBody("x".repeat(3000))).toHaveLength(SECTION_LIMITS.body);
  });
});

describe("sortSections", () => {
  it("ordena por posição e desempata por título", () => {
    const list = [section("b", { position: 1 }), section("c", { position: 0 }), section("a", { position: 0 })];
    expect(sortSections(list).map((item) => item.id)).toEqual(["a", "c", "b"]);
  });
});

describe("visibleSections", () => {
  it("esconde seção oculta e seção sem corpo", () => {
    const list = [
      section("publicada", { position: 0 }),
      section("oculta", { position: 1, visible: false }),
      section("vazia", { position: 2, body: "   " }),
    ];
    expect(visibleSections(list).map((item) => item.id)).toEqual(["publicada"]);
  });
});

describe("moveSection", () => {
  const list = [section("a", { position: 0 }), section("b", { position: 1 }), section("c", { position: 2 })];

  it("sobe e desce uma posição", () => {
    expect(moveSection(list, "c", -1)).toEqual(["a", "c", "b"]);
    expect(moveSection(list, "a", 1)).toEqual(["b", "a", "c"]);
  });

  it("ignora movimento fora dos limites", () => {
    expect(moveSection(list, "a", -1)).toEqual(["a", "b", "c"]);
    expect(moveSection(list, "c", 1)).toEqual(["a", "b", "c"]);
  });
});
