"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FlaskConical,
  Home,
  LayoutGrid,
  BookOpen,
  CalendarDays,
  Wallet,
  Rocket,
  Linkedin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/",                label: "Dashboard",      mobileLabel: "Home",     icon: Home,         exact: true  },
  { href: "/elementos",       label: "Elementos",      mobileLabel: "Elementos", icon: LayoutGrid,   exact: false },
  { href: "/blog",            label: "Blog",           mobileLabel: "Blog",     icon: BookOpen,     exact: false },
  { href: "/datas",           label: "Datas",          mobileLabel: "Datas",    icon: CalendarDays, exact: false },
  { href: "/despesas",        label: "Despesas",       mobileLabel: "Despesas", icon: Wallet,       exact: false },
  { href: "/proximos-passos", label: "Próximos Passos", mobileLabel: "Futuro",  icon: Rocket,       exact: false },
];

function isActive(href: string, exact: boolean, pathname: string) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex h-full w-16 xl:w-64 flex-col items-center border-r border-mint/10 bg-[#405555] py-5 animate-slide-in-left shrink-0 relative">
        {/* Logo */}
        <Link href="/" className="mb-10 flex items-center gap-3 px-4">
          <div className="flex items-center justify-center size-10 rounded-xl bg-mint/20">
            <FlaskConical className="size-6 text-mint" />
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="font-[family-name:var(--font-display)] text-2xl tracking-wider text-mint italic">
              QA LAB
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-mint/50 -mt-1">
              Playground
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex w-full flex-1 flex-col gap-1.5 px-3">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact, pathname);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-200",
                      active
                        ? "bg-mint/20 text-mint shadow-inner shadow-mint/10"
                        : "text-off-white/60 hover:bg-off-white/5 hover:text-off-white hover:translate-x-0.5"
                    )}
                  >
                    <item.icon className={cn("size-5 shrink-0", active && "text-mint")} />
                    <span className="hidden xl:block">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="xl:hidden bg-dark-green border-mint/20">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex flex-col items-center gap-3 px-4 xl:items-start">
          <a
            href="https://www.linkedin.com/company/qa-lab-oficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-mint/20 px-3 py-2 text-xs text-mint/60 hover:border-mint/40 hover:text-mint transition-colors"
          >
            <Linkedin className="size-3.5 shrink-0" />
            <span className="hidden xl:block font-semibold tracking-wide">Siga no LinkedIn</span>
          </a>
          <p className="hidden text-[10px] uppercase tracking-[0.15em] text-mint/30 xl:block">
            v0.1 — Break things
          </p>
        </div>

        {/* QA Watermark */}
        <div className="absolute bottom-4 left-2 pointer-events-none xl:left-4">
          <span className="font-[family-name:var(--font-display)] text-6xl xl:text-8xl text-mint/5 italic tracking-wider select-none">
            QA
          </span>
        </div>
      </aside>

      {/* ── Mobile Top Bar ──────────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b border-mint/10 bg-[#405555]/95 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex items-center justify-center size-8 rounded-lg bg-mint/20">
            <FlaskConical className="size-4 text-mint" />
          </div>
          <span className="font-[family-name:var(--font-display)] text-xl tracking-wider text-mint italic">
            QA LAB
          </span>
          <span className="text-[9px] uppercase tracking-[0.18em] text-mint/40">
            Playground
          </span>
        </Link>

        <a
          href="https://www.linkedin.com/company/qa-lab-oficial/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-mint/20 px-2.5 py-1.5 text-mint/60 hover:text-mint transition-colors"
        >
          <Linkedin className="size-3.5" />
          <span className="text-[10px] font-semibold tracking-wide">LinkedIn</span>
        </a>
      </header>

      {/* ── Mobile Bottom Nav ────────────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-mint/10 bg-[#405555]/95 backdrop-blur-md">
        <div className="grid grid-cols-6 h-16">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95",
                  active ? "text-mint" : "text-off-white/35 hover:text-off-white/60"
                )}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-mint" />
                )}
                <item.icon className={cn("size-[18px] transition-transform duration-200", active && "scale-110")} />
                <span className="text-[9px] font-bold uppercase tracking-wide leading-none">
                  {item.mobileLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
