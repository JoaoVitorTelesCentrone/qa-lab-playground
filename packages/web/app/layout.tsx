import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { FlaskConical, Linkedin } from "lucide-react";
import "./globals.css";

const display = Bebas_Neue({ weight: "400", variable: "--font-display", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app"),
  title: { default: "QA Lab Playground — ExpenseFlow Free Challenge", template: "%s | QA Lab Playground" },
  description: "Treine teste exploratório, análise de risco e bug report em um sistema de reembolso com falhas intencionais.",
  openGraph: {
    title: "QA Lab Playground — ExpenseFlow Free Challenge",
    description: "Treine QA em sistemas quebrados de verdade.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image", title: "QA Lab Playground", description: "Treine QA em sistemas quebrados de verdade." },
};

export const viewport: Viewport = { themeColor: "#101319", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${inter.variable} ${mono.variable} min-h-screen bg-background font-sans text-foreground antialiased bg-qalab-pattern`}>
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#101319]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
            <Link href="/" className="flex items-center gap-2.5" aria-label="QA Lab Playground — início">
              <span className="flex size-8 items-center justify-center rounded-lg border border-mint/25 bg-mint/10"><FlaskConical className="size-4 text-mint" /></span>
              <span className="font-[family-name:var(--font-display)] text-xl italic tracking-widest text-mint">QA LAB</span>
              <span className="hidden text-[9px] font-bold uppercase tracking-[0.18em] text-[#66717D] sm:block">Playground</span>
            </Link>
            <nav className="flex items-center gap-2" aria-label="Navegação principal">
              <div className="hidden items-center gap-1 lg:flex">
                <Link href="/#como-funciona" className="rounded-lg px-3 py-2 text-xs font-semibold text-[#AAB2BC] transition hover:bg-white/5 hover:text-mint">Conteúdo</Link>
                <Link href="/playground" className="rounded-lg px-3 py-2 text-xs font-semibold text-[#AAB2BC] transition hover:bg-white/5 hover:text-mint">Como funciona</Link>
                <Link href="/playground/expenseflow" className="rounded-lg px-3 py-2 text-xs font-semibold text-[#AAB2BC] transition hover:bg-white/5 hover:text-mint">Abrir ExpenseFlow</Link>
                <Link href="/waitlist" className="rounded-lg px-3 py-2 text-xs font-semibold text-[#AAB2BC] transition hover:bg-white/5 hover:text-mint">Próximos desafios</Link>
              </div>
              <a href="https://www.linkedin.com/company/qa-lab-oficial/" target="_blank" rel="noreferrer" className="hidden size-9 items-center justify-center rounded-lg border border-white/10 text-[#8B949E] transition hover:border-mint/30 hover:text-mint sm:flex" aria-label="QA Lab no LinkedIn"><Linkedin className="size-4" /></a>
              <Link href="/playground" className="inline-flex h-9 items-center rounded-lg bg-neon px-3 text-xs font-black text-[#101319]">Começar desafio</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-[#69737E] sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>QA Lab — Qualidade não é fase. É cultura.</p>
            <div className="flex flex-wrap gap-4"><Link href="/playground" className="hover:text-mint">Desafio gratuito</Link><Link href="/playground/template-bug-report" className="hover:text-mint">Template de bug report</Link><Link href="/waitlist" className="hover:text-mint">Próximos desafios</Link></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
