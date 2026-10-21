# 05 — Monitoramento e segurança na operação

- **Tema:** CI/CD e operação
- **Capítulo:** 21 — Logs e triagem
- **Chave no produto:** `mentoria.w10.l3`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/lab/logs`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Logs, telemetria, vulnerabilidades, políticas e contenção. Ao final, a pessoa deve conseguir: **correlacionar um sintoma a eventos e hipóteses.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Como investigar um relato de histórico incorreto sem ler pensamentos pessoais? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Após uma release, o time pode receber relatos de que ações concluídas não aparecem no crescimento do Broto. Precisamos correlacionar versão, horário, evento técnico e estado visível, preservando privacidade. Logs devem usar identificadores técnicos sanitizados e sinais agregados; o conteúdo de pensamento e objetivo não precisa aparecer. A operação começa por confirmar o sintoma e medir alcance, não por atribuir culpa ao banco de dados.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre o caso fictício no Broto e uma linha do tempo hipotética da release. Depois, no lab de incidente, use logs de treino com versão, request e horário. Separe em cores observação no Broto, sinal do lab e hipótese operacional.

**Fala:** “Registro que a ação de treino foi concluída e comparo o histórico apresentado. Se há divergência, marco hora e versão da interface. No lab, uma trilha de requests ensina a correlacionar eventos sem expor texto pessoal; ela não prova a causa no Broto. Minha hipótese pode ser atraso de atualização, erro de regra, persistência ou apresentação. Procuro uma evidência que diferencie essas alternativas, como a mesma conta em nova sessão e o estado exibido. Nunca copio o pensamento da pessoa para o log ou para o ticket.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “O relatório operacional deve permitir triagem, contenção e comunicação. Se há risco de perda de dados, a prioridade aumenta. Se é apenas atraso visual confirmado, a resposta pode ser diferente, mas ainda precisamos dizer à pessoa o que esperar.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Monte uma linha do tempo de incidente fictício no histórico do caso. Liste três sinais técnicos seguros, duas hipóteses e a evidência necessária para distinguir entre elas. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Monte uma linha do tempo de incidente fictício no histórico do caso. Liste três sinais técnicos seguros, duas hipóteses e a evidência necessária para distinguir entre elas.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
