// Os quatro números da jornada. Valores vêm de buildJourney — nada calculado aqui.

import { CircleGauge, ClipboardCheck, FlaskConical, Trophy, type LucideIcon } from "lucide-react";
import type { Journey } from "@/lib/product/journey";

export function ProfileStats({ journey }: { journey: Journey }) {
  const stats: Array<{ icon: LucideIcon; value: string | number; label: string }> = [
    { icon: FlaskConical, value: journey.started, label: "Labs iniciados" },
    { icon: Trophy, value: journey.completed, label: "Labs concluídos" },
    { icon: ClipboardCheck, value: journey.evidence, label: "Evidências registradas" },
    { icon: CircleGauge, value: `${journey.completionRate}%`, label: "Taxa de conclusão" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ icon: Icon, value, label }) => (
        <div key={label} className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-4 text-primary" aria-hidden="true" />
          </span>
          <p className="mt-4 text-3xl font-bold tracking-[-0.03em] tabular-nums">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}
