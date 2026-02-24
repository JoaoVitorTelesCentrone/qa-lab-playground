import { Hono } from "hono";
import { store } from "../data/store";
import { chaosMiddleware } from "../middleware/chaos";
import { getEndpointChaos } from "../config/chaos-config";

const users = new Hono();

// GET /api/users - Lista usuarios paginados
// Bug: retorna 500 aleatorio, delay configuravel
users.get("/", chaosMiddleware("GET /api/users"), (c) => {
  const chaosTriggered = c.get("chaosTriggered");

  if (chaosTriggered) {
    return c.json(
      { error: "Internal Server Error", message: "Unexpected database error" },
      500
    );
  }

  const page = Math.max(1, Number(c.req.query("page")) || 1);
  const perPage = Math.min(50, Math.max(1, Number(c.req.query("perPage")) || 10));
  const result = store.getUsers(page, perPage);
  return c.json(result);
});

// GET /api/users/:id - Retorna usuario por ID
// Bug: as vezes retorna o usuario errado
users.get("/:id", chaosMiddleware("GET /api/users/:id"), (c) => {
  const id = Number(c.req.param("id"));
  const chaosTriggered = c.get("chaosTriggered");

  if (chaosTriggered) {
    // Return a random different user
    const allUsers = store.users;
    const wrongUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    return c.json({ data: wrongUser });
  }

  const user = store.getUserById(id);
  if (!user) {
    return c.json({ error: "Not Found", message: `Usuario ${id} nao encontrado` }, 404);
  }
  return c.json({ data: user });
});

// POST /api/users - Cria usuario
// Bug: silenciosamente descarta campos
users.post("/", chaosMiddleware("POST /api/users"), async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const chaosConfig = getEndpointChaos("POST /api/users");

  let userData = body;

  if (chaosConfig.enabled) {
    // Silently drop some fields
    const fieldsToKeep = ["nome", "email"]; // drops telefone, cargo, etc.
    userData = Object.fromEntries(
      Object.entries(body).filter(([key]) => fieldsToKeep.includes(key))
    );
  }

  if (!userData.nome || !userData.email) {
    return c.json(
      { error: "Validation Error", message: "Campos 'nome' e 'email' sao obrigatorios" },
      400
    );
  }

  const user = store.createUser(userData as Record<string, string>);
  return c.json({ data: user }, 201);
});

// PUT /api/users/:id - Atualiza usuario
// Bug: retorna sucesso mas nao atualiza
users.put("/:id", chaosMiddleware("PUT /api/users/:id"), async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Record<string, unknown>>();
  const chaosTriggered = c.get("chaosTriggered");

  const user = store.getUserById(id);
  if (!user) {
    return c.json({ error: "Not Found", message: `Usuario ${id} nao encontrado` }, 404);
  }

  if (chaosTriggered) {
    // Return success with the "updated" data but DON'T actually update
    return c.json({
      data: { ...user, ...body },
      message: "Usuario atualizado com sucesso",
    });
  }

  const updated = store.updateUser(id, body as Record<string, string>);
  return c.json({ data: updated, message: "Usuario atualizado com sucesso" });
});

export default users;
