// Regras do ambiente QA Lab (a loja).
//
// Preço de carrinho em um lugar só: carrinho, checkout, pedido e nota simulada
// chamam esta função. É isso que torna "o valor cobrado diverge do resumo" um
// desvio plantado de verdade, em vez de um número diferente escrito à mão em
// cada tela.
//
// Módulo puro: sem React, sem Supabase, sem localStorage.

import { isBugActive } from "./bugs";

export type CartItem = { productId: number; quantity: number };

export type PricedLine = CartItem & { name: string; unitPrice: number; total: number };

export type Delivery = "padrao" | "expressa";

export const coupons: Record<string, number> = { QA10: 0.1 };
export const freeShippingFrom = 200;
export const shippingCost: Record<Delivery, number> = { padrao: 19.9, expressa: 34.9 };
export const taxRate = 0.08;

export type Pricing = { subtotal: number; discount: number; shipping: number; tax: number; total: number };

/** Junta o carrinho com o catálogo, descartando produto que não existe mais. */
export function priceLines(items: CartItem[], products: Array<{ id: number; name: string; price: number }>): PricedLine[] {
  return items.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product) return [];
    return [{ ...item, name: product.name, unitPrice: product.price, total: round(product.price * item.quantity) }];
  });
}

export function priceCart(
  lines: PricedLine[],
  { coupon = "", delivery = "padrao" as Delivery, chargeShipping = true } = {},
  activeBugs: string[] = [],
): Pricing {
  const subtotal = round(lines.reduce((sum, line) => sum + line.total, 0));
  const rate = coupons[coupon.trim().toUpperCase()] ?? 0;
  const discount = round(subtotal * rate);
  const afterDiscount = subtotal - discount;

  const shipping = lines.length === 0 || afterDiscount >= freeShippingFrom || !chargeShipping ? 0 : shippingCost[delivery];

  // Bug plantado: o imposto é calculado sobre o subtotal, ou seja, o desconto
  // passa a ser aplicado depois do imposto. O resumo mostra o desconto certo,
  // mas o total cobrado fica maior — a diferença é exatamente imposto × desconto.
  const taxedBase = isBugActive(activeBugs, "qa-lab.wrong-total") ? subtotal : afterDiscount;
  const tax = round(taxedBase * taxRate);

  return { subtotal, discount, shipping, tax, total: round(afterDiscount + shipping + tax) };
}

/** Carrinho normalizado: quantidade inteira e positiva, sem produto repetido. */
export function normalizeCart(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];
  const merged = new Map<number, number>();
  for (const item of items) {
    const productId = Number((item as CartItem)?.productId);
    const quantity = Math.floor(Number((item as CartItem)?.quantity));
    if (!Number.isInteger(productId) || productId <= 0 || !Number.isFinite(quantity) || quantity <= 0) continue;
    // Adicionar o mesmo produto de novo soma quantidade em vez de duplicar a linha.
    merged.set(productId, Math.min(99, (merged.get(productId) ?? 0) + quantity));
  }
  return [...merged.entries()].map(([productId, quantity]) => ({ productId, quantity }));
}

export const orderStatuses = ["confirmado", "enviado", "entregue", "cancelado"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export type Order = {
  id: string;
  reference: string;
  status: OrderStatus;
  total: number;
  items: PricedLine[];
  pricing: Pricing;
  createdAt: string;
};

/** Referência legível do pedido, no formato que as telas e os Labs já usam. */
export function orderReference(sequence: number) {
  return `QL-${String(sequence).padStart(6, "0")}`;
}

const round = (value: number) => Math.round(value * 100) / 100;
