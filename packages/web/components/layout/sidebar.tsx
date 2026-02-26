"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FlaskConical,
  Home,
  Send,
  ListChecks,
  ClipboardList,
  ShoppingBag,
  Calendar,
  BookOpen,
  Trophy,
  Map,
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
    href: "/api-playground",
    label: "API Playground",
    icon: Send,
    exact: false,
  },
  {
    href: "/cenarios",
    label: "Cenarios",
    icon: ListChecks,
    exact: false,
  },
  {
    href: "/ecommerce/board",
    label: "Board",
    icon: ClipboardList,
    exact: false,
  },
  {
    href: "/ecommerce",
    label: "E-commerce",
    icon: ShoppingBag,
    exact: true,
  },
  {
    href: "/datas",
    label: "Datas",
    icon: Calendar,
    exact: false,
  },
  {
    href: "/blog",
    label: "Blog",
    icon: BookOpen,
    exact: false,
  },
  {
    href: "/desafios",
    label: "Desafios",
    icon: Trophy,
    exact: false,
  },
  {
    href: "/roadmap",
    label: "Roadmap",
    icon: Map,
    exact: false,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-16 flex-col items-center border-r border-border bg-white py-4 lg:w-56 animate-slide-in-left">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2 px-3">
        <FlaskConical className="size-7 text-primary" />
        <span className="hidden text-sm font-bold tracking-tight text-gray-700 lg:block">
          QA Lab
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex w-full flex-1 flex-col gap-1 px-2">
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
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:translate-x-0.5"
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 shrink-0",
                      isActive ? "text-primary" : ""
                    )}
                  />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="hidden px-3 lg:block">
        <p className="text-xs text-gray-400">QALabBrain v0.1</p>
      </div>
    </aside>
  );
}
