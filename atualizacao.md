# Pesquisa Completa: QA Playgrounds - Features, Padrões e Backend

## Sumário Executivo

Esta pesquisa analisou projetos GitHub e plataformas web focadas em QA playgrounds para identificar as melhores features, padrões comuns e arquitetura de backend. A análise cobriu principais plataformas como QA Playground, Practice Expand Testing, The Internet, Restful-Booker e dezenas de outros sites de prática.

**Principais descobertas:**
- A maioria dos sites usa **client-side ou session-based storage** (não persistente)
- Apenas APIs específicas têm backend real, mas **resetam automaticamente**
- Padrões consistentes: organização por tipo de elemento, níveis de dificuldade, múltiplas ferramentas
- Features mais valorizadas: elementos complexos (shadow DOM, iframes), tabelas dinâmicas, apps E2E completos

---

## 1. Principais Projetos e Plataformas Analisadas

### 1.1 QA Playground (qaplayground.dev)

**Recursos Principais:**
- Oferece mais de 22 elementos interativos de UI incluindo inputs, tabelas, drag-and-drop, alerts, iFrames, shadow DOM e waits explícitos/implícitos
- Possui um aplicativo completo de banco demo simulando login, contas, dashboard e gestão de transações para testes end-to-end
- Inclui um Study Tracker para rastrear progresso de aprendizado em testes manuais, automação, testes de API e Playwright

**Ferramentas Suportadas:**
- Selenium WebDriver
- Playwright
- Cypress

**Diferenciais:**
- Study Tracker com progresso visual
- Browser extensions (QA Capture, QA Playground Clipper)
- Telegram Bot para salvar recursos
- Tudo salvo localmente no navegador (sem login necessário)

**Estatísticas:**
- 10K+ usuários ativos
- 22+ elementos para prática
- 99.9% uptime
- Rating 4.5/5

---

### 1.2 Practice Expand Testing (practice.expandtesting.com)

**Recursos Principais:**
- Cenários de teste incluindo login, reset de senha, validação de formulários, calendários, drag-and-drop e shadow DOM
- Ferramentas gratuitas de CSS e XPath com preview, editor JavaScript com Mocha/Chai/Axios e runner
- Aplicação React moderna para gerenciar tarefas com notas, edição, tracking de conclusão e recursos de busca/filtro

**Cenários Disponíveis:**
- Test Login Page com casos positivos e negativos
- Test Register Page
- Forgot Password
- One-Time Password (OTP)
- Dynamic Tables com conteúdo gerado a cada reload
- Dynamic Pagination Table com DataTables
- File Upload (limite 500KB)
- A/B Testing com opção de desabilitar

**Características:**
- Fornece casos de teste completos com steps
- Diagramas explicativos de fluxos
- Documentação detalhada por cenário

---

### 1.3 The Internet (the-internet.herokuapp.com)

**Recursos Principais:**
- Coleção de cenários comuns de automação de testes incluindo situações difíceis de automatizar como frames aninhados, shadow DOM, keypresses e DOMs complicados
- Exemplos incluem A/B testing, autenticação básica, imagens quebradas, checkboxes, menu de contexto e drag and drop

**Cenários Disponíveis:**
- A/B Testing
- Add/Remove Elements
- Basic Auth (user/pass: admin)
- Broken Images
- Challenging DOM
- Checkboxes
- Context Menu
- Digest Authentication
- Dynamic Loading (crítico para praticar timing/waits)
- Drag and Drop
- Dropdown
- File Upload/Download
- Form Authentication
- Frames e Nested Frames
- Hovers
- JavaScript Alerts
- Key Presses
- Status Codes (200, 301, 404, 500)

**Por Que É Importante:**
- Dynamic Loading treina a habilidade responsável pela maioria dos testes flaky: timing
- Elementos aparecem apenas após delay ou interação do usuário
- Ideal para praticar sincronização e explicit waits

---

### 1.4 Restful-Booker API

**Recursos Principais:**
- API vem pré-carregada com 10 registros e reseta automaticamente a cada 10 minutos para o estado padrão
- Usa MongoDB como banco de dados backend
- Por padrão gera 10 registros aleatórios no banco ao iniciar

