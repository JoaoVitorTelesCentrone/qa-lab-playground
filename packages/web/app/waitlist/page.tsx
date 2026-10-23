"use client";

import { useState } from "react";
import { ArrowRight, Bell, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { SelectField, toOptions } from "@/components/ui/select-field";

const interests = ["Novos desafios práticos", "Materiais e templates de QA", "Avisos de evolução do QA Lab"];

export default function WaitlistPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!role) { setMessage("Escolha seu momento profissional para entrar na lista."); return; }
    const url = process.env.NEXT_PUBLIC_LEAD_FORM_URL;
    if (!url) { setMessage("A lista ainda não está conectada. Configure NEXT_PUBLIC_LEAD_FORM_URL para ativar os cadastros."); return; }
    const target = `${url}${url.includes("?") ? "&" : "?"}name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}&source=waitlist`;
    window.open(target, "_blank", "noopener,noreferrer");
    setMessage("Abrimos o formulário de cadastro. Conclua o envio na nova aba.");
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-mint"><Bell className="size-3.5" />Próximas atividades</span>
          <h1 className="mt-6 text-4xl font-black leading-tight text-off-white sm:text-6xl">Pratique hoje. Saiba primeiro o que vem depois.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#AAB2BC]">Entre na lista para receber novos exercícios, missões práticas e materiais que ajudam você a documentar risco como uma pessoa de QA.</p>
          <div className="mt-8 space-y-3">{interests.map((item) => <div key={item} className="flex items-center gap-3 text-sm text-[#C4CBD3]"><CheckCircle2 className="size-4 text-neon" />{item}</div>)}</div>
        </section>
        <section className="rounded-2xl border border-white/10 bg-[#171B21] p-6 sm:p-8">
          <Mail className="size-6 text-mint" /><h2 className="mt-4 text-2xl font-black text-off-white">Quero receber novidades</h2>
          <p className="mt-2 text-sm leading-6 text-[#8B949E]">Sem spam. Só conteúdo prático e novidades relevantes do QA Lab.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-xs font-bold text-[#AAB2BC]">Nome<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" className="field mt-2 w-full" /></label>
            <label className="block text-xs font-bold text-[#AAB2BC]">E-mail<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" className="field mt-2 w-full" /></label>
            <label className="block text-xs font-bold text-[#AAB2BC]">Momento profissional<div className="mt-2"><SelectField value={role} onChange={setRole} options={toOptions(["Começando em QA", "QA Pleno/Sênior", "Dev estudando qualidade", "Liderança de tecnologia/QA", "Em transição de carreira"])} groupLabel="Momento profissional" aria-label="Momento profissional" /></div></label>
            <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-mint text-sm font-black text-[#101319]">Entrar na lista<ArrowRight className="size-4" /></button>
          </form>
          {message && <p className="mt-4 rounded-lg border border-mint/15 bg-mint/[.04] p-3 text-xs leading-5 text-[#AAB2BC]">{message}</p>}
          <div className="mt-5 flex items-start gap-2 text-[11px] leading-5 text-[#69737E]"><ShieldCheck className="mt-0.5 size-3.5 shrink-0" />Seus dados serão enviados apenas ao formulário configurado pelo responsável do site.</div>
        </section>
      </div>
    </div>
  );
}
