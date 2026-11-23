// Série de divulgação dez/2026 – jan/2027: 24 posts (8 carrosséis + 16 peças únicas).
// Edite o texto aqui; estilos em styles.css. Calendário e legendas no README.md.
// Prévia: index.html. Uma peça em 1080 × 1080: index.html?export=<id>.
// Um carrossel inteiro (para o PDF do LinkedIn): index.html?carousel=<post>, ex. ?carousel=p02.

const topline = (series) => `<div class="topline"><strong class="brand">QA<span> LAB</span></strong><span>${series}</span></div>`;
const footer = (left, right) => `<div class="footerline"><span>${left}</span><span>${right}</span></div>`;

/**
 * Uma peça. `theme`: dark | light | neon. `acc`: lab | bib | blog | play.
 * `deco`: { orn: "texto do ornamento" } ou { ring: true }.
 */
function piece({ id, post, label, theme = "dark", acc, series, foot, deco = {}, top = false, body }) {
  const ornament = deco.ring ? `<div class="ring"></div>` : deco.orn ? `<div class="orn">${deco.orn}</div>` : "";
  return {
    id, post, label,
    style: `s ${theme} acc-${acc}`,
    html: `${topline(series)}${ornament}<div class="main${top ? " top" : ""}">${body}</div>${footer(...foot)}`,
  };
}

/** Carrossel: numera os slides e põe a seta em todos menos no último. */
function carousel(post, label, base, slides) {
  return slides.map((slide, index) => piece({
    ...base,
    ...slide,
    id: `${post}-${index + 1}`,
    post,
    label: `${post.toUpperCase()} · ${label} · ${index + 1}/${slides.length}`,
    foot: [slide.footLeft ?? base.footLeft, `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}${index < slides.length - 1 ? " →" : ""}`],
  }));
}

const items = (list, tight = false) => `<ol class="items${tight ? " tight" : ""}">${list.map(([n, text, small]) => `<li><b>${n}</b><span>${text}${small ? `<small>${small}</small>` : ""}</span></li>`).join("")}</ol>`;
const chips = (list) => `<div class="chips">${list.map((chip) => `<span>${chip}</span>`).join("")}</div>`;
const cta = (text, path) => `<div class="cta">${text} <span>↗</span></div>${path ? `<div class="path">${path}</div>` : ""}`;

