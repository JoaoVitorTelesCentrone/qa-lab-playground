# QA Lab Playground - especificacao completa e prompt de implementacao

## Objetivo

Criar um playground proprio da QA Lab para posts, labs e portfolios praticos. O produto deve permitir que uma pessoa teste "mao na obra" sem depender de sites externos. Ele precisa cobrir os 5 projetos ja criados:

- Projeto 1: login quebravel.
- Projeto 5: waits inteligentes.
- Projeto 21: CRUD completo de API.
- Projeto 41: charter exploratorio de checkout.
- Projeto 89: acessibilidade por teclado.

O QA Lab Playground deve ser um ambiente de treino com duas camadas:

1. Produto simulado realista, com login, catalogo, carrinho, checkout, pedidos, reservas e conta.
2. Catalogo de microdesafios isolados, com telas especificas para locators, waits, iframes, shadow DOM, uploads, tabelas, alertas, acessibilidade e bugs plantados.

## Principio editorial

O playground nao deve ser uma landing page. A primeira tela deve ser a propria experiencia de treino: painel de labs, modulos, dificuldade, tempo estimado e botao para iniciar.

Cada modulo deve gerar conteudo para LinkedIn:

- desafio claro;
- entrega pratica;
- criterios de aceite;
- tags de aprendizado;
- evidencias esperadas;
- pergunta final para comunidade.

## Benchmark estudado

### QA Playground by Marko Simic

URL: https://qaplayground.dev/

Padrao observado: mini-apps isolados, cada um com um desafio bem definido. A pagina lista desafios como dynamic table, OTP, tags input, multi-level dropdown, sortable list, new tab, popup, nested iframe, shadow DOM, rating, covered elements, upload, download, onboarding modal, budget tracker, context menu, mouse hover, geolocation, navigation links, redirect chain, fetch data, QR code, changing iframe, range slider, register/login e JIRA-like board.

O que aproveitar:

- Mini-apps pequenos e focados.
- Cada desafio com uma habilidade tecnica especifica.
- Nome do desafio orientado a comportamento.
- Bom para posts curtos de automacao.

O que melhorar no QA Lab:

- Incluir tambem testes exploratorios e acessibilidade.
- Ter APIs proprias ligadas aos fluxos da UI.
- Ter bugs plantados com severidade e dicas opcionais.

### QA Playground qaplayground.com

URL: https://www.qaplayground.com/

Padrao observado: plataforma mais ampla, com elementos de pratica, app bancario, study tracker, mock interviews, desafios, test cases e secoes de aprendizado. A pagina tambem mostra test cases prontos para tabelas, com IDs, tipo positivo/negativo/edge e prioridade.

O que aproveitar:

- Test cases visiveis dentro do proprio playground.
- Dificuldade, tempo estimado e quantidade de cenarios.
- Tabelas com sorting, filtros, paginacao, add/edit/delete.
- Um app realista para E2E.

O que melhorar no QA Lab:

- Foco editorial em labs publicaveis.
- Exportar relatorio de bug, charter e post.
- Integrar microdesafios com uma jornada de produto unica.

### ExpandTesting

URL: https://practice.expandtesting.com/

Padrao observado: catalogo muito grande para UI e API, com exemplos de inputs, login, register, forgot password, OTP, dynamic table, pagination table, locators, browser info, radio buttons, drag and drop, form validation, upload, download, secure download, notifications, autocomplete, spies/stubs/clocks, challenging DOM, large DOM, shadow DOM, typos, broken images, infinite scroll, slow resources, dialogs, JavaScript error, menus, A/B testing, checkboxes, context menu, key presses, dropdown, redirect, geolocation, slider, hovers, floating menu, iframe, windows, tables, tooltips, dynamic content, dynamic controls, dynamic loading, shifting content, status codes, dynamic ID, entry ad, exit intent, contact, tracking events, profile, feedback, scrollbars, cookie consent, headers, console logs, OAuth, basic auth, digest auth, random number e flaky test.

O que aproveitar:

- Cobertura ampla de problemas reais de automacao.
- Secoes por tipo de desafio.
- Mistura entre UI isolada, app e API.
- Paginas para flakiness e recursos lentos.

O que melhorar no QA Lab:

- Reduzir ruido e organizar por trilhas da QA Lab.
- Amarrar cada desafio a um post, lab e entrega.
- Criar modo bugado/controlado para ensinar diagnostico.

### The Internet

URL: https://the-internet.herokuapp.com/

Padrao observado: lista classica de exemplos atomicos: A/B testing, add/remove elements, auth, broken images, challenging DOM, checkboxes, context menu, disappearing elements, drag and drop, dropdown, dynamic content, dynamic controls, dynamic loading, entry ad, exit intent, file download, file upload, floating menu, forgot password, form auth, frames, geolocation, slider, hovers, infinite scroll, inputs, menus, alerts, JS error, key presses, large DOM, multiple windows, nested frames, notification messages, redirect, secure download, shadow DOM, shifting content, slow resources, tables, status codes, typos e editor WYSIWYG.

O que aproveitar:

- Simplicidade.
- Cada pagina testa uma tecnica.
- Baixo custo de manutencao.

O que melhorar no QA Lab:

- Adicionar contexto de produto.
- Adicionar dados de teste e criterios de aceite.
- Adicionar API e acessibilidade.

### UI Test Automation Playground

URL: http://uitestingplayground.com/

Padrao observado: foco em problemas especificos de automacao moderna: dynamic ID, class attribute, hidden layers, load delay, AJAX data, client side delay, click, text input, scrollbars, dynamic table, verify text, progress bar, visibility, sample app, mouse over, non-breaking space, overlapped element, shadow DOM, alerts, upload, animated button, disabled input, auto wait, frames, geolocation, clear input, scroll to click, CSS selectors e select.

O que aproveitar:

- Excelente para waits inteligentes.
- Bons exemplos de locators instaveis.
- Casos de visibilidade, sobreposicao e timing.

O que melhorar no QA Lab:

- Criar desafios equivalentes com narrativa propria.
- Ter configuracao de dificuldade: facil, realista, caotico.
- Expor metadados para automacao: `data-testid` e tambem seletores ruins de proposito.

### DemoQA

URL: https://demoqa.com/

