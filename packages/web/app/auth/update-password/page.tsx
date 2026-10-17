"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import { PASSWORD_MIN_LENGTH, passwordMeetsRequirements } from "@/lib/auth/password-policy";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const configured = isSupabaseConfigured();
  const passwordReady = passwordMeetsRequirements(password);
  const passwordsMatch = password === confirmPassword;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!configured || loading) return;
    if (!passwordReady) {
      setMessage({ type: "error", text: "Confira os critérios da nova senha antes de continuar." });
      return;
    }
    if (!passwordsMatch) {
      setMessage({ type: "error", text: "As senhas não coincidem. Digite a mesma senha nos dois campos." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      setMessage(error
        ? { type: "error", text: "O link expirou, a senha apareceu em um vazamento ou não atende aos requisitos. Solicite um novo link ou escolha outra senha." }
        : { type: "success", text: "Senha atualizada. Sua conta já está pronta para continuar." });
    } catch {
      setMessage({ type: "error", text: "A conexão foi interrompida. Tente novamente." });
    } finally {
      setLoading(false);
    }
  }

  function passwordField(label: string, value: string, onChange: (value: string) => void, describedBy?: string) {
    return (
      <label className="block text-sm font-bold text-[#D9DEE4]">
        {label}
        <div className="relative mt-2">
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={PASSWORD_MIN_LENGTH}
            autoComplete="new-password"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-describedby={describedBy}
            aria-invalid={value.length > 0 && (describedBy ? !passwordReady : !passwordsMatch)}
            className="w-full rounded-xl bg-[#101319] px-3 py-3 pr-12 text-base text-off-white outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-mint"
          />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ocultar senhas" : "Mostrar senhas"} aria-pressed={showPassword} className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#8B949E] hover:bg-white/5 hover:text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </label>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-5 py-12">
      <form onSubmit={submit} className="w-full rounded-2xl bg-[#171B21] p-6 shadow-[0_22px_65px_-24px_rgba(0,0,0,.72)] sm:p-8">
        <h1 className="text-3xl font-black tracking-[-0.03em] text-off-white">Crie uma nova senha</h1>
        <p className="mt-3 text-sm leading-6 text-[#AAB2BC]">Atenda aos critérios abaixo e evite reutilizar uma senha de outro serviço.</p>
        <div className="mt-7 space-y-4">
          {passwordField("Nova senha", password, setPassword, "update-password-requirements")}
          <PasswordRequirements password={password} id="update-password-requirements" />
          {passwordField("Confirmar nova senha", confirmPassword, setConfirmPassword)}
        </div>
        <button type="submit" disabled={!configured || loading || !passwordReady || !passwordsMatch} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-neon px-4 py-3 text-sm font-black text-[#101319] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon disabled:cursor-not-allowed disabled:opacity-40">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
          {loading ? "Atualizando..." : "Atualizar senha"}
        </button>
        {message && (
          <div role={message.type === "error" ? "alert" : "status"} className={`mt-4 rounded-xl p-4 text-sm leading-6 ${message.type === "error" ? "bg-coral/10 text-[#FF9A8D]" : "bg-mint/10 text-mint"}`}>
            <p>{message.text}</p>
            {message.type === "success" && <Link href="/login" className="mt-2 inline-block font-bold underline underline-offset-4">Ir para o login</Link>}
          </div>
        )}
      </form>
    </div>
  );
}
