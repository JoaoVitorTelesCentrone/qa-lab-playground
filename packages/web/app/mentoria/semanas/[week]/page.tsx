import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpenCheck, ClipboardCheck, ExternalLink, FlaskConical, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MentorshipPortfolioForm, SubmissionForm, WeeklyCommitmentForm } from "@/components/mentorship/mentorship-actions";
import { LessonSequence } from "@/components/mentorship/lesson-sequence";
import { BrotoSpacePractice } from "@/components/mentorship/brotospace-practice";
import { findMentorshipWeek, requirementsFor } from "@/lib/mentorship/catalog";
import { brotoSpaceWeeks } from "@/lib/mentorship/brotospace-track";
import { getOwnMentorshipCase } from "@/lib/mentorship/portfolio";
import { getMentorshipDashboard, listOwnLabEvidence, listReviewsForSubmissions } from "@/lib/mentorship/store";
import { getSessionUser } from "@/lib/product/store";
import { mentorshipThemes, themeForUnit } from "@/lib/mentorship/themes";
import { pathV2ChapterHref, pathV2Chapters } from "@/lib/mentorship/path-v2";

export const dynamic = "force-dynamic";

const steps = [
  { id: "aprender", label: "1. Aprender" },
  { id: "praticar", label: "2. Praticar" },
  { id: "enviar", label: "3. Enviar" },
  { id: "feedback", label: "4. Feedback" },
];

