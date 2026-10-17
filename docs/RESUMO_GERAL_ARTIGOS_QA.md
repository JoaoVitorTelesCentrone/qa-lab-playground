# Resumo geral da biblioteca de artigos e referências de QA

Este documento reúne a leitura transversal e as sínteses artigo por artigo dos **145 registros** catalogados no QA Lab. Snapshot dos metadados: **2026-09-29T15:55:26.540Z**.

A biblioteca mistura artigos de periódicos e conferências, preprints, estudos depositados em repositórios, datasets, pacotes de replicação, normas e guias profissionais. O status de revisão por pares não foi auditado individualmente. As conclusões resumidas abaixo refletem o que os registros e resumos disponíveis reportam; não são uma revisão sistemática independente nem validação dos resultados.

## Visão geral do acervo

O acervo tem **145 itens distribuídos em 9 pastas**. A pasta de predição/localização de defeitos reúne 67 registros e concentra quase metade do material; portanto, a distribuição não representa um equilíbrio entre áreas de QA.

| Área | Registros | Dossiê |
| --- | ---: | --- |
| Automação e geração/priorização de testes | 6 | [Abrir dossiê](./referencias-qa/automacao-e-geracao-priorizacao-de-testes/dossie-completo.md) |
| Confiabilidade e resiliência | 6 | [Abrir dossiê](./referencias-qa/confiabilidade-e-resiliencia/dossie-completo.md) |
| Fundamentos e métodos de teste | 7 | [Abrir dossiê](./referencias-qa/fundamentos-e-metodos-de-teste/dossie-completo.md) |
| Garantia e engenharia de qualidade | 16 | [Abrir dossiê](./referencias-qa/garantia-e-engenharia-de-qualidade/dossie-completo.md) |
| IA/ML aplicada à qualidade | 20 | [Abrir dossiê](./referencias-qa/ia-ml-aplicada-a-qualidade/dossie-completo.md) |
| Modelos e métricas de qualidade | 14 | [Abrir dossiê](./referencias-qa/modelos-e-metricas-de-qualidade/dossie-completo.md) |
| Predição e localização de defeitos | 67 | [Abrir dossiê](./referencias-qa/predicao-e-localizacao-de-defeitos/dossie-completo.md) |
| Processos, requisitos e formação em QA | 8 | [Abrir dossiê](./referencias-qa/processos-requisitos-e-formacao-em-qa/dossie-completo.md) |
| Segurança e validação de sistemas | 1 | [Abrir dossiê](./referencias-qa/seguranca-e-validacao-de-sistemas/dossie-completo.md) |

## Síntese transversal

### 1. Qualidade depende de contexto e evidência

Modelos e normas oferecem vocabulário comum para atributos como adequação funcional, confiabilidade, usabilidade, eficiência, segurança e manutenibilidade. A aplicação prática exige escolher atributos relevantes ao domínio, convertê-los em critérios observáveis e registrar instrumento, amostra, pesos e limites. Uma pontuação agregada sem esses detalhes pode esconder diferenças importantes.

### 2. Dados e desenho experimental determinam a confiança nos resultados

Nos estudos de IA/ML e previsão de defeitos, reaparecem desbalanceamento, ruído de rótulo, atributos redundantes, datasets envelhecidos, mudança entre projetos/versões e risco de vazamento entre treino e teste. Acurácia isolada é insuficiente; recall, F1, MCC, calibração, esforço de inspeção, estabilidade e validação externa respondem a perguntas distintas. Comparações devem manter divisões e pré-processamento justos.

### 3. Automação e IA são apoio ao trabalho de qualidade

Geração/priorização de testes, embeddings, modelos generativos, redes em grafo e explicações podem acelerar análise e orientar atenção. A utilidade depende de oráculos confiáveis, manutenção, custo, integração ao fluxo e revisão humana. Propostas de arquitetura e resultados de benchmark devem ser distinguidos de evidência de uso em produção.

### 4. Prevenção envolve requisitos, processo e aprendizagem

A clareza de requisitos, a validação contínua, os critérios de aceite e o feedback ao longo do ciclo reduzem ambiguidades que chegam aos testes. Práticas ágeis e DevOps ajudam a aproximar qualidade do desenvolvimento, mas métricas de processo precisam ser interpretadas como sinais do sistema, não como medida isolada de qualidade ou desempenho individual.

### 5. Sistemas críticos pedem validação proporcional ao risco

Segurança, confiabilidade e resiliência requerem rastreabilidade, cenários de falha, verificação independente e evidências reproduzíveis. O número de registros na pasta de segurança é pequeno e parte deles não tem resumo disponível; as recomendações dessa área precisam ser confirmadas nas fontes integrais.

## Leitura por área e síntese de cada registro

As seções seguintes preservam a síntese individual de cada trabalho. Abra os títulos para ir à fonte registrada; o dossiê da pasta inclui metadados completos e o abstract disponível.

### Automação e geração/priorização de testes (6)

A automação aparece como forma de ampliar cobertura e acelerar feedback. Para julgar uma técnica, acompanhar manutenção dos testes, qualidade dos oráculos, custo de execução e comparação com uma linha de base realista.

[Dossiê completo da pasta](./referencias-qa/automacao-e-geracao-priorizacao-de-testes/dossie-completo.md) · [Índice de referências](./referencias-qa/automacao-e-geracao-priorizacao-de-testes/README.md)

#### [AI-Driven Autonomous Test Automation Frameworks for Cloud Native Applications: Improving Software Reliability and Continuous Delivery](https://doi.org/10.60087/jaigs.v10i01.495)

