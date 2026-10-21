# 03 — Checklist de cenários

- **Tema:** Desenho e comunicação de testes
- **Capítulo:** 07 — Estados e tabelas de decisão
- **Chave no produto:** `mentoria.w03.l2`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/lab/criterios`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Modelo para revisar uma cobertura. Ao final, a pessoa deve conseguir: **cobrir transições e combinações que mudam o resultado.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Como uma lista de cenários pode revelar transições que esquecemos? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “O caso do Broto passa por estados: pensamento registrado, revisitado, relacionado ao problema ou objetivo e convertido em próximo passo, quando esses recursos estiverem disponíveis. Um checklist útil cobre criação, retorno, atualização, erro e ligação entre estados. Ele também distingue caso positivo, negativo e de borda. Não é uma lista de cliques; cada linha precisa proteger uma regra ou um risco e ter resultado observável.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Desenhe um mapa de estados do caso. Ao lado, crie colunas cenário, pré-condição, ação, esperado, fonte e prioridade. No Broto, execute o cenário de registrar e retomar o pensamento e marque apenas o resultado que realmente observou.

**Fala:** “Primeira linha: pensamento novo, salvar e reencontrar. Segunda: voltar ao registro antes de definir um objetivo. Terceira: tentar avançar com um campo vazio, se essa operação existir. Quarta: relacionar pensamento e objetivo. Quinta: revisitar depois da ação. Sexta: encontrar o texto em viewport pequeno. Para cada uma, pergunto o que seria um resultado verificável e se tenho a regra. A tabela mostra uma lacuna importante: se o vínculo com o objetivo não está definido, preciso confirmar o comportamento antes de automatizar.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Priorizo primeiro os estados que podem causar perda ou confusão permanente. Deixo variações cosméticas depois, a menos que impeçam a tarefa. Um checklist é completo quando permite uma decisão proporcional ao risco, não quando contém todos os cliques imagináveis.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Entregue seis cenários da jornada do caso no Broto, incluindo criação, retorno, um negativo e uma borda. Marque fonte da regra e prioridade. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Entregue seis cenários da jornada do caso no Broto, incluindo criação, retorno, um negativo e uma borda. Marque fonte da regra e prioridade.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
