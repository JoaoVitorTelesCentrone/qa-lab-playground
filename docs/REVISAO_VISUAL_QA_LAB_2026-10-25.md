# Revisão visual do QA Lab — 25/10/2026

Revisão com a skill `lp-design`, usando o aplicativo em execução em `http://localhost:3002`. O diagnóstico e a direção registrados aqui foram implementados nas telas descritas abaixo.

## Diagnóstico

A proposta **“Aprenda QA na prática”** está clara no texto. A interface ainda oferece pouca demonstração dessa prática na entrada: o primeiro contato é um grande bloco de texto, uma grade decorativa e três cards com ícones. O material mais característico do produto — sistema, discrepância, investigação e evidência — aparece depois da navegação.

A oportunidade principal é fazer o visitante **ver uma investigação acontecendo**, mantendo o verde, as superfícies escuras e os controles familiares. Há também problemas concretos de uso e leitura que devem entrar antes do acabamento.

## Escopo observado

- Páginas: início, catálogo de Labs, briefing do Lab 01, Trilhas, Conteúdo, Mentoria, Login e Finanças.
- Capturas em **1440 × 900** e **390 × 844**. Conferências adicionais em 320 px e 768 px nas seis primeiras páginas.
- Interações: menu mobile, navegação até Trilhas, quatro etapas do briefing, abertura e navegação do onboarding flutuante, fechamento com Escape e preferência de movimento reduzido.
- Acesso anônimo. `/perfil` redirecionou para login; a área privada e o portfólio de uma conta real não foram avaliados visualmente.
- Não houve envio de formulário, pagamento, publicação ou migração.
- A diferença financeira do Lab 01 é conteúdo intencional do exercício e deve ser preservada.

## Implementação

- Finanças agora mantém as colunas dentro do grid; no celular, a tabela rola no próprio painel com indicação de gesto. Criar, exportar, editar e apagar continuam acessíveis. Valores negativos usam um token de texto coral claro separado do preenchimento destrutivo.
- O breadcrumb do briefing usa itens irmãos na lista e não produz erro de hidratação. As quatro etapas cabem em duas colunas no celular; navegar por elas não sugere conclusão. A troca de conteúdo recebe uma transição curta que respeita movimento reduzido.
- A home mostra a comparação do Lab 01 com o saldo exibido, o saldo esperado e uma diferença revelada sob ação. A demonstração usa apenas os dados documentados do exercício, não salva progresso e mantém o CTA principal para a orientação flutuante.
- O catálogo mostra o botão da primeira missão a partir de y≈724 px em uma viewport de 390×844. Os links para desafios e método seguem disponíveis depois do destaque; a entrega fica recolhida no celular.
- Home, catálogo, Trilhas e Conteúdo compartilham a escala tipográfica de títulos. O guia flutuante destaca um controle específico, escolhe o canto com mais espaço e oferece minimizar; o atalho em telas pequenas usa um botão compacto.
- A comparação da home e a troca de etapa respeitam `prefers-reduced-motion`.

Verificações: TypeScript sem erros; captura manual das rotas em 1440 e 390 px e conferência adicional em 320 e 768 px. O fluxo do briefing apresentou zero erros no console após a correção do breadcrumb. Nenhum formulário foi enviado nem houve gravação ou migração no banco.

Evidências locais: [JSON da inspeção](../packages/web/.tmp/lp-visual-review/evidence.json), [medidas e console](../packages/web/.tmp/lp-visual-review/details.json). Capturas na mesma pasta; são arquivos temporários ignorados pelo Git.

## Prioridades de implementação

### 1. Corrigir a apresentação de Finanças no celular — prioridade alta

**Observado:** em 390 px, a coluna de despesas chega a aproximadamente 434 px de largura, numa área útil de 350 px. Parte de “Nova despesa” e das ações da tabela fica cortada. O documento não acusa rolagem horizontal porque o overflow global está recortado; isso mascara a expansão dos filhos.

**Impacto:** controles importantes ficam parcialmente fora da área visível. Não é apenas uma questão de espaçamento.

**Implementação:** limitar a largura mínima dos filhos do grid, permitir quebra no grupo de ações e conter a rolagem na tabela. Em uma segunda passagem, considerar uma apresentação de lançamentos própria para celular, com data, descrição, valor e ações acessíveis por linha.

**Aceite:** os controles de criar, editar e remover ficam acessíveis em 320 e 390 px; o restante da página não é recortado. As regras e os dados do exercício continuam iguais.

