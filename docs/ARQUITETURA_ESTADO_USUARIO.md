# Arquitetura de estado por usuário — QA Lab

Como cada usuário tem uma experiência única sem duplicar o conteúdo autoral nem virar uma colcha de retalhos de `localStorage`.

## Decisões já tomadas

1. **Login protege o que persiste, não o experimentar.** O visitante anônimo pode jogar missões e cenários; o estado dele é **efêmero** — vive só na memória da página e some ao sair ou atualizar. Qualquer ação que *salvaria* (marcar missão resolvida, gravar resposta, mover uma story de verdade) exige login. Como o estado anônimo é descartável por design, **não há merge anônimo→logado** nem `localStorage` como fonte de verdade.
2. **Histórias usam overlay.** As stories são conteúdo autoral compartilhado; o estado do usuário (status que ele moveu) vive numa camada própria por cima.
3. **People Lab guarda histórico completo.** `people_attempts` é append-only: toda resposta vira uma linha, para mostrar a evolução do raciocínio ao longo do tempo (não é upsert da última).
4. **Dados locais existentes não são migrados.** Produto é pré-lançamento; o `localStorage` atual é descartado. (Reabrir só se quisermos um import opcional "trazer progresso deste navegador".)
5. **Este documento vem antes do código.**

## Princípio central: separar conteúdo de estado

A inconsistência atual nasce de misturar duas coisas diferentes no mesmo lugar. A regra:

| Tipo | Exemplos | Onde vive | Mutável? |
|------|----------|-----------|----------|
| **Conteúdo autoral** | stories do ExpenseFlow, missões de CI/CD, situações do People Lab | código/TS, versionado, com **id estável** | Não pelo usuário. Só por nós, centralmente. |
| **Estado do usuário** | status movido, resposta escrita, missão resolvida | Supabase, chave `(user_id, content_id)` | Sim, e isolado por usuário. |
| **Artefato do usuário** | bug report, test design, projeto, story criada do zero | Supabase, linhas que o usuário **possui** | Sim, criação/edição/remoção livre. |

Decorrências:

- **Overlay** (conteúdo compartilhado + estado por usuário) para tudo que é cenário autoral: Histórias, People Lab, CI/CD Lab.
- **Fork/posse** (linhas próprias do usuário) só para o que ele cria do zero: projetos, drafts, bug reports — que **já** funcionam assim.
- Atualizar/adicionar conteúdo autoral nunca quebra o dado de ninguém, porque o estado referencia o conteúdo por id, não copia o conteúdo.

## Estado atual (de onde partimos)

Já é por usuário (Supabase): `profiles`, `projects`, `drafts`, `favorites`, `mission_progress`, `playground_sessions`.

Ainda é local-only (`localStorage`, por navegador):

| Chave | Superfície | Natureza |
|-------|-----------|----------|
| `qa-lab-stories-v1` | Histórias (board) | estado (status) + artefato (stories criadas) |
| `qa-lab-people-attempts-v1` | People Lab | estado (respostas) |
| `qa-lab-cicd-progress-v1` | CI/CD Lab | estado (missões resolvidas) |
| `qa-lab-expenseflow-v1` | ExpenseFlow app | estado de sessão |
| `qa-lab-expenseflow-deliverables-v1` | Entregas do Playground | artefato (bugs, casos) |
| `qa-lab-free-missions` | progresso de missões | estado (já migra p/ `mission_progress`) |

Objetivo: mover as três primeiras (e os deliverables) para o Supabase por usuário, atrás de login.

## Camada de conteúdo (não muda de lugar)

O conteúdo autoral continua **em TypeScript versionado** (`lib/*`), por ser simples, sem migração e com histórico no git. O requisito é só um: **id estável** por item de conteúdo.

- Histórias: `key` (`EXP-101` …) — usar como id estável.
- People Lab: `id` (`daily-qa-001` …) — já estável.
- CI/CD Lab: `id` da missão — já estável.

Se um dia o catálogo crescer a ponto de precisar edição sem deploy, migra-se o conteúdo para tabelas; o modelo de estado abaixo não muda, porque já referencia por id.

## Schema proposto (Postgres / Supabase)

```sql
-- Overlay de status das Histórias (conteúdo autoral compartilhado)
create table story_states (
  user_id    uuid not null references auth.users(id) on delete cascade,
  story_id   text not null,            -- id estável da story autoral (ex.: 'EXP-101')
  status     text not null check (status in ('backlog','todo','progress','review','done')),
  updated_at timestamptz not null default now(),
  primary key (user_id, story_id)
);

-- Stories criadas pelo próprio usuário (artefato, não conteúdo)
create table user_stories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  key        text not null,
  title      text not null,
  description text,
  criteria   text[] not null default '{}',
  status     text not null default 'backlog',
  priority   text not null default 'media',
  points     int  not null default 3,
  created_at timestamptz not null default now()
);

-- People Lab: respostas (uma por tentativa)
create table people_attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null,
  response    text not null,
  created_at  timestamptz not null default now()
);

-- Deliverables do Playground (bug reports, casos, decisões E2E)
create table deliverables (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  kind       text not null,            -- 'bug' | 'bdd' | 'e2e' | ...
  payload    jsonb not null,
  created_at timestamptz not null default now()
);
```

