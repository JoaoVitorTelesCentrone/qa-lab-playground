# Síntese dos artigos: IA/ML aplicada à qualidade

As sínteses usam os resumos indexados. Artigos conceituais, preprints e propostas sem avaliação são identificados como tais. Resultados numéricos são atribuídos ao resumo do estudo e precisam ser confirmados no texto integral.

## AI-Assisted Software Testing: Opportunities and Challenges

- **Aborda:** revisão de oportunidades de IA em teste e automação, incluindo geração de casos, análise e manutenção.
- **Importante:** aponta barreiras como dependência de dados, pouca interpretabilidade, falsos positivos, integração e risco de saída incorreta de LLMs; posiciona IA como apoio ao julgamento humano.
- **Aplicação no QA Lab:** construir critérios de validação e privacidade para uso de copilotos e geração de testes.

## On the Factors in Quantum Software Quality

- **Aborda:** propõe um modelo de qualidade para software quântico baseado na estrutura fator–critério–métrica de McCall.
- **Importante:** destaca características específicas do domínio — resultados probabilísticos, dependência de backend e fluxos híbridos — que modelos clássicos podem não representar diretamente.
- **Aplicação no QA Lab:** exemplo de adaptação de oráculos e critérios ao domínio; é especialização, não base obrigatória para QA geral.
- **Cautela:** o resumo recomenda avaliação futura por especialistas, estudos de caso e pesquisa empírica.

## Software quality assurance in the era of Agentic AI: a systematic mapping study

- **Aborda:** mapeia onde agentes de IA aparecem no ciclo de SQA, quais papéis apoiam e quais lacunas permanecem.
- **Importante:** conclui que a aplicação é desigual e que transparência, validação e apoio de liderança são lacunas prioritárias.
- **Aplicação no QA Lab:** ajuda a tratar agentes como componentes com permissões, supervisão e critérios de avaliação ao longo do SDLC.

## A Validated Measurement Protocol for Comparable, Cost-Aware Software Testing Evaluation: A Reproducible Benchmark, an Oracle Sampling-Budget Guarantee, and a Real-Fault Validity Study, Instantiated for Quantum Programs

- **Aborda:** define um protocolo executável para comparar técnicas de geração de teste e oráculos; inclui estudo de validade com defeitos reais e orçamento amostral para oráculos probabilísticos.
- **Importante:** o resumo reporta que o mesmo protocolo foi repetido em um sistema clássico de feature flags com resultados centrais replicados.
- **Aplicação no QA Lab:** discutir comparabilidade, custo, orçamento de oráculo e validade de constructo ao avaliar ferramentas.
- **Cautela:** o estudo é instanciado em programas quânticos e um caso clássico; confirmar as condições experimentais antes de extrapolar.

## AI-as-a-Judge for software quality assessment: Consistency, attitude effects, and complexity sensitivity in multi-agent code evaluation

- **Aborda:** pelo título, avalia consistência, efeitos de atitude e sensibilidade à complexidade quando agentes de IA julgam qualidade de código.
- **Importante:** o registro não traz resumo indexado; não há base para afirmar que os julgamentos são consistentes ou úteis.
- **Aplicação no QA Lab:** leitura pendente; a pergunta de pesquisa é relevante para avaliar juízes automáticos, mas resultados precisam ser extraídos do texto.

## Agentic AI for Early Bug Detection and Software Quality Assurance: A Multi-Agent Collaborative Framework

- **Aborda:** propõe agentes colaborativos para prever defeitos, analisar mudanças e fazer QA contínua em fluxos Agile/CI.
- **Importante:** o resumo relata cobertura de código de até 82% e tempo médio para localizar bugs de 10,5–12,1 horas.
- **Aplicação no QA Lab:** exemplo para discutir detecção antecipada e critérios para comparar agentes com ferramentas estáticas/dinâmicas.
- **Cautela:** os números são alegações do resumo; conferir datasets, baselines, definição de cobertura e protocolo no artigo.

## Intelligent automated code review and software quality evaluation: a survey of AutoML and large language model techniques

- **Aborda:** pelo título, revisa AutoML e LLMs para revisão automática de código e avaliação de qualidade.
- **Importante:** o registro não tem resumo indexado, então não é possível resumir o escopo real ou as conclusões.
- **Aplicação no QA Lab:** manter como leitura pendente e confirmar se é revisão sistemática, narrativa ou proposta antes de usar como fonte.

