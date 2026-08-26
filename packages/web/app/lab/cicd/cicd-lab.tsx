"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Award, Check, CheckCircle2, ChevronRight, CircleDot, Copy, Download, GitBranch, Lock, PartyPopper, RotateCcw, ShieldCheck, Terminal, Workflow } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { TextAnimate } from "@/components/ui/text-animate";
import { SaveGate } from "@/components/lab/save-gate";
import { markCicdSolved, resetCicdProgress } from "./actions";
import {
  buildModuleProgress,
  buildReliabilityReport,
  cicdMissions,
  cicdModules,
  cicdProgressPercent,
  firstUnsolvedMission,
  getModuleMissions,
  isCicdComplete,
  isChoiceCorrect,
  isDecisionBest,
  isOrderSolved,
  scoreGate,
  validateYamlEdit,
  type CicdMission,
} from "@/lib/cicd-lab";

type View = "map" | "mission" | "done";

const levelTone: Record<string, string> = {
  "Iniciante": "text-mint",
  "Intermediário": "text-[#9BC0F5]",
  "Avançado": "text-coral",
};

const listContainer = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const listItem = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 18, stiffness: 220 } } };

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function CicdLab({ initialSolved = [], authed = false, initialLabId }: { initialSolved?: string[]; authed?: boolean; initialLabId?: string }) {
  const router = useRouter();
  const initialLabMissions = initialLabId ? getModuleMissions(initialLabId) : [];
  const [solved, setSolved] = useState<string[]>(initialSolved);
  const [view, setView] = useState<View>(initialLabMissions.length > 0 ? "mission" : "map");
  const [activeId, setActiveId] = useState<string>(() => initialLabMissions.find((mission) => !initialSolved.includes(mission.id))?.id ?? initialLabMissions[0]?.id ?? cicdMissions[0].id);
  const [showGate, setShowGate] = useState(false);

  function markSolved(id: string) {
    setSolved((current) => (current.includes(id) ? current : [...current, id]));
    if (authed) void markCicdSolved(id);
    else setShowGate(true);
  }

  function enterModule(moduleId: string) {
    const missions = getModuleMissions(moduleId);
    const next = missions.find((mission) => !solved.includes(mission.id)) ?? missions[0];
    if (!next) return;
    setActiveId(next.id);
    setView("mission");
    router.push(`/trilhas/cicd/labs/${moduleId}`);
  }

  function selectMission(missionId: string) {
    const mission = cicdMissions.find((item) => item.id === missionId);
    if (!mission) return;
    setActiveId(mission.id);
    setView("mission");
    router.replace(`/trilhas/cicd/labs/${mission.moduleId}`, { scroll: false });
  }

  function showTrack() {
    setView("map");
    router.push("/trilhas/cicd");
  }

  function continueTrilha() {
    const next = firstUnsolvedMission(solved);
    if (!next) { setView("done"); return; }
    setActiveId(next.id);
    setView("mission");
    router.push(`/trilhas/cicd/labs/${next.moduleId}`);
  }

  function resetProgress() {
    setSolved([]);
    setActiveId(cicdMissions[0].id);
    setView("map");
    router.replace("/trilhas/cicd");
    if (authed) void resetCicdProgress();
  }

  const active = cicdMissions.find((mission) => mission.id === activeId) ?? cicdMissions[0];
  const percent = cicdProgressPercent(solved);
  const complete = isCicdComplete(solved);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0D1117]">
      <div className="border-b border-white/10 bg-[#12161C]">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <button onClick={showTrack} className="flex items-center gap-3 text-left">
            <span className="flex size-10 items-center justify-center rounded-xl bg-neon text-[#101319]"><Workflow className="size-5" /></span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-off-white">Trilha CI/CD</span>
                <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#8B949E]">Delivery sandbox</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[#69737E]">Pipeline simulado · decisões reais de build, teste e deploy</p>
            </div>
          </button>
          <div className="flex items-center gap-4">
            <div className="min-w-44">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#69737E]">
                <span>Progresso</span>
                <span className="text-neon">{solved.length}/{cicdMissions.length}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-neon" initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
              </div>
            </div>
            <Link href="/lab/competencias" className="flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold text-[#AAB2BC] hover:border-mint/30 hover:text-mint">
              <ShieldCheck className="size-3.5" />Competências
            </Link>
          </div>
        </div>
      </div>

      {view === "map" && <TrilhaMap solved={solved} percent={percent} complete={complete} onContinue={continueTrilha} onOpenModule={enterModule} onSeeReport={() => setView("done")} />}
      {view === "mission" && <Workspace active={active} solved={solved} onSelectMission={selectMission} onSolve={markSolved} onBack={showTrack} complete={complete} onSeeReport={() => setView("done")} />}
      {view === "done" && <Completion solved={solved} onBack={showTrack} onReset={resetProgress} />}

      <SaveGate show={showGate} next="/trilhas/cicd" onDismiss={() => setShowGate(false)} />
    </div>
  );
}

