# Dossiê completo: IA/ML aplicada à qualidade

**20 registros.** Este arquivo reúne os metadados disponíveis na biblioteca local, o resumo/abstract registrado e os pontos importantes da síntese editorial de cada trabalho. Os resumos permanecem na língua e na forma em que foram indexados; ausência de resumo ou de metadados é indicada explicitamente.

Snapshot dos metadados: **2026-09-29T15:55:26.540Z**. Classificação do tópico e tipo de registro são editoriais; confira a fonte primária antes de citar ou aplicar resultados.

[Voltar às referências da pasta](./README.md) · [Resumo geral de toda a biblioteca](../../RESUMO_GERAL_ARTIGOS_QA.md) · [Síntese dos pontos importantes](./sintese-artigos.md)

## A Multi-Agent AI Framework for Automated Requirement-to-Test Case Mapping in Software Quality Assurance

- **Autores:** Shailjakant Shukla, Manav Bansal, Arpit Chhabra
- **Ano / data de publicação:** 2026 / 2026-06-08
- **Origem ou publicação:** International Journal of Drug Delivery Technology
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Processos, requisitos e formação em QA; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-25258-ijddt-16-48s-109
- **DOI:** [https://doi.org/10.25258/ijddt.16.48s.109](https://doi.org/10.25258/ijddt.16.48s.109)
- **URL registrada:** [https://doi.org/10.25258/ijddt.16.48s.109](https://doi.org/10.25258/ijddt.16.48s.109)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-09-01T14:10:27.703Z

### Resumo registrado

The complexity of today’s software systems has become critically important to ensure sufficient test coverage based on changing requirements. Conventional methods of requirements traceability and test case generation are mostly manual, time-consuming, and subject to human error, often resulting in coverage gaps which translate into post-release bugs. In this paper, a new Multi-Agent Artificial Intelligence (AI) system that could be used to automate the entire pipeline of requirement-to-test mapping is presented, and the way it would revolutionize software quality assurance practices is discussed. The proposed framework uses three collaborating intelligent agents: a Requirement Parsing Agent (RPA) that applies transformer-based Natural Language Processing (NLP) to extract semantic objects of the heterogeneous requirement documents a Traceability Mapping Agent (TMA) that builds and maintains dynamic bidirectional traceability matrices using a knowledge graph backbone and a Test Generation Agent (TGA) that synthesizes executable test cases of the traced requirement nodes using large language model (LLM) guided templates. Experimental analysis of three opensource software projects indicates that the proposed system can meet an average requirement coverage rate of 94.7, a precision of traceability link of 91.3 and a 67 percent reduction in the manual test authoring effort as compared to the baseline approaches. The framework is checked in the framework of IEEE 29148 and ISO/IEC 25010 quality standards. Findings suggest that the system performs remarkably better compared to the current automated tests systems such as NLP-based traceability recovery techniques and traditional test generation systems. This study offers a reproducible, time saving and produces standards-conforming, open-source architecture of intelligent software testing both in an Agile and traditional SDLC setting.

### Pontos importantes para leitura

- **Aborda:** três agentes extraem semântica de requisitos, mantêm rastreabilidade bidirecional e geram casos com templates guiados por LLM.
- **Importante:** o resumo reporta cobertura de requisitos de 94,7%, precisão de links de rastreabilidade de 91,3% e redução de 67% no esforço manual em três projetos open source.
- **Aplicação no QA Lab:** ilustra rastreabilidade automatizada como apoio à revisão de requisitos e casos.
- **Cautela:** confirmar como cobertura/precisão foram definidas, quais projetos e baselines foram usados, e se os casos gerados eram executáveis e corretos.

---

## A Validated Measurement Protocol for Comparable, Cost-Aware Software Testing Evaluation: A Reproducible Benchmark, an Oracle Sampling-Budget Guarantee, and a Real-Fault Validity Study, Instantiated for Quantum Programs

- **Autores:** Bhanwar Gupta, Sanjeev Rana
- **Ano / data de publicação:** 2026 / 2026-08-26
- **Origem ou publicação:** não informado
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Fundamentos e métodos de teste
- **Identificador:** doi-doi-org-10-21203-rs-3-rs-10572455-v1
- **DOI:** [https://doi.org/10.21203/rs.3.rs-10572455/v1](https://doi.org/10.21203/rs.3.rs-10572455/v1)
- **URL registrada:** [https://doi.org/10.21203/rs.3.rs-10572455/v1](https://doi.org/10.21203/rs.3.rs-10572455/v1)
- **Consulta que encontrou o registro:** software product quality
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Abstract Testing-technique evaluations are comparable only under a shared, fixed measurement protocol; published results in emerging domains are usually incompatible, so effectiveness claims accumulate without becoming comparable. We contribute a fixed, executable protocol making competing test-generation and oracle techniques comparable; a validated statistical guarantee on the sampling budget a probabilistic test oracle needs before its verdicts can be trusted; and a construct-validity study measuring how well mutation testing predicts detection of real developer faults. We built a benchmark and protocol, QSQ-Bench and Q-EVAL, with a canonical mutation-operator set and fixed oracle, budget, and statistics, instantiated on quantum programs, whose test oracle is inherently statistical. We validate the sampling-budget bound, compare four test-generation strategies on 15 programs, sweep three oracle families over a full program-budget grid, measure oracle behaviour under device noise, and execute 52 real bug/fixed-version pairs through the harness used for synthetic mutants. All validation checks pass; no oracle family dominates the grid; parameter-perturbation mutants are markedly harder to kill than other classes (62% versus 89–100%); the oracle statistic converges to a device-imposed noise floor rather than zero; and 81% of executable real bugs are detected, with every miss provably invisible to any output-based oracle. Comparability, cost-awareness, and construct validity can be delivered as properties of a fixed protocol; we confirm this domain-generality directly by re-executing the identical, unmodified protocol code on a classical feature-flag bucketing system, where every headline finding replicates. A reproducibility package is available on request.

### Pontos importantes para leitura

- **Aborda:** define um protocolo executável para comparar técnicas de geração de teste e oráculos; inclui estudo de validade com defeitos reais e orçamento amostral para oráculos probabilísticos.
- **Importante:** o resumo reporta que o mesmo protocolo foi repetido em um sistema clássico de feature flags com resultados centrais replicados.
- **Aplicação no QA Lab:** discutir comparabilidade, custo, orçamento de oráculo e validade de constructo ao avaliar ferramentas.
- **Cautela:** o estudo é instanciado em programas quânticos e um caso clássico; confirmar as condições experimentais antes de extrapolar.

---

## Agentic AI for Early Bug Detection and Software Quality Assurance: A Multi-Agent Collaborative Framework

- **Autores:** Abdulaziz Alhumam
- **Ano / data de publicação:** 2026 / 2026-08-24
- **Origem ou publicação:** International Journal of Computational Intelligence Systems
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-1007-s44196-026-01540-4
- **DOI:** [https://doi.org/10.1007/s44196-026-01540-4](https://doi.org/10.1007/s44196-026-01540-4)
- **URL registrada:** [https://doi.org/10.1007/s44196-026-01540-4](https://doi.org/10.1007/s44196-026-01540-4)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

The modern software systems requires a proactive, scalable, and continuously adaptive quality assurance techniques to maintain the pace with iterative Agile workflows and CI/CD pipelines. Conventional static and dynamic analysis tools remain largely reactive, isolated, and that might lead to a high false positive rates (FPR). To address all such challenges, the current study has proposed an Agentic Artificial Intelligence (AAI) framework that is collaborative, multi-agent architecture designed for early software defect prediction (SDP) and continuous quality monitoring. The framework orchestrates specialized, autonomous agents dedicated to static-semantic code analysis, defect prediction, automated test generation, patch synthesis, and quality assessment. Code representations are constructed using Graph Attention Networks (GAT) on Abstract Syntax Trees (AST) combined with CodeBERT semantic embeddings and BiLSTM temporal evolution modeling. Furthermore, a reinforcement learning (RL) feedback mechanism dynamically adapts agent policies using sprint-level performance signals. Evaluated across standard PROMISE (JM1, KC1, PC1) and Defects4J benchmark datasets, the proposed framework achieves an average accuracy of 0.87, a recall of 0.87, and reduces the false positive rate to 0.12–0.15. Additionally, automated test generation improves code coverage up to 82% while lowering the mean time to bug detection (MTTD) to 10.5–12.1 hours. These results demonstrate that multi-agent collaborative reasoning significantly enhances early defect localization and provides continuous quality assurance in modern software engineering.

### Pontos importantes para leitura

- **Aborda:** propõe agentes colaborativos para prever defeitos, analisar mudanças e fazer QA contínua em fluxos Agile/CI.
- **Importante:** o resumo relata cobertura de código de até 82% e tempo médio para localizar bugs de 10,5–12,1 horas.
- **Aplicação no QA Lab:** exemplo para discutir detecção antecipada e critérios para comparar agentes com ferramentas estáticas/dinâmicas.
- **Cautela:** os números são alegações do resumo; conferir datasets, baselines, definição de cobertura e protocolo no artigo.

---

## AI-as-a-Judge for software quality assessment: Consistency, attitude effects, and complexity sensitivity in multi-agent code evaluation

- **Autores:** Sherlinford Chou
- **Ano / data de publicação:** 2026 / 2026-08-25
- **Origem ou publicação:** Software Quality Journal
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Modelos e métricas de qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-1007-s11219-026-09785-0
- **DOI:** [https://doi.org/10.1007/s11219-026-09785-0](https://doi.org/10.1007/s11219-026-09785-0)
- **URL registrada:** [https://doi.org/10.1007/s11219-026-09785-0](https://doi.org/10.1007/s11219-026-09785-0)
- **Consulta que encontrou o registro:** software maintainability reliability
- **Data de descoberta:** 2026-08-25T09:52:53.604Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Aborda:** pelo título, avalia consistência, efeitos de atitude e sensibilidade à complexidade quando agentes de IA julgam qualidade de código.
- **Importante:** o registro não traz resumo indexado; não há base para afirmar que os julgamentos são consistentes ou úteis.
- **Aplicação no QA Lab:** leitura pendente; a pergunta de pesquisa é relevante para avaliar juízes automáticos, mas resultados precisam ser extraídos do texto.

---

## AI-Assisted Software Testing: Opportunities and Challenges

- **Autores:** Mingyang Peng
- **Ano / data de publicação:** 2026 / 2026-09-13
- **Origem ou publicação:** Exploring Science Academic Conference Series
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Fundamentos e métodos de teste
- **Identificador:** doi-doi-org-10-70267-aitia-2026300307
- **DOI:** [https://doi.org/10.70267/aitia.2026300307](https://doi.org/10.70267/aitia.2026300307)
- **URL registrada:** [https://doi.org/10.70267/aitia.2026300307](https://doi.org/10.70267/aitia.2026300307)
- **Consulta que encontrou o registro:** software product quality
- **Data de descoberta:** 2026-09-13T13:49:02.556Z

### Resumo registrado

Software testing has played an important role in checking software reliability, security, and quality. However, testing has remained one of the most costly and time-consuming parts of the software development life cycle, especially as modern systems have b ecome larger and more frequently updated. Traditional manual testing depends on human experience, while automated testing still requires testers to write and maintain many test scripts. This paper reviewed the opportunities and challenges of AI-assisted software testing based on selected academic studies, technical reports, and industry examples. The review found that AI techniques, such as machine learning, search-based optimization, fuzzing, and large language models, can support testing tasks such as test generation, defect prediction, code analysis, test prioritization, and debugging. These applications may reduce manual effort, improve test coverage, and help teams identify risky components earlier. At the same time, the review identified several challenges, including limited data quality, weak generalization across projects, low interpretability, false positives, integration difficulties, and risks related to LLM outputs. The paper argues that AI is unlikely to fully replace human testers in the near future. Instead, AI should be used as an assistant that supports human judgment in software quality assurance.

### Pontos importantes para leitura

- **Aborda:** revisão de oportunidades de IA em teste e automação, incluindo geração de casos, análise e manutenção.
- **Importante:** aponta barreiras como dependência de dados, pouca interpretabilidade, falsos positivos, integração e risco de saída incorreta de LLMs; posiciona IA como apoio ao julgamento humano.
- **Aplicação no QA Lab:** construir critérios de validação e privacidade para uso de copilotos e geração de testes.

---

## AI-Augmented Closed-Loop Quality Engineering: A Reference Architecture for Continuous Software Quality Intelligence

- **Autores:** D. Bajaj
- **Ano / data de publicação:** 2026 / 2026-06-07
- **Origem ou publicação:** arXiv.org
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-48550-arxiv-2606-08793
- **DOI:** [https://doi.org/10.48550/arXiv.2606.08793](https://doi.org/10.48550/arXiv.2606.08793)
- **URL registrada:** [https://doi.org/10.48550/arXiv.2606.08793](https://doi.org/10.48550/arXiv.2606.08793)
- **Consulta que encontrou o registro:** software quality model
- **Data de descoberta:** 2026-08-15T22:37:48.767Z

### Resumo registrado

The quality of software engineering is still under a challenge due to disjointed processes between requirements, testing, and production, which hinders the opportunity to implement quality strategies in consecutive releases. Existing approaches tend to be fixed-model or single-optimization approaches and lack production feedback learning mechanisms. The paper at hand proposes a closed-loop reference architecture of continuous software quality intelligence with AI enhancements. The model synthesizes requirement feature mining, risk-based test prioritization, defect prediction, and production incident analysis as an element of a feedback-based pipeline. A limited feedback learning model is introduced that is used to propagate the production signal-based on defect severity and incident impact- to the following release to ensure stability, and the time. The method is evaluated using a semi-synthetic test dataset of 4,500 requirements, 27,049 test cases, 13,089 defects and 7,841 incidents in six release cycles. The experimental results show that the proposed system reduces the defect leakage by 0.19 to 0.13, increases the effectiveness of the detection system to 0.72 to 0.84, and shortens the test execution by up to 35 percent compared to the non-adaptive baselines. The changes are stable release to release. The findings indicate that through the integration of feedback-based learning in a closed-loop architecture, it can be continued to enhance quality process, which offers practical foundation of adaptive quality engineering of software.

### Pontos importantes para leitura

- **Aborda:** arquitetura que fecha o ciclo entre mineração de requisitos, priorização de teste, previsão de defeitos e incidentes em produção.
- **Importante:** o resumo descreve uma avaliação em dados semissintéticos ao longo de seis releases e relata menor vazamento de defeitos, maior detecção e execução de testes mais curta.
- **Aplicação no QA Lab:** exemplo de shift right alimentando risco e seleção de teste do próximo ciclo.
- **Cautela:** base semissintética e poucos ciclos limitam generalização; confirmar replicabilidade e definições das métricas.

---

## AI-Driven Code Quality Assessment Model and Implementation for Complex Power Grid Software Systems

- **Autores:** Wen-Long Zhang
- **Ano / data de publicação:** 2026 / 2026-06-01
- **Origem ou publicação:** 2026 International Conference on Computer Intelligence and Software Engineering (CICSE)
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Modelos e métricas de qualidade
- **Identificador:** doi-doi-org-10-1109-cicse70286-2026-11621056
- **DOI:** [https://doi.org/10.1109/CICSE70286.2026.11621056](https://doi.org/10.1109/CICSE70286.2026.11621056)
- **URL registrada:** [https://doi.org/10.1109/CICSE70286.2026.11621056](https://doi.org/10.1109/CICSE70286.2026.11621056)
- **Consulta que encontrou o registro:** software maintainability reliability
- **Data de descoberta:** 2026-09-14T15:54:35.333Z

### Resumo registrado

Power grid software systems, containing dispatching automation platforms, distribution management systems, substation secondary applications, metering and marketing services, equipment condition monitoring systems, and edge-cloud collaborative applications, show interlaced quality signals among source code structure, dependency topology, configuration logic, repository evolution, and review discourse. Therefore, purely metric-based evaluation is not enough for utility software that must simultaneously satisfy reliability, cyber-security, traceability, and maintainability constraints. This paper puts forward CAIQA-Net, an AI-driven code quality assessment model that combines static metrics, abstract syntax tree representations, graph-based dependency context, change-history signals, and a constrained large language model critic to generate maintainability, defect-risk, security-compliance smell, and review-burden assessments for complex po]wer grid software. The application uses a complexity-aware controller that sends routine interface adjustments or configuration edits to a lightweight path while sends cross-subsystem, protocol-parsing, protection-logic, or semantically novel changes to deep analysis, thus balancing accuracy and cost. A controlled prototype test on a utility-oriented benchmark indicates that the proposed fusion strategy is better than metric-only, AST-only, and unconstrained LLM baselines; it raises Macro-F1 to 0.87 and AUC to 0.93 while keeping average decision delay below 100 ms per analyzed module in the hybrid mode. Hence, the study demonstrates that practical AI quality assessment for power grid software gains benefits not from a single model family, but from disciplined multi-view evidence fusion and uncertainty-aware explanation generation.

### Pontos importantes para leitura

- **Aborda:** combina métricas estáticas, AST, dependências, histórico de mudanças e crítica por LLM para avaliar código de sistemas de energia.
- **Importante:** o resumo relata macro-F1 0,87 e AUC 0,93 em benchmark orientado a concessionárias, usando análise mais profunda para mudanças de maior risco.
- **Aplicação no QA Lab:** exemplo de roteamento por risco e combinação de sinais estruturados com avaliação contextual.
- **Cautela:** domínio crítico e benchmark próprio; os resultados não provam generalização para aplicações comuns.

---

## AI-Driven Software Quality Assurance: Transforming Testing Through Intelligent Automation and Predictive Analytics

- **Autores:** Thanigaivel Rangasamy
- **Ano / data de publicação:** 2026 / 2026-01-30
- **Origem ou publicação:** Journal of Information Systems Engineering & Management
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Fundamentos e métodos de teste; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-52783-jisem-v11i1s-14246
- **DOI:** [https://doi.org/10.52783/jisem.v11i1s.14246](https://doi.org/10.52783/jisem.v11i1s.14246)
- **URL registrada:** [https://doi.org/10.52783/jisem.v11i1s.14246](https://doi.org/10.52783/jisem.v11i1s.14246)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-09-01T14:10:27.703Z

### Resumo registrado

Software Quality Assurance has undergone a significant transformation as organizations shift from traditional development models to continuous delivery approaches requiring adaptive, intelligent validation strategies. Artificial Intelligence introduces paradigm-shifting capabilities through machine learning algorithms that enable predictive defect detection, self-healing test automation, and dynamic optimization of validation activities. Natural language processing technologies facilitate automated requirements analysis and comprehensive traceability verification, while reinforcement learning algorithms enable adaptive test prioritization based on continuous feedback from execution outcomes. These AI-driven capabilities address critical limitations in conventional quality assurance practices, including test maintenance overhead, delayed defect detection, and insufficient scalability for complex distributed systems. The integration of AI into quality assurance workflows necessitates thoughtful human-AI collaboration frameworks that leverage complementary strengths while maintaining appropriate human oversight of critical quality decisions. As software systems increasingly govern essential societal infrastructure across healthcare, transportation, and financial domains, AI-enhanced quality assurance becomes essential for maintaining trust, reliability, and safety. The successful adoption of intelligent quality assurance requires robust data management practices, workforce skill development, and ethical governance frameworks that ensure transparent, accountable AI application throughout the software development lifecycle.

### Pontos importantes para leitura

- **Aborda:** visão geral de IA para previsão de defeitos, self-healing, priorização dinâmica e análise automatizada de requisitos.
- **Importante:** destaca que adoção exige qualidade de dados, supervisão humana, transparência, governança e desenvolvimento de competências.
- **Aplicação no QA Lab:** usar para abrir discussão de riscos e capacidades organizacionais.
- **Cautela:** o resumo não descreve experimento ou revisão sistemática; não usar afirmações amplas de transformação como evidência de eficácia.

---

## CodeQual-Agent: An Intelligent LLM-Agent Framework for Automated Software Quality Assessment with Explainable Predictions and Real-Time Analysis

- **Autores:** Faisal Mohammad, J. K. Kakar, D. R. Bekale, Be Ndong, Mot Chas, Duksan Ryu
- **Ano / data de publicação:** 2026 / 2026-05-18
- **Origem ou publicação:** International Conference on Software Testing, Verification and Validation Workshops
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Modelos e métricas de qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-1109-icstw72326-2026-00035
- **DOI:** [https://doi.org/10.1109/ICSTW72326.2026.00035](https://doi.org/10.1109/ICSTW72326.2026.00035)
- **URL registrada:** [https://doi.org/10.1109/ICSTW72326.2026.00035](https://doi.org/10.1109/ICSTW72326.2026.00035)
- **Consulta que encontrou o registro:** software quality model
- **Data de descoberta:** 2026-08-25T09:52:53.604Z

### Resumo registrado

Software quality assurance requires scalable solutions combining the deterministic precision of static analysis with the contextual reasoning of semantic understanding. This paper presents CodeQual-Agent, a hybrid neural-symbolic framework bridging traditional metrics-based assessment with Large Language Model (LLM) capabilities through an intelligent orchestration architecture. The framework addresses three fundamental challenges: (1) integration of symbolic features with neural reasoning, (2) efficient distillation of quality-assessment expertise from high-capacity teacher models into deployable student agents, and (3) explainable predictions that build developer trust. CodeQual-Agent employs a Virtual SonarQube Instance as its symbolic foundation, extracting objective metrics (cyclomatic complexity, code duplication, maintainability indices) that serve as attention-weighted anchors grounding LLM reasoning. Through knowledge distillation from GPT-4 and Gemini Pro teachers to a Gemini 2.5 Flash student, the framework achieves 94.0% precision at 450ms inference latency, maintaining 96.8% of teacher accuracy while delivering a 2.6× speedup. A Human-in-the-Loop (HITL) active learning pipeline reduces false positives by 17% over three update cycles. SHAP-based explainability achieves 87% alignment with developer intuition. Evaluated on 150,000 samples across three complementary datasets, real-world deployment demonstrates a 14% reduction in production defect escape rates and 83% developer adoption.

### Pontos importantes para leitura

- **Aborda:** combina métricas objetivas de análise estática e raciocínio de LLM com destilação de modelos, explicabilidade e revisão humana.
- **Importante:** o resumo afirma avaliação em 150 mil amostras e resultados de precisão, latência, redução de falsos positivos e escapes de defeito.
- **Aplicação no QA Lab:** caso para discutir evidência objetiva, julgamento contextual, custo de inferência e human-in-the-loop.
- **Cautela:** os resultados são substanciais; validar dataset, desenho de implantação, baseline, unidade da latência e significado de adoção antes de citá-los como comprovados.

---

## Data-Driven Software Quality Assurance: Leveraging Machine Learning for Risk Prediction and Test Optimization

- **Autores:** Nisha Varma, Rohit Chandra, Sandeep Iyer, P. Narayanan
- **Ano / data de publicação:** 2026 / 2026-01-02
- **Origem ou publicação:** International Journal of Mathematical Analysis and Research
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-64137-3108-2637-ijmar-v2i1p101
- **DOI:** [https://doi.org/10.64137/3108-2637/ijmar-v2i1p101](https://doi.org/10.64137/3108-2637/ijmar-v2i1p101)
- **URL registrada:** [https://doi.org/10.64137/3108-2637/ijmar-v2i1p101](https://doi.org/10.64137/3108-2637/ijmar-v2i1p101)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-09-01T14:10:27.703Z

### Resumo registrado

Software quality assurance is undergoing a structural transition from manually orchestrated verification toward continuously adaptive, data-driven assurance. Contemporary software systems evolve under tight release cadences, heterogeneous architectures, volatile workloads, and increasing security exposure, making uniform testing strategies economically unsustainable and technically inefficient. This paper develops a literature-grounded research framework for data-driven software quality assurance that integrates machine learning based risk prediction with intelligent test optimization. The central argument is that modern quality engineering should no longer treat defect prediction, regression testing, observability, and governance as separate activities. Instead, these capabilities should operate as a closed feedback system in which code, process, runtime, and business-context signals are fused to prioritize the highest-risk components and allocate testing effort dynamically. Building on prior work in software defect prediction, test prioritization, observability, AI governance, enterprise automation, and domain-specific intelligent systems, the paper proposes a multi-layer architecture that links feature engineering, risk scoring, test selection, feedback learning, and operational controls. It further shows that patterns demonstrated in cloud-native pharmacy, healthcare, manufacturing, finance, and cyber-physical settings provide transferable insights for software assurance, particularly around traceability, secure microservices, anomaly monitoring, and deployment optimization. The paper contributes a unified conceptual model, a risk-to-test prioritization formulation, an implementation-oriented pipeline, and a research agenda for robust, explainable, and operationally grounded machine learning in quality engineering. The framework is intended for practitioners and researchers seeking to improve defect discovery efficiency, reduce waste in testing, and align software verification with real delivery risk.

### Pontos importantes para leitura

- **Aborda:** propõe um framework conceitual de feedback fechado que une risco, priorização de testes, observabilidade e governança.
- **Importante:** reúne achados de contextos diferentes como padrões transferíveis, em vez de apresentar um experimento de QA completo.
- **Aplicação no QA Lab:** mapear como sinais de código, execução, produção e negócio poderiam orientar testes, mantendo explicabilidade.
- **Cautela:** proposta baseada em literatura; distinguir arquitetura recomendada de validação empírica do próprio framework.

---

## Data-Driven Test Case Prioritization (DD-TCP): A Machine Learning Framework for Intelligent Software Quality Assurance

- **Autores:** Hafiz Arslan Ramzan, K. Islam, Md Ahbab Hussain, Raiyan Muntasir Monim, Sabit Md Asad, Sadia Ramzan
- **Ano / data de publicação:** 2026 / 2026-01-01
- **Origem ou publicação:** Computers, Materials &amp; Continua
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-32604-cmc-2026-077782
- **DOI:** [https://doi.org/10.32604/cmc.2026.077782](https://doi.org/10.32604/cmc.2026.077782)
- **URL registrada:** [https://doi.org/10.32604/cmc.2026.077782](https://doi.org/10.32604/cmc.2026.077782)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-09-01T14:10:27.703Z

### Resumo registrado

: Regression testing of large-scale, data-intensive software systems demands efficient test-case prioritization strategies to detect faults early while minimizing computational cost. Conventional prioritization methods, such as coverage-based and risk-based approaches, lack adaptability to evolving project dynamics and fail to leverage the rich test-execution data accumulated over continuous integration cycles. This study presents a Data-Driven Test-Case Prioritization (DD-TCP) Framework that incorporates statistical and machine-learning techniques to model the relationship between test-case features and historical fault detection outcomes. The framework extracts multidimensional attributes including code-change frequency, dependency metrics, execution duration, and past failure density, which are normalized and embedded into a predictive ranking model based on gradient-boosted decision trees. Test cases are then dynamically reordered using a probabilistic gain function that maximizes early fault detection probability. Comprehensive simulations on representative open-source project datasets and synthetically generated large-scale test suites reveal that the proposed Data-Driven Test-Case Prioritization (DD-TCP) framework consistently achieves superior performance, yielding a 32.4% improvement in Average Percentage of Faults Detected (APFD) and a 27.1% reduction in execution overhead relative to baseline methods. The results demonstrate the feasibility of data-centric intelligence for scalable regression testing and provide an analytical foundation for integrating machine learning into next-generation Software Quality Assurance pipelines.

### Pontos importantes para leitura

- **Aborda:** ranqueia testes de regressão por mudança, dependências, duração e histórico de falhas com gradient-boosted trees.
- **Importante:** o resumo relata melhora de 32,4% em APFD e redução de 27,1% no custo de execução em simulações/datasets de projetos open source.
- **Aplicação no QA Lab:** exemplo para comparar priorização por dados históricos com seleção estática e risco manual.
- **Cautela:** avaliar estabilidade por projeto, custo de coleta de features e comportamento quando os dados históricos são escassos ou enviesados.

---

## Engineering Management for AI-Driven Software Quality Assurance: Practices, Challenges, and Future Direction

- **Autores:** Srinivas Reddy Kosna, Subba Rao Katragadda
- **Ano / data de publicação:** 2026 / 2026-02-20
- **Origem ou publicação:** SoutheastCon
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-1109-southeastcon63549-2026-11476717
- **DOI:** [https://doi.org/10.1109/SoutheastCon63549.2026.11476717](https://doi.org/10.1109/SoutheastCon63549.2026.11476717)
- **URL registrada:** [https://doi.org/10.1109/SoutheastCon63549.2026.11476717](https://doi.org/10.1109/SoutheastCon63549.2026.11476717)
- **Consulta que encontrou o registro:** software quality model
- **Data de descoberta:** 2026-08-15T22:37:48.767Z

### Resumo registrado

The integration of Artificial Intelligence (AI) into software systems has introduced unprecedented complexities and opportunities for quality assurance. This paper explores the evolving landscape of software quality engineering management in the age of AI. It examines the critical challenges and best practices for managing the quality of AI-driven software, from data acquisition to model deployment and maintenance. We present a comprehensive framework that synthesizes established software engineering principles with emerging machine learning (ML) development lifecycles. The paper analyzes key engineering management practices, including automated test generation, defect prediction, and continuous model validation, drawing on case studies and industry research. Furthermore, it discusses the future of AI in quality assurance, highlighting the potential of Large Language Models (LLMs) and knowledge graphs to enable more autonomous and intelligent testing paradigms. This paper aims to provide a valuable resource for engineering managers, QA professionals, and researchers navigating the transition to AI-centric software development.

### Pontos importantes para leitura

- **Aborda:** gestão da qualidade em sistemas com IA, desde dados e implantação até manutenção, geração de teste, previsão de defeitos e validação de modelos.
- **Importante:** trata governança, ciclos de vida de ML e colaboração entre engenharia e QA como partes da qualidade do produto.
- **Aplicação no QA Lab:** leitura de panorama para discutir TEVV, responsabilidades e operação de sistemas com modelos.
- **Cautela:** resumo de alto nível; não informa método detalhado nem evidência comparativa.

---

## Explainable AI-Driven Metrics for Transparent Software Quality Prediction

- **Autores:** Abdulaziz Attaallah, Khalil Al Sulbi
- **Ano / data de publicação:** 2026 / 2026-01-01
- **Origem ou publicação:** IEEE Access
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-1109-access-2026-3712592
- **DOI:** [https://doi.org/10.1109/ACCESS.2026.3712592](https://doi.org/10.1109/ACCESS.2026.3712592)
- **URL registrada:** [https://doi.org/10.1109/ACCESS.2026.3712592](https://doi.org/10.1109/ACCESS.2026.3712592)
- **Consulta que encontrou o registro:** software quality model
- **Data de descoberta:** 2026-08-15T22:37:48.767Z

### Resumo registrado

Accurate software quality prediction is critical for early defect identification and effective allocation of testing resources. Although machine learning (ML) and deep learning (DL) models have significantly improved defect prediction performance, their opaque nature limits transparency, interpretability, and practitioner trust. This study presents an Explainable Artificial Intelligence (XAI) driven framework for developing composite, transparent software quality metrics that integrate predictive accuracy with multi-level interpretability. The framework has been implemented and empirically validated using multiple real-world datasets. The framework combines static code metrics, process metrics, and developer activity metrics to construct robust defect prediction models using Random Forest, Gradient Boosted Trees (e.g., via the XGBoost implementation), Support Vector Machines (SVM), Logistic Regression, and attention-based Neural Networks. To enhance transparency, model agnostic explanation techniques, including SHAP and LIME, are integrated with in-model attention mechanisms to provide global and local explanations of predictions. Experiments conducted on PROMISE, open-source, and industrial datasets demonstrate that the proposed composite explainable metric achieves superior performance on the PROMISE (NASA-JM1) dataset, with the Gradient Boosted Trees model reaching an Accuracy of 0.85 and an AUC of 0.88, and consistently outperforms traditional and opaque baselines across the Eclipse JDT, Apache Commons, and Industrial datasets. Quantitative faithfulness analysis shows strong alignment between SHAP explanations and model behavior (Pearson’s r= 0.81). A controlled user study involving software developers reports a 14% improvement in decision accuracy and significantly higher confidence levels (p< 0.01) when using explainable metrics. The framework further incorporates interactive visual dashboards and textual summaries to support actionable decision-making during quality assurance processes. By bridging the gap between predictive performance and interpretability, this research demonstrates that explainability not only enhances trust but also improves the effectiveness of practical defect triage. The methodology provides a scalable and extensible foundation for transparent AI-driven software engineering tools.

### Pontos importantes para leitura

- **Aborda:** combina métricas estáticas, de processo e atividade de desenvolvedores com modelos preditivos e explicações SHAP/LIME.
- **Importante:** o resumo relata avaliação em PROMISE, Eclipse JDT, Apache Commons e dados industriais, além de estudo com desenvolvedores sobre decisões com métricas explicáveis.
- **Aplicação no QA Lab:** discutir explicabilidade como meio para questionar uma recomendação, não como prova de que o modelo está correto.
- **Cautela:** confirmar desenho do estudo com usuários, leakage entre projetos, métricas e validade externa.

---

## Intelligent automated code review and software quality evaluation: a survey of AutoML and large language model techniques

- **Autores:** Rohan Appasaheb Borgalli, Uma Raj, Shwetha Shetty
- **Ano / data de publicação:** 2026 / 2026-08-21
- **Origem ou publicação:** Automated Software Engineering
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-1007-s10515-026-00668-z
- **DOI:** [https://doi.org/10.1007/s10515-026-00668-z](https://doi.org/10.1007/s10515-026-00668-z)
- **URL registrada:** [https://doi.org/10.1007/s10515-026-00668-z](https://doi.org/10.1007/s10515-026-00668-z)
- **Consulta que encontrou o registro:** software maintainability reliability
- **Data de descoberta:** 2026-08-21T09:53:52.283Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Aborda:** pelo título, revisa AutoML e LLMs para revisão automática de código e avaliação de qualidade.
- **Importante:** o registro não tem resumo indexado, então não é possível resumir o escopo real ou as conclusões.
- **Aplicação no QA Lab:** manter como leitura pendente e confirmar se é revisão sistemática, narrativa ou proposta antes de usar como fonte.

---

## On the Factors in Quantum Software Quality

- **Autores:** Jianjun Zhao
- **Ano / data de publicação:** 2026 / 2026-08-31
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** arxiv-arxiv-org-abs-2609-29705v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2609.29705v1](http://arxiv.org/abs/2609.29705v1)
- **Consulta que encontrou o registro:** software quality model
- **Data de descoberta:** 2026-09-25T14:37:31.547Z

### Resumo registrado

As quantum computing evolves, the demand for high-quality quantum software is increasing. Classical software quality models, such as McCall's model, provide a useful foundation, but they do not explicitly capture distinctive properties of quantum software, including probabilistic measurement outcomes, backend-dependent behavior, and hybrid quantum-classical workflows. This paper proposes a base quality model for quantum software using McCall's factor-criterion-metric structure as the organizing backbone. It broadens the set of quality factors by drawing on representative classical software quality models and standards and introduces quantum-specific extensions only where needed. We define the resulting factor set and quality criteria, provide a many-to-many mapping of core factor-to-criterion relationships, discuss representative candidate metrics together with the execution, reference, and interpretation conditions needed to use them, and illustrate how the resulting model can be applied across the quantum software lifecycle. The model is intended as a common starting point for structuring, assessing, and communicating quality concerns in quantum software while supporting context-specific adaptation. Further expert feedback, case studies, and empirical studies can be used to evaluate and refine the model and its application across different quantum software contexts.

### Pontos importantes para leitura

- **Aborda:** propõe um modelo de qualidade para software quântico baseado na estrutura fator–critério–métrica de McCall.
- **Importante:** destaca características específicas do domínio — resultados probabilísticos, dependência de backend e fluxos híbridos — que modelos clássicos podem não representar diretamente.
- **Aplicação no QA Lab:** exemplo de adaptação de oráculos e critérios ao domínio; é especialização, não base obrigatória para QA geral.
- **Cautela:** o resumo recomenda avaliação futura por especialistas, estudos de caso e pesquisa empírica.

---

## Rethinking Software Quality Measurement: A Vision for AI-Assisted Triangulation in the Post-Metrics Era

- **Autores:** Jomar Thomas Almonte, Nathalia Moraes do Nascimento
- **Ano / data de publicação:** 2026 / 2026-07-05
- **Origem ou publicação:** SIGSOFT FSE Companion
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Modelos e métricas de qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-1145-3803437-3805580
- **DOI:** [https://doi.org/10.1145/3803437.3805580](https://doi.org/10.1145/3803437.3805580)
- **URL registrada:** [https://doi.org/10.1145/3803437.3805580](https://doi.org/10.1145/3803437.3805580)
- **Consulta que encontrou o registro:** software quality measurement
- **Data de descoberta:** 2026-08-15T22:37:48.767Z

### Resumo registrado

ISO/IEC 25010 defines eight product quality characteristics, yet after decades of research, a persistent gap remains between quality definitions and practical measurement. We argue this gap exists not because the problem is intractable, but because previous approaches relied primarily on structural metrics, which struggle to capture semantic dimensions of quality. This paper articulates a vision for closing this gap through triangulation: combining evolutionary signals from repository mining, semantic interpretation from LLM agents, and structural analysis from validated metrics. Central to this vision is a formalized concept: when signals disagree, the disagreement becomes a typed diagnostic signal, revealing not just uncertainty, but which quality dimension requires attention and what action is appropriate. We present an initial formalization of disagreement as calibrated, confidence-aware divergence across signals, an ISO mapping mechanism that combines rules with constrained LLM judgments and abstention, and a triangulation architecture that integrates with verification and repair workflows. Triangulation serves as a Verification-Repair substrate: an evidence layer that gates verification tasks and guides repair actions. If this vision succeeds, quality assessment transforms from opaque numbers to actionable, uncertainty-aware guidance.

### Pontos importantes para leitura

- **Aborda:** visão para combinar sinais de repositório, interpretação semântica por agentes LLM e métricas estruturais para avaliar qualidade.
- **Importante:** propõe usar a triangulação como camada de evidência que orienta verificação e reparo, declarando incerteza em vez de confiar em um número isolado.
- **Aplicação no QA Lab:** reforçar triangulação de evidências e limites de métricas compostas.
- **Cautela:** é uma visão/arquitetura proposta; o resumo não reporta uma validação que prove os ganhos projetados.

---

## Software quality assurance in the era of Agentic AI: a systematic mapping study

- **Autores:** Randa Ouaarous, Imane Hilal, Abdellatif Mezrioui
- **Ano / data de publicação:** 2026 / 2026-08-28
- **Origem ou publicação:** Frontiers of Computer Science
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-3389-fcomp-2026-1936730
- **DOI:** [https://doi.org/10.3389/fcomp.2026.1936730](https://doi.org/10.3389/fcomp.2026.1936730)
- **URL registrada:** [https://doi.org/10.3389/fcomp.2026.1936730](https://doi.org/10.3389/fcomp.2026.1936730)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-09-11T13:36:59.173Z

### Resumo registrado

The growing complexity of software systems has increased demand for intelligent solutions in Software Quality Assurance (SQA). Agentic Artificial Intelligence (AI) offers autonomous decision-making, adaptive behavior, and proactive quality improvement, yet its applications across SQA remain fragmented. This systematic mapping study examines Agentic AI integration in SQA, analyzing application distribution, agent characteristics, and supported stakeholder roles to identify coverage, trends, benefits, limitations, and gaps. Following systematic mapping protocols and PRISMA, five digital libraries were searched, retrieving 37 primary studies. Data were classified through frequency analysis and qualitative categorization aligned with Agentic AI behavior, architecture, and autonomy dimensions. Applications concentrate in Product Assurance, mainly test generation and defect management, with fewer studies in Process or Planning activities. Most agents exhibit goal-oriented or diagnostic behaviors, moderate autonomy, and hybrid or multi-agent architectures. Benefits include efficiency, accuracy, and maintainability improvements; limitations involve scalability, generalizability, and transparency. Role coverage focuses on execution-level stakeholders, while managerial and leadership roles receive minimal support. Agentic AI shows potential for strengthening SQA intelligence and adaptability but remains unevenly distributed across activities and roles. Transparency, validation, and leadership support are priority research gaps for developing trustworthy, process-aware Agentic systems across the full SQA lifecycle.

### Pontos importantes para leitura

- **Aborda:** mapeia onde agentes de IA aparecem no ciclo de SQA, quais papéis apoiam e quais lacunas permanecem.
- **Importante:** conclui que a aplicação é desigual e que transparência, validação e apoio de liderança são lacunas prioritárias.
- **Aplicação no QA Lab:** ajuda a tratar agentes como componentes com permissões, supervisão e critérios de avaliação ao longo do SDLC.

---

## Training Dynamics of Neural Software Defect Predictors under Coupled Data-Quality Issues

- **Autores:** Emmanuel Charleson Dapaah, Philip Makedonski, Jens Grabowski
- **Ano / data de publicação:** 2026 / 2026-06-23
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade
- **Identificador:** arxiv-arxiv-org-abs-2606-24968v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2606.24968v1](http://arxiv.org/abs/2606.24968v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Context: Software defect prediction supports maintenance decisions such as testing prioritization, release-risk assessment, and quality monitoring. However, metric-based SDP datasets often contain coupled data-quality issues, especially class imbalance and class overlap. Prior work has mainly measured their impact through endpoint performance, while recent evidence suggests that such issues may also appear in neural training dynamics (gradients, weights, biases, error trajectories). However, these studies examine issues in isolation, leaving open how internal neural network training patterns manifest when data quality issues are coupled. Objective: We investigate how training-dynamics patterns from class imbalance, overlap, and their coupling can be characterized under interaction-aware conditions in deep learning-based SDP. Method: We conduct a controlled intervention study on class-level UBD datasets, training a fixed MLP under imbalance-only, overlap-only, and joint conditions across five seeds. Training dynamics are logged per epoch; fidelity is monitored via coupling ratios. Patterns are characterized using effect sizes, trajectories, sensitivity analyses, and rule-based classification. Expected contribution: The study will produce an interaction-aware empirical protocol and a candidate taxonomy of training-dynamics patterns for coupled data-quality issues in metric-based SDP.

### Pontos importantes para leitura

- **Aborda:** planeja estudar como desequilíbrio de classes e sobreposição de classes se combinam e aparecem na dinâmica de treinamento de modelos de predição de defeitos.
- **Importante:** o resumo formula objetivo, protocolo e contribuição esperada; não apresenta resultados concluídos.
- **Aplicação no QA Lab:** alerta que qualidade dos dados influencia avaliação de modelos usados para priorizar teste e risco.
- **Cautela:** tratar como proposta de estudo/preprint até confirmar versão publicada e resultados.

---

## Enhancing Software Quality Assurance with an Adaptive Differential Evolution based Quantum Variational Autoencoder-Transformer Model

- **Autores:** Seshu Babu Barma, Mohanakrishnan Hariharan, Satish Arvapalli
- **Ano / data de publicação:** 2025 / 2025-03-20
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** arxiv-arxiv-org-abs-2503-16335v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2503.16335v1](http://arxiv.org/abs/2503.16335v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

An AI-powered quality engineering platform uses artificial intelligence to boost software quality assessments through automated defect prediction and optimized performance alongside improved feature extraction. Existing models result in difficulties addressing noisy data types together with imbalances, pattern recognition complexities, ineffective feature extraction, and generalization weaknesses. To overcome those existing challenges in this research, we develop a new model Adaptive Differential Evolution based Quantum Variational Autoencoder-Transformer Model (ADE-QVAET), that combines a Quantum Variational Autoencoder-Transformer (QVAET) to obtain high-dimensional latent features and maintain sequential dependencies together with contextual relationships, resulting in superior defect prediction accuracy. Adaptive Differential Evolution (ADE) Optimization utilizes an adaptive parameter tuning method that enhances model convergence and predictive performance. ADE-QVAET integrates advanced AI techniques to create a robust solution for scalable and accurate software defect prediction that represents a top-level AI-driven technology for quality engineering applications. The proposed ADE-QVAET model attains high accuracy, precision, recall, and f1-score during the training percentage (TP) 90 of 98.08%, 92.45%, 94.67%, and 98.12%.

### Pontos importantes para leitura

- **Aborda:** propõe ADE-QVAET, combinando autoencoder variacional quântico, Transformer e otimização diferencial para prever defeitos.
- **Importante:** o resumo informa métricas altas de treino, mas não apresenta no trecho disponível contexto suficiente para interpretar a configuração completa.
- **Aplicação no QA Lab:** caso para discutir comparação de modelos e por que métricas de treino isoladas não demonstram generalização.
- **Cautela:** preprint; exigir métricas em teste independente, baselines, validação cruzada e reprodutibilidade antes de confiar nos números.

---

## Industry Expectations and Skill Demands in Quantum Software Testing

- **Autores:** Ronnie de Souza Santos, Maria Teresa Baldassarre, Cesar França
- **Ano / data de publicação:** 2025 / 2025-12-16
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** IA/ML aplicada à qualidade; Fundamentos e métodos de teste
- **Identificador:** arxiv-arxiv-org-abs-2512-14861v2
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2512.14861v2](http://arxiv.org/abs/2512.14861v2)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Quantum software testing introduces new challenges that differ fundamentally from those in classical software engineering. Aims: This study investigates how the quantum software industry defines testing roles and what skills are expected from professionals in these positions. Method: We analyzed 110 job postings from organizations involved in quantum software and hardware development, identifying activities, competencies, and skill requirements related to testing. Results: The findings show that testing in quantum contexts combines traditional software quality assurance with experimental validation, emphasizing calibration, control, and hybrid quantum-classical verification. Employers seek professionals who integrate programming and automation expertise with quantum-specific technical knowledge and interdisciplinary collaboration skills. Conclusions: Quantum software testing remains at an early but rapidly evolving stage that bridges software engineering and experimental physics, highlighting the need for educational and research efforts that align testing practices with industrial realities.

### Pontos importantes para leitura

- **Aborda:** análise de 110 vagas em organizações de software/hardware quântico sobre tarefas e competências de teste.
- **Importante:** identifica mistura de QA tradicional com validação experimental, calibração e colaboração interdisciplinar.
- **Aplicação no QA Lab:** exemplo de pesquisa de mercado de nicho e adaptação de competências de QA ao domínio.
- **Cautela:** estudo de vagas em setor emergente e amostra específica; não generalizar para o mercado geral de QA.

---

