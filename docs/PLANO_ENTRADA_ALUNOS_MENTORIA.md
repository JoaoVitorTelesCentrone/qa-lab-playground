# Plano de entrada de alunos — Mentoria QA Lab

**Estado em 22/10/2026:** fluxo de inscrição e cobrança implementado localmente; configuração comercial, aplicação das migrations e validação em staging/produção ainda pendentes.
**Objetivo:** permitir que uma pessoa descubra a turma, crie sua conta, solicite ou compre uma vaga, receba confirmação e acesse o diagnóstico e o painel da mentoria. O QA Lab Pro permanece uma oferta separada.

## 1. Situação atual

- `/mentoria` e `/mentoria/inscricao` já leem ofertas e turmas publicadas, exibem preço, datas, vagas disponíveis e estado das inscrições. Sem oferta aberta, a página oferece a lista de interesse própria da mentoria.
- Cadastro e login em `/cadastro` e `/login` retornam a pessoa ao fluxo de inscrição.
- A inscrição, a fila administrativa, as bolsas e as confirmações manuais estão implementadas. A ativação da matrícula verifica a capacidade da turma e pode ser repetida sem criar vaga duplicada.
- O checkout da mentoria usa ordens próprias, separado de `billing_purchases` do QA Lab Pro. O webhook consulta e confere o pagamento antes de ativar a matrícula; retorno do navegador não concede acesso.
- Matrícula `invited` não libera diagnóstico nem entregas; a jornada exige estado `active`.
- O código e as migrations existem localmente. Ainda falta aplicá-las ao projeto Supabase correto e comprovar a jornada em staging; o checkout da mentoria ainda precisa de compra sandbox e validação do webhook.
- O plano de turma permanece sem preço, datas, capacidade, contato de suporte e políticas comerciais aprovados. A tela consegue apresentar esses dados quando a oferta for configurada.

## 2. Decisões de produto a registrar antes de abrir inscrições

| Decisão | Proposta para a turma fundadora | Dono |
| --- | --- | --- |
| Oferta | Mentoria por turma, compra única, independente do Pro | Produto |
| Preço e parcelamento | Definir valor em BRL, condições exibidas e se haverá bolsas | Produto |
| Turma | Código, início, fim, mentor, vagas e prazo de inscrição | Operação |
| Acesso | `invited` apenas pré-matrícula; `active` após confirmação da vaga/pagamento | Produto + engenharia |
| Vaga reservada | Definir prazo que acompanhe a validade da preferência e do meio de pagamento | Produto + engenharia |
| Ausência de vaga após pagamento tardio | Atendimento e solução comercial definidos antes da venda | Operação |
| Cancelamento, reembolso e pausa | Texto público, responsável e efeito sobre a matrícula | Produto + operação |
| Contato | Canal de suporte que o aluno possa usar após inscrição e pagamento | Operação |

Não fixar preço, prazo ou política no código até essas decisões serem aprovadas. A página pública deve usar os mesmos dados de oferta e turma que o checkout valida no servidor.

## 3. Jornada e estados

```text
/mentoria
  -> /mentoria/inscricao (oferta e turma aberta)
  -> /cadastro ou /login?next=/mentoria/inscricao
  -> reserva/ordem da vaga
  -> Checkout da mentoria hospedado pelo Mercado Pago
  -> /mentoria/inscricao/status (aguardando, aprovado ou falhou)
  -> webhook autenticado + consulta do pagamento no provedor
  -> matrícula active na turma correta
  -> aviso ao aluno + /mentoria/diagnostico -> /mentoria/app
```

A página de retorno apenas consulta o estado da ordem no servidor; parâmetros de URL não concedem acesso. Compra pendente ou rejeitada não cria matrícula ativa. A pessoa que já possui matrícula ativa vai diretamente ao painel. A pessoa sem turma aberta encontra lista de interesse própria da mentoria, com registro interno e confirmação de recebimento.

### Estados da inscrição

| Estado | Experiência do aluno | Ação da equipe |
| --- | --- | --- |
| Inscrições fechadas / lotadas | Data ou lista de interesse; sem botão de pagamento | Abrir turma ou responder à fila |
| Conta não confirmada | Instrução para confirmar e-mail e retomar | Verificar entrega de e-mail |
| Vaga reservada / checkout aberto | Prazo visível e retorno à compra | Acompanhar reserva |
| Pagamento pendente | Consultar status sem liberar painel | Conciliar se exceder o prazo |
| Pagamento aprovado | Matrícula ativa; convite ao diagnóstico | Acompanhar primeiro acesso |
| Pagamento rejeitado / expirado | Nova tentativa somente se houver vaga | Liberar reserva vencida |
| Pago sem vaga ou falha de matrícula | Mensagem de atendimento; caso visível no admin | Resolver ou reembolsar conforme política |
| Cancelado / reembolsado | Estado e próximo passo explícitos | Aplicar política à matrícula |

