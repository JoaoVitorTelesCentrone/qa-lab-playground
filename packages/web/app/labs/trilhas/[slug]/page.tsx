import { redirect } from "next/navigation";

export default async function LegacyLearningTrackPage({ params }: { params: Promise<{ slug: string }> }) {
  redirect(`/trilhas/${(await params).slug}`);
}
