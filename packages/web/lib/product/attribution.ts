export type AcquisitionAttribution = {
  source?: string;
  medium?: string;
  campaign?: string;
};

const ATTRIBUTION_KEY = "qa:first-touch-attribution";
const allowed = /^[a-z0-9_-]{1,80}$/;

export function normalizeAttribution(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 80);
  return allowed.test(normalized) ? normalized : undefined;
}

export function readAttribution(search: string): AcquisitionAttribution {
  const params = new URLSearchParams(search);
  const source = normalizeAttribution(params.get("utm_source"));
  const medium = normalizeAttribution(params.get("utm_medium"));
  const campaign = normalizeAttribution(params.get("utm_campaign"));
  return { ...(source ? { source } : {}), ...(medium ? { medium } : {}), ...(campaign ? { campaign } : {}) };
}

export function storedAttribution(): AcquisitionAttribution {
  try {
    const value = JSON.parse(window.localStorage.getItem(ATTRIBUTION_KEY) ?? "null") as Record<string, unknown> | null;
    const source = normalizeAttribution(value?.source);
    const medium = normalizeAttribution(value?.medium);
    const campaign = normalizeAttribution(value?.campaign);
    return { ...(source ? { source } : {}), ...(medium ? { medium } : {}), ...(campaign ? { campaign } : {}) };
  } catch {
    return {};
  }
}

export function captureFirstTouch(search: string) {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(ATTRIBUTION_KEY)) return;
    const attribution = readAttribution(search);
    if (Object.keys(attribution).length) window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Storage can be disabled; signup remains available without attribution.
  }
}
