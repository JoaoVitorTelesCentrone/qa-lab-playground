import { describe, expect, test } from "bun:test";
import { countLinks, linkLabel, linkify } from "./evidence-text";

describe("texto da evidência", () => {
  test("texto sem link vira um segmento só", () => {
    expect(linkify("O saldo não bate.")).toEqual([{ type: "text", value: "O saldo não bate." }]);
  });

  test("separa o link do texto ao redor", () => {
    expect(linkify("Vídeo: https://loom.com/share/abc aqui")).toEqual([
      { type: "text", value: "Vídeo: " },
      { type: "link", value: "https://loom.com/share/abc", href: "https://loom.com/share/abc" },
      { type: "text", value: " aqui" },
    ]);
  });

  // O ponto final é da frase, não da URL — sem isso o link abre em 404.
  test("pontuação no fim da frase não entra no link", () => {
    const [, link, rest] = linkify("Veja https://exemplo.com/pagina.");
    expect(link).toEqual({ type: "link", value: "https://exemplo.com/pagina", href: "https://exemplo.com/pagina" });
    expect(rest).toEqual({ type: "text", value: "." });
  });

  test("acha mais de um link na mesma linha", () => {
    expect(countLinks("https://a.com e https://b.com")).toBe(2);
  });

  // O texto vai para uma página pública: esquema perigoso fica sendo texto.
  test("javascript: e data: não viram link", () => {
    expect(countLinks("javascript:alert(1) e data:text/html,<script>")).toBe(0);
  });

  test("não engole o parêntese que fecha a frase", () => {
    const segments = linkify("(veja https://exemplo.com)");
    expect(segments.some((item) => item.type === "link" && item.href === "https://exemplo.com")).toBe(true);
  });

  test("o rótulo tira o protocolo e corta o que é longo demais", () => {
    expect(linkLabel("https://www.exemplo.com/caso/")).toBe("exemplo.com/caso");
    expect(linkLabel(`https://exemplo.com/${"a".repeat(80)}`, 20).endsWith("…")).toBe(true);
  });

  test("texto vazio não produz segmento", () => {
    expect(linkify("")).toEqual([]);
  });
});
