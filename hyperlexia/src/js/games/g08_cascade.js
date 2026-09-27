'use strict';
registerGame({
  id: 'cascade', n: 8, cat: 'words', colors: ['#ff6b6b', '#b0179a'],
  glyph: `${[[20, 70], [40, 70], [60, 70], [20, 50], [60, 50], [40, 30]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="18" height="18" rx="4" fill="#fff" fill-opacity="${i === 5 ? 1 : .75}"/>`).join('')}
    <text x="49" y="44" font-size="13" text-anchor="middle" fill="#b0179a">W</text><path d="M49 12v12m-5-5l5 5 5-5" stroke="#fff" stroke-width="3" fill="none"/>`,
  name: { en: 'Letter Cascade', fr: 'Cascade de lettres' },
  tag: { en: 'Letters rain down. Spell words from anywhere on the board before it overflows.', fr: 'Les lettres tombent. Forme des mots avant que la grille déborde.' },
  how: {
    en: '<p>Letters fall into the columns. <b>Click tiles anywhere</b> (or type letters) to build a word of 3+ letters, then press <b>Enter</b>. Valid words vanish and the stacks drop. Steer the falling letter with ← →. ⭐ tiles double the word; 💣 tiles also clear their whole row. If a column overflows, the game ends.</p>',
    fr: '<p>Les lettres tombent dans les colonnes. <b>Clique des tuiles n’importe où</b> (ou tape les lettres) pour former un mot de 3 lettres ou plus, puis <b>Entrée</b>. Les mots valides disparaissent. Dirige la lettre qui tombe avec ← →. ⭐ double le mot; 💣 efface aussi sa rangée. Si une colonne déborde, c’est fini.</p>',
  },
  why: {
    en: 'A fast, flexible word-search under gentle pressure: it trains switching between spotting letters and planning words — task-switching predicted comprehension via decoding in autistic adolescents (Ober et al., 2021). Relaxed mode removes the pressure.',
    fr: 'Une recherche de mots rapide et souple sous une légère pression : elle entraîne l’alternance entre repérer des lettres et planifier des mots — la flexibilité prédit la compréhension via le décodage chez les ados autistes (Ober et al., 2021).',
  },
  start(api) {
    const VAL = api.lang === 'fr' ? { a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 10, l: 1, m: 2, n: 1, o: 1, p: 3, q: 8, r: 1, s: 1, t: 1, u: 1, v: 4, w: 10, x: 10, y: 10, z: 10 }
      : { a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5, l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, v: 4, w: 4, x: 8, y: 4, z: 10 };
    const COLS = 7, ROWS = 10;
    const menu = () => UI.menu(api, {
      options: [
        { icon: '🌧️', name: { en: 'Classic', fr: 'Classique' }, desc: { en: 'Speed rises every 8 words', fr: 'La vitesse augmente tous les 8 mots' }, go: () => play(1) },
        { icon: '⛈️', name: { en: 'Storm', fr: 'Tempête' }, desc: { en: 'Starts fast', fr: 'Commence vite' }, go: () => play(4) },
      ],
      extra: h('div', { class: 'muted center' }, `${t('best')}: ${fmt(api.best)}`),
    });
    const play = startLv => {
      const cols = Array.from({ length: COLS }, () => []);
      let sel = [], score = 0, words = 0, lv = startLv, over = false, falling = null, fallT = 0, longest = '';
      const root = api.clear();
      const cw = Math.min(62, Math.floor((Math.min(innerWidth, 900) - 60) / COLS));
      const board = h('div', { style: { position: 'relative', width: COLS * cw + 'px', height: ROWS * cw + 'px', margin: '0 auto', borderRadius: '16px', background: 'linear-gradient(180deg,rgba(255,107,107,.08),rgba(176,23,154,.12))', border: '1px solid var(--line)', overflow: 'hidden' } });
      for (let c = 1; c < COLS; c++) board.appendChild(h('div', { style: { position: 'absolute', left: c * cw + 'px', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,.06)' } }));
      const cur = h('div', { class: 'mono', style: { fontSize: '30px', fontWeight: 900, minHeight: '42px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '3px' } });
      const msg = h('div', { style: { minHeight: '22px', textAlign: 'center', fontWeight: 700 } });
      const last = h('div');
      root.appendChild(h('div', { class: 'gwrap' }, cur, msg, board,
        h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '10px' } },
          h('button', { class: 'btn', onclick: () => { sel = []; paint(); } }, t('clear')),
          h('button', { class: 'btn primary', onclick: () => submit() }, '⏎ ' + t('submit')),
          h('button', { class: 'btn', onclick: () => moveFalling(-1) }, '←'), h('button', { class: 'btn', onclick: () => moveFalling(1) }, '→')),
        last));
      const newTile = () => {
        const onBoard = cols.flat(); const vowels = onBoard.filter(t2 => 'aeiou'.includes(t2.l)).length;
        let l = Lex.randLetter(api.lang);
        if (onBoard.length > 4 && vowels / onBoard.length < 0.34) l = pick('aeiou'.split(''));
        if (onBoard.length > 4 && vowels / onBoard.length > 0.55) l = Lex.randLetter(api.lang).replace(/[aeiou]/, 't');
        const r = Math.random();
        const tile = { l, star: r < 0.05, bomb: r > 0.965, el: null };
        tile.el = h('div', { style: { position: 'absolute', width: cw - 6 + 'px', height: cw - 6 + 'px', borderRadius: '10px', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: cw * 0.46 + 'px', cursor: 'pointer', transition: 'top .18s, left .12s, background .15s, transform .15s', userSelect: 'none', color: '#1a0622' } },
          l.toUpperCase(), h('sub', { style: { position: 'absolute', right: '5px', bottom: '2px', fontSize: '10px' } }, VAL[l]), tile.star ? h('span', { style: { position: 'absolute', left: '3px', top: '0', fontSize: '12px' } }, '⭐') : null, tile.bomb ? h('span', { style: { position: 'absolute', left: '3px', top: '0', fontSize: '12px' } }, '💣') : null);
        tile.el.addEventListener('pointerdown', () => toggle(tile));
        return tile;
      };
      const place = (tile, c, rowFromBottom) => { tile.el.style.left = c * cw + 3 + 'px'; tile.el.style.top = (ROWS - 1 - rowFromBottom) * cw + 3 + 'px'; };
      const style = tile => { const s = sel.includes(tile); tile.el.style.background = s ? 'linear-gradient(180deg,#bff5ff,#37e2ff)' : tile.star ? 'linear-gradient(180deg,#fff3c4,#ffc545)' : tile.bomb ? 'linear-gradient(180deg,#ffd0d7,#ff6b6b)' : 'linear-gradient(180deg,#ffffff,#e9dcf0)'; tile.el.style.transform = s ? 'scale(.92)' : ''; };
      const layout = () => cols.forEach((col, c) => col.forEach((tile, r) => { place(tile, c, r); style(tile); }));
      const paint = () => { cur.textContent = sel.map(s => s.l).join(''); cols.flat().forEach(style); };
      const toggle = tile => { if (over || tile === falling?.tile) return; const i = sel.indexOf(tile); if (i >= 0) sel.splice(i, 1); else sel.push(tile); api.sfx('click'); paint(); };
      const spawnFalling = () => {
        const c = rand(COLS);
        if (cols[c].length >= ROWS) return gameOver();
        const tile = newTile(); board.appendChild(tile.el); falling = { tile, c, y: -1 };
        tile.el.style.transition = 'left .12s'; tile.el.style.left = c * cw + 3 + 'px'; tile.el.style.top = -cw + 'px'; style(tile);
      };
      const moveFalling = d => { if (!falling) return; const nc = clamp(falling.c + d, 0, COLS - 1); if (cols[nc].length < ROWS && (ROWS - 1 - cols[nc].length) >= falling.y) { falling.c = nc; falling.tile.el.style.left = nc * cw + 3 + 'px'; api.sfx('tick'); } };
      const land = () => { const { tile, c } = falling; tile.el.style.transition = 'top .18s, left .12s, background .15s, transform .15s'; cols[c].push(tile); falling = null; layout(); api.sfx('pop'); if (cols[c].length >= ROWS) { api.after(200, () => { if (cols.some(col => col.length >= ROWS)) msg.textContent = api.fr ? '⚠️ Colonne pleine !' : '⚠️ Column full!'; }); } };
      const speed = () => (0.9 + lv * 0.28) * (api.relaxed ? 0.55 : 1);
      const stop = api.loop(dt => {
        if (over) return;
        if (!falling) { fallT -= dt; if (fallT <= 0) { spawnFalling(); fallT = Math.max(0.25, 1.4 - lv * 0.1) / (api.relaxed ? 0.6 : 1); } return; }
        falling.y += dt * speed() * 2.2;
        const floor = ROWS - 1 - cols[falling.c].length;
        if (falling.y >= floor) { falling.y = floor; land(); }
        else falling.tile.el.style.top = falling.y * cw + 3 + 'px';
      });
      api.onExit(stop);
      const submit = () => {
        const w = sel.map(s => s.l).join('');
        if (w.length < 3) { api.sfx('bad'); msg.textContent = t('tooShort'); return; }
        if (!Lex.valid(w, api.lang)) { api.sfx('bad'); msg.textContent = t('notWord'); cur.classList.add('shake'); setTimeout(() => cur.classList.remove('shake'), 400); return; }
        let pts = sel.reduce((a, s) => a + VAL[s.l], 0) * w.length;
        if (sel.some(s => s.star)) pts *= 2;
        const bombs = sel.filter(s => s.bomb);
        const kill = new Set(sel);
        bombs.forEach(b => { const c = cols.findIndex(col => col.includes(b)), r = cols[c].indexOf(b); cols.forEach(col => { if (col[r]) kill.add(col[r]); }); });
        kill.forEach(tile => { FX.burst(tile.el.getBoundingClientRect().left + cw / 2, tile.el.getBoundingClientRect().top + cw / 2, '#ff4fd8', 12); tile.el.remove(); });
        for (let c = 0; c < COLS; c++) cols[c] = cols[c].filter(tile => !kill.has(tile));
        score += pts; words++; if (w.length > longest.length) longest = w;
        if (words % 8 === 0) { lv++; api.sfx('level'); msg.textContent = `${t('level')} ${lv}!`; } else msg.textContent = `+${pts}`;
        api.sfx(w.length >= 6 ? 'great' : 'good'); api.float(cur, `+${pts}`);
        const d = Lex.define(w, api.lang); last.innerHTML = ''; if (d) last.appendChild(UI.definition(d));
        sel = []; layout(); paint(); hud();
      };
      const hud = () => api.hud([[t('score'), fmt(score)], [t('level'), lv], [api.fr ? 'Mots' : 'Words', words]]);
      api.key(e => {
        if (over) return;
        if (e.key === 'Enter') { e.preventDefault(); submit(); }
        else if (e.key === 'Backspace') { e.preventDefault(); sel.pop(); paint(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); moveFalling(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); moveFalling(1); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); if (falling) falling.y += 1; }
        else if (e.key === 'Escape') { sel = []; paint(); }
        else if (e.key.length === 1) {
          const c = norm(e.key); if (!/^[a-z]$/.test(c)) return;
          const cand = cols.map(col => [...col].reverse().find(tile => tile.l === c && !sel.includes(tile))).filter(Boolean);
          const all = cols.flat().filter(tile => tile.l === c && !sel.includes(tile));
          const tile = cand[0] || all[0];
          if (tile) { sel.push(tile); api.sfx('click'); paint(); } else api.sfx('bad');
        }
      });
      const gameOver = () => {
        over = true; api.sfx('lose');
        api.finish({ score, stars: score >= 1500 ? 3 : score >= 700 ? 2 : score >= 250 ? 1 : 0, xp: 5 + words * 2, lines: [`${api.fr ? 'Mots' : 'Words'}: ${words} · ${api.fr ? 'Plus long' : 'Longest'}: ${up(Lex.display(longest || '—', api.lang))}`], again: () => play(startLv), menu });
      };
      // start with a few rows
      for (let i = 0; i < 12; i++) { const c = i % COLS; const tile = newTile(); board.appendChild(tile.el); cols[c].push(tile); }
      layout(); hud();
    };
    menu();
  },
});
