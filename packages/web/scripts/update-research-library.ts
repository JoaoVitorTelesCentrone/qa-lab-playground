import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type ResearchWork = {
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

type ResearchLibrary = {
  updatedAt: string;
  items: ResearchWork[];
};

type OpenAlexWork = {
  id: string;
  doi?: string | null;
  title?: string | null;
  display_name?: string | null;
  publication_date?: string | null;
  publication_year?: number | null;
  abstract_inverted_index?: Record<string, number[]> | null;
  primary_location?: {
    source?: { display_name?: string | null } | null;
    landing_page_url?: string | null;
  } | null;
  open_access?: { oa_url?: string | null } | null;
  authorships?: Array<{
    author?: { display_name?: string | null } | null;
  }>;
  concepts?: Array<{ display_name?: string | null; score?: number | null }>;
};

type CrossrefWork = {
  DOI?: string;
  URL?: string;
  title?: string[];
  abstract?: string;
  author?: Array<{ given?: string; family?: string; name?: string }>;
  published?: { "date-parts"?: number[][] };
  "published-print"?: { "date-parts"?: number[][] };
  "published-online"?: { "date-parts"?: number[][] };
  "container-title"?: string[];
  subject?: string[];
};

type SemanticScholarPaper = {
  paperId: string;
  title?: string;
  abstract?: string | null;
  year?: number | null;
  publicationDate?: string | null;
  venue?: string | null;
  url?: string | null;
  externalIds?: { DOI?: string; ArXiv?: string };
  fieldsOfStudy?: string[] | null;
  authors?: Array<{ name?: string | null }>;
};

const outputPath = resolve(process.cwd(), "data", "research-library.generated.json");
const queries = [
  "software quality assurance",
  "software testing quality assurance",
  "test automation software quality",
  "defect prediction software quality",
  "requirements quality assurance software",
];

const qaTerms = [
  "software quality",
  "software testing",
  "test automation",
  "defect prediction",
  "defect detection",
  "software defect",
  "bug report",
  "verification and validation",
  "software verification",
  "software validation",
  "requirements engineering",
  "software reliability",
  "regression testing",
  "quality engineering",
  "test case",
  "mutation testing",
  "fault localization",
];

const softwareContextTerms = [
  "software engineering",
  "software development",
  "software project",
  "software repository",
  "source code",
  "code quality",
  "ci/cd",
  "devops",
  "mlops",
  "programming language",
  "repository",
  "static analysis",
  "continuous integration",
];

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function reconstructAbstract(index?: Record<string, number[]> | null) {
  if (!index) return "";

  const words: Array<{ word: string; position: number }> = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const position of positions) words.push({ word, position });
  }

  return words
    .sort((a, b) => a.position - b.position)
    .map((entry) => entry.word)
    .join(" ");
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function dateFromParts(parts?: number[][]) {
  const first = parts?.[0];
  if (!first?.[0]) return "";
  const [year, month = 1, day = 1] = first;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function compactAuthors(authors: Array<string | null | undefined>) {
  return authors.map((author) => author?.trim()).filter((author): author is string => Boolean(author)).slice(0, 8);
}

function isRelevantText(parts: Array<string | null | undefined>) {
  const haystack = parts.filter(Boolean).join(" ").toLowerCase();
  return (
    qaTerms.some((term) => haystack.includes(term)) ||
    (haystack.includes("quality assurance") && softwareContextTerms.some((term) => haystack.includes(term)))
  );
}

function isRelevant(work: OpenAlexWork) {
  return isRelevantText([
    work.title,
    work.display_name,
    reconstructAbstract(work.abstract_inverted_index),
    ...(work.concepts ?? []).map((concept) => concept.display_name),
  ]);
}

function isRelevantLibraryItem(item: ResearchWork, today: string) {
  if (item.source === "Curated") return true;
  if (item.publishedAt > today) return false;

  return isRelevantText([item.title, item.abstract, item.venue, ...item.topics]);
}

function toResearchWork(work: OpenAlexWork, query: string, discoveredAt: string): ResearchWork | null {
  const title = work.title ?? work.display_name ?? "";
  if (!title) return null;

  const doi = work.doi ?? "";
  const url = work.open_access?.oa_url ?? work.primary_location?.landing_page_url ?? work.id;
  const publishedAt = work.publication_date ?? `${work.publication_year ?? new Date().getUTCFullYear()}-01-01`;
  const abstract = reconstructAbstract(work.abstract_inverted_index);
  const authors = (work.authorships ?? [])
    .map((authorship) => authorship.author?.display_name)
    .filter((author): author is string => Boolean(author))
    .slice(0, 8);
  const topics = (work.concepts ?? [])
    .filter((concept) => (concept.score ?? 0) > 0.35)
    .map((concept) => concept.display_name)
    .filter((topic): topic is string => Boolean(topic))
    .slice(0, 6);

  return {
    id: doi ? `doi-${normalizeKey(doi)}` : `openalex-${normalizeKey(work.id)}`,
    title,
    abstract: abstract || "Resumo nao disponivel na fonte indexada.",
    authors: authors.length ? authors : ["Autor nao informado"],
    year: work.publication_year ?? Number(publishedAt.slice(0, 4)),
    publishedAt,
    source: "OpenAlex",
    venue: work.primary_location?.source?.display_name ?? "",
    doi,
    url,
    topics: topics.length ? topics : ["unclassified"],
    query,
    discoveredAt,
  };
}

function toCrossrefWork(work: CrossrefWork, query: string, discoveredAt: string): ResearchWork | null {
  const title = decodeXml(work.title?.[0] ?? "");
  if (!title) return null;

  const publishedAt =
    dateFromParts(work.published?.["date-parts"]) ||
    dateFromParts(work["published-online"]?.["date-parts"]) ||
    dateFromParts(work["published-print"]?.["date-parts"]);
  if (!publishedAt) return null;

  const doi = work.DOI ? `https://doi.org/${work.DOI}` : "";
  const authors = compactAuthors(
    (work.author ?? []).map((author) => author.name ?? [author.given, author.family].filter(Boolean).join(" ")),
  );
  const abstract = decodeXml(work.abstract ?? "");
  const topics = (work.subject ?? []).slice(0, 6);

  return {
    id: doi ? `doi-${normalizeKey(doi)}` : `crossref-${normalizeKey(work.URL ?? title)}`,
    title,
    abstract: abstract || "Resumo nao disponivel na fonte indexada.",
    authors: authors.length ? authors : ["Autor nao informado"],
    year: Number(publishedAt.slice(0, 4)),
    publishedAt,
    source: "Crossref",
    venue: work["container-title"]?.[0] ?? "",
    doi,
    url: doi || work.URL || "",
    topics: topics.length ? topics : ["unclassified"],
    query,
    discoveredAt,
  };
}

function toSemanticScholarWork(paper: SemanticScholarPaper, query: string, discoveredAt: string): ResearchWork | null {
  const title = paper.title?.trim() ?? "";
  if (!title) return null;

  const doi = paper.externalIds?.DOI ? `https://doi.org/${paper.externalIds.DOI}` : "";
  const arxivUrl = paper.externalIds?.ArXiv ? `https://arxiv.org/abs/${paper.externalIds.ArXiv}` : "";
  const publishedAt = paper.publicationDate ?? `${paper.year ?? new Date().getUTCFullYear()}-01-01`;
  const authors = compactAuthors((paper.authors ?? []).map((author) => author.name));

  return {
    id: doi ? `doi-${normalizeKey(doi)}` : `semantic-${normalizeKey(paper.paperId)}`,
    title,
    abstract: paper.abstract?.trim() || "Resumo nao disponivel na fonte indexada.",
    authors: authors.length ? authors : ["Autor nao informado"],
    year: Number(publishedAt.slice(0, 4)),
    publishedAt,
    source: "Semantic Scholar",
    venue: paper.venue ?? "",
    doi,
    url: doi || arxivUrl || paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
    topics: paper.fieldsOfStudy?.length ? paper.fieldsOfStudy.slice(0, 6) : ["unclassified"],
    query,
    discoveredAt,
  };
}

function toArxivWorks(feed: string, query: string, discoveredAt: string): ResearchWork[] {
  const entries = [...feed.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);

  return entries
    .map((entry) => {
      const title = decodeXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
      const abstract = decodeXml(entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] ?? "");
      const id = decodeXml(entry.match(/<id>([\s\S]*?)<\/id>/)?.[1] ?? "");
      const publishedAt = decodeXml(entry.match(/<published>([\s\S]*?)<\/published>/)?.[1] ?? "").slice(0, 10);
      const authors = compactAuthors([...entry.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>\s*<\/author>/g)].map((match) => decodeXml(match[1])));
      const topics = [...entry.matchAll(/<category[^>]+term="([^"]+)"/g)].map((match) => decodeXml(match[1])).slice(0, 6);

      if (!title || !id || !publishedAt) return null;

      return {
        id: `arxiv-${normalizeKey(id)}`,
        title,
        abstract: abstract || "Resumo nao disponivel na fonte indexada.",
        authors: authors.length ? authors : ["Autor nao informado"],
        year: Number(publishedAt.slice(0, 4)),
        publishedAt,
        source: "arXiv",
        venue: "arXiv",
        doi: "",
        url: id,
        topics: topics.length ? topics : ["unclassified"],
        query,
        discoveredAt,
      } satisfies ResearchWork;
    })
    .filter((item): item is ResearchWork => Boolean(item));
}