export default async function MentorshipWeekPage({ params }: { params: Promise<{ week: string }> }) {
  const number = Number((await params).week);
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/mentoria/semanas/${number}`)}`);
  const week = findMentorshipWeek(number);
  const theme = themeForUnit(number);
  const brotoPractice = brotoSpaceWeeks[number];
  if (!week || !theme || !brotoPractice) notFound();
  const themeIndex = mentorshipThemes.findIndex((item) => item.id === theme.id);
  const dashboard = await getMentorshipDashboard(user.id);
  if (!dashboard) redirect("/mentoria");
  if (dashboard.enrollment.programVersion === "v2") {
    const prefix = `mentoria.w${String(number).padStart(2, "0")}.`;
    const destination = pathV2Chapters.find(({ chapter }) => chapter.lessonKeys.some((key) => key.startsWith(prefix)));
    redirect(destination ? pathV2ChapterHref(destination.module, destination.chapter) : "/mentoria/app");
  }
  if (dashboard.enrollment.status === "paused") redirect("/mentoria/app");

  const lessonKeys = new Set(week.lessons.map((lesson) => lesson.key));
  const completed = new Set((dashboard.lessons ?? []).filter((item) => item.status === "completed" && lessonKeys.has(item.lesson_key)).map((item) => item.lesson_key));
  const requirements = requirementsFor(dashboard.enrollment.level, week.assignment);
  const commitment = (dashboard.commitments ?? []).find((item) => item.week_number === week.number)?.commitment ?? "";
  const attempts = dashboard.submissions.filter((item) => item.assignmentKey === week.assignment.key).sort((a, b) => b.attemptNumber - a.attemptNumber);
  const currentSubmission = attempts[0] ?? null;
  const approvedMentorshipEvidence = week.number === 12 ? dashboard.submissions.filter((item) => item.status === "approved" && item.assignmentKey !== week.assignment.key).map((item) => ({ id: item.id, assignmentKey: item.assignmentKey, attemptNumber: item.attemptNumber, createdAt: item.createdAt })) : [];
  const labEvidence = await listOwnLabEvidence(user.id);
  const reviewsBySubmission = await listReviewsForSubmissions(user.id, attempts.map((attempt) => attempt.id));
  const liveSession = dashboard.sessions.find((session) => session.week_number === week.number);
  const videoKeys = (dashboard.lessonContent ?? []).filter((item) => item.video_url).map((item) => item.lesson_key);
  const resumeIndex = week.lessons.findIndex((lesson) => !completed.has(lesson.key));
  const resumeHref = `/conteudo/${week.number}/${resumeIndex >= 0 ? `teoria-${resumeIndex + 1}` : "quiz"}`;
  const finalSubmission = week.number === 12 ? dashboard.submissions.find((item) => item.assignmentKey === week.assignment.key && item.status === "approved") : null;
  const finalCase = finalSubmission ? await getOwnMentorshipCase(finalSubmission.id) : null;
  const practiceHref = `${week.assignment.practice.route}${week.assignment.practice.route.includes("?") ? "&" : "?"}mentorshipWeek=${week.number}`;

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <div className="flex flex-wrap items-center gap-5"><Link href="/mentoria/app" className="inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft className="size-4" /> Voltar para minha jornada</Link><Link href={`/conteudo/temas/${theme.slug}#unidade-${number}`} className="text-sm font-bold text-[#C8CFD7] hover:text-mint">Ver tema completo</Link></div>
    <header className="mt-8 max-w-4xl">
      <p className="text-sm font-bold text-mint">Tema {themeIndex + 1} · Missão {number - theme.units[0] + 1}</p>
      <h1 className="mt-4 text-4xl font-black text-off-white sm:text-5xl">{week.assignment.title}</h1>
      <p className="mt-4 text-lg leading-8 text-[#AAB2BC]">{week.assignment.objective}</p>
      <div className="mt-6 flex flex-wrap gap-2"><span className="border border-white/10 bg-[#171B21] px-3 py-1.5 text-xs text-[#C8CFD7]">Foco: {week.technicalFocus}</span><span className="border border-white/10 bg-[#171B21] px-3 py-1.5 text-xs text-[#C8CFD7]">Nivel: {dashboard.enrollment.level === "intermediate" ? "intermediario" : "iniciante"}</span></div>
    </header>

    <nav aria-label="Etapas da missao" className="sticky top-0 z-10 mt-8 flex gap-2 overflow-x-auto border-y border-white/10 bg-[#101319]/95 py-3 backdrop-blur">
      {steps.map((step) => <a key={step.id} href={`#${step.id}`} className="shrink-0 border border-white/10 bg-[#171B21] px-3 py-2 text-xs font-bold text-[#C8CFD7] hover:border-mint/40 hover:text-mint">{step.label}</a>)}
    </nav>

    <section id="aprender" className="scroll-mt-24 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-black text-off-white">Estude as aulas</h2><span className="text-sm text-[#AAB2BC]">{completed.size}/{week.lessons.length} concluídas</span></div>
      <p className="mt-2 text-sm leading-6 text-[#AAB2BC]">Escolha vídeo ou leitura na aula. Depois, confira seu entendimento e pratique.</p>
      <Link href={resumeHref} className="mt-5 inline-flex min-h-11 items-center gap-2 bg-mint px-5 text-sm font-bold text-[#101319] hover:bg-neon">{completed.size ? "Continuar estudo" : "Começar as aulas"}<BookOpenCheck aria-hidden="true" className="size-4" /></Link>
      <div className="mt-5 max-w-3xl"><LessonSequence unit={week} completedKeys={[...completed]} videoKeys={videoKeys} /></div>
    </section>

    <section id="praticar" className="scroll-mt-24 pt-12">
      <div><p className="text-sm font-bold text-neon">Etapa 2 · Praticar</p><h2 className="mt-2 text-2xl font-black text-off-white">Aplique no Broto Space</h2></div>
      <BrotoSpacePractice week={brotoPractice} />
      <details className="group mt-6 border-y border-white/10 py-4">
        <summary className="cursor-pointer text-sm font-bold text-[#C8CFD7] marker:text-mint">Exercício opcional no QA Lab · {week.assignment.practice.estimatedMinutes} min</summary>
        <div className="mt-4">
      <article className="mt-5 grid gap-6 border border-mint/25 bg-mint/[.04] p-6 md:grid-cols-[1fr_auto] md:items-start">
        <div><div className="flex items-center gap-3"><FlaskConical className="size-5 text-mint" /><h3 className="text-xl font-black text-off-white">{week.assignment.practice.environment}</h3></div><p className="mt-2 text-sm text-[#AAB2BC]">Artefato: <strong className="text-off-white">{week.assignment.practice.artifact}</strong> · cerca de {week.assignment.practice.estimatedMinutes} min</p>
          <ol className="mt-5 grid gap-2 text-sm leading-6 text-[#C8CFD7]">{week.assignment.practice.instructions.map((item, index) => <li key={item}><span className="mr-2 font-bold text-mint">{index + 1}.</span>{item}</li>)}</ol>
          <h4 className="mt-5 text-sm font-black text-off-white">Considere a pratica concluida quando</h4><ul className="mt-2 grid gap-1 text-sm leading-6 text-[#AAB2BC]">{week.assignment.practice.completionCriteria.map((item) => <li key={item}>— {item}</li>)}</ul>
        </div><div className="flex flex-col gap-3"><Button asChild><Link href={practiceHref} target="_blank" rel="noreferrer">Abrir ambiente de pratica <ExternalLink className="ml-2 size-4" /></Link></Button><Link href={`/mentoria/semanas/${week.number}#enviar`} className="text-center text-xs font-bold text-neon hover:text-mint">Voltar para registrar a entrega</Link></div>
      </article>
        </div>
      </details>
    </section>

    <section id="enviar" className="scroll-mt-24 pt-12">
      <div><p className="text-sm font-bold text-neon">Etapa 3 · Enviar</p><h2 className="mt-2 text-2xl font-black text-off-white">Transforme a pratica em uma entrega</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#AAB2BC]">{week.assignment.delivery} Salve um rascunho para continuar depois ou envie para receber o feedback do mentor.</p></div>
      <div className="mt-5 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <article className="border border-white/10 bg-[#171B21] p-6"><div className="flex items-center gap-3"><ClipboardCheck className="size-5 text-neon" /><h3 className="text-xl font-black text-off-white">Checklist da entrega</h3></div><h4 className="mt-6 text-sm font-black text-off-white">Requisitos do seu nivel</h4><ul className="mt-3 grid gap-2 text-sm leading-6 text-[#AAB2BC]">{requirements.map((item) => <li key={item}>— {item}</li>)}</ul><h4 className="mt-6 text-sm font-black text-off-white">Rubrica do mentor</h4><ul className="mt-3 grid gap-2 text-sm leading-6 text-[#AAB2BC]">{week.assignment.rubric.map((item) => <li key={item}>— {item}</li>)}</ul></article>
        <article className="border border-white/10 bg-[#171B21] p-6"><SubmissionForm assignmentKey={week.assignment.key} initialSubmission={currentSubmission} labEvidence={labEvidence} approvedEvidence={approvedMentorshipEvidence} /></article>
      </div>
    </section>

    <section id="feedback" className="scroll-mt-24 pt-12">
      <div className="flex items-center gap-3"><MessageSquareText className="size-5 text-neon" /><div><p className="text-sm font-bold text-neon">Etapa 4 · Feedback</p><h2 className="mt-1 text-2xl font-black text-off-white">Aprenda com o retorno do mentor</h2></div></div>
      {attempts.length === 0 ? <article className="mt-5 border border-white/10 bg-[#171B21] p-5"><p className="font-bold text-off-white">O retorno aparece aqui depois do envio e da revisao.</p><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">Se ainda estiver preparando a entrega, salve um rascunho na etapa anterior.</p></article> : <ol className="mt-5 divide-y divide-white/10 border-y border-white/10">{[...attempts].reverse().map((attempt) => {
        const attemptReviews = reviewsBySubmission.get(attempt.id) ?? [];
        const linkedEvidence = labEvidence.find((evidence) => evidence.id === attempt.labSubmissionId);
        const response = typeof attempt.content.response === "string" ? attempt.content.response : JSON.stringify(attempt.content, null, 2);
        const statusLabel = ({ draft: "Rascunho", submitted: "Enviada", in_review: "Em revisao", changes_requested: "Ajustes solicitados", approved: "Aprovada" } as const)[attempt.status];
        return <li key={attempt.id} className="py-4"><details open={attempt.id === currentSubmission?.id}><summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 text-sm"><span className="font-bold text-off-white">Tentativa {attempt.attemptNumber} · {statusLabel}</span><time className="text-xs text-[#8B949E]">{new Date(attempt.createdAt).toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" })}</time></summary><div className="mt-4 grid gap-3 border-l border-white/10 pl-4"><p className="whitespace-pre-wrap text-sm leading-6 text-[#C8CFD7]">{response}</p><div className="flex flex-wrap gap-4 text-xs font-bold">{attempt.repositoryUrl && <a href={attempt.repositoryUrl} target="_blank" rel="noreferrer" className="text-mint underline">Repositorio</a>}{attempt.reportUrl && <a href={attempt.reportUrl} target="_blank" rel="noreferrer" className="text-mint underline">Relatorio</a>}{attempt.attachments.map((file) => <a key={file.path} href={file.url || undefined} target="_blank" rel="noreferrer" className="text-neon underline">{file.name}</a>)}</div>{linkedEvidence && <p className="text-xs leading-5 text-[#AAB2BC]">Evidencia vinculada: <strong className="text-off-white">{linkedEvidence.labSlug}</strong> · {linkedEvidence.evidence.slice(0, 240)}</p>}{attemptReviews.length > 0 ? attemptReviews.map((review) => <article key={review.id} className="border border-neon/20 bg-neon/[.04] p-4"><p className="text-xs font-black text-mint">{review.decision === "approved" ? "Entrega aprovada" : "Ajustes solicitados"}</p><ul className="mt-3 grid gap-2">{week.assignment.rubric.map((criterion) => <li key={criterion} className="flex items-center justify-between gap-3 text-xs text-[#C8CFD7]"><span>{criterion}</span><span className="shrink-0 font-bold text-mint">{review.scores[criterion] ?? "—"}/4</span></li>)}</ul>{review.strengths && <p className="mt-3 text-sm leading-6 text-[#C8CFD7]"><strong className="text-off-white">Pontos fortes:</strong> {review.strengths}</p>}{review.improvements && <p className="mt-2 text-sm leading-6 text-[#C8CFD7]"><strong className="text-off-white">Para evoluir:</strong> {review.improvements}</p>}<p className="mt-2 text-sm leading-6 text-[#AAB2BC]"><strong className="text-off-white">Próxima ação:</strong> {review.nextAction}</p></article>) : (attempt.status === "submitted" || attempt.status === "in_review") ? <p className="text-sm text-[#AAB2BC]">Esta tentativa está aguardando o parecer do mentor.</p> : null}</div></details></li>;
      })}</ol>}
    </section>

    <section className="mt-12 grid gap-6 lg:grid-cols-2"><article className="border border-mint/20 bg-mint/[.04] p-5"><p className="font-bold text-mint">Compromisso da semana</p><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">Escolha uma acao pequena e observavel para levar ao encontro ao vivo.</p><div className="mt-4"><WeeklyCommitmentForm weekNumber={week.number} initialValue={commitment} /></div></article><article className="border border-white/10 bg-[#171B21] p-5"><p className="font-bold text-mint">Encontro ao vivo · Semana {week.number}</p>{liveSession ? <><p className="mt-2 font-bold text-off-white">{liveSession.title}</p><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{new Date(liveSession.starts_at).toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short" })}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#C8CFD7]">{liveSession.agenda || week.liveFocus}</p><div className="mt-4 flex flex-wrap gap-4">{liveSession.meeting_url && <a href={liveSession.meeting_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-mint hover:text-neon">Entrar no encontro <ExternalLink className="ml-1 inline size-4" /></a>}{liveSession.recording_url && <a href={liveSession.recording_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-neon hover:text-mint">Assistir gravação <ExternalLink className="ml-1 inline size-4" /></a>}</div></> : <><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">A equipe ainda não publicou o encontro desta semana.</p><p className="mt-2 text-sm leading-6 text-[#C8CFD7]">Foco previsto: {week.liveFocus}. Leve uma situação real, uma decisão difícil ou uma dúvida da prática.</p></>}<Button asChild variant="outline" className="mt-5"><Link href="/mentoria/app">Voltar ao painel</Link></Button></article></section>
    {finalSubmission && <MentorshipPortfolioForm submissionId={finalSubmission.id} initialTitle={finalCase?.title} initialSummary={finalCase?.summary} initialPublished={finalCase?.published} />}
  </main>;
}
