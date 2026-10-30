import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { posts } from "@/lib/blog-posts";
import { CollaborateCta } from "@/components/blog/collaborate-cta";

export default function BlogPage() {
  return (
    <main className="qa-blog qa-editorial-home">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-12">
        <header className="border-b border-border pb-10">
          <h1 className="qa-page-title text-4xl text-foreground sm:text-6xl">Blog</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Artigos sobre testes, investigação e qualidade de software.
          </p>
        </header>

        <section className="mt-8" aria-label="Artigos do blog">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex min-h-64 flex-col border border-border bg-card p-6 transition-colors hover:border-primary/60 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <h2 className="text-xl font-semibold leading-snug text-foreground">{post.titulo}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{post.resumo}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">Ler artigo <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-16"><CollaborateCta /></div>
      </div>
    </main>
  );
}
