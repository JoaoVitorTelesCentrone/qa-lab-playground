"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CommitmentCheckIn({ commitmentId, initialCheckIn = "" }: { commitmentId: string; initialCheckIn?: string }) {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setError("");
    const response = await fetch("/api/v1/mentorship/mentor/commitments", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ commitmentId, checkIn }) });
    const result = await response.json().catch(() => null); setBusy(false);
    if (!response.ok) { setError(result?.error?.message ?? "Nao foi possivel salvar o retorno."); return; }
    setCheckIn(result?.data?.check_in ?? checkIn); setMessage("Retorno salvo para este aluno.");
  }
  return <form onSubmit={submit} className="mt-3 grid gap-2"><label className="grid gap-2 text-xs font-semibold text-[#AAB2BC]">Retorno privado do mentor<textarea value={checkIn} onChange={(event) => setCheckIn(event.target.value)} required maxLength={1000} rows={3} placeholder="O que avançou e qual é a próxima ação combinada?" className="rounded-lg border border-white/10 bg-[#101319] px-3 py-2 text-sm text-off-white" /></label>{error && <p role="alert" className="text-xs text-coral">{error}</p>}{message && <p role="status" className="text-xs text-mint">{message}</p>}<Button type="submit" size="sm" variant="outline" disabled={busy}>{busy ? "Salvando..." : "Salvar retorno"}</Button></form>;
}
