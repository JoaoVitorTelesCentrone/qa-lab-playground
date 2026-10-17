import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { BrotoSpacePractice } from "@/components/mentorship/brotospace-practice";
import { LabBrief } from "@/components/mentorship/lab-brief";
import { LessonReader } from "@/components/mentorship/lesson-reader";
import { MentorshipNav } from "@/components/mentorship/mentorship-nav";
import { WeekQuiz } from "@/components/mentorship/week-quiz";
import { getAppliedExample } from "@/lib/mentorship/applied-examples";
import { brotoSpaceWeeks } from "@/lib/mentorship/brotospace-track";
import { findMentorshipWeek, mentorshipWeeks } from "@/lib/mentorship/catalog";
import { contentStepHref, findContentStep, getContentSteps } from "@/lib/mentorship/content-steps";
import { getMentorshipWeekContent } from "@/lib/mentorship/curriculum";
import { deepLessons } from "@/lib/mentorship/deep-lessons";
import { labBriefs } from "@/lib/mentorship/lab-briefs";
import { lessonTheory } from "@/lib/mentorship/lesson-theory";
import { roadmapQASupplement } from "@/lib/mentorship/roadmapqa-supplement";
import { roadmapQAChecks } from "@/lib/mentorship/roadmapqa-checks";
import { roadmapQAWorkedCases } from "@/lib/mentorship/roadmapqa-worked-cases";
import { roadmapQAChallenges } from "@/lib/mentorship/roadmapqa-challenges";
import { megazord2026Weeks } from "@/lib/mentorship/megazord-2026";
import { megazord2026Checks } from "@/lib/mentorship/megazord-2026-checks";
import { megazord2026Challenges } from "@/lib/mentorship/megazord-2026-challenges";
import { megazordCareerCheckpoints, megazordCareerLevels, megazordCompetencies, megazordSpecializations, megazordYearPlan } from "@/lib/mentorship/megazord-career-map";
import { getMentorshipSubmissionPrompts } from "@/lib/mentorship/submission-prompts";
import { studyResources } from "@/lib/mentorship/study-resources";
import { getMentorshipDashboard } from "@/lib/mentorship/store";
import { technicalPlaybooks } from "@/lib/mentorship/technical-playbooks";
import { theoryExpansion } from "@/lib/mentorship/theory-expansion";
import { getSessionUser } from "@/lib/product/store";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return mentorshipWeeks.flatMap((week) => getContentSteps(week).map((step) => ({ week: String(week.number), step: step.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ week: string; step: string }> }) {
  const { week: weekParam, step: stepParam } = await params;
  const week = findMentorshipWeek(Number(weekParam));
  const step = week && findContentStep(week, stepParam);
  return { title: week && step ? `${step.title} · Semana ${week.number} | Conteúdo QA Lab` : "Conteúdo | QA Lab", description: week?.assignment.objective };
}

export default async function ContentStepPage({ params }: { params: Promise<{ week: string; step: string }> }) {
  const { week: weekParam, step: stepParam } = await params;
  const number = Number(weekParam);
  const week = findMentorshipWeek(number);
  const step = week && findContentStep(week, stepParam);
  const content = getMentorshipWeekContent(number);
  const deep = deepLessons[number];
  const chapter = theoryExpansion[number];
  const resource = studyResources[number];
  const labBrief = labBriefs[number];
  const brotoPractice = brotoSpaceWeeks[number];
  if (!Number.isInteger(number) || !week || !step || !content || !deep || !chapter || !resource || !labBrief || !brotoPractice) notFound();

  const steps = getContentSteps(week);
  const index = steps.findIndex((item) => item.slug === step.slug);
  const previous = steps[index - 1];
  const next = steps[index + 1];
  const lessonIndex = step.kind === "lesson" ? step.lessonIndex : null;
  const theoryLesson = lessonIndex !== null ? week.lessons[lessonIndex] : null;
  const isLastTheory = lessonIndex === week.lessons.length - 1;
  const baseTheory = theoryLesson ? lessonTheory[theoryLesson.key] : undefined;
  const roadmapSupplement = theoryLesson ? roadmapQASupplement[theoryLesson.key] : undefined;
  const lessonPageTheory = baseTheory ? {
    ...baseTheory,
    sections: [
      ...baseTheory.sections,
      ...(roadmapSupplement?.topics.map((topic) => ({ title: topic.title, text: `${topic.explanation}\n\nAplicação: ${topic.application}` })) ?? []),
    ],
  } : undefined;
  const user = theoryLesson ? await getSessionUser() : null;
  const dashboard = user ? await getMentorshipDashboard(user.id) : null;
  const canTrack = Boolean(dashboard && dashboard.enrollment.status !== "paused");
  const completed = new Set((dashboard?.lessons ?? []).filter((item) => item.status === "completed").map((item) => item.lesson_key));
  const published = new Map((dashboard?.lessonContent ?? []).map((item) => [item.lesson_key, item]));
  const example = getAppliedExample(number);
  const playbook = technicalPlaybooks[number];
  const megazordExtension = megazord2026Weeks[number];
  const megazordChallenge = megazord2026Challenges[number];
  const practiceHref = `${week.assignment.practice.route}${week.assignment.practice.route.includes("?") ? "&" : "?"}mentorshipWeek=${number}`;

  const sliceForLesson = <T,>(items: readonly T[]) => lessonIndex === null ? [] : items.slice(Math.ceil(lessonIndex * items.length / week.lessons.length), Math.ceil((lessonIndex + 1) * items.length / week.lessons.length));
  const chapterSections = sliceForLesson(chapter.sections);

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <MentorshipNav current="/mentoria/conteudo" />
    <Link href={`/mentoria/conteudo/${number}`} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft aria-hidden="true" className="size-4" /> Visão da semana {number}</Link>
    <header className="mt-9 max-w-[72ch]">
      <p className="text-sm font-bold text-mint">Semana {number} · Etapa {index + 1} de {steps.length}</p>
      <h1 className="mt-3 text-3xl font-black tracking-[-.03em] text-off-white sm:text-4xl">{step.title}</h1>
      <p className="mt-3 text-lg leading-8 text-[#C8CFD7]">{step.description}</p>
    </header>

    <nav aria-label="Etapas da semana" className="mt-9 hidden gap-1 overflow-x-auto border-b border-white/15 pb-px sm:flex">
      {steps.map((item, itemIndex) => <a key={item.slug} href={contentStepHref(number, item.slug)} aria-current={item.slug === step.slug ? "step" : undefined} className={`shrink-0 border-b-2 px-3 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${item.slug === step.slug ? "border-mint text-off-white" : "border-transparent text-[#AAB2BC] hover:text-mint"}`}>{itemIndex + 1}. {item.title}</a>)}
    </nav>
    <nav aria-label="Navegação entre etapas" className="mt-9 flex items-center justify-between gap-3 border-y border-white/15 py-4 text-sm font-semibold sm:hidden">
      {previous ? <a href={contentStepHref(number, previous.slug)} className="inline-flex min-w-0 max-w-[40%] items-center gap-1 text-mint"><ArrowLeft aria-hidden="true" className="size-4 shrink-0" /><span className="truncate">{index}. {previous.title}</span></a> : <span className="text-[#AAB2BC]">Início</span>}
      <span className="shrink-0 text-[#AAB2BC]">{index + 1} / {steps.length}</span>
      {next ? <a href={contentStepHref(number, next.slug)} className="inline-flex min-w-0 max-w-[40%] items-center gap-1 text-mint"><span className="truncate">{index + 2}. {next.title}</span><ArrowRight aria-hidden="true" className="size-4 shrink-0" /></a> : <span className="text-[#AAB2BC]">Fim</span>}
    </nav>

    {theoryLesson && <div className="mt-12">
      {lessonIndex === 0 && <section className="max-w-[72ch]">
        <h2 className="text-2xl font-bold text-off-white">O que você vai aprender</h2>
        <ul className="mt-5 list-disc space-y-2 border-y border-white/10 py-5 pl-5 text-base leading-7 text-[#C8CFD7] marker:text-mint">{content.outcomes.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>}
      <section className="mt-10 max-w-4xl">
        <LessonReader lesson={theoryLesson} index={lessonIndex!} theory={lessonPageTheory} videoUrl={published.get(theoryLesson.key)?.video_url || theoryLesson.videoUrl} materialUrl={published.get(theoryLesson.key)?.material_url} completed={completed.has(theoryLesson.key)} canTrack={canTrack} showPractice={false} defaultOpen />
      </section>
      <details className="mt-10 max-w-[72ch] border-y border-white/15 py-5">
        <summary className="cursor-pointer font-bold text-off-white marker:text-mint">Leitura complementar, checklist e fontes</summary>
        <div className="mt-6 space-y-9 text-base leading-8 text-[#C8CFD7]">
          {roadmapSupplement && <p>{roadmapSupplement.intro}</p>}
          {sliceForLesson(content.concepts).length > 0 && <section><h2 className="text-xl font-bold text-off-white">Conceitos da semana</h2><div className="mt-5 space-y-6">{sliceForLesson(content.concepts).map((concept) => <article key={concept.title}><h3 className="font-bold text-off-white">{concept.title}</h3><p className="mt-2">{concept.content}</p></article>)}</div></section>}
          {sliceForLesson(deep.sections).length > 0 && <section><h2 className="text-xl font-bold text-off-white">Entenda o raciocínio</h2><div className="mt-5 space-y-6">{sliceForLesson(deep.sections).map((section) => <article key={section.title}><h3 className="font-bold text-off-white">{section.title}</h3><div className="mt-2 space-y-4">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>)}</div></section>}
          {chapterSections.length > 0 && <section><h2 className="text-xl font-bold text-off-white">Análise técnica</h2><div className="mt-5 space-y-6">{chapterSections.map((section) => <article key={section.title}><h3 className="font-bold text-off-white">{section.title}</h3><div className="mt-2 space-y-4">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>)}</div></section>}
          <section><h2 className="text-xl font-bold text-off-white">Confira seu entendimento</h2><ul className="mt-3 list-disc space-y-2 pl-5 marker:text-mint">{content.checkpoints.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h2 className="text-xl font-bold text-off-white">Erros comuns</h2><ul className="mt-3 list-disc space-y-2 pl-5 marker:text-mint">{content.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h2 className="text-xl font-bold text-off-white">Fontes</h2><ul className="mt-3 space-y-2">{content.references.map((reference) => <li key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer" className="font-semibold text-mint underline underline-offset-4 hover:text-neon">{reference.title} · {reference.organization}</a></li>)}</ul></section>
        </div>
      </details>
      {isLastTheory && <>
        {playbook && <section className="mt-14 max-w-4xl border-t border-white/10 pt-10"><h2 className="text-2xl font-bold text-off-white">{playbook.title}</h2><p className="mt-4 max-w-[72ch] text-base leading-8 text-[#C8CFD7]">{playbook.introduction}</p><div className="mt-8 space-y-8">{playbook.examples.map((item) => <article key={item.title} className="border border-white/10 bg-[#171B21] p-5 sm:p-7"><h3 className="text-lg font-bold text-off-white">{item.title}</h3><p className="mt-1 text-sm text-mint">{item.language}</p><pre className="mt-5 overflow-x-auto bg-[#101319] p-4 text-xs leading-6 text-[#D9DEE4]"><code>{item.code}</code></pre><p className="mt-5 text-base leading-7 text-[#C8CFD7]">{item.explanation}</p></article>)}</div><h3 className="mt-9 font-bold text-off-white">Antes de considerar concluído</h3><ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-[#C8CFD7] marker:text-mint">{playbook.review.map((item) => <li key={item}>{item}</li>)}</ul>{playbook.further && <Link href={playbook.further.href} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon">{playbook.further.label}<ArrowRight aria-hidden="true" className="size-4" /></Link>}</section>}
        {megazordExtension && <details className="mt-10 max-w-[72ch] border-y border-white/15 py-5"><summary className="cursor-pointer font-bold text-off-white marker:text-mint">Aprofundamento Megazord 2026: {megazordExtension.title}</summary><div className="mt-6 space-y-8 text-base leading-8 text-[#C8CFD7]">{megazordExtension.topics.map((topic) => <article key={topic.title}><h3 className="font-bold text-off-white">{topic.title}</h3><p className="mt-2">{topic.explanation}</p><p className="mt-3"><strong className="text-mint">Prática:</strong> {topic.application}</p></article>)}{number === 12 && <section className="space-y-7 border-t border-white/10 pt-6">
          <div><h3 className="text-xl font-bold text-off-white">Mapa de carreira e competências</h3><p className="mt-2">Use os níveis como referência para observar autonomia e impacto. Eles não são uma regra de promoção nem dependem apenas de tempo de experiência.</p></div>
          <div className="grid gap-3">{megazordCareerLevels.map((item) => <article key={item.level} className="border border-white/10 bg-[#171B21] p-4"><h4 className="font-bold text-off-white">{item.level}</h4><p className="mt-2"><strong className="text-mint">Foco:</strong> {item.focus}</p><p className="mt-1"><strong className="text-mint">Evidência:</strong> {item.evidence}</p></article>)}</div>
          <details className="border-y border-white/10 py-4"><summary className="cursor-pointer font-bold text-off-white marker:text-mint">Abrir matriz por competência e senioridade</summary><div className="mt-4 space-y-3">{megazordCompetencies.map((item) => <article key={item.name} className="border border-white/10 p-4"><h4 className="font-bold text-off-white">{item.name}</h4><dl className="mt-3 grid gap-3 sm:grid-cols-2">{([ ["Júnior", item.junior], ["Pleno", item.pleno], ["Sênior", item.senior], ["Staff / Principal", item.staff] ] as const).map(([level, description]) => <div key={level}><dt className="text-sm font-bold text-mint">{level}</dt><dd className="mt-1 text-sm leading-6">{description}</dd></div>)}</dl></article>)}</div></details>
          <div><h3 className="text-lg font-bold text-off-white">Trilhas de especialização</h3><div className="mt-3 grid gap-3 sm:grid-cols-2">{megazordSpecializations.map((item) => <article key={item.name} className="border border-white/10 p-4"><h4 className="font-bold text-off-white">{item.name}</h4><p className="mt-1 text-sm leading-6">{item.focus}</p></article>)}</div></div>
          <div><h3 className="text-lg font-bold text-off-white">Continuação em 12 meses</h3><div className="mt-3 space-y-3">{megazordYearPlan.map((item) => <article key={item.period} className="border-l-2 border-mint pl-4"><h4 className="font-bold text-off-white">{item.period} · {item.focus}</h4><p className="mt-1 text-sm leading-6"><strong className="text-mint">Evidência:</strong> {item.artifact}</p></article>)}</div></div>
          <div><h3 className="text-lg font-bold text-off-white">Checkpoints de carreira</h3><ul className="mt-3 space-y-3">{megazordCareerCheckpoints.map((item) => <li key={item.level}><strong className="text-mint">{item.level}:</strong> {item.checkpoint}</li>)}</ul></div>
        </section>}{megazordExtension.references.length > 0 && <section className="border-t border-white/10 pt-5"><h3 className="font-bold text-off-white">Fontes oficiais</h3><ul className="mt-3 space-y-2">{megazordExtension.references.map((reference) => <li key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer" className="font-semibold text-mint underline underline-offset-4 hover:text-neon">{reference.title} · {reference.organization}</a></li>)}</ul></section>}</div></details>}
      </>}
    </div>}

    {step.slug === "quiz" && <section className="mt-12"><WeekQuiz weekNumber={number} questions={[...resource.selfCheck, ...(roadmapQAChecks[number] ?? []), ...(megazord2026Checks[number] ?? [])]} /><div className="mt-12 max-w-[72ch] border-t border-white/10 pt-8"><h2 className="text-xl font-bold text-off-white">Leve estas perguntas para a mentoria</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-[#C8CFD7] marker:text-mint">{content.mentorQuestions.map((question) => <li key={question}>{question}</li>)}</ul></div></section>}

    {step.slug === "exemplo" && <div className="mt-12 max-w-[72ch]">
      {roadmapQAWorkedCases[number] && <section><p className="text-sm font-bold text-mint">Caso resolvido</p><h2 className="mt-2 text-2xl font-bold text-off-white">{roadmapQAWorkedCases[number].title}</h2><p className="mt-5 text-base leading-8 text-[#C8CFD7]">{roadmapQAWorkedCases[number].context}</p><ol className="mt-6 list-decimal space-y-4 pl-5 text-base leading-8 text-[#C8CFD7] marker:font-bold marker:text-mint">{roadmapQAWorkedCases[number].procedure.map((item) => <li key={item}>{item}</li>)}</ol><div className="mt-7 border-l-2 border-mint pl-5 text-base leading-8 text-[#C8CFD7]"><p><strong className="text-off-white">Entrega:</strong> {roadmapQAWorkedCases[number].deliverable}</p><p className="mt-4"><strong className="text-off-white">Como interpretar:</strong> {roadmapQAWorkedCases[number].interpretation}</p></div></section>}
      <details className="mt-12 border-t border-white/15 pt-6">
        <summary className="cursor-pointer text-lg font-bold text-off-white marker:text-mint">Ver outros exemplos e exercícios</summary>
        <div className="mt-8 space-y-10">
          {example && <section><h2 className="text-xl font-bold text-off-white">Exemplo aplicado</h2><dl className="mt-5 space-y-5 text-base leading-8 text-[#C8CFD7]"><div><dt className="font-bold text-mint">Situação</dt><dd>{example.situation}</dd></div><div><dt className="font-bold text-mint">Raciocínio</dt><dd>{example.reasoning}</dd></div><div><dt className="font-bold text-mint">Sua vez</dt><dd>{example.transfer}</dd></div><div><dt className="font-bold text-mint">Evidência</dt><dd>{example.evidence}</dd></div></dl></section>}
          <section><h2 className="text-xl font-bold text-off-white">Passo a passo: {deep.walkthrough.title}</h2><p className="mt-4 text-base leading-8 text-[#C8CFD7]">{deep.walkthrough.setup}</p><ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-8 text-[#C8CFD7] marker:font-bold marker:text-mint">{deep.walkthrough.steps.map((item) => <li key={item}>{item}</li>)}</ol><p className="mt-5 border-l-2 border-mint pl-5 text-base leading-8 text-off-white"><strong>Conclusão:</strong> {deep.walkthrough.conclusion}</p></section>
          <section><h2 className="text-xl font-bold text-off-white">Caso analisado: {chapter.caseStudy.title}</h2><dl className="mt-5 space-y-5 text-base leading-8 text-[#C8CFD7]"><div><dt className="font-bold text-mint">Contexto</dt><dd>{chapter.caseStudy.context}</dd></div><div><dt className="font-bold text-mint">Raciocínio</dt><dd>{chapter.caseStudy.reasoning}</dd></div><div><dt className="font-bold text-mint">Conclusão</dt><dd>{chapter.caseStudy.conclusion}</dd></div></dl></section>
          <section><h2 className="text-xl font-bold text-off-white">Exercícios das aulas</h2><div className="mt-5 space-y-8">{week.lessons.map((lesson) => { const theory = lessonTheory[lesson.key]; return theory && <article key={lesson.key} className="border-t border-white/10 pt-5"><h3 className="font-bold text-off-white">{lesson.title}</h3><p className="mt-3 text-base leading-8 text-[#C8CFD7]">{theory.workedExample}</p><p className="mt-4 text-base leading-8 text-[#C8CFD7]"><strong className="text-off-white">Sua vez:</strong> {theory.exercise}</p><details className="mt-3 border-t border-white/10 pt-3"><summary className="cursor-pointer font-bold text-mint">Ver resposta comentada</summary><p className="mt-3 text-base leading-8 text-[#C8CFD7]">{theory.answer}</p></details></article>; })}</div></section>
        </div>
      </details>
    </div>}

    {step.slug === "desafio" && <div className="mt-12">
      <section className="max-w-[72ch]"><h2 className="text-2xl font-bold text-off-white">Sua missão</h2><p className="mt-4 text-base leading-8 text-[#C8CFD7]">{week.assignment.objective}</p><p className="mt-3 text-sm text-[#AAB2BC]">Ambiente: {week.assignment.practice.environment} · cerca de {week.assignment.practice.estimatedMinutes} min</p></section>
      {number === 3 && <aside className="my-8 border-l-4 border-mint bg-white/5 p-6"><p className="text-sm font-bold text-mint">Laboratório complementar · 30 minutos</p><h3 className="mt-2 text-xl font-bold text-off-white">Uma história, duas interpretações</h3><p className="mt-3 max-w-[70ch] leading-7 text-[#C8CFD7]">Registre seus testes antes de conhecer todos os critérios, revise com as regras esclarecidas e exporte a comparação para discutir com seu mentor.</p><Link href="/mentoria/labs/requisitos" className="mt-4 inline-block font-bold text-mint underline underline-offset-4">Abrir laboratório de requisitos</Link></aside>}
      {(number === 6 || number === 8) && <aside className="my-8 border-l-4 border-mint bg-white/5 p-6"><p className="text-sm font-bold text-mint">Laboratório complementar · 25 minutos</p><h3 className="mt-2 text-xl font-bold text-off-white">O teste verde que não encontra o defeito</h3><p className="mt-3 max-w-[70ch] leading-7 text-[#C8CFD7]">Compare um teste superficial com um oráculo de negócio executando ambos nas versões correta e defeituosa do mesmo relatório.</p><Link href="/mentoria/labs/oraculo" className="mt-4 inline-block font-bold text-mint underline underline-offset-4">Abrir laboratório de oráculos</Link></aside>}
      {number === 10 && <aside className="my-8 border-l-4 border-mint bg-white/5 p-6"><p className="text-sm font-bold text-mint">Laboratório complementar · 30 minutos</p><h3 className="mt-2 text-xl font-bold text-off-white">Do incidente ao teste que impede a volta</h3><p className="mt-3 max-w-[70ch] leading-7 text-[#C8CFD7]">Investigue logs correlacionados, reproduza a divergência e demonstre a regressão falhando antes e passando depois da correção.</p><Link href="/mentoria/labs/incidente" className="mt-4 inline-block font-bold text-mint underline underline-offset-4">Abrir laboratório de incidente</Link></aside>}
      <LabBrief brief={labBrief} />
      <BrotoSpacePractice week={brotoPractice} />
      {roadmapQAChallenges[number] && <section className="mt-12 max-w-[72ch] border-y border-white/15 py-8"><p className="text-sm font-bold text-mint">Aplicação do conteúdo</p><h2 className="mt-2 text-2xl font-bold text-off-white">{roadmapQAChallenges[number].title}</h2><p className="mt-4 text-base leading-8 text-[#C8CFD7]">{roadmapQAChallenges[number].task}</p><h3 className="mt-6 text-base font-bold text-off-white">Inclua na evidência</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-[#C8CFD7] marker:text-mint">{roadmapQAChallenges[number].evidence.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-5 text-sm leading-6 text-[#AAB2BC]"><strong className="text-off-white">Revise antes de enviar:</strong> {roadmapQAChallenges[number].review}</p></section>}
      {megazordChallenge && <details className="mt-10 max-w-[72ch] border-y border-white/15 py-5"><summary className="cursor-pointer font-bold text-off-white marker:text-mint">Extensão Megazord 2026: {megazordChallenge.title}</summary><div className="mt-5"><p className="text-base leading-8 text-[#C8CFD7]">{megazordChallenge.task}</p><h3 className="mt-5 font-bold text-off-white">Evidências</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-[#C8CFD7] marker:text-mint">{megazordChallenge.evidence.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-5 text-sm leading-6 text-[#AAB2BC]"><strong className="text-off-white">Critério de revisão:</strong> {megazordChallenge.review}</p></div></details>}
      <section className="mt-12 max-w-[72ch] border-t border-white/10 pt-9"><h2 className="text-2xl font-bold text-off-white">Roteiro de execução</h2><ol className="mt-6 list-decimal space-y-3 pl-5 text-base leading-8 text-[#C8CFD7] marker:font-bold marker:text-mint">{week.assignment.practice.instructions.map((item) => <li key={item}>{item}</li>)}</ol><h3 className="mt-9 text-lg font-bold text-off-white">Prática guiada</h3><ol className="mt-4 list-decimal space-y-3 pl-5 text-base leading-8 text-[#C8CFD7] marker:text-mint">{content.guidedPractice.map((item) => <li key={item}>{item}</li>)}</ol><Link href={practiceHref} className="mt-7 inline-flex items-center gap-2 bg-mint px-5 py-3 text-sm font-bold text-[#101319] hover:bg-neon">Abrir ambiente <ExternalLink aria-hidden="true" className="size-4" /></Link></section>
      <section className="mt-14 max-w-[72ch] border-t border-white/10 pt-9"><h2 className="text-2xl font-bold text-off-white">Prepare sua entrega: {resource.templateTitle}</h2><p className="mt-4 text-base leading-8 text-[#C8CFD7]">{resource.templateIntro}</p><div className="mt-6 space-y-6">{resource.sections.map((item, i) => <article key={item.heading}><h3 className="text-lg font-bold text-off-white">{i + 1}. {item.heading}</h3><p className="mt-2 text-base leading-8 text-[#C8CFD7]">{item.guidance}</p></article>)}</div><p className="mt-7 text-base leading-8 text-[#C8CFD7]">{week.assignment.delivery}</p></section>
      <section className="mt-14 max-w-[72ch] border-t border-white/10 pt-9"><h2 className="text-2xl font-bold text-off-white">Critérios para concluir</h2><ul className="mt-5 space-y-3">{week.assignment.practice.completionCriteria.map((item) => <li key={item} className="flex gap-3 text-base leading-7 text-[#C8CFD7]"><CheckCircle2 aria-hidden="true" className="mt-1 size-4 shrink-0 text-mint" />{item}</li>)}</ul><h3 className="mt-8 font-bold text-off-white">O que precisa aparecer</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-[#C8CFD7] marker:text-mint">{week.assignment.beginnerRequirements.map((item) => <li key={item}>{item}</li>)}</ul><h3 className="mt-8 font-bold text-off-white">Aprofundamento</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-[#C8CFD7] marker:text-mint">{week.assignment.intermediateRequirements.map((item) => <li key={item}>{item}</li>)}</ul><h3 className="mt-8 font-bold text-off-white">Como a entrega será avaliada</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-[#C8CFD7] marker:text-mint">{week.assignment.rubric.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section className="mt-14 max-w-[72ch] border-t border-white/10 pt-9"><h2 className="text-2xl font-bold text-off-white">Antes de enviar</h2><ol className="mt-5 list-decimal space-y-2 pl-5 text-base leading-7 text-[#C8CFD7] marker:text-mint">{getMentorshipSubmissionPrompts(number).map((item) => <li key={item}>{item}</li>)}</ol><Link href={`/mentoria/semanas/${number}#enviar`} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon">Registrar entrega para revisão <ArrowRight aria-hidden="true" className="size-4" /></Link></section>
    </div>}

    <nav aria-label="Avançar na semana" className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-white/15 pt-7 text-sm font-bold">
      {previous ? <a href={contentStepHref(number, previous.slug)} className="inline-flex items-center gap-2 text-[#C8CFD7] hover:text-mint"><ArrowLeft aria-hidden="true" className="size-4" /> {previous.title}</a> : <Link href={`/mentoria/conteudo/${number}`} className="inline-flex items-center gap-2 text-[#C8CFD7] hover:text-mint"><ArrowLeft aria-hidden="true" className="size-4" /> Visão da semana</Link>}
      {next ? <a href={contentStepHref(number, next.slug)} className="inline-flex items-center gap-2 bg-mint px-5 py-3 text-[#101319] hover:bg-neon">Próximo: {next.title} <ArrowRight aria-hidden="true" className="size-4" /></a> : number < 12 ? <Link href={`/mentoria/conteudo/${number + 1}`} className="inline-flex items-center gap-2 bg-mint px-5 py-3 text-[#101319] hover:bg-neon">Semana {number + 1} <ArrowRight aria-hidden="true" className="size-4" /></Link> : <Link href="/mentoria/conteudo" className="inline-flex items-center gap-2 bg-mint px-5 py-3 text-[#101319] hover:bg-neon">Voltar ao roadmap <ArrowRight aria-hidden="true" className="size-4" /></Link>}
    </nav>
  </main>;
}
