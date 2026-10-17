# Pesquisa aplicada: conteudo da Mentoria QA Lab

## Resumo executivo

A mentoria foi estruturada para ensinar decisao de qualidade, nao apenas operacao de ferramentas. A progressao parte de contexto, risco e tecnicas de teste; avanca para automacao web e API; conecta os testes ao CI/CD e termina com performance e uma decisao de release sustentada por evidencias.

O desenho combina estudo assicrono curto, pratica semanal, entrega revisada e encontro ao vivo. O conteudo tecnico fica disponivel como texto completo enquanto os videos sao produzidos. O encontro ao vivo permanece reservado para feedback, carreira, comunicacao e dificuldades reais dos alunos.

## Principais achados

1. Fundamentos continuam sendo o diferencial. O CTFL v4.0 organiza a base em fundamentos, ciclo de desenvolvimento, teste estatico, tecnicas, gestao e ferramentas; por isso as primeiras semanas treinam contexto, risco, exploracao, desenho e comunicacao antes da automacao.
2. Automacao confiavel depende de isolamento e sincronizacao por condicao. Playwright recomenda locators orientados ao usuario e oferece actionability/auto-wait; Cypress recomenda testes independentes e retry de queries/assertions.
3. API precisa ser testada como contrato e superficie de autorizacao. Postman documenta scripts em request, pasta e collection; OWASP destaca riscos especificos de APIs, especialmente autorizacao e exposicao de dados.
4. CI/CD deve devolver evidencias, nao apenas uma cor. GitHub Actions organiza triggers, jobs e steps e permite matrizes, contexts, secrets e artefatos; a mentoria transforma esses recursos em gates com diagnostico.
5. Performance precisa de objetivo e criterio de aprovacao. k6 diferencia checks de thresholds e usa thresholds para produzir falha automatizavel no pipeline.
6. Ferramentas automaticas nao bastam para acessibilidade. A W3C recomenda selecionar ferramentas conforme o objetivo e consolidar achados em um processo de avaliacao e relatorio.

## Aplicacao no curriculo

- Semanas 1-4: risco, exploracao, tecnicas, bugs e decisao manual.
- Semanas 5-8: estrategia de automacao, web, API e saude da suite.
- Semanas 9-10: CI/CD, gates, diagnostico, excecoes e rollback.
- Semana 11: carga segura, percentis, checks, thresholds e recomendacao.
- Semana 12: projeto integrado, decisao de release e case de portfolio.

Cada semana possui resultados observaveis, quatro blocos conceituais, cinco passos de pratica, checklist de dominio, armadilhas, perguntas para o mentor e fontes oficiais.

## Riscos e contrapontos

- Certificacao nao substitui pratica. ISTQB foi usado como mapa conceitual, nao como roteiro de memorizacao.
- Piramide de testes nao e meta universal. A camada deve ser escolhida por risco, arquitetura, custo e velocidade de feedback.
- Retry nao corrige flakiness. Ele pode ajudar a observar uma falha, mas causa e evidencia continuam obrigatorias.
- Cobertura, testes verdes e p95 sao sinais parciais. Nenhuma metrica isolada decide uma release.
- Um curso completo nao garante prontidao profissional. Feedback sobre entregas, comunicacao e repeticao deliberada sao partes essenciais do produto.

## Questoes ainda abertas

- Onde os videos serao hospedados e qual sera a politica de acesso?
- Quais ferramentas a primeira turma usara: Playwright, Cypress ou ambas?
- Qual stack sera o caminho principal da automacao de API?
- Quais dados reais da turma serao usados para recalibrar duracao e dificuldade?

## Fontes

- [ISTQB CTFL v4.0](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/) — escopo de fundamentos, tecnicas, gestao e ferramentas.
- [Playwright Best Practices](https://playwright.dev/docs/best-practices) — locators, isolamento, CI e praticas de automacao.
- [Playwright Auto-waiting](https://playwright.dev/docs/actionability) — verificacoes de actionability antes de interacoes.
- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures) — composicao de setup e isolamento.
- [Cypress Best Practices](https://docs.cypress.io/app/core-concepts/best-practices) — independencia e organizacao dos testes.
- [Cypress Retry-ability](https://docs.cypress.io/app/core-concepts/retry-ability) — repeticao de queries e assertions.
- [Postman test scripts](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts) — scripts de validacao de respostas.
- [Postman Collection Runner](https://learning.postman.com/docs/tests-and-scripts/running-collections/intro-to-collection-runs) — execucao reproduzivel de collections.
- [OWASP Web Security Testing Guide](https://owasp.org/projects/web-security-testing-guide) — referencia de testes de seguranca web.
- [OWASP API Security Top 10](https://owasp.org/API-Security/) — riscos relevantes em APIs.
- [GitHub Actions](https://docs.github.com/actions/get-started/understand-github-actions) — componentes e fluxo de CI/CD.
- [GitHub Actions matrix](https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow) — variacoes e paralelismo.
- [GitHub Actions contexts](https://docs.github.com/actions/reference/workflows-and-actions/contexts) — contexts, matrix e secrets.
- [k6 Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/) — criterios de aprovacao e falha automatizada.
- [k6 API load testing](https://grafana.com/docs/k6/latest/testing-guides/api-load-testing/) — modelo de carga e objetivos de confiabilidade.
- [W3C Evaluation Tools](https://www.w3.org/WAI/test-evaluate/tools/list/) — ferramentas de avaliacao de acessibilidade.
- [WCAG-EM Report Tool](https://www.w3.org/WAI/eval/report-tool/) — consolidacao de resultados de acessibilidade.

## Parametros da pesquisa

```text
workflow: firecrawl-deep-research
topic: curriculo pratico de mentoria para QAs iniciantes e intermediarios
depth: thorough (10-15 minutos)
output: pesquisa aplicada + conteudo versionado na aplicacao
fontes: documentacao oficial e organismos de referencia
```
