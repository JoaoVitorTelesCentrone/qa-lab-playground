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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { href: "/",                label: "Dashboard",       mobileLabel: "Home",     icon: Home,         exact: true  },
  { href: "/elementos",       label: "Elementos",       mobileLabel: "Elementos", icon: LayoutGrid,   exact: false },
  { href: "/blog",            label: "Blog",            mobileLabel: "Blog",     icon: BookOpen,     exact: false },
  { href: "/datas",           label: "Datas",           mobileLabel: "Datas",    icon: CalendarDays, exact: false },
  { href: "/despesas",        label: "Despesas",        mobileLabel: "Despesas", icon: Wallet,       exact: false },
  { href: "/proximos-passos", label: "Próximos Passos", mobileLabel: "Futuro",   icon: Rocket,       exact: false },
];

function isActive(href: string, exact: boolean, pathname: string) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden lg:flex h-full w-14 xl:w-60 flex-col items-center border-r border-[#30363D] bg-[#0D1117] py-5 animate-slide-in-left shrink-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-mint/[0.06] to-transparent pointer-events-none" />

        <Link href="/" className="mb-7 flex items-center gap-3 px-3.5 relative z-10 w-full">
          <div className="flex items-center justify-center size-8 rounded-lg bg-mint/10 border border-mint/20 shrink-0">
            <FlaskConical className="size-4 text-mint" />
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="font-[family-name:var(--font-display)] text-xl tracking-widest text-mint italic leading-none">
              QA LAB
            </span>
            <span className="text-[9px] uppercase tracking-[0.22em] text-mint/35 mt-0.5">
              Playground · v0.1
            </span>
          </div>
        </Link>

        <nav className="flex w-full flex-1 flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact, pathname);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-150",
                      active
                        ? "bg-mint/10 text-mint border border-mint/20"
                        : "text-[#8B949E] hover:bg-[#161B22] hover:text-[#F0F6FC] border border-transparent"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-mint" />
                    )}
                    <div className="relative shrink-0">
                      <item.icon className={cn("size-[15px]", active ? "text-mint" : "text-[#8B949E] group-hover:text-[#F0F6FC]")} />
                      {active && (
                        <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-mint animate-pulse-dot" />
                      )}
                    </div>
                    <span className="hidden xl:block">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="xl:hidden bg-[#1A1D23] border-[#30363D] text-[#F0F6FC] text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <div className="w-full px-3 mb-3">
          <div className="h-px bg-[#30363D]" />
        </div>

        <div className="flex flex-col items-center gap-2 px-2.5 xl:items-start w-full">
          <a
            href="https://www.linkedin.com/company/qa-lab-oficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center xl:justify-start gap-2 rounded-lg border border-[#30363D] px-2.5 py-2 text-xs text-[#8B949E] hover:border-mint/25 hover:text-mint transition-all duration-150 w-full"
          >
            <Linkedin className="size-3.5 shrink-0" />
            <span className="hidden xl:block font-medium tracking-wide">Siga no LinkedIn</span>
          </a>
        </div>

        <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
          <span className="font-[family-name:var(--font-display)] text-6xl xl:text-8xl text-mint/[0.03] italic tracking-wider select-none">
            QA
          </span>
        </div>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b border-[#30363D] bg-[#0D1117]/95 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center size-7 rounded-lg bg-mint/10 border border-mint/20">
            <FlaskConical className="size-3.5 text-mint" />
          </div>
          <span className="font-[family-name:var(--font-display)] text-lg tracking-widest text-mint italic">
            QA LAB
          </span>
          <span className="text-[9px] uppercase tracking-[0.18em] text-mint/30 ml-1">
            Playground
          </span>
        </Link>
        <a
          href="https://www.linkedin.com/company/qa-lab-oficial/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-[#30363D] px-2.5 py-1.5 text-[#8B949E] hover:text-mint hover:border-mint/25 transition-all duration-150"
        >
          <Linkedin className="size-3.5" />
          <span className="text-[10px] font-semibold tracking-wide">LinkedIn</span>
        </a>
      </header>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#30363D] bg-[#0D1117]/95 backdrop-blur-md">
        <div className="grid grid-cols-6 h-16">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 transition-all duration-150 active:scale-95",
                  active ? "text-mint" : "text-[#8B949E] hover:text-[#F0F6FC]"
                )}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-mint" />
                )}
                <item.icon className={cn("size-[17px] transition-all", active && "drop-shadow-[0_0_6px_rgba(45,212,191,0.6)]")} />
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
