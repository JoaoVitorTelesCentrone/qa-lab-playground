import { LabCatalog } from "@/components/labs/lab-catalog";
import { getJourney, getSessionUser } from "@/lib/product/store";

export const metadata = { title: "Labs e desafios | QA Lab" };

export default async function LabsPage() {
  // O catálogo funciona deslogado; quando há sessão, marca o que já foi feito.
  const user = await getSessionUser();
  const journey = user ? await getJourney(user.id) : null;
  const progress = journey?.labs.map((item) => ({ slug: item.lab.slug, status: item.status })) ?? [];
  return <LabCatalog progress={progress} />;
}
