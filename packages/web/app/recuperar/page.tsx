"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RecoverPage() {
  const [email, setEmail] = useState(""); const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) { setMessage("O Workspace não está configurado neste ambiente."); return; } const supabase = createClient(); const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password` }); setMessage(error ? "Não foi possível enviar o link." : "Se o e-mail existir, você receberá um link de recuperação."); }
  return <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-5"><form onSubmit={submit} className="w-full rounded-2xl border border-white/10 bg-[#171B21] p-6"><h1 className="text-2xl font-black text-off-white">Recuperar senha</h1><p className="mt-2 text-sm leading-6 text-[#8B949E]">Enviaremos um link seguro para definir uma nova senha.</p><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="field mt-6 w-full" /><button className="mt-3 h-10 w-full rounded-lg bg-neon text-xs font-black text-[#101319]">Enviar link</button>{message && <p role="status" className="mt-4 text-xs text-mint">{message}</p>}<Link href="/login" className="mt-5 block text-center text-xs text-[#8B949E] hover:text-mint">Voltar ao login</Link></form></div>;
}
