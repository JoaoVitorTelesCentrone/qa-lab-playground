/**
 * Espelha `FEATURE_MENTORSHIP` do build testado. O CI e o script da suíte de
 * mentoria passam o mesmo valor para o build e para o Playwright.
 */
export const mentorshipEnabled = process.env.FEATURE_MENTORSHIP === "true";
