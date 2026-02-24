# QA Lab Playground

Plataforma educacional para treino de QA. Aprenda quebrando coisas de proposito.

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui
- **Backend:** Hono (Bun runtime)
- **Monorepo:** Bun workspaces
- **Containers:** Docker + docker-compose

## Estrutura

```
packages/
  web/       → Frontend Next.js (:3000)
  api/       → Backend Hono (:3001)
  shared/    → Tipos e constantes compartilhadas
```

## Como Rodar

### Requisitos

- [Bun](https://bun.sh) >= 1.0

### Desenvolvimento Local

```bash
# Instalar dependencias
bun install

# Rodar API e frontend simultaneamente
bun run dev

# Ou separadamente
bun run dev:api   # API em http://localhost:3001
bun run dev:web   # Frontend em http://localhost:3000
```

### Docker

```bash
docker-compose up --build
```

Frontend: http://localhost:3000
API: http://localhost:3001

## Modulos

### API Playground
Envie requests para 10 endpoints com bugs configuraveis. Ative o **Modo Caos** para descobrir falhas como:
- Respostas 500 aleatorias
- Dados incorretos
- Timeouts intermitentes
- Paginacao inconsistente
- Status codes mentirosos

### Cenarios de Teste
5 cenarios guiados para praticar QA:
1. Validar listagem de usuarios
2. Encontrar bugs no formulario
3. Testar busca com edge cases
4. Identificar respostas inconsistentes
5. Validar tratamento de erros

### Form Bugado
Formulario de cadastro com 5 bugs propositais para encontrar.

## Endpoints da API

| Metodo | Endpoint | Bug |
|--------|----------|-----|
| GET | /api/users | 500 aleatorio |
| GET | /api/users/:id | Retorna usuario errado |
| POST | /api/users | Descarta campos silenciosamente |
| GET | /api/products | Paginacao pula itens |
| GET | /api/products/:id | Status 200 com body de erro |
| POST | /api/orders | Timeout intermitente |
| GET | /api/orders/:id | Formato muda a cada request |
| PUT | /api/users/:id | Sucesso falso (nao atualiza) |
| DELETE | /api/products/:id | 204 mas nao deleta |
| GET | /api/health | Mente sobre status |

### Controle de Caos

```bash
# Ver config atual
GET /api/_chaos/config

# Ativar/desativar caos em um endpoint
POST /api/_chaos/config
{"endpoint": "GET /api/users", "config": {"enabled": true}}

# Ativar/desativar todos
POST /api/_chaos/toggle
{"enabled": true}

# Resetar dados
POST /api/_admin/reset
```
