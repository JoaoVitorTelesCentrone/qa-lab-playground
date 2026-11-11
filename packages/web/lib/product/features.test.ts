import { describe, expect, test } from "bun:test";
import { isAccountPath, isMentorshipPath } from "./features";

test("contas ficam fora das rotas públicas sem fechar o Lab de login simulado", () => {
  for (const path of ["/login", "/cadastro", "/recuperar", "/auth/callback", "/perfil/portfolio"]) {
    expect(isAccountPath(path)).toBe(true);
  }
  for (const path of ["/labs/login", "/labs/101", "/api/auth/login", "/blog"]) {
    expect(isAccountPath(path)).toBe(false);
  }
});

describe("isMentorshipPath", () => {
  test("fecha a mentoria, planos, cursos pagos e as APIs de cobrança", () => {
    for (const path of [
      "/mentoria", "/mentoria/inscricao", "/mentoria/mentor/entregas/1", "/planos", "/planos/confirmacao",
      "/cursos", "/cursos/playwright", "/api/v1/mentorship/checkout", "/api/billing/mercado-pago/webhook",
      "/api/cron/mentorship-emails", "/portfolio/joao/mentoria/abc",
    ]) expect(isMentorshipPath(path)).toBe(true);
  });

  test("mantém abertas as bancadas de prática usadas por Labs públicos", () => {
    for (const path of ["/mentoria/labs/oraculo", "/mentoria/labs/requisitos", "/mentoria/performance"]) {
      expect(isMentorshipPath(path)).toBe(false);
    }
  });

  test("não confunde rotas vizinhas", () => {
    for (const path of ["/", "/labs", "/labs/101", "/conteudo", "/portfolio/joao", "/mentorias-antigas", "/cursosx", "/api/v1/me"]) {
      expect(isMentorshipPath(path)).toBe(false);
    }
  });
});
