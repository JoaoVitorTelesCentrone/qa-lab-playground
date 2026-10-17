# Da pesquisa à prática: laboratórios científicos para a mentoria

**Status:** primeiro pacote implementado. O L04 está em `/mentoria/labs/requisitos`, ligado à semana 3; o L05 está em `/mentoria/labs/oraculo`, ligado às semanas 6 e 8; e o L09 está em `/mentoria/labs/incidente`, ligado à semana 10. A entrega ao mentor continua manual pelo fluxo existente. Os demais laboratórios permanecem planejados.

### Primeiro incremento — 16/10/2026

- Cenário sintético próprio de aprovação de despesas; não altera as regras do ExpenseFlow.
- Não executa testes do aluno nem atribui nota automática. A comparação é revisada pelo mentor.
- O rascunho fica somente no navegador. Exportar não envia a entrega nem registra conclusão.
- Atividade autoguiada: os critérios fazem parte do código entregue ao navegador; a preservação da resposta é uma ajuda didática, não um mecanismo de avaliação inviolável.
- Este incremento não constitui replicação experimental dos artigos nem demonstra efeito causal. Persistência por conta, avaliação estruturada e coleta de dados de pesquisa permanecem fora desta entrega.

### Segundo incremento — 16/10/2026

- L05 executa um teste superficial e um teste com oráculo informado pelo aluno nas versões de referência e defeituosa.
- A massa é sintética e versionada; valores monetários usam centavos inteiros e o esperado não é obtido da função avaliada.
- A exportação registra seed, versões, saídas, justificativa e critérios de revisão. Ela não envia a atividade nem atribui nota.
- O exercício comprova somente que o oráculo detecta o defeito controlado neste seed. Não mede cobertura geral, manutenção longitudinal ou qualidade de testes gerados por IA.

### Terceiro incremento — 16/10/2026

- L09 conecta relato, release, correlação de logs, hipótese, reprodução, teste preventivo e correção.
- O pacote executa três massas: incidente original, variação com outros valores e contracaso com todos os registros aprovados.
- A regressão falha na versão defeituosa pelo motivo esperado, preserva o contracaso e passa em todos os casos depois da correção.
- Logs, incidente e versões são sintéticos. O resultado não prova queda de reincidência em produção; isso exigiria observação longitudinal.

**Origem:** [dez propostas científicas](./DEZ_IDEIAS_ARTIGOS_QA_EVIDENCIAS.md), [artigo de priorização por evidências](./PLANO_ARTIGO_PRIORIZACAO_POR_EVIDENCIAS_QA.md) e [biblioteca de 145 referências](./RESUMO_GERAL_ARTIGOS_QA.md).

## 1. Decisão de produto

As dez propostas podem contribuir para a mentoria, em formatos diferentes: **seis laboratórios aplicados à trilha principal** (propostas 4–9), **três laboratórios avançados de dados e IA** (1–3) e **uma avaliação de aprendizagem** (10). O artigo original de priorização pode conectar as entregas no projeto final.

Um exercício didático inspirado em um artigo permite experimentar um princípio. Uma replicação científica exige recuperar o método completo, os dados, a versão do código, os parâmetros e as métricas originais. Os primeiros labs serão adaptações didáticas identificadas como tais. Resultados do ambiente sintético não serão apresentados como reprodução dos percentuais publicados.

## 2. O que já existe e pode ser reaproveitado

