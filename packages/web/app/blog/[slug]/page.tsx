import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { formatDate, getPostBySlug, posts, type Block } from "@/lib/blog-posts";
import { CollaborateCta } from "@/components/blog/collaborate-cta";
import { PracticeCta } from "@/components/blog/practice-cta";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artigo não encontrado" };
  return {
    title: post.titulo,
    description: post.resumo,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.titulo, description: post.resumo, type: "article" },
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

  return (
    <main className="qa-blog qa-editorial-article" style={post.editorial ? { "--essay-accent": post.editorial.color } as CSSProperties : undefined}>
      <article className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-12">
        <nav className="qa-editorial-breadcrumb" aria-label="Navegação estrutural">
          <Link href="/blog"><ArrowLeft className="size-4" aria-hidden="true" /> Blog</Link>
        </nav>

        <header className="qa-editorial-article-hero">
          <div className="qa-editorial-article-title">
            <h1>{post.titulo}</h1>
            <p>{post.resumo}</p>
            <div className="qa-editorial-article-meta"><span><Calendar className="size-4" aria-hidden="true" />{formatDate(post.data)}</span><span><Clock3 className="size-4" aria-hidden="true" />{post.tempoLeitura} min de leitura</span></div>
          </div>
        </header>

        <div className="qa-editorial-reading-layout">
          <div className="qa-editorial-reading-main">
            <div className="qa-article-body">{post.blocos.map((block, index) => <BlockView key={`${block.type}-${index}`} block={block} />)}</div>
            {post.editorial?.source && <p className="qa-editorial-source">Para aprofundar na ferramenta: <a href={post.editorial.source.href} target="_blank" rel="noopener noreferrer">{post.editorial.source.label}</a>.</p>}
            {post.editorial ? (
              <aside className="qa-editorial-practice" aria-labelledby="article-practice-title">
                <span className="qa-editorial-eyebrow">Continue na prática</span>
                <h2 id="article-practice-title">Leve esta pergunta para a trilha.</h2>
                <p>Os exercícios da trilha de {post.editorial.seriesTitle} ajudam você a aplicar o que acabou de ler e registrar sua própria evidência.</p>
                <Link href={post.editorial.seriesHref}>Abrir trilha de {post.editorial.seriesTitle} <ArrowRight className="size-4" aria-hidden="true" /></Link>
              </aside>
            ) : <PracticeCta postSlug={post.slug} />}
          </div>
        </div>
        <div className="mt-16"><CollaborateCta /></div>
      </article>
    </main>
  );
}
