# 01 — O que vale automatizar

- **Tema:** Automação web
- **Capítulo:** 10 — Estratégia e camadas
- **Chave no produto:** `mentoria.w05.l1`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/cursos/cypress`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Piramide, risco e retorno. Ao final, a pessoa deve conseguir: **escolher o que automatizar e onde o sinal será mais barato.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Qual parte da jornada do Broto merece o primeiro teste automático? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Automatizar custa criar, executar, diagnosticar e manter. Escolho pelo risco e pela repetição, não pelo fascínio de clicar sozinho. Capturar e reencontrar um pensamento é uma candidata forte: é frequente, central e o resultado pode ser visto. Já avaliar se a linguagem do histórico transmite motivação pode continuar exploratório, porque exige julgamento humano. A estabilidade da interface e a disponibilidade de uma conta de teste também entram na decisão.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Abra a jornada do caso no Broto e desenhe uma tabela com captura, retomada, conexão com objetivo, ação e crescimento. Pontue impacto, frequência, estabilidade, custo e camada sugerida. Circule a candidata 'salvar e reencontrar o pensamento'.

**Fala:** “Para a candidata escolhida, defino o sinal de falha: após registrar o texto fictício, a pessoa não consegue encontrá-lo ao voltar. Esse é um resultado de negócio, mais útil que conferir somente se um botão respondeu. Uma validação de regra isolada poderia estar em camada mais barata, caso o time disponha do código e contrato. Um smoke web cobre a integração visível. Não automatizo dez variações antes de ter uma que rode de forma repetível com dados próprios e ambiente autorizado.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Registro também dois casos que ficarão manuais nesta etapa: clareza da navegação em tela pequena e compreensão do progresso. Não é abandono; é uma escolha explícita. Se um teste automático começa a falhar por mudanças cosméticas sem revelar risco de produto, revisamos seu desenho.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Monte a matriz de cinco jornadas do Broto e escolha um smoke, dois candidatos futuros e dois cenários exploratórios, justificando cada decisão. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Monte a matriz de cinco jornadas do Broto e escolha um smoke, dois candidatos futuros e dois cenários exploratórios, justificando cada decisão.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
