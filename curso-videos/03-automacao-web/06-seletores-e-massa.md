# 06 — Seletores e massa

- **Tema:** Automação web
- **Capítulo:** 13 — Seletores e sincronia
- **Chave no produto:** `mentoria.w06.l2`
- **Duração planejada:** 9:00; **máximo publicado:** 10:00.
- **Estado:** roteiro pronto para gravação; duração real e URL pendentes.
- **Referência de prática do capítulo:** `/labs/waits`. A cena a gravar está no roteiro abaixo.

## Resultado da aula

Como reduzir flakiness desde o primeiro teste. Ao final, a pessoa deve conseguir: **esperar pelo estado certo sem pausas fixas.**

## Roteiro integral para gravação

**Duração alvo:** até 9:00, incluindo operações de tela e pausas de observação. **Teto absoluto:** 10:00. Os textos entre aspas são falas; as instruções de tela não são narradas.

### 0:00–1:30 · Pergunta e contexto

**Na tela:** Título da aula e jornada do caso fictício.

**Fala:** “Por que um smoke pode passar hoje e quebrar amanhã sem mudança de negócio? Uma pessoa quer estudar QA com constância. Registra o pensamento fictício 'Quero estudar QA com constância, mas abro várias coisas ao mesmo tempo'; associa o problema 'Adio a revisão porque não escolho um assunto pequeno'; define o objetivo 'Revisar um fundamento de QA por 20 minutos em três dias' e o próximo passo 'Escolher um risco e escrever três perguntas de teste'. Hoje vamos usar essa jornada para responder uma pergunta específica e produzir uma evidência que outra pessoa consiga revisar.”

### 1:30–3:00 · Conceito

**Na tela:** Quadro de conceito com os termos destacados durante a fala.

**Fala:** “Seletores baseados em posição ou classe visual costumam quebrar com refatoração de layout. Prefiro papel, nome acessível e texto de resultado quando esses identificam a intenção. Massa de dados também precisa de isolamento: se todos os testes usam o mesmo pensamento e a mesma conta, uma execução pode interferir na outra. A sincronização deve esperar o estado que importa, como registro disponível após retorno, em vez de dormir por cinco segundos.”

### 3:00–6:30 · Demonstração prática

**Na tela:** No Broto, inspecione o controle de captura e o resultado de consulta do caso. Compare um seletor frágil por posição com um por nome sem afirmar um rótulo específico que possa mudar. Mostre um identificador de execução acrescentado ao texto fictício, sem dados pessoais.

**Fala:** “Primeiro localizo o campo pela função que ele cumpre, verificando nome acessível na versão atual. Depois preparo texto sintético único. Salvo, navego e espero a condição de negócio: o registro com aquele texto estar visível. Se a interface demorar, o teste aguarda dentro de um limite razoável e falha com diagnóstico; uma espera fixa tanto desperdiça tempo quanto pode ser curta demais. Ao final, limpo os dados de treino quando o ambiente permitir. Se a limpeza falhar, registro isso porque ela pode contaminar a próxima execução.”

### 6:30–8:00 · Decisão e limites

**Na tela:** Destaque a observação, a conclusão e o risco que continua aberto.

**Fala:** “O melhor seletor é o que expressa a intenção e resiste a mudanças irrelevantes. O melhor dado é controlado, recuperável e seguro para aparecer em artefatos. Não vale esconder uma falha com retry ilimitado ou com espera global enorme.”

### 8:00–9:00 · Tarefa do aluno

**Na tela:** Mostre o artefato esperado e o caminho de prática na plataforma.

**Fala:** “Agora é sua vez. Revise três seletores do smoke do caso, proponha alternativas por intenção e descreva como criar, identificar e limpar dados sintéticos de cada execução. Use somente dados fictícios e o ambiente indicado na aula. Separe o que você viu do que ainda supõe. A prática acontece depois do vídeo; pause aqui e volte com a evidência para a mentoria.”

## Preparação e evidência

- No Broto Space, use apenas conta de estudo e ambiente autorizado. Nos labs, use o alvo local documentado. Não exiba e-mail, senha, token ou reflexões pessoais.
- Mostre entrada, ação e resultado na mesma demonstração. Faça pausas para leitura da tela e corte tempos de carregamento na edição.
- Confirme nomes e posições dos controles na versão disponível antes da gravação; o roteiro descreve tarefas, não presume rótulos específicos.
- **Prática após o vídeo:** Revise três seletores do smoke do caso, proponha alternativas por intenção e descreva como criar, identificar e limpar dados sintéticos de cada execução.
- **Evidência:** artefato descrito na prática, com ambiente, passos e resultado observável. A prática ocorre fora dos 10 minutos do vídeo.
