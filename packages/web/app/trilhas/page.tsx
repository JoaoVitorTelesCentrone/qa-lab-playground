import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, FlaskConical, GitBranch } from "lucide-react";
import { cicdMissions } from "@/lib/cicd-lab";
import { emptyJourney } from "@/lib/product/journey";
import { getJourney, getSessionUser } from "@/lib/product/store";
import { buildTrackProgress, learningTracks, trackHasReleasedLab } from "@/lib/product/tracks";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Trilhas | QA Lab",
  description: "Percursos de aprendizagem formados por Labs práticos em uma sequência intencional.",
};

export default async function TracksPage() {
  const user = await getSessionUser();
  const journey = user ? await getJourney(user.id) : emptyJourney;
  let solvedCicd: string[] = [];

  if (user) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("mission_progress")
      .select("mission_id")
      .eq("user_id", user.id)
      .like("mission_id", "cicd:%");
    solvedCicd = (data ?? []).map((row) => row.mission_id.replace("cicd:", ""));
  }

  const catalogTracks = learningTracks
    .filter(trackHasReleasedLab)
    .map((track) => buildTrackProgress(track, journey.labs));

  return <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
    <header className="max-w-3xl">
      <h1 className="qa-page-title text-off-white">Trilhas de prática em sequência.</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[#AAB2BC]">Escolha uma competência e avance pelos Labs na ordem. Seu progresso fica reunido aqui.</p>
    </header>

    <section className="mt-12 grid gap-5 md:grid-cols-2" aria-label="Trilhas disponíveis">
      <TrackCard
        href="/trilhas/cicd"
        icon={GitBranch}
        title="CI/CD"
        description="Do primeiro pipeline à observabilidade pós-release, com decisões práticas em cada etapa."
        completed={solvedCicd.length}
        total={cicdMissions.length}
        progressLabel="missões"
      />

      {catalogTracks.map((progress) => {
        const released = progress.steps.filter((step) => step.lab.status === "liberado");
        const completed = released.filter((step) => step.status === "completed").length;
        return <TrackCard
          key={progress.track.slug}
          href={`/trilhas/${progress.track.slug}`}
          icon={FlaskConical}
          title={progress.track.name}
          description={progress.track.objective}
          completed={completed}
          total={released.length}
          detail={progress.track.outcome}
        />;
      })}

      <TrackCard
        href="/trilhas/qa-do-zero"
        icon={BookOpen}
        title="QA do Zero"
        description="Percurso guiado para construir a base de qualidade antes das especializações."
        detail="Desafios autorais organizados por blocos"
      />
    </section>

    <section className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#171B21] p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-black text-off-white">Roadmap completo de QA</h2>
        <p className="mt-2 text-sm leading-6 text-[#AAB2BC]">Desafios de QA organizados por área e nível, além das trilhas curadas.</p>
      </div>
      <Link href="/trilhas/roadmap" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-black text-off-white transition hover:border-mint/40 hover:text-mint">Ver desafios <ArrowRight className="size-4" /></Link>
    </section>
  </main>;
}

function TrackCard({ href, icon: Icon, title, description, completed, total, progressLabel = "Labs", detail }: {
  href: string;
  icon: typeof GitBranch;
  title: string;
  description: string;
  completed?: number;
  total?: number;
  progressLabel?: string;
  detail?: string;
}) {
  const hasProgress = completed !== undefined && total !== undefined && total > 0;
  const percent = hasProgress ? Math.round((completed / total) * 100) : 0;
  return <Link href={href} className="group flex min-h-64 flex-col rounded-2xl border border-white/10 bg-[#171B21] p-6 transition hover:-translate-y-1 hover:border-mint/35">
    <div className="flex items-start justify-between gap-4">
      <span className="flex size-11 items-center justify-center rounded-xl bg-mint/10 text-mint"><Icon className="size-5" /></span>
      {hasProgress && <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs font-bold text-[#AAB2BC]"><CheckCircle2 className="size-3.5 text-neon" />{completed}/{total} {progressLabel}</span>}
    </div>
    <h2 className="mt-6 text-2xl font-black text-off-white">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{description}</p>
    <div className="mt-auto pt-6">
      {hasProgress && <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-neon" style={{ width: `${percent}%` }} /></div>}
      <div className="flex items-center justify-between gap-3 text-xs text-[#8B949E]">{detail && <span className="line-clamp-2">{detail}</span>}<ArrowRight className="ml-auto size-4 shrink-0 transition group-hover:translate-x-1 group-hover:text-mint" aria-hidden="true" /></div>
    </div>
  </Link>;
}
