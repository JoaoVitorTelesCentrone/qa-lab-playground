import { Hono } from "hono";
import { store } from "../data/store";

const casos = new Hono();

// GET /api/casos
casos.get("/", (c) => {
  return c.json({ data: store.getCasos() });
});

// POST /api/casos
casos.post("/", async (c) => {
  const body = await c.req.json();

  if (!body.titulo?.trim()) {
    return c.json({ error: "Validation Error", message: "titulo é obrigatório" }, 422);
  }

  const caso = store.createCaso({
    titulo:             String(body.titulo).trim(),
    descricao:          String(body.descricao ?? "").trim(),
    resultado_esperado: String(body.resultado_esperado ?? "").trim(),
    sistema:            body.sistema ?? "API",
    tipo:               body.tipo ?? "funcional",
    prioridade:         body.prioridade ?? "alta",
    status:             body.status ?? "nao_executado",
    passos:             Array.isArray(body.passos) ? body.passos : [],
  });

  return c.json({ data: caso }, 201);
});

// PUT /api/casos/:id
casos.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const caso = store.updateCaso(id, {
    ...(body.titulo             !== undefined && { titulo:             String(body.titulo).trim() }),
    ...(body.descricao          !== undefined && { descricao:          String(body.descricao).trim() }),
    ...(body.resultado_esperado !== undefined && { resultado_esperado: String(body.resultado_esperado).trim() }),
    ...(body.sistema            !== undefined && { sistema:            body.sistema }),
    ...(body.tipo               !== undefined && { tipo:               body.tipo }),
    ...(body.prioridade         !== undefined && { prioridade:         body.prioridade }),
    ...(body.status             !== undefined && { status:             body.status }),
    ...(body.passos             !== undefined && { passos:             Array.isArray(body.passos) ? body.passos : [] }),
  });

  if (!caso) {
    return c.json({ error: "Not Found", message: `Caso ${id} não encontrado` }, 404);
  }

  return c.json({ data: caso });
});

// DELETE /api/casos/:id
casos.delete("/:id", (c) => {
  const id = c.req.param("id");
  const deleted = store.deleteCaso(id);

  if (!deleted) {
    return c.json({ error: "Not Found", message: `Caso ${id} não encontrado` }, 404);
  }

  return c.body(null, 204);
});

export default casos;
