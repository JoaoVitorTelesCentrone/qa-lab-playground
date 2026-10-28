"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Search } from "lucide-react";
import { LabDetailsPopover } from "./lab-details-popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { OnboardingLink } from "@/components/onboarding/floating-onboarding";
import { SelectField, toOptions } from "@/components/ui/select-field";
import { labs as allLabs, labLabel, type Lab, type LabDifficulty } from "@/lib/playground/catalog";
import { systemChallenges } from "@/lib/system-challenges";
import type { LabProgress } from "@/lib/product/journey";

const labs = allLabs.filter((lab) => lab.status === "liberado");
const difficulties: Array<LabDifficulty | "todas"> = ["todas", "iniciante", "intermediario", "avancado"];

export function LabCatalog({ progress = [] }: { progress?: Array<Pick<LabProgress, "status"> & { slug: string }> }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<LabDifficulty | "todas">("todas");
  const byLab = new Map(progress.map((item) => [item.slug, item.status]));
  const term = query.trim().toLowerCase();
  const filtered = useMemo(() => labs.filter((lab) =>
    (!term || [lab.title, lab.objective, lab.track, ...lab.tags].join(" ").toLowerCase().includes(term)) &&
    (difficulty === "todas" || lab.difficulty === difficulty)
  ), [term, difficulty]);
  const completed = labs.filter((lab) => byLab.get(lab.slug) === "completed").length;
  const featured = filtered.find((lab) => byLab.get(lab.slug) === "started") ?? filtered.find((lab) => byLab.get(lab.slug) !== "completed") ?? filtered[0];
  const remaining = filtered.filter((lab) => lab.slug !== featured?.slug);

  return <main className="qa-system"><div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 lg:pt-14">
    <header data-onboarding="lab-catalog" className="border-b border-border pb-4 sm:pb-5">
      <div className="flex flex-wrap items-end justify-between gap-x-5 gap-y-3">
        <div className="max-w-2xl">
          <h1 className="qa-page-title">Escolha um Lab</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Investigue uma missão e registre o que encontrou.</p>
        </div>
        <p className="text-xs text-muted-foreground"><strong className="text-foreground">{completed} de {labs.length}</strong> concluídos</p>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
        <OnboardingLink className="inline-flex min-h-10 items-center gap-1 text-xs font-medium text-primary underline underline-offset-4 hover:text-foreground">Primeiros passos <ArrowRight className="size-3.5" aria-hidden="true" /></OnboardingLink>
      </div>
    </header>

    {labs.length > 6 && <div className="mt-8 flex flex-wrap gap-3">
      <label className="relative min-w-[220px] flex-1">
        <span className="sr-only">Buscar Lab</span>
        <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden="true" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por tema ou habilidade" className="pl-10" />
      </label>
      <SelectField value={difficulty} onChange={(next) => setDifficulty(next as LabDifficulty | "todas")} options={toOptions(difficulties)} groupLabel="Nível" aria-label="Filtrar por nível" />
    </div>}

    {filtered.length === 0 ? <p className="mt-12 border-y border-border py-10 text-sm text-muted-foreground">Nenhum Lab encontrado. Altere a busca ou o nível.</p> : <>
      <div className="mt-5 flex items-center justify-between gap-4 sm:mt-8">
        <h2 className="text-lg font-semibold">{byLab.get(featured.slug) === "started" ? "Continue de onde parou" : completed === labs.length ? "Revisite uma missão" : "Comece por aqui"}</h2>
        <span className="text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? "missão disponível" : "missões disponíveis"}</span>
      </div>
      <FeaturedLab lab={featured} status={byLab.get(featured.slug)} />
      <nav aria-label="Mais formas de aprender" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-b border-border pb-5 text-xs text-muted-foreground">
        <Link href="/labs/desafios" className="inline-flex min-h-9 items-center gap-1 underline underline-offset-4 hover:text-primary">Explorar 30 desafios <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
        <Link href="/lab" className="inline-flex min-h-9 items-center gap-1 underline underline-offset-4 hover:text-primary">Entenda a proposta do QA Lab <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
      </nav>
      {remaining.length > 0 && <section className="mt-12" aria-labelledby="other-labs-heading">
        <h2 id="other-labs-heading" className="mb-4 text-lg font-semibold">Outras missões</h2>
        <div className="divide-y divide-border border-y border-border">
          {remaining.map((lab) => <LabRow key={lab.slug} lab={lab} status={byLab.get(lab.slug)} />)}
        </div>
      </section>}
    </>}
  </div></main>;
}

