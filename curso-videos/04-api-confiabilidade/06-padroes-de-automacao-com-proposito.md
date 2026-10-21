# 06 — Padrões de automação com propósito

- **Tema:** APIs e confiabilidade da suíte
- **Capítulo:** 18 — Arquitetura e flakiness
- **Chave no produto:** `mentoria.w08.l3`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/labs/waits`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Page Objects, custom commands, Builder e limites de abstração. Ao final, a pessoa deve conseguir: **diagnosticar se a falha vem do produto, do teste ou do ambiente.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Quando um page object ou builder ajuda e quando ele esconde o teste? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Padrões de automação servem para reduzir acoplamento e explicar a intenção. Um page object pode reunir interações estáveis da captura; um builder pode criar pensamento sintético e objetivo de treino. Mas abstração excessiva esconde o que o teste protege. No smoke do Broto, a leitura deve continuar evidente: registrar o pensamento, voltar e encontrá-lo. A assertion de negócio não desaparece dentro de uma função genérica.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre duas versões de pseudocódigo do mesmo smoke: uma longa com detalhes repetidos e outra que usa funções nomeadas por tarefa. Sublinhe a linha que confirma o conteúdo após retorno. Demonstre na interface do Broto qual ação cada função representa.

**Fala:** “Extraio 'registrar pensamento de treino' quando vários testes repetem a mesma interação. Faço o builder gerar texto seguro e identificável para cada execução. Não crio um método 'testar Broto' que clica, espera e verifica sem expor nada ao leitor. Se a interface mudar, atualizo um ponto comum; se a regra mudar, consigo localizar as assertions afetadas. Com dados isolados, a suíte também pode rodar em paralelo com menos interferência.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Escolho o menor padrão que resolve um problema observado. Antes de abstrair, pergunto se o nome revela a intenção, se a falha ainda indica a etapa e se o comportamento de negócio está visível na spec. Se a resposta for não, simplifico.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Refatore um pseudoteste do caso usando uma função de interação e um builder de dados. Mantenha explícita a assertion de retomada e explique qual duplicação foi removida. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Refatore um pseudoteste do caso usando uma função de interação e um builder de dados. Mantenha explícita a assertion de retomada e explique qual duplicação foi removida.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
