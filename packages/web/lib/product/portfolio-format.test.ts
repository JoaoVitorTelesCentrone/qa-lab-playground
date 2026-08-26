import { describe, expect, test } from "bun:test";
import { labs } from "@/lib/playground/catalog";
import { toEntries, toMarkdown } from "./portfolio-format";
import type { Submission } from "./journey";

const lab = labs[0];

const submission = (over: Partial<Submission> = {}): Submission => ({
  id: "1",
  labSlug: lab.slug,
  evidence: "O total exibido no resumo não bate com o valor cobrado.",
  attachments: [{ name: "resumo.png", url: "https://storage.test/resumo.png", path: "u/l/resumo.png", size: 2048, type: "image/png" }],
  published: true,
  createdAt: "2026-08-10T10:00:00Z",
  ...over,
});

describe("portfólio", () => {
  test("junta a evidência com o Lab do catálogo", () => {
    const [entry] = toEntries([submission()]);
    expect(entry.labTitle).toBe(lab.title);
    expect(entry.labNumber).toBe(lab.number);
  });

  test("evidência de um Lab que saiu do catálogo é descartada em vez de quebrar", () => {
    expect(toEntries([submission({ labSlug: "desafio-inexistente" })])).toEqual([]);
  });

  test("o Markdown traz título, a evidência e os anexos como link", () => {
    const markdown = toMarkdown(toEntries([submission()]), { name: "Ana" });
    expect(markdown).toContain("# Evidências de QA — Ana");
    expect(markdown).toContain(lab.title);
    expect(markdown).toContain("O total exibido no resumo");
    expect(markdown).toContain("[resumo.png](https://storage.test/resumo.png)");
  });

  test("entrega só com anexo não deixa a seção de evidência vazia no Markdown", () => {
    const markdown = toMarkdown(toEntries([submission({ evidence: "" })]), { name: "Ana" });
    expect(markdown).toContain("a evidência está nos anexos");
  });

  test("sem evidência, o Markdown ainda é um documento válido", () => {
    expect(toMarkdown([], { name: "Ana" })).toContain("0 evidência(s)");
  });
});
