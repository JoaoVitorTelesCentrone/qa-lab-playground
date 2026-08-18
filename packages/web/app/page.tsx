import { ProductHome } from "@/components/home/product-home";
import { emptyJourney } from "@/lib/product/journey";
import { getDisplayName, getJourney, getSessionUser } from "@/lib/product/store";
import { buildTrackProgress, learningTracks } from "@/lib/product/tracks";

export default async function Home() {
  const user = await getSessionUser();
  const [journey, name] = await Promise.all([
    user ? getJourney(user.id) : Promise.resolve(emptyJourney),
    user ? getDisplayName(user.id, user.email) : Promise.resolve(""),
  ]);
  const tracks = learningTracks.map((track) => buildTrackProgress(track, journey.labs));
  return <ProductHome journey={journey} tracks={tracks} signedIn={Boolean(user)} name={name} />;
}
