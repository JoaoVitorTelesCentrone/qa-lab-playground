"use client";

import { useRef, useState, type ReactNode } from "react";
import type { QaToolId } from "@/lib/qa-tools";

const inputClass = "min-h-10 w-full rounded-md border border-white/15 bg-[#0d1014] px-3 py-2 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint";
const buttonClass = "min-h-10 rounded-md bg-mint px-4 py-2 text-sm font-bold text-[#101319] hover:bg-mint/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint";
function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-xl border border-white/10 bg-[#15191f] p-5"><h2 className="mb-4 text-base font-bold text-white">{title}</h2>{children}</section>; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block text-xs font-semibold text-[#aab4be]">{label}<div className="mt-1">{children}</div></label>; }
function Result({ children, bad = false }: { children: ReactNode; bad?: boolean }) { return <div role="status" className={`mt-4 rounded-lg border p-4 text-sm leading-6 ${bad ? "border-rose-300/25 bg-rose-300/[.06] text-rose-100" : "border-emerald-300/25 bg-emerald-300/[.06] text-emerald-100"}`}>{children}</div>; }

export function AdvancedWorkbench({ toolId, starter }: { toolId: QaToolId; starter: string }) {
  if (toolId === "http") return <HttpBench starter={starter} />;
  if (toolId === "carga") return <LoadBench starter={starter} />;
  if (toolId === "acessibilidade") return <AccessibilityBench starter={starter} />;
  if (toolId === "seguranca") return <SecurityBench starter={starter} />;
  if (toolId === "massa") return <DataBench starter={starter} />;
  if (toolId === "estados") return <StateBench starter={starter} />;
  return null;
}

type HttpMethod = "GET" | "POST" | "PATCH";
type HttpResponse = { status: number; headers: Record<string, string>; body: unknown; note: string };
type CreatedOrder = { id: string; status: "pending"; product: string; quantity: number };
function simulateHttp(method: HttpMethod, path: string, token: string, bodyText: string, key: string, createdByKey: Map<string, string>, createdOrders: CreatedOrder[], nextId: number, requestNumber: number): HttpResponse {
  const response = (status: number, body: unknown, note: string): HttpResponse => ({ status, body, note, headers: { "content-type": "application/json", "x-request-id": `req-${requestNumber}` } });
  if (token !== "qa-token") return response(401, { error: "UNAUTHORIZED" }, "A credencial é obrigatória para todos os endpoints.");
  if (method === "GET" && path === "/orders") return response(200, { items: [{ id: "ord_1042", status: "pending" }, { id: "ord_1043", status: "paid" }, ...createdOrders], total: 2 + createdOrders.length }, "Lista de pedidos da sessão de treino.");
  if (method === "GET" && path === "/orders/ord_1042") return response(200, { id: "ord_1042", status: "pending", total: 189.9 }, "Pedido encontrado.");
  if (method === "GET" && path === "/orders/ord_1043") return response(200, { id: "ord_1043", status: "paid", total: 74.5 }, "Pedido encontrado.");
  if (method === "GET" && createdOrders.some((order) => path === `/orders/${order.id}`)) return response(200, createdOrders.find((order) => path === `/orders/${order.id}`), "Pedido criado nesta sessão.");
  if (method === "GET" && path.startsWith("/orders/")) return response(404, { error: "ORDER_NOT_FOUND" }, "O recurso não existe nesta massa.");
  if (method === "POST" && path === "/orders") {
    let parsed: unknown;
    try { parsed = JSON.parse(bodyText); } catch { return response(400, { error: "INVALID_JSON" }, "O corpo precisa ser JSON válido."); }
    const order = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
    if (typeof order.product !== "string" || !order.product.trim() || !Number.isInteger(order.quantity) || Number(order.quantity) <= 0) return response(422, { error: "INVALID_ORDER", fields: ["product", "quantity"] }, "Produto e quantidade inteira positiva são obrigatórios.");
    if (key && createdByKey.has(key)) return response(200, { id: createdByKey.get(key), replay: true }, "A chave repetida devolve a criação anterior.");
    return response(201, { id: `ord_${nextId}`, status: "pending", product: order.product, quantity: order.quantity }, "Pedido criado somente nesta sessão de treino.");
  }
  if (method === "PATCH" && path === "/orders/ord_1042") return response(409, { error: "INVALID_TRANSITION" }, "Este pedido pendente não pode ser marcado como entregue diretamente.");
  return response(405, { error: "METHOD_NOT_ALLOWED" }, "Método e rota não formam uma operação disponível.");
}
function HttpBench({ starter }: { starter: string }) {
  const presets: Record<string, [HttpMethod, string, string, string, string]> = {
    list: ["GET", "/orders", "qa-token", "", ""], unauthorized: ["GET", "/orders", "", "", ""], missing: ["GET", "/orders/ord_9999", "qa-token", "", ""], invalid: ["POST", "/orders", "qa-token", '{"product":"Caderno","quantity":0}', ""], create: ["POST", "/orders", "qa-token", '{"product":"Caderno","quantity":2}', "new-key"], replay: ["POST", "/orders", "qa-token", '{"product":"Caderno","quantity":2}', "used-key"], conflict: ["PATCH", "/orders/ord_1042", "qa-token", '{"status":"delivered"}', ""],
  };
  const initial = presets[starter] ?? presets.list;
  const [method, setMethod] = useState<HttpMethod>(initial[0]);
  const [path, setPath] = useState(initial[1]);
  const [token, setToken] = useState(initial[2]);
  const [body, setBody] = useState(initial[3]);
  const [key, setKey] = useState(initial[4]);
  const [result, setResult] = useState<HttpResponse | null>(null);
  const createdByKey = useRef(new Map<string, string>());
  const createdOrders = useRef<CreatedOrder[]>([]);
  const nextId = useRef(2001);
  const requestNumber = useRef(1);
  function send() {
    const response = simulateHttp(method, path.trim(), token.trim(), body, key.trim(), createdByKey.current, createdOrders.current, nextId.current, requestNumber.current++);
    if (response.status === 201) {
      const created = response.body as CreatedOrder;
      createdOrders.current.push(created);
      if (key.trim()) createdByKey.current.set(key.trim(), created.id);
      nextId.current += 1;
    }
    setResult(response);
  }
  return <div className="grid gap-4 lg:grid-cols-2"><Panel title="Montar requisição"><div className="grid grid-cols-[7rem_1fr] gap-3"><Field label="Método"><select className={inputClass} value={method} onChange={(event) => setMethod(event.target.value as HttpMethod)}><option>GET</option><option>POST</option><option>PATCH</option></select></Field><Field label="Rota"><input className={inputClass} value={path} onChange={(event) => setPath(event.target.value)} /></Field></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Bearer token"><input className={inputClass} value={token} onChange={(event) => setToken(event.target.value)} placeholder="qa-token" /></Field><Field label="Idempotency-Key"><input className={inputClass} value={key} onChange={(event) => setKey(event.target.value)} placeholder="Opcional" /></Field></div><div className="mt-3"><Field label="Corpo JSON"><textarea className={`${inputClass} min-h-28 font-mono`} value={body} onChange={(event) => setBody(event.target.value)} /></Field></div><button className={`${buttonClass} mt-4`} type="button" onClick={send}>Enviar requisição</button><p className="mt-3 text-xs text-[#89939f]">API local simulada: GET /orders, GET /orders/:id, POST /orders e PATCH /orders/ord_1042.</p></Panel><Panel title="Resposta HTTP">{result ? <><div className={`text-2xl font-black ${result.status >= 400 ? "text-rose-300" : "text-emerald-300"}`}>{result.status}</div><pre className="mt-3 overflow-x-auto rounded-lg bg-[#0d1014] p-3 text-xs text-[#b7c5ce]">{Object.entries(result.headers).map(([name, value]) => `${name}: ${value}`).join("\n")}</pre><pre className="mt-3 overflow-x-auto rounded-lg bg-[#0d1014] p-3 text-xs text-[#e2e8ee]">{JSON.stringify(result.body, null, 2)}</pre><Result bad={result.status >= 400}>{result.note}</Result></> : <p className="text-sm text-[#89939f]">Envie uma requisição para observar status, cabeçalhos e corpo.</p>}</Panel></div>;
}

type LoadProfile = "normal" | "degraded" | "spike";
function LoadBench({ starter }: { starter: string }) {
  const [profile, setProfile] = useState<LoadProfile>(starter === "degraded" || starter === "spike" ? starter : "normal");
  const [users, setUsers] = useState(starter === "spike" ? 120 : starter === "degraded" ? 60 : 20);
  const [seconds, setSeconds] = useState(30);
  const [result, setResult] = useState<{ users: number; seconds: number; profile: LoadProfile; requests: number; rps: number; p50: number; p95: number; errors: number } | null>(null);
  function run() {
    const vu = Math.max(1, Math.min(300, Math.floor(users) || 1));
    const duration = Math.max(5, Math.min(300, Math.floor(seconds) || 5));
    const pressure = Math.max(0, vu - (profile === "normal" ? 70 : 35));
    const rps = Math.round(Math.min(vu * 1.8, profile === "normal" ? 125 : 65));
    setResult({ users: vu, seconds: duration, profile, requests: rps * duration, rps, p50: Math.round(70 + vu * 0.7 + pressure * 1.8), p95: Math.round(120 + vu * 1.3 + pressure * (profile === "spike" ? 5 : 3.2)), errors: Math.min(35, Number((pressure * (profile === "normal" ? 0.06 : 0.28)).toFixed(1))) });
  }
  return <div className="grid gap-4 lg:grid-cols-2"><Panel title="Perfil de carga"><div className="grid gap-3"><Field label="Cenário"><select className={inputClass} value={profile} onChange={(event) => setProfile(event.target.value as LoadProfile)}><option value="normal">Capacidade normal</option><option value="degraded">Dependência degradada</option><option value="spike">Pico repentino</option></select></Field><Field label="Usuários virtuais (1–300)"><input className={inputClass} type="number" min="1" max="300" value={users} onChange={(event) => setUsers(Number(event.target.value))} /></Field><Field label="Duração em segundos (5–300)"><input className={inputClass} type="number" min="5" max="300" value={seconds} onChange={(event) => setSeconds(Number(event.target.value))} /></Field></div><button className={`${buttonClass} mt-4`} type="button" onClick={run}>Simular carga</button><p className="mt-3 text-xs text-[#89939f]">Modelo determinístico local. Metas: p95 até 300 ms e erros abaixo de 1%.</p></Panel><Panel title="Métricas da execução">{result ? <><p className="mb-3 text-xs text-[#89939f]">{result.profile} · {result.users} usuários · {result.seconds}s</p><dl className="grid grid-cols-2 gap-3">{([ ["Requisições", result.requests], ["Vazão (req/s)", result.rps], ["p50 (ms)", result.p50], ["p95 (ms)", result.p95], ["Erros (%)", result.errors] ] as const).map(([label, value]) => <div key={label} className="rounded-lg border border-white/10 p-3"><dt className="text-xs text-[#89939f]">{label}</dt><dd className="mt-1 text-xl font-bold text-white">{value}</dd></div>)}</dl><Result bad={result.p95 > 300 || result.errors >= 1}>{result.p95 <= 300 && result.errors < 1 ? "Metas atendidas neste perfil." : `Meta violada: ${result.p95 > 300 ? "p95 acima de 300 ms" : "erros de 1% ou mais"}. Compare com outra carga antes de atribuir causa.`}</Result></> : <p className="text-sm text-[#89939f]">Execute o perfil para comparar latência, vazão e taxa de erro.</p>}</Panel></div>;
}

type A11yIssue = "clean" | "label" | "focus" | "contrast" | "feedback";
const a11yNames: Record<A11yIssue, string> = { clean: "Sem defeito plantado", label: "Campo sem rótulo", focus: "Foco invisível", contrast: "Texto com baixo contraste", feedback: "Erro sem anúncio" };
function AccessibilityBench({ starter }: { starter: string }) {
  const [issue, setIssue] = useState<A11yIssue>((Object.keys(a11yNames).includes(starter) ? starter : "label") as A11yIssue);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focusStep, setFocusStep] = useState(-1);
  const [audited, setAudited] = useState(false);
  function advanceFocus() {
    const next = (focusStep + 1) % 3;
    setFocusStep(next);
    document.getElementById(["a11y-email", "a11y-continue", "a11y-inspect"][next])?.focus();
  }
  const checks = [{ name: "Rótulo associado ao campo", ok: issue !== "label" }, { name: "Foco visível no botão", ok: issue !== "focus" }, { name: "Texto de ajuda legível", ok: issue !== "contrast" }, { name: "Erro anunciado para tecnologia assistiva", ok: issue !== "feedback" }];
  return <div className="grid gap-4 lg:grid-cols-2"><Panel title="Formulário de treino"><Field label="Variante"><select className={inputClass} value={issue} onChange={(event) => { setIssue(event.target.value as A11yIssue); setAudited(false); setSubmitted(false); }}>{Object.entries(a11yNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></Field><div className="mt-5 rounded-lg bg-[#f8f9f7] p-5 text-[#26302a]">{issue === "label" ? <span className="text-sm font-semibold">E-mail</span> : <label htmlFor="a11y-email" className="text-sm font-semibold">E-mail</label>}<input id="a11y-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 block w-full rounded border border-[#aeb9b0] p-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#24784e]" /><p className={`mt-2 text-xs ${issue === "contrast" ? "text-[#d7dfd9]" : "text-[#52665a]"}`}>Usaremos este endereço para enviar o recibo.</p><button id="a11y-continue" type="button" onClick={() => setSubmitted(true)} className={`mt-4 rounded bg-[#24784e] px-4 py-2 text-sm font-bold text-white ${issue === "focus" ? "focus:outline-none" : "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123e28]"}`}>Continuar</button>{submitted && !email.includes("@") && <p role={issue === "feedback" ? undefined : "alert"} className="mt-2 text-xs text-red-700">Informe um e-mail válido.</p>}</div><div className="mt-4 flex flex-wrap gap-2"><button id="a11y-inspect" type="button" className={buttonClass} onClick={() => setAudited(true)}>Inspecionar</button><button type="button" className="rounded-md border border-white/15 px-3 text-xs text-white" onClick={advanceFocus}>Simular Tab</button></div><p className="mt-2 text-xs text-[#89939f]">Foco simulado: {focusStep < 0 ? "nenhum" : (["campo de e-mail", "botão Continuar", "botão Inspecionar"] as const)[focusStep]}</p></Panel><Panel title="Checagens de acessibilidade">{audited ? <><ul className="space-y-2">{checks.map((check) => <li key={check.name} className={`rounded-lg border p-3 text-sm ${check.ok ? "border-emerald-300/20 text-emerald-200" : "border-rose-300/20 text-rose-200"}`}>{check.ok ? "✓" : "×"} {check.name}</li>)}</ul><Result bad={checks.some((check) => !check.ok)}>{checks.filter((check) => !check.ok).length} falha(s) detectada(s). Confirme o efeito na tarefa e registre evidência.</Result></> : <p className="text-sm text-[#89939f]">Interaja com o formulário e execute a inspeção.</p>}</Panel></div>;
}

type SecurityCase = "normal" | "injection" | "xss" | "idor" | "rate";
function SecurityBench({ starter }: { starter: string }) {
  const [scenario, setScenario] = useState<SecurityCase>((["normal", "injection", "xss", "idor", "rate"].includes(starter) ? starter : "normal") as SecurityCase);
  const [input, setInput] = useState(starter === "xss" ? "<script>alert(1)</script>" : starter === "injection" ? "' OR 1=1 --" : "ord_1042");
  const [actor, setActor] = useState("user_108");
  const [attempts, setAttempts] = useState(starter === "rate" ? 8 : 1);
  const [result, setResult] = useState<{ status: number; outcome: string; evidence: string } | null>(null);
  function probe() {
    if (scenario === "rate") return setResult(attempts < 1 ? { status: 400, outcome: "Contagem inválida", evidence: "Informe ao menos uma tentativa." } : attempts > 5 ? { status: 429, outcome: "Bloqueado por limite de taxa", evidence: "retry-after: 60; contador por usuário e janela" } : { status: 200, outcome: "Dentro do limite", evidence: `${attempts} tentativa(s) na janela` });
    if (scenario === "idor") return setResult(input !== "ord_1042" ? { status: 404, outcome: "Pedido ausente", evidence: `resource=${input}` } : actor === "user_108" ? { status: 200, outcome: "Acesso ao próprio pedido", evidence: "owner=user_108" } : { status: 403, outcome: "Acesso de outro usuário bloqueado", evidence: `actor=${actor}; owner=user_108` });
    if (scenario === "injection") return setResult(/[;'\-]|\bOR\b/i.test(input) ? { status: 400, outcome: "Entrada rejeitada", evidence: "Busca usa parâmetro validado; nenhum comando é executado" } : { status: 200, outcome: "Busca aceita", evidence: `termo=${input}` });
    if (scenario === "xss") return setResult({ status: 200, outcome: "Conteúdo exibido como texto", evidence: input.replaceAll("<", "&lt;").replaceAll(">", "&gt;") });
    setResult({ status: 200, outcome: "Requisição normal aceita", evidence: "Controle de base para comparação" });
  }
  return <div className="grid gap-4 lg:grid-cols-2"><Panel title="Sonda de segurança"><Field label="Cenário"><select className={inputClass} value={scenario} onChange={(event) => { setScenario(event.target.value as SecurityCase); setResult(null); }}><option value="normal">Controle válido</option><option value="injection">Entrada de busca</option><option value="xss">Texto exibido na página</option><option value="idor">Acesso a pedido</option><option value="rate">Limite de tentativas</option></select></Field><div className="mt-3"><Field label="Entrada / recurso"><input className={inputClass} value={input} onChange={(event) => setInput(event.target.value)} /></Field></div><div className="mt-3 grid grid-cols-2 gap-3"><Field label="Usuário"><select className={inputClass} value={actor} onChange={(event) => setActor(event.target.value)}><option value="user_108">user_108 (dono)</option><option value="user_221">user_221 (outro)</option></select></Field><Field label="Tentativas na janela"><input type="number" min="1" max="20" className={inputClass} value={attempts} onChange={(event) => setAttempts(Number(event.target.value))} /></Field></div><button type="button" className={`${buttonClass} mt-4`} onClick={probe}>Executar sonda</button><p className="mt-3 text-xs text-[#89939f]">Cenários locais sintéticos. Nenhuma entrada é enviada para uma API.</p></Panel><Panel title="Resposta defensiva">{result ? <><p className="text-2xl font-black text-white">HTTP {result.status}</p><Result bad={result.status >= 400}><strong>{result.outcome}</strong><br /><code className="break-all text-xs">{result.evidence}</code></Result></> : <p className="text-sm text-[#89939f]">Varie entrada, usuário e tentativas; compare a resposta observada.</p>}</Panel></div>;
}

type DataMode = "valid" | "boundary" | "invalid-email" | "duplicate" | "missing";
type DataRecord = { id: string; email: string; age: number | null };
function DataBench({ starter }: { starter: string }) {
  const [mode, setMode] = useState<DataMode>((["valid", "boundary", "invalid-email", "duplicate", "missing"].includes(starter) ? starter : "valid") as DataMode);
  const [seed, setSeed] = useState(42);
  const [count, setCount] = useState(4);
  const [rows, setRows] = useState<DataRecord[] | null>(null);
  function generate() {
    const size = Math.max(2, Math.min(12, Math.floor(count) || 2));
    const base = Math.abs(Math.floor(seed) || 0);
    setRows(Array.from({ length: size }, (_, index) => ({ id: `qa-${base}-${index + 1}`, email: mode === "missing" && index === 0 ? "" : mode === "invalid-email" && index === 1 ? "sem-arroba.exemplo" : mode === "duplicate" && index === 1 ? `qa${base}-1@example.test` : `qa${base}-${index + 1}@example.test`, age: mode === "missing" && index === 0 ? null : mode === "boundary" ? [17, 18, 120, 121][index % 4] : 18 + ((base + index * 7) % 60) })));
  }
  const issues = rows?.flatMap((row, index) => [!row.email ? `${row.id}: e-mail ausente` : !/^\S+@\S+\.\S+$/.test(row.email) ? `${row.id}: e-mail inválido` : "", row.age === null || row.age < 18 || row.age > 120 ? `${row.id}: idade fora de 18–120` : "", rows.findIndex((other) => other.email === row.email) < index ? `${row.id}: e-mail duplicado` : ""].filter(Boolean)) ?? [];
  return <div className="grid gap-4 lg:grid-cols-2"><Panel title="Gerador reproduzível"><div className="grid gap-3"><Field label="Tipo de massa"><select className={inputClass} value={mode} onChange={(event) => setMode(event.target.value as DataMode)}><option value="valid">Válida</option><option value="boundary">Limites de idade</option><option value="invalid-email">E-mail inválido</option><option value="duplicate">E-mail duplicado</option><option value="missing">Campo ausente</option></select></Field><Field label="Seed"><input className={inputClass} type="number" value={seed} onChange={(event) => setSeed(Number(event.target.value))} /></Field><Field label="Registros (2–12)"><input className={inputClass} type="number" min="2" max="12" value={count} onChange={(event) => setCount(Number(event.target.value))} /></Field></div><button className={`${buttonClass} mt-4`} type="button" onClick={generate}>Gerar massa</button><p className="mt-3 text-xs text-[#89939f]">Mesmo seed, modo e quantidade produzem os mesmos registros.</p></Panel><Panel title="Registros e validação">{rows ? <><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr>{["ID", "E-mail", "Idade"].map((label) => <th key={label} className="border-b border-white/15 p-2 text-[#89939f]">{label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td className="border-b border-white/5 p-2 font-mono">{row.id}</td><td className="border-b border-white/5 p-2 font-mono">{row.email || "—"}</td><td className="border-b border-white/5 p-2">{row.age ?? "—"}</td></tr>)}</tbody></table></div><Result bad={issues.length > 0}>{issues.length ? <ul>{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul> : "Todos os registros atendem às regras de e-mail único e idade de 18 a 120 anos."}</Result></> : <p className="text-sm text-[#89939f]">Gere registros para inspecionar casos válidos, limites e falhas.</p>}</Panel></div>;
}

type OrderState = "created" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
type OrderAction = "pay" | "ship" | "deliver" | "cancel" | "refund" | "retry";
const transitions: Record<OrderState, Partial<Record<OrderAction, OrderState>>> = { created: { pay: "paid", cancel: "cancelled" }, paid: { ship: "shipped", refund: "refunded" }, shipped: { deliver: "delivered" }, delivered: {}, cancelled: {}, refunded: {} };
const actionNames: Record<OrderAction, string> = { pay: "Pagar", ship: "Despachar", deliver: "Entregar", cancel: "Cancelar", refund: "Reembolsar", retry: "Repetir última ação" };
function StateBench({ starter }: { starter: string }) {
  const initial: OrderState = (["created", "paid", "shipped", "delivered", "cancelled", "refunded"].includes(starter) ? starter : "created") as OrderState;
  const [state, setState] = useState<OrderState>(initial);
  const [history, setHistory] = useState<string[]>([`Início: ${initial}`]);
  const [last, setLast] = useState<OrderAction | null>(null);
  const [message, setMessage] = useState("");
  function apply(action: OrderAction) {
    const effective = action === "retry" ? last : action;
    if (!effective) return setMessage("Nenhuma ação anterior para repetir.");
    const next = transitions[state][effective];
    if (!next) { setMessage(`Transição rejeitada: ${state} → ${effective}. O estado permaneceu ${state}.`); setHistory((items) => [...items, `Rejeitada: ${effective} em ${state}`]); return; }
    setState(next); setLast(effective); setMessage(`Transição aceita: ${state} → ${next}.`); setHistory((items) => [...items, `${state} → ${next} (${effective})`]);
  }
  return <div className="grid gap-4 lg:grid-cols-2"><Panel title="Máquina de estados"><p className="text-xs text-[#89939f]">Estado atual</p><p className="mt-1 text-3xl font-black text-mint">{state}</p><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">{(Object.keys(actionNames) as OrderAction[]).map((action) => <button key={action} type="button" onClick={() => apply(action)} className="min-h-10 rounded-md border border-white/15 px-3 text-xs font-semibold text-white hover:border-mint/50">{actionNames[action]}</button>)}</div><button type="button" className="mt-4 text-xs text-[#9aa4af] underline" onClick={() => { setState(initial); setHistory([`Início: ${initial}`]); setLast(null); setMessage(""); }}>Reiniciar cenário</button>{message && <Result bad={message.includes("rejeitada")}>{message}</Result>}</Panel><Panel title="Histórico e regras"><ol className="space-y-2 text-sm text-[#c7d0d8]">{history.map((event, index) => <li key={`${index}-${event}`} className="rounded border border-white/10 px-3 py-2"><span className="mr-2 font-mono text-[#81909c]">{index + 1}.</span>{event}</li>)}</ol><p className="mt-4 text-xs leading-5 text-[#89939f]">Fluxo permitido: created → paid → shipped → delivered. Cancelamento só antes do pagamento; reembolso só após pagamento e antes do envio.</p></Panel></div>;
}


