# 05 — Primeiro teste executável

- **Tema:** Automação web
- **Capítulo:** 12 — Primeiro teste executável
- **Chave no produto:** `mentoria.w06.l1`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/test-suite`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Estrutura mínima e fluxo de trabalho. Ao final, a pessoa deve conseguir: **proteger uma jornada com preparação, ação e assertion de negócio.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Como escrever um smoke que falhe quando o valor central do Broto quebra? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “O primeiro teste executável precisa de estado conhecido e uma assertion de negócio. Usaremos uma conta de estudo e texto sintético identificável. O fluxo escolhido é registrar um pensamento e reencontrá-lo depois de sair da área de captura. Se o ambiente autorizado permitir automatizar também o vínculo com objetivo e a ação, ampliamos em outra etapa. Um teste que verifica apenas clique ou visibilidade de botão não protege o ciclo de valor.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre o Broto e, lado a lado, pseudocódigo do smoke. Marque preparar conta e dado, registrar pensamento, sair, voltar, localizar pelo conteúdo e confirmar estado. Se houver uma spec real em ambiente autorizado, execute-a e mostre o artefato de uma execução; caso contrário, trate o pseudocódigo como desenho, sem fingir resultado executado.

**Fala:** “No preparo, crio um identificador único para o texto de treino ou limpo os dados da conta de teste. Durante a ação, uso controles com nomes acessíveis, quando disponíveis. Para sincronizar, espero o resultado observável, não um número fixo de segundos. No fim, confiro que o conteúdo encontrado corresponde ao que salvei. Se falhar, guardo trace ou captura sanitizada e os passos para reproduzir. O teste deve poder rodar de novo sem confundir o registro novo com outro deixado por uma execução anterior.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Essa spec é um smoke, não uma prova de ausência de defeitos. Ela protege a jornada principal em uma condição declarada. Registre navegador, ambiente e origem dos dados; sem execução real, marque a spec como proposta e não como teste aprovado.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Escreva a spec ou pseudocódigo completo do smoke de captura e retomada. Execute apenas se houver conta e ambiente autorizados; anexe o resultado real ou marque a execução como pendente. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Escreva a spec ou pseudocódigo completo do smoke de captura e retomada. Execute apenas se houver conta e ambiente autorizados; anexe o resultado real ou marque a execução como pendente.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
