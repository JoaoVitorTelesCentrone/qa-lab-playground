export const PORTFOLIO_LAYOUTS = [
  { id: "classic", label: "Clássico", description: "Apresentação direta, com projetos em uma coluna." },
  { id: "editorial", label: "Editorial", description: "Perfil ao lado dos trabalhos em telas amplas." },
  { id: "gallery", label: "Galeria", description: "Projetos em duas colunas, com espaço para as capas." },
] as const;

export const PORTFOLIO_PALETTES = [
  { id: "forest", label: "Floresta", background: "#16181c", foreground: "#f4f6f5", muted: "#b5bdb8", accent: "#8cdda5", card: "#20242a", border: "#454b53", onAccent: "#102118", scheme: "dark" },
  { id: "ocean", label: "Oceano", background: "#101c2c", foreground: "#f0f6ff", muted: "#b3c5df", accent: "#93c5fd", card: "#192b42", border: "#425b79", onAccent: "#10213a", scheme: "dark" },
  { id: "paper", label: "Papel", background: "#faf8f3", foreground: "#252820", muted: "#555c50", accent: "#285c40", card: "#ffffff", border: "#a4a99e", onAccent: "#ffffff", scheme: "light" },
] as const;

export type PortfolioAppearance = {
  layout: typeof PORTFOLIO_LAYOUTS[number]["id"];
  palette: typeof PORTFOLIO_PALETTES[number]["id"];
};

export const DEFAULT_PORTFOLIO_APPEARANCE: PortfolioAppearance = { layout: "classic", palette: "forest" };

export function isPortfolioAppearance(value: unknown): value is PortfolioAppearance {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return Object.keys(item).length === 2
    && PORTFOLIO_LAYOUTS.some((layout) => layout.id === item.layout)
    && PORTFOLIO_PALETTES.some((palette) => palette.id === item.palette);
}

export function normalizePortfolioAppearance(value: unknown): PortfolioAppearance {
  return isPortfolioAppearance(value) ? { layout: value.layout, palette: value.palette } : { ...DEFAULT_PORTFOLIO_APPEARANCE };
}
