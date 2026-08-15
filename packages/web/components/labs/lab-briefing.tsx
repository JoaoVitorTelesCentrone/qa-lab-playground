"use client";

// Briefing e entrega de um Lab.
//
// A evidência vai para a API v1 (`/api/v1/submissions`), que grava no banco e
// conclui o Lab na mesma operação. Nada de progresso em localStorage: o
// histórico exibido aqui vem do servidor a cada render.

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { SystemChallenge } from "@/lib/system-challenges";
import type { EnrollmentStatus, Submission } from "@/lib/product/journey";

const severities = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
  { value: "critica", label: "Crítica" },
] as const;

const MIN = 20;

// O desafio aponta para a superfície do módulo quando a área não tem rota própria.
function surfaceRoute(challenge: SystemChallenge) {
  if (challenge.area === "Clientes") return "/shop/account";
  if (challenge.area === "Pedidos") return "/shop/orders";
  if (["Atendimento", "Operacao", "Relatorios", "Governanca"].includes(challenge.area)) return "/shop/operations";
  return challenge.route;
}

export function LabBriefing({ challenge, signedIn, status, submissions }: { challenge: SystemChallenge; signedIn: boolean; status: EnrollmentStatus | "nao-iniciado"; submissions: Submission[] }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "saving">("idle");
  const [message, setMessage] = useState("");
  const surface = surfaceRoute(challenge);

  async function start() {
    await fetch("/api/v1/progress", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ labSlug: challenge.id }) });
    router.refresh();
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = String(form.get("result") ?? "").trim();
    const reproduction = String(form.get("reproduction") ?? "").trim();
    const severity = String(form.get("severity") ?? "");
    if (result.length < MIN || reproduction.length < MIN || !severity) {
      setMessage(`Registre ao menos ${MIN} caracteres em resultado e reprodução, e escolha a severidade.`);
      return;
    }
    setState("saving"); setMessage("");
    const response = await fetch("/api/v1/submissions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ labSlug: challenge.id, result, reproduction, severity }) });
    setState("idle");
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setMessage(body?.error?.message ?? "Não foi possível salvar a evidência. Tente novamente.");
      return;
    }
    setMessage("Evidência salva. Lab concluído.");
    router.refresh();
  }

  return <main className="qa-system"><div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
    <Link href="/labs" className="text-sm text-primary">← Todos os Labs</Link>

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
        <ol className="mt-3 grid gap-3">{challenge.steps.map((step, index) => <li key={step} className="rounded border p-3 text-sm"><strong>{index + 1}.</strong> {step}</li>)}</ol>
        <h2 className="mt-7 font-semibold">Critérios para concluir</h2>
        <ul className="mt-3 grid gap-2 text-sm">{challenge.acceptance.map((item) => <li key={item} className="rounded border p-3">{item}</li>)}</ul>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild onClick={signedIn && status === "nao-iniciado" ? start : undefined}><Link href={surface}>Abrir ambiente do Lab <ExternalLink className="size-4" /></Link></Button>
          {signedIn && status === "nao-iniciado" && <Button type="button" variant="outline" onClick={start}>Marcar como iniciado</Button>}
        </div>
      </CardContent>
    </Card>

    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Entrega de evidência</CardTitle>
        <CardDescription>É a evidência que conclui o Lab. Sem resultado, reprodução e severidade registrados, o Lab continua em aberto.</CardDescription>
      </CardHeader>
      <CardContent>
        {signedIn
          ? <form className="grid gap-4" onSubmit={submit}>
              <label className="grid gap-2 text-sm font-medium">Resultado obtido<Textarea name="result" minLength={MIN} required placeholder="O que a aplicação exibiu ou fez? Inclua valores e mensagens." /></label>
              <label className="grid gap-2 text-sm font-medium">Passos de reprodução<Textarea name="reproduction" minLength={MIN} required placeholder="1. ... 2. ... 3. ..." /></label>
              <label className="grid gap-2 text-sm font-medium">Severidade<select name="severity" className="input" required defaultValue=""><option value="" disabled>Selecione</option>{severities.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
              <Button disabled={state === "saving"}>{state === "saving" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Salvar evidência</Button>
            </form>
          : <div><p className="text-sm text-muted-foreground">Entre na sua conta para registrar evidência. O histórico fica salvo no servidor e acompanha você em qualquer dispositivo.</p><div className="mt-4 flex gap-2"><Button asChild><Link href={`/login?next=/labs/${challenge.number}`}>Entrar</Link></Button><Button asChild variant="outline"><Link href="/cadastro">Criar conta</Link></Button></div></div>}
        {message && <p role="status" aria-live="polite" className="mt-4 text-sm text-primary">{message}</p>}
      </CardContent>
    </Card>

    {submissions.length > 0 && <Card className="mt-5">
      <CardHeader><CardTitle>Suas evidências</CardTitle><CardDescription>{submissions.length} entrega(s) registrada(s) neste Lab.</CardDescription></CardHeader>
      <CardContent><ul className="grid gap-3">{submissions.map((item) => <li key={item.id} className="rounded border p-3 text-sm">
        <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString("pt-BR")} · severidade {item.severity}</p>
        <p className="mt-2">{item.result}</p>
        <p className="mt-2 whitespace-pre-line text-muted-foreground">{item.reproduction}</p>
      </li>)}</ul></CardContent>
    </Card>}
  </div></main>;
}

function Brief({ label, value }: { label: string; value: string }) {
  return <div className="mt-5 rounded-md border bg-muted/40 p-3 text-sm"><strong>{label}</strong><p className="mt-1 text-muted-foreground">{value}</p></div>;
}