// ---------- Mapa da trilha ----------

function TrilhaMap({ solved, percent, complete, onContinue, onOpenModule, onSeeReport }: {
  solved: string[]; percent: number; complete: boolean;
  onContinue: () => void; onOpenModule: (id: string) => void; onSeeReport: () => void;
}) {
  const modules = buildModuleProgress(solved);
  const started = solved.length > 0;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <Link href="/trilhas" className="inline-flex items-center gap-2 text-xs text-[#8B949E] hover:text-mint"><ArrowLeft className="size-3.5" />Todas as trilhas</Link>

      <header className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-neon">Trilha · entrega de software</p>
          <TextAnimate text="Trilha CI/CD" type="whipInUp" className="mt-3 text-4xl font-black text-off-white sm:text-5xl" />
          <p className="mt-4 max-w-2xl leading-7 text-[#AAB2BC]">Dez Labs que percorrem um pipeline de ponta a ponta: do esqueleto do build à validação pós-release. Cada Lab reúne missões práticas e uma leitura de mentor.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={complete ? onSeeReport : onContinue} className="inline-flex h-11 items-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]">
              {complete ? <><Award className="size-4" />Ver relatório de confiabilidade</> : <>{started ? "Continuar trilha" : "Começar trilha"}<ArrowRight className="size-4" /></>}
            </motion.button>
            {complete && <span className="inline-flex items-center gap-2 rounded-lg border border-neon/30 bg-neon/[.06] px-4 text-sm font-bold text-neon"><CheckCircle2 className="size-4" />Trilha concluída</span>}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#171B21] px-6 py-5 text-center">
          <p className="text-4xl font-black text-neon"><AnimatedNumber value={percent} />%</p>
          <p className="mt-1 text-xs text-[#69737E]">{solved.length}/{cicdMissions.length} missões</p>
        </div>
      </header>

      <motion.ol variants={listContainer} initial="hidden" animate="show" className="mt-10 space-y-3">
        {modules.map((entry, index) => {
          const locked = false;
          const status = entry.complete ? "done" : entry.started ? "progress" : "todo";
          return (
            <motion.li key={entry.module.id} variants={listItem}>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.995 }} onClick={() => onOpenModule(entry.module.id)} className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition sm:gap-5 ${status === "done" ? "border-neon/30 bg-neon/[.04]" : "border-white/10 bg-[#171B21] hover:border-white/25"}`}>
                <div className="relative flex flex-col items-center">
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${status === "done" ? "bg-neon text-[#101319]" : status === "progress" ? "bg-[#9BC0F5]/15 text-[#9BC0F5]" : "bg-white/5 text-[#69737E]"}`}>
                    {status === "done" ? <Check className="size-5" /> : entry.module.index}
                  </span>
                  {index < modules.length - 1 && <span className="absolute top-full h-3 w-px bg-white/10" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-neon">Lab {String(entry.module.index).padStart(2, "0")}</p>
                    <h2 className="text-base font-black text-off-white">{entry.module.name}</h2>
                    {status === "progress" && <span className="rounded-full bg-[#9BC0F5]/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#9BC0F5]">Em curso</span>}
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-[#8B949E]">{entry.module.summary}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs font-bold text-[#69737E]">{entry.solved}/{entry.total}</span>
                  {locked ? <Lock className="size-4 text-[#69737E]" /> : <ChevronRight className="size-5 text-[#69737E] transition group-hover:translate-x-0.5 group-hover:text-mint" />}
                </div>
              </motion.button>
            </motion.li>
          );
        })}
      </motion.ol>
    </main>
  );
}

