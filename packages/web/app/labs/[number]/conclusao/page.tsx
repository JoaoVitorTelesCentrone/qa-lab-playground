import { notFound, redirect } from "next/navigation";
import { ConclusionClient, type ConclusionMilestone, type ConclusionNext } from "./conclusion-client";
import { systemChallenges } from "@/lib/system-challenges";
import { labs, labLabel } from "@/lib/playground/catalog";
import { buildCase } from "@/lib/product/case";
import { getJourney, getLabState, getLabStatusMap, getPortfolioCaseDraft, getSessionUser, listCertificates, listSubmissions } from "@/lib/product/store";
import { buildTrackProgress, trackForLab } from "@/lib/product/tracks";
import { certificateStats, eligibility } from "@/lib/product/certificate";
import { createClient } from "@/lib/supabase/server";
import { isMentee } from "@/lib/labs/access";
import { labsForChapter, lessonForLab, nextInPath } from "@/lib/mentorship/lesson-labs";
import { findPathV2Assignment, pathV2ChapterHref, pathV2Chapters } from "@/lib/mentorship/path-v2";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Conclusão do Lab", robots: { index: false, follow: false } };

const minutesOf = (number: number) => labs.find((item) => item.number === number)?.minutes;

export default async function ConclusionPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const challenge = systemChallenges.find((item) => item.number === Number(number));
  const lab = labs.find((item) => item.number === Number(number));
  if (!challenge || !lab) notFound();

  const user = await getSessionUser();
  if (!user) return <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
    <p className="text-sm font-semibold text-primary">Conclusão do Lab</p>
    <h1 className="mt-4 text-4xl font-black text-foreground">{challenge.title}</h1>
    <p className="mt-5 text-base leading-7 text-muted-foreground">Entre na sua conta e conclua uma entrega para gerar o case deste Lab.</p>
    <Link href={`/labs/${number}`} className="mt-8 inline-flex h-11 items-center rounded-sm bg-primary px-5 text-sm font-bold text-primary-foreground">Abrir o Lab</Link>
  </main>;

  const supabase = await createClient();
  const [state, journey, { data: profile }, mentee] = await Promise.all([
    getLabState(user.id, challenge.id),
    getJourney(user.id),
    supabase.from("profiles").select("full_name,username,portfolio_public").eq("id", user.id).maybeSingle(),
    isMentee(user.id),
  ]);

  // Sem evidência não há case. Voltar para o briefing é mais útil que uma
  // página vazia dizendo que falta entregar.
  if (state.submissions.length === 0) redirect(`/labs/${number}`);

  const draft = await getPortfolioCaseDraft(user.id, state.submissions[0].id);
  const item = buildCase(state.submissions[0], lab, challenge, draft.customization)!;
  const track = trackForLab(challenge.number);
  const progress = track ? buildTrackProgress(track, journey.labs) : null;

  const [submissions, certificates] = await Promise.all([
    progress ? listSubmissions(user.id) : Promise.resolve([]),
    listCertificates(user.id),
  ]);

  const trackSummary = progress && track
    ? {
        slug: track.slug,
        name: track.name,
        outcome: track.outcome,
        nextLab: progress.nextLab ? { number: progress.nextLab.number, title: progress.nextLab.title } : null,
        ...eligibility(progress),
        stats: certificateStats(track, progress, submissions),
        certificateCode: certificates.find((certificate) => certificate.trackSlug === track.slug)?.code ?? null,
      }
    : null;

  // Próximo passo: para quem está na mentoria, o caminho da aula (outro Lab,
  // a próxima aula ou o marco). Para o público, a trilha ou o catálogo.
  let next: ConclusionNext | null = null;
  let milestone: ConclusionMilestone | null = null;
  const placement = mentee ? lessonForLab(challenge.number) : null;
  if (placement) {
    const step = nextInPath(challenge.number);
    const chapterHref = pathV2ChapterHref(placement.module, placement.chapter);
    if (step?.kind === "lab") {
      const nextLab = labs.find((candidate) => candidate.number === step.labNumber);
      next = { eyebrow: `Próximo na aula · Lab ${nextLab ? labLabel(nextLab) : step.labNumber}`, title: nextLab?.title ?? "Próximo Lab", href: `/labs/${step.labNumber}`, meta: minutesOf(step.labNumber) ? `cerca de ${minutesOf(step.labNumber)} min` : undefined };
    } else if (step?.kind === "lesson") {
      next = { eyebrow: `Próxima aula · Cap ${placement.chapter.id}`, title: step.lessonTitle, href: `${chapterHref}#${step.lessonKey}` };
    } else if (step?.kind === "chapter") {
      const index = pathV2Chapters.findIndex((entry) => entry.chapter.id === placement.chapter.id);
      const following = pathV2Chapters[index + 1];
      next = following ? { eyebrow: `Próximo capítulo · Cap ${following.chapter.id}`, title: following.chapter.title, href: pathV2ChapterHref(following.module, following.chapter) } : null;
    }
    const assignment = placement.chapter.assignmentKey ? findPathV2Assignment(placement.chapter.assignmentKey) : null;
    if (assignment) {
      const statuses = await getLabStatusMap(user.id);
      const chapterLabs = labsForChapter(placement.chapter);
      const done = chapterLabs.filter((labNumber) => (statuses.get(labs.find((candidate) => candidate.number === labNumber)?.slug ?? "")?.submissions ?? 0) > 0).length;
      milestone = { title: assignment.title, done, total: chapterLabs.length, href: `${chapterHref}#entrega-heading` };
    }
  } else if (progress?.nextLab && progress.nextLab.number !== challenge.number) {
    next = { eyebrow: `Próximo na trilha · Lab ${labLabel(progress.nextLab)}`, title: progress.nextLab.title, href: `/labs/${progress.nextLab.number}`, meta: `cerca de ${progress.nextLab.minutes} min` };
  } else {
    const nextLab = journey.nextLab && journey.nextLab.number !== challenge.number ? journey.nextLab : null;
    if (nextLab) next = { eyebrow: `Próximo Lab · Lab ${labLabel(nextLab)}`, title: nextLab.title, href: `/labs/${nextLab.number}`, meta: `cerca de ${nextLab.minutes} min` };
  }

  return <ConclusionClient
    item={item}
    hasUnpublishedChanges={draft.hasUnpublishedChanges}
    olderCount={state.submissions.length - 1}
    name={profile?.full_name?.trim() || user.email.split("@")[0]}
    profile={{ username: profile?.username ?? "", portfolioPublic: Boolean(profile?.portfolio_public) }}
    track={trackSummary}
    next={next}
    milestone={milestone}
    pathLabel={placement ? `Módulo ${placement.moduleNumber} · Cap ${placement.chapter.id} · ${placement.lessonTitle}` : null}
    siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground-web.vercel.app"}
  />;
}
