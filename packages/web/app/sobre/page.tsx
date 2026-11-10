import type { Metadata } from "next";
import Image from "next/image";
import { Download, Github, Linkedin } from "lucide-react";
import { author } from "@/content/site";

// Versão mínima: existe para a byline não apontar para um 404. A bio completa,
// a stack e os projetos entram na etapa 7 (docs/PLANO_AUTORIDADE_2026-11.md).
export const metadata: Metadata = {
  title: `About ${author.name}`,
  description: `${author.name}, ${author.title}. ${author.shortBio}`,
  alternates: { canonical: author.aboutHref },
};

const linkClass = "inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold transition-colors hover:border-gold hover:text-gold";

export default function AboutPage() {
  return <main lang="en" className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
    <div className="flex flex-wrap items-center gap-6">
      <Image src={author.photo} alt={`Photo of ${author.name}`} width={120} height={120} unoptimized priority className="size-28 rounded-full border-2 border-gold object-cover" />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{author.name}</p>
        <h1 className="font-display mt-2 text-5xl uppercase leading-none sm:text-6xl">{author.title}</h1>
      </div>
    </div>
    <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">{author.shortBio}</p>
    <nav aria-label="Profiles" className="mt-8 flex flex-wrap gap-3">
      <a href={author.links.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}><Linkedin className="size-4" aria-hidden="true" />LinkedIn</a>
      <a href={author.links.github} target="_blank" rel="noopener noreferrer" className={linkClass}><Github className="size-4" aria-hidden="true" />GitHub</a>
      {author.cv && <a href={author.cv} download className={linkClass}><Download className="size-4" aria-hidden="true" />Download CV</a>}
    </nav>
  </main>;
}
