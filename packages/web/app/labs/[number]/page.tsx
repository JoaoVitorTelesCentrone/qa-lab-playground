import { notFound } from "next/navigation";
import { ChallengeDetail } from "@/components/playground/system-challenges";
import { systemChallenges } from "@/lib/system-challenges";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return systemChallenges.map((challenge) => ({ number: String(challenge.number) })); }

export default async function LabPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const challenge = systemChallenges.find((item) => item.number === Number(number));
  if (!challenge) notFound();
  return <ChallengeDetail challenge={challenge} />;
}
