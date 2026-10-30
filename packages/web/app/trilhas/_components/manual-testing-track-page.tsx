import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { manualTestingCourses, type ManualTestingTrackSlug } from "@/lib/manual-testing-courses";
import { getManualTestingProgress } from "@/lib/manual-testing-progress";
import { ManualTestingTrackOverview } from "./manual-testing-track-client";
import { brotoSpaceSite } from "@/lib/mentorship/brotospace-track";

export async function ManualTestingTrackPage({ slug }: { slug: ManualTestingTrackSlug }) {
  const course = manualTestingCourses[slug];
  const progress = await getManualTestingProgress(slug);
  return <main className="qa-manual-testing min-h-[calc(100vh-4rem)] bg-background text-foreground">
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/trilhas" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">← Todas as trilhas</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Fundamentos · 6 Labs · 3 blocos</p>
        <h1 className="qa-page-title mt-3">{course.introTitle}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{course.description}</p>
        <a href={brotoSpaceSite.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline">Praticar no BrotoSpace ↗</a>
      </header>

      <section className="mt-8 border-y border-border py-5" aria-label={`Como funciona: ${course.title}`}>
        <div className="grid gap-4 sm:grid-cols-4">
          {course.flow.map(([name, detail], index) => <div key={name} className="relative flex gap-3 sm:block">
            <span className="flex size-7 shrink-0 items-center justify-center border border-primary/60 font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
            <div className="sm:mt-3"><h2 className="text-sm font-semibold">{name}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></div>
            {index < course.flow.length - 1 && <span className="absolute left-3.5 top-7 h-[calc(100%-1rem)] border-l border-primary/30 sm:left-[2rem] sm:top-3.5 sm:h-0 sm:w-[calc(100%-1rem)] sm:border-l-0 sm:border-t" aria-hidden="true" />}
          </div>)}
        </div>
      </section>

      <ManualTestingTrackOverview course={course} initialCompleted={progress.completed} signedIn={progress.signedIn} />

      <section className="mt-12 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_18rem]">
        <div><h2 className="text-xl font-bold">Ao terminar, você vai conseguir</h2><ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">{course.outcomes.map((outcome) => <li key={outcome} className="border-l-2 border-primary/60 pl-3">{outcome}</li>)}</ul></div>
        <div className="border-l border-border pl-5"><h2 className="text-sm font-semibold">Referência</h2><ul className="mt-3 grid gap-2">{course.resources.map((resource) => <li key={resource.href}><a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs leading-5 text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{resource.label}<ExternalLink className="size-3 shrink-0" aria-hidden="true" /></a></li>)}</ul></div>
      </section>

      <section id="projeto-final" className="mt-10 border border-border bg-card p-5 sm:p-7">
        <p className="text-sm font-semibold text-primary">Prática final</p><h2 className="mt-2 text-2xl font-bold">{course.project.title}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{course.project.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">{course.project.deliverables.map((deliverable) => <li key={deliverable} className="flex gap-2 text-sm leading-6"><span className="text-primary" aria-hidden="true">✓</span><span>{deliverable}</span></li>)}</ul>
      </section>
    </div>
  </main>;
}
