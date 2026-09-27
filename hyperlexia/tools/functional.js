// Functional tests: play core loops correctly and assert outcomes.
// Usage: NODE_PATH=$(npm root -g) node tools/functional.js [lang]
const path = require('path');
const { chromium } = require('playwright');
const lang = process.argv[2] || 'en';
const results = [];
const ok = (name, cond, info = '') => { results.push([cond ? 'PASS' : 'FAIL', name, info]); };
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(l => { localStorage.setItem('lexiverse.v1', JSON.stringify({ name: 'Tester', lang: l, sound: false })); }, lang);
  await page.goto('file://' + path.resolve(__dirname, '..', 'Lexiverse.html'));
  await page.waitForTimeout(400);
  const W = ms => page.waitForTimeout(ms);
  const open = async (id, opt = 0) => { await page.evaluate(() => document.querySelectorAll('.modal-back').forEach(m => m.remove())); await page.evaluate(i => { App.closeGame(); App.openGame(i); }, id); await W(150); if (opt != null) { await page.evaluate(k => document.querySelectorAll('.gscreen .opt')[k].click(), opt); await W(300); } };
  const modalText = () => page.evaluate(() => { const m = document.querySelector('.modal-back'); return m ? m.innerText : ''; });
  const stars = () => page.evaluate(() => { const m = document.querySelector('.modal-back .result .stars'); return m ? (m.innerHTML.match(/★/g) || []).length - (m.innerHTML.match(/class="off"/g) || []).length : -1; });

  // ---- Lexicon Lock: a valid guess colours tiles
  await open('lock', 1);
  const guess = lang === 'fr' ? 'monde' : 'about';
  for (const c of guess) await page.keyboard.press(c);
  await page.keyboard.press('Enter'); await W(2000);
  const colored = await page.evaluate(() => [...document.querySelectorAll('.gscreen .tile')].slice(0, 5).filter(t => t.style.background).length);
  ok('lock: guess colours 5 tiles', colored === 5, `coloured=${colored}`);

  // ---- Cipher: campaign mission 1 (Caesar) solvable with slider
  await open('cipher', 0);
  let solved = false;
  for (let k = 0; k <= 25 && !solved; k++) {
    solved = await page.evaluate(v => { const sl = document.querySelector('.gscreen input[type=range]'); sl.value = v; sl.dispatchEvent(new Event('input')); const b = [...document.querySelectorAll('.gscreen .btn.primary')].find(x => /Lock|Verrouiller/.test(x.textContent)); b.click(); return !!document.querySelector('.gscreen .fb.good'); }, k);
  }
  ok('cipher: caesar mission solvable', solved);

  // ---- Crossword: every theme generates a decent grid
  const nCross = await page.evaluate(() => { App.closeGame(); App.openGame('crossword'); return document.querySelectorAll('.gscreen .opt').length; });
  for (let i = 0; i < nCross; i++) {
    await open('crossword', i);
    const n = await page.evaluate(() => document.querySelectorAll('.gscreen h3 + .col > div').length);
    ok(`crossword: theme ${i} has ≥8 clues`, n >= 8, `clues=${n}`);
  }

  // ---- Hive daily + random
  for (const o of [0, 1]) { await open('hive', o); const txt = await page.evaluate(() => (document.querySelector('#hivecount') || {}).textContent || ''); const n = +txt.split('/')[1]; ok(`hive: puzzle ${o} has 15–80 words`, n >= 15 && n <= 80, txt); }

  // ---- Grid: word count
  for (const o of [0, 1]) { await open('grid', o); const h = await page.evaluate(() => document.querySelector('.hud').innerText); const n = +(h.match(/\/(\d+)/) || [0, 0])[1]; ok(`grid: board ${o} has ≥25 words`, n >= 25, h.replace(/\n/g, ' ')); }

  // ---- Ladder: every option produces a puzzle
  for (let o = 0; o < 4; o++) { await open('ladder', o); const tiles = await page.evaluate(() => document.querySelectorAll('.gscreen .tile').length); ok(`ladder: option ${o} renders`, tiles > 4, `tiles=${tiles}`); }

  // ---- Four Groups: solve puzzle #1 perfectly
  await open('groups', null);
  await page.evaluate(() => [...document.querySelectorAll('.gscreen .chip')].find(c => c.textContent.startsWith('#1')).click()); await W(200);
  for (let g = 0; g < 4; g++) {
    await page.evaluate(gi => { const words = GROUPS[Store.s.lang][0][gi].words; const btns = [...document.querySelectorAll('.gscreen button')]; words.forEach(w => btns.find(b => b.textContent === w).click()); [...document.querySelectorAll('.gscreen .btn.primary')].find(b => /Submit|Valider/.test(b.textContent)).click(); }, g);
    await W(150);
  }
  await W(1200);
  ok('groups: perfect solve gives 3 stars', (await stars()) === 3, `stars=${await stars()}`);

  // ---- Mystery Files: every case solved with full evidence
  for (let ci = 0; ci < 6; ci++) {
    await open('mystery', ci);
    const n = await page.evaluate(ci2 => MYSTERIES[Store.s.lang][ci2].q.length, ci);
    for (let qi = 0; qi < n; qi++) {
      await page.evaluate(([ci2, qi2]) => {
        const q = MYSTERIES[Store.s.lang][ci2].q[qi2];
        [...document.querySelectorAll('.gscreen .choice')].find(b => b.textContent === q.o[0]).click();
        const sents = [...document.querySelectorAll('.gscreen .panel .col > div')];
        q.ev.forEach(i => sents[i].click());
        [...document.querySelectorAll('.gscreen .btn.primary')].find(b => /evidence|preuve/i.test(b.textContent)).click();
        const nx = [...document.querySelectorAll('.gscreen .btn.primary')].pop(); nx.click();
      }, [ci, qi]);
      await W(80);
    }
    await W(300);
    ok(`mystery: case ${ci} → 3 stars`, (await stars()) === 3, `stars=${await stars()}`);
  }

  // ---- Conversation Quest: best replies → 100%
  for (let si = 0; si < 6; si++) {
    await open('convo', si);
    const steps = await page.evaluate(s => CONVO[Store.s.lang][s].steps.length, si);
    for (let k = 0; k < steps; k++) {
      await page.evaluate(([s, k2]) => { const st = CONVO[Store.s.lang][s].steps[k2]; const best = st[1].reduce((a, b) => b[2] > a[2] ? b : a); const me = Store.s.name; [...document.querySelectorAll('.gscreen .choice')].find(b => b.textContent === best[0].replace('{me}', me)).click(); }, [si, k]);
      await W(650);
      await page.evaluate(() => [...document.querySelectorAll('.gscreen .btn.primary')].pop().click());
      await W(80);
    }
    await W(300);
    const txt = await modalText();
    ok(`convo: scenario ${si} best path = 100%`, /100/.test(txt), txt.split('\n')[0]);
  }

  // ---- Proofreader: fix every error in all 8 texts
  await open('proof', 1);
  for (let ti = 0; ti < 8; ti++) {
    const done = await page.evaluate(() => {
      const spans = [...document.querySelectorAll('.gscreen [data-err]')];
      const txts = PROOF[Store.s.lang].texts;
      const cur = txts.find(t2 => { const segs = t2.split(/(\[[^\]]+\])/).filter(x => x.startsWith('[')).map(x => x.slice(1, -1).split('|')[0]); return segs.length === spans.length && segs.every((w, i) => w === spans[i].textContent); });
      if (!cur) return 'nomatch';
      const rights = cur.split(/(\[[^\]]+\])/).filter(x => x.startsWith('[')).map(x => x.slice(1, -1).split('|')[1]);
      spans.forEach((sp, i) => { sp.click(); const b = [...document.querySelectorAll('.gscreen .btn.sm')].find(x => x.textContent === rights[i] && x.closest('div[style*="absolute"]')); if (b) b.click(); });
      return spans.every(s => s.dataset.done) ? 'ok' : 'partial';
    });
    ok(`proof: text ${ti} all errors fixable`, done === 'ok', done);
    await page.evaluate(() => { const b = [...document.querySelectorAll('.gscreen .btn.primary.lg')].pop(); if (b) b.click(); });
    await W(120);
  }
  await W(300);
  ok('proof: finish modal after 8 texts', (await stars()) >= 2, `stars=${await stars()}`);

  // ---- Idioms: all correct
  await open('idioms', lang === 'fr' ? 1 : 0);
  for (let s = 0; s < 22; s++) {
    const st = await page.evaluate(() => {
      if (document.querySelector('.modal-back')) return 'done';
      const lit = [...document.querySelectorAll('.gscreen .btn.lg')].filter(b => !b.disabled);
      if (lit.length === 2) { const sent = document.querySelector('.gscreen .panel div[style*="Georgia"]').textContent.replace(/[“”]/g, ''); const all = [...LITFIG.en, ...LITFIG.fr]; const it = all.find(x => x[0] === sent); lit[it && it[1] === 'F' ? 1 : 0].click(); const nx = [...document.querySelectorAll('.gscreen .btn.primary')].pop(); if (nx) nx.click(); return 'lf'; }
      const ex = document.querySelector('.gscreen div[style*="Georgia"]'); if (!ex) { const nx = [...document.querySelectorAll('.gscreen .btn.primary')].pop(); if (nx) nx.click(); return 'nx'; }
      const x = ex.textContent.replace(/[“”]/g, ''); const it = [...IDIOMS.en, ...IDIOMS.fr].find(i => i.x === x);
      const b = [...document.querySelectorAll('.gscreen .choice')].find(c => it && c.textContent === it.m && !c.disabled); if (b) b.click();
      const nx = [...document.querySelectorAll('.gscreen .btn.primary')].pop(); if (nx) nx.click();
      return 'q';
    });
    if (st === 'done') break; await W(80);
  }
  await W(300);
  ok('idioms: perfect case → 3 stars', (await stars()) === 3, `stars=${await stars()}`);

  // ---- Root Lab: build all 10 correctly
  await open('roots', 0);
  for (let q = 0; q < 10; q++) {
    await page.evaluate(() => {
      const def = document.querySelector('.gscreen .card div[style*="26px"]').textContent.replace(/[“”]/g, '');
      const w = ROOTWORDS.find(x => (Store.s.lang === 'fr' ? x.dfr : x.den) === def);
      const tray = [...document.querySelectorAll('.gscreen .row')].find(r => r.querySelectorAll('button').length >= 5);
      w.r.forEach(r => [...tray.querySelectorAll('button')].find(b => b.firstChild.textContent === r).click());
      [...document.querySelectorAll('.gscreen .btn.primary.lg')][0].click();
      [...document.querySelectorAll('.gscreen .btn.primary')].pop().click();
    });
    await W(80);
  }
  await W(300);
  ok('roots: build 10/10 → 3 stars', (await stars()) === 3, `stars=${await stars()}`);

  // ---- Pianissimo learn mode: play Frère Jacques by keyboard
  await open('piano', 1); // song 2 = Frère Jacques
  await page.evaluate(() => [...document.querySelectorAll('.gscreen .opt')][1].click()); // Learn
  await W(300);
  const plan = await page.evaluate(() => { const s = SONGS.find(x => x.id === 'jacques'); const ms = s.notes.map(n => n.m); const base = Math.floor(Math.min(...ms) / 12) * 12; const { rev } = Music.trackerMap(base); return { keys: s.notes.map(n => rev[n.m].toLowerCase()), durs: s.notes.map(n => n.d * 60 / s.bpm) }; });
  await W(3 * 60 / 110 * 1000 + 300);
  for (let i = 0; i < plan.keys.length; i++) { await page.keyboard.press(plan.keys[i]); await W(Math.max(150, plan.durs[i] * 1000 + 60)); }
  await W(1800);
  const pt = await modalText();
  ok('piano: learn mode completes with lyrics', /Perfect\s+32/.test(pt), pt.split('\n').slice(0, 3).join(' | '));

  // ---- Morse tap: key an E (dot) and a T (dash)
  await open('signals', 5);
  const target = await page.evaluate(() => document.querySelector('.gscreen div[style*="90px"]').textContent);
  const code = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..' }[target];
  for (const ch of code) { await page.keyboard.down('Space'); await W(ch === '.' ? 80 : 400); await page.keyboard.up('Space'); await W(150); }
  await W(1100);
  const sc = await page.evaluate(() => document.querySelector('.hud').innerText);
  ok(`signals: morse tap ${target} scores`, /[1-9]\d*/.test((sc.match(/(Score|Score)\s+(\d+)/) || [])[2] || '0'), sc.replace(/\n/g, ' '));

  console.log(results.map(r => r.join(' · ')).join('\n'));
  console.log(`\n${results.filter(r => r[0] === 'PASS').length}/${results.length} passed · page errors: ${errors.length}`);
  errors.slice(0, 10).forEach(e => console.log('ERR', e));
  await browser.close();
})();