## 4. Entrega A — abrir piloto com operação controlada

Esta entrega permite receber um grupo pequeno antes da automação de pagamento, desde que a equipe tenha processo de confirmação financeira definido.

1. Criar `/mentoria/inscricao` com oferta, turma, datas, vagas, condições e contato; CTA muda entre inscrição, lista de interesse e encerrado.
2. Fazer login/cadastro retornar à inscrição. Após autenticação, registrar uma solicitação vinculada a `user_id` e `cohort_id`, com data e versão da oferta aceita; impedir duplicatas.
3. Criar fila administrativa com estados `recebida`, `aguardando_pagamento`, `confirmada`, `lista_de_espera`, `cancelada`. Registrar quem alterou o estado, quando e a referência da confirmação financeira. Não aceitar comprovante enviado pelo aluno como confirmação automática.
4. Ao confirmar a vaga, usar uma única operação administrativa que verifique estado/capacidade da turma, crie a matrícula `active` de modo idempotente e registre a origem `manual` ou `bolsa`.
5. Mostrar ao aluno o estado da solicitação e enviar instruções de acesso quando a matrícula ficar ativa. Se o e-mail transacional ainda não estiver habilitado, a equipe envia a mensagem pelo canal de suporte definido e registra a ação.
6. Corrigir a regra de acesso: `invited` não pode enviar entregas nem marcar progresso; somente `active` pode começar a jornada. Definir o que `completed` pode apenas consultar.

**Aceite A:** uma pessoa nova cria conta, solicita a vaga, a equipe confirma a transação por fonte confiável, ativa a matrícula uma vez, e a pessoa entra no diagnóstico. Uma segunda confirmação não gera outra matrícula nem ocupa outra vaga. A turma cheia recusa nova confirmação.

## 5. Entrega B — automatizar compra e matrícula

### Modelo de dados

- Criar `mentorship_orders`, separada de `billing_purchases` do Pro: `id`, `user_id`, `cohort_id`, `offer_id`, versão da oferta, valor, moeda, estado, expiração da reserva, IDs de preferência/pagamento, horários, origem e referência da matrícula.
- Registrar eventos de pagamento de modo idempotente por ID do provedor. Guardar o mínimo necessário para conciliação, sem dados de cartão.
- Criar vínculo único entre ordem aprovada e matrícula; manter a restrição única `(cohort_id, user_id)` já existente.
- Criar uma operação transacional no banco para reservar vaga, confirmar pagamento e ativar matrícula. Ela deve bloquear a linha da turma, contar matrículas e reservas válidas, verificar capacidade e impedir corrida entre compradores.
- Aplicar RLS nas novas tabelas: aluno lê apenas suas ordens; escritas de status e matrícula financeira ficam no servidor; admin vê a fila com autorização própria.

### Servidor e provedor

1. Expor `POST /api/v1/mentorship/checkout`: exigir sessão, turma com inscrições abertas, oferta válida e vaga disponível; criar ou reutilizar ordem pendente; definir a validade da reserva e criar preferência do Mercado Pago com `external_reference` igual ao ID da ordem.
2. Extrair o código comum do Mercado Pago para aceitar itens, URLs de retorno e de notificação específicos da oferta. Manter o endpoint e as regras do Pro sem alteração de direito de acesso.
3. Usar URL HTTPS pública de webhook, assinatura `x-signature`, consulta server-side do pagamento e conferência de referência, valor, moeda e conta do vendedor antes de aprovar a ordem.
4. Processar notificações duplicadas ou fora de ordem sem regredir o estado. Aprovação dispara a operação transacional de matrícula; falha transitória retorna erro para nova entrega e entra em monitoramento.
5. Definir expiração da preferência e do pagamento offline/Pix de modo compatível com a reserva da vaga. Pagamento aprovado após o prazo vai para exceção operacional; nunca é ignorado nem concede vaga acima da capacidade.
6. Tratar reembolso/contestação por evento do provedor e reconciliação; registrar decisão sobre a matrícula conforme a política publicada. Permitir conciliação manual auditada no admin.
7. Criar `/mentoria/inscricao/status` lendo a ordem autenticada e oferecendo atualização do status. Avisar a equipe sobre ordem aprovada sem matrícula e pagamento pendente além do prazo.

O Mercado Pago documenta [preferências com prazo](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/additional-settings/term-of-preference), [vencimento de Pix e pagamentos offline](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/additional-settings/expiration-date), [webhooks assinados e consulta do pagamento](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/payment-notifications) e [contas para compras de teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/test-accounts). Confirmar estes detalhes na implementação porque a integração do provedor pode mudar.

**Aceite B:** pagamento aprovado em sandbox ativa exatamente uma matrícula na turma comprada; pendente/rejeitado não libera acesso; webhook repetido não duplica; duas compras simultâneas pela última vaga não excedem a capacidade; reembolso e falha tardia aparecem para conciliação.

