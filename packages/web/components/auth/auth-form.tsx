"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Chrome, Eye, EyeOff, FlaskConical, Loader2, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import { PASSWORD_MIN_LENGTH, passwordMeetsRequirements } from "@/lib/auth/password-policy";

type Mode = "login" | "cadastro";
type Message = { type: "error" | "success"; text: string };

function authErrorMessage(error: { message?: string; status?: number; code?: string }, mode: Mode) {
  const detail = `${error.code ?? ""} ${error.message ?? ""}`.toLowerCase();
  if (error.status === 429 || detail.includes("rate limit")) return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";
  if (error.status === 503 || detail.includes("service_unavailable") || detail.includes("failed to fetch")) return "Não foi possível alcançar o servidor agora. Verifique sua conexão e tente novamente.";
  if (detail.includes("password") && (detail.includes("pwned") || detail.includes("leak"))) return "Essa senha apareceu em um vazamento. Escolha uma senha nova e exclusiva.";
  if (detail.includes("password") && (detail.includes("weak") || detail.includes("least") || detail.includes("character"))) return "A senha ainda não atende a todos os critérios mostrados abaixo.";
  if (detail.includes("email") && detail.includes("invalid")) return "Digite um endereço de e-mail válido.";
  return mode === "login"
    ? "E-mail ou senha incorretos. Confira os dados ou recupere sua senha."
    : "Não foi possível criar a conta. Confira os dados e tente novamente.";
}

