import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDown, Search, X } from "lucide-react";
import Blog2 from "@/components/blog2";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FeaturedList } from "@/components/pesquisa/featured-list";
import { ResearchCardTooltip } from "@/components/pesquisa/research-card-tooltip";
import {
  filterResearchWorks,
  getAllResearch,
  getResearchStats,
  getResearchYears,
  researchThemeLabel,
  researchThemes,
  summarizeAbstract,
  type ResearchThemeId,
} from "@/lib/research-library";

const INITIAL_VISIBLE = 12;
const LOAD_MORE_STEP = 24;

type ResearchSearchParams = {
  q?: string | string[];
  tema?: string | string[];
  ano?: string | string[];
  visiveis?: string | string[];
};

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

function isResearchThemeId(value: string | undefined): value is ResearchThemeId {
  return researchThemes.some((theme) => theme.id === value);
}

function researchHref({
  q,
  tema,
  ano,
  visiveis,
}: {
  q: string;
  tema: ResearchThemeId | "todos";
  ano: number | "todos";
  visiveis: number;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tema !== "todos") params.set("tema", tema);
  if (ano !== "todos") params.set("ano", String(ano));
  if (visiveis > INITIAL_VISIBLE) params.set("visiveis", String(visiveis));
  const queryString = params.toString();
  return queryString ? `/pesquisa?${queryString}#trabalhos` : "/pesquisa#trabalhos";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ResearchSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  // Filtros geram combinações demais para indexar; o canonical aponta para a
  // biblioteca completa e as variações ficam fora do índice.
  const hasFilters = Boolean(
    first(params.q) || first(params.tema) || first(params.ano) || first(params.visiveis),
  );

  return {
    title: "Pesquisa científica",
    description:
      "Biblioteca de textos científicos e trabalhos acadêmicos sobre qualidade de software e QA.",
    alternates: { canonical: "/pesquisa" },
    ...(hasFilters ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function PesquisaPage({
  searchParams,
}: {
  searchParams: Promise<ResearchSearchParams>;
}) {
  const params = await searchParams;
  const q = (first(params.q) ?? "").trim().slice(0, 120);
  const requestedTheme = first(params.tema);
  const tema: ResearchThemeId | "todos" = isResearchThemeId(requestedTheme)
    ? requestedTheme
    : "todos";

  const allWorks = getAllResearch();
  const years = getResearchYears(allWorks);
  const requestedYear = Number.parseInt(first(params.ano) ?? "", 10);
  const ano: number | "todos" = years.includes(requestedYear) ? requestedYear : "todos";

  const requestedVisible = Number.parseInt(first(params.visiveis) ?? "", 10);
  const visible = Number.isFinite(requestedVisible)
    ? Math.min(Math.max(requestedVisible, INITIAL_VISIBLE), allWorks.length)
    : INITIAL_VISIBLE;

  const filtered = filterResearchWorks(allWorks, { q, tema, ano });
  const works = filtered.slice(0, visible);
  const hasFilters = Boolean(q) || tema !== "todos" || ano !== "todos";
  const canLoadMore = works.length < filtered.length;
  const nextHref = researchHref({
    q,
    tema,
    ano,
    visiveis: Math.min(visible + LOAD_MORE_STEP, filtered.length),
  });

  const featured = allWorks.slice(0, 12).filter((work) => work.title.length <= 180).slice(0, 5);

  const posts = works.map((work) => ({
    meta: `${work.year} · ${work.source}`,
    title: work.title,
    author: {
      name: work.authors[0] ?? "Autoria não informada",
      role: work.venue || "Sem venue informado",
    },
    href: work.url,
  }));
  // O Blog2 entrega só `href` para o `renderCardLink`, então o resumo viaja
  // por um mapa href -> resumo em vez de vir junto do post.
  const summaries = new Map(works.map((work) => [work.url, summarizeAbstract(work.abstract)]));
  // Estatísticas da biblioteca inteira, as mesmas que a home mostra.
  const stats = getResearchStats();

  const resultCount =
    filtered.length === 1 ? "1 trabalho" : `${filtered.length} trabalhos`;
  const filterDetails = [
    q ? `para “${q}”` : "",
    tema !== "todos" ? `em ${researchThemeLabel(tema)}` : "",
    ano !== "todos" ? `de ${ano}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const resultLabel =
    filtered.length === 0
      ? "Nenhum trabalho encontrado"
      : hasFilters
        ? `${resultCount} ${filtered.length === 1 ? "encontrado" : "encontrados"}`
        : `${resultCount} indexados`;

  return (
    <div className="qa-research mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <section className="border-b border-border pb-9">
        <h1 className="qa-page-title max-w-4xl text-4xl leading-tight text-foreground sm:text-6xl">
          Biblioteca científica para estudar qualidade de software.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
          Um espaço dedicado exclusivamente a trabalhos sobre qualidade de software: modelos de qualidade,
          garantia da qualidade, testes, defeitos, confiabilidade e manutenibilidade.
        </p>
      </section>

      <section aria-labelledby="fila-title" className="mt-8 border border-brand-accent/40 bg-card p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">Em destaque</p>
        <h2 id="fila-title" className="font-display mt-2 text-2xl uppercase sm:text-3xl">Leituras para começar</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">As referências mais recentes da biblioteca, a um clique.</p>
        <div className="mt-5">
          <FeaturedList linkLabel="Abrir" items={featured.map((work) => ({ title: work.title, meta: `${work.year} · ${work.source}`, href: work.url, external: true }))} />
        </div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          [stats.total, "trabalhos indexados"],
          [stats.topics, "tópicos mapeados"],
          [stats.sources, "fontes ativas"],
        ].map(([value, label], index) => (
          <div key={label} className="border border-border bg-card p-5">
            <p className={`text-3xl font-bold ${["text-primary", "text-[#9EB8C6]", "text-copper"][index]}`}>{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <section id="trabalhos" className="mt-10 scroll-mt-24" aria-labelledby="trabalhos-title">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">Biblioteca</p>
        <h2 id="trabalhos-title" className="font-display mt-2 text-2xl uppercase sm:text-3xl">
          Explore os {stats.total} trabalhos
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Busque por título, autoria, tema ou DOI. Combine com tema e ano para chegar mais rápido.
          A seleção considera a relação direta com qualidade de software; a presença aqui não atesta revisão por pares.
        </p>

        <form
          action="/pesquisa#trabalhos"
          method="get"
          role="search"
          aria-label="Filtrar a biblioteca"
          className="mt-5 grid gap-3 border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_8rem_auto] lg:items-end"
        >
          <label htmlFor="research-q" className="grid gap-1.5 text-sm font-medium text-foreground">
            Buscar na biblioteca
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                id="research-q"
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Título, autoria, tema ou DOI"
                autoComplete="off"
                className="min-h-11 w-full border border-border bg-background px-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
            </span>
          </label>

          <label htmlFor="research-theme" className="grid gap-1.5 text-sm font-medium text-foreground">
            Tema
            <select
              id="research-theme"
              name="tema"
              defaultValue={tema === "todos" ? "" : tema}
              className="min-h-11 w-full border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <option value="">Todos os temas</option>
              {researchThemes.map((theme) => (
                <option key={theme.id} value={theme.id}>{theme.label}</option>
              ))}
            </select>
          </label>

          <label htmlFor="research-year" className="grid gap-1.5 text-sm font-medium text-foreground">
            Ano
            <select
              id="research-year"
              name="ano"
              defaultValue={ano === "todos" ? "" : String(ano)}
              className="min-h-11 w-full border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <option value="">Todos os anos</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </label>

          <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              className="inline-flex min-h-11 flex-1 items-center justify-center bg-brand-accent px-5 text-sm font-bold text-background transition-colors hover:bg-brand-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:flex-none"
            >
              Filtrar
            </button>
            {hasFilters && (
              <Link
                href="/pesquisa#trabalhos"
                className="inline-flex min-h-11 items-center justify-center gap-1.5 border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-brand-accent/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <X className="size-4" aria-hidden="true" />
                Limpar
              </Link>
            )}
          </div>
        </form>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <p data-testid="research-count" role="status" className="text-sm leading-6 text-muted-foreground">
            {resultLabel}{filterDetails ? ` ${filterDetails}` : ""}.
          </p>
          <span className="font-mono text-xs text-muted-foreground">
            Mostrando {works.length} de {filtered.length}
          </span>
        </div>

        {works.length > 0 ? (
          /* O tooltip do registry do Watermelon (`tooltip-1` -> `tooltip`) é o
             mesmo arquivo que já está em `components/ui/tooltip` — mesmo Radix,
             mesma seta, mesmas classes. A única diferença é que a versão deles
             embute o Provider dentro do `Tooltip`; aqui ele fica um nível acima,
             ao redor da grade, o que dá o mesmo resultado sem instalar um segundo
             componente idêntico. */
          <TooltipProvider delayDuration={200}>
            <Blog2
              posts={posts}
              renderCardLink={({ href, children }) => (
                <ResearchCardTooltip key={href} href={href} summary={summaries.get(href)}>
                  {children}
                </ResearchCardTooltip>
              )}
            />
          </TooltipProvider>
        ) : (
          <div className="mt-8 border border-dashed border-border bg-card p-8 text-center">
            <p className="text-lg font-semibold text-foreground">Nenhum trabalho encontrado.</p>
            <p className="mt-2 text-sm text-muted-foreground">Tente outro termo, tema ou ano.</p>
            <Link
              href="/pesquisa#trabalhos"
              className="mt-5 inline-flex min-h-11 items-center justify-center border border-brand-accent/50 px-4 text-sm font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Limpar filtros
            </Link>
          </div>
        )}

        {canLoadMore && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <Link
              href={nextHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-brand-accent/50 px-6 text-sm font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Carregar mais
              <ArrowDown className="size-4" aria-hidden="true" />
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              Mais {Math.min(LOAD_MORE_STEP, filtered.length - works.length)} trabalhos
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
