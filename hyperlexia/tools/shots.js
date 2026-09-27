// Mid-game screenshots for visual review.
// Usage: NODE_PATH=$(npm root -g) node tools/shots.js outdir [lang] [width] [height]
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2]; const lang = process.argv[3] || 'en';
  const Wd = +(process.argv[4] || 1280), Hd = +(process.argv[5] || 860);
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: Wd, height: Hd }, deviceScaleFactor: 1 });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(l => { localStorage.setItem('lexiverse.v1', JSON.stringify({ name: 'Nova', lang: l, sound: false, xp: 1350, streak: { last: '', count: 4 } })); }, lang);
  await page.goto('file://' + path.resolve(__dirname, '..', 'Lexiverse.html'));
  await page.waitForTimeout(700);
  const W = ms => page.waitForTimeout(ms);
  const shot = n => page.screenshot({ path: `${out}/${n}.png` });
  await shot('00_landing');
  await page.mouse.wheel(0, 700); await W(300); await shot('00_landing_scrolled'); await page.mouse.wheel(0, -2000);
  const open = async (id, opt) => { await page.evaluate(() => document.querySelectorAll('.modal-back').forEach(m => m.remove())); await page.evaluate(i => { App.closeGame(); App.openGame(i); }, id); await W(200); if (opt != null) { await page.evaluate(k => document.querySelectorAll('.gscreen .opt')[k].click(), opt); await W(300); } };
  const click = sel => page.evaluate(s => { const e = typeof s === 'string' ? document.querySelector(s) : null; if (e) e.click(); }, sel);
  const clickText = re => page.evaluate(r => { const e = [...document.querySelectorAll('.gscreen button')].find(b => new RegExp(r).test(b.textContent) && !b.disabled); if (e) e.click(); }, re);

  await open('wheel', 2); await clickText('Spin|Tourner'); await W(6500); await shot('02_wheel');
  await open('invaders', 0); await W(7000); await page.keyboard.type('the'); await W(300); await shot('04_invaders');
  await open('hive', 1); for (const k of 'eeee') await page.keyboard.press(k); await W(200); await shot('05_hive');
  await open('cascade', 0); await W(3500); await shot('08_cascade');
  await open('crossword', 0); for (const k of 'abcde') await page.keyboard.press(k); await W(200); await shot('09_crossword');
  await open('mystery', 0); await page.evaluate(() => document.querySelector('.gscreen .choice').click()); await W(300); await page.evaluate(() => [...document.querySelectorAll('.gscreen .panel .col > div')][1].click()); await W(200); await shot('12_mystery');
  await open('social', 1); await W(4200); await page.evaluate(() => { const c = document.querySelector('.gscreen .choice'); if (c) c.click(); }); await W(900); await shot('13_social');
  await open('convo', 1); await page.evaluate(() => document.querySelector('.gscreen .choice').click()); await W(900); await shot('14_convo');
  await open('nonillion', 4); await page.evaluate(() => [...document.querySelectorAll('.gscreen .chip')][8].click()); await W(1500); await shot('18_machine');
  await open('nonillion', 2); await W(300); await shot('18_cosmic');
  await open('signals', 1); await page.evaluate(() => document.querySelector('.gscreen .opt').click()); await W(300); await shot('20_braille');
  await open('staff', 0); await W(300); await shot('21_staff');
  await open('piano', 0); await page.evaluate(() => document.querySelector('.gscreen .opt').click()); await W(4500); await shot('22_piano');
  await open('ear', 3); await W(600); await shot('23_ear');
  await open('snake', 0); await W(2500); await shot('24_snake');
  await open('racer', 0); await W(3500); await shot('25_racer');
  await open('grid', 0); await W(300); await shot('06_grid');
  await open('lock', 0); for (const k of (lang === 'fr' ? 'monde' : 'about')) await page.keyboard.press(k); await page.keyboard.press('Enter'); await W(2200); await shot('01_lock');
  await open('groups', 0); await W(200); await shot('10_groups');
  await open('sequencer', 6); await W(200); await shot('15_causes');
  await open('proof', 0); await page.evaluate(() => document.querySelector('.gscreen [data-err]').click()); await W(200); await shot('16_proof');
  await page.evaluate(() => { document.querySelectorAll('.modal-back').forEach(m => m.remove()); App.closeGame(); App.parents(); }); await W(400); await shot('90_parents');
  await page.evaluate(() => { document.querySelectorAll('.modal-back').forEach(m => m.remove()); App.profile(); }); await W(400); await shot('91_profile');
  console.log('errors', errors.length, errors.slice(0, 5));
  await browser.close();
})();
