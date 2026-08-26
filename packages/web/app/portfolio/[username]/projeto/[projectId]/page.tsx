// Nível do meio do portfólio: o projeto.
//
// Aqui a pessoa apresenta o contexto do trabalho — que sistema é esse, o que
// ela cobriu e quanto — antes de qualquer evidência. As evidências entram
// abaixo, em card raso, com o detalhe na página própria.

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EvidenceCard } from "@/components/portfolio/evidence-card";
import { getPortfolioProject } from "@/lib/product/portfolio";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string; projectId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, projectId } = await params;
  const found = await getPortfolioProject(username, projectId);
  if (!found) return { title: "Projeto não encontrado | QA Lab", robots: { index: false, follow: false } };

  const title = `${found.portfolio.name} — ${found.project.name}`;
  const description = `${found.project.stats.evidences} evidência(s) e ${found.project.stats.bugs} bug(s) registrados testando ${found.project.name} no QA Lab.`;
  return { title, description, openGraph: { title, description, type: "article" } };
}

export default async function ProjectPage({ params }: Props) {
  const { username, projectId } = await params;
  const found = await getPortfolioProject(username, projectId);
  // Projeto sem nada publicado responde igual a projeto inexistente.
  if (!found) notFound();

  const { portfolio, project } = found;
  const { stats } = project;

  return <main className="qa-system"><div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
    <Link href={`/portfolio/${portfolio.username}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground">
      <ArrowLeft className="size-3.5" aria-hidden="true" /> {portfolio.name}
    </Link>

    <header className="mt-6">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Ambiente QA Lab</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{project.name}</h1>
      {project.summary && <p className="mt-4 max-w-xl text-lg leading-7 text-muted-foreground">{project.summary}</p>}

      {project.tags.length > 0 && <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => <span key={tag} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">{tag}</span>)}
      </div>}
    </header>

    <section className="mt-10 border-t border-border pt-8">
      <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Resumo</h2>
      <dl className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <Stat label="Labs cobertos" value={stats.labs} />
        <Stat label="Evidências" value={stats.evidences} />
        <Stat label="Bugs encontrados" value={stats.bugs} />
        <Stat label="Com prova anexada" value={stats.documented} />
      </dl>
    </section>

    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Evidências ({project.entries.length})</h2>
      <div className="mt-4 grid gap-3">
        {project.entries.map((entry) => <EvidenceCard key={entry.id} entry={entry} username={portfolio.username} />)}
      </div>
    </section>

    <footer className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
      <p className="max-w-md text-sm leading-6 text-muted-foreground">Quer testar o mesmo sistema? O ambiente está aberto no QA Lab.</p>
      <div className="flex gap-2">
        <Button asChild variant="outline"><Link href={`/portfolio/${portfolio.username}`}>Ver portfólio</Link></Button>
        <Button asChild><Link href={project.route}>Abrir ambiente</Link></Button>
      </div>
    </footer>
  </div></main>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div>
    <dd className="text-3xl font-semibold tracking-[-0.04em]">{value}</dd>
    <dt className="mt-1 text-xs text-muted-foreground">{label}</dt>
  </div>;
}
