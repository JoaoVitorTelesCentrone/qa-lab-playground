import { NextResponse } from "next/server";
import { orders, products, users } from "./data";

type Params = { segments?: string[] };
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, X-QA-Lab-Scenario", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS" };

function scenario(request: Request) { const url = new URL(request.url); return request.headers.get("x-qa-lab-scenario") ?? url.searchParams.get("scenario") ?? "normal"; }
function json(body: unknown, status = 200, selected = "normal") { return NextResponse.json(body, { status, headers: { ...cors, "X-QA-Lab-Scenario": selected, "Cache-Control": "no-store" } }); }
function id(value?: string) { const parsed = Number(value); return Number.isInteger(parsed) && parsed > 0 ? parsed : null; }
function pagination(request: Request) { const url = new URL(request.url); const page = Math.max(1, Number(url.searchParams.get("page")) || 1); const perPage = Math.min(20, Math.max(1, Number(url.searchParams.get("perPage")) || 5)); return { page, perPage }; }
async function body(request: Request) { try { return await request.json() as Record<string, unknown>; } catch { return null; } }
function paged<T>(items: T[], page: number, perPage: number, broken: "repeat" | "skip" | null) { let start = (page - 1) * perPage; if (broken === "repeat" && page > 1) start -= 1; if (broken === "skip") start += page; return { data: items.slice(start, start + perPage), meta: { page, perPage, total: items.length, totalPages: Math.ceil(items.length / perPage) } }; }

export async function handleApiLab(request: Request, method: string, params: Params) {
  const segments = params.segments ?? []; const [resource, rawId] = segments; const selected = scenario(request); const bug = selected === "bug"; const resourceId = id(rawId);
  if (!resource) return json({ error: "Not Found", message: "Consulte /api-docs para conhecer os endpoints.", statusCode: 404 }, 404, selected);
  if (resource === "health" && method === "GET") return json(bug ? { status: "healthy", services: { database: "down", cache: "up" }, checkedAt: "2026-06-22T12:00:00.000Z" } : { status: "healthy", services: { database: "up", cache: "up" }, checkedAt: "2026-06-22T12:00:00.000Z" }, 200, selected);
  if (resource === "users") {
    if (method === "GET" && rawId) { const user = users.find((item) => item.id === resourceId); if (!user) return bug ? json({ error: "Usuário não encontrado" }, 200, selected) : json({ error: "Not Found", message: "Usuário não encontrado.", statusCode: 404 }, 404, selected); return json({ data: user }, 200, selected); }
    if (method === "GET") { const { page, perPage } = pagination(request); return json(paged(users, page, perPage, bug ? "repeat" : null), 200, selected); }
    if (method === "POST") { const input = await body(request); if (!input || typeof input.nome !== "string" || typeof input.email !== "string") return json({ error: "Validation Error", message: "nome e email são obrigatórios.", statusCode: 400 }, 400, selected); const created = { id: 21, nome: input.nome, email: input.email, telefone: bug ? "" : String(input.telefone ?? ""), cargo: bug ? "" : String(input.cargo ?? ""), ativo: true, criadoEm: "2026-06-22T12:00:00.000Z" }; return json({ data: created }, 201, selected); }
    if (method === "PUT" && rawId) { const current = users.find((item) => item.id === resourceId); if (!current) return json({ error: "Not Found", message: "Usuário não encontrado.", statusCode: 404 }, 404, selected); const input = await body(request); if (!input) return json({ error: "Invalid JSON", message: "Envie um JSON válido.", statusCode: 400 }, 400, selected); return json({ data: bug ? current : { ...current, ...input, id: current.id } }, 200, selected); }
  }
  if (resource === "products") {
    if (method === "GET" && rawId) { const product = products.find((item) => item.id === resourceId); if (!product) return bug ? json({ error: "Produto não encontrado" }, 200, selected) : json({ error: "Not Found", message: "Produto não encontrado.", statusCode: 404 }, 404, selected); return json({ data: product }, 200, selected); }
    if (method === "GET") { const { page, perPage } = pagination(request); return json(paged(products, page, perPage, bug ? "skip" : null), 200, selected); }
    if (method === "DELETE" && rawId) { const product = products.find((item) => item.id === resourceId); if (!product) return json({ error: "Not Found", message: "Produto não encontrado.", statusCode: 404 }, 404, selected); return new NextResponse(null, { status: 204, headers: { ...cors, "X-QA-Lab-Scenario": selected, "X-Resource-Deleted": bug ? "false" : "true" } }); }
  }
  if (resource === "orders") {
    if (method === "GET" && rawId) { const order = orders.find((item) => item.id === resourceId); if (!order) return json({ error: "Not Found", message: "Pedido não encontrado.", statusCode: 404 }, 404, selected); if (bug) return json({ data: { order_id: order.id, user_id: order.usuarioId, order_items: order.produtos.map((item) => ({ product_id: item.produtoId, quantity: item.quantidade, unit_price: item.precoUnitario })), order_status: order.status, total_value: order.total, created_at: order.criadoEm } }, 200, selected); return json({ data: order }, 200, selected); }
    if (method === "POST") { const input = await body(request); const items = Array.isArray(input?.produtos) ? input.produtos as { produtoId?: number; quantidade?: number }[] : []; if (!input || typeof input.usuarioId !== "number" || !items.length) return json({ error: "Validation Error", message: "usuarioId e produtos são obrigatórios.", statusCode: 400 }, 400, selected); const invalid = items.find((item) => !products.some((product) => product.id === Number(item.produtoId))); if (invalid && !bug) return json({ error: "Validation Error", message: `Produto ${invalid.produtoId} não existe.`, statusCode: 422 }, 422, selected); if (bug) await new Promise((resolve) => setTimeout(resolve, 1200)); const normalized = items.map((item) => { const product = products.find((candidate) => candidate.id === Number(item.produtoId)); return { produtoId: Number(item.produtoId), quantidade: Math.max(1, Number(item.quantidade) || 1), precoUnitario: product?.preco ?? 0 }; }); return json({ data: { id: 11, usuarioId: input.usuarioId, produtos: normalized, status: "pendente", total: normalized.reduce((sum, item) => sum + item.quantidade * item.precoUnitario, 0), criadoEm: "2026-06-22T12:00:00.000Z" } }, 201, selected); }
  }
  if (resource === "auth" && rawId === "login" && method === "POST") { const input = await body(request); const email = String(input?.email ?? ""); const exists = users.some((user) => user.email === email); if (!email || !input?.senha) return json({ error: "Validation Error", message: "email e senha são obrigatórios.", statusCode: 400 }, 400, selected); if (bug) return json({ error: exists ? "Senha incorreta" : "E-mail não cadastrado" }, 401, selected); return json({ error: "Credenciais inválidas" }, 401, selected); }
  return json({ error: "Not Found", message: "Endpoint ou método não disponível.", statusCode: 404 }, 404, selected);
}

export function apiLabOptions() { return new NextResponse(null, { status: 204, headers: cors }); }

