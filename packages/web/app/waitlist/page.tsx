"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FlaskConical, CheckCircle2, Loader2, Bug, Zap, Terminal } from "lucide-react";
import Link from "next/link";

const roles = [
  "QA Iniciante",
  "QA Pleno/Sênior",
  "Dev que quer aprender QA",
  "Tech Lead / QA Lead",
  "Estudante",
];

export default function WaitlistPage() {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("waitlist").insert({
      name,
      email,
      role,
      source: "website",
    });

    if (error) {
      if (error.code === "23505") {
        setError("Este e-mail já está na lista. Aguarde o convite!");
      } else {
        setError("Algo deu errado. Tente novamente.");
      }
    } else {
      setSubmitted(true);
    }

    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
        <div className="text-center space-y-5 max-w-sm">
          <div className="flex items-center justify-center size-16 rounded-2xl bg-mint/10 border border-mint/20 mx-auto">
            <CheckCircle2 className="size-8 text-mint" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#F0F6FC] mb-2">
              Você está na lista!
            </h1>
            <p className="text-sm text-[#8B949E] leading-relaxed">
              Quando o acesso abrir, você vai ser um dos primeiros a saber.
              Fique de olho no e-mail <span className="text-mint font-semibold">{email}</span>.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-mint hover:underline"
          >
            Explorar o lab enquanto isso →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">

        {/* Left — pitch */}
        <div className="space-y-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex items-center justify-center size-9 rounded-xl bg-mint/10 border border-mint/20">
              <FlaskConical className="size-4 text-mint" />
            </div>
            <span className="font-[family-name:var(--font-display)] text-2xl tracking-widest text-mint italic">
              QA LAB
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-mint/35">
              Playground
            </span>
          </Link>

          <div className="space-y-4">
            <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl tracking-wider text-[#F0F6FC] leading-tight">
              APRENDA QA<br />
              <span className="text-mint italic">QUEBRANDO COISAS</span><br />
              DE PROPÓSITO.
            </h1>
            <p className="text-[#8B949E] leading-relaxed max-w-sm">
              Plataforma de prática para QAs que querem evoluir em automação testando sistemas propositalmente quebrados.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Bug,      color: "text-coral", label: "15+ bugs",        sub: "intencionais"  },
              { icon: Terminal, color: "text-mint",  label: "8 missões",       sub: "com snippets"  },
              { icon: Zap,      color: "text-neon",  label: "API + UI + Form", sub: "pra praticar"  },
            ].map(({ icon: Icon, color, label, sub }) => (
              <div
                key={label}
                className="rounded-xl border border-[#30363D] bg-[#161B22] p-3 text-center space-y-1"
              >
                <Icon className={`size-4 mx-auto ${color}`} />
                <p className={`text-xs font-bold ${color}`}>{label}</p>
                <p className="text-[10px] text-[#8B949E] uppercase tracking-wide">{sub}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#8B949E]/60 italic">
            "A melhor forma de aprender a testar é testar de verdade."
          </p>
        </div>

        {/* Right — form */}
        <div className="rounded-2xl border border-[#30363D] bg-[#161B22] p-7 space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#F0F6FC]">
              Garanta seu acesso
            </h2>
            <p className="text-sm text-[#8B949E]">
              Estamos em acesso antecipado. Entre na lista e seja avisado primeiro.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Seu nome"
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3.5 py-2.5 text-sm text-[#F0F6FC] placeholder:text-[#8B949E]/50 focus:outline-none focus:border-mint/40 focus:ring-1 focus:ring-mint/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3.5 py-2.5 text-sm text-[#F0F6FC] placeholder:text-[#8B949E]/50 focus:outline-none focus:border-mint/40 focus:ring-1 focus:ring-mint/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold">
                Perfil
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3.5 py-2.5 text-sm text-[#F0F6FC] focus:outline-none focus:border-mint/40 focus:ring-1 focus:ring-mint/20 transition-all"
              >
                <option value="" disabled>Selecione seu perfil...</option>
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-mint text-[#0D1117] font-bold text-sm rounded-lg py-3 hover:bg-mint/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Quero meu acesso antecipado
            </button>
          </form>

          <p className="text-center text-[10px] text-[#8B949E]/50">
            Sem spam. Você só será avisado quando o acesso abrir.
          </p>
        </div>
      </div>
    </div>
  );
}
