import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { BrotoSpacePractice } from "@/components/mentorship/brotospace-practice";
import { LabBrief } from "@/components/mentorship/lab-brief";
import { LessonWorkspace } from "@/components/mentorship/lesson-workspace";
import { LessonSequence } from "@/components/mentorship/lesson-sequence";
import { WeekQuiz } from "@/components/mentorship/week-quiz";
import { getAppliedExample } from "@/lib/mentorship/applied-examples";
import { brotoSpaceWeeks } from "@/lib/mentorship/brotospace-track";
import { brotoLessonActions } from "@/lib/mentorship/broto-training-case";
import { findMentorshipWeek, mentorshipWeeks } from "@/lib/mentorship/catalog";
import { contentStepHref, findContentStep, getContentSteps } from "@/lib/mentorship/content-steps";
import { getMentorshipWeekContent } from "@/lib/mentorship/curriculum";
import { deepLessons } from "@/lib/mentorship/deep-lessons";
import { labBriefs } from "@/lib/mentorship/lab-briefs";
import { lessonTheory } from "@/lib/mentorship/lesson-theory";
import { roadmapQASupplement } from "@/lib/mentorship/roadmapqa-supplement";
import { roadmapQAChecks } from "@/lib/mentorship/roadmapqa-checks";
import { roadmapQAWorkedCases } from "@/lib/mentorship/roadmapqa-worked-cases";
import { megazord2026Weeks } from "@/lib/mentorship/megazord-2026";
import { megazord2026Checks } from "@/lib/mentorship/megazord-2026-checks";
import { megazord2026Challenges } from "@/lib/mentorship/megazord-2026-challenges";
import { megazordCareerCheckpoints, megazordCareerLevels, megazordCompetencies, megazordSpecializations, megazordYearPlan } from "@/lib/mentorship/megazord-career-map";
import { studyResources } from "@/lib/mentorship/study-resources";
import { getMentorshipDashboard } from "@/lib/mentorship/store";
import { technicalPlaybooks } from "@/lib/mentorship/technical-playbooks";
import { theoryExpansion } from "@/lib/mentorship/theory-expansion";
import { getSessionUser } from "@/lib/product/store";
import { themeForUnit } from "@/lib/mentorship/themes";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return mentorshipWeeks.flatMap((week) => getContentSteps(week).map((step) => ({ week: String(week.number), step: step.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ week: string; step: string }> }) {
  const { week: weekParam, step: stepParam } = await params;
  const week = findMentorshipWeek(Number(weekParam));
  const step = week && findContentStep(week, stepParam);
  const theme = week && themeForUnit(week.number);
  return { title: week && step && theme ? `${step.title} · ${theme.title} | Conteúdo QA Lab` : "Conteúdo | QA Lab", description: week?.assignment.objective };
}

export default async function ContentStepPage({ params }: { params: Promise<{ week: string; step: string }> }) {
  const { week: weekParam, step: stepParam } = await params;
  const number = Number(weekParam);
  const week = findMentorshipWeek(number);
  const theme = themeForUnit(number);
  const step = week && findContentStep(week, stepParam);
  const content = getMentorshipWeekContent(number);
  const deep = deepLessons[number];
  const chapter = theoryExpansion[number];
  const resource = studyResources[number];
  const labBrief = labBriefs[number];
  const brotoPractice = brotoSpaceWeeks[number];
  if (!Number.isInteger(number) || !week || !theme || !step || !content || !deep || !chapter || !resource || !labBrief || !brotoPractice) notFound();

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
  const user = await getSessionUser();
  const dashboard = user ? await getMentorshipDashboard(user.id) : null;
  const canTrack = Boolean(dashboard && dashboard.enrollment.status !== "paused");
  const completed = new Set((dashboard?.lessons ?? []).filter((item) => item.status === "completed").map((item) => item.lesson_key));
  const published = new Map((dashboard?.lessonContent ?? []).map((item) => [item.lesson_key, item]));
  const videoKeys = [...published.values()].filter((item) => item.video_url).map((item) => item.lesson_key);
  const example = getAppliedExample(number);
  const playbook = technicalPlaybooks[number];
  const megazordExtension = megazord2026Weeks[number];
  const megazordChallenge = megazord2026Challenges[number];

  const sliceForLesson = <T,>(items: readonly T[]) => lessonIndex === null ? [] : items.slice(Math.ceil(lessonIndex * items.length / week.lessons.length), Math.ceil((lessonIndex + 1) * items.length / week.lessons.length));
  const chapterSections = sliceForLesson(chapter.sections);

  return <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
    <nav aria-label="Navegação do tema" className="mb-7">
      <Link href={`/conteudo/temas/${theme.slug}#unidade-${number}`} className="group inline-flex min-h-9 items-center gap-2 text-sm font-medium text-[#AAB2BC] transition-colors hover:text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-4 focus-visible:ring-offset-[#101319]">
        <ArrowLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-0.5" />
        <span>{theme.title}</span>
      </Link>
    </nav>
    <header className="max-w-[72ch]">
      <p className="text-sm font-medium text-[#AAB2BC]">Parte {number - theme.units[0] + 1} <span aria-hidden="true">·</span> Etapa {index + 1} de {steps.length}</p>
      <h1 className="mt-3 text-3xl font-black tracking-[-.03em] text-off-white sm:text-4xl">{step.title}</h1>
      {step.slug !== "desafio" && <p className="mt-3 text-lg leading-8 text-[#C8CFD7]">{step.description}</p>}
    </header>

    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="sticky top-24 hidden border-r border-white/10 pr-5 lg:block"><h2 className="mb-3 text-sm font-bold text-off-white">Seu percurso nesta parte</h2><LessonSequence unit={week} currentSlug={step.slug} completedKeys={[...completed]} videoKeys={videoKeys} /></aside>
      <div className="min-w-0">
      <details className="border-y border-white/15 py-4 lg:hidden"><summary className="cursor-pointer text-sm font-bold text-mint">Ver aulas e atividades · {index + 1}/{steps.length}</summary><div className="mt-3"><LessonSequence unit={week} currentSlug={step.slug} completedKeys={[...completed]} videoKeys={videoKeys} /></div></details>

    {theoryLesson && <LessonWorkspace key={theoryLesson.key} lesson={theoryLesson} theory={lessonPageTheory} videoUrl={published.get(theoryLesson.key)?.video_url || theoryLesson.videoUrl} materialUrl={published.get(theoryLesson.key)?.material_url} completed={completed.has(theoryLesson.key)} canTrack={canTrack} videoAccess={Boolean(dashboard)} trackingHref={user ? dashboard ? "/mentoria/app" : "/mentoria" : `/login?next=${encodeURIComponent(contentStepHref(number, step.slug))}`} trackingLabel={dashboard ? "Sua matrícula está pausada. Consulte sua mentoria." : user ? "Conheça a mentoria para acompanhar seu progresso" : "Entre para salvar seu progresso"} nextHref={contentStepHref(number, next?.slug ?? "quiz")} nextTitle={next?.title ?? "Quiz"} previousHref={previous ? contentStepHref(number, previous.slug) : `/conteudo/temas/${theme.slug}`} resources={content.references} brotoAction={brotoLessonActions[number]?.[lessonIndex ?? 0]} brotoMissionHref={contentStepHref(number, "desafio")}>
      <details className="mt-10 max-w-[72ch] border-y border-white/15 py-5">
        <summary className="cursor-pointer font-bold text-off-white marker:text-mint">Aprofundamento da aula</summary>
        <div className="mt-6 space-y-9 text-base leading-8 text-[#C8CFD7]">
          {roadmapSupplement && <p>{roadmapSupplement.intro}</p>}
          {sliceForLesson(content.concepts).length > 0 && <section><h2 className="text-xl font-bold text-off-white">Conceitos desta parte</h2><div className="mt-5 space-y-6">{sliceForLesson(content.concepts).map((concept) => <article key={concept.title}><h3 className="font-bold text-off-white">{concept.title}</h3><p className="mt-2">{concept.content}</p></article>)}</div></section>}
          {sliceForLesson(deep.sections).length > 0 && <section><h2 className="text-xl font-bold text-off-white">Entenda o raciocínio</h2><div className="mt-5 space-y-6">{sliceForLesson(deep.sections).map((section) => <article key={section.title}><h3 className="font-bold text-off-white">{section.title}</h3><div className="mt-2 space-y-4">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>)}</div></section>}
          {chapterSections.length > 0 && <section><h2 className="text-xl font-bold text-off-white">Análise técnica</h2><div className="mt-5 space-y-6">{chapterSections.map((section) => <article key={section.title}><h3 className="font-bold text-off-white">{section.title}</h3><div className="mt-2 space-y-4">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>)}</div></section>}
          <section><h2 className="text-xl font-bold text-off-white">Confira seu entendimento</h2><ul className="mt-3 list-disc space-y-2 pl-5 marker:text-mint">{content.checkpoints.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h2 className="text-xl font-bold text-off-white">Erros comuns</h2><ul className="mt-3 list-disc space-y-2 pl-5 marker:text-mint">{content.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul></section>
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
    </LessonWorkspace>}

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

    {step.slug === "desafio" && <div className="mt-10 max-w-5xl">
      <BrotoSpacePractice week={brotoPractice} />
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link href={`/mentoria/semanas/${number}#enviar`} className="inline-flex min-h-11 items-center gap-2 bg-mint px-5 text-sm font-bold text-[#101319] hover:bg-neon">Registrar entrega <ArrowRight aria-hidden="true" className="size-4" /></Link>
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center gap-2 py-3 text-sm font-semibold text-[#AAB2BC] hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint [&::-webkit-details-marker]:hidden">Exercício opcional no QA Lab<ExternalLink aria-hidden="true" className="size-4" /><span className="sr-only">abrir detalhes</span></summary>
          <div className="mt-2 border-t border-white/10 pt-2">
            <p className="text-sm text-[#AAB2BC]">{week.assignment.practice.environment} · {week.assignment.practice.estimatedMinutes} min</p>
            <Link href={`${week.assignment.practice.route}${week.assignment.practice.route.includes("?") ? "&" : "?"}mentorshipWeek=${number}`} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-mint underline underline-offset-4">Abrir ambiente complementar<ExternalLink aria-hidden="true" className="size-4" /></Link>
            <LabBrief brief={labBrief} />
            {number === 3 && <p className="mt-5 text-sm leading-6 text-[#C8CFD7]">Extra: <Link href="/mentoria/labs/requisitos" className="font-semibold text-mint underline underline-offset-4">comparar duas interpretações de requisitos</Link>.</p>}
            {(number === 6 || number === 8) && <p className="mt-5 text-sm leading-6 text-[#C8CFD7]">Extra: <Link href="/mentoria/labs/oraculo" className="font-semibold text-mint underline underline-offset-4">investigar um teste que passa sem encontrar o defeito</Link>.</p>}
            {number === 10 && <p className="mt-5 text-sm leading-6 text-[#C8CFD7]">Extra: <Link href="/mentoria/labs/incidente" className="font-semibold text-mint underline underline-offset-4">ir do incidente à regressão</Link>.</p>}
            {megazordChallenge && <details className="mt-5 border-t border-white/10 pt-4"><summary className="cursor-pointer text-sm font-bold text-off-white">Desafio extra: {megazordChallenge.title}</summary><div className="mt-3 space-y-3 text-sm leading-6 text-[#C8CFD7]"><p>{megazordChallenge.task}</p><p>{megazordChallenge.evidence.join(" · ")}</p><p className="text-[#AAB2BC]">{megazordChallenge.review}</p></div></details>}
          </div>
        </details>
      </div>
    </div>}

    {!theoryLesson && <nav aria-label="Avançar no tema" className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-white/15 pt-7 text-sm font-bold">
      {previous ? <a href={contentStepHref(number, previous.slug)} className="inline-flex items-center gap-2 text-[#C8CFD7] hover:text-mint"><ArrowLeft aria-hidden="true" className="size-4" /> {previous.title}</a> : <Link href={`/conteudo/temas/${theme.slug}#unidade-${number}`} className="inline-flex items-center gap-2 text-[#C8CFD7] hover:text-mint"><ArrowLeft aria-hidden="true" className="size-4" /> Voltar ao tema</Link>}
      {next ? <Link href={contentStepHref(number, next.slug)} className="inline-flex items-center gap-2 bg-mint px-5 py-3 text-[#101319] hover:bg-neon">Próximo: {next.title} <ArrowRight aria-hidden="true" className="size-4" /></Link> : number < 12 ? <Link href={contentStepHref(number + 1, "teoria-1")} className="inline-flex min-h-11 items-center gap-2 text-mint hover:text-neon">Próxima parte <ArrowRight aria-hidden="true" className="size-4" /></Link> : <Link href="/conteudo" className="inline-flex min-h-11 items-center gap-2 text-mint hover:text-neon">Voltar aos temas <ArrowRight aria-hidden="true" className="size-4" /></Link>}
    </nav>}
      </div>
    </div>
  </main>;
}
