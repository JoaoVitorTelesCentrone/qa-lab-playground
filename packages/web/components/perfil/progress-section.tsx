// Coluna esquerda do dashboard: onde a pessoa está em cada trilha e quanto da
// regressão de cada ambiente já foi executada. As duas listas vêm prontas do
// servidor (buildTrackProgress e buildJourney) — o componente só desenha.

import Link from "next/link";
import { GitBranch, Route } from "lucide-react";
import type { AppCoverage } from "@/lib/product/journey";
import type { TrackProgress } from "@/lib/product/tracks";

function Bar({ percent, label }: { percent: number; label: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label={label}>
      <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${percent}%` }} />
    </div>
  );
}

export function ProgressSection({ tracks, coverage }: { tracks: TrackProgress[]; coverage: AppCoverage[] }) {
  return (
    <div className="grid gap-4">
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="progresso-title">
        <div className="flex items-center gap-2.5">
          <Route className="size-4 text-primary" aria-hidden="true" />
          <h2 id="progresso-title" className="text-base font-semibold">Progresso nas trilhas</h2>
        </div>

        {tracks.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Nenhuma trilha disponível no momento. <Link href="/labs" className="text-primary">Ver Labs</Link>.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {tracks.map((item) => (
              <li key={item.track.slug} className="rounded-lg border border-border bg-background/40 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <Link href={`/trilhas/${item.track.slug}`} className="truncate font-medium transition hover:text-primary">
                    {item.track.name}
                  </Link>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">{item.completed}/{item.total}</span>
                </div>
                <div className="mt-3">
                  <Bar percent={item.percent} label={`${item.percent}% da trilha ${item.track.name} concluída`} />
                </div>
                {item.nextLab && (
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    Próximo: <Link href={`/labs/${item.nextLab.number}`} className="text-primary hover:underline">{item.nextLab.title}</Link>
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="cobertura-title">
        <div className="flex items-center gap-2.5">
          <GitBranch className="size-4 text-primary" aria-hidden="true" />
          <h2 id="cobertura-title" className="text-base font-semibold">Cobertura de regressão</h2>
        </div>

        {coverage.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nenhum ambiente de prática liberado ainda.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {coverage.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.route}
                  className="block rounded-lg border border-border bg-background/40 p-4 transition hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{item.name}</span>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">{item.executed}/{item.total}</span>
                  </div>
                  <div className="mt-3">
                    <Bar percent={item.percent} label={`${item.percent}% dos cenários executados em ${item.name}`} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
