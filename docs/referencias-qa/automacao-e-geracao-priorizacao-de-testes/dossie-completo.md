# Dossiê completo: Automação e geração/priorização de testes

**6 registros.** Este arquivo reúne os metadados disponíveis na biblioteca local, o resumo/abstract registrado e os pontos importantes da síntese editorial de cada trabalho. Os resumos permanecem na língua e na forma em que foram indexados; ausência de resumo ou de metadados é indicada explicitamente.

Snapshot dos metadados: **2026-09-29T15:55:26.540Z**. Classificação do tópico e tipo de registro são editoriais; confira a fonte primária antes de citar ou aplicar resultados.

[Voltar às referências da pasta](./README.md) · [Resumo geral de toda a biblioteca](../../RESUMO_GERAL_ARTIGOS_QA.md) · [Síntese dos pontos importantes](./sintese-artigos.md)

## AI-Driven Autonomous Test Automation Frameworks for Cloud Native Applications: Improving Software Reliability and Continuous Delivery

- **Autores:** Ihor Diakonov
- **Ano / data de publicação:** 2026 / 2026-09-02
- **Origem ou publicação:** Journal of Artificial Intelligence General science (JAIGS) ISSN:3006-4023
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Automação e geração/priorização de testes; Confiabilidade e resiliência; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-60087-jaigs-v10i01-495
- **DOI:** [https://doi.org/10.60087/jaigs.v10i01.495](https://doi.org/10.60087/jaigs.v10i01.495)
- **URL registrada:** [https://doi.org/10.60087/jaigs.v10i01.495](https://doi.org/10.60087/jaigs.v10i01.495)
- **Consulta que encontrou o registro:** software maintainability reliability
- **Data de descoberta:** 2026-09-02T13:42:31.786Z

### Resumo registrado

Cloud native applications are built and released through continuous integration and continuous delivery pipelines that call for fast feedback and frequent deployment. Traditional test automation, which depends on scripts that are written once and maintained by hand, was never really designed for this pace of change. When a microservice is redeployed, refactored, or scaled several times a day, the scripts that were written to test it tend to fall behind, and quality assurance teams end up spending more time repairing tests than writing new ones. This paper looks at how artificial intelligence can be used to build a test automation framework that adjusts itself as the application changes, rather than breaking every time something moves. We describe a framework, referred to here as AutoQA CN, that brings together three capabilities: automatic generation of new test cases from API specifications and usage data, self-healing of broken test scripts through similarity-based and learned matching, and risk-based prioritisation of test execution using a reinforcement learning agent. The framework is built to sit alongside existing continuous integration tooling in a containerised environment rather than replace it outright. We evaluate the approach through an illustrative case study across three representative microservice scenarios and compare it with a conventional scripted automation baseline on three measures: maintenance effort, time to detect faults, and pipeline throughput. The results point to meaningful reductions in maintenance work and faster fault detection, along with a modest gain in throughput. We close by discussing where these gains are likely to hold up in practice, where the approach still needs human oversight, and what would need to happen for a framework like this to be trusted in production settings.

### Pontos importantes para leitura

**Autor / origem:** Ihor Diakonov · Journal of Artificial Intelligence General Science, 2026 · [DOI](https://doi.org/10.60087/jaigs.v10i01.495)

- **O que aborda:** Apresenta o AutoQA CN: geração de testes a partir de APIs e uso, reparo de scripts e priorização de execução por risco com reinforcement learning.
- **O que importa:** O resumo relata um estudo ilustrativo em três cenários de microsserviços, com redução de esforço de manutenção, detecção mais rápida e ganho modesto de throughput frente a scripts convencionais.
- **Uso no roadmap:** Serve para discutir automação adaptativa, mas reforça a necessidade de comparar custo de manutenção, tempo de detecção e throughput.
- **Cautela:** O resumo não detalha tamanho da amostra, protocolo ou significância; os ganhos são alegações do estudo, não uma garantia para outros produtos.

---

## AI-Powered Test Automation Frameworks for Next-Generation Software Quality Engineering

- **Autores:** Dr. Tomas Kazlauskas
- **Ano / data de publicação:** 2026 / 2026-08-18
- **Origem ou publicação:** The American Journal of Engineering and Technology
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Automação e geração/priorização de testes; IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-37547-tajet-volume08issue08-03
- **DOI:** [https://doi.org/10.37547/tajet/volume08issue08-03](https://doi.org/10.37547/tajet/volume08issue08-03)
- **URL registrada:** [https://doi.org/10.37547/tajet/volume08issue08-03](https://doi.org/10.37547/tajet/volume08issue08-03)
- **Consulta que encontrou o registro:** software product quality
- **Data de descoberta:** 2026-08-18T09:50:09.710Z

### Resumo registrado

Agile software development emphasizes rapid iteration, continuous integration, frequent releases, and incremental delivery, making regression testing a central software quality challenge. Conventional regression testing approaches often depend on manually selected test suites, static prioritization rules, and repeated execution of tests that provide limited incremental fault-detection value. This paper develops a conceptual intelligent regression testing framework that applies artificial intelligence (AI) techniques to test selection, prioritization, execution, failure classification, and continuous learning within Agile development pipelines. The methodological foundation combines supervised learning, representation learning, historical test-result analysis, change-impact assessment, and feedback-driven optimization. Because the supplied literature primarily concerns AI-based detection and classification in biomedical signal-processing applications rather than software testing, the paper explicitly treats these studies as methodological evidence for transferable AI patterns rather than direct empirical evidence for regression testing. The framework consequently emphasizes feature extraction, automated classification, adaptive prediction, and real-time decision support. A conceptual evaluation indicates that AI-assisted regression testing can improve the alignment between code changes and test execution priorities, reduce redundant execution, and create feedback loops capable of adapting to changing Agile projects. However, model drift, insufficient historical data, explainability, false prioritization, and integration complexity remain significant constraints. The analysis positions intelligent regression testing as an adaptive decision-support layer rather than a complete replacement for conventional testing practices.

### Pontos importantes para leitura

**Autor / origem:** Tomas Kazlauskas · The American Journal of Engineering and Technology, 2026 · [DOI](https://doi.org/10.37547/tajet/volume08issue08-03)

- **O que aborda:** Propõe um framework conceitual para selecionar, priorizar, executar e classificar testes de regressão em pipelines Agile, usando histórico de resultados e impacto de mudanças.
- **O que importa:** O próprio resumo observa que parte importante da literatura usada vem de processamento de sinais biomédicos, como evidência metodológica transferível, e não de validação direta em projetos de software.
- **Uso no roadmap:** Bom caso para ensinar a separar hipótese e arquitetura proposta de evidência empírica específica de QA.
- **Cautela:** Não tratar a avaliação conceitual como prova de redução de regressão em produção; o resumo lista drift, poucos dados, explicabilidade e integração como riscos.

---

## Artificial Intelligence-Based Test Automation Frameworks for Next-Generation Software Quality Engineering

- **Autores:** Priyanka Sharma
- **Ano / data de publicação:** 2026 / 2026-08-17
- **Origem ou publicação:** American Journal Of Applied Science And Technology
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Automação e geração/priorização de testes; IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-37547-ajast-volume06issue08-07
- **DOI:** [https://doi.org/10.37547/ajast/volume06issue08-07](https://doi.org/10.37547/ajast/volume06issue08-07)
- **URL registrada:** [https://doi.org/10.37547/ajast/volume06issue08-07](https://doi.org/10.37547/ajast/volume06issue08-07)
- **Consulta que encontrou o registro:** software quality measurement
- **Data de descoberta:** 2026-09-16T14:13:30.577Z

### Resumo registrado

The increasing complexity, scale, and dynamic behavior of contemporary software systems have created substantial challenges for conventional test automation approaches. Traditional automation frameworks generally depend on predefined scripts, deterministic rules, and manually maintained test artifacts, which limits their adaptability when applications, interfaces, requirements, and execution environments change continuously. This research and review paper examines the conceptual foundations of Artificial Intelligence (AI)-based test automation frameworks for next-generation software quality engineering by integrating perspectives from human-like computing, functionalism, semantic representation, conceptual spaces, distributed intelligence, and machine-intelligence measurement. The study develops a conceptual framework in which AI-supported test automation is organized around five interconnected capabilities: intelligent requirement interpretation, semantic test modeling, adaptive test generation, autonomous execution and maintenance, and predictive quality-risk analysis. The theoretical synthesis indicates that human-like and symbolic approaches can provide interpretability and structured reasoning, whereas conceptual-space and semantic approaches can support contextual representation of software behavior. Distributed intelligence perspectives further suggest opportunities for scalable quality engineering across heterogeneous testing environments. The analysis also incorporates AI-driven project-risk prediction as a complementary decision-support mechanism for prioritizing testing resources and identifying high-risk software components. Findings indicate that the most promising next-generation architecture is not a completely autonomous testing system but a human-centered, adaptive framework combining machine intelligence with explainable representations and continuous feedback. The paper identifies important limitations involving semantic ambiguity, model reliability, maintenance complexity, and the absence of universal evaluation criteria. It concludes that AI-based test automation can substantially strengthen software quality engineering when intelligence is integrated as an adaptive reasoning layer rather than treated merely as an alternative mechanism for script generation.

### Pontos importantes para leitura

**Autora / origem:** Priyanka Sharma · American Journal of Applied Science and Technology, 2026 · [DOI](https://doi.org/10.37547/ajast/volume06issue08-07)

- **O que aborda:** Organiza uma arquitetura conceitual em interpretação de requisitos, modelagem semântica, geração adaptativa, execução/manutenção e previsão de risco.
- **O que importa:** Defende uma automação centrada em pessoas, com representações explicáveis e feedback contínuo; reconhece ambiguidade semântica, confiabilidade do modelo e falta de critérios universais.
- **Uso no roadmap:** Ajuda a discutir onde a IA pode apoiar o fluxo sem apagar a responsabilidade pelo oráculo, pelos dados e pela aprovação do teste.
- **Cautela:** É uma síntese conceitual, não demonstração de que as cinco capacidades foram implantadas e medidas em um produto real.

---

## Artificial Intelligence-Driven Software Test Automation: A Comprehensive Survey

- **Autores:** Jiale Chen
- **Ano / data de publicação:** 2026 / 2026-09-15
- **Origem ou publicação:** Applied and Computational Engineering
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Automação e geração/priorização de testes; IA/ML aplicada à qualidade; Fundamentos e métodos de teste
- **Identificador:** doi-doi-org-10-54254-2755-2721-2026-ld36950
- **DOI:** [https://doi.org/10.54254/2755-2721/2026.ld36950](https://doi.org/10.54254/2755-2721/2026.ld36950)
- **URL registrada:** [https://doi.org/10.54254/2755-2721/2026.ld36950](https://doi.org/10.54254/2755-2721/2026.ld36950)
- **Consulta que encontrou o registro:** software maintainability reliability
- **Data de descoberta:** 2026-09-15T14:20:51.675Z

### Resumo registrado

Software testing accounts for a significant proportion of resource consumption within the software development lifecycle. Traditional automated testing methods rely on predefined scripts and deterministic logic, and have inherent limitations when addressing the dynamic complexities of modern software systems. Artificial intelligence, particularly large language models, offers new technical avenues for test automation.This paper focuses on two key tasks—AI-driven test case generation and defect detection—and provides a systematic review of the technological evolution from traditional automation to intelligent testing. It analyses methods such as prompt engineering, retrieval-augmented generation, model fine-tuning and multi-agent systems,while contrasting traditional deep learning and large language model approaches in defect detection. The paper also examines key challenges, including the hallucination problem, evaluation criteria, interpretability and generalisation capabilities.The fundamental contribution of large language models lies not in replacing human testers, but in driving the transformation of test automation from 'execution automation' to 'decision support'—a distinction that provides important guidance for the design, evaluation and deployment of AI testing tools.

### Pontos importantes para leitura

**Autor / origem:** Jiale Chen · Applied and Computational Engineering, 2026 · [DOI](https://doi.org/10.54254/2755-2721/2026.ld36950)

- **O que aborda:** Revisa geração de casos e detecção de defeitos com IA, incluindo engenharia de prompt, RAG, fine-tuning e agentes, além de comparar abordagens de deep learning e LLMs.
- **O que importa:** Destaca alucinação, critérios de avaliação, interpretabilidade e generalização como limitações. A tese central é usar LLMs como apoio à decisão do QA, não como substituto da avaliação humana.
- **Uso no roadmap:** Complementa a semana de IA: cenários gerados precisam de oráculo, revisão e métricas próprias antes de entrar na suíte.
- **Cautela:** O registro é uma revisão; a qualidade e a cobertura dos estudos incluídos precisam ser verificadas no texto integral.

---

## Automated Testing Tools and Software Reliability: A Systematic Mapping

- **Autores:** Artur Santos de Farias, Rodrigo Rocha, Jamilson Ramalho Dantas
- **Ano / data de publicação:** 2026 / 2026-09-25
- **Origem ou publicação:** Annals of Computer Science and Information Systems
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Automação e geração/priorização de testes; Confiabilidade e resiliência; Fundamentos e métodos de teste
- **Identificador:** doi-doi-org-10-15439-2026f0950
- **DOI:** [https://doi.org/10.15439/2026f0950](https://doi.org/10.15439/2026f0950)
- **URL registrada:** [https://annals-csis.org/Volume_47/drp/pdf/0950.pdf](https://annals-csis.org/Volume_47/drp/pdf/0950.pdf)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-09-27T14:42:51.773Z

### Resumo registrado

Modern software systems operate in increasingly complex and heterogeneous environments, intensifying challenges related to reliability.Automated software testing (AST) helps address these demands, yet existing evidence on how widely used tools support reliability-oriented attributes remains dispersed.A consolidated view is needed to understand their contributions to coverage, fault detection, robustness, and execution reliability.This study conducts a systematic mapping of 184 primary works to identify the most frequently cited AST tools and to examine empirical evidence of their reliability-related capabilities.The analysis synthesizes findings on structural coverage, fault revelation, robustness under stress, and cross-platform consistency, revealing complementary strengths and gaps in current tool support.The results offer a structured perspective on how automation contributes to reliability evaluation, supporting software practitioners in selecting tools aligned with reliability goals and assisting researchers in identifying opportunities for advancing reliability-aware testing.In addition to the empirical synthesis, this study produces an evidence-based artifact in the form of a reliability-oriented attribute matrix, explicitly linking automated testing tools to traceable primary-study evidence and supporting informed, practical tool selection.

### Pontos importantes para leitura

**Autores / origem:** Artur Santos de Farias, Rodrigo Rocha e Jamilson Ramalho Dantas · Annals of Computer Science and Information Systems, 2026 · [DOI](https://doi.org/10.15439/2026f0950)

- **O que aborda:** Mapeia 184 estudos primários sobre como ferramentas de teste automatizado contribuem para cobertura estrutural, detecção de falhas, robustez sob estresse e consistência entre plataformas.
- **O que importa:** A contribuição prática é uma matriz que relaciona ferramentas a atributos de confiabilidade e a evidências dos estudos; não sugere que uma ferramenta única cubra todos os objetivos.
- **Uso no roadmap:** Apoia a escolha de automação por risco e pela pergunta de qualidade, em vez de popularidade do framework.
- **Cautela:** O resumo não enumera as ferramentas nem a qualidade de cada estudo incluído; consulte o artigo antes de recomendar ferramenta específica.

---

## Machine Learning-Driven Test Automation for Continuous Software Quality Engineering

- **Autores:** Chinedu Okafor
- **Ano / data de publicação:** 2026 / 2026-08-17
- **Origem ou publicação:** International journal of data science and machine learning.
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Automação e geração/priorização de testes; IA/ML aplicada à qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-55640-ijdsml-06-02-04
- **DOI:** [https://doi.org/10.55640/ijdsml-06-02-04](https://doi.org/10.55640/ijdsml-06-02-04)
- **URL registrada:** [https://doi.org/10.55640/ijdsml-06-02-04](https://doi.org/10.55640/ijdsml-06-02-04)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-19T09:50:36.513Z

### Resumo registrado

Continuous software quality engineering requires testing approaches that can operate with high frequency, adapt to changing software behavior, and provide actionable quality information without becoming a bottleneck in the delivery pipeline. Conventional automation improves execution speed but remains constrained when test selection, prioritization, failure interpretation, and maintenance depend heavily on manually encoded rules. This research and review paper examines a machine learning-driven approach to test automation in which learning models are integrated with test generation, execution prioritization, defect prediction, failure classification, and continuous feedback mechanisms. The methodological framework is developed by synthesizing the supplied literature on machine learning, deep learning, temporal modeling, generative adversarial networks, and sequence prediction, together with the compulsory software quality engineering study by Ramamurthy (2023). Although most of the supporting studies originate from domains such as weather forecasting, radar analysis, and medical image segmentation, their methodological contributions provide transferable principles for software testing, particularly temporal dependency modeling, automated feature learning, synthetic-data generation, and predictive decision-making. The analysis indicates that machine learning can shift test automation from static execution toward adaptive quality intelligence. However, model drift, insufficient representative test data, explainability, false positives, computational overhead, and continuous maintenance remain significant constraints. The proposed framework therefore emphasizes a closed feedback loop in which machine learning supports, rather than completely replaces, deterministic testing and human quality judgment.

### Pontos importantes para leitura

**Autor / origem:** Chinedu Okafor · International Journal of Data Science and Machine Learning, 2026 · [DOI](https://doi.org/10.55640/ijdsml-06-02-04)

- **O que aborda:** Propõe integrar aprendizado de máquina à geração e priorização de testes, previsão de defeitos, classificação de falhas e feedback contínuo.
- **O que importa:** O resumo informa que várias ideias metodológicas vêm de previsão do tempo, radar e imagens médicas, sendo transferidas para QE. Também aponta drift, falta de dados representativos, falsos positivos e custo computacional.
- **Uso no roadmap:** Reforça a distinção entre técnicas potencialmente transferíveis e evidência validada em teste de software.
- **Cautela:** O resumo não descreve avaliação direta suficiente para concluir eficácia operacional em CI/CD.

---

