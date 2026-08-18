import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app"),
  title: { default: "QA Lab - Aprenda qualidade de software na pratica", template: "%s | QA Lab" },
  description: "Um laboratorio para treinar QA de ponta a ponta: investigacao, design de testes, execucao, gestao de defeitos e competencias humanas em sistemas com falhas reais.",
  openGraph: {
    title: "QA Lab - Aprenda qualidade de software na pratica",
    description: "Da descoberta do risco ao defeito fechado. Pratique QA em sistemas quebrados de verdade.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image", title: "QA Lab", description: "Aprenda qualidade de software praticando em sistemas quebrados de verdade." },
};

export const viewport: Viewport = { themeColor: "#111315", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${mono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}>
        <SiteHeader />
        <main>{children}</main>
        <Toaster />
        <SiteFooter />
      </body>
    </html>
  );
}
