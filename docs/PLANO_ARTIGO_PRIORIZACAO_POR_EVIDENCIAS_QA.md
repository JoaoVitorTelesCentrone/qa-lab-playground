# Proposta de artigo: priorização de testes pela qualidade da evidência

**Estado:** proposta de pesquisa. Ainda não há experimento, resultados ou alegação de originalidade comprovada.

**Título provisório (português):** Quando um teste merece prioridade? Um estudo empírico sobre risco, custo e qualidade da evidência na regressão de software.

**Título provisório (inglês):** When Should a Test Run First? An Empirical Study of Risk, Cost, and Evidence Quality in Regression Testing.

## 1. A ideia em uma frase

Investigar se uma priorização de testes que considera **risco da mudança, tempo de execução e confiança na evidência produzida pelo teste** encontra defeitos reais mais cedo e ajuda a justificar a decisão de liberação melhor do que ordens baseadas apenas em histórico de falhas, cobertura ou duração.

## 2. Por que essa ideia nasce da biblioteca

O [resumo geral dos 145 registros](./RESUMO_GERAL_ARTIGOS_QA.md) mostra pesquisas abundantes em predição de defeitos, IA e priorização, mas também aponta problemas de validade das métricas, oráculos, rastreabilidade, dados e custo operacional. A interseção desses assuntos sugere uma pergunta ainda útil para QA: **quando um teste de alta prioridade produz uma evidência confiável para a decisão?**

