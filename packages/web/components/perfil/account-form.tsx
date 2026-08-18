"use client";

// Dados da conta. A gravação é a mesma de antes: update direto na tabela
// `profiles`, com o retry sem `github_url` enquanto a migração 0010 não sobe.

import { Check, Loader2, Save, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField, toOptions } from "@/components/ui/select-field";

export const roles = ["QA Iniciante", "QA Pleno", "QA Sênior", "QA Lead", "Dev que testa", "Tech Lead", "Estudante"];

export type SaveState = "idle" | "saving" | "saved" | "saved-sem-github" | "error" | "invalid-link";

export type AccountFields = {
  fullName: string;
  username: string;
  bio: string;
  linkedin: string;
  github: string;
  role: string;
};

export function AccountForm({ email, fields, onChange, state, onSubmit }: {
  email: string;
  fields: AccountFields;
  onChange: <K extends keyof AccountFields>(key: K, value: AccountFields[K]) => void;
  state: SaveState;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const saving = state === "saving";
  const done = state.startsWith("saved");

  return (
    <section id="dados-da-conta" className="scroll-mt-24 rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="conta-title">
      <div className="flex items-center gap-2.5">
        <UserCog className="size-4 text-primary" aria-hidden="true" />
        <h2 id="conta-title" className="text-base font-semibold">Dados da conta</h2>
      </div>

      <form onSubmit={onSubmit} className="mt-5 grid gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Nome" htmlFor="conta-nome">
            <input id="conta-nome" value={fields.fullName} onChange={(e) => onChange("fullName", e.target.value)} maxLength={80} className="field w-full" />
          </Field>
          <Field label="Username" htmlFor="conta-username">
            <input id="conta-username" value={fields.username} onChange={(e) => onChange("username", e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))} minLength={3} maxLength={30} className="field w-full" />
          </Field>
          <Field label="E-mail · não editável" htmlFor="conta-email">
            <input id="conta-email" value={email} disabled readOnly className="field w-full cursor-not-allowed bg-muted/40 text-muted-foreground" />
          </Field>
          <Field label="Perfil profissional" htmlFor="conta-role">
            <SelectField id="conta-role" value={fields.role} onChange={(value) => onChange("role", value)} options={toOptions(roles)} groupLabel="Perfil profissional" aria-label="Perfil profissional" />
          </Field>
        </div>

        <Field label="Bio" htmlFor="conta-bio" hint={`${fields.bio.length}/280`}>
          <textarea id="conta-bio" value={fields.bio} onChange={(e) => onChange("bio", e.target.value)} maxLength={280} rows={4} className="field w-full resize-none" />
        </Field>

        {/* LinkedIn e GitHub aparecem lado a lado no topo do portfólio público. */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="LinkedIn" htmlFor="conta-linkedin">
            <input id="conta-linkedin" value={fields.linkedin} onChange={(e) => onChange("linkedin", e.target.value)} placeholder="linkedin.com/in/seu-perfil" className="field w-full" />
          </Field>
          <Field label="GitHub" htmlFor="conta-github">
            <input id="conta-github" value={fields.github} onChange={(e) => onChange("github", e.target.value)} placeholder="github.com/seu-usuario" className="field w-full" />
          </Field>
        </div>

        {state === "invalid-link" && <p role="alert" className="text-xs text-destructive">Confira os links: o do LinkedIn precisa apontar para linkedin.com e o do GitHub para github.com.</p>}
        {state === "saved-sem-github" && <p role="status" className="text-xs text-muted-foreground">Perfil salvo. O link do GitHub ainda não pôde ser guardado: falta aplicar a migração <code>0010_profile_links</code> no Supabase.</p>}
        {state === "error" && <p role="alert" className="text-xs text-destructive">Não foi possível salvar. Verifique os dados e tente novamente.</p>}

        <div className="flex items-center gap-3 border-t border-border pt-4">
          <Button disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : done ? <Check className="size-4" /> : <Save className="size-4" />}
            {saving ? "Salvando..." : done ? "Perfil salvo" : "Salvar perfil"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{label}</span>
        {hint && <span className="tabular-nums">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
