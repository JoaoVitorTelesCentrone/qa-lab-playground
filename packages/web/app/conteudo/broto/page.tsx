import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sprout } from "lucide-react";
import { CareerTemplate } from "@/components/mentorship/career-toolkit";
import { brotoSpaceSite } from "@/lib/mentorship/brotospace-track";
import { brotoTrainingCase } from "@/lib/mentorship/broto-training-case";
import { getThemeUnits, mentorshipThemes } from "@/lib/mentorship/themes";
import { contentStepHref } from "@/lib/mentorship/content-steps";

export const metadata = {
  title: "Caso de treino no Broto Space | QA Lab",
  description: "Uma jornada fictícia para praticar QA no Broto Space ao longo da mentoria.",
};

const seedText = brotoTrainingCase.seed.map((entry) => `${entry.label}: ${entry.text}`).join("\n\n");

export default function BrotoTrainingPage() {
  return <main className="ca-shell ca-interior">
    <Link href="/conteudo" className="ca-back"><ArrowLeft aria-hidden="true" className="size-4" /> Mapa de módulos</Link>
    <header className="ca-interior-hero">
      <div><span className="ca-kicker"><Sprout aria-hidden="true" className="size-4" /> Caso de treino / Broto Space</span><h1 className="mt-5">Uma história. Sete olhares de QA.</h1><p>Use o mesmo pensamento fictício em cada missão. Primeiro observe a jornada; depois volte a ela com novas perguntas sobre risco, teste, automação e evidência.</p><a href={brotoSpaceSite.url} target="_blank" rel="noreferrer" className="ca-button mt-7">Abrir o Broto <ArrowUpRight aria-hidden="true" className="size-4" /></a></div>
      <div className="ca-hero-aside"><strong>01</strong>caso fictício<br />do início ao fim<p className="mt-4">Dados sintéticos<br />Conta de estudo<br />Evidência sem informações pessoais</p></div>
    </header>

    <section aria-labelledby="preparo-broto" className="mt-12 grid gap-7 lg:grid-cols-[minmax(0,.6fr)_minmax(0,1fr)] lg:gap-12">
      <div><span className="ca-kicker">Antes de começar</span><h2 id="preparo-broto" className="mt-4 text-3xl font-extrabold tracking-[-.05em] sm:text-4xl">Prepare sua conta e o contexto.</h2><p className="mt-4 text-sm leading-7" style={{ color: "var(--ca-muted)" }}>{brotoTrainingCase.account} Identifique os registros com <strong style={{ color: "var(--ca-text)" }}>{brotoTrainingCase.label}</strong> para encontrá-los de novo.</p><p className="mt-5 text-xs leading-6" style={{ color: "var(--ca-muted)" }}>Use os recursos disponíveis na sua conta. Se uma ligação entre registros não existir, registre a observação; não presuma que deveria estar ali.</p></div>
      <div className="ca-paper"><span className="ca-kicker" style={{ color: "var(--ca-copper)" }}>Massa de teste</span><h3 className="mt-3 text-xl font-bold">Textos prontos para usar</h3><p className="mt-2 text-sm leading-6">Copie estes dados fictícios para praticar sem expor sua vida pessoal.</p><div className="mt-5"><CareerTemplate label="Textos fictícios do caso" text={seedText} /></div></div>
    </section>

    <section aria-labelledby="jornada-broto" className="mt-16"><div className="ca-section-head"><h2 id="jornada-broto">Percorra a jornada.</h2><p>Quatro passos, uma pergunta por vez. Guarde o que a interface mostrou antes de interpretar.</p></div>
      <ol className="ca-step-list">{brotoTrainingCase.stages.map((stage, index) => <li key={stage.title}><span className="ca-step-no">{String(index + 1).padStart(2, "0")}</span><div><h3>{stage.title}</h3><p>{stage.action}</p><p><strong style={{ color: "var(--ca-text)" }}>Observe:</strong> {stage.observe}</p><p><strong style={{ color: "var(--ca-text)" }}>Guarde:</strong> {stage.evidence}</p></div></li>)}</ol>
      <div className="ca-paper mt-7"><h3 className="font-bold">Sua nota de evidência</h3><p className="mt-2 text-sm">Um registro curto ajuda outra pessoa a continuar a investigação.</p><div className="mt-4"><CareerTemplate label="Nota de evidência" text={brotoTrainingCase.noteTemplate} /></div></div>
    </section>

    <section aria-labelledby="missoes-broto" className="mt-16 pb-12"><div className="ca-section-head"><h2 id="missoes-broto">Mude o olhar. Mantenha o caso.</h2><p>O produto é o mesmo; o risco e a técnica mudam a cada tema.</p></div>
      <ol className="ca-module-list">{mentorshipThemes.map((theme, index) => <li key={theme.id} className="ca-module-row"><div className="grid gap-4 py-6 md:grid-cols-[4rem_minmax(0,1fr)_minmax(12rem,.8fr)] md:gap-6"><span className="ca-module-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3 className="ca-module-title">{theme.title}</h3><p className="ca-module-summary">{theme.summary}</p></div><div className="grid content-start gap-2">{getThemeUnits(theme).map((unit, unitIndex) => <Link key={unit.number} href={contentStepHref(unit.number, "desafio")} className="ca-text-link">Missão {unitIndex + 1}: {unit.assignment.title}<ArrowRight aria-hidden="true" className="size-4 shrink-0" /></Link>)}</div></div></li>)}</ol>
    </section>
  </main>;
}
