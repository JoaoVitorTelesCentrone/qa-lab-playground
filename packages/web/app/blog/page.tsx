import Link from "next/link";
import { BookOpen, ArrowRight, PenLine } from "lucide-react";
import { posts } from "@/lib/blog-posts";

export default function BlogPage() {
  const destaque = posts.find((p) => p.destaque);
  const outros = posts.filter((p) => !p.destaque);

  return (
    <div className="space-y-8 animate-fade-in">

      <div className="flex items-center gap-3 animate-slide-in-up">
        <div className="flex items-center justify-center size-9 rounded-lg bg-mint/10 border border-mint/20">
          <BookOpen className="size-4 text-mint" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-mint italic">
            BLOG QA LAB
          </h1>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8B949E] -mt-0.5">
            {posts.length} artigos
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in-up text-center">
          <div className="flex items-center justify-center size-16 rounded-2xl bg-mint/5 border border-mint/15">
            <PenLine className="size-7 text-mint/50" />
          </div>

          <div className="space-y-2 max-w-md">
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wider text-[#F0F6FC] italic">
              Nenhum artigo publicado ainda
            </h2>
            <p className="text-sm text-[#8B949E] leading-relaxed">
              Em breve teremos conteúdos sobre QA, automação, testes e boas práticas.
              Quer contribuir com um artigo?
            </p>
          </div>

          <a
            href="https://www.linkedin.com/company/qa-lab-oficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg bg-mint/10 border border-mint/25 px-5 py-2.5 text-sm font-semibold text-mint hover:bg-mint/15 hover:border-mint/40 transition-all duration-150"
          >
            Mande uma mensagem no LinkedIn do QA Lab
            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform duration-150" />
          </a>
        </div>
      ) : (
        <>
          {destaque && (
            <Link href={`/blog/${destaque.slug}`}>
              <div className="group rounded-lg border border-mint/20 bg-[#1A1D23] p-5 hover:-translate-y-0.5 hover:border-mint/35 hover:shadow-lg hover:shadow-black/35 transition-all duration-150">
                <h2 className="text-base font-bold text-[#F0F6FC] mb-2 leading-snug">{destaque.titulo}</h2>
                <p className="text-sm text-[#8B949E] leading-relaxed mb-4 line-clamp-3">{destaque.resumo}</p>
                <span className="text-xs font-semibold text-mint flex items-center gap-1 group-hover:gap-2 transition-all duration-150">
                  Ler artigo <ArrowRight className="size-3" />
                </span>
              </div>
            </Link>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {outros.map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div
                  className="group h-full rounded-lg border border-[#30363D] bg-[#1A1D23] p-4 flex flex-col hover:-translate-y-0.5 hover:border-mint/20 hover:shadow-md hover:shadow-black/25 transition-all duration-150 animate-fade-in-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <h3 className="text-sm font-semibold text-[#F0F6FC] leading-snug mb-2 line-clamp-2 group-hover:text-mint transition-colors duration-150">
                    {post.titulo}
                  </h3>
                  <p className="text-xs text-[#8B949E] leading-relaxed line-clamp-2 flex-1 mb-3">{post.resumo}</p>
                  <div className="flex items-center justify-end pt-2 border-t border-[#30363D]">
                    <ArrowRight className="size-3 text-[#8B949E] group-hover:text-mint group-hover:translate-x-0.5 transition-all duration-150" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <a
            href="https://www.linkedin.com/company/qa-lab-oficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg border border-[#30363D] px-4 py-2.5 text-xs text-[#8B949E] hover:border-mint/25 hover:text-mint transition-all duration-150"
          >
            Publicar no Blog
            <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform duration-150" />
          </a>
        </>
      )}

    </div>
  );
}
