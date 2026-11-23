import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDown, ArrowRight, Search, X } from "lucide-react";
import { Byline } from "@/components/authority/byline";
import { EntryRow, KindBadge, ReferenceCard, focusRing, kickerClass, kindStyle } from "@/components/biblioteca/library-ui";
import { researchSources } from "@/lib/research-library";
import {
  filterLibrary,
  getEssentialReferences,
  getLibraryEntries,
  getLibraryStats,
  isLibraryKind,
  isLibraryLevel,
  isLibrarySort,
  isLibraryTopic,
  levelLabel,
  libraryKinds,
  libraryLevels,
  librarySorts,
  libraryTopics,
  pathReferences,
  readingPaths,
  topicLabel,
  type LibraryFilters,
  type ReferenceLevel,
  type ReferenceTopic,
} from "@/lib/reference-library";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 12;
const LOAD_MORE_STEP = 24;

type SearchParams = Record<"q" | "tipo" | "tema" | "nivel" | "acesso" | "ordem" | "visiveis", string | string[] | undefined>;

const orEmpty = (value: string) => value === "todos" ? "" : value;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

type ParsedFilters = Required<LibraryFilters> & { visible: number };

function parseFilters(params: Partial<SearchParams>, total: number): ParsedFilters {
  const tipo = first(params.tipo);
  const tema = first(params.tema);
  const nivel = first(params.nivel);
  const ordem = first(params.ordem);
  const visible = Number.parseInt(first(params.visiveis) ?? "", 10);
  return {
    q: (first(params.q) ?? "").trim().slice(0, 120),
    tipo: isLibraryKind(tipo) ? tipo : "todos",
    tema: isLibraryTopic(tema) ? tema : "todos",
    nivel: isLibraryLevel(nivel) ? nivel : "todos",
    acesso: first(params.acesso) === "aberto" ? "aberto" : "todos",
    ordem: isLibrarySort(ordem) ? ordem : "relevancia",
    visible: Number.isFinite(visible) ? Math.min(Math.max(visible, INITIAL_VISIBLE), total) : INITIAL_VISIBLE,
  };
}

function libraryHref(filters: Partial<ParsedFilters>) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.tipo && filters.tipo !== "todos") params.set("tipo", filters.tipo);
  if (filters.tema && filters.tema !== "todos") params.set("tema", filters.tema);
  if (filters.nivel && filters.nivel !== "todos") params.set("nivel", filters.nivel);
  if (filters.acesso === "aberto") params.set("acesso", "aberto");
  if (filters.ordem && filters.ordem !== "relevancia") params.set("ordem", filters.ordem);
  if (filters.visible && filters.visible > INITIAL_VISIBLE) params.set("visiveis", String(filters.visible));
  const query = params.toString();
  return `/biblioteca${query ? `?${query}` : ""}#acervo`;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<Partial<SearchParams>> }): Promise<Metadata> {
  const params = await searchParams;
  // Filtros geram combinações demais para indexar: canonical na biblioteca inteira.
  const hasFilters = Object.values(params).some((value) => first(value));
  return {
    title: "Biblioteca de QA",
    description: "Livros, artigos fundamentais, normas, guias abertos e pesquisa recente sobre qualidade de software e testes, com trilhas de leitura e citações prontas.",
    alternates: { canonical: "/biblioteca" },
    ...(hasFilters ? { robots: { index: false, follow: true } } : {}),
  };
}

const fieldClass = "min-h-11 w-full border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** `value` vazio seleciona a opção "todos" (`allLabel`), que não vai para a URL. */
function FilterSelect({ id, name, label, value, allLabel, options }: { id: string; name: string; label: string; value: string; allLabel?: string; options: { id: string; label: string; count?: number }[] }) {
  return <label htmlFor={id} className="grid gap-1.5 text-sm font-medium text-foreground">
    {label}
    <select id={id} name={name} defaultValue={value} className={fieldClass}>
      {allLabel && <option value="">{allLabel}</option>}
      {options.map((option) => <option key={option.id} value={option.id}>{option.label}{option.count !== undefined ? ` (${option.count})` : ""}</option>)}
    </select>
  </label>;
}