// ---------- Workspace de missão ----------

function Workspace({ active, solved, onSelectMission, onSolve, onBack, complete, onSeeReport }: {
  active: CicdMission; solved: string[]; onSelectMission: (id: string) => void;
  onSolve: (id: string) => void; onBack: () => void; complete: boolean; onSeeReport: () => void;
}) {
  const modules = buildModuleProgress(solved);
  const activeModule = cicdModules.find((module) => module.id === active.moduleId);
  const moduleMissions = getModuleMissions(active.moduleId);

  return (
    <main className="mx-auto grid max-w-[1500px] gap-6 px-5 py-7 sm:px-8 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-2 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-1">
        <button onClick={onBack} className="mb-2 inline-flex items-center gap-2 text-xs text-[#8B949E] hover:text-mint"><ArrowLeft className="size-3.5" />Trilha CI/CD</button>
        {modules.map((entry) => {
          const isActive = entry.module.id === active.moduleId;
          return (
            <button key={entry.module.id} onClick={() => onSelectMission((entry.missions.find((m) => !solved.includes(m.id)) ?? entry.missions[0]).id)} className={`block w-full rounded-xl border p-3 text-left transition ${isActive ? "border-neon/40 bg-neon/[.05]" : "border-white/10 bg-[#171B21] hover:border-white/20"}`}>
              <div className="flex items-center gap-2">
                <span className={`flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-black ${entry.complete ? "bg-neon text-[#101319]" : "bg-white/5 text-[#69737E]"}`}>{entry.complete ? <Check className="size-3.5" /> : entry.module.index}</span>
                <p className={`min-w-0 flex-1 truncate text-sm font-bold ${isActive ? "text-off-white" : "text-[#AAB2BC]"}`}>{entry.module.name}</p>
                <span className="text-[10px] font-bold text-[#69737E]">{entry.solved}/{entry.total}</span>
              </div>
            </button>
          );
        })}
        {complete && <button onClick={onSeeReport} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-neon/30 bg-neon/[.06] p-3 text-xs font-black text-neon"><Award className="size-4" />Relatório de confiabilidade</button>}
      </aside>

      <section className="min-w-0">
        {moduleMissions.length > 1 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#69737E]">Lab {String(activeModule?.index ?? 0).padStart(2, "0")} · {moduleMissions.length} missões</span>
            <div className="flex flex-wrap gap-1.5">
              {moduleMissions.map((mission, index) => (
                <button key={mission.id} onClick={() => onSelectMission(mission.id)} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${mission.id === active.id ? "border-neon/40 bg-neon/[.06] text-neon" : "border-white/10 text-[#AAB2BC] hover:border-white/25"}`}>
                  {solved.includes(mission.id) ? <CheckCircle2 className="size-3.5 text-neon" /> : <CircleDot className="size-3.5 text-[#69737E]" />}
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div key={active.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <MissionPanel mission={active} module={activeModule} solved={solved.includes(active.id)} onSolve={() => onSolve(active.id)} />
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}

function MissionPanel({ mission, module, solved, onSolve }: { mission: CicdMission; module: ReturnType<typeof cicdModules.find>; solved: boolean; onSolve: () => void }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#12161C]">
      <header className="border-b border-white/10 bg-white/[.02] p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[.15em] text-[#69737E]">
          <GitBranch className="size-3.5 text-neon" />
          {module?.name}
          <ChevronRight className="size-3" />
          <span className={levelTone[mission.level]}>{mission.level}</span>
          {solved && <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-neon/15 px-2.5 py-1 text-[10px] text-neon"><CheckCircle2 className="size-3" />Resolvido</span>}
        </div>
        <h1 className="mt-4 text-2xl font-black leading-tight text-off-white sm:text-3xl">{mission.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#AAB2BC]">{mission.context}</p>
      </header>

      <div className="p-6 sm:p-8">
        <div className="rounded-xl border border-mint/20 bg-mint/[.04] p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-mint">Sua tarefa</p>
          <p className="mt-2 text-base font-bold leading-7 text-off-white">{mission.question}</p>
        </div>

        <div className="mt-6">
          {mission.kind === "order" && <OrderMission mission={mission} onSolve={onSolve} />}
          {mission.kind === "diagnose" && <DiagnoseMission mission={mission} onSolve={onSolve} />}
          {mission.kind === "yaml" && <YamlMission mission={mission} onSolve={onSolve} />}
          {mission.kind === "gate" && <GateMission mission={mission} onSolve={onSolve} />}
          {mission.kind === "decision" && <DecisionMission mission={mission} onSolve={onSolve} />}
        </div>
        {solved && <MentorNote note={mission.mentorNote} />}
      </div>

      <footer className="border-t border-white/5 px-6 pb-6 sm:px-8">
        <div className="mt-5 flex flex-wrap gap-2">
          {mission.competencies.map((item) => (
            <span key={item} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-[#AAB2BC]">{item}</span>
          ))}
        </div>
      </footer>
    </article>
  );
}

// ---------- Conclusão + evidência ----------

function Completion({ solved, onBack, onReset }: { solved: string[]; onBack: () => void; onReset: () => void }) {
  const report = useMemo(() => buildReliabilityReport(solved), [solved]);
  const modules = buildModuleProgress(solved);
  const competencies = useMemo(() => Array.from(new Set(cicdMissions.filter((m) => solved.includes(m.id)).flatMap((m) => m.competencies))).sort((a, b) => a.localeCompare(b, "pt-BR")), [solved]);
  const complete = isCicdComplete(solved);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard indisponível */ }
  }

  function download() {
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio-confiabilidade-cicd.md";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-xs text-[#8B949E] hover:text-mint"><ArrowLeft className="size-3.5" />Trilha CI/CD</button>

      <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-8 rounded-3xl border border-neon/20 bg-neon/[.04] p-8 text-center">
        <motion.span initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 12, stiffness: 220, delay: 0.1 }} className="inline-flex size-14 items-center justify-center rounded-2xl bg-neon text-[#101319]">{complete ? <PartyPopper className="size-7" /> : <Award className="size-7" />}</motion.span>
        <TextAnimate text={complete ? "Trilha CI/CD concluída" : "Seu progresso na Trilha CI/CD"} type="calmInUp" className="mt-5 flex-wrap justify-center text-3xl font-black text-off-white sm:text-4xl" />
        <p className="mx-auto mt-3 max-w-xl leading-7 text-[#AAB2BC]">{complete ? "Você percorreu o pipeline de ponta a ponta. Abaixo está o relatório de confiabilidade — sua evidência de que sabe tomar decisões de entrega." : "Conclua todas as missões para fechar a trilha. Você já pode exportar o que demonstrou até aqui."}</p>
      </motion.header>

      <motion.div variants={listContainer} initial="hidden" animate="show" className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat value={<><AnimatedNumber value={modules.filter((m) => m.complete).length} />/{cicdModules.length}</>} label="Labs concluídos" />
        <Stat value={<><AnimatedNumber value={solved.length} />/{cicdMissions.length}</>} label="Missões resolvidas" />
        <Stat value={<AnimatedNumber value={competencies.length} />} label="Competências exercitadas" />
      </motion.div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-[#12161C]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-2"><Terminal className="size-4 text-neon" /><span className="font-mono text-xs text-[#8B949E]">relatorio-confiabilidade-cicd.md</span></div>
          <div className="flex gap-2">
            <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-[#AAB2BC] hover:border-mint/30 hover:text-mint">{copied ? <><Check className="size-3.5 text-neon" />Copiado</> : <><Copy className="size-3.5" />Copiar</>}</button>
            <button onClick={download} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-[#AAB2BC] hover:border-mint/30 hover:text-mint"><Download className="size-3.5" />Baixar</button>
          </div>
        </div>
        <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap px-5 py-4 font-mono text-[12px] leading-6 text-[#AAB2BC]">{report}</pre>
      </section>

      {competencies.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#69737E]">Competências exercitadas</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {competencies.map((item) => <span key={item} className="rounded-lg border border-white/10 bg-[#171B21] px-2.5 py-1.5 text-xs text-[#AAB2BC]">{item}</span>)}
          </div>
        </section>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button onClick={onBack} className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 px-5 text-sm font-bold text-off-white hover:border-mint/30 hover:text-mint">Revisar a trilha</button>
        <Link href="/lab/competencias" className="inline-flex h-11 items-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]"><ShieldCheck className="size-4" />Ver no mapa de competências</Link>
        {complete && <button onClick={onReset} className="inline-flex h-11 items-center gap-1.5 px-2 text-xs font-bold text-[#69737E] hover:text-coral"><RotateCcw className="size-3.5" />Refazer trilha do zero</button>}
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return <motion.div variants={listItem} className="rounded-2xl border border-white/10 bg-[#171B21] px-5 py-4 text-center"><p className="text-3xl font-black text-neon">{value}</p><p className="mt-1 text-xs text-[#69737E]">{label}</p></motion.div>;
}

// ---------- Componentes de missão ----------

function MentorNote({ note }: { note: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-neon/20 bg-neon/[.04] p-5">
      <p className="text-xs font-black uppercase tracking-wider text-neon">Revisão de mentor</p>
      <p className="mt-3 text-sm leading-7 text-[#AAB2BC]">{note}</p>
    </div>
  );
}

function VerifyButton({ disabled, label = "Verificar", onClick }: { disabled?: boolean; label?: string; onClick: () => void }) {
  return (
    <motion.button whileHover={{ scale: disabled ? 1 : 1.03 }} whileTap={{ scale: disabled ? 1 : 0.96 }} onClick={onClick} disabled={disabled} className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319] disabled:cursor-not-allowed disabled:opacity-40">
      {label}
    </motion.button>
  );
}

function OrderMission({ mission, onSolve }: { mission: Extract<CicdMission, { kind: "order" }>; onSolve: () => void }) {
  const [order, setOrder] = useState(() => {
    const correct = mission.steps.map((step) => step.id).join();
    let next = shuffle(mission.steps);
    let guard = 0;
    while (next.map((step) => step.id).join() === correct && guard++ < 12) next = shuffle(mission.steps);
    return next;
  });
  const [result, setResult] = useState<null | boolean>(null);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    setOrder((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setResult(null);
  }

  function verify() {
    const ok = isOrderSolved(mission, order.map((step) => step.id));
    setResult(ok);
    if (ok) onSolve();
  }

  return (
    <div>
      <ol className="space-y-2">
        {order.map((step, index) => (
          <li key={step.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#171B21] p-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-black text-[#9BC0F5]">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-off-white">{step.label}</p>
              {result === false && <p className="mt-0.5 text-[11px] leading-4 text-[#69737E]">{step.hint}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => move(index, -1)} disabled={index === 0} className="flex size-7 items-center justify-center rounded-md border border-white/10 text-[#8B949E] hover:text-mint disabled:opacity-30" aria-label="Subir"><ArrowUp className="size-3.5" /></button>
              <button onClick={() => move(index, 1)} disabled={index === order.length - 1} className="flex size-7 items-center justify-center rounded-md border border-white/10 text-[#8B949E] hover:text-mint disabled:opacity-30" aria-label="Descer"><ArrowDown className="size-3.5" /></button>
            </div>
          </li>
        ))}
      </ol>
      <VerifyButton onClick={verify} label="Verificar ordem" />
      {result === false && <p className="mt-4 inline-flex items-center gap-2 text-sm text-coral"><RotateCcw className="size-4" />Ainda não. Use as dicas que apareceram em cada etapa e reordene.</p>}
    </div>
  );
}

function ChoiceList({ options, selected, onSelect, revealed, correctOf }: {
  options: { id: string; label: string; feedback: string }[];
  selected: string | null;
  onSelect: (id: string) => void;
  revealed: boolean;
  correctOf: (id: string) => "correct" | "ok" | "wrong";
}) {
  return (
    <div role="radiogroup" className="space-y-2">
      {options.map((option) => {
        const verdict = correctOf(option.id);
        const isSelected = selected === option.id;
        const show = revealed && (isSelected || verdict === "correct");
        const border = !show ? (isSelected ? "border-[#9BC0F5]/50 bg-[#9BC0F5]/[.06]" : "border-white/10 bg-[#171B21] hover:border-white/20")
          : verdict === "correct" ? "border-neon/50 bg-neon/[.06]"
          : verdict === "ok" ? "border-[#F0C040]/50 bg-[#F0C040]/[.06]"
          : "border-coral/50 bg-coral/[.06]";
        return (
          <button key={option.id} role="radio" aria-checked={isSelected} onClick={() => onSelect(option.id)} disabled={revealed} className={`block w-full rounded-xl border p-4 text-left transition ${border} disabled:cursor-default`}>
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-[#9BC0F5]" : "border-white/30"}`}>{isSelected && <span className="size-2 rounded-full bg-[#9BC0F5]" />}</span>
              <span className="text-sm font-semibold leading-6 text-off-white">{option.label}</span>
            </div>
            {show && <p className={`mt-2 pl-7 text-xs leading-6 ${verdict === "correct" ? "text-neon" : verdict === "ok" ? "text-[#F0C040]" : "text-coral"}`}>{option.feedback}</p>}
          </button>
        );
      })}
    </div>
  );
}

