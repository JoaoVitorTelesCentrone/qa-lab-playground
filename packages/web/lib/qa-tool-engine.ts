// Regras das bancadas de /lab/ferramentas. Tudo aqui é puro e determinístico:
// os componentes em components/qa-tools só cuidam de estado e tela, e os testes
// em qa-tool-engine.test.ts garantem que cada Lab encontra o sintoma prometido.

// ---------- SQL Explorer ----------

export type Order = { id: string; customer: string; status: string; total: number };
export type QueryRow = Partial<Order>;
export type QueryResult = { rows: QueryRow[]; error?: string };

export const orders: readonly Order[] = [
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

const ORDER_COLUMNS = ["id", "customer", "status", "total"] as const;
const QUERY_PATTERN = /^SELECT\s+(\*|[a-z_,\s]+)\s+FROM\s+orders(?:\s+WHERE\s+(status\s*=\s*'(?:paid|pending|refunded|cancelled)'|(?:id|customer)\s*=\s*'[^']{1,80}'|total\s*(?:<|>|=)\s*-?\d+(?:\.\d+)?))?(?:\s+ORDER\s+BY\s+(id|customer|status|total)\s+(ASC|DESC))?(?:\s+LIMIT\s+(\d+))?\s*;?$/i;

/** Executa um subconjunto seguro de SELECT sobre a massa `orders`. Nada além de leitura é aceito. */
export function runSafeQuery(query: string): QueryResult {
  const match = query.trim().match(QUERY_PATTERN);
  if (!match) return { rows: [], error: "Consulta não reconhecida. Use SELECT em orders, com filtro opcional por status ou total." };
  const [, selected, rawWhere, rawOrder, rawDirection, rawLimit] = match;
  const columns = selected === "*" ? [...ORDER_COLUMNS] : selected.split(",").map((column) => column.trim().toLowerCase());
  if (!columns.length || columns.some((column) => !(ORDER_COLUMNS as readonly string[]).includes(column))) return { rows: [], error: "Coluna desconhecida. Disponíveis: id, customer, status e total." };
  let result = [...orders];
  if (rawWhere) {
    const status = rawWhere.match(/^status\s*=\s*'([^']+)'$/i);
    const total = rawWhere.match(/^total\s*(<|>|=)\s*(-?\d+(?:\.\d+)?)$/i);
    const textFilter = rawWhere.match(/^(id|customer)\s*=\s*'([^']+)'$/i);
    if (status) result = result.filter((row) => row.status === status[1].toLowerCase());
    else if (textFilter) result = result.filter((row) => row[textFilter[1].toLowerCase() as "id" | "customer"] === textFilter[2]);
    else if (total) {
      const limit = Number(total[2]);
      result = result.filter((row) => total[1] === "<" ? row.total < limit : total[1] === ">" ? row.total > limit : row.total === limit);
    }
  }
  if (rawOrder) {
    const key = rawOrder.toLowerCase() as keyof Order;
    const direction = (rawDirection ?? "ASC").toUpperCase() === "DESC" ? -1 : 1;
    result.sort((a, b) => String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true }) * direction);
  }
  if (rawLimit) result = result.slice(0, Math.min(Number(rawLimit), 100));
  return { rows: result.map((row) => Object.fromEntries(columns.map((column) => [column, row[column as keyof Order]])) as QueryRow) };
}

// ---------- Contract Inspector ----------

export type ContractCheck = { path: string; expected: string; actual: string; ok: boolean };

const successContract = { data: "object", "data.id": "string", "data.total": "number", "data.items": "array" } as const;
export const validResponse = { status: 200, data: { id: "ord_1042", total: 189.9, items: [{ product: "Caderno A5", quantity: 2 }] } };
export const faultyResponse = { status: "200", data: { id: "ord_1042", total: "189.90", items: [{ product: "Caderno A5", quantity: 0 }] } };

function valueAtPath(input: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, part) => current && typeof current === "object" ? (current as Record<string, unknown>)[part] : undefined, input);
}

export function valueType(value: unknown) {
  return Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
}

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

