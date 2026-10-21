# 02 — Camadas, AAA e estratégia de automação

- **Tema:** Automação web
- **Capítulo:** 10 — Estratégia e camadas
- **Chave no produto:** `mentoria.w05.l3`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/cursos/cypress`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Quando automatizar e distribuir cobertura entre unidade, integração e E2E. Ao final, a pessoa deve conseguir: **escolher o que automatizar e onde o sinal será mais barato.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Em qual camada testar a mesma regra sem duplicar trabalho? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Uma regra pode aparecer em unidade, integração, contrato ou ponta a ponta. A estrutura AAA ajuda a manter o teste claro: preparar estado, executar ação, verificar resultado. Para a retomada do pensamento no Broto, o teste web completo é valioso como smoke, mas tende a ser mais lento e sensível ao ambiente. Regras de persistência e permissão, quando houver acesso ao código e a um contrato real, podem receber testes em camadas inferiores. Aqui não presumimos acesso à API do Broto.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre uma pirâmide de camadas e a ficha do smoke do caso. Na tela do Broto, evidencie o comportamento de salvar e retomar. Em um quadro, escreva Arrange: conta e pensamento sintético; Act: salvar e voltar; Assert: texto reencontrado.

**Fala:** “No Arrange, preparo estado conhecido e evito depender de uma aula anterior. No Act, faço uma ação que a pessoa realmente faria. No Assert, verifico o efeito observável: o pensamento aparece com conteúdo correto. Se a implementação tiver um teste de unidade para uma regra de tamanho de texto, ele ajuda a localizar a falha; não substitui a prova de que a jornada funciona na interface. E o contrário também vale: um smoke web não deve carregar todas as combinações de limite que uma camada mais barata verifica melhor.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “A estratégia mínima é um smoke de valor, alguns testes de regra na camada disponível e exploração humana para compreensão e variações raras. Anoto dependências: conta autorizada, reset de dados e observabilidade de falhas. Sem esses itens, uma automação pode produzir mais ruído que confiança.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Desenhe AAA para o caso e justifique em que camada colocaria o smoke e duas regras adicionais. Marque o que depende de acesso técnico ainda não disponível. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Desenhe AAA para o caso e justifique em que camada colocaria o smoke e duas regras adicionais. Marque o que depende de acesso técnico ainda não disponível.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
