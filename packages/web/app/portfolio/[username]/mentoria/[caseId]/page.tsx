import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ProfileLinks } from "@/components/portfolio/profile-links";
import { getPortfolio } from "@/lib/product/portfolio";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string; caseId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, caseId } = await params;
  const portfolio = await getPortfolio(username);
  const item = portfolio?.mentorshipCases.find((entry) => entry.id === caseId);
  if (!portfolio || !item) return { title: "Case não encontrado | QA Lab", robots: { index: false, follow: false } };
  return { title: `${portfolio.name} — ${item.title}`, description: item.summary, openGraph: { title: `${portfolio.name} — ${item.title}`, description: item.summary, type: "article" } };
}

export default async function MentorshipCasePage({ params }: Props) {
  const { username, caseId } = await params;
  const portfolio = await getPortfolio(username);
  const item = portfolio?.mentorshipCases.find((entry) => entry.id === caseId);
  if (!portfolio || !item) notFound();
  return <main className="qa-system"><div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16"><Link href={`/portfolio/${portfolio.username}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="size-3.5" aria-hidden="true" /> {portfolio.name}</Link><header className="mt-6 border-b border-border pb-6"><div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><h1 className="text-4xl font-semibold tracking-[-0.04em]">{item.title}</h1>{portfolio.role && <span className="text-sm text-muted-foreground">{portfolio.role}</span>}</div><p className="mt-4 text-lg leading-7 text-muted-foreground">{item.summary}</p><ProfileLinks linkedin={portfolio.linkedin} github={portfolio.github} className="mt-5" /></header><section className="mt-10"><p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Release Challenge · Mentoria QA Lab</p><h2 className="mt-3 text-2xl font-semibold">Decisao e evidencias</h2><p className="mt-4 whitespace-pre-wrap text-base leading-8">{item.evidence}</p></section><div className="mt-10 flex flex-wrap gap-3">{item.repositoryUrl && <a href={item.repositoryUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-primary">Repositorio <ExternalLink className="size-3.5" /></a>}{item.reportUrl && <a href={item.reportUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-primary">Relatorio <ExternalLink className="size-3.5" /></a>}</div></div></main>;
}