Padrao observado: organizacao por categorias: Elements, Forms, Alerts/Frame/Windows, Widgets, Interactions e Book Store Application. Inclui text box, checkbox, radio, web tables, buttons, links, broken links/images, upload/download, dynamic properties, practice form, browser windows, alerts, frames, nested frames, modal dialogs, accordion, autocomplete, date picker, slider, progress bar, tabs, tooltips, menu, select menu, sortable, selectable, resizable, droppable, draggable, login, book store, profile e Book Store API.

O que aproveitar:

- Menu lateral por categoria.
- Bom mix de componentes HTML e widgets.
- App de bookstore para fluxo mais realista.

O que melhorar no QA Lab:

- Melhorar estabilidade visual e sem excesso de anuncios.
- Ter storytelling de QA Lab por modulo.
- Incluir bugs documentados para exercicio de report.

### QA Practice

URL: https://qa-practice.razvanvancea.ro/

Padrao observado: combina e-commerce E2E, desafio de encontrar bugs, GraphQL testing, API testing, products list, intercept de request, visual testing, forms, login, register, recover password, checkboxes, radio, nova aba/janela, double click, scrolling, hover, show/hide, tabelas, dropdowns, iframes, alerts, upload, date pickers, loader e pagination.

O que aproveitar:

- Mistura boa entre manual, automacao, API e GraphQL.
- "Spot the bugs challenge" e muito alinhado com post de LinkedIn.
- E-commerce E2E casa com os projetos de login, checkout e acessibilidade.

O que melhorar no QA Lab:

- Criar bug tracker interno de treino.
- Permitir exportar evidencia.
- Criar charters prontos por missao.

### Automation Exercise

URL: https://www.automationexercise.com/

Padrao observado: e-commerce completo com home, produtos, carrinho, signup/login, test cases, API testing, contato, categorias, marcas, detalhes de produto, assinatura, busca e lista de APIs. A lista de API inclui produtos, marcas, busca de produto, verify login, criar conta, deletar conta, atualizar conta e buscar detalhe por email.

O que aproveitar:

- Produto mais completo para E2E.
- Test cases publicos conectados ao site.
- API publica conectada ao dominio de e-commerce.

O que melhorar no QA Lab:

- Evitar excesso visual.
- Criar dados deterministas.
- Permitir reset de massa de teste.

### Restful Booker

URL: https://restful-booker.herokuapp.com/apidoc/index.html

Padrao observado: API de reservas com auth, listar IDs, filtrar por nome/data, consultar reserva, criar, atualizar, atualizar parcialmente e deletar. Suporta payload JSON, XML e URL encoded em alguns endpoints.

O que aproveitar:

- CRUD simples e completo.
- Auth simples para PUT/DELETE.
- Bom para contrato, smoke e testes negativos.

O que melhorar no QA Lab:

- Ter documentacao OpenAPI propria.
- Ter seed/reset de dados.
- Ter erros controlados para ensino.

### ParaBank

URL: https://parabank.parasoft.com/parabank/index.htm

Padrao observado: banco demo com login, cadastro, recuperar login, services, admin, WSDL e endpoints REST/WADL para funcoes como transfer funds, bill pay, account history, check balances, withdraw e deposits.

O que aproveitar:

- Dominio bancario com regras de negocio mais ricas.
- UI + API no mesmo produto.
- Fluxos de permissao, conta e transferencia.

O que melhorar no QA Lab:

- Comecar com e-commerce/reserva antes de banco.
- Adicionar banco como modulo futuro para risco financeiro.

### Sauce Demo

URL: https://www.saucedemo.com/

Padrao observado: login com usuarios conhecidos: `standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`; senha padrao `secret_sauce`. Fluxo de inventario, carrinho e checkout.

O que aproveitar:

- Usuarios que simulam tipos diferentes de problema.
- Fluxo curto e excelente para labs de login, carrinho e acessibilidade.
- Massa de teste facil de explicar.

O que melhorar no QA Lab:

- Ter mais mensagens em portugues.
- Ter modo com bugs ativaveis.
- Ter API correspondente ao fluxo.

## Visao do QA Lab Playground

Nome sugerido: QA Lab Playground.

Proposta: uma aplicacao web de treino para QA manual, automacao, API, exploratorio e acessibilidade, feita para virar post pratico.

O usuario deve conseguir:

- escolher um lab;
- ver objetivo, dificuldade, tempo e entrega esperada;
- executar o fluxo na UI;
- testar API equivalente;
- ver dicas opcionais;
- registrar bugs;
- gerar evidencia;
- exportar relatorio Markdown;
- copiar um post base para LinkedIn.

## Arquitetura funcional

### 1. Hub de labs

Funcionalidades:

- Listagem de labs por categoria: UI, API, Exploratorio, Acessibilidade, Performance, Seguranca, Produto.
- Filtros por dificuldade: iniciante, intermediario, avancado.
- Filtros por tempo: 15, 30, 60, 90 minutos.
- Tags: login, checkout, API, waits, flaky, keyboard, bug report, contrato, dados, visual.
- Cartao de lab com objetivo, entrega e ferramentas sugeridas.
- Botao "Iniciar lab".
- Botao "Ver criterios de aceite".
- Botao "Copiar prompt do desafio".

Alinhamento com os projetos:

- Projeto 1 vira lab de Login.
- Projeto 5 vira lab de Waits.
- Projeto 21 vira lab de API CRUD.
- Projeto 41 vira lab Exploratorio.
- Projeto 89 vira lab de Acessibilidade.

### 2. Produto demo: loja QA Lab Shop

Funcionalidades principais:

- Login.
- Catalogo de produtos.
- Busca.
- Filtro por categoria.
- Ordenacao por nome, preco e avaliacao.
- Detalhe de produto.
- Carrinho.
- Checkout em etapas.
- Resumo de pedido.
- Historico de pedidos.
- Logout.

Usuarios de teste:

- `standard_user`: fluxo normal.
- `locked_out_user`: bloqueado no login.
- `problem_user`: imagens trocadas, campos inconsistentes ou comportamento estranho.
- `performance_user`: atrasos artificiais.
- `error_user`: erros controlados em acoes especificas.
- `visual_user`: problemas visuais controlados.
- `keyboard_user`: fluxo deve ser totalmente navegavel por teclado.

Senha padrao:

- `qa_lab_secret`

Regras de negocio:

- Usuario bloqueado nao pode logar.
- Carrinho deve persistir durante a sessao.
- Total deve ser soma dos itens + taxa.
- Checkout exige nome, sobrenome e CEP.
- Pedido finalizado gera ID unico.
- Usuario nao autenticado nao acessa checkout.

Labs suportados:

- Login quebravel.
- Carrinho resiliente.
- Checkout feliz e triste.
- Acessibilidade por teclado.
- Exploratorio de checkout.
- Mensagens confusas.
- Dados ruins.
- Interrupcoes.

### 3. Modulo de login

Funcionalidades:

- Campos username e password.
- Botao login.
- Mensagens especificas:
  - usuario obrigatorio;
  - senha obrigatoria;
  - credenciais invalidas;
  - usuario bloqueado;
  - sessao expirada.
- Toggle "lembrar usuario".
- Logout.
- Rota protegida.
- Deep link protegido redirecionando para login.

Bugs plantados opcionais:

- Mensagem generica demais para senha invalida.
- Usuario bloqueado retorna mensagem errada.
- Foco nao vai para o primeiro campo com erro.
- Botao login habilitado mesmo com campos vazios.

Criterios para automacao:

- Seletores `data-testid` em todos os campos.
- Roles acessiveis corretas.
- Mensagens com `aria-live`.

### 4. Modulo de waits e flakiness

Funcionalidades:

- Pagina de AJAX delay.
- Pagina de client-side delay.
- Botao que aparece depois de atraso.
- Botao que fica disabled e depois enabled.
- Progress bar com meta.
- Conteudo dinamico que muda a cada reload.
- Elemento coberto por overlay.
- Elemento que muda de ID a cada render.
- Card que aparece depois de skeleton loading.
- Requisicao lenta configuravel.

Controles:

- Slider para escolher delay: 0 ms, 500 ms, 2 s, 5 s.
- Toggle "modo instavel".
- Botao "resetar estado".

Bugs plantados:

- Loading que nunca termina.
- Botao habilitado antes da API finalizar.
- Texto final aparece, mas dado ainda nao foi persistido.
- Overlay invisivel bloqueia clique.

Labs suportados:

- Waits inteligentes.
- Teste flake.
- Falha legivel.
- Ambiente quebrado.

### 5. Modulo de API

Base sugerida:

- `/api/auth`
- `/api/products`
- `/api/cart`
- `/api/orders`
- `/api/bookings`
- `/api/users`
- `/api/health`
- `/api/test/reset`

Endpoints minimos:

```text
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/products
GET    /api/products/:id
GET    /api/products?search=&category=&sort=
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:id
DELETE /api/cart/items/:id
POST   /api/orders
GET    /api/orders/:id
GET    /api/bookings
POST   /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
PATCH  /api/bookings/:id
DELETE /api/bookings/:id
POST   /api/test/reset
GET    /api/health
```

Funcionalidades:

- CRUD completo de reservas.
- Auth por token simples.
- Filtros por nome e data.
- Paginacao.
- Ordenacao.
- Erros 400, 401, 403, 404, 405, 409 e 500 simulado.
- Schema OpenAPI em `/api/docs`.
- Collection Postman/Bruno exportavel.
- Seed/reset para testes.

Bugs plantados:

- `totalprice` aceitando string.
- DELETE sem auth em modo bugado.
- PATCH removendo campo nao enviado.
- Filtro por data usando comparacao lexica errada.
- Mensagem de erro sem campo causador.

Labs suportados:

- CRUD completo.
- Status codes.
- Payload minimo.
- Contrato JSON.
- Auth.
- Idempotencia.
- Paginacao.
- Ordenacao.
- Dados dinamicos.

### 6. Modulo exploratorio

Funcionalidades:

- Charters prontos.
- Timer de sessao.
- Bloco de notas por tempo.
- Registro de bug dentro do app.
- Campo para hipotese, observacao, duvida e bug.
- Severidade e impacto.
- Upload/anexo de evidencia.
- Exportar relatorio Markdown.
- Botao "gerar resumo da sessao".

Charters iniciais:

- Checkout em 30 minutos.
- Login e sessao.
- Carrinho em duas abas.
- Dados extremos.
- Mensagens de erro.
- Usuario bloqueado.
- Compra com rede lenta.

Campos do bug:

- titulo;
- ambiente;
- passos;
- resultado esperado;
- resultado atual;
- impacto;
- severidade;
- evidencia;
- notas adicionais.

Labs suportados:

- Charter exploratorio.
- Bug advocacy.
- Bug bash.
- Dados ruins.
- Interrupcoes.
- Concorrencia manual.

### 7. Modulo de acessibilidade

Funcionalidades:

- Jornada completa navegavel por teclado.
- Indicador visual de foco.
- Skip link.
- Labels associados.
- Mensagens com `aria-live`.
- Modais com foco preso corretamente.
- Componentes customizados com roles corretas.
- Pagina com problemas propositais.
- Checklist de WCAG basico.

Desafios:

- Login sem mouse.
- Checkout sem mouse.
- Menu dropdown por teclado.
- Modal acessivel.
- Erro de formulario anunciado.
- Contraste de botoes.
- Ordem de foco em cards.
- Tabela navegavel.

Bugs plantados:

- Foco invisivel.
- Ordem de tab quebrada.
- Botao sem nome acessivel.
- Modal que nao devolve foco.
- Erro de campo nao anunciado.
- Link que parece botao mas nao responde a teclado.

Labs suportados:

- Acessibilidade por teclado.
- Contraste.
- Leitores de tela.
- Toque mobile.

### 8. Catalogo de microdesafios

Deve conter paginas isoladas para:

- inputs;
- checkboxes;
- radio buttons;
- dropdown nativo;
- dropdown customizado;
- autocomplete;
- date picker;
- slider;
- tabs;
- accordion;
- tooltip;
- modal;
- alert, confirm e prompt;
- nova aba;
- nova janela;
- iframe;
- iframe aninhado;
- shadow DOM;
- tabela estatica;
- tabela dinamica;
- tabela com paginacao;
- tabela com sorting;
- busca;
- filtros combinados;
- upload;
- download;
- secure download;
- drag and drop;
- sortable list;
- context menu;
- hover;
- infinite scroll;
- loading dinamico;
- progress bar;
- geolocation;
- redirect chain;
- broken links;
- broken images;
- console error;
- status codes;
- headers;
- cookie consent;
- local storage;
- session storage;
- network intercept;
- visual regression target;
- responsive target;
- API fetch target;
- OTP;
- tags input;
- rating stars;
- kanban board.

