// Percurso de uma trilha: os Labs na ordem, o progresso e o próximo passo.
// Server Component — o progresso já vem resolvido do banco.

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { findPracticeApp } from "@/lib/product/apps";
import type { TrackProgress, TrackStep } from "@/lib/product/tracks";

const stepIcons = { completed: CheckCircle2, started: CircleDot, abandoned: Circle, "nao-iniciado": Circle } as const;

export function TrackPage({ progress, signedIn }: { progress: TrackProgress; signedIn: boolean }) {
  const { track, steps, completed, total, percent, nextLab } = progress;
  const app = findPracticeApp(track.appId);

  return <main className="qa-system"><div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
    <Link href="/labs" className="text-sm text-primary">← Todos os Labs</Link>

    <header className="mt-6">
      <p className="qa-eyebrow">Trilha</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{track.name}</h1>
      <p className="mt-3 text-muted-foreground">{track.objective}</p>
      <p className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-sm"><strong>Ao terminar:</strong> {track.outcome}</p>
      {app && <p className="mt-3 text-sm text-muted-foreground">Ambiente: <Link href={app.route} className="text-primary">{app.name}</Link></p>}
    </header>

    {signedIn && <section className="mt-8" aria-label="Progresso na trilha">
      <div className="flex items-center justify-between text-sm"><span className="font-medium">{completed} de {total} Labs concluídos</span><span className="font-mono text-xs text-muted-foreground">{percent}%</span></div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label={`${percent}% da trilha concluída`}><div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} /></div>
      {nextLab
        ? <Button asChild className="mt-5"><Link href={`/labs/${nextLab.number}`}>{completed === 0 ? "Começar" : "Continuar"}: {nextLab.title} <ArrowRight className="size-4" /></Link></Button>
        : <p className="mt-5 rounded-md border border-primary/30 bg-primary/[0.04] p-4 text-sm text-primary">Trilha concluída. Todas as etapas do fluxo têm evidência registrada.</p>}
    </section>}

    {!signedIn && <p className="mt-8 rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
      <Link href={`/login?next=/labs/trilhas/${track.slug}`} className="text-primary">Entre na sua conta</Link> para salvar o progresso da trilha. Os Labs abaixo podem ser abertos mesmo sem login.
    </p>}

    <ol className="mt-10 grid gap-3">{steps.map((step) => <Step key={step.lab.slug} step={step} signedIn={signedIn} />)}</ol>
  </div></main>;
}

function Step({ step, signedIn }: { step: TrackStep; signedIn: boolean }) {
  const Icon = stepIcons[step.status];
  const done = step.status === "completed";
  return <li className="flex items-start gap-4 rounded-xl border border-border p-4">
    <span className="flex flex-col items-center gap-1.5 pt-0.5">
      <Icon className={done ? "size-5 text-primary" : "size-5 text-muted-foreground"} aria-hidden="true" />
      <span className="font-mono text-xs text-muted-foreground">{String(step.position).padStart(2, "0")}</span>
    </span>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2.5">
        <h2 className="font-medium">{step.lab.title}</h2>
        {signedIn && done && <Badge variant="secondary">concluído</Badge>}
        {signedIn && step.status === "started" && <Badge variant="secondary">em andamento</Badge>}
      </div>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.lab.objective}</p>
      <p className="mt-2 text-xs text-muted-foreground">{step.lab.difficulty} · {step.lab.minutes} min{signedIn && step.submissions > 0 ? ` · ${step.submissions} evidência(s)` : ""}</p>
    </div>
    <Button asChild variant={done ? "ghost" : "outline"} size="sm"><Link href={`/labs/${step.lab.number}`}>{done ? "Revisar" : "Abrir"}</Link></Button>
  </li>;
}
