# QA Lab — Plano de Produto

## 1. Direção do produto

Transformar o QA Lab em uma plataforma de prática para profissionais de qualidade. O usuário aprende testando aplicações completas, registra evidências e acompanha sua evolução.

**Público inicial:** pessoas estudando ou iniciando em QA, com foco em testes manuais, exploratórios e automação.

**Promessa:** praticar cenários reais sem precisar montar uma aplicação do zero.

## 2. Estrutura da experiência

```text
Home
├── Minha jornada (progresso, metas e últimos Labs)
├── Apps de prática
│   ├── QA Lab (catálogo, checkout, pedidos e operação)
│   ├── Finanças
│   ├── Agendamentos
│   └── CRM
├── Labs e desafios
│   ├── trilhas por competência
│   ├── cenários de regressão
│   └── entregas/evidências
└── Perfil
    ├── portfólio
    ├── conquistas
    └── configurações
```

Os apps são ambientes que o aluno testa. Os Labs são missões sobre esses ambientes. Eles não devem competir como produtos independentes na navegação.

## 3. MVP de produto

### Experiência do aluno

1. Cadastro, login, logout e recuperação de senha.
2. Dashboard pessoal com progresso por Lab e por competência.
3. Catálogo de Labs com busca, filtros e nível.
4. Briefing de Lab com objetivo, dados de teste, oráculo e critérios de aceite.
5. Registro de evidências: resultado, reprodução, severidade e anexos.
6. Packs de regressão de 35 cenários por app.
7. Conclusão de Lab e histórico pessoal.

### Ambientes de prática

1. QA Lab: catálogo, carrinho, checkout, pedidos, conta e operação.
2. Finanças: lançamentos, orçamento, metas e recorrências.
3. Agendamentos: disponibilidade, conflito, reagendamento e cancelamento.
4. CRM: contatos, funil, oportunidades e métricas simuladas.

### Plataforma

1. API própria, autenticação e autorização.
2. Banco persistente para usuários, progresso, evidências e dados de cada app.
3. Auditoria de ações e feature flags para desafios avançados.
4. Telemetria básica: Labs iniciados, concluídos e abandonados.

## 4. Modelo de dados mínimo

| Domínio | Entidades |
| --- | --- |
| Identidade | users, profiles, sessions, roles |
| Aprendizado | tracks, labs, scenarios, enrollments, progress |
| Evidências | submissions, attachments, feedback |
| QA Lab | products, carts, orders, tickets, audit_events |
| Finanças | accounts, transactions, budgets, goals |
| Agendamentos | services, availability, bookings |
| CRM | contacts, companies, deals, activities |

## 5. Fases de entrega

> **Estado em 2026-09-23:** as fases 0 a 4 têm implementação no repositório,
> incluindo quatro ambientes de prática, trilhas, evidências, portfólio, packs
> de regressão e métricas. O catálogo público está em lançamento enxuto, com
> três Labs de Finanças liberados. Implementação local não confirma migrações,
> configuração ou validação em produção; os gates restantes estão em
> **Pendências**.

### Fase 0 — Reorganização (1 semana)

- Definir a home como produto e os apps como ambientes de prática.
- Unificar navegação, nomes, design tokens e rotas públicas.
- Remover telas duplicadas e rotas sem propósito de produto.
- Definir matriz de 35 cenários por app.

**Pronto quando:** uma pessoa entende em menos de 30 segundos o que é o QA Lab, escolhe um Lab e chega ao ambiente correto.

### Fase 1 — Fundamentos (2 semanas)

- Banco e migrações.
- Autenticação, perfil e sessão.
- API versionada para usuário, progresso e evidências.
- Dashboard pessoal e salvamento de progresso.

**Pronto quando:** dados sobrevivem a logout, recarregamento e acesso em outro dispositivo.

### Fase 2 — Primeiro loop de aprendizagem (2 semanas)

- Trilha “Fluxos críticos”: 10 Labs do QA Lab.
- Briefing, execução, envio de evidência e conclusão.
- Avaliação automática de campos obrigatórios e checklist.
- Histórico e progresso visíveis no perfil.

**Pronto quando:** um usuário conclui um Lab de ponta a ponta sem usar estado local como fonte de verdade.

### Fase 3 — Apps e regressão (3 semanas)

