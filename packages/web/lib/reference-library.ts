// Biblioteca de QA (/biblioteca): junta o acervo curado de content/references.ts
// (livros, artigos fundamentais, normas e guias) com a pesquisa recente aprovada em
// data/research-curation.json, num catálogo só, pesquisável e filtrável.

import {
  REFERENCES_CHECKED_AT,
  readingPaths,
  references,
  type LibraryReference,
  type ReadingPath,
  type ReferenceAccess,
  type ReferenceKind,
  type ReferenceLevel,
  type ReferenceTopic,
} from "@/content/references";
import {
  getAllResearch,
  normalizeResearchText,
  researchLibrary,
  researchThemeIds,
  summarizeAbstract,
  type ResearchThemeId,
  type ResearchWork,
} from "@/lib/research-library";

export type LibraryKind = ReferenceKind | "pesquisa";

export const libraryKinds: ReadonlyArray<{ id: LibraryKind; label: string; plural: string; description: string }> = [
  { id: "livro", label: "Livro", plural: "Livros", description: "Os livros que formaram a área e os que ensinam a praticar." },
  { id: "artigo", label: "Artigo", plural: "Artigos fundamentais", description: "Estudos que mudaram a forma de testar, com DOI conferido." },
  { id: "norma", label: "Norma", plural: "Normas e padrões", description: "ISO, W3C, OWASP, ISTQB e o corpo de conhecimento da engenharia de software." },
  { id: "guia", label: "Guia", plural: "Guias abertos", description: "Ensaios e relatórios gratuitos de quem pratica em escala." },
  { id: "pesquisa", label: "Pesquisa", plural: "Pesquisa recente", description: "Trabalhos acadêmicos recentes, monitorados em bases abertas e revisados um a um." },
];

export const libraryTopics: ReadonlyArray<{ id: ReferenceTopic; label: string }> = [
  { id: "fundamentos", label: "Fundamentos" },
  { id: "exploratorio", label: "Teste exploratório" },
  { id: "design", label: "Design de testes" },
  { id: "automacao", label: "Testes automatizados" },
  { id: "entrega", label: "CI/CD e entrega" },
  { id: "metricas", label: "Modelos e métricas de qualidade" },
  { id: "defeitos", label: "Defeitos e predição" },
  { id: "confiabilidade", label: "Confiabilidade e manutenibilidade" },
  { id: "seguranca", label: "Segurança" },
  { id: "acessibilidade", label: "Acessibilidade" },
  { id: "ia", label: "IA e testes" },
  { id: "processo", label: "Processo e garantia da qualidade" },
];

export const libraryLevels: ReadonlyArray<{ id: ReferenceLevel; label: string }> = [
  { id: "iniciante", label: "Iniciante" },
  { id: "intermediario", label: "Intermediário" },
  { id: "avancado", label: "Avançado" },
];

export const librarySorts = [
  { id: "relevancia", label: "Curadoria" },
  { id: "recentes", label: "Mais recentes" },
  { id: "antigos", label: "Mais antigos" },
] as const;
export type LibrarySort = (typeof librarySorts)[number]["id"];

export const kindLabel = (kind: LibraryKind) => libraryKinds.find((item) => item.id === kind)?.label ?? kind;
export const topicLabel = (topic: ReferenceTopic) => libraryTopics.find((item) => item.id === topic)?.label ?? topic;
export const levelLabel = (level: ReferenceLevel) => libraryLevels.find((item) => item.id === level)?.label ?? level;

// Os temas da pesquisa automática viram temas da biblioteca, para um filtro só.
const topicByResearchTheme: Record<ResearchThemeId, ReferenceTopic> = {
  produto: "metricas",
  garantia: "processo",
  testes: "automacao",
  modelo: "metricas",
  medicao: "metricas",
  manutenibilidade: "confiabilidade",
  defeitos: "defeitos",
  outros: "processo",
};

// ───────────────────────────── Nomes ─────────────────────────────

/** "Myers, Glenford J." → { family: "Myers", given: "Glenford J." } */
export function splitName(name: string) {
  const [family, given = ""] = name.split(",").map((part) => part.trim());
  return { family, given };
}

/** "Myers, Glenford J." → "Glenford J. Myers" */
export function displayName(name: string) {
  const { family, given } = splitName(name);
  return given ? `${given} ${family}` : family;
}