**CI/CD Lab** reutiliza a `mission_progress` existente (genérica: `mission_id`, `status`), com `mission_id` namespaceado para evitar colisão com as missões free:

```
mission_id = 'cicd:anatomia-ordem', status = 'completed'
```

Evita mais uma tabela; o mapa de competências já lê de `mission_progress`.

### RLS — obrigatório

Cada tabela nova liga Row Level Security e restringe ao dono:

```sql
alter table story_states enable row level security;
create policy "own rows" on story_states
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- idem para user_stories, people_attempts, deliverables
```

Sem RLS, qualquer usuário leria o estado de qualquer outro. É o item inegociável do login obrigatório.

## Camada de acesso a dados

Segue o padrão que o app já usa:

- **Leitura inicial**: o `page.tsx` (server component) descobre a sessão e passa `authed` + o estado do usuário (vazio se anônimo) por props ao client. Não redireciona.
- **Escrita**: **server actions** (`"use server"`), uma por mutação, validando `auth.getUser()` e escrevendo a linha do usuário — como `lab/execution/actions.ts` e o workspace já fazem. O client só chama a action quando `authed`; anônimo atualiza em memória e mostra o CTA de login.
- O client nunca usa `localStorage` como fonte de verdade. Estado de digitação e estado anônimo ficam em `useState`; só persistem na submissão de um usuário logado.

Cada superfície ganha um módulo de acesso enxuto, ex.:

```
app/lab/historias/actions.ts
  getBoardState(userId) -> { states, userStories }
  setStoryStatus(storyId, status)
  createUserStory(input)
```

## Muro de login (na persistência, não na porta)

As páginas dos labs **não redirecionam** quem está deslogado. O padrão:

- O `page.tsx` (server) descobre se há sessão. Se houver, busca o estado do usuário e passa por props com `authed: true`. Se não houver (ou Supabase não configurado), renderiza o client com estado vazio e `authed: false` — **sem redirect**.
- O client roda normalmente. O estado anônimo vive em `useState` (efêmero).
- A mutação é que decide: numa ação que persiste,
  - `authed` → chama a server action, grava no Supabase, atualiza a UI;
  - anônimo → atualiza só em memória e dispara o **prompt "entre para salvar"** (CTA para `/login?next=<rota atual>`).

Assim o visitante experimenta o lab inteiro; o login aparece no momento em que faz sentido (guardar a evolução). Sem middleware bloqueando, sem merge.

> O `/lab` (workspace) continua exigindo login, porque ele **é** a área pessoal — não há o que experimentar ali sem conta.

## Transição por superfície

| Superfície | Hoje | Depois | Esforço |
|-----------|------|--------|---------|
| Histórias | `qa-lab-stories-v1` | `story_states` (overlay) + `user_stories` | M |
| People Lab | `qa-lab-people-attempts-v1` | `people_attempts` | S |
| CI/CD Lab | `qa-lab-cicd-progress-v1` | `mission_progress` (`cicd:` prefix) | S |
| Deliverables | `qa-lab-expenseflow-deliverables-v1` | `deliverables` | M |
| ExpenseFlow app | `qa-lab-expenseflow-v1` | estado de sessão efêmero — pode seguir local | — |

Sobre dados locais já existentes: como o produto é pré-lançamento, **não** há migração obrigatória. Opcional: um import único "trazer meu progresso deste navegador" na primeira visita logada. Decisão adiável.

## Fases de implementação

1. **Fundação**: criar as tabelas + RLS; helpers de acesso server-side; estender o guard de login.
2. **Piloto — CI/CD Lab** (menor superfície, estado simples): trocar `localStorage` por `mission_progress`. Valida o padrão ponta a ponta.
3. **People Lab**: respostas em `people_attempts`; histórico lê do Supabase.
4. **Histórias**: overlay `story_states` + `user_stories`; board renderiza conteúdo + overlay.
5. **Deliverables**: tabela própria; o mapa de competências passa a contar do Supabase, não do `localStorage`.
6. **Limpeza**: remover leitura de `localStorage` como fonte de verdade e a lógica de `qa-lab-cloud-migration`.

## Questões em aberto

- **Reset por usuário**: "refazer trilha" do CI/CD apaga as linhas `cicd:*` em `mission_progress` (preferido) — confirmado no design da action.
- **Conteúdo autoral em DB**: manter em TS por enquanto (recomendado) — revisitar só se precisar edição sem deploy.

_Resolvidas: People Lab append-only (histórico completo); sem migração do localStorage existente._

## Apêndice — DDL da fundação

Arquivo executável em `packages/web/supabase/migrations/0001_user_state.sql`. Cria `story_states`, `user_stories`, `people_attempts`, `deliverables` com RLS por dono. O CI/CD **não** entra aqui: reusa a `mission_progress` existente, então o piloto não depende desta migração.
