import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { posts, formatDate } from "@/lib/blog-posts";

export default function BlogPage() {
  const featured = posts.find((p) => p.destaque);
  const rest = posts.filter((p) => !p.destaque);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="space-y-4 animate-slide-in-up">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-mint/20">
            <BookOpen className="size-5 text-mint" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-mint italic">
              BLOG QA LAB
            </h1>
            <p className="text-sm text-mint/50 uppercase tracking-[0.15em]">
              Conteúdo educacional
            </p>
          </div>
        </div>
        <p className="text-sm text-off-white/60 max-w-xl">
          Artigos sobre qualidade de software, técnicas de teste e boas práticas
          para QAs em todos os níveis.
        </p>
      </div>

      {/* Featured Post */}
      {featured && (
        <Link href={`/blog/${featured.slug}`}>
          <Card className="group border-mint/10 hover:border-mint/30 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Badge variant="neon" className="text-xs">
                    Destaque
                  </Badge>
                  <CardTitle className="text-xl leading-snug">
                    {featured.titulo}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {featured.resumo}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-3 text-xs text-off-white/50">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {featured.tempoLeitura} min de leitura
                  </span>
                  <span>{formatDate(featured.data)}</span>
                  <div className="flex flex-wrap gap-1">
                    {featured.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-0.5 rounded-lg bg-off-white/5 px-2 py-0.5 font-mono text-mint/70"
                      >
                        <Tag className="size-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  className="shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 text-mint"
                >
                  Ler <ArrowRight className="size-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Post Grid */}
      <div>
        <h2 className="mb-4 text-sm font-bold text-off-white/50 uppercase tracking-wider">
          Todos os artigos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 stagger">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="group h-full border-mint/10 hover:border-mint/30 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base leading-snug text-off-white">
                    {post.titulo}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {post.resumo}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-off-white/50">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.tempoLeitura} min
                      </span>
                      <span>{formatDate(post.data)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="gap-1 opacity-0 transition-opacity group-hover:opacity-100 text-mint"
                    >
                      Ler <ArrowRight className="size-3" />
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Series Badge */}
      <div className="flex justify-end">
        <span className="series-number text-4xl text-off-white/10">
          #05
        </span>
      </div>
    </div>
  );
}