/** Escolhe o contrato pelo status (200 = sucesso, 422 = erro) e valida presença, tipo e regra item a item. */
export function checkContract(input: unknown): ContractCheck[] {
  const root = isRecord(input) ? input : {};
  const status = root.status;
  // JSON.stringify mostra as aspas: "200" (texto) e 200 (número) precisam parecer diferentes.
  const checks: ContractCheck[] = [{ path: "status", expected: "número 200 ou 422", actual: status === undefined ? "ausente" : JSON.stringify(status), ok: status === 200 || status === 422 }];
  if (status === 422) {
    const error = isRecord(root.error) ? root.error : {};
    checks.push({ path: "error", expected: "object", actual: valueType(root.error), ok: valueType(root.error) === "object" });
    for (const key of ["code", "message"] as const) {
      const value = error[key];
      checks.push({ path: `error.${key}`, expected: "string não vazia", actual: value === undefined ? "ausente" : valueType(value), ok: typeof value === "string" && value.trim().length > 0 });
    }
    checks.push({ path: "data", expected: "ausente", actual: valueType(root.data), ok: root.data === undefined });
    return checks;
  }
  // "200" em texto reprova o status, mas o corpo ainda é de sucesso: segue validando,
  // senão o aluno não vê os outros tipos quebrados na mesma resposta (Lab 411).
  if (status !== 200 && status !== "200") return checks;
  for (const [path, expected] of Object.entries(successContract)) {
    const value = valueAtPath(input, path);
    checks.push({ path, expected, actual: value === undefined ? "ausente" : valueType(value), ok: valueType(value) === expected });
  }
  const items = valueAtPath(input, "data.items");
  if (Array.isArray(items)) {
    items.forEach((item, index) => {
      const entry = isRecord(item) ? item : {};
      const { product, quantity } = entry;
      checks.push({ path: `data.items[${index}].product`, expected: "string não vazia", actual: product === undefined ? "ausente" : valueType(product), ok: typeof product === "string" && product.trim().length > 0 });
      checks.push({ path: `data.items[${index}].quantity`, expected: "inteiro positivo", actual: String(quantity ?? "ausente"), ok: typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0 });
    });
  }
  return checks;
}

/** Resposta inicial de cada Lab do Contract Inspector, pelo `starter` do Lab. */
export function responseForStarter(starter: string): unknown {
  const response = structuredClone(validResponse) as { status: number; data: Record<string, unknown> & { items: { product: string; quantity: number }[] } };
  if (starter === "id-ausente") delete response.data.id;
  if (starter === "quantidade-zero") response.data.items[0].quantity = 0;
  if (starter === "lista-vazia") response.data.items = [];
  if (starter === "segundo-item") response.data.items.push({ product: "Caneta azul", quantity: 0 });
  if (starter === "id-nulo") response.data.id = null;
  if (starter === "total-texto") response.data.total = "189.90";
  if (starter === "quantidade-negativa") response.data.items[0].quantity = -1;
  if (starter === "erro-422") return { status: 422, error: { code: "PAYMENT_REVIEW", message: "Pagamento em análise" } };
  if (starter === "tipos") return structuredClone(faultyResponse);
  return response;
}

// ---------- HTTP Request Runner ----------

export type HttpMethod = "GET" | "POST" | "PATCH";
export type HttpResponse = { status: number; headers: Record<string, string>; body: unknown; note: string };
export type CreatedOrder = { id: string; status: "pending"; product: string; quantity: number };
export type HttpSession = { createdByKey: Map<string, string>; createdOrders: CreatedOrder[]; nextId: number; requestNumber: number };

export const createHttpSession = (): HttpSession => ({ createdByKey: new Map(), createdOrders: [], nextId: 2001, requestNumber: 1 });