function Status({ status }: { status?: LabProgress["status"] }) {
  if (status === "completed") return <Badge variant="secondary" className="gap-1"><CheckCircle2 className="size-3.5" aria-hidden="true" /> Concluído</Badge>;
  if (status === "started") return <Badge variant="secondary">Em andamento</Badge>;
  return null;
}

function LabMeta({ lab }: { lab: Lab }) {
  return <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
    <span className="capitalize">{lab.difficulty}</span>
    <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" aria-hidden="true" /> {lab.minutes} min</span>
    <span>{lab.acceptanceCriteria.length} critérios de entrega</span>
  </span>;
}

function FeaturedLab({ lab, status }: { lab: Lab; status?: LabProgress["status"] }) {
  return <article data-onboarding={`lab-${lab.number}`} className="mt-4 grid overflow-hidden rounded-xl bg-card md:grid-cols-[minmax(0,1fr)_minmax(220px,34%)]">
    <div className="flex flex-col p-6 sm:p-8 lg:p-10">
      <div className="flex flex-wrap items-center gap-3"><span className="font-mono text-sm text-primary">LAB {labLabel(lab)}</span><Status status={status} /></div>
      <h3 className="mt-5 max-w-xl text-2xl font-semibold leading-tight tracking-[-0.025em] sm:text-3xl">{lab.title}</h3>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{lab.objective}</p>
      <div className="mt-6"><LabMeta lab={lab} /></div>
      <Link href={"/labs/" + lab.number} className="mt-8 inline-flex min-h-11 items-center gap-2 self-start rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        {status === "started" ? "Continuar Lab" : status === "completed" ? "Revisitar Lab" : "Abrir missão"} <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
    <div className="hidden flex-col justify-between border-t border-border bg-[#1B2520] p-6 sm:p-8 md:flex md:border-l md:border-t-0">
      <p className="text-sm font-medium text-primary">O que você vai entregar</p>
      <p className="mt-3 text-lg leading-7 text-foreground">{lab.delivery}</p>
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5 text-sm text-muted-foreground"><span>{lab.requiredFeature}</span><LabDetailsPopover lab={lab} testData={systemChallenges.find((item) => item.id === lab.slug)?.testData} /></div>
    </div>
    <details className="border-t border-border bg-[#1B2520] px-6 py-3 md:hidden">
      <summary className="min-h-11 cursor-pointer content-center text-sm font-medium text-primary">O que você vai entregar</summary>
      <p className="pb-2 text-sm leading-6 text-foreground">{lab.delivery}</p>
      <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-muted-foreground"><span>{lab.requiredFeature}</span><LabDetailsPopover lab={lab} testData={systemChallenges.find((item) => item.id === lab.slug)?.testData} /></div>
    </details>
  </article>;
}

function LabRow({ lab, status }: { lab: Lab; status?: LabProgress["status"] }) {
  return <article data-onboarding={`lab-${lab.number}`} className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-8">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-3"><span className="font-mono text-xs text-primary">LAB {labLabel(lab)}</span><Status status={status} /></div>
      <h3 className="mt-2 text-lg font-semibold leading-snug">{lab.title}</h3>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{lab.objective}</p>
      <div className="mt-3"><LabMeta lab={lab} /></div>
    </div>
    <div className="flex items-center gap-2 sm:justify-end"><LabDetailsPopover lab={lab} testData={systemChallenges.find((item) => item.id === lab.slug)?.testData} /><Link href={"/labs/" + lab.number} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium transition hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Abrir Lab <ArrowRight className="size-4" aria-hidden="true" /></Link></div>
  </article>;
}