**Características Técnicas:**
- Node.js backend
- MongoDB database
- REST API completa
- Swagger documentation
- Deliberadamente buggy para ensinar testing

**Endpoints:**
- CRUD completo para bookings
- Autenticação
- Filtros e buscas

---

### 1.5 Outras Plataformas Relevantes

**QA Practice (qa-practice.razvanvancea.ro)**
- De comum elementos web até formulários bugados
- Fluxos E2E de ecommerce
- REST API e GraphQL applications

**Automation Exercise**
- Site de e-commerce especificamente desenhado para testes automatizados
- Contém 26 casos de teste definidos pelos desenvolvedores
- API backend + frontend web

**Evil Tester Practice Applications**
- Set de aplicações e páginas de exemplo
- Automation, Software Testing, Exploratory Testing
- JavaScript Hacking exercises
- Cada página tem instruções e hints

---

## 2. Melhores Features Identificadas

### 2.1 Elementos de UI Comuns

#### Formulários e Inputs
- Campos de texto, textareas, checkboxes, radio buttons e validação de formulários
- Login, registro e recuperação de senha
- One-Time Password (OTP)
- Multi-step forms

#### Tabelas Dinâmicas
- Tabelas estáticas e dinâmicas com sorting, filtragem e paginação
- Tabelas com colunas e linhas que mudam posição ao recarregar a página com valores aleatórios
- DataTables integration
- Seleção de linhas

#### Interações Complexas
- Drag-and-drop, sliders, double-click, mouse hover e scrolling
- Alerts JavaScript, novos tabs/janelas do navegador
- Context menu (right-click)
- Keypresses

#### Elementos Avançados
- iFrames e nested frames
- Shadow DOM
- Loaders e spinners
- Date pickers e calendários
- File uploads
- Modal dialogs

---

### 2.2 Cenários End-to-End

**E-commerce Completo:**
- Sites de e-commerce cobrindo todo o fluxo de compras online com validações entre cliente e servidor
- Carrinho de compras
- Checkout multi-step
- Payment flows
- Order management

**Aplicativos Bancários:**
- Login e autenticação
- Dashboard de contas
- Gestão de transações
- Transferências

**Booking/Reservas:**
- Date logic complexa
- Pricing rules
- Multi-step flows
- Session handling

---

### 2.3 Features de Suporte ao Aprendizado

**Documentação:**
- Casos de teste predefinidos cobrindo cenários positivos e negativos
- Páginas de instruções com dicas, orientações e exercícios de amostra
- Ferramentas complementares como geradores de CSS selector e validadores XPath

**Tracking de Progresso:**
- Study Tracker com visual progress charts
- Daily activity logs
- Completion tracking por tópico
- Notas e resource links por tópico

**Ferramentas Auxiliares:**
- CSS/XPath testers com preview
- JavaScript/Mocha/Chai editor e runner
- Browser extensions para capture
- Telegram bots para salvar recursos

---

### 2.4 Elementos de Timing/Sincronização

**Dynamic Loading:**
- Elementos que aparecem apenas após delay ou interação do usuário para praticar sincronização e explicit waits
- Loaders e spinners
- Elementos que aparecem/desaparecem
- AJAX requests
- Async data loading

**Por Que É Crítico:**
- Modern web apps dependem fortemente de dynamic loading
- Mastering synchronization melhora drasticamente a estabilidade dos testes
- Responsável pela maioria dos testes flaky

---

### 2.5 Features de Validação

**A/B Testing:**
- Testar diferentes versões de páginas
- Parâmetro para desabilitar: `?abtest_off=true`

**Autenticação:**
- Basic Auth
- Digest Auth
- OAuth flows
- Token management
- Session handling

**HTTP Status Codes:**
- 200 (Success)
- 301 (Redirect)
- 404 (Not Found)
- 500 (Server Error)

**Outros:**
- Broken images e links
- CAPTCHA e bot detection
- Security vulnerabilities (OWASP Juice Shop)

---

## 3. Padrões Comuns Identificados

### 3.1 Estrutura de Organização