export function authorLine(ref: Pick<LibraryReference, "authors" | "organization">, max = 3) {
  if (!ref.authors?.length) return ref.organization ?? "";
  const names = ref.authors.map(displayName);
  if (names.length <= max) return names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} e ${names.at(-1)}`;
  return `${names.slice(0, max).join(", ")} et al.`;
}

// ───────────────────────────── Acervo curado ─────────────────────────────

const referenceBySlug = new Map(references.map((ref) => [ref.slug, ref]));

export function findReference(slug: string) {
  return referenceBySlug.get(slug);
}

export function findReadingPath(slug: string) {
  return readingPaths.find((path) => path.slug === slug);
}

export function pathReferences(path: ReadingPath) {
  return path.steps.flatMap((step) => {
    const ref = findReference(step.ref);
    return ref ? [{ ...step, reference: ref }] : [];
  });
}

/** Trilhas que passam por uma referência, com a posição dela em cada uma. */
export function pathsWithReference(slug: string) {
  return readingPaths.flatMap((path) => {
    const index = path.steps.findIndex((step) => step.ref === slug);
    return index >= 0 ? [{ path, position: index + 1, total: path.steps.length }] : [];
  });
}

/** Leituras próximas: mesmo tema, priorizando quem divide trilha, mais temas e as essenciais. */
export function relatedReferences(ref: LibraryReference, limit = 3) {
  const companions = new Set(readingPaths.filter((path) => path.steps.some((step) => step.ref === ref.slug)).flatMap((path) => path.steps.map((step) => step.ref)));
  return references
    .filter((other) => other.slug !== ref.slug)
    .map((other) => ({
      other,
      score: other.topics.filter((topic) => ref.topics.includes(topic)).length * 10
        + (companions.has(other.slug) ? 6 : 0) + (other.essential ? 2 : 0) + (other.kind !== ref.kind ? 1 : 0),
    }))
    .filter(({ score }) => score >= 10)
    .sort((a, b) => b.score - a.score || a.other.title.localeCompare(b.other.title))
    .slice(0, limit)
    .map(({ other }) => other);
}

export function getEssentialReferences() {
  const order: ReferenceKind[] = ["livro", "norma", "guia", "artigo"];
  return references
    .filter((ref) => ref.essential)
    .sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || a.year - b.year);
}

// ───────────────────────────── Catálogo unificado ─────────────────────────────

export type LibraryEntry = {
  id: string;
  kind: LibraryKind;
  title: string;
  authors: string;
  year: number;
  /** Data completa só existe na pesquisa automática; serve de desempate na ordenação. */
  publishedAt?: string;
  venue: string;
  topics: ReferenceTopic[];
  level?: ReferenceLevel;
  access?: ReferenceAccess;
  summary: string;
  doi?: string;
  href: string;
  external: boolean;
  essential: boolean;
};

function referenceEntry(ref: LibraryReference): LibraryEntry {
  return {
    id: ref.slug,
    kind: ref.kind,
    title: ref.subtitle && !ref.title.includes(":") ? `${ref.title}: ${ref.subtitle}` : ref.title,
    authors: authorLine(ref),
    year: ref.year,
    venue: ref.venue,
    topics: ref.topics,
    level: ref.level,
    access: ref.access,
    summary: ref.summary,
    doi: ref.doi,
    href: `/biblioteca/${ref.slug}`,
    external: false,
    essential: Boolean(ref.essential),
  };
}

function researchEntry(work: ResearchWork): LibraryEntry {
  const names = work.authors;
  return {
    id: work.id,
    kind: "pesquisa",
    title: work.title,
    authors: names.length > 3 ? `${names.slice(0, 3).join(", ")} et al.` : names.join(", "),
    year: work.year,
    publishedAt: work.publishedAt,
    venue: work.venue || work.source,
    topics: [...new Set(researchThemeIds(work).map((theme) => topicByResearchTheme[theme]))],
    access: work.source === "arXiv" ? "aberto" : undefined,
    summary: work.abstract ? summarizeAbstract(work.abstract, 240) : "",
    doi: work.doi || undefined,
    href: work.url,
    external: true,
    essential: false,
  };
}

const supersededResearchIds = new Set(references.flatMap((ref) => ref.researchId ? [ref.researchId] : []));

export function getLibraryEntries(): LibraryEntry[] {
  return [
    ...references.map(referenceEntry),
    ...getAllResearch().filter((work) => !supersededResearchIds.has(work.id)).map(researchEntry),
  ];
}

export function getLibraryStats(entries: LibraryEntry[] = getLibraryEntries()) {
  const byKind = Object.fromEntries(libraryKinds.map((kind) => [kind.id, entries.filter((entry) => entry.kind === kind.id).length])) as Record<LibraryKind, number>;
  const years = entries.map((entry) => entry.year);
  return {
    total: entries.length,
    curated: references.length,
    byKind,
    paths: readingPaths.length,
    open: entries.filter((entry) => entry.access === "aberto").length,
    oldestYear: Math.min(...years),
    newestYear: Math.max(...years),
    checkedAt: REFERENCES_CHECKED_AT,
    researchUpdatedAt: researchLibrary.updatedAt,
  };
}

// ───────────────────────────── Busca ─────────────────────────────

// Busca em português acha títulos em inglês.
const searchAliases: Record<string, string[]> = {
  qualidade: ["quality"],
  garantia: ["assurance"],
  teste: ["test"],
  testes: ["test"],
  automacao: ["automat"],
  automatizado: ["automat"],
  automatizados: ["automat"],
  defeito: ["defect", "bug", "fault"],
  defeitos: ["defect", "bug", "fault"],
  falha: ["fault", "failure"],
  falhas: ["fault", "failure"],
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
  exploratorio: ["explor"],
  exploratorios: ["explor"],
  instavel: ["flaky", "non-determinism"],
  instaveis: ["flaky", "non-determinism"],
  cobertura: ["coverage"],
  mutacao: ["mutant", "mutation"],
  mutantes: ["mutant"],
  seguranca: ["secur"],
  acessibilidade: ["accessib"],
  entrega: ["deliver"],
  continua: ["continuous"],
  continuo: ["continuous"],
  integracao: ["integration"],
  unidade: ["unit"],
  unitarios: ["unit"],
  inspecao: ["inspection"],
  regressao: ["regression"],
  priorizacao: ["prioritiz"],
  ia: ["llm", "language model", "artificial intelligence"],
  llm: ["language model"],
  norma: ["iso", "standard"],
  normas: ["iso", "standard"],
  livro: ["book"],
};

const stopwords = new Set(["a", "as", "o", "os", "de", "da", "das", "do", "dos", "e", "em", "para", "com", "the", "of", "and"]);

function searchTerms(query: string) {
  return normalizeResearchText(query)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((term) => term && !stopwords.has(term))
    .map((term) => [term, ...(searchAliases[term] ?? [])]);
}

function scoreEntry(entry: LibraryEntry, query: string, terms: string[][]) {
  const fields = [
    [entry.title, 20],
    [entry.authors, 12],
    [entry.topics.map(topicLabel).join(" "), 10],
    [entry.summary, 6],
    [entry.venue, 4],
    [entry.doi ?? "", 2],
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
  if (normalizeResearchText(entry.title).includes(query)) score += 50;
  // Com a mesma pontuação, o acervo curado vem antes da pesquisa automática.
  if (entry.kind !== "pesquisa") score += 5;
  if (entry.essential) score += 3;
  return score;
}

const kindOrder: LibraryKind[] = ["livro", "artigo", "norma", "guia", "pesquisa"];
const entryTime = (entry: LibraryEntry) => entry.publishedAt ? Date.parse(entry.publishedAt) : Date.UTC(entry.year, 0, 1);

function curatorialOrder(a: LibraryEntry, b: LibraryEntry) {
  if (a.essential !== b.essential) return a.essential ? -1 : 1;
  const kind = kindOrder.indexOf(a.kind) - kindOrder.indexOf(b.kind);
  if (kind) return kind;
  // Curadoria: do clássico ao recente. Pesquisa: do mais novo ao mais antigo.
  return a.kind === "pesquisa" ? entryTime(b) - entryTime(a) : a.year - b.year || a.title.localeCompare(b.title);
}

export type LibraryFilters = {
  q?: string;
  tipo?: LibraryKind | "todos";
  tema?: ReferenceTopic | "todos";
  nivel?: ReferenceLevel | "todos";
  acesso?: "aberto" | "todos";
  ordem?: LibrarySort;
};

export function filterLibrary(entries: LibraryEntry[], { q = "", tipo = "todos", tema = "todos", nivel = "todos", acesso = "todos", ordem = "relevancia" }: LibraryFilters = {}) {
  const query = normalizeResearchText(q.trim());
  const terms = searchTerms(query);
  const results = entries
    .filter((entry) =>
      (tipo === "todos" || entry.kind === tipo)
      && (tema === "todos" || entry.topics.includes(tema))
      && (nivel === "todos" || entry.level === nivel)
      && (acesso === "todos" || entry.access === acesso))
    .map((entry) => ({ entry, score: terms.length ? scoreEntry(entry, query, terms) : 1 }))
    .filter(({ score }) => score > 0);

  results.sort((a, b) => {
    if (ordem === "recentes") return entryTime(b.entry) - entryTime(a.entry);
    if (ordem === "antigos") return entryTime(a.entry) - entryTime(b.entry);
    return b.score - a.score || curatorialOrder(a.entry, b.entry);
  });
  return results.map(({ entry }) => entry);
}

export const isLibraryKind = (value: string | undefined): value is LibraryKind => libraryKinds.some((kind) => kind.id === value);
export const isLibraryTopic = (value: string | undefined): value is ReferenceTopic => libraryTopics.some((topic) => topic.id === value);
export const isLibraryLevel = (value: string | undefined): value is ReferenceLevel => libraryLevels.some((level) => level.id === value);
export const isLibrarySort = (value: string | undefined): value is LibrarySort => librarySorts.some((sort) => sort.id === value);

// ───────────────────────────── Citações ─────────────────────────────

const abntMonths = ["jan.", "fev.", "mar.", "abr.", "maio", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

function abntDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${abntMonths[month - 1]} ${year}`;
}

