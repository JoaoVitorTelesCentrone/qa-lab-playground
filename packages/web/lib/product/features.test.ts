import { describe, expect, test } from "bun:test";
import { isAccountPath, isLabPath, isMentorshipPath } from "./features";

test("fecha as rotas de prática sem atingir conteúdo editorial", () => {
  for (const path of ["/labs", "/labs/101", "/labs/login", "/lab", "/lab/bdd", "/trilhas", "/desafio", "/conteudo", "/mentoria/labs/oraculo", "/mentoria/performance", "/boards", "/api/v1/submissions"]) {
    expect(isLabPath(path)).toBe(true);
  }
  for (const path of ["/", "/blog", "/sobre", "/ferramentas", "/api/auth/login"]) {
    expect(isLabPath(path)).toBe(false);
  }
});

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
