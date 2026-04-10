// ─── Types ───────────────────────────────────────────────────────────────────

export type EcommerceUser = {
  id: number;
  email: string;
  nome: string;
  role: "cliente" | "admin";
  token: string;
};

export type CartItem = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  estoque: number;
  categoria: string;
};

export type Order = {
  id: string;
  userId: number;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  desconto: number;
  frete: number;
  total: number;
  cupom: string | null;
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    cidade: string;
    estado: string;
  };
  pagamento: "cartao_credito" | "pix" | "boleto";
  status: "processando" | "confirmado" | "enviado" | "entregue" | "cancelado";
  criadoEm: string;
};

// ─── Mock users ──────────────────────────────────────────────────────────────

const MOCK_USERS = [
  { id: 1, email: "cliente@qalab.com",  password: "senha123", nome: "Maria Silva", role: "cliente" as const },
  { id: 2, email: "admin@qalab.com",    password: "admin123", nome: "João Admin",  role: "admin"   as const },
];

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * BUG #8 — Information disclosure:
 *   "E-mail não encontrado" vs "Senha incorreta" reveals email existence.
 *
 * BUG #9 — Sem rate limiting:
 *   Função pode ser chamada ilimitadas vezes sem bloqueio.
 *
 * BUG #11 — Token sem expiração:
 *   JWT com assinatura fixa, sem claim "exp".
 */
export function mockLogin(
  email: string,
  password: string,
): { success: true; user: EcommerceUser } | { success: false; error: string } {
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // BUG: revela que o e-mail não existe
    return { success: false, error: "E-mail não encontrado no sistema." };
  }

  if (user.password !== password) {
    // BUG: mensagem diferente — confirma indiretamente que o e-mail existe
    return { success: false, error: "Senha incorreta. Tente novamente." };
  }

  // BUG: token sem expiração (sem claim "exp"), assinatura fixa
  const payload = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }));
  const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.ASSINATURA_FIXA_SEM_EXPIRACAO`;

  return {
    success: true,
    user: { id: user.id, email: user.email, nome: user.nome, role: user.role, token },
  };
}

// ─── LocalStorage helpers ─────────────────────────────────────────────────────

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export const getStoredUser  = () => safeGet<EcommerceUser>("ecom_user");
export const setStoredUser  = (u: EcommerceUser) => safeSet("ecom_user", u);
export const clearStoredUser = () => { if (typeof window !== "undefined") localStorage.removeItem("ecom_user"); };

export const getStoredCart  = (): CartItem[] => safeGet<CartItem[]>("ecom_cart") ?? [];
export const setStoredCart  = (c: CartItem[]) => safeSet("ecom_cart", c);

export const getStoredOrders = (): Order[] => safeGet<Order[]>("ecom_orders") ?? [];
export function addStoredOrder(order: Order) {
  const orders = getStoredOrders();
  orders.unshift(order);
  safeSet("ecom_orders", orders);
}

export function generateOrderId(): string {
  return `PED-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}
