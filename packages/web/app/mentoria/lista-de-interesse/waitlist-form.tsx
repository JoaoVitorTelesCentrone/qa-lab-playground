"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

type Attribution = { source: string | null; medium: string | null; campaign: string | null };

export function MentorshipWaitlistForm({ available, attribution }: { available: boolean; attribution: Attribution }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [acceptedContact, setAcceptedContact] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !available) return;
    if (!acceptedContact) {
      setError("Marque a autorização de contato para entrar na lista.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/v1/mentorship/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fullName, email, acceptedContact, attribution }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || payload?.data?.registered !== true) throw new Error(payload?.error?.message ?? "Não foi possível registrar seu interesse.");
      setDone(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "A conexão falhou. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  if (done) return <div role="status" className="mentoria-list-success">
    <span><Check aria-hidden="true" size={29} /></span>
    <h2>Você está na lista.</h2>
    <p>Vamos avisar quando houver uma nova turma da Mentoria QA Lab.</p>
  </div>;

  return <form onSubmit={submit} className="mentoria-list-form">
    <h2>Receba o aviso da próxima turma.</h2>
    <p>Deixe seu contato. A inscrição é gratuita e não reserva nem cobra uma vaga.</p>
    {!available && <p role="alert" className="mentoria-list-unavailable">Os cadastros estão temporariamente indisponíveis. Volte em breve.</p>}
    <label htmlFor="waitlist-name">Seu nome</label>
    <input id="waitlist-name" name="fullName" autoComplete="name" required minLength={2} maxLength={80} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Como podemos chamar você?" />
    <label htmlFor="waitlist-email">Seu e-mail</label>
    <input id="waitlist-email" name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" />
    <label className="mentoria-list-consent"><input type="checkbox" checked={acceptedContact} onChange={(event) => setAcceptedContact(event.target.checked)} /><span>Concordo em receber contato da equipe sobre novas turmas da Mentoria QA Lab.</span></label>
    <button type="submit" disabled={busy || !available} className="mentoria-list-submit">{busy ? "Registrando..." : "Entrar na lista"}<ArrowRight aria-hidden="true" size={17} /></button>
    {error && <p role="alert" className="mentoria-list-error">{error}</p>}
    <small>Usaremos seu e-mail apenas para avisos sobre turmas da mentoria.</small>
  </form>;
}
