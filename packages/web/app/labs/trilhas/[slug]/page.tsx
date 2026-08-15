import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TrackPage } from "@/components/labs/track-page";
import { buildTrackProgress, findTrack, learningTracks } from "@/lib/product/tracks";
import { getJourney, getSessionUser } from "@/lib/product/store";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return learningTracks.map((track) => ({ slug: track.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const track = findTrack((await params).slug);
  return track ? { title: `Trilha ${track.name} | QA Lab`, description: track.objective } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = findTrack(slug);
  if (!track) notFound();

  const user = await getSessionUser();
  const journey = user ? await getJourney(user.id) : null;
  return <TrackPage progress={buildTrackProgress(track, journey?.labs ?? [])} signedIn={Boolean(user)} />;
}
