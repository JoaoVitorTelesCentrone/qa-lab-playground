import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MentorshipNav } from "@/components/mentorship/mentorship-nav";
import { findMentorshipWeek, mentorshipWeeks } from "@/lib/mentorship/catalog";
import { contentStepHref, getContentSteps } from "@/lib/mentorship/content-steps";
import { getMentorshipWeekContent } from "@/lib/mentorship/curriculum";

export function generateStaticParams() {
  return mentorshipWeeks.map((week) => ({ week: String(week.number) }));
}

export async function generateMetadata({ params }: { params: Promise<{ week: string }> }) {
  const number = Number((await params).week);
  const week = findMentorshipWeek(number);
  return { title: week ? `Semana ${number}: ${week.title} | Conteúdo QA Lab` : "Conteúdo | QA Lab", description: week?.assignment.objective };
}

export default async function ContentWeekPage({ params }: { params: Promise<{ week: string }> }) {
  const number = Number((await params).week);
  const week = findMentorshipWeek(number);
  const content = getMentorshipWeekContent(number);
  if (!Number.isInteger(number) || !week || !content) notFound();
  const steps = getContentSteps(week);
  const theoryMinutes = week.lessons.reduce((total, lesson) => total + (Number.parseInt(lesson.duration, 10) || 0), 0);

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <MentorshipNav current="/mentoria/conteudo" />
    <Link href="/mentoria/conteudo" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft aria-hidden="true" className="size-4" /> Roadmap completo</Link>

    <header className="mt-9 max-w-[72ch]">
      <p className="text-sm font-bold text-mint">Semana {number} de 12</p>
      <h1 className="mt-3 text-3xl font-black tracking-[-.03em] text-off-white sm:text-4xl">{week.title}</h1>
      <p className="mt-4 text-lg leading-8 text-[#C8CFD7]">{content.promise}</p>
      <p className="mt-4 text-sm leading-6 text-[#AAB2BC]">{week.lessons.length} aulas · quiz · exemplo · desafio · cerca de {theoryMinutes} min de teoria e {week.assignment.practice.estimatedMinutes} min de prática no {week.assignment.practice.environment}</p>
    </header>

    <nav aria-label="Etapas da semana" className="mt-10 max-w-3xl border-t border-white/15">
      {steps.map((step, index) => <a key={step.slug} href={contentStepHref(number, step.slug)} className="group flex min-h-24 items-center gap-5 border-b border-white/15 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">
        <span className="flex size-10 shrink-0 items-center justify-center border border-mint/40 font-mono text-sm font-bold text-mint">{String(index + 1).padStart(2, "0")}</span>
        <span className="min-w-0 flex-1"><span className="block text-lg font-bold text-off-white group-hover:text-mint">{step.title}</span><span className="mt-1 block text-sm leading-6 text-[#AAB2BC]">{step.description}</span></span>
        <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-mint" />
      </a>)}
    </nav>

    <nav aria-label="Outras semanas" className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm font-bold">
      {number > 1 ? <Link href={`/mentoria/conteudo/${number - 1}`} className="inline-flex items-center gap-2 text-[#C8CFD7] hover:text-mint"><ArrowLeft aria-hidden="true" className="size-4" /> Semana {number - 1}</Link> : <span />}
      {number < 12 && <Link href={`/mentoria/conteudo/${number + 1}`} className="inline-flex items-center gap-2 text-mint hover:text-neon">Semana {number + 1} <ArrowRight aria-hidden="true" className="size-4" /></Link>}
    </nav>
  </main>;
}