function fullTitle(ref: LibraryReference) {
  return ref.subtitle ? `${ref.title}: ${ref.subtitle}` : ref.title;
}

const ordinalEn = (n: number) => `${n}${n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th"}`;

function abntAuthors(ref: LibraryReference) {
  if (!ref.authors?.length) return (ref.organization ?? "").toLocaleUpperCase("pt-BR");
  const formatted = ref.authors.map((name) => {
    const { family, given } = splitName(name);
    return given ? `${family.toLocaleUpperCase("pt-BR")}, ${given}` : family.toLocaleUpperCase("pt-BR");
  });
  // NBR 6023:2018: até três autores, todos; quatro ou mais, pode-se usar et al.
  return formatted.length > 3 ? `${formatted[0]} et al` : formatted.join("; ");
}

const endsWithPunctuation = (text: string) => /[.?!]$/.test(text);
const sentence = (text: string) => endsWithPunctuation(text) ? text : `${text}.`;

/** Referência no formato ABNT NBR 6023:2018 (texto simples, sem negrito). */
export function formatABNT(ref: LibraryReference) {
  const parts = [sentence(abntAuthors(ref)), sentence(fullTitle(ref))];
  const online = `Disponível em: ${ref.url}. Acesso em: ${abntDate(REFERENCES_CHECKED_AT)}.`;
  const doi = ref.doi ? `DOI: ${ref.doi}.` : "";

  if (ref.kind === "artigo" && ref.proceedings) {
    parts.push(`In: ${ref.venue}, ${ref.year}.`);
    if (ref.pages) parts.push(`p. ${ref.pages}.`);
  } else if (ref.kind === "artigo") {
    const locator = [ref.venue, ref.volume && `v. ${ref.volume}`, ref.issue && `n. ${ref.issue}`, ref.pages && `p. ${ref.pages}`, String(ref.year)].filter(Boolean).join(", ");
    parts.push(`${locator}.`);
  } else if (ref.kind === "livro") {
    if (ref.edition) parts.push(`${ref.edition}. ed.`);
    parts.push(`[S. l.]: ${ref.venue}, ${ref.year}.`);
  } else {
    parts.push(`${ref.venue}, ${ref.year}.`);
  }

  if (doi) parts.push(doi);
  else if (ref.kind !== "livro" && ref.kind !== "artigo") parts.push(online);
  else if (ref.access === "aberto") parts.push(online);
  return parts.join(" ");
}

