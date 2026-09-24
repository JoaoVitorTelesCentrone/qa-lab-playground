import { ProductHome } from "@/components/home/product-home";
import { emptyJourney } from "@/lib/product/journey";
import { getDisplayName, getJourney, getSessionUser } from "@/lib/product/store";
import { buildTrackProgress, learningTracks } from "@/lib/product/tracks";
import { CONTENT_ONLY_LAUNCH } from "@/lib/product/launch";

export default async function Home() {
  if (CONTENT_ONLY_LAUNCH) {
    return <ProductHome journey={emptyJourney} tracks={[]} signedIn={false} name="" />;
  }

  const user = await getSessionUser();
  const [journey, name] = await Promise.all([
    user ? getJourney(user.id) : Promise.resolve(emptyJourney),
    user ? getDisplayName(user.id, user.email) : Promise.resolve(""),
  ]);
  const tracks = learningTracks.map((track) => buildTrackProgress(track, journey.labs));
  return <ProductHome journey={journey} tracks={tracks} signedIn={Boolean(user)} name={name} />;
}
