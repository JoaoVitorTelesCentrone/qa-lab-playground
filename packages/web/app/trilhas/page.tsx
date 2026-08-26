import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, FlaskConical, GitBranch, Map } from "lucide-react";
import { buildModuleProgress, cicdMissions, cicdTrackLabs } from "@/lib/cicd-lab";
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

  const cicdLabs = buildModuleProgress(solvedCicd);
  const catalogTracks = learningTracks
    .filter(trackHasReleasedLab)
    .map((track) => buildTrackProgress(track, journey.labs));

  return <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
    <header className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-mint">Aprendizado guiado</p>
      <h1 className="mt-4 text-4xl font-black text-off-white sm:text-6xl">Trilhas feitas de Labs, não de conteúdo solto.</h1>
      <p className="mt-5 text-lg leading-8 text-[#AAB2BC]">Escolha uma competência, percorra os Labs na ordem e acompanhe o que já concluiu. Cada Lab é uma unidade prática; a trilha é o caminho completo.</p>
    </header>

    <section className="mt-12 grid gap-5 md:grid-cols-2" aria-label="Trilhas disponíveis">
      <TrackCard
        href="/trilhas/cicd"
        icon={GitBranch}
        eyebrow="Entrega de software"
        title="CI/CD"
        description="Do primeiro pipeline à observabilidade pós-release, com decisões práticas em cada etapa."
        completed={cicdLabs.filter((lab) => lab.complete).length}
        total={cicdTrackLabs.length}
        detail={`${solvedCicd.length}/${cicdMissions.length} missões resolvidas`}
      />

      {catalogTracks.map((progress) => {
        const released = progress.steps.filter((step) => step.lab.status === "liberado");
        const completed = released.filter((step) => step.status === "completed").length;
        return <TrackCard
          key={progress.track.slug}
          href={`/trilhas/${progress.track.slug}`}
          icon={FlaskConical}
          eyebrow="Prática ponta a ponta"
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
        eyebrow="Fundamentos"
        title="QA do Zero"
        description="Percurso guiado para construir a base de qualidade antes das especializações."
        detail="Desafios autorais organizados por blocos"
      />
    </section>

    <section className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#171B21] p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-neon"><Map className="size-4" /> Catálogo avançado</p>
        <h2 className="mt-2 text-xl font-black text-off-white">Roadmap completo de QA</h2>
        <p className="mt-2 text-sm leading-6 text-[#AAB2BC]">Consulte todos os desafios por área e nível. O roadmap é o catálogo; as trilhas são os percursos curados.</p>
      </div>
      <Link href="/trilhas/roadmap" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-black text-off-white transition hover:border-mint/40 hover:text-mint">Abrir roadmap <ArrowRight className="size-4" /></Link>
    </section>
  </main>;
}

function TrackCard({ href, icon: Icon, eyebrow, title, description, completed, total, detail }: {
  href: string;
  icon: typeof GitBranch;
  eyebrow: string;
  title: string;
  description: string;
  completed?: number;
  total?: number;
  detail: string;
}) {
  const hasProgress = completed !== undefined && total !== undefined && total > 0;
  const percent = hasProgress ? Math.round((completed / total) * 100) : 0;
  return <Link href={href} className="group flex min-h-64 flex-col rounded-2xl border border-white/10 bg-[#171B21] p-6 transition hover:-translate-y-1 hover:border-mint/35">
    <div className="flex items-start justify-between gap-4">
      <span className="flex size-11 items-center justify-center rounded-xl bg-mint/10 text-mint"><Icon className="size-5" /></span>
      {hasProgress && <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs font-bold text-[#AAB2BC]"><CheckCircle2 className="size-3.5 text-neon" />{completed}/{total} Labs</span>}
    </div>
    <p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-neon">{eyebrow}</p>
    <h2 className="mt-2 text-2xl font-black text-off-white">Trilha {title}</h2>
    <p className="mt-3 text-sm leading-6 text-[#AAB2BC]">{description}</p>
    <div className="mt-auto pt-6">
      {hasProgress && <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-neon" style={{ width: `${percent}%` }} /></div>}
      <p className="flex items-center justify-between gap-3 text-xs text-[#8B949E]"><span className="line-clamp-2">{detail}</span><ArrowRight className="size-4 shrink-0 transition group-hover:translate-x-1 group-hover:text-mint" /></p>
    </div>
  </Link>;
}
