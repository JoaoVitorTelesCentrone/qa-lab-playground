export const PASSWORD_MIN_LENGTH = 8;

const ALLOWED_SYMBOLS = "!@#$%^&*()_+-=[]{};'\\:\"|<>?,./`~";

export const PASSWORD_CRITERIA = [
  { id: "length", label: `${PASSWORD_MIN_LENGTH} caracteres ou mais` },
  { id: "lowercase", label: "Uma letra minúscula" },
  { id: "uppercase", label: "Uma letra maiúscula" },
  { id: "number", label: "Um número" },
  { id: "symbol", label: "Um símbolo" },
] as const;

export type PasswordCriterionId = (typeof PASSWORD_CRITERIA)[number]["id"];

export function evaluatePassword(password: string): Record<PasswordCriterionId, boolean> {
  return {
    length: password.length >= PASSWORD_MIN_LENGTH,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: [...password].some((character) => ALLOWED_SYMBOLS.includes(character)),
  };
}

export function passwordMeetsRequirements(password: string) {
  return Object.values(evaluatePassword(password)).every(Boolean);
}
