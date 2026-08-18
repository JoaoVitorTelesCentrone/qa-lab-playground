import { CrmApp } from "@/components/practice/crm-app";
import { loadPracticeEnvironment } from "@/lib/product/practice/environment";

export const metadata = { title: "CRM | QA Lab" };
export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const { rows, settings, signedIn } = await loadPracticeEnvironment("crm");
  return <CrmApp initial={rows} settings={settings} signedIn={signedIn} screen="overview" />;
}
