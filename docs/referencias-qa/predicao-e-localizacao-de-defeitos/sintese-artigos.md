# O que importa em cada artigo

Esta pasta reúne artigos, preprints, relatórios e pacotes de dados sobre previsão/localização de defeitos. A síntese usa os resumos do índice local; quando o resumo não está disponível, a nota se limita ao tema indicado pelo título. Resultados são alegações dos trabalhos, não validação independente. Consulte [Referências](README.md) para origem, DOI e tipo de registro.

## Dataset Package: An Empirical Study of Classical Machine Learning Models for Software Defect Prediction Under Early-Stage Data Scarcity

- **Contribuição:** pacote de dados/estudo sobre modelos clássicos de previsão de defeitos sob escassez de dados inicial, usando PROMISE, desbalanceamento e previsão entre versões.
- **Uso:** útil para discutir limites de treinamento com pouco histórico e importância de avaliar curvas de aprendizagem; o registro é um pacote, não necessariamente um artigo revisado.

## Considering contextual semantics in domain-adversarial cross-project software defect prediction

- **Tema:** pelo título, investiga semântica contextual e adaptação adversarial de domínio para previsão entre projetos.
- **Limite:** resumo ausente; método específico e resultados precisam ser conferidos no texto integral.

## Cross-project Software Defect Prediction Using Divergence-based Domain Adaptation Approach

- **Tema:** propõe adaptação de domínio baseada em divergência para transferir modelos entre projetos.
- **Limite:** resumo ausente. A motivação é a diferença de distribuição entre projetos, mas não é possível atribuir desempenho ou superioridade ao método pelo registro.

## Validation-Controlled Model Selection and Soft Ensembling for Imbalanced Software Defect Prediction: A Repeated Within- and Cross-Project Evaluation

- **Tema:** seleção de modelos controlada por validação e combinação soft para dados desbalanceados, em cenários intra e entre projetos.
- **Limite:** resumo ausente; o título sinaliza desenho comparativo repetido, mas não informa resultados.

## Adaptive Intuitionistic Fuzzy K-Nearest Neighbors for Software Defect Prediction

- **Tema:** adaptação de KNN com lógica fuzzy intuicionista aplicada à previsão de defeitos.
- **Limite:** resumo ausente; confirmar representação, conjuntos de dados e comparação experimental antes de ensinar como técnica eficaz.

## Interpretable Software Defect Prediction with Ensemble Models Across Static and Process Metrics

- **Tema:** combina ensembles e métricas estáticas/de processo para previsão interpretável.
- **Limite:** resumo ausente; não se conhecem os métodos de explicação nem a evidência de interpretabilidade pelo registro.

## Replication Package: How Reliable Are Explanations in Cross-Project Software Defect Prediction? An Empirical Study of Stability and Robustness

- **Contribuição:** pacote de replicação com código, saídas, rankings SHAP, análises e experimentos de perturbação para estudar estabilidade de explicações em previsão entre projetos.
- **O que levar:** o pacote não inclui as bases PROMISE/Jureczko originais nem o manuscrito. As saídas não são os dados brutos; use-o como artefato experimental e consulte o artigo associado para as conclusões.

## Project-Aware Validation in Software Defect Prediction: A Controlled Simulation and Real-World Benchmark Study of Evaluation Optimism

- **Tema:** pelo título, analisa otimismo na avaliação de previsão de defeitos com validação sensível ao projeto e benchmark real.
- **Limite:** resumo não disponível; não inferir tamanho do viés nem recomendar protocolo específico sem consultar o manuscrito.

## KG-Commit: A Dynamic Knowledge Graph for Online Just-in-Time Software Defect Prediction

- **Contribuição:** grafo de conhecimento dinâmico que atualiza histórico do repositório, estrutura AST e semântica de commits; inferência leve em CPU para previsão JIT.
- **Resultado reportado:** em 11 projetos Apache, relata Macro-F1 0,704, G-Mean 0,706 e AUC 0,809 no pipeline selecionado. São resultados do benchmark descrito, não promessa de desempenho em qualquer repositório.

