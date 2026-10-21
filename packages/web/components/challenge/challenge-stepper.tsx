"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CHALLENGE_DELIVERABLES_UPDATED, countDeliverables, DELIVERABLES_KEY, emptyDeliverables, parseDeliverables, type ChallengeDeliverables } from "@/lib/challenge-deliverables";

const steps = [
  { href: "/playground", label: "Briefing", hint: "Entenda o contexto" },
  { href: "/playground/expenseflow", label: "Investigar", hint: "Explore o sistema" },
  { href: "/playground/entregas", label: "Entregas", hint: "Bug reports · BDD" },
] as const;

export function ChallengeStepper() {
  const pathname = usePathname() ?? "/playground";
  const [data, setData] = useState<ChallengeDeliverables>(emptyDeliverables);

  useEffect(() => {
    const read = () => setData(parseDeliverables(localStorage.getItem(DELIVERABLES_KEY)));
    read();
    window.addEventListener("storage", read);
    window.addEventListener(CHALLENGE_DELIVERABLES_UPDATED, read);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener(CHALLENGE_DELIVERABLES_UPDATED, read);
    };
  }, []);

  const activeIndex = steps.findIndex((step) => step.href === pathname);
  const total = countDeliverables(data);
  return (
    <nav aria-label="Etapas do desafio" className="rounded-2xl border border-white/10 bg-[#151A20] p-2.5">
      <ol className="flex items-stretch gap-1.5 overflow-x-auto">
        {steps.map((step, index) => {
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
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition ${isActive ? "bg-mint text-[#101319]" : "border border-white/20 text-[#AAB2BC]"}`}>
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5">
                    <span className={`truncate text-sm font-bold ${isActive ? "text-off-white" : "text-[#AAB2BC]"}`}>{step.label}</span>
                    {badge && <span className="rounded-full bg-neon/15 px-1.5 text-[10px] font-black text-neon">{badge}</span>}
                  </span>
                  <span className="hidden truncate text-[11px] text-[#AAB2BC] sm:block">{step.hint}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
