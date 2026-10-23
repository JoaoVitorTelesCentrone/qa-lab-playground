const { createRequire } = require('node:module');
const { resolve } = require('node:path');
const requireWeb = createRequire(resolve('packages/web/package.json'));
const { chromium } = requireWeb('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const size = viewport.width > 1000 ? 'desktop' : 'mobile';
      const response = await page.goto('http://localhost:3002/conteudo/1/teoria-1', { waitUntil: 'networkidle' });
      if (response.status() !== 200) throw new Error('A aula não abriu');
      await page.getByRole('tab', { name: 'Leitura', exact: true }).waitFor();
      if (await page.getByRole('tab', { name: 'Leitura', exact: true }).getAttribute('aria-selected') !== 'true') throw new Error('A aula sem vídeo deve abrir na leitura');
      await page.screenshot({ path: `.tmp/learning-lesson-${size}.png`, fullPage: false });
      await page.getByRole('tab', { name: 'Vídeo', exact: true }).click();
      await page.getByRole('heading', { name: 'Videoaulas na mentoria', exact: true }).waitFor();
      await page.getByRole('button', { name: 'Estudar pela leitura', exact: true }).click();
      if (await page.getByRole('tab', { name: 'Leitura', exact: true }).getAttribute('aria-selected') !== 'true') throw new Error('Retorno à leitura falhou');
      await page.getByRole('tab', { name: 'Materiais', exact: true }).click();
      await page.getByRole('heading', { name: 'Material de apoio', exact: true }).waitFor();
      await page.getByRole('tab', { name: 'Leitura', exact: true }).click();
      await page.getByRole('link', { name: 'Continuar', exact: true }).click();
      await page.waitForURL('**/conteudo/1/teoria-2');
      for (const [name, route] of [['theme', '/conteudo/temas/fundamentos-produto-risco'], ['mission', '/conteudo/1/desafio']]) {
        await page.goto(`http://localhost:3002${route}`, { waitUntil: 'networkidle' });
        if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) throw new Error(`Overflow em ${name}/${size}`);
        await page.screenshot({ path: `.tmp/learning-${name}-${size}.png`, fullPage: true });
      }
      if (errors.length) throw new Error(errors.join('\n'));
      results.push({ viewport: size, tabs: 'ok', fallback: 'ok', nextLesson: 'ok', overflow: 'none', pageErrors: errors.length });
      await page.close();
    }
    console.log(JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
