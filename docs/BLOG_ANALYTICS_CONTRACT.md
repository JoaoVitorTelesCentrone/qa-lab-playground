# Contrato de eventos do blog

Os eventos são enviados por `POST /api/blog-events` e gravados na tabela `activity_events` existente. O endpoint aceita somente nomes conhecidos e slugs já publicados. Ele deriva série e seção do catálogo no servidor; o cliente não envia texto livre, e-mail ou identificadores de pessoa.

| Evento persistido | Quando acontece | Propriedades |
| --- | --- | --- |
| `blog_article_view` | O artigo é aberto no navegador | `slug`, e, quando há série, `seriesId` e `section` |
| `blog_series_navigation` | A pessoa segue para o próximo artigo da sequência | `slug` do artigo de origem e metadados da série |
| `blog_practice_cta_click` | O CTA de prática é ativado | `slug` do artigo de origem e metadados da série |
| `blog_practice_arrival` | Um destino coberto por `/labs`, `/trilhas` ou `/lab/studio` carrega a origem `fromBlog` | `slug` do artigo de origem e metadados da série |

Somente sessões autenticadas geram linhas. Visitas anônimas continuam fora das métricas por falta de uma identidade anônima confiável e de uma ponte de consentimento para a conta. O painel conta os eventos brutos e deduplica leitores/clickers por conta + artigo. Chegada indica que a rota de prática carregou; não prova que o exercício foi concluído ou que houve aprendizagem. Eventos de chegada são capturados nos destinos cobertos por `/labs`, `/trilhas` e `/lab/studio`.