## Rethinking Software Quality Measurement: A Vision for AI-Assisted Triangulation in the Post-Metrics Era

- **Aborda:** visão para combinar sinais de repositório, interpretação semântica por agentes LLM e métricas estruturais para avaliar qualidade.
- **Importante:** propõe usar a triangulação como camada de evidência que orienta verificação e reparo, declarando incerteza em vez de confiar em um número isolado.
- **Aplicação no QA Lab:** reforçar triangulação de evidências e limites de métricas compostas.
- **Cautela:** é uma visão/arquitetura proposta; o resumo não reporta uma validação que prove os ganhos projetados.

## Training Dynamics of Neural Software Defect Predictors under Coupled Data-Quality Issues

- **Aborda:** planeja estudar como desequilíbrio de classes e sobreposição de classes se combinam e aparecem na dinâmica de treinamento de modelos de predição de defeitos.
- **Importante:** o resumo formula objetivo, protocolo e contribuição esperada; não apresenta resultados concluídos.
- **Aplicação no QA Lab:** alerta que qualidade dos dados influencia avaliação de modelos usados para priorizar teste e risco.
- **Cautela:** tratar como proposta de estudo/preprint até confirmar versão publicada e resultados.

## A Multi-Agent AI Framework for Automated Requirement-to-Test Case Mapping in Software Quality Assurance

- **Aborda:** três agentes extraem semântica de requisitos, mantêm rastreabilidade bidirecional e geram casos com templates guiados por LLM.
- **Importante:** o resumo reporta cobertura de requisitos de 94,7%, precisão de links de rastreabilidade de 91,3% e redução de 67% no esforço manual em três projetos open source.
- **Aplicação no QA Lab:** ilustra rastreabilidade automatizada como apoio à revisão de requisitos e casos.
- **Cautela:** confirmar como cobertura/precisão foram definidas, quais projetos e baselines foram usados, e se os casos gerados eram executáveis e corretos.

## AI-Augmented Closed-Loop Quality Engineering: A Reference Architecture for Continuous Software Quality Intelligence

- **Aborda:** arquitetura que fecha o ciclo entre mineração de requisitos, priorização de teste, previsão de defeitos e incidentes em produção.
- **Importante:** o resumo descreve uma avaliação em dados semissintéticos ao longo de seis releases e relata menor vazamento de defeitos, maior detecção e execução de testes mais curta.
- **Aplicação no QA Lab:** exemplo de shift right alimentando risco e seleção de teste do próximo ciclo.
- **Cautela:** base semissintética e poucos ciclos limitam generalização; confirmar replicabilidade e definições das métricas.

## AI-Driven Code Quality Assessment Model and Implementation for Complex Power Grid Software Systems

- **Aborda:** combina métricas estáticas, AST, dependências, histórico de mudanças e crítica por LLM para avaliar código de sistemas de energia.
- **Importante:** o resumo relata macro-F1 0,87 e AUC 0,93 em benchmark orientado a concessionárias, usando análise mais profunda para mudanças de maior risco.
- **Aplicação no QA Lab:** exemplo de roteamento por risco e combinação de sinais estruturados com avaliação contextual.
- **Cautela:** domínio crítico e benchmark próprio; os resultados não provam generalização para aplicações comuns.

## CodeQual-Agent: An Intelligent LLM-Agent Framework for Automated Software Quality Assessment with Explainable Predictions and Real-Time Analysis

- **Aborda:** combina métricas objetivas de análise estática e raciocínio de LLM com destilação de modelos, explicabilidade e revisão humana.
- **Importante:** o resumo afirma avaliação em 150 mil amostras e resultados de precisão, latência, redução de falsos positivos e escapes de defeito.
- **Aplicação no QA Lab:** caso para discutir evidência objetiva, julgamento contextual, custo de inferência e human-in-the-loop.
- **Cautela:** os resultados são substanciais; validar dataset, desenho de implantação, baseline, unidade da latência e significado de adoção antes de citá-los como comprovados.

## Engineering Management for AI-Driven Software Quality Assurance: Practices, Challenges, and Future Direction

