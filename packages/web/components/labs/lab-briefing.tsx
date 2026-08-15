"use client";

// Briefing, execução e entrega de um Lab — o loop de aprendizagem completo.
//
// A evidência vai para a API v1, que avalia com `evaluateEvidence` e conclui o
// Lab na mesma operação. O formulário roda a mesma avaliação só para dar
// feedback antes do envio; quem decide é o servidor. Nada de progresso em
// localStorage: o histórico exibido aqui vem do banco a cada render.

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Circle, ExternalLink, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { SystemChallenge } from "@/lib/system-challenges";
import type { EnrollmentStatus, Submission } from "@/lib/product/journey";
import type { TrackProgress } from "@/lib/product/tracks";
import { evaluateEvidence, MIN_LENGTH, severities, type Evaluation } from "@/lib/product/evaluation";

const severityLabels: Record<(typeof severities)[number], string> = { baixa: "Baixa", media: "Média", alta: "Alta", critica: "Crítica" };

// O desafio aponta para a superfície do módulo quando a área não tem rota própria.
function surfaceRoute(challenge: SystemChallenge) {
  if (challenge.area === "Clientes") return "/shop/account";
  if (challenge.area === "Pedidos") return "/shop/orders";
  if (["Atendimento", "Operacao", "Relatorios", "Governanca"].includes(challenge.area)) return "/shop/operations";
  return challenge.route;
}

