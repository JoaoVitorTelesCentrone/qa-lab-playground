import { getPortfolio } from "@/lib/product/portfolio";
import { ogContentType, ogImage, ogSize } from "@/lib/product/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Portfólio de evidências de QA";

export default async function Image({ params }: { params: { username: string } }) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) return ogImage({ kicker: "Portfólio", title: "QA Lab Playground", subtitle: "Portfólio de evidências de teste." });

  return ogImage({
    kicker: "Portfólio de evidências",
    title: portfolio.name,
    subtitle: portfolio.headline || "Evidências de teste produzidas em sistemas reais no QA Lab Playground.",
    stats: [
      { label: "evidências publicadas", value: String(portfolio.stats.evidences) },
      { label: "Labs cobertos", value: String(portfolio.stats.labs) },
      ...(portfolio.stats.bySeverity[0] ? [{ label: `severidade ${portfolio.stats.bySeverity[0].severity}`, value: String(portfolio.stats.bySeverity[0].total) }] : []),
    ],
    author: portfolio.role,
  });
}
