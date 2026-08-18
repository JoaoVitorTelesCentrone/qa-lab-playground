import { FinanceApp } from "@/components/finance/finance-app";
import { loadPracticeEnvironment } from "@/lib/product/practice/environment";

export const metadata = { title: "Finanças | QA Lab" };
export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const { rows, settings, signedIn } = await loadPracticeEnvironment("financas");
  return <FinanceApp initial={rows} settings={settings} signedIn={signedIn} screen="overview" />;
}
