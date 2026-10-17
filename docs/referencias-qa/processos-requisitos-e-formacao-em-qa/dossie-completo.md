# Dossiê completo: Processos, requisitos e formação em QA

**8 registros.** Este arquivo reúne os metadados disponíveis na biblioteca local, o resumo/abstract registrado e os pontos importantes da síntese editorial de cada trabalho. Os resumos permanecem na língua e na forma em que foram indexados; ausência de resumo ou de metadados é indicada explicitamente.

Snapshot dos metadados: **2026-09-29T15:55:26.540Z**. Classificação do tópico e tipo de registro são editoriais; confira a fonte primária antes de citar ou aplicar resultados.

[Voltar às referências da pasta](./README.md) · [Resumo geral de toda a biblioteca](../../RESUMO_GERAL_ARTIGOS_QA.md) · [Síntese dos pontos importantes](./sintese-artigos.md)

## A Multidimensional Decision-Support Framework for Software Quality Assessment in Agile Projects

- **Autores:** Nurdan Canbaz Horozlu, T. Serif
- **Ano / data de publicação:** 2026 / 2026-06-24
- **Origem ou publicação:** Inf.
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Processos, requisitos e formação em QA; Modelos e métricas de qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-3390-info17070624
- **DOI:** [https://doi.org/10.3390/info17070624](https://doi.org/10.3390/info17070624)
- **URL registrada:** [https://doi.org/10.3390/info17070624](https://doi.org/10.3390/info17070624)
- **Consulta que encontrou o registro:** software quality model
- **Data de descoberta:** 2026-08-25T09:52:53.604Z

### Resumo registrado

Software quality assessment in agile projects remains fragmented. Technical, process-related, and team-related indicators are often evaluated through separate models, tools, and reports. This fragmentation limits cross-project comparability and weakens evidence-based decisions for software quality improvement. To address this problem, this study proposes the Overall Software Quality Index (OSQI), a multidimensional decision-support framework for software quality assessment in agile projects. OSQI integrates code quality, process quality, and team quality into a single project-level assessment model. The framework was initially grounded in ISO/IEC 25010:2011 and is discussed in relation to the ISO/IEC 25010:2023 revision, particularly its explicit inclusion of Safety as a product quality characteristic. Since the industrial datasets used in this study were not collected from safety-critical systems, Safety was not modeled as a separate OSQI dimension in the current version; instead, it is addressed as a scope limitation and future extension. The measurement structure was defined using the Goal–Question–Metric (GQM) approach. An initial set of 49 candidate metrics was reduced to 15 core indicators. This reduction was performed using dimension-specific strategies: Random Forest-based feature importance for code quality, Delphi and Analytic Hierarchy Process (AHP) for process quality, and thematic consolidation for team quality. The selected indicators were normalized and integrated through entropy-based weighting. This process generates an interpretable composite quality score. The main contribution of OSQI is not the isolated use of these methods, but their integration into a reproducible and tool-supported framework. The framework converts heterogeneous software engineering signals into a unified decision-support index. OSQI was evaluated using industrial agile project data. The data included static code analysis outputs, issue-tracking records, team assessment results, and product outcome indicators. In an exploratory validation across five industrial projects, OSQI showed a strong positive association with Net Promoter Score (r=0.97, p=0.0076) and a strong negative association with churn rate (r=−0.97, p=0.0061). A supporting software tool was also developed to automate data integration, score calculation, visualization, and project-level comparison. The findings suggest that OSQI can support quality monitoring, project benchmarking, and evidence-based improvement decisions in agile software engineering contexts.

### Pontos importantes para leitura

- **Tema e contribuição:** propõe o Overall Software Quality Index (OSQI), reunindo qualidade do código, do processo e da equipe em um apoio à decisão para projetos ágeis.
- **O que levar:** uma visão de qualidade pode combinar dimensões técnicas e organizacionais, desde que seus indicadores e pesos sejam transparentes.
- **Limite:** o resumo relata uma proposta inicial e aponta limitações dos dados industriais para sistemas críticos; não assumir validação universal.

---

## Bugs in a Perfect Substrate: An Ontology of Software Defects

- **Autores:** Oliver Albrecht
- **Ano / data de publicação:** 2026 / 2026-09-17
- **Origem ou publicação:** Zenodo (CERN European Organization for Nuclear Research)
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Relatório ou depósito em repositório
- **Tópicos atribuídos:** Processos, requisitos e formação em QA
- **Identificador:** doi-doi-org-10-5281-zenodo-20232955
- **DOI:** [https://doi.org/10.5281/zenodo.20232955](https://doi.org/10.5281/zenodo.20232955)
- **URL registrada:** [https://doi.org/10.5281/zenodo.20232955](https://doi.org/10.5281/zenodo.20232955)
- **Consulta que encontrou o registro:** software quality measurement
- **Data de descoberta:** 2026-09-18T13:38:00.114Z

### Resumo registrado

The word bug entered engineering usage with a precise referent: a substrate intrusion — a physical object occupying space in a mechanism whose designed geometry excluded it. Around defects of this kind, a measurement apparatus was built — statistical process control, defect density, process capability — whose load-bearing assumption was that defects are draws from a stable probability distribution over substrate-induced deviations across a population of nominally identical units. That ontology and that apparatus were carried into software engineering through the late 1980s. The substrate did not come with them. This paper recovers what bug can mean in a substrate without an instantiation gap. The constructive ontology is that a bug is not a property of a unit of software, but rather a witnessed event in which something an engineering practice was proceeding as though it knew did not hold for a specific execution. Based on the formalism of the bounded local theory established in a companion paper, we identify four fundamental disjuncts which can produce such an event: a hidden distinction mattered, the expectation was wrong, the system was used outside its envelope, or the accepted tolerance was too generous. None of the four locates the bug in the software itself, but rather in the relationship between the operative theory, the system it describes, and the context in which the system operates. The paper traces the historical inheritance from Shewhart's 1931 control charts through Humphrey's importation into the CMM and on to ASPICE and ISO 26262, identifies the four preconditions of statistical process control that fail on the software substrate (population, repeatable process, stable distribution, substrate causation), and develops the constructive ontology of quality as alignment under an operational measure rather than dispersion across a population. Specific interventions practitioners already use — type systems, code review, testing, formal methods — are reframed not as lower-quality versions of statistical process control but as the correct kind of intervention for the substrate: each addresses one or more of the possibilities a witness leaves open, and none is a statistical operation on a population of artifacts. The argument has direct consequences for ASPICE Level 4/5, CMMI Quantitatively Managed, ISO 26262 safety integrity claims, and every safety case that treats defect metrics as evidence of capability. The paper belongs to a programme that began with The Wrong Substrate (TWS) and the formal trio of CCI, CHP, and SSEP, and continues in Conditional System Guarantees (CSG, forthcoming). TWS traced what the inherited engineering wisdom assumed about the substrate and identified the structural properties that fail. The formal trio established the substrate's own properties: faithful realization, ageometric state space, and specification–implementation equivalence. The present paper applies those results to the specific question of bugs and quality. CSG develops the operational alternative: a guarantee algebra structured around alignment evidence, measure estimation, monitoring discipline, and the honest accounting of what the substrate permits to be known. Change History: Version 2.0: Replaced the observation-map mismatch with formal language from the "Towards Achievable Locality" companion paper. The four disjuncts locate the bug to elements of the engineers' bounded local theories. Keywords: software defects, software quality, statistical process control, observation maps, gauge structure, distinguishability, perfect substrate, software measurement, KPIs, defect density, process capability, CMMI, ASPICE, ISO 26262, computational holographic principle, causally complete interfaces, specification equivalence, software ontology

### Pontos importantes para leitura

- **Tema e contribuição:** questiona se conceitos de defeito e métricas herdados da manufatura descrevem bem software, cujo comportamento depende de estados, contexto e execução.
- **O que levar:** ao definir métricas de defeito, explicitar o evento observado e o contexto. “Defeito” pode representar uma expectativa que falha quando exercitada, e não apenas uma propriedade estática do artefato.
- **Limite:** trabalho conceitual; não deve ser apresentado como validação empírica de uma nova métrica.

---

## Designing a Requirements Engineering Model to Achieve Software Quality

- **Autores:** Mohammed Ali Badawy Alawad Kenen
- **Ano / data de publicação:** 2026 / 2026-04-21
- **Origem ou publicação:** مجلة منار الشرق للتربية و تكنولوجيا التعليم
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Processos, requisitos e formação em QA; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-56961-mejeit-v5i1-1443
- **DOI:** [https://doi.org/10.56961/mejeit.v5i1.1443](https://doi.org/10.56961/mejeit.v5i1.1443)
- **URL registrada:** [https://doi.org/10.56961/mejeit.v5i1.1443](https://doi.org/10.56961/mejeit.v5i1.1443)
- **Consulta que encontrou o registro:** software quality model
- **Data de descoberta:** 2026-08-15T22:37:48.767Z

### Resumo registrado

One of the key issues addressed in this study is the ambiguity surrounding the understanding of software project requirements. Many users and clients often lack a clear vision of what they expect from the system or the purpose behind its development, which inevitably hinders the success of software projects. A primary objective of the researcher in this study was to establish a practical approach for writing requirements based on specific standards and a proposed model. This model consists of a structured and organized sequence of steps designed to facilitate accurate and effective requirement specification. Among the most significant findings of the study—based on a series of questionnaires distributed to various software companies and individuals—was the contribution of the survey in analyzing the current state of requirements engineering within software institutions and assessing the extent to which practical standards are applied. The survey revealed numerous insights, most notably the widespread absence of a standardized model for requirements gathering among both organizations and individual practitioners.

### Pontos importantes para leitura

- **Tema e contribuição:** propõe um processo estruturado para especificar requisitos diante de ambiguidade entre clientes, usuários e equipe.
- **O que levar:** requisitos claros precisam registrar necessidade, critérios verificáveis e validação com as partes interessadas.
- **Limite:** o resumo menciona questionários, mas não fornece detalhes suficientes para julgar desenho, amostra ou força dos resultados.

---

## Designing Software Quality Assurance Framework Integrated With Scrum And Rsm For Multi-Project

- **Autores:** D. Veronica, Muharman Lubis, B. Rahmad
- **Ano / data de publicação:** 2026 / 2026-07-04
- **Origem ou publicação:** Vifada Management and Social Sciences
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Processos, requisitos e formação em QA; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-70184-3ejnrd38
- **DOI:** [https://doi.org/10.70184/3ejnrd38](https://doi.org/10.70184/3ejnrd38)
- **URL registrada:** [https://doi.org/10.70184/3ejnrd38](https://doi.org/10.70184/3ejnrd38)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-09-01T14:10:27.703Z

### Resumo registrado

Purpose: This study aims to design an integrated Software Quality Assurance (SQA) framework combining Scrum and the Recognize, Scrutinize, Materialize (RSM) approach to mitigate context switching, priority ambiguity, and technical debt in multi-project environments.
Research Design and Methodology: Utilizing a mixed-methods approach with sequential triangulation based on Design Science Research (DSR), secondary data were gathered from SOP studies at PT. Boer Technology. Framework evaluation involved a 1–5 Likert-scale questionnaire administered to a purposive sample of 9 active expert Scrum Masters
Findings and Discussion: Descriptive statistics and inter-rater reliability analysis confirm a high expert consensus, with a 99.02% cumulative positive response rate. Gwet’s AC2 yielded a fair agreement of 0.2279, demonstrating that integrating RSM strengthens shift-left testing and continuous quality execution without compromising Scrum's iterative nature
Implications: This framework offers an original, implementable quality governance solution for medium-to-large software industries to enhance compliance, product stability, and business value. Future research should conduct empirical pilot implementations to test scalability and quantitatively measure long-term impacts using metrics like defect density

### Pontos importantes para leitura

- **Tema e contribuição:** propõe integrar Scrum e o método RSM (Recognize, Scrutinize, Materialize) para lidar com mudanças de contexto, prioridades ambíguas e dívida técnica em vários projetos.
- **Resultado reportado:** nove Scrum Masters avaliaram o framework; o resumo informa 99,02% de respostas positivas, mas também concordância entre avaliadores baixa (Gwet AC2 = 0,2279).
- **O que levar:** inserir qualidade no fluxo e nas decisões do time é útil; a avaliação pequena e a concordância limitada pedem cautela antes de tratar o framework como comprovado.

---

## Innovative research and practice of software quality assurance and testing curriculum based on inquiry-oriented teaching

- **Autores:** Songhao Jia, Cai Yang
- **Ano / data de publicação:** 2026 / 2026-04-09
- **Origem ou publicação:** International Journal of System Assurance Engineering and Management
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Processos, requisitos e formação em QA; Fundamentos e métodos de teste; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-1007-s13198-026-03271-3
- **DOI:** [https://doi.org/10.1007/s13198-026-03271-3](https://doi.org/10.1007/s13198-026-03271-3)
- **URL registrada:** [https://doi.org/10.1007/s13198-026-03271-3](https://doi.org/10.1007/s13198-026-03271-3)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-09-01T14:10:27.703Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema e contribuição:** pelo título, aborda currículo de SQA e testes com ensino orientado por investigação.
- **Limite da síntese:** não há resumo indexado. É possível inferir o assunto, mas não descrever práticas pedagógicas ou resultados sem consultar o texto integral.

---

## RECONNAISSANCE OF THE INTERDEPENDENCE AMONG REQUIREMENT CLARITY, SPRINT EFFICIENCY, AND SOFTWARE QUALITY: A CONCEPTUAL FRAMEWORK APPROACH

- **Autores:** Syed Shabeeb Raza, Khalid Mahboob, Mustafa Ahmed Khan
- **Ano / data de publicação:** 2026 / 2026-04-30
- **Origem ou publicação:** International Journal of Software Engineering and Computer Systems
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Processos, requisitos e formação em QA; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-15282-ijsecs-12-1-2026-1-0147
- **DOI:** [https://doi.org/10.15282/ijsecs.12.1.2026.1.0147](https://doi.org/10.15282/ijsecs.12.1.2026.1.0147)
- **URL registrada:** [https://doi.org/10.15282/ijsecs.12.1.2026.1.0147](https://doi.org/10.15282/ijsecs.12.1.2026.1.0147)
- **Consulta que encontrou o registro:** software quality measurement
- **Data de descoberta:** 2026-09-25T14:37:31.547Z

### Resumo registrado

This study has developed a theoretical model capable of evaluating the relationships among requirement clarity, sprint efficiency, and software quality in Agile software development. Although Agile adopts a highly flexible and continuous delivery approach, requirement ambiguity remains one of the major issues that negatively impacts both sprint performance and product quality. Grounded in information processing theory, cognitive load theory, and systems theory, this research reveals how unclear or insufficient requirements lead to increased defect rates, reduced sprint velocity, and diminished planning efficiency. Furthermore, the model establishes a set of metrics to support outcome measurement, including the Requirement Volatility Index (RVI), Sprint Velocity (SV), Defect Density (DD), and Quality Index (QI). From a practical perspective, this study affirms that requirement validation processes, stakeholder alignment, and continuous feedback are essential to Agile success. Overall, this research develops a theoretically and empirically grounded model that assists Agile practitioners, project managers, and quality engineers in anticipating and managing requirements-based risks, while also serving as a tool for real-time quality assurance during sprints.

### Pontos importantes para leitura

- **Tema e contribuição:** estrutura relações propostas entre clareza de requisitos, eficiência de sprint e qualidade, usando índices de volatilidade de requisitos, velocidade, densidade de defeitos e qualidade.
- **O que levar:** validar requisitos antes e durante o desenvolvimento pode reduzir interpretações divergentes e retrabalho; velocidade isolada não é medida suficiente de qualidade.
- **Limite:** o próprio resumo descreve um modelo teórico. Trate as relações como hipóteses a verificar no contexto do time.

---

## Systems and software Quality Requirements and Evaluation: Product quality model

- **Autores:** ISO/IEC
- **Ano / data de publicação:** 2023 / 2023-01-01
- **Origem ou publicação:** ISO/IEC 25010
- **Base de origem do registro:** Curated
- **Tipo de registro:** Referência acadêmica curada (verificar tipo)
- **Tópicos atribuídos:** Processos, requisitos e formação em QA; Modelos e métricas de qualidade; Garantia e engenharia de qualidade
- **Identificador:** seed-iso-25010
- **DOI:** não informado
- **URL registrada:** [https://iso25000.com/index.php/en/iso-25000-standards/iso-25010](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010)
- **Consulta que encontrou o registro:** software quality model
- **Data de descoberta:** 2026-06-25T00:00:00.000Z

### Resumo registrado

Standard reference for software product quality characteristics such as functional suitability, reliability, usability, performance efficiency, maintainability, portability, security, and compatibility.

### Pontos importantes para leitura

- **Tipo e contribuição:** referência normativa ISO/IEC 25010:2023 para o modelo de qualidade de produto de sistemas e software.
- **O que levar:** usar características e subcaracterísticas como vocabulário para requisitos e avaliação; selecionar as relevantes ao produto e traduzi-las em critérios verificáveis. A norma não substitui estratégia de teste nem define, sozinha, limites de aprovação.

---

## Quality Engineering for Agile and DevOps teams

- **Autores:** Sogeti
- **Ano / data de publicação:** 2020 / 2020-01-01
- **Origem ou publicação:** TMap body of knowledge
- **Base de origem do registro:** Curated
- **Tipo de registro:** Norma, corpo de conhecimento ou referência técnica
- **Tópicos atribuídos:** Processos, requisitos e formação em QA; Garantia e engenharia de qualidade
- **Identificador:** seed-tmap-quality-engineering
- **DOI:** não informado
- **URL registrada:** [https://www.tmap.net/](https://www.tmap.net/)
- **Consulta que encontrou o registro:** quality engineering software testing
- **Data de descoberta:** 2026-06-25T00:00:00.000Z

### Resumo registrado

Applied reference on modern quality engineering practices, including shift-left, test strategy, risk-based quality, automation, exploratory testing, and continuous feedback.

### Pontos importantes para leitura

- **Tipo e contribuição:** referência prática do corpo de conhecimento TMap sobre engenharia de qualidade em equipes ágeis e DevOps.
- **O que levar:** integrar estratégia de teste, análise baseada em risco, automação, exploração e feedback contínuo ao fluxo de entrega, em vez de deixar a qualidade para uma etapa final.
- **Limite:** guia profissional, não estudo experimental; adaptar práticas ao risco, produto e maturidade do time.

---

