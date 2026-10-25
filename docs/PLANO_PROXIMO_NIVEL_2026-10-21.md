# QA Lab — plano para o próximo nível

**Data:** 21 de outubro de 2026  
**Horizonte:** 90 dias, revisto a cada duas semanas  
**Premissa:** equipe pequena; as janelas indicam sequência e não compromisso de prazo.

## 1. Decisão de foco

O produto deve provar uma jornada completa antes de ampliar o catálogo: uma pessoa conhece o QA Lab, investiga o desafio gratuito, entrega uma evidência útil, transforma o trabalho em case e encontra uma oferta de mentoria clara. A turma piloto precisa fechar o mesmo ciclo com matrícula, prática, revisão humana e resultado publicável.

**Resultado principal:** proporção de contas novas que entregam a primeira evidência válida em até sete dias. Mostrar sempre numerador, denominador e período da coorte. A conversão para a mentoria é uma métrica de negócio separada; não deve substituir a medida de aprendizagem.

O repositório já contém desafio gratuito, ambientes de prática, Labs, portfólio, mentoria de 12 semanas, admissão, cobrança, testes e CI. Há trabalho local em andamento na experiência da mentoria. Este plano não pressupõe que migrações, credenciais e fluxos autenticados estejam validados nos ambientes publicados.

## 2. Andamento da implementação

- **Implementado no código — métrica principal:** o painel administrativo calcula contas com evidência até sete dias após o cadastro e mostra numerador, tamanho da coorte elegível e mediana do tempo até a primeira evidência. Combina `lab_completed` atômico com entregas completas do desafio legado persistidas em `deliverables`, deduplicadas por conta. A definição de coorte está testada; a integridade dos dados de staging ainda precisa ser conferida.
- **Instrumentação inicial:** publicação de case emite `case_published`; o painel conta contas únicas que publicaram durante o período, sem incluir dados pessoais nos eventos.
- **Funil da mentoria:** solicitações, checkouts iniciados e pagamentos confirmados agora emitem eventos e aparecem como contas únicas no painel de 30 dias.
- **Atribuição da lista e inscrição:** UTM source, medium e campaign passam por validação e são guardados como identificadores curtos. A área admin mostra a origem por lead e resume origens dos últimos 30 dias. A campanha também segue da landing para a inscrição, pelo cadastro e até a reserva paga, onde a primeira origem conhecida é preservada. As duas migrations de atribuição ainda precisam ser aplicadas em staging/produção.
- **Gate preparado:** `docs/STAGING_GATE_QA_LAB.md` registra ambiente, responsável, comandos e evidência para cada jornada. O script de readiness verifica as colunas de atribuição.
- **Contrato de métricas:** `docs/METRICAS_PRODUTO_CONTRATO.md` define fonte, identidade, deduplicação e janela de cada indicador, inclusive as limitações dos eventos de melhor esforço.
- **Pendente no mundo real:** identificar e preparar staging, aplicar migrations, validar compra sandbox e executar jornada autenticada com três perfis; depois realizar sessões observadas e operar a turma piloto. Nenhum desses resultados pode ser inferido do build local.

## 3. Diagnóstico que orienta a ordem

| Evidência no projeto | Implicação |
| --- | --- |
| A home pública destaca aprender QA na prática; o catálogo mantém três Labs liberados com o caso fictício do Broto. | Concentrar a primeira experiência no desafio e em um próximo passo claro. |
| A mentoria tem conteúdo, turma, entregas, revisão, certificados e fluxo de admissão implementados no código. | Executar o piloto real antes de adicionar outra trilha ou mais recursos administrativos. |
| O runbook registra o gate de staging como pendente: projeto, três perfis, checkout sandbox e remetente de e-mail. | Tratar essa validação como prioridade de lançamento, com evidências e responsáveis. |
| Há `activity_events` e painel de métricas; os cálculos atuais cobrem início e conclusão de Labs, mas não o funil completo até case e mentoria. | Definir eventos e coortes consistentes antes de otimizar aquisição. |
| O CI executa lint, testes, build e smoke público; o runbook exige jornada autenticada e pgTAP em staging. | Acrescentar os gates de permissão e operação ao processo de release. |

Fontes: `README.md`, `docs/RESUMO_ITERACAO_2026-10-16.md`, `docs/MENTORIA_RUNBOOK.md`, `packages/web/lib/product/metrics.ts`, `packages/web/lib/playground/catalog.ts`, `.github/workflows/quality.yml`.

## 4. Sequência de 90 dias

### Fase 1 — tornar o lançamento confiável (semanas 1–2)

1. Congelar uma matriz de jornadas e ambientes: desafio gratuito, cadastro, evidência, case, lista de interesse, inscrição, pagamento, matrícula, entrega, revisão e certificado. Para cada jornada, registrar dono, ambiente, estado atual e evidência de teste.
2. Preparar staging isolado e conferir histórico de migrações, RLS, Storage, variáveis e permissões. Executar os testes SQL de acesso por perfil.
3. Seguir o runbook com aluno, mentor e admin. Validar compra aprovada, pendente, recusada, webhook repetido, reembolso, capacidade da turma, upload, reenvio, e-mail e acesso cruzado entre turmas.
4. Corrigir bloqueios P0/P1 encontrados; repetir apenas os cenários afetados e o caminho crítico.

**Gate:** nenhuma matrícula indevida, dado de outro aluno exposto ou promessa de acesso sem pagamento confirmado; todas as jornadas críticas registradas com URL, commit, migrações e evidência.

