# Plano de publicação do backend do QA Lab

**Atualizado em:** 23/10/2026

**Arquitetura escolhida:** Next.js na Vercel + Supabase Free.

**Ambientes confirmados pelo responsável:** o QA Lab tem um único banco remoto. Não presumir um segundo projeto Supabase para staging nem usar os projetos memente/3dAgency. Validar migrações no Supabase local isolado e fazer smoke controlado no único remoto antes de abrir acesso real.

**Objetivo:** publicar e validar login, dados, arquivos e rotas da API do QA Lab sem migrar para MongoDB nem contratar uma VPS agora.

## 1. O que já existe

- A API do produto está nas rotas `packages/web/app/api`; ela é publicada junto com o aplicativo Next.js. `packages/api` é uma API de treino para os exercícios, não o backend principal do produto.
- O Supabase já é usado pelo código para Auth, PostgreSQL, regras de acesso (RLS) e Storage.
- As migrações principais estão em `packages/web/supabase/migrations`; também existe uma árvore em `supabase/migrations`. É preciso conferir o histórico do projeto remoto antes de aplicar qualquer arquivo.
- `packages/web/vercel.json` já agenda o cron de e-mails e a leitura diária de saúde do Supabase. A rota `/api/cron/supabase-health` foi enviada ao GitHub no commit `09094f4`, mas sua execução em produção ainda não foi confirmada.
- Na última verificação local do Supabase, Auth, chave de serviço, tabelas principais e RLS básico responderam. Faltavam as colunas UTM de `mentorship_waitlist_leads` e `mentorship_orders`; é preciso repetir essa verificação no projeto correto.
- O vínculo deste workspace com a Vercel e as variáveis do ambiente de produção ainda não foram confirmados.

## 2. Desenho final

```text
Navegador
   │
   ▼
Vercel: Next.js + /api/* + ações de servidor + crons
   │
   ├── Supabase Auth: cadastro, login e sessões
   ├── Supabase PostgreSQL: progresso, projetos, inscrições e pedidos
   └── Supabase Storage: evidências e anexos privados
```

As chaves públicas do Supabase podem chegar ao navegador. `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` e credenciais de pagamento/e-mail ficam **somente no servidor**. A URL do site e os redirecionamentos de Auth devem apontar para o domínio real de produção.

## 3. Execução em ordem

### Etapa 1 — Fixar os ambientes

- [ ] Identificar o projeto Supabase **do QA Lab** que será usado em produção e registrar apenas seu *project ref*, sem salvar segredos neste documento.
- [ ] Identificar o projeto Vercel, o diretório raiz de build (`packages/web`), o domínio e o plano da conta.
- [ ] Preparar o Supabase local isolado para ensaiar migrações, RLS e fluxos. A prévia da aplicação pode ser publicada na Vercel, mas não deve apontar para o banco remoto como se fosse um staging isolado.
- [ ] Confirmar se haverá venda/checkout ativo no lançamento. O Vercel Hobby é destinado a uso pessoal não comercial; se houver uso comercial, escolher um plano ou hospedagem compatível antes de habilitar pagamentos.

**Pronto quando:** o único projeto remoto, o domínio e o ambiente local de teste estiverem identificados e o destino de cada mudança estiver claro.

### Etapa 2 — Preparar o Supabase

- [ ] Fazer um backup/exportação antes de alterar o esquema remoto.
- [ ] Comparar a tabela de histórico de migrações do projeto com `packages/web/supabase/migrations` e `supabase/migrations`; documentar a ordem real e resolver divergências antes de aplicar scripts.
- [ ] Aplicar as migrações faltantes no Supabase local, conferir o resultado e só então aplicá-las ao único projeto remoto após backup e comparação do histórico. Para o portfólio atual, confirmar em ordem as cinco migrações `20261023*_portfolio*.sql` e `20261023214640_evidence_upload_quota.sql`; para os demais fluxos, conferir `0030_atomic_lab_completion.sql`, `20261021222551_mentorship_waitlist_attribution.sql` e `20261021233458_mentorship_order_attribution.sql`. A migração histórica do ExpenseFlow não faz parte do fluxo atual.
- [ ] Conferir tabelas, funções SQL, triggers, políticas RLS e o bucket privado de evidências. Validar que dois usuários diferentes não consigam ler ou alterar dados um do outro.
- [ ] Configurar no Supabase Auth a URL do site e os redirecionamentos de login, recuperação de senha e OAuth, se OAuth estiver habilitado.
- [ ] Reexecutar `bun run mentorship:readiness` em `packages/web`, primeiro no ambiente local e depois no único projeto remoto; tratar cada falha antes de avançar.

**Pronto quando:** as migrações necessárias constarem no histórico, as colunas UTM existirem, a leitura/gravação funcionarem e o isolamento entre usuários for comprovado.

