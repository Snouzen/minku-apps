const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText, filename);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const XLSX = require('xlsx');
const puppeteer = require('puppeteer-core');
const base = '../src/app/(main)/laporan-harian/components/';
const { summarizeMaklon } = require(base + 'maklon.ts');
const Slide = require(base + 'SlideRealisasiPSOMakloon.tsx').default;
const Panel = require(base + 'MaklonPanel.tsx').default;

(async () => {
  const workbook = XLSX.readFile(process.argv[2], { cellDates: true });
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  const columns = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0];
  const summary = summarizeMaklon(rows, {});
  const cssDir = path.resolve('.next/static/chunks');
  const css = fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).map(f => fs.readFileSync(path.join(cssDir, f), 'utf8')).join('\n');
  const html = (body) => `<!doctype html><html><head><style>${css}</style></head><body>${body.replace(/src="(\/[^\"]+)"/g, (match, file) => {
    const local = path.join(process.cwd(), 'public', file.slice(1));
    if (!fs.existsSync(local)) return match;
    const mime = file.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    return `src="data:${mime};base64,${fs.readFileSync(local).toString('base64')}"`;
  })}</body></html>`;
  const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p => p && fs.existsSync(p));
  assert.ok(executablePath, 'Local Chromium required for visual QA');
  const browser = await puppeteer.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.setContent(html(renderToStaticMarkup(React.createElement(Slide, { maklonSummary: summary }))));
    const layout = await page.evaluate(() => {
      const tables = [...document.querySelectorAll('table')];
      const right = tables[0].getBoundingClientRect();
      return { right: right.right, bottom: right.bottom, text: document.body.innerText };
    });
    assert.ok(layout.right <= 1280 && layout.bottom < 650, 'Maklon table must fit Slide 5 above footer');
    assert.ok(layout.text.includes('07 Oktober 2026'));
    assert.equal(await page.evaluate(() => document.querySelectorAll('table').length), 1);
    assert.ok(!layout.text.includes('PSO'), 'Slide 5 must contain only Maklon');
    const finalTable = await page.evaluate(() => {
      const table = document.querySelectorAll('table')[0];
      return { headers: [...table.querySelectorAll('thead tr:nth-child(2) th')].map(el => el.textContent), count: table.querySelectorAll('tbody tr').length, first: table.querySelector('tbody tr td:nth-child(2)').textContent, last: table.querySelector('tbody tr:last-child td:nth-child(2)').textContent, totals: [...table.querySelectorAll('tfoot td')].map(el => el.textContent) };
    });
    assert.deepEqual(finalTable.headers, ['Drying', 'Mixing', 'Rebagging', 'Reproses', 'Olah GKP–Beras HGL', 'Pengeringan Jagung']);
    assert.equal(finalTable.count, 24);
    assert.equal(finalTable.totals.length, 13);
    assert.equal(await page.evaluate(() => document.querySelectorAll('thead tr:last-child th').length), 12);
    assert.equal(finalTable.first, 'SPB Jakarta');
    assert.equal(finalTable.last, 'SPJ Dompu');
    assert.deepEqual(finalTable.totals.filter((_, i) => i === 0 || i % 2 === 1), ['Total', '95,126', '751,200', '15,352,970', '4,670,570', '3,622,446', '305,620']);
    if (process.argv[3]) {
      await page.screenshot({ path: process.argv[3] });
      await page.addScriptTag({ path: path.resolve('node_modules/html-to-image/dist/html-to-image.js') });
      const exported = await page.evaluate(() => window.htmlToImage.toJpeg(document.querySelector('div.w-\\[1280px\\]'), { quality: 0.95, pixelRatio: 2, width: 1280, height: 720, backgroundColor: '#ffffff', skipFonts: true }));
      fs.writeFileSync(process.argv[3] + '.export.jpg', Buffer.from(exported.split(',')[1], 'base64'));
    }
    // Both conditional notices must stay separate below the table in exported SVG.
    await page.setContent(html(renderToStaticMarkup(React.createElement(Slide, { maklonSummary: { ...summary, reviewCount: 3, excludedCount: 2 } }))));
    const notesLayout = await page.evaluate(() => {
      const table = document.querySelector('table').getBoundingClientRect();
      const notes = document.querySelector('[data-maklon-notes]').getBoundingClientRect();
      const lines = [...document.querySelectorAll('[data-maklon-notes] text')].map(el => el.getBoundingClientRect());
      return { gap: notes.top - table.bottom, bottom: notes.bottom, separate: lines.every((line, i) => i === 0 || line.top > lines[i - 1].bottom), count: lines.length };
    });
    assert.ok(notesLayout.gap >= 9 && notesLayout.bottom < 650 && notesLayout.separate);
    assert.equal(notesLayout.count, 3);
    await page.setContent(html(renderToStaticMarkup(React.createElement(Panel, { rows, columns, overrides: {}, onEdit() {}, summary }))));
    assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('thead th')].map(el => el.textContent)), columns, 'Raw headers must exactly follow Excel');
    const editable = await page.evaluate(() => ({ selects: document.querySelectorAll('tbody select').length, inputs: document.querySelectorAll('tbody input, tbody textarea, tbody [contenteditable]').length, labels: [...document.querySelectorAll('tbody select')].every(el => el.getAttribute('aria-label').startsWith('Kegiatan baris ')) }));
    assert.deepEqual(editable, { selects: 50, inputs: 0, labels: true });
    console.log('Slide fits 1280x720; SO date preserved; single Maklon table; only activity cells editable; pagination renders 50 rows.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
