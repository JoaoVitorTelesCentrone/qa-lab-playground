"use client";

import { MENTORSHIP_ENABLED } from "@/lib/product/features";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Search, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { releasedLabsInOrder as labs, labLabel, type Lab } from "@/lib/playground/catalog";
import { qaToolLabSpecs } from "@/lib/qa-tool-labs";
import { qaTools } from "@/lib/qa-tools";
import type { LabProgress } from "@/lib/product/journey";
import "@/app/conteudo/content-atlas.css";

const PAGE_SIZE = 10;

// Blocos da lista, na ordem em que aparecem: Broto e mentoria, automação por
// ferramenta e a loja de treino.
const AUTOMATION_AREAS = ["Cypress", "Playwright", "Selenium e Appium", "k6", "Postman", "Bruno"];
const QA_TOOL_AREAS = qaTools.map((tool) => tool.title);
const groupOf = (lab: Lab) => lab.number <= 100 ? "Loja de treino" : QA_TOOL_AREAS.includes(lab.requiredFeature) ? "Ferramentas interativas" : AUTOMATION_AREAS.includes(lab.requiredFeature) ? "Automação por ferramenta" : MENTORSHIP_ENABLED ? "Broto e mentoria" : "Broto";

// Busca sem acento e sem diferenciar maiúsculas: "automação" encontra "automacao".
const plain = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// A lista de Labs tem o mesmo desenho da lista de módulos do Caminho: uma linha
// por Lab, número grande, título, resumo e contagens à direita. Broto e mentoria
// vêm primeiro; a loja de treino (1–100) fica no fim.
export function LabCatalog({ progress = [], initialPage }: { progress?: Array<Pick<LabProgress, "status"> & { slug: string }>; initialPage?: string }) {
  const [query, setQuery] = useState("");
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
    !term || plain([lab.title, lab.objective, lab.requiredFeature, lab.difficulty, labLabel(lab)].join(" ")).includes(term)
  ), [term]);
  const completed = labs.filter((lab) => byLab.get(lab.slug) === "completed").length;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function goTo(next: number, { scroll = true } = {}) {
    const target = Math.min(Math.max(1, next), pageCount);
    setChosen(target);
    const url = new URL(window.location.href);
    if (target === 1) url.searchParams.delete("pagina"); else url.searchParams.set("pagina", String(target));
    window.history.replaceState(null, "", url);
    if (scroll) listTop.current?.scrollIntoView({ block: "start" });
  }

  return <div className="content-atlas"><main className="ca-shell">
    <header data-onboarding="lab-catalog" className="ca-map-head">
      <div>
        <h1>Labs</h1>
        <p>{progress.length > 0 ? `${completed} de ${labs.length} concluídos. ` : ""}Escolha uma missão, investigue e registre o que encontrou.</p>
        <Link href="/lab/ferramentas" className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-md border border-mint/25 px-3 text-xs font-bold text-mint hover:bg-mint/10"><Wrench aria-hidden="true" className="size-3.5" />Abrir {qaTools.length} ferramentas · {qaToolLabSpecs.length} Labs</Link>
      </div>
      <label className="relative w-full sm:w-72">
        <span className="sr-only">Buscar Lab</span>
        <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden="true" />
        <Input value={query} onChange={(event) => { setQuery(event.target.value); goTo(1, { scroll: false }); }} placeholder="Buscar por tema, área ou número" className="pl-10" />
      </label>
    </header>

    <section ref={listTop} aria-labelledby="labs-title" className="scroll-mt-20 pb-8">
      <h2 id="labs-title" className="sr-only">Lista de Labs</h2>
      {filtered.length === 0
        ? <p className="border-y py-10 text-sm" style={{ borderColor: "var(--ca-line)", color: "var(--ca-muted)" }}>Nenhum Lab encontrado. Altere a busca.</p>
        : <ol className="ca-module-list">{visible.map((lab, index) => <LabRow key={lab.slug} lab={lab} status={byLab.get(lab.slug)} heading={index === 0 || groupOf(visible[index - 1]) !== groupOf(lab) ? groupOf(lab) : undefined} />)}</ol>}
      {filtered.length > PAGE_SIZE && <nav aria-label="Paginação dos Labs" className="ca-pager">
        <button type="button" onClick={() => goTo(current - 1)} disabled={current === 1}><ArrowLeft aria-hidden="true" className="size-4" /> Anterior</button>
        <p aria-live="polite">Página <strong>{current}</strong> de {pageCount}<span> · Labs {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} de {filtered.length}</span></p>
        <button type="button" onClick={() => goTo(current + 1)} disabled={current === pageCount}>Próxima <ArrowRight aria-hidden="true" className="size-4" /></button>
      </nav>}
    </section>
  </main></div>;
}

function LabRow({ lab, status, heading }: { lab: Lab; status?: LabProgress["status"]; heading?: string }) {
  return <li className="ca-module-row">
    {heading && <h3 className="ca-group-head">{heading}</h3>}
    <Link href={"/labs/" + lab.number} data-onboarding={`lab-${lab.number}`} aria-label={`Abrir Lab ${labLabel(lab)}: ${lab.title}`}>
      <span className="ca-module-index" aria-hidden="true">{labLabel(lab)}</span>
      <span><strong className="ca-module-title">{lab.title}</strong><span className="ca-module-summary">{lab.objective}</span></span>
      <span className="ca-module-meta">
        {lab.requiredFeature} · <span className="capitalize">{lab.difficulty}</span><br />
        {lab.minutes} min · {lab.acceptanceCriteria.length} critérios
        {status === "completed" && <><br /><span style={{ color: "var(--ca-green)" }}><Check aria-hidden="true" className="inline size-3" /> Concluído</span></>}
        {status === "started" && <><br /><span style={{ color: "var(--ca-green)" }}>Em andamento</span></>}
      </span>
      <ArrowUpRight aria-hidden="true" className="ca-module-arrow size-5" />
    </Link>
  </li>;
}
