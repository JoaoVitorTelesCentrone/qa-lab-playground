import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPortfolio } from "@/lib/product/portfolio";
import { reproductionSteps } from "@/lib/product/portfolio-format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio) return { title: "Portfólio não encontrado | QA Lab" };
  return {
    title: `${portfolio.name} — evidências de QA | QA Lab`,
    description: portfolio.headline || `${portfolio.entries.length} evidências registradas em ${portfolio.labsCovered} Labs do QA Lab.`,
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  // Portfólio privado e portfólio inexistente respondem igual, de propósito:
  // não dá para descobrir quem tem conta testando nomes de usuário.
  if (!portfolio) notFound();

  return <main className="qa-system"><div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
    <header>
      <p className="qa-eyebrow">Portfólio de evidências</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">{portfolio.name}</h1>
      {portfolio.headline && <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">{portfolio.headline}</p>}
      {portfolio.role && <p className="mt-2 text-sm text-muted-foreground">{portfolio.role}</p>}
      {portfolio.bio && <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{portfolio.bio}</p>}
      {portfolio.linkedin && <p className="mt-4"><a href={portfolio.linkedin} rel="noopener noreferrer nofollow" target="_blank" className="text-sm text-primary">LinkedIn →</a></p>}
    </header>

    <dl className="mt-8 grid divide-y divide-border rounded-xl border border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div className="p-4 sm:p-5"><dt className="text-xs text-muted-foreground">Evidências publicadas</dt><dd className="mt-1.5 text-2xl font-semibold tracking-[-0.03em]">{portfolio.entries.length}</dd></div>
      <div className="p-4 sm:p-5"><dt className="text-xs text-muted-foreground">Labs cobertos</dt><dd className="mt-1.5 text-2xl font-semibold tracking-[-0.03em]">{portfolio.labsCovered}</dd></div>
      <div className="p-4 sm:p-5">
        <dt className="text-xs text-muted-foreground">Por severidade</dt>
        <dd className="mt-2 flex flex-wrap gap-1.5">
          {portfolio.bySeverity.length === 0
            ? <span className="text-sm text-muted-foreground">—</span>
            : portfolio.bySeverity.map((item) => <Badge key={item.severity} variant="secondary" className="font-normal">{item.severity}: {item.total}</Badge>)}
        </dd>
      </div>
    </dl>

    {portfolio.entries.length === 0
      ? <p className="mt-8 rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">Nenhuma evidência publicada ainda.</p>
      : <ol className="mt-8 grid gap-4">{portfolio.entries.map((entry) => <li key={entry.id}>
          <article className="rounded-xl border border-border p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-primary">LAB {String(entry.labNumber).padStart(2, "0")} · {entry.labArea}</p>
                <h2 className="mt-1.5 text-lg font-semibold">{entry.labTitle}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={entry.severity === "critica" || entry.severity === "alta" ? "destructive" : "secondary"} className="font-normal">severidade {entry.severity}</Badge>
                <time dateTime={entry.createdAt} className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString("pt-BR")}</time>
              </div>
            </div>

            <h3 className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Resultado observado</h3>
            <p className="mt-1.5 whitespace-pre-line text-sm leading-6">{entry.result}</p>

            <h3 className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Passos de reprodução</h3>
            <ol className="mt-1.5 list-decimal pl-5 text-sm leading-6 text-muted-foreground">
              {reproductionSteps(entry.reproduction).map((step) => <li key={step}>{step}</li>)}
            </ol>

            {entry.checklist.length > 0 && <>
              <h3 className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Critérios confirmados</h3>
              <ul className="mt-1.5 grid gap-1 text-sm text-muted-foreground">{entry.checklist.map((item) => <li key={item}>✓ {item}</li>)}</ul>
            </>}
          </article>
        </li>)}</ol>}

    <footer className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
      <p className="text-sm text-muted-foreground">Evidências produzidas praticando em ambientes reais no QA Lab.</p>
      <Button asChild variant="outline"><Link href="/">Conhecer o QA Lab</Link></Button>
    </footer>
  </div></main>;
}
