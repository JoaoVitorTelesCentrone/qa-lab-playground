# 01 — API como produto

- **Tema:** APIs e confiabilidade da suíte
- **Capítulo:** 15 — HTTP, contrato e regra
- **Chave no produto:** `mentoria.w07.l1`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/api-docs`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

O que verificar alem do status 200. Ao final, a pessoa deve conseguir: **verificar efeitos e dados, não apenas o status da resposta.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Por que uma resposta 200 pode ainda representar falha para a pessoa usuária? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “No Broto, a necessidade humana é registrar e depois recuperar um pensamento com privacidade. Não temos contrato nem staging de API do Broto neste projeto. Para aprender HTTP e contrato, a execução técnica será na API Lab local. Nela, verificamos método, entrada, status, corpo e efeito persistido. Uma resposta 200 pode conter dados errados, omitir um campo importante ou não refletir a gravação esperada; o status é só um sinal.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Primeiro mostre no Broto a captura e a retomada do pensamento fictício como contexto de negócio. Depois abra `/api-docs` e a API Lab local. Execute uma operação válida e uma inválida documentadas pelo lab, mostrando URL local, status, corpo e consulta de confirmação.

**Fala:** “No lab, leio o contrato antes de enviar qualquer request. Depois da chamada válida, verifico se os dados de treino retornam com o conteúdo esperado e se uma leitura posterior confirma o efeito. Na inválida, observo se houve erro apropriado e ausência de mudança indevida. Se o corpo disser sucesso mas a leitura não encontrar o recurso, tenho um problema de negócio mesmo com status de sucesso. Este experimento ensina uma técnica que um dia pode ser aplicada ao Broto, mas o resultado obtido pertence somente à API Lab.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Na evidência, separo duas frases: 'Observei a jornada na interface do Broto' e 'Validei contrato na API Lab local'. Não vou publicar que a API do Broto passou sem ter endpoint, documentação, credenciais e autorização específicos.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Escolha uma operação documentada na API Lab. Registre entrada, status, corpo e efeito posterior; relacione a regra de negócio ao caso do Broto como hipótese, com origem claramente marcada. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Escolha uma operação documentada na API Lab. Registre entrada, status, corpo e efeito posterior; relacione a regra de negócio ao caso do Broto como hipótese, com origem claramente marcada.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
