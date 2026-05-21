"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  User, Mail, Linkedin, FileText, Shield,
  CheckCircle2, LogOut, Loader2, Save, Target,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  linkedin_url?: string;
  role?: string;
}

interface MissionRecord {
  mission_id: string;
  completed_at: string;
}

const MISSION_TITLES: Record<string, string> = {
  "1": "O DELETE que não deleta",
  "2": "O health check mentiroso",
  "3": "Paginação que pula itens",
  "4": "O formulário com 5 bugs",
  "5": "Contrato de resposta inconsistente",
  "6": "Carrinho sem validação de estoque",
  "7": "Login sem rate limiting",
  "8": "Suite de smoke da API",
};

const ROLES = [
  "QA Iniciante",
  "QA Pleno",
  "QA Sênior",
  "QA Lead",
  "Dev que testa",
  "Tech Lead",
  "Estudante",
];

interface Props {
  user: SupabaseUser;
  profile: Profile | null;
  completedMissions: MissionRecord[];
}

export function ProfileClient({ user, profile, completedMissions }: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url ?? "");
  const [role, setRole] = useState(profile?.role ?? "QA Iniciante");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setSaveError(null);

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        username: username || null,
        bio,
        linkedin_url: linkedinUrl || null,
        role,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      setSaveError(error.message.includes("unique") ? "Este username já está em uso." : "Erro ao salvar.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const progressPct = Math.round((completedMissions.length / 8) * 100);

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between animate-slide-in-up">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-mint/20">
            <User className="size-5 text-mint" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-mint italic">
              PERFIL
            </h1>
            <p className="text-sm text-mint/50 uppercase tracking-[0.15em]">
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-[#8B949E] hover:text-red-400 transition-colors border border-[#30363D] hover:border-red-400/30 rounded-lg px-3 py-2"
        >
          <LogOut className="size-3.5" />
          Sair
        </button>
      </div>

      {/* Progress card */}
      <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-5 space-y-3 animate-slide-in-up">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-mint" />
          <span className="text-sm font-bold text-[#F0F6FC]">Progresso nas Missões</span>
          <span className="ml-auto text-xs font-mono text-mint">
            {completedMissions.length}/8
          </span>
        </div>
        <div className="h-2 bg-[#30363D] rounded-full overflow-hidden">
          <div
            className="h-full bg-mint rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {completedMissions.length > 0 ? (
          <div className="space-y-1 pt-1">
            {completedMissions.map((m) => (
              <div key={m.mission_id} className="flex items-center gap-2 text-xs text-[#8B949E]">
                <CheckCircle2 className="size-3.5 text-mint shrink-0" />
                <span>{MISSION_TITLES[m.mission_id] ?? `Missão #${m.mission_id}`}</span>
                <span className="ml-auto text-[#8B949E]/50">
                  {new Date(m.completed_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8B949E]/60 pt-1">
            Nenhuma missão concluída ainda. Vá para{" "}
            <a href="/missoes" className="text-mint hover:underline">Missões</a> e comece!
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="rounded-xl border border-[#30363D] bg-[#161B22] p-5 space-y-5 animate-slide-in-up">
        <div className="flex items-center gap-2 pb-1 border-b border-[#30363D]">
          <Shield className="size-4 text-[#8B949E]" />
          <span className="text-sm font-bold text-[#F0F6FC]">Dados do perfil</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold flex items-center gap-1.5">
              <User className="size-3" /> Nome completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome"
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3.5 py-2.5 text-sm text-[#F0F6FC] placeholder:text-[#8B949E]/40 focus:outline-none focus:border-mint/40 focus:ring-1 focus:ring-mint/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold flex items-center gap-1.5">
              <span className="font-mono text-mint">@</span> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
              placeholder="seu-username"
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3.5 py-2.5 text-sm text-[#F0F6FC] placeholder:text-[#8B949E]/40 focus:outline-none focus:border-mint/40 focus:ring-1 focus:ring-mint/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold flex items-center gap-1.5">
              <Mail className="size-3" /> E-mail
            </label>
            <input
              type="email"
              value={user.email ?? ""}
              disabled
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3.5 py-2.5 text-sm text-[#8B949E] opacity-60 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold">
              Perfil profissional
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3.5 py-2.5 text-sm text-[#F0F6FC] focus:outline-none focus:border-mint/40 focus:ring-1 focus:ring-mint/20 transition-all"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold flex items-center gap-1.5">
            <FileText className="size-3" /> Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={280}
            placeholder="Fale um pouco sobre você e sua experiência em QA..."
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3.5 py-2.5 text-sm text-[#F0F6FC] placeholder:text-[#8B949E]/40 focus:outline-none focus:border-mint/40 focus:ring-1 focus:ring-mint/20 transition-all resize-none"
          />
          <p className="text-right text-[10px] text-[#8B949E]/50">{bio.length}/280</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#8B949E] font-semibold flex items-center gap-1.5">
            <Linkedin className="size-3" /> LinkedIn
          </label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/seu-perfil"
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3.5 py-2.5 text-sm text-[#F0F6FC] placeholder:text-[#8B949E]/40 focus:outline-none focus:border-mint/40 focus:ring-1 focus:ring-mint/20 transition-all"
          />
        </div>

        {saveError && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {saveError}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-mint text-[#0D1117] font-bold text-sm rounded-lg px-5 py-2.5 hover:bg-mint/90 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Salvar perfil
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-mint">
              <CheckCircle2 className="size-3.5" /> Salvo!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
