# 03 — API, contrato e controle de acesso

- **Tema:** APIs e confiabilidade da suíte
- **Capítulo:** 17 — Autenticação e autorização
- **Chave no produto:** `mentoria.w07.l3`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/api-docs`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Back-end, OpenAPI, ferramentas de API, papéis e autorização. Ao final, a pessoa deve conseguir: **distinguir identidade, papel e acesso a um objeto.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Quem pode ver ou alterar um pensamento registrado por outra pessoa? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Autenticação responde quem está fazendo a requisição; autorização responde se essa identidade pode agir sobre este objeto. Em um produto com pensamentos pessoais, confundir as duas expõe informação sensível. O Broto é o contexto de risco, mas não temos sua API disponível para teste. Na API Lab local, verificamos os contratos de autenticação e acesso documentados, incluindo uma operação sem token e o comportamento de erro esperado.”

### 3:00–6:30 · Demonstração prática

**Na tela:** No Broto, mostre apenas o pensamento da conta de estudo, sem dados pessoais. No quadro, desenhe identidade A, identidade B e um objeto fictício. Na API Lab, execute a operação autorizada e repita o cenário negativo documentado, ocultando tokens no vídeo.

**Fala:** “Primeiro confirmo o sucesso com credencial de treino correta. Depois removo o token no ambiente local e repito. Espero a resposta indicada pelo contrato, por exemplo 401 para falta de autenticação, e verifico que o objeto não mudou. Para autorização entre pessoas, só executo se o lab oferecer identidades e regras próprias; não invento esse resultado. A pergunta de produto para o Broto é clara: um pensamento deve continuar restrito à pessoa certa? Para afirmar que a API do Broto respeita isso, seria preciso staging autorizado e contrato real.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “No relatório escrevo qual barreira foi observada no lab, que efeito não aconteceu e o que continua como hipótese para o Broto. Status sem checar efeito pode esconder alteração indevida. E jamais mostro token, cookie ou conteúdo pessoal numa captura de evidência.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Na API Lab, documente uma operação com token e outra sem token, incluindo status, corpo e ausência ou presença de efeito. Separe a hipótese de privacidade do Broto do resultado do lab. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Na API Lab, documente uma operação com token e outra sem token, incluindo status, corpo e ausência ou presença de efeito. Separe a hipótese de privacidade do Broto do resultado do lab.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