function apaAuthor(name: string) {
  const { family, given } = splitName(name);
  if (!given) return family;
  const initials = given
    .split(/\s+/)
    .map((part) => part.split("-").map((piece) => `${piece.replace(/\.$/, "").charAt(0)}.`).join("-"))
    .join(" ");
  return `${family}, ${initials}`;
}

function apaAuthors(ref: LibraryReference) {
  if (!ref.authors?.length) return ref.organization ?? "";
  const names = ref.authors.map(apaAuthor);
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")}, & ${names.at(-1)}`;
}

/** Referência no estilo APA 7 (texto simples, sem itálico). */
export function formatAPA(ref: LibraryReference) {
  const link = ref.doi ? `https://doi.org/${ref.doi}` : ref.url;
  const author = apaAuthors(ref);
  const head = `${sentence(author)} (${ref.year}). ${sentence(fullTitle(ref))}`;

  if (ref.kind === "artigo" && ref.proceedings) {
    return `${head} In ${ref.venue}${ref.pages ? ` (pp. ${ref.pages.replace("-", "–")})` : ""}. ${link}`;
  }
  if (ref.kind === "artigo") {
    const volume = ref.volume ? `, ${ref.volume}${ref.issue ? `(${ref.issue})` : ""}` : "";
    return `${head} ${ref.venue}${volume}${ref.pages ? `, ${ref.pages.replace("-", "–")}` : ""}. ${link}`;
  }
  if (ref.kind === "livro") {
    const edition = ref.edition ? ` (${ordinalEn(ref.edition)} ed.)` : "";
    return `${author}${endsWithPunctuation(author) ? "" : "."} (${ref.year}). ${fullTitle(ref)}${edition}. ${ref.venue}. ${link}`;
  }
  // Quando a autoria é a própria organização, a APA não repete o nome como editora.
  const publisher = ref.venue !== ref.organization ? ` ${sentence(ref.venue)}` : "";
  return `${head}${publisher} ${link}`;
}

