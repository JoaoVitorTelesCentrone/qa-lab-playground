import { fail, ok, readJson, withUser } from "@/lib/product/api";
import { createOrder, listOrders, updateOrderStatus } from "@/lib/product/practice/shop-store";
import { orderStatuses, type OrderStatus } from "@/lib/product/practice/shop";
import { PracticeError } from "@/lib/product/practice/store";

export const dynamic = "force-dynamic";

// GET /api/v1/shop/orders — histórico de pedidos do aluno.
export function GET() {
  return withUser(async (user) => ok(await listOrders(user.id)));
}

// POST /api/v1/shop/orders { coupon?, delivery? } — fecha o carrinho atual.
export async function POST(request: Request) {
  const body = await readJson(request);
  return withUser(async (user) => run(() => createOrder(user.id, {
    coupon: typeof body.coupon === "string" ? body.coupon : "",
    delivery: body.delivery === "expressa" ? "expressa" : "padrao",
  }), 201));
}

// PATCH /api/v1/shop/orders?reference= { status } — cancela ou avança o pedido.
export async function PATCH(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference");
  const body = await readJson(request);
  return withUser(async (user) => {
    if (!reference) return fail("Informe a referência do pedido.", 400);
    if (typeof body.status !== "string" || !orderStatuses.includes(body.status as OrderStatus)) {
      return fail("Situação de pedido inválida.", 422, { status: `Valor deve ser um de: ${orderStatuses.join(", ")}.` });
    }
    return run(() => updateOrderStatus(user.id, reference, body.status as OrderStatus));
  });
}

async function run(action: () => Promise<unknown>, status = 200) {
  try {
    return ok(await action(), status);
  } catch (error) {
    if (error instanceof PracticeError) return fail(error.message, error.status, error.details);
    throw error;
  }
}
