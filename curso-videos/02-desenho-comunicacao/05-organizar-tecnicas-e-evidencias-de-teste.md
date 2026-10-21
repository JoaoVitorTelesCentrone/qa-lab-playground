# 05 — Organizar técnicas e evidências de teste

- **Tema:** Desenho e comunicação de testes
- **Capítulo:** 08 — Defeito e evidência
- **Chave no produto:** `mentoria.w04.l3`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/playground/template-bug-report`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Tipos de teste, relatórios, registros, ferramentas e rastreabilidade. Ao final, a pessoa deve conseguir: **produzir um relato que outra pessoa consiga reproduzir.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Como provar o que foi coberto sem despejar capturas de tela? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Evidência boa responde a uma pergunta. Para a jornada do Broto, organizo cada teste por risco, técnica, dado, estado inicial, ação, observação e conclusão. Uma captura isolada não mostra o que aconteceu antes; um vídeo longo pode esconder o ponto relevante. Por isso combino passos curtos com uma imagem ou registro sanitizado do antes e depois. A origem importa: observação manual do Broto e execução no QA Lab devem aparecer como fontes diferentes.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre uma pasta de evidências do caso com nomes por data e cenário, sem dados pessoais. Abra uma ficha: risco 'perda do pensamento', técnica 'transição de estado', resultado 'retorno imediato observado' e limite 'outra sessão não exercitada'. No Broto, faça uma captura apenas do estado relevante.

**Fala:** “Vou relacionar a técnica ao risco. Escolhi transição de estado porque sair e voltar é onde o contexto pode sumir. O dado de treino é sintético e pode aparecer inteiro. Registro o caminho percorrido, o navegador e o resultado visível. Se o problema exigir DevTools, incluo somente informações técnicas necessárias, retirando cookies e tokens. Em seguida escrevo a conclusão em uma frase: 'Nesta conta e nesta sessão, o pensamento permaneceu acessível após retorno imediato'. Essa frase vale mais do que dez imagens sem contexto.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Rastreabilidade ajuda na revisão de release. Outra pessoa deve conseguir ver qual risco foi investigado, com qual técnica e que lacuna ficou. Não renomeio uma hipótese como fato nem uso evidência de laboratório local para afirmar que o Broto passou em um teste técnico que nunca recebeu.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Organize três evidências do caso no Broto em uma tabela de risco, técnica, ação, observado, origem e lacuna. Retire qualquer identificador pessoal antes de compartilhar. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Organize três evidências do caso no Broto em uma tabela de risco, técnica, ação, observado, origem e lacuna. Retire qualquer identificador pessoal antes de compartilhar.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
