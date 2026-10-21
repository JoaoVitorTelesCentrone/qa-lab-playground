# 01 — Git, CI/CD e gates de qualidade

- **Tema:** CI/CD e operação
- **Capítulo:** 19 — Git, PR e pipeline
- **Chave no produto:** `mentoria.w09.l3`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/lab/cicd`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Revisão de mudanças, pipelines, matrizes, métricas e proteção de secrets. Ao final, a pessoa deve conseguir: **explicar o caminho da mudança até o feedback do time.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Como uma mudança no código da captura chega a uma decisão de publicação? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Git registra mudanças; um pull request torna a revisão visível; o pipeline executa verificações; um gate informa se uma condição importante foi atendida. Imagine uma alteração na captura do Broto. O risco não é apenas quebrar um componente, mas impedir que a pessoa retome seu pensamento. Por isso o fluxo de entrega precisa ligar uma alteração técnica a um sinal de produto. Um teste pode rodar em um repositório de treino, mas não afirmo que o CI real do Broto existe ou foi configurado por esta aula.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Desenhe branch, commit, pull request, checagens, revisão e release. Ao lado, mostre a jornada do pensamento no Broto e marque qual risco cada checagem poderia proteger. Use workflow de treino disponível no projeto para exemplificar a execução.

**Fala:** “Uma pessoa abre um pull request para alterar a captura. Primeiro rodam verificações rápidas, como lint e testes de unidade. Depois um smoke autorizado verifica se o pensamento sintético ainda pode ser salvo e reencontrado. O relatório do PR mostra sucesso ou falha com artefato útil. A revisão humana discute código e impacto. Só então o time decide publicar, considerando também cenários não cobertos. Se o smoke está indisponível por falta de ambiente, a evidência deve dizer isso; não marco a checagem como verde fictícia.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Gate é uma política vinculada a risco. Ele deve ser compreensível, confiável e rápido o bastante para ser usado. Se uma checagem falha, precisamos saber o que falhou e quem pode agir; bloquear sem diagnóstico só cria contorno manual.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Desenhe o caminho de uma mudança na captura do Broto até a release. Para cada gate proposto, indique risco protegido, artefato produzido e condição de bloqueio. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Desenhe o caminho de uma mudança na captura do Broto até a release. Para cada gate proposto, indique risco protegido, artefato produzido e condição de bloqueio.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
