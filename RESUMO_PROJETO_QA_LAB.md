# QA Lab Playground — resumo do projeto

## O que é

O **QA Lab** é uma plataforma educacional brasileira para aprender e praticar Quality Assurance (QA) em cenários simulados. A proposta é substituir parte da teoria isolada por prática: o aluno testa aplicações, investiga comportamentos, registra evidências e transforma o trabalho em portfólio.

**Promessa central:** praticar decisões reais de QA sem precisar montar um sistema do zero.

O público prioritário é formado por pessoas começando em QA, profissionais em transição de carreira e QAs que querem criar repertório prático para entrevistas e trabalho.

## Objetivos do produto

1. Levar uma pessoa do primeiro Lab até uma evidência útil e compartilhável.
2. Ensinar investigação, planejamento, testes manuais/exploratórios e automação em contextos próximos de produtos reais.
3. Oferecer ambientes controlados, com dados e bugs reproduzíveis, para que testes possam ser repetidos.
4. Registrar evolução por Labs, trilhas, competências, entregas e portfólio público.
5. Criar uma jornada de entrada gratuita e uma oferta Pro para recursos e ambientes avançados.

## Estado atual do lançamento

O código contém um catálogo amplo de **130 Labs**, mas o lançamento público está intencionalmente enxuto. Hoje, três Labs de Finanças estão liberados:

| Lab | Objetivo |
| --- | --- |
| 101 | Validar lançamentos e o saldo do período |
| 103 | Validar orçamento por categoria e alerta de estouro |
| 105 | Validar metas de reserva |

Os demais Labs estão registrados como agendados e direcionam o visitante para a lista de interesse. O foco atual é validar bem a jornada desses três Labs antes de expandir o catálogo.

## Principais funcionalidades

### Jornada de aprendizagem

- Home com jornada, progresso e próximo passo recomendado.
- Catálogo de Labs com briefing, objetivo, dados de teste, passos, critérios de aceite e resultado esperado.
- Trilhas de aprendizagem por contexto: fluxos críticos, Finanças, Agendamentos e CRM.
- Início, conclusão e histórico de Labs.
- Certificados verificáveis por trilha.
- Roadmap de QA, estudos e biblioteca de pesquisa.

### Evidências e portfólio

- Envio de evidências textuais e anexos para cada Lab.
- Avaliação automática dos requisitos mínimos de uma entrega.
- Perfil do aluno com progresso, estatísticas, projetos e links profissionais.
- Portfólio público por usuário, com páginas de projetos e Labs.
- Seções personalizáveis no portfólio e conteúdo preparado para compartilhamento no LinkedIn.

### Ambientes de prática

O aluno testa produtos simulados, cada um com fluxos, massa de dados, permissões e desvios plantados para investigação:

| Ambiente | O que pode ser praticado |
| --- | --- |
| QA Lab Shop | Catálogo, busca, carrinho, checkout, pedidos, conta e operação. |
| Finanças | Lançamentos, saldo, contas, orçamentos, metas e relatórios. |
| Agendamentos | Disponibilidade, conflitos, reservas, reagendamento e cancelamento. |
| CRM | Funil, oportunidades, empresas, contatos, atividades e indicadores. |
| Web Playground | Elementos, tabelas, arquivos, frames, diálogos e Shadow DOM. |

Também há recursos específicos para prática de acessibilidade, login, CRUD, testes exploratórios, esperas assíncronas e regressão.

### Labs especializados

- **API Playground:** API de treino com documentação, autenticação, contratos, rate limit, sessões isoladas e cenários controlados de falha.
- **Test Design Studio:** requisitos, riscos, casos de teste, passos, planos, cobertura e versões de artefatos.
- **Execution Hub:** projetos, estratégia, execução, defeitos e evidências.
- **Board pessoal:** quadros, colunas, itens, checklist, comentários, backlog e arquivamento.
- **People Lab:** 200 situações sobre comunicação, feedback, conflitos, negociação e liderança.
- **Refinement e Critérios:** ambiguidade de requisitos, perguntas, riscos e critérios de aceite testáveis.
- **Bug Triage e Logs:** severidade, prioridade, decisão de risco, investigação de incidentes e hipótese de causa raiz.
- **CI/CD Lab:** pipeline, quality gates, deploy, rollback e qualidade na entrega.
- **Security Lab:** decisões de segurança em cenários controlados e autorizados.
- **Packs de regressão:** roteiros de regressão por ambiente.

### Conta, dados e cobrança

- Cadastro, login, logout, recuperação e atualização de senha via Supabase Auth.
- Persistência de progresso, entregas, portfólio, Boards, Test Suite e dados de prática no Supabase.
- Políticas de segurança por usuário (RLS) nas migrações do produto.
- Upload privado de evidências em Storage.
- Checkout Pro do Mercado Pago para **QA Lab Pro — acesso vitalício por R$ 297**.
- Webhook assinado: o plano só é atualizado após confirmação de pagamento pelo Mercado Pago.

## API de treinamento

Além da API interna do produto (`/api/v1/*`), o repositório possui uma API Hono/Bun intencionalmente imperfeita para exercícios. Ela oferece usuários, produtos, pedidos, saúde do serviço, casos de teste e controles de Chaos Engineering.

Os exercícios podem demonstrar problemas como paginação inconsistente, contrato quebrado, atualização que retorna falso sucesso, exclusão sem efeito, respostas de erro inadequadas, atraso e instabilidade. Isso é proposital: a API é um alvo para o aluno testar, não o backend principal da plataforma.

## Tecnologia

| Camada | Implementação |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript e Tailwind CSS 4 |
| Interface | Radix UI, componentes próprios e shadcn/ui |
| API de treinamento | Hono + Bun |
| Dados, autenticação e arquivos | Supabase |
| Pagamento | Mercado Pago Checkout Pro |
| Testes | Bun test e Playwright |
| Infraestrutura local | Bun workspaces e Docker Compose |

O monorepo é dividido em `packages/web` (produto web), `packages/api` (API de treinamento), `packages/shared` (tipos compartilhados) e bibliotecas de conteúdo/ativos.

## Próximas prioridades registradas

1. Validar em staging os fluxos de autenticação, primeira evidência, portfólio, upload e cobrança.
2. Confirmar migrações, políticas RLS e configuração do Supabase publicado.
3. Garantir acessibilidade e responsividade nos fluxos principais.
4. Medir o funil: cadastro, início do Lab, primeira evidência, portfólio, checkout e uso Pro.
5. Melhorar a experiência dos Labs 101, 103 e 105 antes de liberar mais conteúdo.
6. Revisar a autorização do painel de métricas antes do lançamento público.

## Conteúdo e marca

O repositório também contém documentação de produto, planos de lançamento, materiais de curso, posts para LinkedIn, referências visuais e uma biblioteca de carrosséis. Esses materiais sustentam a aquisição de alunos e a publicação contínua de conteúdo sobre QA, automação, carreira, IA e qualidade de software.

---

Resumo baseado no código e na documentação do repositório em setembro de 2026. Documentos históricos podem descrever versões anteriores; o catálogo e as regras implementadas em `packages/web` representam o comportamento atual.
