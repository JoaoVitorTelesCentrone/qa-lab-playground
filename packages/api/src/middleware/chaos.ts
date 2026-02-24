import type { MiddlewareHandler } from "hono";
import { getEndpointChaos } from "../config/chaos-config";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function chaosMiddleware(endpointKey: string): MiddlewareHandler {
  return async (c, next) => {
    const config = getEndpointChaos(endpointKey);

    if (!config.enabled) {
      await next();
      return;
    }

    // Apply artificial delay
    if (config.delayMs > 0) {
      const jitter = Math.floor(Math.random() * config.delayMs * 0.5);
      await sleep(config.delayMs + jitter);
    }

    // Check if we should trigger an error
    const shouldError = Math.random() * 100 < config.errorRate;
    if (shouldError) {
      // Store chaos flag in context for route-specific behavior
      c.set("chaosTriggered", true);
    }

    c.set("chaosConfig", config);
    await next();
  };
}
