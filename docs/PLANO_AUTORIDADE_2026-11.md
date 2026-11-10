# Plano: de mentoria para autoridade (2026-11)

Objetivo: o site prova publicamente que João Centrone é referência em QA. Quem visita
sai sabendo quem construiu o QA Lab e com vontade de acompanhar o trabalho dele.

## Regras

- Nada de apagar dados nem rodar migration destrutiva. A mentoria sai da navegação e
  das rotas públicas por feature flag (`FEATURE_MENTORSHIP=false`); código e tabelas ficam.
- Um commit pequeno por etapa, com mensagem clara.
- O CI precisa terminar verde. Antes de cada commit: lint, typecheck, testes e build.
- Para validar como o CI, rode o build e os smoke tests **sem** `packages/web/.env.local`
  (no CI não existe env; com Supabase configurado várias páginas viram dinâmicas e
  escondem erros de pré-renderização).

## Inventário (auditoria de 2026-11-09)

**Stack:** monorepo Bun (`packages/web` com Next 16.4, React 19 e Tailwind 4). Banco
Supabase com SQL puro em `packages/web/supabase/migrations` (sem Drizzle). Deploy na
Vercel. O `proxy.ts` não tem gate: todas as rotas são públicas.

**Rotas (cerca de 234 páginas)**
- Labs e prática: `/labs`, `/labs/[number]` (164 Labs), `/labs/desafios`, `/playground/*`,
  `/shop/*`, `/financas`, `/agendamentos`, `/crm`, `/api-playground`, `/test-suite`, `/boards`
- Conteúdo: `/blog`, `/blog/[slug]`, `/pesquisa`, `/ferramentas/*`, `/estudos/*`,
  `/cursos/*`, `/trilhas/*`, `/conteudo/*` ("Caminho")
- Conta e portfólio: `/login`, `/cadastro`, `/recuperar`, `/perfil/*`,
  `/portfolio/[username]`, `/lab/*`, `/certificado/[code]`
- Já existem: `app/sitemap.ts`, `app/robots.ts`, `lib/product/og.tsx`

**Mentoria e monetização**
- Páginas: `/mentoria/*` (cerca de 30), `/portfolio/[username]/mentoria/[caseId]`,
  `/planos` (QA Lab Pro, com preço) e `/cursos` (com preço)
- APIs: `/api/v1/mentorship/*` (cerca de 30), `/api/billing/mercado-pago/{checkout,webhook}`,
  `/api/cron/mentorship-emails`
- Código: `lib/mentorship`, `components/mentorship`, `lib/billing`
- CTAs: link "Mentoria" no header (`components/layout/site-header.tsx`); links para
  `/planos` e `/mentoria` no footer (`components/layout/site-footer.tsx`)
- Tabelas: `mentorship_*` (20) e `billing_purchases`
- Migrations: `0014`, `0024`–`0029` e as `202610*` de mentoria
- Workflows: `mentorship-emails.yml` (cron, desligado por variável do repo) e o job
  "Mentorship v2" do `quality.yml`

**Diferenças entre o pedido e o que já existe**
- `?bug=` só funciona no checkout da loja (`?bug=wrong-total`) e no API Lab. Os bugs
  plantados ligam pela flag da conta (`activeBugs`). Vamos generalizar em cima disso.
- Trilhas: hoje são só `"UI Automation" | "API e Contrato"` (`lib/playground/catalog.ts`).
  Faltam as 6 trilhas novas.
- O gerador de post do LinkedIn existe (`linkedInPost()` em `lib/product/case.ts`), mas é
  por caso, não por Lab.
- O export em Markdown por Lab não foi encontrado. Confirmar na etapa 4.
- O blog é escrito em TypeScript (`lib/blog-posts.ts`, `lib/blog-editorial/*`), só em PT.
- Fontes atuais: Inter e JetBrains Mono. Analytics: nenhum.
- Não estão no repo: foto, CV em PDF e dados do BIST.

## Etapas

| # | Etapa | Status |
|---|-------|--------|
| 0 | Consertar o CI | ✅ feito |
| 1 | Flag `FEATURE_MENTORSHIP` | ✅ feito |
| 2 | Identidade de autor | ✅ feito |
| 3 | Home nova | pendente |
| 4 | `/labs` por trilha | pendente |
| 5 | `/desafio` | ✅ feito |
| 6 | Blog em MDX, PT e EN | pendente |
| 7 | `/referencias`, `/projetos` e `/sobre` | parcial (`/sobre` mínimo) |
| 8 | SEO e OG images | pendente |
| 9 | Analytics | pendente |
| 10 | Suíte E2E de autoridade | pendente |

### 0. Consertar o CI ✅

- **Causa:** o step Build quebrava desde pelo menos 15 commits, com
  `useSearchParams() should be wrapped in a suspense boundary at page "/labs"`.
  O erro vinha de `components/labs/lab-catalog.tsx`. Sem env, `getSessionUser()` não
  toca em cookies, `/labs` é pré-renderizada como estática e o Next aborta. Localmente
  passava porque o `.env.local` torna a página dinâmica.
