const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require(require.resolve('pdf-lib', { paths: [path.resolve(__dirname, '../packages/web')] }));

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'curso-videos');
const output = path.join(__dirname, 'apresentacao-videoaulas-mentoria.pdf');
const W = 960;
const H = 540;
const C = {
  bg: rgb(0.10, 0.16, 0.17),
  panel: rgb(0.16, 0.24, 0.25),
  mint: rgb(0.70, 0.83, 0.82),
  coral: rgb(0.91, 0.65, 0.63),
  lime: rgb(0.83, 0.96, 0.43),
  white: rgb(0.94, 0.96, 0.94),
  muted: rgb(0.64, 0.72, 0.71),
  line: rgb(0.30, 0.40, 0.40),
};

const themes = [
  { name: 'Produto, risco e exploração', focus: 'Entender a jornada antes de decidir o que investigar.', artifact: 'Mapa da jornada, riscos e registro exploratório.' },
  { name: 'Desenho e comunicação', focus: 'Transformar regras em cenários e evidências úteis.', artifact: 'Cenários, bug report e recomendação de release.' },
  { name: 'Automação web', focus: 'Escolher uma proteção útil e construir um smoke estável.', artifact: 'Matriz de candidatos e primeiro teste executável.' },
  { name: 'APIs e confiabilidade', focus: 'Validar contratos, permissões e saúde da suíte.', artifact: 'Collection local, checagens e diagnóstico de flakiness.' },
  { name: 'CI/CD e operação', focus: 'Converter verificações em feedback e triagem.', artifact: 'Pipeline, gates e resposta a incidentes simulados.' },
  { name: 'Acessibilidade e performance', focus: 'Avaliar a tarefa e a confiabilidade sob carga segura.', artifact: 'Evidência de acessibilidade e relatório local de carga.' },
  { name: 'Projeto de conclusão', focus: 'Reunir evidências e defender uma decisão de qualidade.', artifact: 'Case integrado e apresentação de portfólio.' },
];

