import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const chrome = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
if (!chrome) throw new Error('Chrome ou Edge não encontrado.');

const css = `
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1080px;overflow:hidden}
body{font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased}
.slide{position:relative;width:1080px;height:1080px;overflow:hidden;background:#101a18;color:#f2f4ec}
.slide:before{content:'';position:absolute;inset:0;opacity:.15;background-image:linear-gradient(#739184 1px,transparent 1px),linear-gradient(90deg,#739184 1px,transparent 1px);background-size:68px 68px;mask-image:linear-gradient(90deg,transparent 4%,black 60%)}
.paper{background:#e8ede2;color:#14221e}.paper:before{opacity:.12;background-image:linear-gradient(#5c7869 1px,transparent 1px),linear-gradient(90deg,#5c7869 1px,transparent 1px)}
.lime{background:#b9ef63;color:#14221e}.lime:before{opacity:.12}
.top,.bottom{position:absolute;left:62px;right:62px;display:flex;align-items:center;justify-content:space-between;z-index:5}
.top{top:50px}.bottom{bottom:46px;border-top:2px solid currentColor;padding-top:22px;font-size:19px;font-weight:700;letter-spacing:.08em}
.brand{font-size:30px;font-weight:900;letter-spacing:-.055em}.brand em{font-style:normal;color:#b9ef63}.paper .brand em,.lime .brand em{color:#26634e}
.series{font-family:Consolas,monospace;font-size:17px;font-weight:700;letter-spacing:.05em}
.kicker{font-family:Consolas,monospace;font-size:20px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.title{font-size:104px;line-height:.91;letter-spacing:-.075em;font-weight:900;margin:0;text-transform:uppercase}
.sub{font-size:31px;line-height:1.28;font-weight:600;letter-spacing:-.025em}
.accent{color:#b9ef63}.paper .accent{color:#26735b}.coral{color:#ff8974}
.rule{height:2px;background:currentColor;opacity:.5}
.micro{font-family:Consolas,monospace;font-size:18px;font-weight:700;letter-spacing:.04em}
.frame{position:absolute;z-index:2;inset:0;padding:148px 62px 118px}
.round{position:absolute;border:3px solid #b9ef63;border-radius:50%}
.stamp{display:inline-block;background:#b9ef63;color:#14221e;padding:14px 18px;font-family:Consolas,monospace;font-size:19px;font-weight:900;letter-spacing:.08em;transform:rotate(-4deg)}
.paper .stamp{background:#164839;color:#f2f4ec}
`;

