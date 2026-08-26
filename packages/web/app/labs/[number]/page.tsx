import { notFound } from "next/navigation";
import { LabBriefing } from "@/components/labs/lab-briefing";
import { systemChallenges } from "@/lib/system-challenges";
import { getJourney, getLabState, getSessionUser } from "@/lib/product/store";
import { buildTrackProgress, trackForLab } from "@/lib/product/tracks";
import { emptyJourney } from "@/lib/product/journey";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return systemChallenges.map((challenge) => ({ number: String(challenge.number) })); }

export default async function LabPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const challenge = systemChallenges.find((item) => item.number === Number(number));
  if (!challenge) notFound();

  const user = await getSessionUser();
  const [state, journey] = user
    ? await Promise.all([getLabState(user.id, challenge.id), getJourney(user.id)])
    : [{ status: "nao-iniciado" as const, submissions: [] }, emptyJourney];

  const track = trackForLab(challenge.number);
  const trackProgress = track ? buildTrackProgress(track, journey.labs) : null;

  return <LabBriefing challenge={challenge} status={state?.status ?? "nao-iniciado"} submissions={state?.submissions ?? []} trackProgress={trackProgress} />;
}
