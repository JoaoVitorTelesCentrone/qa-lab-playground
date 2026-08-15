"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Circle, Download, Linkedin, Mail } from "lucide-react";
import { ChallengeStepper } from "@/components/challenge/challenge-stepper";
import { challengeChecklist, DELIVERABLES_KEY, emptyDeliverables, exportDeliverables, parseDeliverables, type ChallengeDeliverables } from "@/lib/challenge-deliverables";

const shareText = "Completei o ExpenseFlow Free Challenge no QA Lab Playground: investiguei riscos, documentei bugs, modelei a regressão em BDD e defini uma estratégia E2E.";

export function CompletionClient() {
  const [data, setData] = useState<ChallengeDeliverables>(emptyDeliverables);
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-lab-playground.vercel.app";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setData(parseDeliverables(localStorage.getItem(DELIVERABLES_KEY)));
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const checks = challengeChecklist(data);
  const completed = checks.filter((item) => item.done).length;
  const ready = completed === checks.length;

  function download() {
    const files = exportDeliverables(data);
    const content = `${files.bugReports}\n---\n\n${files.bdd}\n---\n\n${files.e2e}`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "expenseflow-qa-portfolio.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const url = process.env.NEXT_PUBLIC_LEAD_FORM_URL;
    if (url) {
      window.open(`${url}${url.includes("?") ? "&" : "?"}email=${encodeURIComponent(email)}&source=conclusao`, "_blank", "noopener,noreferrer");
      setMessage("Conclua o cadastro no formulário aberto em uma nova aba.");
    } else setMessage("Em breve você poderá se cadastrar para receber novos desafios.");
  }

  return <main className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
    <ChallengeStepper />
    <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-neon">Resultado do desafio</p>
    <h1 className="mt-4 text-4xl font-black text-off-white sm:text-5xl">{ready ? "Entrega pronta para portfólio." : "Finalize sua entrega."}</h1>
    <p className="mt-5 max-w-2xl text-lg leading-8 text-[#AAB2BC]">Esta revisão usa os artefatos salvos na bancada. Cada item reflete o que você realmente produziu.</p>
    <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#171B21]">
      <div className="flex items-center justify-between border-b border-white/10 p-5"><strong className="text-off-white">Progresso verificável</strong><span className={`text-sm font-black ${ready ? "text-neon" : "text-mint"}`}>{loaded ? `${completed}/${checks.length}` : "..."}</span></div>
      <div className="grid gap-3 p-5 sm:grid-cols-2">{checks.map((item) => <div key={item.label} className={`flex items-start gap-3 rounded-xl border p-4 ${item.done ? "border-neon/20 bg-neon/[.04]" : "border-white/10"}`}>{item.done ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-neon" /> : <Circle className="mt-0.5 size-4 shrink-0 text-[#69737E]" />}<div><p className="text-sm font-bold text-off-white">{item.label}</p><p className="mt-1 text-xs text-[#69737E]">{item.detail}</p></div></div>)}</div>
    </section>
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link href="/playground/entregas" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-bold text-off-white"><ArrowLeft className="size-4" />Editar entregas</Link>
      <button type="button" onClick={download} disabled={!loaded || data.bugs.length + data.bdd.length + data.e2e.length === 0} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neon px-5 text-sm font-black text-[#101319] disabled:cursor-not-allowed disabled:opacity-40"><Download className="size-4" />Exportar portfólio</button>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#7BA7E8]/30 px-5 text-sm font-bold text-[#9BC0F5]"><Linkedin className="size-4" />Compartilhar</a>
    </div>
    <blockquote className="mt-6 rounded-xl border-l-2 border-mint bg-mint/[.04] p-4 text-sm leading-6 text-[#AAB2BC]">“{shareText}”</blockquote>
    <section className="mt-10 rounded-2xl border border-white/10 bg-[#171B21] p-6"><Mail className="size-5 text-mint" /><h2 className="mt-3 text-xl font-black text-off-white">Receber os próximos desafios</h2><form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" className="field flex-1" /><button className="h-11 rounded-lg bg-mint px-5 text-sm font-black text-[#101319]">Quero receber</button></form>{message && <p className="mt-3 text-xs text-[#8B949E]">{message}</p>}</section>
  </main>;
}