function bibtexKey(ref: LibraryReference) {
  const first = ref.authors?.[0] ? splitName(ref.authors[0]).family : ref.organization ?? "ref";
  const word = fullTitle(ref).split(/\s+/).find((token) => token.length > 3) ?? "ref";
  const clean = (value: string) => normalizeResearchText(value).replace(/[^a-z0-9]/g, "");
  return `${clean(first)}${ref.year}${clean(word)}`;
}

const bibtexEscape = (value: string) => value.replace(/([&%$#_])/g, "\\$1");

/** Entrada BibTeX para Zotero, Mendeley, Overleaf e afins. */
export function formatBibTeX(ref: LibraryReference) {
  const type = ref.kind === "livro" ? "book" : ref.kind === "artigo" ? (ref.proceedings ? "inproceedings" : "article") : "misc";
  const fields: [string, string | undefined][] = [
    ["author", ref.authors?.length ? ref.authors.join(" and ") : ref.organization && `{${ref.organization}}`],
    ["title", `{${bibtexEscape(fullTitle(ref))}}`],
    ["year", String(ref.year)],
  ];
  if (type === "book") fields.push(["publisher", bibtexEscape(ref.venue)], ["edition", ref.edition ? String(ref.edition) : undefined]);
  if (type === "article") fields.push(["journal", bibtexEscape(ref.venue)], ["volume", ref.volume], ["number", ref.issue], ["pages", ref.pages?.replace("-", "--")]);
  if (type === "inproceedings") fields.push(["booktitle", bibtexEscape(ref.venue)], ["pages", ref.pages?.replace("-", "--")]);
  if (type === "misc") fields.push(["howpublished", bibtexEscape(ref.venue)], ["note", `Acesso em ${REFERENCES_CHECKED_AT}`]);
  fields.push(["doi", ref.doi], ["url", ref.doi ? undefined : ref.url]);

  const body = fields
    .filter((field): field is [string, string] => Boolean(field[1]))
    .map(([key, value]) => `  ${key} = {${value}}`)
    .join(",\n");
  return `@${type}{${bibtexKey(ref)},\n${body}\n}`;
}

export function citations(ref: LibraryReference) {
  return [
    { id: "abnt", label: "ABNT", text: formatABNT(ref) },
    { id: "apa", label: "APA", text: formatAPA(ref) },
    { id: "bibtex", label: "BibTeX", text: formatBibTeX(ref) },
  ] as const;
}

export { readingPaths, references, REFERENCES_CHECKED_AT };
export type { LibraryReference, ReadingPath, ReferenceKind, ReferenceLevel, ReferenceTopic, ReferenceAccess };