| Ativo verificado no código | Uso possível | Limite encontrado |
| --- | --- | --- |
| [Catálogo de 12 semanas](../packages/web/lib/mentorship/catalog.ts) | Vincular prática a objetivos, nível, entrega e rubrica | Cada tarefa tem um único objeto `practice`; novos labs complementares precisam de vínculo próprio. |
| [Páginas individuais de aula, quiz, exemplo e desafio](../packages/web/lib/mentorship/content-steps.ts) | Introduzir teoria curta e entrada explícita para o experimento | Acrescentar texto não cria execução, coleta ou comparação experimental. |
| [Briefings práticos](../packages/web/lib/mentorship/lab-briefs.ts) | Reaproveitar missão, tarefas, evidências e critérios de aceite | Atualizar o briefing para exigir comparação antes/depois quando houver experimento. |
| [Tipos de entrega e revisão](../packages/web/lib/mentorship/types.ts) | Submissões, tentativas, anexos, parecer e versão de rubrica | Existência do tipo não comprova que todo novo resultado experimental já é persistido/validado. |
| [ExpenseFlow e configuração de falhas](../packages/web/data/expenseflow.ts) | Regras de despesa, autorização, limites e relatório | Flags são constantes; ainda falta um seletor controlado de variantes por tentativa. |
| [Packs de regressão](../packages/web/lib/regression-packs.ts) | Cenários, pré-condições e resultados esperados | Relações com falhas plantadas precisam ser auditadas antes de virar gabarito experimental. |
| [Catálogo de ambientes](../packages/web/lib/product/apps.ts) | Reutilizar produto e cenários já definidos | `liveApps` expõe apenas ExpenseFlow; Shop, CRM, Finanças e Agendamentos no código não significam liberação pública. |
| [Refinamento](../packages/web/app/lab/refinamento/page.tsx) e [critérios](../packages/web/app/lab/criterios/page.tsx) | Exercícios de ambiguidade e desenho de testes | Falta comparação entre versões equivalentes de um requisito. |
| [Logs](../packages/web/app/lab/logs/page.tsx) | Investigação e diagnóstico | Precisa ligar incidente, teste preventivo e nova execução. |
| [Performance local](../packages/web/app/mentoria/performance/page.tsx) e [scripts k6](../packages/performance/README.md) | Baseline, carga e evidência de execução | Carga não equivale a injeção de falha nem a experimento em Kubernetes. |
| [Entrada de CI/CD](../packages/web/app/lab/cicd/page.tsx) | Aproveitar a trilha existente | `/lab/cicd` redireciona para `/trilhas/cicd`; não assumir runner real de CI nessa rota. |
| [Métricas atuais](../packages/web/app/lab/metricas/page.tsx) | Referência interna para telemetria do produto | Página restrita a administrador; não é laboratório de métricas de qualidade para alunos. |

## 3. Mapa das dez propostas

| Proposta científica | Aplicação pedagógica | Encaixe recomendado | Formato inicial | Prioridade |
| --- | --- | --- | --- | --- |
| 1. Validação realista de preditores | Perceber vazamento e comparar divisões de dados | Extensão após semanas 9/12 | Notebook local com dataset versionado | P2 |
| 2. Proveniência de rótulos | Separar defeito, mudança e evidência insuficiente | Semana 4; análise de ML opcional | Dossiê de commits e anotação; notebook avançado | P2, com exercício básico antecipável |
| 3. Utilidade das explicações | Investigar se justificativas ajudam a localizar falhas | Extensão após semana 10 | Casos com predições e explicações congeladas | P2 |
| 4. Clareza dos requisitos | Comparar histórias ambíguas e verificáveis | Semana 3, retomada na 4 | Lab de requisitos e cobertura | P0 |
| 5. Testes gerados por IA ao longo do tempo | Validar oráculos e manutenção de testes | Semanas 6/8; extensão de IA na 12 | Lab de oráculos e versões | P0 para oráculos; P1 para IA |
| 6. Validade dos scores de qualidade | Contrastar score com sucesso em tarefas | Semanas 1/11/12 | Lab de qualidade em uso | P1 |
| 7. QA em equipes pequenas | Escolher práticas sob orçamento limitado | Semanas 5/9/12 | Simulação de equipe e planejamento | P1 |
| 8. Falhas e disponibilidade | Medir degradação e recuperação | Semanas 10/11 | Serviço local com falha controlada | P1 |
| 9. Incidente a teste preventivo | Confirmar causa e impedir recorrência | Semanas 4/10/12 | Lab de incidente e regressão | P0 |
| 10. Transferência de aprendizagem | Avaliar habilidade em problema novo | Entrada, semana 12 e retorno posterior | Avaliação prática, com rubrica | P1 |

P0 significa primeira entrega; P1 depende das bases de execução e avaliação; P2 exige formação adicional e dados apropriados. Não é necessário acrescentar semanas obrigatórias: o núcleo usa as semanas existentes e as extensões avançadas ficam opcionais.

