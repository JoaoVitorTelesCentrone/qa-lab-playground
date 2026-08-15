# QA Lab Playground - Registro de Decisoes

Ultima atualizacao: 2026-08-09

Este documento registra decisoes de produto e arquitetura do QA Lab Playground. A motivacao e parte da decisao: sem ela, mudancas futuras tendem a desfazer escolhas intencionais.

## Escopo e release

**DECIDIDO - Build de 30, release de 1 por semana.**
As cadencias sao independentes: os 30 primeiros labs ficam no registry e o campo `week`/`releaseDate` controla o que esta publico. Semana 1 comeca em `2026-08-10`; Lab 5 libera em `2026-09-07`; Lab 30 libera em `2027-03-01`.

**DECIDIDO - Os 30 primeiros labs sao UI 1-20 e API 21-30.**
Os labs 21-30 usam a mesma API `/api/bookings`, cada um por uma lente diferente. Os labs de UI reaproveitam a loja e microdesafios em vez de criar 20 produtos falsos.

**DECIDIDO - Ideias 56-85 nao viram telas do app agora.**
Editor Given/When/Then, release notes simuladas, template de PR e matriz de risco sao materiais anexados ao lab, nao features navegaveis.

**DECIDIDO - Gate server-side para labs futuros.**
Rotas futuras em `/labs/*` redirecionam para `/waitlist?lab=...`. O bloqueio vira captacao de interesse, nao uma tela morta.

## Conteudo

**DECIDIDO - Por semana: 1 desafio, 3 posts, 1 blog e 1 video.**

| Dia | Peca | Angulo |
| --- | --- | --- |
| Seg | Post 1 | desafio + link |
| Qua | Post 2 | erro comum / anti-padrao |
| Qui | Blog | conceito longo |
| Sex | Post 3 | solucao, codigo ou carrossel |
| Sab | Video | screencast resolvendo |

**DECIDIDO - Os cinco ganchos nascem junto com o lab.**
Cada item do registry tem `content` com os cinco ganchos. O registry e fonte de verdade do app e do pipeline de conteudo.

**DECIDIDO - Video quinzenal nas semanas 1-10; semanal depois.**
Video e o gargalo real. Nas primeiras 10 semanas, publicar quinzenalmente estabiliza formato sem travar o restante do funil. A cadencia semanal so entra depois que roteiro, gravacao e edicao estiverem previsiveis.

## Arquitetura

**DECIDIDO - Registry vive em codigo.**
Adicionar lab e deploy, nao migration. Criterios, bugs e ganchos ficam versionados.

**DECIDIDO - Isolamento por sessao.**
Reservas da API sao escopadas por sessao. Precedencia: header `x-qalab-session` > cookie `qalab_session` > nova sessao. Reset apaga a massa e resemeia, mas nao troca a sessao.

**DECIDIDO - `id` publico de reserva reinicia em 1 por sessao.**
Assim suites independentes podem testar `/api/bookings/1` sem disputar massa global.

**DECIDIDO - Produtos ficam no codigo.**
Catalogo da loja e somente leitura, entao nao precisa de isolamento por banco.

**DECIDIDO - Seed deterministico com datas fixas.**
Datas relativas fazem testes passarem hoje e falharem depois.

**DECIDIDO - Login aceita `?ttl=1`.**
Token expirado deve ser testavel sem sleep longo.

## Pendencias antes do deploy

- **DECIDIDO/IMPLEMENTADO - Rate limit para API publica.**
  Escritas em `/api/*` usam limite por IP com `QALAB_API_RATE_LIMIT_PER_MINUTE`.
- **DECIDIDO/IMPLEMENTADO - Faxina de sessoes anonimas.**
  A migration `0003_playground_sessions_cron.sql` cria a funcao de cleanup e agenda via `pg_cron` quando a extensao estiver ativa.
- **DECIDIDO/IMPLEMENTADO - Token HMAC.**
  Tokens da API usam HMAC com `QALAB_TOKEN_SECRET`; em producao o segredo e obrigatorio.
- **DECIDIDO - Hospedagem inicial em Vercel.**
  Vercel reduz operacao no lancamento. Hetzner fica como alternativa se os labs de timing mostrarem variacao demais em producao.

## Monetizacao proposta

Labs ficam gratuitos. O ativo monetizavel e evidencia de execucao: portfolio, selo, gabarito comentado, suite de referencia, trilhas e relatorios para times.

**DECIDIDO - Preco inicial:**

- Free: 30 labs, modo bugado, API, reset e hub.
- Pro: R$ 29/mes ou R$ 290/ano.
- Time: R$ 45/assento/mes, minimo 5.
- Assessment: R$ 199/candidato.

Critério de parada sugerido: se na semana 16 houver menos de 300 e-mails e menos de 30 portfolios publicos, tratar como sinal de demanda fraca e manter o playground como ativo de marca.
