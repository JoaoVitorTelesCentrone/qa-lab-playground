import Link from "next/link";
import { ArrowRight, BookMarked, CalendarClock, DatabaseZap, ExternalLink, Microscope, SearchCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getRecentResearch, getResearchStats, researchLibrary, researchQueries, researchSources } from "@/lib/research-library";

export const metadata = {
  title: "Pesquisa Cientifica",
  description: "Biblioteca de textos cientificos e trabalhos academicos sobre qualidade de software e QA.",
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PesquisaPage() {
  const stats = getResearchStats();
  const works = getRecentResearch(24);
  const updatedAt = new Date(researchLibrary.updatedAt).toLocaleString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <section className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div>
          <Badge variant="outline" className="gap-2">
            <Microscope className="size-3.5" />
            Pesquisa em QA e qualidade
          </Badge>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-off-white sm:text-6xl">
            Biblioteca cientifica para estudar qualidade de software.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#AAB2BC]">
            Um espaco para artigos, standards, proceedings e textos academicos sobre QA, teste de software,
            qualidade, defeitos, automacao, risco e engenharia de qualidade.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#trabalhos" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]">
              Ver trabalhos
              <ArrowRight className="size-4" />
            </a>
            <Link href="/blog" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-bold text-off-white">
              Ler o blog
              <BookMarked className="size-4" />
            </Link>
          </div>
        </div>

        <aside className="rounded-lg border border-mint/20 bg-mint/[.04] p-5">
          <div className="flex items-center gap-3">
            <CalendarClock className="size-5 text-mint" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">Atualizacao diaria</p>
              <p className="mt-1 text-sm text-[#AAB2BC]">Ultima base: {updatedAt}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-[#AAB2BC]">
            Um workflow diario consulta indices academicos, cruza fontes top da area, deduplica por DOI/URL/titulo e grava novos achados nesta biblioteca.
          </p>
        </aside>
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

      <section className="mt-14 grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-lg border border-white/10 bg-[#171B21] p-6">
          <div className="flex items-start gap-3">
            <DatabaseZap className="mt-1 size-5 shrink-0 text-neon" />
            <div>
              <h2 className="text-2xl font-black text-off-white">Como a busca diaria funciona</h2>
              <p className="mt-3 text-sm leading-7 text-[#AAB2BC]">
                A rotina procura novos trabalhos publicados recentemente no OpenAlex, Crossref, Semantic Scholar e arXiv.
                IEEE, ACM, Springer, ScienceDirect e standards entram por metadados desses indices e por curadoria quando sao referencias essenciais.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {researchQueries.map((query) => (
              <Badge key={query} variant="secondary" className="normal-case tracking-normal">
                {query}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#171B21] p-6">
          <div className="flex items-center gap-3">
            <SearchCheck className="size-5 text-mint" />
            <h2 className="text-xl font-black text-off-white">Fontes</h2>
          </div>
          <div className="mt-5 space-y-4">
            {researchSources.map((source) => (
              <a key={source.name} href={source.url} target={source.url.startsWith("http") ? "_blank" : undefined} rel={source.url.startsWith("http") ? "noreferrer" : undefined} className="block rounded-lg border border-white/10 p-4 transition hover:border-mint/30">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black text-off-white">{source.name}</h3>
                  {source.url.startsWith("http") && <ExternalLink className="size-4 text-mint" />}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#8B949E]">{source.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="trabalhos" className="mt-14 scroll-mt-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Biblioteca</p>
          <h2 className="mt-3 text-3xl font-black text-off-white">Trabalhos e textos academicos</h2>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {works.map((work) => (
            <a
              key={work.id}
              href={work.url}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-80 flex-col rounded-lg border border-white/10 bg-[#171B21] p-6 transition duration-200 hover:-translate-y-1 hover:border-mint/40 hover:bg-[#1B2027] hover:shadow-[0_16px_40px_rgba(0,0,0,0.28)] focus-visible:ring-2 focus-visible:ring-mint/60"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={work.source === "Curated" ? "neon" : "outline"}>{work.source}</Badge>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B949E]">
                  {formatDate(work.publishedAt)}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-black leading-snug text-off-white">{work.title}</h3>
              <p className="mt-3 text-sm font-semibold text-mint">{work.venue || "Sem venue informado"}</p>
              <p className="mt-3 flex-1 text-sm leading-7 text-[#AAB2BC]">{work.abstract}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {work.topics.slice(0, 5).map((topic) => (
                  <Badge key={topic} variant="secondary" className="normal-case tracking-normal">
                    {topic}
                  </Badge>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <p className="text-xs leading-5 text-[#8B949E]">
                  {work.authors.slice(0, 3).join(", ")}
                  {work.authors.length > 3 ? " et al." : ""}
                </p>
                <span className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-mint/25 px-4 text-sm font-bold text-mint transition group-hover:border-neon/50 group-hover:text-neon">
                  Abrir fonte
                  <ExternalLink className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