async function loadLibrary(): Promise<ResearchLibrary> {
  const raw = await readFile(outputPath, "utf8");
  return JSON.parse(raw) as ResearchLibrary;
}

async function searchOpenAlex(query: string, fromDate: string, perPage: number) {
  const today = new Date().toISOString().slice(0, 10);
  const params = new URLSearchParams({
    search: query,
    filter: `from_publication_date:${fromDate},to_publication_date:${today}`,
    sort: "publication_date:desc",
    "per-page": String(perPage),
  });

  if (process.env.OPENALEX_MAILTO) {
    params.set("mailto", process.env.OPENALEX_MAILTO);
  }

  const response = await fetch(`https://api.openalex.org/works?${params.toString()}`, {
    headers: { "User-Agent": "QA Lab Research Updater (https://qa-lab-playground.vercel.app)" },
  });

  if (!response.ok) {
    throw new Error(`OpenAlex failed for "${query}": ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as { results?: OpenAlexWork[] };
  return payload.results ?? [];
}

async function searchCrossref(query: string, fromDate: string, perPage: number) {
  const today = new Date().toISOString().slice(0, 10);
  const params = new URLSearchParams({
    "query.bibliographic": query,
    filter: `from-pub-date:${fromDate},until-pub-date:${today}`,
    sort: "published",
    order: "desc",
    rows: String(perPage),
  });

  if (process.env.OPENALEX_MAILTO) {
    params.set("mailto", process.env.OPENALEX_MAILTO);
  }

  const response = await fetch(`https://api.crossref.org/works?${params.toString()}`, {
    headers: { "User-Agent": "QA Lab Research Updater (mailto:research@qa-lab.local)" },
  });

  if (!response.ok) {
    throw new Error(`Crossref failed for "${query}": ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as { message?: { items?: CrossrefWork[] } };
  return payload.message?.items ?? [];
}

async function searchSemanticScholar(query: string, fromDate: string, perPage: number) {
  const fromYear = fromDate.slice(0, 4);
  const params = new URLSearchParams({
    query,
    year: `${fromYear}-`,
    limit: String(Math.min(perPage, 100)),
    fields: "title,abstract,authors,year,publicationDate,venue,url,externalIds,fieldsOfStudy",
  });

  const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?${params.toString()}`, {
    headers: { "User-Agent": "QA Lab Research Updater (https://qa-lab-playground.vercel.app)" },
  });

  if (!response.ok) {
    throw new Error(`Semantic Scholar failed for "${query}": ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as { data?: SemanticScholarPaper[] };
  return payload.data ?? [];
}

async function searchArxiv(query: string, perPage: number) {
  const params = new URLSearchParams({
    search_query: `all:"${query}"`,
    start: "0",
    max_results: String(Math.min(perPage, 50)),
    sortBy: "submittedDate",
    sortOrder: "descending",
  });

  const response = await fetch(`https://export.arxiv.org/api/query?${params.toString()}`, {
    headers: { "User-Agent": "QA Lab Research Updater (https://qa-lab-playground.vercel.app)" },
  });

  if (!response.ok) {
    throw new Error(`arXiv failed for "${query}": ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function addIfNew(item: ResearchWork, existingKeys: Set<string>, additions: ResearchWork[]) {
  const keys = [item.id, item.doi && `doi-${normalizeKey(item.doi)}`, normalizeKey(item.url), normalizeKey(item.title)].filter(Boolean);
  if (keys.some((key) => existingKeys.has(key))) return;

  additions.push(item);
  keys.forEach((key) => existingKeys.add(key));
}

async function collectSource<T>(
  sourceName: string,
  query: string,
  fetcher: () => Promise<T[]>,
  mapper: (record: T) => ResearchWork | null,
  existingKeys: Set<string>,
  additions: ResearchWork[],
) {
  try {
    const records = await fetcher();
    for (const record of records) {
      const item = mapper(record);
      if (!item || !isRelevantLibraryItem(item, new Date().toISOString().slice(0, 10))) continue;
      addIfNew(item, existingKeys, additions);
    }
  } catch (error) {
    console.warn(`${sourceName} skipped for "${query}":`, error instanceof Error ? error.message : error);
  }
}

async function main() {
  const library = await loadLibrary();
  const discoveredAt = new Date().toISOString();
  const today = discoveredAt.slice(0, 10);
  const lookbackDays = Number(process.env.RESEARCH_LOOKBACK_DAYS ?? 14);
  const perPage = Number(process.env.RESEARCH_MAX_RESULTS_PER_QUERY ?? 20);
  const fromDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const existingKeys = new Set(
    library.items
      .filter((item) => isRelevantLibraryItem(item, today))
      .flatMap((item) => [item.id, item.doi && `doi-${normalizeKey(item.doi)}`, item.url && normalizeKey(item.url), normalizeKey(item.title)].filter(Boolean)),
  );
  const additions: ResearchWork[] = [];

  for (const query of queries) {
    await collectSource(
      "OpenAlex",
      query,
      () => searchOpenAlex(query, fromDate, perPage),
      (work) => (isRelevant(work) ? toResearchWork(work, query, discoveredAt) : null),
      existingKeys,
      additions,
    );

    await collectSource(
      "Crossref",
      query,
      () => searchCrossref(query, fromDate, perPage),
      (work) => toCrossrefWork(work, query, discoveredAt),
      existingKeys,
      additions,
    );

    await collectSource(
      "Semantic Scholar",
      query,
      () => searchSemanticScholar(query, fromDate, perPage),
      (paper) => toSemanticScholarWork(paper, query, discoveredAt),
      existingKeys,
      additions,
    );

    try {
      const feed = await searchArxiv(query, perPage);
      for (const item of toArxivWorks(feed, query, discoveredAt)) {
        if (!isRelevantLibraryItem(item, today)) continue;
        addIfNew(item, existingKeys, additions);
      }
    } catch (error) {
      console.warn(`arXiv skipped for "${query}":`, error instanceof Error ? error.message : error);
    }
  }

  const next: ResearchLibrary = {
    updatedAt: discoveredAt,
    items: [...additions, ...library.items.filter((item) => isRelevantLibraryItem(item, today))].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)),
  };

  await writeFile(outputPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`Research library updated: ${additions.length} new item(s), ${next.items.length} total.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
