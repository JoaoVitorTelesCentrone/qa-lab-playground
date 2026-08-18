import { AppointmentsApp } from "@/components/practice/appointments-app";
import { loadPracticeEnvironment } from "@/lib/product/practice/environment";

export const metadata = { title: "Agendamentos | QA Lab" };
export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const { rows, settings, signedIn } = await loadPracticeEnvironment("agendamentos");
  return <AppointmentsApp initial={rows} settings={settings} signedIn={signedIn} screen="overview" />;
}
