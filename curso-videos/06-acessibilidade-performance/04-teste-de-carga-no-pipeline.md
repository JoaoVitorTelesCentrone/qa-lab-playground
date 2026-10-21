# 04 — Teste de carga no pipeline

- **Tema:** Acessibilidade e performance
- **Capítulo:** 25 — Execução com k6
- **Chave no produto:** `mentoria.w11.l3`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/mentoria/performance`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Escolher smoke de performance, thresholds, ambiente e execução segura no CI. Ao final, a pessoa deve conseguir: **comparar baseline, rampa e pico sem trocar condições.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Que teste de performance cabe no CI e qual precisa de experimento separado? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “CI deve dar feedback rápido e estável. Um smoke de performance local pode verificar que uma operação responde corretamente e não regrediu drasticamente nas condições controladas do runner. Um teste de capacidade exige ambiente representativo, janela e análise mais profunda; não cabe disfarçado em todo pull request. Para o caso Broto, a consulta de histórico inspira o cenário, mas o alvo executado aqui continua sendo apenas a API local de treino.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre um workflow de exemplo com job de smoke local, timeout, thresholds moderados e artefato resumido. Ao lado, desenhe um experimento de capacidade fora do PR com baseline, rampa e pico. Destaque a URL localhost antes de qualquer comando.

**Fala:** “No smoke, preparo a API local, executo um perfil pequeno e falho quando checks de correção ou limite justificado não passam. Guardo resumo de latência, erros e condições do runner. Se o CI compartilhar máquina com outras tarefas, variações de tempo podem vir do ambiente; por isso escolho limites proporcionais e investigo mudanças antes de bloquear por ruído. O experimento de capacidade, por sua vez, compara perfis mais longos em condições controladas. Uma falha no smoke diz que o lab local merece atenção, não que o Broto em produção esteja lento.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Separar os dois objetivos evita gates arbitrários. O pipeline pode detectar regressões grosseiras de forma barata; capacidade requer projeto experimental. Ambos devem identificar alvo e condições em cada relatório.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Desenhe um job de smoke de performance para API local e um plano separado de capacidade. Inclua gatilho, alvo, checks, thresholds e artefato. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Desenhe um job de smoke de performance para API local e um plano separado de capacidade. Inclua gatilho, alvo, checks, thresholds e artefato.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