Fonte: `packages/web/components/finance/finance-app.tsx`, especialmente `LedgerColumn` e o grid das duas colunas. [Captura](../packages/web/.tmp/lp-visual-review/financas-390-top.png).

### 2. Aumentar o contraste dos valores negativos — prioridade alta

**Medido:** texto de 14 px em `rgb(180, 35, 24)` sobre `rgb(22, 24, 28)` resulta em aproximadamente **2,70:1**, abaixo do alvo de 4,5:1 para esse texto.

**Implementação:** separar a cor de texto negativo da cor usada no preenchimento de botões destrutivos. Um coral claro como `#FF938A` teria aproximadamente 8,29:1 nessa superfície; a escolha final precisa ser conferida nos demais estados. Manter o sinal de menos para que a informação não dependa apenas da cor.

Fonte: `finance-app.tsx` e os tokens de `app/globals.css`.

### 3. Corrigir o breadcrumb antes de animar o briefing — prioridade alta

**Reproduzido:** `/labs/101` emite avisos de hidratação. O console aponta um `<li>` dentro de outro `<li>`: `BreadcrumbSeparator` está dentro de `BreadcrumbItem`, e ambos produzem itens de lista.

**Implementação:** tornar o separador irmão do item no `BreadcrumbList`. Conferir o primeiro carregamento e a navegação do tour depois da correção.

**Aceite:** nenhum aviso de aninhamento ou hidratação nesse fluxo. É um pré-requisito técnico para transições previsíveis, não uma nova linguagem visual.

Fonte: `packages/web/components/labs/lab-briefing.tsx`, composição do breadcrumb; `components/ui/breadcrumb.tsx`.

### 4. Dar uma assinatura própria à home — maior oportunidade visual

**Observado:** a home explica o método sem mostrar o sistema ou um artefato produzido. Grade, marca d’água e ícones ocupam o papel que uma demonstração do QA Lab poderia cumprir.

**Proposta:** uma demonstração curta do Lab 01. Mostrar lançamentos de treino, o saldo exibido de R$ 1.530,00 e uma ação “Comparar resultados”. A interação revela o esperado de R$ 1.730,00, a diferença de R$ 200,00 e um exemplo compacto de registro da descoberta. Identificar os dados como demonstração do Lab 01.

O resultado da interação não marca o Lab como concluído e não publica uma evidência. O CTA principal continua abrindo o onboarding flutuante; o acesso direto aos Labs permanece disponível.

**Composição:** título e proposta breves; a demonstração participa da mesma bancada visual, sem uma moldura de navegador genérica. A sequência seguinte conecta a descoberta a um exemplo de evidência, em vez de repetir três cards de ícone e parágrafo.

**Celular:** uma comparação compacta, com uma ação de toque; evitar empilhar um grande mockup abaixo de um hero já longo.

Fonte: `packages/web/components/home/product-home.tsx`. [Home atual](../packages/web/.tmp/lp-visual-review/home-1440-top.png).

### 5. Fazer o catálogo chegar mais rápido à primeira missão — prioridade alta

**Medido:** em 390 × 844, com o guia minimizado, o botão da primeira missão começa em **y = 951 px**. Antes dele há introdução, contagem, explicação do processo e três links auxiliares.

**Implementação:** compactar a introdução e concentrar a ajuda em um acesso discreto ao tour. No destaque do Lab, priorizar título, duração, objetivo e ação; os detalhes de entrega podem aparecer progressivamente.

**Aceite:** a primeira ação de abrir uma missão fica visível no viewport mobile de referência sem reduzir a fonte dos textos. Links para os 30 desafios e para a explicação do método continuam acessíveis.

Fonte: `packages/web/components/labs/lab-catalog.tsx`. [Catálogo mobile](../packages/web/.tmp/lp-visual-review/labs-390-top.png).

### 6. Consolidar tipografia e superfícies — prioridade média/alta

**Medido:** a home usa título de 60 px/peso 600; Trilhas usa 60 px/peso 900; Conteúdo usa 48 px/peso 900. As diferenças de peso, larguras e cinzas não formam uma hierarquia clara entre áreas.

**Implementação:** consolidar uma escala de títulos, texto, metadados e controles; reutilizar os tokens sem eliminar a diferença entre páginas de apresentação e telas de trabalho. A família Inter pode continuar; JetBrains Mono faz sentido em valores, IDs e dados de investigação.

O verde deve continuar identificando ações e sucesso. Investigações, alertas e erros precisam de tratamento semântico próprio, incluindo ícone ou rótulo. Nas etapas do Lab, um check de navegação visitada não deve parecer aprovação de uma entrega.