function DiagnoseMission({ mission, onSolve }: { mission: Extract<CicdMission, { kind: "diagnose" }>; onSolve: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = isChoiceCorrect(mission.options, selected);

  return (
    <div>
      <LogView lines={mission.log} />
      <div className="mt-5">
        <ChoiceList options={mission.options} selected={selected} onSelect={(id) => { setSelected(id); setRevealed(false); }} revealed={revealed} correctOf={(id) => mission.options.find((o) => o.id === id)?.correct ? "correct" : "wrong"} />
      </div>
      <VerifyButton disabled={!selected} onClick={() => { setRevealed(true); if (correct) onSolve(); }} label="Confirmar diagnóstico" />
      {revealed && !correct && <p className="mt-4 inline-flex items-center gap-2 text-sm text-coral"><RotateCcw className="size-4" />Reveja o log com atenção e tente outra hipótese.</p>}
    </div>
  );
}

function YamlMission({ mission, onSolve }: { mission: Extract<CicdMission, { kind: "yaml" }>; onSolve: () => void }) {
  const [text, setText] = useState(mission.yaml);
  const [result, setResult] = useState<ReturnType<typeof validateYamlEdit> | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const solved = result?.solved ?? false;

  function validate() {
    const next = validateYamlEdit(mission, text);
    setResult(next);
    if (next.solved) onSolve();
  }

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A0D12] focus-within:border-mint/30">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[.03] px-4 py-2">
          <div className="flex items-center gap-2"><Terminal className="size-3.5 text-[#69737E]" /><span className="font-mono text-[11px] text-[#8B949E]">.github/workflows/ci.yml</span></div>
          <button onClick={() => { setText(mission.yaml); setResult(null); }} className="inline-flex items-center gap-1 text-[11px] text-[#69737E] hover:text-mint"><RotateCcw className="size-3" />Restaurar</button>
        </div>
        <textarea
          value={text}
          onChange={(event) => { setText(event.target.value); setResult(null); }}
          spellCheck={false}
          rows={Math.max(8, text.split("\n").length + 1)}
          aria-label="Editor do workflow YAML"
          className="block w-full resize-y bg-transparent px-4 py-3 font-mono text-[12px] leading-6 text-[#AAB2BC] outline-none"
        />
      </div>
      <p className="mt-3 text-xs leading-6 text-[#69737E]">💡 {mission.bugHint}</p>
      <VerifyButton onClick={validate} label="Validar workflow" />
      {result && !result.solved && (
        <p className="mt-4 inline-flex items-start gap-2 text-sm text-coral"><RotateCcw className="mt-0.5 size-4 shrink-0" /><span>{result.message} <span className="text-[#69737E]">({result.passed}/{result.total} checagens passaram)</span></span></p>
      )}
      {solved && (
        <div className="mt-4">
          <button onClick={() => setShowSolution((value) => !value)} className="text-xs font-bold text-mint hover:underline">{showSolution ? "Ocultar" : "Ver"} solução de referência</button>
          {showSolution && <div className="mt-3"><LogView lines={mission.solution.split("\n")} label="solução de referência" tone="yaml" /></div>}
        </div>
      )}
    </div>
  );
}

