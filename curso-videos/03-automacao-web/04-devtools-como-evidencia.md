# 04 — DevTools como evidência

- **Tema:** Automação web
- **Capítulo:** 11 — Front-end e DevTools
- **Chave no produto:** `mentoria.v2.frontend-observabilidade`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/test-suite`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Relacione ação, request e mudança de estado. Ao final, a pessoa deve conseguir: **localizar estado, requisições e elementos antes de escrever um teste.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Quando o DevTools esclarece um problema e quando ele só adiciona ruído? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “O DevTools ajuda a observar console, rede, elementos e tempo. Ele não substitui a experiência da pessoa. Para investigar uma captura que parece não ter sido salva, começo reproduzindo o sintoma com o pensamento fictício. Depois relaciono o momento da ação com os sinais técnicos visíveis. Uma requisição com sucesso e um registro ausente na interface apontam hipóteses diferentes de uma falha de rede. Em ambos os casos, preciso de passos e estado final.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Abra o Broto com DevTools em rede e console. Limpe a lista, execute a captura do caso, saia e volte. Destaque o instante da ação, eventuais mensagens e o resultado visível. Borre URL sensível, headers, cookies e identificadores de conta no material de gravação.

**Fala:** “Eu anoto primeiro o que a pessoa percebe: o pensamento aparece ou não ao retornar. Só então olho a rede para ver se houve comunicação no momento esperado e se a resposta oferece sinal útil. Se o console mostra erro, copio apenas a parte técnica necessária e removo dados pessoais. Não digo 'o backend falhou' só porque vi um status; um erro pode vir de autenticação, conexão ou validação. Formulo uma hipótese testável, por exemplo repetir com estado inicial limpo e comparar os resultados.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Uma evidência bem montada tem linha do tempo, sinal técnico relevante e efeito de negócio. O time pode usar isso para investigar sem receber um arquivo enorme e sensível. Quando o DevTools não acrescenta informação, a sequência reproduzível da interface basta.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Investigue a retomada do pensamento do caso com DevTools. Entregue ação, horário relativo, resultado visível e no máximo um sinal técnico sanitizado, explicando o que ele permite concluir. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Investigue a retomada do pensamento do caso com DevTools. Entregue ação, horário relativo, resultado visível e no máximo um sinal técnico sanitizado, explicando o que ele permite concluir.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
