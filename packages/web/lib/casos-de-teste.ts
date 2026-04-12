import type {
  CasoTeste,
  StatusCasoTeste   as StatusCaso,
  SistemaCasoTeste  as SistemaCaso,
  TipoCasoTeste     as TipoCaso,
  PrioridadeCasoTeste as PrioridadeCaso,
} from "@qa-lab/shared";

// Re-export types with the short aliases the page uses
export type { CasoTeste, StatusCaso, SistemaCaso, TipoCaso, PrioridadeCaso };

// ── Display config ─────────────────────────────────────────────────────────────

export const statusConfig: Record<
  StatusCaso,
  { label: string; color: string; bg: string; border: string }
> = {
  nao_executado: {
    label: "Não executado",
    color: "text-off-white/50",
    bg:    "bg-off-white/5",
    border:"border-off-white/15",
  },
  passou: {
    label: "Passou",
    color: "text-neon",
    bg:    "bg-neon/10",
    border:"border-neon/25",
  },
  falhou: {
    label: "Falhou",
    color: "text-coral",
    bg:    "bg-coral/10",
    border:"border-coral/25",
  },
  bloqueado: {
    label: "Bloqueado",
    color: "text-[#F4A8A3]",
    bg:    "bg-[#F4A8A3]/10",
    border:"border-[#F4A8A3]/25",
  },
};

export const prioridadeConfig: Record<PrioridadeCaso, { label: string; dot: string }> = {
  alta:  { label: "Alta",  dot: "bg-coral" },
  media: { label: "Média", dot: "bg-[#F4A8A3]" },
  baixa: { label: "Baixa", dot: "bg-off-white/30" },
};

export const sistemaConfig: Record<SistemaCaso, { color: string; bg: string }> = {
  "API":         { color: "text-mint",       bg: "bg-mint/10" },
  "E-commerce":  { color: "text-[#F4A8A3]",  bg: "bg-[#F4A8A3]/10" },
  "Form Bugado": { color: "text-neon",        bg: "bg-neon/10" },
};

export const tipoConfig: Record<TipoCaso, { label: string }> = {
  funcional:    { label: "Funcional" },
  regressao:    { label: "Regressão" },
  smoke:        { label: "Smoke" },
  seguranca:    { label: "Segurança" },
  exploratorio: { label: "Exploratório" },
};

// ── API client ─────────────────────────────────────────────────────────────────

const BASE = "/api/casos";

export async function fetchCasos(): Promise<CasoTeste[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Erro ao carregar casos de teste");
  const json = await res.json();
  return json.data as CasoTeste[];
}

export async function criarCaso(
  data: Omit<CasoTeste, "id" | "criadoEm">
): Promise<CasoTeste> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar caso de teste");
  const json = await res.json();
  return json.data as CasoTeste;
}

export async function atualizarCaso(
  id: string,
  data: Partial<Omit<CasoTeste, "id" | "criadoEm">>
): Promise<CasoTeste> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar caso de teste");
  const json = await res.json();
  return json.data as CasoTeste;
}

export async function deletarCaso(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao apagar caso de teste");
}
