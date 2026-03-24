# Apresentação de Produto: QA Lab Playground

## 🎯 Visão Executiva
O **QA Lab Playground** é uma plataforma educacional desenvolvida especificamente para o treinamento e capacitação de profissionais de Quality Assurance (QA) e Desenvolvedores. 

**Proposta de Valor:** "Aprenda quebrando coisas de propósito". Oferecemos um ambiente seguro e controlado onde a equipe pode praticar a identificação de falhas, automação de testes e validação de edge cases por meio da interação com sistemas que falham intencionalmente.

---

## 🚀 Principais Funcionalidades (Features)

### 1. API Playground com "Modo Caos"
Uma API simulada contendo 10 endpoints críticos. O grande diferencial é o controle do **Modo Caos**, que permite injetar falhas propositais e realistas, tais como:
- Erros 500 intermitentes
- Retorno de dados incorretos ou formatos mutáveis
- Timeouts severos e intermitentes
- Paginação inconsistente (pulando itens)
- Falsos positivos (Status code 200 para erros, ou 204 que não deletam o recurso)

### 2. Cenários de Teste Guiados
Para direcionar o aprendizado, a plataforma oferece 5 cenários estruturados:
- Validação de listagem de usuários
- Busca por bugs em formulários
- Testes de busca abordando edge cases
- Identificação de respostas inconsistentes da API
- Validação de tratamento de erros no frontend

### 3. Formulário "Bugado" (Buggy Form)
Um formulário de cadastro na interface que contém exatamente 5 bugs propositais ocultos. Excelente para treinar o olhar clínico e a criação de automações de teste de UI.

---

## 💡 Benefícios para o Negócio e para o Time

* **Onboarding Acelerado:** Reduz a curva de aprendizado de novos QAs, oferecendo um ambiente prático desde o dia 1.
* **Aumento da Resiliência Técnica:** Ensina a equipe a focar não apenas no "caminho feliz", mas a projetar testes e código que lidem com intermitências e APIs não confiáveis.
* **Laboratório de Automação:** Fornece um alvo estável para que a equipe pratique ferramentas de automação (Cypress, Playwright, K6, etc) contra problemas recorrentes do mundo real.

---

## 🛠 Arquitetura e Tecnologia (Visão de Alto Nível)

A solução foi construída com tecnologias modernas, garantindo performance e facilidade de manutenção:
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4 e shadcn/ui (Interface moderna, rápida e componentizada).
- **Backend:** Hono rodando no Bun (Alta performance para responder e simular os gargalos da API).
- **Estruturação:** Monorepo utilizando Bun workspaces, separando claramente as camadas Web, API e recursos compartilhados.
- **Distribuição:** Totalmente containerizado (Docker e docker-compose), permitindo que qualquer pessoa rode a plataforma na sua máquina com um único comando (`docker-compose up`).

---

## 🎯 Próximos Passos Sugeridos
1. Disponibilizar a plataforma para a equipe de QA realizar testes exploratórios.
2. Criar desafios semanais baseados no "Modo Caos" para engajar o time técnico.
3. Coletar feedback para inclusão de novos cenários de testes baseados nos problemas reais que enfrentamos em produção.
