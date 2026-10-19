"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { ChallengeCaseContent } from "./challenge-case-content";
import type { SavedChallenge } from "./challenge-account";
import { CHALLENGE_CASE_SUMMARY, CHALLENGE_CASE_TITLE } from "@/lib/challenge-case";
import { countDeliverables, isChallengeReady, sameChallengeDeliverables, type ChallengeDeliverables } from "@/lib/challenge-deliverables";

type Profile = { username: string; portfolioPublic: boolean };
type StoredCase = { title: string; summary: string; published: boolean; source_deliverable_id: string };

export function ChallengeCasePublisher({ data, saved }: { data: ChallengeDeliverables; saved: SavedChallenge | null }) {
  const [status, setStatus] = useState<"loading" | "guest" | "ready" | "error">("loading");
  const [profile, setProfile] = useState<Profile>({ username: "", portfolioPublic: false });
  const [existing, setExisting] = useState<StoredCase | null>(null);
  const [title, setTitle] = useState(CHALLENGE_CASE_TITLE);
  const [summary, setSummary] = useState(CHALLENGE_CASE_SUMMARY);
  const [username, setUsername] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/v1/challenge/case", { cache: "no-store" }).then(async (response) => {
      if (!active) return;
      if (response.status === 401) { setStatus("guest"); return; }
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível consultar o case.");
      if (!active) return;
      setProfile(body.data.profile);
      setUsername(body.data.profile.username);
      setExisting(body.data.case);
      if (body.data.case) { setTitle(body.data.case.title); setSummary(body.data.case.summary); }
      setStatus("ready");
    }).catch((error) => { if (active) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Não foi possível consultar o case."); } });
    return () => { active = false; };
  }, []);

  const hasDraft = countDeliverables(data) > 0;
  const current = saved && sameChallengeDeliverables(saved.deliverables, data);
  const eligible = current && isChallengeReady(saved.deliverables);
  const publicUrl = profile.username ? `/portfolio/${profile.username}/expenseflow` : "";

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!saved || !eligible || !confirmed) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/v1/challenge/case", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sourceId: saved.id, title, summary, username }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível publicar o case.");
      const name = body.data.url.split("/")[2];
      setProfile({ username: name, portfolioPublic: true });
      setExisting({ title: title.trim(), summary: summary.trim(), published: true, source_deliverable_id: saved.id });
      setMessage("Case publicado. O link público já está disponível.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível publicar o case."); }
    finally { setBusy(false); }
  }

  async function unpublish() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/v1/challenge/case", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: false }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível despublicar.");
      setExisting((value) => value ? { ...value, published: false } : value);
      setMessage("Case retirado do portfólio público. A versão salva na conta foi mantida.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível despublicar."); }
    finally { setBusy(false); }
  }

  return <section aria-labelledby="challenge-case-title" className="mt-12 border-t border-white/15 pt-9">
    <h2 id="challenge-case-title" className="text-2xl font-bold text-off-white sm:text-3xl">Transforme a entrega em case</h2>
    <p className="mt-3 max-w-[70ch] text-sm leading-6 text-[#C8CFD7]">Revise o relato antes de publicá-lo. Sua cópia privada continua na conta; só esta versão escolhida entra no portfólio.</p>
    {status === "loading" && <p role="status" className="mt-5 text-sm text-[#C8CFD7]">Carregando opções de publicação...</p>}
    {status === "guest" && <p className="mt-5 text-sm text-[#C8CFD7]">Entre e salve sua entrega na conta para publicar o case.</p>}
    {status === "error" && <p role="alert" className="mt-5 text-sm text-[#F4B1A9]">{message}</p>}
    {status === "ready" && <>
      {existing?.published && <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-mint/25 py-4 text-sm"><span className="font-semibold text-mint">Seu case está público.</span><Link href={publicUrl} className="inline-flex items-center gap-1 font-semibold text-off-white underline underline-offset-4">Abrir case <ArrowUpRight className="size-4" /></Link><button type="button" onClick={unpublish} disabled={busy} className="inline-flex min-h-11 items-center gap-2 text-[#F4B1A9] underline underline-offset-4 disabled:opacity-40"><EyeOff className="size-4" />Despublicar</button></div>}
      {!hasDraft ? <p className="mt-6 text-sm text-[#C8CFD7]">A prévia aparece depois que você registra sua primeira entrega.</p> : <>
        <form onSubmit={publish} className="mt-7 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-semibold text-off-white">Título do case<input required minLength={3} maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} className="field" /></label><label className="grid gap-2 text-sm font-semibold text-off-white">Endereço público do portfólio<input required minLength={3} maxLength={30} readOnly={Boolean(profile.username)} value={username} onChange={(event) => setUsername(event.target.value)} className="field read-only:opacity-70" placeholder="seu-nome" /></label></div>
          <label className="grid gap-2 text-sm font-semibold text-off-white">Resumo para quem abre o portfólio<textarea required minLength={40} maxLength={1000} rows={3} value={summary} onChange={(event) => setSummary(event.target.value)} className="field resize-y" /></label>
          <div className="border-y border-white/15 py-6"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-bold text-off-white">Prévia do conteúdo</h3><span className="inline-flex items-center gap-2 text-xs text-mint"><Eye className="size-4" />{current ? "Versão salva na conta" : "Rascunho deste navegador"}</span></div><div className="mt-6 max-h-[36rem] overflow-y-auto pr-2"><ChallengeCaseContent title={title} summary={summary} data={current ? saved!.deliverables : data} /></div></div>
          {!eligible && <p className="text-sm leading-6 text-[#F4CF68]">{!saved || !current ? "Salve esta versão na sua conta antes de publicar." : "Conclua todos os critérios do desafio antes de publicar."}</p>}
          {!profile.portfolioPublic && <p className="text-sm leading-6 text-[#C8CFD7]">Ao publicar, seu portfólio também ficará público. Outras evidências que você já marcou como publicadas poderão aparecer nele.</p>}
          <label className="flex items-start gap-3 text-sm leading-6 text-[#D9DEE4]"><input type="checkbox" required checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 size-4 shrink-0 accent-[#81C899]" />Revisei título, resumo e evidências; autorizo a publicação deste case e do meu portfólio.</label>
          <button type="submit" disabled={!eligible || !confirmed || busy} className="inline-flex min-h-11 items-center justify-center gap-2 bg-mint px-5 text-sm font-bold text-[#101319] transition hover:bg-neon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint disabled:cursor-not-allowed disabled:opacity-40">{busy ? "Publicando..." : existing?.published ? "Atualizar case público" : "Publicar case"}</button>
          {message && <p role="status" aria-live="polite" className="text-sm text-mint">{message}</p>}
        </form>
      </>}
    </>}
  </section>;
}
