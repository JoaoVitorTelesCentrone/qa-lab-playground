"use client";

// Corpo do portfólio público: projetos, evidências e sobre.
//
// A hierarquia da página é QA → projetos → evidências. As abas existem para
// que o topo continue sendo sobre a pessoa: quem chega vê perfil e projetos, e
// só desce para evidência solta se quiser.
//
// Client component por causa do filtro de severidade — que é filtro, e não um
// terço do topo da página como era antes.

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EvidenceCard } from "@/components/portfolio/evidence-card";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ProfileLinks } from "@/components/portfolio/profile-links";
import { severityLabels } from "@/lib/product/case";
import type { PortfolioEntry } from "@/lib/product/portfolio-format";
import type { PortfolioProject, PortfolioStats } from "@/lib/product/portfolio-projects";
import type { PortfolioSection } from "@/lib/product/portfolio-sections";

type Props = {
  username: string;
  name: string;
  bio: string;
  role: string;
  linkedin: string;
  github: string;
  entries: PortfolioEntry[];
  projects: PortfolioProject[];
  stats: PortfolioStats;
  skills: string[];
  /** Seções livres que o dono escreveu e deixou visíveis. */
  sections: PortfolioSection[];
};

export function PortfolioView(props: Props) {
  const { username, name, bio, role, linkedin, github, entries, projects, stats, skills, sections } = props;
  const [severity, setSeverity] = useState<string>("todas");

  const projectName = (id: string) => projects.find((project) => project.id === id)?.name ?? "";
  const filtered = severity === "todas" ? entries : entries.filter((entry) => entry.severity === severity);

  if (entries.length === 0) {
    return <div className="mt-10">
      <p className="rounded-xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
        Nenhum projeto publicado ainda.
      </p>
      <CustomSections sections={sections} className="mt-12" />
    </div>;
  }

  return <Tabs defaultValue="visao-geral" className="mt-12">
    <TabsList variant="line" className="w-full justify-start border-b border-border pb-1.5">
      <TabsTrigger value="visao-geral">Visão geral</TabsTrigger>
      <TabsTrigger value="projetos">Projetos</TabsTrigger>
      <TabsTrigger value="evidencias">Evidências</TabsTrigger>
      <TabsTrigger value="sobre">Sobre</TabsTrigger>
    </TabsList>

    <TabsContent value="visao-geral" className="pt-8">
      <SectionTitle>Projetos</SectionTitle>
      <div className="mt-4 grid gap-4">
        {projects.map((project) => <ProjectCard key={project.id} project={project} username={username} />)}
      </div>

      <SectionTitle className="mt-12">Evidências recentes</SectionTitle>
      <div className="mt-4 grid gap-3">
        {entries.slice(0, 3).map((entry) => <EvidenceCard key={entry.id} entry={entry} username={username} showProject={projectName(entry.projectId)} />)}
      </div>

      <CustomSections sections={sections} className="mt-12" />
    </TabsContent>

    <TabsContent value="projetos" className="pt-8">
      <div className="grid gap-4">
        {projects.map((project) => <ProjectCard key={project.id} project={project} username={username} />)}
      </div>
    </TabsContent>

    <TabsContent value="evidencias" className="pt-8">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs text-muted-foreground">Severidade</span>
        <Chip active={severity === "todas"} onClick={() => setSeverity("todas")}>Todas ({entries.length})</Chip>
        {stats.bySeverity.map((item) => <Chip key={item.severity} active={severity === item.severity} onClick={() => setSeverity(item.severity)}>
          {severityLabels[item.severity]} ({item.total})
        </Chip>)}
      </div>

      <div className="mt-5 grid gap-3">
        {filtered.map((entry) => <EvidenceCard key={entry.id} entry={entry} username={username} showProject={projectName(entry.projectId)} />)}
      </div>
    </TabsContent>

    <TabsContent value="sobre" className="pt-8">
      <div className="max-w-2xl">
        {role && <p className="text-sm text-muted-foreground">{role}</p>}
        <p className="mt-3 whitespace-pre-line text-base leading-7">
          {bio || `${name} publica no QA Lab as evidências que produz testando sistemas reais.`}
        </p>

        {skills.length > 0 && <>
          <SectionTitle className="mt-10">O que este portfólio comprova</SectionTitle>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skills.map((skill) => <span key={skill} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{skill}</span>)}
          </div>
        </>}

        <SectionTitle className="mt-10">Contato</SectionTitle>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
          {linkedin || github
            ? <ProfileLinks linkedin={linkedin} github={github} />
            : <span className="text-muted-foreground">Nenhum link informado.</span>}
          <Link href="/labs" className="text-muted-foreground hover:text-foreground">Praticar no QA Lab →</Link>
        </div>
      </div>
    </TabsContent>
  </Tabs>;
}

/**
 * Seções livres do dono. Ficam na visão geral, e não numa aba própria: quem
 * chega no portfólio cai aqui, e formação ou certificação é argumento de
 * primeira tela — não algo a caçar num menu.
 */
function CustomSections({ sections, className = "" }: { sections: PortfolioSection[]; className?: string }) {
  if (sections.length === 0) return null;
  return <div className={className}>
    {sections.map((section, index) => <section key={section.id} className={index === 0 ? "" : "mt-10"}>
      <SectionTitle>{section.title}</SectionTitle>
      <p className="mt-3 max-w-2xl whitespace-pre-line text-base leading-7 text-muted-foreground">{section.body}</p>
    </section>)}
  </div>;
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground ${className}`}>{children}</h2>;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`rounded-full border px-3 py-1 text-xs transition ${active ? "border-primary/60 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
  >
    {children}
  </button>;
}
