"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Bug, Check, Search, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { releasedLabsInOrder as labs, labLabel, type Lab } from "@/lib/playground/catalog";
import { qaToolLabSpecs } from "@/lib/qa-tool-labs";
import { qaTools } from "@/lib/qa-tools";
import type { LabProgress } from "@/lib/product/journey";
import { LAB_TRACKS, labTrackOf, PLAYGROUND_LABS, type LabTrackId } from "@/lib/authority/lab-tracks";
import "@/app/conteudo/content-atlas.css";

const PAGE_SIZE = 10;

const trackLabel = (lab: Lab) => LAB_TRACKS.find((track) => track.id === labTrackOf(lab))?.label ?? "Other";
const countByTrack = new Map(LAB_TRACKS.map((track) => [track.id, labs.filter((lab) => labTrackOf(lab) === track.id).length]));

// Busca sem acento e sem diferenciar maiúsculas: "automação" encontra "automacao".
const plain = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Uma linha por Lab, número grande, título, resumo e contagens à direita. O
// filtro de trilha (?trilha=) e a página (?pagina=) vivem na URL.
export function LabCatalog({ progress = [], initialPage, initialTrack }: { progress?: Array<Pick<LabProgress, "status"> & { slug: string }>; initialPage?: string; initialTrack?: LabTrackId }) {
  const [query, setQuery] = useState("");
  const [track, setTrackState] = useState<LabTrackId | "all">(initialTrack ?? "all");
  // A página vive na URL (?pagina=3): voltar de um Lab devolve a mesma página.
  // Vem do servidor (searchParams da página) em vez de useSearchParams: sem
  // Supabase configurado a rota seria pré-renderizada e o Next exigiria um
  // <Suspense>, que deixaria a lista vazia no HTML inicial.
  const requested = Number(initialPage);
  const [chosen, setChosen] = useState<number | null>(null);
  const page = chosen ?? (Number.isInteger(requested) && requested > 0 ? requested : 1);
  const listTop = useRef<HTMLElement>(null);
  const byLab = new Map(progress.map((item) => [item.slug, item.status]));
  const term = plain(query.trim());
  const filtered = useMemo(() => labs.filter((lab) =>
    (track === "all" || labTrackOf(lab) === track)
    && (!term || plain([lab.title, lab.objective, lab.requiredFeature, lab.difficulty, labLabel(lab)].join(" ")).includes(term))
  ), [term, track]);
  const playground = PLAYGROUND_LABS.filter((lab) => track === "all" || lab.track === track);
  const completed = labs.filter((lab) => byLab.get(lab.slug) === "completed").length;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function setTrack(next: LabTrackId | "all") {
    setTrackState(next);
    setChosen(1);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("trilha"); else url.searchParams.set("trilha", next);
    url.searchParams.delete("pagina");
    window.history.replaceState(null, "", url);
  }

  function goTo(next: number, { scroll = true } = {}) {
    const target = Math.min(Math.max(1, next), pageCount);
    setChosen(target);
    const url = new URL(window.location.href);
    if (target === 1) url.searchParams.delete("pagina"); else url.searchParams.set("pagina", String(target));
    window.history.replaceState(null, "", url);
    if (scroll) listTop.current?.scrollIntoView({ block: "start" });
  }

  return <div className="content-atlas ca-catalog"><main lang="en" className="ca-shell">
    <header data-onboarding="lab-catalog" className="ca-map-head">
      <div>
        <h1>Labs</h1>
        <p>{progress.length > 0 ? `${completed} of ${labs.length} completed. ` : ""}Pick a track, hunt the bug and write the report.</p>
        <Link href="/lab/ferramentas" className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-md border border-mint/25 px-3 text-xs font-bold text-mint hover:bg-mint/10"><Wrench aria-hidden="true" className="size-3.5" />Open {qaTools.length} tools · {qaToolLabSpecs.length} labs</Link>
      </div>
      <label className="relative w-full sm:w-72">
        <span className="sr-only">Search labs</span>
        <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden="true" />
        <Input value={query} onChange={(event) => { setQuery(event.target.value); goTo(1, { scroll: false }); }} placeholder="Search by topic, area or number" className="pl-10" />
      </label>
    </header>

    <nav aria-label="Tracks" className="flex flex-wrap gap-2 pb-6">
      {[{ id: "all" as const, label: "All", count: labs.length }, ...LAB_TRACKS.map((item) => ({ id: item.id, label: item.label, count: countByTrack.get(item.id) ?? 0 }))].map((item) =>
        <button key={item.id} type="button" onClick={() => setTrack(item.id)} aria-pressed={track === item.id} data-track={item.id}
          className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${track === item.id ? "border-brand-accent bg-brand-accent/15 text-brand-accent" : "border-border text-muted-foreground hover:text-foreground"}`}>
          {item.label}<span className="text-xs font-normal opacity-80">{item.count}</span>
        </button>)}
    </nav>
    {track !== "all" && <p className="-mt-3 pb-6 text-sm" style={{ color: "var(--ca-muted)" }}>{LAB_TRACKS.find((item) => item.id === track)?.description}</p>}

    {playground.length > 0 && current === 1 && !term && <section aria-labelledby="bug-mode-labs" className="pb-8">
      <h2 id="bug-mode-labs" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent"><Bug aria-hidden="true" className="size-4" />Bug-mode labs</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">{playground.map((lab) => <li key={lab.href} className="rounded-lg border border-border p-4">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{LAB_TRACKS.find((item) => item.id === lab.track)?.label}</span>
        <Link href={lab.href} data-event="start_lab" className="mt-1 block font-semibold hover:text-brand-accent">{lab.title}</Link>
        <p className="mt-1 text-sm" style={{ color: "var(--ca-muted)" }}>{lab.summary}</p>
        {lab.hasBugMode && <Link href={`${lab.href}?bug=1`} data-event="start_lab" className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-brand-accent"><Bug aria-hidden="true" className="size-3.5" />Open in bug mode</Link>}
      </li>)}</ul>
    </section>}

    <section ref={listTop} aria-labelledby="labs-title" className="scroll-mt-20 pb-8">
      <h2 id="labs-title" className="sr-only">Lab list</h2>
      {filtered.length === 0
        ? <p className="border-y py-10 text-sm" style={{ borderColor: "var(--ca-line)", color: "var(--ca-muted)" }}>No lab found. Change the search or the track.</p>
        : <ol className="ca-module-list">{visible.map((lab, index) => <LabRow key={lab.slug} lab={lab} status={byLab.get(lab.slug)} heading={index === 0 || trackLabel(visible[index - 1]) !== trackLabel(lab) ? trackLabel(lab) : undefined} />)}</ol>}
      {filtered.length > PAGE_SIZE && <nav aria-label="Lab pages" className="ca-pager">
        <button type="button" onClick={() => goTo(current - 1)} disabled={current === 1}><ArrowLeft aria-hidden="true" className="size-4" /> Previous</button>
        <p aria-live="polite">Page <strong>{current}</strong> of {pageCount}<span> · Labs {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length}</span></p>
        <button type="button" onClick={() => goTo(current + 1)} disabled={current === pageCount}>Next <ArrowRight aria-hidden="true" className="size-4" /></button>
      </nav>}
    </section>
  </main></div>;
}

function LabRow({ lab, status, heading }: { lab: Lab; status?: LabProgress["status"]; heading?: string }) {
  return <li className="ca-module-row">
    {heading && <h3 className="ca-group-head">{heading}</h3>}
    <Link href={"/labs/" + lab.number} data-onboarding={`lab-${lab.number}`} aria-label={`Open Lab ${labLabel(lab)}: ${lab.title}`}>
      <span className="ca-module-index" aria-hidden="true">{labLabel(lab)}</span>
      <span><strong className="ca-module-title">{lab.title}</strong><span className="ca-module-summary">{lab.objective}</span></span>
      <span className="ca-module-meta">
        {lab.requiredFeature} · <span className="capitalize">{lab.difficulty}</span><br />
        {lab.minutes} min · {lab.acceptanceCriteria.length} criteria
        {status === "completed" && <><br /><span style={{ color: "var(--ca-green)" }}><Check aria-hidden="true" className="inline size-3" /> Completed</span></>}
        {status === "started" && <><br /><span style={{ color: "var(--ca-green)" }}>In progress</span></>}
      </span>
      <ArrowUpRight aria-hidden="true" className="ca-module-arrow size-5" />
    </Link>
  </li>;
}
