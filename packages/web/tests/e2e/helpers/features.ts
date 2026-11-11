/**
 * Espelha `FEATURE_MENTORSHIP` do build testado. O CI e o script da suíte de
 * mentoria passam o mesmo valor para o build e para o Playwright.
 */
export const mentorshipEnabled = process.env.FEATURE_MENTORSHIP === "true";
export const accountsEnabled = mentorshipEnabled || process.env.FEATURE_ACCOUNTS === "true";
export const labsEnabled = process.env.FEATURE_LABS === "true";
