import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { author } from "@/content/site";
import type { BlogPost } from "@/lib/blog-posts";
import { parseFrontmatter, readingMinutes } from "./frontmatter";

/**
 * Posts em MDX: `content/blog/<slug>/pt.mdx` e/ou `en.mdx`, com frontmatter
 * (title, summary, date, updated?, tags, draft?). Os metadados e o tempo de
 * leitura vêm daqui (fs, só no servidor); o corpo é renderizado pelo @next/mdx.
 */
export const BLOG_LANGS = ["pt", "en"] as const;
export type BlogLang = (typeof BLOG_LANGS)[number];
export const isBlogLang = (value: string): value is BlogLang => (BLOG_LANGS as readonly string[]).includes(value);

export type MdxVersion = { lang: BlogLang; title: string; summary: string; date: string; updated?: string; tags: string[]; readingMinutes: number; draft: boolean };
export type MdxPost = { slug: string; defaultLang: BlogLang; versions: Partial<Record<BlogLang, MdxVersion>>; draft: boolean };

/** `next build` roda em packages/web; `bun test packages/web` roda na raiz do monorepo. */
function contentDir() {
  const candidates = [path.join(process.cwd(), "content", "blog"), path.join(process.cwd(), "packages", "web", "content", "blog")];
  return candidates.find((dir) => existsSync(dir));
}

const asString = (value: unknown) => typeof value === "string" ? value : "";

function readVersion(file: string, lang: BlogLang, slug: string): MdxVersion {
  const { data, body } = parseFrontmatter(readFileSync(file, "utf8"));
  const title = asString(data.title);
  const date = asString(data.date);
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Post ${slug}/${lang}.mdx precisa de title e date (AAAA-MM-DD) no frontmatter.`);
  return {
    lang, title, date,
    summary: asString(data.summary),
    updated: asString(data.updated) || undefined,
    tags: Array.isArray(data.tags) ? data.tags : [],
    readingMinutes: readingMinutes(body),
    draft: data.draft === true,
  };
}

let cache: MdxPost[] | undefined;

/** Todos os posts MDX, inclusive rascunhos, do mais recente para o mais antigo. */
export function loadMdxPosts(dir = contentDir()): MdxPost[] {
  if (cache && dir === contentDir()) return cache;
  if (!dir) return [];
  const result = readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).flatMap((entry): MdxPost[] => {
    const versions: Partial<Record<BlogLang, MdxVersion>> = {};
    for (const lang of BLOG_LANGS) {
      const file = path.join(dir, entry.name, `${lang}.mdx`);
      if (existsSync(file)) versions[lang] = readVersion(file, lang, entry.name);
    }
    // Português primeiro quando existe: é o idioma principal do blog.
    const defaultLang = versions.pt ? "pt" : versions.en ? "en" : undefined;
    if (!defaultLang) return [];
    return [{ slug: entry.name, defaultLang, versions, draft: versions[defaultLang]!.draft }];
  }).sort((a, b) => b.versions[b.defaultLang]!.date.localeCompare(a.versions[a.defaultLang]!.date));
  if (dir === contentDir()) cache = result;
  return result;
}

export function findMdxPost(slug: string) {
  return loadMdxPosts().find((post) => post.slug === slug);
}

/** Adapta o post MDX ao formato dos posts antigos: índice, sitemap e home funcionam igual. */
export function toBlogPost(post: MdxPost): BlogPost {
  const main = post.versions[post.defaultLang]!;
  return {
    slug: post.slug,
    titulo: main.title,
    resumo: main.summary,
    autor: author.name,
    publishedAt: main.date,
    updatedAt: main.updated,
    tags: main.tags,
    tempoLeitura: main.readingMinutes,
    publicado: !post.draft,
    blocos: [],
    mdx: { defaultLang: post.defaultLang, langs: BLOG_LANGS.filter((lang) => post.versions[lang]), draft: post.draft },
  };
}

/** Posts MDX publicados (sem rascunhos), já no formato BlogPost. */
export function publishedMdxBlogPosts(): BlogPost[] {
  return loadMdxPosts().filter((post) => !post.draft).map(toBlogPost);
}
