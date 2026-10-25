import { PortfolioExportPanel } from "@/components/portfolio/portfolio-export-panel";

export default function ExportCheck() {
  return <main className="qa-system mx-auto max-w-2xl px-5 py-12"><h1 className="mb-8 text-2xl">Portfólio de QA</h1><PortfolioExportPanel username="ana-qa" /><div className="mt-8"><PortfolioExportPanel username="privado" enabled={false} /></div></main>;
}
