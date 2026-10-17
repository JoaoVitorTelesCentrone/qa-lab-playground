# Plano de implementação — Roadmap QA Lab

## Objetivo

Integrar `RoadMapQA.docx`, `qa-roadmap-megazord-2026.md` e o conteúdo atual da mentoria em **uma trilha única de aprendizado de QA**, organizada nas 12 semanas principais e com aprofundamentos por competência e especialização. A página `/mentoria` continua explicando a mentoria; `/mentoria/conteudo` é a entrada canônica do **Roadmap QA Lab**. As páginas de cada aula, quiz, exemplo e desafio continuam separadas.

## Ponto de partida

- `RoadMapQA.docx` apresenta o núcleo de QA usado para organizar as primeiras 12 semanas.
- `qa-roadmap-megazord-2026.md` amplia o percurso com programação, web, APIs, SQL, CI/CD, containers, segurança, mobile, observabilidade, IA, carreira e especializações.
- O produto já possui seis fases, aulas, quizzes, exemplos, desafios, labs e acompanhamento de progresso; a integração mantém as rotas e identificadores existentes.
- A cobertura dos dois documentos fica registrada em [ROADMAPQA_COVERAGE.md](ROADMAPQA_COVERAGE.md) e [MEGAZORD_2026_COVERAGE.md](MEGAZORD_2026_COVERAGE.md).

## Decisões de produto

1. **Uma trilha, duas entradas:** `/mentoria` apresenta o serviço; `/mentoria/conteudo` apresenta o Roadmap QA Lab e leva ao estudo. Não criar uma terceira árvore de aulas com conteúdo duplicado.
2. **Seis fases, 12 semanas:** manter o percurso existente e reordenar assuntos onde isso melhora pré-requisitos. Cada semana terá no máximo três aulas teóricas, depois quiz, exemplo resolvido e desafio.
3. **Uma página por etapa:** cada aula tem URL, título específico, objetivo e conclusão próprios. Quiz, exemplo e desafio mantêm páginas próprias. O estudante pode continuar exatamente de onde parou.
4. **Ferramenta serve ao conceito:** escolher uma ferramenta principal por habilidade prática e apresentar alternativas em uma comparação curta. Não transformar a trilha principal em uma sequência de catálogos de ferramentas.
5. **Identificadores estáveis:** preservar chaves de aulas e entregas existentes para não perder progresso. Novas aulas recebem novas chaves; rotas antigas continuam válidas.

## Mapa curricular proposto

| Fase | Semana | Núcleo atual | Integração do RoadMapQA.docx | Evidência de aprendizagem |
| --- | --- | --- | --- | --- |
| Fundamentos e investigação | 1 | Produto, risco e briefing | Qualidade de produto/processo, métricas, pensamento de testador, caixa-preta/branca, DOR/DOD, AAA e priorização | Mapa de risco com métricas e perguntas verificáveis |
| Fundamentos e investigação | 2 | Exploração e heurísticas | Cascata, XP, Scrum, Kanban, fases de entrega, gargalos e compatibilidade | Charter e mapa do fluxo de entrega/ambientes |
| Desenho e comunicação | 3 | Técnicas e cobertura | Plano, cenário, caso, Gherkin, passo a passo, TDD, BDD, verificação/validação e organização de casos | Plano curto e cenários revisáveis |
| Desenho e comunicação | 4 | Defeitos e release | Relatório de execução, captura de evidência, smoke, regressão, usabilidade e rastreabilidade | Bug reproduzível e recomendação de release |
| Automação com critério | 5 | Decisão de automatizar | Pirâmide, níveis, AAA, abordagens, retorno e diferenças web/mobile/back-end | Matriz de testes por risco e camada |
| Automação com critério | 6 | Automação web | HTML/CSS/JS, DevTools, responsividade, adaptabilidade, Playwright/Cypress e papel de Jest/Jasmine | Fluxo web automatizado e diagnóstico da falha |
| Integrações e suíte | 7 | API e contrato | Back-end, xUnit, Swagger/OpenAPI, Bruno, autenticação, autorização e papéis | Suíte de API com teste de acesso cruzado |
| Integrações e suíte | 8 | Estabilidade da suíte | Custom commands, Page Object, Builder, Chain of Responsibility, smoke/regressão e flakiness | Refatoração com evidência antes/depois |
| Entrega contínua | 9 | Pipeline e PR | Git, GitHub/GitLab, métricas de PR, CI/CD, Azure DevOps Pipelines e secrets | PR documentado e pipeline com gate por risco |
| Entrega contínua | 10 | Release e recuperação | Monitoramento, Functions, logs/App Insights, vulnerabilidades, normas de segurança e rollback | Diagnóstico de incidente e decisão de contenção |
| Síntese e projeto | 11 | Performance | Lighthouse, Locust, carga/sobrecarga, acessibilidade e DevTools | Relatórios separados de desempenho e barreiras de uso |
| Síntese e projeto | 12 | Case final | IA permitida, proteção de código/dados, segurança da informação e caminhos de carreira | Case publicável e plano de evolução |

