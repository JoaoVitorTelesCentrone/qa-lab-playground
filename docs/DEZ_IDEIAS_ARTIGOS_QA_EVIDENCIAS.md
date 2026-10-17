# Dez propostas de artigos científicos derivadas da biblioteca QA Lab

**Estado:** agenda de pesquisa, sem resultados experimentais. Estas são dez propostas novas, além do [artigo já planejado sobre priorização de regressão por risco, custo e evidência](./PLANO_ARTIGO_PRIORIZACAO_POR_EVIDENCIAS_QA.md).

**Aplicação na mentoria:** [mapa de viabilidade, especificações de labs e ordem de implementação](./PLANO_LABS_CIENTIFICOS_MENTORIA.md).

## Como a base foi tensionada

O ponto de partida é o [resumo geral](./RESUMO_GERAL_ARTIGOS_QA.md), os [nove dossiês com abstracts e metadados](./referencias-qa/README.md) e o inventário em `packages/web/data/research-library.generated.json`. O acervo contém **145 registros**, dos quais **67** estão na pasta de predição/localização de defeitos. **122** registros são datados de 2026 e **25** não têm abstract indexado. Há artigos, preprints, datasets, relatórios e referências técnicas, com status editorial nem sempre verificado.

Essa composição é útil para gerar hipóteses, mas não prova que uma ideia é inédita na literatura mundial. Por isso, cada proposta abaixo indica trabalhos da base que criam a tensão de pesquisa, um método que pode produzir evidência nova e um resultado que **enfraqueceria** a hipótese. Antes de escrever a introdução como reivindicação de originalidade, é preciso ler os trabalhos completos e fazer uma busca de anterioridade atualizada.

| Nº | Pergunta científica central | Tipo de estudo | Primeiro ativo necessário |
| ---: | --- | --- | --- |
| 1 | Ganhos em predição de defeitos resistem a validação temporal e entre projetos? | Benchmark de replicação | Repositórios com versões e falhas reproduzíveis |
| 2 | Quanto a origem do rótulo muda o resultado de um preditor? | Experimento de qualidade de dados | Mesmo código rotulado por métodos distintos |
| 3 | Explicações de IA ajudam a localizar falhas ou só aumentam confiança? | Experimento humano controlado | Predições e explicações estáveis/instáveis |
| 4 | Clareza do requisito causa melhora mensurável no desenho de testes? | Experimento cruzado | Histórias equivalentes com ambiguidade controlada |
| 5 | Testes gerados por IA continuam úteis após mudanças de versão? | Estudo longitudinal | Mudanças reais, falhas e custo de manutenção |
| 6 | Scores ISO/IEC 25010 predizem qualidade percebida em uso? | Validação de instrumento | Produtos, usuários, tarefas e avaliadores |
| 7 | Uma prática leve de QA melhora o resultado de equipes muito pequenas? | Intervenção longitudinal | Equipes parceiras e indicadores anteriores |
| 8 | Testes de falha melhoram a previsão de disponibilidade de serviços? | Experimento de resiliência | Serviço instrumentado e injeção controlada |
| 9 | Incidentes reais tornam a próxima regressão mais eficaz? | Estudo temporal/quase experimental | Histórico de incidentes, versões e testes |
| 10 | Aprendizagem por investigação transfere habilidade de QA para sistemas novos? | Experimento educacional | Turmas, exercícios equivalentes e avaliação cega |

## 1. O progresso em predição de defeitos resiste a uma avaliação realista?

**Título possível:** *Quanto sobra do ganho dos modelos de predição de defeitos após remover vazamento temporal e viés de projeto?*

