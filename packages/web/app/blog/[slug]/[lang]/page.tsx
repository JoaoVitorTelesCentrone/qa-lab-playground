import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { MdxArticle, mdxPostMetadata } from "@/components/blog/mdx-article";
import { BLOG_LANGS, findMdxPost, isBlogLang, loadMdxPosts } from "@/lib/blog/mdx-posts";

type Props = { params: Promise<{ slug: string; lang: string }> };

// Só existem as combinações post × idioma que têm arquivo .mdx.
export const dynamicParams = false;

export function generateStaticParams() {
  return loadMdxPosts().flatMap((post) => BLOG_LANGS.filter((lang) => post.versions[lang]).map((lang) => ({ slug: post.slug, lang })));
}

function resolve(slug: string, lang: string) {
  const post = findMdxPost(slug);
  return post && isBlogLang(lang) && post.versions[lang] ? { post, lang } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  const found = resolve(slug, lang);
  return found ? mdxPostMetadata(found.post, found.lang) : { title: "Not found" };
}

export default async function MdxPostLangPage({ params }: Props) {
  const { slug, lang } = await params;
  const found = resolve(slug, lang);
  if (!found) notFound();
  // A versão principal tem uma URL só: /blog/<slug>.
  if (found.lang === found.post.defaultLang) permanentRedirect(`/blog/${slug}`);
  return <MdxArticle post={found.post} lang={found.lang} />;
}
