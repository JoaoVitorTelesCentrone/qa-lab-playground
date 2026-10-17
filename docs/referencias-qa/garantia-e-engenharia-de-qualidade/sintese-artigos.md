# Síntese dos artigos: garantia e engenharia de qualidade

Este arquivo resume os resumos disponíveis na biblioteca. A publicação e o tipo de cada registro estão no [índice da pasta](README.md); relatórios e referências técnicas não são tratados como ensaios científicos.

## Status of SPCA-ANL Software Development, Software Quality Assurance, and Application (FY2026)

- **Aborda:** manutenção e evolução de um simulador de incêndios de sódio para uso em contexto nuclear, com histórico de correções e releases.
- **Importante:** o relatório descreve a formalização de um programa de SQA que orienta infraestrutura, desenvolvimento, correções e releases. É um exemplo de governança e rastreabilidade em software crítico.
- **Aplicação no QA Lab:** discutir como requisitos de qualidade, documentação, configuração e evidência se conectam ao ciclo de vida. O contexto nuclear é específico.

## Software Quality Assurance Process: A Consolidated Definition and a Lifecycle-Mapped Taxonomy of Tool Support

- **Aborda:** revisão narrativa que diferencia QA, QC e testing e mapeia ferramentas por fase de SDLC e função (prevenção, avaliação ou detecção).
- **Importante:** propõe escolher ferramentas pelo propósito de engenharia e pelo momento em que apoiam o processo, em vez de categorias de fornecedores.
- **Aplicação no QA Lab:** usar como apoio à conversa sobre rastreabilidade e seleção de ferramentas por risco. O próprio trabalho prevê validação empírica futura da taxonomia.

## QualiTagger: automating software quality categorization in issue trackers

- **Aborda:** classifica sete atributos de qualidade em texto de issues; apresenta um conjunto com mais de 700 mil issues e compara classificadores especializados, modelo multiclasses e LLM.
- **Importante:** o resumo relata generalização para projetos não vistos, estudo industrial e estudo com estudantes, indicando potencial para triagem de preocupação de qualidade e dívida técnica.
- **Aplicação no QA Lab:** relacionar classificação automática de tickets com bug reports, métricas de produto e revisão humana. Não confundir classificar uma issue com verificar que o produto atende ao requisito.

## Integrated system of methods for automating the evaluation of risk management effectiveness in software quality assurance systems

- **Aborda:** pelo título, métodos para automatizar a avaliação de efetividade da gestão de riscos em sistemas de SQA.
- **Importante:** não há resumo na fonte indexada, então método, dados e resultados não podem ser confirmados.
- **Aplicação no QA Lab:** manter como leitura pendente; não citar uma conclusão até consultar o texto e confirmar a publicação.

## Methods and Tools for Engineering Management of Software Quality Level

- **Aborda:** aplica modelagem funcional IDEF0 para relacionar gestão de projeto, verificação, validação, testes e usabilidade.
- **Importante:** propõe um indicador agregado de qualidade com avaliação especializada e medidas de aceitação para localizar características problemáticas.
- **Aplicação no QA Lab:** discutir como métricas compostas podem apoiar conversa de qualidade. Examinar pesos, validade dos indicadores e risco de um score esconder uma falha crítica.

## Enhancing Software Quality through Dynamic Optimization-Based Latent Dirichlet Allocation and Indexive Regression (DOLDIR)

- **Aborda:** modelo que combina detecção de drift entre versões, tópicos de falhas, seleção de testes e scores de confiabilidade para prever risco.
- **Importante:** o resumo relata experimentos com NASA PROMISE e SoftRel Bench e precisão de classificação de risco de 92,8%, acima de seis modelos comparados.
- **Aplicação no QA Lab:** estudar a ideia de atualizar priorização quando o perfil do sistema muda entre versões.
- **Cautela:** o resumo não detalha protocolo, seleção dos baselines ou validade externa; não assumir que a mesma precisão se aplica a outros projetos.

## Trends in Software Quality in Embedded Systems: Are We Getting Any Better?

- **Aborda:** discussão de um modelo baseado em métricas e tendências observadas em uma grande base de código embarcado.
- **Importante:** destaca que “qualidade” não tem uma definição ou medida única e que tendências precisam ser interpretadas conforme o modelo escolhido.
- **Aplicação no QA Lab:** conversa sobre limites de métricas e a diferença entre medir sinais observáveis e concluir qualidade geral.
- **Cautela:** o resumo é curto e não informa dimensões, período ou resultados quantitativos.

## The Software Quality Assurance programme of the ASTRI Mini-Array project

