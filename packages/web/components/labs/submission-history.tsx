"use client";

// Histórico de entregas de um Lab, com correção e exclusão.
//
// Existe porque a evidência virou um campo livre grande com arquivos: antes,
// com quatro campos curtos, reentregar era barato; agora um typo ou um print
// errado ficaria para sempre no que o recrutador abre. Corrigir não republica
// nem muda a data — a entrega continua sendo a do dia em que o trabalho foi
// feito, e o que muda é só o conteúdo.
//
// Apagar a última entrega reabre o Lab no servidor (a matrícula volta para
// "started"), então avisamos isso antes de confirmar.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AttachmentGallery, EvidenceText } from "@/components/portfolio/evidence-body";
import { EvidenceField } from "./evidence-field";
import { evaluateEvidence } from "@/lib/product/evaluation";
import type { Attachment, Submission } from "@/lib/product/journey";

export function SubmissionHistory({ labSlug, submissions }: { labSlug: string; submissions: Submission[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ evidence: "", attachments: [] as Attachment[] });
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);

  if (submissions.length === 0) return null;

  function startEdit(item: Submission) {
    setEditing(item.id);
    setDraft({ evidence: item.evidence, attachments: item.attachments });
    setError("");
  }

  async function save(id: string) {
    const local = evaluateEvidence({ evidence: draft.evidence, attachments: draft.attachments.length });
    if (!local.passed) {
      setError(local.issues[0].message);
      return;
    }
    setBusy(id); setError("");
    const response = await fetch("/api/v1/submissions", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, evidence: draft.evidence, attachments: draft.attachments }),
    });
    setBusy("");
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error?.message ?? "Não foi possível salvar a correção.");
      return;
    }
    setEditing(null);
    router.refresh();
  }

  async function remove(id: string) {
    setBusy(id); setError("");
    const response = await fetch(`/api/v1/submissions?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setBusy("");
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error?.message ?? "Não foi possível apagar a entrega.");
      return;
    }
    setConfirming(null);
    router.refresh();
  }

  const last = submissions.length === 1;

  return <details className="mt-6 rounded-md border border-border">
    <summary className="cursor-pointer p-3 text-xs font-medium text-muted-foreground">{submissions.length} entrega(s) já registrada(s) neste Lab</summary>

    <ul className="grid gap-3 border-t border-border p-3">{submissions.map((item) => <li key={item.id} className="rounded border border-border p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {new Date(item.createdAt).toLocaleString("pt-BR")}
          {item.attachments.length > 0 ? ` · ${item.attachments.length} anexo(s)` : ""}
          {item.published ? " · publicada" : ""}
        </p>

        {editing !== item.id && <div className="flex gap-1.5">
          <Button type="button" size="sm" variant="ghost" onClick={() => startEdit(item)}>
            <Pencil className="size-3.5" aria-hidden="true" /> Corrigir
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => { setConfirming(item.id); setError(""); }} className="text-destructive hover:text-destructive">
            <Trash2 className="size-3.5" aria-hidden="true" /> Apagar
          </Button>
        </div>}
      </div>

      {editing === item.id ? <div className="mt-3">
        <EvidenceField
          labSlug={labSlug}
          value={draft.evidence}
          attachments={draft.attachments}
          onValueChange={(evidence) => setDraft((current) => ({ ...current, evidence }))}
          onAttachmentsChange={(attachments) => setDraft((current) => ({ ...current, attachments }))}
          disabled={busy === item.id}
        />
        <div className="mt-2 flex gap-2">
          <Button type="button" size="sm" disabled={busy === item.id} onClick={() => void save(item.id)}>
            {busy === item.id ? <Loader2 className="size-3.5 animate-spin" /> : null} Salvar correção
          </Button>
          <Button type="button" size="sm" variant="ghost" disabled={busy === item.id} onClick={() => { setEditing(null); setError(""); }}>Cancelar</Button>
        </div>
      </div> : <>
        {item.evidence
          ? <EvidenceText text={item.evidence} className="mt-2" />
          : <p className="mt-2 text-muted-foreground">Evidência só em anexo.</p>}
        {item.attachments.length > 0 && <div className="mt-3"><AttachmentGallery attachments={item.attachments} compact /></div>}
      </>}

      {confirming === item.id && <div role="alertdialog" aria-label="Confirmar exclusão" className="mt-3 rounded-md border border-destructive/40 bg-destructive/[0.04] p-3">
        <p className="text-xs">
          Apagar esta entrega remove também os anexos dela.
          {last && " Como é a única deste Lab, ele volta para 'em andamento'."}
        </p>
        <div className="mt-2 flex gap-2">
          <Button type="button" size="sm" variant="destructive" disabled={busy === item.id} onClick={() => void remove(item.id)}>
            {busy === item.id ? <Loader2 className="size-3.5 animate-spin" /> : null} Apagar mesmo assim
          </Button>
          <Button type="button" size="sm" variant="ghost" disabled={busy === item.id} onClick={() => setConfirming(null)}>Cancelar</Button>
        </div>
      </div>}
    </li>)}</ul>

    {error && <p role="alert" className="border-t border-border p-3 text-xs text-destructive">{error}</p>}
  </details>;
}
