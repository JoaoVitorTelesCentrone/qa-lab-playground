"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, Circle, ExternalLink, Lightbulb, Target } from "lucide-react";

const STORAGE_KEY = "qa-lab-free-missions";
const missions = [
  { id: "expense-risk", level: "Iniciante", title: "Caça aos riscos do ExpenseFlow", description: "Explore o fluxo por 20 minutos e registre três problemas que possam reduzir a confiança nos dados financeiros.", deliverable: "3 bug reports com impacto e severidade", hint: "Combine filtros, paginação, edição e exclusão. Observe também valores-limite.", href: "/despesas", action: "Abrir ExpenseFlow" },
  { id: "date-boundaries", level: "Iniciante", title: "Fronteiras do calendário", description: "Monte uma estratégia para validar datas em viradas de mês, ano, horário de verão e anos bissextos.", deliverable: "Checklist com ao menos 8 cenários", hint: "Não teste apenas o dia atual. Pense no que acontece antes, durante e depois de cada fronteira.", href: "/datas", action: "Abrir Datas Bugadas" },
  { id: "bdd-review", level: "Iniciante", title: "Do requisito ao exemplo", description: "Transforme a regra “o usuário bloqueia após cinco tentativas inválidas” em cenários positivos, negativos e de limite.", deliverable: "Arquivo .feature com 4 cenários", hint: "Inclua a quarta, a quinta e a sexta tentativa. Explique quando o contador deve ser reiniciado.", href: "/bdd", action: "Abrir Gerador BDD" },
  { id: "bug-triage", level: "Intermediário", title: "Defenda sua priorização", description: "Escolha cinco achados, classifique severidade e prioridade separadamente e justifique a ordem de correção.", deliverable: "Tabela de triagem com justificativas", hint: "Severidade mede impacto técnico; prioridade considera também urgência, alcance e contexto de negócio.", href: "/despesas", action: "Investigar sistema" },
  { id: "test-charter", level: "Intermediário", title: "Escreva um charter exploratório", description: "Planeje uma sessão de 30 minutos com alvo, riscos, dados, oráculos e critérios claros de encerramento.", deliverable: "Charter reutilizável de uma página", hint: "Um bom charter direciona sem virar um roteiro rígido de passos.", href: "/datas", action: "Escolher alvo" },
  { id: "quality-story", level: "Intermediário", title: "Conte a história da qualidade", description: "Produza uma publicação curta explicando um bug encontrado, o raciocínio usado e o aprendizado para outros QAs.", deliverable: "Post de até 1.200 caracteres", hint: "Remova a resposta completa se quiser que outras pessoas também investiguem o desafio.", href: "/blog", action: "Ler referências" },
];

export default function MissionsPage() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [openHint, setOpenHint] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setCompleted(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")); } catch { setCompleted([]); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function toggle(id: string) {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Prática guiada</p><h1 className="mt-3 text-4xl font-black tracking-tight text-off-white sm:text-5xl">Missões de QA</h1><p className="mt-4 leading-7 text-[#8B949E]">Desafios pequenos para transformar exploração em entregáveis concretos. Marque o progresso sem criar conta — ele fica salvo neste navegador.</p></header>
      <div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-white/10 bg-[#171B21] p-4"><p className="text-xs text-[#69737E]">Progresso</p><p className="mt-1 text-2xl font-black text-mint">{completed.length}/{missions.length}</p></div><div className="rounded-xl border border-white/10 bg-[#171B21] p-4"><p className="text-xs text-[#69737E]">Níveis</p><p className="mt-1 font-bold text-off-white">Iniciante e intermediário</p></div><div className="rounded-xl border border-white/10 bg-[#171B21] p-4"><p className="text-xs text-[#69737E]">Conta necessária</p><p className="mt-1 font-bold text-off-white">Nenhuma</p></div></div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {missions.map((mission, index) => {
          const done = completed.includes(mission.id);
          return <article key={mission.id} className={`flex flex-col rounded-2xl border p-5 transition ${done ? "border-mint/30 bg-mint/[0.055]" : "border-white/10 bg-[#171B21]"}`}>
            <div className="flex items-center justify-between"><span className="font-mono text-xs text-[#69737E]">#{String(index + 1).padStart(2, "0")} · {mission.level}</span><button type="button" onClick={() => toggle(mission.id)} aria-label={done ? `Desmarcar ${mission.title}` : `Concluir ${mission.title}`} className="text-[#69737E] hover:text-mint">{done ? <CheckCircle2 className="size-5 text-mint" /> : <Circle className="size-5" />}</button></div>
            <Target className="mt-6 size-5 text-coral" /><h2 className="mt-3 text-lg font-bold text-off-white">{mission.title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-[#8B949E]">{mission.description}</p>
            <div className="mt-5 rounded-lg bg-white/[0.035] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#69737E]">Entregável</p><p className="mt-1 text-xs text-[#AAB2BC]">{mission.deliverable}</p></div>
            {openHint === mission.id && <div className="mt-3 flex gap-2 rounded-lg border border-neon/15 bg-neon/[0.04] p-3 text-xs leading-5 text-[#AAB2BC]"><Lightbulb className="mt-0.5 size-4 shrink-0 text-neon" />{mission.hint}</div>}
            <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4"><button type="button" onClick={() => setOpenHint((current) => current === mission.id ? null : mission.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#7D8793] hover:text-neon">Ver dica <ChevronDown className={`size-3.5 transition ${openHint === mission.id ? "rotate-180" : ""}`} /></button><Link href={mission.href} className="inline-flex items-center gap-1.5 text-xs font-bold text-mint hover:underline">{mission.action}<ExternalLink className="size-3.5" /></Link></div>
          </article>;
        })}
      </div>
    </div>
  );
}