Os temas que aparecem em mais de uma semana terão **um conceito principal** e, depois, uma aplicação em contexto. Exemplo: smoke é apresentado na semana 1, escolhido como estratégia na semana 5 e usado no pipeline da semana 9. Isso evita três definições quase iguais.

## Padrão de cada aula

Cada aula deve passar por revisão editorial antes de ser publicada:

1. **Pergunta e objetivo:** o que a pessoa conseguirá decidir ou fazer ao terminar.
2. **Teoria progressiva:** definição, problema que resolve, quando usar, quando não usar e relação com temas já estudados.
3. **Exemplo concreto:** situação inicial, dados, passos, resultado, interpretação e limite da conclusão.
4. **Erro comum:** pelo menos um equívoco plausível e como reconhecê-lo.
5. **Aplicação curta:** uma tarefa de 10 a 20 minutos com resultado verificável.
6. **Fonte e atualização:** referências identificadas e revisão de links e termos de ferramentas antes de publicar.

O quiz verifica **decisão e interpretação**, não memorização de siglas. O exemplo resolvido mostra o raciocínio antes de mostrar a resposta. O desafio exige artefato, critério de avaliação e orientação de envio. A teoria fica nas páginas de aula; materiais longos de ferramenta viram apoio ou lab próprio.

## Entregas de implementação

### 1. Matriz de rastreabilidade e desenho editorial

- Extrair os itens do DOCX para uma tabela com identificador, tópico, prioridade, semana, aula, profundidade atual, mudança necessária e evidência de conclusão.
- Classificar cada item como **já desenvolvido**, **a aprofundar**, **a criar** ou **contexto externo necessário**.
- Revisar pré-requisitos: por exemplo, entender HTTP e back-end antes do exercício de API; entender Git antes do pipeline.
- Definir as novas aulas necessárias sem ultrapassar três por semana. A meta inicial é **36 aulas no total**; o número final depende da matriz, não de preencher uma cota.
- Resolver duplicações entre `curriculum`, `lesson-theory`, `deep-lessons`, `theory-expansion` e os complementos recentes. O leitor deve encontrar um único fio narrativo por aula.

### 2. Modelo de conteúdo e migração sem perda de progresso

- Criar uma fonte estruturada para fase, semana, aula, objetivos, blocos teóricos, exemplo, exercício, quiz, referências e vínculo com o item do DOCX.
- Manter `lesson.key` e slugs existentes; adicionar novas chaves e rotas de forma previsível.
- Conservar submissões, progresso e links antigos. Se a definição de conclusão mudar, especificar regra de equivalência para alunos que já concluíram aulas.
- Separar conteúdo editorial de dados de matrícula e revisão do mentor. Permitir atualização do texto sem mexer em tabelas de progresso quando não for necessário.

### 3. Produção por fase, sempre completa

Executar na ordem: **semanas 1–2**, **3–4**, **5–6**, **7–8**, **9–10**, **11–12**. Em cada par de semanas, entregar teoria revisada, quizzes, exemplos, desafios, referências e interface já conectados. Não marcar uma fase como pronta por ter apenas títulos ou resumos.

### 4. Experiência de leitura e navegação

- Na visão geral, mostrar seis fases compactas com semanas, competência, entrega e estado: não iniciada, em andamento ou concluída.
- Na semana, mostrar uma lista ordenada e curta das etapas, duração estimada e próximo passo recomendado.
- Na aula, usar largura de leitura confortável, subtítulos informativos, exemplos destacados e navegação anterior/próxima. Evitar repetir o mesmo conceito em três seções consecutivas.
- No celular, manter contexto da semana e acesso ao próximo passo sem depender de uma barra horizontal longa.
- Tratar aulas teóricas, quiz, exemplo e desafio como unidades distintas para retomada e acessibilidade.