Cada microdesafio deve ter:

- descricao curta;
- objetivo tecnico;
- dificuldade;
- tempo estimado;
- criterios de aceite;
- bugs opcionais;
- dados de teste;
- sugestao de assertion;
- link para copiar seletor ruim e seletor saudavel;
- rota propria.

### 9. Modo bugado/controlado

O playground deve permitir ativar bugs de forma controlada para posts.

Exemplo de configuracao:

```text
/lab/login?bug=locked-message
/lab/checkout?bug=wrong-total
/lab/waits?bug=infinite-loading
/lab/a11y?bug=missing-focus
/lab/api?bug=delete-without-auth
```

Categorias de bug:

- UI visual.
- Regra de negocio.
- Validacao.
- API/contrato.
- Performance.
- Acessibilidade.
- Estado/sessao.
- Concorrencia.
- Conteudo/mensagem.

Cada bug deve ter:

- ID;
- severidade sugerida;
- impacto;
- passos para reproduzir;
- comportamento esperado;
- comportamento atual;
- dica opcional;
- solucao esperada para instrutor.

### 10. Gerador de conteudo para LinkedIn

Funcionalidades:

- Botao "Gerar post do lab".
- Template com:
  - gancho;
  - contexto;
  - desafio;
  - entrega;
  - criterios de aceite;
  - pergunta final;
  - hashtags.
- Campo para copiar post.
- Export Markdown.

Templates:

- Post de desafio.
- Post de bug report.
- Post de comparacao antes/depois.
- Post de checklist.
- Post de mini portfolio.

Hashtags padrao:

- #QA
- #QualityAssurance
- #TestesDeSoftware
- #AutomacaoDeTestes
- #Playwright
- #APITesting
- #Acessibilidade
- #QALab

### 11. Dados de teste

Usuarios:

```json
[
  {
    "username": "standard_user",
    "password": "qa_lab_secret",
    "role": "customer",
    "state": "active"
  },
  {
    "username": "locked_out_user",
    "password": "qa_lab_secret",
    "role": "customer",
    "state": "locked"
  },
  {
    "username": "problem_user",
    "password": "qa_lab_secret",
    "role": "customer",
    "state": "active",
    "flags": ["wrong_images", "bad_checkout_validation"]
  },
  {
    "username": "performance_user",
    "password": "qa_lab_secret",
    "role": "customer",
    "state": "active",
    "flags": ["slow_api"]
  },
  {
    "username": "admin_user",
    "password": "qa_lab_secret",
    "role": "admin",
    "state": "active"
  }
]
```

Produtos:

- 12 produtos com categoria, preco, estoque, rating e imagem.
- Pelo menos 1 produto sem estoque.
- Pelo menos 1 produto com nome muito longo.
- Pelo menos 1 produto com caracteres especiais.

Reservas:

- Campos: firstname, lastname, totalprice, depositpaid, checkin, checkout, additionalneeds.
- IDs gerados em runtime.
- Reset disponivel para automacao.

### 12. Requisitos tecnicos

Stack sugerida:

- Next.js ou React + Vite.
- TypeScript.
- API local em Next Route Handlers, Express ou Fastify.
- Banco local simples: SQLite, Prisma ou arquivo JSON em memoria para MVP.
- Playwright para testes do proprio playground.
- OpenAPI para documentar API.
- Axe opcional para checks de acessibilidade.

Requisitos de testabilidade:

- `data-testid` estavel em elementos principais.
- Roles e labels acessiveis.
- Estados previsiveis.
- Seed/reset.
- Rotas diretas para cada lab.
- Modo bugado por query param.
- Logs visiveis para alguns labs.
- Trace-friendly: nao depender de animacoes eternas.

Rotas sugeridas:

```text
/
/labs
/labs/login
/labs/waits
/labs/api-crud
/labs/exploratorio
/labs/acessibilidade
/shop
/shop/products
/shop/cart
/shop/checkout
/shop/orders/:id
/playground/elements
/playground/forms
/playground/tables
/playground/dialogs
/playground/frames
/playground/shadow-dom
/playground/files
/playground/interactions
/playground/network
/playground/a11y
/api/docs
```

### 13. MVP recomendado

Para alinhar com os 5 projetos atuais, o MVP deve entregar primeiro:

1. Hub de labs.
2. Login com usuarios especiais.
3. Loja simples com catalogo, carrinho e checkout.
4. Modulo waits com AJAX delay, client delay, dynamic ID e overlay.
5. API CRUD de reservas com auth.
6. Modulo exploratorio com charter, notas, bugs e export Markdown.
7. Jornada de checkout navegavel por teclado.
8. Modo bugado por query param.
9. Pagina de documentacao dos labs.
10. Testes Playwright cobrindo os 5 labs principais.

## Cobertura completa das 100 ideias

Esta matriz garante que o QA Lab Playground nao fique limitado aos 5 projetos empacotados. Cada uma das 100 ideias originais precisa ter suporte direto no produto, seja como fluxo realista, microdesafio isolado, endpoint de API, modo bugado ou ferramenta de relatorio.

### UI e automacao web

