// Texto da evidência: transformar o que o aluno escreveu em algo navegável.
//
// O campo é livre e o placeholder convida a colar links (Loom, Drive, Jira).
// Renderizar tudo como texto puro deixava esses links mortos justamente na
// página que o recrutador abre. Aqui o texto vira segmentos, e quem renderiza
// decide a tag — assim a mesma regra serve para a página pública e para o
// histórico privado, sem duplicar parser em componente.
//
// Módulo puro: nada de React, para poder ser testado direto.

export type Segment = { type: "text"; value: string } | { type: "link"; value: string; href: string };

// Só http(s). `javascript:` e `data:` viram texto comum — o conteúdo vem do
// usuário e acaba numa página pública, então não existe motivo para confiar.
const URL_PATTERN = /\bhttps?:\/\/[^\s<>"')\]]+/gi;

/** Pontuação final quase sempre é da frase, não da URL: "veja https://x.com." */
function trimTrailingPunctuation(url: string): { href: string; rest: string } {
  const match = /[.,;:!?]+$/.exec(url);
  if (!match) return { href: url, rest: "" };
  return { href: url.slice(0, match.index), rest: match[0] };
}

/**
 * Quebra o texto em trechos comuns e links. Sempre devolve pelo menos um
 * segmento quando há conteúdo, para o chamador não precisar tratar vazio.
 */
export function linkify(text: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0;
    if (start > cursor) segments.push({ type: "text", value: text.slice(cursor, start) });

    const { href, rest } = trimTrailingPunctuation(match[0]);
    if (href) segments.push({ type: "link", value: href, href });
    if (rest) segments.push({ type: "text", value: rest });

    cursor = start + match[0].length;
  }

  if (cursor < text.length) segments.push({ type: "text", value: text.slice(cursor) });
  return segments;
}

/** Rótulo curto do link: domínio + caminho cortado, para não estourar a linha. */
export function linkLabel(href: string, max = 48) {
  let clean = href.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  if (clean.endsWith("/")) clean = clean.slice(0, -1);
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`;
}

/** Quantos links a evidência cita. Vira sinal de "tem prova externa junto". */
export function countLinks(text: string) {
  return linkify(text).filter((segment) => segment.type === "link").length;
}