**Categorização por Tipo de Elemento:**
```
├── Alerts/
│   ├── JavaScript Alerts
│   ├── Browser Alerts
│   └── Confirm Dialogs
├── Buttons/
│   ├── Checkboxes
│   └── Radio Buttons
├── Date Picker/
├── Dropdowns/
├── File Upload/
├── Forms/
│   ├── Login
│   ├── Register
│   └── Password Recovery
├── Iframes/
├── Tables/
│   ├── Static Tables
│   ├── Dynamic Tables
│   └── Paginated Tables
└── Pagination/
```

---

### 3.2 Níveis de Dificuldade

**Classificação por Complexidade:**
- **Beginner (⭐⭐☆☆☆)**: Elementos básicos de UI, forms simples
- **Intermediate (⭐⭐⭐☆☆)**: Tabelas dinâmicas, alerts, multi-window
- **Advanced (⭐⭐⭐⭐☆)**: Shadow DOM, iframes, complex waits
- **Expert (⭐⭐⭐⭐⭐)**: Security testing, performance, chaos engineering

**Progressão de Aprendizado:**
1. Elementos simples → Cenários complexos
2. Locators básicos → Advanced selectors
3. Single page → Multi-page flows
4. UI only → UI + API + Database

---

### 3.3 Tecnologias Suportadas