| # | Lab | Funcionalidade obrigatoria no playground | Entrega suportada |
|---|---|---|---|
| 1 | Login quebravel | Tela de login com usuarios ativo, bloqueado, senha invalida e campos obrigatorios | Suite de login com assertions por erro |
| 2 | Carrinho resiliente | Loja com catalogo, add/remove, quantidade e carrinho persistente por sessao | Teste E2E sem depender da ordem dos itens |
| 3 | Checkout feliz e triste | Checkout em etapas com validacoes de nome, sobrenome, CEP, resumo e confirmacao | Matriz de cenarios e automacao dos caminhos principais |
| 4 | Seletores saudaveis | Pagina com seletores frageis, data-testid, roles e labels acessiveis lado a lado | Antes/depois de seletores ruins e bons |
| 5 | Waits inteligentes | AJAX delay, client delay, botao delayed, loading e elemento disabled/enabled | Suite sem sleeps fixos |
| 6 | Elemento invisivel | Elementos existentes no DOM mas hidden, disabled, covered e offscreen | Teste distinguindo existencia, visibilidade e habilitacao |
| 7 | Upload | Upload unico e multiplo com validacao de nome, tipo e tamanho | Caso manual e teste automatizado |
| 8 | Download | Download publico e secure download com nome e tamanho previsiveis | Script validando arquivo baixado |
| 9 | Tabela dinamica | Tabela com linhas mutaveis, colunas, filtros, sorting e helper por celula | Helper reutilizavel para linhas e colunas |
| 10 | Modal | Modal acessivel com abrir, fechar, ESC, overlay, foco preso e retorno de foco | Checklist de acessibilidade basica |
| 11 | Dropdown | Select nativo e dropdown customizado com estados validos e invalidos | Automacao de estado inicial e alteracao |
| 12 | Alertas | Alert, confirm, prompt e modal customizado | Tres testes independentes |
| 13 | Abas e janelas | Link para nova aba, popup window e retorno ao contexto original | Teste sem perda de contexto |
| 14 | Infinite scroll | Lista incremental com criterio de parada e contador de itens | Teste com criterio de parada documentado |
| 15 | Hover | Cards com conteudo exibido por hover e alternativa por foco | Caso manual mais automacao |
| 16 | Shadow DOM | Componente dentro de shadow root aberto e um caso com nested shadow | Exemplo comentado |
| 17 | Iframe | Editor em iframe, iframe aninhado e troca de contexto | Teste que troca de contexto com clareza |
| 18 | Busca | Busca de produtos por termo exato, parcial e inexistente | Tabela de equivalencia |
| 19 | Filtros | Filtros combinados por categoria, preco, estoque e rating | Teste validando regra, nao texto solto |
| 20 | Regressao visual simples | Duas versoes de uma tela com diferencas visuais controladas | Baseline, atual e criterio de diferenca |

### API e contrato

| # | Lab | Funcionalidade obrigatoria no playground | Entrega suportada |
|---|---|---|---|
| 21 | CRUD completo | API `/api/bookings` com POST, GET, PUT, PATCH e DELETE | Collection ou suite automatizada |
| 22 | Status codes | Endpoints ou flags para 200, 201, 400, 401, 403, 404, 405, 409 e 500 | Tabela de expectativa por endpoint |
| 23 | Payload minimo | Validador de booking/order/user com campos obrigatorios e opcionais | Matriz de payloads validos e invalidos |
| 24 | Contrato JSON | OpenAPI e schemas JSON versionados para respostas principais | Schema versionado |
| 25 | Autenticacao | Login API, token valido, ausente, invalido e expirado | Cenarios negativos automatizados |
| 26 | Idempotencia | Endpoint de pagamento/reserva com chave idempotente opcional | Conclusao sobre efeito colateral |
| 27 | Paginacao | Listas paginadas de produtos, pedidos e reservas | Testes de borda |
| 28 | Ordenacao via API | Sort por nome, preco, data e status | Assertion independente do tamanho da lista |
| 29 | Filtro via API | Filtros unicos e combinados em produtos e reservas | Suite parametrizada |
| 30 | Dados dinamicos | Seed/reset, geracao de IDs e nomes unicos por execucao | Estrategia de naming |
| 31 | Retry consciente | Endpoint instavel controlado com falhas transientes e permanentes | Exemplo de retry limitado |
| 32 | Erro bem explicado | Erros com `code`, `message`, `field`, `details` e correlation id | Checklist de mensagens uteis |
| 33 | Tempo de resposta | Endpoint rapido, lento e degradado com latencia configuravel | Teste com limite realista |
| 34 | Contrato quebrado | Modo bugado que remove/renomeia campo de resposta | Relatorio de breaking change |
| 35 | Mock server | Modo mock para API de terceiro em frontend | Mock feliz e erro |
| 36 | Fixture | Dados estaticos, seed de runtime e factory de massa | Estrutura de pastas recomendada |
| 37 | Ambientes | Configuracao local/staging/prod-readonly simulada | Config por variavel |
| 38 | Postman para CI | OpenAPI, collection Postman/Bruno e script Newman de exemplo | Execucao no pipeline |
| 39 | API primeiro bug | Bugs que aparecem na API antes de aparecerem na UI | Bug report com request/response/impacto |
| 40 | Contrato entre times | Pagina de contrato de endpoint com exemplos e criterios de aceite | Exemplo de acordo |

### Testes exploratorios e pensamento critico

| # | Lab | Funcionalidade obrigatoria no playground | Entrega suportada |
|---|---|---|---|
| 41 | Charter exploratorio | Modulo com charter, timer, notas, bugs e export Markdown | Charter, notas e bugs |
| 42 | Heuristica CRUD | Entidades produto, pedido, reserva e perfil com criar/ler/atualizar/deletar/restaurar | Mapa de riscos |
| 43 | Persona extrema | Perfis de usuario e charters por comportamento: apressado, indeciso, sem paciencia | Achados por persona |
| 44 | Interrupcoes | Fluxos sensiveis a refresh, voltar, fechar aba e perda de rede simulada | Comportamento observado |
| 45 | Dados ruins | Campos com limites, caracteres especiais, nomes longos, espacos e unicode | Lista de validacoes ausentes |
| 46 | Sessao expirada | Expiracao controlada de token/sessao no meio de fluxo | Bug ou evidencia correta |
| 47 | Concorrencia manual | Duas abas alterando carrinho, perfil, reserva ou estoque | Analise de conflito |
| 48 | Permissoes | Roles guest, customer, admin e suporte com rotas protegidas | Matriz de autorizacao |
| 49 | Favoritos do navegador | Deep links protegidos para checkout, pedido e admin | Resultado e risco |
| 50 | Mensagens confusas | Banco de mensagens boas e ruins em formularios e API | Antes/depois |
| 51 | Risco por tela | Tela com checklist de risco por impacto, frequencia e historico | Top 5 riscos |
| 52 | Teste baseado em estado | Pedido/reserva com estados e transicoes permitidas | Diagrama e cenarios |
| 53 | Caminho alternativo | Comprar via catalogo, busca, detalhe e recomendados | Comparacao de comportamento |
| 54 | Teste sem roteiro | Modo sessao livre com notas, hipoteses e descobertas | Notas organizadas |
| 55 | Bug advocacy | Template de bug com impacto, evidencia e argumento de negocio | Bug report persuasivo |

