"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { normalizeProfileLink } from "@/lib/product/profile-links";
import { isMissingColumn } from "@/lib/product/profile-columns";
import { ProfileHero } from "./profile-hero";
import { AccountForm, type AccountFields, type SaveState } from "./account-form";
import { DangerZone } from "./danger-zone";

type Profile = {
  full_name?: string | null;
  username?: string | null;
  bio?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  role?: string | null;
  plan?: string | null;
  portfolio_public?: boolean | null;
} | null;

function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border-t border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-4 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {title}
        <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

export function ProfileClient({ email, profile }: { email: string; profile: Profile }) {
  const [fields, setFields] = useState<AccountFields>({
    fullName: profile?.full_name ?? "",
    username: profile?.username ?? "",
    bio: profile?.bio ?? "",
    linkedin: profile?.linkedin_url ?? "",
    github: profile?.github_url ?? "",
    role: profile?.role ?? "QA Iniciante",
  });
  const [state, setState] = useState<SaveState>("idle");

  function change<K extends keyof AccountFields>(key: K, value: AccountFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.assign("/login"); return; }

    const linkedinUrl = normalizeProfileLink(fields.linkedin, "linkedin");
    const githubUrl = normalizeProfileLink(fields.github, "github");
    if ((fields.linkedin.trim() && !linkedinUrl) || (fields.github.trim() && !githubUrl)) { setState("invalid-link"); return; }
    setFields((current) => ({ ...current, linkedin: linkedinUrl, github: githubUrl }));

    const values = {
      full_name: fields.fullName.trim().slice(0, 80),
      username: fields.username.trim().toLowerCase() || null,
      bio: fields.bio.trim().slice(0, 280),
      linkedin_url: linkedinUrl || null,
      role: fields.role,
    };
    const { error } = await supabase.from("profiles").update({ ...values, github_url: githubUrl || null }).eq("id", user.id);

    if (error && isMissingColumn(error, "github_url")) {
      const retry = await supabase.from("profiles").update(values).eq("id", user.id);
      setState(retry.error ? "error" : "saved-sem-github");
      return;
    }
    setState(error ? "error" : "saved");
  }

  async function deleteAccount() {
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_own_account");
    if (error) return "Não foi possível excluir a conta. Tente novamente em instantes.";
    await supabase.auth.signOut();
    window.location.assign("/");
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 lg:py-10">
      <ProfileHero
        name={fields.fullName}
        email={email}
        plan={profile?.plan ?? "free"}
        role={fields.role}
        bio={fields.bio}
        username={fields.username}
      />

      <Link
        href="/perfil/portfolio"
        className="group mt-7 flex items-center justify-between gap-5 border-y border-border py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span>
          <span className="block text-base font-semibold transition-colors group-hover:text-primary">Meu portfólio</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            {profile?.portfolio_public ? "Página pública ativa" : "Publique seus cases e projetos em uma página separada"}
          </span>
        </span>
        <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>

      <div className="mt-8">
        <AccountForm email={email} fields={fields} onChange={change} state={state} onSubmit={save} />
      </div>

      <div className="mt-8">
        <Disclosure title="Excluir conta">
          <DangerZone onDelete={deleteAccount} />
        </Disclosure>
      </div>
    </main>
  );
}
