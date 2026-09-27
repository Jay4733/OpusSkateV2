// Mobile screenshots (iPhone-sized viewport, touch).
// Usage: NODE_PATH=$(npm root -g) node tools/mobile.js outdir
const path = require('path'); const fs = require('fs');
const { chromium, devices } = require('playwright');
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(() => { localStorage.setItem('lexiverse.v1', JSON.stringify({ name: 'Nova', lang: 'fr', sound: false, xp: 500 })); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'Lexiverse.html'));
  await page.waitForTimeout(700);
  const W = ms => page.waitForTimeout(ms);
  await page.screenshot({ path: `${out}/m_landing.png` });
  const list = [['lock', 1], ['wheel', 2], ['invaders', 0], ['hive', 1], ['crossword', 0], ['mystery', 0], ['social', 1], ['piano', 0], ['racer', 0], ['snake', 0], ['nonillion', 0], ['cascade', 0]];
  for (const [id, o] of list) {
    await page.evaluate(i => { document.querySelectorAll('.modal-back').forEach(m => m.remove()); App.closeGame(); App.openGame(i); }, id); await W(250);
    await page.evaluate(k => { const e = document.querySelectorAll('.gscreen .opt')[k]; if (e) e.click(); }, o); await W(1200);
    if (id === 'piano') { await page.evaluate(() => { const e = document.querySelector('.gscreen .opt'); if (e) e.click(); }); await W(2500); }
    await page.screenshot({ path: `${out}/m_${id}.png` });
  }
  const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  console.log('errors', errors.length, errors.slice(0, 3), 'scrollWidth/innerWidth', sw);
  await browser.close();
})();
