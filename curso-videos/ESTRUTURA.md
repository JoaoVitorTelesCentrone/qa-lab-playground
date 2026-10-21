# Estrutura de videoaulas — Mentoria QA Lab

Esta pasta organiza a gravação da trilha atual (`mentorshipPathV2`): **7 temas, 28 capítulos e 40 aulas**. Cada aula tem um arquivo próprio com texto integral de narração, ações de tela, demonstração, decisão e exercício prático. As chaves das aulas são as mesmas usadas pelo produto para preservar progresso e publicação.

## Caso prático que atravessa as aulas

O caso fictício **Do pensamento ao próximo passo**, definido em `packages/web/lib/mentorship/broto-training-case.ts`, acompanha a trilha. A pessoa registra no Broto Space o pensamento “Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo”, relaciona o problema de adiar a revisão, define um objetivo de estudar 20 minutos em três dias e escolhe um próximo passo. As aulas investigam captura, retorno, organização, ação e visualização de crescimento. Grave com conta de estudo e dados sintéticos; confirme os controles da versão disponível antes da gravação.

As aulas de API usam a **API Lab local** para executar requests; as de carga usam **somente localhost**. O Broto fornece o contexto de negócio, mas o projeto ainda não dispõe de contrato ou staging autorizado da API do Broto. Resultados dos labs devem ser identificados como resultados locais. O mesmo vale para exemplos de CI e incidentes: uma configuração ou simulação não equivale a execução no produto.

## Regra de duração

- **Alvo de edição: até 9 minutos por vídeo. Teto absoluto: 10 minutos.** A abertura, a demonstração e a chamada para prática já estão incluídas nesse tempo. Os tempos por bloco incluem ações de tela e pausas para observar o resultado.
- Os roteiros reservam 1 minuto de margem para transições e respiração. Se a primeira edição passar de 10 minutos, corte contexto ou deixe detalhes na leitura e na prática da plataforma; não acelere a fala para caber.
- Leitura, quiz, exercício e feedback do mentor ocorrem **fora** desses 10 minutos. Um capítulo pode conter mais de um vídeo curto.
- Grave um conceito e uma decisão por aula. Use uma única demonstração principal com dados sintéticos, zoom legível e legendas revisadas.

## Fluxo padrão de cada vídeo

| Tempo | Finalidade |
| --- | --- |
| 0:00–0:30 | Pergunta concreta que a aula responde. |
| 0:30–1:30 | Contexto do produto e risco observado. |
| 1:30–3:00 | Conceito da aula com exemplo do caso. |
| 3:00–6:30 | Demonstração prática com entrada, ação e resultado visível. |
| 6:30–8:00 | Critério de decisão e limite da conclusão. |
| 8:00–9:00 | Ação prática e evidência a produzir. |

## Preparação e publicação

1. Confirme o roteiro, abra o ambiente indicado e prepare dados descartáveis. Não capture contas reais, tokens ou dados pessoais.
   Ajuste as falas que descrevem resultados para refletir exatamente o que a gravação mostrar; não encene uma aprovação ou um defeito.
2. Grave tela e voz em blocos curtos. Mostre o cursor, a entrada, a ação e o resultado; corte espera e navegação sem valor didático.
3. Revise clareza, duração final, legendas, volume, foco visual e informação sensível. Registre a duração real no arquivo da aula.
4. Hospede o vídeo e publique sua URL em `/mentoria/admin#conteudo-aulas`, usando a **chave da aula** indicada no roteiro. A leitura continua disponível no produto.

A duração antiga exibida no catálogo pode incluir leitura ou demonstrações previstas antes deste plano. Estes arquivos definem o **tempo máximo da gravação**; atualize a duração mostrada no produto quando cada vídeo for publicado.

## Temas e aulas

### 1. Produto, risco e exploração

Entenda a jornada antes de decidir o que investigar.

**Capítulo 01 — Produto, atores e jornada.** Desenhar o caminho de uma ideia até uma ação no Broto.

- [01 — O que um QA decide](./01-produto-risco/01-o-que-um-qa-decide.md) — 9 min; `mentoria.w01.l1`
- [02 — Leitura do briefing](./01-produto-risco/02-leitura-do-briefing.md) — 9 min; `mentoria.w01.l2`

**Capítulo 02 — Regras, estados e riscos.** Separar regra conhecida, hipótese e risco que merece teste.

- [03 — Como o trabalho de QA percorre a entrega](./01-produto-risco/03-como-o-trabalho-de-qa-percorre-a-entrega.md) — 9 min; `mentoria.w02.l3`

**Capítulo 03 — Charter e heurísticas.** Preparar uma investigação com pergunta, limite e variações úteis.

