import { describe, expect, test } from "bun:test";
import researchCuration from "@/data/research-curation.json";
import { toolGuides } from "@/lib/tool-guides";
import { researchLibrary } from "@/lib/research-library";
import {
  filterLibrary,
  findReference,
  formatABNT,
  formatAPA,
  formatBibTeX,
  getEssentialReferences,
  getLibraryEntries,
  getLibraryStats,
  libraryTopics,
  readingPaths,
  references,
  relatedReferences,
} from "./reference-library";

const ref = (slug: string) => {
  const found = findReference(slug);
  if (!found) throw new Error(`referência ${slug} não existe`);
  return found;
};

describe("acervo curado", () => {
  test("slugs únicos, em kebab-case e sem colidir com /biblioteca/trilhas", () => {
    const slugs = references.map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(slugs).not.toContain("trilhas");
  });

  test("autoria é pessoa no formato 'Sobrenome, Prenome' ou organização", () => {
    for (const item of references) {
      expect(Boolean(item.authors?.length) !== Boolean(item.organization)).toBe(true);
      for (const name of item.authors ?? []) expect(name).toMatch(/^[^,]+, [^,]+$/);
    }
  });

  test("cada referência tem o conteúdo da página completo", () => {
    for (const item of references) {
      expect(item.summary.length).toBeGreaterThan(30);
      expect(item.why.length).toBeGreaterThan(120);
      expect(item.takeaways.length).toBeGreaterThanOrEqual(3);
      expect(item.inPractice.length).toBeGreaterThan(60);
      expect(item.topics.length).toBeGreaterThan(0);
      expect(item.url).toMatch(/^https?:\/\//);
      if (item.doi) {
        expect(item.doi).toMatch(/^10\.\d{4,}\//);
        expect(item.url).toBe(`https://doi.org/${item.doi}`);
      }
      if (item.kind === "artigo") expect(Boolean(item.doi) || item.slug === "what-does-product-quality-really-mean").toBe(true);
    }
  });

  test("ferramentas relacionadas existem em /ferramentas", () => {
    const guides = new Set(toolGuides.map((guide) => guide.slug));
    for (const item of references) for (const tool of item.tools ?? []) expect(guides.has(tool)).toBe(true);
  });

  test("researchId substitui um trabalho aprovado da pesquisa automática", () => {
    const approved = new Set(researchCuration.includedIds);
    const catalog = new Set(researchLibrary.items.map((item) => item.id));
    for (const item of references.filter((candidate) => candidate.researchId)) {
      expect(catalog.has(item.researchId!)).toBe(true);
      expect(approved.has(item.researchId!)).toBe(true);
    }
  });

  test("há essenciais de todos os tipos curados", () => {
    const kinds = new Set(getEssentialReferences().map((item) => item.kind));
    expect([...kinds].sort()).toEqual(["artigo", "guia", "livro", "norma"]);
  });

  test("leia também só sugere referências com tema em comum", () => {
    const base = ref("empirical-analysis-of-flaky-tests");
    const related = relatedReferences(base);
    expect(related.length).toBe(3);
    for (const other of related) {
      expect(other.slug).not.toBe(base.slug);
      expect(other.topics.some((topic) => base.topics.includes(topic))).toBe(true);
    }
  });
});

describe("trilhas de leitura", () => {
  test("cada passo aponta para uma referência existente, sem repetir na trilha", () => {
    const slugs = new Set(references.map((item) => item.slug));
    expect(new Set(readingPaths.map((path) => path.slug)).size).toBe(readingPaths.length);
    for (const path of readingPaths) {
      const refs = path.steps.map((step) => step.ref);
      expect(new Set(refs).size).toBe(refs.length);
      expect(refs.length).toBeGreaterThanOrEqual(5);
      for (const step of path.steps) {
        expect(slugs.has(step.ref)).toBe(true);
        expect(step.note.length).toBeGreaterThan(20);
      }
    }
  });
});

describe("catálogo unificado", () => {
  const entries = getLibraryEntries();

  test("junta curadoria e pesquisa sem duplicar o que a curadoria substitui", () => {
    const ids = entries.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    const superseded = references.flatMap((item) => item.researchId ? [item.researchId] : []);
    for (const id of superseded) expect(ids).not.toContain(id);
    const stats = getLibraryStats(entries);
    expect(stats.curated).toBe(references.length);
    expect(stats.byKind.pesquisa).toBe(researchCuration.includedIds.length - superseded.length);
    expect(stats.total).toBe(references.length + stats.byKind.pesquisa);
  });

  test("todo item tem tema conhecido", () => {
    const known = new Set(libraryTopics.map((topic) => topic.id));
    for (const entry of entries) {
      expect(entry.topics.length).toBeGreaterThan(0);
      expect(entry.topics.every((topic) => known.has(topic))).toBe(true);
    }
  });

  test("sem filtros, os essenciais abrem a lista e a pesquisa recente fecha", () => {
    const list = filterLibrary(entries);
    expect(list.length).toBe(entries.length);
    expect(list[0].essential).toBe(true);
    expect(list.at(-1)?.kind).toBe("pesquisa");
  });

  test("busca em português encontra títulos em inglês", () => {
    const flaky = filterLibrary(entries, { q: "testes instáveis" }).map((entry) => entry.id);
    expect(flaky).toContain("empirical-analysis-of-flaky-tests");
    expect(flaky).toContain("survey-of-flaky-tests");
    expect(filterLibrary(entries, { q: "cobertura" })[0].id).toBe("coverage-is-not-strongly-correlated");
    expect(filterLibrary(entries, { q: "10.1145/2635868.2635929" }).map((entry) => entry.id)).toEqual(["are-mutants-a-valid-substitute-for-real-faults"]);
  });

  test("filtros de tipo, tema, nível e acesso se combinam", () => {
    const books = filterLibrary(entries, { tipo: "livro" });
    expect(books.every((entry) => entry.kind === "livro")).toBe(true);
    const openSecurity = filterLibrary(entries, { tema: "seguranca", acesso: "aberto" });
    expect(openSecurity.length).toBeGreaterThan(0);
    expect(openSecurity.every((entry) => entry.topics.includes("seguranca") && entry.access === "aberto")).toBe(true);
    // Nível só existe no acervo curado.
    expect(filterLibrary(entries, { nivel: "iniciante" }).every((entry) => entry.kind !== "pesquisa" && entry.level === "iniciante")).toBe(true);
  });

  test("ordenação por ano nos dois sentidos", () => {
    const oldest = filterLibrary(entries, { ordem: "antigos" });
    expect(oldest[0].id).toBe("the-humble-programmer");
    const newest = filterLibrary(entries, { ordem: "recentes" });
    expect(newest[0].year).toBeGreaterThanOrEqual(newest.at(-1)!.year);
  });
});

describe("citações", () => {
  test("ABNT de livro com edição", () => {
    expect(formatABNT(ref("the-art-of-software-testing"))).toBe(
      "MYERS, Glenford J.; SANDLER, Corey; BADGETT, Tom. The Art of Software Testing. 3. ed. [S. l.]: Wiley, 2011. DOI: 10.1002/9781119202486.",
    );
  });

  test("ABNT de artigo em periódico e com mais de três autores", () => {
    expect(formatABNT(ref("the-humble-programmer"))).toBe(
      "DIJKSTRA, Edsger W. The Humble Programmer. Communications of the ACM, v. 15, n. 10, p. 859-866, 1972. DOI: 10.1145/355604.361591.",
    );
    expect(formatABNT(ref("empirical-analysis-of-flaky-tests"))).toStartWith("LUO, Qingzhou et al. An Empirical Analysis of Flaky Tests. In: Proceedings");
  });

  test("ABNT de norma e de guia online traz o acesso em", () => {
    expect(formatABNT(ref("wcag-2-2"))).toBe(
      "W3C. Web Content Accessibility Guidelines (WCAG) 2.2. World Wide Web Consortium (W3C Recommendation), 2023. Disponível em: https://www.w3.org/TR/WCAG22/. Acesso em: 23 nov. 2026.",
    );
  });

  test("APA 7 com iniciais e e-comercial", () => {
    expect(formatAPA(ref("coverage-is-not-strongly-correlated"))).toBe(
      "Inozemtseva, L., & Holmes, R. (2014). Coverage Is Not Strongly Correlated with Test Suite Effectiveness. In Proceedings of the 36th International Conference on Software Engineering (ICSE 2014) (pp. 435–445). https://doi.org/10.1145/2568225.2568271",
    );
    expect(formatAPA(ref("metamorphic-testing-review"))).toContain("Poon, P.-L.");
    expect(formatAPA(ref("introduction-to-software-testing"))).toBe(
      "Ammann, P., & Offutt, J. (2016). Introduction to Software Testing (2nd ed.). Cambridge University Press. https://doi.org/10.1017/9781316771273",
    );
  });

  test("BibTeX com tipo e chave certos", () => {
    const bib = formatBibTeX(ref("prioritizing-test-cases-for-regression-testing"));
    expect(bib).toStartWith("@article{rothermel2001prioritizing,");
    expect(bib).toContain("  pages = {929--948}");
    expect(bib).toContain("  author = {Rothermel, Gregg and Untch, Roland H. and Chu, Chengyun and Harrold, Mary Jean}");
    expect(formatBibTeX(ref("iso-iec-25010"))).toContain("  author = {{ISO/IEC}}");
  });
});
