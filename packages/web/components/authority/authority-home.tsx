import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Bug, CalendarClock, Clock3, Github, Microscope, Wrench } from "lucide-react";
import { author } from "@/content/site";
import { challenge, formatRelease, isSolutionReleased } from "@/lib/authority/challenge";
import { featuredLabs, latestPost, projects } from "@/lib/authority/content";
import { formatDate } from "@/lib/blog-posts";
import { LABS_ENABLED } from "@/lib/product/features";
import { allPosts } from "@/lib/blog/all-posts";
import { getResearchStats } from "@/lib/research-library";
import { toolGuides } from "@/lib/tool-guides";

// Home do site de autoridade: quem construiu, o que construiu e onde acompanhar.
// Todo o conteúdo vem de content/ (site.ts, featured-labs.json, challenge.json,
// projects.json) e dos posts do blog.

const external = (href: string) => /^https?:\/\//.test(href);

function SectionHead({ id, kicker, title, href, linkLabel }: { id: string; kicker: string; title: string; href?: string; linkLabel?: string }) {
  return <div className="flex flex-wrap items-end justify-between gap-3">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">{kicker}</p>
      <h2 id={id} className="font-display mt-2 text-3xl uppercase leading-none sm:text-4xl">{title}</h2>
    </div>
    {href && <Link href={href} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-brand-accent">{linkLabel}<ArrowRight className="size-4" aria-hidden="true" /></Link>}
  </div>;
}

const pillars = () => [
  { href: "/blog", icon: BookOpen, title: "Artigos", count: allPosts.length, unit: allPosts.length === 1 ? "artigo" : "artigos", text: "Textos práticos sobre testes, investigação de bugs e as decisões que fazem um produto ser confiável." },
  { href: "/ferramentas", icon: Wrench, title: "Guias de ferramentas", count: toolGuides.length, unit: "guias", text: "Documentação oficial, cursos gratuitos e vídeos selecionados para estudar as ferramentas que o mercado de QA usa." },
  { href: "/pesquisa", icon: Microscope, title: "Referências científicas", count: getResearchStats().total, unit: "trabalhos", text: "Uma biblioteca de pesquisas acadêmicas sobre qualidade de software, para embasar o que você pratica." },
];

export function AuthorityHome() {
  const post = latestPost();
  const released = isSolutionReleased(challenge);

  return <main>
    <section aria-labelledby="hero-title" className="border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent">{LABS_ENABLED ? <>QA Lab · por {author.name}</> : "QA Lab · conteúdo sobre qualidade de software"}</p>
          <h1 id="hero-title" className="font-display mt-4 text-5xl uppercase leading-[0.92] sm:text-7xl">
            {LABS_ENABLED ? <>Labs práticos de QA com <span className="text-brand-accent">bugs reais</span>, feitos por um {author.title}</> : <>Conteúdo para quem leva <span className="text-brand-accent">qualidade de software</span> a sério</>}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{LABS_ENABLED ? "Todo lab tem um modo correto e um modo com bug. Ligue o bug, encontre, prove e escreva o relatório." : "O QA Lab reúne artigos, guias de ferramentas e referências científicas para você entender, estudar e discutir qualidade de software, do teste ao processo."}</p>
          <div data-onboarding="home-cta" className="mt-8 flex flex-wrap gap-3">
            {LABS_ENABLED ? <>
              <Link href="/labs" data-event="start_lab" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-brand-accent px-6 text-base font-bold text-[#14110b] transition-colors hover:bg-brand-accent/90">Começar um lab <ArrowRight className="size-4" aria-hidden="true" /></Link>
              <Link href="/desafio" className="inline-flex min-h-12 items-center gap-2 rounded-md border border-brand-accent/50 px-6 text-base font-bold text-brand-accent transition-colors hover:bg-brand-accent/10"><Bug className="size-4" aria-hidden="true" />Desafio da semana</Link>
            </> : <>
              <Link href="/blog" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-brand-accent px-6 text-base font-bold text-[#14110b] transition-colors hover:bg-brand-accent/90">Ler o blog <ArrowRight className="size-4" aria-hidden="true" /></Link>
              <Link href="/ferramentas" className="inline-flex min-h-12 items-center gap-2 rounded-md border border-brand-accent/50 px-6 text-base font-bold text-brand-accent transition-colors hover:bg-brand-accent/10">Ver os guias</Link>
            </>}
          </div>
        </div>
        <Link href={author.aboutHref} data-testid="author-byline" className="group flex items-center gap-5 rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand-accent/60 lg:flex-col lg:items-start">
          <Image src={author.photo} alt={`Foto de ${author.name}`} width={160} height={160} priority unoptimized className="size-24 rounded-full border-2 border-brand-accent object-cover lg:size-36" />
          <span>
            <span className="block text-sm text-muted-foreground">Feito por</span>
            <span className="font-display block text-3xl uppercase leading-tight group-hover:text-brand-accent">{author.name}</span>
            <span className="block text-sm text-muted-foreground">{author.title}</span>
          </span>
        </Link>
      </div>
    </section>

    <div className="mx-auto grid max-w-6xl gap-16 px-5 py-14 sm:px-8 sm:py-20">
      {!LABS_ENABLED && <section aria-labelledby="pillars-title">
        <SectionHead id="pillars-title" kicker="Objetivo" title="O que você encontra aqui" />
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Qualidade de software é mais que executar testes: é fazer boas perguntas, escolher o que vale verificar e comunicar riscos. O conteúdo daqui está organizado em três frentes.</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">{pillars().map((item) => <li key={item.href}>
          <Link href={item.href} className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <span className="flex items-center justify-between"><item.icon className="size-6 text-brand-accent" aria-hidden="true" /><ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-brand-accent" aria-hidden="true" /></span>
            <span className="font-display mt-5 text-4xl leading-none text-brand-accent">{item.count}<span className="ml-2 font-sans text-sm font-medium normal-case text-muted-foreground">{item.unit}</span></span>
            <span className="mt-3 text-lg font-semibold">{item.title}</span>
            <span className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</span>
          </Link>
        </li>)}</ul>
      </section>}

      {LABS_ENABLED && <section aria-labelledby="featured-title">
        <SectionHead id="featured-title" kicker="Labs em destaque" title="Escolha um bug para caçar" href="/labs" linkLabel="Todos os labs" />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">{featuredLabs.map((lab) => <li key={lab.href} className="flex flex-col rounded-lg border border-border bg-card p-5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">{lab.track}</span>
          <h3 className="mt-2 text-lg font-semibold leading-snug">{lab.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{lab.summary}</p>
          <div className="mt-4 flex flex-wrap gap-x-5">
            <Link href={lab.href} data-event="start_lab" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:text-brand-accent">Abrir lab<ArrowRight className="size-4" aria-hidden="true" /></Link>
            {lab.bugHref && <Link href={lab.bugHref} data-event="start_lab" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-accent"><Bug className="size-4" aria-hidden="true" />Modo bug</Link>}
          </div>
        </li>)}</ul>
      </section>}

      {LABS_ENABLED && <section aria-labelledby="challenge-title" className="rounded-xl border border-brand-accent/40 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Desafio da semana · {challenge.week}</p>
        <h2 id="challenge-title" className="font-display mt-2 text-3xl uppercase leading-none sm:text-5xl">{challenge.title}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{challenge.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/desafio" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-brand-accent px-5 text-sm font-bold text-[#14110b] hover:bg-brand-accent/90">Encarar o desafio <ArrowRight className="size-4" aria-hidden="true" /></Link>
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><CalendarClock className="size-4" aria-hidden="true" />{released ? "Solução publicada" : `Solução em ${formatRelease(challenge.solutionReleaseAt)}`}</span>
        </div>
      </section>}

      {post && <section aria-labelledby="post-title">
        <SectionHead id="post-title" kicker="Último artigo" title="Do blog" href="/blog" linkLabel="Todos os artigos" />
        <Link href={`/blog/${post.slug}`} className="group mt-6 block rounded-lg border border-border bg-card p-6 transition-colors hover:border-brand-accent/60">
          <h3 className="text-2xl font-semibold leading-snug group-hover:text-brand-accent">{post.titulo}</h3>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{post.resumo}</p>
          <p className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
            <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" aria-hidden="true" />{post.tempoLeitura} min</span>
          </p>
        </Link>
      </section>}

      {projects.length > 0 && <section aria-labelledby="projects-title">
        <SectionHead id="projects-title" kicker="Projetos" title="O que eu construí" />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">{projects.map((project) => <li key={project.slug} className="flex flex-col rounded-lg border border-border bg-card p-5">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="mt-1 text-sm text-brand-accent">{project.tagline}</p>
          <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{project.description}</p>
          {project.stack.length > 0 && <ul aria-label="Tecnologias" className="mt-4 flex flex-wrap gap-1.5">{project.stack.map((item) => <li key={item} className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">{item}</li>)}</ul>}
          <div className="mt-4 flex flex-wrap gap-x-5">
            {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:text-brand-accent"><Github className="size-4" aria-hidden="true" />GitHub<span className="sr-only"> (abre em nova aba)</span></a>}
            {project.demo && (external(project.demo)
              ? <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:text-brand-accent">Demo<ArrowUpRight className="size-4" aria-hidden="true" /></a>
              : project.demo !== "/" && <Link href={project.demo} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:text-brand-accent">Demo<ArrowRight className="size-4" aria-hidden="true" /></Link>)}
          </div>
        </li>)}</ul>
      </section>}
    </div>
  </main>;
}