function extractLessons() {
  return fs.readdirSync(source, { withFileTypes: true })
    .filter(e => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))
    .map((dir, theme) => fs.readdirSync(path.join(source, dir.name))
      .filter(f => f.endsWith('.md')).sort()
      .map(file => {
        const content = fs.readFileSync(path.join(source, dir.name, file), 'utf8');
        const title = content.match(/^# \d+\s+[—-]\s+(.+)$/m)?.[1];
        const outcome = content.match(/## Resultado da aula\s+[\s\S]*?\*\*([^*]+)\*\*/)?.[1];
        const key = content.match(/\*\*Chave no produto:\*\*\s+`([^`]+)`/)?.[1];
        if (!title || !outcome || !key) throw new Error(`Roteiro incompleto: ${file}`);
        return { title, outcome: outcome.replace(/\s+/g, ' ').replace(/\.$/, ''), key, theme };
      })).flat();
}

function drawText(page, value, x, y, size, font, color = C.white, options = {}) {
  page.drawText(value, { x, y, size, font, color, ...options });
}

function fit(value, font, size, maxWidth) {
  if (font.widthOfTextAtSize(value, size) <= maxWidth) return value;
  let trimmed = value;
  while (trimmed.length && font.widthOfTextAtSize(`${trimmed}…`, size) > maxWidth) trimmed = trimmed.slice(0, -1);
  return `${trimmed.trimEnd()}…`;
}

function base(pdf, pageNo, kicker, title, subtitle, fonts) {
  const page = pdf.addPage([W, H]);
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
  page.drawRectangle({ x: 0, y: H - 8, width: W, height: 8, color: C.lime });
  drawText(page, kicker.toUpperCase(), 54, 476, 10, fonts.bold, C.lime, { characterSpacing: 1.8 });
  drawText(page, title, 54, 432, 30, fonts.bold, C.white);
  drawText(page, subtitle, 54, 404, 12, fonts.regular, C.muted);
  page.drawLine({ start: { x: 54, y: 385 }, end: { x: 906, y: 385 }, thickness: 1, color: C.line });
  drawText(page, 'QA LAB  /  MENTORIA V2', 54, 25, 9, fonts.bold, C.mint, { characterSpacing: 1 });
  drawText(page, String(pageNo).padStart(2, '0'), 880, 25, 10, fonts.bold, C.muted);
  return page;
}

function panel(page, x, y, width, height) {
  page.drawRectangle({ x, y, width, height, color: C.panel, borderColor: C.line, borderWidth: 0.6 });
}

async function main() {
  const lessons = extractLessons();
  if (lessons.length !== 40) throw new Error(`Esperadas 40 aulas, encontradas ${lessons.length}`);
  const pdf = await PDFDocument.create();
  pdf.setTitle('Plano de videoaulas | Mentoria QA Lab');
  pdf.setAuthor('QA Lab');
  pdf.setSubject('40 videoaulas da mentoria QA Lab v2');
  const fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    italic: await pdf.embedFont(StandardFonts.HelveticaOblique),
  };

  // Abertura
  {
    const page = pdf.addPage([W, H]);
    page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
    page.drawRectangle({ x: 0, y: H - 10, width: W, height: 10, color: C.lime });
    drawText(page, 'QA LAB  /  PLANO DE PRODUÇÃO', 58, 456, 13, fonts.bold, C.mint, { characterSpacing: 2 });
    drawText(page, '40 vídeos para', 58, 342, 53, fonts.bold, C.white);
    drawText(page, 'a mentoria QA Lab', 58, 278, 53, fonts.bold, C.lime);
    drawText(page, 'Uma trilha de 7 temas e 28 capítulos, da investigação ao case final.', 60, 211, 18, fonts.regular, C.muted);
    panel(page, 58, 70, 844, 82);
    drawText(page, '40 VIDEOAULAS', 82, 108, 16, fonts.bold, C.white);
    drawText(page, '7 TEMAS', 360, 108, 16, fonts.bold, C.white);
    drawText(page, '6 HORAS', 585, 108, 16, fonts.bold, C.white);
    drawText(page, 'alvo: 9 min cada · teto: 10 min', 82, 86, 11, fonts.regular, C.muted);
  }

  // Mapa da trilha
  {
    const page = base(pdf, 2, 'visão geral', 'O caminho das 40 aulas', 'Cada vídeo termina em uma ação observável no laboratório.', fonts);
    themes.forEach((theme, i) => {
      const y = 337 - i * 45;
      drawText(page, String(i + 1).padStart(2, '0'), 58, y, 17, fonts.bold, C.lime);
      drawText(page, theme.name, 108, y + 1, 17, fonts.bold, C.white);
      drawText(page, `${lessons.filter(l => l.theme === i).length} vídeos`, 790, y + 2, 11, fonts.bold, C.mint);
      if (i < themes.length - 1) page.drawLine({ start: { x: 108, y: y - 14 }, end: { x: 906, y: y - 14 }, thickness: 0.6, color: C.line });
    });
  }

  // Uma página para cada tema; contém todos os vídeos e o resultado de cada aula.
  themes.forEach((theme, themeIndex) => {
    const items = lessons.filter(l => l.theme === themeIndex);
    const page = base(pdf, themeIndex + 3, `tema ${themeIndex + 1} de 7`, theme.name, theme.focus, fonts);
    const rowHeight = items.length === 7 ? 41 : items.length === 3 ? 76 : 48;
    let y = 354;
    items.forEach((lesson, j) => {
      const top = y;
      drawText(page, String(j + 1).padStart(2, '0'), 57, top, 15, fonts.bold, C.lime);
      drawText(page, fit(lesson.title, fonts.bold, 15, 395), 102, top, 15, fonts.bold, C.white);
      drawText(page, fit(lesson.outcome, fonts.regular, 11, 740), 102, top - 17, 11, fonts.regular, C.muted);
      if (j < items.length - 1) page.drawLine({ start: { x: 102, y: top - 26 }, end: { x: 905, y: top - 26 }, thickness: 0.5, color: C.line });
      y -= rowHeight;
    });
    panel(page, 54, 53, 852, 36);
    drawText(page, 'ENTREGA DO TEMA', 69, 66, 9, fonts.bold, C.lime, { characterSpacing: 1 });
    drawText(page, fit(theme.artifact, fonts.regular, 11, 680), 212, 65, 11, fonts.regular, C.white);
  });

  // Prioridade editorial da primeira leva
  {
    const page = base(pdf, 10, 'ordem de gravação', 'Comece por estas 17 aulas', 'Primeira leva definida pelo plano de produção da mentoria.', fonts);
    const priority = [
      ['Fundamento', 'O que um QA decide', 'Exploração guiada', 'Teste exploratório', 'Técnicas que economizam tempo', 'Bug report que resolve'],
      ['Automação', 'O que vale automatizar', 'Primeiro teste executável', 'Seletores e massa', 'API como produto', 'Contrato e dados', 'Suíte sustentável'],
      ['Entrega', 'Pipeline do commit ao feedback', 'GitHub Actions seguro', 'Quality gate não é número mágico', 'Planejar e executar carga com segurança', 'Ler métricas e definir thresholds', 'Como contar seu case'],
    ];
    const cols = [54, 346, 638];
    priority.forEach((group, i) => {
      panel(page, cols[i], 77, 268, 279);
      drawText(page, group[0].toUpperCase(), cols[i] + 18, 327, 11, fonts.bold, C.lime, { characterSpacing: 1.3 });
      group.slice(1).forEach((title, j) => {
        drawText(page, fit(`${String(j + 1).padStart(2, '0')}  ${title}`, fonts.regular, 11, 229), cols[i] + 18, 293 - j * 39, 11, fonts.regular, C.white);
      });
    });
    drawText(page, 'Depois, grave as 23 aulas restantes na sequência dos temas.', 54, 54, 12, fonts.italic, C.mint);
  }

  // Guia de produção
  {
    const page = base(pdf, 11, 'produção', 'Uma decisão por vídeo', 'Ritmo padrão: conceito breve, demonstração e prática do aluno.', fonts);
    const steps = [
      ['0:00–0:30', 'Pergunta concreta que a aula responde'],
      ['0:30–1:30', 'Contexto do produto e risco observado'],
      ['1:30–3:00', 'Conceito com exemplo do caso'],
      ['3:00–6:30', 'Demonstração com entrada, ação e resultado visível'],
      ['6:30–8:00', 'Critério de decisão e limite da conclusão'],
      ['8:00–9:00', 'Ação prática e evidência a produzir'],
    ];
    steps.forEach((s, i) => {
      const y = 348 - i * 43;
      drawText(page, s[0], 57, y, 14, fonts.bold, C.lime);
      drawText(page, s[1], 196, y + 1, 14, fonts.regular, C.white);
    });
    panel(page, 54, 53, 852, 47);
    drawText(page, 'Antes de publicar:', 69, 73, 11, fonts.bold, C.mint);
    drawText(page, 'dados sintéticos · ambiente autorizado · legendas revisadas · duração real registrada', 195, 73, 10.5, fonts.regular, C.white);
  }

  await fs.promises.writeFile(output, await pdf.save());
  console.log(`${output} | ${pdf.getPageCount()} páginas | ${lessons.length} vídeos`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
