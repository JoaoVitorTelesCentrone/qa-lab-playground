"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { PortfolioAppearanceEditor } from "./portfolio-appearance-editor";
import { usePortfolio } from "./use-portfolio";
import { PublicPortfolioCard } from "./public-portfolio-card";
import { EvidenceList } from "./evidence-list";
import { PortfolioSectionsEditor } from "./portfolio-sections-editor";
import { PortfolioProjectsEditor } from "./portfolio-projects-editor";
import { PortfolioFeaturedEditor } from "./portfolio-featured-editor";
import type { Submission } from "@/lib/product/journey";
import type { PortfolioSectionsResult } from "@/lib/product/store";
import type { PortfolioProjectDraft } from "@/lib/product/portfolio-projects";

type PortfolioProfile = {
  portfolio_appearance?: unknown;
  full_name?: string | null;
  username?: string | null;
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

export function PortfolioClient({ profile, submissions, sections, projects }: {
  profile: PortfolioProfile;
  submissions: Submission[];
  sections: PortfolioSectionsResult;
  projects: PortfolioProjectDraft[];
}) {
  const [username, setUsername] = useState(profile?.username ?? "");
  const portfolio = usePortfolio({
    submissions,
    username,
    onUsername: setUsername,
    portfolioPublic: Boolean(profile?.portfolio_public),
    portfolioHeadline: profile?.portfolio_headline ?? "",
  });
  const published = portfolio.items.filter((item) => item.published).length;

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
          username={username}
          onUsername={setUsername}
          name={profile?.full_name || username || "QA Lab"}
        />
        <Disclosure
          title="Evidências para publicar"
          description={`${portfolio.items.length} registrada${portfolio.items.length === 1 ? "" : "s"} · ${published} publicada${published === 1 ? "" : "s"}`}
        >
          <EvidenceList portfolio={portfolio} embedded />
        </Disclosure>
        <Disclosure title="Aparência e projetos" description="Personalize a página quando quiser ir além do básico.">
          <PortfolioAppearanceEditor initialAppearance={profile?.portfolio_appearance} />
          <PortfolioSectionsEditor sections={sections.sections} available={sections.available} />
          <PortfolioProjectsEditor projects={projects} submissions={submissions} username={username} portfolioPublic={portfolio.isPublic} />
          <PortfolioFeaturedEditor submissions={submissions} initialSelection={profile?.portfolio_featured_submission_ids ?? []} />
        </Disclosure>
      </div>
    </main>
  );
}
