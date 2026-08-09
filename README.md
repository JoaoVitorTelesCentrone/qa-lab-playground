# QA Lab Playground

Playground proprio da QA Lab para treinar QA manual, automacao, API, exploratorio, acessibilidade e produto sem depender de sites externos.

A primeira tela (`/`) e o hub de labs. Ele lista 100 ideias navegaveis em seis trilhas, com dificuldade, tempo, entrega esperada, criterios de aceite, tags e prompt de post LinkedIn.

## Rodar localmente

Requisitos: Bun 1.x ou Node.js 20+.

```bash
bun install
bun run dev:web
```

Acesse `http://localhost:3000`.

## Rotas principais

- `/` e `/labs`: hub com 100 labs.
- `/labs/login`: Projeto 1, login quebravel.
- `/labs/waits`: Projeto 5, waits inteligentes.
- `/labs/api-crud`: Projeto 21, CRUD completo de API.
- `/labs/exploratorio`: Projeto 41, charter exploratorio.
- `/labs/acessibilidade`: Projeto 89, acessibilidade por teclado.
- `/labs/1` ate `/labs/100`: registros navegaveis dos labs planejados/parciais/prontos.
- `/shop/products`, `/shop/cart`, `/shop/checkout`, `/shop/orders/:id`: QA Lab Shop.
- `/playground/elements`, `/playground/tables`, `/playground/dialogs`, `/playground/frames`, `/playground/shadow-dom`, `/playground/files`: microdesafios isolados.
- `/api/docs`: contrato JSON da API.

## Dados de teste

Senha padrao: `qa_lab_secret`.

- `standard_user`: fluxo normal.
- `locked_out_user`: bloqueado.
- `problem_user`: comportamento inconsistente.
- `performance_user`: atrasos artificiais.
- `error_user`: erros controlados.
- `visual_user`: problemas visuais.
- `keyboard_user`: fluxo pensado para teclado.

## API

Endpoints principais:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/products?search=&category=&sort=`
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:id`
- `DELETE /api/cart/items/:id`
- `GET /api/bookings?firstname=&lastname=&checkin=&page=&perPage=&sort=`
- `POST /api/bookings`
- `GET /api/bookings/:id`
- `PUT /api/bookings/:id`
- `PATCH /api/bookings/:id`
- `DELETE /api/bookings/:id`
- `POST /api/test/reset`
- `GET /api/health`

`PUT`, `PATCH` e `DELETE` de reservas exigem `Authorization: Bearer <token>`. Gere o token com:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "content-type: application/json" \
  -d "{\"username\":\"standard_user\",\"password\":\"qa_lab_secret\"}"
```

## Modo bugado

Bugs controlados por query param:

- `/labs/login?bug=locked-message`
- `/labs/waits?bug=infinite-loading`
- `/shop/checkout?bug=wrong-total`
- `/labs/acessibilidade?bug=missing-focus`
- `/api/bookings/1?bug=delete-without-auth`
- `/api/bookings/1?bug=contract-broken`

## Verificacao

```bash
bun test packages/web
bun run --filter '@qa-lab/web' build
```

O projeto tambem preserva os modulos anteriores do QA Lab, incluindo ExpenseFlow, blog, pesquisa e labs ja existentes.
