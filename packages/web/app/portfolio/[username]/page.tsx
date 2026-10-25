import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortfolioPresentation } from "@/components/portfolio/portfolio-presentation";
import { getPortfolio } from "@/lib/product/portfolio";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio) return { title: "Portfólio não encontrado | QA Lab" };
  return {
    title: `${portfolio.name} — portfólio de QA | QA Lab`,
    description: portfolio.headline || `${portfolio.projects.length} projeto(s) e ${portfolio.stats.evidences} evidência(s) de teste publicados no QA Lab.`,
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  // Portfólio privado e portfólio inexistente respondem igual, de propósito:
  // não dá para descobrir quem tem conta testando nomes de usuário.
  if (!portfolio) notFound();

  return <PortfolioPresentation portfolio={portfolio} />;
}
