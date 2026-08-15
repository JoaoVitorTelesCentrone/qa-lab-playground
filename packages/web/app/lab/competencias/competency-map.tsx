"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, LockKeyhole, Target } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { TextAnimate } from "@/components/ui/text-animate";
import { DELIVERABLES_KEY, emptyDeliverables, parseDeliverables } from "@/lib/challenge-deliverables";
import { buildLearningProgress, type LearningCompetency } from "@/lib/learning-progress";
import type { PeopleAttempt } from "@/lib/people-scenarios";

const gridStagger = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
const cardItem = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 18, stiffness: 220 } } };

export function CompetencyMap({ serverCicd = [], serverPeople = [] }: { serverCicd?: string[]; serverPeople?: PeopleAttempt[] }) {
  const [competencies, setCompetencies] = useState<LearningCompetency[]>(() => buildLearningProgress(emptyDeliverables, serverPeople, serverCicd));
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { setCompetencies(buildLearningProgress(parseDeliverables(localStorage.getItem(DELIVERABLES_KEY)), serverPeople, serverCicd)); setLoaded(true); }, 0); return () => window.clearTimeout(timer); }, [serverCicd, serverPeople]);
  const overall = Math.round(competencies.reduce((total, item) => total + item.score, 0) / competencies.length);
  const practiced = competencies.filter((item) => item.score > 0).length;

  return <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><Link href="/" className="inline-flex items-center gap-2 text-xs text-[#8B949E]"><ArrowLeft className="size-3.5" />QA Lab</Link><header className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-neon">Sua evolução</p><TextAnimate text="Mapa de competências" type="whipInUp" className="mt-3 flex-wrap text-4xl font-black text-off-white sm:text-5xl" /><p className="mt-4 max-w-3xl leading-7 text-[#8B949E]">Progresso vem de evidências produzidas no laboratório. Pontos não substituem prática: cada indicador mostra de onde o avanço foi calculado.</p></div><div className="grid grid-cols-2 gap-3"><Stat label="Progresso geral" value={loaded ? <><AnimatedNumber value={overall} />%</> : "—"} /><Stat label="Áreas praticadas" value={loaded ? <><AnimatedNumber value={practiced} />/6</> : "—"} /></div></header>
    <motion.section variants={gridStagger} initial="hidden" animate="show" className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{competencies.map((item) => <motion.article variants={cardItem} key={item.id} className={`flex flex-col rounded-2xl border bg-[#171B21] p-5 ${item.available ? "border-white/10" : "border-white/[.06] opacity-75"}`}><div className="flex items-start justify-between"><div className={`flex size-9 items-center justify-center rounded-lg ${item.available ? "bg-mint/10 text-mint" : "bg-white/5 text-[#69737E]"}`}>{item.available ? <Target className="size-4" /> : <LockKeyhole className="size-4" />}</div><strong className="text-2xl font-black text-off-white"><AnimatedNumber value={item.score} />%</strong></div><h2 className="mt-5 font-black text-off-white">{item.name}</h2><p className="mt-2 text-xs text-[#69737E]">Evidência: {item.evidence}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5"><motion.div className="h-full rounded-full bg-neon" initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }} /></div><p className="mt-5 flex-1 text-sm leading-6 text-[#AAB2BC]">{item.nextAction}</p><Link href={item.href} className={`mt-5 inline-flex items-center gap-2 text-xs font-black ${item.available ? "text-mint" : "text-[#69737E]"}`}>{item.available ? "Continuar aprendendo" : "Ver roadmap"}<ArrowRight className="size-3.5" /></Link></motion.article>)}</motion.section>
    <section className="mt-10 rounded-2xl border border-neon/20 bg-neon/[.04] p-6"><Compass className="size-5 text-neon" /><h2 className="mt-3 text-xl font-black text-off-white">Como avançar</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{["Produza uma evidência no Playground", "Pratique uma decisão no People Lab", "Revise o mapa e escolha a menor competência"].map((item, index) => <div key={item} className="flex gap-3 rounded-xl border border-white/10 p-4 text-sm leading-6 text-[#AAB2BC]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-neon" /><span><strong className="text-off-white">{index + 1}.</strong> {item}</span></div>)}</div></section>
  </main>;
}

function Stat({ label, value }: { label: string; value: ReactNode }) { return <div className="rounded-xl border border-white/10 bg-[#171B21] px-5 py-4"><strong className="text-2xl font-black text-neon">{value}</strong><p className="mt-1 text-xs text-[#69737E]">{label}</p></div>; }
