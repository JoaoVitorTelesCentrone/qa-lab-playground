// Card de projeto: o nível do meio do portfólio.
//
// Ele responde "em que sistema essa pessoa trabalhou e quanto trabalho tem
// aqui" antes de mostrar qualquer evidência.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PortfolioProject } from "@/lib/product/portfolio-projects";

const sourceLabels = { "qa-lab": "QA Lab", pessoal: "Projeto pessoal", profissional: "Experiência profissional" } as const;

export function ProjectCard({ project, username }: { project: PortfolioProject; username: string }) {
  return <Link
    href={`/portfolio/${username}/projeto/${project.id}`}
    className="group block rounded-xl border border-border/70 bg-card/40 p-6 transition hover:border-primary/60 hover:bg-card/70"
  >
    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{sourceLabels[project.source]}</p>

    <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] group-hover:text-primary">{project.name}</h3>
    {project.summary && <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">{project.summary}</p>}

    {project.tags.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">
      {project.tags.map((tag) => <span key={tag} className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">{tag}</span>)}
    </div>}

    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4 text-xs text-muted-foreground">
      <span className="flex flex-wrap gap-4">
        <span><strong className="font-semibold text-foreground">{project.stats.labs}</strong> Labs</span>
        <span><strong className="font-semibold text-foreground">{project.stats.evidences}</strong> evidências</span>
        <span><strong className="font-semibold text-foreground">{project.stats.bugs}</strong> bugs</span>
      </span>
      <span className="inline-flex items-center gap-1 text-primary">Ver projeto <ArrowRight className="size-3 transition group-hover:translate-x-0.5" aria-hidden="true" /></span>
    </div>
  </Link>;
}
