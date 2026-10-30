// Bloco "Blog 2" do Watermelon UI (registry `blog-2`). Três ajustes ao
// projeto — o resto é o componente original:
//
// 1. `FaBookmark` do react-icons virou `Bookmark` do lucide com `fill-current`:
//    react-icons não está instalado e o projeto usa lucide como biblioteca de
//    ícones (components.json). Não vale um pacote inteiro por um ícone.
// 2. `header` é opcional — a página de pesquisa não tem título, descrição nem
//    CTA nesse bloco.
// 3. `avatar` é opcional e o acesso é protegido: os trabalhos da biblioteca não
//    têm foto de autoria, e o original quebraria no `.startsWith` de undefined.
//    O fallback de iniciais já existia no componente.

import { ArrowRight, ArrowUpRight, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlogAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface BlogCardItem {
  meta: string;
  title: string;
  author: BlogAuthor;
  href?: string;
}

export interface Blog2Header {
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
}

export interface Blog2Props {
  header?: Blog2Header;
  posts: BlogCardItem[];
  className?: string;
  renderCtaLink?: (props: {
    href: string;
    children: React.ReactNode;
  }) => React.ReactNode;
  renderCardLink?: (props: {
    href: string;
    children: React.ReactNode;
  }) => React.ReactNode;
}

// Tons escuros mantêm a leitura próxima às outras páginas; a borda indica a cor.
const colorVariants = [
  "border-primary/40 bg-card hover:bg-[#22352A]",
  "border-steel/50 bg-card hover:bg-[#1E3037]",
  "border-copper/45 bg-card hover:bg-[#352B25]",
];

export default function Blog2({
  header,
  posts,
  className,
  renderCtaLink,
  renderCardLink,
}: Blog2Props) {
  const ctaContent = header?.ctaText ? (
    <span className="group/cta text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors">
      {header.ctaText}
      <ArrowUpRight className="size-4 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
    </span>
  ) : null;

  const hasHeader = Boolean(header?.heading || header?.description || ctaContent);

  return (
    <section className={cn("w-full py-4", className)}>
      <div className="mx-auto max-w-6xl">
        {hasHeader && header && (
          <div className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
            {header.heading && (
              <h2 className="text-foreground max-w-2xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl md:text-[2.75rem]">
                {header.heading}
              </h2>
            )}

            {header.description && (
              <p className="text-muted-foreground max-w-lg text-sm leading-relaxed sm:text-base">
                {header.description}
              </p>
            )}

            {ctaContent && header.ctaHref
              ? renderCtaLink
                ? renderCtaLink({ href: header.ctaHref, children: ctaContent })
                : <a href={header.ctaHref}>{ctaContent}</a>
              : null}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            const card = (
              <article
                key={index}
                className={cn(
                  "group relative flex min-h-[320px] flex-col justify-between border-t-2 border-r border-b border-l p-6 transition-colors duration-200 sm:p-7",
                  colorVariants[index % colorVariants.length],
                )}
              >
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/80 text-md font-bold">
                      {post.meta}
                    </span>
                    <div className="text-foreground/50 hover:text-foreground/90 transition-colors">
                      <Bookmark className="size-5 fill-current" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-center py-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-foreground line-clamp-4 text-2xl leading-[1.25] font-semibold tracking-tight sm:text-3xl">
                        {post.title}
                      </h3>
                      <ArrowRight
                        className="text-foreground group-hover:text-foreground/80 mt-10 size-5 shrink-0 transition-all duration-300 group-hover:translate-x-1"
                        strokeWidth={3}
                      />
                    </div>
                  </div>
                  {/* Sem `justify-between`: ele existia para empurrar a pill
                      "Read" para a direita, e sem ela separaria o avatar da
                      autoria nas pontas do card. */}
                  <div className="flex items-center gap-3">
                    <div className="mt-auto flex items-center gap-3">
                      <div className="bg-background flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                        {post.author.avatar?.startsWith("<svg") ||
                        post.author.avatar?.startsWith("http") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="size-full rounded-lg object-contain"
                          />
                        ) : (
                          <div className="bg-muted flex size-full items-center justify-center rounded-full text-xs font-medium">
                            {post.author.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-foreground text-sm leading-tight font-medium">
                        {post.author.name}
                      </span>
                      <span className="text-foreground/70 text-xs leading-tight font-medium">
                        {post.author.role}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );

            if (renderCardLink && post.href) {
              return renderCardLink({
                href: post.href,
                children: card,
              });
            }

            if (post.href) {
              return (
                <a
                  key={index}
                  href={post.href}
                  className="block focus-visible:ring-primary rounded-[1.5rem] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {card}
                </a>
              );
            }

            return card;
          })}
        </div>
      </div>
    </section>
  );
}
