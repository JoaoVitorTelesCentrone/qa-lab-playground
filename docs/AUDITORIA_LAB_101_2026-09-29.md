# Auditoria — QA Lab Playground e Lab 101

Data da auditoria: 29/09/2026  
Escopo: código local, testes automatizados e configuração presente no repositório. Não foram consideradas como comprovadas integrações remotas sem acesso ao respectivo ambiente.

Legenda: ✅ implementado e verificado localmente · ⚠️ código/configuração existe, mas requer validação remota · ❌ pendente · 👤 decisão ou ação humana.

## Resultado executivo

O fluxo principal do Playground foi reativado localmente. O lançamento enxuto que escondia jornada e APIs foi desabilitado; Lab 101, 103 e 105 estão liberados no catálogo. O Lab 101 agora possui a massa fixa de janeiro/2024, os quatro desvios solicitados e avaliação específica da evidência.

O bloqueio para declarar lançamento pronto é externo: o projeto Supabase apontado por `.env.local` não está disponível na conexão atual. Portanto não é possível confirmar migrações aplicadas, RLS, bucket privado, persistência, autenticação real ou webhook de pagamento em ambiente publicado.

## O que foi implementado nesta auditoria

- Reativados jornada, catálogo e endpoints do produto (`CONTENT_ONLY_LAUNCH` e `VIEW_ONLY_LAUNCH` estão desativados).
- Ajustado o ambiente Finanças para usar os desvios ativos e exibir lançamentos, contas, orçamentos, metas e relatório.
- Criada a massa determinística do Lab 101: 12 lançamentos `#001`–`#012`, período janeiro/2024, saldo exibido R$ 1.530,00 e saldo corrigido R$ 1.730,00.
- Implementados os quatro achados do Lab 101: duplicidade `#004/#011`, item de fevereiro `#009`, categoria invertida `#007` e receita negativa `#012`.
- Criada avaliação do Lab 101: reconhece os três achados principais, dá feedback positivo com três ou mais e mantém o caso de borda opcional.
- Ajustados os briefs de Lab 103 e 105; ambos têm massa e desvio controlado testável.
- Adicionado desvio controlado para meta acima de 100% e valor restante negativo no Lab 105.
- Corrigida a URL padrão do Playwright local de porta 3002 para 3000.
- Adicionada a migração `0023_finance_lab_101_negative_income.sql`, necessária para a massa do Lab 101 aceitar a receita negativa controlada.

## Checklist auditado

### Playground base

| Item | Situação | Evidência |
| --- | --- | --- |
| Cadastro, login, logout, recuperação e atualização de senha | ⚠️ | Rotas e clientes Supabase existem; falta executar contra o projeto remoto correto. |
| Auth Supabase e RLS | ⚠️ | Migrations e código existem; não foi possível inspecionar/aplicar no projeto configurado. |
| Jornada, progresso e próximo passo | ✅ | Implementado e coberto por testes de jornada. |
| Catálogo, briefing, iniciar e concluir Lab | ✅ | Catálogo e APIs ativos; testes do catálogo passam. |
| Histórico e certificados verificáveis | ✅ | Implementados e cobertos por testes de certificado. |
| Evidência textual, anexo, avaliação e feedback | ⚠️ | Fluxo e avaliação local existem; upload privado requer Storage remoto. |
| Perfil e portfólio público compartilhável | ✅ | Implementado e coberto por testes de portfólio. URL pública depende de deploy. |
| Ambiente Finanças | ✅ | Lançamentos, saldo, contas, orçamentos, metas e relatório visíveis no ambiente. |
| Mercado Pago, webhook e upgrade Pro | ⚠️ | Integração existe no código; requer credenciais, endpoint público e pagamento real/sandbox. |

### Lab 101

| Item | Situação | Evidência |
| --- | --- | --- |
| Lab liberado na trilha Finanças | ✅ | Catálogo libera 101, 103 e 105; teste de catálogo passa. |
| Briefing, objetivo, passos, aceite e resultado | ✅ | Briefing específico do Lab 101. |
| Período, 12 IDs e saldos | ✅ | Janeiro/2024; `#001`–`#012`; R$ 1.530,00 exibido e R$ 1.730,00 corrigido. |
| Duplicado, fora do período, categoria errada e receita negativa | ✅ | Massa e testes determinísticos do Lab 101. |
| Três achados geram feedback positivo | ✅ | Teste de avaliação passa. |
| Caso de borda não bloqueia | ✅ | Teste de avaliação passa. |
| Portfólio após submissão aceita | ✅ | Fluxo de evidência/portfólio implementado; confirmar no ambiente remoto após Storage. |

### Labs 103 e 105

| Lab | Situação | Evidência |
| --- | --- | --- |
| 103 — orçamento por categoria e alerta de estouro | ✅ | Liberado, briefing específico e desvio `financas.orcamento-sem-alerta`. |
| 105 — metas de reserva | ✅ | Liberado, briefing específico e desvio `financas.meta-supera-limite`. |

### Infraestrutura e testes

| Item | Situação | Evidência |
| --- | --- | --- |
| Next.js 16, React 19, TypeScript e Tailwind | ✅ | Build de produção local concluída. |
| Hono/Bun e APIs de treinamento | ✅ | Implementados no repositório; testes de API passam. |
| Supabase, RLS, Storage e persistência | ⚠️ | Não confirmados remotamente por falta de acesso ao projeto configurado. |
| Docker Compose, staging e produção | ⚠️ | Necessitam execução/URL do ambiente. |
| Testes unitários | ✅ | `bun test packages/web`: 244 passando. |
| Playwright dos fluxos principais | ❌ | A configuração de porta foi corrigida, mas os cenários existentes estão defasados em relação à UI/dados atuais e precisam ser atualizados antes de servirem como gate. |

### Conteúdo e execução dos posts

| Item | Situação | Evidência |
| --- | --- | --- |
| Materiais de marketing e documentação | ✅ | Há conteúdo e documentação no repositório. |
| Prints dos 12 posts | ❌ | Dependem da execução real da jornada e captura das telas. |
| URLs pública do Playground e portfólio de João | ⚠️ | Dependem do deploy e da conta que executará o Lab. |
| Data, horário e perfil do aluno para os posts | 👤 | Decisão de produto/comunicação. |
| Perfil pessoal e página LinkedIn | 👤 | Auditoria exige acesso ao LinkedIn e decisão editorial. |

## Backlog prioritário de liberação

1. Dar acesso ao projeto Supabase de `.env.local` e aplicar todas as migrations, incluindo `0023_finance_lab_101_negative_income.sql`.
2. Confirmar bucket privado de evidências, RLS e uma jornada real: cadastro → Lab 101 → três evidências → feedback → portfólio.
3. Configurar e testar Mercado Pago em sandbox, incluindo assinatura do webhook e upgrade de plano.
4. Atualizar os testes Playwright para a UI e a massa de janeiro/2024; executar a jornada completa como gate.
5. Publicar staging/produção, registrar as URLs e só então capturar os prints e iniciar os 12 posts.

## Comandos de verificação executados

```text
bun test packages/web   # 244 pass, 0 fail
bun run build           # build de produção concluída
```

## Decisões que ainda precisam de resposta

1. João Vitor executará o Lab 101 como aluno comum ou com conta especial de demonstração?
2. Qual é a data exata e o horário dos 12 posts?
3. Qual URL de staging/produção será usada nos materiais?
4. Há um quarto Lab a ser priorizado após 103 e 105?
