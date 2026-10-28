// Percurso de uma trilha: os Labs na ordem, o progresso e o próximo passo.
// Server Component — o progresso já vem resolvido do banco.

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrackCertificate } from "./track-certificate";
import { findPracticeApp } from "@/lib/product/apps";
import { eligibility } from "@/lib/product/certificate";
import type { TrackProgress, TrackStep } from "@/lib/product/tracks";

const stepIcons = { completed: CheckCircle2, started: CircleDot, abandoned: Circle, "nao-iniciado": Circle } as const;

export function TrackPage({ progress, signedIn, certificateCode }: { progress: TrackProgress; signedIn: boolean; certificateCode: string | null }) {
  const { track, nextLab } = progress;
  const app = track.appId === "broto" ? { name: "Broto Space", route: "/conteudo/broto" } : findPracticeApp(track.appId);
  // Passo agendado não aparece na lista — só o que já dá pra abrir de verdade.
  const steps = progress.steps.filter((step) => step.lab.status === "liberado");
  const completed = steps.filter((step) => step.status === "completed").length;
  const total = steps.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const status = eligibility(progress);

  return <main className="qa-system"><div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
    <Link href="/labs" className="text-sm text-primary">← Todos os Labs</Link>

    <header className="mt-6">
      <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{track.name}</h1>
      <p className="mt-3 text-muted-foreground">{track.objective}</p>
      <details className="mt-3 text-sm">
        <summary className="w-fit cursor-pointer text-primary">O que você vai aprender</summary>
        <p className="mt-2 max-w-2xl leading-6 text-muted-foreground">{track.outcome}</p>
      </details>
      {app && <p className="mt-3 text-sm text-muted-foreground">Praticar em <Link href={app.route} className="text-primary underline-offset-4 hover:underline">{app.name}</Link></p>}
    </header>

    {signedIn && <section className="mt-8" aria-label="Progresso na trilha">
      <div className="text-sm font-medium">{completed} de {total} Labs concluídos</div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label={`${percent}% da trilha concluída`}><div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} /></div>
      {nextLab
        ? <Button asChild className="mt-5"><Link href={`/labs/${nextLab.number}`}>{completed === 0 ? "Começar" : "Continuar"}: {nextLab.title} <ArrowRight className="size-4" /></Link></Button>
        : <p className="mt-5 rounded-md border border-primary/30 bg-primary/[0.04] p-4 text-sm text-primary">Trilha concluída. Todas as etapas do fluxo têm evidência registrada.</p>}
      <TrackCertificate trackSlug={track.slug} eligible={status.eligible} missing={status.missing} code={certificateCode} />
    </section>}

    {!signedIn && <p className="mt-8 text-sm text-muted-foreground">
      <Link href={`/login?next=/trilhas/${track.slug}`} className="text-primary underline-offset-4 hover:underline">Entre para salvar seu progresso</Link>. Os Labs estão abertos sem login.
    </p>}

    {steps.length > 0
      ? <ol className="mt-8 divide-y divide-border">{steps.map((step) => <Step key={step.lab.slug} step={step} signedIn={signedIn} />)}</ol>
      : <p className="mt-8 text-sm text-muted-foreground">Ainda não há Labs liberados nesta trilha. <Link href="/labs" className="text-primary underline-offset-4 hover:underline">Ver Labs disponíveis</Link>.</p>}
  </div></main>;
}

function Step({ step, signedIn }: { step: TrackStep; signedIn: boolean }) {
  const Icon = stepIcons[step.status];
  const done = step.status === "completed";
  return <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 gap-y-3 py-5 sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:gap-x-4">
    <span className="row-span-2 flex flex-col items-center gap-1.5 pt-0.5 sm:row-span-1">
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
    {/* Passo concluído leva ao case, não de volta ao briefing: quem já entregou
        quer publicar, não reler o enunciado. */}
    <Button className="col-start-2 w-fit sm:col-auto" asChild variant={done ? "ghost" : "outline"} size="sm"><Link href={done ? `/labs/${step.lab.number}/conclusao` : `/labs/${step.lab.number}`}>{done ? "Ver case" : "Abrir"}</Link></Button>
  </li>;
}
