const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const shortMonths = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

function parseDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

/** Data editorial longa, usada no artigo: "28 de outubro de 2026". */
export function formatDate(date: string) {
  return longDateFormatter.format(parseDate(date));
}

/**
 * Data curta para cards: "28 out 2026". Formatação manual para o mesmo texto
 * sair no servidor e no cliente — o card é um componente de cliente e não pode
 * depender de diferenças de ICU entre Node e navegador.
 */
export function formatShortDate(date: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (!match) return date;
  const [, year, month, day] = match;
  return `${day} ${shortMonths[Number(month) - 1] ?? month} ${year}`;
}
