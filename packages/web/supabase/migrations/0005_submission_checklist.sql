-- Checklist de critérios de aceite na entrega de evidência.
-- Ver docs/PRODUCTIZATION_PLAN.md (Fase 2 — Primeiro loop de aprendizagem).
--
-- A avaliação automática exige que todos os critérios do Lab estejam marcados
-- para a evidência ser aceita; guardamos quais foram para o histórico mostrar
-- o que o aluno afirmou ter verificado.
--
-- Idempotente: pode rodar mais de uma vez.

alter table public.lab_submissions
  add column if not exists checklist jsonb not null default '[]'::jsonb;
