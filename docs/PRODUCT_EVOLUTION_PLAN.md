# Plano de evolução do QA Lab

Atualizado em 2026-09-24. Horizonte: próximos 90 dias, com revisão quinzenal.

## Decisão de produto

O QA Lab deve ser o lugar onde uma pessoa **pratica uma decisão de QA, registra uma evidência útil e enxerga o próximo passo**. O principal resultado a melhorar é a primeira evidência entregue em um Lab, não a quantidade de telas ou desafios disponíveis.

Público prioritário: quem está começando em QA ou precisa construir repertório prático para apresentar em entrevistas e no trabalho. A experiência inicial deve levar essa pessoa do Lab gratuito a um case próprio sem exigir que ela conheça todas as ferramentas da plataforma.

## Ponto de partida confirmado no repositório

| Área | Estado observado | Consequência para o plano |
| --- | --- | --- |
| Catálogo | `LAUNCH_ORDER` libera três Labs de Finanças (`101`, `103`, `105`); os demais estão agendados. | Melhorar a jornada desses três antes de abrir novos ambientes. |
| Aprendizagem | Há briefing, envio de evidência, conclusão, progresso, trilhas, portfólio e certificado no código. | O trabalho principal é conectar, explicar e validar o ciclo completo. |
| Oferta paga | Há oferta Pro vitalícia de R$ 297 e fluxo de Checkout Pro com webhook. | Validar compra e direito de acesso em staging antes de ampliar aquisição paga. |
| Lista de interesse | A página depende de `NEXT_PUBLIC_LEAD_FORM_URL` e abre um formulário externo. | Confirmar configuração e captura efetiva; a mensagem atual confirma a abertura, não o cadastro. |
| Métricas | O painel lê `activity_events`, mas calcula ativação pelo primeiro evento do recorte de 30 dias e conclusão por contagem de eventos. | Definir coortes e deduplicar usuário/Lab antes de usar taxas para decisões. |
| Acesso a métricas | A página `/lab/metricas` chama `loadMetrics` quando a chave de serviço existe; a checagem de administrador não aparece na rota. | Revisar e corrigir a autorização no servidor como prioridade de lançamento. |
| Operação | Os documentos registram migrações, cobrança e validação em produção como pendências. | Tratar implementação local e operação publicada como estados diferentes. |

Fontes internas: [decisões](QA_LAB_DECISIONS.md), [produto atual](PRODUCTIZATION_PLAN.md), [visão educacional](QA_LAB_PRODUCT_PLAN.md), [cobrança](MERCADO_PAGO_LAUNCH.md), `packages/web/lib/playground/catalog.ts`, `packages/web/lib/product/metrics.ts` e `packages/web/app/lab/metricas/page.tsx`.

## Sequência de entrega

As semanas indicam ordem e janela de planejamento, não uma promessa de prazo sem conhecer a capacidade da equipe.

| Quando | Prioridade | Entrega | Pronto quando |
| --- | --- | --- | --- |
| Semanas 1–2 | P0: lançamento seguro | Restringir `/lab/metricas` a administradores no servidor; revisar outros usos de chave de serviço; conferir migrações e políticas RLS no projeto publicado. | Visitantes e usuários comuns não leem dados agregados; o ambiente publicado tem histórico de migrações conhecido. |
| Semanas 1–2 | P0: compra confiável | Percorrer compra aprovada, pendente, recusada, webhook repetido e retorno ao produto em staging. Mostrar ao comprador o estado real do acesso. | Só pagamento confirmado concede Pro; falhas deixam caminho claro de recuperação. |
| Semanas 1–2 | P0: acesso em qualquer tela | Revisar home, catálogo, Lab 01, envio de evidência, conclusão, perfil, portfólio e checkout em 320, 375, 768, 834 e 1024 px, teclado e zoom. Corrigir o elemento que transborda em vez de depender apenas do corte global. | Sem scroll lateral da página, perda de conteúdo ou controles inacessíveis nos fluxos principais. |
| Semanas 2–4 | P1: medir o funil | Registrar cadastro, início do Lab, primeira evidência, publicação do case, visita ao preço, início e resultado do checkout. Definir coortes e eventos únicos; medir falhas por etapa. | Um painel mostra o funil de novos usuários e permite localizar onde a jornada para. |
| Semanas 3–5 | P1: primeira vitória | Fazer o Lab 01 conduzir claramente por objetivo → investigação → evidência → feedback → case. Reduzir decisões paralelas na home e manter o próximo passo visível após cadastro e conclusão. | Uma pessoa nova completa o primeiro Lab e encontra seu case sem ajuda externa. |
| Semanas 5–8 | P1: continuidade | Organizar os Labs 01–03 como sequência de Finanças; mostrar por que cada próximo Lab desenvolve uma competência; usar o perfil para retomar pendências e revisar evidências. | Quem conclui o primeiro Lab entende e consegue iniciar o segundo. |
| Semanas 7–10 | P2: valor pago | Explicar com precisão o que o Pro dá acesso **hoje** e separar conteúdo disponível de conteúdo planejado. Melhorar feedback, rubricas e exportação de case onde isso aumentar valor percebido. | A oferta corresponde ao acesso efetivo e compradores conseguem usar o benefício prometido. |
| Semanas 9–12 | P2: expansão controlada | Liberar um pequeno lote de Labs de um único ambiente ou trilha, escolhido por demanda e qualidade do fluxo atual. Cada Lab recebe briefing, ambiente pronto, critérios de evidência, feedback e instrumentação. | Novo conteúdo melhora retorno e conclusão sem aumentar erros ou abandono. |