## Quality Assurance of Software Incorporating Graph Neural Networks for Defect Prediction

- **Tema:** pelo título, trata de garantia de qualidade com redes neurais em grafos para previsão de defeitos.
- **Limite:** resumo ausente e metadados de venue incompletos no índice; usar apenas após verificar a publicação e o texto.

## Software Defect Prediction Using Machine Learning: A Comparative Analysis of Ensemble and Neural Classification Algorithms

- **Contribuição:** compara seis ensembles e um MLP raso em métricas estáticas de quatro conjuntos NASA/PROMISE, com reamostragem SMOTE apenas no treino.
- **Resultado reportado:** XGBoost lidera no estudo (89,4% de acurácia e F1 85,1%); o MLP não supera os ensembles de árvore nos volumes avaliados. A conclusão é específica ao protocolo e aos dados usados.

## Software Defect Prediction Dataset: 296,457 Code File Instances from Five Open-Source Repositories (Elasticsearch, Spring Boot, Hadoop, Kafka, Express)

- **Contribuição:** dataset de 296.457 arquivos em cinco repositórios, com métricas de processo e rótulos binários inferidos por palavras-chave em commits.
- **O que levar:** escala e diversidade podem ampliar estudos, mas a rotulagem heurística de mensagens de commit pode introduzir ruído. A versão 2 corrige erro em idade de arquivo e atualiza registros; cite a versão usada.

## Quantum-Inspired Deep Learning for Automated Software Defect Prediction: A Hybrid QLSTM-GCN Approach

- **Contribuição proposta:** combina QLSTM para sequências temporais e GCN para relações estruturais entre módulos, mirando métricas de alta dimensão e classes desbalanceadas.
- **Limite:** o resumo fornecido descreve motivação e arquitetura, sem resultados suficientes para concluir vantagem prática ou benefício quântico.

## DA-GWO-AUC: A Defect-Aware and AUC-Preserving Grey Wolf Optimisation Framework for Stable Feature Selection in Software Defect Prediction

- **Tema:** pelo título, propõe seleção estável de atributos por Grey Wolf Optimization, com foco em preservar AUC e considerar defeitos.
- **Limite:** resumo ausente; validar protocolo e comparação antes de reutilizar a alegação do título.

## Quantum Data Encoding Techniques for Software Defect Prediction: A Resource-Aware Evaluation

- **Tema:** avalia codificações de dados quânticos para previsão de defeitos considerando recursos computacionais.
- **Limite:** resumo ausente. O título não prova vantagem frente a métodos clássicos nem viabilidade em hardware real.

## Deep Learning vs. Traditional Machine Learning for Software Defect Prediction: A Meta-Analysis

- **Tema:** meta-análise comparando deep learning e machine learning tradicional para previsão de defeitos.
- **Limite:** resumo ausente; conferir critérios de inclusão, heterogeneidade dos estudos e medidas combinadas antes de citar conclusões.

## ET-SDP: Enhancing Code Embeddings with Effort-Related and Test Coverage Metrics for Improved Software Defect Prediction

- **Contribuição:** amplia embeddings de código com métricas de esforço e cobertura de testes; avalia 15 versões do Calcite e 6 do Apache Ant-Ivy.
- **Resultado reportado:** o resumo relata melhora com menos atributos do que métricas tradicionais. Aplicação depende da disponibilidade e comparabilidade de dados de processo e cobertura.

## HGFE: A plug-and-play heterogeneous graph feature enhancement framework for software fault localization

- **Tema:** pelo título, propõe aprimorar atributos em grafos heterogêneos para localização de falhas.
- **Limite:** resumo ausente; não é possível descrever tipos de nós, benchmark ou precisão obtida.

## An Intelligent Framework for AI-Based Automated Software Testing and Defect Prediction

- **Contribuição:** arquitetura conceitual que conecta análise de requisito/código, geração e priorização de testes, previsão de risco, feedback do modelo e relatórios.
- **O que levar:** apresenta um fluxo integrado de qualidade proativa, mas o resumo caracteriza síntese/estrutura proposta; não demonstra por si só eficácia operacional.

