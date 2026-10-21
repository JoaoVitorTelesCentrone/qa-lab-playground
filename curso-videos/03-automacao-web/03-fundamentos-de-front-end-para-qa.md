# 03 — Fundamentos de front-end para QA

- **Tema:** Automação web
- **Capítulo:** 11 — Front-end e DevTools
- **Chave no produto:** `mentoria.w06.l3`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/test-suite`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

HTML, CSS, JavaScript, DevTools, responsividade e frameworks. Ao final, a pessoa deve conseguir: **localizar estado, requisições e elementos antes de escrever um teste.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “O que acontece entre digitar um pensamento e vê-lo de volta na tela? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “A interface tem estado local, elementos acessíveis, eventos e possivelmente uma troca com serviço. Como QA, não preciso adivinhar a implementação para investigá-la. Distingo valor digitado, confirmação exibida e estado encontrado após sair e voltar. Se o texto permanece só enquanto a página está aberta, a experiência pode parecer correta até a retomada. HTML semântico e nomes acessíveis também tornam a tarefa mais compreensível e a automação mais robusta.”

### 3:00–6:30 · Demonstração prática

**Na tela:** No Broto, mostre o campo usado para o pensamento do caso. Inspecione no DevTools o elemento focado, o texto visível e o estado depois de navegar e retornar. Oculte cookies e cabeçalhos sensíveis antes de gravar.

**Fala:** “Enquanto digito, a tela pode mostrar o texto antes de qualquer salvamento. Por isso observo se existe uma ação de concluir, um feedback e um estado estável após retorno. No inspetor, verifico se o controle tem um nome que uma pessoa com tecnologia assistiva entenderia; não escolho um seletor por classe CSS aleatória. Se houver requisição na rede, posso correlacionar horário e resposta, mas a presença de uma resposta não prova sozinha que o texto foi persistido ou está acessível depois. O teste de negócio continua sendo reencontrar o conteúdo no fluxo permitido.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “O modelo mental útil é: entrada, evento, feedback, estado posterior. Essa sequência ajuda a localizar onde a falha apareceu sem afirmar uma causa técnica antes da evidência. Também mostra por que um teste que clica e encerra imediatamente perde regressões de persistência.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Mapeie entrada, evento, feedback e estado posterior do pensamento de treino no Broto. Registre dois elementos da interface que poderiam servir como seletores por intenção. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Mapeie entrada, evento, feedback e estado posterior do pensamento de treino no Broto. Registre dois elementos da interface que poderiam servir como seletores por intenção.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
