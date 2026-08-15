// Acesso ao carrinho e aos pedidos do ambiente QA Lab.
//
// Server-side apenas. Separado de store.ts porque estas duas entidades não
// entram no CRUD genérico de recursos: o carrinho é um documento por aluno e o
// pedido é imutável depois de criado, exceto pelo status.

import { createClient } from "@/lib/supabase/server";
import { shopProducts } from "@/lib/playground/shop-data";
import { getSettings, PracticeError } from "./store";
import { normalizeCart, orderReference, priceCart, priceLines, orderStatuses, type CartItem, type Order, type OrderStatus } from "./shop";

export async function getCart(userId: string): Promise<CartItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("practice_carts").select("items").eq("user_id", userId).maybeSingle();
  // Migração 0007 ainda não aplicada: a loja abre com carrinho vazio em vez de
  // quebrar a navegação inteira.
  if (error || !data) return [];
  return normalizeCart(data.items);
}

export async function saveCart(userId: string, items: unknown): Promise<CartItem[]> {
  const next = normalizeCart(items);
  const supabase = await createClient();
  const { error } = await supabase.from("practice_carts").upsert({ user_id: userId, items: next }, { onConflict: "user_id" });
  if (error) throw new PracticeError(error.message, 500);
  return next;
}

export async function listOrders(userId: string): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("practice_orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map(toOrder);
}

export async function findOrder(userId: string, reference: string): Promise<Order | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("practice_orders").select("*").eq("user_id", userId).eq("reference", reference).maybeSingle();
  return error || !data ? null : toOrder(data);
}

/**
 * Fecha o pedido a partir do carrinho salvo. O preço é recalculado aqui: o que
 * a tela mandou é palpite, quem decide o valor cobrado é o servidor — inclusive
 * quando o desvio plantado está ligado.
 */
export async function createOrder(userId: string, { coupon = "", delivery = "padrao" as "padrao" | "expressa" } = {}): Promise<Order> {
  const items = await getCart(userId);
  if (items.length === 0) throw new PracticeError("Carrinho vazio.", 422);

  const settings = await getSettings(userId);
  const lines = priceLines(items, shopProducts);
  const pricing = priceCart(lines, { coupon, delivery }, settings.activeBugs);

  const supabase = await createClient();
  const { count } = await supabase.from("practice_orders").select("id", { count: "exact", head: true }).eq("user_id", userId);
  const reference = orderReference((count ?? 0) + 1);

  const { data, error } = await supabase
    .from("practice_orders")
    .insert({ user_id: userId, reference, total: pricing.total, items: lines, pricing })
    .select("*")
    .single();
  if (error) throw new PracticeError(error.message, 500);

  await saveCart(userId, []);
  return toOrder(data);
}

export async function updateOrderStatus(userId: string, reference: string, status: OrderStatus): Promise<Order> {
  if (!orderStatuses.includes(status)) throw new PracticeError("Situação de pedido inválida.", 422, { status: `Valor deve ser um de: ${orderStatuses.join(", ")}.` });

  const supabase = await createClient();
  const { data, error } = await supabase.from("practice_orders").update({ status }).eq("user_id", userId).eq("reference", reference).select("*").maybeSingle();
  if (error) throw new PracticeError(error.message, 500);
  if (!data) throw new PracticeError("Pedido não encontrado.", 404);
  return toOrder(data);
}

type OrderRow = { id: string; reference: string; status: string; total: number; items: unknown; pricing: unknown; created_at: string };

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    reference: row.reference,
    status: (orderStatuses as readonly string[]).includes(row.status) ? (row.status as OrderStatus) : "confirmado",
    total: Number(row.total),
    items: Array.isArray(row.items) ? (row.items as Order["items"]) : [],
    pricing: (row.pricing ?? {}) as Order["pricing"],
    createdAt: row.created_at,
  };
}
