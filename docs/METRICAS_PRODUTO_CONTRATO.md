# Contrato de métricas do QA Lab

O painel em `/lab/metricas` é restrito aos e-mails de `QALAB_ADMIN_EMAILS` e usa service role apenas no servidor. A janela padrão é móvel de 30 dias, calculada em UTC. `lib/product/metrics.ts` contém os cálculos; `lib/product/metrics-store.ts` lê as fontes.

| Indicador | Fonte | Identidade e deduplicação | Janela |
| --- | --- | --- | --- |
| Novas contas | `profiles.created_at` | `profiles.id` | Cadastro nos últimos 30 dias |
| Primeira evidência em 7 dias | `activity_events.lab_completed` e entregas válidas do desafio legado em `deliverables` | Primeiro timestamp válido por `user_id` | Cadastro na janela de 30 dias, com D+7 completo; evidência entre cadastro e D+7 |
| Tempo até primeira evidência | Mesmas fontes acima | Mediana das primeiras evidências da coorte elegível que entregou | Horas entre cadastro e entrega, somente até D+7 |
| Case publicado | `activity_events.case_published` após publicação de um case | `user_id` único | Evento nos últimos 30 dias |
| Interesse, checkout, pagamento da mentoria | `mentorship_application_submitted`, `mentorship_checkout_started`, `mentorship_payment_confirmed` | `user_id` único por etapa | Cada evento nos últimos 30 dias |
| Erros | `activity_events.api_error` | Uma ocorrência por evento | Últimos 30 dias |

Os eventos de case e mentoria são telemetria de melhor esforço; o banco de entregas e pedidos é a fonte de verdade operacional. Os três volumes da mentoria **não são** uma taxa de conversão da mesma coorte: pessoas podem entrar em etapas em meses diferentes ou comprar diretamente. Não dividir uma etapa pela outra para decisões de preço ou aquisição. A validação de staging deve comparar amostras do painel com registros de `mentorship_orders`, `mentorship_applications` e cases, anotando diferenças.

UTM source, medium e campaign aceitam somente identificadores de até 80 caracteres (`a-z`, `0-9`, `_`, `-`). A lista de interesse guarda esses valores em `mentorship_waitlist_leads`; o checkout os guarda em `mentorship_orders`. Não incluir e-mail, nome, URL completa nem texto livre em UTMs. O resumo administrativo da lista agrega `utm_source` dos últimos 30 dias. Ainda não há identidade anônima confiável entre visita e cadastro; visitas à landing não entram no painel de conversão.

Antes de criar metas percentuais, conferir no staging: entrega incompleta não conta; duas versões completas da mesma pessoa contam uma vez; evidência após D+7 não conta; conta com menos de sete dias não entra no denominador; webhook repetido não gera matrícula dupla; campanha inválida é descartada.