## 4. Especificações dos laboratórios

### L01 — O resultado depende de como se divide o dataset? (proposta 1)

**Competência:** reconhecer vazamento temporal e generalização limitada. **Pré-requisitos:** tabelas, matriz de confusão e noções de treino/teste; opcional para iniciantes.

- **Experimento:** usar um dataset didático com projetos, versões, datas e módulos repetidos; comparar divisão aleatória com divisão temporal e projeto reservado, mantendo o modelo constante. Não fabricar a melhoria ou a piora: calcular e interpretar o que ocorrer.
- **A construir:** dataset pequeno com licença/proveniência, notebook executável, manifesto de splits e versão das dependências; depois adicionar dataset real auditado. Uma visualização de resultados prontos será identificada como demonstração.
- **Entrega:** tabela de desempenho, manifesto de treino/teste e explicação de uma possível fonte de vazamento.
- **Aceite:** cada registro do teste está fora do treino; pré-processamento foi ajustado apenas no treino; resultados incluem desbalanceamento e limites. Resultado negativo não impede aprovação.
- **Vínculo científico:** proposta 1 e seus trabalhos sobre auditoria, viés de persistência e validação por projeto. A reprodução publicada depende dos artefatos originais.

### L02 — Qual evidência permite chamar um commit de defeito? (proposta 2)

**Competência:** rastrear a origem de uma classificação. **Pré-requisitos:** bug report e Git básico.

- **Experimento:** apresentar um pacote inicial de aproximadamente 20 mudanças sintéticas documentadas: correção, refatoração, reversão operacional e casos ambíguos. Comparar rótulo inferido da mensagem com inspeção de diff, issue e comportamento reproduzido.
- **A construir:** fichas de evidências, estado “inconclusivo”, justificativa de decisão e referência revisada pelo mentor. Versão avançada compara modelos sobre o mesmo conjunto e granularidade com rotulações distintas.
- **Entrega:** matriz de classificação, fonte de cada decisão e lista de divergências.
- **Aceite:** “fix” ou “revert” não é tratado como prova suficiente; incerteza justificada é aceita; o aluno não mistura função, arquivo e commit como unidade estatística.
- **Vínculo científico:** proposta 2, ReDef e dataset rotulado por mensagens. A versão didática não é uma amostra desses repositórios até haver extração e licença verificadas.

### L03 — Explicação convincente ou diagnóstico correto? (proposta 3)

**Competência:** verificar uma recomendação de IA contra evidência observável.

- **Experimento:** fornecer casos equivalentes com score, explicação e diff; incluir predição errada e explicações contraditórias. Registrar suspeita e evidência antes de revelar a causa confirmada.
- **A construir:** conjunto revisado de falhas, gabarito separado do cliente, explicações com origem identificada e comparação de decisões. MVP usa exemplos congelados; gerar SHAP/LIME exige pipeline adicional.
- **Entrega:** localização sugerida, evidência, confiança e alteração da decisão após investigar.
- **Aceite:** a justificativa referencia o comportamento/código; confiança e acerto são avaliados separadamente; não se premia apenas concordância com o modelo.
- **Vínculo científico:** proposta 3, XMENTOR e estabilidade de explicações. Medir o efeito humano exige participantes, ordem controlada e protocolo próprio.

### L04 — Uma história, duas interpretações (proposta 4)

**Competência:** transformar ambiguidade em pergunta, critério verificável e teste. **Encaixe:** semana 3, entrega de cenários.

- **Experimento:** no ExpenseFlow, usar requisito de aprovação com limite monetário e papéis. O aluno recebe primeiro a versão ambígua, registra dúvidas e cenários; recebe então uma versão esclarecida e revisa a cobertura.
- **Dados:** histórias A/B versionadas, tabela de regras e perfis sintéticos, casos abaixo/no/acima do limite. A regra esclarecida precisa estar registrada antes de avaliar respostas.
- **A construir:** comparação de versões, editor/tabela de cenários e snapshots das duas respostas, reaproveitando os labs de refinamento/critérios.
- **Entrega:** perguntas de refinamento, matriz regra–cenário–esperado e comparação antes/depois.
- **Aceite:** cenários incluem limites e autorização; resultado esperado cita regra; lacunas não são preenchidas silenciosamente pelo aluno. O mentor avalia a justificativa, não apenas quantidade.
- **Extensão científica:** duas tarefas equivalentes com ordem alternada para comparar condições sem confundir esclarecimento com aprendizado pela repetição.

