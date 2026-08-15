import { notFound, redirect } from "next/navigation";
import { systemChallenges } from "@/lib/system-challenges";

// O briefing canônico é /labs/[number]. Mantido para links já publicados.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const challenge = systemChallenges.find((item) => item.id === id);
  if (!challenge) notFound();
  redirect(`/labs/${challenge.number}`);
}
