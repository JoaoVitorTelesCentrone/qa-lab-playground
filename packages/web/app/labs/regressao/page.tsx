import { RegressionRunner } from "@/components/labs/regression-runner";
import { getScenarioRuns, getSessionUser } from "@/lib/product/store";
import { getSettings } from "@/lib/product/practice/store";

export const metadata = { title: "Packs de regressão | QA Lab" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getSessionUser();
  // O modo instrutor é a mesma chave dos ambientes: quem o liga lá enxerga aqui
  // qual desvio cada cenário costuma pegar.
  const [runs, settings] = user ? await Promise.all([getScenarioRuns(user.id), getSettings(user.id)]) : [{}, null];
  return <RegressionRunner signedIn={Boolean(user)} initialRuns={runs} instructor={settings?.instructor ?? false} />;
}
