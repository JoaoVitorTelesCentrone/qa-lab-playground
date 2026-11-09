"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode, type TextareaHTMLAttributes } from "react";
import { ArrowLeft, Check, CircleAlert, Copy, Database, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { findQaTool, type QaToolId } from "@/lib/qa-tools";
import { qaToolLabForNumber, qaToolLabsFor } from "@/lib/qa-tool-labs";
import { AdvancedWorkbench } from "@/components/qa-tools/advanced-workbenches";

type Order = { id: string; customer: string; status: string; total: number };
type QueryRow = Partial<Order>;
const orders: Order[] = [
  { id: "QL-1042", customer: "Ana Lima", status: "paid", total: 189.9 },
  { id: "QL-1043", customer: "Caio Nunes", status: "pending", total: 74.5 },
  { id: "QL-1044", customer: "Bia Rocha", status: "refunded", total: 0 },
  { id: "QL-1045", customer: "Leo Alves", status: "paid", total: 1299 },
  { id: "QL-1046", customer: "Duda Reis", status: "pending", total: -29.9 },
  { id: "QL-1047", customer: "Ivo Melo", status: "paid", total: 89.9 },
  { id: "QL-1048", customer: "Nina Luz", status: "cancelled", total: 215 },
  { id: "QL-1049", customer: "Ravi Dias", status: "paid", total: 0 },
  { id: "QL-1050", customer: "Lia Ramos", status: "refunded", total: 65 },
  { id: "QL-1050", customer: "Lia Ramos", status: "pending", total: 65 },
  { id: "QL-1051", customer: "Caio Nunes", status: "pending", total: 720 },
];
const samples = [
  "SELECT id, customer, status, total FROM orders WHERE status = 'pending' ORDER BY total DESC",
  "SELECT id, customer, status, total FROM orders WHERE total < 0",
  "SELECT id, customer, status, total FROM orders WHERE status = 'paid' ORDER BY total DESC LIMIT 3",
];

type QueryResult = { rows: QueryRow[]; error?: string };
function runSafeQuery(query: string): QueryResult {
  const match = query.trim().match(/^SELECT\s+(\*|[a-z_,\s]+)\s+FROM\s+orders(?:\s+WHERE\s+(status\s*=\s*'(?:paid|pending|refunded|cancelled)'|(?:id|customer)\s*=\s*'[^']{1,80}'|total\s*(?:<|>|=)\s*-?\d+(?:\.\d+)?))?(?:\s+ORDER\s+BY\s+(id|customer|status|total)\s+(ASC|DESC))?(?:\s+LIMIT\s+(\d+))?\s*;?$/i);
  if (!match) return { rows: [], error: "Consulta não reconhecida. Use SELECT em orders, com filtro opcional por status ou total." };
  const [, selected, rawWhere, rawOrder, rawDirection, rawLimit] = match;
  const columns = selected === "*" ? ["id", "customer", "status", "total"] : selected.split(",").map((column) => column.trim().toLowerCase());
  if (!columns.length || columns.some((column) => !["id", "customer", "status", "total"].includes(column))) return { rows: [], error: "Coluna desconhecida. Disponíveis: id, customer, status e total." };
  let result = [...orders];
  if (rawWhere) {
    const status = rawWhere.match(/^status\s*=\s*'([^']+)'$/i);
    const total = rawWhere.match(/^total\s*(<|>|=)\s*(-?\d+(?:\.\d+)?)$/i);
    const textFilter = rawWhere.match(/^(id|customer)\s*=\s*'([^']+)'$/i);
    if (status) result = result.filter((row) => row.status === status[1].toLowerCase());
    else if (textFilter) result = result.filter((row) => row[textFilter[1].toLowerCase() as "id" | "customer"] === textFilter[2]);
    else if (total) result = result.filter((row) => total[1] === "<" ? row.total < Number(total[2]) : total[1] === ">" ? row.total > Number(total[2]) : row.total === Number(total[2]));
  }
  if (rawOrder) result.sort((a, b) => String(a[rawOrder.toLowerCase() as keyof Order]).localeCompare(String(b[rawOrder.toLowerCase() as keyof Order]), undefined, { numeric: true }) * ((rawDirection ?? "ASC").toUpperCase() === "DESC" ? -1 : 1));
  if (rawLimit) result = result.slice(0, Math.min(Number(rawLimit), 100));
  return { rows: result.map((row) => Object.fromEntries(columns.map((column) => [column, row[column as keyof Order]])) as QueryRow) };
}

const expectedContract = { status: "number", data: "object", "data.id": "string", "data.total": "number", "data.items": "array", "data.items[].product": "string", "data.items[].quantity": "number" } as const;
const validResponse = { status: 200, data: { id: "ord_1042", total: 189.9, items: [{ product: "Caderno A5", quantity: 2 }] } };
const faultyResponse = { status: "200", data: { id: "ord_1042", total: "189.90", items: [{ product: "Caderno A5", quantity: 0 }] } };
function valueAtPath(input: unknown, path: string): unknown {
  if (path === "data.items[].product" || path === "data.items[].quantity") {
    const list = (input as { data?: { items?: unknown[] } })?.data?.items;
    return Array.isArray(list) ? list.map((item) => (item as Record<string, unknown>)?.[path.endsWith("product") ? "product" : "quantity"]) : undefined;
  }
  return path.split(".").reduce<unknown>((current, part) => current && typeof current === "object" ? (current as Record<string, unknown>)[part] : undefined, input);
}
function valueType(value: unknown) { return Array.isArray(value) ? "array" : value === null ? "null" : typeof value; }
type ContractCheck = { path: string; expected: string; actual: string; ok: boolean };
function checkContract(input: unknown): ContractCheck[] {
  const root = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const status = root.status;
  const checks: ContractCheck[] = [{ path: "status", expected: "HTTP 200 ou 422", actual: String(status ?? "ausente"), ok: status === 200 || status === 422 }];
  if (status === 422) {
    const error = root.error && typeof root.error === "object" && !Array.isArray(root.error) ? root.error as Record<string, unknown> : {};
    checks.push({ path: "error", expected: "object", actual: valueType(root.error), ok: valueType(root.error) === "object" });
    for (const key of ["code", "message"] as const) {
      const value = error[key];
      checks.push({ path: `error.${key}`, expected: "string não vazia", actual: value === undefined ? "ausente" : valueType(value), ok: typeof value === "string" && value.trim().length > 0 });
    }
    checks.push({ path: "data", expected: "ausente", actual: valueType(root.data), ok: root.data === undefined });
    return checks;
  }
  if (status !== 200) return checks;
  for (const [path, expected] of Object.entries(expectedContract)) {
    if (path === "status" || path.includes("[]")) continue;
    const value = valueAtPath(input, path);
    checks.push({ path, expected, actual: value === undefined ? "ausente" : valueType(value), ok: valueType(value) === expected });
  }
  const items = valueAtPath(input, "data.items");
  if (Array.isArray(items)) {
    items.forEach((item, index) => {
      const entry = item && typeof item === "object" && !Array.isArray(item) ? item as Record<string, unknown> : {};
      const product = entry.product;
      const quantity = entry.quantity;
      checks.push({ path: `data.items[${index}].product`, expected: "string não vazia", actual: product === undefined ? "ausente" : valueType(product), ok: typeof product === "string" && product.trim().length > 0 });
      checks.push({ path: `data.items[${index}].quantity`, expected: "inteiro positivo", actual: String(quantity ?? "ausente"), ok: typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0 });
    });
  }
  return checks;
}

type EventRow = { time: string; level: "INFO" | "WARN" | "ERROR"; service: string; trace: string; message: string };
const events: EventRow[] = [
  { time: "14:21:58.010", level: "INFO", service: "queue", trace: "tr-a211", message: "fila payment-reconcile · depth=8" },
  { time: "14:22:01.104", level: "INFO", service: "gateway", trace: "tr-7f31", message: "POST /orders recebido · user=u_108" },
  { time: "14:22:01.121", level: "INFO", service: "orders-api", trace: "tr-7f31", message: "validação concluída · items=2" },
  { time: "14:22:01.153", level: "INFO", service: "orders-api", trace: "tr-7f31", message: "order criada · id=ord_1042" },
  { time: "14:22:01.166", level: "INFO", service: "queue", trace: "tr-7f31", message: "evento order.created publicado" },
  { time: "14:22:01.207", level: "WARN", service: "payments", trace: "tr-7f31", message: "tentativa 1 · timeout após 80ms" },
  { time: "14:22:01.311", level: "ERROR", service: "payments", trace: "tr-7f31", message: "tentativa 2 · gateway indisponível" },
  { time: "14:22:01.339", level: "INFO", service: "orders-api", trace: "tr-7f31", message: "resposta 201 enviada · payment=pending" },
  { time: "14:22:04.008", level: "INFO", service: "gateway", trace: "tr-c902", message: "GET /orders/ord_1039 · status=200" },
  { time: "14:22:04.043", level: "INFO", service: "orders-api", trace: "tr-c902", message: "order carregada · id=ord_1039" },
  { time: "14:22:07.502", level: "ERROR", service: "worker", trace: "tr-a211", message: "job reconcile falhou · retry em 30s" },
  { time: "14:22:08.017", level: "WARN", service: "queue", trace: "tr-a211", message: "fila payment-reconcile · depth=23" },
];

export function ToolWorkbench({ toolId, labNumber }: { toolId: QaToolId; labNumber: number }) {
  const tool = findQaTool(toolId)!;
  const [selectedNumber, setSelectedNumber] = useState(labNumber);
  const lab = qaToolLabForNumber(selectedNumber)!;
  const labs = qaToolLabsFor(toolId);
  const Icon = tool.icon;
  function selectLab(number: number) {
    setSelectedNumber(number);
    const url = new URL(window.location.href);
    url.searchParams.set("lab", String(number));
    window.history.replaceState(null, "", url);
  }
  return <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
    <Link href="/lab/ferramentas" className="inline-flex items-center gap-2 text-xs text-[#9AA4AF] hover:text-white"><ArrowLeft className="size-3.5" />Ferramentas</Link>
    <header className="mt-7 flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl"><div className={`flex items-center gap-2 text-sm font-bold ${tool.accent}`}><Icon className="size-4" />{tool.shortTitle}</div><h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{tool.title}</h1><p className="mt-3 text-sm leading-6 text-[#AAB2BC]">{tool.task} Tudo roda no navegador com uma massa fictícia.</p></div>
      <div className="flex items-center gap-2 self-start rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#AAB2BC]"><ShieldCheck className="size-3.5 text-mint" /> Ambiente isolado</div>
    </header>
    <section className="mt-6 grid gap-5 rounded-xl border border-white/10 bg-[#15191f] p-5 sm:grid-cols-[minmax(0,1fr)_15rem] sm:p-6" aria-labelledby="active-lab-title">
      <div><p className="text-xs font-bold text-mint">Lab {String(labs.findIndex((item) => item.number === lab.number) + 1).padStart(2, "0")} de {labs.length}</p><h2 id="active-lab-title" className="mt-2 text-xl font-bold text-white">{lab.title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[#AAB2BC]">{lab.objective}</p><ol className="mt-4 grid gap-2 text-xs leading-5 text-[#c5cdd5] sm:grid-cols-3">{lab.steps.map((step, index) => <li key={step} className="border-l border-white/15 pl-3"><span className="mr-1 font-mono text-mint">{index + 1}.</span>{step}</li>)}</ol><p className="mt-4 text-xs text-[#89939f]">Entrega esperada: <span className="text-[#c5cdd5]">{lab.expected}</span></p><ul className="mt-3 flex flex-wrap gap-2">{lab.acceptance.map((item) => <li key={item} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-[#9AA4AF]">{item}</li>)}</ul></div>
      <label className="text-xs font-semibold text-[#9AA4AF]">Escolha outro Lab<select aria-label="Escolha um Lab desta ferramenta" value={selectedNumber} onChange={(event) => selectLab(Number(event.target.value))} className="mt-2 block min-h-11 w-full rounded-md border border-white/10 bg-[#0d1014] px-3 text-sm text-white">{labs.map((item, index) => <option key={item.number} value={item.number}>{String(index + 1).padStart(2, "0")} · {item.title}</option>)}</select><span className="mt-2 block font-normal leading-5 text-[#697581]">Cada missão tem briefing, critérios e um cenário de início próprio.</span></label>
    </section>
    <div className="mt-5" key={`${toolId}-${lab.number}`}>{toolId === "sql" ? <SqlBench starterQuery={lab.starter} /> : toolId === "contrato" ? <ContractBench starter={lab.starter} /> : toolId === "visual" ? <VisualBench starter={lab.starter} /> : toolId === "observabilidade" ? <TraceBench starterTrace={lab.starter} /> : <AdvancedWorkbench toolId={toolId} starter={lab.starter} />}</div>
  </main>;
}

function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return <section className={`overflow-hidden rounded-xl border border-white/10 bg-[#15191f] ${className}`}><header className="border-b border-white/10 px-4 py-3 text-sm font-bold text-white">{title}</header><div className="p-4">{children}</div></section>;
}
function RunButton({ onClick, children = "Executar" }: { onClick: () => void; children?: string }) {
  return <button type="button" onClick={onClick} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-mint px-4 text-sm font-black text-[#101319] hover:bg-mint/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"><Play className="size-4" />{children}</button>;
}
function CodeArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} spellCheck={false} className={`min-h-36 w-full resize-y rounded-lg border border-white/10 bg-[#0d1014] p-4 font-mono text-sm leading-6 text-[#dbe6e0] placeholder:text-[#59636e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint ${props.className ?? ""}`} />;
}

function SqlBench({ starterQuery }: { starterQuery: string }) {
  const [query, setQuery] = useState(starterQuery);
  const [result, setResult] = useState<QueryResult | null>(null);
  return <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(24rem,.9fr)]">
    <Panel title="Consulta SQL"><div className="mb-3 flex flex-wrap gap-2">{samples.map((sample, index) => <button key={sample} type="button" onClick={() => setQuery(sample)} className="rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-[#aeb8c3] hover:border-sky-300/40 hover:text-white">{["Pedidos pendentes", "Valores negativos", "Top pagos"][index]}</button>)}</div><CodeArea aria-label="Consulta SQL" value={query} onChange={(event) => setQuery(event.target.value)} /><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-[#84909c]">Tabela disponível: <code className="text-sky-200">orders</code> · Somente SELECT</span><RunButton onClick={() => setResult(runSafeQuery(query))} /></div><p className="mt-4 border-t border-white/10 pt-3 text-xs leading-5 text-[#89939f]">O executor aceita filtros por <code>status</code> ou <code>total</code>, ordenação e limite. Não acessa banco nem executa comandos de escrita.</p></Panel>
    <Panel title="Resultado da consulta">{!result ? <EmptyPrompt text="Execute uma consulta ou escolha um exemplo para começar." /> : result.error ? <ToolError>{result.error}</ToolError> : <><div className="mb-3 flex items-center justify-between text-xs text-[#9AA4AF]"><span>{result.rows.length} linha(s)</span><span>orders · dados de treino</span></div><DataTable rows={result.rows} /><p className="mt-3 text-xs text-amber-200">Compare as linhas com a regra do Lab e registre o identificador usado na conclusão.</p></>}</Panel>
  </div>;
}

function DataTable({ rows }: { rows: QueryRow[] }) {
  if (!rows.length) return <EmptyPrompt text="A consulta executou sem erro, mas não encontrou registros." />;
  const columns = Object.keys(rows[0]);
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-xs"><thead><tr>{columns.map((column) => <th key={column} className="border-b border-white/10 px-2 py-2 font-semibold text-[#89939f]">{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.id}-${index}`} className="border-b border-white/[.06] last:border-0">{columns.map((column) => <td key={column} className={`px-2 py-2.5 font-mono ${column === "total" && Number(row.total) < 0 ? "text-rose-300" : "text-[#dce3e8]"}`}>{String(row[column as keyof Order])}</td>)}</tr>)}</tbody></table></div>;
}

function ContractBench({ starter }: { starter: string }) {
  const initialBody = responseForStarter(starter);
  const [preset, setPreset] = useState<"success" | "regression" | "error" | "custom">(starter === "erro-422" ? "error" : starter === "válida" || starter === "lista-vazia" ? "success" : "regression");
  const [body, setBody] = useState(JSON.stringify(initialBody, null, 2));
  const [checks, setChecks] = useState<ContractCheck[] | null>(null);
  function choosePreset(next: "success" | "regression" | "error") { setPreset(next); setBody(JSON.stringify(next === "success" ? validResponse : next === "error" ? responseForStarter("erro-422") : faultyResponse, null, 2)); setChecks(null); }
  function inspect() {
    try {
      const parsed: unknown = JSON.parse(body);
      setChecks(checkContract(parsed));
    } catch { setChecks([{ path: "JSON", expected: "JSON válido", actual: "erro de sintaxe", ok: false }]); }
  }
  const failed = checks?.filter((check) => !check.ok) ?? [];
  return <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,.9fr)]">
    <Panel title="Resposta recebida"><div className="mb-4 flex flex-wrap items-center gap-2">{([ ["success", "Resposta 200"], ["regression", "Injetar regressão"], ["error", "Resposta 422"] ] as const).map(([id, label]) => <button key={id} type="button" onClick={() => choosePreset(id)} aria-pressed={preset === id} className={`rounded-md px-3 py-2 text-xs font-bold ${preset === id ? "bg-emerald-300/15 text-emerald-200" : "border border-white/10 text-[#9AA4AF]"}`}>{label}</button>)}</div><CodeArea aria-label="Corpo JSON da resposta" value={body} onChange={(event) => { setBody(event.target.value); setPreset("custom"); setChecks(null); }} /><div className="mt-3 flex items-center justify-between gap-3"><p className="text-xs text-[#89939f]">O status seleciona o contrato de sucesso ou de erro. Edite o JSON para investigar.</p><RunButton onClick={inspect}>Validar contrato</RunButton></div></Panel>
    <Panel title="Assertions"><div className="mb-4 grid grid-cols-3 gap-2 text-center"><Metric label="Regras" value={checks ? String(checks.length) : "—"} /><Metric label="Passaram" value={checks ? String(checks.length - failed.length) : "—"} /><Metric label="Falharam" value={checks ? String(failed.length) : "—"} danger={failed.length > 0} /></div>{!checks ? <EmptyPrompt text="Valide a resposta para conferir presença, tipo e regra de negócio." /> : <div className="space-y-2">{checks.map((check) => <div key={check.path} className={`grid grid-cols-[1.4rem_1fr] gap-2 rounded-lg border p-3 ${check.ok ? "border-emerald-300/15 bg-emerald-300/[.04]" : "border-rose-300/20 bg-rose-300/[.04]"}`}><span className={check.ok ? "text-emerald-300" : "text-rose-300"}>{check.ok ? <Check className="size-4" /> : <CircleAlert className="size-4" />}</span><div><code className="text-xs text-white">{check.path}</code><p className="mt-1 text-xs text-[#9AA4AF]">Esperado: {check.expected} · recebido: {check.actual}</p></div></div>)}</div>}</Panel>
  </div>;
}

