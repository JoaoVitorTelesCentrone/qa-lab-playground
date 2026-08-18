// Bloco "Blog 2": chamada com CTA + grade de leituras assinadas.
//
// Cada card é raso de propósito — meta, título e quem assina. É uma lista para
// escanear e clicar, não um resumo do conteúdo: quando o card explica o texto
// inteiro, ninguém abre o link.
//
// Sem "use client": é leitura. O componente aceita ser usado dentro de um
// client component também, como no demo do bloco.

export type Blog2Author = {
  name: string;
  role: string;
  /** URL da foto. Vazio cai no fallback de iniciais — nada de imagem quebrada. */
  avatar?: string;
};

export type Blog2Post = {
  /** Linha curta acima do título: tempo de leitura, ano, fonte. */
  meta: string;
  title: string;
  author: Blog2Author;
  href: string;
};

export type Blog2Header = {
  heading: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
};

export default function Blog2({ header, posts }: { header: Blog2Header; posts: Blog2Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section>
      <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="max-w-2xl text-3xl font-black leading-tight text-off-white sm:text-4xl">{header.heading}</h2>
          {header.description && <p className="mt-4 max-w-xl text-sm leading-7 text-[#AAB2BC]">{header.description}</p>}
        </div>

        {header.ctaText && header.ctaHref && (
          <a
            href={header.ctaHref}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-mint/25 px-5 text-sm font-bold text-mint transition hover:border-neon/50 hover:text-neon"
          >
            {header.ctaText}
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.href + post.title} className="group relative flex flex-col">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B949E]">{post.meta}</p>

            <h3 className="mt-3 text-lg font-black leading-snug text-off-white">
              <PostLink href={post.href}>{post.title}</PostLink>
            </h3>

            <div className="mt-auto flex items-center gap-3 pt-6">
              <Avatar author={post.author} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-off-white">{post.author.name}</p>
                {post.author.role && <p className="truncate text-xs text-[#8B949E]">{post.author.role}</p>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * O link cobre o card inteiro (`after:absolute inset-0`) para o alvo de clique
 * ser o cartão, sem aninhar link dentro de link nem duplicar o destino para
 * quem navega por teclado.
 */
function PostLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="after:absolute after:inset-0 transition group-hover:text-neon focus-visible:outline-none focus-visible:text-neon"
    >
      {children}
    </a>
  );
}

function Avatar({ author }: { author: Blog2Author }) {
  if (author.avatar) {
    // <img> e não next/image: a foto vem de host arbitrário (GitHub, gravatar),
    // e cada host novo exigiria entrada em next.config.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={author.avatar} alt="" width={40} height={40} loading="lazy" className="size-10 shrink-0 rounded-full border border-white/10 object-cover" />;
  }

  return (
    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full border border-mint/25 bg-mint/[.06] text-xs font-black text-mint">
      {initials(author.name)}
    </span>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return `${parts[0][0]}${parts.length > 1 ? parts[parts.length - 1][0] : ""}`.toUpperCase();
}
