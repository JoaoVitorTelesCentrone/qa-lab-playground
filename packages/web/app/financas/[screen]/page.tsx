import { notFound } from "next/navigation";
import { FinanceApp } from "@/components/finance/finance-app";
import { findPracticeApp } from "@/lib/product/apps";
import { loadPracticeEnvironment } from "@/lib/product/practice/environment";

export const dynamic = "force-dynamic";

const app = findPracticeApp("financas")!;

export function generateStaticParams() {
  return (app.screens ?? []).filter((screen) => screen.id !== "overview").map((screen) => ({ screen: screen.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  const label = app.screens?.find((item) => item.id === screen)?.label;
  return { title: label ? `${label} · Finanças | QA Lab` : "Finanças | QA Lab" };
}

export default async function FinanceScreenPage({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  if (!(app.screens ?? []).some((item) => item.id === screen)) notFound();

  const { rows, settings, signedIn } = await loadPracticeEnvironment("financas");
  return <FinanceApp initial={rows} settings={settings} signedIn={signedIn} screen={screen} />;
}
