import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Tag,
  ArrowRight,
  Info,
  AlertTriangle,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPostBySlug,
  getRelatedPosts,
  formatDate,
  posts,
} from "@/lib/blog-posts";
import type { Block } from "@/lib/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="leading-7 text-muted-foreground">{block.content}</p>
      );

    case "heading":
      return (
        <h2 className="mt-8 text-xl font-bold tracking-tight text-foreground">
          {block.content}
        </h2>
      );

    case "subheading":
      return (
        <h3 className="mt-6 text-base font-semibold text-foreground">
          {block.content}
        </h3>
      );

    case "list":
      return (
        <ul className="space-y-1.5 pl-1">
          {block.items?.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      );

    case "ordered-list":
      return (
        <ol className="space-y-1.5 pl-1">
          {block.items?.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      );

    case "callout": {
      const variants = {
        info: {
          icon: Info,
          className: "border-blue-500/30 bg-blue-500/5 text-blue-400",
        },
        tip: {
          icon: Lightbulb,
          className: "border-green-200 bg-green-50 text-green-600",
        },
        warning: {
          icon: AlertTriangle,
          className: "border-amber-200 bg-amber-50 text-amber-600",
        },
        danger: {
          icon: AlertCircle,
          className: "border-red-200 bg-red-50 text-red-600",
        },
      };
      const v = variants[block.variant ?? "info"];
      const Icon = v.icon;
      return (
        <div
          className={`flex gap-3 rounded-lg border p-4 ${v.className}`}
        >
          <Icon className="mt-0.5 size-4 shrink-0" />
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {block.content}
          </p>
        </div>
      );
    }

    case "code":
      return (
        <div className="rounded-lg border bg-secondary/50">
          {block.language && (
            <div className="border-b px-4 py-1.5">
              <span className="font-mono text-xs text-muted-foreground">
                {block.language}
              </span>
            </div>
          )}
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground">
            <code>{block.content}</code>
          </pre>
        </div>
      );

    case "quote":
      return (
        <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground">
          {block.content}
        </blockquote>
      );

    case "divider":
      return <hr className="border-border" />;

    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(slug);

  return (
    <div className="mx-auto max-w-2xl space-y-10 animate-fade-in">
      {/* Back */}
      <Link href="/blog">
        <Button variant="ghost" size="sm" className="gap-1.5 pl-0">
          <ArrowLeft className="size-4" />
          Voltar ao Blog
        </Button>
      </Link>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="mr-1 size-2.5" />
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight leading-tight">
          {post.titulo}
        </h1>
        <p className="text-muted-foreground leading-relaxed">{post.resumo}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {post.tempoLeitura} min de leitura
          </span>
          <span>{formatDate(post.data)}</span>
          <span>por {post.autor}</span>
        </div>
        <hr className="border-border" />
      </div>

      {/* Article Body */}
      <div className="space-y-5 stagger">
        {post.blocos.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="space-y-4">
          <hr className="border-border" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Artigos relacionados
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((rel) => (
              <Link key={rel.slug} href={`/blog/${rel.slug}`}>
                <Card className="group h-full transition-colors hover:border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm leading-snug">
                      {rel.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {rel.tempoLeitura} min
                      </span>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        Ler <ArrowRight className="size-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
