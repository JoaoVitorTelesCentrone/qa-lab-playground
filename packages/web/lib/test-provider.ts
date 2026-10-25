/** Test gateways are server-only environment settings and require a local DB. */
export function providerUrl(production: string, localOverride?: string) {
  if (!localOverride) return production;
  const loopback = (value: string) => ["localhost", "127.0.0.1", "[::1]"].includes(new URL(value).hostname);
  if (process.env.MENTORSHIP_E2E_LOCAL !== "true" || !loopback(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "") || !loopback(localOverride)) throw new Error("O provedor de teste exige o ambiente local isolado.");
  return localOverride.replace(/\/$/, "");
}
