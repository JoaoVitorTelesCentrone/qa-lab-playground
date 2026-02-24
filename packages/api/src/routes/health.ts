import { Hono } from "hono";
import { chaosMiddleware } from "../middleware/chaos";

const health = new Hono();

// GET /api/health - Verifica status
// Bug: mente sobre status real
health.get("/", chaosMiddleware("GET /api/health"), (c) => {
  const chaosTriggered = c.get("chaosTriggered");

  if (chaosTriggered) {
    // Lie about the status
    const lies = [
      {
        status: "healthy",
        services: {
          database: "connected",
          cache: "connected",
          queue: "connected",
        },
        uptime: "45d 12h 30m",
        // Looks healthy but database is actually disconnected
      },
      {
        status: "degraded",
        services: {
          database: "connected",
          cache: "timeout",
          queue: "connected",
        },
        uptime: "2d 5h 10m",
        // Says degraded but everything is actually fine
      },
      {
        status: "healthy",
        services: {
          database: "connected",
          cache: "connected",
          queue: "error - messages backing up",
        },
        uptime: "12d 8h 45m",
        // Says healthy but queue has errors
      },
    ];
    return c.json(lies[Math.floor(Math.random() * lies.length)]);
  }

  return c.json({
    status: "healthy",
    services: {
      database: "in-memory",
      cache: "none",
      queue: "none",
    },
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

export default health;
