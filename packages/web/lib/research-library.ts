import generatedLibrary from "@/data/research-library.generated.json";
import researchCuration from "@/data/research-curation.json";

export type ResearchWork = {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  year: number;
  publishedAt: string;
  source: string;
  venue: string;
  doi: string;
  url: string;
  topics: string[];
  query: string;
  discoveredAt: string;
};

export type ResearchLibrary = {
  updatedAt: string;
  items: ResearchWork[];
};

export const researchSources = [
  {
    name: "OpenAlex",
    description: "Indice academico aberto para artigos, proceedings, repositorios e fontes cientificas.",
    url: "https://openalex.org/",
  },
  {
    name: "Crossref",
    description: "Metadados DOI de editoras academicas, journals, conferencias e proceedings.",
    url: "https://www.crossref.org/",
  },
  {
    name: "Semantic Scholar",
    description: "Busca academica com foco em computacao, citacoes, abstracts e areas de estudo.",
    url: "https://www.semanticscholar.org/",
  },
  {
    name: "arXiv",
    description: "Preprints de computacao e engenharia de software antes da publicacao formal.",
    url: "https://arxiv.org/",
  },
  {
    name: "IEEE Xplore",
    description: "Fonte top para engenharia de software, testes, qualidade e conferencias tecnicas.",
    url: "https://ieeexplore.ieee.org/",
  },
  {
    name: "ACM Digital Library",
    description: "Fonte top para pesquisa em computacao, software engineering e testes.",
    url: "https://dl.acm.org/",
  },
  {
    name: "SpringerLink",
    description: "Livros, journals e proceedings em engenharia de software e qualidade.",
    url: "https://link.springer.com/",
  },
  {
    name: "ScienceDirect",
    description: "Journals de engenharia de software, sistemas e qualidade publicados pela Elsevier.",
    url: "https://www.sciencedirect.com/",
  },
  {
    name: "ISO/IEC e SWEBOK",
    description: "Standards e referencias-base para modelos de qualidade e corpo de conhecimento.",
    url: "https://www.computer.org/education/bodies-of-knowledge/software-engineering",
  },
  {
    name: "Curadoria QA Lab",
    description: "Selecao manual para manter standards e textos essenciais sempre visiveis.",
    url: "/pesquisa",
  },
] as const;

export const researchQueries = [
  "software product quality",
  "software quality assurance",
  "software quality model",
  "software quality measurement",
  "software maintainability reliability",
  "software defect prediction",
] as const;

export type ResearchThemeId =
  | "produto"
  | "garantia"
  | "testes"
  | "modelo"
  | "medicao"
  | "manutenibilidade"
  | "defeitos"
  | "outros";

export const researchThemes: ReadonlyArray<{ id: ResearchThemeId; label: string }> = [
  { id: "produto", label: "Qualidade de produto" },
  { id: "garantia", label: "Garantia da qualidade" },
  { id: "testes", label: "Testes e automação" },
  { id: "modelo", label: "Modelos de qualidade" },
  { id: "medicao", label: "Medição de qualidade" },
  { id: "manutenibilidade", label: "Manutenibilidade e confiabilidade" },
  { id: "defeitos", label: "Defeitos e predição" },
  { id: "outros", label: "Outros temas" },
];

const researchThemeByQuery: Record<string, ResearchThemeId> = {
  "software product quality": "produto",
  "software quality assurance": "garantia",
  "software quality model": "modelo",
  "software quality measurement": "medicao",
  "software maintainability reliability": "manutenibilidade",
  "software defect prediction": "defeitos",
};

export function researchThemeIds(work: Pick<ResearchWork, "id" | "query">): ResearchThemeId[] {
  const reviewed = researchCuration.themeIdsByWorkId[work.id as keyof typeof researchCuration.themeIdsByWorkId];
  return reviewed ? reviewed as ResearchThemeId[] : [researchThemeByQuery[work.query] ?? "outros"];
}

export function researchThemeId(work: Pick<ResearchWork, "id" | "query">): ResearchThemeId {
  return researchThemeIds(work)[0];
}

export function researchThemeLabel(id: ResearchThemeId) {
  return researchThemes.find((theme) => theme.id === id)?.label ?? "Outros temas";
}

export function normalizeResearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

