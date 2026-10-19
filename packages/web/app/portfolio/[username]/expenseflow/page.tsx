import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChallengeCaseContent } from "@/components/challenge/challenge-case-content";
import { getPortfolio } from "@/lib/product/portfolio";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio?.challengeCase) return { title: "Case não encontrado | QA Lab" };
  return { title: `${portfolio.challengeCase.title} — ${portfolio.name}`, description: portfolio.challengeCase.summary };
}

export default async function ExpenseFlowCasePage({ params }: Props) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio?.challengeCase) notFound();
  const current = portfolio.challengeCase;

  return <main className="qa-system"><div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
    <nav aria-label="Navegação do case" className="mb-10 text-sm"><Link href={`/portfolio/${portfolio.username}`} className="font-semibold text-primary underline underline-offset-4">← Portfólio de {portfolio.name}</Link></nav>
    <h1 className="sr-only">Case ExpenseFlow de {portfolio.name}</h1>
    <ChallengeCaseContent title={current.title} summary={current.summary} data={current.snapshot} />
    <footer className="mt-14 border-t border-border pt-7 text-sm text-muted-foreground">Publicado por escolha do aluno. <Link href="/playground/expenseflow" className="font-semibold text-primary underline underline-offset-4">Explorar o ExpenseFlow</Link></footer>
  </div></main>;
}