### Qualidade de produto

| # | Lab | Funcionalidade obrigatoria no playground | Entrega suportada |
|---|---|---|---|
| 56 | Definicao de pronto | Historias ficticias com criterios incompletos e editor Given/When/Then | Criterios testaveis |
| 57 | Refinamento QA | Requisitos vagos de login, checkout, desconto, frete e reserva | Perguntas por risco |
| 58 | Exemplo concreto | Regras ambiguas com tabela de exemplos validos e invalidos | Tabela de exemplos |
| 59 | Bug que nao e bug | Casos classificaveis como bug, melhoria, duvida ou comportamento esperado | Justificativa |
| 60 | Impacto no usuario | Bugs tecnicos com campo para reescrever impacto do usuario | Reports reescritos |
| 61 | Release notes testaveis | Release notes simuladas ligadas a areas do produto | Checklist priorizado |
| 62 | Metricas uteis | Dashboard de metricas de qualidade com exemplos bons e ruins | Definicao e uso |
| 63 | Smoke test | Fluxos criticos marcados para smoke de 10 minutos | Lista priorizada |
| 64 | Regressao enxuta | Suite grande simulada com riscos e historico para cortar cobertura | Criterios de remocao |
| 65 | Matriz de risco | Ferramenta de impacto x probabilidade x historico | Mapa de decisao |
| 66 | Bug bash | Modo bug bash com missao, participantes, timer e quadro de coleta | Roteiro e quadro |
| 67 | Qualidade em discovery | Features futuras com riscos antes da implementacao | Checklist de refinamento |
| 68 | Teste de aceite | Exemplos separados em aceite, regressao e exploratorio | Exemplos por tipo |
| 69 | Requisito contraditorio | Regras conflitantes de cupom, estoque, frete e reserva | Perguntas para destravar |
| 70 | Decisao de nao testar | Registro de risco aceito, motivo e aprovador ficticio | Registro de risco |

### CI, pipelines e manutencao

| # | Lab | Funcionalidade obrigatoria no playground | Entrega suportada |
|---|---|---|---|
| 71 | Pipeline minimo | Exemplo de GitHub Actions rodando API e E2E | YAML simples de CI |
| 72 | Falha legivel | Testes com mensagens ruins e versao refatorada com logs uteis | Output antes/depois |
| 73 | Teste flake | Modo flake com falha intermitente controlada por probabilidade | Hipotese, evidencia e correcao |
| 74 | Paralelismo | Dados isolados por worker e cenarios que conflitam sem isolamento | Estrategia de isolamento |
| 75 | Tags | Testes/labs marcados como smoke, regressao, contrato e a11y | Convencao de tags |
| 76 | Relatorio HTML | Geracao de relatorio de execucao e evidencias | Artefato com prints/traces |
| 77 | Screenshot na falha | Config Playwright de screenshot/trace only-on-failure | Configuracao no framework |
| 78 | Trace | Falha reproduzivel com trace viewer como evidencia | Passo onde o erro nasce |
| 79 | Dependencia externa | API externa simulada lenta, fora do ar e com contrato alterado | Decisao mock/contrato/real |
| 80 | Versionamento de dados | Fixtures versionadas e migracao de schema de dados | Regra de manutencao |
| 81 | Secrets | Exemplo de token por env var e teste impedindo segredo commitado | Variavel segura |
| 82 | Pull request testavel | Template de PR com checklist de QA e riscos | Template curto |
| 83 | Cobertura honesta | Mapa de cobertura por risco, nao so por quantidade de testes | Mapa de cobertura |
| 84 | Teste lento | Suite com tempos por teste e pontos de otimizacao | Top 3 melhorias medidas |
| 85 | Ambiente quebrado | Diagnostico entre bug produto, bug teste e problema ambiente | Arvore de decisao |

### Performance, acessibilidade, mobile e seguranca

| # | Lab | Funcionalidade obrigatoria no playground | Entrega suportada |
|---|---|---|---|
| 86 | Performance basica | Paginas com assets pesados, requests lentos e metricas Web Vitals | Mini relatorio priorizado |
| 87 | Carga em API | Endpoint de reserva com limite/rate limit configuravel | Limite observado |
| 88 | Teste de pico | Endpoint que responde diferente em carga constante e pico | Grafico ou tabela |
| 89 | Acessibilidade por teclado | Login, carrinho e checkout 100% navegaveis por teclado | Bugs de foco e navegacao |
| 90 | Contraste | Tema com contraste bom e modo bugado com contraste ruim | Lista com severidade |
| 91 | Leitores de tela | Labels, aria-live, nomes acessiveis e pagina com problemas | Checklist de labels |
| 92 | Responsividade | Viewports mobile, tablet e desktop com layouts e bugs controlados | Bugs por viewport |
| 93 | Toque mobile | Alvos pequenos/grandes, teclado correto, scroll e campos mobile | Checklist mobile |
| 94 | Rede lenta | Simulador de loading, timeout, retry e fallback visual | Recomendacoes de UX |
| 95 | Offline parcial | Fluxo com perda de rede durante envio e recuperacao | Esperado versus atual |
| 96 | Seguranca no formulario | Campos que sanitizam e modo bugado refletindo HTML inseguro | Evidencia sanitizada |
| 97 | Autorizacao quebrada | IDOR simulado em pedidos/reservas de outro usuario | Risco e recomendacao |
| 98 | Dados sensiveis | Logs/responses com e sem token, senha e PII mascarados | Checklist de vazamento |
| 99 | Headers de seguranca | Endpoint `/api/security/headers` e pagina de inspecao de headers | Tabela header/valor/risco |
| 100 | Lab final QA Lab | Fluxo integrado com plano, 5 automacoes, 2 bugs e post exportavel | Mini portfolio de QA |

## Trilhas do playground para suportar as 100 ideias

Para nao virar uma lista solta de telas, as 100 ideias devem ser agrupadas em trilhas navegaveis:

1. Trilha UI Automation: cobre ideias 1 a 20.
2. Trilha API e Contrato: cobre ideias 21 a 40.
3. Trilha Exploratoria: cobre ideias 41 a 55.
4. Trilha Produto e Estrategia: cobre ideias 56 a 70.
5. Trilha CI e Manutencao: cobre ideias 71 a 85.
6. Trilha Nao Funcionais: cobre ideias 86 a 100.

