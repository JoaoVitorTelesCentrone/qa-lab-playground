"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Attachment } from "@/lib/product/journey";
import { mentorshipTrackForWeek, mentorshipWeeks, type MentorshipTechnicalTrack } from "@/lib/mentorship/catalog";
import { getMentorshipSubmissionPrompts } from "@/lib/mentorship/submission-prompts";
import type { MentorshipSubmission } from "@/lib/mentorship/types";
import { MAX_FILES } from "@/lib/product/evidence-limits";

export function CompleteLessonButton({ lessonKey, completed, nextHref }: { lessonKey: string; completed: boolean; nextHref?: string }) {
  const router = useRouter();
  const [done, setDone] = useState(completed);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function complete() {
    if (done && nextHref) { router.push(nextHref); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/v1/mentorship/lessons/${encodeURIComponent(lessonKey)}/progress`, { method: "POST" });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error?.message ?? "Não foi possível salvar.");
      setDone(true);
      if (nextHref) router.push(nextHref);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível salvar. Tente novamente.");
    } finally { setBusy(false); }
  }

  return <span className="inline-flex flex-col items-end gap-1">
    <Button type="button" size={nextHref ? "default" : "sm"} variant={nextHref ? "default" : done ? "secondary" : "outline"} disabled={(done && !nextHref) || busy} onClick={complete}>
      {busy ? "Salvando..." : nextHref ? done ? "Continuar" : "Concluir e continuar" : done ? "Concluída" : "Marcar como concluída"}
    </Button>
    {error && <span className="text-xs text-destructive" role="alert">{error}</span>}
  </span>;
}

export function DiagnosticForm() {
  const [level, setLevel] = useState("beginner");
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const response = await fetch("/api/v1/mentorship/diagnostic", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ level, goal }) });
    const payload = await response.json().catch(() => null);
    setBusy(false);
    if (!response.ok) { setError(payload?.error?.message ?? "Nao foi possivel salvar o diagnostico."); return; }
    setMessage("Diagnostico salvo. Sua jornada tecnica esta pronta.");
  }

  return <form onSubmit={submit} className="grid gap-5">
    <label className="grid gap-2 text-sm font-semibold">Qual nivel descreve melhor seu momento?
      <select value={level} onChange={(event) => setLevel(event.target.value)} className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white">
        <option value="beginner">Iniciante: ainda estou construindo a base</option>
        <option value="intermediate">Intermediario: ja pratico QA e quero ganhar profundidade</option>
      </select>
    </label>
    <label className="grid gap-2 text-sm font-semibold">Qual resultado voce quer buscar nos proximos 90 dias?
      <textarea value={goal} onChange={(event) => setGoal(event.target.value)} required maxLength={500} rows={4} placeholder="Ex.: montar um portfolio e me preparar para entrevistas." className="rounded-lg border border-white/15 bg-[#101319] px-3 py-3 text-sm text-off-white placeholder:text-[#69737E]" />
    </label>
    {error && <p className="rounded-lg border border-coral/30 bg-coral/5 p-3 text-sm text-coral" role="alert">{error}</p>}
    {message && <div className="grid gap-3 rounded-lg border border-mint/30 bg-mint/5 p-4" role="status"><p className="text-sm text-mint">{message}</p><Link href="/mentoria/app" className="inline-flex min-h-10 items-center justify-center rounded-lg bg-mint px-4 py-2 text-sm font-bold text-[#101319] hover:bg-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-[#171B21]">Ir para minha jornada</Link></div>}
    <Button type="submit" disabled={busy}>{busy ? "Salvando..." : "Salvar diagnostico"}</Button>
  </form>;
}

type LabEvidenceOption = { id: string; labSlug: string; evidence: string; createdAt: string; attachments: Attachment[] };
type ApprovedMentorshipEvidenceOption = { id: string; assignmentKey: string; attemptNumber: number; createdAt: string };
type ReleaseProjectFields = { manual: string; automation: string; cicd: string; performance: string; releaseDecision: string };
const releaseTracks: Array<{ key: Exclude<MentorshipTechnicalTrack, "integrated">; label: string; prompt: string }> = [
  { key: "manual", label: "Teste manual", prompt: "Risco investigado, cenários executados, resultado e evidência." },
  { key: "automation", label: "Automação", prompt: "Fluxo automatizado, assertions, dados e como reproduzir a execução." },
  { key: "cicd", label: "CI/CD", prompt: "Pipeline, gates, artefatos, resultado e caminho de recuperação." },
  { key: "performance", label: "Carga e performance", prompt: "Modelo de carga, alvo local, thresholds, resultados e limites." },
];

export function SubmissionForm({ assignmentKey, initialSubmission, labEvidence = [], approvedEvidence = [], prompts }: { assignmentKey: string; initialSubmission: MentorshipSubmission | null; labEvidence?: LabEvidenceOption[]; approvedEvidence?: ApprovedMentorshipEvidenceOption[]; prompts?: readonly string[] }) {
  const [content, setContent] = useState(String(initialSubmission?.content.response ?? ""));
  const initialProject = initialSubmission?.content.finalProject && typeof initialSubmission.content.finalProject === "object" ? initialSubmission.content.finalProject as Partial<ReleaseProjectFields> : {};
  const initialEvidenceIds = initialSubmission?.content.evidenceSubmissionIds && typeof initialSubmission.content.evidenceSubmissionIds === "object" ? initialSubmission.content.evidenceSubmissionIds as Record<string, string> : {};
  const [finalProject, setFinalProject] = useState<ReleaseProjectFields>({ manual: initialProject.manual ?? "", automation: initialProject.automation ?? "", cicd: initialProject.cicd ?? "", performance: initialProject.performance ?? "", releaseDecision: initialProject.releaseDecision ?? "" });
  const [evidenceSubmissionIds, setEvidenceSubmissionIds] = useState<Record<string, string>>(initialEvidenceIds);
  const [repositoryUrl, setRepositoryUrl] = useState(initialSubmission?.repositoryUrl ?? "");
  const [reportUrl, setReportUrl] = useState(initialSubmission?.reportUrl ?? "");
  const [labSubmissionId, setLabSubmissionId] = useState(initialSubmission?.labSubmissionId ?? "");
  const [attachments, setAttachments] = useState<Attachment[]>(initialSubmission?.attachments ?? []);
  const [submissionStatus, setSubmissionStatus] = useState(initialSubmission?.status ?? null);
  const [attemptNumber, setAttemptNumber] = useState(initialSubmission?.attemptNumber ?? 0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isReleaseChallenge = assignmentKey === "mentoria.w12.assignment";
  const assignmentWeek = mentorshipWeeks.find((week) => week.assignment.key === assignmentKey)?.number ?? 0;
  const submissionPrompts = prompts ?? getMentorshipSubmissionPrompts(assignmentWeek);
  const responseTemplate = submissionPrompts.map((prompt, index) => `${index + 1}. ${prompt}\n`).join("\n");
  const evidenceOptionsByTrack = new Map(releaseTracks.map((track) => [track.key, approvedEvidence.filter((submission) => {
    const week = mentorshipWeeks.find((item) => item.assignment.key === submission.assignmentKey);
    return week && mentorshipTrackForWeek(week.number) === track.key;
  })]));
  const finalProjectComplete = releaseTracks.every((track) => finalProject[track.key].trim().length >= 20 && evidenceSubmissionIds[track.key]) && finalProject.releaseDecision.trim().length >= 30;
  const locked = submissionStatus === "submitted" || submissionStatus === "in_review" || submissionStatus === "approved";

  async function submissionBody() {
    if (!isReleaseChallenge) return { assignmentKey, content: { response: content }, repositoryUrl, reportUrl, labSubmissionId: labSubmissionId || undefined, attachments };
    const response = [...releaseTracks.map((track) => {
      const linked = approvedEvidence.find((item) => item.id === evidenceSubmissionIds[track.key]);
      const week = linked && mentorshipWeeks.find((item) => item.assignment.key === linked.assignmentKey);
      const reference = linked && week ? `Entrega aprovada relacionada: Semana ${week.number} · ${week.assignment.title} · tentativa ${linked.attemptNumber}` : "Entrega aprovada relacionada: não selecionada";
      return `${track.label}:\n${reference}\n${finalProject[track.key]}`;
    }), `Decisão de release:\n${finalProject.releaseDecision}`].join("\n\n");
    return { assignmentKey, content: { response, finalProject, evidenceSubmissionIds }, repositoryUrl, reportUrl, labSubmissionId: labSubmissionId || undefined, attachments };
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    if (attachments.length + files.length > MAX_FILES) { setError(`Escolha ate ${MAX_FILES} anexos para esta entrega.`); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      for (const file of Array.from(files)) {
        const form = new FormData(); form.set("file", file); form.set("assignmentKey", assignmentKey);
        const response = await fetch("/api/v1/mentorship/attachments", { method: "POST", body: form });
        const result = await response.json().catch(() => null);
        if (!response.ok) throw new Error(result?.error?.message ?? "Nao foi possivel enviar o anexo.");
        setAttachments((current) => [...current, result.data as Attachment]);
      }
      setMessage("Anexo enviado. Ele sera incluido no rascunho ou na entrega.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Nao foi possivel enviar o anexo.");
    } finally { setBusy(false); }
  }

  async function removeAttachment(file: Attachment) {
    setBusy(true); setError("");
    const response = await fetch(`/api/v1/evidence/upload?path=${encodeURIComponent(file.path)}`, { method: "DELETE" });
    const result = await response.json().catch(() => null);
    setBusy(false);
    if (!response.ok) { setError(result?.error?.message ?? "Nao foi possivel remover o anexo."); return; }
    setAttachments((current) => current.filter((item) => item.path !== file.path));
  }

  async function saveDraft() {
    setBusy(true); setError(""); setMessage("");
    const response = await fetch("/api/v1/mentorship/submissions/draft", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(await submissionBody()) });
    const result = await response.json().catch(() => null); setBusy(false);
    if (!response.ok) { setError(result?.error?.message ?? "Nao foi possivel salvar o rascunho."); return; }
    setSubmissionStatus("draft"); setAttemptNumber(result?.data?.attemptNumber ?? attemptNumber);
    setMessage("Rascunho salvo. Voce pode voltar a esta missao depois.");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const response = await fetch("/api/v1/mentorship/submissions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(await submissionBody()) });
    const result = await response.json().catch(() => null);
    setBusy(false);
    if (!response.ok) { setError(result?.error?.message ?? "Nao foi possivel enviar a entrega."); return; }
    setSubmissionStatus("submitted"); setAttemptNumber(result?.data?.attemptNumber ?? attemptNumber);
    setMessage(`Entrega ${result?.data?.attemptNumber ?? ""} enviada para revisao. O feedback aparecera nesta missao.`);
  }

  return <form onSubmit={submit} className="grid gap-4">
    <div><p className="text-xs font-bold uppercase tracking-[.14em] text-mint">Enviar para feedback</p><h2 className="mt-2 text-xl font-black text-off-white">Registre o que voce aprendeu</h2>{submissionStatus && <p className="mt-2 text-sm text-[#AAB2BC]">Status atual: <span className="font-bold text-mint">{({ draft: "Rascunho salvo", submitted: "Enviada", in_review: "Em revisao", changes_requested: "Ajustes solicitados", approved: "Aprovada" } as const)[submissionStatus]}</span>{attemptNumber > 0 ? ` · tentativa ${attemptNumber}` : ""}</p>}</div>
    {isReleaseChallenge ? <section className="grid gap-4"><div><h3 className="font-bold text-off-white">Conecte as quatro trilhas</h3><p className="mt-1 text-sm leading-6 text-[#AAB2BC]">Para cada etapa, selecione uma entrega aprovada anterior e explique a evidência que ela sustenta.</p></div>{releaseTracks.map((track) => { const options = evidenceOptionsByTrack.get(track.key) ?? []; return <fieldset key={track.key} className="grid gap-3 rounded-xl border border-white/10 bg-[#101319] p-4"><legend className="px-1 text-sm font-bold text-off-white">{track.label}</legend><label className="grid gap-2 text-sm font-semibold">Entrega aprovada relacionada<select required value={evidenceSubmissionIds[track.key] ?? ""} disabled={locked} onChange={(event) => setEvidenceSubmissionIds((current) => ({ ...current, [track.key]: event.target.value }))} className="h-11 rounded-lg border border-white/15 bg-[#171B21] px-3 text-sm text-off-white disabled:opacity-60"><option value="">Selecione uma entrega</option>{options.map((option) => { const week = mentorshipWeeks.find((item) => item.assignment.key === option.assignmentKey); return <option key={option.id} value={option.id}>Semana {week?.number} · {week?.assignment.title} · tentativa {option.attemptNumber}</option>; })}</select>{options.length === 0 && <span className="text-xs font-normal text-coral">Ainda não há entrega aprovada nesta trilha.</span>}</label><label className="grid gap-2 text-sm font-semibold">Evidência e resultado<textarea value={finalProject[track.key]} onChange={(event) => setFinalProject((current) => ({ ...current, [track.key]: event.target.value }))} required minLength={20} maxLength={3000} rows={4} disabled={locked} placeholder={track.prompt} className="rounded-lg border border-white/15 bg-[#171B21] px-3 py-3 text-sm text-off-white placeholder:text-[#69737E] disabled:opacity-60" /></label></fieldset>; })}<label className="grid gap-2 text-sm font-semibold">Decisão de release e risco residual<textarea value={finalProject.releaseDecision} onChange={(event) => setFinalProject((current) => ({ ...current, releaseDecision: event.target.value }))} required minLength={30} maxLength={3000} rows={5} disabled={locked} placeholder="Recomende liberar, bloquear ou liberar com mitigação. Conecte a decisão às quatro evidências, declare o risco residual e indique a próxima ação." className="rounded-lg border border-white/15 bg-[#101319] px-3 py-3 text-sm text-off-white placeholder:text-[#69737E] disabled:opacity-60" /></label></section> : <div className="grid gap-4">{submissionPrompts.length > 0 && <div className="border border-mint/20 bg-mint/[.04] p-4"><h3 className="font-bold text-off-white">Organize sua resposta</h3><ol className="mt-3 grid gap-2 text-sm leading-6 text-[#C8CFD7]">{submissionPrompts.map((prompt, index) => <li key={prompt}><span className="mr-2 font-bold text-mint">{index + 1}.</span>{prompt}</li>)}</ol><button type="button" disabled={locked || busy || Boolean(content.trim())} onClick={() => setContent(responseTemplate)} className="mt-4 text-sm font-bold text-neon hover:text-mint disabled:cursor-not-allowed disabled:opacity-50">Começar com este roteiro</button></div>}<label className="grid gap-2 text-sm font-semibold">Sua evidência<textarea value={content} onChange={(event) => setContent(event.target.value)} required rows={9} disabled={locked} placeholder="Descreva o que investigou, o que observou e qual decisão recomenda." className="rounded-lg border border-white/15 bg-[#101319] px-3 py-3 text-sm text-off-white placeholder:text-[#69737E] disabled:opacity-60" /></label></div>}
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold">Link do repositorio (opcional)
        <input value={repositoryUrl} onChange={(event) => setRepositoryUrl(event.target.value)} type="url" disabled={locked} placeholder="https://github.com/..." className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white placeholder:text-[#69737E] disabled:opacity-60" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">Link do relatorio (opcional)
        <input value={reportUrl} onChange={(event) => setReportUrl(event.target.value)} type="url" disabled={locked} placeholder="https://..." className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white placeholder:text-[#69737E] disabled:opacity-60" />
      </label>
    </div>
    {labEvidence.length > 0 && <label className="grid gap-2 text-sm font-semibold">Evidencia de Lab ja registrada <select value={labSubmissionId} disabled={locked} onChange={(event) => setLabSubmissionId(event.target.value)} className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white"><option value="">Nao vincular agora</option>{labEvidence.map((item) => <option key={item.id} value={item.id}>{item.labSlug} · {new Date(item.createdAt).toLocaleDateString("pt-BR")} · {item.evidence.slice(0, 80)}</option>)}</select><span className="text-xs font-normal text-[#8B949E]">A evidencia continua privada e vinculada a sua conta.</span></label>}
    <div className="grid gap-2 text-sm font-semibold"><label>Anexos (imagem, video ou PDF, ate 10 MB cada)<input type="file" accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm,application/pdf" multiple disabled={locked || busy} onChange={(event) => { void uploadFiles(event.target.files); event.currentTarget.value = ""; }} className="mt-2 block w-full text-xs text-[#AAB2BC] file:mr-3 file:border-0 file:bg-mint/10 file:px-3 file:py-2 file:font-bold file:text-mint" /></label>{attachments.map((file) => <div key={file.path} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2 text-xs"><a href={file.url || undefined} target="_blank" rel="noreferrer" className="truncate text-neon underline">{file.name}</a>{!locked && <button type="button" disabled={busy} onClick={() => void removeAttachment(file)} className="shrink-0 text-coral">Remover</button>}</div>)}</div>
    {error && <p className="rounded-lg border border-coral/30 bg-coral/5 p-3 text-sm text-coral" role="alert">{error}</p>}
    {message && <p className="rounded-lg border border-mint/30 bg-mint/5 p-3 text-sm text-mint" role="status">{message}</p>}
    {locked ? <p className="text-sm leading-6 text-[#AAB2BC]">Sua entrega está na fila de feedback. Quando houver um parecer, você poderá continuar por aqui.</p> : <div className="flex flex-wrap gap-3"><Button type="button" variant="outline" disabled={busy} onClick={saveDraft}>{busy ? "Salvando..." : "Salvar rascunho"}</Button><Button type="submit" disabled={busy || (isReleaseChallenge ? !finalProjectComplete : !content.trim())}>{busy ? "Enviando..." : "Enviar para revisão"}</Button></div>}
  </form>;
}

export function WeeklyCommitmentForm({ weekNumber, initialValue = "" }: { weekNumber: number; initialValue?: string }) {
  const [commitment, setCommitment] = useState(initialValue);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const response = await fetch("/api/v1/mentorship/commitments", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ weekNumber, commitment }) });
    const payload = await response.json().catch(() => null); setBusy(false);
    if (!response.ok) { setError(payload?.error?.message ?? "Nao foi possivel salvar o compromisso."); return; }
    setCommitment(payload?.data?.commitment ?? commitment); setMessage("Compromisso salvo. Leve esse ponto para o encontro ao vivo.");
  }

  return <form onSubmit={submit} className="grid gap-4"><label className="grid gap-2 text-sm font-semibold">Meu compromisso desta semana<textarea value={commitment} onChange={(event) => setCommitment(event.target.value)} required maxLength={500} rows={4} placeholder="Ex.: praticar dois cenarios de automacao e registrar uma duvida para o encontro." className="rounded-lg border border-white/15 bg-[#101319] px-3 py-3 text-sm text-off-white placeholder:text-[#69737E]" /></label>{error && <p className="rounded-lg border border-coral/30 bg-coral/5 p-3 text-sm text-coral" role="alert">{error}</p>}{message && <p className="rounded-lg border border-mint/30 bg-mint/5 p-3 text-sm text-mint" role="status">{message}</p>}<Button type="submit" variant="outline" disabled={busy}>{busy ? "Salvando..." : "Salvar compromisso"}</Button></form>;
}

export function ReviewForm({ submissionId, criteria }: { submissionId: string; criteria: string[] }) {
  const [saved, setSaved] = useState(false);
  const [decision, setDecision] = useState("changes_requested");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    if (criteria.some((criterion) => !scores[criterion])) { setBusy(false); setError("Dê uma nota para cada critério da rubrica."); return; }
    const response = await fetch(`/api/v1/mentorship/mentor/submissions/${submissionId}/review`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ decision, strengths, improvements, nextAction, scores }) });
    const payload = await response.json().catch(() => null);
    setBusy(false);
    if (!response.ok) { setError(payload?.error?.message ?? "Nao foi possivel salvar a revisao."); return; }
    setMessage("Revisao salva e status da entrega atualizado.");
    setSaved(true);
  }

  if (saved) return <section role="status" className="h-fit rounded-2xl border border-mint/25 bg-mint/[.04] p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-mint">Revisão registrada</p><h2 className="mt-2 text-xl font-black text-off-white">O aluno já pode acompanhar o feedback.</h2><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">O status da entrega foi atualizado e o aluno recebeu uma notificação na plataforma.</p><Button asChild className="mt-5"><Link href="/mentoria/mentor">Voltar para a fila</Link></Button></section>;

  return <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-white/10 bg-[#171B21] p-6">
    <div><p className="text-xs font-bold uppercase tracking-[.16em] text-mint">Rubrica do mentor</p><h2 className="mt-2 text-xl font-black text-off-white">Avalie e indique o proximo passo</h2><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">Use a mesma escala em todos os critérios: 1 precisa de orientação, 2 parcial, 3 atende ao esperado, 4 acima do esperado.</p></div>
    <div className="grid gap-4">{criteria.map((criterion, index) => <fieldset key={criterion} className="rounded-xl border border-white/10 bg-[#101319] p-4"><legend className="px-1 text-sm font-bold text-off-white">{index + 1}. {criterion}</legend><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{[1, 2, 3, 4].map((score) => <label key={score} className={`flex cursor-pointer items-start gap-2 border px-2 py-2 text-xs ${scores[criterion] === score ? "border-mint bg-mint/10 text-off-white" : "border-white/10 text-[#AAB2BC]"}`}><input type="radio" name={`score-${index}`} value={score} checked={scores[criterion] === score} onChange={() => setScores((current) => ({ ...current, [criterion]: score }))} required className="mt-0.5 accent-[#9FE870]" /><span><strong>{score}</strong><span className="ml-1">{["Precisa de orientação", "Parcial", "Atende", "Acima do esperado"][score - 1]}</span></span></label>)}</div></fieldset>)}</div>
    <label className="grid gap-2 text-sm font-semibold">Decisao<select value={decision} onChange={(event) => setDecision(event.target.value)} className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white"><option value="changes_requested">Pedir ajustes</option><option value="approved">Aprovar entrega</option></select></label>
    <label className="grid gap-2 text-sm font-semibold">Pontos fortes<textarea value={strengths} onChange={(event) => setStrengths(event.target.value)} required rows={4} className="rounded-lg border border-white/15 bg-[#101319] px-3 py-3 text-sm text-off-white" /></label>
    <label className="grid gap-2 text-sm font-semibold">O que melhorar<textarea value={improvements} onChange={(event) => setImprovements(event.target.value)} required rows={4} className="rounded-lg border border-white/15 bg-[#101319] px-3 py-3 text-sm text-off-white" /></label>
    <label className="grid gap-2 text-sm font-semibold">Proxima acao<textarea value={nextAction} onChange={(event) => setNextAction(event.target.value)} required rows={3} className="rounded-lg border border-white/15 bg-[#101319] px-3 py-3 text-sm text-off-white" /></label>
    {error && <p className="rounded-lg border border-coral/30 bg-coral/5 p-3 text-sm text-coral" role="alert">{error}</p>}{message && <p className="rounded-lg border border-mint/30 bg-mint/5 p-3 text-sm text-mint" role="status">{message}</p>}
    <Button type="submit" disabled={busy}>{busy ? "Salvando..." : "Salvar revisão"}</Button>
  </form>;
}

type AttendanceOption = { id: string; cohort_id: string; week_number?: number; title?: string; starts_at?: string; user_id?: string; full_name?: string; level?: string };

export function AttendanceForm({ sessions, enrollments }: { sessions: AttendanceOption[]; enrollments: AttendanceOption[] }) {
  const [form, setForm] = useState({ sessionId: sessions[0]?.id ?? "", enrollmentId: enrollments[0]?.id ?? "", status: "present" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const response = await fetch("/api/v1/mentorship/mentor/attendance", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    const payload = await response.json().catch(() => null); setBusy(false);
    if (!response.ok) { setError(payload?.error?.message ?? "Nao foi possivel registrar a presenca."); return; }
    setMessage("Presenca atualizada.");
  }
  return <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-white/10 bg-[#171B21] p-6"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-mint">Acompanhamento ao vivo</p><h2 className="mt-2 text-xl font-black text-off-white">Registrar presenca</h2></div>{sessions.length === 0 || enrollments.length === 0 ? <p className="text-sm leading-6 text-[#AAB2BC]">Publique um encontro e matricule pelo menos um aluno para registrar presenca.</p> : <><label className="grid gap-2 text-sm font-semibold">Encontro<select required value={form.sessionId} onChange={(event) => setForm({ ...form, sessionId: event.target.value })} className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white">{sessions.map((session) => <option key={session.id} value={session.id}>Semana {session.week_number} · {session.title} · {session.starts_at ? new Date(session.starts_at).toLocaleString("pt-BR") : ""}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold">Aluno<select required value={form.enrollmentId} onChange={(event) => setForm({ ...form, enrollmentId: event.target.value })} className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white">{enrollments.map((enrollment) => <option key={enrollment.id} value={enrollment.id}>{enrollment.full_name ?? enrollment.user_id} · {enrollment.level}</option>)}</select></label><label className="grid gap-2 text-sm font-semibold">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white"><option value="present">Presente</option><option value="absent">Ausente</option><option value="excused">Justificado</option><option value="watched_recording">Assistiu a gravacao</option></select></label><Button type="submit" disabled={busy}>{busy ? "Salvando..." : "Salvar presenca"}</Button></>}{error && <p role="alert" className="text-sm text-coral">{error}</p>}{message && <p role="status" className="text-sm text-mint">{message}</p>}</form>;
}

export function MentorshipPortfolioForm({ submissionId, initialTitle = "Release Challenge", initialSummary = "", initialPublished = false }: { submissionId: string; initialTitle?: string; initialSummary?: string; initialPublished?: boolean }) {
  const [form, setForm] = useState({ title: initialTitle, summary: initialSummary, published: initialPublished });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const response = await fetch("/api/v1/mentorship/portfolio", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ submissionId, ...form }) });
    const payload = await response.json().catch(() => null); setBusy(false);
    if (!response.ok) { setError(payload?.error?.message ?? "Nao foi possivel salvar o case."); return; }
    setMessage(form.published ? "Case publicado no seu portfolio." : "Case salvo como privado.");
  }
  return <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-mint/25 bg-mint/[.04] p-6"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-mint">Portfolio</p><h2 className="mt-2 text-xl font-black text-off-white">Transformar a entrega em case</h2><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">A publicacao e opcional. Seu mentor ja aprovou a entrega; agora voce decide o que fica publico.</p></div><label className="grid gap-2 text-sm font-semibold">Titulo<input required maxLength={160} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="h-11 rounded-lg border border-white/15 bg-[#101319] px-3 text-sm text-off-white" /></label><label className="grid gap-2 text-sm font-semibold">Resumo<textarea required maxLength={2000} rows={5} value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} placeholder="Contexto, risco, abordagem e resultado do seu projeto." className="rounded-lg border border-white/15 bg-[#101319] px-3 py-3 text-sm text-off-white placeholder:text-[#69737E]" /></label><label className="flex items-start gap-3 text-sm text-[#D9DEE4]"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} className="mt-1 size-4 accent-[#9FE870]" />Publicar este case no meu portfolio publico</label>{error && <p role="alert" className="text-sm text-coral">{error}</p>}{message && <p role="status" className="text-sm text-mint">{message}</p>}<Button type="submit" variant="outline" disabled={busy}>{busy ? "Salvando..." : "Salvar decisao de publicacao"}</Button></form>;
}