- Migrar Finanças, Agendamentos e CRM para dados persistentes.
- Implementar os 35 cenários de regressão por app como casos executáveis.
- Criar bugs plantados controlados por feature flag.
- Adicionar perfis e permissões de teste.

**Pronto quando:** cada app tem dados, erros e permissões reproduzíveis para prática.

### Fase 4 — Produto utilizável (2 semanas)

- Portfólio de evidências compartilhável.
- Exportação de entregas.
- Feedback de conclusão e recomendações de próximo Lab.
- Métricas de uso, erros e funil de ativação.
- Acessibilidade e responsividade validadas.

**Pronto quando:** há ativação mensurável, retorno do aluno e uma jornada clara para continuar praticando.

## 6. Métricas de sucesso

- Ativação: usuário inicia o primeiro Lab no mesmo dia do cadastro.
- Conclusão: percentual de Labs iniciados com evidência entregue.
- Retenção: usuários que retornam em 7 e 30 dias.
- Profundidade: número médio de cenários executados por Lab.
- Qualidade: taxa de erro, acessibilidade e tempo de carregamento por ambiente.

## 7. Regras de produto

- Nenhum Lab é “concluído” sem evidência salva.
- Cada ambiente possui estado vazio, carregamento, erro e sucesso.
- Dados de prática podem ser restaurados para garantir repetibilidade.
- Bugs plantados são explícitos no modo instrutor, ocultos no modo aluno.
- A fonte de verdade é o backend; `localStorage` só pode apoiar cache de interface.

## 8. Onde cada coisa mora

| Assunto | Arquivo |
| --- | --- |
| Ambientes de prática (fonte única) | `packages/web/lib/product/apps.ts` |
| Recursos, campos e validação | `packages/web/lib/product/practice/resources.ts` |
| Regras de domínio no servidor | `packages/web/lib/product/practice/domain.ts` |
| Cálculos compartilhados com a tela | `packages/web/lib/product/practice/{rules,views,shop}.ts` |
| Desvios plantados | `packages/web/lib/product/practice/bugs.ts` |
| Perfis de teste | `packages/web/lib/product/practice/personas.ts` |
| Massa de teste | `packages/web/lib/product/practice/seed.ts` |
| Packs de regressão (35 × 4) | `packages/web/lib/regression-packs.ts` |
| Labs e desafios | `packages/web/lib/system-challenges.ts` |
| Trilhas | `packages/web/lib/product/tracks.ts` |
| Jornada, evidências e progresso | `packages/web/lib/product/{journey,store}.ts` |
| Portfólio público | `packages/web/lib/product/portfolio{,-format}.ts` |
| Métricas | `packages/web/lib/product/metrics{,-store}.ts` |
| API do produto | `packages/web/app/api/v1/**` |
| Console do instrutor | `/lab/instrutor` |
| Painel de métricas | `/lab/metricas` (só `QALAB_ADMIN_EMAILS`) |

`packages/api` (Hono) **não** é a API do produto: é um alvo de teste para os
alunos, usado pelos Labs de API.

## 9. Pendências

1. **Conferir as migrações no projeto Supabase de produção.** O repositório tem
   migrations de produto, cobrança, tentativas, board e Test Suite até `0022`.
   Comparar o histórico remoto com `packages/web/supabase/migrations` e aplicar
   somente as que faltarem, na ordem. A integração de Supabase disponível nesta
   sessão não tem permissão para consultar o projeto configurado no ambiente do
   app; o histórico remoto ainda precisa ser conferido nesse projeto.
2. **Validar os fluxos autenticados e de cobrança em ambiente de staging.**
   Cobrir cadastro/login, jornada, upload privado, portfólio e webhook do
   Mercado Pago; a resposta de retorno do checkout não concede acesso.
3. **Validar acessibilidade e responsividade com tecnologia assistiva e
   dispositivos reais.** O código inclui rótulos, anúncios de estado e
   navegação por teclado, mas isso não substitui a validação prática.
4. **Decidir a expansão do lançamento.** O registry tem mais desafios, mas só
   três entram hoje na vitrine. Publicar cada novo Lab requer liberar sua
   posição e conferir que o ambiente e os critérios de evidência estão prontos.

Auditoria de alterações dos três ambientes de prática não é requisito do MVP
atual: o cenário 31 dos packs foi escrito para o aluno validar justamente a
ausência dessa trilha. Se auditoria de produto virar requisito, deve entrar
como escopo explícito com retenção e permissões definidas.