### Fase 2 — medir e simplificar a primeira vitória (semanas 2–5)

1. Instrumentar o funil: visita à landing, início do desafio, cadastro, primeira evidência válida, case criado/publicado, visita à mentoria, entrada na lista, inscrição, checkout, matrícula e primeira entrega revisada. Definir identidade, deduplicação e janela de cada evento.
2. Montar painel por coorte e origem, com volumes absolutos, taxa por etapa, tempo até primeira evidência, erros de upload e abandono. Separar eventos do QA Lab aberto dos eventos da mentoria.
3. Fazer 8–12 sessões observadas com pessoas do público alvo. Medir onde travam, se entendem o que entregar e se conseguem encontrar o case sem ajuda. Corrigir os três principais atritos.
4. Revisar a jornada principal em celular, teclado e zoom; conferir também estados de erro, loading e recuperação após falha.

**Gate:** um usuário novo conclui desafio → evidência → case sem orientação externa; o painel mostra uma coorte completa sem dupla contagem. Fixar metas numéricas só depois de obter a linha de base.

### Fase 3 — operar uma turma fundadora pequena (semanas 5–9)

1. Abrir uma turma com capacidade limitada e admissão controlada. Definir responsável por suporte, mentor, prazo de resposta e rotina semanal.
2. Rodar duas semanas de operação real: diagnóstico, aula, Lab, entrega, revisão por rubrica, pedido de ajuste e reenvio. Registrar manualmente problemas de conteúdo, dúvidas recorrentes e tempo de revisão.
3. Verificar se a oferta pública descreve precisamente datas, preço, formato, disponibilidade de gravações, suporte e resultado esperado; revisar mensagens de aprovação, espera e recusa.
4. Automatizar somente tarefas repetitivas comprovadas no piloto, como alertas de revisão atrasada e mensagens transacionais que já passaram no teste de entrega.

**Gate:** aluno e mentor completam duas semanas sem planilhas paralelas para controlar acesso, entregas e feedback; nenhum item de revisão excede o prazo acordado sem alerta e responsável.

### Fase 4 — crescimento e expansão condicionados aos dados (semanas 9–12)

1. Comparar canais de aquisição pelo número de primeiras evidências e matrículas confirmadas, não apenas visitas ou leads. Priorizar um canal e uma mensagem de aquisição por ciclo.
2. Publicar conteúdo que leva a uma tarefa concreta no desafio gratuito e termina em case compartilhável. Reaproveitar resultados reais e dúvidas do piloto para melhorar briefing e feedback.
3. Escolher **uma** expansão: outro Lab conectado à jornada gratuita **ou** aprofundamento de um Lab da mentoria. Exigir objetivo, critério de evidência, feedback, instrumentação e suporte antes de publicar.
4. Revisar preço e oferta apenas com dados de interesse, checkout, matrícula, uso e entrevistas; documentar a decisão.

**Gate:** a nova entrega melhora continuidade ou qualidade sem piorar erros, abandono ou tempo de revisão. Se a primeira evidência ainda for difícil, continuar corrigindo a jornada atual.

## 5. Painel de decisão

| Indicador | Definição inicial | Frequência |
| --- | --- | --- |
| Primeira evidência em 7 dias | Contas novas com primeira entrega válida até D+7 / contas novas da coorte | Semanal por coorte |
| Tempo até evidência | Mediana entre cadastro e primeira entrega válida | Semanal |
| Case publicado | Autores que publicaram case / autores com evidência válida | Quinzenal |
| Retorno em 7 dias | Pessoas da coorte que voltam e fazem ação de aprendizagem | Semanal |
| Conversão da mentoria | Matrículas confirmadas / inscrições elegíveis; mostrar cada etapa do checkout | Semanal |
| Qualidade operacional | Erros por jornada, falhas de upload/pagamento/e-mail, revisão fora do prazo | Diário no piloto |

Não há linha de base verificada neste documento. Nas primeiras duas semanas, medir volumes e revisar a integridade dos eventos antes de estabelecer metas percentuais.

## 6. Primeiro backlog executável

| Ordem | Entrega | Aceite |
| --- | --- | --- |
| 1 | Inventário de ambiente e matriz de jornadas | Staging, migrations, segredos, donos e cenários críticos documentados. |
| 2 | Gate de staging com três perfis | RLS, matrícula, pagamento sandbox, upload, revisão e portfólio validados. |
| 3 | Contrato de eventos e coortes | Eventos nomeados, deduplicados e testados nos dois funis. |
| 4 | Painel do funil de primeira evidência | Numerador e denominador auditáveis; segmentação por origem e etapa. |
| 5 | Pesquisa observada da primeira experiência | 8–12 sessões, atritos classificados e três correções priorizadas. |
| 6 | Turma piloto de duas semanas | Entrega, revisão, suporte e tempo de resposta operando com registro de incidentes. |
| 7 | Revisão de oferta e aquisição | Mensagem alinhada ao que o piloto realmente entrega; um canal priorizado. |

## 7. Cadência e regra de decisão

Toda semana: olhar o funil, incidentes e fila de revisão. A cada duas semanas: decidir um problema principal, uma hipótese e um experimento; registrar antes/depois. Se há abandono antes da evidência, corrigir a primeira experiência. Se há evidência mas pouco retorno, melhorar feedback e próximo passo. Se há interesse na mentoria mas pouca matrícula, investigar clareza da oferta e pagamento. Novos Labs entram apenas depois que o gate de staging e a operação do piloto estiverem estáveis.
