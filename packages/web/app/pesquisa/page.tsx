import Blog2 from "@/components/blog2";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResearchCardTooltip } from "@/components/pesquisa/research-card-tooltip";
import { getRecentResearch, summarizeAbstract } from "@/lib/research-library";

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
  // As estatísticas batem com os trabalhos exibidos, não com a biblioteca
  // inteira — senão o "trabalhos indexados" mostra um número que ninguém vê.
  const stats = {
    total: works.length,
    topics: new Set(works.flatMap((work) => work.topics)).size,
    sources: new Set(works.map((work) => work.source)).size,
  };
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <section>
        <h1 className="max-w-4xl text-4xl font-black leading-tight text-off-white sm:text-6xl">
          Biblioteca cientifica para estudar qualidade de software.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#AAB2BC]">
          Um espaco dedicado exclusivamente a trabalhos sobre qualidade de software: modelos de qualidade,
          garantia da qualidade, testes, defeitos, confiabilidade e manutenibilidade.
        </p>
      </section>

      <section className="mt-12 grid gap-3 sm:grid-cols-3">
        {[
          [stats.total, "trabalhos indexados"],
          [stats.topics, "topicos mapeados"],
          [stats.sources, "fontes ativas"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-[#171B21] p-5">
            <p className="text-3xl font-black text-mint">{value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#8B949E]">{label}</p>
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
