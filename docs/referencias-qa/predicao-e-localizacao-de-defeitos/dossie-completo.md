# Dossiê completo: Predição e localização de defeitos

**67 registros.** Este arquivo reúne os metadados disponíveis na biblioteca local, o resumo/abstract registrado e os pontos importantes da síntese editorial de cada trabalho. Os resumos permanecem na língua e na forma em que foram indexados; ausência de resumo ou de metadados é indicada explicitamente.

Snapshot dos metadados: **2026-09-29T15:55:26.540Z**. Classificação do tópico e tipo de registro são editoriais; confira a fonte primária antes de citar ou aplicar resultados.

[Voltar às referências da pasta](./README.md) · [Resumo geral de toda a biblioteca](../../RESUMO_GERAL_ARTIGOS_QA.md) · [Síntese dos pontos importantes](./sintese-artigos.md)

## A Bayesian-Optimized Multi-Scale Oversampling Method for Imbalanced Software Defect Prediction

- **Autores:** Yue Qiu, Qian Chen, JunJian Liu, Boyan Su, Fanqiang Zeng
- **Ano / data de publicação:** 2026 / 2026-05-01
- **Origem ou publicação:** 2026 8th International Conference on Internet of Things, Automation and Artificial Intelligence (IoTAAI)
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1109-iotaai70471-2026-11607716
- **DOI:** [https://doi.org/10.1109/IoTAAI70471.2026.11607716](https://doi.org/10.1109/IoTAAI70471.2026.11607716)
- **URL registrada:** [https://doi.org/10.1109/IoTAAI70471.2026.11607716](https://doi.org/10.1109/IoTAAI70471.2026.11607716)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Software Defect Prediction (SDP) plays an important role in optimizing the allocation of testing resources. However, in real-world software projects, defective samples are usually far fewer than non-defective samples, which can bias models toward the majority class.To address the limitations of existing class imbalance methods in SDP, which fail to adequately capture program semantics and complexity, this paper proposes a Bayesian Optimization-based Semantic and Complexity-Aware Oversampling (BO-SCAO) method. BO-SCAO first employs CodeT5+ to extract semantic representations and uses expert metrics to construct complexity features. It then integrates semantic and complexity distances into a multi-scale distance to guide neighbor selection and synthetic sample generation for minority-class instances. Finally, Bayesian optimization is used to adaptively search distance weights, leading to more effective weight configurations. Experiments are conducted on six imbalanced projects from the PROMISE dataset, using AUC as the evaluation metric, and BO-SCAO is compared with four baseline methods, including LTRUS. The results show that BO-SCAO can more effectively improve prediction performance across three SDP classifiers.

### Pontos importantes para leitura

- **Contribuição:** BO-SCAO combina embeddings CodeT5+, métricas de complexidade e distância multiescala para sintetizar casos minoritários, com otimização bayesiana.
- **Limite:** método proposto; verificar em texto completo se o ganho se mantém em projetos externos e sem vazamento entre treino e teste.

---

## A Hybrid Feature Selection and Ensemble Learning Framework for Software Defect Prediction with Class Imbalance Handling

- **Autores:** B. V. Chowdary, Sendhil Kumar B. B, D. L. Sri, P. Avinash, M. Keerthana, S. V. Goud
- **Ano / data de publicação:** 2026 / 2026-08-01
- **Origem ou publicação:** International Conference on Information Security and Cryptology
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1109-icisc69558-2026-11681129
- **DOI:** [https://doi.org/10.1109/ICISC69558.2026.11681129](https://doi.org/10.1109/ICISC69558.2026.11681129)
- **URL registrada:** [https://doi.org/10.1109/ICISC69558.2026.11681129](https://doi.org/10.1109/ICISC69558.2026.11681129)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-22T14:03:26.481Z

### Resumo registrado

Software defect prediction (SDP) is essential for improving software quality since it finds error-prone modules early in the development lifecycle. Current methods produce inflated and erroneous performance metrics because of data leaks, inadequate class imbalance management, and reliance on antiquated classifiers. By integrating a soft voting ensemble of six contemporary gradient boosting classifiers XGBoost, LightGBM, CatBoost, Random Forest, Extra Trees, and Gradient Boosting with Mutual Information filtering, this study provides a MI-based feature selection technique that gets beyond these restrictions. To avoid data leakage, SMOTE is only used on training data to address class imbalance. Five publicly accessible PROMISE repository datasets CM1, PC1, KC1, KC2, and JM1 are used in the experiments. For all five datasets, the average accuracy is 82.86%, while the average F1-score and ROC-AUC are 46.92% and 0.778, respectively. Previous studies on the same datasets only give accuracy numbers of up to 94% for imbalanced defect datasets, when the number of non-faulty modules significantly exceeds that of defective ones. This is a deceptive figure that hides insufficient ability to detect defects. F1-score, Precision, Recall, and ROC-AUC are used to measure performance; these metrics offer a more accurate evaluation than accuracy alone. The results show that MI-based feature selection improves prediction performance while lowering computational overhead; on all five datasets, contemporary ensemble techniques regularly beat traditional classifiers.

### Pontos importantes para leitura

- **Contribuição:** combina filtragem por informação mútua, ensemble soft voting de seis classificadores e SMOTE aplicado apenas ao treino em cinco bases PROMISE.
- **O que levar:** destaca prevenção de vazamento de dados e avaliação em múltiplos projetos; o resumo indexado está truncado antes dos resultados completos.

---

## A multi-level complexity metric suite for software quality measurement and machine learning-based software defect prediction

- **Autores:** Manpreet Singh, J. Chhabra
- **Ano / data de publicação:** 2026 / 2026-04-01
- **Origem ou publicação:** Journal of Computer Languages
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade; Modelos e métricas de qualidade; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-1016-j-cola-2026-101400
- **DOI:** [https://doi.org/10.1016/j.cola.2026.101400](https://doi.org/10.1016/j.cola.2026.101400)
- **URL registrada:** [https://doi.org/10.1016/j.cola.2026.101400](https://doi.org/10.1016/j.cola.2026.101400)
- **Consulta que encontrou o registro:** software quality measurement
- **Data de descoberta:** 2026-08-15T22:37:48.767Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** pelo título, propõe métricas de complexidade em vários níveis para medição de qualidade e previsão de defeitos.
- **Limite:** resumo ausente; não é possível listar métricas ou afirmar validade preditiva.

---

## A novel generative oversampling for software defect prediction

- **Autores:** Somya R. Goyal
- **Ano / data de publicação:** 2026 / 2026-04-03
- **Origem ou publicação:** Scientific Reports
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-1038-s41598-026-41981-7
- **DOI:** [https://doi.org/10.1038/s41598-026-41981-7](https://doi.org/10.1038/s41598-026-41981-7)
- **URL registrada:** [https://doi.org/10.1038/s41598-026-41981-7](https://doi.org/10.1038/s41598-026-41981-7)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Software defect prediction is one of the highly active research areas as it allows to focus the testing efforts on the defective modules and reduce the cost of development. The imbalanced nature of defect data poses a threat to the performance of software defect predictors. This study proposes a novel Generative oversampling-based Software Defect Prediction naming GeNSDP. It oversamples defect data by generating synthetic minority instances utilizing lightweight generative model, then the oversampled data is used for defect prediction using deep network. NASA and PROMISE datasets are used for experimentation, for which GeNSDP achieves a remarkable average score of 99.1% for Area Under the Curve, and 0.92 for F-measure. The proposed model outperforms the traditional oversampling methods (including ROS, SMOTE, COSTE) by 30.1%, and selected baseline models by 14.1%. From the statistical evidence obtained by conducting the Anova Test with Bonferroni Post-hoc test at the confidence level of 95%, it is concluded that the proposed model is effective to handle class imbalance and achieve stable defect prediction.

### Pontos importantes para leitura

- **Contribuição:** GeNSDP gera amostras minoritárias com modelo generativo leve e as usa em uma rede profunda; avalia datasets NASA/PROMISE.
- **Resultado reportado:** AUC média de 99,1% e F-measure 0,92, com ganhos reportados contra baselines. Valores muito altos exigem examinar divisão dos dados, vazamento, variação entre datasets e reprodução independente.

---

## A Novel Unsupervised Method for Software Defect Prediction Based on Clustering Assumption

- **Autores:** Shiqi Tang, X. Tie, Minggui Song, Qiao Yang
- **Ano / data de publicação:** 2026 / 2026-01-01
- **Origem ou publicação:** IEEE Access
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1109-access-2026-3674915
- **DOI:** [https://doi.org/10.1109/ACCESS.2026.3674915](https://doi.org/10.1109/ACCESS.2026.3674915)
- **URL registrada:** [https://doi.org/10.1109/ACCESS.2026.3674915](https://doi.org/10.1109/ACCESS.2026.3674915)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Software defect prediction (SDP) is a very important technique used in the software testing. It helps to quickly predict the defects contained in software in the early stage of development. Currently, many SDP methods use machine learning algorithms to build defect prediction models based on historical data. However, due to the lack of historical data that can be used to train the models, unsupervised defect prediction (UDP) methods have been proposed. The instance-violation-score-based-clustering (IVSBC) method is an example of the UDP method. It is relatively effective but vulnerable to redundant features and rough split of the feature space. To overcome those shortcoming, this paper proposes an unsupervised defect prediction method named CLA-CA based on clustering assumption. The CLA-CA searches different regions of every feature space to find an appropriate classification threshold, and remove redundant features, so as to improve the prediction performance. Experiments show that the CLA-CA is not only better than other mainstream UDP methods, but also outperforms most supervised defect prediction methods.

### Pontos importantes para leitura

- **Contribuição:** propõe CLA-CA para previsão não supervisionada, buscando limites de decisão por regiões do espaço de atributos.
- **O que levar:** métodos sem rótulo respondem à falta de histórico rotulado, mas devem ser avaliados em bases externas e comparados em condições equivalentes. Resumo não traz métricas finais completas.

---

## A transformer-based stacked ensemble framework for software defect prediction

- **Autores:** Meetesh Nevendra, Rahul Shrivastava
- **Ano / data de publicação:** 2026 / 2026-02-11
- **Origem ou publicação:** Knowledge and Information Systems
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-1007-s10115-026-02696-3
- **DOI:** [https://doi.org/10.1007/s10115-026-02696-3](https://doi.org/10.1007/s10115-026-02696-3)
- **URL registrada:** [https://doi.org/10.1007/s10115-026-02696-3](https://doi.org/10.1007/s10115-026-02696-3)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** pelo título, empilha modelos transformer para previsão de defeitos.
- **Limite:** resumo ausente; consultar artigo para arquitetura, datasets e comparação.

---

## Adaptive Intuitionistic Fuzzy K-Nearest Neighbors for Software Defect Prediction

- **Autores:** Hai Yen Nguyen, Tuan Thai, Anh Phong Phan
- **Ano / data de publicação:** 2026 / 2026-09-21
- **Origem ou publicação:** Lecture Notes in Computer Science
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1007-978-981-92-5644-0-26
- **DOI:** [https://doi.org/10.1007/978-981-92-5644-0_26](https://doi.org/10.1007/978-981-92-5644-0_26)
- **URL registrada:** [https://doi.org/10.1007/978-981-92-5644-0_26](https://doi.org/10.1007/978-981-92-5644-0_26)
- **Consulta que encontrou o registro:** software product quality
- **Data de descoberta:** 2026-09-21T15:54:46.988Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** adaptação de KNN com lógica fuzzy intuicionista aplicada à previsão de defeitos.
- **Limite:** resumo ausente; confirmar representação, conjuntos de dados e comparação experimental antes de ensinar como técnica eficaz.

---

## Adaptive Just-in-Time software defect prediction using unsupervised concept drift detection

- **Autores:** Aditya Pote, Santosh Singh Rathore, Joydip Dhar
- **Ano / data de publicação:** 2026 / 2026-08-14
- **Origem ou publicação:** Software Quality Journal
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1007-s11219-026-09784-1
- **DOI:** [https://doi.org/10.1007/s11219-026-09784-1](https://doi.org/10.1007/s11219-026-09784-1)
- **URL registrada:** [https://doi.org/10.1007/s11219-026-09784-1](https://doi.org/10.1007/s11219-026-09784-1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** adaptação da previsão JIT a mudanças na distribuição dos dados por detecção não supervisionada de concept drift.
- **Limite:** resumo ausente; mecanismo, latência e ganhos não podem ser confirmados pelo registro.

---

## An Audit of Machine Learning Experiments on Software Defect Prediction

- **Autores:** Giuseppe Destefanis, Leila Yousefi, Martin Shepperd, Allan Tucker, Stephen Swift, Steve Counsell, Mahir Arzoky
- **Ano / data de publicação:** 2026 / 2026-01-26
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** arxiv-arxiv-org-abs-2601-18477v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2601.18477v1](http://arxiv.org/abs/2601.18477v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Background: Machine learning algorithms are widely used to predict defect prone software components. In this literature, computational experiments are the main means of evaluation, and the credibility of results depends on experimental design and reporting. Objective: This paper audits recent software defect prediction (SDP) studies by assessing their experimental design, analysis, and reporting practices against accepted norms from statistics, machine learning, and empirical software engineering. The aim is to characterise current practice and assess the reproducibility of published results. Method: We audited SDP studies indexed in SCOPUS between 2019 and 2023, focusing on design and analysis choices such as outcome measures, out of sample validation strategies, and the use of statistical inference. Nine study issues were evaluated. Reproducibility was assessed using the instrument proposed by González Barahona and Robles. Results: The search identified approximately 1,585 SDP experiments published during the period. From these, we randomly sampled 101 papers, including 61 journal and 40 conference publications, with almost 50 percent behind paywalls. We observed substantial variation in research practice. The number of datasets ranged from 1 to 365, learners or learner variants from 1 to 34, and performance measures from 1 to 9. About 45 percent of studies applied formal statistical inference. Across the sample, we identified 427 issues, with a median of four per paper, and only one paper without issues. Reproducibility ranged from near complete to severely limited. We also identified two cases of tortured phrases and possible paper mill activity. Conclusions: Experimental design and reporting practices vary widely, and almost half of the studies provide insufficient detail to support reproduction. The audit indicates substantial scope for improvement.

### Pontos importantes para leitura

- **Contribuição:** auditoria de estudos de SDP indexados na Scopus entre 2019 e 2023, avaliando desenho, validação fora da amostra, métricas, inferência estatística e reprodutibilidade.
- **O que levar:** avaliar a qualidade do experimento é tão necessário quanto comparar algoritmos; procurar divisões corretas, estatística apropriada e artefatos reproduzíveis.

---

## An Empirical Study on Deep Learning-based Line-Level Software Defect Prediction

- **Autores:** Enci Zhang, Yutong Jiang, Tianmeng Zhang, H. Tong
- **Ano / data de publicação:** 2026 / 2026-04-13
- **Origem ou publicação:** IEEE Working Conference on Mining Software Repositories
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-1145-3793302-3793359
- **DOI:** [https://doi.org/10.1145/3793302.3793359](https://doi.org/10.1145/3793302.3793359)
- **URL registrada:** [https://doi.org/10.1145/3793302.3793359](https://doi.org/10.1145/3793302.3793359)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Line-level software defect prediction (LLDP) is crucial for locating and modifying defective code and has drawn increasing attention from both academic and industrial communities. Recently, a series of deep learning-based LLDP models have been proposed. However, there is no systematic comparison of these LLDP models. In this paper, we aim to compare the performance of these models, evaluate their consistency in different scenarios, and investigate whether fusing handcrafted features can improve the prediction performance. To this end, we conducted a comprehensive empirical study on eight recent state-of-the-art models using 32 benchmark datasets from nine software projects’ releases. We evaluated them in both cross-version and cross-project scenarios with four widely used performance metrics, including AUC, Recall@Top20%LOC, Effort@Top20%Recall, and IFA. Moreover, we investigated the impact of handcrafted features on LLDP models based on two different fusion strategies. The results show that 1) the difference among these models is statistically significant; 2) no model is always superior across all performance metrics but Bugsplorer generally performs best except IFA; 3) model performance rankings are inconsistent between cross-version and cross-project scenarios, revealing that a model’s effectiveness is highly scenario-dependent; 4) furthermore, fusing handcrafted features significantly improves model prediction performance, and the fusion strategy also matters. In conclusion, the selection of an LLDP model should be guided by specific scenarios and performance metrics, and the hybrid model that combines deep learning representations with handcrafted features is a promising alternative for LLDP.

### Pontos importantes para leitura

- **Contribuição:** comparação de oito modelos de previsão em nível de linha, em 32 benchmarks de nove projetos, incluindo cenários entre versões e entre projetos.
- **O que levar:** métricas de esforço e localização (por exemplo, defeitos encontrados por fração do código inspecionado) complementam AUC/recall. Conferir o artigo para os resultados de cada cenário.

---

## An Explainable Transformer-Based Framework for Software Defect Prediction Using QLoRA and Semantic Evaluation

- **Autores:** Vijya Tulsani, Kinjal Patni, Dr. Prashant Sahatiya
- **Ano / data de publicação:** 2026 / 2026-04-10
- **Origem ou publicação:** International Journal of Drug Delivery Technology
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-25258-ijddt-16-10s-4
- **DOI:** [https://doi.org/10.25258/ijddt.16.10s.4](https://doi.org/10.25258/ijddt.16.10s.4)
- **URL registrada:** [https://doi.org/10.25258/ijddt.16.10s.4](https://doi.org/10.25258/ijddt.16.10s.4)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Software Defect Prediction (SDP) is critical to improving software reliability by identifying fault-prone components during development. Despite progress in deep learning, current models often lack interpretability and require substantial computational resources. This study proposes an explainable, Transformer-based framework fine-tuned using Quantized Low-Rank Adaptation (QLoRA) to enhance both efficiency and transparency in defect prediction. The model leverages a custom dataset comprising over 2.3 million labeled code lines—including 292,064 faulty lines—collected from real-world software projects. Byte Pair Encoding (BPE) tokenization and static metric extraction were applied to build a unified feature representation, enabling line-level classification. The Transformer backbone, adapted from the LLaMA model, was fine-tuned using 4-bit quantization for parameter-efficient training. Semantic evaluation was performed using BERTScore to quantify alignment between predicted and actual defect explanations. Experimental results demonstrate that the proposed model achieves a BERTScore of 0.82 and outperforms baseline BiLSTM and vanilla Transformer architectures in both Recall and F1-score, while operating efficiently on consumer-grade hardware. The findings confirm that integrating QLoRA and semantic interpretability mechanisms enables scalable, explainable defect prediction suitable for modern software engineering pipelines.

### Pontos importantes para leitura

- **Contribuição:** propõe transformer ajustado com QLoRA e representação que combina tokens de código e métricas estáticas, em nível de linha, sobre mais de 2,3 milhões de linhas rotuladas.
- **Limite:** o resumo informa configuração e escala, mas não permite julgar qualidade das explicações ou generalização sem consultar avaliação completa.

---

## An Extensive Empirical Investigation of Ensemble Learning for Software Defect Prediction

- **Autores:** Mr. D. Jayakumar, Suyash Shukla, Sandeep Kumar
- **Ano / data de publicação:** 2026 / 2026-01-01
- **Origem ou publicação:** International Conference on Evaluation of Novel Approaches to Software Engineering
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-5220-0014981600004015
- **DOI:** [https://doi.org/10.5220/0014981600004015](https://doi.org/10.5220/0014981600004015)
- **URL registrada:** [https://doi.org/10.5220/0014981600004015](https://doi.org/10.5220/0014981600004015)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

: Software Defect Prediction (SDP) is crucial for enhancing the reliability of software by early identification of defect-prone modules. This is significant as software faults can incur substantial expenses and delays in software development. While individual machine learning (ML) models have shown promising outcomes, their effectiveness fluctuates across various datasets due to data imbalance, heterogeneity, and project-specific characteristics. Ensemble learning has emerged as an effective method to address this limitation. This study conducts a comprehensive empirical analysis evaluating individual ML classifiers and ensemble learning techniques for SDP. We first assess the effectiveness of seven common ML classifiers, including Decision Tree, K-Nearest Neighbors, Random Forest, Gradient Boosting, Extra Trees, Bagging, and AdaBoost. To enhance data quality and rectify class imbalance, the datasets are subjected to preprocessing utilizing Ant Colony Optimization (ACO)-based feature selection and the Random Over-Sampling Technique. The hyperparameters for each classifier are optimized by 5-fold Cross-Validation and Grid Search to provide unbiased and robust model tuning. Extensive experiments are conducted on a consolidated dataset of 47,618 samples. The experimental results consistently demonstrate that ensemble models outperform individual ML models. The SLSQP-based ensemble exhibits considerable proficiency in handling varied and imbalanced defect datasets among the evaluated ensemble algorithms. These findings provide significant insights for researchers pursuing reliable, scalable approaches to improve software quality assurance.

### Pontos importantes para leitura

- **Contribuição:** compara sete classificadores individuais e técnicas de ensemble em diferentes datasets, considerando heterogeneidade e desbalanceamento.
- **Limite:** resumo local descreve o desenho, mas não fornece os resultados finais completos; consultar o artigo antes de declarar um vencedor.

---

## An Intelligent Framework for AI-Based Automated Software Testing and Defect Prediction

- **Autores:** Haruto Tanaka Tanaka, Yuki Nakamura
- **Ano / data de publicação:** 2026 / 2026-08-17
- **Origem ou publicação:** Frontiers in Emerging Multidisciplinary Sciences
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; Automação e geração/priorização de testes; IA/ML aplicada à qualidade; Fundamentos e métodos de teste
- **Identificador:** doi-doi-org-10-64917-fems-volume03issue08-04
- **DOI:** [https://doi.org/10.64917/fems/volume03issue08-04](https://doi.org/10.64917/fems/volume03issue08-04)
- **URL registrada:** [https://doi.org/10.64917/fems/volume03issue08-04](https://doi.org/10.64917/fems/volume03issue08-04)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-08-19T09:50:36.513Z

### Resumo registrado

The increasing complexity, scale, and release frequency of contemporary software systems have exposed limitations in conventional testing practices, particularly in exhaustive test execution, regression validation, and early defect identification. This research proposes an intelligent framework that integrates artificial intelligence (AI)-based test automation with software defect prediction to establish a proactive quality-engineering process. The proposed framework combines requirement and code analysis, automated test generation, execution prioritization, defect-risk estimation, feedback-driven model refinement, and quality reporting within a unified architecture. The methodological foundation is a conceptual synthesis of AI-driven test automation principles, with particular emphasis on automation, intelligent prioritization, and predictive quality assurance as discussed by Ramamurthy (2023). The supplied reference corpus also demonstrates how intelligent sensing, pattern recognition, resource optimization, and data-driven classification can conceptually inform automated quality-monitoring architectures, although most of these studies originate outside software testing. The proposed model therefore treats cross-domain evidence as methodological inspiration rather than direct empirical validation. The analysis indicates that combining predictive defect-risk scores with automated test selection can potentially reduce redundant testing, concentrate computational resources on high-risk software components, and improve feedback speed. However, model reliability depends on historical defect data, feature quality, distributional stability, explainability, and integration with existing development pipelines. The framework contributes a structured basis for AI-assisted software quality engineering while identifying empirical validation, benchmark datasets, and explainable prediction as priorities for future research.

### Pontos importantes para leitura

- **Contribuição:** arquitetura conceitual que conecta análise de requisito/código, geração e priorização de testes, previsão de risco, feedback do modelo e relatórios.
- **O que levar:** apresenta um fluxo integrado de qualidade proativa, mas o resumo caracteriza síntese/estrutura proposta; não demonstra por si só eficácia operacional.

---

## Balancing Accuracy and Cost: An Adaptive Hybrid Framework for Feature Selection in Software Defect Prediction

- **Autores:** Xuanyan Li, Dongcheng Li
- **Ano / data de publicação:** 2026 / 2026-07-01
- **Origem ou publicação:** Annual International Computer Software and Applications Conference
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1109-compsac69091-2026-00072
- **DOI:** [https://doi.org/10.1109/COMPSAC69091.2026.00072](https://doi.org/10.1109/COMPSAC69091.2026.00072)
- **URL registrada:** [https://doi.org/10.1109/COMPSAC69091.2026.00072](https://doi.org/10.1109/COMPSAC69091.2026.00072)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

High-dimensional feature spaces in software defect prediction (SDP) often contain redundant and irrelevant features that degrade classifier performance and increase computational overhead. Current multi-objective feature selection approaches struggle with search efficiency and premature convergence when navigating these complex, discrete solution spaces. To address this, we propose AHMOFS-TLM, an adaptive hybrid multi-objective framework that integrates a Token-Grant initialization strategy to generate high-quality diverse solutions, a mask-based decoding reduction mechanism to dynamically prune low-contribution features, and a lane-based crossover-mutation operator to sustain population diversity. Experiments using five classifiers across twelve public datasets demonstrate that AHMOFS-TLM outperforms state-of-the-art baselines, improving classification accuracy by $\mathbf{1. 3 \% - 1 1. 5 \%}$ while reducing training/prediction time by 80.4%-98.5%.

### Pontos importantes para leitura

- **Contribuição:** propõe AHMOFS-TLM, seleção multiobjetivo adaptativa, testada com cinco classificadores e 12 datasets.
- **O que levar:** a seleção de atributos envolve custo computacional e qualidade preditiva; comparar apenas acurácia ignora o custo de busca. O resumo fornecido não traz números finais completos.

---

## Benchmarking TabNet, NODE, and FT-Transformer for Software Defect Prediction: An Empirical Comparison and Explainability Analysis

- **Autores:** Burçak Asal, Burcu Yalçıner
- **Ano / data de publicação:** 2026 / 2026-01-01
- **Origem ou publicação:** IEEE Access
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-1109-access-2026-3656247
- **DOI:** [https://doi.org/10.1109/ACCESS.2026.3656247](https://doi.org/10.1109/ACCESS.2026.3656247)
- **URL registrada:** [https://doi.org/10.1109/ACCESS.2026.3656247](https://doi.org/10.1109/ACCESS.2026.3656247)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Software defect prediction (SDP) is essential for improving software quality and reliability. Traditional machine learning methods, while effective, often fail in capturing complex interactions among software metrics. Recently, specialized deep learning architectures designed for tabular data, including TabNet, Neural Oblivious Decision Ensembles (NODE), and FT-Transformer, have emerged, offering promising potential to enhance prediction accuracy and interpretability. This study comprehensively benchmarks the TabNet, NODE and FT-Transformer models on the challenging NASA JM1 dataset from the PROMISE repository. We address severe class imbalance using NearMiss undersampling and ensure hyperparameter optimization for fairness across comparisons. The performance of the models was evaluated using standard metrics: precision, recall, F1-score, and accuracy. In addition, the interpretability of the model was assessed using SHAP and LIME methods. The FT-Transformer and NODE models demonstrated superior performance, achieving 88% accuracy compared to the accuracy of TabNet 86%. FT-Transformer showed exceptional precision (99%) for defect detection, emphasizing its low false-positive rate. SHAP and LIME analyzes revealed unique attention patterns for each model, highlighting differences in feature importance and decision-making processes. FT-Transformer and NODE outperform TabNet in accuracy and balance between recall and precision. Interpretability analysis provides actionable insights into feature importance, enabling better decision-making in practical SDP workflows.

### Pontos importantes para leitura

- **Contribuição:** compara três arquiteturas tabulares no NASA JM1, usa NearMiss para desbalanceamento e inclui análise de explicabilidade.
- **O que levar:** um benchmark de um dataset é evidência localizada; conferir métricas de classe minoritária e a qualidade das explicações além da acurácia.

---

## BioDefect: The First Dataset for Defect Detection in Bioinformatics Software

- **Autores:** Tianxiang Xu, Xiaoyan Zhu, Xin Lai, Xin Lian, Hangyu Cheng, Jiayin Wang
- **Ano / data de publicação:** 2026 / 2026-05-20
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Dataset / pacote de replicação
- **Tópicos atribuídos:** Predição e localização de defeitos; Datasets e pacotes de replicação
- **Identificador:** arxiv-arxiv-org-abs-2605-20788v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2605.20788v1](http://arxiv.org/abs/2605.20788v1)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Software defect detection is a critical task in software engineering. However, no prior studies have specifically addressed defect detection in bioinformatics software. Given that the performance of defect detection tasks is primarily influenced by both models and datasets, our experiments controlled for model-related factors and confirmed the limitations of existing datasets in bioinformatics software. To address this issue, we introduce BioDefect, the first dataset specifically designed for defect detection in bioinformatics software, aiming to overcome the limitations of existing datasets in this context. Unlike prior datasets, BioDefect includes complete source code repositories, preserving the actual contextual information of defective code, thereby more accurately reflecting real-world defect scenarios in bioinformatics software. Additionally, BioDefect mitigates issues related to label inconsistency and data leakage, ensuring high data quality and experimental reliability. To evaluate the effectiveness of BioDefect, we conduct a systematic assessment on nine language models (LMs), including DeepSeek-R1. The results demonstrate that BioDefect significantly enhances defect detection performance for bioinformatics software. Compared to existing datasets, BioDefect achieves an average F1-score improvement of 29.61% to 38.04% across all models, highlighting its superior advantages. This study fills a critical research gap in bioinformatics software defect detection, laying a foundation for future studies in this field and offering new insights for improving bioinformatics software quality assurance.

### Pontos importantes para leitura

- **Contribuição:** apresenta uma base dedicada a software de bioinformática, preservando repositórios completos e contexto do código.
- **O que levar:** dados específicos do domínio podem preencher lacunas de benchmarks genéricos; avaliar a qualidade dos rótulos e a representatividade antes de comparar com PROMISE.

---

## CoCo-GAN: CodeBERT-driven collaborative generative adversarial learning for software defect prediction

- **Autores:** Xiaoxing Yang, Liwei Xiao, Jianmin Su, Bingding Huang
- **Ano / data de publicação:** 2026 / 2026-03-19
- **Origem ou publicação:** Software quality journal
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-1007-s11219-026-09747-6
- **DOI:** [https://doi.org/10.1007/s11219-026-09747-6](https://doi.org/10.1007/s11219-026-09747-6)
- **URL registrada:** [https://doi.org/10.1007/s11219-026-09747-6](https://doi.org/10.1007/s11219-026-09747-6)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** pelo título, combina CodeBERT e aprendizado adversarial generativo para previsão de defeitos.
- **Limite:** resumo ausente; confirmar desenho experimental e evidência antes de resumir benefícios.

---

## Comparative Evaluation of TabKANet with Oversampling and Feature Selection Ablation for Software Defect Prediction

- **Autores:** Muhammad Faza Azhiman Saputra, Setyo Wahyu Saputro, Mohammad Reza Faisal, Radityo Adi Nugroho, Andi Farmadi
- **Ano / data de publicação:** 2026 / 2026-08-16
- **Origem ou publicação:** Indonesian Journal of Electronics, Electromedical Engineering, and Medical Informatics
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-35882-ijeeemi-v8i3-351
- **DOI:** [https://doi.org/10.35882/ijeeemi.v8i3.351](https://doi.org/10.35882/ijeeemi.v8i3.351)
- **URL registrada:** [https://doi.org/10.35882/ijeeemi.v8i3.351](https://doi.org/10.35882/ijeeemi.v8i3.351)
- **Consulta que encontrou o registro:** software product quality
- **Data de descoberta:** 2026-08-16T09:44:06.931Z

### Resumo registrado

Software defect prediction (SDP) focuses limited testing resources on the modules most likely to fail, but real-world software metric data are tabular, noisy, and severely class-imbalanced, which degrades conventional learners. The Kolmogorov-Arnold Network (KAN) and Transformer architectures recently achieved strong results on tabular data, yet their combined form, TabKANet, has not been evaluated for SDP, nor has the contribution of common preprocessing techniques been quantified. This study adapts and comparatively evaluates TabKANet against established baselines and measures the contribution of oversampling and feature selection through a structured ablation. Twelve all-numerical NASA Metrics Data Program datasets were used. The pipeline applied duplicate removal, MinMax normalization, effective class weighting, and stratified five-fold cross-validation, with oversampling (SMOTE) and Recursive Feature Elimination (RFE) inserted inside the training folds. Four TabKANet variants (A: base, B: +SMOTE, C: +RFE, D: +SMOTE+RFE) were compared with Multi-Layer Perceptron (MLP), standalone KAN, and TabNet, and differences were tested with the Wilcoxon signed-rank test at a 0.05 significance level. The base TabKANet (variant A) achieved the highest mean AUC of 0.7603, slightly ahead of MLP (0.7594) and KAN (0.7583) and well above TabNet (0.7092). Its advantage over TabNet was significant (p = 0.002), whereas it was statistically equivalent to MLP and KAN (p = 0.733). TabNet attained the highest recall (0.739) but the lowest precision (0.228), indicating over-prediction of defects, while TabKANet kept precision and recall balanced. In the ablation, SMOTE significantly reduced AUC (p = 0.042), RFE caused no significant change (p = 0.733), and their combination stayed neutral (p = 0.266). TabKANet therefore performed best without additional resampling. TabKANet is thus a competitive architecture for all-numerical, highly imbalanced SDP, matching strong neural baselines and surpassing TabNet, where effective class weighting alone suffices and SMOTE is counter-productive.

### Pontos importantes para leitura

- **Contribuição:** compara TabKANet com baselines em 12 conjuntos numéricos NASA e mede por ablação o efeito de oversampling e seleção de atributos.
- **O que levar:** a ablação ajuda a separar o ganho da arquitetura do ganho do pré-processamento. Conferir o artigo para resultados e protocolo completos; não atribuir desempenho apenas pelo título.

---

## Considering contextual semantics in domain-adversarial cross-project software defect prediction

- **Autores:** Qing Shen, Jing Xu, Maonian Wu, Jungang Lou, Jiacheng Fei, Shaojun Zhu
- **Ano / data de publicação:** 2026 / 2026-09-22
- **Origem ou publicação:** International Journal of Machine Learning and Cybernetics
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1007-s13042-026-03220-3
- **DOI:** [https://doi.org/10.1007/s13042-026-03220-3](https://doi.org/10.1007/s13042-026-03220-3)
- **URL registrada:** [https://doi.org/10.1007/s13042-026-03220-3](https://doi.org/10.1007/s13042-026-03220-3)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-23T14:15:29.517Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** pelo título, investiga semântica contextual e adaptação adversarial de domínio para previsão entre projetos.
- **Limite:** resumo ausente; método específico e resultados precisam ser conferidos no texto integral.

---

## Cross Project Software Defect Prediction Using Machine Learning with Optimized Feature Selection

- **Autores:** Emediong Bassey Obot, Victor Anaga, Sadiq Thomas, B. Stephen, Samuel Okon Bassey, Solomon Joseph Udoabba, P. Asuquo, Amarachi Vivian Nnajiofor
- **Ano / data de publicação:** 2026 / 2026-01-01
- **Origem ou publicação:** E3S Web of Conferences
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-1051-e3sconf-202673503005
- **DOI:** [https://doi.org/10.1051/e3sconf/202673503005](https://doi.org/10.1051/e3sconf/202673503005)
- **URL registrada:** [https://doi.org/10.1051/e3sconf/202673503005](https://doi.org/10.1051/e3sconf/202673503005)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

In smart city software systems, where interconnected services demand high reliability, Software Defect Prediction (SDP) plays a vital role and reducing maintenance costs by identifying defect-prone modules early in the Software Development Life Cycle (SDLC). Cross-Project Defect Prediction (CPDP) enables defect data from source projects to predict defects in target projects with scarce labels; However, its effectiveness is hindered by feature redundancy, heterogeneous data distributions, and severe class imbalance. To address these challenges, this study proposes an integrated CPDP framework that combines Particle Swarm Optimization with Domain Knowledge (PSO+DK) for feature selection and Adaptive Synthetic Sampling (ADASYN) for class imbalance handling. Experiments were conducted on five widely used NASA datasets; CM1, PC1,PC2, PC3, and PC4 —using Random Forest (RF), Support Vector Machine (SVM), and Extreme Gradient Boosting (XGBoost) classifiers. Results show that PSO+DK enhanced the discriminative power of the models, with the framework achieving the highest accuracy of 0.9785 on PC2 dataset. Furthermore, ADASYN show minimal differences over SMOTE in improving classifier robustness. Highlights promising directions for deploying reliable cross-project prediction in smart city software development

### Pontos importantes para leitura

- **Contribuição:** combina seleção de atributos PSO com conhecimento de domínio e ADASYN para previsão entre projetos em cinco bases NASA.
- **O que levar:** transferência entre projetos precisa lidar simultaneamente com atributos redundantes, diferenças de distribuição e classes raras; a validação deve manter projetos separados.

---

## Cross-project Software Defect Prediction Using Divergence-based Domain Adaptation Approach

- **Autores:** Yash Bhilala, Santosh Singh Rathore
- **Ano / data de publicação:** 2026 / 2026-09-22
- **Origem ou publicação:** Journal of Systems Science and Systems Engineering
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1007-s11518-026-5758-0
- **DOI:** [https://doi.org/10.1007/s11518-026-5758-0](https://doi.org/10.1007/s11518-026-5758-0)
- **URL registrada:** [https://doi.org/10.1007/s11518-026-5758-0](https://doi.org/10.1007/s11518-026-5758-0)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-09-22T14:03:26.481Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** propõe adaptação de domínio baseada em divergência para transferir modelos entre projetos.
- **Limite:** resumo ausente. A motivação é a diferença de distribuição entre projetos, mas não é possível atribuir desempenho ou superioridade ao método pelo registro.

---

## DA-GWO-AUC: A Defect-Aware and AUC-Preserving Grey Wolf Optimisation Framework for Stable Feature Selection in Software Defect Prediction

- **Autores:** Surbhi Syal, Jagdeep Kaur
- **Ano / data de publicação:** 2026 / 2026-08-27
- **Origem ou publicação:** Zenodo (CERN European Organization for Nuclear Research)
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Relatório ou depósito em repositório
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-5281-zenodo-22124553
- **DOI:** [https://doi.org/10.5281/zenodo.22124553](https://doi.org/10.5281/zenodo.22124553)
- **URL registrada:** [https://doi.org/10.5281/zenodo.22124553](https://doi.org/10.5281/zenodo.22124553)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-28T20:56:04.791Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** pelo título, propõe seleção estável de atributos por Grey Wolf Optimization, com foco em preservar AUC e considerar defeitos.
- **Limite:** resumo ausente; validar protocolo e comparação antes de reutilizar a alegação do título.

---

## Dataset Package: An Empirical Study of Classical Machine Learning Models for Software Defect Prediction Under Early-Stage Data Scarcity

- **Autores:** Olatunde David Akinrolabu, Sunday Olusanya Olatunji, Olusola Olajide Ajayi
- **Ano / data de publicação:** 2026 / 2026-09-26
- **Origem ou publicação:** Zenodo (CERN European Organization for Nuclear Research)
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Dataset / pacote de replicação
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade; Datasets e pacotes de replicação
- **Identificador:** doi-doi-org-10-5281-zenodo-22969888
- **DOI:** [https://doi.org/10.5281/zenodo.22969888](https://doi.org/10.5281/zenodo.22969888)
- **URL registrada:** [https://doi.org/10.5281/zenodo.22969888](https://doi.org/10.5281/zenodo.22969888)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-27T14:42:51.773Z

### Resumo registrado

software defect prediction, machine learning, PROMISE dataset, class imbalance, cross-version prediction

### Pontos importantes para leitura

- **Contribuição:** pacote de dados/estudo sobre modelos clássicos de previsão de defeitos sob escassez de dados inicial, usando PROMISE, desbalanceamento e previsão entre versões.
- **Uso:** útil para discutir limites de treinamento com pouco histórico e importância de avaliar curvas de aprendizagem; o registro é um pacote, não necessariamente um artigo revisado.

---

## Deep Learning vs. Traditional Machine Learning for Software Defect Prediction: A Meta-Analysis

- **Autores:** Autor nao informado
- **Ano / data de publicação:** 2026 / 2026-08-24
- **Origem ou publicação:** Engineering and Computing Insights
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-67728-eci-2026-002
- **DOI:** [https://doi.org/10.67728/eci.2026.002](https://doi.org/10.67728/eci.2026.002)
- **URL registrada:** [https://doi.org/10.67728/eci.2026.002](https://doi.org/10.67728/eci.2026.002)
- **Consulta que encontrou o registro:** software product quality
- **Data de descoberta:** 2026-08-24T10:06:10.409Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** meta-análise comparando deep learning e machine learning tradicional para previsão de defeitos.
- **Limite:** resumo ausente; conferir critérios de inclusão, heterogeneidade dos estudos e medidas combinadas antes de citar conclusões.

---

## Detecting concept drift in just-in-time software defect prediction using model interpretation

- **Autores:** Zeynab Chitsazian, Saeed Sedighian Kashi, Amin Nikanjam
- **Ano / data de publicação:** 2026 / 2026-02-01
- **Origem ou publicação:** International Journal of System Assurance Engineering and Management
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1007-s13198-025-03122-7
- **DOI:** [https://doi.org/10.1007/s13198-025-03122-7](https://doi.org/10.1007/s13198-025-03122-7)
- **URL registrada:** [https://doi.org/10.1007/s13198-025-03122-7](https://doi.org/10.1007/s13198-025-03122-7)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-22T14:03:26.481Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** pelo título, usa interpretação de modelos para detectar mudanças de conceito em previsão JIT.
- **Limite:** resumo ausente; o título não esclarece se explicações melhoram a detecção nem o custo operacional.

---

## Diversity-Stacked Ensemble (DSE): A Heterogeneous Meta-Ensemble Framework for Imbalanced Software Defect Prediction

- **Autores:** Tanvir Mhamud Sarker, Tasmia Nabila, Sazin Israk Prioty, Rifat Al Mamun Rudro, Kamruddin Nur
- **Ano / data de publicação:** 2026 / 2026-04-22
- **Origem ou publicação:** European Future Technologies Conference and Exhibition
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1109-fet68771-2026-11601511
- **DOI:** [https://doi.org/10.1109/FET68771.2026.11601511](https://doi.org/10.1109/FET68771.2026.11601511)
- **URL registrada:** [https://doi.org/10.1109/FET68771.2026.11601511](https://doi.org/10.1109/FET68771.2026.11601511)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-22T14:03:26.481Z

### Resumo registrado

Software defect prediction plays a critical role in maintaining software quality and minimization of the cost of software maintenance, but it is not an easy task because of the unbalanced datasets, which results in the so-called Accuracy Paradox, high overall accuracy, poor detection of actual defects. In this paper, it is suggested to use a framework called Diversity-Stacked Ensemble (DSE) that would address this shortcoming by balancing heterogeneous classifiers into a meta-learning framework. The model combines tree based (Histogram Gradient Boosting, ExtraTrees), distance based (K-nearest neighbors), and neural (Multi-layer perceptron) learners; it takes advantage of the strengths of each of these learners. It has a strong preprocessing pipeline, including logarithmic transformation, correlation-based feature selection, robust scaling, and SMOTE oversampling that is used to stabilize training and increase the representation of minority classes.The proposed framework, when evaluated on NASA MDP benchmark datasets (PC1, KC1, CM1) has a high accuracy of 95.05% on PC1 and has a balanced precision and recall, which is higher than traditional single-classifier and ensemble baselines.The findings indicate that DSE model is an effective way of reducing the effect of the Accuracy Paradox and it provides a scalable and dependable model of predicting defects in quality assurance of real-world software.

### Pontos importantes para leitura

- **Contribuição:** meta-ensemble heterogêneo com árvores, KNN e MLP, com pipeline de transformação e seleção de atributos para enfrentar o paradoxo da acurácia.
- **O que levar:** diversidade de modelos pode ser explorada para classes raras, mas deve ser avaliada por recall, F1/MCC e custo, não por acurácia isolada. Resumo não traz resultado final completo.

---

## DP‐GCN: Integrating GraphCodeBERT and GCN With Contrastive Learning for Software Defect Prediction

- **Autores:** Xueting Liu, Haibo Jin
- **Ano / data de publicação:** 2026 / 2026-04-01
- **Origem ou publicação:** Journal of Software: Evolution and Process
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1002-smr-70116
- **DOI:** [https://doi.org/10.1002/smr.70116](https://doi.org/10.1002/smr.70116)
- **URL registrada:** [https://doi.org/10.1002/smr.70116](https://doi.org/10.1002/smr.70116)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Software defect prediction identifies high‐risk code early, reducing development costs and improving software quality. Early studies primarily relied on handcrafted features, which struggled to capture semantic differences and structural information within programs. Later research fused semantic features extracted from abstract syntax trees (ASTs) or graph structures with handcrafted features, improving prediction performance. However, existing fusion methods still face challenges such as insufficient deep semantic mining, inadequate global dependency capture, and weak cross‐project generalization. To address these limitations, this paper proposes DP‐GCN, a defect prediction model integrating GraphCodeBERT, graph convolutional network (GCN), and contrastive learning. Specifically, GraphCodeBERT extracts semantic and structural code representations, GCN captures global dependencies among code elements, and contrastive learning optimizes the feature space distribution to enhance discriminability. The optimized deep features are then fused with handcrafted features and fed into a logistic regression classifier for defect prediction. Experiments on 10 projects from the PROMISE dataset show that DP‐GCN outperforms existing methods in both within‐project and cross‐project scenarios, validating its effectiveness and the synergistic advantages of the three integrated techniques.

### Pontos importantes para leitura

- **Contribuição:** combina representações semânticas/estruturais do GraphCodeBERT, GCN para dependências e aprendizado contrastivo, com foco também em generalização entre projetos.
- **Limite:** resumo descreve motivação e componentes; para afirmar ganho ou custo, verificar resultados e ablações do artigo.

---

## Emerging Patterns and Research Directions on Machine Learning in Software Defect Prediction: A Systematic Literature Review

- **Autores:** Camelia-Petrina Nadejde
- **Ano / data de publicação:** 2026 / 2026-01-01
- **Origem ou publicação:** International Conference on Agents and Artificial Intelligence
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-5220-0014459000004052
- **DOI:** [https://doi.org/10.5220/0014459000004052](https://doi.org/10.5220/0014459000004052)
- **URL registrada:** [https://doi.org/10.5220/0014459000004052](https://doi.org/10.5220/0014459000004052)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

: Software defects remain a significant challenge in the development of reliable and maintainable software systems. Machine Learning (ML) techniques have emerged as effective tools for predicting software defects, enabling early identification of faulty modules and improving software quality. This paper presents a Systematic Literature Review (SLR) of ML-based Software Defect Prediction (SDP) approaches published between 2015 and 2025. The review analyzes widely used ML techniques such as Decision Trees, Support Vector Machines, and Neural Networks, as well as recent advances in ensemble and deep learning models. Datasets are evaluated, along with feature selection strategies and performance metrics. The key challenges identified include class imbalance, feature redundancy, and limited dataset availability. The study highlights trends such as the integration of explainable AI, transfer learning, and AutoML into defect prediction workflows. The findings provide insights into the current state of ML-based SDP and suggest directions for future research and industrial applications.

### Pontos importantes para leitura

- **Contribuição:** revisão de trabalhos de 2015–2025 sobre algoritmos, datasets, seleção de atributos e métricas.
- **Desafios destacados:** desbalanceamento, redundância de atributos e disponibilidade limitada de dados; aponta tendências em explicabilidade e transferência de conhecimento.

---

## ENHANCING SOFTWARE QUALITY THROUGH MACHINE LEARNING DRIVEN DEFECT PREDICTION MODEL

- **Autores:** Asma Hameed, M. Khan
- **Ano / data de publicação:** 2026 / 2026-03-26
- **Origem ou publicação:** Physical Education, Health and Social Sciences
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-63163-jpehss-v4i1-1640
- **DOI:** [https://doi.org/10.63163/jpehss.v4i1.1640](https://doi.org/10.63163/jpehss.v4i1.1640)
- **URL registrada:** [https://doi.org/10.63163/jpehss.v4i1.1640](https://doi.org/10.63163/jpehss.v4i1.1640)
- **Consulta que encontrou o registro:** software quality model
- **Data de descoberta:** 2026-08-15T22:37:48.767Z

### Resumo registrado

Software defects are among the key problems in software engineering as it compromises software reliability, boosts up maintenance expenses and impacts software quality. Traditionally, defects are discovered using a time-consuming technique and, in a large and complex software system, it is not so efficient. This study was interested in software defect prediction application of machine learning techniques to improve software quality assurance in the early stage in this regard. Designing a machine learning model that can predict and detect the defect prone software modules at an early stage of Software Development Life Cycle (SDLC) is the prime objective of research. Historical Software Defect Data sets from PROMISE repository were used in the study. To improve data quality, the following data cleaning, class balancing, data normalization and missing value imputation techniques were employed. The most relevant software metrics were also selected using feature selection techniques like Principal Component Analysis (PCA). Different machine learning algorithms were implemented and tested including Random Forest, Support Vector Machine (SVM) and Naïve Bayes with the performance metrics of accuracy, precision, recall, and F1-score. The outcomes of the experiments showed that the use of machine learning technique had a positive impact on the software defect detection prediction accuracy. Among the models implemented the complex and elaborated models gave better results, with the best model being the Random Forest model. The study shows that machine learning defect prediction models could be beneficial for software developers to reduce the amount of software testing and software maintenance cost, software reliability and software quality as well as at the early stage of software development to identify software components that may be at risk of failure. Moreover, the study emphasized on data pre-processing and feature selection approaches to boost the prediction accuracy and to perform successful software quality assurance procedures.

### Pontos importantes para leitura

- **Contribuição:** descreve pipeline de previsão com dados PROMISE, limpeza, balanceamento, normalização e imputação para identificar módulos propensos a defeitos.
- **Limite:** resumo indexado não detalha amostras nem resultados finais; tratar como proposta/estudo aplicado até conferir o texto.

---

## ET-SDP: Enhancing Code Embeddings with Effort-Related and Test Coverage Metrics for Improved Software Defect Prediction

- **Autores:** Ioana-Gabriela Chelaru, Gabriela Czibula, Zsuzsanna Marian, Istvan-Gergely Czibula
- **Ano / data de publicação:** 2026 / 2026-08-24
- **Origem ou publicação:** Acta Universitatis Sapientiae Informatica
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1007-s44427-026-00038-3
- **DOI:** [https://doi.org/10.1007/s44427-026-00038-3](https://doi.org/10.1007/s44427-026-00038-3)
- **URL registrada:** [https://doi.org/10.1007/s44427-026-00038-3](https://doi.org/10.1007/s44427-026-00038-3)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-08-24T10:06:10.409Z

### Resumo registrado

Abstract Software defect prediction (SDP) aims to identify defect-prone code modules in order to optimize testing resources and improve software quality. While traditional approaches rely on software metrics derived from code structure, this paper proposes , an approach that enhances code embeddings using effort-related and test coverage metrics. We introduce three feature sets: the top-30 software metrics selected through clustering relevance ranking, 170 effort-related metrics capturing development process characteristics, and five test coverage metrics derived from unit tests. Our evaluation on 15 releases of Apache Calcite and 6 releases of Apache Ant-Ivy demonstrates that effort-related and test coverage metrics provide better defect prediction performance with far fewer features than traditional software metrics. In unsupervised clustering experiments, effort-based embeddings achieve better alignment with defect labels. In supervised classification, effort-related features achieve an AUC of 0.932 on Calcite and 0.883 on Ant-Ivy, outperforming the top-30 software metrics at comparable feature count (AUC of 0.632 and 0.587, respectively). Feature importance analysis reveals that test coverage metrics are the strongest predictors of defect proneness. These findings suggest that process-oriented metrics, particularly those related to code testing and development history, capture defect patterns more effectively per feature than static code structure metrics, offering practical guidance for software quality assurance.

### Pontos importantes para leitura

- **Contribuição:** amplia embeddings de código com métricas de esforço e cobertura de testes; avalia 15 versões do Calcite e 6 do Apache Ant-Ivy.
- **Resultado reportado:** o resumo relata melhora com menos atributos do que métricas tradicionais. Aplicação depende da disponibilidade e comparabilidade de dados de processo e cobertura.

---

## Evaluating SMOTE-based Class Imbalance Handling in Software Defect Prediction

- **Autores:** Abdulbari Alamri, Muhammad Bilal
- **Ano / data de publicação:** 2026 / 2026-06-04
- **Origem ou publicação:** Journal of Advances in Mathematics and Computer Science
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-9734-jamcs-2026-v41i62161
- **DOI:** [https://doi.org/10.9734/jamcs/2026/v41i62161](https://doi.org/10.9734/jamcs/2026/v41i62161)
- **URL registrada:** [https://doi.org/10.9734/jamcs/2026/v41i62161](https://doi.org/10.9734/jamcs/2026/v41i62161)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Class imbalance remains a persistent challenge in software defect prediction because defective modules are usually much fewer than non-defective modules. This imbalance can reduce a model's ability to identify the minority class and can also make performance interpretation misleading when evaluation relies on unsuitable measures. This paper evaluates the effect of the Synthetic Minority Over-sampling Technique (SMOTE) on defect prediction performance in a focused and leakage-safe empirical setting. The study compares Logistic Regression, Random Forest and k-Nearest Neighbors on the AEEEM_JDT benchmark dataset using imbalance-aware metrics. The findings show that SMOTE improved threshold-based performance for Random Forest and k-Nearest Neighbors, while Logistic Regression showed almost no improvement in F1-score and a decline in MCC. Random Forest improved from 0.566 to 0.627 in F1-score and from 0.499 to 0.535 in MCC, while k-Nearest Neighbors improved from 0.533 to 0.628 in F1-score and from 0.476 to 0.523 in MCC. However, PR-AUC decreased for all three models after SMOTE, indicating that better classification at a selected operating point did not necessarily produce better ranking quality across thresholds. The results suggest that SMOTE should be treated as a conditional imbalance-handling technique rather than a universally beneficial preprocessing step. Its usefulness depends on the classifier and on whether the practical objective is fixed-threshold defect detection or risk ranking.

### Pontos importantes para leitura

- **Contribuição:** comparação leakage-safe de regressão logística, Random Forest e KNN no AEEEM_JDT, com métricas sensíveis ao desbalanceamento.
- **Resultado reportado:** SMOTE melhora medidas baseadas em limiar para RF e KNN; quase não muda F1 da regressão logística e reduz MCC. A escolha depende do algoritmo e da métrica.

---

## Evaluating Software Defect Prediction Models via the Area Under the ROC Curve Can Be Misleading

- **Autores:** Luigi Lavazza, Gabriele Rotoloni, Sandro Morasca
- **Ano / data de publicação:** 2026 / 2026-04-22
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** arxiv-arxiv-org-abs-2604-20742v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2604.20742v1](http://arxiv.org/abs/2604.20742v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Background: Receiver Operating Characteristic (ROC) curves are widely used to evaluate the performance of Software Defect Prediction (SDP) models that estimate module fault-proneness, i.e., the probability that a module is faulty. A ROC curve maps a model's performance in terms of True Positive Rate and False Positive Rate for any possible threshold set on fault-proneness. The Area Under the ROC Curve (AUC) summarizes the performance of a model across all possible thresholds. Traditionally, ROC curves completely above the bisector of the ROC space are considered better than random, and high AUC values are associated with good performance. Aim: We investigate whether these beliefs are correct, hence if SDP model evaluation based on ROC curves and AUC is reliable. Method: We decorate ROC curves by highlighting the points corresponding to threshold values. We also represent True Positive Rate and False Positive Rate as functions of the threshold. Thus, we can evaluate whether a model classifies both faulty and non-faulty modules better than the random model. Results: We show that commonly used evaluation criteria may lead to wrong conclusions. Conclusions: A high value of AUC does not guarantee that both the True Positive Rate and the False Positive Rate of a model are better than the random model's for all possible thresholds. Either decorated ROC curves or alternative representations are needed to appreciate all the relevant aspects of SDP models.

### Pontos importantes para leitura

- **Contribuição:** questiona se AUC resume adequadamente modelos de previsão de módulos defeituosos e analisa pontos operacionais das curvas ROC.
- **O que levar:** AUC agrega limiares que talvez não sejam usados na prática; escolher métricas alinhadas à capacidade de inspeção e ao custo de falsos positivos/negativos.

---

## Evolution of Ensemble Learning in Software Defect Prediction: A Systematic Literature Review

- **Autores:** Somya R. Goyal
- **Ano / data de publicação:** 2026 / 2026-01-01
- **Origem ou publicação:** IEEE Access
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1109-access-2026-3710498
- **DOI:** [https://doi.org/10.1109/ACCESS.2026.3710498](https://doi.org/10.1109/ACCESS.2026.3710498)
- **URL registrada:** [https://doi.org/10.1109/ACCESS.2026.3710498](https://doi.org/10.1109/ACCESS.2026.3710498)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-22T14:03:26.481Z

### Resumo registrado

Software Defect Prediction (SDP) is crucial for early defect identification and targeted software testing to handle fault prone modules. SDP has been observed in association with a large body of machine learning and deep learning studies. The performance of Ensemble Learning (EL) models for SDP is far beyond over that has been achieved with single learners. The stability and reliability of ensembles over the constituent base models have raised the influx of EL based SDP Models in the past decade. A comprehensive review of the shifting paradigm of Ensemble Learning from its initial exploration in SDP to the advanced integration is essential as a reference for future researchers to achieve more reliable and effective EL based SDP models. This study represents a systematic literature review with following aspects- 1) Research evolution in ensembles for SDP over time, 2) Variety of ensemble learners being used, 3) Range of the base learners adopted for ensembles, 4) Dataset usage trends and evaluation metrics employed in experiments, and 5) Research gaps and limitations of applying EL in SDP literature and suggest guidelines for future research. To conduct the review, four digital libraries are searched (i.e., IEEE Xplore, SpringerLink, ACM DL, ScienceDirect), following the PRISMA guidelines. With appropriate quality assessment criteria applied, 97 studies are selected from the time-period of 16 years from January 2010 to December 2025, to produce the evidence for the reported observations. It can be concluded that Ensemble Learning based SDP models progress from initial exploration to advanced integration out of the virtue of possessing the potential to break the performance ceiling constrained by individual base SDP models.

### Pontos importantes para leitura

- **Contribuição:** revisão sistemática da evolução de ensembles em SDP, cobrindo famílias de combinação e sua relação com estabilidade e confiabilidade.
- **O que levar:** ensemble não é uma técnica única; avaliar diversidade, robustez e comparação com modelos-base. Verificar protocolo e achados detalhados na publicação.

---

## Explainable deep learning for software defect prediction: a residual-shuffle network approach with SHAP and LIME

- **Autores:** Samira Keramat Talatapeh, M. Dishabi, Hamed Pezeshki, Halimeh Madadi
- **Ano / data de publicação:** 2026 / 2026-01-12
- **Origem ou publicação:** International Journal of Data Science and Analysis
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-1007-s41060-025-00987-6
- **DOI:** [https://doi.org/10.1007/s41060-025-00987-6](https://doi.org/10.1007/s41060-025-00987-6)
- **URL registrada:** [https://doi.org/10.1007/s41060-025-00987-6](https://doi.org/10.1007/s41060-025-00987-6)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** pelo título, combina uma rede residual-shuffle com explicações SHAP e LIME para SDP.
- **Limite:** resumo ausente; não assumir que usar ferramentas de explicação garante explicações estáveis ou compreensíveis.

---

## Explainable Machine Learning for Software Defect Prediction in Large-Scale Code Repositories Using Code Embeddings and Repository-Level Knowledge Graphs

- **Autores:** Pratiti Bhadra, V. V., Keerthika T, S. S
- **Ano / data de publicação:** 2026 / 2026-01-01
- **Origem ou publicação:** International Journal of Computer Science and Engineering Innovations
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-64137-31079458-ijcsei-v2i2p102
- **DOI:** [https://doi.org/10.64137/31079458/ijcsei-v2i2p102](https://doi.org/10.64137/31079458/ijcsei-v2i2p102)
- **URL registrada:** [https://doi.org/10.64137/31079458/ijcsei-v2i2p102](https://doi.org/10.64137/31079458/ijcsei-v2i2p102)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-22T14:03:26.481Z

### Resumo registrado

Software defect prediction has moved from static metric classification toward learning-based quality intelligence that must operate across millions of functions, commits, tests, services, and developer interactions. This paper proposes an explainable machine learning framework for large-scale defect prediction that fuses contextual code embeddings, repository-level knowledge graphs, and governance-aware explanation mechanisms into a single lifecycle architecture. The core premise is that source code tokens alone cannot represent the socio-technical context in which defects emerge: dependency changes, test failures, build instability, ownership patterns, issue histories, deployment topology, and review signals also shape risk. Accordingly, the proposed framework encodes functions and patches with transformer-based code representations, constructs a typed repository graph from version-control and DevOps artifacts, and combines these representations through a graph-aware fusion layer that predicts file-, function-, and commit-level defect risk. The design builds on advances in pre-trained programming-language models [1]. It also aligns with lifecycle governance work that connects defect prediction, automated testing, and architecture-centered delivery controls [2]. For regulated and high-assurance domains, the model must produce explanations that are traceable enough for review triage, audit, and risk acceptance rather than merely producing probability scores [3]. The explainability layer, therefore, integrates local feature attribution, graph rationales, counterfactual repository edits, and confidence calibration so that predictions can be inspected by developers, testers, release managers, and compliance reviewers. A reproducible experimental protocol is specified for temporal validation, cross-project evaluation, ablation analysis, effort-aware ranking, and explanation faithfulness. The paper contributes a rigorous blueprint for defect prediction systems that are semantically aware, context-rich, and operationally trustworthy while avoiding ungrounded claims about empirical performance before dataset-specific evaluation is executed.

### Pontos importantes para leitura

- **Contribuição proposta:** arquitetura de larga escala que junta embeddings de código, grafo do repositório e sinais de dependências, testes, builds, ownership e histórico, com mecanismos de explicação.
- **Limite:** o resumo descreve uma arquitetura de ciclo de vida; separar proposta arquitetural de validação empírica ao citar.

---

## Gradient-Guided Adversarial Data Augmentation with Genetic Optimization for Imbalanced Software Defect Prediction

- **Autores:** Wei Zheng, Kangpeng Jin, Hao Pan
- **Ano / data de publicação:** 2026 / 2026-02-06
- **Origem ou publicação:** Proceedings of the 2026 International Conference on Big Data and Informatization Education
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1145-3806980-3807093
- **DOI:** [https://doi.org/10.1145/3806980.3807093](https://doi.org/10.1145/3806980.3807093)
- **URL registrada:** [https://doi.org/10.1145/3806980.3807093](https://doi.org/10.1145/3806980.3807093)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-22T14:03:26.481Z

### Resumo registrado

The problem of data imbalance is widespread in software defect prediction and seriously affects the prediction performance of classification models. In this study, we propose a new data augmentation method, namely the Gradient Perturbation Data Augmentation method (GPDA), which combines gradient information and genetic algorithm optimization to generate adversarial samples for improving the ability of classifiers to handle imbalanced data.GPDA exploits gradient information to capture the influence of input features on model outputs, and employs a genetic algorithm to jointly consider the Euclidean distances among adversarial samples, normal samples, and defect samples in order to generate samples that can enhance classification performance. By comparing multiple data augmentation methods on several classifiers, experimental results show that GPDA significantly improves the average AUC and G-mean values on most classifiers. The adversarial sample generation strategy effectively enhances the prediction capability of the classifiers. To further analyze the dependence of the model on adversarial samples, we design an experiment by gradually removing adversarial samples from the training data. By training models under different adversarial sample ratios and evaluating their performance on the same test set, the results indicate that adversarial samples play an important role in improving model performance.

### Pontos importantes para leitura

- **Contribuição:** GPDA usa gradientes e otimização genética para gerar dados adversariais para classes minoritárias.
- **Resultado reportado:** o resumo afirma melhora de AUC média em comparação com técnicas de aumento de dados; faltam números no registro local para quantificar o efeito.

---

## HGFE: A plug-and-play heterogeneous graph feature enhancement framework for software fault localization

- **Autores:** Wei Zheng, Ang Xu, Xin Fan, Hao Pan, Fengyu Yang, Peng Xiao
- **Ano / data de publicação:** 2026 / 2026-08-24
- **Origem ou publicação:** Software Quality Journal
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1007-s11219-026-09786-z
- **DOI:** [https://doi.org/10.1007/s11219-026-09786-z](https://doi.org/10.1007/s11219-026-09786-z)
- **URL registrada:** [https://doi.org/10.1007/s11219-026-09786-z](https://doi.org/10.1007/s11219-026-09786-z)
- **Consulta que encontrou o registro:** software maintainability reliability
- **Data de descoberta:** 2026-08-24T10:06:10.409Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** pelo título, propõe aprimorar atributos em grafos heterogêneos para localização de falhas.
- **Limite:** resumo ausente; não é possível descrever tipos de nós, benchmark ou precisão obtida.

---

## Hybrid Approach to Software Defect Prediction and Classification using a Variational Autoencoder and Scalable Graph Attention Network

- **Autores:** Rajesh Kumar Udumu, Vasumathi D
- **Ano / data de publicação:** 2026 / 2026-06-24
- **Origem ou publicação:** Journal of Artificial Intelligence and Technology
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-37965-jait-2026-0878
- **DOI:** [https://doi.org/10.37965/jait.2026.0878](https://doi.org/10.37965/jait.2026.0878)
- **URL registrada:** [https://doi.org/10.37965/jait.2026.0878](https://doi.org/10.37965/jait.2026.0878)
- **Consulta que encontrou o registro:** defect prediction software quality
- **Data de descoberta:** 2026-06-26T00:21:15.678Z

### Resumo registrado

Software performance, security, and dependability depend on software defect prediction (SDP) and classification. Class imbalance, a lack of high-quality labeled data, overfitting in small or skewed datasets, poor interpretability, and the dynamic nature of software systems are among the issues that SDP classification faces. This research proposes an SDP with a classification framework that combines the scalable graph relearn attention network (SGRAN) and the optimized variational autoencoder (VAE) to tackle these challenges. Learning-to-rank under-sampling (LTRUS) selectively eliminates less-relevant majority-class instances of the majority class to reduce class imbalance. After learning structured latent representations, the VAE model improves generalization by identifying significant defect patterns. To further normalize the dataset by reducing undersampling effects and guaranteeing balanced representation between defective and non-defective modules, particle swarm optimization (PSO) is combined with crayfish bobcat optimization algorithm (CBOA) to dynamically optimize the termination condition. The expected defective modules are fed into the SGRAN for classification, ensuring unique and consistent defect categorization. The VAE-CBOA achieves 99.07% prediction accuracy and a high F1-score of 99.01%, outperforming previous studies. Using traditional methods, the proposed work achieved 98.2% recall and 98.02% accuracy. In each prediction and class responsibility, the proposed model’s efficiency and values are highlighted.

### Pontos importantes para leitura

- **Contribuição:** combina VAE, rede de atenção em grafo e subamostragem orientada a ranking para lidar com desbalanceamento e representações estruturadas.
- **Limite:** o resumo descreve a arquitetura e problemas-alvo, mas não fornece aqui resultados comparativos suficientes para concluir superioridade.

---

## IMPACT OF SOFTWARE PROCESS METRICS ON DEFECT DETECTION EFFICIENCY: A COMPARATIVE STUDY WITHIN ADVANCED SOFTWARE QUALITY ASSURANCE FRAMEWORKS

- **Autores:** Rabia Kausar, Hamna, Saleem Zubair, Sabah Arif, Ayesha Saddiqa
- **Ano / data de publicação:** 2026 / 2026-03-02
- **Origem ou publicação:** Contemporary Journal of Social Science Review
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; Processos, requisitos e formação em QA; Garantia e engenharia de qualidade
- **Identificador:** doi-doi-org-10-63878-cjssr-v4i1-2003
- **DOI:** [https://doi.org/10.63878/cjssr.v4i1.2003](https://doi.org/10.63878/cjssr.v4i1.2003)
- **URL registrada:** [https://doi.org/10.63878/cjssr.v4i1.2003](https://doi.org/10.63878/cjssr.v4i1.2003)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-09-01T14:10:27.703Z

### Resumo registrado

The issue of software defects has been a major concern in the contemporary software development and has greatly impacted the reliability of the product, cost of development as well as delivery timelines. One of the main goals of Software Quality Assurance (SQA) practices is therefore effective defect detection. Software process metrics has become one of the useful tools that can be used to track the development activities and enhance quality results within recent years. The paper examines how software process metrics can influence the efficiency of defect detection by taking a combined approach to the advanced SQA and software process management practices. The research methodology includes a comparison, which is premised on a systematic study and review of empirical studies published in the period between 2015 and 2025. Various types of process metrics such as change-based metrics, effort and time metrics, defect flow metrics, and process compliance metrics are assessed in the study in various environments of the development. The findings suggest that change-based and defect flow metrics are the most influential ones in terms of the early and effective detection of defects, whereas effort and compliance metrics indirectly support the approach with the enhanced process control and resource management. The results indicate the significance of taking a more comprehensive, measurement-based, SQA that establishes process metrics against quality organizational goals. The study offers effective ideas that can be used by quality managers and practitioners to improve efficiency of defect detection in the process of improving maturity of software processes.

### Pontos importantes para leitura

- **Contribuição:** revisão comparativa de estudos de 2015–2025 sobre métricas de processo e eficiência de detecção de defeitos.
- **O que levar:** métricas de mudança, esforço e atividade podem complementar métricas do produto; por ser uma síntese secundária, conferir escopo e critérios antes de tratar associações como causalidade.

---

## Interpretable Software Defect Prediction with Ensemble Models Across Static and Process Metrics

- **Autores:** Dominik Łysak, Małgorzata Przybyła‐Kasperek
- **Ano / data de publicação:** 2026 / 2026-09-20
- **Origem ou publicação:** Lecture notes in computer science
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1007-978-3-032-36868-3-31
- **DOI:** [https://doi.org/10.1007/978-3-032-36868-3_31](https://doi.org/10.1007/978-3-032-36868-3_31)
- **URL registrada:** [https://doi.org/10.1007/978-3-032-36868-3_31](https://doi.org/10.1007/978-3-032-36868-3_31)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-22T14:03:26.481Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** combina ensembles e métricas estáticas/de processo para previsão interpretável.
- **Limite:** resumo ausente; não se conhecem os métodos de explicação nem a evidência de interpretabilidade pelo registro.

---

## KG-Commit: A Dynamic Knowledge Graph for Online Just-in-Time Software Defect Prediction

- **Autores:** Mohsen Hesamolhokama, Mohammad Sina Beyrami Aghbash, Behnam Rohani, Mohammadamin Fazli, Jafar Habibi
- **Ano / data de publicação:** 2026 / 2026-09-05
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** arxiv-arxiv-org-abs-2609-06272v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2609.06272v1](http://arxiv.org/abs/2609.06272v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-09T13:45:24.383Z

### Resumo registrado

Just-in-time software defect prediction (JIT-SDP) aims to identify risky commits as they arrive and provide developers with timely feedback. This need for low latency has led most approaches to rely on commit-level information and overlook the broader project context in which a change occurs. Incorporating this context is challenging because it requires both efficient retrieval for incoming commits and continual maintenance as the repository evolves. We introduce KG-Commit, a dynamic knowledge graph that incrementally maintains repository history, within-file code structure, and commit semantics as the project evolves. It also uses an AST-delta mechanism to track structural changes between file edits and relies on lightweight graph inference running entirely on CPU. Our evaluation on 11 Apache software projects against six baselines shows that KG-Commit achieves the highest aggregate Macro-F1 (0.704), G-Mean (0.706), and AUC (0.809) using our selected inference pipeline. Under a realistic online protocol, it outperforms LR, HGB, RF, and DeepJIT on all 11 projects, LApredict on 10, and JITLine on 9 projects in Macro-F1, with the aggregate paired difference significant in every case. KG-Commit processes each commit in approximately 1.33~s, with a cost that remains stable as the graph grows and is compatible with commit rates observed in real-world projects. These findings show that rich project context can be efficiently maintained and exploited for online JIT-SDP.

### Pontos importantes para leitura

- **Contribuição:** grafo de conhecimento dinâmico que atualiza histórico do repositório, estrutura AST e semântica de commits; inferência leve em CPU para previsão JIT.
- **Resultado reportado:** em 11 projetos Apache, relata Macro-F1 0,704, G-Mean 0,706 e AUC 0,809 no pipeline selecionado. São resultados do benchmark descrito, não promessa de desempenho em qualquer repositório.

---

## Machine Learning and Evolutionary Computing Techniques for Software Defect Prediction: A Systematic Review and Comparative Analysis

- **Autores:** Sruthi R Varrier and Jayalakshmi M
- **Ano / data de publicação:** 2026 / 2026-06-25
- **Origem ou publicação:** International Journal of Advanced Research in Science, Communication and Technology
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-48175-ijarsct-37226
- **DOI:** [https://doi.org/10.48175/ijarsct-37226](https://doi.org/10.48175/ijarsct-37226)
- **URL registrada:** [https://doi.org/10.48175/ijarsct-37226](https://doi.org/10.48175/ijarsct-37226)
- **Consulta que encontrou o registro:** software maintainability reliability
- **Data de descoberta:** 2026-08-21T09:53:52.283Z

### Resumo registrado

Software defects remain one of the primary challenges affecting software quality, reliability, maintainability, and development cost. Early identification of defective modules through software defect prediction techniques enables developers to allocate testing resources efficiently and improve overall software quality. Over the past decade, machine learning and evolutionary computing approaches have emerged as effective solutions for software defect prediction, utilizing software metrics and historical project data to identify defect-prone components. This paper presents a systematic review and comparative analysis of machine learning and evolutionary computing techniques employed in software defect prediction. The study examines traditional machine learning algorithms, including Decision Trees, Random Forests, Naïve Bayes, Support Vector Machines, K-Nearest Neighbors, and Logistic Regression, alongside ensemble, deep learning, and evolutionary approaches such as Genetic Algorithms and hybrid rule-mining techniques. A comprehensive analysis of widely used benchmark datasets, software metrics, performance evaluation measures, and reported outcomes from existing studies is presented. Furthermore, the review identifies prevailing research trends, methodological challenges, dataset limitations, class imbalance issues, and interpretability concerns that influence prediction performance. Based on the findings, the paper highlights emerging directions for future research, including explainable artificial intelligence, hybrid optimization frameworks, automated feature engineering, and adaptive learning techniques. The study provides researchers and practitioners with a consolidated understanding of current advancements in software defect prediction and serves as a valuable reference for the development of more accurate and reliable prediction models. The review analyzes studies published between 2015 and 2026 and synthesizes findings from major software defect prediction research efforts.

### Pontos importantes para leitura

- **Contribuição:** revisão sistemática/comparativa de técnicas de ML e computação evolutiva para previsão de defeitos.
- **O que levar:** útil como mapa de famílias de métodos e dados; conferir período, protocolo de revisão e evidências primárias antes de extrair ranking de algoritmos.

---

## Machine Learning-Based Software Defect Prediction and Its Application: A Systematic Review

- **Autores:** A. Abdulsalam, M. Timothy, C. Eke
- **Ano / data de publicação:** 2026 / 2026-02-27
- **Origem ou publicação:** AGE Journal of Science
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-65997-bitm3382
- **DOI:** [https://doi.org/10.65997/bitm3382](https://doi.org/10.65997/bitm3382)
- **URL registrada:** [https://doi.org/10.65997/bitm3382](https://doi.org/10.65997/bitm3382)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-22T14:03:26.481Z

### Resumo registrado

Software errors may cause serious problems in any system, expose security vulnerabilities, and result in expensive downtime, thus negatively affecting user experience and efficiency. Machine learning algorithms allow for predicting software defects by analyzing the source code and related patterns. These types of predictive features make it easier to identify potential software defects at an early stage, enabling proactive responses. Recent developments in machine learning-driven software reliability and software defect prediction were considered in this study, with special attention to the methods employed, the conclusions made, and the limitations of each study. The review methodologically synthesized the recent literature by classifying the machine learning algorithms used, the nature of the datasets, the performance metrics used for evaluation, and the domains examined. Empirical validation processes and the implementation of machine learning strategies were included in the review. This review additionally revealed some weaknesses; the importance of validating them by tackling real-world problems, as well as conducting an extensive evaluation of scalability. The outcomes of the study were used to come up with recommendations, which are expected to guide researchers and practitioners on how to make findings on future studies on machine learning-based software defect prediction towards advanced software development procedures.

### Pontos importantes para leitura

- **Contribuição:** revisão recente que classifica algoritmos, datasets, métricas de avaliação e domínios em previsão de defeitos baseada em ML.
- **O que levar:** usar para mapear tendências e limitações; checar protocolo de busca e estudos incluídos antes de apoiar decisões técnicas em suas conclusões.

---

## MSTDP: a multi-scale temporal deep learning framework for just-in-time software defect prediction with cross-attention fusion

- **Autores:** Ziyang Liu, Chunhong Yuan, Hengjun Liu, Xiangyu Li, Shengrui Liu, Xiang Zhou, Zhikui Tian
- **Ano / data de publicação:** 2026 / 2026-01-17
- **Origem ou publicação:** Journal of King Saud University: Computer and Information Sciences
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-1007-s44443-025-00401-y
- **DOI:** [https://doi.org/10.1007/s44443-025-00401-y](https://doi.org/10.1007/s44443-025-00401-y)
- **URL registrada:** [https://doi.org/10.1007/s44443-025-00401-y](https://doi.org/10.1007/s44443-025-00401-y)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Just-In-Time Defect Prediction (JITDP), as an important means to improve software quality and reduce maintenance costs, has received widespread attention in recent years. However, existing methods generally neglect multi-scale temporal features during the development process, lack dynamic modeling of developer behavior and project lifecycle, and have limited robustness when facing concept drift. To address these limitations, this paper proposes a novel Multi-Scale Temporal Defect Prediction framework (MSTDP) that integrates commit behavior patterns at temporal granularities of hours, days, and weeks, combining code semantic information, developer behavioral features, and lifecycle-aware mechanisms to comprehensively characterize the dynamic evolution patterns of defect introduction. MSTDP achieves deep feature fusion through cross-attention mechanisms and constructs a concept drift analysis module to enhance the model’s adaptability across different evolutionary stages. Empirical results on 9 large-scale open-source projects demonstrate that MSTDP achieves optimal performance across all evaluation metrics: average accuracy of 76.89% (0.56% improvement), precision of 61.02% (0.53% improvement), recall of 67.82% (0.64% improvement), F1-score of 60.93% (0.46% improvement), and AUC of 81.88% (0.52% improvement), significantly outperforming 7 mainstream baseline methods including JITBoost, FENSE, and JIT-CF. Wilcoxon signed-rank tests confirm the statistical significance of these improvements (p<0.05\documentclass[12pt]{minimal} \usepackage{amsmath} \usepackage{wasysym} \usepackage{amsfonts} \usepackage{amssymb} \usepackage{amsbsy} \usepackage{mathrsfs} \usepackage{upgreek} \setlength{\oddsidemargin}{-69pt} \begin{document}$$\varvec{p < 0.05}$$\end{document}). The research results validate the effectiveness of this method for efficient and accurate defect prediction in dynamic software engineering environments, demonstrating stronger generalization capability and robustness against concept drift.

### Pontos importantes para leitura

- **Contribuição proposta:** combina padrões de commits em escalas horárias, diárias e semanais com semântica de código, comportamento de desenvolvedores e atenção cruzada; considera concept drift.
- **Limite:** resumo descreve a arquitetura; consultar resultados para confirmar robustez e custo.

---

## Project-Aware Validation in Software Defect Prediction: A Controlled Simulation and Real-World Benchmark Study of Evaluation Optimism

- **Autores:** Vladimir Tomilov
- **Ano / data de publicação:** 2026 / 2026-09-10
- **Origem ou publicação:** Research Square
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-21203-rs-3-rs-10975428-v1
- **DOI:** [https://doi.org/10.21203/rs.3.rs-10975428/v1](https://doi.org/10.21203/rs.3.rs-10975428/v1)
- **URL registrada:** [https://doi.org/10.21203/rs.3.rs-10975428/v1](https://doi.org/10.21203/rs.3.rs-10975428/v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-12T12:53:01.220Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** pelo título, analisa otimismo na avaliação de previsão de defeitos com validação sensível ao projeto e benchmark real.
- **Limite:** resumo não disponível; não inferir tamanho do viés nem recomendar protocolo específico sem consultar o manuscrito.

---

## Quality Assurance of Software Incorporating Graph Neural Networks for Defect Prediction

- **Autores:** D. R. Medhunhashini, K. S. Jeen Marseline, B. Varun
- **Ano / data de publicação:** 2026 / 2026-09-04
- **Origem ou publicação:** não informado
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-1002-9781394422791-ch21
- **DOI:** [https://doi.org/10.1002/9781394422791.ch21](https://doi.org/10.1002/9781394422791.ch21)
- **URL registrada:** [https://doi.org/10.1002/9781394422791.ch21](https://doi.org/10.1002/9781394422791.ch21)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-09-05T12:45:27.943Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** pelo título, trata de garantia de qualidade com redes neurais em grafos para previsão de defeitos.
- **Limite:** resumo ausente e metadados de venue incompletos no índice; usar apenas após verificar a publicação e o texto.

---

## Quantum Data Encoding Techniques for Software Defect Prediction: A Resource-Aware Evaluation

- **Autores:** Mohamed Hasni, Fatiha El Hatmi, Nesrine Ben Yahia, Qassim Nasir, Manar Abu Talib
- **Ano / data de publicação:** 2026 / 2026-08-26
- **Origem ou publicação:** Communications in computer and information science
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-1007-978-3-032-36816-4-14
- **DOI:** [https://doi.org/10.1007/978-3-032-36816-4_14](https://doi.org/10.1007/978-3-032-36816-4_14)
- **URL registrada:** [https://doi.org/10.1007/978-3-032-36816-4_14](https://doi.org/10.1007/978-3-032-36816-4_14)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-27T19:51:46.209Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** avalia codificações de dados quânticos para previsão de defeitos considerando recursos computacionais.
- **Limite:** resumo ausente. O título não prova vantagem frente a métodos clássicos nem viabilidade em hardware real.

---

## Quantum-Inspired Deep Learning for Automated Software Defect Prediction: A Hybrid QLSTM-GCN Approach

- **Autores:** Yousef Sanjalawe, Salam Al-E’mari, F.M.A. Salam, Qusai Shambour, Sharif Naser Makhadmeh
- **Ano / data de publicação:** 2026 / 2026-08-29
- **Origem ou publicação:** International Journal of Computational Intelligence Systems
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-1007-s44196-026-01534-2
- **DOI:** [https://doi.org/10.1007/s44196-026-01534-2](https://doi.org/10.1007/s44196-026-01534-2)
- **URL registrada:** [https://doi.org/10.1007/s44196-026-01534-2](https://doi.org/10.1007/s44196-026-01534-2)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-08-30T14:25:47.998Z

### Resumo registrado

The growing complexity of contemporary software systems has intensified the need for intelligent and dependable techniques capable of identifying defects early. Conventional machine learning models often face limitations when handling high-dimensional code metrics, class imbalance, and limited interpretability, thereby diminishing their practical utility. More critically, existing approaches treat software defect prediction as a flat-feature classification problem, failing to jointly model the temporal evolution of software metrics and the structural dependencies between modules, two complementary dimensions that empirical evidence consistently identifies as the primary drivers of defect propagation in real-world repositories. In this study, we propose a quantum-inspired hybrid deep learning framework, QLSTM-GCN, that combines the sequential modeling strength of Quantum Long Short-Term Memory (QLSTM) networks with the structural learning capacity of Graph Convolutional Networks (GCNs). Importantly, all quantum-inspired operations are numerically simulated on classical hardware using unitary matrix transformations, requiring no quantum computing infrastructure and ensuring full reproducibility on standard computing platforms. This integration enables the simultaneous capture of temporal and topological dependencies inherent in software repositories. To refine the input space, an improved Quantum-Inspired Genetic Algorithm (QIGA) is applied for optimized feature selection, reducing feature dimensionality by 37-39% while improving both accuracy and model generalization across datasets. Furthermore, explainable AI mechanisms, including Local Interpretable Model-Agnostic Explanations (LIME), Partial Dependence Plots (PDP), and SHapley Additive exPlanations (SHAP), are incorporated to enhance interpretability and transparency at both the instance and global levels. Experiments conducted on three benchmark datasets, NASA PROMISE, GitHub Bug, and GHPR, demonstrate that QLSTM-GCN attains a peak accuracy of 96.7% and an AUC-ROC of 98.7% on the NASA PROMISE dataset, with consistently strong performance across all three benchmarks (95.3%-96.7% accuracy; 98.1%-98.7% AUC-ROC), surpassing recent state-of-the-art approaches on every evaluated metric. More importantly, the framework improves reliability and trust in software quality assurance by balancing predictive performance with practical explainability, offering actionable insights at the module, project, and organizational levels.

### Pontos importantes para leitura

- **Contribuição proposta:** combina QLSTM para sequências temporais e GCN para relações estruturais entre módulos, mirando métricas de alta dimensão e classes desbalanceadas.
- **Limite:** o resumo fornecido descreve motivação e arquitetura, sem resultados suficientes para concluir vantagem prática ou benefício quântico.

---

## Replication Package: How Reliable Are Explanations in Cross-Project Software Defect Prediction? An Empirical Study of Stability and Robustness

- **Autores:** Emre Selman Caniaz
- **Ano / data de publicação:** 2026 / 2026-09-12
- **Origem ou publicação:** Zenodo (CERN European Organization for Nuclear Research)
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Dataset / pacote de replicação
- **Tópicos atribuídos:** Predição e localização de defeitos; Datasets e pacotes de replicação
- **Identificador:** doi-doi-org-10-5281-zenodo-22721707
- **DOI:** [https://doi.org/10.5281/zenodo.22721707](https://doi.org/10.5281/zenodo.22721707)
- **URL registrada:** [https://doi.org/10.5281/zenodo.22721707](https://doi.org/10.5281/zenodo.22721707)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-14T15:54:35.333Z

### Resumo registrado

This replication package accompanies the manuscript “How Reliable Are Explanations in Cross-Project Software Defect Prediction? An Empirical Study of Stability and Robustness.” The package contains Python source code, study-generated experimental outputs, SHAP feature rankings and stability results, statistical analysis scripts, documentation, and validation reports. It includes full-precision predictive-performance results and the recorded outputs of the simultaneous-metric perturbation experiment (P1) and the single-feature perturbation experiment (P2). The files named perturbation_p1_raw.csv and perturbation_p2_raw.csv contain experimental comparison outputs; they are not the original software defect datasets. The original Jureczko/PROMISE input datasets are not bundled. The manuscript itself is also not included in this archive. Original Python source code and dependency specifications are distributed under the MIT License. Original documentation, metadata, and study-generated experimental outputs are distributed under Creative Commons Attribution 4.0 International (CC BY 4.0), to the extent the author holds applicable rights. These licenses apply to their respective components, as specified in the package’s licensing documentation. Third-party datasets, software, and other materials retain their original terms.

### Pontos importantes para leitura

- **Contribuição:** pacote de replicação com código, saídas, rankings SHAP, análises e experimentos de perturbação para estudar estabilidade de explicações em previsão entre projetos.
- **O que levar:** o pacote não inclui as bases PROMISE/Jureczko originais nem o manuscrito. As saídas não são os dados brutos; use-o como artefato experimental e consulte o artigo associado para as conclusões.

---

## Self-Adaptive Parameter Control in Differential Evolution Based on Optimizing Undersampling Strategies for Software Defect Prediction

- **Autores:** Moch. Lutfi, A. Shiddiqi
- **Ano / data de publicação:** 2026 / 2026-01-01
- **Origem ou publicação:** International Conference on Evaluation of Novel Approaches to Software Engineering
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-5220-0014959700004015
- **DOI:** [https://doi.org/10.5220/0014959700004015](https://doi.org/10.5220/0014959700004015)
- **URL registrada:** [https://doi.org/10.5220/0014959700004015](https://doi.org/10.5220/0014959700004015)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-22T14:03:26.481Z

### Resumo registrado

: Data imbalance is a fundamental challenge in software defect prediction (SDP), as the dominance of non-defect classes biases models and reduces the ability to detect defective modules. Although Learning-to-Rank Undersampling (LTRUS) has been shown to be more effective than random undersampling; however, its performance still depends on the determination of static ranking weights ( A ), which are prone to stagnation during optimization. This study proposes an adaptive framework that integrates LTRUS with four variants of differential evolution, namely JADE, SHADE, L SHADE, and SaWDE, to dynamically optimize the weight ( A ). Experiments were conducted using a 5-fold cross-validation scheme and three classifiers: K-Nearest Neigh-bors, Logistic Regression, and Na¨ıve Bayes. Performance was evaluated using AUC, Matthews Correlation Coefficient, Precision, Recall, and F Measure, along with statistical analysis based on the Shapiro–Wilk normality test and paired t-test. The results showed that JADE performed best on KNN, with AUC 0.725, MCC 0.356, and F Measure 0.450, and on Logistic Regression, with AUC 0.750, MCC 0.397, and F Measure 0.474. In Na¨ıve Bayes, differential evolution was most effective with an AUC of 0.784, MCC of 0.441, and F Measure of 0.515. The results indicate that performance improvements are statistically significant in several cases, particularly for KNN and Logistic Regression, although not all comparisons show significant differences.

### Pontos importantes para leitura

- **Contribuição:** integra LTRUS a variantes de Differential Evolution para ajustar dinamicamente pesos de ranking; avalia três classificadores com validação cruzada e métricas além de AUC.
- **O que levar:** parâmetros de subamostragem também afetam resultados; comparar MCC, precisão e recall ajuda a evitar conclusão baseada somente em AUC.

---

## Software Defect Prediction Dataset: 296,457 Code File Instances from Five Open-Source Repositories (Elasticsearch, Spring Boot, Hadoop, Kafka, Express)

- **Autores:** Vijay P Javvadi
- **Ano / data de publicação:** 2026 / 2026-09-02
- **Origem ou publicação:** Zenodo (CERN European Organization for Nuclear Research)
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Dataset / pacote de replicação
- **Tópicos atribuídos:** Predição e localização de defeitos; Datasets e pacotes de replicação
- **Identificador:** doi-doi-org-10-5281-zenodo-19682732
- **DOI:** [https://doi.org/10.5281/zenodo.19682732](https://doi.org/10.5281/zenodo.19682732)
- **URL registrada:** [https://doi.org/10.5281/zenodo.19682732](https://doi.org/10.5281/zenodo.19682732)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-04T13:33:50.663Z

### Resumo registrado

A large-scale software defect prediction dataset containing 296,457 file-level instances mined from five mature open-source repositories: Elasticsearch (165,032 files, 21.21% defect rate), Spring Boot (68,207 files, 9.52%), Hadoop (49,047 files, 16.99%), Kafka (13,158 files, 37.59%), and Express (1,013 files, 37.51%). Overall defect rate: 18.61%. Each instance is annotated with process metrics (commit count, unique developers, lines added, lines deleted, code churn, bug-fix commits, file age, commit frequency) and a binary defect label derived from commit-message keyword matching. The corpus is one to three orders of magnitude larger than the PROMISE and AEEEM benchmarks that dominate the SDP literature. Released with extraction scripts, trained model artifacts, data validation summaries, and analysis notebooks. Version 2 re-mines Spring Boot against its full commit history (56,425 → 68,207 files), corrects a file_age_days sign bug present in v1, and removes one spurious Express row.

### Pontos importantes para leitura

- **Contribuição:** dataset de 296.457 arquivos em cinco repositórios, com métricas de processo e rótulos binários inferidos por palavras-chave em commits.
- **O que levar:** escala e diversidade podem ampliar estudos, mas a rotulagem heurística de mensagens de commit pode introduzir ruído. A versão 2 corrige erro em idade de arquivo e atualiza registros; cite a versão usada.

---

## Software Defect Prediction Models: Technical Evolution, Performance Comparison, and Future Directions

- **Autores:** Tao Zhang, Hongxia Zhou
- **Ano / data de publicação:** 2026 / 2026-01-16
- **Origem ou publicação:** 2026 2nd International Conference on Electrical Automation and Artificial Intelligence (ICEAAI)
- **Base de origem do registro:** Semantic Scholar
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos; Performance e capacidade
- **Identificador:** doi-doi-org-10-1109-iceaai68945-2026-11442359
- **DOI:** [https://doi.org/10.1109/ICEAAI68945.2026.11442359](https://doi.org/10.1109/ICEAAI68945.2026.11442359)
- **URL registrada:** [https://doi.org/10.1109/ICEAAI68945.2026.11442359](https://doi.org/10.1109/ICEAAI68945.2026.11442359)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-26T09:59:35.201Z

### Resumo registrado

Software defect prediction (SDP) is a core technology in software quality assurance, enabling early identification of defect-prone modules via multi-dimensional data mining to optimize testing resource allocation and reduce costs. This paper systematically sorts out the evolutionary context of SDP models, focusing on three developmental stages with clear problem-solution logic: traditional models (solving basic defect classification needs), feature engineering optimization models (addressing data quality bottlenecks), and deep learning & emerging fusion models (breaking through scale and scenario limitations). It conducts a multi-dimensional quantitative comparative analysis of different models based on data scale, imbalance degree, cross-project generalization ability, and engineering cost, clarifies their core advantages and applicable boundaries, and critically analyzes current challenges and future directions. Traditional models suit small-to-medium-sized scenarios with high interpretability requirements; feature engineering optimization models apply to poor data quality scenarios; deep learning models excel in large-scale, cross-version/cross-project prediction; federated and fusion models meet cross-organizational collaboration and privacy protection needs. Current challenges include data class imbalance, insufficient model interpretability, and lack of industrial-level verification. Future efforts should focus on multi-source data fusion, model lightweighting, privacy protection enhancement, and customized development to promote industrial application. This paper provides important references for theoretical research and engineering practice in SDP.

### Pontos importantes para leitura

- **Contribuição:** organiza a evolução de modelos tradicionais para engenharia de atributos e deep learning/fusões, comparando escala, desbalanceamento, generalização e custo de engenharia.
- **O que levar:** modelos têm limites de aplicação diferentes; o custo e o cenário de validação devem acompanhar a comparação de desempenho.

---

## Software Defect Prediction Using Machine Learning: A Comparative Analysis of Ensemble and Neural Classification Algorithms

- **Autores:** Arjun Singh Tomar, Aashish Kumar Tiwari
- **Ano / data de publicação:** 2026 / 2026-09-04
- **Origem ou publicação:** Zenodo (CERN European Organization for Nuclear Research)
- **Base de origem do registro:** OpenAlex
- **Tipo de registro:** Relatório ou depósito em repositório
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** doi-doi-org-10-5281-zenodo-22303726
- **DOI:** [https://doi.org/10.5281/zenodo.22303726](https://doi.org/10.5281/zenodo.22303726)
- **URL registrada:** [https://doi.org/10.5281/zenodo.22303726](https://doi.org/10.5281/zenodo.22303726)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-09-05T12:45:27.943Z

### Resumo registrado

Ensemble and neural classifiers are widely believed to outperform single-model classifiers for software defect prediction, but the size of that advantage, and the training-data volume required to realise it, are not always quantified in comparative studies. This paper benchmarks six such models — Bagging, Random Forest, AdaBoost, Gradient Boosting, XGBoost, and a shallow multilayer perceptron — on static code metrics pooled from four NASA/PROMISE datasets, using a common preprocessing pipeline with SMOTE-based training-fold resampling. XGBoost achieved the best overall accuracy, precision, recall, and F1-score (89.4% accuracy, 85.1% F1-score) while training faster than Gradient Boosting, and a learning-curve analysis shows that its advantage over Random Forest grows with training set size rather than being constant across data volumes. The multilayer perceptron did not outperform the strongest tree ensembles at the data volumes examined. These results suggest that boosting-based tree ensembles remain the most practical choice for defect prediction from static metrics, with the specific choice between Random Forest and XGBoost best guided by the amount of historical defect data a project has accumulated.

### Pontos importantes para leitura

- **Contribuição:** compara seis ensembles e um MLP raso em métricas estáticas de quatro conjuntos NASA/PROMISE, com reamostragem SMOTE apenas no treino.
- **Resultado reportado:** XGBoost lidera no estudo (89,4% de acurácia e F1 85,1%); o MLP não supera os ensembles de árvore nos volumes avaliados. A conclusão é específica ao protocolo e aos dados usados.

---

## Understanding Software Defect Prediction: A Large-scale Empirical Study Across Uncertainty Quantification and Performance Evaluation

- **Autores:** Ranjun Peng, Xuan Xie, Rubing Huang, Wenbin He, Zhijie Wang
- **Ano / data de publicação:** 2026 / 2026-07-02
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos; Performance e capacidade
- **Identificador:** arxiv-arxiv-org-abs-2607-01842v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2607.01842v1](http://arxiv.org/abs/2607.01842v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Software defect prediction (SDP) classifiers produce probabilities used for inspection prioritization, threshold tuning, and risk communication. Probability-based uncertainty quantification (UQ) characterizes prediction confidence, but whether common UQ metrics reliably indicate performance and calibration remains unclear. We conducted a large-scale empirical study of probability-based UQ for SDP. We evaluated five UQ metrics, six performance metrics, and three calibration metrics for 16 representative classifiers. We analyzed these relationships under two prediction settings: within-project defect prediction (WPDP), using 36 benchmark datasets, and cross-project defect prediction (CPDP), using 32 feature-compatible datasets. Results showed that UQ was highly context-dependent. Under WPDP, UQ correlated more consistently with false positive rate and AUC than with MCC, F1 score, and other metrics; these correlations also varied across classifier categories and dataset collections. Performance and calibration were related but not interchangeable; classifiers with strong discrimination could still exhibit large calibration error. Under CPDP, several UQ-performance and UQ-calibration correlations weakened or reversed, indicating that uncertainty signals do not reliably transfer across projects. Thus, UQ should be evaluated against specific performance objectives. Calibration should be assessed independently using multiple metrics. Transferred probabilities should be revalidated before guiding quality-assurance decisions.

### Pontos importantes para leitura

- **Contribuição:** estuda cinco métricas de incerteza, seis métricas de desempenho, três de calibração e 16 classificadores em cenários intra e entre projetos.
- **Achado reportado:** relações entre incerteza e desempenho dependem do cenário. Na prática, confiança prevista não deve ser tratada como substituto de calibração e validação no contexto.

---

## Validation-Controlled Model Selection and Soft Ensembling for Imbalanced Software Defect Prediction: A Repeated Within- and Cross-Project Evaluation

- **Autores:** MohammadMehdi Mehraein, Abtin Asghari
- **Ano / data de publicação:** 2026 / 2026-09-22
- **Origem ou publicação:** Communications in Computer and Information Science
- **Base de origem do registro:** Crossref
- **Tipo de registro:** Artigo / trabalho em publicação acadêmica (revisão por pares não verificada aqui)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** doi-doi-org-10-1007-978-3-032-39708-9-9
- **DOI:** [https://doi.org/10.1007/978-3-032-39708-9_9](https://doi.org/10.1007/978-3-032-39708-9_9)
- **URL registrada:** [https://doi.org/10.1007/978-3-032-39708-9_9](https://doi.org/10.1007/978-3-032-39708-9_9)
- **Consulta que encontrou o registro:** software maintainability reliability
- **Data de descoberta:** 2026-09-22T14:03:26.481Z

### Resumo registrado

Resumo não disponível no registro local.

### Pontos importantes para leitura

- **Tema:** seleção de modelos controlada por validação e combinação soft para dados desbalanceados, em cenários intra e entre projetos.
- **Limite:** resumo ausente; o título sinaliza desenho comparativo repetido, mas não informa resultados.

---

## XMENTOR: A Rank-Aware Aggregation Approach for Human-Centered Explainable AI in Just-in-Time Software Defect Prediction

- **Autores:** Saumendu Roy, Banani Roy, Chanchal Roy, Richard Bassey
- **Ano / data de publicação:** 2026 / 2026-02-25
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** arxiv-arxiv-org-abs-2602-22403v2
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2602.22403v2](http://arxiv.org/abs/2602.22403v2)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Machine learning (ML)-based defect prediction models can improve software quality. However, their opaque reasoning creates an HCI challenge because developers struggle to trust models they cannot interpret. Explainable AI (XAI) methods such as LIME, SHAP, and BreakDown aim to provide transparency, but when used together, they often produce conflicting explanations that increase confusion, frustration, and cognitive load. To address this usability challenge, we introduce XMENTOR, a human-centered, rank-aware aggregation method implemented as a VS Code plugin. XMENTOR unifies multiple post-hoc explanations into a single, coherent view by applying adaptive thresholding, rank and sign agreement, and fallback strategies to preserve clarity without overwhelming users. In a user study, nearly 90% of the participants preferred aggregated explanations, citing reduced confusion and stronger support for daily tasks of debugging and review of defects. Our findings show how combining explanations and embedding them into developer workflows can enhance interpretability, usability, and trust.

### Pontos importantes para leitura

- **Contribuição:** agrega explicações LIME/SHAP/BreakDown em uma visualização ordenada e implementada como plugin de VS Code.
- **Resultado reportado:** quase 90% dos participantes preferiram as explicações agregadas. É uma preferência de estudo com usuários, não prova de que as explicações sejam corretas ou reduzam defeitos.

---

## Breaking New Ground in Software Defect Prediction: Introducing Practical and Actionable Metrics with Superior Predictive Power for Enhanced Decision-Making

- **Autores:** Carlos Andrés Ramírez Cataño, Makoto Itoh
- **Ano / data de publicação:** 2025 / 2025-08-06
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** arxiv-arxiv-org-abs-2508-04408v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2508.04408v1](http://arxiv.org/abs/2508.04408v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Software defect prediction using code metrics has been extensively researched over the past five decades. However, prediction harnessing non-software metrics is under-researched. Considering that the root cause of software defects is often attributed to human error, human factors theory might offer key forecasting metrics for actionable insights. This paper explores automated software defect prediction at the method level based on the developers' coding habits. First, we propose a framework for deciding the metrics to conduct predictions. Next, we compare the performance of our metrics to that of the code and commit history metrics shown by research to achieve the highest performance to date. Finally, we analyze the prediction importance of each metric. As a result of our analyses of twenty-one critical infrastructure large-scale open-source software projects, we have presented: (1) a human error-based framework with metrics useful for defect prediction at method level; (2) models using our proposed metrics achieve better average prediction performance than the state-of-the-art code metrics and history measures; (3) the prediction importance of all metrics distributes differently with each of the novel metrics having better average importance than code and history metrics; (4) the novel metrics dramatically enhance the explainability, practicality, and actionability of software defect prediction models, significantly advancing the field. We present a systematic approach to forecasting defect-prone software methods via a human error framework. This work empowers practitioners to act on predictions, empirically demonstrating how developer coding habits contribute to defects in software systems.

### Pontos importantes para leitura

- **Contribuição:** investiga métricas baseadas em hábitos de programação de desenvolvedores para prever defeitos em nível de método, comparando-as com métricas de código e histórico.
- **O que levar:** sinais humanos/processuais podem tornar previsões mais acionáveis; considerar privacidade, viés e uso responsável dessas métricas. Conferir a publicação para evidência e contexto.

---

## Contrasting the Hyperparameter Tuning Impact Across Software Defect Prediction Scenarios

- **Autores:** Mohamed Sami Rakha, Andriy Miranskyy, Daniel Alencar da Costa
- **Ano / data de publicação:** 2025 / 2025-10-18
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** arxiv-arxiv-org-abs-2510-16665v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2510.16665v1](http://arxiv.org/abs/2510.16665v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Software defect prediction (SDP) is crucial for delivering high-quality software products. Recent research has indicated that prediction performance improvements in SDP are achievable by applying hyperparameter tuning to a particular SDP scenario. However, the positive impact resulting from the hyperparameter tuning step may differ based on the targeted SDP scenario. Comparing the impact of hyperparameter tuning across SDP scenarios is necessary to provide comprehensive insights and enhance the robustness, generalizability, and, eventually, the practicality of SDP modeling for quality assurance. Therefore, in this study, we contrast the impact of hyperparameter tuning across two pivotal and consecutive SDP scenarios: (1) Inner Version Defect Prediction (IVDP) and (2) Cross Version Defect Prediction (CVDP). The main distinctions between the two scenarios lie in the scope of defect prediction and the selected evaluation setups. This study's experiments use common evaluation setups, 28 machine learning (ML) algorithms, 53 post-release software datasets, two tuning algorithms, and five optimization metrics. We apply statistical analytics to compare the SDP performance impact differences by investigating the overall impact, the single ML algorithm impact, and variations across different software dataset sizes. The results indicate that the SDP gains within the IVDP scenario are significantly larger than those within the CVDP scenario. The results reveal that asserting performance gains for up to 24 out of 28 ML algorithms may not hold across multiple SDP scenarios. Furthermore, we found that small software datasets are more susceptible to larger differences in performance impacts. Overall, the study findings recommend software engineering researchers and practitioners to consider the effect of the selected SDP scenario when expecting performance gains from hyperparameter tuning.

### Pontos importantes para leitura

- **Contribuição:** compara o impacto de tuning entre previsão dentro de versões e entre versões.
- **O que levar:** benefício de ajuste de hiperparâmetros pode variar por cenário; tuning precisa ocorrer dentro do treino/validação, sem contaminar o teste final.
- **Limite:** resumo local não inclui resultados quantitativos.

---

## Critical Considerations on Effort-aware Software Defect Prediction Metrics

- **Autores:** Autor nao informado
- **Ano / data de publicação:** 2025 / 2025-04-27
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** arxiv-arxiv-org-abs-2504-19181v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2504.19181v1](http://arxiv.org/abs/2504.19181v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Background. Effort-aware metrics (EAMs) are widely used to evaluate the effectiveness of software defect prediction models, while accounting for the effort needed to analyze the software modules that are estimated defective. The usual underlying assumption is that this effort is proportional to the modules' size measured in LOC. However, the research on module analysis (including code understanding, inspection, testing, etc.) suggests that module analysis effort may be better correlated to code attributes other than size. Aim. We investigate whether assuming that module analysis effort is proportional to other code metrics than LOC leads to different evaluations. Method. We show mathematically that the choice of the code measure used as the module effort driver crucially influences the resulting evaluations. To illustrate the practical consequences of this, we carried out a demonstrative empirical study, in which the same model was evaluated via EAMs, assuming that effort is proportional to either McCabe's complexity or LOC. Results. The empirical study showed that EAMs depend on the underlying effort model, and can give quite different indications when effort is modeled differently. It is also apparent that the extent of these differences varies widely. Conclusions. Researchers and practitioners should be aware that the reliability of the indications provided by EAMs depend on the nature of the underlying effort model. The EAMs used until now appear to be actually size-aware, rather than effort-aware: when analysis effort does not depend on size, these EAMs can be misleading.

### Pontos importantes para leitura

- **Contribuição:** demonstra que resultados de métricas effort-aware dependem da medida usada como proxy do esforço de inspeção, questionando a suposição de proporcionalidade com LOC.
- **O que levar:** definir esforço operacionalmente e testar sensibilidade à proxy escolhida; rankings de modelos podem mudar com essa escolha.

---

## From Illusion to Insight: Change-Aware File-Level Software Defect Prediction Using Agentic AI

- **Autores:** Mohsen Hesamolhokama, Behnam Rohani, Amirahmad Shafiee, MohammadAmin Fazli, Jafar Habibi
- **Ano / data de publicação:** 2025 / 2025-12-29
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** arxiv-arxiv-org-abs-2512-23875v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2512.23875v1](http://arxiv.org/abs/2512.23875v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Much of the reported progress in file-level software defect prediction (SDP) is, in reality, nothing but an illusion of accuracy. Over the last decades, machine learning and deep learning models have reported increasing performance across software versions. However, since most files persist across releases and retain their defect labels, standard evaluation rewards label-persistence bias rather than reasoning about code changes. To address this issue, we reformulate SDP as a change-aware prediction task, in which models reason over code changes of a file within successive project versions, rather than relying on static file snapshots. Building on this formulation, we propose an LLM-driven, change-aware, multi-agent debate framework. Our experiments on multiple PROMISE projects show that traditional models achieve inflated F1, while failing on rare but critical defect-transition cases. In contrast, our change-aware reasoning and multi-agent debate framework yields more balanced performance across evolution subsets and significantly improves sensitivity to defect introductions. These results highlight fundamental flaws in current SDP evaluation practices and emphasize the need for change-aware reasoning in practical defect prediction. The source code is publicly available.

### Pontos importantes para leitura

- **Contribuição:** reformula previsão por arquivo para raciocinar sobre mudanças entre versões e usa debate multiagente com LLM.
- **Achado reportado:** argumenta que persistência de rótulos pode inflar F1 tradicional e esconder transições raras. Útil para discutir validade do alvo e do split; verificar resultados e replicação no preprint.

---

## Multimodal Learning for Just-In-Time Software Defect Prediction in Autonomous Driving Systems

- **Autores:** Faisal Mohammad, Duksan Ryu
- **Ano / data de publicação:** 2025 / 2025-02-28
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** arxiv-arxiv-org-abs-2502-20806v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2502.20806v1](http://arxiv.org/abs/2502.20806v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

In recent years, the rise of autonomous driving technologies has highlighted the critical importance of reliable software for ensuring safety and performance. This paper proposes a novel approach for just-in-time software defect prediction (JIT-SDP) in autonomous driving software systems using multimodal learning. The proposed model leverages the multimodal transformers in which the pre-trained transformers and a combining module deal with the multiple data modalities of the software system datasets such as code features, change metrics, and contextual information. The key point for adapting multimodal learning is to utilize the attention mechanism between the different data modalities such as text, numerical, and categorical. In the combining module, the output of a transformer model on text data and tabular features containing categorical and numerical data are combined to produce the predictions using the fully connected layers. Experiments conducted on three open-source autonomous driving system software projects collected from the GitHub repository (Apollo, Carla, and Donkeycar) demonstrate that the proposed approach significantly outperforms state-of-the-art deep learning and machine learning models regarding evaluation metrics. Our findings highlight the potential of multimodal learning to enhance the reliability and safety of autonomous driving software through improved defect prediction.

### Pontos importantes para leitura

- **Contribuição proposta:** combina texto, métricas numéricas/categóricas e contexto em um modelo multimodal para previsão JIT em software automotivo/autônomo.
- **Limite:** o resumo descreve a arquitetura; sistemas de direção autônoma exigem validação de segurança e evidência mais forte que um benchmark preditivo isolado.

---

## ReDef: Do Code Language Models Truly Understand Code Changes for Just-in-Time Software Defect Prediction?

- **Autores:** Doha Nam, Taehyoun Kim, Duksan Ryu, Jongmoon Baik
- **Ano / data de publicação:** 2025 / 2025-09-11
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** arxiv-arxiv-org-abs-2509-09192v2
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2509.09192v2](http://arxiv.org/abs/2509.09192v2)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Just-in-Time software defect prediction (JIT-SDP) plays a critical role in prioritizing risky code changes during code review and continuous integration. However, existing datasets often suffer from noisy labels and low precision in identifying bug-inducing commits. To address this, we present ReDef (Revert-based Defect dataset), a high-confidence benchmark of function-level modifications curated from 22 large-scale C/C++ projects. Defective cases are anchored by revert commits, while clean cases are validated through post-hoc history checks. Ambiguous instances are conservatively filtered out via a GPT-assisted triage process involving multiple votes and audits. This pipeline yields 3,164 defective and 10,268 clean modifications, offering substantially more reliable labels than prior resources. Beyond dataset construction, we provide a systematic evaluation of how Code Language Models (CLMs)-specifically CodeBERT, CodeT5+, UniXcoder, and Qwen2.5-reason about code modifications. We first investigate which input encodings most effectively expose change information under five different strategies. We then design four counterfactual perturbation strategies (e.g., swapping added/deleted blocks, inverting diff polarity) to serve as diagnostic probes. We posit that if models genuinely capture change semantics, such distortions should lead to a clear decline in predictive performance. Our results show that compact diff-style encodings consistently outperform whole-function formats across all CLMs, supported by rigorous statistical confirmation. However, under counterfactual tests, performance remains effectively stable, revealing that what appears to be robustness in fact reflects a reliance on superficial cues rather than true semantic understanding.

### Pontos importantes para leitura

- **Contribuição:** apresenta dataset de modificações em funções C/C++ de 22 projetos, com defeitos ancorados em reversões e casos limpos verificados posteriormente.
- **Dados reportados:** 3.164 modificações defeituosas e 10.268 limpas, com triagem assistida por GPT e auditorias. O foco é também testar se modelos de código entendem mudanças, não apenas texto/código isolado.

---

## Software Defect Prediction using Autoencoder Transformer Model

- **Autores:** Seshu Barma, Mohanakrishnan Hariharan, Satish Arvapalli
- **Ano / data de publicação:** 2025 / 2025-10-12
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** arxiv-arxiv-org-abs-2510-10840v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2510.10840v1](http://arxiv.org/abs/2510.10840v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

An AI-ML-powered quality engineering approach uses AI-ML to enhance software quality assessments by predicting defects. Existing ML models struggle with noisy data types, imbalances, pattern recognition, feature extraction, and generalization. To address these challenges, we develop a new model, Adaptive Differential Evolution (ADE) based Quantum Variational Autoencoder-Transformer (QVAET) Model (ADE-QVAET). ADE combines with QVAET to obtain high-dimensional latent features and maintain sequential dependencies, resulting in enhanced defect prediction accuracy. ADE optimization enhances model convergence and predictive performance. ADE-QVAET integrates AI-ML techniques such as tuning hyperparameters for scalable and accurate software defect prediction, representing an AI-ML-driven technology for quality engineering. During training with a 90% training percentage, ADE-QVAET achieves high accuracy, precision, recall, and F1-score of 98.08%, 92.45%, 94.67%, and 98.12%, respectively, when compared to the Differential Evolution (DE) ML model.

### Pontos importantes para leitura

- **Contribuição proposta:** ADE-QVAET combina otimização por evolução diferencial, autoencoder variacional quântico e transformer para aprender representações e dependências sequenciais.
- **Limite:** o resumo afirma desempenho alto, mas o registro não fornece comparações e métricas suficientes para avaliar essa alegação.

---

## When Data Quality Issues Collide: A Large-Scale Empirical Study of Co-Occurring Data Quality Issues in Software Defect Prediction

- **Autores:** Emmanuel Charleson Dapaah, Jens Grabowski
- **Ano / data de publicação:** 2025 / 2025-12-19
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos; Qualidade e engenharia de dados
- **Identificador:** arxiv-arxiv-org-abs-2512-17460v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2512.17460v1](http://arxiv.org/abs/2512.17460v1)
- **Consulta que encontrou o registro:** software quality assurance
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Software Defect Prediction (SDP) models are central to proactive software quality assurance, yet their effectiveness is often constrained by the quality of available datasets. Prior research has typically examined single issues such as class imbalance or feature irrelevance in isolation, overlooking that real-world data problems frequently co-occur and interact. This study presents, to our knowledge, the first large-scale empirical analysis in SDP that simultaneously examines five co-occurring data quality issues (class imbalance, class overlap, irrelevant features, attribute noise, and outliers) across 374 datasets and five classifiers. We employ Explainable Boosting Machines together with stratified interaction analysis to quantify both direct and conditional effects under default hyperparameter settings, reflecting practical baseline usage. Our results show that co-occurrence is nearly universal: even the least frequent issue (attribute noise) appears alongside others in more than 93% of datasets. Irrelevant features and imbalance are nearly ubiquitous, while class overlap is the most consistently harmful issue. We identify stable tipping points around 0.20 for class overlap, 0.65-0.70 for imbalance, and 0.94 for irrelevance, beyond which most models begin to degrade. We also uncover counterintuitive patterns, such as outliers improving performance when irrelevant features are low, underscoring the importance of context-aware evaluation. Finally, we expose a performance-robustness trade-off: no single learner dominates under all conditions. By jointly analyzing prevalence, co-occurrence, thresholds, and conditional effects, our study directly addresses a persistent gap in SDP research. Hence, moving beyond isolated analyses to provide a holistic, data-aware understanding of how quality issues shape model performance in real-world settings.

### Pontos importantes para leitura

- **Contribuição:** estuda em 374 datasets a coocorrência de desbalanceamento, sobreposição, atributos irrelevantes, ruído e outliers, com cinco classificadores.
- **O que levar:** problemas de dados interagem; tratar cada um isoladamente pode ocultar efeitos conjuntos. Resultados dependem das configurações e dos benchmarks analisados.

---

## Feature Importance in the Context of Traditional and Just-In-Time Software Defect Prediction Models

- **Autores:** Susmita Haldar, Luiz Fernando Capretz
- **Ano / data de publicação:** 2024 / 2024-11-07
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** arxiv-arxiv-org-abs-2411-05230v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2411.05230v1](http://arxiv.org/abs/2411.05230v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Software defect prediction models can assist software testing initiatives by prioritizing testing error-prone modules. In recent years, in addition to the traditional defect prediction model approach of predicting defects from class, modules, etc., Just-In-Time defect prediction research, which focuses on the change history of software products is getting prominent. For building these defect prediction models, it is important to understand which features are primary contributors to these classifiers. This study considered developing defect prediction models incorporating the traditional and the Just-In-Time approaches from the publicly available dataset of the Apache Camel project. A multi-layer deep learning algorithm was applied to these datasets in comparison with machine learning algorithms. The deep learning algorithm achieved accuracies of 80% and 86%, with the area under receiving operator curve (AUC) scores of 66% and 78% for traditional and Just-In-Time defect prediction, respectively. Finally, the feature importance of these models was identified using a model-specific integrated gradient method and a model-agnostic Shapley Additive Explanation (SHAP) technique.

### Pontos importantes para leitura

- **Contribuição:** compara importância de atributos em previsão tradicional e JIT no Apache Camel; o resumo relata redes profundas e algoritmos de ML como modelos avaliados.
- **O que levar:** importância é dependente do cenário/modelo e não prova causalidade. O registro menciona acurácias de 80% e 86% para deep learning e AUC, mas está truncado; verificar o texto antes de associar os números a cada cenário.

---

## Quantum vs. Classical Machine Learning Algorithms for Software Defect Prediction: Challenges and Opportunities

- **Autores:** Md Nadim, Mohammad Hassan, Ashis Kumar Mandal, Chanchal K. Roy
- **Ano / data de publicação:** 2024 / 2024-12-10
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos; IA/ML aplicada à qualidade
- **Identificador:** arxiv-arxiv-org-abs-2412-07698v1
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2412.07698v1](http://arxiv.org/abs/2412.07698v1)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Software defect prediction is a critical aspect of software quality assurance, as it enables early identification and mitigation of defects, thereby reducing the cost and impact of software failures. Over the past few years, quantum computing has risen as an exciting technology capable of transforming multiple domains; Quantum Machine Learning (QML) is one of them. QML algorithms harness the power of quantum computing to solve complex problems with better efficiency and effectiveness than their classical counterparts. However, research into its application in software engineering to predict software defects still needs to be explored. In this study, we worked to fill the research gap by comparing the performance of three QML and five classical machine learning (CML) algorithms on the 20 software defect datasets. Our investigation reports the comparative scenarios of QML vs. CML algorithms and identifies the better-performing and consistent algorithms to predict software defects. We also highlight the challenges and future directions of employing QML algorithms in real software defect datasets based on the experience we faced while performing this investigation. The findings of this study can help practitioners and researchers further progress in this research domain by making software systems reliable and bug-free.

### Pontos importantes para leitura

- **Contribuição:** compara três algoritmos de machine learning quântico e cinco clássicos em 20 datasets de defeitos.
- **O que levar:** comparar qualidade preditiva junto a recursos, codificação e limitações de hardware; o rótulo “quântico” não implica vantagem prática. Conferir resultados detalhados.

---

## SDPERL: A Framework for Software Defect Prediction Using Ensemble Feature Extraction and Reinforcement Learning

- **Autores:** Mohsen Hesamolhokama, Amirahmad Shafiee, Mohammadreza Ahmaditeshnizi, Mohammadamin Fazli, Jafar Habibi
- **Ano / data de publicação:** 2024 / 2024-12-10
- **Origem ou publicação:** arXiv
- **Base de origem do registro:** arXiv
- **Tipo de registro:** Preprint / manuscrito em repositório (status editorial não inferido)
- **Tópicos atribuídos:** Predição e localização de defeitos
- **Identificador:** arxiv-arxiv-org-abs-2412-07927v2
- **DOI:** não informado
- **URL registrada:** [http://arxiv.org/abs/2412.07927v2](http://arxiv.org/abs/2412.07927v2)
- **Consulta que encontrou o registro:** software defect prediction
- **Data de descoberta:** 2026-08-15T22:36:58.611Z

### Resumo registrado

Ensuring software quality remains a critical challenge in complex and dynamic development environments, where software defects can result in significant operational and financial risks. This paper proposes an innovative framework for software defect prediction that combines ensemble feature extraction with reinforcement learning (RL)--based feature selection. We claim that this work is among the first in recent efforts to address this challenge at the file-level granularity. The framework extracts diverse semantic and structural features from source code using five code-specific pre-trained models. Feature selection is enhanced through a custom-defined embedding space tailored to represent feature interactions, coupled with a pheromone table mechanism inspired by Ant Colony Optimization (ACO) to guide the RL agent effectively. Using the Proximal Policy Optimization (PPO) algorithm, the proposed method dynamically identifies the most predictive features for defect detection. Experimental evaluations conducted on the PROMISE dataset highlight the framework's superior performance on the F1-Score metric, achieving an average improvement of $6.25\%$ over traditional methods and baseline models across diverse datasets. This study underscores the potential for integrating ensemble learning and RL for adaptive and scalable defect prediction in modern software systems.

### Pontos importantes para leitura

- **Contribuição proposta:** extrai sinais semânticos/estruturais com cinco modelos pré-treinados e usa PPO, espaço de embeddings e mecanismo inspirado em ACO para seleção de atributos.
- **Limite:** consultar o artigo para saber estabilidade, custo e comparação; o resumo não basta para concluir que RL é melhor que seleção convencional.

---

