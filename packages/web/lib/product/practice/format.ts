// Formatação compartilhada pelos ambientes de prática.
//
// Fica separada da interface porque o texto exibido faz parte do oráculo: o
// aluno compara o que a tela mostra com o que o cenário espera, então a mesma
// regra de formatação precisa valer nas quatro superfícies.

import type { FieldSpec } from "./resources";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Comparação de texto sem acento e sem caixa, para busca e filtro. */
export const fold = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

export function money(value: number | string | null | undefined) {
  const numeric = Number(value ?? 0);
  return brl.format(Number.isFinite(numeric) ? numeric : 0);
}

export const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export function weekdayName(weekday: number | string) {
  return weekdays[Number(weekday)] ?? "—";
}

/** `2026-08-18` → `18/08/2026`. Sem `new Date`, que desloca por fuso. */
export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const [year, month, day] = String(value).slice(0, 10).split("-");
  return day && month && year ? `${day}/${month}/${year}` : String(value);
}

/** `14:00:00` → `14:00`. O Postgres devolve segundos que não interessam aqui. */
export function formatTime(value: string | null | undefined) {
  return value ? String(value).slice(0, 5) : "—";
}

/** Dia da semana de uma data ISO, sem passar por fuso horário. */
export function weekdayOf(date: string) {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** Texto de uma célula da tabela genérica, a partir do tipo do campo. */
export function formatField(spec: FieldSpec, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  switch (spec.type) {
    case "number":
      if (spec.options) return spec.options[String(value)] ?? String(value);
      return spec.money ? money(Number(value)) : String(value);
    case "date":
      return formatDate(String(value));
    case "time":
      return formatTime(String(value));
    case "boolean":
      return value ? "Sim" : "Não";
    case "enum":
      return spec.optionLabels?.[String(value)] ?? String(value);
    default:
      return String(value);
  }
}