### 5. Validação e lançamento

- Revisão editorial contra a matriz: **todos os itens definidos do DOCX** têm destino, profundidade e evidência; nenhum item fica apenas como nome de ferramenta.
- Revisão técnica dos exemplos executáveis nos labs e dos comandos de ferramentas; referências externas verificadas perto da publicação.
- Testes de catálogo: 12 semanas, ordem de pré-requisitos, títulos específicos, rotas, chaves estáveis e ausência de páginas vazias.
- Testes de fluxo: abrir semana, avançar entre etapas, responder quiz, concluir aula, retomar progresso e enviar desafio.
- Conferência visual em desktop e celular, teclado, foco, contraste e legibilidade de textos longos.
- Publicar o roadmap como completo somente quando as 12 semanas passarem pelos critérios acima; acompanhar dúvidas e abandono por etapa para ajustar a leitura.

## Critério de pronto do Roadmap QA Lab

O roadmap está pronto quando a pessoa consegue percorrer as 12 semanas, entender por que cada assunto vem naquela ordem, estudar teoria suficiente para executar a prática, conferir sua compreensão, produzir a entrega e retomar o ponto anterior. A matriz não pode ter item definido do documento sem aula ou justificativa explícita; exemplos e ferramentas precisam ser verificáveis, e o progresso existente deve continuar válido.

## Dependências de informação

- `Loop(?)` no DOCX está marcado como incerto. Só entra como ferramenta específica se houver objetivo pedagógico claro; gerenciamento de projeto já tem exemplos suficientes para ensinar o conceito.
- A comparação de carreira “mercado × ZBRA” depende de papéis, trilhas e políticas da ZBRA. Até receber esses dados, a aula deve ensinar análise de vagas e plano de carreira sem inventar regras internas.
- Tutoriais completos de todas as ferramentas citadas no documento são conteúdos especializados. O núcleo ensina a habilidade e oferece uma prática principal; alternativas ficam em material de apoio com escopo explícito.

## Registro da implementação

- **Currículo:** seis fases e 12 semanas; 36 aulas (três por semana), preservando as chaves das 25 aulas existentes e acrescentando a terceira aula ao fim das semanas 2–12.
- **Fontes curriculares:** o núcleo do `RoadMapQA.docx` foi integrado à trilha e os 31 blocos do `qa-roadmap-megazord-2026.md` foram mapeados em aprofundamentos nas terceiras aulas semanais. A cobertura lista a semana de destino e o escopo de cada bloco.
- **Aprendizagem:** cada aula tem objetivo, teoria, exemplo comentado, exercício e resposta; cada semana tem sete perguntas abertas de quiz, um caso resolvido e extensões práticas dos dois documentos com evidências e critérios. A terceira aula inclui o aprofundamento Megazord da semana. Rascunhos, respostas reveladas e autoavaliação do quiz são retomados no mesmo navegador.
- **Progresso:** as chaves existentes e as rotas de quiz, exemplo e desafio permanecem; aulas novas recebem chaves `mentoria.wXX.l3`.
- **Leitura:** `/mentoria/conteudo` identifica as duas fontes curriculares e apresenta seis fases compactas; a rota semanal lista etapas; a aula prioriza o conteúdo principal e recolhe leitura complementar; a rota de exemplo destaca um caso e deixa outros exercícios recolhidos.
- **Limites explícitos:** o roadmap ensina como avaliar e aplicar as ferramentas citadas, mas não simula contas ou serviços externos. Tutoriais operacionais completos de Qase, Trello, Shortcut, Bruno, Azure DevOps, Pact, Docker/Kubernetes e Locust dependem de ambientes próprios. Mobile, cloud, segurança avançada e avaliação de LLMs estão identificados como especializações. `Loop(?)`, normas internas e a comparação de carreira com ZBRA permanecem condicionados a informação que os documentos não fornecem. As afirmações de mercado brasileiro em 2026 foram mapeadas como alegações do arquivo-fonte, não como pesquisa independente.
- **Validação técnica:** `pnpm lint` nos arquivos alterados e `pnpm build` passaram após integrar ambos os documentos. A checagem isolada `bunx tsc --noEmit -p packages/web/tsconfig.json` não serve como gate neste repositório: ela inclui arquivos de teste sem tipos de `bun:test` e sinaliza a declaração de CSS global. O detector de interface não apontou problemas; não foi feita inspeção visual manual em navegador.
