import { ProductHome } from "@/components/home/product-home";
import { emptyJourney } from "@/lib/product/journey";
import { getJourney, getSessionUser } from "@/lib/product/store";
import { buildTrackProgress, learningTracks } from "@/lib/product/tracks";

export default async function Home() {
  const user = await getSessionUser();
  const journey = user ? await getJourney(user.id) : emptyJourney;
  const tracks = learningTracks.map((track) => buildTrackProgress(track, journey.labs));
  return <ProductHome journey={journey} tracks={tracks} signedIn={Boolean(user)} />;
}
