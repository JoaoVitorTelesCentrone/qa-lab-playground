// Home do produto: jornada do aluno, ambientes de prática e Labs.
//
// Server Component — lê a jornada já resolvida no servidor. Deslogado, mostra
// a promessa e o convite a começar; logado, o painel "Minha jornada" com o
// progresso que veio do banco.

import Link from "next/link";
import { ArrowRight, Boxes, CalendarDays, CheckCircle2, Clock3, FileCheck2, ScanSearch, Target, Users, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { practiceApps, type PracticeAppId } from "@/lib/product/apps";
import type { AppCoverage, Journey, LabProgress } from "@/lib/product/journey";
import type { TrackProgress } from "@/lib/product/tracks";

const appIcons: Record<PracticeAppId, typeof Boxes> = { "qa-lab": Boxes, financas: WalletCards, agendamentos: CalendarDays, crm: Users };

const statusLabels: Record<LabProgress["status"], string> = { started: "em andamento", completed: "concluído", abandoned: "abandonado", "nao-iniciado": "não iniciado" };

export function ProductHome({ journey, tracks, signedIn }: { journey: Journey; tracks: TrackProgress[]; signedIn: boolean }) {
  // A trilha é o caminho recomendado; o Lab solto da jornada é o plano B para
  // quem já terminou o percurso curado.
  const track = tracks.find((item) => item.nextLab) ?? tracks[0] ?? null;
  const nextLab = track?.nextLab ?? journey.nextLab;

  return <div className="qa-home"><div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
    <section className="qa-next-lab" aria-labelledby="home-title">
      <p className="qa-watermark" aria-hidden="true">Seu laboratório prático de qualidade de software.</p>
      <div className="qa-next-content max-w-2xl">
        <p className="qa-eyebrow">QA Lab</p>
        <h1 id="home-title" className="mt-7 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl">Pratique QA em aplicações completas.</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Quatro ambientes reais para testar, Labs que partem de riscos de produto e um registro de evidências que vira o seu portfólio. Sem precisar montar aplicação nenhuma.</p>
        {nextLab
          ? <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg"><Link href={`/labs/${nextLab.number}`}>{signedIn && journey.started > 0 ? "Continuar" : "Começar"}: {nextLab.title} <ArrowRight className="size-4" /></Link></Button>
              <span className="inline-flex items-center gap-2 px-2 text-sm text-muted-foreground"><Clock3 className="size-4" /> {nextLab.minutes} minutos de prática</span>
            </div>
          : <div className="mt-9"><Button asChild size="lg"><Link href="/labs">Ver todos os Labs <ArrowRight className="size-4" /></Link></Button></div>}
      </div>
    </section>

    <JourneyPanel journey={journey} signedIn={signedIn} />

    <section className="mt-16" aria-labelledby="tracks-title">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div><p className="qa-eyebrow">Percurso guiado</p><h2 id="tracks-title" className="mt-2 text-2xl font-semibold">Trilhas</h2></div>
        <p className="text-sm text-muted-foreground">Labs em sequência, do primeiro passo ao fluxo completo</p>
      </div>
      <div className="mt-6 grid gap-4">{tracks.map((item) => <article key={item.track.slug} className="rounded-xl border border-border p-5 sm:p-6">
        <h3 className="text-lg font-semibold">{item.track.name}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.track.objective}</p>
        <p className="mt-3 text-sm leading-6"><strong className="font-medium">Ao terminar:</strong> <span className="text-muted-foreground">{item.track.outcome}</span></p>
        {signedIn
          ? <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{item.completed} de {item.total} Labs concluídos</span><span className="font-mono">{item.percent}%</span></div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label={`${item.percent}% da trilha ${item.track.name} concluída`}><div className="h-full rounded-full bg-primary" style={{ width: `${item.percent}%` }} /></div>
            </div>
          : <p className="mt-5 text-sm text-muted-foreground">{item.total} Labs em sequência.</p>}
        <Button asChild className="mt-5" variant="outline"><Link href={`/labs/trilhas/${item.track.slug}`}>Ver a trilha <ArrowRight className="size-4" /></Link></Button>
      </article>)}</div>
    </section>

    <section className="mt-16" aria-labelledby="apps-title">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div><p className="qa-eyebrow">Ambientes de prática</p><h2 id="apps-title" className="mt-2 text-2xl font-semibold">Quatro aplicações para testar</h2></div>
        <p className="text-sm text-muted-foreground">35 cenários de regressão por ambiente</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {practiceApps.map((app) => {
          const Icon = appIcons[app.id];
          const coverage = journey.coverage.find((item) => item.id === app.id);
          return <article key={app.id} className="qa-process flex flex-col">
            <div className="flex items-center justify-between"><Icon className="size-4 text-primary" /><span className="font-mono text-xs text-muted-foreground">{app.flows.length} fluxos</span></div>
            <h3 className="mt-6 font-semibold">{app.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{app.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">{app.flows.map((flow) => <li key={flow}><Badge variant="secondary" className="font-normal">{flow}</Badge></li>)}</ul>
            {signedIn && coverage && <Coverage coverage={coverage} />}
            <div className="mt-5 flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm"><Link href={app.route}>Abrir ambiente</Link></Button>
              <Button asChild size="sm" variant="ghost"><Link href={`/labs/regressao#${app.id}`}>Pack de regressão</Link></Button>
            </div>
          </article>;
        })}
      </div>
    </section>

    <section className="qa-process-grid mt-16" aria-label="Como o QA Lab funciona">
      <Step icon={Target} index="01" title="Escolha um risco" text="Cada Lab parte de um problema real dentro de um dos ambientes." />
      <Step icon={ScanSearch} index="02" title="Investigue" text="Teste o comportamento com dados, oráculo e critérios de aceite claros." />
      <Step icon={FileCheck2} index="03" title="Registre evidência" text="Resultado, reprodução e severidade ficam salvos no seu histórico." />
    </section>

    <section className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
      <div><h2 className="text-lg font-semibold">Explore o catálogo completo</h2><p className="mt-1 text-sm text-muted-foreground">Filtre por trilha, nível e tempo de prática.</p></div>
      <Button asChild variant="outline"><Link href="/labs">Ver Labs e desafios <ArrowRight className="size-4" /></Link></Button>
    </section>
  </div></div>;
}

function JourneyPanel({ journey, signedIn }: { journey: Journey; signedIn: boolean }) {
  if (!signedIn) {
    return <section className="mt-12 rounded-xl border border-border bg-card p-6 sm:p-8" aria-labelledby="journey-title">
      <h2 id="journey-title" className="text-lg font-semibold">Minha jornada</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Crie sua conta para salvar progresso, evidências e histórico. Seus registros ficam no servidor e acompanham você em qualquer dispositivo.</p>
      <div className="mt-5 flex flex-wrap gap-2"><Button asChild><Link href="/cadastro">Criar conta</Link></Button><Button asChild variant="outline"><Link href="/login">Entrar</Link></Button></div>
    </section>;
  }

  return <section className="mt-12" aria-labelledby="journey-title">
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
      <div><p className="qa-eyebrow">Seu progresso</p><h2 id="journey-title" className="mt-2 text-2xl font-semibold">Minha jornada</h2></div>
      <Link href="/perfil" className="text-sm font-medium text-primary">Ver perfil e histórico</Link>
    </div>

    <div className="mt-6 grid divide-y divide-border border-y border-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
      <Stat label="Labs iniciados" value={journey.started} />
      <Stat label="Labs concluídos" value={journey.completed} />
      <Stat label="Evidências entregues" value={journey.evidence} />
      <Stat label="Taxa de conclusão" value={`${journey.completionRate}%`} />
    </div>

    {journey.recent.length === 0
      ? <p className="mt-6 text-sm text-muted-foreground">Você ainda não iniciou nenhum Lab. Comece pelo desafio sugerido acima — leva poucos minutos.</p>
      : <ul className="mt-6 divide-y divide-border border-b border-border">{journey.recent.map((item) => <li key={item.lab.slug} className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5"><span className="font-mono text-xs text-primary">LAB {String(item.lab.number).padStart(2, "0")}</span><h3 className="font-medium">{item.lab.title}</h3>{item.status === "completed" && <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />}</div>
            <p className="mt-1 text-xs text-muted-foreground">{statusLabels[item.status]} · {item.submissions} evidência(s)</p>
          </div>
          <Button asChild variant="outline" size="sm"><Link href={`/labs/${item.lab.number}`}>{item.status === "completed" ? "Revisar" : "Continuar"}</Link></Button>
        </li>)}</ul>}
  </section>;
}

function Coverage({ coverage }: { coverage: AppCoverage }) {
  return <div className="mt-5">
    <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Regressão executada</span><span className="font-mono">{coverage.executed}/{coverage.total}</span></div>
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label={`${coverage.percent}% dos cenários executados em ${coverage.name}`}><div className="h-full rounded-full bg-primary" style={{ width: `${coverage.percent}%` }} /></div>
    {coverage.failed > 0 && <p className="mt-2 text-xs text-muted-foreground">{coverage.failed} cenário(s) com falha registrada.</p>}
  </div>;
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return <div className="py-4 sm:px-6 sm:first:pl-0 sm:last:pr-0"><p className="text-3xl font-semibold tracking-[-0.03em]">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>;
}

function Step({ icon: Icon, index, title, text }: { icon: typeof Target; index: string; title: string; text: string }) {
  return <article className="qa-process"><div className="flex items-center justify-between"><Icon className="size-4 text-primary" /><span className="font-mono text-xs text-muted-foreground">{index}</span></div><h2 className="mt-6 font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>;
}