## 6. Interface e comunicação

- Atualizar `/mentoria` com proposta, destinatário, formato, datas, carga estimada, entregas, mentor, preço, vagas, condições, FAQ e CTA para `/mentoria/inscricao`. Não prometer acesso ao Pro se a oferta da mentoria não o incluir.
- No formulário, mostrar resumo da turma e valor antes do pagamento; informar confirmação de conta e distinguir solicitação recebida de vaga confirmada.
- No painel sem matrícula, trocar o link genérico do LinkedIn por status da inscrição e contato de suporte configurado.
- Criar mensagens para: conta criada, solicitação recebida, pagamento pendente, vaga confirmada, falha, cancelamento e primeiro acesso. Salvar notificações com chave de deduplicação e usar o outbox existente quando estiver configurado.
- Medir a sequência: visita à oferta, início da inscrição, conta confirmada, checkout iniciado, pagamento aprovado, matrícula ativa, diagnóstico iniciado. Evitar dados de pagamento e informações sensíveis nos eventos.

## 7. Ordem de execução e critérios de passagem

1. **Oferta e política:** fechar as decisões da seção 2 e produzir o texto público. Passa quando preço, turma, capacidade, datas, suporte e cancelamento têm responsáveis definidos.
2. **Acesso e dados:** corrigir estados de matrícula/capacidade; adicionar solicitação e fila administrativa. Passa quando nenhuma solicitação ou confirmação duplicada ocupa duas vagas.
3. **Piloto controlado:** publicar inscrição, cadastro de retorno, painel de status e confirmação manual auditada. Passa com uma jornada real de ponta a ponta em staging, incluindo aluno sem vaga.
4. **Cobrança automática:** implementar ordem, reserva, checkout, webhook, conciliação e tratamento de exceções. Passa com os cenários do aceite B em sandbox.
5. **Abertura pública:** configurar domínio, credenciais e webhook de produção; executar compra de valor controlado e reconciliação; monitorar primeiras inscrições. Abrir vagas gradualmente.

## 8. Dependências externas e limites

- Acesso ao projeto Supabase usado pelo app para conferir migrações, RLS e configuração de Auth.
- Conta/aplicação Mercado Pago com credenciais de teste e produção, webhook e URL HTTPS acessível.
- Domínio público, remetente de e-mail verificado e canal de suporte.
- Confirmação comercial da oferta, preço, política de cancelamento e tratamento de pagamento aprovado sem vaga.
- O script `check-mentorship-readiness.ts` cobre a saúde básica; a jornada de compra até o diagnóstico precisa de validação específica em staging com aluno, mentor e admin antes de abrir a turma.

## 9. Implementação entregue

- Criados oferta versionada, solicitações, ordens, trilhas de auditoria e controles de leitura própria; operações que disputam vaga bloqueiam a turma e respeitam sua capacidade.
- Criados inscrição pública, lista de interesse com consentimento, checkout de mentoria separado do QA Lab Pro, consulta de pedido e fila de administração para confirmações, bolsas e exceções de pagamento.
- O webhook consulta o pagamento no Mercado Pago e confere referência, valor, moeda e conta recebedora. Confirmações repetidas são idempotentes; pagamento tardio sem vaga fica em conciliação e nunca aumenta a capacidade.
- `invited` deixou de liberar acesso. O diagnóstico e as entregas exigem matrícula `active`; convites e confirmações administrativas usam operações atômicas com limite de vagas.
- As migrações estão em `packages/web/supabase/migrations/20261021000915_mentorship_enrollment_and_checkout.sql` e `20261021010355_harden_mentorship_and_pro_payments.sql`. A segunda fecha a reativação por evento tardio, revoga acesso Pro após reembolso e impede alteração direta de plano pelo cliente. Ambas precisam ser aplicadas ao projeto Supabase correto, nessa ordem. A conta conectada atualmente recebe HTTP 403 ao consultar as migrações remotas.

### Para abrir a primeira turma

1. Aplicar as duas migrações e confirmar RLS/Auth no Supabase de staging; executar `supabase test db` em banco local ou descartável.
2. Configurar `NEXT_PUBLIC_SITE_URL`, credenciais e segredo do webhook do Mercado Pago, `MERCADO_PAGO_COLLECTOR_ID` e `SUPABASE_SERVICE_ROLE_KEY` no ambiente de staging; validar o webhook HTTPS e o retorno do Checkout Pro.
3. Fechar preço, datas, capacidade, suporte e textos de cancelamento/reembolso; criar turma, publicar oferta e abrir matrículas no admin.
4. Percorrer cadastro, compra de teste, confirmação, acesso ao diagnóstico, pagamento pendente/rejeitado e uma conciliação sem vaga com contas de aluno e admin.
5. Repetir a validação no ambiente de produção com credenciais e conta recebedora de produção antes de publicar a oferta.