export default async function BibliotecaPage({ searchParams }: { searchParams: Promise<Partial<SearchParams>> }) {
  const params = await searchParams;
  const entries = getLibraryEntries();
  const stats = getLibraryStats(entries);
  const filters = parseFilters(params, entries.length);
  const { visible, ...criteria } = filters;

  const filtered = filterLibrary(entries, criteria);
  const shown = filtered.slice(0, visible);
  const hasFilters = Boolean(criteria.q) || criteria.tipo !== "todos" || criteria.tema !== "todos" || criteria.nivel !== "todos" || criteria.acesso !== "todos";
  const essentials = getEssentialReferences();
  const essentialEntries = essentials.map((ref) => entries.find((entry) => entry.id === ref.slug)!).filter(Boolean);

  const topicOptions = libraryTopics
    .map((topic) => ({ ...topic, count: entries.filter((entry) => entry.topics.includes(topic.id)).length }))
    .filter((topic) => topic.count > 0);
  const kindOptions = libraryKinds.map((kind) => ({ id: kind.id, label: kind.plural, count: stats.byKind[kind.id] }));

  const count = filtered.length === 1 ? "1 referência" : `${filtered.length} referências`;
  const details = [
    criteria.q ? `para “${criteria.q}”` : "",
    criteria.tipo !== "todos" ? `em ${libraryKinds.find((kind) => kind.id === criteria.tipo)?.plural.toLowerCase()}` : "",
    criteria.tema !== "todos" ? `sobre ${topicLabel(criteria.tema as ReferenceTopic).toLowerCase()}` : "",
    criteria.nivel !== "todos" ? `de nível ${levelLabel(criteria.nivel as ReferenceLevel).toLowerCase()}` : "",
    criteria.acesso === "aberto" ? "com acesso aberto" : "",
  ].filter(Boolean).join(" ");
  const resultLabel = filtered.length === 0
    ? "Nenhuma referência encontrada"
    : hasFilters ? `${count} ${filtered.length === 1 ? "encontrada" : "encontradas"}` : `${count} no acervo`;

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
    {/* ── Abertura ── */}
    <header className="border-b border-border pb-10">
      <p className={kickerClass}>Biblioteca de QA</p>
      <h1 className="qa-page-title mt-3 max-w-4xl text-4xl leading-tight text-foreground sm:text-6xl">
        O que ler para testar melhor, do clássico ao que saiu este mês.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
        Livros, artigos fundamentais, normas, guias abertos e pesquisa recente sobre qualidade de software.
        Cada referência curada tem resumo, ideias principais, como aplicar no trabalho e citação pronta em ABNT, APA e BibTeX.
      </p>
      <Byline label="Curadoria de" className="mt-6" />

      <form action="/biblioteca#acervo" method="get" role="search" aria-label="Buscar na biblioteca" className="mt-7 flex max-w-2xl gap-2">
        <label htmlFor="library-hero-q" className="sr-only">Buscar na biblioteca</label>
        <span className="relative block flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input id="library-hero-q" name="q" type="search" placeholder="Ex.: testes instáveis, cobertura, acessibilidade" autoComplete="off" className={cn(fieldClass, "min-h-12 pl-9")} />
        </span>
        <button type="submit" className={cn("inline-flex min-h-12 items-center justify-center bg-brand-accent px-5 text-sm font-bold text-background transition-colors hover:bg-brand-accent/90", focusRing)}>Buscar</button>
      </form>

      <nav aria-label="Estantes" className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {libraryKinds.map((kind) => {
          const style = kindStyle[kind.id];
          return <Link key={kind.id} href={libraryHref({ tipo: kind.id })} className={cn("group border border-border bg-card p-4 transition-colors hover:border-brand-accent/60", focusRing)}>
            <span className={cn("flex items-center gap-2 text-3xl font-bold", style.text)}><style.icon className="size-5" aria-hidden="true" />{stats.byKind[kind.id]}</span>
            <span className="mt-1 block text-sm font-semibold">{kind.plural}</span>
            <span className="mt-1 hidden text-xs leading-5 text-muted-foreground sm:block">{kind.description}</span>
          </Link>;
        })}
      </nav>
    </header>

    {/* ── Trilhas ── */}
    <section aria-labelledby="trilhas-title" className="mt-12">
      <p className={kickerClass}>Por onde começar</p>
      <h2 id="trilhas-title" className="font-display mt-2 text-2xl uppercase sm:text-3xl">Trilhas de leitura</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Sequências curtas, em ordem, com o motivo de cada leitura estar naquele lugar.</p>
      <ul className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {readingPaths.map((path) => {
          const steps = pathReferences(path);
          return <li key={path.slug}>
            <Link href={`/biblioteca/trilhas/${path.slug}`} className={cn("group flex h-full flex-col border border-border bg-card p-5 transition-colors hover:border-brand-accent/60", focusRing)}>
              <span className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="border border-border px-1.5 py-0.5 font-medium">{levelLabel(path.level)}</span>
                <span className="font-mono">{steps.length} leituras</span>
              </span>
              <span className="mt-3 text-lg font-semibold leading-snug group-hover:text-brand-accent">{path.title}</span>
              <span className="mt-1 text-sm leading-6 text-muted-foreground">{path.audience}</span>
              <ol className="mt-4 space-y-1 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
                {steps.slice(0, 3).map((step, index) => <li key={step.ref} className="truncate"><span className="font-mono">{index + 1}.</span> {step.reference.title}</li>)}
                {steps.length > 3 && <li className="font-mono">+ {steps.length - 3}</li>}
              </ol>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-accent">Ver trilha <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
            </Link>
          </li>;
        })}
      </ul>
    </section>

    {/* ── Essenciais ── */}
    <section aria-labelledby="essenciais-title" className="mt-14 border border-brand-accent/40 bg-card p-5 sm:p-6">
      <p className={kickerClass}>Em destaque</p>
      <h2 id="essenciais-title" className="font-display mt-2 text-2xl uppercase sm:text-3xl">Os essenciais</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Se der para ler só {essentialEntries.length} coisas sobre qualidade de software, comece por estas.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {essentialEntries.map((entry, index) => <li key={entry.id} className={index >= 6 ? "hidden sm:block" : undefined}><ReferenceCard entry={entry} /></li>)}
      </ul>
      {essentialEntries.length > 6 && <Link href="/biblioteca#acervo" className={cn("mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand-accent sm:hidden", focusRing)}>Ver os outros {essentialEntries.length - 6} no acervo <ArrowRight className="size-4" aria-hidden="true" /></Link>}
    </section>

    {/* ── Acervo ── */}
    <section id="acervo" aria-labelledby="acervo-title" className="mt-14 scroll-mt-24">
      <p className={kickerClass}>Acervo</p>
      <h2 id="acervo-title" className="font-display mt-2 text-2xl uppercase sm:text-3xl">Explore as {stats.total} referências</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Busque por título, autoria, tema ou DOI, em português ou inglês. Combine com tipo, tema e nível.
      </p>

      <form
        key={JSON.stringify(criteria)}
        action="/biblioteca#acervo"
        method="get"
        role="search"
        aria-label="Filtrar o acervo"
        className="mt-5 grid gap-3 border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end"
      >
        <label htmlFor="library-q" className="grid gap-1.5 text-sm font-medium text-foreground sm:col-span-2 lg:col-span-2">
          Buscar no acervo
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input id="library-q" name="q" type="search" defaultValue={criteria.q} placeholder="Título, autoria, tema ou DOI" autoComplete="off" className={cn(fieldClass, "pl-9")} />
          </span>
        </label>
        <FilterSelect id="library-kind" name="tipo" label="Tipo" value={orEmpty(criteria.tipo)} allLabel="Todos os tipos" options={kindOptions} />
        <FilterSelect id="library-topic" name="tema" label="Tema" value={orEmpty(criteria.tema)} allLabel="Todos os temas" options={topicOptions} />
        <FilterSelect id="library-level" name="nivel" label="Nível" value={orEmpty(criteria.nivel)} allLabel="Todos os níveis" options={[...libraryLevels]} />
        <FilterSelect id="library-sort" name="ordem" label="Ordenar" value={criteria.ordem === "relevancia" ? "" : criteria.ordem} options={librarySorts.map((sort) => ({ ...sort, id: sort.id === "relevancia" ? "" : sort.id }))} />
        <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2 lg:col-span-6">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="acesso" value="aberto" defaultChecked={criteria.acesso === "aberto"} className="size-4 accent-[var(--brand-accent)]" />
            Só acesso aberto
          </label>
          <div className="flex gap-2">
            {hasFilters && <Link href="/biblioteca#acervo" className={cn("inline-flex min-h-11 items-center justify-center gap-1.5 border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-brand-accent/50 hover:text-foreground", focusRing)}>
              <X className="size-4" aria-hidden="true" />Limpar
            </Link>}
            <button type="submit" className={cn("inline-flex min-h-11 items-center justify-center bg-brand-accent px-6 text-sm font-bold text-background transition-colors hover:bg-brand-accent/90", focusRing)}>Filtrar</button>
          </div>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <p data-testid="library-count" role="status" className="text-sm leading-6 text-muted-foreground">{resultLabel}{details ? ` ${details}` : ""}.</p>
        <span className="font-mono text-xs text-muted-foreground">Mostrando {shown.length} de {filtered.length}</span>
      </div>

      {shown.length > 0
        ? <ul className="mt-5 grid gap-3">{shown.map((entry) => <li key={entry.id}><EntryRow entry={entry} /></li>)}</ul>
        : <div className="mt-8 border border-dashed border-border bg-card p-8 text-center">
          <p className="text-lg font-semibold text-foreground">Nenhuma referência encontrada.</p>
          <p className="mt-2 text-sm text-muted-foreground">Tente outro termo ou tire um dos filtros.</p>
          <Link href="/biblioteca#acervo" className={cn("mt-5 inline-flex min-h-11 items-center justify-center border border-brand-accent/50 px-4 text-sm font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-background", focusRing)}>Limpar filtros</Link>
        </div>}

      {shown.length < filtered.length && <div className="mt-8 flex flex-col items-center gap-2">
        <Link href={libraryHref({ ...filters, visible: Math.min(visible + LOAD_MORE_STEP, filtered.length) })} className={cn("inline-flex min-h-12 items-center justify-center gap-2 border border-brand-accent/50 px-6 text-sm font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-background", focusRing)}>
          Carregar mais <ArrowDown className="size-4" aria-hidden="true" />
        </Link>
        <p className="font-mono text-xs text-muted-foreground">Mais {Math.min(LOAD_MORE_STEP, filtered.length - shown.length)} referências</p>
      </div>}
    </section>

    {/* ── Método ── */}
    <section aria-labelledby="metodo-title" className="mt-16 grid gap-8 border-t border-border pt-10 lg:grid-cols-2">
      <div>
        <h2 id="metodo-title" className="text-lg font-semibold">Como a biblioteca é montada</h2>
        <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
          <p>
            <strong className="text-foreground">Acervo curado ({stats.curated} referências).</strong> Livros, artigos, normas e guias escolhidos à mão.
            Os DOIs foram conferidos no Crossref e os links testados em {new Date(`${stats.checkedAt}T12:00:00Z`).toLocaleDateString("pt-BR")}.
            Os resumos descrevem o que a obra diz; quando há ressalva sobre o método ou o contexto, ela aparece na página.
          </p>
          <p>
            <strong className="text-foreground">Pesquisa recente ({stats.byKind.pesquisa} trabalhos).</strong> Monitorada automaticamente nas bases abaixo e revisada
            um a um antes de entrar. Última atualização em {new Date(stats.researchUpdatedAt).toLocaleDateString("pt-BR")}.
            Estar aqui indica relação direta com qualidade de software, não atesta revisão por pares.
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold">Bases monitoradas</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {researchSources.filter((source) => source.url.startsWith("http")).map((source) => <li key={source.name}>
            <a href={source.url} target="_blank" rel="noopener noreferrer" title={source.description} className={cn("inline-flex border border-border px-3 py-1.5 text-sm transition-colors hover:border-brand-accent/60 hover:text-brand-accent", focusRing)}>{source.name}</a>
          </li>)}
        </ul>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          Legenda: {libraryKinds.map((kind) => <KindBadge key={kind.id} kind={kind.id} />)}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Sentiu falta de uma referência? Fale com a gente pelo <Link href="/sobre" className="underline underline-offset-4 hover:text-foreground">Sobre</Link>.</p>
      </div>
    </section>
  </main>;
}

