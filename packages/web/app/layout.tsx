import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { NavigationProgress } from "@/components/layout/navigation-progress";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app"),
  title: { default: "QA Lab - Conteúdo sobre qualidade de software", template: "%s | QA Lab" },
  description: "Artigos práticos e uma biblioteca científica sobre testes, estratégia, produto e engenharia de qualidade.",
  openGraph: {
    title: "QA Lab - Conteúdo sobre qualidade de software",
    description: "Artigos práticos e uma biblioteca científica para quem constrói qualidade de software.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image", title: "QA Lab", description: "Conteúdo prático e científico sobre qualidade de software." },
};

export const viewport: Viewport = { themeColor: "#111315", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${mono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}>
        <NavigationProgress />
        <SiteHeader />
        <main>{children}</main>
        <Toaster />
        <SiteFooter />
      </body>
    </html>
  );
}
