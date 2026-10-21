import { Hono, type Context, type Next } from "hono";
import { systemStore } from "../data/system-store";

type Variables = { accountId: string; sessionToken: string };
const system = new Hono<{ Variables: Variables }>();

async function requireSession(c: Context<{ Variables: Variables }>, next: Next) {
  const match = /^Bearer ([a-f0-9]{64})$/.exec(c.req.header("authorization") ?? "");
  const accountId = match ? await systemStore.accountForSession(match[1]) : null;
  if (!accountId || !match) return c.json({ error: "Unauthorized" }, 401);
  c.set("accountId", accountId);
  c.set("sessionToken", match[1]);
  await next();
}

system.post("/auth/register", async (c) => {
  const body = await c.req.json<{ name?: string; email?: string; password?: string }>();
  if (!body.name || !body.email || !body.password || body.password.length < 8) return c.json({ error: "Invalid input" }, 400);
  const account = await systemStore.register(body.name, body.email, body.password);
  return account ? c.json({ data: account }, 201) : c.json({ error: "Email already registered" }, 409);
});

system.post("/auth/login", async (c) => {
  const body = await c.req.json<{ email?: string; password?: string }>();
  const account = body.email && body.password ? await systemStore.login(body.email, body.password) : null;
  if (!account) return c.json({ error: "Invalid credentials" }, 401);
  const token = await systemStore.createSession(account.id);
  return c.json({ data: { ...account, token } });
});

system.post("/auth/logout", requireSession, async (c) => {
  await systemStore.revokeSession(c.get("sessionToken"));
  return c.json({ data: { signedOut: true } });
});

system.use("/orders", requireSession);
system.use("/orders/*", requireSession);
system.use("/tickets", requireSession);
system.use("/tickets/*", requireSession);

system.post("/orders", async (c) => {
  const body = await c.req.json<{ items?: { productId: number; quantity: number; unitPrice: number }[] }>();
  if (!body.items?.length) return c.json({ error: "Invalid order" }, 400);
  return c.json({ data: await systemStore.createOrder(c.get("accountId"), body.items) }, 201);
});

system.get("/orders/:accountId", async (c) => {
  if (c.req.param("accountId") !== c.get("accountId")) return c.json({ error: "Forbidden" }, 403);
  return c.json({ data: await systemStore.listOrders(c.get("accountId")) });
});

system.post("/tickets", async (c) => {
  const body = await c.req.json<{ subject?: string; category?: string; priority?: string }>();
  if (!body.subject || !body.category || !body.priority) return c.json({ error: "Invalid ticket" }, 400);
  return c.json({ data: await systemStore.createTicket(c.get("accountId"), body.subject, body.category, body.priority) }, 201);
});

system.get("/tickets/:accountId", async (c) => {
  if (c.req.param("accountId") !== c.get("accountId")) return c.json({ error: "Forbidden" }, 403);
  return c.json({ data: await systemStore.listTickets(c.get("accountId")) });
});

export default system;
