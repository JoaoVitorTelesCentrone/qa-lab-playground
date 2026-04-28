import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getPostBySlug, getRelatedPosts, formatDate } from "@/lib/blog-posts";
import type { Block } from "@/lib/blog-posts";

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="text-[#F0F6FC]/75 leading-relaxed text-[15px]">
          {block.content}
        </p>
      );
    case "heading":
      return (
        <h2 key={index} className="text-lg font-bold text-[#F0F6FC] mt-8 mb-3 border-b border-[#30363D] pb-2">
          {block.content}
        </h2>
      );
    case "subheading":
      return (
        <h3 key={index} className="text-base font-semibold text-[#F0F6FC] mt-6 mb-2">
          {block.content}
        </h3>
      );
    case "list":
      return (
        <ul key={index} className="space-y-2">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[#F0F6FC]/70 text-sm">
              <span className="text-mint mt-0.5 shrink-0 font-bold">—</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "ordered-list":
      return (
        <ol key={index} className="space-y-2.5">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#F0F6FC]/70 text-sm">
              <span className="font-mono text-[10px] font-bold text-mint bg-mint/10 border border-mint/20 rounded px-1.5 py-0.5 shrink-0 mt-0.5 min-w-[28px] text-center">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      );
    case "callout": {
      const styles: Record<string, { border: string; bg: string; text: string; label: string }> = {
        tip:     { border: "border-mint/30",      bg: "bg-mint/[0.06]",      text: "text-mint",      label: "Dica"    },
        info:    { border: "border-[#2DD4BF]/25", bg: "bg-[#2DD4BF]/[0.05]", text: "text-[#2DD4BF]", label: "Info"    },
        warning: { border: "border-[#F0C040]/30", bg: "bg-[#F0C040]/[0.06]", text: "text-[#F0C040]", label: "Atenção" },
        danger:  { border: "border-coral/30",     bg: "bg-coral/[0.06]",     text: "text-coral",     label: "Cuidado" },
      };
      const s = styles[block.variant ?? "info"] ?? styles.info;
      return (
        <div key={index} className={`rounded-lg border ${s.border} ${s.bg} px-4 py-3.5`}>
          <span className={`text-[9px] font-bold uppercase tracking-[0.15em] ${s.text} block mb-1.5`}>
            {s.label}
          </span>
          <p className="text-sm text-[#F0F6FC]/75 leading-relaxed whitespace-pre-line">{block.content}</p>
        </div>
      );
    }
    case "code":
      return (
        <div key={index} className="rounded-lg border border-[#30363D] bg-[#0D1117] overflow-hidden">
          {block.language && (
            <div className="px-4 py-2 border-b border-[#30363D] bg-[#161B22] flex items-center gap-2">
              <span className="size-2 rounded-full bg-coral/50 shrink-0" />
              <span className="size-2 rounded-full bg-[#F0C040]/50 shrink-0" />
              <span className="size-2 rounded-full bg-neon/50 shrink-0" />
              <span className="ml-2 text-[10px] font-mono font-semibold uppercase tracking-widest text-[#8B949E]">
                {block.language}
              </span>
            </div>
          )}
          <pre className="p-4 overflow-x-auto text-xs font-mono text-[#E6EDF3] leading-relaxed">
            <code>{block.content}</code>
          </pre>
        </div>
      );
    case "quote":
      return (
        <blockquote key={index} className="border-l-2 border-mint/40 pl-4 py-1 my-2">
          <p className="text-[#F0F6FC]/55 italic text-sm">{block.content}</p>
        </blockquote>
      );
    case "divider":
      return <hr key={index} className="border-[#30363D]" />;
    default:
      return null;
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const related = getRelatedPosts(slug, 2);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">

      <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-[#8B949E] hover:text-mint transition-colors duration-150">
        <ArrowLeft className="size-3.5" />
        Voltar ao Blog
      </Link>

      <div className="space-y-4 animate-slide-in-up">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[9px] font-semibold uppercase tracking-wider text-mint/70 bg-mint/10 border border-mint/20 rounded px-1.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-[#F0F6FC] leading-snug">{post.titulo}</h1>
        <p className="text-[#8B949E] leading-relaxed">{post.resumo}</p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#8B949E]/65">
          <span className="flex items-center gap-1"><Calendar className="size-3" />{formatDate(post.data)}</span>
          <span className="flex items-center gap-1"><Clock className="size-3" />{post.tempoLeitura} min de leitura</span>
          <span>{post.autor}</span>
        </div>
      </div>

      <div className="h-px bg-[#30363D]" />

      <div className="space-y-5">
        {post.blocos.map((block, i) => renderBlock(block, i))}
      </div>

      {related.length > 0 && (
        <div className="pt-6 border-t border-[#30363D]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B949E] mb-3">
            Artigos relacionados
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((rp) => (
              <Link key={rp.slug} href={`/blog/${rp.slug}`}>
                <div className="group rounded-lg border border-[#30363D] bg-[#1A1D23] p-4 hover:border-mint/20 hover:-translate-y-0.5 transition-all duration-150">
                  <h4 className="text-sm font-semibold text-[#F0F6FC] mb-1.5 line-clamp-2 group-hover:text-mint transition-colors duration-150">
                    {rp.titulo}
                  </h4>
                  <p className="text-[10px] text-[#8B949E] flex items-center gap-1">
                    <Clock className="size-3" />
                    {rp.tempoLeitura} min · {formatDate(rp.data)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
