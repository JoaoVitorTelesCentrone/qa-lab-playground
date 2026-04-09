# QA Lab Playground — Resumo do Projeto

## O que é

Plataforma educacional para profissionais de QA evoluírem em **automação de testes** praticando contra sistemas propositalmente quebrados. O objetivo não é teoria — é escrever testes reais que provam bugs reais.

**Público-alvo:**
- **Perfil A** — QA iniciante aprendendo Playwright/Cypress do zero
- **Perfil B** — QA com base, quer praticar cenários específicos (API, E2E, segurança)

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS 4, shadcn/ui |
| Backend (API alvo) | Hono rodando no Bun |
| Monorepo | Bun workspaces (`packages/web`, `packages/api`, `packages/shared`) |
| Infraestrutura | Docker + docker-compose |

Rodar localmente: `docker-compose up`

---

## Estrutura atual da plataforma

### Páginas ativas na navegação

| Rota | Página | Status |
|---|---|---|
| `/` | Dashboard | Ativo |
| `/missoes` | Missões | Ativo — core da plataforma |
| `/alvos` | Alvos | Ativo — documentação dos sistemas |
| `/api-playground` | API Playground | Ativo |
| `/blog` | Blog QA Lab | Ativo |
| `/roadmap` | Roadmap | Ativo |

### Páginas existentes mas fora da navegação

| Rota | Página | Situação |
|---|---|---|
| `/ecommerce` | Loja E-commerce | Existe, referenciada em Alvos |
| `/form-bugado` | Formulário com bugs | Existe, referenciada em Alvos |
| `/cenarios` | Gerenciador de test plans | Comentado — substituído por Missões |
| `/ecommerce/board` | Kanban de tarefas | Comentado — removido da navegação |
| `/pdca` | Análise PDCA | Comentado — em avaliação |
| `/datas` | Módulo de Datas | Comentado — em avaliação |
| `/desafios` | Desafios gamificados | Comentado — em avaliação |

---

## Os dois pilares da plataforma

### 1. Missões (`/missoes`)

O coração do lab. Cada missão tem um bug real para provar com automação.

**Estrutura de uma missão:**
- Número + nível de dificuldade (Iniciante / Intermediário)
- Objetivo claro: "prove que X acontece"
- Alvo identificado: qual sistema atacar (API, E-commerce, Form)
- Ferramentas sugeridas: Playwright, Cypress, K6
- Dica expansível: como abordar o problema
- Snippet expansível: código de exemplo para adaptar e rodar

**Missões disponíveis:**

| # | Nível | Título | Alvo |
|---|---|---|---|
| 01 | Iniciante | O DELETE que não deleta | API |
| 02 | Iniciante | O health check mentiroso | API |
| 03 | Iniciante | Paginação que pula itens | API |
| 04 | Iniciante | O formulário com 5 bugs | Form Bugado |
| 05 | Intermediário | Contrato de resposta inconsistente | API |
| 06 | Intermediário | Carrinho sem validação de estoque | E-commerce |
| 07 | Intermediário | Login sem rate limiting | API |
| 08 | Intermediário | Suite de smoke da API | API |

**Fluxo do iniciante:** lê objetivo → expande dica → expande snippet → adapta → roda o teste → vê falhar → bug confirmado

**Fluxo do intermediário:** lê objetivo → escreve do zero → usa snippet só pra conferir

---

### 2. Alvos (`/alvos`)

Documentação dos sistemas que o QA vai testar. Organizado em três tabs:

#### API
10 endpoints documentados com:
- Método HTTP + path
- Descrição do que faz
- Bug conhecido (o que está errado e deve ser provado)

Bugs mapeados na API:
- `GET /api/health` — reporta healthy mesmo quando falhando
- `GET /api/users` — paginação inconsistente, itens repetidos
- `POST /api/users` — descarta campos silenciosamente
- `PUT /api/users/:id` — retorna 200 mas não persiste
- `GET /api/products` — paginação pula itens entre páginas
- `GET /api/products/:id` — retorna 200 com body de erro ao invés de 404
- `DELETE /api/products/:id` — retorna 204 mas recurso continua existindo
- `POST /api/orders` — aceita product_id inexistente; timeout intermitente
- `GET /api/orders/:id` — alterna entre camelCase e snake_case a cada request
- `POST /api/auth/login` — sem rate limiting; revela se e-mail existe

#### E-commerce
Seletores `data-testid` documentados para uso direto nos testes de UI:
- `product-card`, `add-to-cart`, `stock`, `cart-count`, `cart-quantity`, `remove-item`, `cart-total`, `search-input`

Bugs de UI conhecidos:
- Carrinho aceita mais que o estoque disponível
- Preço total não atualiza ao remover item
- Busca não retorna resultados com acentos
- Produto esgotado aparece como disponível

#### Form Bugado
5 bugs numerados no formulário de cadastro:
1. Email aceita endereços sem @
2. Senha sem validação de força mínima
3. Confirmar senha não valida se coincidem
4. Telefone aceita letras
5. Submit funciona com campos obrigatórios vazios

---

## Design System

Conceito **"Clean Lab"** — limpo, funcional, profissional.

| Token | Valor |
|---|---|
| Background | `#FAFAFA` (gray-50) |
| Texto principal | `#18181B` (gray-900) |
| Accent primário | `#22C55E` (green-500) |
| Fonte display | Plus Jakarta Sans |
| Fonte body | Inter |
| Fonte código | JetBrains Mono |
| Border radius cards | 12px |

---

## O que está em aberto

A plataforma passou por uma reestruturação recente. Algumas decisões ainda estão em avaliação:

- **Cenários** (`/cenarios`) — substituído por Missões. O formato de test plan manager foi descartado por ser complexo demais para o objetivo de prática. Pode ser removido permanentemente.
- **Board** (`/ecommerce/board`) — removido da navegação. A informação de bugs foi absorvida pela página Alvos.
- **PDCA** (`/pdca`) — em avaliação. Pode ser relevante para o perfil B como ferramenta de análise de causa raiz.
- **Datas** (`/datas`) — em avaliação. Bugs de data/timezone são um tema válido mas a página precisa ser repensada como missão, não como módulo isolado.
- **Desafios** (`/desafios`) — em avaliação. A gamificação pode voltar de forma diferente (missões semanais) sem precisar de uma página separada.

---

## Onboarding

Tour de boas-vindas com 7 passos explicando o lab para novos usuários. Abre automaticamente na primeira visita. Acessível a qualquer momento pelo botão `?` fixo no canto inferior direito.

Fluxo do tour: Boas-vindas → Como funciona → Alvos → Missões → API Playground → Blog/Roadmap → Começar

---

*Atualizado em: Abril 2026*