## Comparative Evaluation of TabKANet with Oversampling and Feature Selection Ablation for Software Defect Prediction

- **Contribuição:** compara TabKANet com baselines em 12 conjuntos numéricos NASA e mede por ablação o efeito de oversampling e seleção de atributos.
- **O que levar:** a ablação ajuda a separar o ganho da arquitetura do ganho do pré-processamento. Conferir o artigo para resultados e protocolo completos; não atribuir desempenho apenas pelo título.

## Adaptive Just-in-Time software defect prediction using unsupervised concept drift detection

- **Tema:** adaptação da previsão JIT a mudanças na distribuição dos dados por detecção não supervisionada de concept drift.
- **Limite:** resumo ausente; mecanismo, latência e ganhos não podem ser confirmados pelo registro.

## A Hybrid Feature Selection and Ensemble Learning Framework for Software Defect Prediction with Class Imbalance Handling

- **Contribuição:** combina filtragem por informação mútua, ensemble soft voting de seis classificadores e SMOTE aplicado apenas ao treino em cinco bases PROMISE.
- **O que levar:** destaca prevenção de vazamento de dados e avaliação em múltiplos projetos; o resumo indexado está truncado antes dos resultados completos.

## Understanding Software Defect Prediction: A Large-scale Empirical Study Across Uncertainty Quantification and Performance Evaluation

- **Contribuição:** estuda cinco métricas de incerteza, seis métricas de desempenho, três de calibração e 16 classificadores em cenários intra e entre projetos.
- **Achado reportado:** relações entre incerteza e desempenho dependem do cenário. Na prática, confiança prevista não deve ser tratada como substituto de calibração e validação no contexto.

## Balancing Accuracy and Cost: An Adaptive Hybrid Framework for Feature Selection in Software Defect Prediction

- **Contribuição:** propõe AHMOFS-TLM, seleção multiobjetivo adaptativa, testada com cinco classificadores e 12 datasets.
- **O que levar:** a seleção de atributos envolve custo computacional e qualidade preditiva; comparar apenas acurácia ignora o custo de busca. O resumo fornecido não traz números finais completos.

## Machine Learning and Evolutionary Computing Techniques for Software Defect Prediction: A Systematic Review and Comparative Analysis

- **Contribuição:** revisão sistemática/comparativa de técnicas de ML e computação evolutiva para previsão de defeitos.
- **O que levar:** útil como mapa de famílias de métodos e dados; conferir período, protocolo de revisão e evidências primárias antes de extrair ranking de algoritmos.

## Hybrid Approach to Software Defect Prediction and Classification using a Variational Autoencoder and Scalable Graph Attention Network

- **Contribuição:** combina VAE, rede de atenção em grafo e subamostragem orientada a ranking para lidar com desbalanceamento e representações estruturadas.
- **Limite:** o resumo descreve a arquitetura e problemas-alvo, mas não fornece aqui resultados comparativos suficientes para concluir superioridade.

## Evaluating SMOTE-based Class Imbalance Handling in Software Defect Prediction

- **Contribuição:** comparação leakage-safe de regressão logística, Random Forest e KNN no AEEEM_JDT, com métricas sensíveis ao desbalanceamento.
- **Resultado reportado:** SMOTE melhora medidas baseadas em limiar para RF e KNN; quase não muda F1 da regressão logística e reduz MCC. A escolha depende do algoritmo e da métrica.

## BioDefect: The First Dataset for Defect Detection in Bioinformatics Software

- **Contribuição:** apresenta uma base dedicada a software de bioinformática, preservando repositórios completos e contexto do código.
- **O que levar:** dados específicos do domínio podem preencher lacunas de benchmarks genéricos; avaliar a qualidade dos rótulos e a representatividade antes de comparar com PROMISE.

## A Bayesian-Optimized Multi-Scale Oversampling Method for Imbalanced Software Defect Prediction

