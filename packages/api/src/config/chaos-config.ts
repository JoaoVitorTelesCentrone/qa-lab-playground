import type { ChaosConfig, ChaosEndpointConfig } from "@qa-lab/shared";

const defaultConfig: ChaosEndpointConfig = {
  enabled: false,
  errorRate: 30,
  delayMs: 0,
  wrongData: false,
};

const chaosConfig: ChaosConfig = {
  "GET /api/users": { ...defaultConfig },
  "GET /api/users/:id": { ...defaultConfig, wrongData: false },
  "POST /api/users": { ...defaultConfig },
  "GET /api/products": { ...defaultConfig },
  "GET /api/products/:id": { ...defaultConfig },
  "POST /api/orders": { ...defaultConfig, delayMs: 0 },
  "GET /api/orders/:id": { ...defaultConfig, wrongData: false },
  "PUT /api/users/:id": { ...defaultConfig },
  "DELETE /api/products/:id": { ...defaultConfig },
  "GET /api/health": { ...defaultConfig },
};

export function getChaosConfig(): ChaosConfig {
  return { ...chaosConfig };
}

export function getEndpointChaos(key: string): ChaosEndpointConfig {
  return chaosConfig[key] ?? { ...defaultConfig };
}

export function updateChaosConfig(key: string, update: Partial<ChaosEndpointConfig>): void {
  if (!chaosConfig[key]) {
    chaosConfig[key] = { ...defaultConfig };
  }
  Object.assign(chaosConfig[key], update);
}

export function setAllChaos(enabled: boolean): void {
  for (const key of Object.keys(chaosConfig)) {
    chaosConfig[key].enabled = enabled;
  }
}

export function shouldTriggerChaos(key: string): boolean {
  const config = chaosConfig[key];
  if (!config?.enabled) return false;
  return Math.random() * 100 < config.errorRate;
}
