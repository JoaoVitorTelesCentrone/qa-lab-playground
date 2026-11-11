import Blog2 from "@/components/blog2";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FeaturedList } from "@/components/pesquisa/featured-list";
import { ResearchCardTooltip } from "@/components/pesquisa/research-card-tooltip";
import { getRecentResearch, getResearchStats, summarizeAbstract } from "@/lib/research-library";

export const metadata = {
  title: "Pesquisa Cientifica",
  description: "Biblioteca de textos cientificos e trabalhos academicos sobre qualidade de software e QA.",
};

export default function PesquisaPage() {
  // Uma lista só: a grade do Blog2 é rasa de propósito (meta, título, autoria)
  // e serve para escanear e clicar. Nada de segundo bloco de "leituras
  // seguintes" — era a mesma biblioteca repetida em outro formato.
  const works = getRecentResearch(12);
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

      <section aria-labelledby="fila-title" className="mt-8 border border-gold/40 bg-card p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Em destaque</p>
        <h2 id="fila-title" className="font-display mt-2 text-2xl uppercase sm:text-3xl">Leituras para começar</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">As referências mais recentes da biblioteca, a um clique.</p>
        <div className="mt-5">
          <FeaturedList linkLabel="Abrir" items={works.filter((work) => work.title.length <= 180).slice(0, 5).map((work) => ({ title: work.title, meta: `${work.year} · ${work.source}`, href: work.url, external: true }))} />
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

      {/* O tooltip do registry do Watermelon (`tooltip-1` -> `tooltip`) é o
          mesmo arquivo que já está em `components/ui/tooltip` — mesmo Radix,
          mesma seta, mesmas classes. A única diferença é que a versão deles
          embute o Provider dentro do `Tooltip`; aqui ele fica um nível acima,
          ao redor da grade, o que dá o mesmo resultado sem instalar um segundo
          componente idêntico. */}
      <section id="trabalhos" className="mt-14 scroll-mt-24">
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
      </section>
    </div>
  );
}
