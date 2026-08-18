"use client";

// Dashboard pessoal do aluno: quem ele é, quanto andou, o que já publicou e os
// dados da conta. Usa os tokens do design system (border/card/muted/primary)
// como o resto do produto — nada de paleta paralela.
//
// A página é montada no servidor (app/perfil/page.tsx), então aqui não há
// carregamento inicial: os únicos estados assíncronos são os das ações
// (salvar, publicar, excluir), sinalizados no próprio botão.

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeProfileLink } from "@/lib/product/profile-links";
import { isMissingColumn } from "@/lib/product/profile-columns";
import { usePortfolio } from "./use-portfolio";
import { ProfileHero } from "./profile-hero";
import { ProfileStats } from "./profile-stats";
import { ProgressSection } from "./progress-section";
import { PublicPortfolioCard } from "./public-portfolio-card";
import { EvidenceList } from "./evidence-list";
import { AccountForm, type AccountFields, type SaveState } from "./account-form";
import { DangerZone } from "./danger-zone";
import { PortfolioSectionsEditor } from "./portfolio-sections-editor";
import type { Journey, Submission } from "@/lib/product/journey";
import type { TrackProgress } from "@/lib/product/tracks";
import type { PortfolioSectionsResult } from "@/lib/product/store";

type Profile = { full_name?: string | null; username?: string | null; bio?: string | null; linkedin_url?: string | null; github_url?: string | null; role?: string | null; plan?: string | null; portfolio_public?: boolean | null; portfolio_headline?: string | null } | null;

export function ProfileClient({ email, profile, journey, tracks, submissions, sections }: { email: string; profile: Profile; journey: Journey; tracks: TrackProgress[]; submissions: Submission[]; sections: PortfolioSectionsResult }) {
  // O username é editado em dois lugares (dados da conta e endereço do
  // portfólio); um estado só evita que um card mostre o valor antigo do outro.
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

  const portfolio = usePortfolio({
    submissions,
    username: fields.username,
    onUsername: (value) => change("username", value),
    portfolioPublic: Boolean(profile?.portfolio_public),
    portfolioHeadline: profile?.portfolio_headline ?? "",
  });

  async function save(event: React.FormEvent) {
    event.preventDefault(); setState("saving");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.assign("/login"); return; }
    // Guardamos a URL já canônica: o topo do portfólio mostra os dois links
    // rotulados, e link torto ali é pior que link nenhum.
    const linkedinUrl = normalizeProfileLink(fields.linkedin, "linkedin");
    const githubUrl = normalizeProfileLink(fields.github, "github");
    if ((fields.linkedin.trim() && !linkedinUrl) || (fields.github.trim() && !githubUrl)) { setState("invalid-link"); return; }
    setFields((current) => ({ ...current, linkedin: linkedinUrl, github: githubUrl }));

    const values = { full_name: fields.fullName.trim().slice(0, 80), username: fields.username.trim().toLowerCase() || null, bio: fields.bio.trim().slice(0, 280), linkedin_url: linkedinUrl || null, role: fields.role };
    const { error } = await supabase.from("profiles").update({ ...values, github_url: githubUrl || null }).eq("id", user.id);

    // Enquanto a migração 0010 não sobe, `github_url` não existe: o resto do
    // perfil ainda salva, e o aviso diz por que o GitHub não foi junto.
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
    await supabase.auth.signOut(); window.location.assign("/");
    return null;
  }

  return (
    <div className="mx-auto grid max-w-[1200px] gap-4 px-5 py-8 sm:px-8 sm:gap-5 lg:py-10">
      <ProfileHero
        name={fields.fullName}
        email={email}
        plan={profile?.plan ?? "free"}
        role={fields.role}
        bio={fields.bio}
        username={fields.username}
        isPublic={portfolio.isPublic}
      />

      <ProfileStats journey={journey} />

      <div className="grid items-start gap-4 sm:gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <ProgressSection tracks={tracks} coverage={journey.coverage} />
        <PublicPortfolioCard
          portfolio={portfolio}
          username={fields.username}
          onUsername={(value) => change("username", value)}
          name={fields.fullName || fields.username || "QA Lab"}
        />
      </div>

      <PortfolioSectionsEditor sections={sections.sections} available={sections.available} />

      <EvidenceList portfolio={portfolio} />

      <AccountForm email={email} fields={fields} onChange={change} state={state} onSubmit={save} />

      <DangerZone onDelete={deleteAccount} />
    </div>
  );
}