- **Correção:** `app/labs/page.tsx` lê `?pagina` de `searchParams` e passa
  `initialPage` ao catálogo. A lista continua renderizada no servidor, sem fallback
  vazio de Suspense.
- **Validado sem env:** build ok, lint ok, 411 testes unitários e 23 smoke E2E passando.
  Os smoke tests nunca tinham rodado no CI, porque o build quebrava antes.

### 1. Flag `FEATURE_MENTORSHIP` (padrão `false`) ✅

- **Ponto único:** `lib/product/features.ts`, com `MENTORSHIP_ENABLED` e
  `isMentorshipPath()` (testado em `features.test.ts`). A flag é embutida no build pelo
  `env` do `next.config.ts`, então servidor, proxy e componentes de cliente leem o
  mesmo valor. Mudar a flag exige um novo deploy.
- **Rotas fechadas com a flag desligada:** `/mentoria/*`, `/planos`, `/cursos`,
  `/portfolio/*/mentoria/*`, `/api/v1/mentorship/*`, `/api/billing/*` e
  `/api/cron/mentorship-emails`. O `proxy.ts` responde 404: as páginas mostram o
  not-found do site e as APIs devolvem JSON.
- **Exceção:** `/mentoria/labs/*` e `/mentoria/performance` continuam abertas. São
  bancadas de prática usadas por Labs públicos (159–164 e os do Broto). Na etapa 4,
  avaliar mover essas bancadas para fora de `/mentoria`.
- **Saíram da experiência pública:**
  - "Mentoria" no header (desktop e mobile); "Planos" e "Mentoria" no footer.
  - "Conhecer a mentoria" no Lab e na trilha.
  - "Minha mentoria" no Caminho.
  - A entrega com feedback do mentor nos capítulos.
  - O CTA do catálogo pago em `/estudos`.
  - "Cases da mentoria" no portfólio.
  - As rotas fechadas foram filtradas do `sitemap.ts`.
- **Textos neutralizados:** "Revisão de mentor" (Labs CI/CD e Pessoas), a descrição do
  Caso Broto e a de `/ferramentas`.
- **Testes:**
  - `tests/e2e/mentorship-flag.e2e.ts` (smoke) cobre: rotas e APIs 404, bancadas
    abertas e navegação sem mentoria.
  - Os smoke tests de inscrição só rodam com a flag ligada.
  - `scripts/test-mentorship-local.ts` (job "Mentorship v2") liga a flag.
- **Validado:**
  - Flag desligada, sem env: build ok; smoke com 30 passando e 2 pulados.
  - Flag ligada: build ok; smoke com 23 passando e 9 pulados.
- **Pendências:**
  - Na Vercel não há nada a fazer: sem a variável, a mentoria some no próximo deploy.
  - O workflow `mentorship-emails.yml` precisa continuar com
    `MENTORSHIP_EMAIL_WORKER_ENABLED` diferente de `true` enquanto a flag estiver
    desligada, porque o endpoint agora responde 404.
  - O `/conteudo` (Caminho) segue público, sem mentoria. Decidir na etapa 3 se sai
    da navegação.

### 2. Identidade de autor ✅

- **`packages/web/content/site.ts`:** arquivo editável com nome, título, bio curta,
  foto, LinkedIn, GitHub, CV e `SITE_URL`. Os TODOs do João estão marcados ali.
- **Fontes:** Plus Jakarta Sans no texto do site inteiro (substitui a Inter) e Anton
  em `.font-display`. As duas são carregadas por `next/font` em `app/layout.tsx`.
  - As variáveis de fonte ficam no `<html>`, e o `:root` define `--font-display`.
  - Antes, `--font-display` apontava para si mesma e nenhuma fonte de destaque
    carregava. Isso afetava inclusive o not-found e a sidebar.
- **Destaque âmbar:** token `--gold` (`#F5B841`), usado nas utilities `text-gold`,
  `border-gold` e `bg-gold`.
- **Componentes:**
  - `components/authority/byline.tsx`: "Built by João Centrone", com foto e link
    para `/sobre`.
  - `components/authority/share-on-linkedin.tsx`: tem `data-event="share"` para a
    etapa 9.
  - A lógica de compartilhar fica em `lib/authority/share.ts`, com teste.
- **Onde já aparecem:**
  - Em todo Lab (`lab-briefing.tsx`): byline e share.
  - Em todo post: "Written by" e share.
  - O post agora é atribuído a João Centrone na metadata e no JSON-LD, como
    `Person`, com `sameAs` apontando para LinkedIn e GitHub.
- **`/sobre` mínimo:** em inglês, com título, bio curta e links, mais o CV quando
  `author.cv` existir. Entrou no sitemap para a byline não apontar para um 404.
- **Testes:** `tests/e2e/authority.e2e.ts` (smoke) cobre a byline e o share no Lab,
  a byline no post e os links do `/sobre`.
