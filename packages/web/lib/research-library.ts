import generatedLibrary from "@/data/research-library.generated.json";

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

export const researchLibrary = generatedLibrary as ResearchLibrary;

const softwareQualityTerms = [
  "software quality",
  "quality of software",
  "software quality assurance",
  "software quality engineering",
  "software testing",
  "software test automation",
  "software defect",
  "defect prediction",
  "defect detection",
  "software reliability",
  "software maintainability",
  "code quality",
  "static analysis",
  "software verification",
  "software validation",
  "software regression testing",
  "software mutation testing",
  "software fault localization",
];

function isSoftwareQualityWork(work: ResearchWork) {
  if (work.source === "Curated") return true;

  const title = work.title.toLowerCase();
  const text = [title, work.abstract, work.venue].join(" ").toLowerCase();
  return title.includes("software") && softwareQualityTerms.some((term) => title.includes(term));
}

export function getSoftwareQualityResearch() {
  return researchLibrary.items.filter(isSoftwareQualityWork);
}

export function getRecentResearch(limit = 12) {
  return [...getSoftwareQualityResearch()]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, limit);
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
    sources: researchSources.length,
    newestDate: newest?.publishedAt ?? researchLibrary.updatedAt,
  };
}
