import { author } from "@/content/site";
import { formatShortDate } from "@/lib/format-date";
import { findMdxPost, loadMdxPosts } from "@/lib/blog/mdx-posts";
import { getPostBySlug, posts } from "@/lib/blog-posts";
import { ogContentType, ogImage, ogSize } from "@/lib/product/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Artigo do Blog de QA";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const slugs = new Set([
    ...posts.map((post) => post.slug),
    ...loadMdxPosts().map((post) => post.slug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const mdx = findMdxPost(slug);
  if (mdx) {
    const version = mdx.versions[mdx.defaultLang]!;
    return ogImage({
      kicker: `Blog de QA · ${version.tags[0] ?? "Artigo"}`,
      title: version.title,
      subtitle: version.summary,
      stats: [
        { label: "publicado em", value: formatShortDate(version.date) },
        { label: "leitura", value: `${version.readingMinutes} min` },
      ],
      author: `${author.name} · ${author.title}`,
    });
  }

  const post = getPostBySlug(slug);
  if (!post) {
    return ogImage({
      kicker: "Blog de QA",
      title: "Artigo não encontrado",
      subtitle: "O link pode ter mudado ou o artigo saiu do ar. Veja os artigos publicados no blog.",
      author: `${author.name} · ${author.title}`,
    });
  }

  return ogImage({
    kicker: `Blog de QA · ${post.editorial?.seriesTitle ?? post.tags[0] ?? "Artigo"}`,
    title: post.titulo,
    subtitle: post.resumo,
    stats: [
      ...(post.publishedAt ? [{ label: "publicado em", value: formatShortDate(post.publishedAt) }] : []),
      { label: "leitura", value: `${post.tempoLeitura} min` },
    ],
    author: `${author.name} · ${author.title}`,
  });
}
