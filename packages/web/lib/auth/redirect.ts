const DEFAULT_AUTH_DESTINATION = "/lab";

/**
 * Mantém o retorno da autenticação dentro do próprio QA Lab.
 * URLs absolutas, protocol-relative e caminhos de controle são descartados.
 */
export function safeAuthDestination(value: string | null | undefined, fallback = DEFAULT_AUTH_DESTINATION) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\") || /[\u0000-\u001F\u007F]/.test(value)) return fallback;
  return value;
}