**Tensão observada:** a pasta de predição tem 67 registros e muitas arquiteturas novas. A [auditoria de experimentos de SDP](http://arxiv.org/abs/2601.18477v1) questiona práticas de validação; [From Illusion to Insight](http://arxiv.org/abs/2512.23875v1) aponta viés de persistência de rótulos; um [estudo sobre validação sensível ao projeto](https://doi.org/10.21203/rs.3.rs-10975428/v1) aparece na base, mas está sem abstract. A tensão científica é entre ganho algorítmico reportado e ganho que sobrevive a um protocolo operacional.

**Pergunta/hipótese:** rankings de modelos mudam quando treino e teste respeitam a ordem temporal, mantêm projetos separados e avaliam módulos que realmente mudaram? A hipótese é que parte dos ganhos se reduz ou se inverte.

**Desenho:** reproduzir um conjunto pequeno, pré-definido e representativo de baselines (regressão logística, árvore/ensemble, embedding de código e um modelo profundo). Avaliar cada família sob divisão aleatória, entre versões e entre projetos, sempre com seleção de atributos e reamostragem dentro do treino. Usar dados modernos e antigos **separadamente**, sem misturar níveis de arquivo, função e commit. Registrar falhas reais, idade do dataset e custo de treinamento.

**Medida decisiva:** variação pareada de AUPRC, MCC, calibração e defeitos encontrados nas primeiras horas de inspeção; intervalo de confiança por projeto. **Resultado contrário:** as vantagens se mantêm estáveis em projetos/versões reservados e com custo aceitável. **Produto científico:** benchmark executável, scripts de divisão e análise de sensibilidade.

## 2. O rótulo de “defeito” é confiável o bastante para treinar IA?

**Título possível:** *A proveniência do rótulo muda o vencedor? Um estudo controlado de ground truth em predição de defeitos.*

**Tensão observada:** o [dataset de 296.457 instâncias](https://doi.org/10.5281/zenodo.19682732) usa palavras-chave em mensagens de commit para inferir defeitos; [ReDef](http://arxiv.org/abs/2509.09192v2) usa reversões e verificação posterior para elevar a confiança; [When Data Quality Issues Collide](http://arxiv.org/abs/2512.17460v1) mostra que problemas de dados interagem. Comparar modelos em bases diferentes confunde algoritmo com definição de defeito.

**Pergunta/hipótese:** quanto a escolha do procedimento de rotulagem altera prevalência, calibração, importância de atributos e ranking dos modelos? A hipótese é que modelos aparentemente superiores dependem de um tipo específico de rótulo.

**Desenho:** no **mesmo conjunto de commits e na mesma granularidade**, construir rótulos por (a) palavras-chave, (b) rastreio de correções, (c) reversões quando existirem e (d) auditoria humana cega em amostra estratificada. Documentar casos ambíguos e discordância entre avaliadores. Treinar modelos idênticos sob cada variante, com divisão temporal fixa. Os datasets da base servem de referência metodológica; não devem ser comparados diretamente se tiverem unidades incompatíveis.

**Medida decisiva:** matriz de discordância entre rótulos, taxa de erro estimada pela auditoria, mudança do ranking e estabilidade das previsões. **Resultado contrário:** rankings e decisões de inspeção quase não mudam entre métodos de rotulagem. **Produto científico:** esquema de proveniência, amostra auditada e protocolo de sensibilidade ao rótulo.

## 3. Explicações de IA ajudam a encontrar o defeito ou apenas parecem convincentes?

**Título possível:** *Explicabilidade acionável em predição de defeitos: estabilidade, acerto humano e confiança calibrada.*

**Tensão observada:** [XMENTOR](http://arxiv.org/abs/2602.22403v2) relata preferência de usuários por explicações agregadas. Um [pacote de replicação sobre estabilidade de SHAP](https://doi.org/10.5281/zenodo.22721707) contém saídas de perturbação, mas não o manuscrito ou os dados originais. O [estudo de incerteza em SDP](http://arxiv.org/abs/2607.01842v1) encontra dependência do contexto. Preferência, fidelidade técnica e ajuda real à decisão são constructos diferentes.

**Pergunta/hipótese:** explicações estáveis e fiéis ajudam um desenvolvedor a localizar a mudança defeituosa mais rápido e com confiança melhor calibrada que explicações apenas visualmente coerentes?

**Desenho:** selecionar falhas reais com causa localizada; gerar predições com acurácia semelhante, mas explicações de estabilidade medida sob perturbações válidas. Distribuir participantes aleatoriamente entre três interfaces: score sem explicação, explicação única e agregação com aviso de instabilidade. Registrar previamente tarefas, critério de acerto e tempo máximo; incluir casos em que o modelo erra. Evitar que a explicação revele diretamente a resposta usada no gabarito.

**Medida decisiva:** localização correta, tempo, decisões de revisão, confiança calibrada e concordância entre participantes. **Resultado contrário:** explicações estáveis não melhoram tarefa ou pioram a calibração. **Produto científico:** benchmark de tarefas humanas e recomendações sobre quando ocultar ou sinalizar explicações frágeis.

## 4. Clareza de requisitos realmente reduz falhas no trabalho de QA?

**Título possível:** *Da ambiguidade ao teste: efeito causal da clareza de requisitos sobre cobertura comportamental e defeitos encontrados.*

**Tensão observada:** um [modelo conceitual relaciona clareza, sprint e qualidade](https://doi.org/10.15282/ijsecs.12.1.2026.1.0147); outro [propõe um modelo estruturado de engenharia de requisitos](./referencias-qa/processos-requisitos-e-formacao-em-qa/dossie-completo.md). A [automação do mapeamento requisito–teste](https://doi.org/10.25258/ijddt.16.48s.109) relata métricas de links. Esses trabalhos não isolam, na base indexada, o efeito causal da clareza do texto sobre o teste produzido.

**Pergunta/hipótese:** critérios de aceite verificáveis melhoram a detecção de falhas de regra de negócio, mantendo constante a experiência da pessoa e a complexidade do sistema?

**Desenho:** criar pares de histórias equivalentes, uma com ambiguidades reais e outra com regras e exemplos verificáveis; revisar equivalência com especialistas antes da coleta. Usar experimento cruzado: cada participante testa ambas as condições em tarefas diferentes, com ordem alternada. Congelar tempo, acesso ao produto e número de falhas plantadas. Julgar planos de teste e bugs por avaliadores cegos para a condição.

**Medida decisiva:** defeitos válidos encontrados, comportamentos cobertos, erros de interpretação, retrabalho e tempo. **Resultado contrário:** clareza não melhora esses resultados ou só aumenta volume de casos sem maior detecção. **Produto científico:** corpus de histórias pareadas, rubrica de ambiguidade e protocolo replicável.

## 5. Testes gerados por IA sobrevivem à evolução do software?

**Título possível:** *Teste gerado hoje, evidência amanhã? Um estudo longitudinal de oráculos, defeitos reais e manutenção de testes com IA.*

**Tensão observada:** a base contém frameworks e revisões sobre [automação com IA](https://doi.org/10.54254/2755-2721/2026.ld36950), [mapeamento requisito–teste](https://doi.org/10.25258/ijddt.16.48s.109) e [teste agentivo](http://arxiv.org/abs/2601.02454v1). Muitos resumos enfatizam geração, cobertura ou redução inicial de esforço; isso não equivale a oráculo correto ou custo baixo de manutenção após releases.

**Pergunta/hipótese:** a geração assistida por IA reduz o custo **total** de obter testes que continuam detectando falhas após mudanças de código e requisito?

**Desenho:** em projetos com histórico reproduzível, produzir testes para a versão inicial em três condições: profissional sem IA, profissional com IA e IA com revisão mínima. Exigir o mesmo orçamento de trabalho e registrar prompts/modelo. Validar oráculos sem consultar falhas reservadas. Reexecutar os testes em versões seguintes; contabilizar reparo, falsos positivos, testes descartados e defeitos reais detectados. Comparar por intenção de tratar para não esconder testes gerados que falharam antes de executar.

**Medida decisiva:** defeitos reais por hora total de criação+manutenção e validade dos oráculos após duas ou mais mudanças. **Resultado contrário:** ganhos iniciais desaparecem ou a intervenção gera evidências frágeis. **Produto científico:** conjunto de testes e histórico de manutenção reproduzível.

## 6. Um score ISO/IEC 25010 prediz a experiência real de uso?

**Título possível:** *Validade preditiva e sensibilidade dos modelos de qualidade de software frente a tarefas reais dos usuários.*

**Tensão observada:** avaliações de aplicativos usando [ISO/IEC 9126 e 25010](./referencias-qa/modelos-e-metricas-de-qualidade/dossie-completo.md) relatam pontuações favoráveis em sistemas específicos; a [análise de pesos no modelo de McCall](https://doi.org/10.59562/jessi.v7i3.11711) mostra sensibilidade da classificação; [Qualities of Quality](http://arxiv.org/abs/2107.13687v1) questiona validade de medidas; [Measuring Software Quality in Use](http://arxiv.org/abs/1503.06934v1) distingue qualidade do produto e experiência no contexto.

**Pergunta/hipótese:** pontuações de produto, atribuídas por avaliadores independentes e com pesos publicados, predizem sucesso de tarefas, erros e fricção percebida pelos usuários? A hipótese inclui sensibilidade material às regras de agregação.

**Desenho:** avaliar vários produtos com o mesmo instrumento adaptado da norma, usando avaliadores treinados e sem acesso aos resultados de usuários. Em seguida medir tarefas reais com perfis diversos, tempo, erros, acessibilidade observada e satisfação pós-tarefa. Pré-definir quais características deveriam prever cada resultado; testar diferentes pesos e concordância entre avaliadores.

**Medida decisiva:** validade convergente/preditiva, concordância e mudança de ranking ao variar pesos. **Resultado contrário:** scores robustos predizem bem os desfechos relevantes. **Produto científico:** instrumento, dados anonimizados e guia de interpretação por atributo, sem vender score total como certificação.

## 7. Uma prática leve de QA melhora pequenas equipes?

**Título possível:** *Engenharia de qualidade proporcional: avaliação longitudinal de um pacote mínimo de QA em equipes muito pequenas.*

**Tensão observada:** [Identifying Software Quality Attributes Relevant for Very Small Entities](https://doi.org/10.14483/23448350.24627) aponta necessidade de adequação dos modelos ao porte; um [framework Scrum+RSM](./referencias-qa/processos-requisitos-e-formacao-em-qa/dossie-completo.md) recebeu avaliação de apenas nove especialistas e concordância limitada; o [OSQI multidimensional](https://doi.org/10.3390/info17070624) reúne sinais técnicos, de processo e de equipe. Falta, no resumo da base, evidência de efeito longitudinal de uma intervenção pequena e operacional.

**Pergunta/hipótese:** um pacote mínimo — critérios de aceite testáveis, mapa curto de risco, regressão crítica e revisão semanal de escapes — reduz falhas que chegam aos usuários sem alongar excessivamente a entrega?

**Desenho:** recrutar equipes pequenas em momentos diferentes de adoção (desenho escalonado) ou comparar projetos pareados com histórico anterior. Pré-registrar pacote, treinamento e adesão. Observar vários ciclos antes e depois, mantendo definições consistentes de incidente e retrabalho. Entrevistas explicam mecanismos, mas não substituem os indicadores.

**Medida decisiva:** escapes por unidade de mudança, retrabalho, tempo de ciclo e esforço de QA; análise de tendência anterior e diferenças entre equipes. **Resultado contrário:** nenhum ganho robusto, ou ganho que custa mais tempo do que a equipe aceita. **Produto científico:** intervenção replicável e seus limites de adoção.

## 8. Injeção de falhas melhora modelos de disponibilidade?

**Título possível:** *Da falha induzida ao SLO observado: validade preditiva do chaos testing para disponibilidade de serviços.*

**Tensão observada:** [testes de disponibilidade em Kubernetes](https://doi.org/10.1109/RAMS50514.2026.11424466) usam falhas controladas e dados de recuperação; [modelos de crescimento de confiabilidade](https://doi.org/10.3390/math14173176) buscam estimar comportamento futuro. A ponte entre recuperação medida em experimentos e disponibilidade posterior sob operação real permanece uma pergunta empírica, pois injeção e produção podem ter distribuições de falha diferentes.

**Pergunta/hipótese:** incluir tempos de recuperação medidos em falhas injetadas melhora a calibração da previsão de disponibilidade em relação a modelos treinados só com incidentes históricos?

**Desenho:** instrumentar um serviço com tráfego e falhas observáveis; pré-definir classes de falha (instância, rede, dependência, armazenamento) e injetá-las com autorização em ambiente isolado. Ajustar modelos concorrentes com dados de experimento ou apenas histórico. Avaliar prospectivamente em períodos posteriores, incluindo falhas naturais e mudanças de carga. Registrar eventos em que o teste controlado não representa produção.

**Medida decisiva:** erro de previsão de indisponibilidade, calibração de intervalos, tempo de recuperação e custo do experimento. **Resultado contrário:** injeção não melhora previsão fora do laboratório. **Produto científico:** traços, scripts de injeção e limites explícitos de extrapolação.

## 9. O aprendizado com incidentes fecha mesmo o ciclo de QA?

**Título possível:** *De incidente a teste preventivo: um estudo temporal sobre reincidência de falhas após feedback de produção.*

**Tensão observada:** uma [arquitetura de quality engineering em ciclo fechado](https://doi.org/10.48550/arXiv.2606.08793) liga requisitos, testes e incidentes; a [taxonomia de SQA ao longo do ciclo de vida](https://doi.org/10.5281/zenodo.22341782) discute ferramentas em etapas. Uma arquitetura é uma proposta; o efeito operacional de transformar incidente em teste ainda exige observação com ordem temporal e controle de vieses.

**Pergunta/hipótese:** incidentes que produzem um teste com oráculo verificável e responsável definido têm menor recorrência da mesma classe de falha do que incidentes encerrados apenas com correção de código?

**Desenho:** construir uma coorte de incidentes confirmados de vários repositórios/serviços. Codificar gravidade, causa, versão, teste criado, qualidade do oráculo e tempo até a adoção. Comparar classes e períodos semelhantes com modelos temporais, controlando volume de mudanças e maturidade da equipe. Um piloto prospectivo deve registrar a política antes de observar resultados.

**Medida decisiva:** reincidência por classe, tempo até prevenção, defeitos detectados antes do release e custo de manutenção. **Resultado contrário:** criação de teste não altera reincidência ou apenas reflete equipes já mais maduras. **Produto científico:** taxonomia de ligações incidente–teste e protocolo de feedback verificável.

## 10. A mentoria ensina QA transferível para um sistema desconhecido?

**Título possível:** *Aprender a investigar em vez de decorar: transferência de habilidades de QA em ambientes de prática com falhas reproduzíveis.*

**Tensão observada:** o acervo inclui um trabalho sobre [currículo de SQA orientado por investigação](https://doi.org/10.1007/s13198-026-03271-3), mas o registro não tem abstract; um [relatório de 108 vagas](https://doi.org/10.5281/zenodo.22414216) observa demandas variadas de trabalho, em amostra específica dos EUA; o [TMap](./referencias-qa/processos-requisitos-e-formacao-em-qa/dossie-completo.md) descreve práticas profissionais. O QA Lab já possui [cenários e desvios plantados](../packages/web/lib/regression-packs.ts), criando condições para medir habilidade aplicada, não só conclusão de conteúdo.

**Pergunta/hipótese:** aprendizagem por investigação, com evidência e feedback, melhora a capacidade de encontrar e explicar defeitos em **um produto novo** semanas depois, comparada a leitura e quiz de igual duração?

**Desenho:** alocar participantes a duas trilhas de mesma carga, medir conhecimento prévio e aplicar tarefas equivalentes sem reutilizar os mesmos bugs no pós-teste. Avaliadores cegos pontuam estratégia, passos reproduzíveis, oráculo, impacto e comunicação. Após algumas semanas, aplicar tarefa de transferência em sistema não visto. Coletar consentimento, minimizar dados pessoais e reportar abandono.

**Medida decisiva:** desempenho em sistema novo, retenção tardia, qualidade dos artefatos e tempo de resolução. **Resultado contrário:** diferença só no sistema treinado ou nenhum ganho após igualar tempo de prática. **Produto científico:** rubricas, tarefas e análise anônima que possam ser reutilizadas por outros cursos.

## Priorização de pesquisa

| Critério | Propostas mais fortes | Motivo |
| --- | --- | --- |
| Contribuição metodológica com dados públicos | **1 e 2** | Testam a validade de ganhos e rótulos em uma área super-representada na base. |
| Evidência que o QA Lab consegue começar a produzir | **4, 5 e 10** | Há cenários, falhas plantadas e conteúdo que permitem piloto controlado. |
| Parceria industrial necessária | **7 e 9** | Exigem histórico de equipes/incidentes para inferência temporal crível. |
| Infraestrutura e risco operacional maiores | **8** | Precisa de serviço instrumentado e injeção de falhas autorizada. |

**Recomendação:** começar a investigação científica pela **proposta 2**, porque um conjunto de dados rotulado com proveniência explícita pode apoiar depois as propostas 1 e 3. Em paralelo, a **proposta 10** aproveita o QA Lab como laboratório educacional e produz uma linha de pesquisa própria. Esta ordem é uma decisão de pesquisa baseada no acervo local; a busca de anterioridade e a viabilidade dos dados podem alterá-la.

## Primeiro passo comum às dez propostas

1. Ler o texto completo de cada trabalho âncora e verificar DOI, versão e status editorial.
2. Fazer busca de anterioridade fora deste acervo e registrar estudos próximos que poderiam refutar a alegação de lacuna.
3. Pré-registrar pergunta, unidade de análise, critério de inclusão, divisão dos dados, métrica principal e análise estatística.
4. Fazer um piloto pequeno para medir disponibilidade dos dados, custo e confiabilidade do protocolo.
5. Manter dados e código de replicação versionados; escrever resultados, inclusive negativos, antes de fechar resumo e conclusão.
