import { LabCatalog } from "@/components/labs/lab-catalog";
import { isLabTrackId } from "@/lib/authority/lab-tracks";
import { getJourney, getSessionUser } from "@/lib/product/store";

export const metadata = {
  title: "Hands-on QA labs by track",
  description: "QA labs with real bugs, grouped by track: UI, API, Exploratory, Product, CI and Non-functional. Turn the bug on with ?bug=1 and write the report.",
  alternates: { canonical: "/labs" },
};

const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function LabsPage({ searchParams }: { searchParams: Promise<{ pagina?: string | string[]; trilha?: string | string[] }> }) {
  // A lista funciona deslogada; quando há sessão, marca o que já foi feito.
  const user = await getSessionUser();
  const journey = user ? await getJourney(user.id) : null;
  const progress = journey?.labs.map((item) => ({ slug: item.lab.slug, status: item.status })) ?? [];
  const { pagina, trilha } = await searchParams;
  const track = first(trilha);
  return <LabCatalog progress={progress} initialPage={first(pagina)} initialTrack={isLabTrackId(track) ? track : undefined} />;
}
