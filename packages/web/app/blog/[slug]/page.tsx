import { Byline } from "@/components/authority/byline";
import { ShareOnLinkedIn } from "@/components/authority/share-on-linkedin";
import { author } from "@/content/site";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { formatDate, getPostBySlug, getRelatedPosts, getSeriesPosts, posts, type Block } from "@/lib/blog-posts";
import { CollaborateCta } from "@/components/blog/collaborate-cta";
import { PracticeCta } from "@/components/blog/practice-cta";
import { BlogArticleView, BlogEventCapture } from "@/components/blog/blog-event";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artigo não encontrado" };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app";
  const canonical = new URL(`/blog/${post.slug}`, siteUrl).toString();
  return {
    title: post.titulo,
    description: post.resumo,
    metadataBase: new URL(siteUrl),
    alternates: { canonical },
    authors: [{ name: author.name, url: author.aboutHref }],
    openGraph: {
      title: post.titulo,
      description: post.resumo,
      url: canonical,
      type: "article",
      locale: "pt_BR",
      authors: [author.name],
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
      tags: post.tags,
    },
  };
}

function BlockView({ block }: { block: Block }) {
  if (block.type === "heading") return <h2>{block.content}</h2>;
  if (block.type === "subheading") return <h3>{block.content}</h3>;
  if (block.type === "paragraph") return <p>{block.content}</p>;
  if (block.type === "list") return <ul>{block.items?.map((item) => <li key={item}>{item}</li>)}</ul>;
  if (block.type === "ordered-list") return <ol>{block.items?.map((item) => <li key={item}>{item}</li>)}</ol>;
  if (block.type === "callout") return <aside className={`qa-blog-callout ${block.variant ?? "info"}`}><p>{block.content}</p></aside>;
  if (block.type === "quote") return <blockquote>{block.content}</blockquote>;
  if (block.type === "code") return <pre><code>{block.content}</code></pre>;
  return <hr />;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const seriesPosts = getSeriesPosts(post.slug);
  const index = seriesPosts.findIndex((item) => item.slug === post.slug);
  const previous = index > 0 ? seriesPosts[index - 1] : undefined;
  const next = index >= 0 ? seriesPosts[index + 1] : undefined;
  const related = getRelatedPosts(post.slug, 3).filter((item) => item.slug !== previous?.slug && item.slug !== next?.slug).slice(0, 2);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app";
  const canonical = new URL(`/blog/${post.slug}`, siteUrl).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.resumo,
    inLanguage: "pt-BR",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    author: { "@type": "Person", name: author.name, jobTitle: author.title, url: new URL(author.aboutHref, siteUrl).toString(), sameAs: [author.links.linkedin, author.links.github] },
    publisher: { "@type": "Organization", name: "QA Lab" },
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(post.editorial ? { articleSection: post.editorial.section, isPartOf: { "@type": "CreativeWorkSeries", name: post.editorial.seriesTitle } } : {}),
  };

  return (
    <main className="qa-blog qa-editorial-article" style={post.editorial ? { "--essay-accent": post.editorial.color } as CSSProperties : undefined}>
      <BlogArticleView slug={post.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-12">
        <nav className="qa-editorial-breadcrumb" aria-label="Navegação estrutural">
          <Link href="/blog"><ArrowLeft className="size-4" aria-hidden="true" /> Blog</Link>
          {post.editorial && <><span aria-hidden="true">/</span><Link href={post.editorial.seriesHref}>{post.editorial.seriesTitle}</Link><span aria-current="page">Parte {post.editorial.number} de 3</span></>}
        </nav>

        <header className={`qa-editorial-article-hero${post.editorial ? " has-artifact" : ""}`} data-composition={post.editorial?.composition}>
          <div className="qa-editorial-article-title">
            {post.editorial && <span className="qa-editorial-eyebrow">Caderno de QA · {post.editorial.section}</span>}
            <h1>{post.titulo}</h1>
            <p>{post.resumo}</p>
            <div className="qa-editorial-article-meta">
              {post.publishedAt && <span><Calendar className="size-4" aria-hidden="true" />{formatDate(post.publishedAt)}</span>}
              <span><Clock3 className="size-4" aria-hidden="true" />{post.tempoLeitura} min de leitura</span>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Byline label="Written by" />
              <ShareOnLinkedIn url={`/blog/${post.slug}`} />
            </div>
          </div>
          {post.editorial && <section className="qa-editorial-artifact" data-composition={post.editorial.composition} aria-label={`Ficha de investigação: ${post.editorial.artifact.join("; ")}`}>
            <div className="qa-editorial-artifact-head"><span>Ficha de investigação</span><span>{post.editorial.seriesTitle}</span></div>
            <div className="qa-editorial-artifact-content">
              {post.editorial.artifact.map((step, stepIndex) => <div key={step} className="qa-editorial-artifact-step" style={{ "--step": stepIndex } as CSSProperties}><span>{String(stepIndex + 1).padStart(2, "0")}</span><p>{step}</p></div>)}
            </div>
            <div className="qa-editorial-artifact-foot">Parte {post.editorial.number} · {post.editorial.section}</div>
          </section>}
        </header>

        <div className="qa-editorial-reading-layout">
          <div className="qa-editorial-reading-main">
            <div className="qa-article-body">{post.blocos.map((block, blockIndex) => <BlockView key={`${block.type}-${blockIndex}`} block={block} />)}</div>
            {post.editorial?.source && <p className="qa-editorial-source">Para aprofundar na ferramenta: <a href={post.editorial.source.href} target="_blank" rel="noopener noreferrer">{post.editorial.source.label}</a>.</p>}
            {post.editorial ? (
              <aside className="qa-editorial-practice" aria-labelledby="article-practice-title">
                <span className="qa-editorial-eyebrow">Continue na prática</span>
                <h2 id="article-practice-title">Leve esta pergunta para a trilha.</h2>
                <p>Os exercícios da trilha de {post.editorial.seriesTitle} ajudam você a aplicar o que acabou de ler e registrar sua própria evidência.</p>
                <BlogEventCapture event="practice_cta_click" slug={post.slug}><Link href={`${post.editorial.seriesHref}?fromBlog=${post.slug}`}>Abrir trilha de {post.editorial.seriesTitle} <ArrowRight className="size-4" aria-hidden="true" /></Link></BlogEventCapture>
              </aside>
            ) : <PracticeCta postSlug={post.slug} />}
          </div>
        </div>

        {(previous || next || related.length > 0) && <nav className="qa-editorial-aside" aria-label="Continue a leitura">
          <span className="qa-editorial-eyebrow">Continue a leitura</span>
          {previous && <Link href={`/blog/${previous.slug}`}><span><small>Artigo anterior · Parte {previous.editorial?.number}</small><strong>{previous.titulo}</strong></span><ArrowLeft className="size-4" aria-hidden="true" /></Link>}
          {next && <BlogEventCapture event="series_navigation" slug={post.slug}><Link href={`/blog/${next.slug}`}><span><small>Próximo artigo · Parte {next.editorial?.number}</small><strong>{next.titulo}</strong></span><ArrowRight className="size-4" aria-hidden="true" /></Link></BlogEventCapture>}
          {related.map((item) => <Link key={item.slug} href={`/blog/${item.slug}`}><span><small>Artigo relacionado</small><strong>{item.titulo}</strong></span><ArrowRight className="size-4" aria-hidden="true" /></Link>)}
        </nav>}
        <div className="mt-16"><CollaborateCta /></div>
      </article>
    </main>
  );
}
