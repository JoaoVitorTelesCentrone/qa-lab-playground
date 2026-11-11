import { describe, expect, test } from "bun:test";
import { parseFrontmatter, readingMinutes } from "./frontmatter";

describe("parseFrontmatter", () => {
  test("lê strings, listas e booleanos e separa o corpo", () => {
    const { data, body } = parseFrontmatter('---\ntitle: "Bug mode: on"\nsummary: Sem aspas\ntags: [qa, "api"]\ndraft: true\ndate: 2026-11-09\n---\n# Olá\n');
    expect(data).toEqual({ title: "Bug mode: on", summary: "Sem aspas", tags: ["qa", "api"], draft: true, date: "2026-11-09" });
    expect(body).toBe("# Olá\n");
  });

  test("sem frontmatter devolve o texto inteiro", () => {
    expect(parseFrontmatter("# Só corpo")).toEqual({ data: {}, body: "# Só corpo" });
  });

  test("aceita quebras de linha do Windows", () => {
    expect(parseFrontmatter("---\r\ntitle: X\r\n---\r\ncorpo").data.title).toBe("X");
  });
});

describe("readingMinutes", () => {
  test("200 palavras por minuto, mínimo 1, sem contar blocos de código", () => {
    expect(readingMinutes("uma frase curta")).toBe(1);
    expect(readingMinutes(Array(1000).fill("palavra").join(" "))).toBe(5);
    expect(readingMinutes("texto\n```\n" + Array(2000).fill("code").join(" ") + "\n```")).toBe(1);
  });
});
