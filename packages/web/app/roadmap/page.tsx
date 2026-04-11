"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Map, Check, Loader2, Circle,
  ChevronRight, ExternalLink, Trophy,
} from "lucide-react";
import {
  fases, nivelConfig, countAllItems,
  type RoadmapFase, type NivelFase,
  type ItemStatus,
} from "@/lib/roadmap";

// ── Storage ────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "qa-lab-roadmap-v2";
type RoadmapState = Record<string, ItemStatus>;

function loadState(): RoadmapState {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); }
  catch { return {}; }
}

function saveState(s: RoadmapState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

const statusCycle: Record<ItemStatus, ItemStatus> = {
  nao_iniciado: "em_progresso",
  em_progresso: "concluido",
  concluido:    "nao_iniciado",
};

// ── Item Row ───────────────────────────────────────────────────────────────────

function ItemRow({
  item,
  status,
  onToggle,
}: {
  item: RoadmapFase["items"][0];
  status: ItemStatus;
  onToggle: () => void;
}) {
  return (
    <div
      className="group flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors hover:bg-off-white/5"
      onClick={onToggle}
    >
      <div className="mt-0.5 shrink-0">
        {status === "concluido" ? (
          <div className="flex size-5 items-center justify-center rounded-full bg-neon/20">
            <Check className="size-3 text-neon" />
          </div>
        ) : status === "em_progresso" ? (
          <div className="flex size-5 items-center justify-center rounded-full bg-coral/20">
            <Loader2 className="size-3 animate-spin text-coral" />
          </div>
        ) : (
          <Circle className="size-5 text-off-white/20 group-hover:text-off-white/40 transition-colors" />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-0.5">
        <p className={`text-sm font-medium leading-snug transition-colors ${
          status === "concluido"
            ? "text-off-white/35 line-through"
            : "text-off-white"
        }`}>
          {item.titulo}
        </p>
        <p className="text-xs text-off-white/50 leading-relaxed">{item.descricao}</p>
        {item.recurso && (
          <Link
            href={item.recurso.href}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs text-mint hover:underline mt-0.5"
          >
            <ExternalLink className="size-3" />
            {item.recurso.label}
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Fase Card ──────────────────────────────────────────────────────────────────

function FaseCard({
  fase,
  state,
  onToggle,
  isLast,
  defaultOpen,
}: {
  fase: RoadmapFase;
  state: RoadmapState;
  onToggle: (id: string) => void;
  isLast: boolean;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const cfg     = nivelConfig[fase.nivel];
  const done    = fase.items.filter(i => state[i.id] === "concluido").length;
  const total   = fase.items.length;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = done === total;

  return (
    <div className="flex gap-5">
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`z-10 flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
          complete
            ? "border-neon bg-neon/20 shadow-[0_0_12px_rgba(212,245,110,0.3)]"
            : "border-mint/20 bg-[#405555]"
        }`}>
          {complete
            ? <Check className="size-4 text-neon" />
            : <span className={`text-sm font-bold ${cfg.textClass}`}>{fase.numero}</span>
          }
        </div>
        {!isLast && (
          <div className={`mt-1 w-px flex-1 min-h-6 rounded-full transition-colors duration-500 ${
            complete ? "bg-neon/25" : "bg-mint/10"
          }`} />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 mb-8">
        <div className={`rounded-2xl border transition-all duration-300 ${
          complete
            ? "border-neon/25 bg-neon/5"
            : "border-mint/10 bg-card"
        }`}>
          {/* Header (always visible) */}
          <button
            className="w-full p-5 text-left"
            onClick={() => setOpen(v => !v)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-2xl leading-none mt-0.5">{fase.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-off-white text-base leading-snug">
                      {fase.titulo}
                    </h2>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${cfg.textClass} ${cfg.borderClass} ${cfg.bgClass}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-off-white/50 mt-1 leading-relaxed max-w-lg">
                    {fase.descricao}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-xs text-off-white/40 tabular-nums">{done}/{total}</span>
                <ChevronRight className={`size-4 text-off-white/30 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 space-y-1.5">
              <div className="h-1.5 rounded-full bg-off-white/8 overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: complete ? "#D4F56E" : "#B4D4D1",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-off-white/35">
                <span>Fase {fase.numero} de 8</span>
                <span>{pct}% concluído</span>
              </div>
            </div>
          </button>

          {/* Items */}
          {open && (
            <div className="border-t border-mint/10 px-5 pb-3 pt-1 divide-y divide-mint/8">
              {fase.items.map(item => (
                <ItemRow
                  key={item.id}
                  item={item}
                  status={state[item.id] ?? "nao_iniciado"}
                  onToggle={() => onToggle(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  const [state, setState] = useState<RoadmapState>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setState(loadState());
    setMounted(true);
  }, []);

  function handleToggle(itemId: string) {
    const current = state[itemId] ?? "nao_iniciado";
    const next = { ...state, [itemId]: statusCycle[current] };
    setState(next);
    saveState(next);
  }

  const totalItems = countAllItems();
  const donePorFase = fases.map(f => f.items.filter(i => state[i.id] === "concluido").length);
  const totalDone   = donePorFase.reduce((s, n) => s + n, 0);
  const globalPct   = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;
  const allDone     = totalDone === totalItems;

  const faseAtual = mounted
    ? fases.find(f => f.items.some(i => (state[i.id] ?? "nao_iniciado") !== "concluido")) ?? fases[fases.length - 1]
    : fases[0];

  return (
    <div className="animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-10">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="space-y-6 animate-slide-in-up">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center size-12 rounded-2xl bg-mint/20 shrink-0">
                <Map className="size-6 text-mint" />
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wider text-mint italic">
                  ROADMAP
                </h1>
                <p className="text-xs uppercase tracking-[0.15em] text-mint/50 -mt-0.5">
                  Iniciante ao Intermediário
                </p>
              </div>
            </div>

            {/* Level legend */}
            <div className="flex flex-col gap-1.5 shrink-0">
              {(["iniciante", "intermediario"] as NivelFase[]).map(n => {
                const cfg = nivelConfig[n];
                return (
                  <span key={n} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${cfg.textClass} ${cfg.borderClass} ${cfg.bgClass}`}>
                    {cfg.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Global progress */}
          <div className="rounded-2xl border border-mint/10 bg-card p-5 space-y-3">
            {allDone ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-full bg-neon/20">
                  <Trophy className="size-5 text-neon" />
                </div>
                <div>
                  <p className="font-bold text-neon">Roadmap concluído!</p>
                  <p className="text-xs text-off-white/50">Você completou todos os {totalItems} tópicos. Hora do sênior.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-off-white">Seu progresso</p>
                  <p className="text-xs text-off-white/50 mt-0.5">
                    {mounted ? (
                      <>
                        Fase atual: <span className="text-mint">{faseAtual.numero}. {faseAtual.titulo}</span>
                      </>
                    ) : "Carregando..."}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-[family-name:var(--font-display)] text-neon tracking-wide leading-none">
                    {mounted ? globalPct : 0}%
                  </p>
                  <p className="text-xs text-off-white/40 mt-0.5">
                    {mounted ? totalDone : 0}/{totalItems} tópicos
                  </p>
                </div>
              </div>
            )}

            <div className="h-2 rounded-full bg-off-white/8 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: mounted ? `${globalPct}%` : "0%",
                  backgroundColor: allDone ? "#D4F56E" : "#B4D4D1",
                }}
              />
            </div>

            {/* Per-phase mini bars */}
            {mounted && (
              <div className="flex gap-1 pt-0.5">
                {fases.map((f, i) => {
                  const fasePct = Math.round((donePorFase[i] / f.items.length) * 100);
                  const cfg = nivelConfig[f.nivel];
                  return (
                    <div key={f.id} className="flex-1 space-y-1 group/bar" title={`Fase ${f.numero}: ${fasePct}%`}>
                      <div className="h-1 rounded-full bg-off-white/8 overflow-hidden">
                        <div
                          className="h-1 rounded-full transition-all duration-500"
                          style={{ width: `${fasePct}%`, backgroundColor: fasePct === 100 ? "#D4F56E" : (f.nivel === "iniciante" ? "#B4D4D1" : "#D4F56E") }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Instructions */}
          <p className="text-xs text-off-white/40 text-center">
            Clique em um tópico para marcar como{" "}
            <span className="text-coral">em progresso</span> →{" "}
            <span className="text-neon">concluído</span> →{" "}
            não iniciado
          </p>
        </div>

        {/* ── Timeline ──────────────────────────────────────────────────────── */}
        <div>
          {fases.map((fase, i) => (
            <FaseCard
              key={fase.id}
              fase={fase}
              state={state}
              onToggle={handleToggle}
              isLast={i === fases.length - 1}
              defaultOpen={i === 0}
            />
          ))}
        </div>

        {/* Footer badge */}
        <div className="flex justify-end pb-4">
          <span className="font-[family-name:var(--font-display)] text-5xl text-mint/5 italic tracking-wider select-none">
            QA
          </span>
        </div>
      </div>
    </div>
  );
}
