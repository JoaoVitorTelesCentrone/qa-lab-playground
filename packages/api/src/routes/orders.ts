import { Hono } from "hono";
import { store } from "../data/store";
import { chaosMiddleware } from "../middleware/chaos";
import type { Order } from "@qa-lab/shared";

const orders = new Hono();

// Helper: convert order to different formats for the chaos bug
function orderToCamelCase(order: Order) {
  return {
    id: order.id,
    userId: order.usuarioId,
    items: order.produtos.map((p) => ({
      productId: p.produtoId,
      quantity: p.quantidade,
      unitPrice: p.precoUnitario,
    })),
    status: order.status,
    totalAmount: order.total,
    createdAt: order.criadoEm,
  };
}

function orderToSnakeCase(order: Order) {
  return {
    order_id: order.id,
    user_id: order.usuarioId,
    order_items: order.produtos.map((p) => ({
      product_id: p.produtoId,
      qty: p.quantidade,
      unit_price: p.precoUnitario,
    })),
    order_status: order.status,
    total_value: order.total,
    created_at: order.criadoEm,
  };
}

function orderToFlat(order: Order) {
  return {
    orderId: order.id,
    orderUser: order.usuarioId,
    orderStatus: order.status,
    orderTotal: order.total,
    orderDate: order.criadoEm,
    itemCount: order.produtos.length,
    firstProductId: order.produtos[0]?.produtoId ?? null,
  };
}

const formatters = [orderToCamelCase, orderToSnakeCase, orderToFlat];

// POST /api/orders - Cria pedido
// Bug: timeout intermitente
orders.post("/", chaosMiddleware("POST /api/orders"), async (c) => {
  const chaosTriggered = c.get("chaosTriggered");

  if (chaosTriggered) {
    // Simulate timeout by waiting 30 seconds (will likely timeout)
    await new Promise((resolve) => setTimeout(resolve, 30_000));
    return c.json({ error: "Gateway Timeout" }, 504);
  }

  const body = await c.req.json<{ usuarioId?: number; produtos?: { produtoId: number; quantidade: number }[] }>();

  if (!body.usuarioId || !body.produtos || !Array.isArray(body.produtos) || body.produtos.length === 0) {
    return c.json(
      {
        error: "Validation Error",
        message: "Campos 'usuarioId' e 'produtos' (array nao vazio) sao obrigatorios",
      },
      400
    );
  }

  const order = store.createOrder({
    usuarioId: body.usuarioId,
    produtos: body.produtos,
  });

  return c.json({ data: order }, 201);
});

// GET /api/orders/:id - Retorna pedido
// Bug: formato muda a cada request
orders.get("/:id", chaosMiddleware("GET /api/orders/:id"), (c) => {
  const id = Number(c.req.param("id"));
  const chaosTriggered = c.get("chaosTriggered");

  const order = store.getOrderById(id);
  if (!order) {
    return c.json({ error: "Not Found", message: `Pedido ${id} nao encontrado` }, 404);
  }

  if (chaosTriggered) {
    // Pick a random format
    const formatter = formatters[Math.floor(Math.random() * formatters.length)];
    return c.json({ data: formatter(order) });
  }

  return c.json({ data: order });
});

export default orders;
