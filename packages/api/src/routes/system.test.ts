import { beforeEach, expect, mock, test } from "bun:test";

const token = "a".repeat(64);
const ownAccountId = "account-a";
const orders: Array<{ accountId: string }> = [];
const tickets: Array<{ accountId: string }> = [];

mock.module("../data/system-store", () => ({
  systemStore: {
    accountForSession: async (provided: string) => provided === token ? ownAccountId : null,
    createOrder: async (accountId: string) => { orders.push({ accountId }); return { accountId }; },
    listOrders: async (accountId: string) => orders.filter((order) => order.accountId === accountId),
    createTicket: async (accountId: string) => { tickets.push({ accountId }); return { accountId }; },
    listTickets: async (accountId: string) => tickets.filter((ticket) => ticket.accountId === accountId),
  },
}));

const { default: system } = await import("./system");
const authorization = { Authorization: `Bearer ${token}` };

beforeEach(() => { orders.length = 0; tickets.length = 0; });

test("orders require a session and reject another account ID", async () => {
  expect((await system.request("/orders/account-a")).status).toBe(401);
  expect((await system.request("/orders/account-b", { headers: authorization })).status).toBe(403);
  expect((await system.request("/orders", { method: "POST" })).status).toBe(401);

  const created = await system.request("/orders", {
    method: "POST",
    headers: { ...authorization, "content-type": "application/json" },
    body: JSON.stringify({ accountId: "account-b", items: [{ productId: 1, quantity: 1, unitPrice: 10 }] }),
  });
  expect(created.status).toBe(201);
  expect(orders).toEqual([{ accountId: ownAccountId }]);
  expect((await system.request("/orders/account-a", { headers: authorization })).status).toBe(200);
});

test("tickets use the authenticated account", async () => {
  expect((await system.request("/tickets", { method: "POST" })).status).toBe(401);
  expect((await system.request("/tickets/account-b", { headers: authorization })).status).toBe(403);

  const created = await system.request("/tickets", {
    method: "POST",
    headers: { ...authorization, "content-type": "application/json" },
    body: JSON.stringify({ accountId: "account-b", subject: "Help", category: "shop", priority: "normal" }),
  });
  expect(created.status).toBe(201);
  expect(tickets).toEqual([{ accountId: ownAccountId }]);
});
