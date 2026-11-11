/**
 * Frontmatter mínimo dos posts em MDX: `chave: valor` por linha, strings com ou
 * sem aspas, listas `[a, b]` e booleanos. Sem dependência: os posts só usam isso.
 */
export type FrontmatterValue = string | boolean | string[];

export function parseFrontmatter(raw: string): { data: Record<string, FrontmatterValue>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, FrontmatterValue> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line.trim());
    if (!pair) continue;
    data[pair[1]] = parseValue(pair[2].trim());
  }
  return { data, body: raw.slice(match[0].length) };
}

const unquote = (value: string) => value.replace(/^(["'])([\s\S]*)\1$/, "$2");

function parseValue(value: string): FrontmatterValue {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.startsWith("[") && value.endsWith("]")) {
    return value.slice(1, -1).split(",").map((item) => unquote(item.trim())).filter(Boolean);
  }
  return unquote(value);
}

/** Minutos de leitura a ~200 palavras por minuto, sem contar marcação; mínimo 1. */
export function readingMinutes(body: string) {
  const text = body.replace(/```[\s\S]*?```/g, " ").replace(/<[^>]+>/g, " ").replace(/[#>*_`[\]()!-]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
