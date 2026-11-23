# Divulgação dez/2026 – jan/2027

24 posts em 8 semanas (segunda, quarta e sexta), para divulgar os quatro pilares do QA Lab: **o site**, o **playground** (Labs, microdesafios e API pública com modo bugado), o **blog** e a **Biblioteca**. São 8 carrosséis (um por semana) e 16 peças únicas.

- **Peças:** `exports/<post>.png` (peça única) e `exports/<post>-<n>.png` (slides), em 1080 × 1080.
- **Carrosséis para o LinkedIn:** `exports/<post>-carrossel.pdf` (o LinkedIn publica carrossel como documento PDF). No Instagram, use os PNGs na ordem.
- **Editar:** texto em `content.js`, estilo em `styles.css` (a base vem de `../turma-fundadora/styles.css`). Prévia em `index.html`.
- **Exportar:** `node assets/social/divulgacao-dez-jan/render.mjs` na raiz do repositório. Para exportar só alguns posts: `... render.mjs p05 p14`.

## Antes de começar: o que precisa estar no ar

Conferido em produção (`qa-lab-playground-web.vercel.app`) em 23/11/2026:

| Pré-requisito | Situação hoje | Posts que dependem dele | Prazo |
|---|---|---|---|
| Deploy da Biblioteca (`/biblioteca`) | Ainda não publicada (404) | P02, P04, P07, P10, P13, P18, P20, P22 | Até 01/12 |
| Labs ligados em produção (`FEATURE_LABS=true` na Vercel) | Desligado: `/labs`, `/lab`, `/desafio` e `/playground` dão 404 | P09, P14, P17, P21, P23, P24 | Até 17/12 |
| Blog, `/ferramentas` e API pública (`/api/docs`, `?scenario=bug`) | No ar | O resto | — |

Por isso a primeira quinzena se apoia no blog, na Biblioteca e na API pública, e os Labs só entram a partir de 18/12. Se os Labs não forem ligados até lá, troque P09, P14, P17, P21 e P24 por posts de blog ou da Biblioteca. **Nunca publique um link que dá 404.**

## Calendário

Na semana do Natal e na do Ano-novo os posts vão para segunda, terça e quarta, para fugir dos feriados de sexta.

| # | Data | Pilar | Formato | Tema | Link (primeiro comentário) |
|---|---|---|---|---|---|
| P01 | seg 30/11 | QA Lab | Simples | Ler. Praticar. Provar. | `/` |
| P02 | qua 02/12 | Biblioteca | Carrossel (5) | Lançamento: 103 referências | `/biblioteca` |
| P03 | sex 04/12 | Blog | Simples | O título já é metade do report | `/blog/bug-report-reproduzivel` |
| P04 | seg 07/12 | Biblioteca | Simples | Dijkstra: presença, não ausência | `/biblioteca/the-humble-programmer` |
| P05 | qua 09/12 | Playground | Carrossel (5) | Uma API com bugs de propósito | `/api/docs` |
| P06 | sex 11/12 | Blog | Simples | Bug intermitente: o contexto é a evidência | `/blog/investigando-bugs-intermitentes` |
| P07 | seg 14/12 | Biblioteca | Simples | 100% de cobertura não é 100% de proteção | `/biblioteca/coverage-is-not-strongly-correlated` |
| P08 | qua 16/12 | Blog | Carrossel (5) | Da regra ao caso de teste | `/blog/da-regra-ao-caso-de-teste` |
| P09 | sex 18/12 | Playground | Simples | O login que mente | `/labs/login` |
| P10 | seg 21/12 | Biblioteca | Carrossel (5) | Trilha: primeiros passos em QA | `/biblioteca/trilhas/primeiros-passos` |
| P11 | ter 22/12 | Blog | Simples | Qualidade começa nas perguntas | `/blog/qa-antes-de-executar-testes` |
| P12 | qua 23/12 | QA Lab | Simples | 45 guias de ferramentas | `/ferramentas` |
| P13 | seg 28/12 | Biblioteca | Simples | Flaky não é azar | `/biblioteca/empirical-analysis-of-flaky-tests` |
| P14 | ter 29/12 | Playground | Carrossel (5) | Seis coisas que quebram seu teste | `/lab` |
| P15 | qua 30/12 | Blog | Simples | "Testar tudo" não é escopo | `/blog/primeiro-plano-de-testes-enxuto` |
| P16 | seg 04/01 | Blog | Carrossel (5) | 20 prints não são evidência | `/blog/evidencia-util-em-bug-report` |
| P17 | qua 06/01 | Playground | Simples | Seu teste espera tempo ou condição? | `/labs/waits` |
| P18 | sex 08/01 | Biblioteca | Simples | ISO 25010: qualidade não é só funcionar | `/biblioteca/iso-iec-25010` |
| P19 | seg 11/01 | Blog | Simples | 14 dias de dev, 1 de QA | `/blog/gargalo-do-teste-qa-de-bombeiro-a-parceiro-estrategico` |
| P20 | qua 13/01 | Biblioteca | Carrossel (5) | IA nos testes, com os pés no chão | `/biblioteca/trilhas/ia-e-testes` |
| P21 | sex 15/01 | Playground | Simples | Largue o mouse | `/labs/acessibilidade` |
| P22 | seg 18/01 | Biblioteca | Simples | Citação pronta em um clique | `/biblioteca` |
| P23 | qua 20/01 | QA Lab | Carrossel (5) | Quatro passos por semana | `/` |
| P24 | sex 22/01 | Playground | Simples | Ache. Prove. Reporte. | `/desafio` |