const researchSearchAliases: Record<string, string[]> = {
  qualidade: ["quality"],
  garantia: ["assurance"],
  teste: ["test"],
  testes: ["test"],
  automacao: ["automat"],
  defeito: ["defect", "bug", "fault"],
  defeitos: ["defect", "bug", "fault"],
  predicao: ["predict"],
  confiabilidade: ["reliab"],
  manutenibilidade: ["maintainab"],
  medicao: ["measur"],
  metrica: ["metric"],
  metricas: ["metric"],
  modelo: ["model"],
  modelos: ["model"],
  verificacao: ["verif"],
  validacao: ["valid"],
  bug: ["defect", "fault"],
  bugs: ["defect", "fault"],
};

const researchSearchStopwords = new Set(["a", "as", "o", "os", "de", "da", "das", "do", "dos", "e", "em", "para", "com"]);

function researchSearchTerms(query: string) {
  return normalizeResearchText(query)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((term) => term && !researchSearchStopwords.has(term))
    .map((term) => [term, ...(researchSearchAliases[term] ?? [])]);
}

function researchSearchScore(work: ResearchWork, query: string, terms: string[][]) {
  const fields = [
    [work.title, 20],
    [work.authors.join(" "), 12],
    [researchThemeIds(work).map(researchThemeLabel).join(" "), 10],
    [work.doi, 2],
    [work.url, 2],
  ] as const;
  const normalized = fields.map(([value, weight]) => [normalizeResearchText(value), weight] as const);
  let score = 0;

  for (const variants of terms) {
    const match = normalized
      .filter(([value]) => variants.some((variant) => value.includes(variant)))
      .reduce((best, [, weight]) => Math.max(best, weight), 0);
    if (!match) return 0;
    score += match;
  }

  if (normalizeResearchText(work.title).includes(query)) score += 50;
  return score;
}

export type ResearchFilters = {
  q?: string;
  tema?: ResearchThemeId | "todos";
  ano?: number | "todos";
};

export function filterResearchWorks(
  items: ResearchWork[],
  { q = "", tema = "todos", ano = "todos" }: ResearchFilters = {},
) {
  const query = normalizeResearchText(q.trim());
  const terms = researchSearchTerms(query);
  const results = items
    .filter((item) => (tema === "todos" || researchThemeIds(item).includes(tema)) && (ano === "todos" || item.year === ano))
    .map((item) => ({ item, score: terms.length ? researchSearchScore(item, query, terms) : 1 }))
    .filter(({ score }) => score > 0);

  if (terms.length) results.sort((a, b) => b.score - a.score || Date.parse(b.item.publishedAt) - Date.parse(a.item.publishedAt));
  return results.map(({ item }) => item);
}

export const researchLibrary = generatedLibrary as ResearchLibrary;

const approvedResearchIds = new Set<string>(researchCuration.includedIds);

export function getSoftwareQualityResearch() {
  return researchLibrary.items.filter((work) => approvedResearchIds.has(work.id));
}

export function getAllResearch() {
  return [...getSoftwareQualityResearch()].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}

export function getResearchYears(items: ResearchWork[] = getAllResearch()) {
  return [...new Set(items.map((item) => item.year))].sort((a, b) => b - a);
}

export function getRecentResearch(limit = 12) {
  return getAllResearch().slice(0, limit);
}

/**
 * Encurta um abstract para caber num tooltip. Os abstracts da biblioteca têm
 * ~1850 caracteres na mediana: inteiros viram um paredão que ninguém lê.
 *
 * Corta na última frase que couber, para o resumo terminar em ponto final em
 * vez de no meio de uma palavra. Se nenhuma frase couber (abstract de uma
 * sentença longa), cai para o último espaço antes do limite.
 */
export function summarizeAbstract(abstract: string, maxChars = 300) {
  const text = abstract.replace(/\s+/g, " ").trim();
  if (text.length <= maxChars) return text;

  const window = text.slice(0, maxChars);
  const lastSentence = Math.max(window.lastIndexOf(". "), window.lastIndexOf("? "), window.lastIndexOf("! "));
  // Só vale cortar por frase se sobrar resumo de verdade — senão fica um
  // fragmento curto demais e o corte por palavra informa mais.
  if (lastSentence > maxChars * 0.5) return window.slice(0, lastSentence + 1);

  const lastSpace = window.lastIndexOf(" ");
  return `${window.slice(0, lastSpace > 0 ? lastSpace : maxChars).trimEnd()}…`;
}

export function getResearchStats() {
  const items = getSoftwareQualityResearch();
  const topics = new Set(items.flatMap((item) => item.topics));
  const newest = getRecentResearch(1)[0];

  return {
    total: items.length,
    topics: topics.size,
    sources: new Set(items.map((item) => item.source)).size,
    newestDate: newest?.publishedAt ?? researchLibrary.updatedAt,
  };
}
