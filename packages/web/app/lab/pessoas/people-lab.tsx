"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Brain, CalendarDays, CheckCircle2, History, MessageSquareText, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { TextAnimate } from "@/components/ui/text-animate";
import { SaveGate } from "@/components/lab/save-gate";
import { savePeopleAttempt } from "./actions";
import { getDailyPeopleScenario, type PeopleAttempt, type PeopleScenario } from "@/lib/people-scenarios";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const chip = { hidden: { opacity: 0, y: 8, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, damping: 16, stiffness: 260 } } };

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function PeopleLab({ initialAttempts = [], authed = false }: { initialAttempts?: PeopleAttempt[]; authed?: boolean }) {
  const scenario: PeopleScenario = getDailyPeopleScenario();
  const [attempts, setAttempts] = useState<PeopleAttempt[]>(initialAttempts);
  const [response, setResponse] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [reflections, setReflections] = useState<string[]>([]);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const todaysAttempt = initialAttempts.find((item) => item.scenarioId === scenario.id && item.createdAt.startsWith(todayKey()));
    if (todaysAttempt) {
      setResponse(todaysAttempt.response);
      setRevealed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = response.trim();
    setAttempts((current) => [{ scenarioId: scenario.id, response: trimmed, createdAt: new Date().toISOString() }, ...current].slice(0, 100));
    if (authed) void savePeopleAttempt(scenario.id, trimmed);
    else setShowGate(true);
    setRevealed(true);
  }

  function toggle(item: string) {
    setReflections((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#8B949E]">
        <ArrowLeft className="size-3.5" />
        QA Lab
      </Link>

      <header className="mt-8 grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#9BC0F5]">People Lab · situação do dia</p>
          <TextAnimate text="O que você faria hoje?" type="whipInUp" className="mt-3 flex-wrap text-4xl font-black text-off-white sm:text-5xl" />
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#AAB2BC]">
            Uma situação realista por dia para treinar comunicação, negociação, postura profissional e decisão em cenários que um QA encontra no trabalho.
          </p>
        </div>

        <div className="rounded-xl border border-[#7BA7E8]/25 bg-[#7BA7E8]/[.06] px-5 py-4">
          <CalendarDays className="size-5 text-[#9BC0F5]" />
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9BC0F5]">Disponível hoje</p>
          <p className="mt-1 text-sm leading-6 text-[#AAB2BC]">A próxima situação entra amanhã.</p>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="overflow-hidden rounded-3xl border border-[#7BA7E8]/25 bg-[#151A20]">
          <div className="border-b border-white/10 bg-[#7BA7E8]/[.06] p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#7BA7E8]/15 px-2.5 py-1 text-[10px] font-black uppercase text-[#9BC0F5]">{scenario.category}</span>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] uppercase text-[#8B949E]">{scenario.level}</span>
            </div>
            <h2 className="mt-5 text-3xl font-black leading-tight text-off-white">{scenario.title}</h2>
            <p className="mt-4 text-base leading-8 text-[#AAB2BC]">{scenario.context}</p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="space-y-6">
              <Block label="Situação" text={scenario.situation} />
              <Block label="Pressão real" text={scenario.pressure} tone="coral" />
            </div>

            <div className="mt-8 rounded-xl border border-mint/20 bg-mint/[.04] p-5">
              <MessageSquareText className="size-5 text-mint" />
              <h3 className="mt-3 text-lg font-black leading-7 text-off-white">{scenario.question}</h3>
            </div>

            <AnimatePresence mode="wait">
              {!revealed ? (
                <motion.form key="form" onSubmit={submit} className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <label className="text-xs font-bold text-[#AAB2BC]">
                    Sua resposta
                    <textarea
                      required
                      minLength={120}
                      value={response}
                      onChange={(event) => setResponse(event.target.value)}
                      rows={9}
                      placeholder="Responda como se estivesse no Slack, na daily ou numa conversa com Produto/Dev. Explique fatos, risco, decisão e próximo passo..."
                      className="field mt-2 w-full resize-y text-base leading-7"
                    />
                  </label>
                  <div className="mt-2 flex justify-between text-[10px] text-[#69737E]">
                    <span>Mínimo de 120 caracteres</span>
                    <span>{response.length}</span>
                  </div>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319]">
                    Revisar minha decisão
                    <ArrowRight className="size-4" />
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div key="review" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Review scenario={scenario} reflections={reflections} toggle={toggle} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-white/10 bg-[#171B21] p-5">
            <Users className="size-5 text-[#9BC0F5]" />
            <h2 className="mt-3 font-black text-off-white">Competências treinadas</h2>
            <motion.div variants={stagger} initial="hidden" animate="show" className="mt-4 flex flex-wrap gap-2">
              {scenario.competencies.map((item) => (
                <motion.span variants={chip} key={item} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-[#AAB2BC]">{item}</motion.span>
              ))}
            </motion.div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#171B21] p-5">
            <History className="size-5 text-mint" />
            <h2 className="mt-3 font-black text-off-white">Histórico recente</h2>
            <div className="mt-4 space-y-3">
              {attempts.slice(0, 5).map((attempt) => (
                <div key={`${attempt.scenarioId}-${attempt.createdAt}`} className="flex gap-2 text-xs">
                  <CheckCircle2 className="size-3.5 shrink-0 text-neon" />
                  <div>
                    <p className="font-bold text-[#AAB2BC]">{attempt.scenarioId === scenario.id ? scenario.title : "Situação anterior"}</p>
                    <time className="text-[10px] text-[#69737E]">{new Date(attempt.createdAt).toLocaleDateString("pt-BR")}</time>
                  </div>
                </div>
              ))}
              {!attempts.length && <p className="text-xs leading-5 text-[#69737E]">Sua resposta de hoje aparecerá aqui depois da revisão.</p>}
            </div>
          </section>
        </aside>
      </div>

      <SaveGate show={showGate} next="/lab/pessoas" onDismiss={() => setShowGate(false)} />
    </main>
  );
}

function Review({ scenario, reflections, toggle }: { scenario: PeopleScenario; reflections: string[]; toggle: (item: string) => void }) {
  return (
    <div className="mt-7">
      <div className="rounded-2xl border border-neon/20 bg-neon/[.04] p-5">
        <Brain className="size-5 text-neon" />
        <h3 className="mt-3 font-black text-off-white">Revisão de mentor</h3>
        <p className="mt-3 text-sm leading-7 text-[#AAB2BC]">{scenario.mentorNote}</p>
        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-neon">Uma resposta madura considera</p>
        <div className="mt-3 space-y-2">
          {scenario.considerations.map((item) => (
            <label key={item} className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 p-3 text-sm leading-6 text-[#AAB2BC]">
              <input type="checkbox" checked={reflections.includes(item)} onChange={() => toggle(item)} className="mt-1 size-4 accent-[#D7FF64]" />
              {item}
            </label>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs leading-6 text-[#69737E]">Você já concluiu a situação de hoje. Volte amanhã para um novo caso.</p>
    </div>
  );
}

function Block({ label, text, tone = "mint" }: { label: string; text: string; tone?: "mint" | "coral" }) {
  return (
    <div>
      <p className={`text-[10px] font-black uppercase tracking-[.2em] ${tone === "coral" ? "text-coral" : "text-mint"}`}>{label}</p>
      <p className="mt-2 text-base leading-8 text-[#AAB2BC]">{text}</p>
    </div>
  );
}
