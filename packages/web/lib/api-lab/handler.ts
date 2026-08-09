import { NextResponse } from "next/server";
import { orders, products, users } from "./data";
import { createToken, initialBookings, shopProducts, shopUsers, validateToken, type Booking } from "@/lib/playground/shop-data";

type Params = { segments?: string[] };

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-QA-Lab-Scenario, Idempotency-Key",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

let bookings: Booking[] = initialBookings.map((booking) => ({ ...booking, bookingdates: { ...booking.bookingdates } }));
let nextBookingId = 4;

function scenario(request: Request) {
  const url = new URL(request.url);
  return request.headers.get("x-qa-lab-scenario") ?? url.searchParams.get("scenario") ?? "normal";
}

function json(body: unknown, status = 200, selected = "normal") {
  return NextResponse.json(body, { status, headers: { ...cors, "X-QA-Lab-Scenario": selected, "Cache-Control": "no-store" } });
}

function id(value?: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function pagination(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const perPage = Math.min(20, Math.max(1, Number(url.searchParams.get("perPage")) || 5));
  return { page, perPage };
}

async function body(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function paged<T>(items: T[], page: number, perPage: number, broken: "repeat" | "skip" | null) {
  let start = (page - 1) * perPage;
  if (broken === "repeat" && page > 1) start -= 1;
  if (broken === "skip") start += page;
  return { data: items.slice(start, start + perPage), meta: { page, perPage, total: items.length, totalPages: Math.ceil(items.length / perPage) } };
}

function hasAuth(request: Request) {
  return Boolean(validateToken(request.headers.get("authorization")));
}

function resetBookings() {
  bookings = initialBookings.map((booking) => ({ ...booking, bookingdates: { ...booking.bookingdates } }));
  nextBookingId = 4;
}

function validateBooking(input: Record<string, unknown> | null, partial = false) {
  if (!input) return "Envie um JSON valido.";
  const dates = input.bookingdates as Record<string, unknown> | undefined;
  if (!partial && ["firstname", "lastname", "totalprice", "depositpaid", "bookingdates"].some((field) => input[field] === undefined)) {
    return "firstname, lastname, totalprice, depositpaid e bookingdates sao obrigatorios.";
  }
  if (input.firstname !== undefined && typeof input.firstname !== "string") return "firstname deve ser string.";
  if (input.lastname !== undefined && typeof input.lastname !== "string") return "lastname deve ser string.";
  if (input.totalprice !== undefined && typeof input.totalprice !== "number") return "totalprice deve ser number.";
  if (input.depositpaid !== undefined && typeof input.depositpaid !== "boolean") return "depositpaid deve ser boolean.";
  if (dates !== undefined && (typeof dates.checkin !== "string" || typeof dates.checkout !== "string")) return "bookingdates.checkin e bookingdates.checkout devem ser strings.";
  return null;
}

export async function handleApiLab(request: Request, method: string, params: Params) {
  const segments = params.segments ?? [];
  const [resource, rawId, nested] = segments;
  const selected = scenario(request);
  const url = new URL(request.url);
  const bugId = url.searchParams.get("bug");
  const bug = selected === "bug" || Boolean(bugId);
  const resourceId = id(rawId);

  if (!resource) return json({ error: "Not Found", message: "Consulte /api-docs para conhecer os endpoints.", statusCode: 404 }, 404, selected);

  if (resource === "docs" && method === "GET") {
    return json({
      name: "QA Lab Playground API",
      auth: "POST /api/auth/login retorna token. Use Authorization: Bearer <token> para PUT, PATCH e DELETE em reservas.",
      endpoints: [
        "POST /api/auth/login",
        "POST /api/auth/logout",
        "GET /api/products?search=&category=&sort=",
        "GET /api/cart",
        "POST /api/cart/items",
        "PATCH /api/cart/items/:id",
        "DELETE /api/cart/items/:id",
        "GET /api/bookings?firstname=&lastname=&checkin=&page=&perPage=&sort=",
        "POST /api/bookings",
        "GET /api/bookings/:id",
        "PUT /api/bookings/:id",
        "PATCH /api/bookings/:id",
        "DELETE /api/bookings/:id",
        "POST /api/test/reset",
        "GET /api/health",
      ],
      examples: { login: { username: "standard_user", password: "qa_lab_secret" }, booking: initialBookings[0] },
      bugMode: "Use ?bug=delete-without-auth, ?bug=contract-broken ou ?scenario=bug.",
    }, 200, selected);
  }

  if (resource === "health" && method === "GET") {
    return json(bug ? { status: "healthy", services: { database: "down", cache: "up" }, checkedAt: "2026-06-22T12:00:00.000Z" } : { status: "healthy", services: { database: "up", cache: "up" }, checkedAt: "2026-06-22T12:00:00.000Z" }, 200, selected);
  }

  if (resource === "test" && rawId === "reset" && method === "POST") {
    resetBookings();
    return json({ data: { reset: true, bookings: bookings.length } }, 200, selected);
  }

  if (resource === "users") {
    if (method === "GET" && rawId) {
      const user = users.find((item) => item.id === resourceId);
      if (!user) return bug ? json({ error: "Usuario nao encontrado" }, 200, selected) : json({ error: "Not Found", message: "Usuario nao encontrado.", statusCode: 404 }, 404, selected);
      return json({ data: user }, 200, selected);
    }
    if (method === "GET") {
      const { page, perPage } = pagination(request);
      return json(paged(users, page, perPage, bug ? "repeat" : null), 200, selected);
    }
    if (method === "POST") {
      const input = await body(request);
      if (!input || typeof input.nome !== "string" || typeof input.email !== "string") return json({ error: "Validation Error", message: "nome e email sao obrigatorios.", statusCode: 400 }, 400, selected);
      const created = { id: 21, nome: input.nome, email: input.email, telefone: bug ? "" : String(input.telefone ?? ""), cargo: bug ? "" : String(input.cargo ?? ""), ativo: true, criadoEm: "2026-06-22T12:00:00.000Z" };
      return json({ data: created }, 201, selected);
    }
    if (method === "PUT" && rawId) {
      const current = users.find((item) => item.id === resourceId);
      if (!current) return json({ error: "Not Found", message: "Usuario nao encontrado.", statusCode: 404 }, 404, selected);
      const input = await body(request);
      if (!input) return json({ error: "Invalid JSON", message: "Envie um JSON valido.", statusCode: 400 }, 400, selected);
      return json({ data: bug ? current : { ...current, ...input, id: current.id } }, 200, selected);
    }
  }

  if (resource === "products") {
    if (method === "GET" && !rawId && (url.searchParams.has("search") || url.searchParams.has("category") || url.searchParams.has("sort"))) {
      let result = [...shopProducts];
      const search = url.searchParams.get("search")?.toLowerCase();
      const category = url.searchParams.get("category");
      const sort = url.searchParams.get("sort");
      if (search) result = result.filter((product) => product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search));
      if (category) result = result.filter((product) => product.category === category);
      if (sort === "price") result.sort((a, b) => a.price - b.price);
      if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
      if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
      return json({ data: result, meta: { total: result.length } }, 200, selected);
    }
    if (method === "GET" && rawId) {
      const product = products.find((item) => item.id === resourceId);
      if (!product) return bug ? json({ error: "Produto nao encontrado" }, 200, selected) : json({ error: "Not Found", message: "Produto nao encontrado.", statusCode: 404 }, 404, selected);
      return json({ data: product }, 200, selected);
    }
    if (method === "GET") {
      const { page, perPage } = pagination(request);
      return json(paged(products, page, perPage, bug ? "skip" : null), 200, selected);
    }
    if (method === "DELETE" && rawId) {
      const product = products.find((item) => item.id === resourceId);
      if (!product) return json({ error: "Not Found", message: "Produto nao encontrado.", statusCode: 404 }, 404, selected);
      return new NextResponse(null, { status: 204, headers: { ...cors, "X-QA-Lab-Scenario": selected, "X-Resource-Deleted": bug ? "false" : "true" } });
    }
  }

  if (resource === "orders") {
    if (method === "GET" && rawId) {
      const order = orders.find((item) => item.id === resourceId);
      if (!order) return json({ error: "Not Found", message: "Pedido nao encontrado.", statusCode: 404 }, 404, selected);
      if (bug) return json({ data: { order_id: order.id, user_id: order.usuarioId, order_items: order.produtos.map((item) => ({ product_id: item.produtoId, quantity: item.quantidade, unit_price: item.precoUnitario })), order_status: order.status, total_value: order.total, created_at: order.criadoEm } }, 200, selected);
      return json({ data: order }, 200, selected);
    }
    if (method === "POST") {
      const input = await body(request);
      const items = Array.isArray(input?.produtos) ? input.produtos as { produtoId?: number; quantidade?: number }[] : [];
      if (!input || typeof input.usuarioId !== "number" || !items.length) return json({ error: "Validation Error", message: "usuarioId e produtos sao obrigatorios.", statusCode: 400 }, 400, selected);
      const invalid = items.find((item) => !products.some((product) => product.id === Number(item.produtoId)));
      if (invalid && !bug) return json({ error: "Validation Error", message: `Produto ${invalid.produtoId} nao existe.`, statusCode: 422 }, 422, selected);
      if (bug) await new Promise((resolve) => setTimeout(resolve, 1200));
      const normalized = items.map((item) => {
        const product = products.find((candidate) => candidate.id === Number(item.produtoId));
        return { produtoId: Number(item.produtoId), quantidade: Math.max(1, Number(item.quantidade) || 1), precoUnitario: product?.preco ?? 0 };
      });
      return json({ data: { id: 11, usuarioId: input.usuarioId, produtos: normalized, status: "pendente", total: normalized.reduce((sum, item) => sum + item.quantidade * item.precoUnitario, 0), criadoEm: "2026-06-22T12:00:00.000Z" } }, 201, selected);
    }
  }

  if (resource === "cart") {
    if (method === "GET") return json({ data: { items: [], subtotal: 0, tax: 0, total: 0 } }, 200, selected);
    if (rawId === "items" && method === "POST") {
      const input = await body(request);
      if (typeof input?.productId !== "number") return json({ error: "Validation Error", message: "productId e obrigatorio.", statusCode: 400 }, 400, selected);
      return json({ data: { id: `cart-${input.productId}`, productId: input.productId, quantity: Number(input.quantity ?? 1) } }, 201, selected);
    }
    if (rawId === "items" && nested && method === "PATCH") return json({ data: { id: nested, quantity: Number((await body(request))?.quantity ?? 1) } }, 200, selected);
    if (rawId === "items" && nested && method === "DELETE") return new NextResponse(null, { status: 204, headers: cors });
  }

  if (resource === "bookings") {
    if (method === "GET" && rawId) {
      const found = bookings.find((booking) => booking.id === resourceId);
      if (!found) return json({ error: "Not Found", message: "Reserva nao encontrada.", statusCode: 404 }, 404, selected);
      return json({ data: bugId === "contract-broken" ? { booking_id: found.id, first_name: found.firstname } : found }, 200, selected);
    }
    if (method === "GET") {
      let result = [...bookings];
      const firstname = url.searchParams.get("firstname")?.toLowerCase();
      const lastname = url.searchParams.get("lastname")?.toLowerCase();
      const checkin = url.searchParams.get("checkin");
      const sort = url.searchParams.get("sort");
      if (firstname) result = result.filter((booking) => booking.firstname.toLowerCase().includes(firstname));
      if (lastname) result = result.filter((booking) => booking.lastname.toLowerCase().includes(lastname));
      if (checkin) result = result.filter((booking) => booking.bookingdates.checkin >= checkin);
      if (sort === "firstname") result.sort((a, b) => a.firstname.localeCompare(b.firstname));
      if (sort === "totalprice") result.sort((a, b) => a.totalprice - b.totalprice);
      const { page, perPage } = pagination(request);
      return json(paged(result, page, perPage, null), 200, selected);
    }
    if (method === "POST") {
      const input = await body(request);
      const validationError = validateBooking(input);
      if (validationError) return json({ error: "Validation Error", message: validationError, statusCode: 400 }, 400, selected);
      const duplicate = bookings.some((booking) => booking.firstname === input?.firstname && booking.lastname === input?.lastname && booking.bookingdates.checkin === (input.bookingdates as { checkin: string }).checkin);
      if (duplicate) return json({ error: "Conflict", message: "Ja existe reserva para esse hospede e data.", statusCode: 409 }, 409, selected);
      const created = { id: nextBookingId++, ...(input as Omit<Booking, "id">) };
      bookings.push(created);
      return json({ data: created }, 201, selected);
    }
    if ((method === "PUT" || method === "PATCH" || method === "DELETE") && bugId !== "delete-without-auth" && !hasAuth(request)) return json({ error: "Unauthorized", message: "Token obrigatorio.", statusCode: 401 }, 401, selected);
    const index = bookings.findIndex((booking) => booking.id === resourceId);
    if (index < 0) return json({ error: "Not Found", message: "Reserva nao encontrada.", statusCode: 404 }, 404, selected);
    if (method === "DELETE") {
      bookings.splice(index, 1);
      return new NextResponse(null, { status: 204, headers: cors });
    }
    const input = await body(request);
    const validationError = validateBooking(input, method === "PATCH");
    if (validationError) return json({ error: "Validation Error", message: validationError, statusCode: 400 }, 400, selected);
    bookings[index] = method === "PUT"
      ? { id: bookings[index].id, ...(input as Omit<Booking, "id">) }
      : { ...bookings[index], ...input, bookingdates: { ...bookings[index].bookingdates, ...((input?.bookingdates as object | undefined) ?? {}) } };
    return json({ data: bookings[index] }, 200, selected);
  }

  if (resource === "auth" && rawId === "logout" && method === "POST") return json({ data: { loggedOut: true } }, 200, selected);

  if (resource === "auth" && rawId === "login" && method === "POST") {
    const input = await body(request);
    const username = String(input?.username ?? "");
    if (username) {
      if (!input?.password) return json({ error: "Validation Error", message: "username e password sao obrigatorios.", statusCode: 400 }, 400, selected);
      const user = shopUsers.find((candidate) => candidate.username === username);
      if (!user || input.password !== user.password) return json({ error: "Unauthorized", message: "Credenciais invalidas.", statusCode: 401 }, 401, selected);
      if (user.state === "locked") return json({ error: "Forbidden", message: bugId === "locked-message" ? "Credenciais invalidas." : "Usuario bloqueado.", statusCode: 403 }, 403, selected);
      return json({ data: { token: createToken(user.username), user: { username: user.username, role: user.role, state: user.state } } }, 200, selected);
    }
    const email = String(input?.email ?? "");
    const exists = users.some((user) => user.email === email);
    if (!email || !input?.senha) return json({ error: "Validation Error", message: "email e senha sao obrigatorios.", statusCode: 400 }, 400, selected);
    if (bug) return json({ error: exists ? "Senha incorreta" : "E-mail nao cadastrado" }, 401, selected);
    return json({ error: "Credenciais invalidas" }, 401, selected);
  }

  return json({ error: "Not Found", message: "Endpoint ou metodo nao disponivel.", statusCode: 404 }, 404, selected);
}

export function apiLabOptions() {
  return new NextResponse(null, { status: 204, headers: cors });
}
