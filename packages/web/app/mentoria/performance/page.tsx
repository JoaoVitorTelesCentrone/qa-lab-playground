import Link from "next/link";
import { ArrowLeft, Gauge, ShieldCheck } from "lucide-react";

export const metadata = { title: "Prática segura de performance | Mentoria QA Lab" };

const scenarios = [
  { name: "Baseline", command: "node packages/performance/scripts/run-k6.js baseline", note: "Uma VU e dez iterações para criar a referência inicial." },
  { name: "Carga gradual", command: "node packages/performance/scripts/run-k6.js load", note: "Sobe até cinco VUs, mantém por 30 segundos e encerra gradualmente." },
  { name: "Pico controlado", command: "node packages/performance/scripts/run-k6.js spike", note: "Sobe até vinte VUs por 15 segundos e observa recuperação." },
];

export default function MentorshipPerformancePage() {
  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
    <Link href="/mentoria/semanas/11" className="inline-flex items-center gap-2 text-sm font-bold text-mint hover:text-neon"><ArrowLeft className="size-4" /> Voltar para semana 11</Link>
    <header className="mt-8 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-mint">Semana 11 · Prática local</p><h1 className="mt-3 text-4xl font-black text-off-white">Teste de carga seguro com k6</h1><p className="mt-4 text-base leading-7 text-[#AAB2BC]">Execute os cenários contra a API de treino no seu computador. O runner e os scripts recusam HTTPS e qualquer host que não seja loopback.</p></header>

    <section className="mt-8 grid gap-4 md:grid-cols-2"><article className="border border-white/10 bg-[#171B21] p-5"><div className="flex items-center gap-3"><Gauge className="size-5 text-mint" /><h2 className="font-black text-off-white">Preparar o ambiente</h2></div><ol className="mt-4 grid gap-3 text-sm leading-6 text-[#C8CFD7]"><li><strong className="text-mint">1.</strong> Instale o k6 no computador.</li><li><strong className="text-mint">2.</strong> Na raiz do projeto, inicie a API: <code className="rounded bg-black/25 px-1.5 py-0.5">bun run dev:api</code>.</li><li><strong className="text-mint">3.</strong> Abra outro terminal na raiz e confirme o alvo local:</li></ol><pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-[#101319] p-4 text-xs leading-6 text-neon">{`$env:PERF_TARGET_ACK = "LOCAL_ONLY"\n$env:PERF_TARGET = "http://127.0.0.1:3001"`}</pre><p className="mt-3 text-xs leading-5 text-[#8B949E]">No macOS/Linux, use <code>export PERF_TARGET_ACK=LOCAL_ONLY</code> e <code>export PERF_TARGET=http://127.0.0.1:3001</code>.</p></article>
      <aside className="border border-mint/25 bg-mint/[.04] p-5"><div className="flex items-center gap-3"><ShieldCheck className="size-5 text-mint" /><h2 className="font-black text-off-white">Limites de segurança</h2></div><ul className="mt-4 grid gap-2 text-sm leading-6 text-[#C8CFD7]"><li>Somente HTTP local em localhost, 127.0.0.1 ou ::1.</li><li>O runner exige confirmação explícita <code>LOCAL_ONLY</code>.</li><li>Os cenários têm volume fixo e não aceitam alvo remoto.</li><li>Execute só contra a API de treino local, nunca contra sistemas de terceiros.</li></ul></aside></section>

    <section className="mt-10"><h2 className="text-2xl font-black text-off-white">Execute em sequência</h2><p className="mt-2 text-sm leading-6 text-[#AAB2BC]">Rode cada comando em um terminal PowerShell na raiz do projeto, depois de configurar as duas variáveis acima.</p><div className="mt-5 grid gap-3">{scenarios.map((scenario, index) => <article key={scenario.name} className="border border-white/10 bg-[#171B21] p-5"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-bold text-off-white">{index + 1}. {scenario.name}</h3><span className="text-xs text-[#8B949E]">{scenario.note}</span></div><pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-[#101319] p-3 text-xs text-neon">{scenario.command}</pre></article>)}</div></section>

    <section className="mt-10 border-t border-white/10 pt-8"><h2 className="text-2xl font-black text-off-white">O que registrar no relatório</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><Criterion title="Modelo" text="Qual usuário ou operação o cenário representa e por que escolheu esse volume." /><Criterion title="Sinais" text="Taxa de erro, p95, p99 e throughput em cada etapa." /><Criterion title="Limite" text="Qual resultado atingiu os thresholds locais e onde a evidência aponta um gargalo." /><Criterion title="Próxima decisão" text="Recomendação de capacidade, investigação ou novo experimento, com risco residual." /></div><p className="mt-5 text-xs leading-5 text-[#8B949E]">Os thresholds iniciais (erro abaixo de 1%, p95 abaixo de 500 ms e p99 abaixo de 1 s) são referências didáticas para a API local, não um SLO de produção.</p></section>
  </main>;
}

function Criterion({ title, text }: { title: string; text: string }) {
  return <article className="border border-white/10 bg-[#171B21] p-4"><h3 className="text-sm font-bold text-mint">{title}</h3><p className="mt-1 text-sm leading-6 text-[#AAB2BC]">{text}</p></article>;
}
