import { RegressionRunner } from "@/components/labs/regression-runner";
import { getScenarioRuns, getSessionUser } from "@/lib/product/store";

export const metadata = { title: "Packs de regressão | QA Lab" };

export default async function Page() {
  const user = await getSessionUser();
  const runs = user ? await getScenarioRuns(user.id) : {};
  return <RegressionRunner signedIn={Boolean(user)} initialRuns={runs} />;
}
