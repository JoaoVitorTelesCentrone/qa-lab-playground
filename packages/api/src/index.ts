import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import users from "./routes/users";
import products from "./routes/products";
import orders from "./routes/orders";
import health from "./routes/health";
import { getChaosConfig, updateChaosConfig, setAllChaos } from "./config/chaos-config";
import { store } from "./data/store";
import type { ChaosEndpointConfig } from "@qa-lab/shared";

type Variables = {
  chaosTriggered: boolean;
  chaosConfig: ChaosEndpointConfig;
};

const app = new Hono<{ Variables: Variables }>();

// Middleware
app.use("*", cors({ origin: "*" }));
app.use("*", logger());

// Routes
app.route("/api/users", users);
app.route("/api/products", products);
app.route("/api/orders", orders);
app.route("/api/health", health);

// ==============================
// Chaos Control Endpoints
// ==============================

// GET chaos config
app.get("/api/_chaos/config", (c) => {
  return c.json(getChaosConfig());
});

// Update single endpoint chaos config
app.post("/api/_chaos/config", async (c) => {
  const body = await c.req.json<{
    endpoint: string;
    config: Partial<ChaosEndpointConfig>;
  }>();

  if (!body.endpoint) {
    return c.json({ error: "Campo 'endpoint' e obrigatorio" }, 400);
  }

  updateChaosConfig(body.endpoint, body.config);
  return c.json({
    message: `Configuracao de caos atualizada para ${body.endpoint}`,
    config: getChaosConfig(),
  });
});

// Toggle all chaos on/off
app.post("/api/_chaos/toggle", async (c) => {
  const body = await c.req.json<{ enabled: boolean }>();
  setAllChaos(body.enabled);
  return c.json({
    message: `Caos ${body.enabled ? "ativado" : "desativado"} para todos os endpoints`,
    config: getChaosConfig(),
  });
});

// Reset store data
app.post("/api/_admin/reset", (c) => {
  store.reset();
  return c.json({ message: "Dados resetados com sucesso" });
});

// ==============================
// Start Server
// ==============================

const port = Number(process.env.PORT) || 3001;

console.log(`
  ╔═══════════════════════════════════════╗
  ║     QA Lab Playground - API           ║
  ║     Rodando em http://localhost:${port}  ║
  ╚═══════════════════════════════════════╝
`);

export default {
  port,
  fetch: app.fetch,
};
