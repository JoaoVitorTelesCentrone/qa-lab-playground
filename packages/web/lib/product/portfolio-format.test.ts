import { describe, expect, test } from "bun:test";
import { labs } from "@/lib/playground/catalog";
import { countBySeverity, toEntries, toMarkdown } from "./portfolio-format";
import type { Submission } from "./journey";

const lab = labs[0];

const submission = (over: Partial<Submission> = {}): Submission => ({
  id: "1",
  labSlug: lab.slug,
  result: "O total exibido no resumo não bate com o valor cobrado.",
  reproduction: "1. Abrir o checkout\n2. Aplicar o cupom QA10\n3. Comparar resumo e total",
  severity: "alta",
  checklist: ["Passos reproduziveis"],
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

  test("conta por severidade, da mais grave para a menos, sem listar zeradas", () => {
    const counts = countBySeverity([submission(), submission({ severity: "critica" }), submission({ severity: "alta" })]);
    expect(counts).toEqual([{ severity: "critica", total: 1 }, { severity: "alta", total: 2 }]);
  });

  test("o Markdown traz título, severidade, passos numerados e critérios", () => {
    const markdown = toMarkdown(toEntries([submission()]), { name: "Ana" });
    expect(markdown).toContain("# Evidências de QA — Ana");
    expect(markdown).toContain(lab.title);
    expect(markdown).toContain("**Severidade:** alta");
    expect(markdown).toContain("1. Abrir o checkout");
    expect(markdown).not.toContain("1. 1.");
    expect(markdown).toContain("- [x] Passos reproduziveis");
  });

  test("sem evidência, o Markdown ainda é um documento válido", () => {
    expect(toMarkdown([], { name: "Ana" })).toContain("0 evidência(s)");
  });
});