export function LabBriefing({ challenge, signedIn, status, submissions, trackProgress }: { challenge: SystemChallenge; signedIn: boolean; status: EnrollmentStatus | "nao-iniciado"; submissions: Submission[]; trackProgress: TrackProgress | null }) {
  const router = useRouter();
  const [checked, setChecked] = useState<string[]>([]);
  const [draft, setDraft] = useState({ result: "", reproduction: "", severity: "" });
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState("");

  const surface = surfaceRoute(challenge);
  const issueFor = (field: string) => evaluation?.issues.find((issue) => issue.field === field)?.message;
  const step = trackProgress?.steps.find((item) => item.lab.slug === challenge.id);
  const nextInTrack = trackProgress?.steps.find((item) => item.position > (step?.position ?? 0) && item.status !== "completed")?.lab ?? null;

  function toggle(criterion: string) {
    setChecked((current) => (current.includes(criterion) ? current.filter((item) => item !== criterion) : [...current, criterion]));
  }

  async function start() {
    await fetch("/api/v1/progress", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ labSlug: challenge.id }) });
    router.refresh();
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const local = evaluateEvidence({ ...draft, checklist: checked }, challenge.acceptance);
    setEvaluation(local);
    setError("");
    if (!local.passed) return;

    setState("saving");
    const response = await fetch("/api/v1/submissions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ labSlug: challenge.id, ...draft, checklist: checked }) });
    if (!response.ok) {
      setState("idle");
      const body = await response.json().catch(() => null);
      setError(body?.error?.message ?? "Não foi possível salvar a evidência. Tente novamente.");
      return;
    }
    setState("done");
    setDraft({ result: "", reproduction: "", severity: "" });
    setChecked([]);
    setEvaluation(null);
    router.refresh();
  }

  return <main className="qa-system"><div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
    <Link href={trackProgress ? `/labs/trilhas/${trackProgress.track.slug}` : "/labs"} className="text-sm text-primary">← {trackProgress ? `Trilha ${trackProgress.track.name}` : "Todos os Labs"}</Link>

    {trackProgress && step && <p className="mt-3 text-xs text-muted-foreground">Passo {step.position} de {trackProgress.total} · {trackProgress.completed} concluído(s)</p>}

    <Card className="mt-6">
      <CardHeader>
        <CardDescription>Lab {String(challenge.number).padStart(3, "0")} · {challenge.area} · {challenge.difficulty} · {challenge.mode}</CardDescription>
        <div className="flex flex-wrap items-center gap-3"><CardTitle className="text-2xl">{challenge.title}</CardTitle>{status === "completed" && <Badge variant="secondary" className="gap-1"><CheckCircle2 className="size-3" /> concluído</Badge>}{status === "started" && <Badge variant="secondary">em andamento</Badge>}</div>
      </CardHeader>
      <CardContent>
        <p>{challenge.objective}</p>
        <Brief label="Dados de teste" value={challenge.testData} />
        <Brief label="Oráculo" value={challenge.expected} />
        <Brief label="Pista de investigação" value={challenge.plantedBug} />
        <h2 className="mt-7 font-semibold">Roteiro de execução</h2>
        <ol className="mt-3 grid gap-3">{challenge.steps.map((item, index) => <li key={item} className="rounded border p-3 text-sm"><strong>{index + 1}.</strong> {item}</li>)}</ol>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild onClick={signedIn && status === "nao-iniciado" ? start : undefined}><Link href={surface}>Abrir ambiente do Lab <ExternalLink className="size-4" /></Link></Button>
          {signedIn && status === "nao-iniciado" && <Button type="button" variant="outline" onClick={start}>Marcar como iniciado</Button>}
        </div>
      </CardContent>
    </Card>

    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Entrega de evidência</CardTitle>
        <CardDescription>A entrega é avaliada automaticamente: sem os campos preenchidos e todos os critérios de aceite confirmados, o Lab continua em aberto.</CardDescription>
      </CardHeader>
      <CardContent>
        {signedIn
          ? <form className="grid gap-5" onSubmit={submit} noValidate>
              <Field label="Resultado obtido" hint={`Mínimo de ${MIN_LENGTH} caracteres.`} error={issueFor("result")}>
                <Textarea value={draft.result} onChange={(event) => setDraft({ ...draft, result: event.target.value })} placeholder="O que a aplicação exibiu ou fez? Inclua valores e mensagens." aria-invalid={Boolean(issueFor("result"))} />
              </Field>
              <Field label="Passos de reprodução" hint="Um passo por linha." error={issueFor("reproduction")}>
                <Textarea value={draft.reproduction} onChange={(event) => setDraft({ ...draft, reproduction: event.target.value })} placeholder={"1. ...\n2. ...\n3. ..."} aria-invalid={Boolean(issueFor("reproduction"))} />
              </Field>
              <Field label="Severidade" error={issueFor("severity")}>
                <select value={draft.severity} onChange={(event) => setDraft({ ...draft, severity: event.target.value })} className="input" aria-invalid={Boolean(issueFor("severity"))}>
                  <option value="">Selecione</option>
                  {severities.map((item) => <option key={item} value={item}>{severityLabels[item]}</option>)}
                </select>
              </Field>

              <fieldset>
                <legend className="text-sm font-medium">Critérios de aceite</legend>
                <p className="mt-1 text-xs text-muted-foreground">Confirme cada critério que você verificou de fato.</p>
                <div className="mt-3 grid gap-2">{challenge.acceptance.map((criterion) => {
                  const active = checked.includes(criterion);
                  // O checkbox fica sr-only; o foco do teclado aparece no rótulo inteiro.
                  return <label key={criterion} className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border p-3 text-sm transition hover:bg-accent focus-within:ring-2 focus-within:ring-ring/40">
                    <input type="checkbox" checked={active} onChange={() => toggle(criterion)} className="sr-only" />
                    {active ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> : <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
                    <span>{criterion}</span>
                  </label>;
                })}</div>
                {issueFor("checklist") && <p className="mt-2 text-xs text-destructive">{issueFor("checklist")}</p>}
              </fieldset>

              <Button disabled={state === "saving"}>{state === "saving" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Entregar evidência</Button>
            </form>
          : <div>
              <h3 className="text-sm font-medium">Critérios para concluir</h3>
              <ul className="mt-3 grid gap-2 text-sm">{challenge.acceptance.map((criterion) => <li key={criterion} className="rounded-md border border-border p-3">{criterion}</li>)}</ul>
              <p className="mt-5 text-sm text-muted-foreground">Entre na sua conta para registrar evidência. O histórico fica salvo no servidor e acompanha você em qualquer dispositivo.</p>
              <div className="mt-4 flex gap-2"><Button asChild><Link href={`/login?next=/labs/${challenge.number}`}>Entrar</Link></Button><Button asChild variant="outline"><Link href="/cadastro">Criar conta</Link></Button></div>
            </div>}

        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
        {state === "done" && <div role="status" aria-live="polite" className="mt-5 rounded-md border border-primary/30 bg-primary/[0.04] p-4">
          <p className="text-sm font-medium text-primary">Evidência salva. Lab concluído.</p>
          {nextInTrack
            ? <Button asChild size="sm" className="mt-3"><Link href={`/labs/${nextInTrack.number}`}>Próximo Lab da trilha: {nextInTrack.title} <ArrowRight className="size-4" /></Link></Button>
            : trackProgress
              ? <p className="mt-2 text-sm text-muted-foreground">Você concluiu todos os Labs da trilha {trackProgress.track.name}.</p>
              : <Button asChild size="sm" variant="outline" className="mt-3"><Link href="/labs">Escolher o próximo Lab</Link></Button>}
        </div>}
      </CardContent>
    </Card>

    {submissions.length > 0 && <Card className="mt-5">
      <CardHeader><CardTitle>Suas evidências</CardTitle><CardDescription>{submissions.length} entrega(s) registrada(s) neste Lab.</CardDescription></CardHeader>
      <CardContent><ul className="grid gap-3">{submissions.map((item) => <li key={item.id} className="rounded border p-3 text-sm">
        <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString("pt-BR")} · severidade {item.severity}</p>
        <p className="mt-2">{item.result}</p>
        <p className="mt-2 whitespace-pre-line text-muted-foreground">{item.reproduction}</p>
        {item.checklist.length > 0 && <ul className="mt-3 grid gap-1">{item.checklist.map((criterion) => <li key={criterion} className="flex items-center gap-1.5 text-xs text-muted-foreground"><CheckCircle2 className="size-3 shrink-0 text-primary" aria-hidden="true" />{criterion}</li>)}</ul>}
      </li>)}</ul></CardContent>
    </Card>}
  </div></main>;
}

function Brief({ label, value }: { label: string; value: string }) {
  return <div className="mt-5 rounded-md border bg-muted/40 p-3 text-sm"><strong>{label}</strong><p className="mt-1 text-muted-foreground">{value}</p></div>;
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-medium">
    <span>{label}{hint && <span className="ml-2 font-normal text-xs text-muted-foreground">{hint}</span>}</span>
    {children}
    {error && <span className="text-xs font-normal text-destructive">{error}</span>}
  </label>;
}
