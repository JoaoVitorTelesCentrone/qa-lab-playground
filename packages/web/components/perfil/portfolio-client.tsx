"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { normalizeProfileLink } from "@/lib/product/profile-links";
import { isMissingColumn } from "@/lib/product/profile-columns";
import { PortfolioAppearanceEditor } from "./portfolio-appearance-editor";
import { usePortfolio } from "./use-portfolio";
import { PublicPortfolioCard } from "./public-portfolio-card";
import { EvidenceList } from "./evidence-list";
import { PortfolioSectionsEditor } from "./portfolio-sections-editor";
import { PortfolioProjectsEditor } from "./portfolio-projects-editor";
import { PortfolioFeaturedEditor } from "./portfolio-featured-editor";
import { AccountForm, type AccountFields, type SaveState } from "./account-form";
import { DangerZone } from "./danger-zone";
import type { Submission } from "@/lib/product/journey";
import type { PortfolioSectionsResult } from "@/lib/product/store";
import type { PortfolioProjectDraft } from "@/lib/product/portfolio-projects";

type PortfolioProfile = {
  portfolio_appearance?: unknown;
  full_name?: string | null;
  username?: string | null;
  bio?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  role?: string | null;
  portfolio_public?: boolean | null;
  portfolio_headline?: string | null;
  portfolio_featured_submission_ids?: string[] | null;
} | null;

function Disclosure({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <details className="group border-y border-border py-1">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <span>
          <span className="block text-sm font-semibold">{title}</span>
          <span className="mt-1 block text-sm leading-6 text-muted-foreground">{description}</span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="grid gap-5 pb-5 pt-1">{children}</div>
    </details>
  );
}

export function PortfolioClient({ email, profile, submissions, sections, projects }: {
  email: string;
  profile: PortfolioProfile;
  submissions: Submission[];
  sections: PortfolioSectionsResult;
  projects: PortfolioProjectDraft[];
}) {
  const [fields, setFields] = useState<AccountFields>({
    fullName: profile?.full_name ?? "",
    username: profile?.username ?? "",
    bio: profile?.bio ?? "",
    linkedin: profile?.linkedin_url ?? "",
    github: profile?.github_url ?? "",
    role: profile?.role ?? "QA Iniciante",
  });
  const [saveState, setSaveState] = useState<SaveState>("idle");

  function change<K extends keyof AccountFields>(key: K, value: AccountFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  const portfolio = usePortfolio({
    submissions,
    username: fields.username,
    onUsername: (username) => change("username", username),
    portfolioPublic: Boolean(profile?.portfolio_public),
    portfolioHeadline: profile?.portfolio_headline ?? "",
  });
  const published = portfolio.items.filter((item) => item.published).length;

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setSaveState("saving");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.assign("/login"); return; }

    const linkedinUrl = normalizeProfileLink(fields.linkedin, "linkedin");
    const githubUrl = normalizeProfileLink(fields.github, "github");
    if ((fields.linkedin.trim() && !linkedinUrl) || (fields.github.trim() && !githubUrl)) { setSaveState("invalid-link"); return; }
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
      setSaveState(retry.error ? "error" : "saved-sem-github");
      return;
    }
    setSaveState(error ? "error" : "saved");
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
    <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 lg:py-10">
      <Link href="/perfil" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <ArrowLeft className="size-4" aria-hidden="true" /> Voltar ao perfil
      </Link>

      <header className="mt-6 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">Meu portfólio</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Publique seus melhores trabalhos e escolha como sua página será apresentada.</p>
      </header>

      <div className="mt-7 grid gap-5">
        <PublicPortfolioCard
          portfolio={portfolio}
          username={fields.username}
          onUsername={(username) => change("username", username)}
          name={fields.fullName || fields.username || "QA Lab"}
        />
        <Disclosure title="Evidências" description={`${portfolio.items.length} ${portfolio.items.length === 1 ? "registrada" : "registradas"} · ${published} ${published === 1 ? "publicada" : "publicadas"}`}>
          <EvidenceList portfolio={portfolio} embedded />
        </Disclosure>
        <Disclosure title="Aparência" description="Escolha o layout e as cores do seu portfólio.">
          <PortfolioAppearanceEditor initialAppearance={profile?.portfolio_appearance} />
        </Disclosure>
        <Disclosure title="Seções públicas" description={`${sections.sections.length} ${sections.sections.length === 1 ? "criada" : "criadas"} · personalize o conteúdo da página.`}>
          <PortfolioSectionsEditor sections={sections.sections} available={sections.available} />
        </Disclosure>
        <Disclosure title="Projetos" description={`${projects.length} ${projects.length === 1 ? "projeto" : "projetos"} · reúna trabalhos e cases de QA.`}>
          <PortfolioProjectsEditor projects={projects} submissions={submissions} username={fields.username} portfolioPublic={portfolio.isPublic} />
        </Disclosure>
        <Disclosure title="Trabalhos em destaque" description="Escolha até três cases para aparecer primeiro.">
          <PortfolioFeaturedEditor submissions={submissions} initialSelection={profile?.portfolio_featured_submission_ids ?? []} />
        </Disclosure>
        <Disclosure title="Dados do perfil" description="Nome, bio e links exibidos no seu portfólio.">
          <AccountForm email={email} fields={fields} onChange={change} state={saveState} onSubmit={saveProfile} />
        </Disclosure>
        <Disclosure title="Excluir conta" description="Remova permanentemente sua conta e todos os dados associados.">
          <DangerZone onDelete={deleteAccount} />
        </Disclosure>
      </div>
    </main>
  );
}
