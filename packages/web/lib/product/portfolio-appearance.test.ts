import { describe, expect, test } from "bun:test";
import { DEFAULT_PORTFOLIO_APPEARANCE, isPortfolioAppearance, normalizePortfolioAppearance, PORTFOLIO_LAYOUTS, PORTFOLIO_PALETTES } from "./portfolio-appearance";

function luminance(hex: string) {
  const values = hex.slice(1).match(/../g)!.map((part) => {
    const value = parseInt(part, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
function contrast(first: string, second: string) {
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe("aparência do portfólio", () => {
  test("rejeita CSS livre, valores desconhecidos, campos extras e dados incompletos", () => {
    for (const input of [null, [], {}, { layout: "classic" }, { layout: "classic", palette: "red" }, { layout: "url(javascript:alert(1))", palette: "forest" }, { layout: "classic", palette: "forest", css: "body{}" }]) {
      expect(isPortfolioAppearance(input)).toBe(false);
      expect(normalizePortfolioAppearance(input)).toEqual(DEFAULT_PORTFOLIO_APPEARANCE);
    }
    expect(isPortfolioAppearance({ layout: "gallery", palette: "paper" })).toBe(true);
  });

  test("cada paleta mantém contraste AA para texto, links, botões e foco", () => {
    for (const palette of PORTFOLIO_PALETTES) {
      for (const surface of [palette.background, palette.card]) {
        for (const text of [palette.foreground, palette.muted, palette.accent]) expect(contrast(text, surface)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(palette.accent, surface)).toBeGreaterThanOrEqual(3);
      }
      expect(contrast(palette.onAccent, palette.accent)).toBeGreaterThanOrEqual(4.5);
    }
  });
  test("todos os estilos oferecidos podem ser salvos", () => {
    for (const layout of PORTFOLIO_LAYOUTS) {
      for (const palette of PORTFOLIO_PALETTES) {
        expect(isPortfolioAppearance({ layout: layout.id, palette: palette.id })).toBe(true);
      }
    }
  });
});
