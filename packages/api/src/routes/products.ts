import { Hono } from "hono";
import { store } from "../data/store";
import { chaosMiddleware } from "../middleware/chaos";

const products = new Hono();

// GET /api/products - Lista produtos paginados
// Bug: paginacao pula itens
products.get("/", chaosMiddleware("GET /api/products"), (c) => {
  const chaosTriggered = c.get("chaosTriggered");
  const page = Math.max(1, Number(c.req.query("page")) || 1);
  const perPage = Math.min(50, Math.max(1, Number(c.req.query("perPage")) || 10));

  if (chaosTriggered) {
    // Skip some items by offsetting the start by a random amount
    const skipAmount = Math.floor(Math.random() * 3) + 1;
    const start = (page - 1) * perPage + skipAmount;
    const items = store.products.slice(start, start + perPage);
    return c.json({
      data: items,
      meta: {
        page,
        perPage,
        total: store.products.length,
        totalPages: Math.ceil(store.products.length / perPage),
      },
    });
  }

  const result = store.getProducts(page, perPage);
  return c.json(result);
});

// GET /api/products/:id - Retorna produto por ID
// Bug: retorna 200 com body de erro
products.get("/:id", chaosMiddleware("GET /api/products/:id"), (c) => {
  const id = Number(c.req.param("id"));
  const chaosTriggered = c.get("chaosTriggered");

  const product = store.getProductById(id);

  if (chaosTriggered || !product) {
    // Return 200 OK but with error body
    return c.json(
      {
        error: "ProductNotFound",
        message: `Produto com id ${id} nao foi encontrado no sistema`,
        data: null,
      },
      200 // This is the bug: should be 404
    );
  }

  return c.json({ data: product });
});

// DELETE /api/products/:id - Deleta produto
// Bug: retorna 204 mas item continua existindo
products.delete("/:id", chaosMiddleware("DELETE /api/products/:id"), (c) => {
  const id = Number(c.req.param("id"));
  const chaosTriggered = c.get("chaosTriggered");

  const product = store.getProductById(id);
  if (!product) {
    return c.json({ error: "Not Found", message: `Produto ${id} nao encontrado` }, 404);
  }

  if (chaosTriggered) {
    // Return 204 but DON'T actually delete
    return c.body(null, 204);
  }

  store.deleteProduct(id);
  return c.body(null, 204);
});

export default products;
