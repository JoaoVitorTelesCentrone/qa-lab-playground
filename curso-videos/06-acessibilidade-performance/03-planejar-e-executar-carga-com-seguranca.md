# 03 — Planejar e executar carga com segurança

- **Tema:** Acessibilidade e performance
- **Capítulo:** 24 — Modelo de carga e segurança
- **Chave no produto:** `mentoria.w11.l1`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/mentoria/performance`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Modelo de uso, baseline, carga gradual e pico controlado. Ao final, a pessoa deve conseguir: **definir alvo permitido e cenário antes de executar.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Como avaliar aumento de demanda sem transformar o teste em risco para o produto? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “A motivação vem do Broto: muitas pessoas podem voltar ao histórico de crescimento em pouco tempo. O experimento de carga, porém, será feito somente na API de treino local. Antes de rodar k6, definimos alvo, operação, volume, duração, dados sintéticos, métricas e limite de parada. Produção e serviços de terceiros não são alvos desta aula. O resultado local ensina leitura de performance; não mede capacidade do Broto.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Mostre o histórico do caso como contexto, depois o plano de carga com alvo localhost e a confirmação local exigida pelo runner. Apresente três perfis curtos: baseline, rampa e pico controlado. Execute apenas o perfil documentado do API Playground local.

**Fala:** “Escolho uma consulta de treino equivalente a revisitar histórico. Defino resposta correta, usuários virtuais, duração curta e o que registrarei: latência por percentil, erros, throughput e checks. Antes de iniciar confirmo que a URL é loopback e que a aplicação local está pronta. Durante a execução observo se o sistema responde corretamente, não só rápido. Se erros sobem ou a máquina fica saturada, interrompo e registro a condição. Depois salvo configuração e resultado, para que a comparação seja reproduzível.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Um teste de carga sem perfil claro não produz decisão. A máquina local, os dados e a duração limitam a conclusão. Não extrapolo o número de usuários suportados pelo Broto a partir do lab.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Escreva um plano para baseline, rampa e pico na API local, com alvo loopback, volume, duração, checks, métricas e condição de parada. Execute somente o cenário permitido pelo lab. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Escreva um plano para baseline, rampa e pico na API local, com alvo loopback, volume, duração, checks, métricas e condição de parada. Execute somente o cenário permitido pelo lab.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
