import type { Metadata, Viewport } from "next";
import { Anton, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { FloatingOnboarding } from "@/components/onboarding/floating-onboarding";
import { firstLab as launchFirstLab, labLabel } from "@/lib/playground/catalog";
import { AttributionCapture } from "@/components/analytics/attribution-capture";
import { LABS_ENABLED } from "@/lib/product/features";

// Identidade QA Lab: Plus Jakarta Sans no texto, Anton nos títulos de destaque.
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });
const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground-web.vercel.app"),
  title: { default: LABS_ENABLED ? "QA Lab — Aprenda QA na prática" : "QA Lab — Conteúdo sobre qualidade de software", template: "%s | QA Lab" },
  description: LABS_ENABLED ? "Aprenda QA na prática. Teste sistemas, investigue falhas e transforme suas descobertas em evidências nos ambientes de prática do QA Lab." : "Artigos e projetos sobre qualidade de software e automação de testes.",
  openGraph: {
    title: LABS_ENABLED ? "QA Lab — Aprenda QA na prática" : "QA Lab — Conteúdo sobre qualidade de software",
    description: LABS_ENABLED ? "Teste sistemas, investigue falhas e transforme suas descobertas em evidências. Escolha um Lab e comece a praticar QA." : "Artigos e projetos sobre qualidade de software e automação de testes.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image", title: LABS_ENABLED ? "QA Lab — Aprenda QA na prática" : "QA Lab — Conteúdo sobre qualidade de software", description: LABS_ENABLED ? "Teste sistemas, investigue falhas e construa evidências do que você sabe fazer." : "Artigos e projetos sobre qualidade de software e automação de testes." },
};

export const viewport: Viewport = { themeColor: "#131313", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const firstLab = launchFirstLab;
  const tourLab = firstLab ? { number: firstLab.number, label: labLabel(firstLab), title: firstLab.title } : null;
  const site = <>
    <NavigationProgress />
    <SiteHeader />
    <div id="main-content" tabIndex={-1} className="outline-none">{children}</div>
    <Toaster />
    <SiteFooter />
  </>;
  return (
    // As variáveis de fonte ficam no <html> para que o :root consiga derivar
    // --font-display delas (globals.css).
    <html lang="pt-BR" className={`${jakarta.variable} ${anton.variable} ${mono.variable}`}>
      <body className={`min-h-screen bg-background font-sans text-foreground antialiased`}>
        {/* Primeiro elemento focável da página: precisa vir antes do header. */}
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-[300] -translate-y-24 rounded-sm bg-primary px-4 py-3 font-semibold text-primary-foreground transition-transform focus:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Pular para o conteúdo
        </a>
        <AttributionCapture />
        {LABS_ENABLED ? <FloatingOnboarding lab={tourLab}>{site}</FloatingOnboarding> : site}
      </body>
    </html>
  );
}