const shell = (content, kind = '', n = 1) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${css}</style></head><body><main class="slide ${kind}"><div class="top"><div class="brand">QA <em>LAB</em></div><div class="series">DOSSIÊ 050&nbsp; / &nbsp;IA + QA</div></div>${content}<div class="bottom"><span>QA LAB&nbsp; • &nbsp;IDEIAS PARA TESTAR MELHOR</span><span>${String(n).padStart(2,'0')} / 05</span></div></main></body></html>`;

const slides = [
  shell(`
    <div class="round" style="width:650px;height:650px;right:-215px;top:190px;opacity:.55"></div>
    <div class="round" style="width:470px;height:470px;right:-123px;top:280px;opacity:.4"></div>
    <div style="position:absolute;right:0;top:155px;font-size:420px;line-height:1;font-weight:900;color:#b9ef63;opacity:.13;letter-spacing:-.13em;transform:rotate(-11deg)">IA</div>
    <div style="position:absolute;left:65px;top:230px;width:115px;height:115px;border:3px solid #b9ef63;transform:rotate(45deg)"></div>
    <div class="frame" style="display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:175px">
      <div class="kicker accent" style="margin-bottom:38px">CARREIRA EM QA / O QUE MUDA</div>
      <h1 class="title" style="max-width:950px">A IA<br>EXECUTA.<br><span class="accent">VOCÊ</span><br>DECIDE.</h1>
      <div style="display:flex;align-items:center;gap:26px;margin-top:43px"><div style="width:96px;height:4px;background:#b9ef63"></div><p class="sub" style="margin:0;max-width:650px">O valor do QA aparece quando o teste termina e a pergunta começa.</p></div>
    </div>`, '', 1),

  shell(`
    <div class="frame">
      <div class="kicker" style="color:#26735b">01 / SEPARAR TAREFA DE DECISÃO</div>
      <h2 class="title" style="font-size:89px;margin-top:46px;max-width:850px">A MÁQUINA<br><span class="accent">GANHA TEMPO.</span></h2>
      <div style="position:absolute;left:62px;right:62px;top:445px;border:3px solid #183c31;background:#f6f7ee;box-shadow:17px 17px 0 #a6bdae;padding:28px 34px 30px">
        <div class="micro" style="color:#26735b;border-bottom:2px solid #b1c7b8;padding-bottom:18px">AUTOMAÇÃO / RESULTADO DE EXECUÇÃO</div>
        <div style="display:flex;gap:30px;align-items:center;margin-top:25px"><div style="font-size:82px;font-weight:900;letter-spacing:-.08em">200</div><div style="height:72px;width:2px;background:#93a99a"></div><div style="font-family:Consolas,monospace;font-size:24px;line-height:1.5">GET /pedido/312<br>status: <b>ok</b></div><div style="margin-left:auto;color:#26735b;font-size:62px;font-weight:900">✓</div></div>
      </div>
      <div style="position:absolute;left:62px;right:62px;top:760px;display:flex;align-items:flex-start;gap:24px"><span class="stamp">PERGUNTA DO QA</span><p style="font-size:42px;line-height:1.05;letter-spacing:-.055em;font-weight:900;margin:0;max-width:560px">Mas a regra de negócio foi atendida?</p></div>
    </div>`, 'paper', 2),

  shell(`
    <div class="frame">
      <div class="kicker accent">02 / O QUE CADA UM ENTREGA</div>
      <h2 class="title" style="font-size:91px;margin-top:44px">RESULTADO<br><span class="accent">≠</span> DECISÃO.</h2>
      <div style="position:absolute;left:62px;right:62px;top:442px;display:grid;grid-template-columns:1fr 1fr;gap:0;border:2px solid #789586">
        <div style="padding:32px 32px 36px;background:#1a2a25;border-right:2px solid #789586">
          <div class="micro" style="color:#b9ef63;margin-bottom:34px">A IA AJUDA A...</div>
          <div style="font-size:42px;line-height:1.16;font-weight:800;letter-spacing:-.055em">Repetir<br>Resumir<br>Sugerir</div>
          <div style="height:3px;background:#b9ef63;margin-top:54px;width:50%"></div>
        </div>
        <div style="padding:32px 30px 36px;background:#b9ef63;color:#14221e">
          <div class="micro" style="margin-bottom:34px">O QA PRECISA...</div>
          <div style="font-size:42px;line-height:1.16;font-weight:900;letter-spacing:-.055em">Investigar<br>Priorizar<br>Explicar o risco</div>
          <div style="height:3px;background:#14221e;margin-top:54px;width:50%"></div>
        </div>
      </div>
      <p class="sub" style="position:absolute;left:62px;top:840px;max-width:840px;margin:0">Ferramenta produz opções. Contexto e evidência sustentam a escolha.</p>
    </div>`, '', 3),

  shell(`
    <div class="frame">
      <div class="kicker" style="color:#26735b">03 / UM EXEMPLO CONCRETO</div>
      <h2 class="title" style="font-size:86px;margin-top:42px">O TESTE<br><span class="accent">PASSOU.</span><br>E AGORA?</h2>
      <div style="position:absolute;top:532px;left:62px;right:62px;display:flex;gap:26px;align-items:stretch">
        <div style="width:247px;background:#183c31;color:#f2f4ec;padding:29px 26px;display:flex;flex-direction:column;justify-content:space-between"><span class="micro" style="color:#b9ef63">SINAL</span><strong style="font-size:83px;line-height:.9;letter-spacing:-.09em">✓</strong><span style="font-size:26px;font-weight:700;line-height:1.1">Fluxo<br>verde</span></div>
        <div style="flex:1;border-top:3px solid #183c31;border-bottom:3px solid #183c31;padding:24px 20px 24px 4px"><div class="micro" style="color:#26735b">INVESTIGAÇÃO</div><p style="font-size:37px;line-height:1.13;font-weight:900;letter-spacing:-.055em;margin:25px 0">O pedido foi criado duas vezes no clique duplo.</p><div class="micro">EVIDÊNCIA → IMPACTO → PRÓXIMO PASSO</div></div>
      </div>
      <div style="position:absolute;top:840px;left:62px;right:62px;font-size:30px;font-weight:700;letter-spacing:-.035em">Verde na suíte não encerra a análise do produto.</div>
    </div>`, 'paper', 4),

  shell(`
    <div style="position:absolute;right:-160px;top:190px;border:4px solid #14221e;border-radius:50%;width:650px;height:650px;opacity:.24"></div>
    <div style="position:absolute;right:-75px;top:270px;border:4px solid #14221e;border-radius:50%;width:490px;height:490px;opacity:.24"></div>
    <div class="frame" style="display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:170px">
      <div class="kicker" style="margin-bottom:45px">AGORA É SUA VEZ / QA LAB</div>
      <h2 class="title" style="max-width:960px;font-size:105px">PARE DE<br>SÓ RODAR.<br><span style="color:#23634c">COMECE A</span><br>DECIDIR.</h2>
      <div style="margin-top:38px;background:#14221e;color:#f2f4ec;padding:27px 31px;display:flex;align-items:center;justify-content:space-between;gap:20px"><span style="font-size:29px;font-weight:800;letter-spacing:-.04em;max-width:710px">Pratique em labs com falhas intencionais.</span><span style="font-size:53px;line-height:.8">↗</span></div>
      <div class="micro" style="margin-top:22px">EXPLORE OS LABS GRATUITOS DO QA LAB</div>
    </div>`, 'lime', 5),
];

for (let i = 0; i < slides.length; i++) {
  const basename = `${String(i + 1).padStart(2, '0')}${i === 0 ? '-capa' : i === 4 ? '-cta' : ''}`;
  const htmlPath = join(dir, `${basename}.html`);
  const pngPath = join(dir, `${basename}.png`);
  writeFileSync(htmlPath, slides[i], 'utf8');
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox',
    '--window-size=1080,1080', '--force-device-scale-factor=1',
    '--virtual-time-budget=1000', `--screenshot=${pngPath}`,
    `file:///${htmlPath.replaceAll('\\', '/')}`,
  ], { stdio: 'ignore' });
  console.log(pngPath);
}
