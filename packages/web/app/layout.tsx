import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { FloatingOnboarding } from "@/components/onboarding/floating-onboarding";
import { labs, labLabel } from "@/lib/playground/catalog";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app"),
  title: { default: "QA Lab — Aprenda QA na prática", template: "%s | QA Lab" },
  description: "Aprenda QA na prática. Teste sistemas, investigue falhas e transforme suas descobertas em evidências nos ambientes de prática do QA Lab.",
  openGraph: {
    title: "QA Lab — Aprenda QA na prática",
    description: "Teste sistemas, investigue falhas e transforme suas descobertas em evidências. Escolha um Lab e comece a praticar QA.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image", title: "QA Lab — Aprenda QA na prática", description: "Teste sistemas, investigue falhas e construa evidências do que você sabe fazer." },
};

export const viewport: Viewport = { themeColor: "#101715", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const firstLab = labs.find((lab) => lab.status === "liberado");
  const tourLab = firstLab ? { number: firstLab.number, label: labLabel(firstLab), title: firstLab.title } : null;
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${mono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}>
        <FloatingOnboarding lab={tourLab}>
        <NavigationProgress />
        <SiteHeader />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[300] -translate-y-20 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Pular para o conteúdo
        </a>
        <div id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </div>
        <Toaster />
        <SiteFooter />
        </FloatingOnboarding>
      </body>
    </html>
  );
}