**Equilíbrio:** Biblioteca 8, Blog 7, Playground 6, QA Lab 3. Toda semana tem pelo menos dois pilares diferentes.

**Quando usar cada formato:** carrossel para o que ensina um passo a passo ou precisa de exemplo (salvável); peça única para uma ideia, um número ou uma provocação que cabe numa tela só.

## Como publicar

- **Horário sugerido:** entre 8h e 9h ou às 12h. Ajuste pelos dados da página depois das duas primeiras semanas.
- **Link no primeiro comentário,** com a URL completa: `https://qa-lab-playground-web.vercel.app` + o caminho da tabela. Post com link no corpo costuma ter menos alcance no LinkedIn.
- **Responda os comentários nas primeiras horas.** Nos posts com pergunta (P05, P08, P13, P16, P21, P24), a resposta das pessoas é o objetivo do post.
- **Hashtags:** no máximo três. Use `#QualidadeDeSoftware #QA` e mais uma do tema (`#TestesDeSoftware`, `#AutomacaoDeTestes`, `#Acessibilidade`, `#API`).

## Legendas

**P01 · Ler. Praticar. Provar.**
> QA se aprende fazendo, mas também lendo, comparando e provando.
>
> O QA Lab junta num lugar só o que a gente queria ter tido quando começou: artigos curtos que terminam em exercício, guias das ferramentas que o mercado usa, uma biblioteca de referências e uma API com bugs de propósito para você praticar.
>
> Tudo gratuito. Nas próximas semanas vamos mostrar cada parte por aqui.
>
> Link no primeiro comentário.

**P02 · Carrossel: lançamento da Biblioteca**
> Quanto do que você sabe sobre testes tem fonte?
>
> Lançamos a Biblioteca do QA Lab: 103 referências sobre qualidade de software, do Dijkstra de 1972 à pesquisa que saiu este mês.
>
> São 18 livros, 23 artigos fundamentais, 7 normas, 9 guias abertos e 46 pesquisas recentes. Cada referência curada tem por que ler, ideias principais, um exercício para levar ao time e citação pronta em ABNT, APA e BibTeX.
>
> Não sabe por onde começar? São 7 trilhas de leitura, cada uma com a ordem e o motivo de cada leitura.
>
> Qual referência você acha que não pode faltar? Vamos ler todas as sugestões.

**P03 · O título já é metade do report**
> "Carrinho quebra" é um título que gera cinco perguntas de volta.
>
> "Total do carrinho ignora o desconto após alterar a quantidade de 1 para 2" aponta a condição e o efeito. Com os dados do item, do cupom e do ambiente, qualquer pessoa consegue testar a hipótese.
>
> No artigo novo do blog: como escrever um bug report que outra pessoa consegue reproduzir sem te chamar.

**P04 · Dijkstra**
> Em 1972, na palestra do Prêmio Turing, Edsger Dijkstra disse que testar programas pode ser um jeito muito eficaz de mostrar a presença de bugs, mas é inadequado para mostrar a sua ausência.
>
> Mais de 50 anos depois, a frase continua sendo a melhor resposta para "você garante que não tem bug?".
>
> O texto completo, com resumo em português e citação pronta, está na Biblioteca do QA Lab.