/** Simula a API de pedidos. Altera `session` quando um pedido é criado, como uma API real faria. */
export function sendHttp(session: HttpSession, method: HttpMethod, path: string, token: string, bodyText: string, key: string): HttpResponse {
  const requestNumber = session.requestNumber++;
  const response = (status: number, body: unknown, note: string): HttpResponse => ({ status, body, note, headers: { "content-type": "application/json", "x-request-id": `req-${requestNumber}` } });
  if (token !== "qa-token") return response(401, { error: "UNAUTHORIZED" }, "A credencial é obrigatória para todos os endpoints.");
  const created = session.createdOrders.find((order) => path === `/orders/${order.id}`);
  if (method === "GET" && path === "/orders") return response(200, { items: [{ id: "ord_1042", status: "pending" }, { id: "ord_1043", status: "paid" }, ...session.createdOrders], total: 2 + session.createdOrders.length }, "Lista de pedidos da sessão de treino.");
  if (method === "GET" && path === "/orders/ord_1042") return response(200, { id: "ord_1042", status: "pending", total: 189.9 }, "Pedido encontrado.");
  if (method === "GET" && path === "/orders/ord_1043") return response(200, { id: "ord_1043", status: "paid", total: 74.5 }, "Pedido encontrado.");
  if (method === "GET" && created) return response(200, created, "Pedido criado nesta sessão.");
  if (method === "GET" && path.startsWith("/orders/")) return response(404, { error: "ORDER_NOT_FOUND" }, "O recurso não existe nesta massa.");
  if (method === "POST" && path === "/orders") {
    let parsed: unknown;
    try { parsed = JSON.parse(bodyText); } catch { return response(400, { error: "INVALID_JSON" }, "O corpo precisa ser JSON válido."); }
    const order = isRecord(parsed) ? parsed : {};
    if (typeof order.product !== "string" || !order.product.trim() || !Number.isInteger(order.quantity) || Number(order.quantity) <= 0) return response(422, { error: "INVALID_ORDER", fields: ["product", "quantity"] }, "Produto e quantidade inteira positiva são obrigatórios.");
    if (key && session.createdByKey.has(key)) return response(200, { id: session.createdByKey.get(key), replay: true }, "A chave repetida devolve a criação anterior.");
    const createdOrder: CreatedOrder = { id: `ord_${session.nextId++}`, status: "pending", product: order.product, quantity: Number(order.quantity) };
    session.createdOrders.push(createdOrder);
    if (key) session.createdByKey.set(key, createdOrder.id);
    return response(201, createdOrder, "Pedido criado somente nesta sessão de treino.");
  }
  if (method === "PATCH" && path === "/orders/ord_1042") return response(409, { error: "INVALID_TRANSITION" }, "Este pedido pendente não pode ser marcado como entregue diretamente.");
  return response(405, { error: "METHOD_NOT_ALLOWED" }, "Método e rota não formam uma operação disponível.");
}

// ---------- Load Profile Bench ----------

export type LoadProfile = "normal" | "degraded" | "spike";
export type LoadResult = { users: number; seconds: number; profile: LoadProfile; requests: number; rps: number; p50: number; p95: number; errors: number };
export const LOAD_GOALS = { p95Ms: 300, errorPercent: 1 } as const;

export function simulateLoad(profile: LoadProfile, users: number, seconds: number): LoadResult {
  const vu = Math.max(1, Math.min(300, Math.floor(users) || 1));
  const duration = Math.max(5, Math.min(300, Math.floor(seconds) || 5));
  const pressure = Math.max(0, vu - (profile === "normal" ? 70 : 35));
  const rps = Math.round(Math.min(vu * 1.8, profile === "normal" ? 125 : 65));
  return {
    users: vu, seconds: duration, profile, requests: rps * duration, rps,
    p50: Math.round(70 + vu * 0.7 + pressure * 1.8),
    p95: Math.round(120 + vu * 1.3 + pressure * (profile === "spike" ? 5 : 3.2)),
    errors: Math.min(35, Number((pressure * (profile === "normal" ? 0.06 : 0.28)).toFixed(1))),
  };
}

export const meetsLoadGoals = (result: LoadResult) => result.p95 <= LOAD_GOALS.p95Ms && result.errors < LOAD_GOALS.errorPercent;

// ---------- Security Probe ----------

