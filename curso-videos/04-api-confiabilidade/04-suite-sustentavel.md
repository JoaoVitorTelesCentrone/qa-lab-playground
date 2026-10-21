# 04 — Suíte sustentável

- **Tema:** APIs e confiabilidade da suíte
- **Capítulo:** 18 — Arquitetura e flakiness
- **Chave no produto:** `mentoria.w08.l1`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/labs/waits`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Abstração, isolamento e manutenção. Ao final, a pessoa deve conseguir: **diagnosticar se a falha vem do produto, do teste ou do ambiente.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Como manter a suíte confiável quando o produto e os testes crescem? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Uma suíte sustentável tem testes independentes, dados próprios, assertions claras e falhas fáceis de diagnosticar. Imagine três verificações do caso Broto: captura, retomada e ação. Se a segunda depende de uma ordem oculta, uma falha na primeira gera ruído em cascata. Se todas usam o mesmo registro, execuções paralelas brigam pelo estado. Prefiro fixtures controladas e uma fronteira clara entre preparo e verificação.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre um desenho de três testes com dados compartilhados e depois com dados isolados. Se houver automação autorizada do Broto, mostre a spec do smoke. Caso contrário, use a suíte equivalente do QA Lab para demonstrar a mudança técnica, sem dizer que ela foi executada no Broto.

**Fala:** “Em cada teste, preparo o estado necessário, executo a ação e verifico um resultado de negócio. Nomeio o cenário pelo comportamento protegido, não pelo número de cliques. Quando falha, o artefato precisa mostrar dado usado, etapa e estado final. Extraio código comum só quando realmente reduz duplicação sem esconder a assertion. Uma função chamada 'fazerTudo' dificultaria ver se o pensamento foi salvo ou se a ação foi criada. Essa arquitetura diminui o custo de manutenção e preserva o motivo do teste.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Avalio a suíte por sinal útil, tempo de feedback e custo de diagnóstico. Uma suíte verde sem assertion de negócio não dá confiança; uma suíte vermelha por dados compartilhados consome energia do time. A correção deve preservar o risco protegido.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Revise o desenho de três testes do caso e identifique dependência de ordem, dado compartilhado e assertion fraca. Proponha uma estrutura independente para cada um. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Revise o desenho de três testes do caso e identifique dependência de ordem, dado compartilhado e assertion fraca. Proponha uma estrutura independente para cada um.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