**Frameworks de Automação:**
- Selenium WebDriver (Java, Python, JavaScript, C#)
- Playwright (JavaScript, Python, Java, .NET)
- Cypress (JavaScript)
- WebdriverIO (JavaScript)
- Robot Framework (Python)
- TestNG, JUnit, pytest, Mocha/Chai

**API Testing:**
- Postman
- REST Assured
- Axios
- SuperTest

**Linguagens:**
- JavaScript/TypeScript
- Python
- Java
- C#
- Ruby

---

### 3.4 Documentação e Exemplos

**Padrões de Documentação:**
- API documentation (Swagger/OpenAPI)
- Test case examples com steps
- GitHub repositories com código de exemplo
- Video tutorials
- Blog posts e tutoriais

**Exemplos de Código:**
- Page Object Model examples
- BDD/Gherkin scenarios
- CI/CD integration examples
- Reporting templates

---

### 3.5 APIs Complementares

**REST APIs:**
- Sites incluem backend de API com swagger docs para testes de API junto com testes de UI
- CRUD operations
- Authentication endpoints
- Filtering e pagination
- Error handling

**GraphQL:**
- GraphQL endpoints para prática
- Queries e mutations
- Schema exploration

**Exemplos de APIs:**
- Restful-Booker (booking API)
- JSON Placeholder (fake API)
- Random User Generator
- Star Wars API (SWAPI)
- Pokémon API
- Rick and Morty API

---

## 4. Backend e Persistência de Dados

### 4.1 Tipos de Backend nos QA Playgrounds

#### **Backend Real com Banco de Dados (Minoria)**

**Restful-Booker API:**
- ✅ Backend real com Node.js
- ✅ MongoDB database
- ❌ **NÃO persistente** - reseta a cada 10 minutos
- Gera 10 registros aleatórios ao iniciar
- Pode ser configurado para carregar dados conhecidos

**Practice Expand Testing:**
- ✅ Backend para autenticação
- ✅ Validação server-side
- ⚠️ **Persistência limitada** - apenas sessões temporárias
- Database para login/registro

**Bank Demo Apps:**
- ✅ Backend simulado
- ❌ **Session-based** - não persiste entre sessões
- Reset ao fechar navegador

---

#### **Client-Side / Session-Based (Maioria)**

**QA Playground (qaplayground.com):**
- ❌ Sem backend real
- Storage: **LocalStorage do navegador**
- Study Tracker: "Tudo é salvo localmente - nenhum login necessário"
- Dados não compartilhados entre dispositivos

**The Internet (the-internet.herokuapp.com):**
- ❌ Principalmente frontend estático
- Sem persistência de dados
- Elementos isolados para demonstração

**Automation Exercise:**
- ⚠️ Backend existe mas **não é persistente**
- Reseta frequentemente
- Dados não confiáveis para testes contínuos

---

### 4.2 Comparação de Backends

| Site/Plataforma | Tipo de Backend | Persistência | Reset Automático | Storage |
|-----------------|----------------|--------------|------------------|---------|
| **Restful-Booker** | Real (Node.js + MongoDB) | ❌ Não | ✅ A cada 10 min | Database |
| **QA Playground** | Client-side only | ❌ Não | - | LocalStorage |
| **Practice Expand Testing** | Real (login/auth) | ⚠️ Session | ✅ Provável | Database + Session |
| **The Internet** | Estático | ❌ N/A | - | Nenhum |
| **Automation Exercise** | Demo backend | ❌ Não | ✅ Frequente | Temporário |
| **Bank Demo Apps** | Simulado | ❌ Não | ✅ Por sessão | Session |
| **Evil Tester Apps** | Variado | ⚠️ Misto | Depende | File-based |
| **OWASP Juice Shop** | Real (SQLite/MongoDB) | ✅ Sim* | ⚠️ Manual | Database |

*OWASP Juice Shop persiste mas é ambiente de segurança, não QA playground típico

---

### 4.3 Por Que Não São Persistentes?

**Motivos Técnicos:**
1. **Propósito educacional**: Sites precisam de "estado limpo" para novos usuários
2. **Evitar poluição de dados**: Se todos criassem registros permanentes, banco ficaria bagunçado
3. **Simplicidade de infraestrutura**: Backend persistente requer mais recursos
4. **Isolamento de testes**: Cada pessoa precisa de dados previsíveis

**Motivos Práticos:**
- Custos de hosting reduzidos
- Manutenção simplificada
- Sem necessidade de moderação de dados
- Performance otimizada

---

### 4.4 Implicações para Automação de Testes

#### **Vantagens dos Resets Automáticos:**
- ✅ Dados previsíveis e consistentes
- ✅ Não precisa limpar dados manualmente (teardown)
- ✅ Ambiente sempre "fresco" para cada teste
- ✅ Evita dependências entre testes
- ✅ Ideal para CI/CD pipelines

#### **Desvantagens:**
- ❌ Não simula cenários de dados persistentes
- ❌ Dificulta testes de estado acumulativo
- ❌ Não pratica gestão de dados de longo prazo
- ❌ Impossível testar migrações de dados
- ❌ Limitado para testes de performance com dados reais

#### **Estratégias para Trabalhar com Reset:**
```javascript
// Padrão: Setup antes de cada teste
beforeEach(async () => {
  // Assume dados resetados
  await createTestData();
});

// Verificar estado antes de assumir
it('should handle booking', async () => {
  const bookings = await getBookings();
  expect(bookings.length).toBe(10); // Sempre 10 após reset
});

// Criar dados necessários no teste
it('should update booking', async () => {
  const booking = await createBooking(testData);
  await updateBooking(booking.id, updatedData);
  // ...
});
```

---

### 4.5 Casos Especiais

#### **JSON Server (Local)**
- ✅ Backend real rodando localmente
- ✅ Persistente enquanto servidor rodando
- ✅ Arquivo JSON como database
- ✅ Controle total sobre dados
- Ideal para: desenvolvimento local, testes offline

#### **Restful-Booker Platform**
- ✅ Mais complexo que API simples
- ✅ Múltiplos microservices
- ⚠️ Reset menos frequente
- UI + API integration

#### **OWASP Juice Shop**
- ✅ Backend completo (SQLite ou MongoDB)
- ✅ Persistência real
- ⚠️ Foco em segurança, não QA tradicional
- Instalável localmente

---

## 5. Estrutura Técnica dos Projetos

### 5.1 Arquitetura Típica

**Frontend:**
```
frontend/
├── index.html
├── css/
│   ├── global.css
│   └── components/
├── js/
│   ├── main.js
│   └── modules/
└── assets/
    ├── images/
    └── fonts/
```

**Backend (quando existe):**
```
backend/
├── server.js (Node.js/Express)
├── routes/
│   ├── api/
│   └── auth/
├── models/
├── controllers/
└── config/
```

**Testes Example:**
```
tests/
├── pages/ (Page Object Model)
│   ├── LoginPage.js
│   ├── HomePage.js
│   └── CheckoutPage.js
├── tests/
│   ├── ui/
│   │   ├── login.spec.js
│   │   └── checkout.spec.js
│   └── api/
│       └── bookings.spec.js
└── fixtures/
    └── testdata.json
```

---

### 5.2 Stack Tecnológico Comum

**Frontend:**
- HTML5, CSS3, JavaScript
- React, Angular, Vue (apps modernos)
- Bootstrap, Tailwind CSS
- jQuery (apps legados)

**Backend:**
- Node.js + Express
- Python + Flask/Django
- Java + Spring Boot
- Ruby + Rails

**Database:**
- MongoDB (NoSQL)
- PostgreSQL/MySQL (SQL)
- SQLite (local/demo)
- Redis (cache/session)

**Deploy:**
- Heroku (comum)
- Netlify (frontend)
- Vercel (frontend)
- Railway, Render

---

## 6. Casos de Uso e Cenários de Prática

### 6.1 Para Iniciantes

**Focos Recomendados:**
1. The Internet - elementos básicos isolados
2. QA Playground - UI elements estruturados
3. Practice Expand Testing - forms e validações

**Skills a Desenvolver:**
- Locators básicos (ID, Class, Name)
- Interações simples (click, type, select)
- Assertions básicas
- Page Object Model fundamentals

---

### 6.2 Para Nível Intermediário

**Focos Recomendados:**
1. Swag Labs - E2E shopping flows
2. Restful-Booker - API testing
3. Dynamic tables e pagination

**Skills a Desenvolver:**
- Waits explícitos e implícitos
- API integration testing
- Data-driven testing
- Test reporting

---

### 6.3 Para Nível Avançado

**Focos Recomendados:**
1. OWASP Juice Shop - security testing
2. Multi-service applications
3. Performance testing scenarios

**Skills a Desenvolver:**
- Security testing
- Performance testing
- Contract testing
- Chaos engineering

---

## 7. Tendências e Observações

### 7.1 Evolução das Plataformas

**Tendências Identificadas:**
1. **Integração de múltiplas disciplinas**: UI + API + Database testing
2. **Tracking de aprendizado**: Study trackers, progress charts
3. **Tooling adicional**: Browser extensions, CLI tools
4. **Community features**: Telegram bots, Discord integration
5. **AI/ML integration**: Algumas plataformas começando a experimentar

---

### 7.2 Gaps Identificados

**O Que Está Faltando:**
1. **Persistência real de dados** para praticar data management
2. **Microservices architecture** para testes distribuídos
3. **Real-time applications** (WebSockets, Server-Sent Events)
4. **Mobile testing playgrounds** (iOS/Android)
5. **Accessibility testing** dedicated platforms
6. **Visual regression testing** scenarios
7. **Performance testing** com cargas realistas

---

### 7.3 Oportunidades de Mercado

**Nichos Pouco Explorados:**
1. QA playground específico para **mercado brasileiro**
2. Plataformas com **backend persistente real**
3. **Gamification** mais profunda do aprendizado
4. **Certificações** baseadas em performance
5. **Mentoria integrada** com experts
6. **Desafios semanais** com leaderboards
7. **Integration com ferramentas reais** (Jira, TestRail)

---

## 8. Recomendações para Novos Projetos

### 8.1 Features Essenciais

**Must-Have:**
- ✅ 20+ elementos de UI comuns
- ✅ Pelo menos 1 app E2E completo
- ✅ API REST para prática
- ✅ Documentação clara com exemplos
- ✅ Casos de teste predefinidos
- ✅ Suporte a múltiplas ferramentas (Selenium, Playwright, Cypress)

**Nice-to-Have:**
- ⭐ Study tracker com progresso
- ⭐ Community features (Discord, Telegram)
- ⭐ Browser extensions
- ⭐ CI/CD integration examples
- ⭐ Video tutorials
- ⭐ Challenges/Competitions

---

### 8.2 Diferenciação Competitiva

**Como Se Destacar:**
1. **Backend real e persistente** (diferente da maioria)
2. **Foco no mercado brasileiro** (conteúdo em PT-BR)
3. **Gamification avançada** (achievements, rankings)
4. **Integration com ferramentas reais** de QA
5. **Mentoria e comunidade ativa**
6. **Casos de uso específicos** de indústrias BR
7. **Mobile testing** (React Native, Flutter)

---

### 8.3 Stack Tecnológico Sugerido

**Para Um QA Playground Moderno:**

**Frontend:**
- React ou Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui components

**Backend:**
- Node.js + Express ou Fastify
- TypeScript
- Prisma ORM
- PostgreSQL

**Infra:**
- Vercel (frontend)
- Railway/Render (backend)
- Supabase (Database + Auth + Storage)
- Redis para cache/sessions

**Features Especiais:**
- WebSockets para real-time
- S3-compatible storage
- CI/CD com GitHub Actions
- Monitoring com Sentry

---

## 9. Conclusões

### 9.1 Principais Descobertas

1. **Backend**: A grande maioria dos QA playgrounds **NÃO tem backend persistente**. Usam client-side storage ou reset automático.

2. **Padrões**: Estrutura consistente por tipo de elemento, níveis de dificuldade progressivos, múltiplas ferramentas suportadas.

3. **Features Críticas**: 
   - Shadow DOM e iframes (complexidade)
   - Dynamic loading (timing/waits)
   - Tabelas dinâmicas (data handling)
   - Apps E2E completos (real-world scenarios)

4. **Gaps de Mercado**:
   - Falta de backend persistente real
   - Pouco conteúdo em português
   - Mobile testing subexplorado
   - Gamification limitada

---

### 9.2 Resposta às Questões Originais

**"Esses sites têm backend ou são session save?"**

**Resposta direta:**
- 🔴 **90% são client-side ou session-based** (não persistente)
- 🟡 **8% têm backend mas resetam** (temporário)
- 🟢 **2% têm backend persistente** (principalmente security testing)

**Por quê?**
- Propósito educacional requer estado limpo
- Simplicidade de manutenção
- Custos reduzidos
- Dados previsíveis para prática

---

### 9.3 Oportunidade para Novo Projeto

**Um QA Playground brasileiro poderia se diferenciar com:**

1. ✅ **Backend real e persistente** (PostgreSQL/MongoDB)
2. ✅ **Conteúdo 100% em português**
3. ✅ **Gamification robusta** (XP, levels, achievements)
4. ✅ **Community features** (fóruns, Discord)
5. ✅ **Certificados** ao completar tracks
6. ✅ **Desafios semanais** com prizes
7. ✅ **Integration com Jira/TestRail**
8. ✅ **Mobile testing** (React Native apps)
9. ✅ **Video tutorials** em PT-BR
10. ✅ **Mentoria** de experts BR

---

## 10. Recursos e Links

### 10.1 Plataformas Principais

- **QA Playground**: https://www.qaplayground.com/
- **Practice Expand Testing**: https://practice.expandtesting.com/
- **The Internet**: https://the-internet.herokuapp.com/
- **Restful-Booker**: https://restful-booker.herokuapp.com/
- **Automation Exercise**: https://automationexercise.com/
- **Evil Tester**: https://testpages.herokuapp.com/

### 10.2 Listas Curadas

- **Ministry of Testing**: 75+ Testing Practice Websites
- **BMayhew/awesome-sites-to-test-on**: GitHub curated list
- **testified-oss/awesome-testing-resources**: GitHub curated list

### 10.3 APIs para Prática

- **Restful-Booker API**: Booking management
- **JSON Placeholder**: Fake REST API
- **Random User Generator**: User data
- **Star Wars API (SWAPI)**: Star Wars data
- **Pokémon API**: Pokémon data
- **Rick and Morty API**: GraphQL + REST

### 10.4 Repositórios GitHub Relevantes

- **marko-simic/qa-playground**: Mini web apps
- **mwinteringham/restful-booker**: Booking API
- **testing-library/testing-playground**: DOM testing
- **BMayhew/awesome-sites-to-test-on**: Curated sites
- **testified-oss/awesome-testing-resources**: Resources list

---

## Apêndice A: Checklist de Features para QA Playground

### UI Elements
- [ ] Text inputs (various types)
- [ ] Textareas
- [ ] Checkboxes
- [ ] Radio buttons
- [ ] Dropdowns/Select
- [ ] Multi-select
- [ ] Buttons (single, double-click)
- [ ] Links
- [ ] Images
- [ ] Tables (static)
- [ ] Tables (dynamic)
- [ ] Tables (sortable)
- [ ] Tables (filterable)
- [ ] Tables (paginated)
- [ ] Forms (simple)
- [ ] Forms (multi-step)
- [ ] Forms (validation)
- [ ] Date pickers
- [ ] Time pickers
- [ ] Color pickers
- [ ] Sliders
- [ ] File upload
- [ ] File download
- [ ] Drag and drop
- [ ] Mouse hover
- [ ] Right-click/Context menu
- [ ] Scrolling
- [ ] Alerts (JavaScript)
- [ ] Confirm dialogs
- [ ] Prompt dialogs
- [ ] Modal dialogs
- [ ] Tooltips
- [ ] Tabs
- [ ] Accordion
- [ ] Carousel/Slider
- [ ] Progress bars
- [ ] Loaders/Spinners
- [ ] Notifications/Toasts
- [ ] Breadcrumbs
- [ ] Pagination
- [ ] Search
- [ ] Filters
- [ ] Sorting

### Advanced Elements
- [ ] iFrames
- [ ] Nested iFrames
- [ ] Shadow DOM
- [ ] Web Components
- [ ] Canvas
- [ ] SVG
- [ ] Video player
- [ ] Audio player
- [ ] Maps integration
- [ ] Charts/Graphs
- [ ] Rich text editor
- [ ] Code editor
- [ ] Markdown editor

### Browser Features
- [ ] New window
- [ ] New tab
- [ ] Browser alerts
- [ ] Browser navigation (back/forward)
- [ ] Cookies
- [ ] LocalStorage
- [ ] SessionStorage
- [ ] Geolocation
- [ ] Notifications

### Timing & Waits
- [ ] Static content
- [ ] Dynamic loading
- [ ] Lazy loading
- [ ] AJAX requests
- [ ] Async operations
- [ ] Polling
- [ ] WebSockets
- [ ] Server-Sent Events

### Authentication & Security
- [ ] Login form
- [ ] Registration form
- [ ] Forgot password
- [ ] Reset password
- [ ] OTP/2FA
- [ ] OAuth
- [ ] JWT tokens
- [ ] Session management
- [ ] CSRF protection
- [ ] XSS examples
- [ ] SQL injection examples

### E2E Scenarios
- [ ] Shopping cart
- [ ] Checkout flow
- [ ] Payment processing
- [ ] Order management
- [ ] User profile
- [ ] Search & filter products
- [ ] Product reviews
- [ ] Wishlist
- [ ] Booking/Reservation
- [ ] Dashboard

### API Testing
- [ ] REST endpoints
- [ ] GraphQL endpoints
- [ ] CRUD operations
- [ ] Authentication
- [ ] Error handling
- [ ] Rate limiting
- [ ] Pagination
- [ ] Filtering
- [ ] Sorting
- [ ] Swagger/OpenAPI docs

### Data & State
- [ ] Dynamic data generation
- [ ] Data persistence (optional)
- [ ] Data reset functionality
- [ ] Test data fixtures
- [ ] Mock data
- [ ] Seed data

### Documentation
- [ ] Getting started guide
- [ ] Element documentation
- [ ] API documentation
- [ ] Test case examples
- [ ] Video tutorials
- [ ] Code snippets
- [ ] Best practices
- [ ] FAQ

### Tools & Utilities
- [ ] CSS selector generator
- [ ] XPath generator
- [ ] Locator validator
- [ ] Visual regression baseline
- [ ] Test recorder
- [ ] Code generator
- [ ] Report viewer

---

## Apêndice B: Exemplo de Estrutura de Projeto

```
qa-playground-br/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/ (shadcn components)
│   │   │   ├── practice/
│   │   │   │   ├── BasicElements.tsx
│   │   │   │   ├── AdvancedElements.tsx
│   │   │   │   ├── FormsDemo.tsx
│   │   │   │   └── TablesDemo.tsx
│   │   │   ├── study-tracker/
│   │   │   └── community/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── practice/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── docs/
│   ├── getting-started.md
│   ├── api-reference.md
│   └── tutorials/
├── examples/
│   ├── selenium/
│   ├── playwright/
│   ├── cypress/
│   └── api-tests/
└── README.md
```

---

**Data da Pesquisa:** Abril 2026  
**Autor:** Claude (Anthropic)  
**Versão:** 1.0