| Peça da biblioteca | O que contribui para a proposta | Questão que este artigo investigará |
| --- | --- | --- |
| [DD-TCP: priorização orientada por dados](https://doi.org/10.32604/cmc.2026.077782) | Mudanças, dependências, duração e histórico podem ordenar testes. | O ranking melhora quando se mede também a qualidade da evidência produzida? |
| [Protocolo comparável e sensível a custo](https://doi.org/10.21203/rs.3.rs-10572455/v1) | Custo, oráculos e falhas reais importam na comparação. | Como comparar estratégias sob o mesmo orçamento de execução? |
| [Mapeamento de requisitos para casos de teste](https://doi.org/10.25258/ijddt.16.48s.109) | Rastreabilidade pode ser apoiada por automação. | Um vínculo de requisito revisado melhora a utilidade do teste no ranking? |
| [Crítica às métricas de esforço](http://arxiv.org/abs/2504.19181v1) | A escolha da proxy de esforço altera conclusões. | Rankings continuam úteis quando o orçamento é contado em minutos reais? |
| [Revisão terciária de medição de qualidade](http://arxiv.org/abs/2107.13687v1) | Validade de métricas e datasets antigos são preocupações recorrentes. | A medida proposta corresponde à decisão operacional que pretende apoiar? |
| [Auditoria de experimentos de predição](http://arxiv.org/abs/2601.18477v1) | Desenho experimental e reprodutibilidade mudam a confiança nos resultados. | O estudo mantém projetos, versões e ajustes separados para evitar vazamento? |

**Lacuna provisória:** a biblioteca reúne trabalhos sobre componentes isolados da decisão, mas não estabelece, por si só, que exista uma avaliação conjunta da **força da evidência do teste** com risco e custo em regressão de projetos comuns. Esta é uma hipótese de pesquisa, não uma reivindicação de ineditismo. A etapa 1 do plano fará busca de anterioridade nas fontes primárias.

## 3. Pergunta, contribuição e hipóteses

**Pergunta principal (RQ1):** sob um orçamento fixo de tempo, ordenar testes por risco da mudança ajustado pela qualidade da evidência encontra defeitos reais mais cedo que estratégias usuais de regressão?

**RQ2:** quais partes da qualidade da evidência — rastreabilidade, força do oráculo e estabilidade de execução — ajudam ou prejudicam o resultado?

**RQ3:** QA e desenvolvimento conseguem entender e revisar a justificativa de cada posição do ranking sem sacrificar a detecção de falhas?

**Hipótese H1:** a estratégia proposta aumenta a proporção de falhas reais detectadas nos primeiros 25% e 50% do tempo total de execução, comparada às linhas de base pré-definidas.

**Hipótese H2:** a contribuição dos sinais de evidência varia conforme o projeto; nenhuma dimensão será declarada necessária antes da ablação.

**Hipótese H3:** justificativas explícitas de risco, evidência e custo são julgadas mais úteis por revisores do que uma pontuação sem decomposição.

**Contribuições pretendidas:** (1) definição operacional e rubrica de qualidade da evidência de um teste; (2) ranking simples e auditável; (3) benchmark reproduzível com orçamento de execução; (4) estudo de ablação e limites de generalização. O artigo deve publicar também resultados negativos ou mistos.

## 4. Método proposto

### 4.1 Unidade de análise e dados

- **Unidade:** um teste de regressão candidato em uma versão com defeito conhecido.
- **Piloto interno:** cenários de regressão e desvios plantados do QA Lab, documentados em [`regression-packs.ts`](../packages/web/lib/regression-packs.ts) e [`bugs.ts`](../packages/web/lib/product/practice/bugs.ts). Esse ambiente permite validar coleta, rubrica e execução repetível; ele não será usado sozinho para reivindicar validade externa.
- **Estudo principal:** selecionar projetos de código aberto com histórico de versões, testes executáveis e falhas reais reproduzíveis. Registrar critérios de inclusão e exclusão antes de escolher os casos. Confirmar o defeito na versão afetada e a correção na versão posterior; preservar logs, commit e ambiente de execução.
- **Amostra:** definir tamanho após piloto e análise de precisão do intervalo de confiança. Planejar diversidade de pelo menos três projetos e mais de uma versão por projeto. Se a amostra de falhas reais for insuficiente, publicar o resultado como estudo de viabilidade, sem alegar superioridade geral.

### 4.2 Sinais disponíveis antes da execução

1. **Risco da mudança:** arquivos ou componentes alterados, dependências afetadas e falhas históricas conhecidas até a versão avaliada.
2. **Rastreabilidade:** vínculo revisado entre o teste, comportamento esperado e requisito ou regra de negócio afetada. Vínculos inferidos automaticamente precisam de revisão; ausência de vínculo será marcada como ausente, não presumida como risco zero.
3. **Força do oráculo:** capacidade observável das verificações de distinguir comportamento correto de incorreto. Registrar tipo de asserção e, onde aplicável, sensibilidade a mutações relevantes. A rubrica deve ser publicada antes de pontuar os dados principais.
4. **Estabilidade:** frequência de falhas intermitentes medida somente no histórico anterior à versão avaliada.
5. **Custo:** tempo efetivo de execução do teste, incluindo preparação indispensável. Usar orçamento em minutos, com análise de sensibilidade para outras proxies de esforço.

Uma pontuação transparente pode ser testada como **risco estimado × qualidade da evidência ÷ custo**. Pesos e transformações devem ser definidos no piloto ou ajustados apenas no conjunto de treino. Cada posição do ranking mostrará seus componentes. Testes obrigatórios por requisito crítico são identificados separadamente e não podem ser descartados pela fórmula. Se um caso de alto risco tiver oráculo fraco, a saída também deve sinalizar **melhorar o teste**, em vez de simplesmente ocultá-lo no fim da fila.

### 4.3 Comparações justas

Comparar, com os mesmos testes, versões e orçamentos:

- ordem original da suíte;
- menor duração primeiro;
- histórico de falhas anterior à versão;
- cobertura dos componentes alterados, quando esse dado existir;
- ranking de risco sem qualidade da evidência;
- estratégia proposta completa;
- técnica publicada de priorização orientada por dados, somente se houver implementação e dados suficientes para reprodução fiel.

Fazer ablação retirando uma dimensão por vez: rastreabilidade, oráculo e estabilidade. Reportar casos em que uma dimensão piora o resultado.

### 4.4 Protocolo de avaliação

1. Congelar a versão defeituosa, a suíte e as informações que existiam **antes** da correção. Nenhum dado posterior pode entrar nas features, nos pesos ou na escolha do teste.
2. Executar a suíte completa ao menos uma vez, com repetição para investigar flakiness, para conhecer quais testes detectam cada falha e quanto custam. Usar essas execuções apenas para avaliar rankings retrospectivos.
3. Separar treino e avaliação por tempo e por projeto. Ajustes feitos em um projeto não podem consultar o conjunto de teste de outro projeto reservado para validação.
4. Simular orçamentos fixos de 25% e 50% do tempo total da suíte e registrar detecção acumulada de falhas reais. Exibir também a curva ao longo de todo o orçamento.
5. Aplicar a mesma definição de falha, orçamento e custo a todas as estratégias. Publicar exclusões e perdas de execução.
6. Fazer uma revisão cega de uma amostra de rankings por pelo menos dois profissionais de QA/desenvolvimento, com rubrica de clareza, justificativa e ação possível. Registrar discordâncias e acordo entre avaliadores.

### 4.5 Medidas e análise

- **Primárias:** proporção de falhas reais detectadas até 25% e 50% do tempo total; tempo até a primeira falha real.
- **Secundárias:** APFDc ou medida equivalente sensível a custo, número de testes executados, custo por falha detectada, taxa de falsos alarmes, estabilidade do ranking e avaliação humana da justificativa.
- **Estatística:** diferenças pareadas por versão, intervalos de confiança obtidos por reamostragem no nível de projeto/versão, distribuição dos efeitos por projeto e análise de sensibilidade ao orçamento, à proxy de custo e às escolhas de pesos. Não usar um único valor de p ou uma única média para resumir a conclusão.
- **Critério interpretativo:** uma estratégia só será recomendada se o ganho de detecção justificar o custo adicional de coleta e manutenção dos sinais. Ausência de ganho, dependência de um projeto ou vantagem limitada a falhas plantadas são resultados válidos.

## 5. Riscos metodológicos e como tratá-los

| Risco | Tratamento previsto |
| --- | --- |
| Falhas plantadas do QA Lab serem mais simples que falhas reais | Usá-las no piloto; reservar falhas reais reproduzíveis para a conclusão principal. |
| Vazamento de informação da correção ou da execução futura | Congelar datas, versões, features e splits; revisar cada variável por disponibilidade temporal. |
| Links requisito–teste inexistentes em projetos externos | Registrar a ausência; usar amostra com documentação rastreável ou analisar essa dimensão separadamente. Não fabricar links. |
| Oráculo forte gerar pontuação alta só porque o teste foi escrito para o defeito conhecido | Definir rubrica antes do conjunto de avaliação e avaliar testes existentes na versão anterior à correção. |
| Flakiness confundida com detecção de defeito | Repetir execuções, classificar falhas intermitentes e apresentar análise com e sem esses casos. |
| Uma métrica composta esconder trade-offs | Publicar componentes, pesos, ablações, curvas e casos em que o método falha. |
| Pequeno número de projetos ou versões | Reportar precisão e heterogeneidade; restringir a conclusão ao escopo observado. |

## 6. Plano de produção do artigo

| Etapa | Trabalho concreto | Entregável / critério de saída |
| --- | --- | --- |
| 1. Anterioridade e protocolo | Buscar artigos diretamente relacionados, ler método/resultados completos dos trabalhos centrais, formular rubrica e pré-registrar RQs, métricas, exclusões e baselines. | Matriz de estudos relacionados e protocolo congelado; ajustar a alegação de contribuição ao que a busca confirmar. |
| 2. Piloto no QA Lab | Extrair cenários, bugs plantados, tempos e ligações entre teste e comportamento; repetir execuções e testar a rubrica com dois avaliadores. | Pipeline reproduzível, dicionário de dados e lista de problemas de coleta. |
| 3. Seleção dos projetos externos | Aplicar critérios de inclusão, preparar versões afetadas e corrigidas e executar testes em ambiente isolado. | Manifesto de projetos, commits, falhas, testes, logs e exclusões. |
| 4. Implementação e baselines | Implementar ranking transparente e linhas de base; checar que só dados anteriores à versão entram nas features. | Código versionado, configuração fixa e auditoria de vazamento. |
| 5. Experimento | Rodar suíte, simular orçamentos, fazer ablação e revisão humana. | Tabelas, curvas, intervalos de confiança e exemplos de acerto/erro. |
| 6. Redação e revisão | Escrever introdução, estudos relacionados, método, resultados, discussão, ameaças à validade e conclusão; revisão técnica e de linguagem. | Manuscrito completo com cada afirmação empírica ligada a resultado ou fonte. |
| 7. Reprodutibilidade | Publicar scripts, ambiente, rubrica, dados permitidos/licenciados e instruções para reconstruir figuras. | Pacote de replicação executável por outra pessoa. |

**Cronograma indicativo de 10 a 12 semanas:** semanas 1–2 para anterioridade e protocolo; 3–4 para piloto e rubrica; 5–7 para dados externos e baselines; 8–9 para experimento e análise; 10–12 para redação, revisão e pacote de replicação. O avanço de cada fase depende do entregável da tabela, especialmente da reprodução de falhas reais.

**Ordem de escrita recomendada:** protocolo e método → resultados e figuras → ameaças à validade → discussão → introdução e resumo. O resumo final e a conclusão só devem ser redigidos depois da análise.

## 7. Estrutura do manuscrito

1. Introdução: decisão de regressão sob tempo limitado e problema da evidência fraca.
2. Trabalhos relacionados: priorização, oráculos, rastreabilidade, métricas sensíveis a custo e validade experimental.
3. Definições: risco, qualidade da evidência, custo e decisão auditável.
4. Método: seleção de projetos, dados, ranking, baselines, divisões e métricas.
5. Resultados por RQ: detecção sob orçamento, ablação e revisão humana.
6. Discussão: quando usar, custo de adoção e casos em que não funcionou.
7. Ameaças à validade e limitações.
8. Conclusão e pacote de replicação.

## 8. Pronto para começar quando

- A busca de anterioridade confirmar uma contribuição específica e atualizar o posicionamento do artigo.
- A rubrica de evidência, as perguntas e os baselines estiverem escritos antes de olhar resultados do estudo principal.
- Houver ao menos um caso externo com falha real reproduzível para testar a viabilidade do protocolo.

**Definição de artigo pronto:** manuscrito com resultados reais, comparação justa, limitações explícitas, fontes verificadas e pacote de replicação. Este plano não antecipa que a hipótese será confirmada.