- **Aborda:** gestão da qualidade em sistemas com IA, desde dados e implantação até manutenção, geração de teste, previsão de defeitos e validação de modelos.
- **Importante:** trata governança, ciclos de vida de ML e colaboração entre engenharia e QA como partes da qualidade do produto.
- **Aplicação no QA Lab:** leitura de panorama para discutir TEVV, responsabilidades e operação de sistemas com modelos.
- **Cautela:** resumo de alto nível; não informa método detalhado nem evidência comparativa.

## AI-Driven Software Quality Assurance: Transforming Testing Through Intelligent Automation and Predictive Analytics

- **Aborda:** visão geral de IA para previsão de defeitos, self-healing, priorização dinâmica e análise automatizada de requisitos.
- **Importante:** destaca que adoção exige qualidade de dados, supervisão humana, transparência, governança e desenvolvimento de competências.
- **Aplicação no QA Lab:** usar para abrir discussão de riscos e capacidades organizacionais.
- **Cautela:** o resumo não descreve experimento ou revisão sistemática; não usar afirmações amplas de transformação como evidência de eficácia.

## Data-Driven Software Quality Assurance: Leveraging Machine Learning for Risk Prediction and Test Optimization

- **Aborda:** propõe um framework conceitual de feedback fechado que une risco, priorização de testes, observabilidade e governança.
- **Importante:** reúne achados de contextos diferentes como padrões transferíveis, em vez de apresentar um experimento de QA completo.
- **Aplicação no QA Lab:** mapear como sinais de código, execução, produção e negócio poderiam orientar testes, mantendo explicabilidade.
- **Cautela:** proposta baseada em literatura; distinguir arquitetura recomendada de validação empírica do próprio framework.

## Data-Driven Test Case Prioritization (DD-TCP): A Machine Learning Framework for Intelligent Software Quality Assurance

- **Aborda:** ranqueia testes de regressão por mudança, dependências, duração e histórico de falhas com gradient-boosted trees.
- **Importante:** o resumo relata melhora de 32,4% em APFD e redução de 27,1% no custo de execução em simulações/datasets de projetos open source.
- **Aplicação no QA Lab:** exemplo para comparar priorização por dados históricos com seleção estática e risco manual.
- **Cautela:** avaliar estabilidade por projeto, custo de coleta de features e comportamento quando os dados históricos são escassos ou enviesados.

## Explainable AI-Driven Metrics for Transparent Software Quality Prediction

- **Aborda:** combina métricas estáticas, de processo e atividade de desenvolvedores com modelos preditivos e explicações SHAP/LIME.
- **Importante:** o resumo relata avaliação em PROMISE, Eclipse JDT, Apache Commons e dados industriais, além de estudo com desenvolvedores sobre decisões com métricas explicáveis.
- **Aplicação no QA Lab:** discutir explicabilidade como meio para questionar uma recomendação, não como prova de que o modelo está correto.
- **Cautela:** confirmar desenho do estudo com usuários, leakage entre projetos, métricas e validade externa.

## Industry Expectations and Skill Demands in Quantum Software Testing

- **Aborda:** análise de 110 vagas em organizações de software/hardware quântico sobre tarefas e competências de teste.
- **Importante:** identifica mistura de QA tradicional com validação experimental, calibração e colaboração interdisciplinar.
- **Aplicação no QA Lab:** exemplo de pesquisa de mercado de nicho e adaptação de competências de QA ao domínio.
- **Cautela:** estudo de vagas em setor emergente e amostra específica; não generalizar para o mercado geral de QA.

## Enhancing Software Quality Assurance with an Adaptive Differential Evolution based Quantum Variational Autoencoder-Transformer Model

- **Aborda:** propõe ADE-QVAET, combinando autoencoder variacional quântico, Transformer e otimização diferencial para prever defeitos.
- **Importante:** o resumo informa métricas altas de treino, mas não apresenta no trecho disponível contexto suficiente para interpretar a configuração completa.
- **Aplicação no QA Lab:** caso para discutir comparação de modelos e por que métricas de treino isoladas não demonstram generalização.
- **Cautela:** preprint; exigir métricas em teste independente, baselines, validação cruzada e reprodutibilidade antes de confiar nos números.
