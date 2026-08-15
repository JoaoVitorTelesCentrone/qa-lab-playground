"use client";

// Catálogo de Labs: busca, filtros e nível.
// A home mostra a jornada e os ambientes; o catálogo é onde o aluno escolhe.

import Link from "next/link";
import { useState } from "react";
import { Check, Clipboard, Play, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { labs, tracks, type LabDifficulty, type LabStatus, type LabTrack } from "@/lib/playground/catalog";
import type { LabProgress } from "@/lib/product/journey";
import { learningTracks } from "@/lib/product/tracks";

const difficulties: Array<LabDifficulty | "todas"> = ["todas", "iniciante", "intermediario", "avancado"];
const statuses: Array<LabStatus | "todos"> = ["todos", "liberado", "agendado"];

export function LabCatalog({ progress = [] }: { progress?: Array<Pick<LabProgress, "status"> & { slug: string }> }) {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<LabTrack | "todas">("todas");
  const [difficulty, setDifficulty] = useState<LabDifficulty | "todas">("todas");
  const [status, setStatus] = useState<LabStatus | "todos">("todos");

  const byLab = new Map(progress.map((item) => [item.slug, item.status]));
  const term = query.trim().toLowerCase();
  const filtered = labs.filter((lab) => (!term || [lab.title, lab.objective, lab.track, ...lab.tags].join(" ").toLowerCase().includes(term)) && (track === "todas" || lab.track === track) && (difficulty === "todas" || lab.difficulty === difficulty) && (status === "todos" || lab.status === status));
  const copy = async (text: string) => navigator.clipboard?.writeText(text);

  return <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
    <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="qa-eyebrow">Catálogo</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Labs e desafios</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Cada Lab parte de um risco real dentro de um dos ambientes de prática. Escolha pelo que você quer treinar e saia com evidência registrada.</p></div><p className="text-sm text-muted-foreground">{filtered.length} de {labs.length} desafios</p></header>

    <section className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Trilhas">{learningTracks.map((track) => <article key={track.slug} className="rounded-xl border border-border p-4">
      <p className="qa-eyebrow">Trilha</p>
      <h2 className="mt-2 font-semibold">{track.name}</h2>
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{track.objective}</p>
      <Link href={`/labs/trilhas/${track.slug}`} className="mt-3 inline-block text-sm font-medium text-primary">Ver os {track.labNumbers.length} Labs em sequência →</Link>
    </article>)}</section>

    <div className="mt-8 grid gap-3 border-y border-border py-4 lg:grid-cols-[1fr_190px_170px_150px]">
      <label className="relative"><span className="sr-only">Buscar desafio</span><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por título, objetivo ou tag" className="pl-10" /></label>
      <Select label="Trilha" value={track} setValue={setTrack} values={["todas", ...tracks]} />
      <Select label="Nível" value={difficulty} setValue={setDifficulty} values={difficulties} />
      <Select label="Status" value={status} setValue={setStatus} values={statuses} />
    </div>

    {filtered.length === 0
      ? <p className="border-b border-border py-14 text-center text-sm text-muted-foreground">Nenhum desafio corresponde a esses filtros. Limpe a busca ou troque a trilha.</p>
      : <div className="mt-2 divide-y divide-border border-b border-border">{filtered.map((lab) => {
          const labStatus = byLab.get(lab.slug);
          return <article key={lab.number} className="grid gap-4 py-5 md:grid-cols-[52px_1fr_auto] md:items-center">
            <span className="font-mono text-sm text-muted-foreground">{String(lab.number).padStart(2, "0")}</span>
            <div>
              <div className="flex flex-wrap items-center gap-3"><h2 className="font-semibold">{lab.title}</h2>{lab.status === "agendado" && <Badge variant="secondary">em breve</Badge>}{labStatus === "completed" && <Badge variant="secondary" className="gap-1"><Check className="size-3" /> concluído</Badge>}{labStatus === "started" && <Badge variant="secondary">em andamento</Badge>}</div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{lab.objective}</p>
              <p className="mt-2 text-xs text-muted-foreground">{lab.track} · {lab.difficulty} · {lab.minutes} min</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm"><Link href={`/labs/${lab.number}`}>Instruções <Play className="size-3" /></Link></Button>
              <Button variant="ghost" size="icon-sm" onClick={() => copy(lab.postPrompt)} aria-label={`Copiar post do lab ${lab.number}`}><Clipboard className="size-4" /></Button>
            </div>
          </article>;
        })}</div>}
  </div>;
}

function Select<T extends string>({ label, value, setValue, values }: { label: string; value: T; setValue: (value: T) => void; values: T[] }) {
  return <label><span className="sr-only">{label}</span><select value={value} onChange={(event) => setValue(event.target.value as T)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary" aria-label={label}>{values.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>;
}