**P05 · Carrossel: API com modo bugado**
> Uma API pública, com documentação, autenticação e paginação. E com bugs de propósito.
>
> Acrescente `?scenario=bug` e compare as respostas com o modo correto. No carrossel tem um exemplo: o mesmo usuário inexistente responde 404 no modo certo e 200 no modo bugado.
>
> Quantas diferenças você consegue provar? Comente o endpoint e o que encontrou. Só não estrague a surpresa dos outros: descreva o sintoma, não a resposta inteira.

**P06 · Bug intermitente**
> "Não consegui reproduzir" fecha muito ticket que ainda tinha pista.
>
> Uma falha que aparece uma vez em dez tentativas merece atenção, mas exige honestidade: registre quantas vezes tentou, mude uma variável por vez e anexe logs com horário. Se a falha só acontece depois de renovar o login, essa condição vale mais que dez capturas iguais.
>
> Artigo completo no blog do QA Lab.

**P07 · Cobertura**
> 100% de cobertura de código não é 100% de proteção.
>
> Num estudo apresentado no ICSE 2014, os pesquisadores geraram 31.000 suítes de teste para cinco sistemas Java. Quando o tamanho da suíte foi controlado, a correlação entre cobertura e capacidade de achar defeitos ficou entre baixa e moderada.
>
> Cobertura é ótima para achar código que ninguém testou. Como meta, ela incentiva teste sem assert.
>
> Resumo, ressalvas do estudo e citação na Biblioteca do QA Lab.

**P08 · Carrossel: da regra ao caso de teste**
> "A pessoa pode relacionar um pensamento a um desafio."
>
> Parece um requisito pronto, mas ainda não diz quais dados usar nem o que deve acontecer em cada situação. No carrossel: três passos para sair da regra e chegar a casos que separam comportamentos.
>
> Exercício: monte a tabela do último slide e poste nos comentários. A gente comenta as primeiras.

**P09 · O login que mente** *(requer Labs no ar)*
> Um usuário bloqueado tenta entrar. A mensagem que aparece está errada.
>
> No Lab de login do QA Lab você liga o modo bugado, compara com o comportamento correto e escreve o report com evidência. É gratuito e roda no navegador.
>
> Você testaria primeiro a mensagem, o status da conta ou o log?

**P10 · Carrossel: trilha Primeiros passos**
> Vai tirar uns dias de folga e quer ler algo sobre QA?
>
> A trilha "Primeiros passos em QA" da Biblioteca tem 6 leituras, nesta ordem: o syllabus do ISTQB (com versão oficial em português), Myers, Kaner/Bach/Pettichord, Hendrickson, Crispin e Gregory, e a pirâmide de testes do Ham Vocke.
>
> Duas delas são gratuitas. Se só der tempo para uma, comece pelo syllabus.
>
> Salve para ler depois.

**P11 · Qualidade começa nas perguntas**
> Antes da primeira execução, um QA precisa entender para quem a funcionalidade existe, o que foi prometido e o que acontece se falhar.
>
> Três hábitos: reescrever o resultado esperado em linguagem de usuário, listar as exceções que mudam o resultado e levar as dúvidas de maior risco para produto e dev antes de testar.
>
> Uma lista enorme de casos não compensa uma regra mal entendida.

**P12 · 45 guias de ferramentas**
> Playwright, Cypress, Selenium, Postman, k6, axe, OWASP ZAP, Allure, Testcontainers...
>
> São 45 guias de estudo no QA Lab, cada um com a documentação oficial, cursos gratuitos e vídeos selecionados, os em português primeiro.
>
> Qual ferramenta você quer aprender em janeiro?

**P13 · Flaky não é azar**
> Teste que às vezes falha não é azar. Tem causa.
>
> Um estudo de 2014 analisou 201 correções de testes instáveis em 51 projetos open source. As causas mais comuns foram espera assíncrona, concorrência e dependência da ordem dos testes. Muitas correções trocaram um sleep fixo por uma espera em condição.
>
> Qual dessas já te custou uma tarde inteira?

**P14 · Carrossel: seis coisas que quebram seu teste** *(requer Labs no ar)*
> O elemento está na tela, mas o seletor não acha. Ou o fluxo abre uma nova aba no meio do teste.
>
> O playground do QA Lab tem microdesafios para as seis situações do carrossel: iframe, shadow DOM, tabela dinâmica, diálogos e nova aba, upload e download, e formulário rico. Cada um tem seletores bons e ruins e critérios de aceite.
>
> Desafio: escreva o teste e rode dez vezes seguidas. Passou todas?

