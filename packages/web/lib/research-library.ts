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
  "software quality assurance",
  "software testing quality assurance",
  "test automation software quality",
  "defect prediction software quality",
  "requirements quality assurance software",
] as const;

export const researchLibrary = generatedLibrary as ResearchLibrary;

export function getRecentResearch(limit = 12) {
  return [...researchLibrary.items]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, limit);
}

export function getResearchStats() {
  const topics = new Set(researchLibrary.items.flatMap((item) => item.topics));
  const newest = getRecentResearch(1)[0];

  return {
    total: researchLibrary.items.length,
    topics: topics.size,
    sources: researchSources.length,
    newestDate: newest?.publishedAt ?? researchLibrary.updatedAt,
  };
}
