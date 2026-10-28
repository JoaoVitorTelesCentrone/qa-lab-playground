"use client";

// Briefing, execução e entrega de um Lab — o loop de aprendizagem completo.
//
// Fluxo em 4 passos horizontais (Contexto → Roteiro → Ambiente → Entrega) em
// vez de um scroll vertical único: só o passo atual fica visível, então o
// aluno sempre sabe onde está e o que falta.
//
// A evidência vai para a API v1, que avalia com `evaluateEvidence` e conclui o
// Lab na mesma operação. O formulário roda a mesma avaliação só para dar
// feedback antes do envio; quem decide é o servidor. Nada de progresso em
// localStorage: o histórico exibido aqui vem do banco a cada render.

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, ExternalLink, FlaskConical, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { EvidenceField } from "./evidence-field";
import { SubmissionHistory } from "./submission-history";
import { findLabByNumber, labLabel } from "@/lib/playground/catalog";
import type { SystemChallenge } from "@/lib/system-challenges";
import type { Attachment, EnrollmentStatus, Submission } from "@/lib/product/journey";
import type { TrackProgress } from "@/lib/product/tracks";
import { evaluateEvidence, type Evaluation } from "@/lib/product/evaluation";

const steps = [
  { label: "Contexto" },
  { label: "Roteiro" },
  { label: "Ambiente" },
  { label: "Entrega" },
] as const;

// O desafio aponta para a superfície do módulo quando a área não tem rota própria.
function surfaceRoute(challenge: SystemChallenge) {
  if (challenge.area === "Clientes") return "/shop/account";
  if (challenge.area === "Pedidos") return "/shop/orders";
  if (["Atendimento", "Operacao", "Relatorios", "Governanca"].includes(challenge.area)) return "/shop/operations";
  return challenge.route;
}

