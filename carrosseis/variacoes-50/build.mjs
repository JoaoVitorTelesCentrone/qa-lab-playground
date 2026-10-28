import { execFile } from 'node:child_process';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = dirname(fileURLToPath(import.meta.url));
const chrome = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
if (!chrome) throw new Error('Chrome ou Edge não encontrado.');

const base = `
*{box-sizing:border-box}html,body{width:1080px;height:1080px;margin:0;overflow:hidden}
body{font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased}
.canvas{position:relative;width:1080px;height:1080px;overflow:hidden}
.top,.foot{position:absolute;z-index:20;left:58px;right:58px;display:flex;align-items:center;justify-content:space-between}
.top{top:45px}.foot{bottom:42px;padding-top:18px;border-top:2px solid currentColor;font-size:17px;font-weight:800;letter-spacing:.06em}
.logo{font-size:29px;font-weight:900;letter-spacing:-.055em}.logo span{color:var(--accent)}
.meta,.label,.code{font-family:Consolas,'Courier New',monospace;font-weight:700;letter-spacing:.05em}
.meta{font-size:17px}.label{font-size:19px;text-transform:uppercase}
.big{font-size:99px;line-height:.91;letter-spacing:-.075em;font-weight:900;text-transform:uppercase;margin:0}
.body{font-size:30px;line-height:1.18;font-weight:700;letter-spacing:-.035em}
.quiet{opacity:.66}.accent{color:var(--accent)}.coral{color:var(--coral)}
.rule{height:2px;background:currentColor;opacity:.5}.inner{position:absolute;inset:138px 58px 115px;z-index:3}
`;