Cada trilha deve ter:

- tela inicial com labs da trilha;
- progresso local;
- dificuldade;
- tempo estimado;
- entrega esperada;
- dados de teste;
- modo bugado;
- post LinkedIn geravel;
- criterios de aceite;
- referencias internas;
- exemplos de automacao quando fizer sentido.

## Modulos adicionais necessarios para cobrir as 100 ideias

A especificacao inicial dos 5 projetos precisa ser expandida com estes modulos:

### Modulo de produto e requisitos

Necessario para ideias 56 a 70.

Funcionalidades:

- Biblioteca de historias ficticias.
- Editor de criterios Given/When/Then.
- Banco de requisitos ambiguos.
- Classificador de achados: bug, melhoria, duvida, comportamento esperado.
- Matriz de risco.
- Registro de decisao de nao testar.
- Release notes simuladas.
- Smoke/regressao builder.

### Modulo de pipeline e manutencao

Necessario para ideias 71 a 85.

Funcionalidades:

- Exemplos de pipeline GitHub Actions.
- Testes propositalmente lentos.
- Testes propositalmente flaky.
- Relatorios HTML.
- Evidencias automaticas.
- Tags de execucao.
- Dados isolados para paralelismo.
- Arvore de diagnostico de falha.
- Templates de PR e bug report.

### Modulo de nao funcionais

Necessario para ideias 86 a 100.

Funcionalidades:

- Paginas com assets pesados e scripts lentos.
- API com rate limit, delay e pico.
- Simulacao de rede lenta/offline.
- Testes de contraste.
- Problemas de foco e leitor de tela.
- Viewports responsivos com bugs controlados.
- Problemas de seguranca intencionais e sanitizados.
- Headers de seguranca.
- IDOR simulado.
- Vazamento de token/PII em modo bugado.

## Backlog por prioridade

### P0 - Base obrigatoria

- Hub de labs.
- Login.
- Catalogo/carrinho/checkout.
- API CRUD.
- Reset de dados.
- Waits dinamicos.
- Acessibilidade por teclado no fluxo principal.
- Export de relatorio exploratorio.
- Documentacao de como rodar.

### P1 - Diferencial da QA Lab

- Modo bugado com bug IDs.
- Gerador de post LinkedIn.
- Banco de charters.
- Banco de bug reports exemplos.
- Test cases embutidos por lab.
- Copiar prompt do lab.

### P2 - Avancado

- GraphQL.
- Performance com endpoint lento.
- WebSocket/eventos.
- Visual regression targets.
- Multi-usuario e concorrencia.
- Admin para ligar/desligar bugs.
- Ranking local de labs concluidos.

## Criterios de aceite do produto

- Usuario consegue iniciar qualquer um dos 5 labs principais pela home.
- O lab de login permite reproduzir os 5 cenarios do Projeto 1.
- O lab de waits permite escrever testes sem sleep fixo.
- A API permite criar, ler, atualizar, atualizar parcialmente e deletar reserva.
- O modulo exploratorio gera relatorio Markdown.
- O checkout pode ser concluido sem mouse.
- Todos os componentes principais tem nome acessivel.
- Existe reset de dados para automacao.
- Existe documentacao de endpoints.
- Existe pelo menos uma suite Playwright validando o fluxo principal.

## Prompt completo para implementar o QA Lab Playground

Use este prompt em uma nova conversa ou tarefa de desenvolvimento:

