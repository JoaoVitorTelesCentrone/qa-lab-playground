import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bug, CalendarClock, Clock3, Github } from "lucide-react";
import { author } from "@/content/site";
import { challenge, formatRelease, isSolutionReleased } from "@/lib/authority/challenge";
import { featuredLabs, latestPost, projects } from "@/lib/authority/content";
import { formatDate } from "@/lib/blog-posts";

// Home do site de autoridade: quem construiu, o que construiu e onde acompanhar.
// Todo o conteúdo vem de content/ (site.ts, featured-labs.json, challenge.json,
// projects.json) e dos posts do blog.

const external = (href: string) => /^https?:\/\//.test(href);

function SectionHead({ id, kicker, title, href, linkLabel }: { id: string; kicker: string; title: string; href?: string; linkLabel?: string }) {
  return <div className="flex flex-wrap items-end justify-between gap-3">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{kicker}</p>
      <h2 id={id} className="font-display mt-2 text-3xl uppercase leading-none sm:text-4xl">{title}</h2>
    </div>
    {href && <Link href={href} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-gold">{linkLabel}<ArrowRight className="size-4" aria-hidden="true" /></Link>}
  </div>;
}

export function AuthorityHome() {
  const post = latestPost();
  const released = isSolutionReleased(challenge);

  return <main lang="en">
    <section aria-labelledby="hero-title" className="border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">QA Lab · by {author.name}</p>
          <h1 id="hero-title" className="font-display mt-4 text-5xl uppercase leading-[0.92] sm:text-7xl">
            Hands-on QA labs with <span className="text-gold">real bugs</span>, built by a QA Automation Engineer
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Every lab has a correct mode and a bug mode. Switch the bug on, find it, prove it and write the report.</p>
          <div data-onboarding="home-cta" className="mt-8 flex flex-wrap gap-3">
            <Link href="/labs" data-event="start_lab" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-gold px-6 text-base font-bold text-[#14110b] transition-colors hover:bg-gold/90">Start a lab <ArrowRight className="size-4" aria-hidden="true" /></Link>
            <Link href="/desafio" className="inline-flex min-h-12 items-center gap-2 rounded-md border border-gold/50 px-6 text-base font-bold text-gold transition-colors hover:bg-gold/10"><Bug className="size-4" aria-hidden="true" />Weekly challenge</Link>
          </div>
        </div>
        <Link href={author.aboutHref} data-testid="author-byline" className="group flex items-center gap-5 rounded-xl border border-border bg-card p-5 transition-colors hover:border-gold/60 lg:flex-col lg:items-start">
          <Image src={author.photo} alt={`Photo of ${author.name}`} width={160} height={160} priority unoptimized className="size-24 rounded-full border-2 border-gold object-cover lg:size-36" />
          <span>
            <span className="block text-sm text-muted-foreground">Built by</span>
            <span className="font-display block text-3xl uppercase leading-tight group-hover:text-gold">{author.name}</span>
            <span className="block text-sm text-muted-foreground">{author.title}</span>
          </span>
        </Link>
      </div>
    </section>

    <div className="mx-auto grid max-w-6xl gap-16 px-5 py-14 sm:px-8 sm:py-20">
      <section aria-labelledby="featured-title">
        <SectionHead id="featured-title" kicker="Featured labs" title="Pick a bug to hunt" href="/labs" linkLabel="All labs" />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">{featuredLabs.map((lab) => <li key={lab.href} className="flex flex-col rounded-lg border border-border bg-card p-5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{lab.track}</span>
          <h3 className="mt-2 text-lg font-semibold leading-snug">{lab.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{lab.summary}</p>
          <div className="mt-4 flex flex-wrap gap-x-5">
            <Link href={lab.href} data-event="start_lab" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:text-gold">Open lab<ArrowRight className="size-4" aria-hidden="true" /></Link>
            {lab.bugHref && <Link href={lab.bugHref} data-event="start_lab" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-gold"><Bug className="size-4" aria-hidden="true" />Bug mode</Link>}
          </div>
        </li>)}</ul>
      </section>

      <section aria-labelledby="challenge-title" className="rounded-xl border border-gold/40 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Weekly challenge · {challenge.week}</p>
        <h2 id="challenge-title" className="font-display mt-2 text-3xl uppercase leading-none sm:text-5xl">{challenge.title}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{challenge.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/desafio" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-gold px-5 text-sm font-bold text-[#14110b] hover:bg-gold/90">Take the challenge <ArrowRight className="size-4" aria-hidden="true" /></Link>
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><CalendarClock className="size-4" aria-hidden="true" />{released ? "Solution is out" : `Solution on ${formatRelease(challenge.solutionReleaseAt)}`}</span>
        </div>
      </section>

      {post && <section aria-labelledby="post-title">
        <SectionHead id="post-title" kicker="Latest post" title="From the blog" href="/blog" linkLabel="All posts" />
        <Link href={`/blog/${post.slug}`} className="group mt-6 block rounded-lg border border-border bg-card p-6 transition-colors hover:border-gold/60">
          <h3 className="text-2xl font-semibold leading-snug group-hover:text-gold">{post.titulo}</h3>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{post.resumo}</p>
          <p className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
            <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" aria-hidden="true" />{post.tempoLeitura} min</span>
          </p>
        </Link>
      </section>}

      {projects.length > 0 && <section aria-labelledby="projects-title">
        <SectionHead id="projects-title" kicker="Projects" title="What I've built" />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">{projects.map((project) => <li key={project.slug} className="flex flex-col rounded-lg border border-border bg-card p-5">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="mt-1 text-sm text-gold">{project.tagline}</p>
          <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{project.description}</p>
          {project.stack.length > 0 && <ul aria-label="Stack" className="mt-4 flex flex-wrap gap-1.5">{project.stack.map((item) => <li key={item} className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">{item}</li>)}</ul>}
          <div className="mt-4 flex flex-wrap gap-x-5">
            {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:text-gold"><Github className="size-4" aria-hidden="true" />GitHub<span className="sr-only"> (opens in a new tab)</span></a>}
            {project.demo && (external(project.demo)
              ? <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:text-gold">Demo<ArrowUpRight className="size-4" aria-hidden="true" /></a>
              : project.demo !== "/" && <Link href={project.demo} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:text-gold">Demo<ArrowRight className="size-4" aria-hidden="true" /></Link>)}
          </div>
        </li>)}</ul>
      </section>}
    </div>
  </main>;
}
