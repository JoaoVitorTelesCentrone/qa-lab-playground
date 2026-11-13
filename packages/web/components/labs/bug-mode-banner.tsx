"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Bug, ShieldCheck } from "lucide-react";
import { bugModeHref } from "@/lib/labs/bug-mode";

/**
 * Faixa que diz em que modo o Lab está e alterna entre os dois. `data-state` é o
 * que os testes E2E leem para saber se o comportamento bugado está ligado.
 */
export function BugModeBanner({ bug }: { bug: string | null }) {
  const pathname = usePathname() ?? "/";
  const search = useSearchParams()?.toString() ?? "";
  const on = Boolean(bug);
  return <div data-testid="bug-mode" data-state={on ? "on" : "off"} data-bug={bug ?? undefined} role="status"
    className={`flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-2.5 text-sm ${on ? "border-brand-accent/60 bg-brand-accent/10" : "border-border"}`}>
    <span className="inline-flex items-center gap-2 font-semibold">
      {on ? <Bug className="size-4 text-brand-accent" aria-hidden="true" /> : <ShieldCheck className="size-4 text-primary" aria-hidden="true" />}
      {on ? <>Bug mode on <span className="font-mono text-xs font-normal text-muted-foreground">{bug}</span></> : "Correct mode"}
    </span>
    <Link href={bugModeHref(pathname, search, !on)} data-event={on ? undefined : "start_lab"} className="inline-flex min-h-9 items-center font-semibold text-brand-accent underline underline-offset-4">
      {on ? "Switch to the correct mode" : "Turn the bug on (?bug=1)"}
    </Link>
  </div>;
}
