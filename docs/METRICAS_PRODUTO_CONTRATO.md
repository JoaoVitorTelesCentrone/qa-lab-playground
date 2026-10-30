# Contrato de métricas do QA Lab

O painel em `/lab/metricas` é restrito aos e-mails de `QALAB_ADMIN_EMAILS` e usa service role apenas no servidor. A janela padrão é móvel de 30 dias, calculada em UTC. `lib/product/metrics.ts` contém os cálculos; `lib/product/metrics-store.ts` lê as fontes.

| Indicador | Fonte | Identidade e deduplicação | Janela |
| --- | --- | --- | --- |
| Novas contas | `profiles.created_at` | `profiles.id` | Cadastro nos últimos 30 dias |
| Ativação | `activity_events.lab_started` + `profiles.created_at` | Conta única; início no mesmo dia UTC do cadastro | Cadastros nos últimos 30 dias |
| Primeira evidência em 7 dias | `activity_events.lab_completed`, gravado na transação que salva a entrega validada | Primeiro timestamp válido por `user_id` | Cadastro na janela de 30 dias, com D+7 completo; evidência entre cadastro e D+7 |
| Abandono antes da evidência | `activity_events.lab_started` sem `lab_completed` até D+7 | Conta única que iniciou e não concluiu na janela | Coortes com D+7 completo |
| Tempo até primeira evidência | Mesma fonte acima | Mediana das primeiras evidências da coorte elegível que entregou | Horas entre cadastro e entrega, somente até D+7 |
| Coorte semanal e origem | `profiles.created_at` e `profiles.acquisition_source` | Uma linha por `profiles.id`; semana UTC iniciada na segunda-feira; origem first-touch ou `Direto / sem UTM` | Cadastros nos últimos 30 dias; taxas somente para D+7 completo |
| Case publicado | `activity_events.case_published` quando o aluno publica uma evidência, projeto de portfólio ou case final de mentoria | `user_id` único | Evento nos últimos 30 dias |
| Lista de interesse | `mentorship_waitlist_leads.created_at` | E-mail único conforme restrição do banco | Cadastros nos últimos 30 dias |
| Inscrição, checkout, pagamento | `mentorship_application_submitted`, `mentorship_checkout_started`, `mentorship_payment_confirmed` | `user_id` único por etapa | Cada evento nos últimos 30 dias |
| Primeira entrega revisada | `mentorship_submissions.reviewed_at` associado a `mentorship_enrollments.user_id` | Primeira revisão por aluno, não cada reenvio | Primeira revisão nos últimos 30 dias |
| Uploads com sucesso/falha | `evidence_upload_succeeded` / `evidence_upload_failed` em `activity_events` | Uma ocorrência por resposta de upload registrada | Últimos 30 dias |
| Erros de API | `activity_events.api_error` | Uma ocorrência por exceção de rota | Últimos 30 dias |

Eventos de publicação, upload e aplicação são telemetria de melhor esforço; entregas, publicações, pedidos e revisões persistidos são as fontes operacionais. Os volumes da mentoria não são uma taxa de conversão de uma mesma coorte: pessoas podem entrar em etapas em meses diferentes ou comprar diretamente. Não dividir etapas para decisões de preço ou aquisição. A validação de staging deve comparar amostras do painel com `mentorship_waitlist_leads`, `mentorship_orders`, `mentorship_applications`, `mentorship_submissions` e publicações.

UTM source, medium e campaign aceitam identificadores de até 80 caracteres (`a-z`, `0-9`, `_`, `-`). A primeira origem conhecida é guardada no navegador e copiada para o perfil durante cadastro com senha ou OAuth; a lista e o checkout mantêm os seus próprios campos de campanha. Não incluir e-mail, nome, URL completa nem texto livre em UTMs. A migration `20261030155830_profile_acquisition_attribution.sql` deve estar aplicada antes de usar a consulta nova do painel.

Ainda não há identidade anônima confiável entre visita e cadastro: visitas à landing, à página da mentoria e inícios anônimos do desafio não entram nas taxas. O painel separa coortes do QA Lab e etapas da mentoria; não calcula conversão entre etapas de janelas diferentes. Para definir metas, conferir em staging: entrega incompleta não conta; envios repetidos contam uma vez por pessoa; evidência depois de D+7 não conta; conta com menos de sete dias não entra no denominador; webhook repetido não cria matrícula dupla; campanha inválida é descartada.
