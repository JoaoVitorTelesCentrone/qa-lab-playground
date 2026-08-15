import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenText, Info, Lightbulb, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug, getRelatedPosts, formatDate, posts, type Block } from "@/lib/blog-posts";
import { studyTracks } from "@/lib/study-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const calloutStyle = {
  info: "border-mint/25 bg-mint/[.05] text-mint",
  tip: "border-neon/25 bg-neon/[.05] text-neon",
  warning: "border-[#F0C040]/30 bg-[#F0C040]/[.06] text-[#F0C040]",
  danger: "border-coral/25 bg-coral/[.05] text-coral",
};

const calloutIcon = {
  info: Info,
  tip: Lightbulb,
  warning: TriangleAlert,
  danger: TriangleAlert,
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.titulo,
    description: post.resumo,
  };
}

function BlockRenderer({ block }: { block: Block }) {
  if (block.type === "heading") {
    return <h2 className="mt-10 text-2xl font-black text-off-white">{block.content}</h2>;
  }

  if (block.type === "subheading") {
    return <h3 className="mt-8 text-xl font-black text-off-white">{block.content}</h3>;
  }

  if (block.type === "paragraph") {
    return <p className="mt-5 text-base leading-8 text-[#AAB2BC]">{block.content}</p>;
  }

  if (block.type === "quote") {
    return <blockquote className="mt-6 border-l-2 border-mint pl-5 text-lg font-semibold leading-8 text-off-white">{block.content}</blockquote>;
  }

  if (block.type === "divider") {
    return <hr className="my-9 border-white/10" />;
  }

  if (block.type === "list") {
    return (
      <ul className="mt-5 space-y-3">
        {block.items?.map((item) => (
          <li key={item} className="flex gap-3 text-base leading-7 text-[#AAB2BC]">
            <span className="mt-3 size-1.5 shrink-0 rounded-full bg-mint" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "ordered-list") {
    return (
      <ol className="mt-5 space-y-4">
        {block.items?.map((item, index) => (
          <li key={item} className="grid grid-cols-[2rem_1fr] gap-3 text-base leading-7 text-[#AAB2BC]">
            <span className="flex size-8 items-center justify-center rounded-lg border border-mint/25 bg-mint/10 text-sm font-black text-mint">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "code") {
    return (
      <pre className="mt-6 overflow-x-auto rounded-lg border border-white/10 bg-[#0D1117] p-4 text-sm leading-7 text-[#DCE3EA]">
        <code>{block.content}</code>
      </pre>
    );
  }

  if (block.type === "callout") {
    const variant = block.variant ?? "info";
    const Icon = calloutIcon[variant];
    return (
      <aside className={`mt-6 rounded-lg border p-4 ${calloutStyle[variant]}`}>
        <div className="flex gap-3">
          <Icon className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm font-semibold leading-7 text-[#DCE3EA]">{block.content}</p>
        </div>
      </aside>
    );
  }

  return null;
}

export default async function StudyPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, 3);
  const track = studyTracks.find((item) => item.postSlugs.includes(post.slug));

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <article className="min-w-0">
        <Link href="/estudos" className="inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon">
          <ArrowLeft className="size-4" />
          Voltar para estudos
        </Link>

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="normal-case tracking-normal">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-off-white sm:text-6xl">{post.titulo}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#AAB2BC]">{post.resumo}</p>

        <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[#8B949E]">
          <span>{post.autor}</span>
          <span className="text-white/20">/</span>
          <span>{formatDate(post.data)}</span>
          <span className="text-white/20">/</span>
          <span>{post.tempoLeitura} min</span>
        </div>

        <div className="mt-10 rounded-lg border border-white/10 bg-[#171B21] p-6">
          <div className="flex items-start gap-3">
            <BookOpenText className="mt-0.5 size-5 shrink-0 text-mint" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">Como usar este estudo</p>
              <p className="mt-2 text-sm leading-7 text-[#AAB2BC]">
                Leia procurando criterios aplicaveis. Depois execute o exercicio sugerido e compare sua entrega com o checkpoint da trilha.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {post.blocos.map((block, index) => (
            <BlockRenderer key={`${block.type}-${index}`} block={block} />
          ))}
        </div>
      </article>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        {track && (
          <section className="rounded-lg border border-mint/20 bg-mint/[.04] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">Trilha vinculada</p>
            <h2 className="mt-3 text-lg font-black text-off-white">{track.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{track.checkpoint}</p>
            <Link href={track.exerciseHref} className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-neon px-4 text-sm font-black text-[#101319]">
              Abrir exercicio
              <ArrowRight className="size-4" />
            </Link>
          </section>
        )}

        <section className="rounded-lg border border-white/10 bg-[#171B21] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B949E]">Relacionados</p>
          <div className="mt-4 space-y-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/estudos/${item.slug}`} className="block rounded-lg border border-white/10 p-3 text-sm font-bold leading-6 text-off-white transition hover:border-mint/30 hover:text-mint">
                {item.titulo}
              </Link>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