- **Contribuição:** BO-SCAO combina embeddings CodeT5+, métricas de complexidade e distância multiescala para sintetizar casos minoritários, com otimização bayesiana.
- **Limite:** método proposto; verificar em texto completo se o ganho se mantém em projetos externos e sem vazamento entre treino e teste.

## Diversity-Stacked Ensemble (DSE): A Heterogeneous Meta-Ensemble Framework for Imbalanced Software Defect Prediction

- **Contribuição:** meta-ensemble heterogêneo com árvores, KNN e MLP, com pipeline de transformação e seleção de atributos para enfrentar o paradoxo da acurácia.
- **O que levar:** diversidade de modelos pode ser explorada para classes raras, mas deve ser avaliada por recall, F1/MCC e custo, não por acurácia isolada. Resumo não traz resultado final completo.

## Evaluating Software Defect Prediction Models via the Area Under the ROC Curve Can Be Misleading

- **Contribuição:** questiona se AUC resume adequadamente modelos de previsão de módulos defeituosos e analisa pontos operacionais das curvas ROC.
- **O que levar:** AUC agrega limiares que talvez não sejam usados na prática; escolher métricas alinhadas à capacidade de inspeção e ao custo de falsos positivos/negativos.

## An Empirical Study on Deep Learning-based Line-Level Software Defect Prediction

- **Contribuição:** comparação de oito modelos de previsão em nível de linha, em 32 benchmarks de nove projetos, incluindo cenários entre versões e entre projetos.
- **O que levar:** métricas de esforço e localização (por exemplo, defeitos encontrados por fração do código inspecionado) complementam AUC/recall. Conferir o artigo para os resultados de cada cenário.

## An Explainable Transformer-Based Framework for Software Defect Prediction Using QLoRA and Semantic Evaluation

- **Contribuição:** propõe transformer ajustado com QLoRA e representação que combina tokens de código e métricas estáticas, em nível de linha, sobre mais de 2,3 milhões de linhas rotuladas.
- **Limite:** o resumo informa configuração e escala, mas não permite julgar qualidade das explicações ou generalização sem consultar avaliação completa.

## A novel generative oversampling for software defect prediction

- **Contribuição:** GeNSDP gera amostras minoritárias com modelo generativo leve e as usa em uma rede profunda; avalia datasets NASA/PROMISE.
- **Resultado reportado:** AUC média de 99,1% e F-measure 0,92, com ganhos reportados contra baselines. Valores muito altos exigem examinar divisão dos dados, vazamento, variação entre datasets e reprodução independente.

## DP‐GCN: Integrating GraphCodeBERT and GCN With Contrastive Learning for Software Defect Prediction

- **Contribuição:** combina representações semânticas/estruturais do GraphCodeBERT, GCN para dependências e aprendizado contrastivo, com foco também em generalização entre projetos.
- **Limite:** resumo descreve motivação e componentes; para afirmar ganho ou custo, verificar resultados e ablações do artigo.

## A multi-level complexity metric suite for software quality measurement and machine learning-based software defect prediction

- **Tema:** pelo título, propõe métricas de complexidade em vários níveis para medição de qualidade e previsão de defeitos.
- **Limite:** resumo ausente; não é possível listar métricas ou afirmar validade preditiva.

## ENHANCING SOFTWARE QUALITY THROUGH MACHINE LEARNING DRIVEN DEFECT PREDICTION MODEL

- **Contribuição:** descreve pipeline de previsão com dados PROMISE, limpeza, balanceamento, normalização e imputação para identificar módulos propensos a defeitos.
- **Limite:** resumo indexado não detalha amostras nem resultados finais; tratar como proposta/estudo aplicado até conferir o texto.

## CoCo-GAN: CodeBERT-driven collaborative generative adversarial learning for software defect prediction

- **Tema:** pelo título, combina CodeBERT e aprendizado adversarial generativo para previsão de defeitos.
- **Limite:** resumo ausente; confirmar desenho experimental e evidência antes de resumir benefícios.

