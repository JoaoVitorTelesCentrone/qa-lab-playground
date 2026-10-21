# 06 — Ler métricas e definir thresholds

- **Tema:** Acessibilidade e performance
- **Capítulo:** 26 — Métricas e thresholds
- **Chave no produto:** `mentoria.w11.l2`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/mentoria/performance`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Interpretar p95, p99, throughput e erros para decidir. Ao final, a pessoa deve conseguir: **interpretar latência, throughput e erros sem conclusão precipitada.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Que limite de performance sinaliza problema sem virar número mágico? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Threshold é uma condição previamente combinada para decidir se um cenário atende ao objetivo. Na API local, definimos limites a partir de baseline, necessidade da tarefa e variabilidade do ambiente. Para uma revisita de histórico, latência importa porque a pessoa quer entender o próprio progresso, mas correção e taxa de erro importam tanto quanto velocidade. Um limite de p95 isolado pode esconder falhas; checks e erros precisam acompanhar.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre o relatório local com p50, p95, p99, throughput, erros e checks. Anote um threshold proposto e a justificativa ao lado; evite usar um número pronto como se fosse requisito do Broto. Simule o que aconteceria com uma execução que passa em latência mas falha em correção.

**Fala:** “Leio o p95 como tempo abaixo do qual ficaram noventa e cinco por cento das respostas medidas; não como o tempo de todas. Vejo se o p99 indica cauda longa e se a taxa de erro muda com carga. Se checks de conteúdo falham, o cenário não está saudável mesmo com latência baixa. Para escolher limite, comparo várias baselines locais e documento máquina, versão e perfil. Um threshold muito apertado em runner compartilhado gera ruído; um amplo demais deixa passar regressão. Ajustes devem ser registrados com motivo, nunca feitos só para deixar a pipeline verde.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “O threshold vale para o cenário e ambiente declarados. Ele não é promessa de experiência para todos os usuários do Broto. Se a equipe quiser um limite real para o produto, precisará de SLO, ambiente e dados de uso apropriados.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Proponha thresholds para p95, erros e checks da API local com base em medições próprias. Explique que decisão cada um apoiaria e quais limitações do runner permanecem. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Proponha thresholds para p95, erros e checks da API local com base em medições próprias. Explique que decisão cada um apoiaria e quais limitações do runner permanecem.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
