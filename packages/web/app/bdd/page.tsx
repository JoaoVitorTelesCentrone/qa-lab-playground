"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, Download, FileCode2, Plus, Trash2 } from "lucide-react";

type Scenario = { title: string; given: string; when: string; then: string };
const emptyScenario = (): Scenario => ({ title: "", given: "", when: "", then: "" });

function toFeature(feature: string, context: string, scenarios: Scenario[]) {
  const valid = scenarios.filter((item) => item.title || item.given || item.when || item.then);
  return [
    `# language: pt`,
    `Funcionalidade: ${feature || "Nome da funcionalidade"}`,
    context ? `  ${context}` : "",
    ...valid.flatMap((scenario) => [
      "",
      `  Cenário: ${scenario.title || "Comportamento esperado"}`,
      `    Dado ${scenario.given || "que existe um contexto conhecido"}`,
      `    Quando ${scenario.when || "uma ação é executada"}`,
      `    Então ${scenario.then || "o resultado esperado deve ocorrer"}`,
    ]),
  ].filter((line, index, lines) => line || lines[index - 1]).join("\n");
}

export default function BddPage() {
  const [feature, setFeature] = useState("Autenticação de usuário");
  const [context, setContext] = useState("Como usuário, quero acessar minha conta com segurança.");
  const [scenarios, setScenarios] = useState<Scenario[]>([{ title: "Login com credenciais válidas", given: "que estou na página de login", when: "informo credenciais válidas", then: "devo acessar a área autenticada" }]);
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => toFeature(feature, context, scenarios), [feature, context, scenarios]);

  function update(index: number, field: keyof Scenario, value: string) {
    setScenarios((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function download() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${feature.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "cenario"}.feature`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-neon">Ferramenta gratuita</p><h1 className="mt-3 text-4xl font-black tracking-tight text-off-white sm:text-5xl">Gerador de BDD</h1><p className="mt-4 leading-7 text-[#8B949E]">Estruture exemplos de comportamento em Gherkin. O gerador organiza a escrita; a qualidade dos cenários continua dependendo da conversa e das regras do produto.</p></header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-5 rounded-2xl border border-white/10 bg-[#171B21] p-5 sm:p-7" aria-label="Editor de cenários">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#AAB2BC]">Funcionalidade<input value={feature} onChange={(event) => setFeature(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-[#101319] px-3 py-2.5 text-sm text-off-white outline-none focus:border-mint/50" /></label>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#AAB2BC]">Contexto<textarea value={context} onChange={(event) => setContext(event.target.value)} rows={2} className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-[#101319] px-3 py-2.5 text-sm normal-case text-off-white outline-none focus:border-mint/50" /></label>
          <div className="space-y-4">
            {scenarios.map((scenario, index) => (
              <fieldset key={index} className="rounded-xl border border-white/[0.08] p-4"><legend className="px-2 text-xs font-bold text-mint">Cenário {index + 1}</legend>
                <div className="space-y-3">
                  <input aria-label={`Título do cenário ${index + 1}`} value={scenario.title} onChange={(event) => update(index, "title", event.target.value)} placeholder="Título objetivo" className="w-full rounded-lg border border-white/10 bg-[#101319] px-3 py-2 text-sm text-off-white outline-none focus:border-mint/50" />
                  {(["given", "when", "then"] as const).map((field) => <label key={field} className="grid items-center gap-2 text-xs font-bold uppercase text-[#69737E] sm:grid-cols-[4rem_1fr]"><span>{field === "given" ? "Dado" : field === "when" ? "Quando" : "Então"}</span><input value={scenario[field]} onChange={(event) => update(index, field, event.target.value)} className="rounded-lg border border-white/10 bg-[#101319] px-3 py-2 text-sm normal-case text-off-white outline-none focus:border-mint/50" /></label>)}
                </div>
                {scenarios.length > 1 && <button type="button" onClick={() => setScenarios((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#69737E] hover:text-coral"><Trash2 className="size-3.5" /> Remover</button>}
              </fieldset>
            ))}
          </div>
          <button type="button" onClick={() => setScenarios((current) => [...current, emptyScenario()])} className="inline-flex h-10 items-center gap-2 rounded-lg border border-mint/25 px-4 text-xs font-bold text-mint hover:bg-mint/10"><Plus className="size-4" /> Adicionar cenário</button>
        </section>

        <section className="self-start overflow-hidden rounded-2xl border border-white/10 bg-[#0D1015] lg:sticky lg:top-24" aria-label="Prévia Gherkin">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B949E]"><FileCode2 className="size-4 text-neon" /> arquivo.feature</span><div className="flex gap-2"><button type="button" onClick={copy} className="inline-flex size-8 items-center justify-center rounded-lg text-[#8B949E] hover:bg-white/5 hover:text-mint" aria-label="Copiar Gherkin">{copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}</button><button type="button" onClick={download} className="inline-flex size-8 items-center justify-center rounded-lg text-[#8B949E] hover:bg-white/5 hover:text-mint" aria-label="Baixar arquivo feature"><Download className="size-4" /></button></div></div>
          <pre className="min-h-96 overflow-x-auto whitespace-pre-wrap p-5 font-mono text-xs leading-6 text-[#D7DEE7]"><code>{output}</code></pre>
        </section>
      </div>
    </div>
  );
}
