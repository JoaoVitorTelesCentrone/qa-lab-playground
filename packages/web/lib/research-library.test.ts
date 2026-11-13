import { describe, expect, test } from "bun:test";
import researchCuration from "@/data/research-curation.json";
import {
  filterResearchWorks,
  getAllResearch,
  getResearchStats,
  getResearchYears,
  researchThemeId,
  researchThemeIds,
  researchThemes,
  researchLibrary,
  type ResearchWork,
} from "./research-library";

function work(overrides: Partial<ResearchWork> = {}): ResearchWork {
  return {
    id: "work-1",
    title: "Software quality assurance in practice",
    abstract: "A study about software quality and testing.",
    authors: ["Ada Lovelace"],
    year: 2026,
    publishedAt: "2026-01-01",
    source: "OpenAlex",
    venue: "Journal of Software Quality",
    doi: "10.1000/example",
    url: "https://example.com/work-1",
    topics: ["Software quality"],
    query: "software quality assurance",
    discoveredAt: "2026-01-02",
    ...overrides,
  };
}

describe("biblioteca de pesquisa", () => {
  test("cada registro do catálogo tem uma decisão editorial única", () => {
    const approved = new Set(researchCuration.includedIds);
    const notSelected = new Set(researchCuration.notSelectedIds);
    const excluded = new Set(researchCuration.excluded.map((item) => item.id));
    const catalog = new Set(researchLibrary.items.map((item) => item.id));

    expect(catalog.size).toBe(researchLibrary.items.length);
    expect(approved.size).toBe(researchCuration.includedIds.length);
    expect(notSelected.size).toBe(researchCuration.notSelectedIds.length);
    expect(excluded.size).toBe(researchCuration.excluded.length);
    expect([...approved].some((id) => excluded.has(id) || notSelected.has(id))).toBe(false);
    expect([...notSelected].some((id) => excluded.has(id))).toBe(false);
    expect(new Set([...approved, ...notSelected, ...excluded])).toEqual(catalog);
    expect(new Set(getAllResearch().map((item) => item.id))).toEqual(approved);
  });

  test("mapeia todas as consultas para um tema conhecido", () => {
    const ids = new Set(researchThemes.map((theme) => theme.id));
    for (const item of getAllResearch()) {
      expect(researchThemeIds(item).length).toBeGreaterThan(0);
      expect(researchThemeIds(item).every((id) => ids.has(id))).toBe(true);
    }
  });

  test("todos os selecionados têm classificação editorial própria", () => {
    expect(Object.keys(researchCuration.themeIdsByWorkId).sort()).toEqual([...researchCuration.includedIds].sort());
    for (const item of getAllResearch()) expect(researchThemeId(item)).not.toBe("outros");
  });

  test("busca ignora caixa e acentos", () => {
    const items = [
      work({ id: "qualidade", title: "Qualidade de software" }),
      work({ id: "defect", title: "Defect prediction", abstract: "Predicting faulty modules.", venue: "Research Journal", query: "software defect prediction" }),
    ];
    expect(filterResearchWorks(items, { q: "QUALIDADE" }).map((item) => item.id)).toEqual(["qualidade"]);
    expect(filterResearchWorks(items, { q: "defect" }).map((item) => item.id)).toEqual(["defect"]);
  });

  test("filtra por tema e ano", () => {
    const items = [
      work({ id: "defeitos", query: "software defect prediction", year: 2026 }),
      work({ id: "garantia", query: "software quality assurance", year: 2024 }),
      work({ id: "outros", query: "defect prediction software quality", year: 2024 }),
    ];
    expect(filterResearchWorks(items, { tema: "defeitos" }).map((item) => item.id)).toEqual(["defeitos"]);
    expect(filterResearchWorks(items, { ano: 2024 }).map((item) => item.id)).toEqual(["garantia", "outros"]);
    expect(filterResearchWorks(items, { tema: "outros", ano: 2024 }).map((item) => item.id)).toEqual(["outros"]);
  });

  test("tema usa o assunto revisado, não a consulta que encontrou o trabalho", () => {
    const misclassifiedByQuery = getAllResearch().find((item) => item.title.startsWith("Empirical insights on the use of large language models"));
    expect(misclassifiedByQuery).toBeDefined();
    expect(researchThemeIds(misclassifiedByQuery!)).toContain("testes");
    expect(researchThemeIds(misclassifiedByQuery!)).not.toContain("manutenibilidade");
  });

  test("busca não devolve um artigo só porque sua consulta de descoberta contém o termo", () => {
    const items = [work({ title: "A study of software testing", abstract: "Test cases and test automation.", query: "software defect prediction" })];
    expect(filterResearchWorks(items, { q: "defect prediction" })).toEqual([]);
  });

  test("busca em português encontra o assunto em inglês sem trazer menções incidentais do resumo", () => {
    const items = [
      work({ id: "abstract", title: "Another study", abstract: "Software defect prediction is discussed." }),
      work({ id: "title", title: "Software Defect Prediction", abstract: "A study of classification." }),
    ];
    expect(filterResearchWorks(items, { q: "predição de defeitos" }).map((item) => item.id)).toEqual(["title"]);
  });

  test("anos aparecem do mais recente para o mais antigo", () => {
    expect(getResearchYears([work({ year: 2024 }), work({ year: 2026 }), work({ year: 2025 })])).toEqual([2026, 2025, 2024]);
  });

  test("as estatísticas usam a biblioteca completa", () => {
    const all = getAllResearch();
    expect(all.length).toBeGreaterThan(12);
    expect(getResearchStats().total).toBe(all.length);
  });
});
