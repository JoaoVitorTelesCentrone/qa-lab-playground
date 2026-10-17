# Roadmap QA Lab

Trilha integrada a partir de `RoadMapQA.docx` e `qa-roadmap-megazord-2026.md`, organizada em seis fases e 12 semanas. A versão navegável está em [`/mentoria/conteudo`](packages/web/app/mentoria/conteudo/page.tsx); cada semana tem três aulas teóricas, quiz, exemplo prático e desafio. A terceira aula de cada semana inclui um aprofundamento Megazord recolhido, com aplicação e fontes.

O percurso mantém um núcleo progressivo para QA e acrescenta caminhos de aprofundamento em engenharia, dados, operação e especializações. Tópicos avançados como Kubernetes, mobile e avaliação de LLMs são extensões, não requisitos para concluir a base.

## Percurso

| Fase | Semana | Foco | Entrega principal |
| --- | ---: | --- | --- |
| Fundamentos e ciclo de entrega | 1 | Produto, risco, métricas e mentalidade de QA | Mapa de risco do produto |
| Fundamentos e ciclo de entrega | 2 | Exploração, fluxo de desenvolvimento e compatibilidade | Charter e análise de fluxo |
| Testes manuais e comunicação | 3 | Planejamento, cenários, Gherkin, TDD e BDD | Plano e cenários rastreáveis |
| Testes manuais e comunicação | 4 | Técnicas, evidência, defeitos e release | Relatos e recomendação de release |
| Automação com critério | 5 | AAA, pirâmide e decisão de automatizar | Matriz de automação por risco |
| Automação com critério | 6 | Front-end, DevTools e automação web | Smoke web com assertions úteis |
| APIs e arquitetura de automação | 7 | API, contratos, SQL, dados e autorização | Coleção de API e consulta de dados reproduzíveis |
| APIs e arquitetura de automação | 8 | Arquitetura, resiliência, Docker/Linux e flakiness | Refatoração e ambiente documentados |
| Entrega contínua, segurança e operação | 9 | Git, PR, CI/CD, ambientes e secrets | Pipeline de qualidade documentado |
| Entrega contínua, segurança e operação | 10 | OWASP, sinais de produção, incidentes e recuperação | Diagnóstico e plano de contenção |
| Performance, acessibilidade e carreira | 11 | Performance, WCAG, DevTools e trilha mobile | Relatórios com limites declarados |
| Performance, acessibilidade e carreira | 12 | IA/LLMs, carreira, especializações e projeto Megazord | Case final revisável e plano de evolução |

## Como usar

1. Abra `/mentoria/conteudo` e escolha uma fase.
2. Entre na semana e percorra as aulas na ordem; cada aula tem teoria, objetivo, exemplo e exercício.
3. Responda ao quiz antes de revelar as respostas. O rascunho e a autoavaliação são salvos neste navegador.
4. Estude o caso resolvido e conclua o desafio da semana no ambiente indicado.

As aulas existentes mantêm seus identificadores para preservar o progresso. As aulas complementares usam chaves `mentoria.wXX.l3`.

## Documentação

- [Arquivo QA Roadmap Megazord 2026](qa-roadmap-megazord-2026.md)
- `RoadMapQA.docx` — documento-base da mentoria.
- [Plano detalhado de implementação](docs/QA_LAB_ROADMAP_PLAN.md)
- [Matriz de cobertura do RoadMapQA.docx](docs/ROADMAPQA_COVERAGE.md)
- [Matriz de cobertura do QA Roadmap Megazord 2026](docs/MEGAZORD_2026_COVERAGE.md)
- [Índice de artigos e referências acadêmicas por origem e tópico](docs/INDICE_ARTIGOS_CIENTIFICOS_QA.md)
- [Catálogo e ordem das aulas](packages/web/lib/mentorship/catalog.ts)
- [Fases do roadmap usadas no front](packages/web/lib/mentorship/roadmap.ts)
