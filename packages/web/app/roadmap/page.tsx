"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Map,
  Check,
  Loader2,
  Circle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  topics,
  levelConfig,
  countItems,
  type RoadmapTopic,
  type RoadmapLevel,
  type ItemStatus,
  type Level,
} from "@/lib/roadmap";

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "qa-lab-roadmap";

type RoadmapState = Record<string, ItemStatus>; // itemId → status

function loadState(): RoadmapState {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveState(s: RoadmapState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

const statusCycle: Record<ItemStatus, ItemStatus> = {
  nao_iniciado: "em_progresso",
  em_progresso: "concluido",
  concluido: "nao_iniciado",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function topicProgress(
  topic: RoadmapTopic,
  state: RoadmapState
): { done: number; total: number; pct: number } {
  const total = countItems(topic);
  const done = topic.niveis
    .flatMap((n) => n.items)
    .filter((i) => state[i.id] === "concluido").length;
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function levelProgress(
  level: RoadmapLevel,
  state: RoadmapState
): { done: number; total: number; pct: number } {
  const total = level.items.length;
  const done = level.items.filter((i) => state[i.id] === "concluido").length;
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function getCurrentLevel(topic: RoadmapTopic, state: RoadmapState): Level {
  const order: Level[] = ["junior", "pleno", "senior", "expert"];
  let current: Level = "junior";
  for (const nivel of topic.niveis) {
    const { pct } = levelProgress(nivel, state);
    if (pct === 100) current = nivel.nivel;
  }
  return current;
}

// ─── Item row ─────────────────────────────────────────────────────────────────

function ItemRow({
  item,
  status,
  onToggle,
}: {
  item: RoadmapTopic["niveis"][0]["items"][0];
  status: ItemStatus;
  onToggle: () => void;
}) {
  return (
    <div
      className="group flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors hover:bg-off-white/5"
      onClick={onToggle}
    >
      {/* Status icon */}
      <div className="mt-0.5 shrink-0">
        {status === "concluido" ? (
          <div className="flex size-5 items-center justify-center rounded-full bg-neon/20">
            <Check className="size-3 text-neon" />
          </div>
        ) : status === "em_progresso" ? (
          <div className="flex size-5 items-center justify-center rounded-full bg-[#F4A8A3]/20">
            <Loader2 className="size-3 animate-spin text-[#F4A8A3]" />
          </div>
        ) : (
          <Circle className="size-5 text-off-white/20 group-hover:text-off-white/40" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p
          className={`text-sm font-medium leading-snug ${
            status === "concluido"
              ? "text-off-white/40 line-through"
              : "text-off-white"
          }`}
        >
          {item.titulo}
        </p>
        <p className="text-xs text-off-white/50 leading-relaxed">
          {item.descricao}
        </p>
        {item.recurso && (
          <Link
            href={item.recurso.href}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs text-mint hover:underline"
          >
            <ExternalLink className="size-3" />
            {item.recurso.label}
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Level section ────────────────────────────────────────────────────────────

function LevelSection({
  level,
  state,
  onToggle,
  isLast,
}: {
  level: RoadmapLevel;
  state: RoadmapState;
  onToggle: (id: string) => void;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(true);
  const cfg = levelConfig[level.nivel];
  const { done, total, pct } = levelProgress(level, state);
  const complete = pct === 100;

  return (
    <div className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div
          className={`z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            complete
              ? "border-neon bg-neon/20"
              : "border-mint/20 bg-dark-green/50"
          }`}
        >
          {complete ? (
            <Check className="size-4 text-neon" />
          ) : (
            <div className={`size-2.5 rounded-full ${cfg.dotClass} opacity-70`} />
          )}
        </div>
        {!isLast && (
          <div
            className={`mt-1 w-0.5 flex-1 rounded-full transition-colors ${
              complete ? "bg-neon/30" : "bg-mint/10"
            }`}
          />
        )}
      </div>

      {/* Content card */}
      <div className="mb-6 flex-1">
        <Card className={`${complete ? "border-neon/30 bg-neon/5" : "border-mint/10"}`}>
          <CardHeader className="pb-2">
            <button
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setOpen((v) => !v)}
            >
              <div className="flex items-center gap-2.5">
                <Badge
                  variant="outline"
                  className={`text-xs font-bold uppercase tracking-wide ${cfg.className}`}
                >
                  {cfg.label}
                </Badge>
                <CardTitle className="text-sm font-bold text-off-white">
                  {level.titulo}
                </CardTitle>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-off-white/50">
                  {done}/{total}
                </span>
                <ChevronRight
                  className={`size-4 text-off-white/40 transition-transform ${
                    open ? "rotate-90" : ""
                  }`}
                />
              </div>
            </button>

            {/* Level progress bar */}
            <div className="mt-2 h-1 rounded-full bg-off-white/10">
              <div
                className="h-1 rounded-full bg-neon transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </CardHeader>

          {open && (
            <CardContent className="pt-0">
              <p className="mb-3 text-xs text-off-white/50">
                {level.descricao}
              </p>
              <div className="divide-y divide-mint/10">
                {level.items.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    status={state[item.id] ?? "nao_iniciado"}
                    onToggle={() => onToggle(item.id)}
                  />
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── Topic panel ─────────────────────────────────────────────────────────────

function TopicPanel({
  topic,
  state,
  onToggle,
}: {
  topic: RoadmapTopic;
  state: RoadmapState;
  onToggle: (itemId: string) => void;
}) {
  const { done, total, pct } = topicProgress(topic, state);
  const currentLevel = getCurrentLevel(topic, state);
  const cfg = levelConfig[currentLevel];

  return (
    <div className="space-y-6">
      {/* Topic header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{topic.icon}</span>
              <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wider text-mint italic">
                {topic.titulo}
              </h2>
            </div>
            <p className="text-sm text-off-white/60">{topic.resumo}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold text-neon">{pct}%</p>
            <p className="text-xs text-off-white/50">
              {done}/{total} itens
            </p>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="space-y-1">
          <div className="h-2 rounded-full bg-off-white/10">
            <div
              className="h-2 rounded-full bg-neon transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-off-white/50">
            <span>Nível atual:</span>
            <Badge
              variant="outline"
              className={`text-xs font-bold uppercase tracking-wide ${cfg.className}`}
            >
              {cfg.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Roadmap levels */}
      <div>
        {topic.niveis.map((level, i) => (
          <LevelSection
            key={level.nivel}
            level={level}
            state={state}
            onToggle={onToggle}
            isLast={i === topic.niveis.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  const [selectedId, setSelectedId] = useState(topics[0].id);
  const [state, setState] = useState<RoadmapState>({});

  useEffect(() => {
    setState(loadState());
  }, []);

  function handleToggle(itemId: string) {
    const current = state[itemId] ?? "nao_iniciado";
    const next = { ...state, [itemId]: statusCycle[current] };
    setState(next);
    saveState(next);
  }

  const selected = topics.find((t) => t.id === selectedId)!;

  return (
    <div className="flex h-full gap-6 lg:gap-8 animate-fade-in">
      {/* ── Topic list sidebar ── */}
      <aside className="hidden w-52 shrink-0 lg:block">
        <div className="sticky top-0 space-y-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-mint/20">
              <Map className="size-5 text-mint" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-xl tracking-wider text-mint italic">
                ROADMAP
              </h1>
              <p className="text-xs text-mint/50 uppercase tracking-[0.1em]">
                Trilhas de aprendizado
              </p>
            </div>
          </div>
          {topics.map((topic) => {
            const { pct } = topicProgress(topic, state);
            const isSelected = topic.id === selectedId;
            return (
              <Button
                key={topic.id}
                variant="ghost"
                className={`h-auto w-full justify-start gap-2 px-3 py-2.5 text-left ${
                  isSelected
                    ? "bg-mint/10 text-mint border border-mint/20"
                    : "text-off-white/50 hover:text-off-white hover:bg-off-white/5"
                }`}
                onClick={() => setSelectedId(topic.id)}
              >
                <span className="text-base leading-none">{topic.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold uppercase tracking-wide">{topic.titulo}</p>
                  <div className="mt-1 h-1 rounded-full bg-off-white/10">
                    <div
                      className="h-1 rounded-full bg-neon transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="shrink-0 text-xs text-off-white/40">
                  {pct}%
                </span>
              </Button>
            );
          })}
        </div>
      </aside>

      {/* ── Mobile topic tabs ── */}
      <div className="lg:hidden w-full">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-mint/20">
              <Map className="size-5 text-mint" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-xl tracking-wider text-mint italic">
                ROADMAP
              </h1>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {topics.map((topic) => {
              const { pct } = topicProgress(topic, state);
              const isSelected = topic.id === selectedId;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedId(topic.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                    isSelected
                      ? "border-mint/40 bg-mint/10 text-mint"
                      : "border-mint/10 text-off-white/50 hover:text-off-white"
                  }`}
                >
                  <span>{topic.icon}</span>
                  {topic.titulo}
                  <span className="text-xs opacity-70">{pct}%</span>
                </button>
              );
            })}
          </div>
        </div>
        <TopicPanel
          topic={selected}
          state={state}
          onToggle={handleToggle}
        />
      </div>

      {/* ── Roadmap content (desktop) ── */}
      <div className="hidden flex-1 min-w-0 lg:block">
        <TopicPanel
          topic={selected}
          state={state}
          onToggle={handleToggle}
        />
      </div>

      {/* Series Badge */}
      <div className="hidden lg:flex justify-end absolute bottom-8 right-8">
        <span className="series-number text-4xl text-off-white/10">
          #06
        </span>
      </div>
    </div>
  );
}