export function LabBriefing({ challenge, status, submissions, trackProgress, signedIn }: { challenge: SystemChallenge; status: EnrollmentStatus | "nao-iniciado"; submissions: Submission[]; trackProgress: TrackProgress | null; signedIn: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [evidence, setEvidence] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  const lab = findLabByNumber(challenge.number);
  // O aluno lê o número de lançamento ("01"); a rota continua no de catálogo.
  const label = lab ? labLabel(lab) : String(challenge.number).padStart(2, "0");
  const surface = surfaceRoute(challenge);
  const issueFor = (field: string) => evaluation?.issues.find((issue) => issue.field === field)?.message;
  const trackStep = trackProgress?.steps.find((item) => item.lab.slug === challenge.id);
  const nextInTrack = trackProgress?.steps.find((item) => item.position > (trackStep?.position ?? 0) && item.status !== "completed")?.lab ?? null;

  async function start() {
    if (!signedIn || starting) return;
    setStarting(true);
    setError("");
    try {
      const response = await fetch("/api/v1/progress", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ labSlug: challenge.id }) });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error?.message ?? "Não foi possível iniciar o Lab. Tente novamente.");
        return;
      }
      router.refresh();
    } catch {
      setError("Sem conexão com o servidor. Tente iniciar o Lab novamente.");
    } finally {
      setStarting(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const local = evaluateEvidence({ evidence, attachments: attachments.length });
    setEvaluation(local);
    setError("");
    if (!local.passed) return;

    setState("saving");
    try {
      const response = await fetch("/api/v1/submissions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ labSlug: challenge.id, evidence, attachments }) });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error?.message ?? "Não foi possível salvar a evidência. Tente novamente.");
        return;
      }
      setState("done");
      setEvidence("");
      setAttachments([]);
      setEvaluation(null);
      router.refresh();
    } catch {
      setError("Sem conexão com o servidor. Sua evidência continua no formulário; tente novamente.");
    } finally {
      setState((current) => current === "saving" ? "idle" : current);
    }
  }

  const exitHref = trackProgress ? `/trilhas/${trackProgress.track.slug}` : "/labs";

  return <main className="qa-system"><div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
    {trackProgress && trackStep && <p className="text-xs text-muted-foreground">{trackProgress.track.name} · etapa {trackStep.position}/{trackProgress.total}</p>}

    <Breadcrumb className="mt-2">
      <BreadcrumbList className="gap-1.5 text-sm">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/labs" className="flex items-center gap-1.5 rounded-sm px-1 py-0.5 hover:text-foreground">
              <FlaskConical className="size-3.5 text-muted-foreground" aria-hidden="true" />
              Labs
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-muted-foreground/70"><ChevronRight /></BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="rounded-sm px-1 py-0.5 font-medium">Lab {label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <header className="mt-7 flex flex-wrap items-center gap-3">
      <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">{challenge.title}</h1>
      {status === "completed" && <Badge variant="secondary" className="gap-1"><CheckCircle2 className="size-3" /> concluído</Badge>}
      {status === "started" && <Badge variant="secondary">em andamento</Badge>}
    </header>
    <p className="mt-3 text-sm text-muted-foreground">{challenge.area} · {challenge.difficulty} · {challenge.mode}</p>

    {/* Quem volta a um Lab já entregue precisa de um caminho de uma linha até o
        case — sem isso a entrega antiga fica enterrada no histórico. */}
    {submissions.length > 0 && state !== "done" && <Link href={`/labs/${challenge.number}/conclusao`} className="mt-4 flex items-center justify-between gap-3 rounded-md border border-primary/30 bg-primary/[0.04] p-3 text-sm transition hover:border-primary">
      <span>Você já entregou evidência neste Lab. <strong className="font-medium text-primary">Abrir o case e publicar</strong></span>
      <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden="true" />
    </Link>}

    {/* Passo a passo horizontal: cada etapa é um botão; só o conteúdo do passo atual aparece abaixo. */}
    <ol className="mt-6 grid grid-cols-2 gap-2 border-b border-border pb-3 sm:mt-9 sm:flex" aria-label="Etapas do Lab">
      {steps.map((item, index) => <li key={item.label} className="min-w-0 sm:shrink-0">
        <button
          type="button"
          aria-label={`Etapa ${index + 1}: ${item.label}`}
          data-onboarding={`lab-step-${index}`}
          aria-current={index === step ? "step" : undefined}
          onClick={() => setStep(index)}
          className={`flex min-h-11 w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto sm:pr-4 ${index === step ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
        >
          <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs ${index === step ? "bg-primary-foreground/20" : "border border-border"}`}>
            {index + 1}
          </span>
          <span>{item.label}</span>
        </button>
      </li>)}
    </ol>

    <div data-onboarding="lab-panel" className="mt-6 rounded-xl bg-card p-5 sm:p-8">
      <div key={step} className="qa-lab-step-panel">
      {step === 0 && <section>
        <h2 className="text-sm font-semibold text-muted-foreground">Missão</h2>
        <p className="mt-2 text-base leading-7">{challenge.objective}</p>
        <dl className="mt-5 grid gap-4 border-y border-border py-4 sm:grid-cols-2">
          <Brief label="Dados de teste" value={challenge.testData} />
          <Brief label="Resultado esperado" value={challenge.expected} />
        </dl>
        <details className="mt-4">
          <summary className="w-fit cursor-pointer text-sm font-medium text-primary">Pista de investigação</summary>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{challenge.plantedBug}</p>
        </details>
        <details className="mt-3">
          <summary className="w-fit cursor-pointer text-sm font-medium text-primary">Critérios da entrega ({challenge.acceptance.length})</summary>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">{challenge.acceptance.map((criterion) => <li key={criterion} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><span>{criterion}</span></li>)}</ul>
        </details>
      </section>}

      {step === 1 && <section>
        <h2 className="text-sm font-semibold text-muted-foreground">Roteiro de execução</h2>
        <ol className="mt-5 divide-y divide-border border-y border-border">
          {challenge.steps.map((item, index) => <li key={item} className="flex gap-5 py-4 text-sm"><span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span><p className="max-w-2xl leading-6">{item}</p></li>)}
        </ol>
      </section>}

      {step === 2 && <section>
        <h2 className="text-sm font-semibold text-muted-foreground">Ambiente do Lab</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{challenge.area === "Broto" ? "Leia o caso fictício, abra o Broto a partir dele e volte aqui para registrar o que observou." : "Abra o ambiente em outra aba, execute o roteiro e volte aqui para registrar a evidência."}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild><Link href={surface} target="_blank" rel="noopener noreferrer">{challenge.area === "Broto" ? "Abrir caso de treino" : "Abrir ambiente do Lab"} <ExternalLink className="size-4" /></Link></Button>
          {signedIn && status === "nao-iniciado" && <Button type="button" variant="outline" disabled={starting} onClick={() => void start()}>{starting && <Loader2 className="size-4 animate-spin" />} {starting ? "Iniciando..." : "Marcar como iniciado"}</Button>}
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      </section>}

      {step === 3 && <section>
        <h2 className="text-sm font-semibold text-muted-foreground">Entrega de evidência</h2>
        <p className="mt-1 text-xs text-muted-foreground">Registre o que encontrou e anexe a prova para concluir o Lab.</p>
        <div className="mt-5">
          <h3 className="text-sm font-semibold">Revise antes de enviar</h3>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">{challenge.acceptance.map((criterion) => <li key={criterion} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><span>{criterion}</span></li>)}</ul>
        </div>

        {!signedIn ? <p className="mt-5 rounded-md border border-border bg-muted/40 p-4 text-sm"><Link href={`/login?next=${encodeURIComponent(`/labs/${challenge.number}`)}`} className="font-medium text-primary underline underline-offset-4">Entre na sua conta</Link> para salvar a evidência e o progresso.</p> : <form className="mt-5 grid gap-5" onSubmit={submit} noValidate>
          <EvidenceField
            labSlug={challenge.id}
            value={evidence}
            attachments={attachments}
            onValueChange={setEvidence}
            onAttachmentsChange={setAttachments}
            error={issueFor("evidence")}
            disabled={state === "saving"}
          />
          <Button disabled={state === "saving"} className="justify-self-start">{state === "saving" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Entregar evidência</Button>
        </form>}

        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
        {/* O destino depois da entrega é a conclusão, não o próximo Lab: é lá
            que a evidência vira case publicável. Encadear direto no Lab seguinte
            fazia o aluno acumular entregas sem nunca ter o que mostrar. */}
        {state === "done" && <div role="status" aria-live="polite" className="mt-5 rounded-md border border-primary/30 bg-primary/[0.04] p-4">
          <p className="text-sm font-medium text-primary">Evidência salva. Lab concluído.</p>
          <p className="mt-2 text-sm text-muted-foreground">Sua entrega virou um case com contexto, evidências e passos para reproduzir.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm"><Link href={`/labs/${challenge.number}/conclusao`}>Ver meu case <ArrowRight className="size-4" /></Link></Button>
            {nextInTrack
              ? <Button asChild size="sm" variant="outline"><Link href={`/labs/${nextInTrack.number}`}>Próximo Lab da trilha</Link></Button>
              : <Button asChild size="sm" variant="outline"><Link href="/labs">Escolher o próximo Lab</Link></Button>}
          </div>
          {!nextInTrack && trackProgress && <p className="mt-3 text-xs text-muted-foreground">Você concluiu todos os Labs da trilha {trackProgress.track.name} — o certificado te espera na conclusão.</p>}
        </div>}

        <SubmissionHistory labSlug={challenge.id} submissions={submissions} />
      </section>}
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between">
      {step === 0
        ? <Button asChild type="button" variant="ghost" size="sm"><Link href={exitHref}><ArrowLeft className="size-3.5" /> {trackProgress ? `Trilha ${trackProgress.track.name}` : "Todos os Labs"}</Link></Button>
        : <Button type="button" variant="ghost" size="sm" onClick={() => setStep((current) => current - 1)}><ArrowLeft className="size-3.5" /> Voltar</Button>}
      {step < steps.length - 1 && <Button type="button" variant="outline" size="sm" onClick={() => setStep((current) => current + 1)}>Avançar <ArrowRight className="size-3.5" /></Button>}
    </div>
  </div></main>;
}

function Brief({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm font-semibold">{label}</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">{value}</dd></div>;
}