- [04 — Teste exploratório](./01-produto-risco/04-teste-exploratorio.md) — 9 min; `mentoria.w02.l1`
- [05 — Heurísticas úteis](./01-produto-risco/05-heuristicas-uteis.md) — 9 min; `mentoria.w02.l2`

**Capítulo 04 — Execução e debrief.** Registrar o observado e fechar uma investigação honesta.

- [06 — Exploração guiada](./01-produto-risco/06-exploracao-guiada.md) — 9 min; `mentoria.w01.l3`

### 2. Desenho e comunicação de testes

Transforme regras em cenários e evidências que apoiam decisões.

**Capítulo 05 — Critérios e oráculos.** Dizer de onde vem o esperado antes de executar.

- [01 — Do plano de teste ao exemplo executável](./02-desenho-comunicacao/01-do-plano-de-teste-ao-exemplo-executavel.md) — 9 min; `mentoria.w03.l3`

**Capítulo 06 — Classes e limites.** Reduzir casos redundantes sem perder bordas importantes.

- [02 — Técnicas que economizam tempo](./02-desenho-comunicacao/02-tecnicas-que-economizam-tempo.md) — 9 min; `mentoria.w03.l1`

**Capítulo 07 — Estados e tabelas de decisão.** Cobrir transições e combinações que mudam o resultado.

- [03 — Checklist de cenários](./02-desenho-comunicacao/03-checklist-de-cenarios.md) — 9 min; `mentoria.w03.l2`

**Capítulo 08 — Defeito e evidência.** Produzir um relato que outra pessoa consiga reproduzir.

- [04 — Bug report que resolve](./02-desenho-comunicacao/04-bug-report-que-resolve.md) — 9 min; `mentoria.w04.l1`
- [05 — Organizar técnicas e evidências de teste](./02-desenho-comunicacao/05-organizar-tecnicas-e-evidencias-de-teste.md) — 9 min; `mentoria.w04.l3`

**Capítulo 09 — Recomendação de release.** Recomendar liberar, bloquear ou investigar com base na cobertura real.

- [06 — Template de release](./02-desenho-comunicacao/06-template-de-release.md) — 9 min; `mentoria.w04.l2`

### 3. Automação web

Escolha uma proteção útil e construa um smoke estável.

**Capítulo 10 — Estratégia e camadas.** Escolher o que automatizar e onde o sinal será mais barato.

- [01 — O que vale automatizar](./03-automacao-web/01-o-que-vale-automatizar.md) — 9 min; `mentoria.w05.l1`
- [02 — Camadas, AAA e estratégia de automação](./03-automacao-web/02-camadas-aaa-e-estrategia-de-automacao.md) — 9 min; `mentoria.w05.l3`

**Capítulo 11 — Front-end e DevTools.** Localizar estado, requisições e elementos antes de escrever um teste.

- [03 — Fundamentos de front-end para QA](./03-automacao-web/03-fundamentos-de-front-end-para-qa.md) — 9 min; `mentoria.w06.l3`
- [04 — DevTools como evidência](./03-automacao-web/04-devtools-como-evidencia.md) — 9 min; `mentoria.v2.frontend-observabilidade`

**Capítulo 12 — Primeiro teste executável.** Proteger uma jornada com preparação, ação e assertion de negócio.

- [05 — Primeiro teste executável](./03-automacao-web/05-primeiro-teste-executavel.md) — 9 min; `mentoria.w06.l1`

**Capítulo 13 — Seletores e sincronia.** Esperar pelo estado certo sem pausas fixas.

- [06 — Seletores e massa](./03-automacao-web/06-seletores-e-massa.md) — 9 min; `mentoria.w06.l2`

**Capítulo 14 — Dados e suíte sustentável.** Evitar dependência entre testes e preservar o valor do smoke.

- [07 — Matriz de candidatos](./03-automacao-web/07-matriz-de-candidatos.md) — 9 min; `mentoria.w05.l2`

### 4. APIs e confiabilidade da suíte

Valide contratos, permissões e a saúde da automação.

**Capítulo 15 — HTTP, contrato e regra.** Verificar efeitos e dados, não apenas o status da resposta.

- [01 — API como produto](./04-api-confiabilidade/01-api-como-produto.md) — 9 min; `mentoria.w07.l1`

**Capítulo 16 — Collection e dados.** Montar uma sequência reproduzível em Postman ou Bruno.

- [02 — Contrato e dados](./04-api-confiabilidade/02-contrato-e-dados.md) — 9 min; `mentoria.w07.l2`

**Capítulo 17 — Autenticação e autorização.** Distinguir identidade, papel e acesso a um objeto.

- [03 — API, contrato e controle de acesso](./04-api-confiabilidade/03-api-contrato-e-controle-de-acesso.md) — 9 min; `mentoria.w07.l3`

