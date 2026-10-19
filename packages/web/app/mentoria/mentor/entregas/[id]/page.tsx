import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ReviewForm } from "@/components/mentorship/mentorship-actions";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { findMentorshipAssignment, mentorshipWeeks } from "@/lib/mentorship/catalog";
import { findPathV2Assignment } from "@/lib/mentorship/path-v2";
import { getMentorSubmission } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";

export default async function MentorSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let item;
  try { item = await getMentorSubmission(id); } catch (error) { if (error instanceof MentorshipAccessError) redirect("/mentoria"); throw error; }
  if (!item) notFound();
  const assignment = findPathV2Assignment(item.submission.assignmentKey) ?? findMentorshipAssignment(item.submission.assignmentKey);
  const week = mentorshipWeeks.find((entry) => entry.assignment.key === item.submission.assignmentKey);
  const response = typeof item.submission.content.response === "string" ? item.submission.content.response : JSON.stringify(item.submission.content, null, 2);
  const canReview = item.submission.status === "submitted" || item.submission.status === "in_review";

  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8"><Link href="/mentoria/mentor" className="inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft aria-hidden="true" className="size-4" />Voltar para a fila</Link>
    <header className="mt-8"><h1 className="text-3xl font-black text-off-white">{assignment?.title ?? item.submission.assignmentKey}</h1><p className="mt-2 text-sm text-[#AAB2BC]">{week ? `Semana ${week.number} · ` : ""}Tentativa {item.submission.attemptNumber} · nível {item.submission.level} · status {item.submission.status}</p></header>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><article className="border border-white/10 bg-[#171B21] p-6"><h2 className="font-bold text-off-white">Evidência enviada</h2><pre className="mt-5 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-[#D9DEE4]">{response}</pre>
      {item.submission.repositoryUrl && <a href={item.submission.repositoryUrl} target="_blank" rel="noreferrer" className="mt-6 block text-sm font-bold text-mint">Abrir repositório</a>}
      {item.submission.reportUrl && <a href={item.submission.reportUrl} target="_blank" rel="noreferrer" className="mt-3 block text-sm font-bold text-mint">Abrir relatório</a>}
      {item.submission.attachments.length > 0 && <section className="mt-6 border-t border-white/10 pt-5"><h3 className="font-bold text-off-white">Anexos</h3>{item.submission.attachments.map((file) => <a key={file.path} href={file.url || undefined} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-bold text-neon underline">{file.name}</a>)}</section>}
      {item.linkedLabEvidence && <section className="mt-6 border-t border-white/10 pt-5"><h3 className="font-bold text-off-white">Evidência vinculada do lab</h3><p className="mt-2 text-sm text-[#C8CFD7]">{item.linkedLabEvidence.labSlug} · severidade {item.linkedLabEvidence.severity}</p><p className="mt-2 whitespace-pre-wrap text-sm text-[#C8CFD7]">{item.linkedLabEvidence.result}</p>{item.linkedLabEvidence.reproduction && <p className="mt-2 whitespace-pre-wrap text-sm text-[#AAB2BC]">Reprodução: {item.linkedLabEvidence.reproduction}</p>}{item.linkedLabEvidence.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-[#AAB2BC]">Notas: {item.linkedLabEvidence.notes}</p>}{item.linkedLabEvidence.attachments.map((file) => <a key={file.path} href={file.url || undefined} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-bold text-neon underline">{file.name}</a>)}</section>}
      {item.reviews.length > 0 && <section className="mt-8 border-t border-white/10 pt-6"><h3 className="font-bold text-off-white">Histórico de revisões</h3><ul className="mt-4 space-y-4">{item.reviews.map((review) => <li key={review.id} className="border border-white/10 bg-[#101319] p-4 text-sm text-[#C8CFD7]"><p className="font-bold text-mint">{review.decision === "approved" ? "Aprovada" : "Ajustes solicitados"}</p>{assignment && <ul className="mt-3 space-y-1">{assignment.rubric.map((criterion) => <li key={criterion}>{criterion}: {review.scores[criterion] ?? "—"}/4</li>)}</ul>}<p className="mt-3">Próxima ação: {review.nextAction}</p></li>)}</ul></section>}
    </article>{canReview && assignment ? <ReviewForm submissionId={item.submission.id} criteria={assignment.rubric} /> : <aside className="h-fit border border-white/10 bg-[#171B21] p-6"><h2 className="font-bold text-off-white">Esta entrega não aguarda revisão</h2><p className="mt-2 text-sm text-[#AAB2BC]">O histórico segue disponível para consulta.</p></aside>}</div>
  </main>;
}
