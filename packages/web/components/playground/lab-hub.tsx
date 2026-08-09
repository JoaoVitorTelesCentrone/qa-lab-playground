"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clipboard, Filter, Search } from "lucide-react";
import { featuredLabNumbers, labs, tracks, type LabDifficulty, type LabStatus, type LabTrack } from "@/lib/playground/catalog";

const difficulties: Array<LabDifficulty | "todas"> = ["todas", "iniciante", "intermediario", "avancado"];
const statuses: Array<LabStatus | "todos"> = ["todos", "pronto", "parcial", "planejado"];

export function LabHub() {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<LabTrack | "todas">("todas");
  const [difficulty, setDifficulty] = useState<LabDifficulty | "todas">("todas");
  const [status, setStatus] = useState<LabStatus | "todos">("todos");
  const featured = labs.filter((lab) => featuredLabNumbers.includes(lab.number));

  const term = query.trim().toLowerCase();
  const filtered = labs.filter((lab) => {
    const text = [lab.title, lab.objective, lab.delivery, lab.track, ...lab.tags].join(" ").toLowerCase();
    return (!term || text.includes(term)) && (track === "todas" || lab.track === track) && (difficulty === "todas" || lab.difficulty === difficulty) && (status === "todos" || lab.status === status);
  });

  async function copy(text: string) {
    await navigator.clipboard?.writeText(text);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-mint">QA Lab Playground</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl leading-none text-off-white sm:text-6xl">Hub de labs praticos</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#AAB2BC]">Escolha um desafio, execute no produto simulado, registre evidencia e transforme o aprendizado em portfolio ou post.</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-card p-5">
          <p className="text-sm font-bold text-off-white">Dados de teste</p>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-[#8B949E]">Senha padrao</dt><dd className="font-mono text-neon">qa_lab_secret</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#8B949E]">Usuario feliz</dt><dd className="font-mono text-mint">standard_user</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#8B949E]">Usuario bloqueado</dt><dd className="font-mono text-coral">locked_out_user</dd></div>
          </dl>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-5">
        {featured.map((lab) => (
          <Link key={lab.number} href={lab.route} className="rounded-lg border border-white/10 bg-[#161B22] p-4 transition hover:-translate-y-0.5 hover:border-mint/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">
            <span className="font-mono text-xs text-mint">#{lab.number}</span>
            <h2 className="mt-2 text-base font-black text-off-white">{lab.title}</h2>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#AAB2BC]">{lab.objective}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-neon">Iniciar <ArrowRight className="size-3" /></span>
          </Link>
        ))}
      </section>

      <section className="mt-8 rounded-lg border border-white/10 bg-card p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_170px_150px]">
          <label className="relative">
            <span className="sr-only">Buscar lab</span>
            <Search className="pointer-events-none absolute left-3 top-3 size-4 text-[#8B949E]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por titulo, tag ou objetivo" className="field w-full pl-10" data-testid="lab-search" />
          </label>
          <Select label="Trilha" value={track} onChange={(value) => setTrack(value as LabTrack | "todas")} values={["todas", ...tracks]} />
          <Select label="Dificuldade" value={difficulty} onChange={(value) => setDifficulty(value as LabDifficulty | "todas")} values={difficulties} />
          <Select label="Status" value={status} onChange={(value) => setStatus(value as LabStatus | "todos")} values={statuses} />
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#AAB2BC]"><Filter className="size-4" /> {filtered.length} labs encontrados</div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((lab) => (
            <article key={lab.number} className="rounded-lg border border-white/10 bg-[#161B22] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-mint">#{lab.number} | {lab.track}</p>
                  <h3 className="mt-2 text-lg font-black text-off-white">{lab.title}</h3>
                </div>
                <span className="rounded-md border border-white/10 px-2 py-1 text-[11px] font-bold uppercase text-[#AAB2BC]">{lab.status}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#AAB2BC]">{lab.objective}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-mint/10 px-2 py-1 text-xs text-mint">{lab.difficulty}</span>
                <span className="rounded-md bg-neon/10 px-2 py-1 text-xs text-neon">{lab.minutes} min</span>
                {lab.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-md bg-white/5 px-2 py-1 text-xs text-[#AAB2BC]">{tag}</span>)}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={lab.route} className="inline-flex h-9 items-center gap-2 rounded-lg bg-neon px-3 text-xs font-black text-[#101319]">Iniciar lab <ArrowRight className="size-3" /></Link>
                <button type="button" onClick={() => copy(lab.postPrompt)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold text-off-white"><Clipboard className="size-3" /> Copiar post</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Select({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="field w-full" aria-label={label}>
        {values.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );
}
