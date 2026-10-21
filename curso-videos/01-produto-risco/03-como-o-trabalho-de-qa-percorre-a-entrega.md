# 03 — Como o trabalho de QA percorre a entrega

- **Tema:** Produto, risco e exploração
- **Capítulo:** 02 — Regras, estados e riscos
- **Chave no produto:** `mentoria.w02.l3`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/playground/expenseflow`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Cascata, métodos ágeis, eventos de equipe, gargalos e compatibilidade. Ao final, a pessoa deve conseguir: **separar regra conhecida, hipótese e risco que merece teste.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Em que momento o QA ajuda quando uma mudança na captura ainda nem foi programada? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Qualidade percorre a entrega inteira. Antes da implementação, ajudamos a esclarecer a jornada e o impacto de perder contexto. Durante o desenvolvimento, transformamos a regra em exemplos verificáveis. No pull request, buscamos feedback rápido. Depois da publicação, observamos sinais de regressão e ouvimos relatos. No caso do Broto, uma mudança pequena na captura pode afetar a retomada e o histórico. Se só olharmos para a tela alterada, perderemos esse encadeamento.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Desenhe uma linha com descoberta, desenho, implementação, revisão, publicação e operação. Use o pensamento de treino no Broto como exemplo. Ao lado de cada etapa, anote um artefato: pergunta de produto, cenário, teste, evidência de execução, decisão de release e sinal de operação.

**Fala:** “Na descoberta pergunto se sair e voltar deve preservar o texto. No desenho proponho o exemplo: dado um pensamento salvo, quando a pessoa retorna, então o encontra com o mesmo conteúdo. Na implementação verifico a mudança em conta de estudo. Na revisão relato entrada, ação e resultado; não apenas 'passou'. Na publicação comparo o risco coberto com o risco residual. Na operação, um aumento de relatos de perda de registro indicaria investigação. Cada etapa usa a mesma história, mas responde a uma pergunta diferente.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “A participação de QA não significa aprovar tudo sozinho. O time define a regra e a decisão de negócio; QA fornece informação confiável sobre consequências e lacunas. Se a regra de retomada não estiver definida, a saída correta é levar a pergunta cedo, não criar um teste que congele uma suposição.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Monte a linha de entrega da jornada de captura do Broto. Produza uma pergunta, um cenário verificável e um sinal que procuraria depois da publicação. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Monte a linha de entrega da jornada de captura do Broto. Produza uma pergunta, um cenário verificável e um sinal que procuraria depois da publicação.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
