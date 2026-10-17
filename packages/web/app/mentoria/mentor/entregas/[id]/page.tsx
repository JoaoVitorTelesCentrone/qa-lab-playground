import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ReviewForm } from "@/components/mentorship/mentorship-actions";
import { MentorshipAccessError } from "@/lib/mentorship/access";
import { mentorshipWeeks } from "@/lib/mentorship/catalog";
import { getMentorSubmission } from "@/lib/mentorship/store";

export const dynamic = "force-dynamic";

export default async function MentorSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let item;
  try { item = await getMentorSubmission(id); } catch (error) { if (error instanceof MentorshipAccessError) redirect("/mentoria"); throw error; }
  if (!item) notFound();
  const response = typeof item.submission.content.response === "string" ? item.submission.content.response : JSON.stringify(item.submission.content, null, 2);
  const week = mentorshipWeeks.find((entry) => entry.assignment.key === item.submission.assignmentKey);
  const canReview = item.submission.status === "submitted" || item.submission.status === "in_review";

  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
    <Link href="/mentoria/mentor" className="inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft className="size-4" /> Voltar para a fila</Link>
    <header className="mt-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-mint">Entrega do aluno</p><h1 className="mt-3 text-3xl font-black text-off-white">{week?.assignment.title ?? item.submission.assignmentKey}</h1><p className="mt-2 text-sm text-[#AAB2BC]">{week ? `Semana ${week.number} · ` : ""}Tentativa {item.submission.attemptNumber} · nível {item.submission.level} · status {item.submission.status}</p></header>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <article className="rounded-2xl border border-white/10 bg-[#171B21] p-6">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-neon">Evidência enviada</p>
        <pre className="mt-5 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-[#D9DEE4]">{response}</pre>
        {item.submission.repositoryUrl && <a href={item.submission.repositoryUrl} target="_blank" rel="noreferrer" className="mt-6 inline-block text-sm font-bold text-mint hover:text-neon">Abrir repositório</a>}
        {item.submission.reportUrl && <a href={item.submission.reportUrl} target="_blank" rel="noreferrer" className="ml-5 inline-block text-sm font-bold text-mint hover:text-neon">Abrir relatório</a>}
        {item.submission.attachments.length > 0 && <div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#8B949E]">Anexos enviados</p>{item.submission.attachments.map((file) => <a key={file.path} href={file.url || undefined} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-bold text-neon underline">{file.name}</a>)}</div>}
        {item.linkedLabEvidence && <div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#8B949E]">Evidência vinculada do Lab</p><p className="mt-2 font-bold text-off-white">{item.linkedLabEvidence.labSlug} · severidade {item.linkedLabEvidence.severity}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#C8CFD7]">{item.linkedLabEvidence.result}</p>{item.linkedLabEvidence.reproduction && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#AAB2BC]">Reprodução: {item.linkedLabEvidence.reproduction}</p>}{item.linkedLabEvidence.notes && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#AAB2BC]">Notas: {item.linkedLabEvidence.notes}</p>}{item.linkedLabEvidence.attachments.map((file) => <a key={file.path} href={file.url || undefined} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-bold text-neon underline">{file.name}</a>)}</div>}
        {item.reviews.length > 0 && <div className="mt-8 border-t border-white/10 pt-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#8B949E]">Histórico de revisões</p><div className="mt-4 grid gap-4">{item.reviews.map((review) => <div key={review.id} className="rounded-xl border border-white/10 bg-[#101319] p-4"><p className="text-xs font-bold text-neon">{review.decision === "approved" ? "Aprovada" : "Ajustes solicitados"}</p>{week && <ul className="mt-3 grid gap-2">{week.assignment.rubric.map((criterion) => <li key={criterion} className="flex items-center justify-between gap-3 text-sm text-[#C8CFD7]"><span>{criterion}</span><span className="shrink-0 font-bold text-mint">{review.scores[criterion] ?? "—"}/4</span></li>)}</ul>}<p className="mt-3 text-sm leading-6 text-[#AAB2BC]">{review.nextAction}</p></div>)}</div></div>}
      </article>
      {canReview ? <ReviewForm submissionId={item.submission.id} criteria={week?.assignment.rubric ?? []} /> : <aside className="h-fit rounded-2xl border border-white/10 bg-[#171B21] p-6"><h2 className="font-bold text-off-white">Esta entrega não está aguardando revisão</h2><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">O histórico continua disponível para consulta, mas novas avaliações só podem ser registradas em entregas pendentes.</p></aside>}
    </div>
  </main>;
}