### L05 — O teste verde que não encontra o defeito (proposta 5 e artigo original)

**Competência:** criar assertions que protegem o comportamento de negócio. **Encaixe:** semanas 6 e 8.

- **Experimento:** oferecer duas implementações versionadas de cálculo/relatório, uma correta e outra com desvio conhecido. Um teste que só verifica abertura da tela passa em ambas; o aluno acrescenta verificação independente do resultado e compara as execuções.
- **Dados:** seed de despesas conhecido, esperado calculado por regra independente e versões de referência/defeituosa. O esperado não pode ser calculado pela mesma função que se deseja testar.
- **A construir:** pacote executável de função pura para o primeiro incremento; E2E depois. Criar variantes explícitas, sem depender de editar as constantes globais de bugs do ExpenseFlow. Registrar logs reais de execução.
- **Entrega:** teste inicial, teste fortalecido, saída nas duas versões e justificativa do oráculo.
- **Aceite:** teste fortalecido passa na versão correta e falha pelo motivo previsto na defeituosa; falha de sintaxe, indisponibilidade ou timeout não conta como detecção do defeito.
- **Extensão IA:** fornecer testes de autoria identificada, revisar oráculos e medir custo de reparo em nova versão. A primeira versão do lab pode usar amostras congeladas; geração ao vivo exige provedor, orçamento e consentimento de envio do código.
- **Vínculo científico:** proposta 5 e artigos sobre geração/testes agentivos; múltiplas versões tornam a manutenção observável.

### L06 — Nota alta, tarefa impossível (proposta 6)

**Competência:** relacionar métricas com necessidade do usuário. **Encaixe:** semanas 1, 11 e 12.

- **Experimento:** avaliar uma jornada de reembolso por atributos explícitos e pesos; executar a mesma jornada com teclado, erro de validação e rede degradada; comparar score com sucesso da tarefa e variar os pesos.
- **A construir:** formulário de avaliação por atributo, tarefa controlada, coleta de observações e comparação de agregações. Criar uma página didática nova: `/lab/metricas` é administrativa e não deve ser reutilizada como área do aluno.
- **Entrega:** tabela de atributos e evidências, observações de tarefas, análise de sensibilidade e recomendação de melhoria.
- **Aceite:** cada nota tem evidência; pesos estão visíveis; o aluno explica divergências entre score agregado e barreiras concretas. O lab não certifica conformidade ISO ou acessibilidade.
- **Vínculo científico:** proposta 6, sensibilidade de McCall e qualidade em uso. Avaliação por um aluno é exercício; validade preditiva exige vários produtos, usuários e avaliadores.

### L07 — Qualidade com capacidade limitada (proposta 7)

**Competência:** escolher práticas e testes com justificativa de custo/risco. **Encaixe:** semanas 5, 9 e 12.

- **Experimento:** equipe fictícia recebe backlog, riscos e orçamento de tempo. O aluno distribui esforço entre refinamento, exploração, automação e diagnóstico; depois recebe novas evidências e revisa sua decisão.
- **A construir:** cenários versionados, cartões de custo explicitamente simulados, cronologia dos eventos e comparação de decisões. Evitar pontuação que ensine uma única estratégia como universalmente ótima.
- **Entrega:** plano viável, práticas escolhidas/adiadas, critérios de revisão e decisão de release.
- **Aceite:** orçamento respeitado, riscos críticos tratados e decisões rastreáveis. Resultados simulados não contam como redução real de incidentes.
- **Vínculo científico:** proposta 7 e estudos de pequenas entidades/OSQI. Medir efeito organizacional requer equipes externas e observação longitudinal.

### L08 — Cair, recuperar e provar (proposta 8)

