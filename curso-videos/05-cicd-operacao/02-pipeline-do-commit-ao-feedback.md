# 02 — Pipeline do commit ao feedback

- **Tema:** CI/CD e operação
- **Capítulo:** 19 — Git, PR e pipeline
- **Chave no produto:** `mentoria.w09.l1`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/lab/cicd`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Como qualidade entra no fluxo de entrega. Ao final, a pessoa deve conseguir: **explicar o caminho da mudança até o feedback do time.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Em que ordem executar verificações para devolver feedback útil ao time? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Um pipeline eficaz coloca sinais baratos e rápidos antes dos caros. Para uma mudança no fluxo Broto, erros de sintaxe e unidade devem aparecer cedo; um smoke de captura e retomada pode vir depois, em ambiente autorizado; regressões mais longas podem rodar em outro estágio. Cada etapa precisa declarar gatilho, duração esperada, dependências e artefatos. O objetivo é localizar problemas rápido sem deixar de proteger a jornada central.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre um pipeline desenhado com lint, unidade, contrato local quando aplicável, smoke autorizado e regressão. Use um commit fictício da captura. Abra um exemplo de falha e mostre onde encontrar log, trace ou captura sanitizada.

**Fala:** “Ao receber o commit, executo lint e testes de regra em paralelo quando possível. Se eles falham, não gasto tempo iniciando browser. Quando passam, preparo a conta de teste e executo o smoke da jornada. Se o texto não aparece após o retorno, guardo a etapa e a evidência, sem imprimir o conteúdo de usuários reais. A regressão mais ampla pode ser agendada antes da publicação ou em outro gatilho, conforme o risco. Em cada estágio, um resultado vermelho precisa indicar próximo passo, não apenas 'job failed'.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “A ordem pode mudar quando medimos custo e taxa de falha. Não copio uma pipeline genérica sem perguntar que risco do Broto ela reduz. Também não uso um teste local de API para declarar que o serviço do Broto passou; cada etapa identifica seu alvo.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Proponha pipeline para uma mudança na captura com ordem, gatilhos, limite de tempo, artefato e responsável pela triagem de cada etapa. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Proponha pipeline para uma mudança na captura com ordem, gatilhos, limite de tempo, artefato e responsável pela triagem de cada etapa.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
