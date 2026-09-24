# QA Lab

Plataforma de prática de QA com aplicações que simulam produtos reais, Labs guiados, entrega de evidências e acompanhamento de evolução. O conteúdo está em português e é desenvolvido neste monorepo Next.js + Bun.

## Estado do lançamento

O catálogo público libera três Labs de Finanças. Os demais desafios e ambientes estão no código, mas não fazem parte da vitrine ativa. Rotas de Labs ainda não liberados encaminham para a lista de interesse; evidências e anexos também são bloqueados no servidor.

O estado do produto, decisões e pendências estão em [`docs/PRODUCTIZATION_PLAN.md`](docs/PRODUCTIZATION_PLAN.md), [`docs/QA_LAB_DECISIONS.md`](docs/QA_LAB_DECISIONS.md) e [`docs/QA_LAB_PRODUCT_PLAN.md`](docs/QA_LAB_PRODUCT_PLAN.md).

## Rodar localmente

Requisitos: Bun 1.x ou Node.js 20+.

```bash
bun install
bun run dev:web
```

Acesse `http://localhost:3000` (ou a porta exibida pelo script de desenvolvimento).

## Rotas principais

- `/` — página inicial e jornada do aluno.
- `/labs` — catálogo de Labs liberados.
- `/labs/:number` — briefing, ambiente de prática e entrega de evidência; Labs agendados vão para a lista de interesse.
- `/trilhas` — percursos de aprendizagem.
- `/playground/*` e `/shop/*` — microdesafios e QA Lab Shop.
- `/financas`, `/agendamentos` e `/crm` — ambientes de prática.
- `/api-playground` e `/api/docs` — exploração e documentação da API de treino.
- `/lab/*` — workspace, CI/CD, People Lab, design de testes, triagem e logs.
- `/boards` — board Kanban/Scrum pessoal e demonstração pública.
- `/perfil` e `/portfolio/:username` — progresso e portfólio.

## Desenvolvimento e verificação

```bash
bun test packages/web
bun run lint
bun run build
```

O Supabase é usado para autenticação, progresso, evidências e dados persistentes. As migrações do produto ficam em `packages/web/supabase/migrations`; confirme a aplicação no projeto Supabase antes de validar fluxos autenticados ou publicar. Configure as variáveis usando `packages/web/.env.example`.

`packages/api` é uma API alvo para exercícios. A API de produto vive nas rotas `/api/v1/*` de `packages/web`.
