"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Zap,
  Users,
  ChevronRight,
  Check,
  Circle,
  ExternalLink,
  Star,
  Flame,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  challenges,
  difficultyConfig,
  moduleConfig,
  type Challenge,
} from "@/lib/challenges";

// ─── Local storage helpers ────────────────────────────────────────────────────

const STORAGE_KEY = "qa-lab-challenges";

type ChallengeState = {
  accepted: boolean;
  completedSteps: string[];
};

function loadState(): Record<string, ChallengeState> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveState(state: Record<string, ChallengeState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function XPBadge({ xp }: { xp: number }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
      <Zap className="size-3" />
      {xp} XP
    </span>
  );
}

function StepList({
  challenge,
  completedSteps,
  onToggleStep,
}: {
  challenge: Challenge;
  completedSteps: string[];
  onToggleStep: (id: string) => void;
}) {
  return (
    <div className="mt-4 space-y-2">
      {challenge.passos.map((step) => {
        const done = completedSteps.includes(step.id);
        return (
          <button
            key={step.id}
            onClick={() => onToggleStep(step.id)}
            className="flex w-full items-start gap-2.5 rounded-md p-2 text-left transition-colors hover:bg-secondary/50"
          >
            {done ? (
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            ) : (
              <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            )}
            <span
              className={`text-xs leading-relaxed ${
                done ? "text-muted-foreground line-through" : "text-foreground"
              }`}
            >
              {step.descricao}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ChallengeCard({
  challenge,
  state,
  onAccept,
  onToggleStep,
}: {
  challenge: Challenge;
  state: ChallengeState;
  onAccept: () => void;
  onToggleStep: (stepId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const diff = difficultyConfig[challenge.dificuldade];
  const mod = moduleConfig[challenge.modulo];

  const progress = state.accepted
    ? Math.round((state.completedSteps.length / challenge.passos.length) * 100)
    : 0;
  const isComplete =
    state.accepted && state.completedSteps.length === challenge.passos.length;

  return (
    <Card
      className={`relative flex flex-col transition-colors ${
        challenge.destaque ? "border-primary/40" : ""
      } ${isComplete ? "border-primary/60 bg-primary/5" : ""}`}
    >
      {challenge.destaque && !isComplete && (
        <div className="absolute -top-2.5 left-4">
          <span className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400">
            <Star className="size-3" />
            Destaque
          </span>
        </div>
      )}
      {isComplete && (
        <div className="absolute -top-2.5 left-4">
          <span className="flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
            <Trophy className="size-3" />
            Concluído
          </span>
        </div>
      )}

      <CardHeader className={`pb-2 ${challenge.destaque || isComplete ? "pt-6" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base leading-snug">
              {challenge.titulo}
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              {challenge.descricao}
            </CardDescription>
          </div>
          <XPBadge xp={challenge.xp} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={`text-xs font-medium ${diff.className}`}
          >
            {diff.label}
          </Badge>
          <span className={`text-xs font-medium ${mod.color}`}>
            {mod.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3" />
            {challenge.participantes} participantes
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {challenge.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Progress bar (only when accepted) */}
        {state.accepted && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span>
                {state.completedSteps.length}/{challenge.passos.length} passos
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary">
              <div
                className="h-1.5 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Steps (expandable) */}
        {state.accepted && (
          <div>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ChevronRight
                className={`size-3.5 transition-transform ${
                  expanded ? "rotate-90" : ""
                }`}
              />
              {expanded ? "Ocultar passos" : "Ver passos"}
            </button>
            {expanded && (
              <StepList
                challenge={challenge}
                completedSteps={state.completedSteps}
                onToggleStep={onToggleStep}
              />
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Link href={challenge.moduloHref}>
            <Button variant="ghost" size="xs" className="gap-1 text-xs">
              <ExternalLink className="size-3" />
              Abrir módulo
            </Button>
          </Link>

          {!state.accepted ? (
            <Button size="sm" onClick={onAccept} className="gap-1.5">
              <Target className="size-3.5" />
              Aceitar desafio
            </Button>
          ) : isComplete ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-primary">
              <Trophy className="size-3.5" />
              Desafio completo!
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="size-3.5 text-orange-400" />
              Em progresso
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "semanal" | "mensal";

export default function DesafiosPage() {
  const [tab, setTab] = useState<Tab>("semanal");
  const [states, setStates] = useState<Record<string, ChallengeState>>({});

  useEffect(() => {
    setStates(loadState());
  }, []);

  function getState(id: string): ChallengeState {
    return states[id] ?? { accepted: false, completedSteps: [] };
  }

  function handleAccept(id: string) {
    const next = {
      ...states,
      [id]: { accepted: true, completedSteps: [] },
    };
    setStates(next);
    saveState(next);
  }

  function handleToggleStep(challengeId: string, stepId: string) {
    const current = getState(challengeId);
    const steps = current.completedSteps.includes(stepId)
      ? current.completedSteps.filter((s) => s !== stepId)
      : [...current.completedSteps, stepId];
    const next = {
      ...states,
      [challengeId]: { ...current, completedSteps: steps },
    };
    setStates(next);
    saveState(next);
  }

  const filtered = challenges.filter((c) => c.tipo === tab);

  // Summary stats
  const semanais = challenges.filter((c) => c.tipo === "semanal");
  const mensais = challenges.filter((c) => c.tipo === "mensal");
  const totalXP = challenges.reduce((sum, c) => {
    const s = getState(c.id);
    if (s.accepted && s.completedSteps.length === c.passos.length) return sum + c.xp;
    return sum;
  }, 0);
  const completedCount = challenges.filter((c) => {
    const s = getState(c.id);
    return s.accepted && s.completedSteps.length === c.passos.length;
  }).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Trophy className="size-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Desafios</h1>
        </div>
        <p className="max-w-xl text-muted-foreground">
          Desafios semanais e mensais para a comunidade QA Lab. Aceite, complete
          os passos e acumule XP.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">XP Acumulado</p>
          <p className="mt-1 text-xl font-bold text-primary">
            {totalXP.toLocaleString()}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">Concluídos</p>
          <p className="mt-1 text-xl font-bold">
            {completedCount}/{challenges.length}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">Semanais</p>
          <p className="mt-1 text-xl font-bold">{semanais.length}</p>
        </Card>
        <Card className="p-3 hidden sm:block">
          <p className="text-xs text-muted-foreground">Mensais</p>
          <p className="mt-1 text-xl font-bold">{mensais.length}</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-secondary/30 p-1 w-fit">
        <button
          onClick={() => setTab("semanal")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "semanal"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Semanais
          <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
            {semanais.length}
          </span>
        </button>
        <button
          onClick={() => setTab("mensal")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "mensal"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Mensais
          <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
            {mensais.length}
          </span>
        </button>
      </div>

      {/* Section description */}
      <div className="rounded-lg border bg-secondary/20 p-3 text-xs text-muted-foreground">
        {tab === "semanal" ? (
          <>
            <strong className="text-foreground">Desafios Semanais</strong> — renovados toda segunda-feira.
            São mais rápidos e focados, ideais para praticar uma técnica específica durante a semana.
          </>
        ) : (
          <>
            <strong className="text-foreground">Desafios Mensais</strong> — renovados no primeiro dia de cada mês.
            São mais extensos e recompensadores, projetados para aprendizado profundo ao longo do mês.
          </>
        )}
      </div>

      {/* Challenge grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            state={getState(challenge.id)}
            onAccept={() => handleAccept(challenge.id)}
            onToggleStep={(stepId) => handleToggleStep(challenge.id, stepId)}
          />
        ))}
      </div>
    </div>
  );
}