**Capítulo 18 — Arquitetura e flakiness.** Diagnosticar se a falha vem do produto, do teste ou do ambiente.

- [04 — Suíte sustentável](./04-api-confiabilidade/04-suite-sustentavel.md) — 9 min; `mentoria.w08.l1`
- [05 — Como investigar flakiness](./04-api-confiabilidade/05-como-investigar-flakiness.md) — 9 min; `mentoria.w08.l2`
- [06 — Padrões de automação com propósito](./04-api-confiabilidade/06-padroes-de-automacao-com-proposito.md) — 9 min; `mentoria.w08.l3`

### 5. CI/CD e operação

Transforme verificações em feedback e responda a falhas com evidência.

**Capítulo 19 — Git, PR e pipeline.** Explicar o caminho da mudança até o feedback do time.

- [01 — Git, CI/CD e gates de qualidade](./05-cicd-operacao/01-git-ci-cd-e-gates-de-qualidade.md) — 9 min; `mentoria.w09.l3`
- [02 — Pipeline do commit ao feedback](./05-cicd-operacao/02-pipeline-do-commit-ao-feedback.md) — 9 min; `mentoria.w09.l1`

**Capítulo 20 — Gates, secrets e artefatos.** Bloquear falhas relevantes sem expor credenciais.

- [03 — GitHub Actions seguro](./05-cicd-operacao/03-github-actions-seguro.md) — 9 min; `mentoria.w09.l2`
- [04 — Quality gate não é número mágico](./05-cicd-operacao/04-quality-gate-nao-e-numero-magico.md) — 9 min; `mentoria.w10.l1`

**Capítulo 21 — Logs e triagem.** Correlacionar um sintoma a eventos e hipóteses.

- [05 — Monitoramento e segurança na operação](./05-cicd-operacao/05-monitoramento-e-seguranca-na-operacao.md) — 9 min; `mentoria.w10.l3`

**Capítulo 22 — Contenção e rollback.** Escolher uma resposta proporcional ao impacto.

- [06 — Rollback e feature flag](./05-cicd-operacao/06-rollback-e-feature-flag.md) — 9 min; `mentoria.w10.l2`

### 6. Acessibilidade e performance

Teste a experiência por tarefa e a confiabilidade sob carga segura.

**Capítulo 23 — Acessibilidade por tarefa.** Avaliar se uma pessoa consegue concluir a tarefa com teclado e informação perceptível.

- [01 — Acessibilidade começa pela tarefa](./06-acessibilidade-performance/01-acessibilidade-comeca-pela-tarefa.md) — 9 min; `mentoria.v2.acessibilidade-tarefa`
- [02 — Nome, erro e feedback](./06-acessibilidade-performance/02-nome-erro-e-feedback.md) — 9 min; `mentoria.v2.acessibilidade-evidencia`

**Capítulo 24 — Modelo de carga e segurança.** Definir alvo permitido e cenário antes de executar.

- [03 — Planejar e executar carga com segurança](./06-acessibilidade-performance/03-planejar-e-executar-carga-com-seguranca.md) — 9 min; `mentoria.w11.l1`

**Capítulo 25 — Execução com k6.** Comparar baseline, rampa e pico sem trocar condições.

- [04 — Teste de carga no pipeline](./06-acessibilidade-performance/04-teste-de-carga-no-pipeline.md) — 9 min; `mentoria.w11.l3`
- [05 — Comparações válidas em carga](./06-acessibilidade-performance/05-comparacoes-validas-em-carga.md) — 9 min; `mentoria.v2.k6-execucao`

**Capítulo 26 — Métricas e thresholds.** Interpretar latência, throughput e erros sem conclusão precipitada.

- [06 — Ler métricas e definir thresholds](./06-acessibilidade-performance/06-ler-metricas-e-definir-thresholds.md) — 9 min; `mentoria.w11.l2`

### 7. Projeto de conclusão

Una as evidências e mostre o que elas permitem concluir.

**Capítulo 27 — Case integrado.** Conectar riscos, testes, automação, pipeline e experiência.

- [01 — Como contar seu case](./07-projeto-final/01-como-contar-seu-case.md) — 9 min; `mentoria.w12.l1`
- [02 — Checklist final](./07-projeto-final/02-checklist-final.md) — 9 min; `mentoria.w12.l2`

**Capítulo 28 — Apresentação e portfólio.** Defender o raciocínio sem expor informação pessoal ou afirmar testes não feitos.

- [03 — Carreira e uso responsável de informação](./07-projeto-final/03-carreira-e-uso-responsavel-de-informacao.md) — 9 min; `mentoria.w12.l3`

**Total:** 40 roteiros; cerca de 360 minutos de vídeo (6 horas), distribuídos em 7 temas.