export function AuthForm({ mode, next = "/lab", configured, googleEnabled = false, initialError, signupHref }: { mode: Mode; next?: string; configured: boolean; googleEnabled?: boolean; initialError?: string; signupHref?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(initialError ? { type: "error", text: initialError } : null);
  const isLogin = mode === "login";
  const passwordReady = isLogin || passwordMeetsRequirements(password);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!configured || loading) return;
    if (!passwordReady) {
      setMessage({ type: "error", text: "Confira os critérios da senha antes de criar sua conta." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const normalizedEmail = email.trim().toLowerCase();
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
        if (error) setMessage({ type: "error", text: authErrorMessage(error, mode) });
        else window.location.assign(next);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: { data: { full_name: fullName.trim() }, emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
        });
        if (error) setMessage({ type: "error", text: authErrorMessage(error, mode) });
        else if (data.session) window.location.assign(next);
        else setMessage({ type: "success", text: "Conta criada. Abra o e-mail de confirmação para continuar; confira também a caixa de spam." });
      }
    } catch {
      setMessage({ type: "error", text: "A conexão foi interrompida. Seus dados foram preservados; tente novamente." });
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    if (!configured || loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
      });
      if (error) setMessage({ type: "error", text: "Não foi possível iniciar o login com Google. Tente novamente ou use seu e-mail." });
    } catch {
      setMessage({ type: "error", text: "Não foi possível alcançar o Google agora. Tente novamente." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qa-auth mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-5xl items-center gap-10 px-5 py-12 lg:grid-cols-[1fr_28rem] lg:px-8">
      <section className="hidden max-w-xl lg:block" aria-labelledby="auth-context-title">
        <div className="inline-flex size-12 items-center justify-center rounded-xl bg-mint/10 text-mint"><ShieldCheck className="size-6" /></div>
        <h2 id="auth-context-title" className="mt-6 max-w-lg text-4xl font-black tracking-[-0.03em] text-off-white">{isLogin ? "Continue sua prática de onde parou." : "Sua primeira evidência começa com uma prática."}</h2>
        <p className="mt-4 max-w-lg text-base leading-7 text-[#AAB2BC]">Teste um sistema, investigue o resultado e registre o que descobriu. Sua conta reúne o progresso dos Labs e as evidências que você escolhe apresentar.</p>
        <ul className="mt-7 space-y-3 text-sm text-[#D9DEE4]">
          <li className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-mint" />Evidências e histórico protegidos por usuário</li>
          <li className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-neon" />Labs com roteiro, dados de treino e critérios de entrega</li>
          <li className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-coral" />Publicação no portfólio somente quando você escolher</li>
        </ul>
      </section>

      <div className="qa-auth-card w-full p-6 sm:p-8">
        <div className="text-center"><Link href="/" aria-label="Voltar ao início" className="inline-flex size-11 items-center justify-center rounded-xl bg-mint/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"><FlaskConical className="size-5 text-mint" /></Link><h1 className="mt-5 text-3xl font-black tracking-[-0.03em] text-off-white">{isLogin ? "Entrar no QA Lab" : "Criar sua conta"}</h1><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">{isLogin ? "Continue seus Labs e acompanhe suas entregas." : "Aprenda QA na prática e salve as evidências do que você sabe fazer."}</p></div>

        {!configured && <div role="alert" className="mt-6 rounded-xl bg-[#F0C040]/10 p-4 text-sm leading-6 text-[#F4CF68]">As contas ainda não estão configuradas neste ambiente. Adicione a URL e a chave pública do Supabase para continuar.</div>}

        <form onSubmit={submit} className="mt-7 space-y-4">
          {!isLogin && <label className="block text-sm font-bold text-[#D9DEE4]">Nome completo<div className="relative mt-2"><User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#69737E]" /><input name="name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required minLength={2} maxLength={80} className="w-full rounded-xl bg-[#101319] py-3 pl-10 pr-3 text-base text-off-white outline-none ring-1 ring-inset ring-white/10 transition focus:ring-2 focus:ring-mint" /></div></label>}
          <label className="block text-sm font-bold text-[#D9DEE4]">E-mail<div className="relative mt-2"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#69737E]" /><input name="email" type="email" inputMode="email" autoCapitalize="none" spellCheck={false} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl bg-[#101319] py-3 pl-10 pr-3 text-base text-off-white outline-none ring-1 ring-inset ring-white/10 transition focus:ring-2 focus:ring-mint" /></div></label>
          <label className="block text-sm font-bold text-[#D9DEE4]">Senha<div className="relative mt-2"><Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#69737E]" /><input name="password" type={showPassword ? "text" : "password"} autoComplete={isLogin ? "current-password" : "new-password"} minLength={PASSWORD_MIN_LENGTH} value={password} onChange={(e) => setPassword(e.target.value)} required aria-describedby={!isLogin ? "password-requirements" : undefined} aria-invalid={!isLogin && password.length > 0 && !passwordReady} className="w-full rounded-xl bg-[#101319] py-3 pl-10 pr-12 text-base text-off-white outline-none ring-1 ring-inset ring-white/10 transition focus:ring-2 focus:ring-mint" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} aria-pressed={showPassword} className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#8B949E] hover:bg-white/5 hover:text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></label>
          {!isLogin && <PasswordRequirements password={password} />}
          {isLogin && <div className="text-right"><Link href="/recuperar" className="text-xs text-[#8B949E] hover:text-mint">Esqueci minha senha</Link></div>}
          {message && <p role={message.type === "error" ? "alert" : "status"} aria-live="polite" className={`rounded-xl p-4 text-sm leading-6 ${message.type === "error" ? "bg-coral/10 text-[#FF9A8D]" : "bg-mint/10 text-mint"}`}>{message.text}</p>}
          <button type="submit" disabled={!configured || loading || !passwordReady} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-neon px-4 py-3 text-sm font-black text-[#101319] transition hover:bg-[#E8FF73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 focus-visible:ring-offset-[#171B21] disabled:cursor-not-allowed disabled:opacity-40">{loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}{loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}</button>
        </form>

        {googleEnabled && <><div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-white/10" /><span className="text-[10px] uppercase tracking-wider text-[#69737E]">ou</span><span className="h-px flex-1 bg-white/10" /></div><button type="button" onClick={signInWithGoogle} disabled={!configured || loading} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-off-white ring-1 ring-inset ring-white/10 transition hover:bg-white/5 hover:ring-mint/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint disabled:cursor-not-allowed disabled:opacity-40"><Chrome className="size-4" /> Continuar com Google</button></>}
        <p className="mt-6 text-center text-xs text-[#8B949E]">{isLogin ? "Ainda não tem conta? " : "Já possui conta? "}<Link href={isLogin ? signupHref ?? `/cadastro?next=${encodeURIComponent(next)}` : `/login?next=${encodeURIComponent(next)}`} className="font-bold text-mint hover:underline">{isLogin ? "Criar conta" : "Entrar"}</Link></p>
      </div>
    </div>
  );
}