- **Aborda:** programa de QA para software de operação e dados de um conjunto de telescópios, desenvolvido em modelo iterativo e incremental.
- **Importante:** apresenta organização, estratégia, controle e relatos de aplicação de QA ao longo de um ciclo operacional e científico complexo.
- **Aplicação no QA Lab:** exemplo de QA adaptada ao contexto e às consequências operacionais, com colaboração entre instituições e releases frequentes.

## Automated Software Quality Assurance Using CI/CD Tools

- **Aborda:** propõe um score final ponderado com múltiplas características de qualidade e gates automáticos de release em CI/CD.
- **Importante:** o resumo relata distinção entre builds de qualidade alta e baixa e redução de esforço manual em projetos reais.
- **Aplicação no QA Lab:** discutir gates proporcionais ao risco e agregação de sinais no pipeline.
- **Cautela:** um score único depende de pesos e limiares escolhidos; verificar quais métricas, projetos e decisões foram avaliados antes de o usar como regra de release.

## Software Quality Assurance Techniques of Models and Practices

- **Aborda:** o título anuncia modelos e práticas de SQA.
- **Importante:** o registro não tem resumo indexado suficiente para determinar método ou contribuição.
- **Aplicação no QA Lab:** leitura pendente; não inferir que “técnicas” específicas são recomendadas pelo trabalho.

## ANALISIS KUALITAS DAN PENERAPAN SOFTWARE QUALITY ASSURANCE PADA WEBSITE PORTAL KATINGAN MENGGUNAKAN MODEL ISOIEC 9126

- **Aborda:** estudo de um portal público com questionário a 50 pessoas, testes black-box e medição com GTmetrix.
- **Importante:** relata média geral 4,63/5, um link de serviço inativo e diferença de eficiência entre páginas, mostrando que um bom resultado agregado ainda pode esconder defeitos localizados.
- **Aplicação no QA Lab:** relacionar percepção dos usuários, testes funcionais e desempenho por página.
- **Cautela:** amostra e produto únicos; a nota do questionário não representa conformidade universal nem elimina a necessidade de olhar defeitos individuais.

## Autonomous Test Generation And Optimization: The Future Of Software Quality Assurance

- **Aborda:** panorama de geração de testes, priorização por risco, reparo automático e fuzzing inteligente com IA/ML.
- **Importante:** conecta geração e manutenção de testes a problemas reais de custo e mudança frequente.
- **Aplicação no QA Lab:** usar como mapa de possibilidades e perguntas de avaliação para ferramentas de automação inteligente.
- **Cautela:** o resumo não apresenta protocolo de revisão ou experimento próprio detalhado; não tratar o texto como demonstração de eficácia dos métodos.

## Guide to the Software Engineering Body of Knowledge: Software Quality

- **Tipo:** referência técnica do SWEBOK, não artigo de pesquisa.
- **Aborda:** fundamentos de qualidade de software, QA, verificação, validação, revisão, auditoria, medição e gestão de defeitos.
- **Importante:** oferece vocabulário e estrutura para situar os temas da mentoria antes de aprofundar em estudos específicos.
- **Aplicação no QA Lab:** usar como referência de consulta e organização conceitual, não como evidência experimental de que uma prática melhora resultados.

## A Systematic Mapping Study on Dynamic Metrics and Software Quality

- **Aborda:** mapeia 60 trabalhos sobre métricas dinâmicas e classifica foco, tipo de pesquisa e contribuição.
- **Importante:** encontra concentração em acoplamento, coesão e complexidade e aponta espaço para outras dimensões de qualidade.
- **Aplicação no QA Lab:** reforça que métricas de execução capturam aspectos que métricas estáticas não cobrem e que a escolha deve partir da pergunta.
- **Cautela:** o mapeamento foi publicado em 2021; usar como retrato daquele corpus, não como estado atual de toda a pesquisa.

## Statistical Analysis of Metrics for Software Quality Improvement

- **Aborda:** discute métricas de projeto, produto e processo e propõe categorizá-las conforme os erros que ajudam a observar.
- **Importante:** a ideia central é usar métricas de processo para orientar remoção de defeitos e melhorias, em vez de medir por medir.
- **Aplicação no QA Lab:** relacionar indicadores a ações corretivas e hipóteses verificáveis.
- **Cautela:** resumo e trabalho são de 2018; validar definições e método no texto antes de reutilizar como referência atual.

## Towards Resolving Software Quality-in-Use Measurement Challenges

- **Aborda:** qualidade em uso do ponto de vista de quem usa e dificuldades de medir esse conceito em modelos existentes.
- **Importante:** propõe uma estrutura com análise de sentimento para prever tópicos de qualidade em uso e relata resultados preliminares.
- **Aplicação no QA Lab:** conectar validação do produto à experiência e às tarefas reais, sem reduzir usabilidade a uma pontuação automatizada.
- **Cautela:** trata-se de proposta com resultados preliminares; confirmar validação e escopo no texto integral.
