# 06 — Rollback e feature flag

- **Tema:** CI/CD e operação
- **Capítulo:** 22 — Contenção e rollback
- **Chave no produto:** `mentoria.w10.l2`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/lab/logs`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Como reduzir custo de uma decisao errada. Ao final, a pessoa deve conseguir: **escolher uma resposta proporcional ao impacto.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Quando corrigir, reverter ou desativar uma mudança no crescimento exibido? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Uma regressão de crescimento pode ter impacto diferente conforme a causa. Se ações estão preservadas mas a visualização está errada, talvez uma feature flag permita desativar a nova visualização. Se a gravação de dados falha, pode ser necessário reverter a release e tratar recuperação. Rollback não desfaz automaticamente dados já escritos; por isso a decisão precisa de linha do tempo, impacto e plano de validação. Não pressupomos que o Broto tenha uma flag real: este é um exercício de resposta.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre o histórico do caso fictício no Broto e uma árvore de decisão com sintomas: apresentação, atraso ou perda. No lab de incidente, destaque os sinais que sustentariam cada ramo e o plano de verificação após contenção.

**Fala:** “Primeiro pergunto se a pessoa ainda consegue reencontrar pensamento, objetivo e ação. Se sim, e apenas a visualização nova diverge, conter por flag pode reduzir impacto enquanto investigamos. Se os registros somem ou são alterados, a resposta exige bloquear escrita problemática, avaliar integridade e acionar responsáveis. Para rollback, confirmo compatibilidade da versão anterior com dados já produzidos. Depois de qualquer contenção, repito a jornada de treino e monitoro os sinais. Comunico o que foi afetado e o que ainda não sabemos.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “A escolha é proporcional ao impacto e reversibilidade. Não apresento um comando hipotético como ação aplicada no Broto. O entregável é um plano com gatilho, responsável, verificação e condição de encerramento.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Escreva um plano de contenção para histórico incorreto no caso: sintomas, critérios para flag ou rollback, checagem pós-ação e mensagem curta para o time. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Escreva um plano de contenção para histórico incorreto no caso: sintomas, critérios para flag ou rollback, checagem pós-ação e mensagem curta para o time.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
