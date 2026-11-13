import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Byline } from "@/components/authority/byline";
import { ShareOnLinkedIn } from "@/components/authority/share-on-linkedin";
import { challenge, isSolutionReleased } from "@/lib/authority/challenge";

// Antes da data configurada a solução não existe para o público (404).
export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  if (!isSolutionReleased(challenge)) return { title: "Not found", robots: { index: false } };
  return { title: `Solution: ${challenge.title}`, description: `The ${challenge.bugCount} bugs of the ${challenge.week} challenge, explained.`, alternates: { canonical: "/desafio/solucao" } };
}

export default function ChallengeSolutionPage() {
  if (!isSolutionReleased(challenge)) notFound();
  return <main lang="en" className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
    <Link href="/desafio" className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Back to the challenge</Link>
    <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">Solution · {challenge.week}</p>
    <h1 className="font-display mt-3 text-5xl uppercase leading-[0.95] sm:text-6xl">{challenge.title}</h1>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-border py-2">
      <Byline />
      <ShareOnLinkedIn url="/desafio/solucao" />
    </div>
    <ol className="mt-10 grid gap-6">{challenge.solution.map((bug, index) => <li key={bug.title} className="rounded-lg border border-border bg-card p-5">
      <h2 className="flex items-baseline gap-3 text-lg font-semibold"><span className="font-display text-3xl text-brand-accent">{String(index + 1).padStart(2, "0")}</span>{bug.title}</h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
        <dt className="font-semibold">Request</dt><dd className="font-mono">{bug.request}</dd>
        <dt className="font-semibold">Expected</dt><dd className="text-muted-foreground">{bug.expected}</dd>
        <dt className="font-semibold">Actual</dt><dd className="text-muted-foreground">{bug.actual}</dd>
        <dt className="font-semibold">Why it matters</dt><dd className="text-muted-foreground">{bug.why}</dd>
      </dl>
    </li>)}</ol>
  </main>;
}