```text
Voce e um engenheiro senior de frontend/backend. Implemente um produto chamado QA Lab Playground.

Contexto:
Estou criando uma pagina chamada QA Lab no LinkedIn. O objetivo do produto e servir como playground proprio para posts praticos de QA, onde as pessoas precisam colocar a mao na massa. O playground deve substituir dependencias de sites externos como Sauce Demo, The Internet, UI Test Automation Playground, Restful Booker, DemoQA, ExpandTesting e QA Playground, mas com identidade propria e alinhado aos labs da QA Lab.

Objetivo do MVP:
Criar uma aplicacao web funcional com:
1. Hub de labs.
2. Lab de login quebravel.
3. Lab de waits inteligentes.
4. Lab de API CRUD.
5. Lab de charter exploratorio.
6. Lab de acessibilidade por teclado.
7. Produto demo de loja com login, catalogo, carrinho e checkout.
8. API propria documentada.
9. Modo bugado/controlado por query param.
10. Testes Playwright cobrindo os fluxos principais.

Objetivo do produto completo:
O MVP deve nascer com arquitetura para cobrir as 100 ideias da QA Lab. Nao implemente apenas os 5 labs iniciais como paginas isoladas. Crie trilhas, metadados e estrutura de modulos para suportar todos os 100 labs:
1. UI Automation: ideias 1 a 20.
2. API e Contrato: ideias 21 a 40.
3. Exploratorio e pensamento critico: ideias 41 a 55.
4. Qualidade de produto: ideias 56 a 70.
5. CI, pipelines e manutencao: ideias 71 a 85.
6. Performance, acessibilidade, mobile e seguranca: ideias 86 a 100.

Cada lab, mesmo quando ainda nao tiver tela completa no MVP, deve existir como registro navegavel no hub com:
- numero da ideia;
- titulo;
- trilha;
- dificuldade;
- tempo estimado;
- objetivo;
- funcionalidade necessaria;
- entrega esperada;
- criterios de aceite;
- tags;
- prompt de post LinkedIn;
- status: pronto, parcial ou planejado.

Stack desejada:
- TypeScript.
- React com Next.js ou Vite, escolhendo o que melhor combinar com o repositorio.
- API local usando Route Handlers, Express ou Fastify.
- Dados em memoria ou SQLite para MVP.
- Playwright para testes E2E.
- CSS limpo, responsivo, visual de ferramenta de trabalho, sem landing page de marketing.

Design:
- A primeira tela deve ser o hub de labs, nao uma landing page.
- Visual de produto educacional tecnico: claro, organizado, com densidade boa.
- Usar cards apenas para itens repetidos como labs e bugs.
- Layout responsivo.
- Foco visivel em todos os elementos interativos.
- Nao usar textos decorativos explicando obviedades; cada texto deve ajudar o usuario a agir.

Rotas:
- /
- /labs
- /labs/login
- /labs/waits
- /labs/api-crud
- /labs/exploratorio
- /labs/acessibilidade
- /shop/products
- /shop/cart
- /shop/checkout
- /shop/orders/:id
- /playground/elements
- /playground/tables
- /playground/dialogs
- /playground/frames
- /playground/shadow-dom
- /playground/files
- /api/docs

Usuarios de teste:
- standard_user / qa_lab_secret: usuario normal.
- locked_out_user / qa_lab_secret: bloqueado.
- problem_user / qa_lab_secret: comportamento inconsistente.
- performance_user / qa_lab_secret: atrasos artificiais.
- error_user / qa_lab_secret: erros controlados.
- visual_user / qa_lab_secret: problemas visuais.

Lab de login:
- Campos username e password.
- Validar usuario obrigatorio, senha obrigatoria, credencial invalida, usuario bloqueado e login valido.
- Mensagens especificas e testaveis.
- Usar data-testid e labels acessiveis.

Lab de waits:
- Pagina com AJAX delay.
- Pagina com client-side delay.
- Botao que aparece depois de atraso.
- Botao que fica disabled e depois enabled.
- Dynamic ID.
- Overlay que cobre elemento.
- Query param para delays e bugs: ?delay=2000&bug=infinite-loading.
- Nao exigir sleeps fixos para automacao correta.

Lab de API CRUD:
- Criar endpoints:
  POST /api/auth/login
  GET /api/bookings
  POST /api/bookings
  GET /api/bookings/:id
  PUT /api/bookings/:id
  PATCH /api/bookings/:id
  DELETE /api/bookings/:id
  POST /api/test/reset
  GET /api/health
- Auth por token simples para PUT, PATCH e DELETE.
- Retornar status codes corretos: 200, 201, 400, 401, 404, 405, 409.
- Criar /api/docs com exemplos de request/response.

Modulo exploratorio:
- Tela com charter, timer de 30 minutos, notas e bug reports.
- Tipos de nota: observacao, hipotese, duvida, bug.
- Bug report com titulo, passos, esperado, atual, impacto, severidade e evidencia.
- Exportar relatorio Markdown.

Modulo acessibilidade:
- Permitir concluir login, carrinho e checkout usando apenas teclado.
- Validar foco visivel.
- Usar labels, roles, aria-live para erros.
- Criar tambem uma pagina bugada com foco invisivel, botao sem nome acessivel e modal que nao devolve foco.

Loja:
- Catalogo com 12 produtos.
- Busca, filtro, ordenacao.
- Carrinho com add, remove, quantidade.
- Checkout com nome, sobrenome e CEP.
- Resumo com subtotal, taxa e total.
- Pedido finalizado com ID.
- Historico simples de pedidos.

Microdesafios obrigatorios:
- inputs
- checkboxes
- radio
- dropdown
- autocomplete
- date picker
- slider
- modal
- alerts
- nova aba
- iframe
- shadow DOM
- tabela dinamica
- tabela com paginacao
- upload
- download
- drag and drop
- hover
- infinite scroll
- progress bar
- geolocation
- broken links/images
- status codes
- console error
- OTP
- tags input

Modo bugado:
- Ativar bugs por query param.
- Exemplos:
  /labs/login?bug=locked-message
  /shop/checkout?bug=wrong-total
  /labs/waits?bug=infinite-loading
  /labs/acessibilidade?bug=missing-focus
  /api/bookings?bug=delete-without-auth
- Cada bug deve ter ID, descricao, severidade sugerida e passos esperados na documentacao.

Gerador de post:
- Cada lab deve ter botao "Copiar post LinkedIn".
- Template deve conter gancho, desafio, entrega, criterios de aceite, pergunta final e hashtags.
- Hashtags padrao: #QA #QualityAssurance #TestesDeSoftware #AutomacaoDeTestes #Playwright #APITesting #Acessibilidade #QALab

Cobertura obrigatoria das 100 ideias:
- Ideias 1 a 20 exigem UI de loja, formularios, componentes, tabelas, arquivos, frames, shadow DOM, waits e visual targets.
- Ideias 21 a 40 exigem API REST com CRUD, auth, status codes, schema, filtros, paginacao, ordenacao, retry, mock e contrato.
- Ideias 41 a 55 exigem modulo exploratorio com charters, notas, bug reports, personas, interrupcoes, concorrencia, permissoes e risco.
- Ideias 56 a 70 exigem modulo de produto com historias, criterios de aceite, refinamento, metricas, release notes, smoke, regressao e matriz de risco.
- Ideias 71 a 85 exigem modulo de pipeline com CI, logs, flakiness, paralelismo, tags, relatorios, evidencias, secrets, PR template e diagnostico de ambiente.
- Ideias 86 a 100 exigem modulo nao funcional com performance, carga, pico, acessibilidade, responsividade, mobile, rede lenta, offline, seguranca, autorizacao, dados sensiveis e headers.

Testes:
- Criar testes Playwright para:
  1. Login valido e cenarios negativos.
  2. Waits sem timeout fixo.
  3. CRUD de API.
  4. Export do relatorio exploratorio.
  5. Checkout por teclado.
- Os testes devem rodar com npm test ou comando equivalente documentado.

Criterios finais:
- Projeto deve rodar localmente.
- README deve explicar instalacao, execucao, rotas e dados de teste.
- A UI deve ser responsiva.
- Todos os 100 labs devem estar cadastrados e navegaveis pelo hub.
- Os 5 labs iniciais devem estar implementados ponta a ponta.
- Os demais labs devem ter ao menos especificacao, criterios de aceite, rota planejada e modulo associado.
- API deve ter reset para testes repetiveis.
- Nao usar servicos pagos.
- Nao depender de sites externos para funcionar.
```

## Fontes usadas

- https://qaplayground.dev/
- https://www.qaplayground.com/
- https://practice.expandtesting.com/
- https://the-internet.herokuapp.com/
- http://uitestingplayground.com/
- https://demoqa.com/
- https://qa-practice.razvanvancea.ro/
- https://www.automationexercise.com/
- https://www.automationexercise.com/api_list
- https://restful-booker.herokuapp.com/apidoc/index.html
- https://parabank.parasoft.com/parabank/index.htm
- https://automationpanda.com/2021/12/29/want-to-practice-test-automation-try-these-demo-sites/
- https://www.ministryoftesting.com/insights/75-testing-practice-websites-to-master-software-qa-in-2024