## IMPACT OF SOFTWARE PROCESS METRICS ON DEFECT DETECTION EFFICIENCY: A COMPARATIVE STUDY WITHIN ADVANCED SOFTWARE QUALITY ASSURANCE FRAMEWORKS

- **Contribuição:** revisão comparativa de estudos de 2015–2025 sobre métricas de processo e eficiência de detecção de defeitos.
- **O que levar:** métricas de mudança, esforço e atividade podem complementar métricas do produto; por ser uma síntese secundária, conferir escopo e critérios antes de tratar associações como causalidade.

## Machine Learning-Based Software Defect Prediction and Its Application: A Systematic Review

- **Contribuição:** revisão recente que classifica algoritmos, datasets, métricas de avaliação e domínios em previsão de defeitos baseada em ML.
- **O que levar:** usar para mapear tendências e limitações; checar protocolo de busca e estudos incluídos antes de apoiar decisões técnicas em suas conclusões.

## XMENTOR: A Rank-Aware Aggregation Approach for Human-Centered Explainable AI in Just-in-Time Software Defect Prediction

- **Contribuição:** agrega explicações LIME/SHAP/BreakDown em uma visualização ordenada e implementada como plugin de VS Code.
- **Resultado reportado:** quase 90% dos participantes preferiram as explicações agregadas. É uma preferência de estudo com usuários, não prova de que as explicações sejam corretas ou reduzam defeitos.

## A transformer-based stacked ensemble framework for software defect prediction

- **Tema:** pelo título, empilha modelos transformer para previsão de defeitos.
- **Limite:** resumo ausente; consultar artigo para arquitetura, datasets e comparação.

## Gradient-Guided Adversarial Data Augmentation with Genetic Optimization for Imbalanced Software Defect Prediction

- **Contribuição:** GPDA usa gradientes e otimização genética para gerar dados adversariais para classes minoritárias.
- **Resultado reportado:** o resumo afirma melhora de AUC média em comparação com técnicas de aumento de dados; faltam números no registro local para quantificar o efeito.

## Detecting concept drift in just-in-time software defect prediction using model interpretation

- **Tema:** pelo título, usa interpretação de modelos para detectar mudanças de conceito em previsão JIT.
- **Limite:** resumo ausente; o título não esclarece se explicações melhoram a detecção nem o custo operacional.

## An Audit of Machine Learning Experiments on Software Defect Prediction

- **Contribuição:** auditoria de estudos de SDP indexados na Scopus entre 2019 e 2023, avaliando desenho, validação fora da amostra, métricas, inferência estatística e reprodutibilidade.
- **O que levar:** avaliar a qualidade do experimento é tão necessário quanto comparar algoritmos; procurar divisões corretas, estatística apropriada e artefatos reproduzíveis.

## MSTDP: a multi-scale temporal deep learning framework for just-in-time software defect prediction with cross-attention fusion

- **Contribuição proposta:** combina padrões de commits em escalas horárias, diárias e semanais com semântica de código, comportamento de desenvolvedores e atenção cruzada; considera concept drift.
- **Limite:** resumo descreve a arquitetura; consultar resultados para confirmar robustez e custo.

## Software Defect Prediction Models: Technical Evolution, Performance Comparison, and Future Directions

- **Contribuição:** organiza a evolução de modelos tradicionais para engenharia de atributos e deep learning/fusões, comparando escala, desbalanceamento, generalização e custo de engenharia.
- **O que levar:** modelos têm limites de aplicação diferentes; o custo e o cenário de validação devem acompanhar a comparação de desempenho.

## Explainable deep learning for software defect prediction: a residual-shuffle network approach with SHAP and LIME

- **Tema:** pelo título, combina uma rede residual-shuffle com explicações SHAP e LIME para SDP.
- **Limite:** resumo ausente; não assumir que usar ferramentas de explicação garante explicações estáveis ou compreensíveis.

## Explainable Machine Learning for Software Defect Prediction in Large-Scale Code Repositories Using Code Embeddings and Repository-Level Knowledge Graphs

