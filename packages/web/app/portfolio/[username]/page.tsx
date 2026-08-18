import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { PortfolioView } from "@/components/portfolio/portfolio-view";
import { ProfileLinks } from "@/components/portfolio/profile-links";
import { getPortfolio } from "@/lib/product/portfolio";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio) return { title: "Portfólio não encontrado | QA Lab" };
  return {
    title: `${portfolio.name} — portfólio de QA | QA Lab`,
    description: portfolio.headline || `${portfolio.projects.length} projeto(s) e ${portfolio.stats.evidences} evidência(s) de teste publicadas no QA Lab.`,
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  // Portfólio privado e portfólio inexistente respondem igual, de propósito:
  // não dá para descobrir quem tem conta testando nomes de usuário.
  if (!portfolio) notFound();

  const { stats } = portfolio;

  return <main className="qa-system"><div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
    {/* O topo é sobre a pessoa, não sobre o produto. A versão anterior abria com
        "PORTFÓLIO DE EVIDÊNCIAS" e gastava a área mais valiosa da página
        explicando o QA Lab para quem veio ver o trabalho de alguém. */}
    <header className="flex flex-wrap items-start justify-between gap-6">
      <div className="min-w-0">
        <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{portfolio.name}</h1>
        <p className="mt-2 text-base text-primary">{portfolio.role || "Quality Assurance"}</p>
        {portfolio.headline && <p className="mt-5 max-w-xl text-lg leading-7 text-muted-foreground">{portfolio.headline}</p>}
      </div>

      <ProfileLinks linkedin={portfolio.linkedin} github={portfolio.github} />
    </header>

    <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
      <Stat label="Projetos" value={portfolio.projects.length} />
      <Stat label="Evidências" value={stats.evidences} />
      <Stat label="Bugs encontrados" value={stats.bugs} />
      <Stat label="Critérios validados" value={stats.criteria} />
    </dl>

    <PortfolioView
      username={portfolio.username}
      name={portfolio.name}
      bio={portfolio.bio}
      role={portfolio.role}
      linkedin={portfolio.linkedin}
      github={portfolio.github}
      entries={portfolio.entries}
      projects={portfolio.projects}
      stats={stats}
      skills={portfolio.skills}
      sections={portfolio.sections}
    />

    <footer className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
      <p className="text-sm text-muted-foreground">Evidências produzidas praticando em ambientes reais no QA Lab.</p>
      <Button asChild variant="outline"><Link href="/">Conhecer o QA Lab</Link></Button>
    </footer>
  </div></main>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="bg-card/40 p-4 sm:p-5">
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="mt-1.5 text-3xl font-semibold tracking-[-0.04em]">{value}</dd>
  </div>;
}
