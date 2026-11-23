import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Byline } from "@/components/authority/byline";
import { AccessTag, KindBadge, focusRing, kickerClass } from "@/components/biblioteca/library-ui";
import { authorLine, findReadingPath, levelLabel, pathReferences, readingPaths } from "@/lib/reference-library";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return readingPaths.map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = findReadingPath(slug);
  if (!path) return {};
  return {
    title: `${path.title}: trilha de leitura | Biblioteca de QA`,
    description: `${path.audience} ${path.description}`,
    alternates: { canonical: `/biblioteca/trilhas/${path.slug}` },
  };
}

export default async function ReadingPathPage({ params }: PageProps) {
  const { slug } = await params;
  const path = findReadingPath(slug);
  if (!path) notFound();

  const steps = pathReferences(path);
  const others = readingPaths.filter((other) => other.slug !== path.slug);

  return <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
    <Link href="/biblioteca" className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", focusRing)}>
      <ArrowLeft className="size-4" aria-hidden="true" />Biblioteca
    </Link>

    <header className="mt-6 border-b border-border pb-8">
      <p className={kickerClass}>Trilha de leitura · {levelLabel(path.level)}</p>
      <h1 className="qa-page-title mt-3 text-4xl leading-tight sm:text-5xl">{path.title}</h1>
      <p className="mt-4 text-lg leading-8">{path.audience}</p>
      <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">{path.description}</p>
      <p className="mt-4 font-mono text-xs text-muted-foreground">{steps.length} leituras, nesta ordem</p>
      <Byline label="Trilha montada por" className="mt-5" />
    </header>

    <ol className="mt-8">
      {steps.map((step, index) => {
        const ref = step.reference;
        return <li key={step.ref} className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 pb-8 last:pb-0 sm:grid-cols-[3rem_minmax(0,1fr)]">
          {index < steps.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[1.2rem] top-11 w-px bg-border sm:left-6" />}
          <span className="flex size-10 items-center justify-center border border-brand-accent/60 bg-card font-mono text-sm font-bold text-brand-accent sm:size-12">{index + 1}</span>
          <article className="group relative border border-border bg-card p-4 transition-colors hover:border-brand-accent/60 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <KindBadge kind={ref.kind} />
              <span className="font-mono text-xs text-muted-foreground">{ref.year}</span>
              <AccessTag access={ref.access} />
            </div>
            <h2 className="mt-3 text-lg font-semibold leading-snug">
              <Link href={`/biblioteca/${ref.slug}`} className={cn("after:absolute after:inset-0 group-hover:text-brand-accent", focusRing)}>{ref.title}</Link>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{authorLine(ref)}</p>
            <p className="mt-3 text-base leading-7">{step.note}</p>
          </article>
        </li>;
      })}
    </ol>

    <section aria-labelledby="outras-trilhas" className="mt-14 border-t border-border pt-8">
      <h2 id="outras-trilhas" className="text-lg font-semibold">Outras trilhas</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {others.map((other) => <li key={other.slug}>
          <Link href={`/biblioteca/trilhas/${other.slug}`} className={cn("group flex items-center justify-between gap-3 border border-border px-4 py-3 transition-colors hover:border-brand-accent/60", focusRing)}>
            <span><span className="block font-semibold">{other.title}</span><span className="text-xs text-muted-foreground">{levelLabel(other.level)} · {other.steps.length} leituras</span></span>
            <ArrowRight className="size-4 shrink-0 text-brand-accent transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </li>)}
      </ul>
    </section>
  </main>;
}
