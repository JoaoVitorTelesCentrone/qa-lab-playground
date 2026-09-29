/** O lançamento público começa com um único Lab no ExpenseFlow. */
export const SINGLE_LAB_LAUNCH = true;

/** Superfícies futuras ficam fora do lançamento público. */
export const CONTENT_ONLY_LAUNCH = true;
export const VIEW_ONLY_LAUNCH = true;

export const LAUNCH_ENVIRONMENT = {
  label: "ExpenseFlow",
  route: "/playground/expenseflow",
} as const;

export const LAUNCH_LAB = {
  label: "ExpenseFlow Challenge",
  route: "/playground",
  duration: "60 min",
  outcome: "investigar riscos, documentar bugs e criar a base de regressão",
} as const;
