import { notFound, redirect } from "next/navigation";
import { LabBriefing, type LabPathContext } from "@/components/labs/lab-briefing";
import { systemChallenges } from "@/lib/system-challenges";
import { getJourney, getLabState, getSessionUser } from "@/lib/product/store";
import { buildTrackProgress, trackForLab } from "@/lib/product/tracks";
import { emptyJourney } from "@/lib/product/journey";
import { findLabByNumber } from "@/lib/playground/catalog";
import { canOpenLab, labViewer } from "@/lib/labs/access";
import { lessonForLab } from "@/lib/mentorship/lesson-labs";
import { pathV2ChapterHref } from "@/lib/mentorship/path-v2";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return systemChallenges.map((challenge) => ({ number: String(challenge.number) })); }

export default async function LabPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const challenge = systemChallenges.find((item) => item.number === Number(number));
  if (!challenge) notFound();

  const lab = findLabByNumber(challenge.number);
  const user = await getSessionUser();
  const viewer = await labViewer(user?.id);
  // Fora do catálogo público, só quem está na mentoria abre (é a prática de uma aula).
  if (!lab || !canOpenLab(lab, viewer)) {
    redirect(`/waitlist?lab=${encodeURIComponent(challenge.id)}`);
  }

  const [state, journey] = user
    ? await Promise.all([getLabState(user.id, challenge.id), getJourney(user.id)])
    : [{ status: "nao-iniciado" as const, submissions: [] }, emptyJourney];

  const track = trackForLab(challenge.number);
  const trackProgress = track ? buildTrackProgress(track, journey.labs) : null;

  const placement = lessonForLab(challenge.number);
  const path: LabPathContext | null = placement ? {
    moduleNumber: placement.moduleNumber,
    moduleTitle: placement.module.title,
    chapterId: placement.chapter.id,
    chapterTitle: placement.chapter.title,
    chapterHref: `${pathV2ChapterHref(placement.module, placement.chapter)}#${placement.lessonKey}`,
    lessonNumber: placement.lessonNumber,
    lessonTitle: placement.lessonTitle,
    position: placement.position,
    total: placement.siblings.length,
  } : null;

  return <LabBriefing challenge={challenge} status={state?.status ?? "nao-iniciado"} submissions={state?.submissions ?? []} trackProgress={trackProgress} signedIn={Boolean(user)} path={path} mentee={viewer.mentee} />;
}
