import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
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
  return <main className="mx-auto max-w-4xl px-5 py-10 text-off-white sm:px-8 sm:py-14">
    <Link href="/conteudo" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-mint hover:text-neon"><ArrowLeft aria-hidden="true" className="size-4" /> Todos os temas</Link>
    <header className="mt-7 max-w-[72ch]">
      <h1 className="text-3xl font-black tracking-[-.03em] sm:text-4xl">Uma jornada para usar do início ao fim.</h1>
      <p className="mt-4 text-base leading-7 text-[#C8CFD7]">Use o mesmo caso fictício em todas as missões. Assim, cada aula acrescenta uma pergunta de QA ao que você já observou no Broto.</p>
      <a href={brotoSpaceSite.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 bg-mint px-5 text-sm font-bold text-[#101319] hover:bg-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">Abrir o Broto <ArrowUpRight aria-hidden="true" className="size-4" /></a>
    </header>

    <section className="mt-12 border-t border-white/15 pt-8" aria-labelledby="preparo-broto">
      <h2 id="preparo-broto" className="text-2xl font-bold">Prepare sua conta e os dados</h2>
      <p className="mt-3 max-w-[72ch] text-sm leading-6 text-[#C8CFD7]">{brotoTrainingCase.account} Identifique seus registros com <strong className="text-off-white">{brotoTrainingCase.label}</strong> para encontrá-los de novo.</p>
      <CareerTemplate label="Textos fictícios para copiar" text={seedText} />
      <p className="mt-3 text-xs leading-5 text-[#AAB2BC]">Use os recursos que estiverem disponíveis na sua conta. Se uma ligação entre registros não existir, anote a observação; não presuma que a interface deveria oferecê-la.</p>
    </section>

    <section className="mt-12 border-t border-white/15 pt-8" aria-labelledby="jornada-broto">
      <h2 id="jornada-broto" className="text-2xl font-bold">Percorra a jornada</h2>
      <ol className="mt-6 divide-y divide-white/10">{brotoTrainingCase.stages.map((stage, index) => <li key={stage.title} className="grid gap-2 py-5 sm:grid-cols-[2rem_1fr]"><span className="font-bold tabular-nums text-mint">{index + 1}.</span><div><h3 className="text-lg font-bold">{stage.title}</h3><p className="mt-2 text-sm leading-6 text-[#C8CFD7]">{stage.action}</p><p className="mt-2 text-sm leading-6 text-[#AAB2BC]"><strong className="text-off-white">Observe:</strong> {stage.observe}</p><p className="mt-1 text-sm leading-6 text-[#AAB2BC]"><strong className="text-off-white">Guarde:</strong> {stage.evidence}</p></div></li>)}</ol>
      <CareerTemplate label="Nota curta de evidência" text={brotoTrainingCase.noteTemplate} />
    </section>

    <section className="mt-12 border-t border-white/15 pt-8" aria-labelledby="missoes-broto">
      <h2 id="missoes-broto" className="text-2xl font-bold">Use este caso nas missões</h2>
      <p className="mt-2 text-sm leading-6 text-[#AAB2BC]">O caso continua o mesmo; o olhar de QA muda a cada tema.</p>
      <div className="mt-5 divide-y divide-white/10">{mentorshipThemes.map((theme) => <div key={theme.id} className="grid gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:gap-6"><div><h3 className="font-bold">{theme.title}</h3><p className="mt-1 text-xs leading-5 text-[#AAB2BC]">{theme.summary}</p></div><div className="flex flex-col items-start gap-2">{getThemeUnits(theme).map((unit, index) => <Link key={unit.number} href={contentStepHref(unit.number, "desafio")} className="inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-mint hover:text-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">Missão {index + 1}: {unit.assignment.title}<ArrowRight aria-hidden="true" className="size-3.5 shrink-0" /></Link>)}</div></div>)}</div>
    </section>
  </main>;
}
