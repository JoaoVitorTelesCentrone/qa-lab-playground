"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CloudDownload, CloudUpload, Loader2 } from "lucide-react";
import { countDeliverables, sameChallengeDeliverables, type ChallengeDeliverables } from "@/lib/challenge-deliverables";

export type SavedChallenge = { id: string; savedAt: string; deliverables: ChallengeDeliverables };

export function ChallengeAccount({ data, loaded, onLoad, onSaved }: { data: ChallengeDeliverables; loaded: boolean; onLoad: (value: ChallengeDeliverables) => void; onSaved?: (value: SavedChallenge | null) => void }) {
  const [account, setAccount] = useState<"checking" | "guest" | "ready" | "error">("checking");
  const [saved, setSaved] = useState<SavedChallenge | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/v1/challenge", { cache: "no-store" }).then(async (response) => {
      if (!active) return;
      if (response.status === 401) { setAccount("guest"); return; }
      if (!response.ok) throw new Error("Não foi possível consultar sua conta.");
      const body = await response.json();
      if (active) { setSaved(body.data); onSaved?.(body.data); setAccount("ready"); }
    }).catch(() => { if (active) setAccount("error"); });
    return () => { active = false; };
  }, [onSaved]);

  async function save() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/v1/challenge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deliverables: data }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível salvar.");
      const version = { ...body.data, deliverables: data } as SavedChallenge;
      setSaved(version);
      onSaved?.(version);
      setMessage("Versão salva na sua conta. Nada foi publicado.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível salvar."); }
    finally { setBusy(false); }
  }

  const localCount = countDeliverables(data);
  const different = saved && !sameChallengeDeliverables(saved.deliverables, data);
  return <section aria-label="Salvar desafio na conta" className="mt-8 border-t border-[#3A4147] pt-5">
    <p className="text-sm font-bold text-off-white">Continue de onde parou</p>
    {account === "checking" && <p role="status" className="mt-2 text-xs text-[#AAB2BC]">Verificando sua conta...</p>}
    {account === "guest" && <><p className="mt-2 text-xs leading-5 text-[#AAB2BC]">O rascunho fica neste navegador. Crie uma conta para guardar uma cópia privada e retomar em outro dispositivo.</p><Link href="/cadastro?next=%2Fplayground%2Fconclusao" className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-[#A5D9B6] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A5D9B6]">Criar conta e guardar entrega</Link><p className="mt-2 text-xs text-[#AAB2BC]">Já tem conta? <Link href="/login?next=%2Fplayground%2Fconclusao" className="underline underline-offset-4">Entre aqui</Link>.</p></>}
    {account === "error" && <p role="alert" className="mt-2 text-xs text-[#F4B1A9]">Não foi possível verificar a conta. Seu rascunho local continua disponível.</p>}
    {account === "ready" && <><p className="mt-2 text-xs leading-5 text-[#AAB2BC]">{saved ? `Última cópia privada: ${new Date(saved.savedAt).toLocaleString("pt-BR")}.` : "Ainda não há cópia na conta."} As alterações continuam locais até você salvar outra versão.</p><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={save} disabled={!loaded || localCount === 0 || busy || (!different && Boolean(saved))} className="inline-flex min-h-11 items-center gap-2 bg-[#81C899] px-4 text-sm font-bold text-[#172019] transition hover:bg-[#9cdaae] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A5D9B6] disabled:cursor-not-allowed disabled:opacity-40">{busy ? <Loader2 className="size-4 animate-spin" /> : <CloudUpload className="size-4" />}{busy ? "Salvando..." : saved ? "Salvar nova versão" : "Salvar na conta"}</button>{saved && different && <button type="button" onClick={() => { if (localCount > 0 && !window.confirm("Carregar a versão da conta? Seu rascunho deste navegador será substituído, mas a cópia salva continuará na conta.")) return; onLoad(saved.deliverables); setMessage("Versão da conta carregada neste navegador."); }} className="inline-flex min-h-11 items-center gap-2 px-4 text-sm font-bold text-[#A5D9B6] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A5D9B6]"><CloudDownload className="size-4" />Carregar da conta</button>}</div>{message && <p role="status" aria-live="polite" className="mt-3 text-xs text-[#A5D9B6]">{message}</p>}</>}
  </section>;
}
