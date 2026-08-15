"use client";

// Perfil: dados da conta, portfólio de evidências e histórico de Labs.
// Usa os tokens do design system (border/card/muted/primary) como o resto do
// produto — nada de paleta paralela.

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Save, Trash2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Journey, Submission } from "@/lib/product/journey";

type Profile = { full_name?: string | null; username?: string | null; bio?: string | null; linkedin_url?: string | null; role?: string | null; plan?: string | null } | null;
const roles = ["QA Iniciante", "QA Pleno", "QA Sênior", "QA Lead", "Dev que testa", "Tech Lead", "Estudante"];

export function ProfileClient({ email, profile, journey, submissions }: { email: string; profile: Profile; journey: Journey; submissions: Submission[] }) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [linkedin, setLinkedin] = useState(profile?.linkedin_url ?? "");
  const [role, setRole] = useState(profile?.role ?? "QA Iniciante");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save(event: React.FormEvent) {
    event.preventDefault(); setState("saving");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.assign("/login"); return; }
    const { error } = await supabase.from("profiles").update({ full_name: fullName.trim().slice(0, 80), username: username.trim().toLowerCase() || null, bio: bio.trim().slice(0, 280), linkedin_url: linkedin.trim() || null, role }).eq("id", user.id);
    setState(error ? "error" : "saved");
  }

  async function deleteAccount() {
    if (!window.confirm("Excluir sua conta, projetos e progresso permanentemente? Esta ação não pode ser desfeita.")) return;
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_own_account");
    if (error) { setState("error"); return; }
    await supabase.auth.signOut(); window.location.assign("/");
  }

  return <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
    <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-primary"><ArrowLeft className="size-3.5" /> Voltar para a home</Link>

    <header className="mt-8 flex items-center gap-3">
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10"><User className="size-5 text-primary" /></span>
      <div><h1 className="text-3xl font-semibold tracking-[-0.03em]">{fullName || "Seu perfil"}</h1><p className="text-xs text-muted-foreground">{email} · plano {profile?.plan ?? "free"}</p></div>
    </header>

    <section className="mt-8" aria-labelledby="progress-title">
      <h2 id="progress-title" className="text-lg font-semibold">Progresso</h2>
      <div className="mt-4 grid divide-y divide-border border-y border-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <Stat label="Labs iniciados" value={journey.started} />
        <Stat label="Labs concluídos" value={journey.completed} />
        <Stat label="Evidências" value={journey.evidence} />
        <Stat label="Taxa de conclusão" value={`${journey.completionRate}%`} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{journey.coverage.map((item) => <div key={item.id} className="rounded-lg border border-border p-4">
        <div className="flex items-center justify-between text-sm"><Link href={item.route} className="font-medium transition hover:text-primary">{item.name}</Link><span className="font-mono text-xs text-muted-foreground">{item.executed}/{item.total}</span></div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label={`${item.percent}% dos cenários executados em ${item.name}`}><div className="h-full rounded-full bg-primary" style={{ width: `${item.percent}%` }} /></div>
      </div>)}</div>
    </section>

    <section className="mt-10" aria-labelledby="portfolio-title">
      <h2 id="portfolio-title" className="text-lg font-semibold">Portfólio de evidências</h2>
      {submissions.length === 0
        ? <p className="mt-3 text-sm text-muted-foreground">Nenhuma evidência registrada ainda. <Link href="/labs" className="text-primary">Escolha um Lab</Link> e conclua sua primeira entrega.</p>
        : <ul className="mt-4 divide-y divide-border border-y border-border">{submissions.map((item) => <li key={item.id} className="py-4">
            <div className="flex flex-wrap items-center gap-2.5"><span className="font-mono text-xs text-primary">{item.labSlug}</span><Badge variant="secondary" className="font-normal">severidade {item.severity}</Badge><span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span></div>
            <p className="mt-2 text-sm">{item.result}</p>
          </li>)}</ul>}
    </section>

    <section className="mt-10" aria-labelledby="account-title">
      <h2 id="account-title" className="text-lg font-semibold">Dados da conta</h2>
      <form onSubmit={save} className="mt-4 space-y-5 rounded-xl border border-border bg-card p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome"><input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={80} className="field w-full" /></Field>
          <Field label="Username"><input value={username} onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))} minLength={3} maxLength={30} className="field w-full" /></Field>
          <Field label="E-mail"><input value={email} disabled className="field w-full opacity-60" /></Field>
          <Field label="Perfil profissional"><select value={role} onChange={(e) => setRole(e.target.value)} className="field w-full">{roles.map((item) => <option key={item}>{item}</option>)}</select></Field>
        </div>
        <Field label={`Bio · ${bio.length}/280`}><textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={280} rows={4} className="field w-full resize-none" /></Field>
        <Field label="LinkedIn"><input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="field w-full" /></Field>
        {state === "error" && <p role="alert" className="text-xs text-destructive">Não foi possível salvar. Verifique os dados e tente novamente.</p>}
        <Button disabled={state === "saving"}>{state === "saving" ? <Loader2 className="size-4 animate-spin" /> : state === "saved" ? <Check className="size-4" /> : <Save className="size-4" />}{state === "saved" ? "Perfil salvo" : "Salvar perfil"}</Button>
      </form>
    </section>

    <section className="mt-8 rounded-xl border border-destructive/20 bg-destructive/[0.035] p-5">
      <h2 className="text-sm font-semibold">Excluir conta</h2>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">Remove permanentemente perfil, projetos, rascunhos, favoritos, evidências e progresso sincronizado.</p>
      <Button type="button" variant="outline" size="sm" onClick={deleteAccount} className="mt-4 border-destructive/30 text-destructive hover:bg-destructive/10"><Trash2 className="size-3.5" /> Excluir minha conta</Button>
    </section>
  </div>;
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return <div className="py-4 sm:px-6 sm:first:pl-0 sm:last:pr-0"><p className="text-3xl font-semibold tracking-[-0.03em]">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5"><span className="text-xs font-medium text-muted-foreground">{label}</span>{children}</label>;
}
