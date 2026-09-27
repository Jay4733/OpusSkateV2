// Monkey test: for every game and every menu option, click/type randomly and collect runtime errors.
// Usage: NODE_PATH=$(npm root -g) node tools/monkey.js [steps] [lang] [gameId...]
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const steps = +(process.argv[2] || 30), lang = process.argv[3] || 'en', only = process.argv.slice(4);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
  const errors = [];
  let ctx = '';
  page.on('pageerror', e => errors.push(`[${ctx}] ${e.message} :: ${(e.stack || '').split('\n').slice(1, 3).join(' | ')}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`[${ctx}] console: ${m.text()}`); });
  await page.addInitScript(l => { localStorage.setItem('lexiverse.v1', JSON.stringify({ name: 'Monkey', lang: l, sound: false })); }, lang);
  await page.goto('file://' + path.resolve(__dirname, '..', 'Lexiverse.html'));
  await page.waitForTimeout(500);
  const ids = only.length ? only : await page.evaluate(() => GAMES.map(g => g.id));
  const keys = ['a', 'e', 's', 't', 'r', 'o', 'n', 'i', 'Enter', 'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'z', 'x', 'q', 'w', '1', '2'];
  for (const id of ids) {
    await page.evaluate(i => App.openGame(i), id);
    await page.waitForTimeout(200);
    const nOpts = await page.evaluate(() => document.querySelectorAll('.gscreen .opt').length);
    for (let oi = 0; oi < Math.max(1, nOpts); oi++) {
      ctx = `${id}#${oi}`;
      await page.evaluate(() => { document.querySelectorAll('.modal-back').forEach(m => m.remove()); });
      await page.evaluate(i => { App.closeGame(); App.openGame(i); }, id);
      await page.waitForTimeout(120);
      await page.evaluate(k => { const o = document.querySelectorAll('.gscreen .opt')[k]; if (o) o.click(); }, oi);
      await page.waitForTimeout(250);
      for (let s = 0; s < steps; s++) {
        const r = Math.random();
        if (r < 0.55) {
          await page.evaluate(() => {
            const root = document.querySelector('.modal-back') || document.querySelector('.gscreen .gbody');
            if (!root) return;
            const els = [...root.querySelectorAll('button:not(:disabled), .choice:not(:disabled), [data-m], canvas, input')].filter(e => e.offsetParent !== null && !e.closest('.gbar'));
            const bad = els.filter(e => /Back|Retour|Menu|⌂/.test(e.textContent || '') && Math.random() < 0.85);
            const pool = els.filter(e => !bad.includes(e));
            const el = pool[Math.floor(Math.random() * pool.length)];
            if (!el) return;
            if (el.tagName === 'INPUT') { el.focus(); if (el.type === 'range') { el.value = el.min && el.max ? (+el.min + Math.random() * (el.max - el.min)) : 1; el.dispatchEvent(new Event('input', { bubbles: true })); } else { el.value = 'test'; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); } return; }
            const rc = el.getBoundingClientRect();
            const x = rc.left + Math.random() * rc.width, y = rc.top + Math.random() * rc.height;
            for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) el.dispatchEvent(new (type.startsWith('pointer') ? PointerEvent : MouseEvent)(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
          });
        } else {
          const k = keys[Math.floor(Math.random() * keys.length)];
          await page.keyboard.press(k === ' ' ? 'Space' : k).catch(() => { });
        }
        await page.waitForTimeout(40 + Math.random() * 80);
      }
    }
    await page.evaluate(() => { document.querySelectorAll('.modal-back').forEach(m => m.remove()); App.closeGame(); });
    process.stdout.write(`${id}(${nOpts}) `);
  }
  console.log('\nerrors:', errors.length);
  [...new Set(errors)].slice(0, 60).forEach(e => console.log(e));
  await browser.close();
})();