Fonte: `app/globals.css`, `app/trilhas/page.tsx`, `app/conteudo/page.tsx` e `components/labs/lab-briefing.tsx`.

### 7. Refinar o onboarding flutuante e a navegação das etapas — prioridade média

**Funciona:** o tour acompanha as rotas, abre os controles reais, fecha com Escape e permite usar a página ao fundo. Preservar esse formato.

**Melhoria:** posicionar o painel considerando a área destacada, o CTA e a altura disponível. Em telas pequenas, usar texto mais curto e opção de minimizar. Um indicador apontando para o controle específico ajuda mais do que contornar um painel inteiro.

No briefing, “Entrega” fica fora da largura inicial de 390 px, dentro da faixa com rolagem horizontal. Essa rolagem é válida, mas falta uma indicação clara de continuação. Considerar quatro etapas compactas em duas linhas no celular, com estado atual evidente.

Fonte: `components/onboarding/floating-onboarding.tsx` e `components/labs/lab-briefing.tsx`. [Tour sobre o ambiente](../packages/web/.tmp/lp-visual-review/onboarding-environment-390.png).

### 8. Compor movimento a serviço da investigação — prioridade média

**Exercitado:** na Mentoria, a entrada `mentoria-lab-reveal` roda por 850 ms e é removida com movimento reduzido. A home e os catálogos dependem principalmente de estados de hover. No tour, a entrada declarada em CSS não foi observada no estilo calculado, mesmo com `no-preference`; revisar a entrega/cascata dessa regra antes de expandi-la.

**Plano:** concentrar a assinatura animada na comparação de resultados da home. Destacar os registros relevantes, conectar o resultado à diferença e revelar a evidência na ordem em que a pessoa toma a decisão. Nas telas de trabalho, transições curtas devem apenas comunicar troca de etapa e resposta à ação.

Manter conteúdo e CTA visíveis desde o início, rolagem nativa e estado final equivalente com movimento reduzido. Reutilizar `motion`, já presente no projeto; a preferência por Anime.js em novas LPs não exige acrescentar uma segunda engine aqui.

## Direção proposta: a bancada de investigação

1. **Intenção:** a pessoa entende o método, vê uma descoberta verificável e abre sua primeira prática.
2. **Conceito:** “O que você observa vira uma evidência que consegue explicar.”
3. **Assinatura:** comparação interativa de resultados, ligada a um registro de descoberta do próprio QA Lab.
4. **Sistema:** preservar verde e superfícies escuras; reservar contraste para dados e ações; consolidar os pesos tipográficos e separar texto de erro de preenchimento destrutivo.
5. **Composição:** proposta e investigação na primeira dobra; depois, um exemplo de entrega e o caminho para uma prática. No celular, uma interação compacta e controles alcançáveis.
6. **Movimento:** uma sequência significativa na comparação; respostas discretas nos controles. Movimento reduzido mantém todos os dados e estados.
7. **Aceite:** demonstração compreensível sem assistir a uma introdução, CTA funcional, nenhuma falsa conclusão de Lab, controles acessíveis em 320 px, contraste de texto adequado e ausência de avisos de hidratação no fluxo.

## Ordem sugerida

- **Lote 1 — uso e leitura:** corte de Finanças, contraste, breadcrumb e acesso às quatro etapas do briefing.
- **Lote 2 — percepção do produto:** demonstração da home, primeiro CTA do catálogo e consolidação tipográfica nas rotas principais.
- **Lote 3 — acabamento:** posicionamento contextual do tour e coreografia da comparação, com movimento reduzido.

## Referências e limites

Foi examinada a captura local de Café Binocle fornecida pela skill: fotografia de produto, escala e identidade tornam a oferta reconhecível. O princípio aplicável aqui é usar o próprio sistema e suas evidências como matéria visual. A paleta e a estética de café não fazem parte da proposta para o QA Lab.

O índice do acervo e as fichas AW037, AW054 e AW058 foram consultados como repertório. Os sites e imagens dessas edições não foram inspecionados nesta revisão; suas tags não foram usadas como evidência de composição ou movimento. A direção acima se apoia no QA Lab renderizado e na captura local efetivamente observada.

Esta revisão não mede conversão, desempenho em dispositivos reais ou resultados de aprendizagem. O comportamento foi exercitado em Chromium desktop com emulação de viewport mobile; não houve uma auditoria completa de acessibilidade. As conclusões sobre o portfólio privado e a persistência das funções dependentes de banco ficam fora deste escopo.
