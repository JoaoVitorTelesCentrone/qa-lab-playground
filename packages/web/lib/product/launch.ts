/**
 * Lançamento enxuto: mantém Labs, Trilhas e os demais Ambientes no código
 * enquanto a experiência pública fica concentrada em conteúdo e ExpenseFlow.
 */
export const CONTENT_ONLY_LAUNCH = true;

export const LAUNCH_ENVIRONMENT = {
  label: "ExpenseFlow",
  route: "/playground/expenseflow",
} as const;

/** Sem contas, formulários, checkout ou persistência durante esta fase. */
export const VIEW_ONLY_LAUNCH = true;