function DecisionMission({ mission, onSolve }: { mission: Extract<CicdMission, { kind: "decision" }>; onSolve: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const best = isDecisionBest(mission.options, selected);

  return (
    <div>
      <ChoiceList
        options={mission.options}
        selected={selected}
        onSelect={(id) => { setSelected(id); setRevealed(false); }}
        revealed={revealed}
        correctOf={(id) => { const v = mission.options.find((o) => o.id === id)?.verdict; return v === "best" ? "correct" : v === "ok" ? "ok" : "wrong"; }}
      />
      <VerifyButton disabled={!selected} onClick={() => { setRevealed(true); if (best) onSolve(); }} label="Tomar decisão" />
      {revealed && !best && <p className="mt-4 inline-flex items-center gap-2 text-sm text-[#F0C040]"><RotateCcw className="size-4" />Há uma decisão melhor para conter o impacto. Releia os trade-offs e tente outra.</p>}
    </div>
  );
}

function GateMission({ mission, onSolve }: { mission: Extract<CicdMission, { kind: "gate" }>; onSolve: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const result = useMemo(() => scoreGate(mission.options, selected), [mission.options, selected]);

  function toggle(id: string) {
    if (revealed) return;
    setSelected((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  }

  return (
    <div>
      <div role="group" className="space-y-2">
        {mission.options.map((option) => {
          const isSelected = selected.includes(option.id);
          const show = revealed;
          const correctChoice = option.recommended === isSelected;
          const border = !show ? (isSelected ? "border-mint/40 bg-mint/[.05]" : "border-white/10 bg-[#171B21] hover:border-white/20")
            : correctChoice ? "border-neon/40 bg-neon/[.05]" : "border-coral/40 bg-coral/[.05]";
          return (
            <button key={option.id} aria-pressed={isSelected} onClick={() => toggle(option.id)} disabled={revealed} className={`block w-full rounded-xl border p-4 text-left transition ${border} disabled:cursor-default`}>
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border ${isSelected ? "border-mint bg-mint text-[#101319]" : "border-white/30"}`}>{isSelected && <Check className="size-3" />}</span>
                <div className="min-w-0">
                  <span className="text-sm font-semibold leading-6 text-off-white">{option.label}</span>
                  {show && <p className={`mt-1 text-xs leading-6 ${option.recommended ? "text-neon" : "text-coral"}`}>{option.recommended ? "Recomendado · " : "Deixe de fora · "}{option.feedback}</p>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <VerifyButton disabled={!selected.length} onClick={() => { setRevealed(true); if (result.solved) onSolve(); }} label="Avaliar gates" />
      {revealed && (
        <p className={`mt-4 text-sm ${result.solved ? "text-neon" : "text-[#F0C040]"}`}>
          {result.matched}/{result.total} decisões corretas. {result.solved ? "Conjunto equilibrado." : "Ajuste as marcações usando o feedback e avalie de novo."}
        </p>
      )}
    </div>
  );
}

function LogView({ lines, label = "build.log", tone = "log" }: { lines: string[]; label?: string; tone?: "log" | "yaml" }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A0D12]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[.03] px-4 py-2">
        <Terminal className="size-3.5 text-[#69737E]" />
        <span className="font-mono text-[11px] text-[#8B949E]">{label}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12px] leading-6">
        {lines.map((line, index) => (
          <div key={index} className={tone === "yaml" ? "text-[#AAB2BC]" : line.includes("error") || line.includes("Error") || line.includes("crashed") ? "text-coral" : line.includes("warn") ? "text-[#F0C040]" : "text-[#8B949E]"}>
            {line || " "}
          </div>
        ))}
      </pre>
    </div>
  );
}
