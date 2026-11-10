import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bug, CalendarClock, Lock } from "lucide-react";
import { Byline } from "@/components/authority/byline";
import { ShareOnLinkedIn } from "@/components/authority/share-on-linkedin";
import { challenge, formatRelease, isSolutionReleased } from "@/lib/authority/challenge";

// A data de liberação da solução é avaliada a cada requisição.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Weekly challenge: ${challenge.title}`,
  description: challenge.summary,
  alternates: { canonical: "/desafio" },
};

export default function ChallengePage() {
  const released = isSolutionReleased(challenge);
  return <main lang="en" className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Weekly challenge · {challenge.week} · {challenge.track}</p>
    <h1 className="font-display mt-3 text-5xl uppercase leading-[0.95] sm:text-7xl">{challenge.title}</h1>
    <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{challenge.summary}</p>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-border py-2">
      <Byline />
      <ShareOnLinkedIn url="/desafio" text={`This week's QA challenge: ${challenge.title}. How many can you find?`} />
    </div>

    <section aria-labelledby="start-title" className="mt-10 grid gap-8 sm:grid-cols-[1.4fr_1fr]">
      <div>
        <h2 id="start-title" className="text-xl font-semibold">How to play</h2>
        <ol className="mt-4 grid gap-3">{challenge.start.map((step, index) => <li key={step} className="flex gap-3 text-muted-foreground">
          <span className="font-display text-2xl leading-none text-gold">{String(index + 1).padStart(2, "0")}</span><span className="leading-7">{step}</span>
        </li>)}</ol>
        <Link href={challenge.labHref} data-event="start_lab" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-gold px-5 text-sm font-bold text-[#14110b] hover:bg-gold/90">Open the lab <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </div>
      <aside className="rounded-lg border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold"><Bug className="size-4 text-gold" aria-hidden="true" />{challenge.bugCount} bugs hidden in</h2>
        <ul className="mt-3 grid gap-2 font-mono text-sm">{challenge.endpoints.map((endpoint) => <li key={endpoint}>{endpoint}</li>)}</ul>
      </aside>
    </section>

    <section aria-labelledby="solution-title" className="mt-12 rounded-lg border border-gold/30 p-6">
      <h2 id="solution-title" className="flex items-center gap-2 text-xl font-semibold">{released ? <ArrowRight className="size-5 text-gold" aria-hidden="true" /> : <Lock className="size-5 text-gold" aria-hidden="true" />}Solution</h2>
      {released
        ? <p className="mt-3 text-muted-foreground">The solution is out. <Link href="/desafio/solucao" className="font-semibold text-gold underline underline-offset-4">See all {challenge.bugCount} bugs explained</Link>.</p>
        : <p className="mt-3 flex items-center gap-2 text-muted-foreground"><CalendarClock className="size-4" aria-hidden="true" />Unlocks on <time dateTime={challenge.solutionReleaseAt} data-testid="solution-release">{formatRelease(challenge.solutionReleaseAt)}</time>.</p>}
    </section>
  </main>;
}