- **Contribuição proposta:** arquitetura de larga escala que junta embeddings de código, grafo do repositório e sinais de dependências, testes, builds, ownership e histórico, com mecanismos de explicação.
- **Limite:** o resumo descreve uma arquitetura de ciclo de vida; separar proposta arquitetural de validação empírica ao citar.

## Self-Adaptive Parameter Control in Differential Evolution Based on Optimizing Undersampling Strategies for Software Defect Prediction

- **Contribuição:** integra LTRUS a variantes de Differential Evolution para ajustar dinamicamente pesos de ranking; avalia três classificadores com validação cruzada e métricas além de AUC.
- **O que levar:** parâmetros de subamostragem também afetam resultados; comparar MCC, precisão e recall ajuda a evitar conclusão baseada somente em AUC.

## Evolution of Ensemble Learning in Software Defect Prediction: A Systematic Literature Review

- **Contribuição:** revisão sistemática da evolução de ensembles em SDP, cobrindo famílias de combinação e sua relação com estabilidade e confiabilidade.
- **O que levar:** ensemble não é uma técnica única; avaliar diversidade, robustez e comparação com modelos-base. Verificar protocolo e achados detalhados na publicação.

## Benchmarking TabNet, NODE, and FT-Transformer for Software Defect Prediction: An Empirical Comparison and Explainability Analysis

- **Contribuição:** compara três arquiteturas tabulares no NASA JM1, usa NearMiss para desbalanceamento e inclui análise de explicabilidade.
- **O que levar:** um benchmark de um dataset é evidência localizada; conferir métricas de classe minoritária e a qualidade das explicações além da acurácia.

## Emerging Patterns and Research Directions on Machine Learning in Software Defect Prediction: A Systematic Literature Review

- **Contribuição:** revisão de trabalhos de 2015–2025 sobre algoritmos, datasets, seleção de atributos e métricas.
- **Desafios destacados:** desbalanceamento, redundância de atributos e disponibilidade limitada de dados; aponta tendências em explicabilidade e transferência de conhecimento.

## A Novel Unsupervised Method for Software Defect Prediction Based on Clustering Assumption

- **Contribuição:** propõe CLA-CA para previsão não supervisionada, buscando limites de decisão por regiões do espaço de atributos.
- **O que levar:** métodos sem rótulo respondem à falta de histórico rotulado, mas devem ser avaliados em bases externas e comparados em condições equivalentes. Resumo não traz métricas finais completas.

## An Extensive Empirical Investigation of Ensemble Learning for Software Defect Prediction

- **Contribuição:** compara sete classificadores individuais e técnicas de ensemble em diferentes datasets, considerando heterogeneidade e desbalanceamento.
- **Limite:** resumo local descreve o desenho, mas não fornece os resultados finais completos; consultar o artigo antes de declarar um vencedor.

## Cross Project Software Defect Prediction Using Machine Learning with Optimized Feature Selection

- **Contribuição:** combina seleção de atributos PSO com conhecimento de domínio e ADASYN para previsão entre projetos em cinco bases NASA.
- **O que levar:** transferência entre projetos precisa lidar simultaneamente com atributos redundantes, diferenças de distribuição e classes raras; a validação deve manter projetos separados.

## From Illusion to Insight: Change-Aware File-Level Software Defect Prediction Using Agentic AI

- **Contribuição:** reformula previsão por arquivo para raciocinar sobre mudanças entre versões e usa debate multiagente com LLM.
- **Achado reportado:** argumenta que persistência de rótulos pode inflar F1 tradicional e esconder transições raras. Útil para discutir validade do alvo e do split; verificar resultados e replicação no preprint.

## When Data Quality Issues Collide: A Large-Scale Empirical Study of Co-Occurring Data Quality Issues in Software Defect Prediction

- **Contribuição:** estuda em 374 datasets a coocorrência de desbalanceamento, sobreposição, atributos irrelevantes, ruído e outliers, com cinco classificadores.
- **O que levar:** problemas de dados interagem; tratar cada um isoladamente pode ocultar efeitos conjuntos. Resultados dependem das configurações e dos benchmarks analisados.