**Competência:** distinguir desempenho, disponibilidade e recuperação. **Encaixe:** semanas 10/11.

- **Experimento:** serviço local de treino alterna estado saudável, dependência lenta e falha temporária controlada. Medir baseline, período de falha, recuperação e integridade de operações; comparar comportamento com e sem a medida de recuperação implementada.
- **A construir:** API local com mecanismos de falha restritos ao ambiente de teste, agenda de eventos reproduzível, tempos monotônicos e logs correlacionados. Reaproveitar runner de performance e seus limites locais; adicionar cenários próprios de resiliência.
- **Entrega:** comandos, manifesto, série temporal, erro observado, tempo de recuperação e limite da conclusão.
- **Aceite:** parar falhas e restaurar estado funciona; operações não duplicam; recuperação é comprovada por sinal definido previamente. Não estimar disponibilidade anual com uma execução curta.
- **Extensão científica:** Kubernetes e injeção distribuída somente em etapa avançada com cluster isolado. A adaptação local não replica o artigo de Kubernetes.

### L09 — Do incidente ao teste que impede a volta (proposta 9)

**Competência:** conectar diagnóstico, correção e regressão. **Encaixe:** semana 10, retomando bug reports da 4.

- **Experimento:** receber relato e logs de relatório financeiro divergente; formular hipóteses, reproduzir com seed, escrever teste que falha antes da correção e passa depois. Uma variação posterior verifica se o teste protege a regra ou apenas memorizou o exemplo.
- **A construir:** pacote integrado de incidente, logs e versões executáveis; reutilizar a apresentação de investigação do Lab de Logs, vinculando-a ao pacote de execução do L05.
- **Entrega:** cadeia incidente → evidência → causa → teste → correção → execução, incluindo um caso semelhante que não deve falhar.
- **Aceite:** correção isolada é demonstrável; logs correspondem à versão executada; teste falha pela causa relevante; narrativa admite limites e hipótese rejeitada.
- **Vínculo científico:** proposta 9 e quality engineering em ciclo fechado. A recorrência de incidentes reais demanda observação posterior; um lab demonstra prevenção da falha controlada.

### L10 — Aprendi mesmo ou reconheci o exercício? (proposta 10)

**Competência:** transferir investigação, desenho de teste e comunicação para um contexto novo.

- **Aplicação:** diagnóstico inicial, desafio final com domínio/regras diferentes e atividade posterior de retenção. Não é necessário criar outro produto: versões independentes e não vistas de um fluxo podem atender o piloto, desde que não reutilizem o gabarito treinado.
- **A construir:** banco de tarefas equivalentes, tentativas separadas, rubrica estável e revisão sem mostrar ao avaliador a condição pedagógica quando for pesquisa.
- **Entrega:** plano de investigação, bug reproduzível, teste e decisão de risco em cenário novo.
- **Aceite:** avaliar qualidade dos artefatos e transferência; cliques, horas ou conclusão de aulas não substituem habilidade. Avaliação pedagógica regular e participação em pesquisa têm finalidades e consentimentos distintos.
- **Vínculo científico:** proposta 10. Comparar turmas requer equivalência de carga, conhecimento prévio, perdas de acompanhamento e protocolo; as entregas da mentoria sozinhas não provam efeito causal.

## 5. Infraestrutura mínima para tornar a prática reproduzível

Uma experiência comum pode servir a todos os labs: **briefing → hipótese registrada → baseline → alteração controlada → nova execução → comparação → entrega → revisão**. Cada etapa deve produzir evidência própria.

**Manifesto por tentativa:** `labId`, versão do cenário, versão da rubrica, seed, variante do produto, hash/referência do artefato, ambiente e data. **Resultado de execução:** comando, saída, duração, status e vínculo para evidência. **Resposta do aluno:** hipótese, observações, conclusão e limite. Dados indisponíveis recebem estado explícito, não números simulados apresentados como medidos.

O reset deve restaurar apenas o cenário da tentativa. A execução não deve compartilhar dados de alunos nem alterar as falhas de outros ambientes. Gabaritos e associação de falhas não devem ser enviados antecipadamente ao navegador em avaliações. Cases demonstrativos podem revelar a solução depois da comparação.

