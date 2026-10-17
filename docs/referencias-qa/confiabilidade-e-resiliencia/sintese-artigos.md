# Síntese dos artigos: confiabilidade e resiliência

Sínteses baseadas nos resumos indexados, não em leitura integral. As alegações quantitativas devem ser conferidas na publicação e entendidas dentro dos datasets e protocolos usados.

## Deepfake-as-a-Service: Governance Frameworks, Software Quality Engineering, and Organizational Resilience in the Age of Synthetic Media

**Autores / origem:** Akanksha Raghvesh e Kiran Paul Kanikaram · versão aceita depositada no Zenodo, 2026 · [DOI](https://doi.org/10.5281/zenodo.22981865)

- **O que aborda:** Propõe o framework PROOF (proveniência, robustez, supervisão, observabilidade e auditabilidade forense) para verificar a integridade de dados humanos e sintéticos em pipelines distribuídos de IA.
- **O que importa:** Conecta qualidade de dados, segurança e governança a verificações de proveniência, testes de injeção e escalonamento para revisão humana.
- **Uso no roadmap:** Amplia a discussão de qualidade de IA para a qualidade dos dados de treinamento e para evidências ao longo da cadeia de fornecedores.
- **Cautela:** O resumo diz explicitamente que o framework ainda precisa de piloto e validação empírica; as estimativas de deepfakes não devem ser usadas como evidência independente sem checagem das fontes citadas.

## Toward trustworthy adaptive software reliability engineering: An explainable deep reinforcement learning framework

**Autores / origem:** Sudhakar Kambhampati e G. Vamsi Krishna · Ceylon Journal of Science, 2026 · [DOI](https://doi.org/10.4038/cjs.v55i4.9573)

- **O que aborda:** Apresenta o X-DRL-SRE, que combina estimativa de confiabilidade, reinforcement learning e explicações com SHAP, integrated gradients e contrafactuais.
- **O que importa:** O resumo relata experimentos em três datasets NASA e ganhos de índices de confiabilidade e esforço de teste frente a modelos de comparação, além de estabilidade das explicações.
- **Uso no roadmap:** Serve para discutir previsão de confiabilidade, explicabilidade e a necessidade de comparar com baselines claros.
- **Cautela:** Os resultados dependem dos datasets e desenho experimental descritos no artigo; não demonstram automaticamente melhoria em produto operacional ou domínio crítico.

## A Convex-Dependent NHPP Software Reliability Model and Its Deep-Learning-Based Parameter Estimation

**Autores / origem:** Youn Su Kim, In Hong Chang e Kwang Yoon Song · Mathematics, 2026 · [DOI](https://doi.org/10.3390/math14173176)

- **O que aborda:** Propõe um modelo NHPP de crescimento de confiabilidade cuja taxa de descoberta de falhas pode ter forma convexa e uma estratégia de estimação de parâmetros com deep learning.
- **O que importa:** Compara 13 modelos em três datasets; o resumo relata melhora preditiva em alguns datasets, mantendo a estrutura do modelo interpretável.
- **Uso no roadmap:** Ilustra como qualidade/reliability pode ser estimada a partir de dados de falha e por que comparar modelos e pressupostos importa.
- **Cautela:** O resultado é específico dos dados e da métrica adotada; previsões de falhas não substituem testes nem análise de risco do produto.

## Policy-Gated Firmware Trust and Anti-Rollback Resilience for Autonomous UAV Edge Platforms: A Formal Security and Software Validation

**Autor / origem:** Md Shahanur Islam Shagor · origem editorial não informada no registro, 2026 · [DOI](https://doi.org/10.21203/rs.3.rs-10812592/v1)

- **O que aborda:** Formaliza controles de firmware confiável e anti-rollback para UAVs, incluindo versão, assinatura, medição de imagem e estado persistido; descreve testes nativos de aceitação e rejeição.
- **O que importa:** Expõe duas dependências críticas: integridade do contador persistido e diferença entre alegações de secure boot e evidência medida no hardware.
- **Uso no roadmap:** Exemplo concreto de invariantes, estados fail-closed, validação de segurança e limites de teste sem hardware confiável.
- **Cautela:** O resumo declara dependências de hardware que ainda são pressupostos; confirme a publicação e a implementação antes de generalizar os resultados.

## DSC‐SRGM: A Deep Synthetic Cross‐Project Software Reliability Growth Model

**Autores / origem:** Taehyoun Kim, Duksan Ryu e Jongmoon Baik · Software Testing, Verification and Reliability, 2026 · [DOI](https://doi.org/10.1002/stvr.70028)

- **O que aborda:** Gera dados sintéticos com modelos clássicos de crescimento de confiabilidade, seleciona padrões semelhantes ao projeto-alvo e usa transferência entre projetos para prever descoberta de defeitos.
- **O que importa:** Avalia 60 datasets e o resumo relata ganhos frente às abordagens comparadas, mas também mostra que excesso ou mistura ingênua de dados sintéticos pode piorar a previsão.
- **Uso no roadmap:** Caso útil para qualidade de dados de teste, transferência de aprendizado e validação de dados sintéticos.
- **Cautela:** Percentuais de melhoria dependem das métricas, baselines e datasets específicos do artigo; examinar protocolo e replicação antes de os citar.

## Software Reliability and Availability Testing of a Kubernetes Cluster

**Autor / origem:** Myron Hecht · Reliability and Maintainability Symposium, 2026 · [DOI](https://doi.org/10.1109/RAMS50514.2026.11424466)

- **O que aborda:** Usa testes de falha com LitmusChaos em um sistema de processamento sobre Kubernetes; mede tempo e probabilidade de recuperação para alimentar um modelo de disponibilidade e confiabilidade.
- **O que importa:** Mostra como testar sistemas parcialmente implementados e usar dados de recuperação para comparar decisões de redundância antes do produto estar completo.
- **Uso no roadmap:** Dá contexto prático para chaos testing autorizado, recuperação observável, disponibilidade e decisão arquitetural baseada em evidência.
- **Cautela:** O caso é um sistema e ambiente específicos; não transportar os números para outros clusters sem repetir a medição.
