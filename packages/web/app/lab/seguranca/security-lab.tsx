"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { SaveGate } from "@/components/lab/save-gate";
import { securityMissions, securityProgress } from "@/lib/security-lab";
import { markSecurityMissionSolved } from "./actions";

export function SecurityLab({ initialSolved = [], authed = false }: { initialSolved?: string[]; authed?: boolean }) {
  const [solved, setSolved] = useState(initialSolved);
  const [activeId, setActiveId] = useState(() => securityMissions.find((mission) => !initialSolved.includes(mission.id))?.id ?? securityMissions[0].id);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const active = securityMissions.find((mission) => mission.id === activeId) ?? securityMissions[0];
  const progress = securityProgress(solved);
  const correct = answer === active.correctOption;

  function selectMission(id: string) {
    setActiveId(id);
    setAnswer("");
    setChecked(false);
    setSaveError(false);
  }

  async function checkAnswer() {
    setSaveError(false);
    setChecked(true);
    if (!correct || solved.includes(active.id)) return;
    if (authed) {
      try {
        const result = await markSecurityMissionSolved(active.id, answer);
        if (!result.saved) {
          setSaveError(true);
          return;
        }
      } catch {
        setSaveError(true);
        return;
      }
    } else {
      setShowGate(true);
    }
    setSolved((current) => current.includes(active.id) ? current : [...current, active.id]);
  }

  const next = securityMissions.find((mission) => !solved.includes(mission.id) && mission.id !== active.id);

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <Link href="/lab" className="inline-flex items-center gap-2 text-xs text-[#8B949E]"><ArrowLeft className="size-3.5" /> Meu Lab</Link>
    <header className="mt-8 grid gap-6 md:grid-cols-[1fr_18rem] md:items-end">
      <div>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#9BC0F5]"><ShieldCheck className="size-4" /> Security Lab · sandbox local</p>
        <h1 className="mt-3 text-4xl font-black text-off-white sm:text-5xl">Segurança aplicada a QA</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#AAB2BC]">Decida como testar autenticação, autorização, dados, APIs e resposta a falhas usando cenários simulados. Nenhum sistema externo é acessado.</p>
      </div>
      <section className="rounded-xl border border-[#9BC0F5]/20 bg-[#9BC0F5]/[.05] p-5" aria-label="Progresso do Security Lab">
        <div className="flex justify-between text-xs"><span className="font-bold text-[#AAB2BC]">Missões concluídas</span><span className="font-mono text-[#9BC0F5]">{progress.solved}/{progress.total}</span></div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#9BC0F5] transition-all" style={{ width: `${progress.percent}%` }} /></div>
      </section>
    </header>

    <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
      <nav aria-label="Missões de segurança" className="grid content-start gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {securityMissions.map((mission, index) => <button key={mission.id} type="button" onClick={() => selectMission(mission.id)} aria-current={active.id === mission.id ? "step" : undefined} className={`rounded-xl border p-3 text-left transition ${active.id === mission.id ? "border-[#9BC0F5]/45 bg-[#9BC0F5]/[.08]" : "border-white/10 bg-[#171B21] hover:border-white/20"}`}>
          <span className="flex items-center justify-between gap-2"><span className="text-[10px] font-mono text-[#69737E]">{String(index + 1).padStart(2, "0")} · {mission.level}</span>{solved.includes(mission.id) && <CheckCircle2 className="size-3.5 text-neon" />}</span>
          <strong className="mt-1 block text-xs text-off-white">{mission.title}</strong>
          <span className="mt-1 block text-[10px] text-[#8B949E]">{mission.module}</span>
        </button>)}
      </nav>

      <section className="rounded-2xl border border-white/10 bg-[#171B21] p-5 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[#9BC0F5]">{active.module} · {active.level}</p>
        <h2 className="mt-2 text-2xl font-black text-off-white">{active.title}</h2>
        <p className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4 text-sm leading-7 text-[#AAB2BC]">{active.context}</p>
        <fieldset className="mt-6">
          <legend className="text-sm font-bold text-off-white">{active.question}</legend>
          <div className="mt-3 grid gap-2">
            {active.options.map((option) => <label key={option.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-6 ${checked && option.id === active.correctOption ? "border-neon/40 bg-neon/[.05]" : "border-white/10 hover:border-white/20"}`}>
              <input type="radio" name={`security-${active.id}`} value={option.id} checked={answer === option.id} onChange={() => { setAnswer(option.id); setChecked(false); }} className="mt-1 accent-[#9BC0F5]" />
              <span className="text-[#C4CBD3]">{option.label}</span>
            </label>)}
          </div>
        </fieldset>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => void checkAnswer()} disabled={!answer || (checked && correct && !saveError)} className="h-10 rounded-lg bg-[#9BC0F5] px-4 text-xs font-black text-[#101319] disabled:opacity-50">{solved.includes(active.id) ? "Missão concluída" : saveError ? "Tentar salvar novamente" : "Conferir decisão"}</button>
          {checked && correct && next && <button type="button" onClick={() => selectMission(next.id)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 px-4 text-xs font-bold text-off-white">Próxima missão <ArrowRight className="size-3.5" /></button>}
        </div>

        {checked && <div role="status" aria-live="polite" className={`mt-5 rounded-xl border p-4 ${correct ? "border-neon/20 bg-neon/[.04]" : "border-coral/20 bg-coral/[.04]"}`}>
          <p className={`text-sm font-bold ${correct ? "text-neon" : "text-coral"}`}>{correct ? "Decisão alinhada ao cenário." : "Revise o risco e tente outra opção."}</p>
          <p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{active.feedback}</p>
          <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-[#9BC0F5]">Princípio: {active.principle}</p>
        </div>}
        {saveError && <p role="alert" className="mt-4 rounded-lg border border-coral/25 bg-coral/[.05] p-3 text-xs leading-5 text-coral">A decisão está correta, mas não foi possível salvar o progresso. Tente novamente; sua missão não foi marcada como concluída.</p>}
      </section>
    </div>

    <SaveGate show={showGate} next="/lab/seguranca" onDismiss={() => setShowGate(false)} />
  </main>;
}