## Métricas para decidir

**Métrica principal:** proporção de contas novas que entregam a primeira evidência em até sete dias do cadastro. Denominador: contas criadas no período; numerador: contas com pelo menos uma submissão válida no intervalo. Mostrar o tamanho da coorte junto da taxa.

Métricas de diagnóstico:

1. **Começo:** contas novas que iniciam o Lab 01 em até 24 horas.
2. **Primeira entrega:** tempo mediano entre início do Lab e primeira evidência; abandono por etapa.
3. **Qualidade da entrega:** parcela que atende aos critérios mínimos de contexto, resultado observado e reprodução; revisar uma amostra manualmente até a rubrica estar calibrada.
4. **Continuidade:** retorno em sete dias e início do segundo Lab entre quem concluiu o primeiro.
5. **Valor compartilhável:** parcela que publica ou exporta um case depois de concluir o Lab.
6. **Oferta:** visualização do preço → início do checkout → pagamento confirmado → primeiro uso Pro; acompanhar erros e suporte de compra.
7. **Confiabilidade:** erros por fluxo, falhas de upload, tempo de resposta e problemas de acessibilidade observados.

Não há baseline confiável documentado para essas taxas. Medir duas semanas antes de fixar metas de crescimento. Nos primeiros pilotos, usar relatos e observação de 8–12 pessoas para achar atritos; não tratar essa amostra como estimativa de conversão da população.

## Regras de decisão quinzenais

- Se alguém não consegue concluir o Lab 01, priorizar o bloqueio antes de criar outro Lab.
- Se muitos iniciam e poucos entregam, investigar briefing, ambiente, critério de evidência e upload por etapa.
- Se entregam e não retornam, melhorar feedback, recomendação do próximo Lab e utilidade do case.
- Se há interesse no Pro sem compra, investigar clareza da oferta e falhas do checkout antes de alterar preço.
- Expandir o catálogo somente com autorização, cobrança e migrações validadas; funil medido; e nenhum bloqueio crítico aberto na jornada principal.

## Próximas trilhas após os 90 dias

Escolher **uma** expansão com dados do piloto:

- **People Lab:** evoluir a qualidade do feedback das respostas e o relatório de competências humanas; já existe um catálogo amplo, mas o próprio plano atual registra essa lacuna.
- **Gestão da Qualidade:** ligar Refinement, Critérios, Triagem, Logs, Test Design Studio e Execution Hub em um percurso com entrega final avaliada.
- **Security Lab:** avançar dos cenários de decisão para prática técnica isolada, evidência e reporte responsável.
- **Desafio integrador:** unir investigação, decisão de release, pipeline e comunicação depois que as trilhas anteriores tiverem critérios de avaliação consistentes.

Evitar abrir simultaneamente novas trilhas, novos ambientes e novos modelos de cobrança. Cada expansão precisa demonstrar qual competência ensina, qual evidência produz e como o aluno recebe feedback.

## Primeiro backlog executável

1. Auditar e corrigir a autorização da rota de métricas e demais leituras com privilégios de serviço.
2. Confirmar no projeto publicado o histórico das migrações, RLS e configurações necessárias para autenticação, Storage e cobrança.
3. Percorrer em staging o ciclo cadastro → Lab 01 → evidência → case e o ciclo checkout → webhook → acesso Pro.
4. Substituir a definição atual de ativação e conclusão por métricas de coorte e usuário/Lab únicos.
5. Medir e corrigir reflow sem conteúdo cortado na jornada principal; registrar os problemas encontrados por tela e largura.
6. Confirmar que a lista de interesse coleta cadastros e que o produto consegue atribuir a origem da inscrição.
7. Conduzir o piloto de primeira experiência, consolidar atritos e escolher o próximo lote de Labs com base nos dados.

## Referências de qualidade

- A [WCAG 2.2, critério de reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow) pede conteúdo sem perda de informação ou função a 320 px equivalentes, ressalvadas partes que exigem duas dimensões.
- A [documentação de RLS do Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security) explica que a chave de serviço ignora políticas de linha; portanto, páginas que a usam precisam de autorização própria antes da consulta.
- Os [Core Web Vitals](https://web.dev/articles/vitals) são uma referência para acompanhar carregamento, resposta à interação e estabilidade visual em uso real.
