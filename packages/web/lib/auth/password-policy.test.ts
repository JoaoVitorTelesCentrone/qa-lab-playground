import { describe, expect, test } from "bun:test";
import { evaluatePassword, passwordMeetsRequirements } from "./password-policy";

describe("password policy", () => {
  test("accepts a password that meets every visible criterion", () => {
    expect(passwordMeetsRequirements("Qualidade1!")).toBe(true);
  });

  test("reports each missing criterion", () => {
    expect(evaluatePassword("abc")).toEqual({
      length: false,
      lowercase: true,
      uppercase: false,
      number: false,
      symbol: false,
    });
  });

  test("accepts every symbol supported by Supabase", () => {
    for (const symbol of "!@#$%^&*()_+-=[]{};'\\:\"|<>?,./`~") {
      expect(passwordMeetsRequirements(`Abcdef1${symbol}`)).toBe(true);
    }
  });
});
