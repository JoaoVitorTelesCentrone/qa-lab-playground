"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, ExternalLink, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MentorshipCertificate, MentorshipCertificateProgress } from "@/lib/mentorship/store";

export function MentorshipCertificateAction({ initialProgress }: { initialProgress: MentorshipCertificateProgress }) {
  const [certificate, setCertificate] = useState<MentorshipCertificate | null>(initialProgress.certificate);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function issue() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/v1/mentorship/certificate", { method: "POST" });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error?.message ?? "Nao foi possivel emitir o certificado.");
      setCertificate(result?.data?.certificate ?? null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Nao foi possivel emitir o certificado.");
    } finally { setBusy(false); }
  }

  const ready = initialProgress.eligible || certificate !== null;
  return <section className="mt-8 flex flex-col gap-5 border border-mint/25 bg-mint/[.04] p-6 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-4"><Award className="mt-1 size-6 shrink-0 text-mint" /><div><p className="text-xs font-bold uppercase tracking-[.16em] text-mint">Certificado da mentoria</p><h2 className="mt-2 text-xl font-black text-off-white">{certificate ? "Sua conclusão está registrada." : ready ? "Você concluiu os critérios." : "Continue sua jornada."}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#AAB2BC]">Entregas aprovadas: {initialProgress.approvedAssignments}/{initialProgress.requiredAssignments} · Aulas concluídas: {initialProgress.completedLessons}/{initialProgress.requiredLessons}. A elegibilidade é conferida novamente ao emitir.</p>{error && <p role="alert" className="mt-3 text-sm text-coral">{error}</p>}</div></div>
    {certificate ? <Button asChild variant="outline"><Link href={`/mentoria/certificado/${certificate.code}`}>Ver certificado <ExternalLink className="size-4" /></Link></Button> : <Button type="button" disabled={!ready || busy} onClick={() => void issue()}>{busy ? <LoaderCircle className="size-4 animate-spin" /> : <Award className="size-4" />}{busy ? "Emitindo..." : ready ? "Emitir certificado" : "Critérios pendentes"}</Button>}
  </section>;
}
