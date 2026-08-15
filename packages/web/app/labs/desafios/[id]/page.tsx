import { notFound } from "next/navigation";
import { ChallengeDetail } from "@/components/playground/system-challenges";
import { systemChallenges } from "@/lib/system-challenges";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const challenge = systemChallenges.find((item) => item.id === id); if (!challenge) notFound(); return <ChallengeDetail challenge={challenge} />; }
