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
      className="group flex cursor-pointer items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-secondary/50"
      onClick={onToggle}
    >
      {/* Status icon */}
      <div className="mt-0.5 shrink-0">
        {status === "concluido" ? (
          <div className="flex size-5 items-center justify-center rounded-full bg-primary/20">
            <Check className="size-3 text-primary" />
          </div>
        ) : status === "em_progresso" ? (
          <div className="flex size-5 items-center justify-center rounded-full bg-amber-500/20">
            <Loader2 className="size-3 animate-spin text-amber-400" />
          </div>
        ) : (
          <Circle className="size-5 text-muted-foreground/40 group-hover:text-muted-foreground" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p
          className={`text-sm font-medium leading-snug ${
            status === "concluido"
              ? "text-muted-foreground line-through"
              : "text-foreground"
          }`}
        >
          {item.titulo}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {item.descricao}
        </p>
        {item.recurso && (
          <Link
            href={item.recurso.href}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
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
              ? "border-primary bg-primary/20"
              : "border-border bg-background"
          }`}
        >
          {complete ? (
            <Check className="size-4 text-primary" />
          ) : (
            <div className={`size-2.5 rounded-full ${cfg.dotClass} opacity-70`} />
          )}
        </div>
        {!isLast && (
          <div
            className={`mt-1 w-0.5 flex-1 rounded-full transition-colors ${
              complete ? "bg-primary/30" : "bg-border"
            }`}
          />
        )}
      </div>

      {/* Content card */}
      <div className="mb-6 flex-1">
        <Card className={`${complete ? "border-primary/30 bg-primary/5" : ""}`}>
          <CardHeader className="pb-2">
            <button
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setOpen((v) => !v)}
            >
              <div className="flex items-center gap-2.5">
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${cfg.className}`}
                >
                  {cfg.label}
                </Badge>
                <CardTitle className="text-sm font-semibold">
                  {level.titulo}
                </CardTitle>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {done}/{total}
                </span>
                <ChevronRight
                  className={`size-4 text-muted-foreground transition-transform ${
                    open ? "rotate-90" : ""
                  }`}
                />
              </div>
            </button>

            {/* Level progress bar */}
            <div className="mt-2 h-1 rounded-full bg-secondary">
              <div
                className="h-1 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </CardHeader>

          {open && (
            <CardContent className="pt-0">
              <p className="mb-3 text-xs text-muted-foreground">
                {level.descricao}
              </p>
              <div className="divide-y divide-border/50">
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
              <h2 className="text-2xl font-bold tracking-tight">{topic.titulo}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{topic.resumo}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold text-primary">{pct}%</p>
            <p className="text-xs text-muted-foreground">
              {done}/{total} itens
            </p>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="space-y-1">
          <div className="h-2 rounded-full bg-secondary">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Nível atual:</span>
            <Badge
              variant="outline"
              className={`text-xs font-semibold ${cfg.className}`}
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
    <div className="flex h-full gap-6 lg:gap-8">
      {/* ── Topic list sidebar ── */}
      <aside className="hidden w-52 shrink-0 lg:block">
        <div className="sticky top-0 space-y-1">
          <div className="mb-4 flex items-center gap-2">
            <Map className="size-5 text-primary" />
            <h1 className="text-base font-bold">Roadmap</h1>
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
                    ? "bg-sidebar-accent text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setSelectedId(topic.id)}
              >
                <span className="text-base leading-none">{topic.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{topic.titulo}</p>
                  <div className="mt-1 h-1 rounded-full bg-secondary">
                    <div
                      className="h-1 rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
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
          <div className="flex items-center gap-2 mb-3">
            <Map className="size-5 text-primary" />
            <h1 className="text-xl font-bold">Roadmap</h1>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {topics.map((topic) => {
              const { pct } = topicProgress(topic, state);
              const isSelected = topic.id === selectedId;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedId(topic.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
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
    </div>
  );
}