**P15 · "Testar tudo" não é escopo**
> Começo de ano é época de planejamento. Um plano de testes não precisa de vinte páginas.
>
> Precisa dizer o objetivo da rodada, os riscos com a razão de cada prioridade, o que fica de fora e qual evidência encerra o trabalho. "Testar tudo" não é escopo verificável, e lista enorme não garante cobertura.
>
> Artigo no blog, com um modelo de uma página.

**P16 · Carrossel: 20 prints não são evidência**
> Um bug report com 20 capturas de tela costuma ser mais lento de analisar do que um com três.
>
> Escolha o formato pela falha: imagem para estado, vídeo curto para sequência, log para o detalhe técnico. E diga qual parte de cada anexo comprova a diferença.
>
> Um cuidado que muita gente esquece: remova senhas, tokens e dados pessoais antes de anexar.

**P17 · Tempo ou condição?** *(requer Labs no ar)*
> Se o seu teste tem `sleep(3000)`, ele está apostando que três segundos bastam.
>
> No Lab de esperas do QA Lab, a interface tem atrasos dinâmicos. No modo bugado, o carregamento nunca termina. Um teste que espera uma condição falha com uma mensagem útil; um teste que espera tempo falha sem explicar nada.

**P18 · ISO 25010**
> Quando alguém diz "está funcionando", está falando de uma das nove características de qualidade da ISO/IEC 25010.
>
> A versão de 2023 renomeou usabilidade para capacidade de interação, portabilidade para flexibilidade, e acrescentou safety. Use as nove como checklist no refinamento: as que ninguém mencionou viram perguntas.
>
> Resumo e citação na Biblioteca do QA Lab.

**P19 · O gargalo do teste**
> Sprint de 15 dias: 14 de desenvolvimento, 1 de QA.
>
> Parece um problema de agenda, mas é sinal de que a qualidade entrou tarde demais. Dúvidas que caberiam no refinamento voltam como retrabalho, e o QA vira a última barreira para compensar em poucas horas as conversas que o time adiou.
>
> Comece pequeno: no próximo refinamento, escolha um fluxo e pergunte o que pode falhar e como isso seria percebido.

**P20 · Carrossel: IA nos testes**
> Antes de adotar a próxima ferramenta de testes com IA, vale ver o que já foi medido.
>
> No carrossel: um survey de 2024 que revisou 102 estudos, o caso da Meta (onde o segredo foram os filtros, não o modelo) e um alerta sobre cobertura.
>
> A trilha completa tem 6 leituras, com resumo e citação, na Biblioteca do QA Lab.

**P21 · Largue o mouse** *(requer Labs no ar)*
> Teste de acessibilidade de 5 minutos: complete a tarefa principal do seu produto só com Tab, Shift+Tab, Enter e Esc.
>
> No Lab de acessibilidade do QA Lab, o modo bugado some com o foco e esconde o contorno. Você ainda sabe onde está na tela?
>
> Conta nos comentários o que você encontrou no seu produto.

**P22 · Citação pronta**
> Escrevendo TCC, artigo ou apresentação sobre testes?
>
> As 57 referências curadas da Biblioteca do QA Lab têm metadados conferidos (DOI e link) e citação pronta para copiar em ABNT, APA e BibTeX. Confira sempre com o manual da sua instituição.

**P23 · Carrossel: quatro passos por semana**
> Um roteiro simples para estudar QA com ritmo usando o QA Lab, sem pagar nada:
>
> 1. Ler um artigo do blog
> 2. Praticar num lab com modo bugado
> 3. Aprofundar com uma leitura da Biblioteca
> 4. Estudar uma ferramenta pelos guias
>
> Uma hora por passo cabe numa semana corrida. Salve e compartilhe com quem está começando.

**P24 · Ache. Prove. Reporte.** *(requer Labs no ar)*
> Um sistema com bugs escondidos e o gabarito liberado depois.
>
> O desafio do QA Lab é gratuito: ache os bugs, prove cada um com evidência e compare com a solução.
>
> Quantos você encontrou? Responde aqui sem spoiler.

## Regras que valem para a série

- Os números das peças (103, 18, 23, 7, 9, 46, 43, 57, 45, 7 trilhas) vêm do código em 23/11/2026. Se o acervo ou os guias mudarem antes da publicação, atualize `content.js` e exporte de novo.
- Os dados de estudos (31.000 suítes, 201 correções, 102 estudos) estão nas páginas das referências na Biblioteca, com a fonte.
- Os exemplos dos labs e da API são fictícios e de treino: não representam defeitos de produção.
- Não prometa datas, preços ou vagas da mentoria nesta série.
