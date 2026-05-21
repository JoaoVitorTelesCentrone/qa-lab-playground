"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FlaskConical, Loader2, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

type Mode = "login" | "cadastro";

interface AuthFormProps {
  mode: Mode;
  redirectTo?: string;
}

export function AuthForm({ mode, redirectTo = "/" }: AuthFormProps) {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === "cadastro") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Verifique seu e-mail para confirmar o cadastro.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("E-mail ou senha incorretos.");
      } else {
        window.location.href = redirectTo;
      }
    }

    setLoading(false);
  }

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center size-9 rounded-xl bg-mint/10 border border-mint/20">
              <FlaskConical className="size-4 text-mint" />
            </div>
            <span className="font-[family-name:var(--font-display)] text-2xl tracking-widest text-mint italic">
              QA LAB
            </span>
          </Link>
          <h1 className="text-xl font-bold text-[#F0F6FC]">
            {isLogin ? "Entrar na plataforma" : "Criar sua conta"}
          </h1>
          <p className="text-sm text-[#8B949E]">
            {isLogin
              ? "Bem-vindo de volta ao lab."
              : "Comece a praticar QA de verdade."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8B949E]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Seu nome"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#F0F6FC] placeholder:text-[#8B949E]/50 focus:outline-none focus:border-mint/40 focus:ring-1 focus:ring-mint/20 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8B949E]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full bg-[#161B22] border border-[#30363D] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#F0F6FC] placeholder:text-[#8B949E]/50 focus:outline-none focus:border-mint/40 focus:ring-1 focus:ring-mint/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8B949E]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-[#161B22] border border-[#30363D] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#F0F6FC] placeholder:text-[#8B949E]/50 focus:outline-none focus:border-mint/40 focus:ring-1 focus:ring-mint/20 transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-mint bg-mint/10 border border-mint/20 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-mint text-[#0D1117] font-bold text-sm rounded-lg py-2.5 hover:bg-mint/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {isLogin ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-xs text-[#8B949E]">
          {isLogin ? (
            <>
              Não tem conta?{" "}
              <Link href="/cadastro" className="text-mint hover:underline font-semibold">
                Criar conta grátis
              </Link>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <Link href="/login" className="text-mint hover:underline font-semibold">
                Entrar
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
