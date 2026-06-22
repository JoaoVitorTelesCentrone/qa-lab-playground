"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Save, Trash2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Profile = { full_name?: string | null; username?: string | null; bio?: string | null; linkedin_url?: string | null; role?: string | null; plan?: string | null } | null;
const roles = ["QA Iniciante", "QA Pleno", "QA Sênior", "QA Lead", "Dev que testa", "Tech Lead", "Estudante"];

export function ProfileClient({ email, profile }: { email: string; profile: Profile }) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [linkedin, setLinkedin] = useState(profile?.linkedin_url ?? "");
  const [role, setRole] = useState(profile?.role ?? "QA Iniciante");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save(event: React.FormEvent) {
    event.preventDefault(); setState("saving");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.assign("/login"); return; }
    const { error } = await supabase.from("profiles").update({ full_name: fullName.trim().slice(0, 80), username: username.trim().toLowerCase() || null, bio: bio.trim().slice(0, 280), linkedin_url: linkedin.trim() || null, role }).eq("id", user.id);
    setState(error ? "error" : "saved");
  }

  async function deleteAccount() {
    if (!window.confirm("Excluir sua conta, projetos e progresso permanentemente? Esta ação não pode ser desfeita.")) return;
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_own_account");
    if (error) { setState("error"); return; }
    await supabase.auth.signOut(); window.location.assign("/");
  }

  return <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14"><Link href="/lab" className="inline-flex items-center gap-1.5 text-xs text-[#8B949E] hover:text-mint"><ArrowLeft className="size-3.5" /> Voltar ao Meu Lab</Link><header className="mt-8"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-mint/10"><User className="size-5 text-mint" /></span><div><h1 className="text-3xl font-black text-off-white">Seu perfil</h1><p className="text-xs text-[#69737E]">Plano {profile?.plan ?? "free"}</p></div></div></header>
    <form onSubmit={save} className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-[#171B21] p-5 sm:p-7"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nome"><input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={80} className="field w-full" /></Field><Field label="Username"><input value={username} onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))} minLength={3} maxLength={30} className="field w-full" /></Field><Field label="E-mail"><input value={email} disabled className="field w-full opacity-60" /></Field><Field label="Perfil profissional"><select value={role} onChange={(e) => setRole(e.target.value)} className="field w-full">{roles.map((item) => <option key={item}>{item}</option>)}</select></Field></div><Field label={`Bio · ${bio.length}/280`}><textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={280} rows={4} className="field w-full resize-none" /></Field><Field label="LinkedIn"><input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="field w-full" /></Field>{state === "error" && <p className="text-xs text-coral">Não foi possível salvar. Verifique os dados e tente novamente.</p>}<button disabled={state === "saving"} className="inline-flex h-10 items-center gap-2 rounded-lg bg-mint px-4 text-xs font-black text-[#101319]">{state === "saving" ? <Loader2 className="size-4 animate-spin" /> : state === "saved" ? <Check className="size-4" /> : <Save className="size-4" />}{state === "saved" ? "Perfil salvo" : "Salvar perfil"}</button></form>
    <section className="mt-8 rounded-2xl border border-coral/20 bg-coral/[0.035] p-5"><h2 className="text-sm font-bold text-off-white">Excluir conta</h2><p className="mt-2 text-xs leading-5 text-[#8B949E]">Remove permanentemente perfil, projetos, rascunhos, favoritos e progresso sincronizado.</p><button type="button" onClick={deleteAccount} className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-coral/30 px-3 text-xs font-bold text-coral hover:bg-coral/10"><Trash2 className="size-3.5" /> Excluir minha conta</button></section></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-xs font-bold text-[#AAB2BC]">{label}<div className="mt-2">{children}</div></label>; }
