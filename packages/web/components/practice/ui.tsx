// Peças visuais reaproveitadas pelos três ambientes.
//
// Ficam juntas para que "card com título", "faixa de números" e "barra de
// progresso" tenham marcação e semântica iguais nos três — um cenário de
// acessibilidade escrito uma vez precisa valer nos três ambientes.

import type { ReactNode } from "react";

export function PracticeSection({ title, description, action, children, id }: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  const headingId = `${id ?? title.toLowerCase().replace(/\s+/g, "-")}-title`;
  return <section id={id} aria-labelledby={headingId} className="rounded-xl border border-border bg-card p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 id={headingId} className="text-lg font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
    <div className="mt-5">{children}</div>
  </section>;
}

export function StatGrid({ items }: { items: Array<{ label: string; value: string | number; hint?: string; tone?: "default" | "positive" | "negative" }> }) {
  const tones = { default: "", positive: "text-primary", negative: "text-destructive" };
  return <dl className="grid divide-y divide-border rounded-xl border border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
    {items.map((item) => <div key={item.label} className="p-4 sm:p-5">
      <dt className="text-xs text-muted-foreground">{item.label}</dt>
      <dd className={`mt-1.5 text-2xl font-semibold tracking-[-0.03em] ${tones[item.tone ?? "default"]}`}>{item.value}</dd>
      {item.hint && <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>}
    </div>)}
  </dl>;
}

/** Barra com rótulo acessível — o percentual também vai em texto, não só na cor. */
export function ProgressBar({ percent, label, danger = false }: { percent: number; label: string; danger?: boolean }) {
  return <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label={`${label}: ${percent}%`}>
    <div className={`h-full rounded-full ${danger ? "bg-destructive" : "bg-primary"}`} style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
  </div>;
}
