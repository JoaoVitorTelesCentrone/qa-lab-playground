# Lançamento pago — Mercado Pago

## O que foi implementado

- oferta de lançamento: **QA Lab Pro — acesso vitalício, R$ 297**;
- Checkout Pro do Mercado Pago, com PIX e cartão na página hospedada pelo MP;
- registro de cada tentativa em `billing_purchases`;
- webhook assinado: somente uma notificação `approved` atualiza o perfil para
  `pro`;
- Lab 01 (`/labs/101`) aberto como demonstração; Finanças, pack de regressão e
  os próximos Labs exigem Pro no servidor.

## Publicar a cobrança

1. No Supabase SQL Editor, execute
   `packages/web/supabase/migrations/0014_billing_mercado_pago.sql`.
2. No Mercado Pago, crie uma aplicação de Checkout Pro e copie o **Access
   Token de produção**.
3. Em Webhooks da mesma aplicação, registre
   `https://SEU_DOMINIO.com/api/billing/mercado-pago/webhook`, assine o evento
   de pagamentos e copie a chave secreta de assinatura.
4. Configure as variáveis no ambiente de produção:

   ```text
   NEXT_PUBLIC_SITE_URL=https://SEU_DOMINIO.com
   MERCADO_PAGO_ACCESS_TOKEN=APP_USR-...
   MERCADO_PAGO_WEBHOOK_SECRET=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

5. Faça uma compra de teste usando as credenciais de teste do Mercado Pago e
   confirme que `billing_purchases.status` vira `approved` e
   `profiles.plan` vira `pro`.

O retorno do Checkout é apenas uma tela de status. A liberação vem do webhook,
que valida a assinatura e consulta o pagamento no Mercado Pago antes de mudar
o plano; não há upgrade confiando em query string ou no navegador.

## Próximo passo de monetização

A oferta atual é deliberadamente de compra única. Para cobrar mensal/anual com
renovação automática, implemente um segundo produto usando a API de
assinaturas/preapprovals do Mercado Pago e uma tabela de entitlements com data
de expiração. Não reutilize esta preferência avulsa fingindo que ela renova.
