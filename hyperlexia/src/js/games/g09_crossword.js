'use strict';
registerGame({
  id: 'crossword', n: 9, cat: 'meaning', colors: ['#e8e8f0', '#6b7cff'],
  glyph: `${[[0, 0, 1], [1, 0, 1], [2, 0, 1], [3, 0, 0], [0, 1, 0], [2, 1, 1], [3, 1, 0], [0, 2, 1], [1, 2, 1], [2, 2, 1], [3, 2, 1], [2, 3, 1]].map(([c, r, on]) => `<rect x="${16 + c * 17}" y="${16 + r * 17}" width="16" height="16" fill="${on ? '#fff' : '#2a2f6b'}"/>`).join('')}
    <text x="19" y="25" font-size="7" fill="#6b7cff">1</text><text x="54" y="25" font-size="7" fill="#6b7cff">2</text><path d="M72 78l14-14" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M68 82l4-4" stroke="#6b7cff" stroke-width="5"/>`,
  name: { en: 'Crossword Forge', fr: 'Forge à mots croisés' },
  tag: { en: 'A fresh crossword every time, forged from definitions.', fr: 'Une nouvelle grille à chaque fois, forgée à partir de définitions.' },
  how: {
    en: '<p>Click a square (click again to switch Across/Down) and type. Arrow keys move; Tab jumps to the next clue. <b>Check</b> marks wrong letters, <b>Reveal</b> gives a letter (costs a star). Pick a theme — music, science, numbers, feelings… — for a brand-new grid.</p>',
    fr: '<p>Clique une case (clique encore pour changer Horizontal/Vertical) et tape. Les flèches déplacent; Tab passe à la définition suivante. <b>Vérifier</b> marque les erreurs, <b>Révéler</b> donne une lettre (coûte une étoile). Accents non requis. Choisis un thème pour une grille toute neuve.</p>',
  },
  why: {
    en: 'Every clue is a definition, so solving means going from meaning to word — the direction that is hardest for hyperlexic readers and most predictive of comprehension (Brown et al., 2013; Sorenson Duncan et al., 2021).',
    fr: 'Chaque indice est une définition : il faut passer du sens au mot — la direction la plus difficile pour les lecteurs hyperlexiques et la plus liée à la compréhension (Brown et al., 2013; Sorenson Duncan et al., 2021).',
  },
  start(api) {
    const pool = cat => Lex.get(api.lang).gloss.map(g => ({ a: norm(g.w).toUpperCase(), clue: g.d, cat: g.c, w: g.w })).filter(x => /^[A-Z]{3,10}$/.test(x.a) && (!cat || x.cat === cat));
    const generate = cat => {
      const src = pool(cat); let best = null;
      for (let attempt = 0; attempt < 40; attempt++) {
        const words = shuffle(src).slice(0, 26).sort((a, b) => b.a.length - a.a.length);
        const N = 17, g = Array.from({ length: N }, () => Array(N).fill(null)), placed = [];
        const can = (w, r, c, dir) => {
          const dr = dir === 'D' ? 1 : 0, dc = dir === 'A' ? 1 : 0; let cross = 0;
          const er = r + dr * (w.length - 1), ec = c + dc * (w.length - 1);
          if (r < 0 || c < 0 || er >= N || ec >= N) return -1;
          const br = r - dr, bc = c - dc, ar = er + dr, ac = ec + dc;
          if (br >= 0 && bc >= 0 && g[br][bc]) return -1;
          if (ar < N && ac < N && g[ar] && g[ar][ac]) return -1;
          for (let i = 0; i < w.length; i++) {
            const rr = r + dr * i, cc = c + dc * i, cell = g[rr][cc];
            if (cell) { if (cell !== w[i]) return -1; cross++; continue; }
            if (dir === 'A') { if ((rr > 0 && g[rr - 1][cc]) || (rr < N - 1 && g[rr + 1][cc])) return -1; }
            else { if ((cc > 0 && g[rr][cc - 1]) || (cc < N - 1 && g[rr][cc + 1])) return -1; }
          }
          return cross;
        };
        const put = (x, r, c, dir) => { for (let i = 0; i < x.a.length; i++) g[r + (dir === 'D' ? i : 0)][c + (dir === 'A' ? i : 0)] = x.a[i]; placed.push({ ...x, r, c, dir }); };
        put(words[0], 8, Math.floor((N - words[0].a.length) / 2), 'A');
        for (const x of words.slice(1)) {
          if (placed.length >= 14) break;
          let opts = [];
          for (const p of placed) for (let i = 0; i < p.a.length; i++) for (let j = 0; j < x.a.length; j++) {
            if (p.a[i] !== x.a[j]) continue;
            const dir = p.dir === 'A' ? 'D' : 'A';
            const r = p.dir === 'A' ? p.r - j : p.r + i, c = p.dir === 'A' ? p.c + i : p.c - j;
            const sc = can(x.a, r, c, dir); if (sc > 0) opts.push([sc + Math.random() * 0.5, r, c, dir]);
          }
          if (opts.length) { opts.sort((a, b) => b[0] - a[0]); const [, r, c, dir] = opts[0]; put(x, r, c, dir); }
        }
        let minR = N, minC = N, maxR = 0, maxC = 0; placed.forEach(p => { minR = Math.min(minR, p.r); minC = Math.min(minC, p.c); maxR = Math.max(maxR, p.r + (p.dir === 'D' ? p.a.length - 1 : 0)); maxC = Math.max(maxC, p.c + (p.dir === 'A' ? p.a.length - 1 : 0)); });
        const area = (maxR - minR + 1) * (maxC - minC + 1);
        const score = placed.length * 10 - area * 0.05;
        if (!best || score > best.score) best = { score, placed: placed.map(p => ({ ...p, r: p.r - minR, c: p.c - minC })), H: maxR - minR + 1, W: maxC - minC + 1 };
      }
      return best;
    };
    const cats = ['mus', 'sci', 'num', 'lang', 'emo', 'tech', 'nat'];
    const menu = () => UI.menu(api, {
      options: [{ icon: '🎲', name: { en: 'Mixed themes', fr: 'Thèmes mélangés' }, desc: { en: 'Everything in the glossary', fr: 'Tout le glossaire' }, go: () => play(null) },
        ...cats.filter(c => pool(c).length >= 14).map(c => ({ icon: { mus: '🎼', sci: '🔭', num: '🔢', lang: '📚', emo: '💗', tech: '💻', nat: '🌲' }[c], name: CAT_NAMES[c], desc: { en: 'Themed grid', fr: 'Grille thématique' }, go: () => play(c) }))],
    });
    const play = cat => {
      const X = generate(cat);
      const { placed, H, W } = X;
      const sol = Array.from({ length: H }, () => Array(W).fill(null));
      placed.forEach(p => { for (let i = 0; i < p.a.length; i++) sol[p.r + (p.dir === 'D' ? i : 0)][p.c + (p.dir === 'A' ? i : 0)] = p.a[i]; });
      const starts = [...new Set(placed.map(p => p.r * 100 + p.c))].sort((a, b) => a - b);
      const numAt = {}; starts.forEach((k, i) => numAt[k] = i + 1);
      placed.forEach(p => p.num = numAt[p.r * 100 + p.c]);
      const across = placed.filter(p => p.dir === 'A').sort((a, b) => a.num - b.num), down = placed.filter(p => p.dir === 'D').sort((a, b) => a.num - b.num);
      const clues = [...across, ...down];
      const val = Array.from({ length: H }, () => Array(W).fill(''));
      let cur = { r: across[0].r, c: across[0].c, dir: 'A' }, reveals = 0, done = false;
      const t0 = Date.now();
      const root = api.clear();
      const cs = Math.max(26, Math.min(44, Math.floor((Math.min(innerWidth, 1100) * 0.55) / W)));
      const gridEl = h('div', { style: { display: 'grid', gridTemplateColumns: `repeat(${W},${cs}px)`, gap: '2px', background: 'transparent', userSelect: 'none', justifyContent: 'center' } });
      const cells = [];
      for (let r = 0; r < H; r++) { cells.push([]); for (let c = 0; c < W; c++) {
        const on = !!sol[r][c];
        const el = h('div', { style: { width: cs + 'px', height: cs + 'px', position: 'relative', background: on ? '#f4f6ff' : 'transparent', borderRadius: '4px', color: '#101530', fontWeight: 900, fontSize: cs * 0.55 + 'px', display: 'grid', placeItems: 'center', cursor: on ? 'pointer' : 'default', boxShadow: on ? '0 2px 0 rgba(0,0,0,.25)' : 'none' } });
        if (numAt[r * 100 + c]) el.appendChild(h('span', { style: { position: 'absolute', left: '2px', top: '0', fontSize: '9px', color: '#6b7cff', fontWeight: 700 } }, numAt[r * 100 + c]));
        el.appendChild(h('span', { class: 'v' }));
        if (on) el.addEventListener('pointerdown', () => { if (cur.r === r && cur.c === c) cur.dir = cur.dir === 'A' ? 'D' : 'A'; cur.r = r; cur.c = c; fixDir(); paint(); });
        gridEl.appendChild(el); cells[r].push(el);
      } }
      const clueEl = h('div', { class: 'fb info', style: { fontSize: '18px', minHeight: '54px' } });
      const listA = h('div', { class: 'col', style: { gap: '4px' } }), listD = h('div', { class: 'col', style: { gap: '4px' } });
      const clueText = p => p.clue;
      const addClue = (p, list) => { const e = h('div', { style: { padding: '5px 8px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }, onclick: () => { cur = { r: p.r, c: p.c, dir: p.dir }; paint(); } }, h('b', null, p.num + '. '), `${p.clue} (${p.a.length})`); p.el = e; list.appendChild(e); };
      across.forEach(p => addClue(p, listA)); down.forEach(p => addClue(p, listD));
      root.appendChild(h('div', { class: 'gwrap' },
        h('div', { class: 'row', style: { marginBottom: '10px' } }, h('span', { class: 'chip sel' }, cat ? L(CAT_NAMES[cat]) : (api.fr ? 'Thèmes mélangés' : 'Mixed themes')), h('span', { class: 'spacer' }),
          h('button', { class: 'btn sm', onclick: () => check() }, '✔️ ' + t('check')), h('button', { class: 'btn sm', onclick: () => reveal() }, '💡 ' + t('reveal')), h('button', { class: 'btn sm', onclick: menu }, t('menu'))),
        clueEl,
        h('div', { style: { display: 'grid', gridTemplateColumns: innerWidth < 900 ? '1fr' : 'auto 1fr', gap: '20px', marginTop: '12px', alignItems: 'start' } }, gridEl,
          h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' } }, h('div', null, h('h3', null, api.fr ? 'Horizontal' : 'Across'), listA), h('div', null, h('h3', null, api.fr ? 'Vertical' : 'Down'), listD)))));
      function wordAt(r, c, dir) { return placed.find(p => p.dir === dir && (dir === 'A' ? (p.r === r && c >= p.c && c < p.c + p.a.length) : (p.c === c && r >= p.r && r < p.r + p.a.length))); }
      function fixDir() { if (!wordAt(cur.r, cur.c, cur.dir)) cur.dir = cur.dir === 'A' ? 'D' : 'A'; }
      function paint() {
        const w = wordAt(cur.r, cur.c, cur.dir);
        for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
          if (!sol[r][c]) continue;
          const el = cells[r][c]; el.querySelector('.v').textContent = val[r][c];
          const inW = w && (w.dir === 'A' ? (r === w.r && c >= w.c && c < w.c + w.a.length) : (c === w.c && r >= w.r && r < w.r + w.a.length));
          el.style.background = (r === cur.r && c === cur.c) ? '#ffc545' : inW ? '#bfe9ff' : el.dataset.bad ? '#ffd0d7' : el.dataset.ok ? '#c8f7d9' : '#f4f6ff';
        }
        clues.forEach(p => { p.el.style.background = p === w ? 'rgba(55,226,255,.18)' : ''; p.el.style.textDecoration = [...p.a].every((ch, i) => val[p.r + (p.dir === 'D' ? i : 0)][p.c + (p.dir === 'A' ? i : 0)] === ch) ? 'line-through' : ''; });
        if (w) clueEl.innerHTML = `<b>${w.num} ${w.dir === 'A' ? (api.fr ? 'Horiz.' : 'Across') : (api.fr ? 'Vert.' : 'Down')}</b> — ${escapeHtml(clueText(w))} <span class="muted">(${w.a.length})</span>`;
        api.hud([[t('time'), Math.floor((Date.now() - t0) / 1000) + 's'], [t('reveal'), reveals]]);
      }
      const move = (dr, dc) => { let r = cur.r + dr, c = cur.c + dc; while (r >= 0 && c >= 0 && r < H && c < W) { if (sol[r][c]) { cur.r = r; cur.c = c; return; } r += dr; c += dc; } };
      const advance = () => { const w = wordAt(cur.r, cur.c, cur.dir); if (!w) return; const dr = cur.dir === 'D' ? 1 : 0, dc = cur.dir === 'A' ? 1 : 0; const nr = cur.r + dr, nc = cur.c + dc; if (nr < H && nc < W && sol[nr][nc] && wordAt(nr, nc, cur.dir) === w) { cur.r = nr; cur.c = nc; } };
      const nextClue = (back) => { const w = wordAt(cur.r, cur.c, cur.dir); let i = clues.indexOf(w); i = (i + (back ? -1 : 1) + clues.length) % clues.length; const p = clues[i]; cur = { r: p.r, c: p.c, dir: p.dir }; };
      function check() { for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) if (sol[r][c] && val[r][c]) { cells[r][c].dataset.bad = val[r][c] !== sol[r][c] ? '1' : ''; cells[r][c].dataset.ok = val[r][c] === sol[r][c] ? '1' : ''; } paint(); api.sfx('pop'); }
      function reveal() { if (done) return; reveals++; val[cur.r][cur.c] = sol[cur.r][cur.c]; cells[cur.r][cur.c].dataset.bad = ''; advance(); paint(); api.sfx('pop'); win(); }
      function win() {
        for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) if (sol[r][c] && val[r][c] !== sol[r][c]) return;
        done = true;
        const secs = (Date.now() - t0) / 1000;
        const stars = reveals === 0 ? 3 : reveals <= 3 ? 2 : 1;
        api.finish({ score: Math.max(50, placed.length * 60 - reveals * 30 - (api.relaxed ? 0 : Math.floor(secs / 10))), stars, xp: 15 + placed.length * 2, title: api.fr ? 'Grille complétée !' : 'Grid complete!', lines: [`${placed.length} ${api.fr ? 'mots' : 'words'} · ${Math.round(secs)} s · ${t('reveal')}: ${reveals}`], again: () => play(cat), menu });
      }
      api.key(e => {
        if (done) return;
        if (e.key.startsWith('Arrow')) { e.preventDefault(); const m = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key]; const nd = m[0] ? 'D' : 'A'; if (cur.dir !== nd && wordAt(cur.r, cur.c, nd)) cur.dir = nd; else move(...m); fixDir(); paint(); return; }
        if (e.key === 'Tab') { e.preventDefault(); nextClue(e.shiftKey); paint(); return; }
        if (e.key === 'Backspace') { e.preventDefault(); if (val[cur.r][cur.c]) val[cur.r][cur.c] = ''; else { const dr = cur.dir === 'D' ? -1 : 0, dc = cur.dir === 'A' ? -1 : 0; const nr = cur.r + dr, nc = cur.c + dc; if (nr >= 0 && nc >= 0 && sol[nr][nc]) { cur.r = nr; cur.c = nc; val[nr][nc] = ''; } } paint(); return; }
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { const ch = norm(e.key).toUpperCase(); if (!/^[A-Z]$/.test(ch)) return; e.preventDefault(); val[cur.r][cur.c] = ch; cells[cur.r][cur.c].dataset.bad = ''; cells[cur.r][cur.c].dataset.ok = ''; api.sfx('type'); advance(); paint(); win(); }
      });
      if (matchMedia('(pointer:coarse)').matches) root.querySelector('.gwrap').appendChild(UI.keyboard(k => { const ev = { key: k === 'Enter' ? 'Tab' : k, preventDefault() { }, shiftKey: false }; document.dispatchEvent(new KeyboardEvent('keydown', { key: ev.key })); }, { enter: true }));
      paint();
      api.every(1000, () => { if (!done) api.hud([[t('time'), Math.floor((Date.now() - t0) / 1000) + 's'], [t('reveal'), reveals]]); });
    };
    menu();
  },
});
