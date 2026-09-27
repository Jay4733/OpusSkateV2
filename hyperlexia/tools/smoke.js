// Smoke test: load Lexiverse.html, open each game, capture console errors + screenshots.
// Usage: NODE_PATH=$(npm root -g) node tools/smoke.js [outdir] [gameId...]
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2] || '/tmp/lexi-shots'; fs.mkdirSync(out, { recursive: true });
  const only = process.argv.slice(3);
  const file = 'file://' + path.resolve(__dirname, '..', 'Lexiverse.html');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.addInitScript(() => { if (!localStorage.getItem('lexiverse.v1')) localStorage.setItem('lexiverse.v1', JSON.stringify({ name: 'Tester', lang: 'en', sound: false })); });
  await page.goto(file);
  await page.waitForTimeout(600);
  await page.screenshot({ path: out + '/landing.png' });
  const ids = only.length ? only : await page.evaluate(() => GAMES.map(g => g.id));
  for (const id of ids) {
    for (const lang of ['en', 'fr']) {
      await page.evaluate(l => { Store.s.lang = l; Store.save(); App.render(); }, lang);
      await page.evaluate(i => App.openGame(i), id);
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${out}/${id}_${lang}_menu.png` });
      const opt = await page.$('.opt');
      if (opt) { await opt.click(); await page.waitForTimeout(900); await page.screenshot({ path: `${out}/${id}_${lang}_play.png` }); }
      await page.evaluate(() => { document.querySelectorAll('.modal-back').forEach(m => m.remove()); App.closeGame(); });
    }
  }
  console.log('games:', ids.length, 'errors:', errors.length);
  errors.slice(0, 40).forEach(e => console.log(e));
  await browser.close();
})();
