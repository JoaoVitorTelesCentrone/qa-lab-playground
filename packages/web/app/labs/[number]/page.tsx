import { notFound } from "next/navigation";
import { LabBriefing } from "@/components/labs/lab-briefing";
import { systemChallenges } from "@/lib/system-challenges";
import { getLabState, getSessionUser } from "@/lib/product/store";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return systemChallenges.map((challenge) => ({ number: String(challenge.number) })); }

export default async function LabPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const challenge = systemChallenges.find((item) => item.number === Number(number));
  if (!challenge) notFound();
  const user = await getSessionUser();
  const state = user ? await getLabState(user.id, challenge.id) : null;
  return <LabBriefing challenge={challenge} signedIn={Boolean(user)} status={state?.status ?? "nao-iniciado"} submissions={state?.submissions ?? []} />;
}
