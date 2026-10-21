# 02 — Técnicas que economizam tempo

- **Tema:** Desenho e comunicação de testes
- **Capítulo:** 06 — Classes e limites
- **Chave no produto:** `mentoria.w03.l1`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/lab/criterios`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Como ampliar cobertura sem escrever centenas de casos. Ao final, a pessoa deve conseguir: **reduzir casos redundantes sem perder bordas importantes.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Como reduzir casos repetidos sem deixar os limites perigosos de fora? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Partição de equivalência agrupa entradas com comportamento esperado semelhante; valor limite investiga a borda onde esse comportamento pode mudar. Na captura do Broto, podemos pensar em texto vazio, texto usual e texto longo. Mas não vou declarar um limite numérico sem documentação. Se houver um limite confirmado, testo logo abaixo, no limite e logo acima. Se não houver, trato a descoberta do limite como investigação, não como caso com resultado já sabido.”

### 3:00–6:30 · Demonstração prática

**Na tela:** No quadro, desenhe três classes para o texto do pensamento: vazio, usual e longo. No Broto, use o texto fictício usual e observe o retorno. Para outras classes, prepare versões sintéticas e mostre como documentar resultado sem concluir a regra antes da evidência.

**Fala:** “Começo pela classe usual porque protege a jornada de valor: escrever e reencontrar. Para vazio, pergunto se a interface impede uma entrada sem sentido e como comunica isso. Para texto longo, pergunto se há truncamento, mensagem ou perda silenciosa. Caso o campo aceite uma quantidade definida de caracteres, os três valores de borda testam um tipo de risco que um texto aleatório raramente encontra. Ao selecionar um representante por classe, ganho tempo para cobrir também a passagem do pensamento ao objetivo, em vez de repetir dez textos comuns.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “A técnica não substitui julgamento. Uma entrada sensível ou uma sessão interrompida pode merecer caso próprio mesmo que pertença à mesma classe de tamanho. Registro que classes escolhi, que regra as define e por que o conjunto é suficiente para esta rodada.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Escolha um campo ou estado do caso no Broto. Monte classes normal, inválida e de borda; execute a normal e indique quais resultados das outras dependem de regra a confirmar. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Escolha um campo ou estado do caso no Broto. Monte classes normal, inválida e de borda; execute a normal e indique quais resultados das outras dependem de regra a confirmar.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
