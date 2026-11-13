import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Download, Github, Linkedin, Microscope, TestTube2 } from "lucide-react";
import { author, SITE_URL } from "@/content/site";
import { projects } from "@/lib/authority/content";
import { getResearchStats } from "@/lib/research-library";

// Página de confiança do site: quem construiu, como trabalha e onde encontrar
// o trabalho. A trajetória é a do projeto, porque o repositório não tem datas
// de carreira verificadas. Foto, CV e talks entram quando o João fornecer.
export const metadata: Metadata = {
  title: `Sobre ${author.name}`,
  description: `${author.name}, ${author.title}. Conheça a trajetória do QA Lab, a stack e os projetos por trás do site.`,
  alternates: { canonical: author.aboutHref },
  openGraph: {
    title: `Sobre ${author.name}`,
    description: `${author.name}, ${author.title}. A trajetória, a stack e os projetos por trás do QA Lab.`,
    url: author.aboutHref,
    type: "website",
    locale: "pt_BR",
  },
};

const linkClass = "inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold transition-colors hover:border-gold hover:text-gold";
const actionClass = "inline-flex min-h-11 w-full items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold transition-colors hover:border-gold hover:text-gold";
const kickerClass = "text-xs font-semibold uppercase tracking-[0.2em] text-gold";
const sectionTitleClass = "font-display mt-2 text-3xl uppercase leading-none sm:text-4xl";
const bodyClass = "mt-4 leading-8 text-muted-foreground";

function external(href: string) {
  return /^https?:\/\//.test(href);
}

export default function AboutPage() {
  const research = getResearchStats();
  const trajectory = [
    {
      icon: TestTube2,
      title: "Sistemas para praticar",
      text: "Labs de loja, login, espera, acessibilidade e API, cada um com um modo correto e um modo com bug. A prática termina em um relatório em Markdown.",
    },
    {
      icon: BookOpen,
      title: "Conteúdo para consultar",
      text: "Artigos sobre investigação, automação, risco e comunicação, além de guias das ferramentas que aparecem na rotina de QA.",
    },
    {
      icon: Microscope,
      title: "Pesquisa para decidir",
      text: `${research.total} trabalhos acadêmicos indexados, organizados por tema e ano, para consultar evidências antes de decidir.`,
    },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.title,
      description: author.shortBio,
      image: `${SITE_URL}${author.photo}`,
      url: `${SITE_URL}${author.aboutHref}`,
      sameAs: [author.links.linkedin, author.links.github],
      knowsAbout: author.about.stack,
    },
  };

  return <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

    <header className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end">
      <Image src={author.photo} alt={`Foto de ${author.name}`} width={160} height={160} unoptimized priority className="size-32 rounded-full border-2 border-gold object-cover sm:size-40" />
      <div>
        <p className={kickerClass}>{author.name}</p>
        <h1 className="font-display mt-2 text-5xl uppercase leading-[0.95] sm:text-6xl">{author.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{author.about.intro}</p>
        <nav aria-label="Perfis" className="mt-7 flex flex-wrap gap-3">
          <a href={author.links.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}><Linkedin className="size-4" aria-hidden="true" />LinkedIn</a>
          <a href={author.links.github} target="_blank" rel="noopener noreferrer" className={linkClass}><Github className="size-4" aria-hidden="true" />GitHub</a>
          {author.cv && <a href={author.cv} download className={linkClass}><Download className="size-4" aria-hidden="true" />Baixar currículo</a>}
        </nav>
      </div>
    </header>

    <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
      <div className="space-y-14">
        <section aria-labelledby="trajetoria-title">
          <p className={kickerClass}>Trajetória</p>
          <h2 id="trajetoria-title" className={sectionTitleClass}>Do playground à biblioteca</h2>
          <p className={bodyClass}>{author.about.story}</p>
          <ol className="mt-8 space-y-7">
            {trajectory.map((item, index) => <li key={item.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
              <span className="flex size-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold" aria-hidden="true"><item.icon className="size-5" /></span>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-mono text-xs text-gold">0{index + 1}</span>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
              </div>
            </li>)}
          </ol>
        </section>

        <section aria-labelledby="stack-title">
          <p className={kickerClass}>Stack</p>
          <h2 id="stack-title" className={sectionTitleClass}>Com o que eu trabalho</h2>
          <p className={bodyClass}>{author.about.stackNote}</p>
          <ul aria-label="Tecnologias" className="mt-5 flex flex-wrap gap-2">
            {author.about.stack.map((item) => <li key={item} className="rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground">{item}</li>)}
          </ul>
        </section>

        <section aria-labelledby="projetos-title">
          <p className={kickerClass}>Projetos</p>
          <h2 id="projetos-title" className={sectionTitleClass}>O que eu construí</h2>
          <ul className="mt-6 grid gap-4">
            {projects.map((project) => <li key={project.slug}>
              <article className="rounded-xl border border-border bg-card p-5 sm:p-6">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <p className="mt-1 text-sm font-medium text-gold">{project.tagline}</p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">{project.description}</p>
                {project.stack.length > 0 && <ul aria-label={`Tecnologias de ${project.name}`} className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((item) => <li key={item} className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">{item}</li>)}
                </ul>}
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {project.demo && (external(project.demo)
                    ? <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:text-gold">Abrir demo<ArrowUpRight className="size-4" aria-hidden="true" /></a>
                    : <Link href={project.demo} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:text-gold">Ver o site<ArrowRight className="size-4" aria-hidden="true" /></Link>)}
                  {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:text-gold"><Github className="size-4" aria-hidden="true" />Código no GitHub<ArrowUpRight className="size-4" aria-hidden="true" /></a>}
                </div>
              </article>
            </li>)}
          </ul>
        </section>
      </div>

      <aside aria-labelledby="contato-title" className="h-fit rounded-xl border border-gold/40 bg-card p-6 lg:sticky lg:top-24">
        <p className={kickerClass}>Contato</p>
        <h2 id="contato-title" className="font-display mt-2 text-2xl uppercase leading-none">Vamos conversar</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{author.about.contactNote}</p>
        <div className="mt-5 grid gap-2">
          <a href={author.links.linkedin} target="_blank" rel="noopener noreferrer" className={actionClass}><Linkedin className="size-4" aria-hidden="true" />LinkedIn<ArrowUpRight className="ml-auto size-4" aria-hidden="true" /></a>
          <a href={author.links.github} target="_blank" rel="noopener noreferrer" className={actionClass}><Github className="size-4" aria-hidden="true" />GitHub<ArrowUpRight className="ml-auto size-4" aria-hidden="true" /></a>
          {author.cv && <a href={author.cv} download className={actionClass}><Download className="size-4" aria-hidden="true" />Baixar currículo<ArrowUpRight className="ml-auto size-4" aria-hidden="true" /></a>}
        </div>
      </aside>
    </div>

    <section aria-labelledby="explore-title" className="mt-14 border-t border-border pt-8">
      <p className={kickerClass}>Continue</p>
      <h2 id="explore-title" className="font-display mt-2 text-2xl uppercase">Veja o trabalho em prática</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/blog" className={linkClass}><BookOpen className="size-4" aria-hidden="true" />Ler os artigos</Link>
        <Link href="/pesquisa" className={linkClass}><Microscope className="size-4" aria-hidden="true" />Explorar a biblioteca</Link>
      </div>
    </section>
  </main>;
}
