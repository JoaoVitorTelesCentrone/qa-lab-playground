# 02 — Contrato e dados

- **Tema:** APIs e confiabilidade da suíte
- **Capítulo:** 16 — Collection e dados
- **Chave no produto:** `mentoria.w07.l2`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/api-docs`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Requests reproduziveis e assertions de negocio. Ao final, a pessoa deve conseguir: **montar uma sequência reproduzível em Postman ou Bruno.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Como montar uma collection que qualquer colega consiga repetir? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Uma collection reproduzível define ambiente, ordem, dados e verificações. Vamos usar Postman ou Bruno contra a API Lab local, com textos sintéticos inspirados no pensamento de treino. A sequência é criar, ler, alterar se o contrato permitir, verificar e limpar. Em cada etapa valido campos, tipos e efeito, não só status. Variáveis de ambiente guardam identificadores transitórios; segredos não entram no arquivo versionado.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre a collection disponibilizada no API Playground e seu ambiente Local. Execute requests na ordem documentada. Destaque onde o identificador de um recurso criado passa para a leitura seguinte e onde os dados de treino são removidos ou reinicializados.

**Fala:** “Começo conferindo que o alvo aponta para localhost. Envio a entrada sintética e salvo o identificador retornado. Na leitura, comparo identificador e conteúdo esperado. Se houver alteração, verifico que o estado mudou e que um campo não relacionado foi preservado. Depois executo o caso inválido e confirmo que não houve efeito indesejado. Finalmente limpo ou reinicio a massa de treino. Se a segunda execução depender da primeira, a collection não está pronta; corrijo o preparo até ela ser repetível.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “O contrato documentado do lab define o esperado. O caso Broto apenas dá sentido à pergunta sobre autoria e persistência. Não transfiro os nomes de campos ou rotas do lab para o Broto, porque isso seria inventar a arquitetura do produto.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Execute a collection local com dados sintéticos. Entregue evidência de criação, leitura, uma falha esperada e limpeza, incluindo a configuração do ambiente sem segredos. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Execute a collection local com dados sintéticos. Entregue evidência de criação, leitura, uma falha esperada e limpeza, incluindo a configuração do ambiente sem segredos.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
