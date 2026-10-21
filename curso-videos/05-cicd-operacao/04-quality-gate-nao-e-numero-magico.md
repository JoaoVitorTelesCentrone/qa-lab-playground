# 04 — Quality gate não é número mágico

- **Tema:** CI/CD e operação
- **Capítulo:** 20 — Gates, secrets e artefatos
- **Chave no produto:** `mentoria.w10.l1`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/lab/cicd`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Gates alinhados a risco. Ao final, a pessoa deve conseguir: **bloquear falhas relevantes sem expor credenciais.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “O que deve bloquear uma release quando os números parecem bons? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Cobertura, taxa de testes verdes e tempo de pipeline ajudam, mas nenhum percentual responde sozinho se a jornada principal funciona. Suponha que noventa e nove verificações passem e o smoke de retomar o pensamento falhe. O risco central continua aberto. Inversamente, uma falha em teste instável precisa investigação antes de virar exceção permanente. Um quality gate deve declarar condição, risco, origem da evidência e exceção possível com responsável.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre um quadro com três sinais: smoke de captura, acessibilidade da tarefa e verificação de regra em lab local. Atribua a cada um impacto e política. Apresente um cenário fictício em que o smoke falha após mudança no histórico do Broto.

**Fala:** “Se o pensamento desaparece após retorno, eu recomendo segurar a publicação até entender a falha, porque a função central perde valor. Se a execução falhou por indisponibilidade do ambiente de teste, não a transformo em sucesso; registro ausência de sinal e proponho uma decisão condicionada. Se há uma questão visual pequena sem impedir a ação, o time pode avaliar exceção documentada. O gate, portanto, produz conversa informada: o que sabemos, qual risco aceitamos, quem acompanha e quando revisitamos.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Defino políticas simples e revisáveis, não metas arbitrárias de porcentagem. O critério deve acompanhar as mudanças do produto. Uma exceção precisa prazo e compensação; caso contrário, o gate deixa de sinalizar risco.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Crie três gates para a jornada do caso e uma situação de exceção. Em cada um, explique qual falha bloquearia a release e que evidência faltante mudaria sua decisão. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Crie três gates para a jornada do caso e uma situação de exceção. Em cada um, explique qual falha bloquearia a release e que evidência faltante mudaria sua decisão.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