function responseForStarter(starter: string) {
  const response = JSON.parse(JSON.stringify(validResponse)) as typeof validResponse;
  if (starter === "id-ausente") delete (response.data as Partial<typeof response.data>).id;
  if (starter === "quantidade-zero") response.data.items[0].quantity = 0;
  if (starter === "lista-vazia") response.data.items = [];
  if (starter === "segundo-item") response.data.items.push({ product: "Caneta azul", quantity: 0 });
  if (starter === "id-nulo") (response.data as { id: unknown }).id = null;
  if (starter === "total-texto") (response.data as { total: unknown }).total = "189.90";
  if (starter === "quantidade-negativa") response.data.items[0].quantity = -1;
  if (starter === "erro-422") return { status: 422, error: { code: "PAYMENT_REVIEW", message: "Pagamento em análise" } };
  if (starter === "tipos") return faultyResponse;
  return response;
}

function Metric({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) { return <div className="rounded-lg border border-white/10 px-2 py-3"><strong className={`block text-lg ${danger ? "text-rose-300" : "text-white"}`}>{value}</strong><span className="text-[11px] text-[#89939f]">{label}</span></div>; }

type VisualIssue = "banner" | "clip" | "contrast";
const visualIssueCopy: Record<VisualIssue, string> = { banner: "Banner cobre o botão de finalizar", clip: "Total aparece cortado em viewport estreito", contrast: "Texto do cupom perde contraste" };
function VisualBench({ starter }: { starter: string }) {
  const initialRelease = (starter || "banner") as VisualIssue | "limpa";
  const [release, setRelease] = useState<VisualIssue | "limpa">(initialRelease);
  const [viewport, setViewport] = useState<"desktop" | "mobile">(starter === "clip" ? "mobile" : "desktop");
  const [selected, setSelected] = useState<VisualIssue[]>([]);
  const [reviewed, setReviewed] = useState(false);
  const actual: VisualIssue[] = release === "limpa" ? [] : release === "clip" && viewport === "desktop" ? [] : [release];
  const selectionMatches = reviewed && actual.length === selected.length && actual.every((issue) => selected.includes(issue));
  function toggle(issue: VisualIssue) { setSelected((current) => current.includes(issue) ? current.filter((item) => item !== issue) : [...current, issue]); setReviewed(false); }
  return <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
    <Panel title="Checkout · comparação de release"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-2"><button type="button" onClick={() => setViewport("desktop")} aria-pressed={viewport === "desktop"} className={viewport === "desktop" ? "rounded-md bg-white/10 px-3 py-2 text-xs text-white" : "rounded-md border border-white/10 px-3 py-2 text-xs text-[#9AA4AF]"}>Desktop 1280</button><button type="button" onClick={() => setViewport("mobile")} aria-pressed={viewport === "mobile"} className={viewport === "mobile" ? "rounded-md bg-white/10 px-3 py-2 text-xs text-white" : "rounded-md border border-white/10 px-3 py-2 text-xs text-[#9AA4AF]"}>Mobile 390</button></div><label className="flex items-center gap-2 text-xs text-[#9AA4AF]">Build<select value={release} onChange={(event) => { setRelease(event.target.value as typeof release); setReviewed(false); }} className="rounded-md border border-white/10 bg-[#0d1014] px-2 py-2 text-white"><option value="banner">release 2.8.1 · aviso novo</option><option value="clip">release 2.8.1 · layout estreito</option><option value="contrast">release 2.8.1 · token atualizado</option><option value="limpa">release 2.8.0 · baseline</option></select></label></div><div className={`grid gap-3 ${viewport === "mobile" ? "max-w-xl grid-cols-1" : "md:grid-cols-2"}`}><CheckoutMock title="Baseline · 2.8.0" issue="limpa" viewport={viewport} /><CheckoutMock title={`Release · ${release === "limpa" ? "2.8.0" : "2.8.1"}`} issue={release} viewport={viewport} /></div><p className="mt-3 text-xs text-[#89939f]">Capturas simuladas com a mesma massa e viewport. Mude o build e compare os componentes.</p></Panel>
    <Panel title="Achados visuais"><p className="mb-3 text-xs leading-5 text-[#9AA4AF]">Marque o que mudou em relação ao baseline e confira sua leitura.</p><div className="space-y-2">{(Object.keys(visualIssueCopy) as VisualIssue[]).map((issue) => <label key={issue} className="flex cursor-pointer items-start gap-2 rounded-lg border border-white/10 p-3 text-xs leading-5 text-[#c5cdd5]"><input type="checkbox" checked={selected.includes(issue)} onChange={() => toggle(issue)} className="mt-0.5 accent-amber-300" />{visualIssueCopy[issue]}</label>)}</div><RunButton onClick={() => setReviewed(true)}>Conferir comparação</RunButton>{reviewed && <p role="status" className={`mt-3 rounded-lg p-3 text-xs leading-5 ${selectionMatches ? "bg-emerald-300/10 text-emerald-200" : "bg-amber-300/10 text-amber-100"}`}>{selectionMatches ? actual.length ? "Boa leitura: você identificou as mudanças desta build." : "Correto: esta build não apresenta diferenças plantadas." : `Há ${actual.length} diferença(s) plantada(s). Compare cabeçalho, resumo do pedido e ação principal.`}</p>}<button type="button" onClick={() => { setSelected([]); setReviewed(false); }} className="mt-3 inline-flex items-center gap-2 text-xs text-[#89939f] hover:text-white"><RotateCcw className="size-3.5" />Limpar marcações</button></Panel>
  </div>;
}

function CheckoutMock({ title, issue, viewport }: { title: string; issue: VisualIssue | "limpa"; viewport: "desktop" | "mobile" }) {
  const issues = [issue];
  return <div className={`relative overflow-hidden rounded-lg border border-white/10 bg-[#f7f8f6] p-3 text-[#202624] ${viewport === "mobile" ? "mx-auto w-full max-w-[350px]" : ""}`}><div className="flex items-center justify-between border-b border-[#dce1dd] pb-2 text-[10px] font-bold"><span>{title}</span><span className="text-[#628170]">checkout</span></div><h3 className="mt-3 text-sm font-black">Seu pedido</h3><div className="mt-3 flex items-center justify-between border-b border-[#e3e7e4] pb-2 text-[11px]"><span>Caderno A5 · 2 un.</span><span>R$ 89,90</span></div><div className="mt-2 flex justify-between text-[11px]"><span>Entrega</span><span>R$ 12,00</span></div>{issues.includes("banner") && <div className="absolute inset-x-2 bottom-4 z-10 rounded bg-amber-300 px-2 py-2 text-center text-[10px] font-bold text-[#493600]">Frete grátis para pedidos acima de R$ 100</div>}<div className="mt-3 flex justify-between font-bold"><span className="text-xs">Total</span><span className={`text-sm ${issues.includes("clip") && viewport === "mobile" ? "max-w-[2.7rem] overflow-hidden whitespace-nowrap" : ""}`}>R$ 101,90</span></div><label className={`mt-3 block text-[10px] ${issues.includes("contrast") ? "text-[#d8e2dc]" : "text-[#637169]"}`}>Cupom <span className="ml-1 underline">Adicionar código</span></label><button type="button" className="mt-3 w-full rounded bg-[#24784e] px-3 py-2 text-[11px] font-bold text-white">Finalizar pedido</button></div>;
}

function TraceBench({ starterTrace }: { starterTrace: string }) {
  const [trace, setTrace] = useState(starterTrace || "tr-7f31");
  const [service, setService] = useState("todos");
  const [level, setLevel] = useState("todos");
  const [search, setSearch] = useState("");
  const visible = useMemo(() => events.filter((event) => (!trace || event.trace.includes(trace)) && (service === "todos" || event.service === service) && (level === "todos" || event.level === level) && event.message.toLowerCase().includes(search.toLowerCase())), [trace, service, level, search]);
  const failures = visible.filter((event) => event.level === "ERROR").length;
  return <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
    <Panel title="Eventos correlacionados"><div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label className="text-xs text-[#89939f]">Trace ID<input value={trace} onChange={(event) => setTrace(event.target.value)} className="mt-1 block h-10 w-full rounded-md border border-white/10 bg-[#0d1014] px-3 font-mono text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint" /></label><label className="text-xs text-[#89939f]">Serviço<select value={service} onChange={(event) => setService(event.target.value)} className="mt-1 block h-10 w-full rounded-md border border-white/10 bg-[#0d1014] px-3 text-sm text-white"><option value="todos">Todos</option>{[...new Set(events.map((event) => event.service))].map((name) => <option key={name}>{name}</option>)}</select></label><label className="text-xs text-[#89939f]">Severidade<select value={level} onChange={(event) => setLevel(event.target.value)} className="mt-1 block h-10 w-full rounded-md border border-white/10 bg-[#0d1014] px-3 text-sm text-white"><option value="todos">Todas</option><option>INFO</option><option>WARN</option><option>ERROR</option></select></label><label className="text-xs text-[#89939f]">Texto<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="timeout, order…" className="mt-1 block h-10 w-full rounded-md border border-white/10 bg-[#0d1014] px-3 text-sm text-white placeholder:text-[#59636e]" /></label></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-left text-xs"><thead><tr>{["Horário", "Nível", "Serviço", "Trace", "Evento"].map((heading) => <th key={heading} className="border-b border-white/10 px-2 py-2 font-semibold text-[#89939f]">{heading}</th>)}</tr></thead><tbody>{visible.map((event, index) => <tr key={`${event.time}-${index}`} className="border-b border-white/[.06] last:border-0"><td className="px-2 py-2.5 font-mono text-[#9aa4af]">{event.time}</td><td className={`px-2 py-2.5 font-bold ${event.level === "ERROR" ? "text-rose-300" : event.level === "WARN" ? "text-amber-200" : "text-emerald-200"}`}>{event.level}</td><td className="px-2 py-2.5 text-[#dce3e8]">{event.service}</td><td className="px-2 py-2.5 font-mono text-sky-200">{event.trace}</td><td className="px-2 py-2.5 text-[#c1c9d1]">{event.message}</td></tr>)}</tbody></table>{!visible.length && <EmptyPrompt text="Nenhum evento combina com esses filtros." />}</div></Panel>
    <aside className="space-y-4"><Panel title="Resumo do filtro"><div className="grid grid-cols-2 gap-2"><Metric label="Eventos" value={String(visible.length)} /><Metric label="Erros" value={String(failures)} danger={failures > 0} /></div><p className="mt-4 text-xs leading-5 text-[#9AA4AF]">Cada filtro mostra apenas os eventos correspondentes. Limpe o Trace ID para comparar requisições; a fila de reconciliação aparece em tr-a211.</p></Panel><Panel title="Próxima investigação"><p className="text-xs leading-5 text-[#9AA4AF]">Use o Trace ID para ordenar a sequência. Limpe o campo para comparar requisições e verificar a fila em outro trace.</p><button type="button" onClick={() => { setTrace("tr-7f31"); setService("payments"); setLevel("todos"); setSearch(""); }} className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-mint"><Copy className="size-3.5" />Filtrar pagamentos do trace</button><button type="button" onClick={() => { setTrace(""); setService("todos"); setLevel("todos"); setSearch(""); }} className="mt-3 flex items-center gap-2 text-xs text-[#89939f] hover:text-white"><RotateCcw className="size-3.5" />Limpar filtros</button></Panel></aside>
  </div>;
}

function EmptyPrompt({ text }: { text: string }) { return <div className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 px-5 text-center"><Database className="size-5 text-[#64707c]" /><p className="mt-3 max-w-sm text-xs leading-5 text-[#89939f]">{text}</p></div>; }
function ToolError({ children }: { children: ReactNode }) { return <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-300/20 bg-rose-300/[.05] p-3 text-xs leading-5 text-rose-200"><CircleAlert className="mt-0.5 size-4 shrink-0" />{children}</div>; }





