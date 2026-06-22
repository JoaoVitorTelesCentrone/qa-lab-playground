"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState(""); const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) { setMessage("O Workspace não está configurado neste ambiente."); return; } const supabase = createClient(); const { error } = await supabase.auth.updateUser({ password }); setMessage(error ? "O link expirou ou a senha não é válida." : "Senha atualizada. Você já pode acessar o Meu Lab."); }
  return <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-5"><form onSubmit={submit} className="w-full rounded-2xl border border-white/10 bg-[#171B21] p-6"><h1 className="text-2xl font-black text-off-white">Nova senha</h1><input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="field mt-6 w-full" placeholder="Mínimo 8 caracteres" /><button className="mt-3 h-10 w-full rounded-lg bg-neon text-xs font-black text-[#101319]">Atualizar senha</button>{message && <p role="status" className="mt-4 text-xs text-mint">{message}</p>}</form></div>;
}