export type SecurityCase = "normal" | "injection" | "xss" | "idor" | "rate";
export type ProbeResult = { status: number; outcome: string; evidence: string };
export const RATE_LIMIT_PER_WINDOW = 5;

export function probeSecurity(scenario: SecurityCase, input: string, actor: string, attempts: number): ProbeResult {
  if (scenario === "rate") {
    if (attempts < 1) return { status: 400, outcome: "Contagem inválida", evidence: "Informe ao menos uma tentativa." };
    if (attempts > RATE_LIMIT_PER_WINDOW) return { status: 429, outcome: "Bloqueado por limite de taxa", evidence: "retry-after: 60; contador por usuário e janela" };
    return { status: 200, outcome: "Dentro do limite", evidence: `${attempts} tentativa(s) na janela` };
  }
  if (scenario === "idor") {
    if (input !== "ord_1042") return { status: 404, outcome: "Pedido ausente", evidence: `resource=${input}` };
    if (actor === "user_108") return { status: 200, outcome: "Acesso ao próprio pedido", evidence: "owner=user_108" };
    return { status: 403, outcome: "Acesso de outro usuário bloqueado", evidence: `actor=${actor}; owner=user_108` };
  }
  if (scenario === "injection") {
    return /[;'-]|\bOR\b/i.test(input)
      ? { status: 400, outcome: "Entrada rejeitada", evidence: "Busca usa parâmetro validado; nenhum comando é executado" }
      : { status: 200, outcome: "Busca aceita", evidence: `termo=${input}` };
  }
  if (scenario === "xss") return { status: 200, outcome: "Conteúdo exibido como texto", evidence: input.replaceAll("<", "&lt;").replaceAll(">", "&gt;") };
  return { status: 200, outcome: "Requisição normal aceita", evidence: "Controle de base para comparação" };
}

// ---------- Test Data Factory ----------

export type DataMode = "valid" | "boundary" | "invalid-email" | "duplicate" | "missing";
export type DataRecord = { id: string; email: string; age: number | null };

export function generateRecords(mode: DataMode, seed: number, count: number): DataRecord[] {
  const size = Math.max(2, Math.min(12, Math.floor(count) || 2));
  const base = Math.abs(Math.floor(seed) || 0);
  return Array.from({ length: size }, (_, index) => ({
    id: `qa-${base}-${index + 1}`,
    email: mode === "missing" && index === 0 ? ""
      : mode === "invalid-email" && index === 1 ? "sem-arroba.exemplo"
      : mode === "duplicate" && index === 1 ? `qa${base}-1@example.test`
      : `qa${base}-${index + 1}@example.test`,
    age: mode === "missing" && index === 0 ? null : mode === "boundary" ? [17, 18, 120, 121][index % 4] : 18 + ((base + index * 7) % 60),
  }));
}

/** Regras do cadastro: e-mail presente, com formato válido e único; idade de 18 a 120 (inclusive). */
export function validateRecords(rows: DataRecord[]): string[] {
  return rows.flatMap((row, index) => [
    !row.email ? `${row.id}: e-mail ausente` : !/^\S+@\S+\.\S+$/.test(row.email) ? `${row.id}: e-mail inválido` : "",
    row.age === null ? `${row.id}: idade ausente` : row.age < 18 || row.age > 120 ? `${row.id}: idade fora de 18–120` : "",
    row.email && rows.findIndex((other) => other.email === row.email) < index ? `${row.id}: e-mail duplicado` : "",
  ].filter(Boolean));
}

// ---------- State Machine Explorer ----------

export type OrderState = "created" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
export type OrderAction = "pay" | "ship" | "deliver" | "cancel" | "refund";

export const transitions: Record<OrderState, Partial<Record<OrderAction, OrderState>>> = {
  created: { pay: "paid", cancel: "cancelled" },
  paid: { ship: "shipped", refund: "refunded" },
  shipped: { deliver: "delivered" },
  delivered: {},
  cancelled: {},
  refunded: {},
};

/** Próximo estado, ou `null` quando a transição não é permitida (o pedido não muda). */
export const nextState = (state: OrderState, action: OrderAction): OrderState | null => transitions[state][action] ?? null;
