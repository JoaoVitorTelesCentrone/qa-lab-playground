// Seções livres do portfólio: regras de conteúdo e de ordem.
//
// Módulo puro — o mesmo limite vale no editor (que avisa antes) e na API (que
// é quem realmente corta). Nenhuma regra mora só no navegador.

export type PortfolioSection = {
  id: string;
  title: string;
  body: string;
  position: number;
  visible: boolean;
};

/** Uma página de portfólio, não um blog: título curto, corpo de alguns parágrafos. */
export const SECTION_LIMITS = { title: 60, body: 2000, max: 12 } as const;

export function normalizeSectionTitle(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, SECTION_LIMITS.title);
}

/** Preserva as quebras de linha (o corpo é renderizado com whitespace-pre-line). */
export function normalizeSectionBody(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, SECTION_LIMITS.body);
}

export function sortSections(sections: PortfolioSection[]): PortfolioSection[] {
  return [...sections].sort((a, b) => a.position - b.position || a.title.localeCompare(b.title, "pt-BR"));
}

/** O que a página pública mostra: seção ligada e com algum conteúdo. */
export function visibleSections(sections: PortfolioSection[]): PortfolioSection[] {
  return sortSections(sections).filter((section) => section.visible && section.body.trim().length > 0);
}

/**
 * Reordena `id` em `delta` posições e devolve a lista de ids na ordem nova —
 * é isso que a API grava. Fora dos limites, devolve a ordem atual.
 */
export function moveSection(sections: PortfolioSection[], id: string, delta: number): string[] {
  const ordered = sortSections(sections);
  const from = ordered.findIndex((section) => section.id === id);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= ordered.length) return ordered.map((section) => section.id);
  const next = [...ordered];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next.map((section) => section.id);
}

/**
 * A tabela nasceu na migração 0011 e as migrações sobem à mão: enquanto ela não
 * existe, o produto abre sem as seções em vez de estourar. Mesma política do
 * `github_url` em lib/product/profile-columns.ts.
 */
export function isMissingTable(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return error.code === "42P01" || error.code === "PGRST205" || Boolean(error.message?.includes("portfolio_sections"));
}
