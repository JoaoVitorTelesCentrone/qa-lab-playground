"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Eye, EyeOff, AlertCircle, Info, Lock } from "lucide-react";
import { mockLogin, setStoredUser, getStoredUser } from "@/lib/ecommerce";

export default function EcommerceLoginPage() {
  const router = useRouter();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [rememberMe, setRememberMe]     = useState(false); // BUG #10: sem efeito
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [attempts, setAttempts]         = useState(0);     // BUG #9: sem lockout
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    const redirectTo = new URLSearchParams(window.location.search).get("redirect") ?? "/ecommerce";
    if (getStoredUser()) router.replace(redirectTo);
  }, []);

  // Lê o redirect diretamente da URL no momento do submit — evita problema de closure com estado async
  function getRedirect() {
    return new URLSearchParams(window.location.search).get("redirect") ?? "/ecommerce";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simula latência de rede
    await new Promise(r => setTimeout(r, 700));

    const result = mockLogin(email, password);

    if (result.success) {
      // BUG #10: rememberMe não tem nenhum efeito — sempre salva em localStorage
      setStoredUser(result.user);
      router.push(getRedirect());
    } else {
      setAttempts(prev => prev + 1); // BUG #9: contador sem lockout
      setError(result.error);        // BUG #8: mensagem diferente por tipo de erro
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Logo */}
        <div className="text-center">
          <Link href="/ecommerce" className="inline-flex items-center gap-2 text-xl font-bold">
            <ShoppingCart className="size-6" />
            QA Store
          </Link>
          <p className="text-sm text-gray-500 mt-1">Entre na sua conta</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
          {/* Hint para QAs */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
            <Info className="size-3.5 shrink-0 mt-0.5" />
            <span>
              Contas de teste:{" "}
              <strong>cliente@qalab.com</strong> / <strong>senha123</strong>
              &nbsp;·&nbsp;
              <strong>admin@qalab.com</strong> / <strong>admin123</strong>
            </span>
          </div>

          {/* Erro */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div>
                <p>{error}</p>
                {attempts >= 3 && (
                  <p className="text-xs mt-1 text-red-500">
                    {attempts} tentativas — sem bloqueio de conta (bug!)
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="password">Senha</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Lembrar de mim */}
            <div className="flex items-center justify-between">
              {/* BUG #10: checkbox visível mas sem efeito funcional */}
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                Lembrar de mim
              </label>
              {/* BUG: link não leva a lugar nenhum (404) */}
              <Link href="/ecommerce/recuperar-senha" className="text-sm text-primary hover:underline">
                Esqueci a senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Não tem conta?{" "}
            {/* BUG: /ecommerce/cadastro não existe — 404 */}
            <Link href="/ecommerce/cadastro" className="text-primary hover:underline">
              Criar conta
            </Link>
          </p>
        </div>

        {/* Painel educacional para QA */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold mb-1.5">
            <Lock className="size-3.5" />
            Bugs para encontrar nesta página
          </div>
          <ul className="list-disc list-inside space-y-0.5">
            <li><strong>Bug #8</strong> — Mensagem diferente para e-mail inválido vs senha errada (information disclosure)</li>
            <li><strong>Bug #9</strong> — Sem bloqueio após múltiplas tentativas (brute force)</li>
            <li><strong>Bug #10</strong> — "Lembrar de mim" não tem efeito funcional</li>
            <li><strong>Bug #11</strong> — Token JWT armazenado sem expiração (verifique o localStorage)</li>
            <li><strong>Bug extra</strong> — "Esqueci a senha" e "Criar conta" levam a 404</li>
          </ul>
        </div>

        <div className="text-center">
          <Link href="/ecommerce" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}