No primeiro incremento, specs/notebooks rodam localmente e o aluno anexa relatório/JSON validado. Uma saída importada é evidência declarada pelo aluno, não execução certificada pelo servidor. Executar código arbitrário de aluno na infraestrutura web exigiria um runner isolado, limites e gestão de jobs; não faz parte do mínimo necessário.

## 6. Integração à mentoria

- Manter uma entrega principal por semana; anexar prática científica complementar com chave própria, preservando as chaves atuais das assignments.
- Acrescentar vínculo opcional de labs no catálogo, sem sobrecarregar o único `practice` existente. Rotas sugeridas `/mentoria/labs/<slug>` são novas propostas, não URLs disponíveis.
- Usar os mecanismos de leitura já existentes para teoria curta e fonte; quiz para distinguir conceitos, exemplo para mostrar uma comparação e desafio para executar o experimento.
- Adaptar `lab-briefs.ts`, `submission-prompts.ts` e rubricas para pedir versão, hipótese, antes/depois e limites. O mentor julga raciocínio e evidência; uma métrica pior pode ser uma conclusão correta.
- Preservar iniciante/intermediário: iniciante executa roteiro e interpreta; intermediário altera uma variável, cria contraprova e discute validade. ML e notebooks são extensão avançada.
- No projeto final, reaproveitar o artigo original: selecionar testes sob orçamento e justificar a escolha com resultados dos labs. Evitar exigir que todo aluno complete dez pesquisas independentes.

## 7. Ordem concreta de implementação

| Etapa | Entrega | Verificação necessária para fechar |
| --- | --- | --- |
| A — Pacote de cenários e evidência | Manifesto versionado, seeds, rubrica e contrato de exportação | Duas tentativas reproduzem o mesmo cenário; reset não afeta outra tentativa; versões aparecem no relatório. |
| B — L04 Requisitos | História A/B, cenários e comparação; vínculo semana 3 | Respostas anteriores preservadas; regras e questões em aberto distinguíveis; critérios conferidos pelo mentor. |
| C — L05 Oráculos | Implementações correta/defeituosa, specs executáveis e comparação; semanas 6/8 | Teste fraco passa nas duas; forte discrimina; erro de ambiente não é contado como descoberta. |
| D — L09 Incidente | Logs ligados a versão, reprodução e regressão; semana 10 | Teste demonstra antes/depois e não falha no contracaso; relatório conecta os artefatos. |
| E — Extensões aplicadas | L06 qualidade em uso, L07 capacidade, L08 resiliência e L10 transferência | Métricas computadas, simulação identificada e critérios específicos de cada lab atendidos. |
| F — Dados/IA | L02 rótulos, L01 validação e L03 explicações; expansão IA do L05 | Proveniência/licença, divisão sem vazamento, baseline reproduzível e resultados sem promessa de ganho. |

**Primeiro pacote recomendado: L04 + L05 + L09.** Ele forma uma sequência concreta: entender a regra, verificar o comportamento e transformar uma falha em prevenção. Cada lab acrescenta uma capacidade observável às semanas 3, 6/8 e 10; os demais aproveitam os mesmos contratos de cenário, execução e evidência.

## 8. Quando podemos dizer que algo foi replicado

| Rótulo da atividade | Evidência mínima |
| --- | --- |
| Inspirada em pesquisa | Fonte e conceito identificados, cenário didático próprio e limites explícitos. |
| Reprodução de princípio | Dados/seed, controle/baseline, protocolo repetível e resultado calculado no lab. |
| Replicação de artigo | Texto completo, método compatível, datasets e licenças, versões/parâmetros, baselines e comparação documentada com o resultado original. |
| Novo estudo científico | Protocolo, amostra justificada, análise, ameaças à validade e artefatos de replicação; aprovação/consentimento aplicáveis a estudos com pessoas. |

O próximo incremento de produto deve começar com exercícios inspirados em pesquisa e reproduções de princípio. A biblioteca atual contém abstracts e metadados, com registros incompletos; ela não basta para prometer replicação integral dos experimentos publicados.
