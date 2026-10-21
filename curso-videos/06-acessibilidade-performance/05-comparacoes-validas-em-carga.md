# 05 — Comparações válidas em carga

- **Tema:** Acessibilidade e performance
- **Capítulo:** 25 — Execução com k6
- **Chave no produto:** `mentoria.v2.k6-execucao`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/mentoria/performance`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Mantenha cenário e ambiente comparáveis entre execuções. Ao final, a pessoa deve conseguir: **comparar baseline, rampa e pico sem trocar condições.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Quando dois resultados de k6 podem ser comparados de forma honesta? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Comparar baseline, rampa e pico exige manter constantes versão, máquina, dados, duração de medição e operação, salvo a variável que queremos estudar. Se um teste usa cache aquecido e outro não, a diferença pode não vir da carga. A consulta local de histórico é um modelo para a preocupação do Broto, mas a medição é da API Lab. Percentil de latência, throughput, taxa de erro e checks precisam ser lidos juntos.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre três resultados locais e uma tabela com condições de execução. Circule p95, p99, throughput, erros e checks. Se os resultados ainda não estiverem disponíveis, execute os perfis documentados em localhost e preencha a tabela com números reais, sem antecipar conclusões.

**Fala:** “Primeiro verifico se a operação e os dados eram os mesmos. Depois comparo o baseline com a rampa: se o p95 sobe, olho também erros e throughput. Um p95 baixo com muitos erros não significa boa performance; pode indicar respostas rápidas de falha. No pico, observo se a taxa de conclusão muda e se os checks continuam válidos. Se houver diferença, formulo uma hipótese como saturação, mas não a declaro causa sem CPU, memória ou outro sinal. Registro a configuração para repetir o experimento.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “A conclusão correta pode ser apenas 'neste computador e com este perfil, a latência aumentou'. Isso já orienta próximo passo, como instrumentar a API local. Não usamos esse número para anunciar capacidade de produção do Broto.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Compare três execuções locais de k6. Entregue condições, quatro métricas, uma conclusão limitada e um próximo experimento para testar sua hipótese. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Compare três execuções locais de k6. Entregue condições, quatro métricas, uma conclusão limitada e um próximo experimento para testar sua hipótese.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
