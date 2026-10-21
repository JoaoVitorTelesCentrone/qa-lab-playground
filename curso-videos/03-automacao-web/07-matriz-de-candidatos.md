# 07 — Matriz de candidatos

- **Tema:** Automação web
- **Capítulo:** 14 — Dados e suíte sustentável
- **Chave no produto:** `mentoria.w05.l2`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/test-suite`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Como tomar a decisao sem automatizar por moda. Ao final, a pessoa deve conseguir: **evitar dependência entre testes e preservar o valor do smoke.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Que conjunto pequeno de automações traria sinal rápido para o time do Broto? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Agora consolidamos uma matriz de candidatos. Não basta escrever 'automatizar captura'. Para cada fluxo, registro risco protegido, frequência de uso, estabilidade, dados necessários, camada e custo esperado de manutenção. O caso oferece pelo menos cinco candidatos: registrar pensamento, retomá-lo, associá-lo ao objetivo, criar ação e consultar crescimento. A matriz deve terminar com decisões, não só pontuações.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Preencha a matriz na tela enquanto mostra brevemente cada etapa disponível do caso no Broto. Marque um smoke de captura e retomada, duas regressões futuras e dois cenários de exploração humana. Onde não houver acesso técnico, assinale dependência em vez de inventar implementação.

**Fala:** “Captura e retomada recebem prioridade alta porque a perda de contexto compromete a confiança. Conexão com objetivo também é central, mas talvez dependa de estado preparado mais difícil. Visualização de crescimento pode exigir dados de vários dias; nesse caso, uma verificação de regra em camada inferior seria melhor se o time tiver código. Clareza da linguagem e sensação de progresso ficam em sessões exploratórias. A decisão combina valor e viabilidade, e pode mudar quando o produto ou o ambiente de testes evoluir.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Escolho uma automação que o time consiga manter e entender. Para cada candidata adiada, escrevo a condição que permitiria retomá-la, como fixture estável ou conta dedicada. Isso impede que 'não agora' vire esquecimento.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Entregue a matriz dos cinco fluxos com decisão, camada, risco e condição de implementação. Defenda o primeiro smoke em três frases. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Entregue a matriz dos cinco fluxos com decisão, camada, risco e condição de implementação. Defenda o primeiro smoke em três frases.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
