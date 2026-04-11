"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FlaskConical,
  Home,
  Send,
  Target,
  Layers,
  BookOpen,
  Map,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: Home,
    exact: true,
  },
  {
    href: "/missoes",
    label: "Missões",
    icon: Target,
    exact: false,
  },
  {
    href: "/alvos",
    label: "Alvos",
    icon: Layers,
    exact: false,
  },
  {
    href: "/api-playground",
    label: "API Playground",
    icon: Send,
    exact: false,
  },
  {
    href: "/blog",
    label: "Blog",
    icon: BookOpen,
    exact: false,
  },
  {
    href: "/roadmap",
    label: "Roadmap",
    icon: Map,
    exact: false,
  },
  {
    href: "/ecommerce",
    label: "E-commerce",
    icon: ShoppingCart,
    exact: false,
  },
  {
    href: "/despesas",
    label: "Despesas",
    icon: Wallet,
    exact: false,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-16 flex-col items-center border-r border-mint/10 bg-[#405555] py-5 lg:w-64 animate-slide-in-left">
      {/* Logo */}
      <Link href="/" className="mb-10 flex items-center gap-3 px-4">
        <div className="flex items-center justify-center size-10 rounded-xl bg-mint/20">
          <FlaskConical className="size-6 text-mint" />
        </div>
        <div className="hidden lg:flex flex-col">
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
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-200",
                    isActive
                      ? "bg-mint/20 text-mint shadow-inner shadow-mint/10"
                      : "text-off-white/60 hover:bg-off-white/5 hover:text-off-white hover:translate-x-0.5"
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 shrink-0",
                      isActive ? "text-mint" : ""
                    )}
                  />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden bg-dark-green border-mint/20">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="hidden px-4 lg:block">
        <p className="text-[10px] uppercase tracking-[0.15em] text-mint/30">
          v0.1 — Break things
        </p>
      </div>

      {/* QA Watermark */}
      <div className="absolute bottom-4 left-2 pointer-events-none lg:left-4">
        <span className="font-[family-name:var(--font-display)] text-6xl lg:text-8xl text-mint/5 italic tracking-wider select-none">
          QA
        </span>
      </div>
    </aside>
  );
}
