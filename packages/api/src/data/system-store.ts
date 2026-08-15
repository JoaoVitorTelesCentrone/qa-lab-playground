type Account = { id: string; name: string; email: string; passwordHash: string; createdAt: string };
type SystemOrder = { id: string; accountId: string; items: { productId: number; quantity: number; unitPrice: number }[]; total: number; status: "confirmed" | "cancelled"; createdAt: string };
type Ticket = { id: string; accountId: string; subject: string; category: string; priority: string; status: "open" | "in_progress" | "closed"; messages: string[]; createdAt: string };
type State = { accounts: Account[]; orders: SystemOrder[]; tickets: Ticket[] };

const stateFile = new URL("./system-state.json", import.meta.url).pathname;
let state: State | null = null;

async function data() { if (state) return state; const file = Bun.file(stateFile); state = await file.exists() ? await file.json() as State : { accounts: [], orders: [], tickets: [] }; return state; }
async function persist() { await Bun.write(stateFile, JSON.stringify(state)); }

export const systemStore = {
  async register(name: string, email: string, password: string) { const current = await data(); if (current.accounts.some((account) => account.email === email.toLowerCase())) return null; const account = { id: crypto.randomUUID(), name, email: email.toLowerCase(), passwordHash: await Bun.password.hash(password), createdAt: new Date().toISOString() }; current.accounts.push(account); await persist(); return { id: account.id, name: account.name, email: account.email }; },
  async login(email: string, password: string) { const current = await data(); const account = current.accounts.find((item) => item.email === email.toLowerCase()); if (!account || !await Bun.password.verify(password, account.passwordHash)) return null; return { id: account.id, name: account.name, email: account.email }; },
  async createOrder(accountId: string, items: SystemOrder["items"]) { const current = await data(); const order = { id: crypto.randomUUID(), accountId, items, total: items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0), status: "confirmed" as const, createdAt: new Date().toISOString() }; current.orders.push(order); await persist(); return order; },
  async listOrders(accountId: string) { return (await data()).orders.filter((order) => order.accountId === accountId); },
  async createTicket(accountId: string, subject: string, category: string, priority: string) { const current = await data(); const ticket = { id: crypto.randomUUID(), accountId, subject, category, priority, status: "open" as const, messages: [], createdAt: new Date().toISOString() }; current.tickets.push(ticket); await persist(); return ticket; },
  async listTickets(accountId: string) { return (await data()).tickets.filter((ticket) => ticket.accountId === accountId); },
};
