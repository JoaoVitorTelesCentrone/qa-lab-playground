import { ProductHome } from "@/components/home/product-home";
import { emptyJourney } from "@/lib/product/journey";
import { getJourney, getSessionUser } from "@/lib/product/store";

export default async function Home() {
  const user = await getSessionUser();
  const journey = user ? await getJourney(user.id) : emptyJourney;
  return <ProductHome journey={journey} signedIn={Boolean(user)} />;
}
