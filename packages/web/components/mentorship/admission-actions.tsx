"use client";

import Link from "next/link";
import { useState } from "react";

function authHref(mode: "cadastro" | "login", next: string) {
  return `/${mode}?next=${encodeURIComponent(next)}`;
}

export function JoinOffer({ offerId, offerCode, offerVersion, terms, cancellationPolicy, signedIn }: {
  offerId: string; offerCode: string; offerVersion: number; terms: string; cancellationPolicy: string; signedIn: boolean;
}) {
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const next = `/mentoria/inscricao?offer=${encodeURIComponent(offerId)}`;
  async function checkout() {
    if (!signedIn) { window.location.assign(authHref("cadastro", next)); return; }
    if (!accepted || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/v1/mentorship/checkout", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ offerId, offerVersion, acceptedTerms: accepted }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || typeof payload?.data?.checkoutUrl !== "string") throw new Error(payload?.error?.message ?? "Não foi possível iniciar a inscrição.");
      window.location.assign(payload.data.checkoutUrl);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível iniciar a inscrição.");
      setBusy(false);
    }
  }
  return <div className="mt-6 border-t border-white/10 pt-5">
    <p className="whitespace-pre-wrap text-sm leading-6 text-[#C8CFD7]">{terms}</p>
    <details className="mt-3 text-sm text-[#AAB2BC]"><summary className="cursor-pointer font-semibold text-mint">Condições de cancelamento</summary><p className="mt-2 whitespace-pre-wrap leading-6">{cancellationPolicy}</p></details>
    {signedIn ? <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#D9DEE4]"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 size-4 accent-[#9FE870]" /><span>Li e aceito as condições desta oferta e da turma.</span></label> : <p className="mt-5 text-sm text-[#AAB2BC]">Entre ou crie sua conta para continuar. A vaga só é confirmada após o pagamento.</p>}
    <button type="button" onClick={checkout} disabled={busy || (signedIn && !accepted)} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-mint px-5 text-sm font-black text-[#101319] transition hover:bg-[#BDFF9B] disabled:cursor-not-allowed disabled:opacity-50">
      {busy ? "Abrindo pagamento…" : signedIn ? "Continuar para pagamento" : "Criar conta e escolher esta turma"}
    </button>
    {error && <p role="alert" className="mt-3 text-sm text-coral">{error}</p>}
    {!signedIn && <Link href={authHref("login", next)} className="mt-3 inline-block text-sm font-semibold text-mint hover:underline">Já tenho conta</Link>}
    <span className="sr-only">Oferta {offerCode}</span>
  </div>;
}

export function JoinWaitlist({ cohortId, signedIn }: { cohortId?: string | null; signedIn: boolean }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [acceptedContact, setAcceptedContact] = useState(false);
  const next = cohortId ? `/mentoria/inscricao?cohort=${encodeURIComponent(cohortId)}` : "/mentoria/inscricao";
  async function join() {
    if (!signedIn) { window.location.assign(authHref("cadastro", next)); return; }
    if (!acceptedContact) { setError("Autorize o contato para entrar na lista de interesse."); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/v1/mentorship/applications", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ cohortId: cohortId ?? null, acceptedContact }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error?.message ?? "Não foi possível registrar seu interesse.");
      setMessage(payload.data.alreadyRegistered ? "Seu interesse já está registrado. A equipe avisará quando houver novidades." : "Interesse registrado. A equipe avisará quando houver uma turma disponível.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível registrar seu interesse.");
    } finally { setBusy(false); }
  }
  return <div className="mt-6">
    {signedIn ? <label className="mb-4 flex cursor-pointer items-start gap-3 text-xs leading-5 text-[#AAB2BC]"><input type="checkbox" checked={acceptedContact} onChange={(event) => setAcceptedContact(event.target.checked)} className="mt-1 size-4 accent-[#9FE870]" /><span>Concordo em ser contatado pela equipe sobre novas turmas da Mentoria QA Lab.</span></label> : <p className="mb-4 text-xs leading-5 text-[#AAB2BC]">Entre ou crie uma conta. Depois, você poderá autorizar o contato para receber notícias sobre novas turmas.</p>}
    <button type="button" onClick={join} disabled={busy || (signedIn && !acceptedContact)} className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-mint/40 px-5 text-sm font-bold text-mint hover:bg-mint/10 disabled:opacity-50">{busy ? "Registrando…" : signedIn ? "Entrar na lista de interesse" : "Criar conta para entrar na lista"}</button>
    {message && <p role="status" className="mt-3 text-sm text-mint">{message}</p>}
    {error && <p role="alert" className="mt-3 text-sm text-coral">{error}</p>}
    {!signedIn && <Link href={authHref("login", next)} className="mt-3 inline-block text-sm font-semibold text-mint hover:underline">Já tenho conta</Link>}
  </div>;
}

export function OrderStatus({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<{ status: string; payment_status: string | null; amount: number; currency: string; reservation_expires_at: string; enrollment_id: string | null; cohort: { name: string } | null } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function refresh() {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/v1/mentorship/orders/${encodeURIComponent(orderId)}`, { cache: "no-store" });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error?.message ?? "Não foi possível consultar sua inscrição.");
      setStatus(payload.data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível consultar sua inscrição."); }
    finally { setBusy(false); }
  }
  return <div className="mt-8 border-t border-white/10 pt-6">
    {!status && <button onClick={refresh} disabled={busy} className="rounded-lg bg-mint px-5 py-3 text-sm font-black text-[#101319] disabled:opacity-50">{busy ? "Consultando…" : "Consultar pagamento"}</button>}
    {status && <div role="status" className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-mint">{status.cohort?.name ?? "Mentoria QA Lab"}</p>
      <h2 className="text-2xl font-black text-off-white">{status.status === "approved" && status.enrollment_id ? "Sua vaga está confirmada" : status.status === "paid_no_seat" ? "Precisamos falar com você" : status.status === "rejected" || status.status === "cancelled" || status.status === "expired" ? "Pagamento não concluído" : "Pagamento em processamento"}</h2>
      <p className="text-sm leading-6 text-[#AAB2BC]">{status.status === "approved" && status.enrollment_id ? "Sua matrícula está ativa. Faça o diagnóstico para iniciar." : status.status === "paid_no_seat" ? "O pagamento foi recebido, mas a vaga precisa de conciliação pela equipe. Use o contato informado na página da mentoria." : status.status === "rejected" || status.status === "cancelled" || status.status === "expired" ? "A vaga reservada foi liberada. Se as inscrições ainda estiverem abertas, volte à página da mentoria para tentar novamente." : "A confirmação pode levar alguns instantes. Atualize o estado para consultar novamente."}</p>
      {status.status === "approved" && status.enrollment_id ? <Link href="/mentoria/diagnostico" className="inline-flex rounded-lg bg-mint px-5 py-3 text-sm font-black text-[#101319]">Começar diagnóstico</Link> : <button onClick={refresh} disabled={busy} className="rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-off-white disabled:opacity-50">{busy ? "Consultando…" : "Atualizar estado"}</button>}
    </div>}
    {error && <p role="alert" className="mt-3 text-sm text-coral">{error}</p>}
  </div>;
}
