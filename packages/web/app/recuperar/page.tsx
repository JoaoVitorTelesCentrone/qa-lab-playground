"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!configured || loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password` });
      setMessage(error
        ? { type: "error", text: error.status === 429 ? "Muitas solicitações. Aguarde alguns minutos antes de tentar novamente." : "Não foi possível enviar o link agora. Verifique sua conexão e tente novamente." }
        : { type: "success", text: "Se esse e-mail estiver cadastrado, você receberá um link. Confira também a caixa de spam." });
    } catch {
      setMessage({ type: "error", text: "A conexão foi interrompida. Tente novamente em instantes." });
    } finally {
      setLoading(false);
    }
  }

  return <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-5 py-12"><form onSubmit={submit} className="w-full rounded-2xl bg-[#171B21] p-6 shadow-[0_22px_65px_-24px_rgba(0,0,0,.72)] sm:p-8"><h1 className="text-3xl font-black tracking-[-0.03em] text-off-white">Recuperar senha</h1><p className="mt-3 text-sm leading-6 text-[#AAB2BC]">Informe seu e-mail e enviaremos um link seguro para criar uma nova senha.</p>{!configured && <p role="alert" className="mt-6 rounded-xl bg-[#F0C040]/10 p-4 text-sm text-[#F4CF68]">As contas ainda não estão configuradas neste ambiente.</p>}<label className="mt-7 block text-sm font-bold text-[#D9DEE4]">E-mail<div className="relative mt-2"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#69737E]" /><input name="email" type="email" inputMode="email" autoCapitalize="none" spellCheck={false} autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full rounded-xl bg-[#101319] py-3 pl-10 pr-3 text-base text-off-white outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-mint" /></div></label><button type="submit" disabled={!configured || loading} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-neon px-4 py-3 text-sm font-black text-[#101319] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon disabled:cursor-not-allowed disabled:opacity-40">{loading && <Loader2 className="size-4 animate-spin" />}{loading ? "Enviando..." : "Enviar link"}</button>{message && <p role={message.type === "error" ? "alert" : "status"} className={`mt-4 rounded-xl p-4 text-sm leading-6 ${message.type === "error" ? "bg-coral/10 text-[#FF9A8D]" : "bg-mint/10 text-mint"}`}>{message.text}</p>}<Link href="/login" className="mt-6 flex items-center justify-center gap-2 text-sm text-[#AAB2BC] hover:text-mint"><ArrowLeft className="size-4" />Voltar ao login</Link></form></div>;
}
