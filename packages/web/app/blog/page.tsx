import type { Metadata } from "next";
import { BlogIndex, type BlogIndexSection } from "@/components/blog/blog-index";
import { CollaborateCta } from "@/components/blog/collaborate-cta";
import { editorialSeries } from "@/lib/blog-editorial";
import { LABS_ENABLED } from "@/lib/product/features";
import { allPosts as posts } from "@/lib/blog/all-posts";

export const metadata: Metadata = {
  title: "Blog de QA: investigação, testes e qualidade de software",
  description: "Artigos práticos sobre testes, automação, investigação e qualidade de software. Encontre um tema e aplique a leitura no seu trabalho.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog de QA Lab",
    description: "Perguntas, exemplos e práticas para aprender QA investigando situações reais.",
    type: "website",
    locale: "pt_BR",
  },
};

const sectionDefinitions = [
  {
    id: "fundamentos-investigacao",
    title: "Fundamentos e investigação",
    description: "Comece com perguntas, risco, exploração e evidências que ajudam o time a decidir.",
    source: "Fundamentos e investigação",
  },
  {
    id: "ferramentas-tecnicas",
    title: "Ferramentas e técnicas",
    description: "Aprofunde automação, APIs, dados, performance e qualidade na entrega.",
    source: "Ferramentas e técnicas",
  },
  {
    id: "colaboracao-carreira",
    title: "Colaboração e carreira",
    description: "Pratique comunicação, alinhamento e decisões de qualidade em equipe.",
    source: "Colaboração e carreira",
  },
  {
    id: "percursos-labs",
    title: "Percursos por Labs",
    description: "Use os ambientes do QA Lab para investigar fluxos específicos com contexto.",
    source: "Percursos por Labs",
  },
] as const;

const postBySlug = new Map(posts.map((post) => [post.slug, post]));

function buildSections(): BlogIndexSection[] {
  return sectionDefinitions.map((definition) => {
    const series = editorialSeries
      .filter((item) => item.section === definition.source)
      .map((item) => ({
        id: item.id,
        title: item.title,
        href: LABS_ENABLED ? item.href : undefined,
        color: item.color,
        articles: item.stories.flatMap((story) => {
          const post = postBySlug.get(story.slug);
          return post ? [post] : [];
        }),
      }));

    if (definition.id === "fundamentos-investigacao") {
      const legacyPosts = posts.filter((post) => !post.editorial && !post.mdx);
      if (legacyPosts.length) {
        series.unshift({
          id: "fundamentos-qa-lab",
          title: "Fundamentos de qualidade",
          href: LABS_ENABLED ? "/trilhas/qa-do-zero" : undefined,
          color: "#95d4a7",
          articles: legacyPosts,
        });
      }
      // Posts em MDX (content/blog) abrem o blog: são os mais recentes.
      const mdxPosts = posts.filter((post) => post.mdx);
      if (mdxPosts.length) {
        series.unshift({ id: "novos-posts", title: "Novos posts", href: "/blog", color: "#95D4A7", articles: mdxPosts });
      }
    }

    return { ...definition, series: series.filter((item) => item.articles.length > 0) };
  }).filter((section) => section.series.length > 0);
}

export default function BlogPage() {
  const featured = postBySlug.get("qa-antes-de-executar-testes") ?? posts[0];
  return (
    <main className="qa-blog qa-editorial-home">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-12">
        <BlogIndex sections={buildSections()} featured={featured} />
        <div className="mt-16"><CollaborateCta /></div>
      </div>
    </main>
  );
}
