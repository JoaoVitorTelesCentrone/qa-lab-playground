# 05 — Como investigar flakiness

- **Tema:** APIs e confiabilidade da suíte
- **Capítulo:** 18 — Arquitetura e flakiness
- **Chave no produto:** `mentoria.w08.l2`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/labs/waits`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Evidencia antes de culpar o teste. Ao final, a pessoa deve conseguir: **diagnosticar se a falha vem do produto, do teste ou do ambiente.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Quando um smoke falha às vezes, como descobrir a causa sem mascará-la? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Flakiness significa que execuções comparáveis dão resultados diferentes sem mudança intencional. A causa pode estar no produto, no teste, nos dados ou no ambiente. No caso Broto, um teste de retomada poderia falhar porque procurou o registro antes de ele aparecer, porque usou dado antigo ou porque a persistência falhou. Não escolho uma dessas explicações por intuição. Reúno traces, tempos, estados e condições de execução.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre três execuções do smoke autorizado ou do lab de waits do QA Lab. Monte uma tabela com etapa, duração, dado, estado observado e hipótese. Destaque o instante em que a assertion falhou; não apresente um lab local como execução do Broto.

**Fala:** “Primeiro reproduzo sob condições comparáveis. Se a falha acontece antes de localizar o registro, verifico se o dado foi criado e se o teste esperou pelo estado correto. Se aparece um registro de outra execução, investigo isolamento. Se o produto mostrou confirmação mas o registro sumiu, preservo evidência para investigar persistência. Mudo uma variável por vez e repito. Aumentar um timeout pode ser adequado após medir o tempo real, mas adicionar dez segundos cegamente não identifica a causa e pode só atrasar a falha.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Ao final, relato hipótese, evidência antes e depois, mudança aplicada e risco restante. Se não confirmei causa, digo isso. Retry pode ser medida temporária monitorada, nunca substituto para entender regressão no ciclo de valor.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Investigue uma falha intermitente no lab ou em automação autorizada. Entregue tabela de execuções, hipótese, experimento de uma variável e conclusão limitada. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Investigue uma falha intermitente no lab ou em automação autorizada. Entregue tabela de execuções, hipótese, experimento de uma variável e conclusão limitada.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
