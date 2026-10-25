import { redirect } from "next/navigation";
import { PortfolioPresentation } from "@/components/portfolio/portfolio-presentation";
import { getPortfolio } from "@/lib/product/portfolio";
import { normalizePortfolioAppearance } from "@/lib/product/portfolio-appearance";

export const dynamic = "force-dynamic";
export const metadata = { title: "Prévia privada do portfólio", robots: { index: false, follow: false } };

export default async function PortfolioPreviewPage({ searchParams }: { searchParams: Promise<{ layout?: string; palette?: string }> }) {
  const portfolio = await getPortfolio("", { preview: true });
  if (!portfolio) redirect("/login?next=%2Fperfil");
  const params = await searchParams;
  const appearance = normalizePortfolioAppearance({ layout: params.layout, palette: params.palette });
  return <div data-portfolio-preview><PortfolioPresentation portfolio={portfolio} appearance={appearance} preview /></div>;
}