**2026 · Journal of Artificial Intelligence General science (JAIGS) ISSN:3006-4023 · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autor / origem:** Ihor Diakonov · Journal of Artificial Intelligence General Science, 2026 · [DOI](https://doi.org/10.60087/jaigs.v10i01.495)

- **O que aborda:** Apresenta o AutoQA CN: geração de testes a partir de APIs e uso, reparo de scripts e priorização de execução por risco com reinforcement learning.
- **O que importa:** O resumo relata um estudo ilustrativo em três cenários de microsserviços, com redução de esforço de manutenção, detecção mais rápida e ganho modesto de throughput frente a scripts convencionais.
- **Uso no roadmap:** Serve para discutir automação adaptativa, mas reforça a necessidade de comparar custo de manutenção, tempo de detecção e throughput.
- **Cautela:** O resumo não detalha tamanho da amostra, protocolo ou significância; os ganhos são alegações do estudo, não uma garantia para outros produtos.

#### [AI-Powered Test Automation Frameworks for Next-Generation Software Quality Engineering](https://doi.org/10.37547/tajet/volume08issue08-03)

**2026 · The American Journal of Engineering and Technology · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autor / origem:** Tomas Kazlauskas · The American Journal of Engineering and Technology, 2026 · [DOI](https://doi.org/10.37547/tajet/volume08issue08-03)

- **O que aborda:** Propõe um framework conceitual para selecionar, priorizar, executar e classificar testes de regressão em pipelines Agile, usando histórico de resultados e impacto de mudanças.
- **O que importa:** O próprio resumo observa que parte importante da literatura usada vem de processamento de sinais biomédicos, como evidência metodológica transferível, e não de validação direta em projetos de software.
- **Uso no roadmap:** Bom caso para ensinar a separar hipótese e arquitetura proposta de evidência empírica específica de QA.
- **Cautela:** Não tratar a avaliação conceitual como prova de redução de regressão em produção; o resumo lista drift, poucos dados, explicabilidade e integração como riscos.

#### [Artificial Intelligence-Based Test Automation Frameworks for Next-Generation Software Quality Engineering](https://doi.org/10.37547/ajast/volume06issue08-07)

**2026 · American Journal Of Applied Science And Technology · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autora / origem:** Priyanka Sharma · American Journal of Applied Science and Technology, 2026 · [DOI](https://doi.org/10.37547/ajast/volume06issue08-07)

- **O que aborda:** Organiza uma arquitetura conceitual em interpretação de requisitos, modelagem semântica, geração adaptativa, execução/manutenção e previsão de risco.
- **O que importa:** Defende uma automação centrada em pessoas, com representações explicáveis e feedback contínuo; reconhece ambiguidade semântica, confiabilidade do modelo e falta de critérios universais.
- **Uso no roadmap:** Ajuda a discutir onde a IA pode apoiar o fluxo sem apagar a responsabilidade pelo oráculo, pelos dados e pela aprovação do teste.
- **Cautela:** É uma síntese conceitual, não demonstração de que as cinco capacidades foram implantadas e medidas em um produto real.

#### [Artificial Intelligence-Driven Software Test Automation: A Comprehensive Survey](https://doi.org/10.54254/2755-2721/2026.ld36950)

**2026 · Applied and Computational Engineering · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autor / origem:** Jiale Chen · Applied and Computational Engineering, 2026 · [DOI](https://doi.org/10.54254/2755-2721/2026.ld36950)

- **O que aborda:** Revisa geração de casos e detecção de defeitos com IA, incluindo engenharia de prompt, RAG, fine-tuning e agentes, além de comparar abordagens de deep learning e LLMs.
- **O que importa:** Destaca alucinação, critérios de avaliação, interpretabilidade e generalização como limitações. A tese central é usar LLMs como apoio à decisão do QA, não como substituto da avaliação humana.
- **Uso no roadmap:** Complementa a semana de IA: cenários gerados precisam de oráculo, revisão e métricas próprias antes de entrar na suíte.
- **Cautela:** O registro é uma revisão; a qualidade e a cobertura dos estudos incluídos precisam ser verificadas no texto integral.

#### [Automated Testing Tools and Software Reliability: A Systematic Mapping](https://doi.org/10.15439/2026f0950)

**2026 · Annals of Computer Science and Information Systems · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autores / origem:** Artur Santos de Farias, Rodrigo Rocha e Jamilson Ramalho Dantas · Annals of Computer Science and Information Systems, 2026 · [DOI](https://doi.org/10.15439/2026f0950)

- **O que aborda:** Mapeia 184 estudos primários sobre como ferramentas de teste automatizado contribuem para cobertura estrutural, detecção de falhas, robustez sob estresse e consistência entre plataformas.
- **O que importa:** A contribuição prática é uma matriz que relaciona ferramentas a atributos de confiabilidade e a evidências dos estudos; não sugere que uma ferramenta única cubra todos os objetivos.
- **Uso no roadmap:** Apoia a escolha de automação por risco e pela pergunta de qualidade, em vez de popularidade do framework.
- **Cautela:** O resumo não enumera as ferramentas nem a qualidade de cada estudo incluído; consulte o artigo antes de recomendar ferramenta específica.

#### [Machine Learning-Driven Test Automation for Continuous Software Quality Engineering](https://doi.org/10.55640/ijdsml-06-02-04)

**2026 · International journal of data science and machine learning. · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autor / origem:** Chinedu Okafor · International Journal of Data Science and Machine Learning, 2026 · [DOI](https://doi.org/10.55640/ijdsml-06-02-04)

- **O que aborda:** Propõe integrar aprendizado de máquina à geração e priorização de testes, previsão de defeitos, classificação de falhas e feedback contínuo.
- **O que importa:** O resumo informa que várias ideias metodológicas vêm de previsão do tempo, radar e imagens médicas, sendo transferidas para QE. Também aponta drift, falta de dados representativos, falsos positivos e custo computacional.
- **Uso no roadmap:** Reforça a distinção entre técnicas potencialmente transferíveis e evidência validada em teste de software.
- **Cautela:** O resumo não descreve avaliação direta suficiente para concluir eficácia operacional em CI/CD.


### Confiabilidade e resiliência (6)

Os trabalhos tratam comportamento ao longo do tempo, disponibilidade e tolerância a falhas. Métricas de confiabilidade dependem de hipóteses sobre operação e carga; planejar testes de falha e observar recuperação complementa a taxa de sucesso nominal.

[Dossiê completo da pasta](./referencias-qa/confiabilidade-e-resiliencia/dossie-completo.md) · [Índice de referências](./referencias-qa/confiabilidade-e-resiliencia/README.md)

#### [A Convex-Dependent NHPP Software Reliability Model and Its Deep-Learning-Based Parameter Estimation](https://doi.org/10.3390/math14173176)

**2026 · Mathematics · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autores / origem:** Youn Su Kim, In Hong Chang e Kwang Yoon Song · Mathematics, 2026 · [DOI](https://doi.org/10.3390/math14173176)

- **O que aborda:** Propõe um modelo NHPP de crescimento de confiabilidade cuja taxa de descoberta de falhas pode ter forma convexa e uma estratégia de estimação de parâmetros com deep learning.
- **O que importa:** Compara 13 modelos em três datasets; o resumo relata melhora preditiva em alguns datasets, mantendo a estrutura do modelo interpretável.
- **Uso no roadmap:** Ilustra como qualidade/reliability pode ser estimada a partir de dados de falha e por que comparar modelos e pressupostos importa.
- **Cautela:** O resultado é específico dos dados e da métrica adotada; previsões de falhas não substituem testes nem análise de risco do produto.

#### [Deepfake-as-a-Service: Governance Frameworks, Software Quality Engineering, and Organizational Resilience in the Age of Synthetic Media](https://doi.org/10.5281/zenodo.22981865)

**2026 · Zenodo (CERN European Organization for Nuclear Research) · Relatório ou depósito em repositório**

**Autores / origem:** Akanksha Raghvesh e Kiran Paul Kanikaram · versão aceita depositada no Zenodo, 2026 · [DOI](https://doi.org/10.5281/zenodo.22981865)

- **O que aborda:** Propõe o framework PROOF (proveniência, robustez, supervisão, observabilidade e auditabilidade forense) para verificar a integridade de dados humanos e sintéticos em pipelines distribuídos de IA.
- **O que importa:** Conecta qualidade de dados, segurança e governança a verificações de proveniência, testes de injeção e escalonamento para revisão humana.
- **Uso no roadmap:** Amplia a discussão de qualidade de IA para a qualidade dos dados de treinamento e para evidências ao longo da cadeia de fornecedores.
- **Cautela:** O resumo diz explicitamente que o framework ainda precisa de piloto e validação empírica; as estimativas de deepfakes não devem ser usadas como evidência independente sem checagem das fontes citadas.

#### [DSC‐SRGM: A Deep Synthetic Cross‐Project Software Reliability Growth Model](https://doi.org/10.1002/stvr.70028)

**2026 · Software Testing, Verification and Reliability · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autores / origem:** Taehyoun Kim, Duksan Ryu e Jongmoon Baik · Software Testing, Verification and Reliability, 2026 · [DOI](https://doi.org/10.1002/stvr.70028)

- **O que aborda:** Gera dados sintéticos com modelos clássicos de crescimento de confiabilidade, seleciona padrões semelhantes ao projeto-alvo e usa transferência entre projetos para prever descoberta de defeitos.
- **O que importa:** Avalia 60 datasets e o resumo relata ganhos frente às abordagens comparadas, mas também mostra que excesso ou mistura ingênua de dados sintéticos pode piorar a previsão.
- **Uso no roadmap:** Caso útil para qualidade de dados de teste, transferência de aprendizado e validação de dados sintéticos.
- **Cautela:** Percentuais de melhoria dependem das métricas, baselines e datasets específicos do artigo; examinar protocolo e replicação antes de os citar.

#### [Policy-Gated Firmware Trust and Anti-Rollback Resilience for Autonomous UAV Edge Platforms: A Formal Security and Software Validation](https://doi.org/10.21203/rs.3.rs-10812592/v1)

**2026 · Origem não informada · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autor / origem:** Md Shahanur Islam Shagor · origem editorial não informada no registro, 2026 · [DOI](https://doi.org/10.21203/rs.3.rs-10812592/v1)

- **O que aborda:** Formaliza controles de firmware confiável e anti-rollback para UAVs, incluindo versão, assinatura, medição de imagem e estado persistido; descreve testes nativos de aceitação e rejeição.
- **O que importa:** Expõe duas dependências críticas: integridade do contador persistido e diferença entre alegações de secure boot e evidência medida no hardware.
- **Uso no roadmap:** Exemplo concreto de invariantes, estados fail-closed, validação de segurança e limites de teste sem hardware confiável.
- **Cautela:** O resumo declara dependências de hardware que ainda são pressupostos; confirme a publicação e a implementação antes de generalizar os resultados.

#### [Software Reliability and Availability Testing of a Kubernetes Cluster](https://doi.org/10.1109/RAMS50514.2026.11424466)

**2026 · Reliability and Maintainability Symposium · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autor / origem:** Myron Hecht · Reliability and Maintainability Symposium, 2026 · [DOI](https://doi.org/10.1109/RAMS50514.2026.11424466)

- **O que aborda:** Usa testes de falha com LitmusChaos em um sistema de processamento sobre Kubernetes; mede tempo e probabilidade de recuperação para alimentar um modelo de disponibilidade e confiabilidade.
- **O que importa:** Mostra como testar sistemas parcialmente implementados e usar dados de recuperação para comparar decisões de redundância antes do produto estar completo.
- **Uso no roadmap:** Dá contexto prático para chaos testing autorizado, recuperação observável, disponibilidade e decisão arquitetural baseada em evidência.
- **Cautela:** O caso é um sistema e ambiente específicos; não transportar os números para outros clusters sem repetir a medição.

#### [Toward trustworthy adaptive software reliability engineering: An explainable deep reinforcement learning framework](https://doi.org/10.4038/cjs.v55i4.9573)

**2026 · Ceylon Journal of Science · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autores / origem:** Sudhakar Kambhampati e G. Vamsi Krishna · Ceylon Journal of Science, 2026 · [DOI](https://doi.org/10.4038/cjs.v55i4.9573)

- **O que aborda:** Apresenta o X-DRL-SRE, que combina estimativa de confiabilidade, reinforcement learning e explicações com SHAP, integrated gradients e contrafactuais.
- **O que importa:** O resumo relata experimentos em três datasets NASA e ganhos de índices de confiabilidade e esforço de teste frente a modelos de comparação, além de estabilidade das explicações.
- **Uso no roadmap:** Serve para discutir previsão de confiabilidade, explicabilidade e a necessidade de comparar com baselines claros.
- **Cautela:** Os resultados dependem dos datasets e desenho experimental descritos no artigo; não demonstram automaticamente melhoria em produto operacional ou domínio crítico.


### Fundamentos e métodos de teste (7)

Os registros abrangem técnicas de desenho, execução e avaliação. Escolher método pelo risco e pela pergunta de teste, explicitar dados e critérios de cobertura, e distinguir proposta de método validado são práticas recorrentes.

[Dossiê completo da pasta](./referencias-qa/fundamentos-e-metodos-de-teste/dossie-completo.md) · [Índice de referências](./referencias-qa/fundamentos-e-metodos-de-teste/README.md)

#### [ANALISIS KUALITAS DAN PENERAPAN SOFTWARE QUALITY ASSURANCE MENGGUNAKAN BLACK BOX TESTING PADA APLIKASI WEB EXPLORE PALANGKA RAYA](https://doi.org/10.36040/jati.v10i1.16610)

**2026 · JATI (Jurnal Mahasiswa Teknik Informatika) · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autores / origem:** Azizah Shafa Budiman e Jadiaman Parhusip · JATI, 2026 · [DOI](https://doi.org/10.36040/jati.v10i1.16610)

- **O que aborda:** Avalia funções de um portal turístico com testes black-box e percepção de qualidade de 30 usuários, relacionando aspectos ao modelo ISO/IEC 25010.
- **O que importa:** O resumo relata aprovação de todos os testes funcionais executados e média de percepção 4,01/5, com diferenças entre atributos de qualidade.
- **Uso no roadmap:** Ajuda a distinguir execução funcional de avaliação da experiência percebida e a combinar tipos de evidência.
- **Cautela:** Amostra de 30 participantes e um único produto; “100% pass” descreve apenas os casos executados, não prova ausência de defeitos.

#### [Based on Information Entropy: A Software Testing Method](https://doi.org/10.5281/zenodo.22336824)

**2026 · Zenodo (CERN European Organization for Nuclear Research) · Relatório ou depósito em repositório**

**Autor / origem:** Jincheng Zhang · Zenodo, 2026 · [DOI](https://doi.org/10.5281/zenodo.22336824)

- **O que aborda:** Propõe usar entropia para quantificar incerteza e orientar desenho/priorização de testes e alvos de cobertura.
- **O que importa:** A proposta tenta tornar explícita uma medida para priorizar áreas incertas, mas o resumo não fornece dataset, protocolo comparativo ou resultado mensurado.
- **Uso no roadmap:** Serve como hipótese para discutir métricas de priorização e o risco de transformar uma medida matemática em proxy automático de qualidade.
- **Cautela:** Depósito em repositório; verificar método, validação e limitações no texto antes de tratar como técnica comprovada.

#### [Based on Multi-Modal Data Fusion for Software Testing](https://doi.org/10.5281/zenodo.22138125)

**2026 · Zenodo (CERN European Organization for Nuclear Research) · Relatório ou depósito em repositório**

**Autor / origem:** Jincheng Zhang · Zenodo, 2026 · [DOI](https://doi.org/10.5281/zenodo.22138125)

- **O que aborda:** Propõe combinar código, casos de teste e logs com modelos de machine learning para avaliação de qualidade, previsão e localização de defeitos.
- **O que importa:** A ideia central é aproveitar sinais complementares, mas o resumo não informa corpus, protocolo ou tamanho do ganho alegado.
- **Uso no roadmap:** Conecta observabilidade, dados de execução e análise de defeitos; é uma hipótese de engenharia de dados para QA.
- **Cautela:** O resumo afirma melhora frente a abordagens de fonte única sem fornecer detalhes suficientes para avaliar validade ou magnitude.

#### [Implementasi Software Quality Assurance pada Aplikasi E-Commerce Menggunakan Manual Testing dan Katalon Studio](https://doi.org/10.54066/jptis.v4i2.3925)

**2026 · Jurnal Penelitian Teknologi Informasi dan Sains · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autor / origem:** Fahmi Ardiansyah · Jurnal Penelitian Teknologi Informasi dan Sains, 2026 · [DOI](https://doi.org/10.54066/jptis.v4i2.3925)

- **O que aborda:** Estudo de caso que combina teste manual e automação Katalon para cadastro, autenticação, carrinho e checkout, seguindo o STLC.
- **O que importa:** Em 42 casos, relata cinco defeitos funcionais; após correções e regressão, a taxa de aprovação foi de 90,5% para 97,6%, com menor tempo de execução nos cenários automatizados.
- **Uso no roadmap:** Exemplo de regressão repetível e complementaridade entre exploração manual e automação.
- **Cautela:** Os resultados são de uma aplicação e conjunto de cenários; o ganho de tempo não deve ser generalizado sem medir o próprio contexto.

#### [Size-biased multinomial modelling of detection data in software testing](https://doi.org/10.1007/s12597-026-01277-w)

**2026 · OPSEARCH · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

**Autores / origem:** Pallabi Ghosh, Ashis Kumar Chakraborty e Soumen Dey · OPSEARCH, 2026 · [DOI](https://doi.org/10.1007/s12597-026-01277-w)

- **O que aborda:** Pelo título, aplica modelagem multinomial com viés de tamanho a dados de detecção em teste de software.
- **O que importa:** Pode ser pertinente à interpretação estatística de defeitos detectados, mas o registro não tem resumo para confirmar pergunta, método ou conclusão.
- **Uso no roadmap:** Não usar como apoio didático até consultar o artigo e identificar o que é modelado e quais pressupostos estatísticos são necessários.
- **Cautela:** Síntese limitada ao título; nenhuma conclusão do estudo é atribuída aqui.

#### [Software Quality Assurance and Testing Work in the United States: Evidence from 108 Current Vacancies](https://doi.org/10.5281/zenodo.22414216)

**2026 · Zenodo (CERN European Organization for Nuclear Research) · Relatório ou depósito em repositório**

**Origem:** relatório de pesquisa depositado no Zenodo, 2026 · [DOI](https://doi.org/10.5281/zenodo.22414216)

- **O que aborda:** Analisa uma amostra intencional de 108 vagas dos EUA e contabiliza habilidades descritas, incluindo defeitos, cenários, regressão, automação, requisitos, evidência de aceite, API, dados e exploração.
- **O que importa:** O estudo alerta que vagas júnior também podem exigir base técnica e que a amostra não sustenta promessas de contratação fácil ou acesso universal.
- **Uso no roadmap:** Apoia a ordem de estudo do QA Lab como um retrato de uma amostra específica, não como padrão do mercado brasileiro.
- **Cautela:** Não é artigo experimental de teste de software; é um relatório de análise de vagas nos EUA, com amostragem e período próprios.

#### [The Rise of Agentic Testing: Multi-Agent Systems for Robust Software Quality Assurance](http://arxiv.org/abs/2601.02454v1)

**2026 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

**Autores / origem:** Saba Naqvi, Mohammad Baqar e Nawaz Ali Mohammad · arXiv, 2026 · [registro](https://arxiv.org/abs/2601.02454)

- **O que aborda:** Propõe um ciclo com agentes de geração, execução/análise e revisão para corrigir testes inválidos usando sinais de execução e cobertura.
- **O que importa:** O resumo relata, em aplicações de microsserviços, redução de testes inválidos e aumento de cobertura frente a baselines de geração única.
- **Uso no roadmap:** Demonstra que feedback de execução pode ser incorporado ao processo de geração e revisão de testes com modelos.
- **Cautela:** É preprint e o resumo não detalha benchmark, custos, segurança do sandbox ou reprodutibilidade. Confirmar a URL e os resultados na fonte antes de citar percentuais.


### Garantia e engenharia de qualidade (16)

Qualidade é construída ao longo do ciclo de desenvolvimento, com evidências, critérios e feedback. Os casos aplicados mostram a utilidade de modelos estruturados, mas suas pontuações dependem de amostra, instrumento, contexto e regra de aprovação.

[Dossiê completo da pasta](./referencias-qa/garantia-e-engenharia-de-qualidade/dossie-completo.md) · [Índice de referências](./referencias-qa/garantia-e-engenharia-de-qualidade/README.md)

#### [ANALISIS KUALITAS DAN PENERAPAN SOFTWARE QUALITY ASSURANCE PADA WEBSITE PORTAL KATINGAN MENGGUNAKAN MODEL ISOIEC 9126](https://doi.org/10.23960/jitet.v14i1.8462)

**2026 · Jurnal Informatika dan Teknik Elektro Terapan · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** estudo de um portal público com questionário a 50 pessoas, testes black-box e medição com GTmetrix.
- **Importante:** relata média geral 4,63/5, um link de serviço inativo e diferença de eficiência entre páginas, mostrando que um bom resultado agregado ainda pode esconder defeitos localizados.
- **Aplicação no QA Lab:** relacionar percepção dos usuários, testes funcionais e desempenho por página.
- **Cautela:** amostra e produto únicos; a nota do questionário não representa conformidade universal nem elimina a necessidade de olhar defeitos individuais.

#### [Automated Software Quality Assurance Using CI/CD Tools](https://doi.org/10.55041/ijsrem56830)

**2026 · International Journal of Scientific Research in Engineering and Management · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** propõe um score final ponderado com múltiplas características de qualidade e gates automáticos de release em CI/CD.
- **Importante:** o resumo relata distinção entre builds de qualidade alta e baixa e redução de esforço manual em projetos reais.
- **Aplicação no QA Lab:** discutir gates proporcionais ao risco e agregação de sinais no pipeline.
- **Cautela:** um score único depende de pesos e limiares escolhidos; verificar quais métricas, projetos e decisões foram avaliados antes de o usar como regra de release.

#### [Autonomous Test Generation And Optimization: The Future Of Software Quality Assurance](https://doi.org/10.63278/jicrcr.vi.3650)

**2026 · Journal of International Crisis and Risk Communication Research · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** panorama de geração de testes, priorização por risco, reparo automático e fuzzing inteligente com IA/ML.
- **Importante:** conecta geração e manutenção de testes a problemas reais de custo e mudança frequente.
- **Aplicação no QA Lab:** usar como mapa de possibilidades e perguntas de avaliação para ferramentas de automação inteligente.
- **Cautela:** o resumo não apresenta protocolo de revisão ou experimento próprio detalhado; não tratar o texto como demonstração de eficácia dos métodos.

#### [Enhancing Software Quality through Dynamic Optimization-Based Latent Dirichlet Allocation and Indexive Regression (DOLDIR)](https://doi.org/10.30572/2018/kje/170209)

**2026 · Kufa journal of Engineering · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** modelo que combina detecção de drift entre versões, tópicos de falhas, seleção de testes e scores de confiabilidade para prever risco.
- **Importante:** o resumo relata experimentos com NASA PROMISE e SoftRel Bench e precisão de classificação de risco de 92,8%, acima de seis modelos comparados.
- **Aplicação no QA Lab:** estudar a ideia de atualizar priorização quando o perfil do sistema muda entre versões.
- **Cautela:** o resumo não detalha protocolo, seleção dos baselines ou validade externa; não assumir que a mesma precisão se aplica a outros projetos.

#### [Integrated system of methods for automating the evaluation of risk management effectiveness in software quality assurance systems](https://doi.org/10.15276/hait.09.2026.24)

**2026 · Herald of Advanced Information Technology · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** pelo título, métodos para automatizar a avaliação de efetividade da gestão de riscos em sistemas de SQA.
- **Importante:** não há resumo na fonte indexada, então método, dados e resultados não podem ser confirmados.
- **Aplicação no QA Lab:** manter como leitura pendente; não citar uma conclusão até consultar o texto e confirmar a publicação.

#### [Methods and Tools for Engineering Management of Software Quality Level](https://doi.org/10.1109/ICIEAM69213.2026.11549592)

**2026 · International Conference on Industrial Engineering, Applications and Manufacturing · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** aplica modelagem funcional IDEF0 para relacionar gestão de projeto, verificação, validação, testes e usabilidade.
- **Importante:** propõe um indicador agregado de qualidade com avaliação especializada e medidas de aceitação para localizar características problemáticas.
- **Aplicação no QA Lab:** discutir como métricas compostas podem apoiar conversa de qualidade. Examinar pesos, validade dos indicadores e risco de um score esconder uma falha crítica.

#### [QualiTagger: automating software quality categorization in issue trackers](https://doi.org/10.1007/s11219-026-09775-2)

**2026 · Software quality journal · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** classifica sete atributos de qualidade em texto de issues; apresenta um conjunto com mais de 700 mil issues e compara classificadores especializados, modelo multiclasses e LLM.
- **Importante:** o resumo relata generalização para projetos não vistos, estudo industrial e estudo com estudantes, indicando potencial para triagem de preocupação de qualidade e dívida técnica.
- **Aplicação no QA Lab:** relacionar classificação automática de tickets com bug reports, métricas de produto e revisão humana. Não confundir classificar uma issue com verificar que o produto atende ao requisito.

#### [Software Quality Assurance Process: A Consolidated Definition and a Lifecycle-Mapped Taxonomy of Tool Support](https://doi.org/10.5281/zenodo.22341782)

**2026 · Zenodo (CERN European Organization for Nuclear Research) · Relatório ou depósito em repositório**

- **Aborda:** revisão narrativa que diferencia QA, QC e testing e mapeia ferramentas por fase de SDLC e função (prevenção, avaliação ou detecção).
- **Importante:** propõe escolher ferramentas pelo propósito de engenharia e pelo momento em que apoiam o processo, em vez de categorias de fornecedores.
- **Aplicação no QA Lab:** usar como apoio à conversa sobre rastreabilidade e seleção de ferramentas por risco. O próprio trabalho prevê validação empírica futura da taxonomia.

#### [Software Quality Assurance Techniques of Models and Practices](https://doi.org/10.46632/cset/2/4/6)

**2026 · Computer Science, Engineering and Technology · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** o título anuncia modelos e práticas de SQA.
- **Importante:** o registro não tem resumo indexado suficiente para determinar método ou contribuição.
- **Aplicação no QA Lab:** leitura pendente; não inferir que “técnicas” específicas são recomendadas pelo trabalho.

#### [Status of SPCA-ANL Software Development, Software Quality Assurance, and Application (FY2026)](https://doi.org/10.2172/3914678)

**2026 · Origem não informada · Relatório ou depósito em repositório**

- **Aborda:** manutenção e evolução de um simulador de incêndios de sódio para uso em contexto nuclear, com histórico de correções e releases.
- **Importante:** o relatório descreve a formalização de um programa de SQA que orienta infraestrutura, desenvolvimento, correções e releases. É um exemplo de governança e rastreabilidade em software crítico.
- **Aplicação no QA Lab:** discutir como requisitos de qualidade, documentação, configuração e evidência se conectam ao ciclo de vida. O contexto nuclear é específico.

#### [The Software Quality Assurance programme of the ASTRI Mini-Array project](https://doi.org/10.1088/1742-6596/3206/1/012031)

**2026 · Journal of Physics, Conference Series · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** programa de QA para software de operação e dados de um conjunto de telescópios, desenvolvido em modelo iterativo e incremental.
- **Importante:** apresenta organização, estratégia, controle e relatos de aplicação de QA ao longo de um ciclo operacional e científico complexo.
- **Aplicação no QA Lab:** exemplo de QA adaptada ao contexto e às consequências operacionais, com colaboração entre instituições e releases frequentes.

#### [Trends in Software Quality in Embedded Systems: Are We Getting Any Better?](https://doi.org/10.1109/MS.2026.3662321)

**2026 · IEEE Software · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** discussão de um modelo baseado em métricas e tendências observadas em uma grande base de código embarcado.
- **Importante:** destaca que “qualidade” não tem uma definição ou medida única e que tendências precisam ser interpretadas conforme o modelo escolhido.
- **Aplicação no QA Lab:** conversa sobre limites de métricas e a diferença entre medir sinais observáveis e concluir qualidade geral.
- **Cautela:** o resumo é curto e não informa dimensões, período ou resultados quantitativos.

#### [Guide to the Software Engineering Body of Knowledge: Software Quality](https://www.computer.org/education/bodies-of-knowledge/software-engineering)

**2024 · SWEBOK Guide · Norma, corpo de conhecimento ou referência técnica**

- **Tipo:** referência técnica do SWEBOK, não artigo de pesquisa.
- **Aborda:** fundamentos de qualidade de software, QA, verificação, validação, revisão, auditoria, medição e gestão de defeitos.
- **Importante:** oferece vocabulário e estrutura para situar os temas da mentoria antes de aprofundar em estudos específicos.
- **Aplicação no QA Lab:** usar como referência de consulta e organização conceitual, não como evidência experimental de que uma prática melhora resultados.

#### [A Systematic Mapping Study on Dynamic Metrics and Software Quality](http://arxiv.org/abs/2101.03669v1)

**2021 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Aborda:** mapeia 60 trabalhos sobre métricas dinâmicas e classifica foco, tipo de pesquisa e contribuição.
- **Importante:** encontra concentração em acoplamento, coesão e complexidade e aponta espaço para outras dimensões de qualidade.
- **Aplicação no QA Lab:** reforça que métricas de execução capturam aspectos que métricas estáticas não cobrem e que a escolha deve partir da pergunta.
- **Cautela:** o mapeamento foi publicado em 2021; usar como retrato daquele corpus, não como estado atual de toda a pesquisa.

#### [Statistical Analysis of Metrics for Software Quality Improvement](http://arxiv.org/abs/1802.05865v1)

**2018 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Aborda:** discute métricas de projeto, produto e processo e propõe categorizá-las conforme os erros que ajudam a observar.
- **Importante:** a ideia central é usar métricas de processo para orientar remoção de defeitos e melhorias, em vez de medir por medir.
- **Aplicação no QA Lab:** relacionar indicadores a ações corretivas e hipóteses verificáveis.
- **Cautela:** resumo e trabalho são de 2018; validar definições e método no texto antes de reutilizar como referência atual.

#### [Towards Resolving Software Quality-in-Use Measurement Challenges](http://arxiv.org/abs/1501.07676v1)

**2015 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Aborda:** qualidade em uso do ponto de vista de quem usa e dificuldades de medir esse conceito em modelos existentes.
- **Importante:** propõe uma estrutura com análise de sentimento para prever tópicos de qualidade em uso e relata resultados preliminares.
- **Aplicação no QA Lab:** conectar validação do produto à experiência e às tarefas reais, sem reduzir usabilidade a uma pontuação automatizada.
- **Cautela:** trata-se de proposta com resultados preliminares; confirmar validação e escopo no texto integral.


### IA/ML aplicada à qualidade (20)

IA/ML pode apoiar geração, análise, predição e priorização, mas depende de dados representativos, validação sem vazamento, explicabilidade apropriada e supervisão humana. Resultados em benchmarks não garantem desempenho no produto real.

[Dossiê completo da pasta](./referencias-qa/ia-ml-aplicada-a-qualidade/dossie-completo.md) · [Índice de referências](./referencias-qa/ia-ml-aplicada-a-qualidade/README.md)

#### [A Multi-Agent AI Framework for Automated Requirement-to-Test Case Mapping in Software Quality Assurance](https://doi.org/10.25258/ijddt.16.48s.109)

**2026 · International Journal of Drug Delivery Technology · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** três agentes extraem semântica de requisitos, mantêm rastreabilidade bidirecional e geram casos com templates guiados por LLM.
- **Importante:** o resumo reporta cobertura de requisitos de 94,7%, precisão de links de rastreabilidade de 91,3% e redução de 67% no esforço manual em três projetos open source.
- **Aplicação no QA Lab:** ilustra rastreabilidade automatizada como apoio à revisão de requisitos e casos.
- **Cautela:** confirmar como cobertura/precisão foram definidas, quais projetos e baselines foram usados, e se os casos gerados eram executáveis e corretos.

#### [A Validated Measurement Protocol for Comparable, Cost-Aware Software Testing Evaluation: A Reproducible Benchmark, an Oracle Sampling-Budget Guarantee, and a Real-Fault Validity Study, Instantiated for Quantum Programs](https://doi.org/10.21203/rs.3.rs-10572455/v1)

**2026 · Origem não informada · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** define um protocolo executável para comparar técnicas de geração de teste e oráculos; inclui estudo de validade com defeitos reais e orçamento amostral para oráculos probabilísticos.
- **Importante:** o resumo reporta que o mesmo protocolo foi repetido em um sistema clássico de feature flags com resultados centrais replicados.
- **Aplicação no QA Lab:** discutir comparabilidade, custo, orçamento de oráculo e validade de constructo ao avaliar ferramentas.
- **Cautela:** o estudo é instanciado em programas quânticos e um caso clássico; confirmar as condições experimentais antes de extrapolar.

#### [Agentic AI for Early Bug Detection and Software Quality Assurance: A Multi-Agent Collaborative Framework](https://doi.org/10.1007/s44196-026-01540-4)

**2026 · International Journal of Computational Intelligence Systems · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** propõe agentes colaborativos para prever defeitos, analisar mudanças e fazer QA contínua em fluxos Agile/CI.
- **Importante:** o resumo relata cobertura de código de até 82% e tempo médio para localizar bugs de 10,5–12,1 horas.
- **Aplicação no QA Lab:** exemplo para discutir detecção antecipada e critérios para comparar agentes com ferramentas estáticas/dinâmicas.
- **Cautela:** os números são alegações do resumo; conferir datasets, baselines, definição de cobertura e protocolo no artigo.

#### [AI-as-a-Judge for software quality assessment: Consistency, attitude effects, and complexity sensitivity in multi-agent code evaluation](https://doi.org/10.1007/s11219-026-09785-0)

**2026 · Software Quality Journal · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** pelo título, avalia consistência, efeitos de atitude e sensibilidade à complexidade quando agentes de IA julgam qualidade de código.
- **Importante:** o registro não traz resumo indexado; não há base para afirmar que os julgamentos são consistentes ou úteis.
- **Aplicação no QA Lab:** leitura pendente; a pergunta de pesquisa é relevante para avaliar juízes automáticos, mas resultados precisam ser extraídos do texto.

#### [AI-Assisted Software Testing: Opportunities and Challenges](https://doi.org/10.70267/aitia.2026300307)

**2026 · Exploring Science Academic Conference Series · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** revisão de oportunidades de IA em teste e automação, incluindo geração de casos, análise e manutenção.
- **Importante:** aponta barreiras como dependência de dados, pouca interpretabilidade, falsos positivos, integração e risco de saída incorreta de LLMs; posiciona IA como apoio ao julgamento humano.
- **Aplicação no QA Lab:** construir critérios de validação e privacidade para uso de copilotos e geração de testes.

#### [AI-Augmented Closed-Loop Quality Engineering: A Reference Architecture for Continuous Software Quality Intelligence](https://doi.org/10.48550/arXiv.2606.08793)

**2026 · arXiv.org · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Aborda:** arquitetura que fecha o ciclo entre mineração de requisitos, priorização de teste, previsão de defeitos e incidentes em produção.
- **Importante:** o resumo descreve uma avaliação em dados semissintéticos ao longo de seis releases e relata menor vazamento de defeitos, maior detecção e execução de testes mais curta.
- **Aplicação no QA Lab:** exemplo de shift right alimentando risco e seleção de teste do próximo ciclo.
- **Cautela:** base semissintética e poucos ciclos limitam generalização; confirmar replicabilidade e definições das métricas.

#### [AI-Driven Code Quality Assessment Model and Implementation for Complex Power Grid Software Systems](https://doi.org/10.1109/CICSE70286.2026.11621056)

**2026 · 2026 International Conference on Computer Intelligence and Software Engineering (CICSE) · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** combina métricas estáticas, AST, dependências, histórico de mudanças e crítica por LLM para avaliar código de sistemas de energia.
- **Importante:** o resumo relata macro-F1 0,87 e AUC 0,93 em benchmark orientado a concessionárias, usando análise mais profunda para mudanças de maior risco.
- **Aplicação no QA Lab:** exemplo de roteamento por risco e combinação de sinais estruturados com avaliação contextual.
- **Cautela:** domínio crítico e benchmark próprio; os resultados não provam generalização para aplicações comuns.

#### [AI-Driven Software Quality Assurance: Transforming Testing Through Intelligent Automation and Predictive Analytics](https://doi.org/10.52783/jisem.v11i1s.14246)

**2026 · Journal of Information Systems Engineering & Management · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** visão geral de IA para previsão de defeitos, self-healing, priorização dinâmica e análise automatizada de requisitos.
- **Importante:** destaca que adoção exige qualidade de dados, supervisão humana, transparência, governança e desenvolvimento de competências.
- **Aplicação no QA Lab:** usar para abrir discussão de riscos e capacidades organizacionais.
- **Cautela:** o resumo não descreve experimento ou revisão sistemática; não usar afirmações amplas de transformação como evidência de eficácia.

#### [CodeQual-Agent: An Intelligent LLM-Agent Framework for Automated Software Quality Assessment with Explainable Predictions and Real-Time Analysis](https://doi.org/10.1109/ICSTW72326.2026.00035)

**2026 · International Conference on Software Testing, Verification and Validation Workshops · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** combina métricas objetivas de análise estática e raciocínio de LLM com destilação de modelos, explicabilidade e revisão humana.
- **Importante:** o resumo afirma avaliação em 150 mil amostras e resultados de precisão, latência, redução de falsos positivos e escapes de defeito.
- **Aplicação no QA Lab:** caso para discutir evidência objetiva, julgamento contextual, custo de inferência e human-in-the-loop.
- **Cautela:** os resultados são substanciais; validar dataset, desenho de implantação, baseline, unidade da latência e significado de adoção antes de citá-los como comprovados.

#### [Data-Driven Software Quality Assurance: Leveraging Machine Learning for Risk Prediction and Test Optimization](https://doi.org/10.64137/3108-2637/ijmar-v2i1p101)

**2026 · International Journal of Mathematical Analysis and Research · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** propõe um framework conceitual de feedback fechado que une risco, priorização de testes, observabilidade e governança.
- **Importante:** reúne achados de contextos diferentes como padrões transferíveis, em vez de apresentar um experimento de QA completo.
- **Aplicação no QA Lab:** mapear como sinais de código, execução, produção e negócio poderiam orientar testes, mantendo explicabilidade.
- **Cautela:** proposta baseada em literatura; distinguir arquitetura recomendada de validação empírica do próprio framework.

#### [Data-Driven Test Case Prioritization (DD-TCP): A Machine Learning Framework for Intelligent Software Quality Assurance](https://doi.org/10.32604/cmc.2026.077782)

**2026 · Computers, Materials &amp; Continua · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** ranqueia testes de regressão por mudança, dependências, duração e histórico de falhas com gradient-boosted trees.
- **Importante:** o resumo relata melhora de 32,4% em APFD e redução de 27,1% no custo de execução em simulações/datasets de projetos open source.
- **Aplicação no QA Lab:** exemplo para comparar priorização por dados históricos com seleção estática e risco manual.
- **Cautela:** avaliar estabilidade por projeto, custo de coleta de features e comportamento quando os dados históricos são escassos ou enviesados.

#### [Engineering Management for AI-Driven Software Quality Assurance: Practices, Challenges, and Future Direction](https://doi.org/10.1109/SoutheastCon63549.2026.11476717)

**2026 · SoutheastCon · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** gestão da qualidade em sistemas com IA, desde dados e implantação até manutenção, geração de teste, previsão de defeitos e validação de modelos.
- **Importante:** trata governança, ciclos de vida de ML e colaboração entre engenharia e QA como partes da qualidade do produto.
- **Aplicação no QA Lab:** leitura de panorama para discutir TEVV, responsabilidades e operação de sistemas com modelos.
- **Cautela:** resumo de alto nível; não informa método detalhado nem evidência comparativa.

#### [Explainable AI-Driven Metrics for Transparent Software Quality Prediction](https://doi.org/10.1109/ACCESS.2026.3712592)

**2026 · IEEE Access · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** combina métricas estáticas, de processo e atividade de desenvolvedores com modelos preditivos e explicações SHAP/LIME.
- **Importante:** o resumo relata avaliação em PROMISE, Eclipse JDT, Apache Commons e dados industriais, além de estudo com desenvolvedores sobre decisões com métricas explicáveis.
- **Aplicação no QA Lab:** discutir explicabilidade como meio para questionar uma recomendação, não como prova de que o modelo está correto.
- **Cautela:** confirmar desenho do estudo com usuários, leakage entre projetos, métricas e validade externa.

#### [Intelligent automated code review and software quality evaluation: a survey of AutoML and large language model techniques](https://doi.org/10.1007/s10515-026-00668-z)

**2026 · Automated Software Engineering · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** pelo título, revisa AutoML e LLMs para revisão automática de código e avaliação de qualidade.
- **Importante:** o registro não tem resumo indexado, então não é possível resumir o escopo real ou as conclusões.
- **Aplicação no QA Lab:** manter como leitura pendente e confirmar se é revisão sistemática, narrativa ou proposta antes de usar como fonte.

#### [On the Factors in Quantum Software Quality](http://arxiv.org/abs/2609.29705v1)

**2026 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Aborda:** propõe um modelo de qualidade para software quântico baseado na estrutura fator–critério–métrica de McCall.
- **Importante:** destaca características específicas do domínio — resultados probabilísticos, dependência de backend e fluxos híbridos — que modelos clássicos podem não representar diretamente.
- **Aplicação no QA Lab:** exemplo de adaptação de oráculos e critérios ao domínio; é especialização, não base obrigatória para QA geral.
- **Cautela:** o resumo recomenda avaliação futura por especialistas, estudos de caso e pesquisa empírica.

#### [Rethinking Software Quality Measurement: A Vision for AI-Assisted Triangulation in the Post-Metrics Era](https://doi.org/10.1145/3803437.3805580)

**2026 · SIGSOFT FSE Companion · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** visão para combinar sinais de repositório, interpretação semântica por agentes LLM e métricas estruturais para avaliar qualidade.
- **Importante:** propõe usar a triangulação como camada de evidência que orienta verificação e reparo, declarando incerteza em vez de confiar em um número isolado.
- **Aplicação no QA Lab:** reforçar triangulação de evidências e limites de métricas compostas.
- **Cautela:** é uma visão/arquitetura proposta; o resumo não reporta uma validação que prove os ganhos projetados.

#### [Software quality assurance in the era of Agentic AI: a systematic mapping study](https://doi.org/10.3389/fcomp.2026.1936730)

**2026 · Frontiers of Computer Science · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Aborda:** mapeia onde agentes de IA aparecem no ciclo de SQA, quais papéis apoiam e quais lacunas permanecem.
- **Importante:** conclui que a aplicação é desigual e que transparência, validação e apoio de liderança são lacunas prioritárias.
- **Aplicação no QA Lab:** ajuda a tratar agentes como componentes com permissões, supervisão e critérios de avaliação ao longo do SDLC.

#### [Training Dynamics of Neural Software Defect Predictors under Coupled Data-Quality Issues](http://arxiv.org/abs/2606.24968v1)

**2026 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Aborda:** planeja estudar como desequilíbrio de classes e sobreposição de classes se combinam e aparecem na dinâmica de treinamento de modelos de predição de defeitos.
- **Importante:** o resumo formula objetivo, protocolo e contribuição esperada; não apresenta resultados concluídos.
- **Aplicação no QA Lab:** alerta que qualidade dos dados influencia avaliação de modelos usados para priorizar teste e risco.
- **Cautela:** tratar como proposta de estudo/preprint até confirmar versão publicada e resultados.

#### [Enhancing Software Quality Assurance with an Adaptive Differential Evolution based Quantum Variational Autoencoder-Transformer Model](http://arxiv.org/abs/2503.16335v1)

**2025 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Aborda:** propõe ADE-QVAET, combinando autoencoder variacional quântico, Transformer e otimização diferencial para prever defeitos.
- **Importante:** o resumo informa métricas altas de treino, mas não apresenta no trecho disponível contexto suficiente para interpretar a configuração completa.
- **Aplicação no QA Lab:** caso para discutir comparação de modelos e por que métricas de treino isoladas não demonstram generalização.
- **Cautela:** preprint; exigir métricas em teste independente, baselines, validação cruzada e reprodutibilidade antes de confiar nos números.

#### [Industry Expectations and Skill Demands in Quantum Software Testing](http://arxiv.org/abs/2512.14861v2)

**2025 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Aborda:** análise de 110 vagas em organizações de software/hardware quântico sobre tarefas e competências de teste.
- **Importante:** identifica mistura de QA tradicional com validação experimental, calibração e colaboração interdisciplinar.
- **Aplicação no QA Lab:** exemplo de pesquisa de mercado de nicho e adaptação de competências de QA ao domínio.
- **Cautela:** estudo de vagas em setor emergente e amostra específica; não generalizar para o mercado geral de QA.


### Modelos e métricas de qualidade (14)

Modelos ajudam a organizar atributos, não substituem critérios contextualizados. Validar a métrica, registrar pesos e pressupostos, e combinar qualidade do produto com qualidade em uso evita números precisos sem significado operacional.

[Dossiê completo da pasta](./referencias-qa/modelos-e-metricas-de-qualidade/dossie-completo.md) · [Índice de referências](./referencias-qa/modelos-e-metricas-de-qualidade/README.md)

#### [ANALISIS KUALITAS DAN PENERAPAN SOFTWARE QUALITY ASSURANCE MENGGUNAKAN MODEL ISO/IEC 9126 PADA APLIKASI WEB EXPLORE PALANGKA RAYA](https://doi.org/10.36040/jati.v10i1.16613)

**2026 · JATI (Jurnal Mahasiswa Teknik Informatika) · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** combina testes black-box e questionário com 36 usuários para avaliar um site turístico segundo a ISO/IEC 9126.
- **O que levar:** juntar verificação de comportamento observável e percepção do usuário oferece evidências complementares; cada uma responde a perguntas diferentes.

#### [ANALISIS KUALITAS DAN PENERAPAN SOFTWARE QUALITY ASSURANCE PADA APLIKASI CAPCUT MENGGUNAKAN MODEL ISO/IEC 9126](https://doi.org/10.23960/jitet.v14i1.8585)

**2026 · Jurnal Informatika dan Teknik Elektro Terapan · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** avalia o CapCut por seis atributos da ISO/IEC 9126, com análise de recursos e dados de questionário, segundo o resumo indexado.
- **O que levar:** avaliações de produto popular podem ser organizadas por atributo, mas precisam explicitar versão, perfil dos respondentes e instrumento para serem reproduzíveis.

#### [ANALISIS KUALITAS DAN PENERAPAN SOFTWARE QUALITY ASSURANCE PADA APLIKASI GOOGLE CLASSROOM MENGGUNAKAN MODEL ISO/IEC 9126](https://doi.org/10.36040/jati.v10i1.16639)

**2026 · JATI (Jurnal Mahasiswa Teknik Informatika) · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** avaliação quantitativa de seis atributos ISO/IEC 9126 do Google Classroom, baseada em questionário com 60 usuários.
- **O que levar:** um modelo de qualidade permite tornar percepções de usuário comparáveis por atributo. A avaliação é localizada e não substitui testes técnicos nem representa todas as versões e contextos de uso.

#### [Evaluating the Effectiveness of Barangay Management System for Local Governance using Software Quality Model of ISO 25010:2011](https://doi.org/10.64612/ijiv.v2i3.72)

**2026 · International Journal of Interdisciplinary Viewpoints · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** avalia um sistema de gestão pública local por meio de opiniões de usuários e avaliação técnica baseada na ISO/IEC 25010:2011.
- **Resultado reportado:** usuários e especialistas atribuíram avaliações favoráveis a atributos como adequação funcional, usabilidade, confiabilidade e eficiência. O resumo não fornece base para generalizar além do sistema estudado.
- **O que levar:** combinar perspectivas de uso e avaliação técnica, registrando quem avaliou cada atributo.

#### [Identifying Software Quality Attributes Relevant for Very Small Entities](https://doi.org/10.14483/23448350.24627)

**2026 · Revista Científica · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** estudo exploratório sobre atributos e práticas de qualidade relevantes para micro e pequenas entidades, relacionado ao ISO/IEC 29110 e à adequação de modelos como ISO/IEC 25010.
- **O que levar:** modelos de qualidade precisam caber na capacidade e no contexto da equipe; adaptar o conjunto de atributos é mais útil do que aplicar uma lista extensa sem priorização.

#### [Implementation of Information System and Software Quality Testing in Company Operational Applications Based on ISO/IEC 25010 (Case Study: PT Snapdev Digital Indonesia)](https://doi.org/10.37012/jtik.v12i1.3294)

**2026 · Jurnal Teknologi Informatika dan Komputer · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** aplica sete características da ISO/IEC 25010 a aplicações operacionais de uma empresa.
- **Resultado reportado:** os aspectos avaliados ficaram entre 79% e 83%, segundo a escala adotada pelo estudo.
- **O que levar:** critérios padronizados ajudam a organizar avaliação, mas percentuais só são interpretáveis com instrumento, amostra e regra de aprovação explícitos.

#### [Integrated Methodological Model for Software Quality Assessment for Systems Important to NPP Safety: From Theory to Implementation Practice](https://doi.org/10.1109/ICIEAM69213.2026.11549731)

**2026 · International Conference on Industrial Engineering, Applications and Manufacturing · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** propõe avaliação integrada de software importante para segurança nuclear, combinando verificação formal, detecção de anomalias, gêmeos digitais, DevSecOps e auditoria independente de V&V.
- **Resultado reportado:** o resumo relata aumento de 27–45% em indicadores de identificação de riscos no projeto estudado. É resultado contextual do caso descrito, não uma garantia geral.
- **O que levar:** sistemas críticos pedem evidências em várias etapas do ciclo de vida, com rigor proporcional à categoria de segurança.

#### [Sensitivity Analysis of Weight Normalization Schemes in McCall-Based Software Quality Measurement](https://doi.org/10.59562/jessi.v7i3.11711)

**2026 · Journal of Embedded Systems, Security and Intelligent Systems · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** testa como diferentes intervalos de normalização e arredondamentos alteram a pontuação agregada do modelo de McCall.
- **O que levar:** pesos e regras de agregação podem mudar a classificação final mesmo mantendo o sistema e os critérios. Documentar as escolhas e testar sensibilidade é parte da avaliação.

#### [SOFTWARE QUALITY MODEL FOR TUNING THE CLASS OF POLYHARMONIC ACOUSTIC SIGNAL GENERATION SYSTEMS](https://doi.org/10.65237/2336-3630-2026-7(1)-8)

**2026 · STREDOEVROPSKY VESTNiK PRO VEDU А VYZKUM · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** pelo título, propõe um modelo de qualidade para uma classe específica de sistemas de geração de sinais acústicos.
- **Limite da síntese:** o índice não contém resumo. Não é possível afirmar quais critérios, método ou resultados foram apresentados; consultar o texto integral antes de usar como evidência.

#### [THE ROLE OF SOFTWARE QUALITY IN MODERN LOGISTICS PROCESSES: AN ANALYSIS BASED ON THE ISO/IEC 25010:2023 STANDARD](https://doi.org/10.58952/zriut202601117j)

**2026 · Proceedings of International University Travnik · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** discute como as características de qualidade da ISO/IEC 25010:2023 se relacionam a sistemas de logística.
- **O que levar:** traduzir atributos do modelo para necessidades operacionais do domínio, como compatibilidade, confiabilidade, eficiência, segurança e interação, em vez de avaliar software em abstrato.

#### [Qualities of Quality: A Tertiary Review of Software Quality Measurement Research](http://arxiv.org/abs/2107.13687v1)

**2021 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Tema e contribuição:** revisão terciária que parte de 7.811 artigos e sintetiza 75 revisões secundárias sobre medição da qualidade.
- **Achados reportados:** organiza cinco perspectivas de qualidade e destaca validade questionável de medidas comuns, avaliação insuficiente de modelos de machine learning e uso de bases antigas.
- **O que levar:** antes de adotar uma métrica, verificar o que ela mede, se foi validada para o contexto e se os dados continuam representativos.

#### [Measuring Software Quality in Use: State-of-the-Art and Research Challenges](http://arxiv.org/abs/1503.06934v1)

**2015 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Tema e contribuição:** organiza desafios para medir qualidade em uso, isto é, qualidade percebida pelo usuário em contexto real, considerando modelos da família ISO SQuaRE.
- **O que levar:** qualidade do produto e qualidade em uso são perspectivas relacionadas, mas não intercambiáveis; a medição precisa considerar usuários, tarefas e ambiente.

#### [A Review of Software Quality Models for the Evaluation of Software Products](http://arxiv.org/abs/1412.2977v1)

**2014 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Tema e contribuição:** revisa modelos de qualidade de produto e discute como a evolução para sistemas baseados em componentes altera a avaliação.
- **O que levar:** escolher o modelo conforme arquitetura, partes interessadas e finalidade da avaliação; reutilização de componentes e configurabilidade trazem dimensões que modelos genéricos podem não cobrir.

#### [Adapting Software Quality Models: Practical Challenges, Approach, and First Empirical Results](http://arxiv.org/abs/1312.1042v1)

**2013 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Tema e contribuição:** apresenta uma abordagem apoiada por ferramenta para adaptar modelos de qualidade ao contexto de uma aplicação.
- **Resultado reportado:** a investigação inicial relata adaptações mais consistentes e apropriadas, com eficiência cerca de oito vezes maior que uma abordagem ad hoc.
- **O que levar:** adaptar com método e critérios explícitos pode ser mais consistente que começar do zero; o fator de eficiência é resultado inicial e deve ser lido no contexto do estudo.


### Predição e localização de defeitos (67)

Esta é a maior pasta. A literatura enfatiza desbalanceamento, mudança entre projetos/versões, qualidade dos rótulos, seleção de métricas e prevenção de vazamento. Medir recall, custo de inspeção, calibração e estabilidade junto à acurácia ajuda a avaliar utilidade real.

[Dossiê completo da pasta](./referencias-qa/predicao-e-localizacao-de-defeitos/dossie-completo.md) · [Índice de referências](./referencias-qa/predicao-e-localizacao-de-defeitos/README.md)

#### [A Bayesian-Optimized Multi-Scale Oversampling Method for Imbalanced Software Defect Prediction](https://doi.org/10.1109/IoTAAI70471.2026.11607716)

**2026 · 2026 8th International Conference on Internet of Things, Automation and Artificial Intelligence (IoTAAI) · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** BO-SCAO combina embeddings CodeT5+, métricas de complexidade e distância multiescala para sintetizar casos minoritários, com otimização bayesiana.
- **Limite:** método proposto; verificar em texto completo se o ganho se mantém em projetos externos e sem vazamento entre treino e teste.

#### [A Hybrid Feature Selection and Ensemble Learning Framework for Software Defect Prediction with Class Imbalance Handling](https://doi.org/10.1109/ICISC69558.2026.11681129)

**2026 · International Conference on Information Security and Cryptology · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** combina filtragem por informação mútua, ensemble soft voting de seis classificadores e SMOTE aplicado apenas ao treino em cinco bases PROMISE.
- **O que levar:** destaca prevenção de vazamento de dados e avaliação em múltiplos projetos; o resumo indexado está truncado antes dos resultados completos.

#### [A multi-level complexity metric suite for software quality measurement and machine learning-based software defect prediction](https://doi.org/10.1016/j.cola.2026.101400)

**2026 · Journal of Computer Languages · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** pelo título, propõe métricas de complexidade em vários níveis para medição de qualidade e previsão de defeitos.
- **Limite:** resumo ausente; não é possível listar métricas ou afirmar validade preditiva.

#### [A novel generative oversampling for software defect prediction](https://doi.org/10.1038/s41598-026-41981-7)

**2026 · Scientific Reports · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** GeNSDP gera amostras minoritárias com modelo generativo leve e as usa em uma rede profunda; avalia datasets NASA/PROMISE.
- **Resultado reportado:** AUC média de 99,1% e F-measure 0,92, com ganhos reportados contra baselines. Valores muito altos exigem examinar divisão dos dados, vazamento, variação entre datasets e reprodução independente.

#### [A Novel Unsupervised Method for Software Defect Prediction Based on Clustering Assumption](https://doi.org/10.1109/ACCESS.2026.3674915)

**2026 · IEEE Access · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** propõe CLA-CA para previsão não supervisionada, buscando limites de decisão por regiões do espaço de atributos.
- **O que levar:** métodos sem rótulo respondem à falta de histórico rotulado, mas devem ser avaliados em bases externas e comparados em condições equivalentes. Resumo não traz métricas finais completas.

#### [A transformer-based stacked ensemble framework for software defect prediction](https://doi.org/10.1007/s10115-026-02696-3)

**2026 · Knowledge and Information Systems · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** pelo título, empilha modelos transformer para previsão de defeitos.
- **Limite:** resumo ausente; consultar artigo para arquitetura, datasets e comparação.

#### [Adaptive Intuitionistic Fuzzy K-Nearest Neighbors for Software Defect Prediction](https://doi.org/10.1007/978-981-92-5644-0_26)

**2026 · Lecture Notes in Computer Science · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** adaptação de KNN com lógica fuzzy intuicionista aplicada à previsão de defeitos.
- **Limite:** resumo ausente; confirmar representação, conjuntos de dados e comparação experimental antes de ensinar como técnica eficaz.

#### [Adaptive Just-in-Time software defect prediction using unsupervised concept drift detection](https://doi.org/10.1007/s11219-026-09784-1)

**2026 · Software Quality Journal · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** adaptação da previsão JIT a mudanças na distribuição dos dados por detecção não supervisionada de concept drift.
- **Limite:** resumo ausente; mecanismo, latência e ganhos não podem ser confirmados pelo registro.

#### [An Audit of Machine Learning Experiments on Software Defect Prediction](http://arxiv.org/abs/2601.18477v1)

**2026 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** auditoria de estudos de SDP indexados na Scopus entre 2019 e 2023, avaliando desenho, validação fora da amostra, métricas, inferência estatística e reprodutibilidade.
- **O que levar:** avaliar a qualidade do experimento é tão necessário quanto comparar algoritmos; procurar divisões corretas, estatística apropriada e artefatos reproduzíveis.

#### [An Empirical Study on Deep Learning-based Line-Level Software Defect Prediction](https://doi.org/10.1145/3793302.3793359)

**2026 · IEEE Working Conference on Mining Software Repositories · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** comparação de oito modelos de previsão em nível de linha, em 32 benchmarks de nove projetos, incluindo cenários entre versões e entre projetos.
- **O que levar:** métricas de esforço e localização (por exemplo, defeitos encontrados por fração do código inspecionado) complementam AUC/recall. Conferir o artigo para os resultados de cada cenário.

#### [An Explainable Transformer-Based Framework for Software Defect Prediction Using QLoRA and Semantic Evaluation](https://doi.org/10.25258/ijddt.16.10s.4)

**2026 · International Journal of Drug Delivery Technology · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** propõe transformer ajustado com QLoRA e representação que combina tokens de código e métricas estáticas, em nível de linha, sobre mais de 2,3 milhões de linhas rotuladas.
- **Limite:** o resumo informa configuração e escala, mas não permite julgar qualidade das explicações ou generalização sem consultar avaliação completa.

#### [An Extensive Empirical Investigation of Ensemble Learning for Software Defect Prediction](https://doi.org/10.5220/0014981600004015)

**2026 · International Conference on Evaluation of Novel Approaches to Software Engineering · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** compara sete classificadores individuais e técnicas de ensemble em diferentes datasets, considerando heterogeneidade e desbalanceamento.
- **Limite:** resumo local descreve o desenho, mas não fornece os resultados finais completos; consultar o artigo antes de declarar um vencedor.

#### [An Intelligent Framework for AI-Based Automated Software Testing and Defect Prediction](https://doi.org/10.64917/fems/volume03issue08-04)

**2026 · Frontiers in Emerging Multidisciplinary Sciences · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** arquitetura conceitual que conecta análise de requisito/código, geração e priorização de testes, previsão de risco, feedback do modelo e relatórios.
- **O que levar:** apresenta um fluxo integrado de qualidade proativa, mas o resumo caracteriza síntese/estrutura proposta; não demonstra por si só eficácia operacional.

#### [Balancing Accuracy and Cost: An Adaptive Hybrid Framework for Feature Selection in Software Defect Prediction](https://doi.org/10.1109/COMPSAC69091.2026.00072)

**2026 · Annual International Computer Software and Applications Conference · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** propõe AHMOFS-TLM, seleção multiobjetivo adaptativa, testada com cinco classificadores e 12 datasets.
- **O que levar:** a seleção de atributos envolve custo computacional e qualidade preditiva; comparar apenas acurácia ignora o custo de busca. O resumo fornecido não traz números finais completos.

#### [Benchmarking TabNet, NODE, and FT-Transformer for Software Defect Prediction: An Empirical Comparison and Explainability Analysis](https://doi.org/10.1109/ACCESS.2026.3656247)

**2026 · IEEE Access · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** compara três arquiteturas tabulares no NASA JM1, usa NearMiss para desbalanceamento e inclui análise de explicabilidade.
- **O que levar:** um benchmark de um dataset é evidência localizada; conferir métricas de classe minoritária e a qualidade das explicações além da acurácia.

#### [BioDefect: The First Dataset for Defect Detection in Bioinformatics Software](http://arxiv.org/abs/2605.20788v1)

**2026 · arXiv · Dataset / pacote de replicação**

- **Contribuição:** apresenta uma base dedicada a software de bioinformática, preservando repositórios completos e contexto do código.
- **O que levar:** dados específicos do domínio podem preencher lacunas de benchmarks genéricos; avaliar a qualidade dos rótulos e a representatividade antes de comparar com PROMISE.

#### [CoCo-GAN: CodeBERT-driven collaborative generative adversarial learning for software defect prediction](https://doi.org/10.1007/s11219-026-09747-6)

**2026 · Software quality journal · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** pelo título, combina CodeBERT e aprendizado adversarial generativo para previsão de defeitos.
- **Limite:** resumo ausente; confirmar desenho experimental e evidência antes de resumir benefícios.

#### [Comparative Evaluation of TabKANet with Oversampling and Feature Selection Ablation for Software Defect Prediction](https://doi.org/10.35882/ijeeemi.v8i3.351)

**2026 · Indonesian Journal of Electronics, Electromedical Engineering, and Medical Informatics · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** compara TabKANet com baselines em 12 conjuntos numéricos NASA e mede por ablação o efeito de oversampling e seleção de atributos.
- **O que levar:** a ablação ajuda a separar o ganho da arquitetura do ganho do pré-processamento. Conferir o artigo para resultados e protocolo completos; não atribuir desempenho apenas pelo título.

#### [Considering contextual semantics in domain-adversarial cross-project software defect prediction](https://doi.org/10.1007/s13042-026-03220-3)

**2026 · International Journal of Machine Learning and Cybernetics · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** pelo título, investiga semântica contextual e adaptação adversarial de domínio para previsão entre projetos.
- **Limite:** resumo ausente; método específico e resultados precisam ser conferidos no texto integral.

#### [Cross Project Software Defect Prediction Using Machine Learning with Optimized Feature Selection](https://doi.org/10.1051/e3sconf/202673503005)

**2026 · E3S Web of Conferences · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** combina seleção de atributos PSO com conhecimento de domínio e ADASYN para previsão entre projetos em cinco bases NASA.
- **O que levar:** transferência entre projetos precisa lidar simultaneamente com atributos redundantes, diferenças de distribuição e classes raras; a validação deve manter projetos separados.

#### [Cross-project Software Defect Prediction Using Divergence-based Domain Adaptation Approach](https://doi.org/10.1007/s11518-026-5758-0)

**2026 · Journal of Systems Science and Systems Engineering · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** propõe adaptação de domínio baseada em divergência para transferir modelos entre projetos.
- **Limite:** resumo ausente. A motivação é a diferença de distribuição entre projetos, mas não é possível atribuir desempenho ou superioridade ao método pelo registro.

#### [DA-GWO-AUC: A Defect-Aware and AUC-Preserving Grey Wolf Optimisation Framework for Stable Feature Selection in Software Defect Prediction](https://doi.org/10.5281/zenodo.22124553)

**2026 · Zenodo (CERN European Organization for Nuclear Research) · Relatório ou depósito em repositório**

- **Tema:** pelo título, propõe seleção estável de atributos por Grey Wolf Optimization, com foco em preservar AUC e considerar defeitos.
- **Limite:** resumo ausente; validar protocolo e comparação antes de reutilizar a alegação do título.

#### [Dataset Package: An Empirical Study of Classical Machine Learning Models for Software Defect Prediction Under Early-Stage Data Scarcity](https://doi.org/10.5281/zenodo.22969888)

**2026 · Zenodo (CERN European Organization for Nuclear Research) · Dataset / pacote de replicação**

- **Contribuição:** pacote de dados/estudo sobre modelos clássicos de previsão de defeitos sob escassez de dados inicial, usando PROMISE, desbalanceamento e previsão entre versões.
- **Uso:** útil para discutir limites de treinamento com pouco histórico e importância de avaliar curvas de aprendizagem; o registro é um pacote, não necessariamente um artigo revisado.

#### [Deep Learning vs. Traditional Machine Learning for Software Defect Prediction: A Meta-Analysis](https://doi.org/10.67728/eci.2026.002)

**2026 · Engineering and Computing Insights · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** meta-análise comparando deep learning e machine learning tradicional para previsão de defeitos.
- **Limite:** resumo ausente; conferir critérios de inclusão, heterogeneidade dos estudos e medidas combinadas antes de citar conclusões.

#### [Detecting concept drift in just-in-time software defect prediction using model interpretation](https://doi.org/10.1007/s13198-025-03122-7)

**2026 · International Journal of System Assurance Engineering and Management · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** pelo título, usa interpretação de modelos para detectar mudanças de conceito em previsão JIT.
- **Limite:** resumo ausente; o título não esclarece se explicações melhoram a detecção nem o custo operacional.

#### [Diversity-Stacked Ensemble (DSE): A Heterogeneous Meta-Ensemble Framework for Imbalanced Software Defect Prediction](https://doi.org/10.1109/FET68771.2026.11601511)

**2026 · European Future Technologies Conference and Exhibition · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** meta-ensemble heterogêneo com árvores, KNN e MLP, com pipeline de transformação e seleção de atributos para enfrentar o paradoxo da acurácia.
- **O que levar:** diversidade de modelos pode ser explorada para classes raras, mas deve ser avaliada por recall, F1/MCC e custo, não por acurácia isolada. Resumo não traz resultado final completo.

#### [DP‐GCN: Integrating GraphCodeBERT and GCN With Contrastive Learning for Software Defect Prediction](https://doi.org/10.1002/smr.70116)

**2026 · Journal of Software: Evolution and Process · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** combina representações semânticas/estruturais do GraphCodeBERT, GCN para dependências e aprendizado contrastivo, com foco também em generalização entre projetos.
- **Limite:** resumo descreve motivação e componentes; para afirmar ganho ou custo, verificar resultados e ablações do artigo.

#### [Emerging Patterns and Research Directions on Machine Learning in Software Defect Prediction: A Systematic Literature Review](https://doi.org/10.5220/0014459000004052)

**2026 · International Conference on Agents and Artificial Intelligence · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** revisão de trabalhos de 2015–2025 sobre algoritmos, datasets, seleção de atributos e métricas.
- **Desafios destacados:** desbalanceamento, redundância de atributos e disponibilidade limitada de dados; aponta tendências em explicabilidade e transferência de conhecimento.

#### [ENHANCING SOFTWARE QUALITY THROUGH MACHINE LEARNING DRIVEN DEFECT PREDICTION MODEL](https://doi.org/10.63163/jpehss.v4i1.1640)

**2026 · Physical Education, Health and Social Sciences · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** descreve pipeline de previsão com dados PROMISE, limpeza, balanceamento, normalização e imputação para identificar módulos propensos a defeitos.
- **Limite:** resumo indexado não detalha amostras nem resultados finais; tratar como proposta/estudo aplicado até conferir o texto.

#### [ET-SDP: Enhancing Code Embeddings with Effort-Related and Test Coverage Metrics for Improved Software Defect Prediction](https://doi.org/10.1007/s44427-026-00038-3)

**2026 · Acta Universitatis Sapientiae Informatica · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** amplia embeddings de código com métricas de esforço e cobertura de testes; avalia 15 versões do Calcite e 6 do Apache Ant-Ivy.
- **Resultado reportado:** o resumo relata melhora com menos atributos do que métricas tradicionais. Aplicação depende da disponibilidade e comparabilidade de dados de processo e cobertura.

#### [Evaluating SMOTE-based Class Imbalance Handling in Software Defect Prediction](https://doi.org/10.9734/jamcs/2026/v41i62161)

**2026 · Journal of Advances in Mathematics and Computer Science · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** comparação leakage-safe de regressão logística, Random Forest e KNN no AEEEM_JDT, com métricas sensíveis ao desbalanceamento.
- **Resultado reportado:** SMOTE melhora medidas baseadas em limiar para RF e KNN; quase não muda F1 da regressão logística e reduz MCC. A escolha depende do algoritmo e da métrica.

#### [Evaluating Software Defect Prediction Models via the Area Under the ROC Curve Can Be Misleading](http://arxiv.org/abs/2604.20742v1)

**2026 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** questiona se AUC resume adequadamente modelos de previsão de módulos defeituosos e analisa pontos operacionais das curvas ROC.
- **O que levar:** AUC agrega limiares que talvez não sejam usados na prática; escolher métricas alinhadas à capacidade de inspeção e ao custo de falsos positivos/negativos.

#### [Evolution of Ensemble Learning in Software Defect Prediction: A Systematic Literature Review](https://doi.org/10.1109/ACCESS.2026.3710498)

**2026 · IEEE Access · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** revisão sistemática da evolução de ensembles em SDP, cobrindo famílias de combinação e sua relação com estabilidade e confiabilidade.
- **O que levar:** ensemble não é uma técnica única; avaliar diversidade, robustez e comparação com modelos-base. Verificar protocolo e achados detalhados na publicação.

#### [Explainable deep learning for software defect prediction: a residual-shuffle network approach with SHAP and LIME](https://doi.org/10.1007/s41060-025-00987-6)

**2026 · International Journal of Data Science and Analysis · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** pelo título, combina uma rede residual-shuffle com explicações SHAP e LIME para SDP.
- **Limite:** resumo ausente; não assumir que usar ferramentas de explicação garante explicações estáveis ou compreensíveis.

#### [Explainable Machine Learning for Software Defect Prediction in Large-Scale Code Repositories Using Code Embeddings and Repository-Level Knowledge Graphs](https://doi.org/10.64137/31079458/ijcsei-v2i2p102)

**2026 · International Journal of Computer Science and Engineering Innovations · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição proposta:** arquitetura de larga escala que junta embeddings de código, grafo do repositório e sinais de dependências, testes, builds, ownership e histórico, com mecanismos de explicação.
- **Limite:** o resumo descreve uma arquitetura de ciclo de vida; separar proposta arquitetural de validação empírica ao citar.

#### [Gradient-Guided Adversarial Data Augmentation with Genetic Optimization for Imbalanced Software Defect Prediction](https://doi.org/10.1145/3806980.3807093)

**2026 · Proceedings of the 2026 International Conference on Big Data and Informatization Education · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** GPDA usa gradientes e otimização genética para gerar dados adversariais para classes minoritárias.
- **Resultado reportado:** o resumo afirma melhora de AUC média em comparação com técnicas de aumento de dados; faltam números no registro local para quantificar o efeito.

#### [HGFE: A plug-and-play heterogeneous graph feature enhancement framework for software fault localization](https://doi.org/10.1007/s11219-026-09786-z)

**2026 · Software Quality Journal · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** pelo título, propõe aprimorar atributos em grafos heterogêneos para localização de falhas.
- **Limite:** resumo ausente; não é possível descrever tipos de nós, benchmark ou precisão obtida.

#### [Hybrid Approach to Software Defect Prediction and Classification using a Variational Autoencoder and Scalable Graph Attention Network](https://doi.org/10.37965/jait.2026.0878)

**2026 · Journal of Artificial Intelligence and Technology · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** combina VAE, rede de atenção em grafo e subamostragem orientada a ranking para lidar com desbalanceamento e representações estruturadas.
- **Limite:** o resumo descreve a arquitetura e problemas-alvo, mas não fornece aqui resultados comparativos suficientes para concluir superioridade.

#### [IMPACT OF SOFTWARE PROCESS METRICS ON DEFECT DETECTION EFFICIENCY: A COMPARATIVE STUDY WITHIN ADVANCED SOFTWARE QUALITY ASSURANCE FRAMEWORKS](https://doi.org/10.63878/cjssr.v4i1.2003)

**2026 · Contemporary Journal of Social Science Review · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** revisão comparativa de estudos de 2015–2025 sobre métricas de processo e eficiência de detecção de defeitos.
- **O que levar:** métricas de mudança, esforço e atividade podem complementar métricas do produto; por ser uma síntese secundária, conferir escopo e critérios antes de tratar associações como causalidade.

#### [Interpretable Software Defect Prediction with Ensemble Models Across Static and Process Metrics](https://doi.org/10.1007/978-3-032-36868-3_31)

**2026 · Lecture notes in computer science · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** combina ensembles e métricas estáticas/de processo para previsão interpretável.
- **Limite:** resumo ausente; não se conhecem os métodos de explicação nem a evidência de interpretabilidade pelo registro.

#### [KG-Commit: A Dynamic Knowledge Graph for Online Just-in-Time Software Defect Prediction](http://arxiv.org/abs/2609.06272v1)

**2026 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** grafo de conhecimento dinâmico que atualiza histórico do repositório, estrutura AST e semântica de commits; inferência leve em CPU para previsão JIT.
- **Resultado reportado:** em 11 projetos Apache, relata Macro-F1 0,704, G-Mean 0,706 e AUC 0,809 no pipeline selecionado. São resultados do benchmark descrito, não promessa de desempenho em qualquer repositório.

#### [Machine Learning and Evolutionary Computing Techniques for Software Defect Prediction: A Systematic Review and Comparative Analysis](https://doi.org/10.48175/ijarsct-37226)

**2026 · International Journal of Advanced Research in Science, Communication and Technology · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** revisão sistemática/comparativa de técnicas de ML e computação evolutiva para previsão de defeitos.
- **O que levar:** útil como mapa de famílias de métodos e dados; conferir período, protocolo de revisão e evidências primárias antes de extrair ranking de algoritmos.

#### [Machine Learning-Based Software Defect Prediction and Its Application: A Systematic Review](https://doi.org/10.65997/bitm3382)

**2026 · AGE Journal of Science · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** revisão recente que classifica algoritmos, datasets, métricas de avaliação e domínios em previsão de defeitos baseada em ML.
- **O que levar:** usar para mapear tendências e limitações; checar protocolo de busca e estudos incluídos antes de apoiar decisões técnicas em suas conclusões.

#### [MSTDP: a multi-scale temporal deep learning framework for just-in-time software defect prediction with cross-attention fusion](https://doi.org/10.1007/s44443-025-00401-y)

**2026 · Journal of King Saud University: Computer and Information Sciences · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição proposta:** combina padrões de commits em escalas horárias, diárias e semanais com semântica de código, comportamento de desenvolvedores e atenção cruzada; considera concept drift.
- **Limite:** resumo descreve a arquitetura; consultar resultados para confirmar robustez e custo.

#### [Project-Aware Validation in Software Defect Prediction: A Controlled Simulation and Real-World Benchmark Study of Evaluation Optimism](https://doi.org/10.21203/rs.3.rs-10975428/v1)

**2026 · Research Square · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Tema:** pelo título, analisa otimismo na avaliação de previsão de defeitos com validação sensível ao projeto e benchmark real.
- **Limite:** resumo não disponível; não inferir tamanho do viés nem recomendar protocolo específico sem consultar o manuscrito.

#### [Quality Assurance of Software Incorporating Graph Neural Networks for Defect Prediction](https://doi.org/10.1002/9781394422791.ch21)

**2026 · Origem não informada · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** pelo título, trata de garantia de qualidade com redes neurais em grafos para previsão de defeitos.
- **Limite:** resumo ausente e metadados de venue incompletos no índice; usar apenas após verificar a publicação e o texto.

#### [Quantum Data Encoding Techniques for Software Defect Prediction: A Resource-Aware Evaluation](https://doi.org/10.1007/978-3-032-36816-4_14)

**2026 · Communications in computer and information science · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** avalia codificações de dados quânticos para previsão de defeitos considerando recursos computacionais.
- **Limite:** resumo ausente. O título não prova vantagem frente a métodos clássicos nem viabilidade em hardware real.

#### [Quantum-Inspired Deep Learning for Automated Software Defect Prediction: A Hybrid QLSTM-GCN Approach](https://doi.org/10.1007/s44196-026-01534-2)

**2026 · International Journal of Computational Intelligence Systems · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição proposta:** combina QLSTM para sequências temporais e GCN para relações estruturais entre módulos, mirando métricas de alta dimensão e classes desbalanceadas.
- **Limite:** o resumo fornecido descreve motivação e arquitetura, sem resultados suficientes para concluir vantagem prática ou benefício quântico.

#### [Replication Package: How Reliable Are Explanations in Cross-Project Software Defect Prediction? An Empirical Study of Stability and Robustness](https://doi.org/10.5281/zenodo.22721707)

**2026 · Zenodo (CERN European Organization for Nuclear Research) · Dataset / pacote de replicação**

- **Contribuição:** pacote de replicação com código, saídas, rankings SHAP, análises e experimentos de perturbação para estudar estabilidade de explicações em previsão entre projetos.
- **O que levar:** o pacote não inclui as bases PROMISE/Jureczko originais nem o manuscrito. As saídas não são os dados brutos; use-o como artefato experimental e consulte o artigo associado para as conclusões.

#### [Self-Adaptive Parameter Control in Differential Evolution Based on Optimizing Undersampling Strategies for Software Defect Prediction](https://doi.org/10.5220/0014959700004015)

**2026 · International Conference on Evaluation of Novel Approaches to Software Engineering · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** integra LTRUS a variantes de Differential Evolution para ajustar dinamicamente pesos de ranking; avalia três classificadores com validação cruzada e métricas além de AUC.
- **O que levar:** parâmetros de subamostragem também afetam resultados; comparar MCC, precisão e recall ajuda a evitar conclusão baseada somente em AUC.

#### [Software Defect Prediction Dataset: 296,457 Code File Instances from Five Open-Source Repositories (Elasticsearch, Spring Boot, Hadoop, Kafka, Express)](https://doi.org/10.5281/zenodo.19682732)

**2026 · Zenodo (CERN European Organization for Nuclear Research) · Dataset / pacote de replicação**

- **Contribuição:** dataset de 296.457 arquivos em cinco repositórios, com métricas de processo e rótulos binários inferidos por palavras-chave em commits.
- **O que levar:** escala e diversidade podem ampliar estudos, mas a rotulagem heurística de mensagens de commit pode introduzir ruído. A versão 2 corrige erro em idade de arquivo e atualiza registros; cite a versão usada.

#### [Software Defect Prediction Models: Technical Evolution, Performance Comparison, and Future Directions](https://doi.org/10.1109/ICEAAI68945.2026.11442359)

**2026 · 2026 2nd International Conference on Electrical Automation and Artificial Intelligence (ICEAAI) · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Contribuição:** organiza a evolução de modelos tradicionais para engenharia de atributos e deep learning/fusões, comparando escala, desbalanceamento, generalização e custo de engenharia.
- **O que levar:** modelos têm limites de aplicação diferentes; o custo e o cenário de validação devem acompanhar a comparação de desempenho.

#### [Software Defect Prediction Using Machine Learning: A Comparative Analysis of Ensemble and Neural Classification Algorithms](https://doi.org/10.5281/zenodo.22303726)

**2026 · Zenodo (CERN European Organization for Nuclear Research) · Relatório ou depósito em repositório**

- **Contribuição:** compara seis ensembles e um MLP raso em métricas estáticas de quatro conjuntos NASA/PROMISE, com reamostragem SMOTE apenas no treino.
- **Resultado reportado:** XGBoost lidera no estudo (89,4% de acurácia e F1 85,1%); o MLP não supera os ensembles de árvore nos volumes avaliados. A conclusão é específica ao protocolo e aos dados usados.

#### [Understanding Software Defect Prediction: A Large-scale Empirical Study Across Uncertainty Quantification and Performance Evaluation](http://arxiv.org/abs/2607.01842v1)

**2026 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** estuda cinco métricas de incerteza, seis métricas de desempenho, três de calibração e 16 classificadores em cenários intra e entre projetos.
- **Achado reportado:** relações entre incerteza e desempenho dependem do cenário. Na prática, confiança prevista não deve ser tratada como substituto de calibração e validação no contexto.

#### [Validation-Controlled Model Selection and Soft Ensembling for Imbalanced Software Defect Prediction: A Repeated Within- and Cross-Project Evaluation](https://doi.org/10.1007/978-3-032-39708-9_9)

**2026 · Communications in Computer and Information Science · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema:** seleção de modelos controlada por validação e combinação soft para dados desbalanceados, em cenários intra e entre projetos.
- **Limite:** resumo ausente; o título sinaliza desenho comparativo repetido, mas não informa resultados.

#### [XMENTOR: A Rank-Aware Aggregation Approach for Human-Centered Explainable AI in Just-in-Time Software Defect Prediction](http://arxiv.org/abs/2602.22403v2)

**2026 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** agrega explicações LIME/SHAP/BreakDown em uma visualização ordenada e implementada como plugin de VS Code.
- **Resultado reportado:** quase 90% dos participantes preferiram as explicações agregadas. É uma preferência de estudo com usuários, não prova de que as explicações sejam corretas ou reduzam defeitos.

#### [Breaking New Ground in Software Defect Prediction: Introducing Practical and Actionable Metrics with Superior Predictive Power for Enhanced Decision-Making](http://arxiv.org/abs/2508.04408v1)

**2025 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** investiga métricas baseadas em hábitos de programação de desenvolvedores para prever defeitos em nível de método, comparando-as com métricas de código e histórico.
- **O que levar:** sinais humanos/processuais podem tornar previsões mais acionáveis; considerar privacidade, viés e uso responsável dessas métricas. Conferir a publicação para evidência e contexto.

#### [Contrasting the Hyperparameter Tuning Impact Across Software Defect Prediction Scenarios](http://arxiv.org/abs/2510.16665v1)

**2025 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** compara o impacto de tuning entre previsão dentro de versões e entre versões.
- **O que levar:** benefício de ajuste de hiperparâmetros pode variar por cenário; tuning precisa ocorrer dentro do treino/validação, sem contaminar o teste final.
- **Limite:** resumo local não inclui resultados quantitativos.

#### [Critical Considerations on Effort-aware Software Defect Prediction Metrics](http://arxiv.org/abs/2504.19181v1)

**2025 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** demonstra que resultados de métricas effort-aware dependem da medida usada como proxy do esforço de inspeção, questionando a suposição de proporcionalidade com LOC.
- **O que levar:** definir esforço operacionalmente e testar sensibilidade à proxy escolhida; rankings de modelos podem mudar com essa escolha.

#### [From Illusion to Insight: Change-Aware File-Level Software Defect Prediction Using Agentic AI](http://arxiv.org/abs/2512.23875v1)

**2025 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** reformula previsão por arquivo para raciocinar sobre mudanças entre versões e usa debate multiagente com LLM.
- **Achado reportado:** argumenta que persistência de rótulos pode inflar F1 tradicional e esconder transições raras. Útil para discutir validade do alvo e do split; verificar resultados e replicação no preprint.

#### [Multimodal Learning for Just-In-Time Software Defect Prediction in Autonomous Driving Systems](http://arxiv.org/abs/2502.20806v1)

**2025 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição proposta:** combina texto, métricas numéricas/categóricas e contexto em um modelo multimodal para previsão JIT em software automotivo/autônomo.
- **Limite:** o resumo descreve a arquitetura; sistemas de direção autônoma exigem validação de segurança e evidência mais forte que um benchmark preditivo isolado.

#### [ReDef: Do Code Language Models Truly Understand Code Changes for Just-in-Time Software Defect Prediction?](http://arxiv.org/abs/2509.09192v2)

**2025 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** apresenta dataset de modificações em funções C/C++ de 22 projetos, com defeitos ancorados em reversões e casos limpos verificados posteriormente.
- **Dados reportados:** 3.164 modificações defeituosas e 10.268 limpas, com triagem assistida por GPT e auditorias. O foco é também testar se modelos de código entendem mudanças, não apenas texto/código isolado.

#### [Software Defect Prediction using Autoencoder Transformer Model](http://arxiv.org/abs/2510.10840v1)

**2025 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição proposta:** ADE-QVAET combina otimização por evolução diferencial, autoencoder variacional quântico e transformer para aprender representações e dependências sequenciais.
- **Limite:** o resumo afirma desempenho alto, mas o registro não fornece comparações e métricas suficientes para avaliar essa alegação.

#### [When Data Quality Issues Collide: A Large-Scale Empirical Study of Co-Occurring Data Quality Issues in Software Defect Prediction](http://arxiv.org/abs/2512.17460v1)

**2025 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** estuda em 374 datasets a coocorrência de desbalanceamento, sobreposição, atributos irrelevantes, ruído e outliers, com cinco classificadores.
- **O que levar:** problemas de dados interagem; tratar cada um isoladamente pode ocultar efeitos conjuntos. Resultados dependem das configurações e dos benchmarks analisados.

#### [Feature Importance in the Context of Traditional and Just-In-Time Software Defect Prediction Models](http://arxiv.org/abs/2411.05230v1)

**2024 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** compara importância de atributos em previsão tradicional e JIT no Apache Camel; o resumo relata redes profundas e algoritmos de ML como modelos avaliados.
- **O que levar:** importância é dependente do cenário/modelo e não prova causalidade. O registro menciona acurácias de 80% e 86% para deep learning e AUC, mas está truncado; verificar o texto antes de associar os números a cada cenário.

#### [Quantum vs. Classical Machine Learning Algorithms for Software Defect Prediction: Challenges and Opportunities](http://arxiv.org/abs/2412.07698v1)

**2024 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição:** compara três algoritmos de machine learning quântico e cinco clássicos em 20 datasets de defeitos.
- **O que levar:** comparar qualidade preditiva junto a recursos, codificação e limitações de hardware; o rótulo “quântico” não implica vantagem prática. Conferir resultados detalhados.

#### [SDPERL: A Framework for Software Defect Prediction Using Ensemble Feature Extraction and Reinforcement Learning](http://arxiv.org/abs/2412.07927v2)

**2024 · arXiv · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Contribuição proposta:** extrai sinais semânticos/estruturais com cinco modelos pré-treinados e usa PPO, espaço de embeddings e mecanismo inspirado em ACO para seleção de atributos.
- **Limite:** consultar o artigo para saber estabilidade, custo e comparação; o resumo não basta para concluir que RL é melhor que seleção convencional.


### Processos, requisitos e formação em QA (8)

Requisitos claros, trabalho integrado ao fluxo ágil e capacitação apoiam prevenção de defeitos. Métricas de processo são sinais contextuais e não devem ser confundidas com qualidade do produto ou usadas isoladamente para avaliar pessoas.

[Dossiê completo da pasta](./referencias-qa/processos-requisitos-e-formacao-em-qa/dossie-completo.md) · [Índice de referências](./referencias-qa/processos-requisitos-e-formacao-em-qa/README.md)

#### [A Multidimensional Decision-Support Framework for Software Quality Assessment in Agile Projects](https://doi.org/10.3390/info17070624)

**2026 · Inf. · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** propõe o Overall Software Quality Index (OSQI), reunindo qualidade do código, do processo e da equipe em um apoio à decisão para projetos ágeis.
- **O que levar:** uma visão de qualidade pode combinar dimensões técnicas e organizacionais, desde que seus indicadores e pesos sejam transparentes.
- **Limite:** o resumo relata uma proposta inicial e aponta limitações dos dados industriais para sistemas críticos; não assumir validação universal.

#### [Bugs in a Perfect Substrate: An Ontology of Software Defects](https://doi.org/10.5281/zenodo.20232955)

**2026 · Zenodo (CERN European Organization for Nuclear Research) · Relatório ou depósito em repositório**

- **Tema e contribuição:** questiona se conceitos de defeito e métricas herdados da manufatura descrevem bem software, cujo comportamento depende de estados, contexto e execução.
- **O que levar:** ao definir métricas de defeito, explicitar o evento observado e o contexto. “Defeito” pode representar uma expectativa que falha quando exercitada, e não apenas uma propriedade estática do artefato.
- **Limite:** trabalho conceitual; não deve ser apresentado como validação empírica de uma nova métrica.

#### [Designing a Requirements Engineering Model to Achieve Software Quality](https://doi.org/10.56961/mejeit.v5i1.1443)

**2026 · مجلة منار الشرق للتربية و تكنولوجيا التعليم · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** propõe um processo estruturado para especificar requisitos diante de ambiguidade entre clientes, usuários e equipe.
- **O que levar:** requisitos claros precisam registrar necessidade, critérios verificáveis e validação com as partes interessadas.
- **Limite:** o resumo menciona questionários, mas não fornece detalhes suficientes para julgar desenho, amostra ou força dos resultados.

#### [Designing Software Quality Assurance Framework Integrated With Scrum And Rsm For Multi-Project](https://doi.org/10.70184/3ejnrd38)

**2026 · Vifada Management and Social Sciences · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** propõe integrar Scrum e o método RSM (Recognize, Scrutinize, Materialize) para lidar com mudanças de contexto, prioridades ambíguas e dívida técnica em vários projetos.
- **Resultado reportado:** nove Scrum Masters avaliaram o framework; o resumo informa 99,02% de respostas positivas, mas também concordância entre avaliadores baixa (Gwet AC2 = 0,2279).
- **O que levar:** inserir qualidade no fluxo e nas decisões do time é útil; a avaliação pequena e a concordância limitada pedem cautela antes de tratar o framework como comprovado.

#### [Innovative research and practice of software quality assurance and testing curriculum based on inquiry-oriented teaching](https://doi.org/10.1007/s13198-026-03271-3)

**2026 · International Journal of System Assurance Engineering and Management · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** pelo título, aborda currículo de SQA e testes com ensino orientado por investigação.
- **Limite da síntese:** não há resumo indexado. É possível inferir o assunto, mas não descrever práticas pedagógicas ou resultados sem consultar o texto integral.

#### [RECONNAISSANCE OF THE INTERDEPENDENCE AMONG REQUIREMENT CLARITY, SPRINT EFFICIENCY, AND SOFTWARE QUALITY: A CONCEPTUAL FRAMEWORK APPROACH](https://doi.org/10.15282/ijsecs.12.1.2026.1.0147)

**2026 · International Journal of Software Engineering and Computer Systems · Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)**

- **Tema e contribuição:** estrutura relações propostas entre clareza de requisitos, eficiência de sprint e qualidade, usando índices de volatilidade de requisitos, velocidade, densidade de defeitos e qualidade.
- **O que levar:** validar requisitos antes e durante o desenvolvimento pode reduzir interpretações divergentes e retrabalho; velocidade isolada não é medida suficiente de qualidade.
- **Limite:** o próprio resumo descreve um modelo teórico. Trate as relações como hipóteses a verificar no contexto do time.

#### [Systems and software Quality Requirements and Evaluation: Product quality model](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010)

**2023 · ISO/IEC 25010 · Referência acadêmica curada (verificar tipo)**

- **Tipo e contribuição:** referência normativa ISO/IEC 25010:2023 para o modelo de qualidade de produto de sistemas e software.
- **O que levar:** usar características e subcaracterísticas como vocabulário para requisitos e avaliação; selecionar as relevantes ao produto e traduzi-las em critérios verificáveis. A norma não substitui estratégia de teste nem define, sozinha, limites de aprovação.

#### [Quality Engineering for Agile and DevOps teams](https://www.tmap.net/)

**2020 · TMap body of knowledge · Norma, corpo de conhecimento ou referência técnica**

- **Tipo e contribuição:** referência prática do corpo de conhecimento TMap sobre engenharia de qualidade em equipes ágeis e DevOps.
- **O que levar:** integrar estratégia de teste, análise baseada em risco, automação, exploração e feedback contínuo ao fluxo de entrega, em vez de deixar a qualidade para uma etapa final.
- **Limite:** guia profissional, não estudo experimental; adaptar práticas ao risco, produto e maturidade do time.


### Segurança e validação de sistemas (1)

A evidência desta pasta é pequena e inclui um registro sem resumo. O tema exige evidências rastreáveis, validação reproduzível e avaliação proporcional ao risco; confirmar o artigo integral antes de adotar recomendações técnicas.

[Dossiê completo da pasta](./referencias-qa/seguranca-e-validacao-de-sistemas/dossie-completo.md) · [Índice de referências](./referencias-qa/seguranca-e-validacao-de-sistemas/README.md)

#### [A Secure Offline Edge Architecture for Wearable Vision Assistance: Raspberry Pi-ESP32-CAM Integration and Reproducible Software Validation](https://doi.org/10.21203/rs.3.rs-10891677/v1)

**2026 · Research Square · Preprint / manuscrito em repositório (status editorial não inferido)**

- **Tema sugerido pelo título:** arquitetura de assistência visual vestível que integra Raspberry Pi e ESP32-CAM, com operação offline e validação de software reproduzível.
- **Limite da síntese:** o registro não contém resumo. Não há base indexada para afirmar controles de segurança, protocolo de validação ou resultados. A leitura do artigo completo é necessária antes de usar como referência técnica.

## Como usar este resumo

Use a síntese transversal para navegar pelos temas e as seções individuais para localizar a contribuição ou limitação de um registro. Para detalhes bibliográficos e resumo original, abra o dossiê da pasta. Para uma citação acadêmica, confirme título, autoria, venue, DOI, versão e status editorial na fonte primária.

[Índice bibliográfico completo](./INDICE_ARTIGOS_CIENTIFICOS_QA.md) · [Índice de pastas](./referencias-qa/README.md)