### Etapa 3 — Configurar a Vercel

- [ ] Vincular o repositório e definir `packages/web` como raiz do projeto; conferir build e install command do monorepo.
- [ ] Configurar no ambiente **Production** pelo menos `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL` e `CRON_SECRET`. Usar `packages/web/.env.example` como inventário completo, sem copiar valores locais cegamente.
- [ ] Definir `QALAB_TOKEN_SECRET` forte se o Playground/API de treino estiver exposto em produção.
- [ ] Manter `MENTORSHIP_EMAIL_ENABLED=false` até validar remetente, domínio e envio; manter checkout desabilitado ou em sandbox até concluir o gate de pagamentos.
- [ ] Publicar um deploy de produção e conferir que o commit implantado corresponde ao código validado.

**Pronto quando:** o deploy terminar sem erro, as variáveis estiverem no ambiente correto e as rotas da aplicação responderem no domínio público.

### Etapa 4 — Validar os fluxos do backend

- [ ] Executar localmente `bun test packages/web`, `bun run lint` e `bun run build` antes do deploy.
- [ ] No Supabase local, validar cadastro, login, logout e recuperação de senha com duas contas de teste. Após publicar, repetir um smoke limitado com contas descartáveis e as URLs reais no único projeto remoto.
- [ ] Salvar e recuperar progresso de um Lab, projeto/board e uma evidência com arquivo; confirmar persistência após sair e entrar novamente.
- [ ] Tentar acesso cruzado entre as duas contas para validar RLS e links assinados de arquivos.
- [ ] Verificar as rotas `/api/v1/*` usadas pelo lançamento. Registrar status HTTP, resposta e logs para falhas relevantes.
- [ ] Para mentoria/pagamentos, seguir `docs/MENTORIA_RUNBOOK.md` e `docs/STAGING_GATE_QA_LAB.md`: checkout sandbox, webhook, matrícula, revisão e e-mail têm um gate próprio antes de receber usuários reais.

**Pronto quando:** os fluxos do lançamento funcionarem no deploy publicado e não houver falha crítica de acesso, persistência ou permissão.

### Etapa 5 — Confirmar o cron e a operação no Free

- [ ] Verificar na Vercel se `/api/cron/supabase-health` aparece em **Settings → Cron Jobs** e se `CRON_SECRET` está configurado em Production.
- [ ] Disparar a rota de modo autenticado uma vez e conferir resposta `200`; conferir também que uma chamada sem o segredo recebe `401`.
- [ ] Conferir os logs da execução agendada seguinte. Uma resposta `200` significa que a leitura ao Supabase funcionou naquele momento.
- [ ] Acompanhar os avisos de pausa do Supabase e o uso de banco, Storage e tráfego. A leitura diária cria atividade, mas **não garante** que o projeto Free nunca será pausado; documentar como retomá-lo pelo painel.
- [ ] Se o cron falhar, corrigir variáveis, rota ou conectividade e validar novamente. Não usar o cron como substituto de monitoramento de erro ou backup.

**Pronto quando:** houver uma execução agendada bem-sucedida registrada em produção e um procedimento simples para falha ou pausa.

### Etapa 6 — Abrir o lançamento

- [ ] Registrar URL pública, commit implantado, projeto Supabase, última migração e resultado dos testes de smoke em `docs/STAGING_GATE_QA_LAB.md` ou no registro de lançamento.
- [ ] Ativar apenas os módulos cujos fluxos foram validados. Habilitar pagamento e e-mail em etapas separadas após os testes de sandbox e domínio.
- [ ] Observar erros e consumo nos primeiros dias. Para voltar o código, usar o deploy anterior da Vercel; para dados, restaurar a partir do backup ou aplicar uma correção de migração revisada.

**Pronto quando:** uma pessoa nova conseguir se cadastrar, concluir um fluxo do Lab, voltar e encontrar seus dados, sem acessar dados de outra conta.

## 4. Pendências externas e custos

| Item | Situação / decisão |
| --- | --- |
| Supabase Free | Há um único banco remoto do QA Lab; confirmar seu project ref e limites no painel. O ensaio prévio usa Supabase local. |
| Vercel | Código no GitHub; vínculo, plano, variáveis e deploy de produção precisam ser confirmados. |
| Domínio | Opcional para teste no domínio `vercel.app`; necessário se houver URL própria. |
| VPS e MongoDB | Fora deste plano. A arquitetura atual não precisa deles para publicar o backend. |
| E-mail e pagamento | Serviços e credenciais próprios; habilitar somente depois dos respectivos testes. |

**Referências oficiais:** [Supabase Free e limites](https://supabase.com/pricing), [pausa por inatividade](https://supabase.com/docs/guides/platform/free-project-pausing), [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs/quickstart) e [Vercel Hobby](https://vercel.com/docs/plans/hobby).
