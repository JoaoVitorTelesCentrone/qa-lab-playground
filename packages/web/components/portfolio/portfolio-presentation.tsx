import type { CSSProperties } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PortfolioView } from "./portfolio-view";
import { ProfileLinks } from "./profile-links";
import { PortfolioExportPanel } from "./portfolio-export-panel";
import type { Portfolio } from "@/lib/product/portfolio";
import { normalizePortfolioAppearance, PORTFOLIO_PALETTES, type PortfolioAppearance } from "@/lib/product/portfolio-appearance";

export function PortfolioPresentation({ portfolio, appearance: input, preview = false }: { portfolio: Portfolio; appearance?: PortfolioAppearance; preview?: boolean }) {
  const appearance = normalizePortfolioAppearance(input ?? portfolio.appearance);
  const palette = PORTFOLIO_PALETTES.find((item) => item.id === appearance.palette)!;
  const style = {
    "--background": palette.background, "--foreground": palette.foreground,
    "--card": palette.card, "--card-foreground": palette.foreground,
    "--muted": palette.card, "--muted-foreground": palette.muted,
    "--primary": palette.accent, "--primary-foreground": palette.onAccent,
    "--accent": palette.card, "--accent-foreground": palette.foreground,
    "--border": palette.border, "--ring": palette.accent,
    colorScheme: palette.scheme,
  } as CSSProperties;
  const { stats } = portfolio;

  return <main className="portfolio-surface" data-layout={appearance.layout} data-palette={appearance.palette} style={style}><div className="portfolio-shell mx-auto px-5 py-12 sm:px-8 sm:py-16">
    {/* O topo é sobre a pessoa, não sobre o produto. A versão anterior abria com
        "PORTFÓLIO DE EVIDÊNCIAS" e gastava a área mais valiosa da página
        explicando o QA Lab para quem veio ver o trabalho de alguém. */}
    <header className="portfolio-header flex flex-wrap items-start justify-between gap-6">
      <div className="min-w-0">
        <h1 className="break-words [overflow-wrap:anywhere] text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{portfolio.name}</h1>
        <p className="mt-2 text-base text-primary">{portfolio.role || "Quality Assurance"}</p>
        {portfolio.headline && <p className="mt-5 max-w-xl text-lg leading-7 text-muted-foreground">{portfolio.headline}</p>}
      </div>

      <ProfileLinks linkedin={portfolio.linkedin} github={portfolio.github} />
    </header>

    <dl className="portfolio-stats mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
      <Stat label="Projetos" value={portfolio.projects.length} />
      <Stat label="Evidências" value={stats.evidences} />
      <Stat label="Bugs encontrados" value={stats.bugs} />
      <Stat label="Sistemas testados" value={stats.domains} />
      <Stat label="Com prova anexada" value={stats.documented} />
    </dl>


    <PortfolioView
      username={portfolio.username}
      name={portfolio.name}
      bio={portfolio.bio}
      role={portfolio.role}
      linkedin={portfolio.linkedin}
      github={portfolio.github}
      entries={portfolio.entries}
      featuredSubmissionIds={portfolio.featuredSubmissionIds}
      projects={portfolio.projects}
      stats={stats}
      skills={portfolio.skills}
      sections={portfolio.sections}
    />

    {portfolio.mentorshipCases.length > 0 && <section className="portfolio-mentorship mt-12 border-t border-border pt-8"><p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Cases da mentoria</p><div className="mt-4 grid gap-3">{portfolio.mentorshipCases.map((item) => <Link key={item.id} href={`/portfolio/${portfolio.username}/mentoria/${item.id}`} className="rounded-xl border border-border p-5 transition hover:border-primary"><h2 className="text-lg font-semibold">{item.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.summary}</p></Link>)}</div></section>}

    {!preview && <div className="portfolio-export mt-12"><PortfolioExportPanel username={portfolio.username} /></div>}

    <footer className="portfolio-footer mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
      <p className="text-sm text-muted-foreground">Evidências produzidas praticando em ambientes reais no QA Lab.</p>
      <Button asChild variant="outline"><Link href="/">Conhecer o QA Lab</Link></Button>
    </footer>
  </div></main>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="bg-card p-4 sm:p-5">
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="mt-1.5 text-3xl font-semibold tracking-[-0.04em]">{value}</dd>
  </div>;
}
