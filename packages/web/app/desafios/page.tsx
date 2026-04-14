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
  Plus,
  X,
  Copy,
  FileCode2,
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

// ─── BDD Generator ────────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-xl border border-mint/20 bg-off-white/5 px-3 py-2 text-sm text-off-white placeholder:text-off-white/30 focus:border-mint/40 focus:outline-none";

function StepSection({
  label,
  color,
  steps,
  setter,
  placeholder,
}: {
  label: string;
  color: string;
  steps: string[];
  setter: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <span className={`text-xs font-bold uppercase tracking-widest ${color}`}>{label}</span>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-off-white/30 w-8 shrink-0 text-right">
            {i === 0 ? label : "And"}
          </span>
          <input
            className={inputClass}
            placeholder={placeholder}
            value={step}
            onChange={(e) => {
              const next = [...steps];
              next[i] = e.target.value;
              setter(next);
            }}
          />
          {steps.length > 1 && (
            <button
              onClick={() => setter(steps.filter((_, idx) => idx !== i))}
              className="text-off-white/30 hover:text-off-white/60 shrink-0"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => setter([...steps, ""])}
        className="flex items-center gap-1 text-xs text-off-white/40 hover:text-off-white/70 pl-10"
      >
        <Plus className="size-3" />
        Adicionar {label}
      </button>
    </div>
  );
}

function BDDGenerator() {
  const [feature, setFeature] = useState("");
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const [benefit, setBenefit] = useState("");
  const [scenario, setScenario] = useState("");
  const [givens, setGivens] = useState<string[]>([""]);
  const [whens, setWhens] = useState<string[]>([""]);
  const [thens, setThens] = useState<string[]>([""]);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    const lines: string[] = [];
    if (feature) lines.push(`Feature: ${feature}`);
    if (role) lines.push(`  Como ${role}`);
    if (goal) lines.push(`  Quero ${goal}`);
    if (benefit) lines.push(`  Para ${benefit}`);

    const vGivens = givens.filter(Boolean);
    const vWhens = whens.filter(Boolean);
    const vThens = thens.filter(Boolean);

    if (scenario || vGivens.length || vWhens.length || vThens.length) {
      lines.push("");
      lines.push(`  Scenario: ${scenario || "Cenário sem título"}`);
      vGivens.forEach((g, i) => lines.push(`    ${i === 0 ? "Given" : "And"} ${g}`));
      vWhens.forEach((w, i) => lines.push(`    ${i === 0 ? "When" : "And"} ${w}`));
      vThens.forEach((t, i) => lines.push(`    ${i === 0 ? "Then" : "And"} ${t}`));
    }

    setOutput(lines.join("\n"));
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-mint/10 bg-dark-green/30 p-4 text-xs text-off-white/60">
        <strong className="text-mint font-bold uppercase tracking-wide">Gerador de BDD</strong>{" "}
        — preencha os campos e gere cenários no formato Gherkin prontos para usar.
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-mint/70">Feature</span>
            <input
              className={inputClass}
              placeholder="Ex: Autenticação de usuário"
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
            />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-off-white/40 mb-1">Como</label>
                <input
                  className={inputClass}
                  placeholder="usuário cadastrado"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-off-white/40 mb-1">Quero</label>
                <input
                  className={inputClass}
                  placeholder="fazer login"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-off-white/40 mb-1">Para</label>
                <input
                  className={inputClass}
                  placeholder="acessar o sistema"
                  value={benefit}
                  onChange={(e) => setBenefit(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-mint/70">Scenario</span>
            <input
              className={inputClass}
              placeholder="Ex: Login com credenciais válidas"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
            />
          </div>

          <StepSection
            label="Given"
            color="text-[#7DD3FC]"
            steps={givens}
            setter={setGivens}
            placeholder="o usuário está na tela de login"
          />
          <StepSection
            label="When"
            color="text-[#FDE68A]"
            steps={whens}
            setter={setWhens}
            placeholder="ele insere credenciais válidas"
          />
          <StepSection
            label="Then"
            color="text-neon"
            steps={thens}
            setter={setThens}
            placeholder="é redirecionado para o dashboard"
          />

          <Button onClick={generate} className="w-full gap-2">
            <Zap className="size-4" />
            Gerar BDD
          </Button>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-mint/70">Output</span>
            {output && (
              <Button variant="ghost" size="xs" onClick={copyToClipboard} className="gap-1 text-xs">
                {copied ? (
                  <Check className="size-3 text-neon" />
                ) : (
                  <Copy className="size-3" />
                )}
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            )}
          </div>
          <div className="min-h-72 rounded-2xl border border-mint/20 bg-dark-green/50 p-4">
            {output ? (
              <pre className="text-xs text-off-white/80 font-mono leading-relaxed whitespace-pre-wrap">
                {output}
              </pre>
            ) : (
              <p className="text-xs text-off-white/30 italic">
                Preencha os campos e clique em "Gerar BDD"...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Challenge sub-components ─────────────────────────────────────────────────

function XPBadge({ xp }: { xp: number }) {
  return (
    <span className="flex items-center gap-1 rounded-xl border border-neon/30 bg-neon/10 px-2.5 py-1 text-xs font-bold text-neon">
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
            className="flex w-full items-start gap-2.5 rounded-xl p-2 text-left transition-colors hover:bg-off-white/5"
          >
            {done ? (
              <Check className="mt-0.5 size-4 shrink-0 text-neon" />
            ) : (
              <Circle className="mt-0.5 size-4 shrink-0 text-off-white/30" />
            )}
            <span
              className={`text-xs leading-relaxed ${
                done ? "text-off-white/40 line-through" : "text-off-white/80"
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
        challenge.destaque ? "border-neon/30" : ""
      } ${isComplete ? "border-neon/40 bg-neon/5" : ""}`}
    >
      {challenge.destaque && !isComplete && (
        <div className="absolute -top-2.5 left-4">
          <span className="flex items-center gap-1 rounded-xl border border-neon/40 bg-neon/20 px-2.5 py-0.5 text-xs font-bold text-neon uppercase tracking-wide">
            <Star className="size-3" />
            Destaque
          </span>
        </div>
      )}
      {isComplete && (
        <div className="absolute -top-2.5 left-4">
          <span className="flex items-center gap-1 rounded-xl border border-mint/30 bg-mint/20 px-2.5 py-0.5 text-xs font-bold text-mint uppercase tracking-wide">
            <Trophy className="size-3" />
            Concluído
          </span>
        </div>
      )}

      <CardHeader className={`pb-2 ${challenge.destaque || isComplete ? "pt-6" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base leading-snug">{challenge.titulo}</CardTitle>
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
          <Badge variant="outline" className={`text-xs font-medium ${diff.className}`}>
            {diff.label}
          </Badge>
          <span className={`text-xs font-medium ${mod.color}`}>{mod.label}</span>
          <span className="flex items-center gap-1 text-xs text-off-white/50">
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
            <div className="flex items-center justify-between text-xs text-off-white/50">
              <span>Progresso</span>
              <span>
                {state.completedSteps.length}/{challenge.passos.length} passos
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-off-white/10">
              <div
                className="h-1.5 rounded-full bg-neon transition-all duration-300"
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
              className="flex items-center gap-1 text-xs font-medium text-off-white/50 hover:text-off-white"
            >
              <ChevronRight
                className={`size-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
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
            <span className="flex items-center gap-1 text-xs font-bold text-mint uppercase tracking-wide">
              <Trophy className="size-3.5" />
              Desafio completo!
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-off-white/50">
              <Flame className="size-3.5 text-[#F4A8A3]" />
              Em progresso
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "mensal" | "bdd";

export default function DesafiosPage() {
  const [tab, setTab] = useState<Tab>("mensal");
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4 animate-slide-in-up">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-neon/20">
            <Trophy className="size-5 text-neon" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-mint italic">
              DESAFIOS
            </h1>
            <p className="text-sm text-mint/50 uppercase tracking-[0.15em]">
              Desafios mensais e ferramentas
            </p>
          </div>
        </div>
        <p className="text-sm text-off-white/60 max-w-xl">
          Desafios mensais para a comunidade QA Lab e ferramentas para acelerar sua prática.
          Aceite, complete os passos e acumule XP.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 stagger-scale">
        <Card className="p-3">
          <p className="text-xs text-off-white/50 uppercase tracking-wide">XP Acumulado</p>
          <p className="mt-1 text-xl font-bold text-neon">{totalXP.toLocaleString()}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-off-white/50 uppercase tracking-wide">Concluídos</p>
          <p className="mt-1 text-xl font-bold text-mint">
            {completedCount}/{challenges.length}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-off-white/50 uppercase tracking-wide">Mensais</p>
          <p className="mt-1 text-xl font-bold text-off-white">{mensais.length}</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-mint/10">
        <button
          onClick={() => setTab("mensal")}
          className={`px-5 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-all -mb-px ${
            tab === "mensal"
              ? "border-mint text-mint"
              : "border-transparent text-off-white/40 hover:text-off-white/70"
          }`}
        >
          Mensais
          <span className="ml-1.5 rounded-lg bg-mint/10 px-1.5 py-0.5 text-xs text-mint">
            {mensais.length}
          </span>
        </button>
        <button
          onClick={() => setTab("bdd")}
          className={`px-5 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-all -mb-px flex items-center gap-1.5 ${
            tab === "bdd"
              ? "border-mint text-mint"
              : "border-transparent text-off-white/40 hover:text-off-white/70"
          }`}
        >
          <FileCode2 className="size-3.5" />
          Gerador de BDD
        </button>
      </div>

      {/* Tab content */}
      {tab === "mensal" && (
        <>
          <div className="rounded-2xl border border-mint/10 bg-dark-green/30 p-4 text-xs text-off-white/60">
            <strong className="text-mint font-bold uppercase tracking-wide">Desafios Mensais</strong>{" "}
            — renovados no primeiro dia de cada mês. São mais extensos e recompensadores, projetados
            para aprendizado profundo ao longo do mês.
          </div>
          <div className="grid gap-5 sm:grid-cols-2 stagger">
            {mensais.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                state={getState(challenge.id)}
                onAccept={() => handleAccept(challenge.id)}
                onToggleStep={(stepId) => handleToggleStep(challenge.id, stepId)}
              />
            ))}
          </div>
        </>
      )}

      {tab === "bdd" && <BDDGenerator />}
    </div>
  );
}