const wrap = (style, n, body) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${base}${style.css}</style></head><body><main class="canvas ${style.slug} n${n}"><div class="top"><div class="logo">QA <span>LAB</span></div><div class="meta">${style.meta}</div></div>${body}<div class="foot"><span>${style.footer}</span><span>${String(n).padStart(2,'0')} / 05</span></div></main></body></html>`;

const variants = [
  {
    slug:'01-radar-de-risco', title:'Radar de risco',
    about:'Círculos de varredura, pontos de risco e uma narrativa que avança do sinal para a decisão.',
    meta:'RADAR / IA + QA', footer:'SINAL → EVIDÊNCIA → DECISÃO',
    css:`
      .canvas{--accent:#c4f46a;--coral:#ff8c72;background:#0b2724;color:#f4f6ec}
      .canvas:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 68% 50%,transparent 0 14%,#92c8a01c 14.2% 14.4%,transparent 14.6% 28%,#92c8a021 28.2% 28.4%,transparent 28.6% 44%,#92c8a023 44.2% 44.4%,transparent 44.6%),linear-gradient(#17413b66 1px,transparent 1px),linear-gradient(90deg,#17413b66 1px,transparent 1px);background-size:100% 100%,90px 90px,90px 90px}
      .top,.foot{color:#eef4e8}.signal{position:absolute;width:18px;height:18px;border-radius:50%;background:var(--coral);box-shadow:0 0 0 8px #ff8c7233,0 0 0 22px #ff8c721b}
      .radar-disc{position:absolute;border:3px solid #c4f46a99;border-radius:50%;width:590px;height:590px}
      .radar-disc:before,.radar-disc:after{content:'';position:absolute;background:#c4f46a99}.radar-disc:before{width:2px;height:100%;left:50%}.radar-disc:after{height:2px;width:100%;top:50%}
      .data{border:2px solid #76aa85;background:#102f2b;padding:27px}
      .chip{display:inline-block;background:var(--accent);color:#0b2724;padding:10px 16px;font-family:Consolas,monospace;font-size:19px;font-weight:900}
      .arrow{font-size:58px;line-height:1;color:var(--accent)}
      .light{background:#c4f46a;color:#0b2724}.light .logo span{color:#0b2724}.light .top,.light .foot{color:#0b2724}
    `,
    slides:[
      `<div class="radar-disc" style="right:-122px;top:195px"></div><div class="signal" style="right:171px;top:483px"></div>
       <div class="inner" style="display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:40px"><div class="label accent" style="margin-bottom:28px">O SINAL MUDOU / E AGORA?</div><h1 class="big" style="max-width:800px">A IA<br>EXECUTA.<br><span class="accent">VOCÊ</span><br>DECIDE.</h1><div class="body" style="margin-top:34px;max-width:620px">O diferencial do QA está no que faz com a evidência.</div></div>`,
      `<div class="inner"><div class="label accent">01 / DETECTAR</div><h2 class="big" style="font-size:87px;margin-top:35px">UM TESTE<br><span class="accent">VERDE</span><br>É UM SINAL.</h2><div class="radar-disc" style="right:12px;top:405px;width:380px;height:380px"></div><div class="signal" style="right:198px;top:602px"></div><div class="data" style="position:absolute;left:0;top:470px;width:590px"><div class="label accent">RESPOSTA AUTOMÁTICA</div><div style="display:flex;align-items:baseline;gap:25px;margin-top:20px"><strong style="font-size:112px;line-height:1;letter-spacing:-.08em">200</strong><span class="code" style="font-size:23px">GET /pedido/312<br>status: ok</span></div></div><div class="body" style="position:absolute;bottom:30px;left:0;max-width:830px">A regra de negócio também passou?</div></div>`,
      `<div class="inner"><div class="label accent">02 / INTERPRETAR</div><h2 class="big" style="font-size:86px;margin-top:32px">DO DADO<br>AO <span class="accent">RISCO.</span></h2><div style="position:absolute;top:410px;left:0;right:0;display:grid;grid-template-columns:1fr 80px 1fr;align-items:stretch;gap:18px"><div class="data"><div class="label accent">IA / ACELERA</div><div style="font-size:42px;font-weight:900;line-height:1.17;margin-top:37px">Repete<br>Resume<br>Sugere</div></div><div class="arrow" style="align-self:center;text-align:center">→</div><div class="data" style="border-color:#c4f46a"><div class="label accent">QA / DECIDE</div><div style="font-size:42px;font-weight:900;line-height:1.17;margin-top:37px">Investiga<br>Prioriza<br>Explica</div></div></div><div class="body" style="position:absolute;bottom:15px;max-width:900px">A escolha depende de contexto e evidência.</div></div>`,
      `<div class="inner"><div class="label accent">03 / INVESTIGAR A ANOMALIA</div><h2 class="big" style="font-size:89px;margin-top:33px">O TESTE<br><span class="accent">PASSOU.</span><br>E AGORA?</h2><div style="position:absolute;top:490px;left:0;right:0;display:flex;gap:25px"><div class="data" style="width:300px"><div class="label accent">SINAL</div><strong style="display:block;font-size:100px;margin-top:29px">✓</strong><div class="body" style="font-size:25px">Fluxo verde</div></div><div class="data" style="flex:1;border-color:#ff8c72"><div class="label coral">RISCO NÃO COBERTO</div><p style="font-size:39px;line-height:1.1;font-weight:900;margin:33px 0">Clique duplo criou o pedido duas vezes.</p><div class="code" style="font-size:20px">evidência → impacto → ação</div></div></div></div>`,
      `<div class="inner" style="display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:28px"><div class="label">04 / PRÓXIMO PASSO</div><h2 class="big" style="font-size:102px;margin-top:40px">TREINE<br>O OLHAR<br>QUE <span style="color:#1b5446">DECIDE.</span></h2><div style="background:#0b2724;color:#f4f6ec;padding:25px 29px;display:flex;justify-content:space-between;align-items:center;margin-top:35px"><span class="body">Explore os labs gratuitos do QA Lab.</span><span style="font-size:55px">↗</span></div></div>`,
    ],
  },
  {
    slug:'02-caderno-de-campo', title:'Caderno de campo',
    about:'Papel, carimbos e anotações técnicas; a evidência vira uma história de investigação.',
    meta:'CADERNO / Nº 050', footer:'ANOTAÇÕES DE UM QA',
    css:`
      .canvas{--accent:#23694f;--coral:#c85843;background:#f1ecdf;color:#17352a}
      .canvas:before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 73px,#3f65401a 74px 75px),linear-gradient(90deg,transparent 0 112px,#b55f4c44 113px 115px,transparent 116px);opacity:.9}
      .top,.foot{color:#17352a}.headline{font-family:Georgia,'Times New Roman',serif;font-weight:900;font-style:italic;letter-spacing:-.065em;line-height:.93;margin:0}
      .mark{font-family:Consolas,monospace;font-weight:900;color:#c85843;border:3px solid #c85843;padding:12px 18px;display:inline-block;transform:rotate(-5deg);letter-spacing:.07em}
      .note{background:#fffdf4;border:2px solid #17352a;box-shadow:14px 14px 0 #c8d2bb;padding:28px 32px}
      .index{font-family:Georgia,serif;font-size:220px;font-weight:900;font-style:italic;color:#c85843;opacity:.17;line-height:.7}
      .line{border-bottom:2px solid #2f5948;padding:19px 0;font-size:30px;font-weight:700}
      .red{color:#c85843}.dark{background:#17352a;color:#f1ecdf}.dark .logo span{color:#b9ef63}.dark .top,.dark .foot{color:#f1ecdf}
    `,
    slides:[
      `<div class="inner"><div class="mark">NOTA DE CAMPO 050</div><div class="index" style="position:absolute;right:-30px;top:32px">IA</div><h1 class="headline" style="position:absolute;left:0;top:155px;font-size:114px;max-width:970px">A IA executa.<br><span class="red">Você</span><br>decide.</h1><div style="position:absolute;left:0;bottom:40px;width:700px"><div class="rule"></div><p class="body">O que um resultado automático ainda não consegue responder?</p></div></div>`,
      `<div class="inner"><div class="label red">OBSERVAÇÃO 01 / O RETORNO</div><h2 class="headline" style="font-size:96px;margin-top:45px">A máquina<br>ganha tempo.</h2><div class="note" style="position:absolute;top:390px;left:0;width:720px;transform:rotate(-2deg)"><div class="label">REGISTRO DE EXECUÇÃO</div><div style="font-family:Consolas,monospace;font-size:64px;font-weight:900;margin-top:27px">200 <span style="font-size:23px;font-weight:500">GET /pedido/312</span></div><div class="line" style="font-size:23px">status: ok</div></div><div class="mark" style="position:absolute;right:0;top:665px;font-size:20px">CONFERIR</div><p style="position:absolute;bottom:15px;left:0;right:0;font-family:Georgia,serif;font-weight:900;font-size:44px;line-height:1.03;margin:0">Mas a regra de negócio foi atendida?</p></div>`,
      `<div class="inner"><div class="label red">OBSERVAÇÃO 02 / DUAS COLUNAS</div><h2 class="headline" style="font-size:86px;margin-top:38px">Resultado não<br>é decisão.</h2><div style="position:absolute;top:350px;left:0;right:0;display:grid;grid-template-columns:1fr 1fr;gap:26px"><section class="note" style="min-height:430px"><div class="label">A IA ACELERA</div><div class="line">01 &nbsp; Repetir</div><div class="line">02 &nbsp; Resumir</div><div class="line">03 &nbsp; Sugerir</div></section><section class="note" style="min-height:430px;background:#dbe8d0"><div class="label">O QA DECIDE</div><div class="line">01 &nbsp; Investigar</div><div class="line">02 &nbsp; Priorizar</div><div class="line">03 &nbsp; Explicar</div></section></div><div class="mark" style="position:absolute;bottom:2px;right:0">CONTEXTO + EVIDÊNCIA</div></div>`,
      `<div class="inner"><div class="label red">OBSERVAÇÃO 03 / HIPÓTESE</div><h2 class="headline" style="font-size:90px;margin-top:33px">O teste passou.<br><span class="red">E agora?</span></h2><div class="note" style="position:absolute;top:365px;left:0;right:90px;min-height:330px"><div class="label">O QUE ENCONTRAMOS</div><div style="font-family:Georgia,serif;font-weight:900;font-size:54px;line-height:1.04;margin-top:37px">O pedido apareceu duas vezes após um clique duplo.</div></div><div style="position:absolute;right:0;bottom:22px;background:#c85843;color:#fffdf4;padding:24px 28px;transform:rotate(-3deg);font-family:Consolas,monospace;font-size:22px;font-weight:900">REGISTRAR → AVALIAR → DECIDIR</div></div>`,
      `<div class="inner"><div class="mark" style="background:#c85843;color:#fffdf4;border-color:#fffdf4">PRÓXIMA PÁGINA</div><h2 class="headline" style="font-size:108px;margin-top:84px;max-width:940px">Pare de só<br>rodar.<br><span style="color:#b9ef63">Comece</span><br>a decidir.</h2><div style="position:absolute;bottom:13px;left:0;right:0;border-top:2px solid #f1ecdf;padding-top:26px;display:flex;justify-content:space-between;align-items:center"><span class="body">Pratique nos labs gratuitos do QA Lab.</span><span style="font-size:60px">↗</span></div></div>`,
    ],
  },
  {
    slug:'03-terminal-de-decisoes', title:'Terminal de decisões',
    about:'Interface técnica, comandos e estados: uma visualização de QA que vai além do “teste verde”.',
    meta:'SESSION: QA_LAB_050', footer:'EXECUTE / OBSERVE / DECIDE',
    css:`
      .canvas{--accent:#78ead7;--coral:#ff806d;background:#0d141a;color:#e9f5f1}
      .canvas:before{content:'';position:absolute;inset:0;background:linear-gradient(#ffffff09 1px,transparent 1px);background-size:100% 6px;pointer-events:none}
      .top,.foot{color:#d7eee7}.logo span{color:#78ead7}
      .mono{font-family:Consolas,'Courier New',monospace}.prompt{font-family:Consolas,monospace;color:#78ead7;font-size:22px;font-weight:700}
      .window{border:2px solid #5d8b88;background:#121f25;box-shadow:16px 16px 0 #78ead71c}
      .window-head{border-bottom:2px solid #5d8b88;padding:15px 20px;font-family:Consolas,monospace;font-size:19px;color:#78ead7}
      .dot{display:inline-block;width:13px;height:13px;border-radius:50%;background:#ff806d;margin-right:9px}.dot:nth-child(2){background:#d7d76b}.dot:nth-child(3){background:#78ead7}
      .readout{font-family:Consolas,monospace;font-size:25px;line-height:1.5}
      .key{color:#78ead7}.warn{color:#ff806d}
      .mint-panel{background:#78ead7;color:#10221f}.mint-panel .top,.mint-panel .foot{color:#10221f}.mint-panel .logo span{color:#236b5a}
    `,
    slides:[
      `<div class="inner"><div class="prompt">&gt; iniciar análise / ia + qa<span style="opacity:.5">_</span></div><div style="position:absolute;right:0;top:50px;border:2px solid #78ead7;padding:15px 20px;font:700 18px Consolas;color:#78ead7">STATUS: EM INVESTIGAÇÃO</div><h1 class="big" style="position:absolute;top:195px;font-size:113px;max-width:970px">A IA<br><span class="accent">EXECUTA.</span><br>VOCÊ<br>DECIDE<span class="accent">_</span></h1><div class="window" style="position:absolute;left:0;right:0;bottom:14px;padding:19px 25px;font:700 24px Consolas">OUTPUT: tarefa concluída &nbsp; <span class="key">|</span> &nbsp; DECISION: pendente</div></div>`,
      `<div class="inner"><div class="prompt">&gt; ler_saida_execucao()</div><h2 class="big" style="font-size:91px;margin-top:42px">RETORNO<br><span class="accent">200 OK.</span></h2><div class="window" style="position:absolute;top:365px;left:0;right:0"><div class="window-head"><span class="dot"></span><span class="dot"></span><span class="dot"></span>&nbsp; run #312 / suite: checkout</div><div class="readout" style="padding:30px 33px 40px"><div><span class="key">GET</span> /pedido/312</div><div>http_status .......... <span class="key">200</span></div><div>assertions ........... <span class="key">PASS</span></div><div>duplicidade ......... <span class="warn">NÃO VERIFICADA</span></div></div></div><div class="body" style="position:absolute;bottom:9px;max-width:900px">A resposta da API não valida sozinha a regra de negócio.</div></div>`,
      `<div class="inner"><div class="prompt">&gt; separar_execucao_de_julgamento()</div><h2 class="big" style="font-size:88px;margin-top:38px">RESULTADO<br><span class="accent">≠ DECISÃO.</span></h2><div style="position:absolute;top:375px;left:0;right:0;display:grid;grid-template-columns:1fr 1fr;gap:18px"><div class="window" style="min-height:393px"><div class="window-head">PROCESSO / IA</div><div class="readout" style="padding:29px;font-size:30px">+ repetir<br>+ resumir<br>+ sugerir</div></div><div class="window" style="min-height:393px;border-color:#78ead7"><div class="window-head">JULGAMENTO / QA</div><div class="readout" style="padding:29px;font-size:30px">? investigar<br>? priorizar<br>? explicar risco</div></div></div><div class="prompt" style="position:absolute;bottom:12px">contexto + evidência =&gt; decisão</div></div>`,
      `<div class="inner"><div class="prompt">&gt; investigar_anomalia()</div><h2 class="big" style="font-size:86px;margin-top:35px">VERDE NA<br>SUÍTE.<br><span class="coral">ALERTA</span> NO<br>PRODUTO.</h2><div class="window" style="position:absolute;left:0;right:0;top:545px;border-color:#ff806d"><div class="window-head" style="color:#ff806d;border-color:#ff806d">! INCIDENTE / DUPLICAÇÃO</div><div style="padding:25px 28px 34px;font-size:36px;line-height:1.16;font-weight:800">Clique duplo criou dois pedidos.<br><span class="accent">Evidência → impacto → ação.</span></div></div></div>`,
      `<div class="inner"><div class="prompt" style="color:#236b5a">&gt; proxima_missao()</div><h2 class="big" style="font-size:115px;margin-top:92px">PARE DE<br>SÓ RODAR.<br>COMECE A<br><span style="color:#236b5a">DECIDIR.</span></h2><div style="position:absolute;left:0;right:0;bottom:12px;background:#10221f;color:#e9f5f1;padding:24px 27px;display:flex;align-items:center;justify-content:space-between;font-size:29px;font-weight:800">Explore os labs gratuitos do QA Lab. <span style="font-size:51px">↗</span></div></div>`,
    ],
  },
  {
    slug:'04-cartaz-de-decisao', title:'Cartaz de decisão',
    about:'Tipografia de cartaz, cortes diagonais e blocos de cor para posts de opinião com ritmo forte.',
    meta:'MANIFESTO / 050', footer:'MENOS ROTINA, MAIS CRITÉRIO',
    css:`
      .canvas{--accent:#c4f46a;--coral:#f07862;background:#f2f2e8;color:#14231d}
      .canvas:before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 0 58%,#d9ddd15c 58.1% 58.5%,transparent 58.6%),linear-gradient(#1f3d2a12 1px,transparent 1px);background-size:100% 100%,100% 70px}
      .logo span{color:#2b7355}.top,.foot{color:#14231d}
      .bar{background:#14231d;color:#f2f2e8;padding:9px 22px;display:inline-block;transform:skewX(-8deg)}
      .sticker{display:inline-flex;align-items:center;justify-content:center;width:155px;height:155px;background:#c4f46a;border:3px solid #14231d;border-radius:50%;font-family:Consolas,monospace;font-size:23px;font-weight:900;text-align:center;line-height:1.05;transform:rotate(14deg)}
      .black{background:#14231d;color:#f2f2e8}.black .logo span{color:#c4f46a}.black .top,.black .foot{color:#f2f2e8}
      .coral-bg{background:#f07862;color:#14231d}.coral-bg .logo span{color:#14231d}
      .stripe{height:16px;background:repeating-linear-gradient(90deg,#14231d 0 50px,#c4f46a 50px 100px)}
    `,
    slides:[
      `<div class="inner"><div class="bar label">UM NOVO JEITO DE PENSAR QA</div><div class="sticker" style="position:absolute;right:10px;top:8px">IA<br>+<br>QA</div><h1 class="big" style="font-size:118px;position:absolute;top:155px;left:0;right:0">A IA<br><span style="display:inline-block;background:#c4f46a;padding:0 18px;margin-left:-18px">EXECUTA.</span><br>VOCÊ<br><span style="color:#d15d47">DECIDE.</span></h1><div class="stripe" style="position:absolute;left:0;right:0;bottom:80px"></div><div class="body" style="position:absolute;bottom:12px;font-size:24px">O TESTE TERMINA. A INVESTIGAÇÃO COMEÇA.</div></div>`,
      `<div class="inner"><div class="label accent">01 / A RESPOSTA</div><div style="position:absolute;top:73px;left:0;font-size:400px;line-height:.8;font-weight:900;letter-spacing:-.11em;color:#c4f46a">200</div><div style="position:absolute;left:0;right:0;top:420px;height:270px;background:#f07862;transform:skewY(-5deg)"></div><div style="position:absolute;left:20px;right:20px;top:450px;font-size:62px;line-height:1.02;font-weight:900;letter-spacing:-.065em">STATUS OK.<br><span style="color:#f2f2e8">REGRA OK?</span></div><div class="body" style="position:absolute;bottom:20px;max-width:830px">A máquina ganhou tempo. A pergunta de QA ainda precisa ser feita.</div></div>`,
      `<div class="inner"><div class="label">02 / DUAS FUNÇÕES</div><h2 class="big" style="font-size:89px;margin-top:35px">RESULTADO<br><span style="color:#f07862">≠</span> DECISÃO.</h2><div style="position:absolute;left:0;right:0;top:380px;display:grid;grid-template-columns:1fr 1fr;gap:12px"><div style="background:#f2f2e8;color:#14231d;padding:32px;min-height:390px"><div class="label">IA / FAZ MAIS RÁPIDO</div><div style="font-size:41px;line-height:1.2;font-weight:900;margin-top:48px">REPETIR<br>RESUMIR<br>SUGERIR</div></div><div style="background:#c4f46a;color:#14231d;padding:32px;min-height:390px"><div class="label">QA / FAZ COM CRITÉRIO</div><div style="font-size:41px;line-height:1.2;font-weight:900;margin-top:48px">INVESTIGAR<br>PRIORIZAR<br>EXPLICAR</div></div></div><div class="body" style="position:absolute;bottom:2px;font-size:25px">CONTEXTO + EVIDÊNCIA = ESCOLHA RESPONSÁVEL</div></div>`,
      `<div class="inner"><div class="bar label">03 / CASO: PEDIDO DUPLICADO</div><h2 class="big" style="font-size:100px;margin-top:54px">TESTE<br><span style="color:#d15d47">VERDE.</span><br>PRODUTO<br>COM BUG.</h2><div style="position:absolute;right:-15px;top:375px;background:#c4f46a;border:3px solid #14231d;padding:22px;transform:rotate(7deg);font-size:25px;font-weight:900">2× PEDIDOS</div><div style="position:absolute;bottom:16px;left:0;right:0;border-top:4px solid #14231d;padding-top:23px" class="body">Clique duplo criou duas compras.<br>Qual risco isso traz para o usuário?</div></div>`,
      `<div class="inner"><div class="bar label" style="background:#c4f46a;color:#14231d">PRÓXIMA AÇÃO / QA LAB</div><h2 class="big" style="font-size:117px;margin-top:85px">PARE DE<br>SÓ RODAR.<br>COMECE A<br>DECIDIR.</h2><div style="position:absolute;left:0;right:0;bottom:31px;background:#14231d;color:#f2f2e8;padding:27px 30px;display:flex;align-items:center;justify-content:space-between;font-size:27px;font-weight:900">PRATIQUE NOS LABS GRATUITOS DO QA LAB <span style="font-size:45px">↗</span></div></div>`,
    ],
  },
];

// Slides with a contrasting final canvas use the same shared top and footer.
const canvasClasses = {
  '01-radar-de-risco': {5:'light'},
  '02-caderno-de-campo': {5:'dark'},
  '03-terminal-de-decisoes': {5:'mint-panel'},
  '04-cartaz-de-decisao': {2:'black',3:'black',5:'coral-bg'},
};

for (const style of variants) {
  const folder = join(root, style.slug);
  mkdirSync(folder, {recursive:true});
  for (let i=0;i<5;i++) {
    const n=i+1;
    const html=wrap(style,n,style.slides[i]).replace(`class="canvas ${style.slug} n${n}"`,`class="canvas ${style.slug} n${n} ${canvasClasses[style.slug]?.[n] ?? ''}"`);
    writeFileSync(join(folder,`${String(n).padStart(2,'0')}.html`),html,'utf8');
  }
  const gallery=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${style.title} — QA Lab</title><style>*{box-sizing:border-box}body{margin:0;background:#101a18;color:#f3f6ed;font-family:Arial,sans-serif}header{padding:27px 32px;border-bottom:1px solid #7da889}a{color:#c4f46a}h1{margin:0 0 7px;font-size:30px}p{margin:0;color:#a9bdb0}main{display:flex;gap:18px;padding:30px;overflow-x:auto;scroll-snap-type:x mandatory}figure{margin:0;flex:0 0 min(79vw,470px);scroll-snap-align:start}img{width:100%;display:block;box-shadow:0 15px 40px #0009}figcaption{padding-top:11px;color:#c4f46a;font-weight:700}</style></head><body><header><a href="../index.html">← Ver os cinco estilos</a><h1>${style.title}</h1><p>${style.about}</p></header><main>${[1,2,3,4,5].map(n=>`<figure><img src="${String(n).padStart(2,'0')}.png" alt="Slide ${n} do estilo ${style.title}"><figcaption>${String(n).padStart(2,'0')} / 05</figcaption></figure>`).join('')}</main></body></html>`;
  writeFileSync(join(folder,'preview.html'),gallery,'utf8');
}

const overview=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Cinco estilos — carrossel QA Lab</title><style>*{box-sizing:border-box}body{margin:0;background:#101a18;color:#f3f6ed;font-family:Arial,sans-serif}header{padding:32px 40px;border-bottom:1px solid #5d8468}h1{margin:0 0 10px;font-size:36px}p{margin:0;color:#acbfb1;line-height:1.45;max-width:780px}main{padding:34px 40px;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:28px}a{text-decoration:none;color:inherit;background:#1d3029;display:block;padding:12px;border:1px solid #527361;transition:transform .15s}a:hover,a:focus-visible{transform:translateY(-5px);outline:2px solid #c4f46a}img{width:100%;display:block}h2{font-size:22px;margin:15px 5px 5px}.desc{font-size:15px;padding:0 5px 12px}</style></head><body><header><h1>QA Lab · cinco estilos de carrossel</h1><p>O primeiro piloto e as quatro novas direções estão juntos aqui. Clique numa capa para percorrer os cinco slides de cada estilo.</p></header><main><a href="../piloto-50-redesign/preview.html"><img src="../piloto-50-redesign/01-capa.png" alt="Capa do primeiro piloto"><h2>Dossiê de investigação ↗</h2><p class="desc">O primeiro estilo aprovado: evidência, comparação e decisão em uma sequência visual.</p></a>${variants.map(s=>`<a href="${s.slug}/preview.html"><img src="${s.slug}/01.png" alt="Capa ${s.title}"><h2>${s.title} ↗</h2><p class="desc">${s.about}</p></a>`).join('')}</main></body></html>`;
writeFileSync(join(root,'index.html'),overview,'utf8');

if (process.argv.includes('--gallery-only')) process.exit(0);

const jobs=variants.flatMap(s=>[1,2,3,4,5].map(n=>({style:s.slug,n})));
let next=0;
async function worker(){
  while(next<jobs.length){
    const {style,n}=jobs[next++];
    const folder=join(root,style);
    const stem=String(n).padStart(2,'0');
    const png=join(folder,`${stem}.png`);
    const html=join(folder,`${stem}.html`);
    await run(chrome,[
      '--headless=new','--disable-gpu','--hide-scrollbars','--no-sandbox',
      '--window-size=1080,1080','--force-device-scale-factor=1',
      '--virtual-time-budget=1200',`--screenshot=${png}`,
      `file:///${html.replaceAll('\\','/')}`,
    ],{windowsHide:true});
    console.log(`${style}/${stem}.png`);
  }
}
await Promise.all([worker(),worker()]);
