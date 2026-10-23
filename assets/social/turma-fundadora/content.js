// Edite o texto de cada peça aqui. Os estilos ficam em styles.css.
// Use ?export=ID na URL para abrir uma peça no tamanho final de 1080 × 1080 px.
const cards = [
  {
    id: "carrossel-01-capa", label: "Carrossel 01 · Editorial · Capa", style: "editorial",
    html: `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>UMA PERGUNTA DE QA</span></div>
      <div class="editorial-mark">?</div>
      <div class="ed-main"><div class="eyebrow coral">CASO 01 / DECISÃO DE RELEASE</div>
      <h2>O TESTE<br>PASSOU.<br><em>VOCÊ<br>LIBERARIA?</em></h2>
      <p>Um sinal verde ainda deixa perguntas.</p></div>
      <div class="footerline"><span>Deslize para investigar</span><span>01 / 03 →</span></div>`
  },
  {
    id: "carrossel-01-meio", label: "Carrossel 01 · Editorial · Desenvolvimento", style: "editorial",
    html: `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>UMA PERGUNTA DE QA</span></div>
      <div class="ed-main ed-inner"><div class="eyebrow coral">O QUE A EVIDÊNCIA MOSTRA</div>
      <h2>200 OK.<br><em>PEDIDO<br>SUMIU.</em></h2>
      <div class="ed-rule"></div>
      <p>A API confirmou a ação. O histórico não mostra o pedido.</p>
      <p class="ed-note">O status respondeu. O fluxo ainda precisa ser investigado.</p></div>
      <div class="footerline"><span>Fato ≠ hipótese</span><span>02 / 03 →</span></div>`
  },
  {
    id: "carrossel-01-fecho", label: "Carrossel 01 · Editorial · Fechamento", style: "editorial",
    html: `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>UMA PERGUNTA DE QA</span></div>
      <div class="ed-main ed-close"><div class="eyebrow coral">ANTES DE LIBERAR</div>
      <h2>QUAL<br>EVIDÊNCIA<br><em>FALTA?</em></h2>
      <div class="ed-pills"><span>REPRODUZIR</span><span>COMPARAR</span><span>EXPLICAR</span></div>
      <p>Pratique essa investigação no desafio gratuito do QA Lab.</p></div>
      <div class="footerline"><span>Comece pelo desafio gratuito</span><span>03 / 03</span></div>`
  },
  {
    id: "carrossel-02-capa", label: "Carrossel 02 · Terminal · Capa", style: "terminal",
    html: `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>BUG REPORT / 001</span></div>
      <div class="terminal-window"><div class="terminal-chrome"><i></i><i></i><i></i><span>qa-lab / relatório</span></div>
      <div class="terminal-body"><div class="prompt">$ investigar --evidencia</div>
      <h2>ACHAR BUG<br>É SÓ<br><em>METADE.</em></h2>
      <p>Um relato útil ajuda outra pessoa a agir.</p><div class="cursor-line">▌</div></div></div>
      <div class="footerline"><span>Deslize para montar o relatório</span><span>01 / 03 →</span></div>`
  },
  {
    id: "carrossel-02-meio", label: "Carrossel 02 · Terminal · Desenvolvimento", style: "terminal",
    html: `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>BUG REPORT / 001</span></div>
      <div class="terminal-window"><div class="terminal-chrome"><i></i><i></i><i></i><span>qa-lab / diff</span></div>
      <div class="terminal-body"><div class="prompt">$ comparar relatos</div>
      <h2 class="terminal-title">TROQUE<br>ACHISMO<br>POR PROVA.</h2>
      <div class="diff bad"><b>−</b> “Não funcionou.”</div>
      <div class="diff good"><b>+</b> “Ao salvar, a tela confirmou; o pedido não aparece no histórico.”</div>
      <p>Agora o problema pode ser reproduzido.</p></div></div>
      <div class="footerline"><span>Escreva para quem vai corrigir</span><span>02 / 03 →</span></div>`
  },
  {
    id: "carrossel-02-fecho", label: "Carrossel 02 · Terminal · Fechamento", style: "terminal",
    html: `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>BUG REPORT / 001</span></div>
      <div class="terminal-window"><div class="terminal-chrome"><i></i><i></i><i></i><span>qa-lab / template</span></div>
      <div class="terminal-body"><div class="prompt">$ montar relato</div><h2 class="terminal-title">MINI<br>TEMPLATE.</h2>
      <ol class="terminal-list"><li><b>01</b> Passos para reproduzir</li><li><b>02</b> Esperado × observado</li><li><b>03</b> Evidência verificável</li><li><b>04</b> Impacto e limite</li></ol>
      <p>Use este roteiro no desafio gratuito.</p></div></div>
      <div class="footerline"><span>Salve este template</span><span>03 / 03</span></div>`
  },
  {
    id: "carrossel-03-capa", label: "Carrossel 03 · Mapa · Capa", style: "mapa",
    html: `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>FERRAMENTA / 01</span></div>
      <div class="mapa-grid"><div class="mapa-copy"><span class="mapa-tag">PRIORIZE COM CRITÉRIO</span>
      <h2>MAPA<br>DE <em>RISCO.</em></h2><p>4 perguntas antes de sair testando.</p></div>
      <div class="mapa-symbol"><span>01</span><span>02</span><span>03</span><span>04</span></div></div>
      <div class="footerline"><span>Uma decisão começa com perguntas</span><span>01 / 03 →</span></div>`
  },
  {
    id: "carrossel-03-meio", label: "Carrossel 03 · Mapa · Desenvolvimento", style: "mapa",
    html: `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>FERRAMENTA / 01</span></div>
      <div class="mapa-inner"><span class="mapa-tag">QUATRO PERGUNTAS</span><h2>ONDE ESTÁ<br>O <em>RISCO?</em></h2>
      <div class="risk-grid"><div><b>01</b><strong>QUEM?</strong><span>Quem é afetado?</span></div><div><b>02</b><strong>IMPACTO?</strong><span>O que pode acontecer?</span></div><div><b>03</b><strong>QUANDO?</strong><span>Com que frequência?</span></div><div><b>04</b><strong>SINAL?</strong><span>Como vamos detectar?</span></div></div></div>
      <div class="footerline"><span>Preencha com o seu contexto</span><span>02 / 03 →</span></div>`
  },
  {
    id: "carrossel-03-fecho", label: "Carrossel 03 · Mapa · Fechamento", style: "mapa",
    html: `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>FERRAMENTA / 01</span></div>
      <div class="mapa-inner mapa-finish"><span class="mapa-tag">SEQUÊNCIA DE TRABALHO</span>
      <h2>RISCO <span>→</span><br>PRIORIDADE <span>→</span><br><em>EVIDÊNCIA.</em></h2>
      <p>Salve o mapa. Na próxima tarefa, explique por que testou o que testou.</p>
      <div class="mapa-action">PRATIQUE NO QA LAB <span>↗</span></div></div>
      <div class="footerline"><span>Aprenda QA fazendo</span><span>03 / 03</span></div>`
  },
  {
    id: "post-01-provocacao", label: "Post 01 · Headline máxima", style: "post-provocacao",
    html: `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>IDEIA / 01</span></div>
      <div class="post-one"><span class="post-tiny">UM TESTE VERDE PODE ESCONDER UM FLUXO QUEBRADO.</span>
      <h2>VERDE<br>NÃO É<br><em>PROVA.</em></h2>
      <div class="post-one-rule"></div><p>Confira o comportamento, não só o resultado do teste.</p></div>
      <div class="footerline"><span>QA é evidência + decisão</span><span>01</span></div>`
  },
  {
    id: "post-02-comparacao", label: "Post 02 · Comparação de decisão", style: "post-comparacao",
    html: `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>DECISÃO / 02</span></div>
      <div class="compare-main"><span class="compare-tag">ANTES DE AUTOMATIZAR</span>
      <h2>FAÇA UMA<br>PERGUNTA<br><em>MELHOR.</em></h2>
      <div class="compare-grid"><div class="compare-no"><b>MENOS ÚTIL</b><p>“Dá para automatizar?”</p></div><div class="compare-yes"><b>MAIS ÚTIL</b><p>“Qual risco este teste vai cobrir?”</p></div></div></div>
      <div class="footerline"><span>Escolha com critério</span><span>02</span></div>`
  },
  {
    id: "post-03-convite", label: "Post 03 · Convite à mentoria", style: "post-convite",
    html: `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>MENTORIA / 03</span></div>
      <div class="invite-main"><span class="invite-tag">TURMA FUNDADORA</span>
      <h2>SEU<br>RACIOCÍNIO<br>MERECE<br>UM <em>CASE.</em></h2>
      <div class="invite-bottom"><p>12 semanas de prática.<br>Entregas com critérios.<br>Feedback humano.</p>
      <div class="invite-cta">ENTRE NA LISTA <span>↗</span></div></div></div>
      <div class="footerline"><span>Mentoria QA Lab</span><span>03</span></div>`
  }
];

const selectedId = new URLSearchParams(location.search).get("export");
const selectedCards = selectedId ? cards.filter((card) => card.id === selectedId) : cards;
if (selectedId) document.body.classList.add("export-mode");
const gallery = document.getElementById("gallery");
gallery.innerHTML = selectedCards.map((card) => `<section class="preview">
  <h2 class="preview-label">${card.label}</h2>
  <div class="frame"><article id="${card.id}" class="artboard ${card.style}" role="img" aria-label="${card.label}">${card.html}</article></div>
</section>`).join("");
if (selectedId && selectedCards.length === 0) gallery.textContent = `Peça ${selectedId} não encontrada.`;
