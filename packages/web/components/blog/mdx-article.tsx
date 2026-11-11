import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock3, Languages } from "lucide-react";
import { Byline } from "@/components/authority/byline";
import { ShareOnLinkedIn } from "@/components/authority/share-on-linkedin";
import { author, SITE_URL } from "@/content/site";
import type { BlogLang, MdxPost } from "@/lib/blog/mdx-posts";

const LANG_LABEL: Record<BlogLang, string> = { pt: "Português", en: "English" };
const HTML_LANG: Record<BlogLang, string> = { pt: "pt-BR", en: "en" };

/** A versão principal mora em /blog/<slug>; as outras em /blog/<slug>/<lang>. */
export function mdxPostPath(post: MdxPost, lang: BlogLang) {
  return lang === post.defaultLang ? `/blog/${post.slug}` : `/blog/${post.slug}/${lang}`;
}

function formatPostDate(date: string, lang: BlogLang) {
  return new Intl.DateTimeFormat(HTML_LANG[lang], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function mdxPostMetadata(post: MdxPost, lang: BlogLang): Metadata {
  const version = post.versions[lang]!;
  const languages = Object.fromEntries(Object.keys(post.versions).map((item) => [HTML_LANG[item as BlogLang], `${SITE_URL}${mdxPostPath(post, item as BlogLang)}`]));
  return {
    title: version.title,
    description: version.summary,
    alternates: { canonical: mdxPostPath(post, lang), languages },
    authors: [{ name: author.name, url: author.aboutHref }],
    // Rascunho abre pelo link direto para revisão, mas não é indexado.
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: version.title,
      description: version.summary,
      url: mdxPostPath(post, lang),
      type: "article",
      locale: lang === "pt" ? "pt_BR" : "en_US",
      authors: [author.name],
      publishedTime: version.date,
      ...(version.updated ? { modifiedTime: version.updated } : {}),
      tags: version.tags,
    },
  };
}

export async function MdxArticle({ post, lang }: { post: MdxPost; lang: BlogLang }) {
  const version = post.versions[lang]!;
  const { default: Content } = await import(`@/content/blog/${post.slug}/${lang}.mdx`);
  const path = mdxPostPath(post, lang);
  const others = (Object.keys(post.versions) as BlogLang[]).filter((item) => item !== lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: version.title,
    description: version.summary,
    inLanguage: HTML_LANG[lang],
    datePublished: version.date,
    ...(version.updated ? { dateModified: version.updated } : {}),
    keywords: version.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${path}` },
    author: { "@type": "Person", name: author.name, jobTitle: author.title, url: `${SITE_URL}${author.aboutHref}`, sameAs: [author.links.linkedin, author.links.github] },
    publisher: { "@type": "Person", name: author.name },
  };

  return <main lang={HTML_LANG[lang]} className="qa-blog">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <article className="mx-auto max-w-3xl px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-12">
      <Link href="/blog" className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Blog</Link>
      {post.draft && <p role="note" className="mt-4 rounded-md border border-gold/50 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold">Draft: unlisted and not indexed. Set <code>draft: false</code> to publish.</p>}
      <header className="mt-6">
        <ul aria-label="Tags" className="flex flex-wrap gap-2">{version.tags.map((tag) => <li key={tag} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted-foreground">#{tag}</li>)}</ul>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">{version.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{version.summary}</p>
        <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Calendar className="size-4" aria-hidden="true" /><time dateTime={version.date}>{formatPostDate(version.date, lang)}</time></span>
          <span className="inline-flex items-center gap-1.5" data-testid="reading-time"><Clock3 className="size-4" aria-hidden="true" />{version.readingMinutes} min {lang === "pt" ? "de leitura" : "read"}</span>
          {others.length > 0 && <span className="inline-flex items-center gap-1.5"><Languages className="size-4" aria-hidden="true" />
            {others.map((other) => <Link key={other} href={mdxPostPath(post, other)} hrefLang={HTML_LANG[other]} lang={HTML_LANG[other]} className="font-semibold text-gold underline underline-offset-4">{LANG_LABEL[other]}</Link>)}
          </span>}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-border py-2">
          <Byline label={lang === "pt" ? "Escrito por" : "Written by"} />
          <ShareOnLinkedIn url={path} />
        </div>
      </header>
      <div className="qa-article-body qa-mdx-body"><Content /></div>
    </article>
  </main>;
}
