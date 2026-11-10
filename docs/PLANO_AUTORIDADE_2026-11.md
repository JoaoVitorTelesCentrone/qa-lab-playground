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
| 1 | Flag `FEATURE_MENTORSHIP` | pendente |
| 2 | Identidade de autor | pendente |
| 3 | Home nova | pendente |
| 4 | `/labs` por trilha | pendente |
| 5 | `/desafio` | pendente |
| 6 | Blog em MDX, PT e EN | pendente |
| 7 | `/referencias`, `/projetos` e `/sobre` | pendente |
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

### 1. Flag `FEATURE_MENTORSHIP` (padrão `false`)

- Fica num ponto único, `lib/product/launch.ts`, lendo `process.env.FEATURE_MENTORSHIP`.
- Com a flag desligada, o `proxy.ts` devolve 404 para `/mentoria/*`,
  `/portfolio/*/mentoria/*`, `/api/v1/mentorship/*`, `/api/billing/*` e
  `/api/cron/mentorship-emails`. `/planos` e `/cursos` entram também se o João confirmar.
- Saem os links de header e footer e os textos de mentor/mentorado das páginas públicas.
- O job "Mentorship v2" do CI roda com `FEATURE_MENTORSHIP=true`. Os smoke tests de
  mentoria saem da tag `@smoke` ou rodam só com a flag ligada.
- Teste E2E: rotas de mentoria respondem 404 com a flag desligada.

### 2. Identidade de autor

- `content/site.ts` com nome, título, LinkedIn (`linkedin.com/in/joao-centrone`),
  GitHub, foto e CV.
- Fontes Anton e Plus Jakarta Sans, fundo escuro e destaque âmbar.
- Componentes `<Byline>` ("Built by João Centrone", com foto e link para `/sobre`) e
  `<ShareOnLinkedIn>`.

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

### 5. `/desafio`

- Lê `content/challenge.json` (semana, Labs, N bugs, `solutionReleaseAt`).
- A página de solução só abre depois de `solutionReleaseAt`.

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
2. **O resto do site.** Destino de `/planos`, `/cursos`, `/conteudo`, `/trilhas`,
   `/ferramentas`, dos ambientes, do workspace `/lab` e do login. Sugestão:
   `/planos` e `/cursos` atrás da flag; o resto sai da navegação, mas as rotas ficam.
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
