import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type BlogAccent = "violet" | "green" | "blue";

export interface BlogHighlightArticle {
  category: string;
  readTime: string;
  title: string;
  href?: string;
  accent: BlogAccent;
  /** Opcional: sem capa o card desenha um gradiente com o ícone como marca d'água. */
  imageSrc?: string;
  imageAlt?: string;
  icon: LucideIcon;
}

export interface BlogHighlightsData {
  heading: string;
  description: string;
  asideText: string;
  viewAllLabel: string;
  viewAllHref: string;
  articles: BlogHighlightArticle[];
}

export interface BlogHighlightsProps {
  data: BlogHighlightsData;
  className?: string;
}

const accentClasses: Record<
  BlogAccent,
  { dot: string; cover: string; icon: string; cta: string }
> = {
  violet: {
    dot: "bg-violet-500",
    cover: "from-violet-500/25 via-violet-500/10 to-transparent",
    icon: "text-violet-300",
    cta: "text-violet-300",
  },
  green: {
    dot: "bg-green-500",
    cover: "from-green-500/25 via-green-500/10 to-transparent",
    icon: "text-green-300",
    cta: "text-green-300",
  },
  blue: {
    dot: "bg-blue-500",
    cover: "from-blue-500/25 via-blue-500/10 to-transparent",
    icon: "text-blue-300",
    cta: "text-blue-300",
  },
};

export function BlogHighlights({ data, className }: BlogHighlightsProps) {
  return (
    <section className={cn("w-full pt-0 pb-8", className)}>
      <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
        <div>
          <h2 className="max-w-2xl text-4xl leading-tight font-semibold tracking-tight whitespace-pre-line text-foreground sm:text-5xl md:text-6xl">
            {data.heading}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {data.description}
          </p>
        </div>

        <div className="pt-0 lg:pt-16">
          <p className="max-w-sm text-lg leading-relaxed text-muted-foreground">
            {data.asideText}
          </p>
          <div className="mt-10 w-fit">
            <Button
              asChild
              variant="ghost"
              className="h-auto rounded-none border-b px-0 pb-3 text-lg font-semibold text-foreground hover:bg-transparent"
            >
              <Link href={data.viewAllHref}>
                {data.viewAllLabel}
                <ArrowRight className="ml-4 size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {data.articles.map((article) => (
          <ArticleCard
            key={`${article.category}-${article.title}`}
            article={article}
          />
        ))}
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: BlogHighlightArticle }) {
  const accent = accentClasses[article.accent];
  const Icon = article.icon;

  const card: ReactNode = (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-border bg-card pt-0 pb-4 shadow-sm transition-all hover:shadow-md">
      <div className="relative h-60 overflow-hidden sm:h-64">
        {article.imageSrc ? (
          <img
            src={article.imageSrc}
            alt={article.imageAlt ?? ""}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            aria-hidden
            className={cn(
              "flex size-full items-center justify-center bg-gradient-to-br transition-transform duration-500 group-hover:scale-105",
              accent.cover
            )}
          >
            <Icon className={cn("size-20 opacity-50", accent.icon)} strokeWidth={1.2} />
          </div>
        )}

        <div className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-colors group-hover:bg-background">
          <Bookmark className="size-5" strokeWidth={1.7} />
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={cn("size-2 rounded-full", accent.dot)} />
            <span className="font-medium">{article.category}</span>
          </div>
          <span className="shrink-0 text-sm text-muted-foreground">
            {article.readTime}
          </span>
        </div>

        <h3 className="mt-2 mb-2 text-xl font-semibold tracking-tight text-foreground">
          {article.title}
        </h3>

        <div className="mt-auto">
          <span className={cn("flex items-center gap-1 text-sm font-semibold", accent.cta)}>
            Ler artigo
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (!article.href) return card;

  return (
    <Link
      href={article.href}
      className="block rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {card}
    </Link>
  );
}
