"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, Search } from "lucide-react";
import type { BlogPost } from "@/lib/blog-posts";
import { BlogEventCapture } from "@/components/blog/blog-event";
import { LABS_ENABLED } from "@/lib/product/features";

export type BlogIndexArticle = Pick<BlogPost, "slug" | "titulo" | "resumo" | "tempoLeitura" | "tags" | "editorial">;
export type BlogIndexSeries = {
  id: string;
  title: string;
  href?: string;
  color: string;
  articles: BlogIndexArticle[];
};
export type BlogIndexSection = {
  id: string;
  title: string;
  description: string;
  series: BlogIndexSeries[];
};

type Props = {
  sections: BlogIndexSection[];
  featured: BlogIndexArticle;
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export function BlogIndex({ sections, featured }: Props) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalize(query.trim());
  const filtered = useMemo(() => sections.map((section) => ({
    ...section,
    series: section.series.map((series) => ({
      ...series,
      articles: series.articles.filter((article) => {
        if (!normalizedQuery) return true;
        const content = normalize([
          article.titulo,
          article.resumo,
          series.title,
          section.title,
          ...article.tags,
        ].join(" "));
        return content.includes(normalizedQuery);
      }),
    })).filter((series) => series.articles.length > 0),
  })).filter((section) => section.series.length > 0), [sections, normalizedQuery]);
  const resultCount = filtered.reduce((total, section) => total + section.series.reduce((sum, series) => sum + series.articles.length, 0), 0);

  return (
    <div>
      <header className="qa-editorial-home-hero">
        <div>
          <h1>Aprenda QA investigando situações reais.</h1>
          <p>{LABS_ENABLED ? "Este caderno transforma perguntas de qualidade em exemplos, passos de investigação e práticas que você pode levar para o QA Lab." : "Este caderno transforma perguntas de qualidade em exemplos, passos de investigação e práticas que você pode aplicar no seu trabalho."}</p>
          <Link href={`/blog/${featured.slug}`} className="qa-editorial-start">
            Começar por: {featured.titulo}<ArrowDown className="size-4" aria-hidden="true" />
          </Link>
        </div>
        {LABS_ENABLED && <article className="qa-editorial-featured" aria-label="Prática gratuita do QA Lab">
          <span>Depois da leitura</span>
          <strong>Investigue o primeiro caso gratuito.</strong>
          <small>Leve uma pergunta para o BrotoSpace, observe o resultado e registre a evidência.</small>
          <BlogEventCapture className="qa-editorial-featured-event" event="practice_cta_click" slug={featured.slug}><Link href={`/labs/101?fromBlog=${featured.slug}`} className="qa-editorial-featured-action">Abrir o Lab 01 <ArrowRight className="size-4" aria-hidden="true" /></Link></BlogEventCapture>
        </article>}
      </header>

      <nav className="qa-editorial-index" aria-label="Temas do blog">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            <span>{String(section.series.reduce((sum, series) => sum + series.articles.length, 0)).padStart(2, "0")}</span>
            {section.title}
          </a>
        ))}
      </nav>

      <div className="qa-editorial-search">
        <label htmlFor="blog-search">Encontre um assunto</label>
        <div className="qa-editorial-search-control">
          <Search className="size-4" aria-hidden="true" />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ex.: API, risco ou bug report"
            autoComplete="off"
          />
          <span aria-live="polite" aria-atomic="true">{resultCount} {resultCount === 1 ? "artigo" : "artigos"}</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="qa-editorial-empty" role="status">Nenhum artigo encontrado. Tente outro tema, ferramenta ou título.</p>
      ) : filtered.map((section) => (
        <section key={section.id} id={section.id} className="qa-editorial-section" aria-labelledby={`${section.id}-title`}>
          <header className="qa-editorial-section-heading">
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            <p>{section.description}</p>
          </header>
          {section.series.map((series) => (
            <section key={series.id} className="qa-editorial-track" aria-labelledby={`${series.id}-title`} style={{ "--essay-accent": series.color } as CSSProperties}>
              <div className="qa-editorial-track-heading">
                <h3 id={`${series.id}-title`}>{series.title}</h3>
                {series.href && <Link href={series.href}>Abrir trilha <ArrowRight className="size-3.5" aria-hidden="true" /></Link>}
              </div>
              <div className="qa-editorial-story-grid">
                {series.articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="qa-editorial-story-card"
                    data-composition={article.editorial?.composition ?? "field"}
                  >
                    <span className="qa-editorial-story-card-top">
                      <span>{article.editorial?.number ? `Parte ${article.editorial.number} de 3` : "Artigo"}</span>
                      <span>{article.tempoLeitura} min</span>
                    </span>
                    <strong>{article.titulo}</strong>
                    <span className="qa-editorial-story-summary">{article.resumo}</span>
                    <span className="qa-editorial-story-action">Ler artigo <ArrowRight className="size-4" aria-hidden="true" /></span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </section>
      ))}
    </div>
  );
}
