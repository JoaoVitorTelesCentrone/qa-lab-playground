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
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <BookOpen className="size-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Blog QA Lab</h1>
        </div>
        <p className="max-w-xl text-muted-foreground">
          Artigos sobre qualidade de software, técnicas de teste e boas práticas
          para QAs em todos os níveis.
        </p>
      </div>

      {/* Featured Post */}
      {featured && (
        <Link href={`/blog/${featured.slug}`}>
          <Card className="group transition-colors hover:border-primary/40">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <Badge variant="secondary" className="text-xs">
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
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {featured.tempoLeitura} min de leitura
                  </span>
                  <span>{formatDate(featured.data)}</span>
                  <div className="flex flex-wrap gap-1">
                    {featured.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-0.5 rounded bg-secondary px-1.5 py-0.5 font-mono"
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
                  className="shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100"
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
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Todos os artigos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="group h-full transition-colors hover:border-primary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base leading-snug">
                    {post.titulo}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {post.resumo}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.tempoLeitura} min
                      </span>
                      <span>{formatDate(post.data)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Ler <ArrowRight className="size-3" />
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
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
    </div>
  );
}
