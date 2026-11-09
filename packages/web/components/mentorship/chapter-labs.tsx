import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import { labs, labLabel } from "@/lib/playground/catalog";
import type { LabStatusEntry } from "@/lib/product/store";

// Os Labs de cada aula, com o status real (entrega enviada), não um botão de
// "marcar como feito". Server component: recebe o status já lido do banco.

function statusOf(entry: LabStatusEntry | undefined) {
  if (entry && entry.submissions > 0) return { label: "Entregue", tone: "done" as const };
  if (entry?.status === "started") return { label: "Em andamento", tone: "progress" as const };
  return { label: "A fazer", tone: "todo" as const };
}

export function LabCard({ number, statuses, canOpen }: { number: number; statuses: ReadonlyMap<string, LabStatusEntry>; canOpen: boolean }) {
  const lab = labs.find((item) => item.number === number);
  if (!lab) return null;
  const status = statusOf(statuses.get(lab.slug));
  const open = lab.status === "liberado" || canOpen;
  const tagClass = status.tone === "done" ? "text-[var(--field-green)]" : status.tone === "progress" ? "text-[var(--field-copper)]" : "text-[var(--ca-muted,var(--field-muted))]";
  const body = <>
    <span className="min-w-0">
      <span className={`block font-mono text-xs ${tagClass}`}>LAB {labLabel(lab)} · {open ? status.label.toUpperCase() : "NA MENTORIA"}</span>
      <span className="mt-1 block text-sm font-semibold leading-snug">{lab.title}</span>
      <span className="mt-0.5 block text-xs opacity-80">cerca de {lab.minutes} min</span>
    </span>
    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold">
      {!open ? <><Lock className="size-4" aria-hidden="true" /> Conhecer</> : status.tone === "done" ? <><Check className="size-4" aria-hidden="true" /> Ver case</> : <>{status.tone === "progress" ? "Continuar" : "Abrir Lab"} <ArrowRight className="size-4" aria-hidden="true" /></>}
    </span>
  </>;
  const href = !open ? "/mentoria" : status.tone === "done" ? `/labs/${lab.number}/conclusao` : `/labs/${lab.number}`;
  return <Link href={href} className={`flex min-h-16 items-center justify-between gap-4 border px-4 py-3 transition-colors hover:border-[var(--field-green)] ${status.tone === "done" ? "border-[color-mix(in_srgb,var(--field-green)_40%,var(--field-line))]" : "border-[var(--field-line)]"}`}>{body}</Link>;
}
