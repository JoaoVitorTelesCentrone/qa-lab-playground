import { Hono } from "hono";
import { systemStore } from "../data/system-store";

const system = new Hono();
system.post("/auth/register", async (c) => { const body = await c.req.json<{ name?: string; email?: string; password?: string }>(); if (!body.name || !body.email || !body.password || body.password.length < 8) return c.json({ error: "Invalid input" }, 400); const account = await systemStore.register(body.name, body.email, body.password); return account ? c.json({ data: account }, 201) : c.json({ error: "Email already registered" }, 409); });
system.post("/auth/login", async (c) => { const body = await c.req.json<{ email?: string; password?: string }>(); const account = body.email && body.password ? await systemStore.login(body.email, body.password) : null; return account ? c.json({ data: account }) : c.json({ error: "Invalid credentials" }, 401); });
system.post("/orders", async (c) => { const body = await c.req.json<{ accountId?: string; items?: { productId: number; quantity: number; unitPrice: number }[] }>(); if (!body.accountId || !body.items?.length) return c.json({ error: "Invalid order" }, 400); return c.json({ data: await systemStore.createOrder(body.accountId, body.items) }, 201); });
system.get("/orders/:accountId", async (c) => c.json({ data: await systemStore.listOrders(c.req.param("accountId")) }));
system.post("/tickets", async (c) => { const body = await c.req.json<{ accountId?: string; subject?: string; category?: string; priority?: string }>(); if (!body.accountId || !body.subject || !body.category || !body.priority) return c.json({ error: "Invalid ticket" }, 400); return c.json({ data: await systemStore.createTicket(body.accountId, body.subject, body.category, body.priority) }, 201); });
system.get("/tickets/:accountId", async (c) => c.json({ data: await systemStore.listTickets(c.req.param("accountId")) }));
export default system;
