"use client";

import { useState } from "react";
import Link from "next/link";
import { Chrome, FlaskConical, Loader2, Lock, Mail, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "cadastro";

export function AuthForm({ mode, next = "/lab", configured }: { mode: Mode; next?: string; configured: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const isLogin = mode === "login";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!configured) return;
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage({ type: "error", text: "E-mail ou senha incorretos." });
      else window.location.assign(next);
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
      });
      setMessage(error
        ? { type: "error", text: error.message }
        : { type: "success", text: "Cadastro criado. Confirme seu e-mail para acessar o Workspace." });
    }
    setLoading(false);
  }

  async function signInWithGoogle() {
    if (!configured) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) { setMessage({ type: "error", text: "Não foi possível iniciar o login com Google." }); setLoading(false); }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-5 py-12">
      <div className="w-full rounded-2xl border border-white/10 bg-[#171B21] p-6 shadow-2xl shadow-black/25 sm:p-8">
        <div className="text-center"><Link href="/" className="inline-flex size-11 items-center justify-center rounded-xl border border-mint/20 bg-mint/10"><FlaskConical className="size-5 text-mint" /></Link><h1 className="mt-5 text-2xl font-black text-off-white">{isLogin ? "Entrar no Meu Lab" : "Criar seu Workspace"}</h1><p className="mt-2 text-sm text-[#8B949E]">{isLogin ? "Acesse seus projetos e progresso." : "A conta é opcional. O Playground continua gratuito."}</p></div>

        {!configured && <div className="mt-6 rounded-lg border border-[#F0C040]/25 bg-[#F0C040]/10 p-3 text-xs leading-5 text-[#F0C040]">O Workspace ainda não está conectado ao Supabase neste ambiente. Configure as variáveis públicas para ativar contas.</div>}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {!isLogin && <label className="block text-xs font-bold text-[#AAB2BC]">Nome completo<div className="relative mt-2"><User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#69737E]" /><input value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={80} className="w-full rounded-lg border border-white/10 bg-[#101319] py-2.5 pl-10 pr-3 text-sm text-off-white outline-none focus:border-mint/50" /></div></label>}
          <label className="block text-xs font-bold text-[#AAB2BC]">E-mail<div className="relative mt-2"><Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#69737E]" /><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-white/10 bg-[#101319] py-2.5 pl-10 pr-3 text-sm text-off-white outline-none focus:border-mint/50" /></div></label>
          <label className="block text-xs font-bold text-[#AAB2BC]">Senha<div className="relative mt-2"><Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#69737E]" /><input type="password" autoComplete={isLogin ? "current-password" : "new-password"} minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-white/10 bg-[#101319] py-2.5 pl-10 pr-3 text-sm text-off-white outline-none focus:border-mint/50" /></div></label>
          {isLogin && <div className="text-right"><Link href="/recuperar" className="text-xs text-[#8B949E] hover:text-mint">Esqueci minha senha</Link></div>}
          {message && <p role="status" className={`rounded-lg border p-3 text-xs ${message.type === "error" ? "border-coral/25 bg-coral/10 text-coral" : "border-mint/25 bg-mint/10 text-mint"}`}>{message.text}</p>}
          <button disabled={!configured || loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-neon text-sm font-black text-[#101319] disabled:cursor-not-allowed disabled:opacity-40">{loading && <Loader2 className="size-4 animate-spin" />}{isLogin ? "Entrar" : "Criar conta gratuita"}</button>
        </form>

        <div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-white/10" /><span className="text-[10px] uppercase tracking-wider text-[#69737E]">ou</span><span className="h-px flex-1 bg-white/10" /></div>
        <button type="button" onClick={signInWithGoogle} disabled={!configured || loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/10 text-sm font-semibold text-off-white hover:border-mint/30 disabled:opacity-40"><Chrome className="size-4" /> Continuar com Google</button>
        <p className="mt-6 text-center text-xs text-[#8B949E]">{isLogin ? "Ainda não tem conta? " : "Já possui conta? "}<Link href={isLogin ? `/cadastro?next=${encodeURIComponent(next)}` : `/login?next=${encodeURIComponent(next)}`} className="font-bold text-mint hover:underline">{isLogin ? "Criar conta" : "Entrar"}</Link></p>
      </div>
    </div>
  );
}
