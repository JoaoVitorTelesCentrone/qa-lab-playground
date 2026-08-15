"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { countCompletedStages, countDeliverables, DELIVERABLES_KEY, emptyDeliverables, isChallengeReady, parseDeliverables, type ChallengeDeliverables } from "@/lib/challenge-deliverables";

const steps = [
  { href: "/playground", label: "Briefing", hint: "Entenda o contexto" },
  { href: "/playground/expenseflow", label: "Investigar", hint: "Explore o sistema" },
  { href: "/playground/entregas", label: "Documentar", hint: "Bugs · BDD · E2E" },
  { href: "/playground/conclusao", label: "Concluir", hint: "Revisar e exportar" },
] as const;

export function ChallengeStepper() {
  const pathname = usePathname() ?? "/playground";
  const [data, setData] = useState<ChallengeDeliverables>(emptyDeliverables);

  useEffect(() => {
    const read = () => setData(parseDeliverables(localStorage.getItem(DELIVERABLES_KEY)));
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  const activeIndex = steps.findIndex((step) => step.href === pathname);
  const total = countDeliverables(data);
  const documented = countCompletedStages(data) === 3;
  const ready = isChallengeReady(data);

  function statusOf(index: number): "done" | "current" | "todo" {
    if (index === 2 && documented) return "done";
    if (index === 3 && ready) return "done";
    if (index === activeIndex) return "current";
    if (activeIndex >= 0 && index < activeIndex) return "done";
    return "todo";
  }

  return (
    <nav aria-label="Progresso do desafio" className="rounded-2xl border border-white/10 bg-[#151A20] p-2.5">
      <ol className="flex items-stretch gap-1.5 overflow-x-auto">
        {steps.map((step, index) => {
          const status = statusOf(index);
          const isActive = index === activeIndex;
          const badge = index === 2 && total > 0 ? String(total) : null;
          return (
            <li key={step.href} className="min-w-0 flex-1">
              <Link
                href={step.href}
                aria-current={isActive ? "step" : undefined}
                className={`group flex h-full items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                  isActive ? "bg-mint/[.08] ring-1 ring-mint/30" : "hover:bg-white/[.04]"
                }`}
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition ${
                    status === "done"
                      ? "bg-neon text-[#101319]"
                      : status === "current"
                        ? "bg-mint text-[#101319]"
                        : "border border-white/15 text-[#69737E]"
                  }`}
                >
                  {status === "done" ? <Check className="size-4" /> : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5">
                    <span className={`truncate text-sm font-bold ${isActive || status === "done" ? "text-off-white" : "text-[#AAB2BC]"}`}>{step.label}</span>
                    {badge && <span className="rounded-full bg-neon/15 px-1.5 text-[10px] font-black text-neon">{badge}</span>}
                  </span>
                  <span className="hidden truncate text-[11px] text-[#69737E] sm:block">{step.hint}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