const cards = [
  // ─────────────── Semana 1 ───────────────
  piece({
    id: "p01", post: "p01", label: "P01 · Simples · Apresentação do QA Lab", acc: "lab", deco: { ring: true },
    series: "QA LAB / APRESENTAÇÃO", foot: ["João Centrone e Gustavo Alves", "01"],
    body: `<span class="tag">QA se aprende fazendo</span>
      <h2 class="xl">LER.<br>PRATICAR.<br><em>PROVAR.</em></h2>
      <div class="rule"></div>
      <p class="lead">Artigos, guias de ferramentas, uma biblioteca de referências e uma API com bugs de propósito. Gratuito e num lugar só.</p>
      ${cta("Conheça o QA Lab")}`,
  }),

  ...carousel("p02", "Carrossel · Lançamento da Biblioteca", { acc: "bib", series: "BIBLIOTECA DE QA", footLeft: "Biblioteca do QA Lab" }, [
    {
      deco: { ring: true }, footLeft: "Deslize para conhecer",
      body: `<span class="tag">Novo no QA Lab</span>
        <h2 class="md">103 REFERÊNCIAS<br>PARA ESTUDAR<br><em>QA COM FONTE.</em></h2>
        <p class="lead">Do clássico de 1972 ao estudo que saiu este mês, com resumo em português.</p>`,
    },
    {
      body: `<span class="tag">O acervo</span>
        <h2 class="sm">CINCO <em>ESTANTES.</em></h2>
        <div class="tiles">
          <div><b>18</b><span>Livros</span></div>
          <div><b>23</b><span>Artigos fundamentais</span></div>
          <div><b>7</b><span>Normas e padrões</span></div>
          <div><b>9</b><span>Guias abertos</span></div>
          <div class="wide"><b>46</b><span>Pesquisas recentes, revisadas uma a uma</span></div>
        </div>`,
    },
    {
      top: true,
      body: `<span class="tag">Por onde começar</span>
        <h2 class="sm">7 TRILHAS DE <em>LEITURA.</em></h2>
        ${items([["01", "Primeiros passos em QA"], ["02", "Automação que se sustenta"], ["03", "Medir qualidade sem se enganar"], ["04", "Qualidade no pipeline e em produção"], ["05", "Riscos que a regressão não pega"], ["06", "IA e testes, com os pés no chão"], ["07", "Raízes da disciplina"]], true)}`,
    },
    {
      body: `<span class="tag">Em cada referência</span>
        <h2 class="sm">NÃO É SÓ UMA<br><em>LISTA DE LINKS.</em></h2>
        ${items([["01", "Por que ler", "O contexto e o que a obra mudou"], ["02", "Ideias principais", "Três pontos para guardar"], ["03", "Na prática", "Um exercício para levar ao time"], ["04", "Como citar", "ABNT, APA e BibTeX prontos para copiar"]])}`,
    },
    {
      deco: { orn: "B" }, footLeft: "Link no primeiro comentário",
      body: `<span class="tag">Comece hoje</span>
        <h2 class="md">ESTUDE<br>COM <em>FONTE.</em></h2>
        <p class="lead">Busca em português, filtros por tema e nível e <strong>43 itens com acesso gratuito</strong>.</p>
        ${cta("Abra a biblioteca", "QA LAB → /biblioteca")}`,
    },
  ]),

  piece({
    id: "p03", post: "p03", label: "P03 · Simples · Blog: bug report reproduzível", acc: "blog",
    series: "BLOG / BUG REPORT", foot: ["Artigo no blog do QA Lab", "03"],
    body: `<span class="tag">Título de bug report</span>
      <h2 class="md">O TÍTULO JÁ É<br>METADE DO <em>REPORT.</em></h2>
      <div class="compare">
        <div class="no"><b>VAGO</b><p>“Carrinho quebra.”</p></div>
        <div class="yes"><b>ESPECÍFICO</b><p>“Total ignora o desconto após mudar a quantidade de 1 para 2.”</p></div>
      </div>
      <p class="lead" style="margin-top:28px">Condição + efeito. Com isso, outra pessoa consegue testar a hipótese.</p>`,
  }),

  // ─────────────── Semana 2 ───────────────
  piece({
    id: "p04", post: "p04", label: "P04 · Simples · Biblioteca: Dijkstra", acc: "bib", deco: { ring: true },
    series: "BIBLIOTECA / CLÁSSICOS", foot: ["Resumo e citação na Biblioteca", "04"],
    body: `<span class="tag">1972 · Palestra do Prêmio Turing</span>
      <p class="quote" style="font-size:56px">Testar programas pode ser um jeito muito eficaz de mostrar a presença de bugs, mas é <em>inadequado para mostrar a sua ausência.</em></p>
      <p class="cite"><strong>Edsger W. Dijkstra</strong> · The Humble Programmer · CACM</p>`,
  }),

  ...carousel("p05", "Carrossel · Playground: API com modo bugado", { acc: "play", series: "PLAYGROUND / API", footLeft: "API pública do QA Lab" }, [
    {
      deco: { orn: "{ }" }, footLeft: "Deslize para testar",
      body: `<span class="tag">API pública com modo bugado</span>
        <h2>UMA API<br>COM BUGS<br><em>DE PROPÓSITO.</em></h2>
        <p class="lead">Mesmos endpoints, dois modos: o correto e o quebrado. Seu trabalho é provar a diferença.</p>`,
    },
    {
      body: `<span class="tag">Como ligar o modo bugado</span>
        <h2 class="sm">ACRESCENTE UM<br><em>PARÂMETRO.</em></h2>
        <div class="term"><div class="bar"><i></i><i></i><i></i><span>qa-lab / api</span></div>
        <pre><span class="dim"># documentação</span>
GET /api/docs

<span class="dim"># modo correto</span>
GET /api/health

<span class="dim"># modo bugado</span>
GET /api/health<span class="k">?scenario=bug</span></pre></div>`,
    },
    {
      body: `<span class="tag">Exemplo real</span>
        <h2 class="sm">O STATUS <em>MENTIU.</em></h2>
        <div class="term"><div class="bar"><i></i><i></i><i></i><span>usuário inexistente</span></div>
        <pre>GET /api/users/999
<span class="ok">404</span> {"error":"Not Found","statusCode":404}

GET /api/users/999<span class="k">?scenario=bug</span>
<span class="bad">200</span> {"error":"Usuario nao encontrado"}</pre></div>
        <p class="lead" style="margin-top:26px">Quem decide pelo status code trata o erro como sucesso.</p>`,
    },
    {
      body: `<span class="tag">O que reportar</span>
        <h2 class="sm">TRÊS LINHAS POR<br><em>DIFERENÇA.</em></h2>
        ${items([["01", "O que você enviou", "Método, URL, corpo e headers"], ["02", "O que voltou", "Status e corpo da resposta"], ["03", "O que o contrato diz", "O esperado, com a fonte"]])}`,
    },
    {
      deco: { orn: "?" }, footLeft: "Link no primeiro comentário",
      body: `<span class="tag">Seu turno</span>
        <h2 class="md">HÁ MAIS BUGS<br><em>ESCONDIDOS.</em></h2>
        <p class="lead">Login, carrinho, produtos e reservas, com autenticação e paginação. Compare os dois modos e anote cada diferença que você consegue provar.</p>
        ${cta("Abra a documentação", "QA LAB → /api/docs")}`,
    },
  ]),

  piece({
    id: "p06", post: "p06", label: "P06 · Simples · Blog: bugs intermitentes", theme: "light", acc: "blog",
    series: "BLOG / INVESTIGAÇÃO", foot: ["Artigo no blog do QA Lab", "06"],
    body: `<span class="tag">Bug intermitente</span>
      <h2 class="md">SE NÃO REPETE,<br>O <em>CONTEXTO</em><br>É A EVIDÊNCIA.</h2>
      ${items([["01", "Registre tentativas e falhas observadas", "Sem inventar uma taxa global"], ["02", "Mude uma variável por vez", "Dados, ordem, navegador, rede ou sessão"], ["03", "Anexe logs com horário", "Para cruzar o que a tela e o servidor viram"]])}`,
  }),

  // ─────────────── Semana 3 ───────────────
  piece({
    id: "p07", post: "p07", label: "P07 · Simples · Biblioteca: cobertura", acc: "bib", deco: { orn: "%" },
    series: "BIBLIOTECA / EVIDÊNCIA", foot: ["Resumo e ressalvas na Biblioteca", "07"],
    body: `<span class="tag">Cobertura de testes</span>
      <h2 class="md">100% DE COBERTURA<br>NÃO É <em>100% DE<br>PROTEÇÃO.</em></h2>
      <p class="lead">Com 31.000 suítes em cinco sistemas Java, a correlação entre cobertura e eficácia ficou entre baixa e moderada quando o tamanho da suíte foi controlado.</p>
      <p class="cite" style="margin-top:26px">Inozemtseva &amp; Holmes · ICSE 2014</p>`,
  }),

  ...carousel("p08", "Carrossel · Blog: da regra ao caso de teste", { theme: "light", acc: "blog", series: "BLOG / DESIGN DE TESTES", footLeft: "Blog do QA Lab" }, [
    {
      deco: { orn: "→" }, footLeft: "Deslize para transformar",
      body: `<span class="tag">Da regra ao caso de teste</span>
        <h2 class="md">UMA REGRA<br>NÃO É UM<br><em>CASO DE TESTE.</em></h2>
        <p class="lead">“A pessoa pode relacionar um pensamento a um desafio.” Ainda não diz quais dados usar nem o que esperar.</p>`,
    },
    {
      body: `<span class="tag">Passo 1</span>
        <h2 class="md">TRANSFORME<br>EM <em>DECISÃO.</em></h2>
        <p class="lead">Dadas certas condições, uma ação produz um resultado que dá para observar. Marque as palavras vagas, como “relacionar” e “reencontrar”.</p>
        ${chips(["CONDIÇÃO", "AÇÃO", "RESULTADO OBSERVÁVEL"])}`,
    },
    {
      body: `<span class="tag">Passo 2</span>
        <h2 class="sm">EXEMPLOS QUE <em>SEPARAM</em><br>COMPORTAMENTOS.</h2>
        ${items([["01", "Pensamento sem vínculo"], ["02", "Pensamento ligado a um desafio"], ["03", "Voltar depois e consultar o contexto"], ["04", "Uma condição de borda"]], true)}
        <p class="lead" style="margin-top:22px">Varie uma condição de cada vez.</p>`,
    },
    {
      body: `<span class="tag">Passo 3</span>
        <h2 class="sm">NÃO COPIE O REQUISITO<br>COMO <em>ESPERADO.</em></h2>
        <div class="compare">
          <div class="no"><b>COPIADO</b><p>“O pensamento deve continuar acessível.”</p></div>
          <div class="yes"><b>OBSERVÁVEL</b><p>“Depois de sair e recarregar, o pensamento aparece com o desafio vinculado.”</p></div>
        </div>`,
    },
    {
      deco: { orn: "#" }, footLeft: "Link no primeiro comentário",
      body: `<span class="tag">Exercício</span>
        <h2 class="md">MONTE A<br><em>TABELA.</em></h2>
        <p class="lead">Quatro linhas (sem vínculo, vínculo criado, retorno após sair e borda) e cinco colunas: condição, ação, esperado, observado e fonte da regra.</p>
        ${cta("Leia o artigo", "QA LAB → /blog/da-regra-ao-caso-de-teste")}`,
    },
  ]),

  piece({
    id: "p09", post: "p09", label: "P09 · Simples · Lab de login (requer Labs no ar)", acc: "play", deco: { orn: "!" },
    series: "LABS / LOGIN", foot: ["Lab gratuito do QA Lab", "09"],
    body: `<span class="tag">Modo bugado</span>
      <h2 class="md">ESTE LOGIN<br><em>MENTE</em> SOBRE<br>CONTA BLOQUEADA.</h2>
      <p class="lead">No modo bugado, a pessoa bloqueada recebe a mensagem errada. Ache a diferença, prove com evidência e escreva o report.</p>
      ${cta("Abra o lab", "QA LAB → /labs/login")}`,
  }),

  // ─────────────── Semana 4 (Natal: seg, ter, qua) ───────────────
  ...carousel("p10", "Carrossel · Biblioteca: trilha Primeiros passos", { theme: "light", acc: "bib", series: "BIBLIOTECA / TRILHA", footLeft: "Trilha de leitura" }, [
    {
      deco: { ring: true }, footLeft: "Deslize para ver a ordem",
      body: `<span class="tag">Leituras para as férias</span>
        <h2 class="xl">PRIMEIROS<br>PASSOS<br><em>EM QA.</em></h2>
        <p class="lead">Seis leituras, nesta ordem, para quem está entrando na área ou mudando de carreira.</p>`,
    },
    {
      body: `<span class="tag">Leituras 1 a 3</span>
        <h2 class="sm">COMECE PELA <em>BASE.</em></h2>
        ${items([["01", "Syllabus ISTQB CTFL 4.0", "O vocabulário das vagas, com versão oficial em português"], ["02", "The Art of Software Testing", "Myers · A mentalidade de procurar defeitos"], ["03", "Lessons Learned in Software Testing", "Kaner, Bach e Pettichord · O trabalho num projeto real"]])}`,
    },
    {
      body: `<span class="tag">Leituras 4 a 6</span>
        <h2 class="sm">DEPOIS, <em>PRÁTICA.</em></h2>
        ${items([["04", "Explore It!", "Hendrickson · Exploração com método"], ["05", "Agile Testing", "Crispin e Gregory · QA dentro de um time ágil"], ["06", "The Practical Test Pyramid", "Ham Vocke · Um primeiro mapa de automação"]])}`,
    },
    {
      body: `<span class="tag">Dica</span>
        <h2 class="md">SEM GRANA<br>PARA <em>LIVRO?</em></h2>
        <p class="lead">Comece pelos gratuitos: o syllabus do ISTQB e a pirâmide de testes do Ham Vocke. A página da trilha mostra o tipo de acesso de cada leitura.</p>`,
    },
    {
      deco: { orn: "7" }, footLeft: "Link no primeiro comentário",
      body: `<span class="tag">E depois?</span>
        <h2 class="md">MAIS SEIS<br><em>TRILHAS.</em></h2>
        ${chips(["Automação", "Métricas", "Pipeline", "Riscos além da regressão", "IA e testes", "Raízes da disciplina"])}
        ${cta("Ver as trilhas", "QA LAB → /biblioteca")}`,
    },
  ]),

  piece({
    id: "p11", post: "p11", label: "P11 · Simples · Blog: antes de executar testes", acc: "blog", deco: { orn: "?" },
    series: "BLOG / ANTES DO TESTE", foot: ["Artigo no blog do QA Lab", "11"],
    body: `<span class="tag">O que um QA faz antes de executar testes</span>
      <h2 class="md">QUALIDADE<br>COMEÇA NAS<br><em>PERGUNTAS.</em></h2>
      ${items([["01", "Reescreva o esperado em linguagem de usuário"], ["02", "Liste exceções: dado ausente, formato inválido, repetição"], ["03", "Leve as dúvidas de maior risco para produto e dev"]], true)}`,
  }),

  piece({
    id: "p12", post: "p12", label: "P12 · Simples · Guias de ferramentas", theme: "neon", acc: "lab",
    series: "QA LAB / FERRAMENTAS", foot: ["Guias gratuitos", "12"],
    body: `<span class="tag">Guias de estudo</span>
      <div class="stat"><b>45</b><span>FERRAMENTAS<br>DE QA</span></div>
      <p class="lead">Documentação oficial, cursos gratuitos e vídeos selecionados de Playwright, Cypress, Postman, k6, axe, OWASP ZAP e outras.</p>
      ${cta("Ver os guias", "QA LAB → /ferramentas")}`,
  }),

  // ─────────────── Semana 5 (Ano-novo: seg, ter, qua) ───────────────
  piece({
    id: "p13", post: "p13", label: "P13 · Simples · Biblioteca: testes flaky", acc: "bib", deco: { orn: "~" },
    series: "BIBLIOTECA / EVIDÊNCIA", foot: ["Luo et al. · FSE 2014", "13"],
    body: `<span class="tag">Testes instáveis</span>
      <h2 class="xl">FLAKY<br>NÃO É <em>AZAR.</em></h2>
      <p class="lead">Um estudo analisou 201 correções de testes instáveis em 51 projetos open source. As causas mais comuns:</p>
      ${chips(["ESPERA ASSÍNCRONA", "CONCORRÊNCIA", "ORDEM DOS TESTES"])}`,
  }),

  ...carousel("p14", "Carrossel · Playground: microdesafios de automação (requer Labs no ar)", { acc: "play", series: "PLAYGROUND / AUTOMAÇÃO", footLeft: "Playground do QA Lab" }, [
    {
      deco: { orn: "&lt;/&gt;" }, footLeft: "Deslize para ver os seis",
      body: `<span class="tag">Para quem está aprendendo automação</span>
        <h2 class="md">SEIS COISAS<br>QUE <em>QUEBRAM</em><br>SEU TESTE.</h2>
        <p class="lead">Cada uma tem um microdesafio no playground, com seletores bons e ruins e critérios de aceite.</p>`,
    },
    {
      body: `<span class="tag">As escondidas</span>
        <h2 class="sm">O ELEMENTO ESTÁ LÁ.<br>O SELETOR <em>NÃO ACHA.</em></h2>
        ${items([["01", "Iframe", "O elemento está em outro documento"], ["02", "Shadow DOM", "O seletor comum não atravessa a fronteira"], ["03", "Tabela dinâmica", "A linha certa muda de posição"]])}`,
    },
    {
      body: `<span class="tag">As que interrompem</span>
        <h2 class="sm">O FLUXO <em>SAI DO<br>ROTEIRO.</em></h2>
        ${items([["04", "Alert, modal e nova aba", "O foco do teste muda de lugar"], ["05", "Upload e download", "O arquivo também é parte do fluxo"], ["06", "Formulário rico", "Date picker, slider, tags e rating"]])}`,
    },
    {
      body: `<span class="tag">A regra de ouro</span>
        <h2 class="md">ESPERE A<br><em>CONDIÇÃO.</em></h2>
        <div class="compare">
          <div class="no"><b>TEMPO FIXO</b><p style="font-family:Consolas,monospace;font-size:27px">waitForTimeout(3000)</p></div>
          <div class="yes"><b>CONDIÇÃO</b><p style="font-family:Consolas,monospace;font-size:27px">expect(botao).toBeVisible()</p></div>
        </div>`,
    },
    {
      deco: { orn: "✓" }, footLeft: "Link no primeiro comentário",
      body: `<span class="tag">Seu turno</span>
        <h2 class="md">PRATIQUE<br>ANTES DO<br><em>TRABALHO.</em></h2>
        <p class="lead">Escolha um microdesafio, escreva o teste em Playwright, Cypress ou Selenium e rode dez vezes seguidas.</p>
        ${cta("Abra o playground", "QA LAB → /lab")}`,
    },
  ]),

  piece({
    id: "p15", post: "p15", label: "P15 · Simples · Blog: plano de testes enxuto", theme: "light", acc: "blog",
    series: "BLOG / PLANEJAMENTO", foot: ["Artigo no blog do QA Lab", "15"],
    body: `<span class="tag">Para começar o ano</span>
      <h2 class="md">“TESTAR TUDO”<br>NÃO É <em>ESCOPO.</em></h2>
      ${items([["01", "Objetivo da rodada", "E os fluxos que precisam funcionar"], ["02", "Riscos, dados e dependências", "Com a razão de cada prioridade"], ["03", "O que fica de fora", "E qual evidência encerra a rodada"]])}
      <p class="lead" style="margin-top:22px">Seu primeiro plano de testes cabe em uma página.</p>`,
  }),

  // ─────────────── Semana 6 ───────────────
  ...carousel("p16", "Carrossel · Blog: evidência útil em bug report", { acc: "blog", series: "BLOG / EVIDÊNCIA", footLeft: "Blog do QA Lab" }, [
    {
      deco: { orn: "20" }, footLeft: "Deslize para enxugar",
      body: `<span class="tag">Bug report</span>
        <h2>20 PRINTS<br>NÃO SÃO<br><em>EVIDÊNCIA.</em></h2>
        <p class="lead">Evidência não é coleção de arquivos. Cada anexo precisa responder a uma pergunta.</p>`,
    },
    {
      body: `<span class="tag">Escolha pelo tipo de falha</span>
        <h2 class="sm">UM FORMATO PARA<br>CADA <em>PERGUNTA.</em></h2>
        ${items([["01", "Imagem", "Para mostrar um estado"], ["02", "Vídeo curto", "Para mostrar uma sequência"], ["03", "Log", "Para o detalhe técnico"]])}`,
    },
    {
      body: `<span class="tag">Exemplo: total incorreto</span>
        <h2 class="sm">TRÊS ANEXOS<br><em>BASTAM.</em></h2>
        ${items([["01", "Captura com itens e valores"], ["02", "Captura com o total final"], ["03", "Registro da resposta da API"]], true)}
        <p class="lead" style="margin-top:22px">E o report diz qual parte de cada anexo comprova a diferença.</p>`,
    },
    {
      deco: { orn: "!" },
      body: `<span class="tag">Cuidado</span>
        <h2 class="md">EVIDÊNCIA<br>TAMBÉM <em>VAZA.</em></h2>
        <p class="lead">Remova senhas, tokens e dados pessoais antes de anexar. Evidência sensível num ticket pode ampliar o incidente em vez de ajudar a resolver.</p>`,
    },
    {
      deco: { orn: "3" }, footLeft: "Link no primeiro comentário",
      body: `<span class="tag">Exercício</span>
        <h2 class="md">NO MÁXIMO<br><em>TRÊS.</em></h2>
        <p class="lead">Pegue um bug fictício, escolha até três evidências e justifique a pergunta que cada uma responde.</p>
        ${cta("Leia o artigo", "QA LAB → /blog/evidencia-util-em-bug-report")}`,
    },
  ]),

  piece({
    id: "p17", post: "p17", label: "P17 · Simples · Lab de esperas (requer Labs no ar)", acc: "play", deco: { orn: "◌" },
    series: "LABS / ESPERAS", foot: ["Lab gratuito do QA Lab", "17"],
    body: `<span class="tag">Spinner infinito</span>
      <h2 class="md">SEU TESTE<br>ESPERA <em>TEMPO</em><br>OU CONDIÇÃO?</h2>
      <p class="lead">No lab de esperas, a interface tem atrasos dinâmicos. No modo bugado, o carregamento nunca termina, e um sleep fixo não vai te contar isso.</p>
      ${cta("Abra o lab", "QA LAB → /labs/waits")}`,
  }),

  piece({
    id: "p18", post: "p18", label: "P18 · Simples · Biblioteca: ISO 25010", theme: "light", acc: "bib",
    series: "BIBLIOTECA / NORMAS", foot: ["ISO/IEC 25010:2023 na Biblioteca", "18"],
    body: `<span class="tag">ISO/IEC 25010:2023</span>
      <h2 class="md">QUALIDADE<br>NÃO É SÓ<br><em>FUNCIONAR.</em></h2>
      ${chips(["Adequação funcional", "Eficiência de desempenho", "Compatibilidade", "Capacidade de interação", "Confiabilidade", "Segurança", "Manutenibilidade", "Flexibilidade", "Safety"])}
      <p class="lead" style="margin-top:28px">As nove características de qualidade de produto. Use como checklist no próximo refinamento.</p>`,
  }),

  // ─────────────── Semana 7 ───────────────
  piece({
    id: "p19", post: "p19", label: "P19 · Simples · Blog: o gargalo do teste", acc: "blog", deco: { ring: true },
    series: "BLOG / CULTURA", foot: ["Artigo no blog do QA Lab", "19"],
    body: `<span class="tag">O gargalo do teste</span>
      <h2 class="md">14 DIAS DE DEV.<br>1 DIA DE QA.<br><em>NÃO É AGENDA.</em></h2>
      <div class="rule"></div>
      <p class="lead">É sinal de que a qualidade entrou tarde demais. Comece pequeno: no próximo refinamento, escolha um fluxo e pergunte o que pode falhar e como isso seria percebido.</p>`,
  }),

  ...carousel("p20", "Carrossel · Biblioteca: IA e testes", { acc: "bib", series: "BIBLIOTECA / IA E TESTES", footLeft: "Trilha de leitura" }, [
    {
      deco: { ring: true }, footLeft: "Deslize para ver as evidências",
      body: `<span class="tag">Trilha de leitura</span>
        <h2 class="md">IA NOS TESTES,<br>COM OS PÉS<br><em>NO CHÃO.</em></h2>
        <p class="lead">O que pesquisa e indústria já mediram, antes de você adotar a próxima ferramenta.</p>`,
    },
    {
      body: `<span class="tag">O mapa</span>
        <div class="stat"><b>102</b><span>ESTUDOS<br>REVISADOS</span></div>
        <p class="lead">Um survey de 2024 mapeou LLMs em teste: geração de testes de unidade, de entradas e de oráculos, depuração e reparo.</p>
        <p class="cite" style="margin-top:24px">Wang et al. · IEEE TSE 2024</p>`,
    },
    {
      body: `<span class="tag">Na indústria</span>
        <h2 class="sm">NA META, O SEGREDO<br>FORAM OS <em>FILTROS.</em></h2>
        ${items([["01", "Compila?"], ["02", "Passa várias vezes, sem instabilidade?"], ["03", "Aumenta a cobertura?"]], true)}
        <p class="lead" style="margin-top:20px">Só o que passa nos três chega para revisão humana.</p>
        <p class="cite" style="margin-top:16px">Alshahwan et al. · FSE 2024</p>`,
    },
    {
      deco: { orn: "%" },
      body: `<span class="tag">O alerta</span>
        <h2 class="md">MAIS COBERTURA<br>NÃO É MAIS<br><em>PROTEÇÃO.</em></h2>
        <p class="lead">Teste gerado com assert fraco sobe o número e não pega bug. Meça também a eficácia, por exemplo com teste de mutação.</p>`,
    },
    {
      deco: { orn: "6" }, footLeft: "Link no primeiro comentário",
      body: `<span class="tag">A trilha completa</span>
        <h2 class="md">SEIS LEITURAS,<br>EM <em>ORDEM.</em></h2>
        <p class="lead">Com resumo, ideias principais, como aplicar e citação pronta.</p>
        ${cta("Ver a trilha", "QA LAB → /biblioteca/trilhas/ia-e-testes")}`,
    },
  ]),

  piece({
    id: "p21", post: "p21", label: "P21 · Simples · Lab de acessibilidade (requer Labs no ar)", theme: "neon", acc: "play",
    series: "LABS / ACESSIBILIDADE", foot: ["Lab gratuito do QA Lab", "21"],
    body: `<span class="tag">Teste de 5 minutos</span>
      <h2 class="xl">LARGUE<br>O MOUSE.</h2>
      <p class="lead">Navegue só com o teclado. No modo bugado do lab de acessibilidade, o foco some e o contorno fica escondido. Você ainda sabe onde está?</p>
      ${chips(["TAB", "SHIFT + TAB", "ENTER", "ESC"])}
      ${cta("Abra o lab", "QA LAB → /labs/acessibilidade")}`,
  }),

  // ─────────────── Semana 8 ───────────────
  piece({
    id: "p22", post: "p22", label: "P22 · Simples · Biblioteca: citação pronta", theme: "light", acc: "bib", deco: { orn: "“" },
    series: "BIBLIOTECA / CITAÇÕES", foot: ["Na página de cada referência", "22"],
    body: `<span class="tag">TCC, artigo ou apresentação</span>
      <h2 class="md">CITAÇÃO<br>PRONTA EM<br><em>UM CLIQUE.</em></h2>
      ${chips(["ABNT", "APA", "BIBTEX"])}
      <p class="lead" style="margin-top:28px">As 57 referências curadas têm metadados conferidos e citação para copiar. Confira sempre com o manual da sua instituição.</p>`,
  }),

  ...carousel("p23", "Carrossel · QA Lab: roteiro de estudo", { acc: "lab", series: "QA LAB / ROTEIRO", footLeft: "Roteiro de estudo" }, [
    {
      deco: { ring: true }, footLeft: "Deslize para montar a semana",
      body: `<span class="tag">Um roteiro de estudo</span>
        <h2>QUATRO<br>PASSOS POR<br><em>SEMANA.</em></h2>
        <p class="lead">Um jeito de usar o QA Lab para estudar QA com ritmo, sem pagar nada.</p>`,
    },
    {
      acc: "blog", deco: { orn: "01" },
      body: `<span class="tag">01 · Ler</span>
        <h2 class="md">UM ARTIGO<br>DO <em>BLOG.</em></h2>
        <p class="lead">Textos curtos que terminam com um exercício. Comece por “Como escrever um bug report reproduzível”.</p>`,
    },
    {
      acc: "play", deco: { orn: "02" },
      body: `<span class="tag">02 · Praticar</span>
        <h2 class="md">UM LAB COM<br><em>MODO BUGADO.</em></h2>
        <p class="lead">Login, esperas, acessibilidade, API e exploratório. Ligue o bug, ache a diferença e escreva o report.</p>`,
    },
    {
      acc: "bib", deco: { orn: "03" },
      body: `<span class="tag">03 · Aprofundar</span>
        <h2 class="md">UMA LEITURA DA<br><em>BIBLIOTECA.</em></h2>
        <p class="lead">Siga uma das sete trilhas para entender a teoria por trás do que você praticou.</p>`,
    },
    {
      deco: { orn: "04" }, footLeft: "Link no primeiro comentário",
      body: `<span class="tag">04 · Ferramentar</span>
        <h2 class="md">UM GUIA DE<br><em>FERRAMENTA.</em></h2>
        <p class="lead">Documentação, curso gratuito e vídeo para a ferramenta da semana.</p>
        ${cta("Comece pelo QA Lab")}`,
    },
  ]),

  piece({
    id: "p24", post: "p24", label: "P24 · Simples · Desafio (requer Labs no ar)", theme: "neon", acc: "play", deco: { orn: "?" },
    series: "PLAYGROUND / DESAFIO", foot: ["Desafio gratuito do QA Lab", "24"],
    body: `<span class="tag">Desafio da semana</span>
      <h2 class="xl">ACHE.<br>PROVE.<br>REPORTE.</h2>
      <p class="lead">Um sistema com bugs escondidos e o gabarito liberado depois. Quantos você consegue provar?</p>
      ${cta("Aceite o desafio", "QA LAB → /desafio")}`,
  }),
];

const params = new URLSearchParams(location.search);
const exportId = params.get("export");
const carouselId = params.get("carousel");
const selected = exportId ? cards.filter((card) => card.id === exportId)
  : carouselId ? cards.filter((card) => card.post === carouselId)
  : cards;
if (exportId) document.body.classList.add("export-mode");
if (carouselId) document.body.classList.add("pdf-mode");

const gallery = document.getElementById("gallery");
gallery.innerHTML = selected.map((card) => `<section class="preview">
  <h2 class="preview-label">${card.label}</h2>
  <div class="frame"><article id="${card.id}" class="artboard ${card.style}" role="img" aria-label="${card.label}">${card.html}</article></div>
</section>`).join("");
if ((exportId || carouselId) && selected.length === 0) gallery.textContent = `Peça ${exportId ?? carouselId} não encontrada.`;
window.__cards = cards.map(({ id, post }) => ({ id, post }));