- **Validado sem env:** build ok; smoke com 33 passando e 2 pulados. Screenshots
  conferidos em `/labs/101` (desktop e mobile), num post e no `/sobre`.
- **Pendências do João:**
  - Foto real (hoje é um monograma SVG em `public/author/joao-centrone.svg`).
  - CV em PDF, colocado em `public/cv/`.
  - Confirmar o GitHub.

### 3. Home

- Hero: "Hands-on QA labs with real bugs, built by a QA Automation Engineer", com nome,
  foto e os CTAs "Start a lab" e "Weekly challenge".
- Abaixo: Labs em destaque, desafio da semana, último post e projetos.

### 4. `/labs` por trilha

- Trilhas: UI, API, Exploratório, Produto, CI e Não-funcionais. Todos os Labs ganham
  uma trilha.
- `?bug=` padronizado em todos os Labs, ligando os bugs plantados.
- Export de relatório em Markdown.
- Byline e "Share on LinkedIn" em cada Lab, reaproveitando `linkedInPost()`.

### 5. `/desafio` ✅

- **Dados:** `packages/web/content/challenge.json`, trocado toda semana. Campos:
  título, resumo, `bugCount`, Lab, endpoints, passos, `solutionReleaseAt` e gabarito.
- **Lógica:** `lib/authority/challenge.ts` com `isSolutionReleased()`, testado. Um
  teste também trava a coerência do arquivo: o gabarito tem `bugCount` itens.
- **`/desafio`:** página em inglês com byline, share, "Open the lab" e a data em que a
  solução abre.
- **`/desafio/solucao`:** responde 404 antes de `solutionReleaseAt`. As duas páginas
  são dinâmicas, então a data é avaliada a cada requisição.
- **Primeiro desafio (2026-W46):** "Find the 4 bugs in the QA Lab API", no modo
  `?scenario=bug`. Os 4 bugs foram conferidos com curl contra o servidor, comparando o
  modo bugado com o correto:
  - `GET /api/users/999` responde 200 em vez de 404.
  - O POST de usuário perde `telefone` e `cargo`.
  - O DELETE de produto responde 204 sem apagar nada.
  - O health diz `healthy` com o banco `down`.
- Saiu o redirect legado `/desafio → /lab` do `next.config.ts`. Ele era permanente,
  então navegadores que já o visitaram podem ter o 308 em cache.
- **Testes:** `tests/e2e/challenge.e2e.ts` (smoke). Eles leem a mesma config do app,
  então continuam válidos depois da liberação.

### 6. Blog em MDX

- Posts em `content/blog/<slug>.<pt|en>.mdx`, com tag, data e tempo de leitura.
- Os posts atuais em TypeScript continuam renderizando por um adaptador.
- Byline, share e schema Article em cada post.

### 7. `/referencias`, `/projetos` e `/sobre`

- `/referencias` lê `content/references.json` e linka `/pesquisa`.
- `/projetos` lê `content/projects.json` (BIST e QA Lab Playground).
- `/sobre` em inglês: "QA Automation Engineer", bio, stack, LinkedIn, GitHub e CV.

### 8. SEO

- Metadata e canonical por página, sitemap atualizado, `robots.txt`.
- Schema.org Person e Article.
- OG images via `next/og` por Lab e por post.

### 9. Analytics

- Sem cookies invasivos.
- Eventos `start_lab`, `bug_found` e `share`.

### 10. Suíte E2E de autoridade

Cenários, todos rodando no CI:
- a home carrega com a byline;
- `/labs` lista as trilhas;
- um Lab com `?bug=1` mostra o defeito e sem `?bug` mostra o correto;
- `/projetos` mostra o BIST;
- `/sobre` tem os links do LinkedIn e do GitHub;
- as rotas de mentoria dão 404 com a flag desligada.

## Decisões em aberto

1. **Idioma.** Sugestão: interface em EN e conteúdo dos Labs em PT. Alternativa: site
   em PT, com só o hero e o `/sobre` em EN.
2. **O resto do site.** `/planos` e `/cursos` já foram para trás da flag (etapa 1).
   Falta decidir o destino de `/conteudo`, `/trilhas`, `/ferramentas`, dos ambientes, do
   workspace `/lab` e do login. Sugestão: saem da navegação, mas as rotas ficam.
3. **Analytics.** No Vercel Analytics, eventos customizados exigem o plano Pro. No
   Plausible há eventos em todos os planos, mas é pago.
4. **Materiais do João.** Foto, CV em PDF, dados do BIST (descrição, stack, demo e
   GitHub) e confirmação do GitHub (`github.com/JoaoVitorTelesCentrone`).

## Arquivos de conteúdo editáveis (previstos)

- `content/site.ts`: autor e links
- `content/projects.json`: projetos
- `content/references.json`: referências
- `content/challenge.json`: desafio da semana
- `content/blog/*.mdx`: posts
