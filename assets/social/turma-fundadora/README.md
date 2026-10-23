# Templates sociais — turma fundadora

**Formato:** 1080 × 1080 px, quadrado. O [arquivo de prévia](index.html) apresenta 3 carrosséis de 3 slides e 3 posts de peça única. O [painel de comparação](overview.html) mostra as seis direções lado a lado. O texto editável está em `content.js`; cores, tipografia e layout estão em `styles.css`.

## Seis direções

| Peça | Estilo | Assunto | Uso |
|---|---|---|---|
| Carrossel 01 | Editorial de pergunta: fundo escuro, título grande e coral para o ponto de tensão | O teste passou. Você liberaria? | Abrir conversa sobre evidência e decisão de release. |
| Carrossel 02 | Terminal: prompt, diff e mini template | Achar bug é só metade | Ensinar a escrever um bug report reproduzível. |
| Carrossel 03 | Mapa: quatro blocos numerados, fundo claro e verde | Mapa de risco em 4 perguntas | Conteúdo para salvar e usar numa tarefa. |
| Post 01 | Headline máxima: tipografia grande com um único argumento | Verde não é prova | Provocação curta com explicação na legenda. |
| Post 02 | Comparação: duas perguntas lado a lado | Antes de automatizar | Ensinar critério de escolha. |
| Post 03 | Convite: fundo neon e chamada direta | Seu raciocínio merece um case | Levar à lista de interesse da mentoria. |

Os carrosséis já têm **capa → desenvolvimento → fechamento**. Para criar uma versão de 5–7 slides, duplique o slide do meio mantendo a mesma estrutura e acrescente apenas uma decisão ou evidência por slide. O último slide tem um único CTA.

## Legendas iniciais

**Carrossel 01:** “A resposta `200 OK` confirmou uma etapa. O pedido ausente no histórico abre outra pergunta. Antes de liberar, que evidência você procuraria? O desafio gratuito do QA Lab permite praticar essa investigação com um caso fictício.”

**Carrossel 02:** “Um bug report útil deixa outra pessoa reproduzir o problema e decidir o próximo passo. Guarde os quatro campos do último slide e experimente no desafio gratuito.”

**Carrossel 03:** “Quando tudo parece importante, estas quatro perguntas ajudam a escolher por onde começar. Salve o mapa e use no próximo briefing; descreva qual resposta mudou sua prioridade.”

**Post 01:** “Um teste verde é um dado. Confira o comportamento do usuário, a persistência e o risco que ainda não foi coberto. No QA Lab, prática e evidência andam juntas.”

**Post 02:** “Automatizar é uma decisão de manutenção e risco. Antes de escrever o teste, diga qual falha ele precisa detectar e o que acontecerá quando falhar.”

**Post 03:** “A Mentoria QA Lab foi desenhada para transformar prática em entregas revisadas e um case apresentável. São 12 semanas, missões com critérios, feedback humano e um encontro ao vivo por semana. As datas e condições da turma serão divulgadas na página oficial. Entre na lista de interesse se quiser receber o aviso.”

## Editar e exportar

1. Abra `index.html` no navegador para ver a galeria. Para ver uma peça isolada em 1080 × 1080, acrescente `?export=post-01-provocacao` à URL local.
2. Edite o texto do item correspondente em `content.js`. Cada carrossel usa três IDs com o mesmo número (`capa`, `meio`, `fecho`).
3. Mantenha títulos curtos e texto importante a pelo menos 70 px das bordas. Use até duas famílias tipográficas por peça e um CTA.
4. Rode `node assets/social/turma-fundadora/render.mjs` a partir da raiz. O comando gera 12 PNGs e um painel comparativo em `exports/`.
5. Revise cada PNG no tamanho real antes de publicar; os arquivos de design não incluem preço, datas ou vagas não definidos.

As peças usam a paleta escura atual do produto (`#10151B`, menta `#2DD4BF`, neon `#A3E635`, coral `#FB7185`) e uma variação clara com verde para a série de mapas. Os exemplos são fictícios e não representam defeitos confirmados em produção.
