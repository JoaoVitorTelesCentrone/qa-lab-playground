import Link from "next/link";
import { ArrowRight, BookMarked, CalendarClock, Microscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Blog2 from "@/components/blog2";
import { getRecentResearch, researchLibrary } from "@/lib/research-library";

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
  // As estatísticas batem com os trabalhos exibidos, não com a biblioteca
  // inteira — senão o "trabalhos indexados" mostra um número que ninguém vê.
  const stats = {
    total: works.length,
    topics: new Set(works.flatMap((work) => work.topics)).size,
    sources: new Set(works.map((work) => work.source)).size,
  };
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
            Um espaco dedicado exclusivamente a trabalhos sobre qualidade de software: modelos de qualidade,
            garantia da qualidade, testes, defeitos, confiabilidade e manutenibilidade.
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
            Um workflow diario consulta indices academicos, valida o foco em qualidade de software, deduplica por DOI/URL/titulo e grava novos achados nesta biblioteca.
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

      <section id="trabalhos" className="mt-14 scroll-mt-24">
        <Blog2
          header={{
            heading: "Trabalhos e textos academicos",
            description:
              "As referências mais recentes da biblioteca, com ano, fonte, autoria e veículo de publicação. Clique para abrir o original.",
            ctaText: "Ler o blog",
            ctaHref: "/blog",
          }}
          posts={posts}
        />
      </section>
    </div>
  );
}
