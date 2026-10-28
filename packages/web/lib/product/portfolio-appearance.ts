export const PORTFOLIO_LAYOUTS = [
  { id: "classic", label: "Clássico", description: "Apresentação direta, com projetos em uma coluna." },
  { id: "editorial", label: "Editorial", description: "Perfil ao lado dos trabalhos em telas amplas." },
  { id: "gallery", label: "Galeria", description: "Projetos em duas colunas, com espaço para as capas." },
  { id: "spotlight", label: "Destaque", description: "Perfil centralizado e foco no seu trabalho." },
  { id: "mosaic", label: "Mosaico", description: "Mais projetos lado a lado em telas amplas." },
] as const;

export const PORTFOLIO_PALETTES = [
  { id: "forest", label: "Floresta", background: "#16181c", foreground: "#f4f6f5", muted: "#b5bdb8", accent: "#8cdda5", card: "#20242a", border: "#454b53", onAccent: "#102118", scheme: "dark" },
  { id: "ocean", label: "Oceano", background: "#101c2c", foreground: "#f0f6ff", muted: "#b3c5df", accent: "#93c5fd", card: "#192b42", border: "#425b79", onAccent: "#10213a", scheme: "dark" },
  { id: "paper", label: "Papel", background: "#faf8f3", foreground: "#252820", muted: "#555c50", accent: "#285c40", card: "#ffffff", border: "#a4a99e", onAccent: "#ffffff", scheme: "light" },
  { id: "sunrise", label: "Amanhecer", background: "#fff7ed", foreground: "#29221d", muted: "#61554d", accent: "#8e3d24", card: "#ffffff", border: "#b7a899", onAccent: "#ffffff", scheme: "light" },
  { id: "amethyst", label: "Ametista", background: "#191525", foreground: "#f7f3ff", muted: "#c4b9d5", accent: "#d8b4fe", card: "#251f35", border: "#554767", onAccent: "#29143a", scheme: "dark" },
  { id: "slate", label: "Grafite", background: "#172126", foreground: "#f1f5f6", muted: "#b5c2c6", accent: "#80cbc4", card: "#202d33", border: "#4a5b61", onAccent: "#102a28", scheme: "dark" },
  { id: "ruby", label: "Rubi", background: "#231316", foreground: "#fff3f3", muted: "#cdb9bc", accent: "#ff8795", card: "#321d21", border: "#68434a", onAccent: "#351017", scheme: "dark" },
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
