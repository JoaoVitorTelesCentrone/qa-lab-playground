import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";

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

export const viewport: Viewport = { themeColor: "#F3F4F6", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${mono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}>
        <SiteHeader />
        <main>{children}</main>
        <footer className="border-t border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="text-lg font-semibold text-primary">QA Lab</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">Qualidade nao e fase. Aprenda QA de ponta a ponta praticando em sistemas com falhas reais.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Conteudo</p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/blog" className="transition hover:text-primary">Blog</Link>
                <Link href="/pesquisa" className="transition hover:text-primary">Referencias cientificas</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Comunidade</p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="https://www.linkedin.com/company/qa-lab-oficial/" target="_blank" rel="noreferrer" className="transition hover:text-primary">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border">
            <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted-foreground sm:px-8">© {new Date().getFullYear()} QA Lab - Aprendizado de qualidade na pratica.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
