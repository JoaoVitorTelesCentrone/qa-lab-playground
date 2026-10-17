# Dossiê completo: Confiabilidade e resiliência

**6 registros.** Este arquivo reúne os metadados disponíveis na biblioteca local, o resumo/abstract registrado e os pontos importantes da síntese editorial de cada trabalho. Os resumos permanecem na língua e na forma em que foram indexados; ausência de resumo ou de metadados é indicada explicitamente.

Snapshot dos metadados: **2026-09-29T15:55:26.540Z**. Classificação do tópico e tipo de registro são editoriais; confira a fonte primária antes de citar ou aplicar resultados.

[Voltar às referências da pasta](./README.md) · [Resumo geral de toda a biblioteca](../../RESUMO_GERAL_ARTIGOS_QA.md) · [Síntese dos pontos importantes](./sintese-artigos.md)

## A Convex-Dependent NHPP Software Reliability Model and Its Deep-Learning-Based Parameter Estimation

- **Autores:** Youn Su Kim, In Hong Chang, Kwang Yoon Song
- **Ano / data de publicação:** 2026 / 2026-09-03
- **Origem ou publicação:** Mathematics
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Confiabilidade e resiliência
- **Identificador:** doi-doi-org-10-3390-math14173176
- **DOI:** [https://doi.org/10.3390/math14173176](https://doi.org/10.3390/math14173176)
- **URL registrada:** [https://doi.org/10.3390/math14173176](https://doi.org/10.3390/math14173176)
- **Consulta que encontrou o registro:** software maintainability reliability
- **Data de descoberta:** 2026-09-03T13:37:01.166Z

### Resumo registrado

Many software systems currently under development exhibit numerous new types of failure due to their structural complexity. This suggests the need for research on structures capable of representing convex patterns in the fault-detection rate over time. This paper proposes a non-homogeneous Poisson process (NHPP) software reliability model (SRM) incorporating a convex fault-detection rate. To validate this, we compared 13 SRMs with different forms using three datasets to evaluate the effectiveness and applicability of the proposed model. Furthermore, the performance of the proposed model was evaluated through comparisons with multiple models, and a deep-learning-based parameter estimation (DL-BPE) was introduced as an alternative estimation framework. The proposed DL-BPE provides a competitive and flexible parameter estimation framework, showing improved predictive performance in several datasets while preserving the structural interpretability of the proposed NHPP SRM. Based on the results, we propose new assumptions for enhancing the reliability of increasingly complex software packages. The DL-BPE framework may provide a basis for integrating interpretable reliability-model structures into deep-learning architectures for software reliability analysis.

### Pontos importantes para leitura

**Autores / origem:** Youn Su Kim, In Hong Chang e Kwang Yoon Song · Mathematics, 2026 · [DOI](https://doi.org/10.3390/math14173176)

- **O que aborda:** Propõe um modelo NHPP de crescimento de confiabilidade cuja taxa de descoberta de falhas pode ter forma convexa e uma estratégia de estimação de parâmetros com deep learning.
- **O que importa:** Compara 13 modelos em três datasets; o resumo relata melhora preditiva em alguns datasets, mantendo a estrutura do modelo interpretável.
- **Uso no roadmap:** Ilustra como qualidade/reliability pode ser estimada a partir de dados de falha e por que comparar modelos e pressupostos importa.
- **Cautela:** O resultado é específico dos dados e da métrica adotada; previsões de falhas não substituem testes nem análise de risco do produto.

---

## Deepfake-as-a-Service: Governance Frameworks, Software Quality Engineering, and Organizational Resilience in the Age of Synthetic Media

- **Autores:** Akanksha Raghvesh, Kiran Paul Kanikaram
- **Ano / data de publicação:** 2026 / 2026-09-26
- **Origem ou publicação:** Zenodo (CERN European Organization for Nuclear Research)
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Relatório ou depósito em repositório
- **Tópicos atribuídos:** Confiabilidade e resiliência; Segurança e validação de sistemas; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-5281-zenodo-22981865
- **DOI:** [https://doi.org/10.5281/zenodo.22981865](https://doi.org/10.5281/zenodo.22981865)
- **URL registrada:** [https://doi.org/10.5281/zenodo.22981865](https://doi.org/10.5281/zenodo.22981865)
- **Consulta que encontrou o registro:** software quality model
- **Data de descoberta:** 2026-09-27T14:42:51.773Z

### Resumo registrado

*** PREPRINT / AUTHOR-ACCEPTED VERSION ***This paper was presented at the conference and is the author-accepted camera-ready version. It is posted here for self-archiving purposes in accordance with the IEEE Author Posting Policy prior to official publication and indexing in IEEE Xplore. Abstract—Deepfake-as-a-Service (DaaS) has matured from a real-time impersonation threat into an upstream data-integrity threat that reaches directly into the training pipelines of collaborative and federated AI systems. This paper extends prior work on DaaS as a cybersecurity and Software Quality Engineering (SQE) problem to the distributed machine-learning (ML) setting, where synthetic audio, video, and image content generated by commercial DaaS infrastructure can be ingested — deliberately or incidentally — as training or fine-tuning data by multi-party model-development pipelines. We report the trajectory of DaaS-enabled activity, with circulating deepfake files rising from approximately 500,000 in 2023 to approximately 8 million in 2025, and document how the same commercial infrastructure that enabled the $25.6 million Arup deepfake-video fraud can be repurposed to poison collaborative training corpora with unverified synthetic identities. Building on COBIT 2019 (Control Objectives for Information and Related Technology), the NIST AI Risk Management Framework, and Risk-Based Quality Engineering (RBQE) principles, we introduce the PROOF Framework — Provenance, Robustness, Oversight, Observability, and Forensic auditability — a five-pillar auditing methodology purpose-built for verifying the integrity of synthetic and human-sourced training data as it moves through distributed, multi-vendor ML pipelines. Our contributions are: (1) a vendor and pipeline risk-assessment checklist for DaaS and collaborative-AI data sources mapped to COBIT 2019 and NIST AI RMF control references; (2) an operational instantiation of the PROOF Framework combining security-injection testing, Zero Trust content verification, and Human-in-the-Loop (HITL) escalation logic for distributed pipeline auditing; (3) practitioner guidance for governance, risk, compliance, and software-engineering teams operating collaborative AI systems across jurisdictions; and (4) an explicit validation roadmap, presented in Section VI-F, defining the pilot-study design, benchmark datasets, and success metrics through which future work will empirically evaluate the framework, since the contributions above are presented at the methodological and architectural level rather than as a deployed implementation.

### Pontos importantes para leitura

**Autores / origem:** Akanksha Raghvesh e Kiran Paul Kanikaram · versão aceita depositada no Zenodo, 2026 · [DOI](https://doi.org/10.5281/zenodo.22981865)

- **O que aborda:** Propõe o framework PROOF (proveniência, robustez, supervisão, observabilidade e auditabilidade forense) para verificar a integridade de dados humanos e sintéticos em pipelines distribuídos de IA.
- **O que importa:** Conecta qualidade de dados, segurança e governança a verificações de proveniência, testes de injeção e escalonamento para revisão humana.
- **Uso no roadmap:** Amplia a discussão de qualidade de IA para a qualidade dos dados de treinamento e para evidências ao longo da cadeia de fornecedores.
- **Cautela:** O resumo diz explicitamente que o framework ainda precisa de piloto e validação empírica; as estimativas de deepfakes não devem ser usadas como evidência independente sem checagem das fontes citadas.

---

## DSC‐SRGM: A Deep Synthetic Cross‐Project Software Reliability Growth Model

- **Autores:** Taehyoun Kim, Duksan Ryu, Jongmoon Baik
- **Ano / data de publicação:** 2026 / 2026-08-17
- **Origem ou publicação:** Software Testing, Verification and Reliability
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Confiabilidade e resiliência
- **Identificador:** doi-doi-org-10-1002-stvr-70028
- **DOI:** [https://doi.org/10.1002/stvr.70028](https://doi.org/10.1002/stvr.70028)
- **URL registrada:** [https://doi.org/10.1002/stvr.70028](https://doi.org/10.1002/stvr.70028)
- **Consulta que encontrou o registro:** software maintainability reliability
- **Data de descoberta:** 2026-08-17T09:59:29.667Z

### Resumo registrado

ABSTRACT Software reliability growth models (SRGMs) are widely used to predict software reliability based on defect discovery data collected during testing or operational phases. However, their predictive accuracy often degrades in data‐scarce environments, such as early‐stage testing or safety‐critical systems. Although cross‐project transfer learning has been explored to mitigate this issue by leveraging data from past projects, its applicability remains limited due to the scarcity and confidentiality of real‐world datasets. To overcome these limitations, we propose deep synthetic cross‐project SRGM (DSC‐SRGM), a novel approach that integrates synthetic data generation with cross‐project transfer learning. Synthetic datasets are generated using widely validated traditional SRGMs to represent defect discovery trends. A cross‐correlation‐based clustering method is applied to identify synthetic datasets with patterns similar to the target project. These datasets are then used to train a deep learning model for reliability prediction. The proposed method is evaluated on 60 real‐world datasets, and its performance is compared with both traditional SRGMs and cross‐project deep learning models trained on real‐world datasets. DSC‐SRGM achieves improvements of up to 98.3% over traditional SRGMs and up to 41.3% over cross‐project deep learning models trained on real‐world datasets across evaluation metrics. However, excessive use of synthetic data or a naive combination of synthetic and real‐world data may degrade prediction performance, highlighting the importance of maintaining an appropriate data balance. These findings indicate that DSC‐SRGM is a promising approach for software reliability prediction in data‐scarce environments.

### Pontos importantes para leitura

**Autores / origem:** Taehyoun Kim, Duksan Ryu e Jongmoon Baik · Software Testing, Verification and Reliability, 2026 · [DOI](https://doi.org/10.1002/stvr.70028)

- **O que aborda:** Gera dados sintéticos com modelos clássicos de crescimento de confiabilidade, seleciona padrões semelhantes ao projeto-alvo e usa transferência entre projetos para prever descoberta de defeitos.
- **O que importa:** Avalia 60 datasets e o resumo relata ganhos frente às abordagens comparadas, mas também mostra que excesso ou mistura ingênua de dados sintéticos pode piorar a previsão.
- **Uso no roadmap:** Caso útil para qualidade de dados de teste, transferência de aprendizado e validação de dados sintéticos.
- **Cautela:** Percentuais de melhoria dependem das métricas, baselines e datasets específicos do artigo; examinar protocolo e replicação antes de os citar.

---

## Policy-Gated Firmware Trust and Anti-Rollback Resilience for Autonomous UAV Edge Platforms: A Formal Security and Software Validation

- **Autores:** Md Shahanur Islam Shagor
- **Ano / data de publicação:** 2026 / 2026-08-26
- **Origem ou publicação:** não informado
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Confiabilidade e resiliência; Segurança e validação de sistemas
- **Identificador:** doi-doi-org-10-21203-rs-3-rs-10812592-v1
- **DOI:** [https://doi.org/10.21203/rs.3.rs-10812592/v1](https://doi.org/10.21203/rs.3.rs-10812592/v1)
- **URL registrada:** [https://doi.org/10.21203/rs.3.rs-10812592/v1](https://doi.org/10.21203/rs.3.rs-10812592/v1)
- **Consulta que encontrou o registro:** software product quality
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Abstract Autonomous unmanned aerial vehicles (UAVs) increasingly rely on software-defined sensing, estimation, networking, and decision pipelines, making firmware integrity a prerequisite for trustworthy autonomy. A compromised or downgraded firmware image can silently alter safety constraints, navigation logic, command authorization, or telemetry behavior even when higher-layer cryptographic communication remains intact. This paper studies a policy-gated firmware trust mechanism implemented in an open GPS-denied UAV swarm research platform and develops a formal model for its anti-rollback and fail-closed properties. The implementation represents each firmware image through a manifest containing semantic version, measurement, signer, keyed-digest field, secure-boot claim, bootloader-lock claim, and monotonic rollback counter. Field and production profiles require secure-boot and bootloader predicates, non-regression of both version and rollback counter, trusted signer membership, keyed manifest integrity, and an admissible firmware measurement before node startup is permitted. Accepted state is persisted only after validation. The paper formalizes these predicates, derives monotonicity and rejection properties, maps threat classes to enforcement paths, and distinguishes source-verified behavior from assumptions that require a hardware root of trust. Repository evidence includes a registered native boot-trust test target with cases for trusted production acceptance, rollback rejection, and unauthorized maintenance rejection; the repository validation report records the native test suite as green at the studied commit. The analysis also exposes two important trust-boundary conditions: rollback protection depends on integrity of the persistent state record, and current secure-boot/bootloader values are externally supplied claims rather than independently measured hardware evidence. The result is a reproducible software-level firmware resilience baseline and a precise roadmap toward hardware-backed attestation.

### Pontos importantes para leitura

**Autor / origem:** Md Shahanur Islam Shagor · origem editorial não informada no registro, 2026 · [DOI](https://doi.org/10.21203/rs.3.rs-10812592/v1)

- **O que aborda:** Formaliza controles de firmware confiável e anti-rollback para UAVs, incluindo versão, assinatura, medição de imagem e estado persistido; descreve testes nativos de aceitação e rejeição.
- **O que importa:** Expõe duas dependências críticas: integridade do contador persistido e diferença entre alegações de secure boot e evidência medida no hardware.
- **Uso no roadmap:** Exemplo concreto de invariantes, estados fail-closed, validação de segurança e limites de teste sem hardware confiável.
- **Cautela:** O resumo declara dependências de hardware que ainda são pressupostos; confirme a publicação e a implementação antes de generalizar os resultados.

---

## Software Reliability and Availability Testing of a Kubernetes Cluster

- **Autores:** Myron Hecht
- **Ano / data de publicação:** 2026 / 2026-01-26
- **Origem ou publicação:** Reliability and Maintainability Symposium
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Confiabilidade e resiliência; Fundamentos e métodos de teste
- **Identificador:** doi-doi-org-10-1109-rams50514-2026-11424466
- **DOI:** [https://doi.org/10.1109/RAMS50514.2026.11424466](https://doi.org/10.1109/RAMS50514.2026.11424466)
- **URL registrada:** [https://doi.org/10.1109/RAMS50514.2026.11424466](https://doi.org/10.1109/RAMS50514.2026.11424466)
- **Consulta que encontrou o registro:** software maintainability reliability
- **Data de descoberta:** 2026-08-21T09:53:52.283Z

### Resumo registrado

SUMMARY & CONCLUSIONSThis paper describes the testing of a real time data processing system built on Kubernetes, the most common orchestration (system management) platform for containerized architectures. The testing was performed using the LitmusChaos failure simulation testing framework and resulted in measurements on recovery time and recovery probability that were used as inputs to a model for predicting system reliability and availability. Systems built on Kubernetes can be developed incrementally so that executable systems with partial functionality can be tested to get early feedback on system reliability and availability performance.The innovation in this work is a data-driven testing and analysis approach for containerized architectures that enables better design decisions. As an example, the work here describes how the benefits of additional redundancy on system availability could be assessed using data gathered from early testing, which, in turn, was enabled by containerized architectures and Kubernetes clusters. These constructs facilitate incremental development and Continuous Integration/Continuous Deployment (CI/CD) thereby enabling early testing and measurement of recovery rates and probabilities. This testing can continue throughout the software development process and the results can be incorporated into the model.

### Pontos importantes para leitura

**Autor / origem:** Myron Hecht · Reliability and Maintainability Symposium, 2026 · [DOI](https://doi.org/10.1109/RAMS50514.2026.11424466)

- **O que aborda:** Usa testes de falha com LitmusChaos em um sistema de processamento sobre Kubernetes; mede tempo e probabilidade de recuperação para alimentar um modelo de disponibilidade e confiabilidade.
- **O que importa:** Mostra como testar sistemas parcialmente implementados e usar dados de recuperação para comparar decisões de redundância antes do produto estar completo.
- **Uso no roadmap:** Dá contexto prático para chaos testing autorizado, recuperação observável, disponibilidade e decisão arquitetural baseada em evidência.
- **Cautela:** O caso é um sistema e ambiente específicos; não transportar os números para outros clusters sem repetir a medição.

---

## Toward trustworthy adaptive software reliability engineering: An explainable deep reinforcement learning framework

- **Autores:** Sudhakar Kambhampati, G. Vamsi Krishna
- **Ano / data de publicação:** 2026 / 2026-09-08
- **Origem ou publicação:** Ceylon Journal of Science
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Confiabilidade e resiliência
- **Identificador:** doi-doi-org-10-4038-cjs-v55i4-9573
- **DOI:** [https://doi.org/10.4038/cjs.v55i4.9573](https://doi.org/10.4038/cjs.v55i4.9573)
- **URL registrada:** [https://doi.org/10.4038/cjs.v55i4.9573](https://doi.org/10.4038/cjs.v55i4.9573)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-09-08T13:39:55.647Z

### Resumo registrado

Ensuring the dependable operation of modern software systems under dynamic and non-stationary operating conditions remains a major challenge in software reliability engineering. Although recent deep reinforcement learning (DRL)-based approaches have demonstrated promising capabilities for closed-loop adaptation of software reliability and testing effort, their black-box nature limits transparency, trustworthiness, and adoption in mission-critical and regulated domains. To address this limitation, we propose X-DRL-SRE, an explainable deep reinforcement learning framework for adaptive software reliability engineering. The framework integrates dynamic operational profile learning, level-wise reliability estimation, and a Proximal Policy Optimization (PPO)-based DRL agent with an explainability module that provides state-, action-, and outcome-level interpretations of reliability control decisions. Explainability is achieved through SHAP-based feature attribution for operational and code-level metrics, integrated gradients for policy sensitivity analysis, and counterfactual reasoning to justify testing effort reallocation under changing operational profiles. The proposed framework was evaluated using repeated stratified 10-fold cross-validation on NASA software defect benchmark datasets, including JM1, KC1, and PC1. Experimental results demonstrate that X-DRL-SRE improves reliability indices by 11.8–15.6% and reduces testing effort by 13.2–18.4% compared with LCSR-OPE, ML-ER-OPE, and non-explainable DRL baselines. Statistical significance was confirmed using paired t-tests and Wilcoxon signed-rank tests (p < 0.01), with medium-to-large effect sizes (Cohen’s d = 0.62–0.89). Furthermore, explanation stability scores exceeding 0.85 indicate that the generated explanations are reliable and consistent without compromising optimization performance. These findings demonstrate that explainability can be effectively integrated into adaptive reliability control, enabling transparent, interpretable, and high-performing software reliability engineering.

### Pontos importantes para leitura

**Autores / origem:** Sudhakar Kambhampati e G. Vamsi Krishna · Ceylon Journal of Science, 2026 · [DOI](https://doi.org/10.4038/cjs.v55i4.9573)

- **O que aborda:** Apresenta o X-DRL-SRE, que combina estimativa de confiabilidade, reinforcement learning e explicações com SHAP, integrated gradients e contrafactuais.
- **O que importa:** O resumo relata experimentos em três datasets NASA e ganhos de índices de confiabilidade e esforço de teste frente a modelos de comparação, além de estabilidade das explicações.
- **Uso no roadmap:** Serve para discutir previsão de confiabilidade, explicabilidade e a necessidade de comparar com baselines claros.
- **Cautela:** Os resultados dependem dos datasets e desenho experimental descritos no artigo; não demonstram automaticamente melhoria em produto operacional ou domínio crítico.

---

