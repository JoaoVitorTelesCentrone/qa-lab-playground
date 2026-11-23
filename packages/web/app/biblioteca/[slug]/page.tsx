import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AlertTriangle, ArrowLeft, ArrowUpRight, Lightbulb, Route, Wrench } from "lucide-react";
import { Byline } from "@/components/authority/byline";
import { CitationBox } from "@/components/biblioteca/citation-box";
import { AccessTag, KindBadge, LevelTag, ReferenceCard, Tag, focusRing, kickerClass } from "@/components/biblioteca/library-ui";
import { SITE_URL } from "@/content/site";
import {
  authorLine,
  citations,
  displayName,
  findReference,
  getLibraryEntries,
  kindLabel,
  pathsWithReference,
  references,
  relatedReferences,
  topicLabel,
  type LibraryReference,
} from "@/lib/reference-library";
import { findToolGuide } from "@/lib/tool-guides";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return references.map((ref) => ({ slug: ref.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ref = findReference(slug);
  if (!ref) return {};
  return {
    title: `${ref.title} (${authorLine(ref, 1)}, ${ref.year}) | Biblioteca de QA`,
    description: ref.summary,
    alternates: { canonical: `/biblioteca/${ref.slug}` },
  };
}

function jsonLd(ref: LibraryReference) {
  const type = ref.kind === "livro" ? "Book" : ref.kind === "artigo" ? "ScholarlyArticle" : "CreativeWork";
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: ref.subtitle ? `${ref.title}: ${ref.subtitle}` : ref.title,
    ...(ref.authors?.length
      ? { author: ref.authors.map((name) => ({ "@type": "Person", name: displayName(name) })) }
      : { author: { "@type": "Organization", name: ref.organization } }),
    datePublished: String(ref.year),
    ...(ref.kind === "artigo" ? { isPartOf: { "@type": "Periodical", name: ref.venue } } : { publisher: { "@type": "Organization", name: ref.venue } }),
    inLanguage: ref.lang,
    url: ref.url,
    ...(ref.doi ? { sameAs: `https://doi.org/${ref.doi}`, identifier: { "@type": "PropertyValue", propertyID: "DOI", value: ref.doi } } : {}),
    description: ref.summary,
    subjectOf: { "@type": "WebPage", url: `${SITE_URL}/biblioteca/${ref.slug}` },
  };
}

function Block({ id, icon: Icon, title, children, className }: { id: string; icon?: typeof Lightbulb; title: string; children: React.ReactNode; className?: string }) {
  return <section aria-labelledby={id} className={cn("mt-10", className)}>
    <h2 id={id} className="flex items-center gap-2 text-xl font-semibold">{Icon && <Icon className="size-5 text-brand-accent" aria-hidden="true" />}{title}</h2>
    <div className="mt-3">{children}</div>
  </section>;
}

export default async function ReferencePage({ params }: PageProps) {
  const { slug } = await params;
  const ref = findReference(slug);
  if (!ref) notFound();

  const entries = getLibraryEntries();
  const related = relatedReferences(ref).map((other) => entries.find((entry) => entry.id === other.slug)!);
  const inPaths = pathsWithReference(ref.slug);
  const tools = (ref.tools ?? []).flatMap((toolSlug) => {
    const guide = findToolGuide(toolSlug);
    return guide ? [guide] : [];
  });
  const authors = ref.authors?.map(displayName).join(", ") ?? ref.organization;
  const locator = [ref.venue, ref.volume && `v. ${ref.volume}`, ref.issue && `n. ${ref.issue}`, ref.pages && `p. ${ref.pages}`, ref.edition && `${ref.edition}ª edição`].filter(Boolean).join(" · ");

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(ref)).replace(/</g, "\\u003c") }} />

    <nav aria-label="Navegação estrutural" className="text-sm text-muted-foreground">
      <Link href="/biblioteca" className={cn("inline-flex items-center gap-2 hover:text-foreground", focusRing)}><ArrowLeft className="size-4" aria-hidden="true" />Biblioteca</Link>
      <span aria-hidden="true"> / </span>
      <Link href={`/biblioteca?tipo=${ref.kind}#acervo`} className={cn("hover:text-foreground", focusRing)}>{kindLabel(ref.kind)}s</Link>
    </nav>

    <header className="mt-6 grid gap-8 border-b border-border pb-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <KindBadge kind={ref.kind} />
          <span className="font-mono text-sm text-muted-foreground">{ref.year}</span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-.03em] sm:text-5xl">{ref.title}</h1>
        {ref.subtitle && <p className="mt-2 text-lg leading-7 text-muted-foreground sm:text-xl">{ref.subtitle}</p>}
        <p className="mt-5 text-base font-medium">{authors}</p>
        <p className="mt-1 text-sm text-muted-foreground">{locator}</p>
        <p className="mt-6 max-w-2xl text-lg leading-8">{ref.summary}</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          <LevelTag level={ref.level} />
          <AccessTag access={ref.access} />
          <Tag>{ref.lang === "pt" ? "Português" : "Inglês"}</Tag>
          {ref.topics.map((topic) => <Link key={topic} href={`/biblioteca?tema=${topic}#acervo`} className={cn("inline-flex items-center border border-border px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-brand-accent/60 hover:text-brand-accent", focusRing)}>{topicLabel(topic)}</Link>)}
        </div>
        <Byline label="Resumo e curadoria de" className="mt-6" />
      </div>

      <aside className="border border-border bg-card p-5">
        <a href={ref.url} target="_blank" rel="noopener noreferrer" className={cn("flex min-h-12 items-center justify-center gap-2 bg-brand-accent px-5 text-sm font-bold text-background transition-colors hover:bg-brand-accent/90", focusRing)}>
          {ref.kind === "livro" ? "Ver o livro" : ref.kind === "norma" ? "Abrir a norma" : ref.kind === "guia" ? "Ler o texto" : "Abrir o artigo"}
          <ArrowUpRight className="size-4" aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span>
        </a>
        {ref.openUrl && <a href={ref.openUrl.url} target="_blank" rel="noopener noreferrer" className={cn("mt-2 flex min-h-11 items-center justify-center gap-2 border border-brand-accent/50 px-4 text-sm font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-background", focusRing)}>
          {ref.openUrl.label}<ArrowUpRight className="size-4" aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span>
        </a>}
        <dl className="mt-5 grid gap-3 text-sm">
          {ref.doi && <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">DOI</dt><dd className="mt-0.5 break-all font-mono text-xs"><a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent">{ref.doi}</a></dd></div>}
          <div><dt className="text-xs uppercase tracking-wide text-muted-foreground">Acesso</dt><dd className="mt-0.5">{ref.access === "aberto" ? "Gratuito na fonte oficial." : ref.openUrl ? "Pago na fonte oficial; há versão gratuita acima." : "Pago. Vale procurar na biblioteca da sua faculdade ou empresa."}</dd></div>
        </dl>
        {inPaths.length > 0 && <div className="mt-5 border-t border-border pt-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><Route className="size-4" aria-hidden="true" />Nas trilhas de leitura</p>
          <ul className="mt-2 space-y-1.5">
            {inPaths.map(({ path, position, total }) => <li key={path.slug}>
              <Link href={`/biblioteca/trilhas/${path.slug}`} className={cn("text-sm font-medium hover:text-brand-accent", focusRing)}>{path.title}</Link>
              <span className="ml-2 font-mono text-xs text-muted-foreground">{position} de {total}</span>
            </li>)}
          </ul>
        </div>}
      </aside>
    </header>

    <div className="grid gap-x-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div>
        <Block id="por-que-ler" title="Por que ler">
          <p className="text-base leading-8 text-foreground/90">{ref.why}</p>
        </Block>

        <Block id="ideias" title="Ideias principais">
          <ol className="grid gap-3">
            {ref.takeaways.map((item, index) => <li key={item} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-l-2 border-brand-accent/50 py-1 pl-3">
              <span className="font-mono text-sm text-brand-accent">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-base leading-7">{item}</span>
            </li>)}
          </ol>
        </Block>

        <Block id="na-pratica" icon={Lightbulb} title="Na prática" className="border border-brand-accent/40 bg-card p-5 sm:p-6">
          <p className="text-base leading-7">{ref.inPractice}</p>
        </Block>

        {ref.caution && <Block id="cuidado" icon={AlertTriangle} title="Cuidado ao citar">
          <p className="text-sm leading-7 text-muted-foreground">{ref.caution}</p>
        </Block>}
      </div>

      <div>
        <Block id="citar" title="Como citar">
          <p className="mb-3 text-sm text-muted-foreground">Formatos gerados a partir dos metadados conferidos. Confira com o manual da sua instituição.</p>
          <CitationBox items={citations(ref)} />
        </Block>

        {tools.length > 0 && <Block id="ferramentas" icon={Wrench} title="Ferramentas para praticar">
          <ul className="flex flex-wrap gap-2">
            {tools.map((guide) => <li key={guide.slug}><Link href={`/ferramentas/${guide.slug}`} className={cn("inline-flex border border-border px-3 py-2 text-sm font-semibold transition-colors hover:border-primary hover:text-primary", focusRing)}>{guide.name}</Link></li>)}
          </ul>
        </Block>}
      </div>
    </div>

    {related.length > 0 && <section aria-labelledby="leia-tambem" className="mt-16 border-t border-border pt-10">
      <p className={kickerClass}>Continue</p>
      <h2 id="leia-tambem" className="font-display mt-2 text-2xl uppercase">Leia também</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((entry) => <li key={entry.id}><ReferenceCard entry={entry} /></li>)}
      </ul>
    </section>}
  </main>;
}
