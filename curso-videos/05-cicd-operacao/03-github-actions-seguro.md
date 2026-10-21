# 03 — GitHub Actions seguro

- **Tema:** CI/CD e operação
- **Capítulo:** 20 — Gates, secrets e artefatos
- **Chave no produto:** `mentoria.w09.l2`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/lab/cicd`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Secrets, artefatos e falhas uteis. Ao final, a pessoa deve conseguir: **bloquear falhas relevantes sem expor credenciais.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Como executar um smoke no CI sem vazar acesso nem texto pessoal? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Um workflow de GitHub Actions define quando executar, permissões, jobs, variáveis e artefatos. Para a jornada do Broto, só seria adequado rodar contra ambiente e conta explicitamente autorizados. Segredos ficam no gerenciador do CI, nunca no YAML, no log ou no trace. O caso usa textos fictícios. Pull requests externos não devem receber credenciais capazes de escrever em um produto real. Um workflow de treino pode demonstrar a estrutura sem conectar ao Broto.”

### 3:00–6:30 · Demonstração prática

**Na tela:** Abra um workflow de exemplo no repositório e destaque gatilho, permissões mínimas, instalação, comando de smoke, timeout e upload de artefato sanitizado. Mostre um diagrama da conta de estudo do Broto separada do ambiente local de treino.

**Fala:** “Primeiro escolho gatilho apropriado: checagens sem segredo no PR e smoke com credenciais somente em contexto protegido. Limito permissões do token do workflow. Preparo dados sintéticos e defino limpeza. Em falha, salvo um trace ou captura que não mostre e-mail nem token. Defino retenção curta e acesso restrito. Se ainda não existe staging do Broto autorizado, deixo o job de integração como proposta e demonstro a mecânica com o QA Lab; não coloco a produção pública como alvo por conveniência.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “Segurança aqui é parte da confiabilidade da evidência. Uma pipeline que expõe dados ou usa uma conta pessoal não está pronta para operar. O material precisa mostrar claramente qual execução foi real no lab e qual configuração depende de autorização do Broto.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Esboce um workflow para o smoke com gatilhos, permissões, segredo, timeout, artefatos e condição de execução protegida. Marque o que ainda falta para rodar no Broto. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Esboce um workflow para o smoke com gatilhos, permissões, segredo, timeout, artefatos e condição de execução protegida. Marque o que ainda falta para rodar no Broto.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