## Contrasting the Hyperparameter Tuning Impact Across Software Defect Prediction Scenarios

- **Contribuição:** compara o impacto de tuning entre previsão dentro de versões e entre versões.
- **O que levar:** benefício de ajuste de hiperparâmetros pode variar por cenário; tuning precisa ocorrer dentro do treino/validação, sem contaminar o teste final.
- **Limite:** resumo local não inclui resultados quantitativos.

## Software Defect Prediction using Autoencoder Transformer Model

- **Contribuição proposta:** ADE-QVAET combina otimização por evolução diferencial, autoencoder variacional quântico e transformer para aprender representações e dependências sequenciais.
- **Limite:** o resumo afirma desempenho alto, mas o registro não fornece comparações e métricas suficientes para avaliar essa alegação.

## ReDef: Do Code Language Models Truly Understand Code Changes for Just-in-Time Software Defect Prediction?

- **Contribuição:** apresenta dataset de modificações em funções C/C++ de 22 projetos, com defeitos ancorados em reversões e casos limpos verificados posteriormente.
- **Dados reportados:** 3.164 modificações defeituosas e 10.268 limpas, com triagem assistida por GPT e auditorias. O foco é também testar se modelos de código entendem mudanças, não apenas texto/código isolado.

## Breaking New Ground in Software Defect Prediction: Introducing Practical and Actionable Metrics with Superior Predictive Power for Enhanced Decision-Making

- **Contribuição:** investiga métricas baseadas em hábitos de programação de desenvolvedores para prever defeitos em nível de método, comparando-as com métricas de código e histórico.
- **O que levar:** sinais humanos/processuais podem tornar previsões mais acionáveis; considerar privacidade, viés e uso responsável dessas métricas. Conferir a publicação para evidência e contexto.

## Critical Considerations on Effort-aware Software Defect Prediction Metrics

- **Contribuição:** demonstra que resultados de métricas effort-aware dependem da medida usada como proxy do esforço de inspeção, questionando a suposição de proporcionalidade com LOC.
- **O que levar:** definir esforço operacionalmente e testar sensibilidade à proxy escolhida; rankings de modelos podem mudar com essa escolha.

## Multimodal Learning for Just-In-Time Software Defect Prediction in Autonomous Driving Systems

- **Contribuição proposta:** combina texto, métricas numéricas/categóricas e contexto em um modelo multimodal para previsão JIT em software automotivo/autônomo.
- **Limite:** o resumo descreve a arquitetura; sistemas de direção autônoma exigem validação de segurança e evidência mais forte que um benchmark preditivo isolado.

## SDPERL: A Framework for Software Defect Prediction Using Ensemble Feature Extraction and Reinforcement Learning

- **Contribuição proposta:** extrai sinais semânticos/estruturais com cinco modelos pré-treinados e usa PPO, espaço de embeddings e mecanismo inspirado em ACO para seleção de atributos.
- **Limite:** consultar o artigo para saber estabilidade, custo e comparação; o resumo não basta para concluir que RL é melhor que seleção convencional.

## Quantum vs. Classical Machine Learning Algorithms for Software Defect Prediction: Challenges and Opportunities

- **Contribuição:** compara três algoritmos de machine learning quântico e cinco clássicos em 20 datasets de defeitos.
- **O que levar:** comparar qualidade preditiva junto a recursos, codificação e limitações de hardware; o rótulo “quântico” não implica vantagem prática. Conferir resultados detalhados.

## Feature Importance in the Context of Traditional and Just-In-Time Software Defect Prediction Models

- **Contribuição:** compara importância de atributos em previsão tradicional e JIT no Apache Camel; o resumo relata redes profundas e algoritmos de ML como modelos avaliados.
- **O que levar:** importância é dependente do cenário/modelo e não prova causalidade. O registro menciona acurácias de 80% e 86% para deep learning e AUC, mas está truncado; verificar o texto antes de associar os números a cada cenário.
