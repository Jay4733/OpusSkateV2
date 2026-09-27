'use strict';
registerGame({
  id: 'grid', n: 6, cat: 'words', colors: ['#9dff5b', '#11a36b'],
  glyph: `${[0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${18 + c * 23}" y="${18 + r * 23}" width="19" height="19" rx="4" fill="#fff" fill-opacity="${(r + c) % 2 ? .55 : .95}"/>`).join('')).join('')}
    <path d="M28 28 L51 51 L74 51 L74 74" fill="none" stroke="#11a36b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  name: { en: 'Grid Blitz', fr: 'Blitz de grille' },
  tag: { en: 'Trace words through a letter grid against the clock.', fr: 'Trace des mots dans une grille de lettres contre la montre.' },
  how: {
    en: '<p>Drag through <b>touching letters</b> (including diagonals) to spell words, or type them and press Enter. Each tile can be used once per word. 4×4: words of 3+ letters. 5×5: 4+ letters. Points: 3–4 letters = 1, 5 = 2, 6 = 3, 7 = 5, 8+ = 11. When time runs out, see every word hiding in the grid.</p>',
    fr: '<p>Glisse sur des <b>lettres voisines</b> (diagonales comprises) pour former des mots, ou tape-les puis Entrée. Chaque case sert une fois par mot. 4×4 : mots de 3 lettres ou plus. 5×5 : 4 lettres ou plus. Points : 3–4 lettres = 1, 5 = 2, 6 = 3, 7 = 5, 8+ = 11. À la fin, découvre tous les mots cachés.</p>',
  },
  why: {
    en: 'Rapid orthographic search is a hyperlexic strength; playing it in both English and French builds the two lexicons, and exposure is what drives bilingual vocabulary (Gonzalez-Barrero & Nadig, 2018).',
    fr: 'La recherche orthographique rapide est une force hyperlexique; jouer en anglais et en français nourrit les deux lexiques, car c’est l’exposition qui fait grandir le vocabulaire bilingue (Gonzalez-Barrero et Nadig, 2018).',
  },
  start(api) {
    const PTS = w => w.length <= 4 ? 1 : w.length === 5 ? 2 : w.length === 6 ? 3 : w.length === 7 ? 5 : 11;
    let PRE = null;
    const prefixes = () => {
      if (PRE && PRE.lang === api.lang) return PRE;
      const lx = Lex.get(api.lang), pre = new Set(), set = new Set();
      for (let L2 = 3; L2 <= 12; L2++) for (const w of (lx.byLen[L2] || [])) { set.add(w); for (let i = 1; i <= w.length; i++) pre.add(w.slice(0, i)); }
      return (PRE = { lang: api.lang, pre, set });
    };
    const makeGrid = n => {
      for (let tries = 0; tries < 60; tries++) {
        const cells = [];
        for (let i = 0; i < n * n; i++) { let l = Lex.randLetter(api.lang); if (l === 'q') l = 'qu'; cells.push(l); }
        const v = cells.filter(c => 'aeiou'.includes(c[0])).length;
        if (v >= Math.round(n * n * 0.32) && v <= Math.round(n * n * 0.5)) return cells;
      }
      return Array.from({ length: n * n }, () => Lex.randLetter(api.lang));
    };
    const nb = (i, n) => { const r = Math.floor(i / n), c = i % n, out = []; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { if (!dr && !dc) continue; const rr = r + dr, cc = c + dc; if (rr >= 0 && cc >= 0 && rr < n && cc < n) out.push(rr * n + cc); } return out; };
    const solve = (cells, n, minL) => {
      const { pre, set } = prefixes(), found = new Set();
      const dfs = (i, used, s) => { const w = s + cells[i]; if (!pre.has(w)) return; if (w.length >= minL && set.has(w)) found.add(w); used[i] = 1; for (const j of nb(i, n)) if (!used[j]) dfs(j, used, w); used[i] = 0; };
      for (let i = 0; i < n * n; i++) dfs(i, [], '');
      return found;
    };
    const pathFor = (word, cells, n) => {
      let res = null;
      const dfs = (i, used, pos, path) => { if (res) return; const t2 = cells[i]; if (word.slice(pos, pos + t2.length) !== t2) return; const np = pos + t2.length; const p2 = [...path, i]; if (np === word.length) { res = p2; return; } used[i] = 1; for (const j of nb(i, n)) if (!used[j]) dfs(j, used, np, p2); used[i] = 0; };
      for (let i = 0; i < n * n && !res; i++) dfs(i, [], 0, []);
      return res;
    };
    const menu = () => UI.menu(api, {
      options: [
        { icon: '4️⃣', name: { en: 'Classic 4×4 · 3 min', fr: 'Classique 4×4 · 3 min' }, desc: { en: 'Words of 3+ letters', fr: 'Mots de 3 lettres et +' }, go: () => play(4, 180, 3) },
        { icon: '5️⃣', name: { en: 'Big 5×5 · 4 min', fr: 'Grand 5×5 · 4 min' }, desc: { en: 'Words of 4+ letters', fr: 'Mots de 4 lettres et +' }, go: () => play(5, 240, 4) },
        { icon: '⚡', name: { en: 'Blitz 4×4 · 90 s', fr: 'Éclair 4×4 · 90 s' }, desc: { en: 'Fast and furious', fr: 'Vite, vite !' }, go: () => play(4, 90, 3) },
      ],
    });
    const play = (n, secs, minL) => {
      let cells, all;
      do { cells = makeGrid(n); all = solve(cells, n, minL); } while (all.size < (n === 4 ? 25 : 45));
      const found = new Set(); let score = 0, left = secs, over = false, path = [], dragging = false;
      const root = api.clear();
      const size = Math.min(460, innerWidth - 40), cell = size / n;
      const gridEl = h('div', { style: { position: 'relative', width: size + 'px', height: size + 'px', margin: '0 auto', touchAction: 'none', userSelect: 'none' } });
      const svgNS = 'http://www.w3.org/2000/svg';
      const lines = document.createElementNS(svgNS, 'svg'); lines.setAttribute('width', size); lines.setAttribute('height', size); lines.style.position = 'absolute'; lines.style.inset = '0'; lines.style.pointerEvents = 'none'; lines.style.zIndex = 2;
      const tiles = cells.map((l, i) => {
        const r = Math.floor(i / n), c = i % n;
        const tEl = h('div', { dataset: { i }, style: { position: 'absolute', left: c * cell + 5 + 'px', top: r * cell + 5 + 'px', width: cell - 10 + 'px', height: cell - 10 + 'px', borderRadius: '14px', display: 'grid', placeItems: 'center', fontSize: cell * 0.42 + 'px', fontWeight: 900, background: 'linear-gradient(180deg,#fdfdf6,#d9dccd)', color: '#10321f', boxShadow: '0 4px 0 #8a9380, 0 8px 18px rgba(0,0,0,.35)', transform: `rotate(${(Math.random() - 0.5) * 8}deg)`, transition: 'background .12s, transform .12s' } }, l === 'qu' ? 'Qu' : l.toUpperCase());
        gridEl.appendChild(tEl); return tEl;
      });
      gridEl.appendChild(lines);
      const cur = h('div', { class: 'mono', style: { fontSize: '28px', fontWeight: 900, minHeight: '40px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px' } });
      const typed = h('input', { class: 'field mono', placeholder: api.fr ? 'ou tape un mot…' : 'or type a word…', style: { textTransform: 'uppercase', width: '220px' } });
      const list = h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', alignContent: 'flex-start' } });
      const timerBar = h('div', { class: 'progress' }, h('i', { style: { width: '100%' } }));
      const wrap = h('div', { class: 'gwrap', style: { display: 'grid', gridTemplateColumns: innerWidth < 860 ? '1fr' : `${size + 20}px 1fr`, gap: '20px' } },
        h('div', { class: 'col' }, api.relaxed ? null : timerBar, cur, gridEl, h('div', { class: 'row', style: { justifyContent: 'center' } }, typed, h('button', { class: 'btn sm', onclick: () => end() }, '🏁 ' + t('done')))),
        h('div', { class: 'panel' }, h('b', null, `${t('found')}`), h('div', { style: { marginTop: '8px' } }, list)));
      root.appendChild(wrap);
      const hud = () => api.hud([[t('score'), score], [t('found'), `${found.size}/${all.size}`], [t('time'), api.relaxed ? '∞' : `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, '0')}`]]);
      const drawPath = (ok) => {
        lines.innerHTML = '';
        tiles.forEach((tEl, i) => { const on = path.includes(i); tEl.style.background = on ? (ok === false ? 'linear-gradient(180deg,#ffb3bd,#ff5d73)' : ok ? 'linear-gradient(180deg,#b8ffd3,#3ddc84)' : 'linear-gradient(180deg,#bff5ff,#37e2ff)') : 'linear-gradient(180deg,#fdfdf6,#d9dccd)'; });
        if (path.length > 1) {
          const pl = document.createElementNS(svgNS, 'polyline');
          pl.setAttribute('points', path.map(i => `${(i % n) * cell + cell / 2},${Math.floor(i / n) * cell + cell / 2}`).join(' '));
          pl.setAttribute('fill', 'none'); pl.setAttribute('stroke', 'rgba(20,90,160,.55)'); pl.setAttribute('stroke-width', cell * 0.18); pl.setAttribute('stroke-linecap', 'round'); pl.setAttribute('stroke-linejoin', 'round');
          lines.appendChild(pl);
        }
        cur.textContent = path.map(i => cells[i]).join('');
      };
      const tryWord = (w, p) => {
        if (over) return;
        const ok = w.length >= minL && all.has(w) && !found.has(w);
        if (ok) {
          found.add(w); score += PTS(w); api.sfx(w.length >= 6 ? 'great' : 'good');
          const d = Lex.define(w, api.lang);
          list.prepend(h('span', { class: 'chip' + (d ? ' sel' : ''), title: d ? d.d : '' }, `${Lex.display(w, api.lang)} +${PTS(w)}`));
          if (p) { const last = tiles[p[p.length - 1]]; api.float(last, `+${PTS(w)}`, '#9dff5b'); }
        } else api.sfx(found.has(w) ? 'pop' : 'bad');
        path = p || []; drawPath(ok); api.after(260, () => { path = []; drawPath(); });
        hud();
      };
      const idxAt = (x, y) => { const r = gridEl.getBoundingClientRect(); const cx = x - r.left, cy = y - r.top; const c = Math.floor(cx / cell), rr = Math.floor(cy / cell); if (c < 0 || rr < 0 || c >= n || rr >= n) return -1; const dx = cx - (c * cell + cell / 2), dy = cy - (rr * cell + cell / 2); return Math.hypot(dx, dy) < cell * 0.42 ? rr * n + c : -1; };
      api.on(gridEl, 'pointerdown', e => { if (over) return; const i = idxAt(e.clientX, e.clientY); if (i < 0) return; dragging = true; path = [i]; api.sfx('click'); drawPath(); gridEl.setPointerCapture(e.pointerId); });
      api.on(gridEl, 'pointermove', e => { if (!dragging) return; const i = idxAt(e.clientX, e.clientY); if (i < 0) return; const last = path[path.length - 1]; if (i === path[path.length - 2]) { path.pop(); drawPath(); return; } if (!path.includes(i) && nb(last, n).includes(i)) { path.push(i); api.sfx('tick'); drawPath(); } });
      api.on(gridEl, 'pointerup', () => { if (!dragging) return; dragging = false; const w = path.map(i => cells[i]).join(''); if (path.length > 1) tryWord(w, path.slice()); else { path = []; drawPath(); } });
      typed.addEventListener('keydown', e => { if (e.key === 'Enter') { const w = norm(typed.value).replace(/[^a-z]/g, ''); typed.value = ''; const p = pathFor(w, cells, n); if (p) tryWord(w, p); else { api.sfx('bad'); typed.classList.add('shake'); setTimeout(() => typed.classList.remove('shake'), 400); } } });
      if (!api.relaxed) api.every(1000, () => { if (over) return; left--; timerBar.firstChild.style.width = `${100 * left / secs}%`; if (left <= 10) api.sfx('tick'); hud(); if (left <= 0) end(); });
      hud();
      const end = () => {
        if (over) return; over = true;
        const missed = [...all].filter(w => !found.has(w)).sort((a, b) => b.length - a.length || a.localeCompare(b));
        const longest = [...all].sort((a, b) => b.length - a.length)[0];
        const ratio = found.size / all.size;
        const extra = h('div', { style: { textAlign: 'left', maxHeight: '240px', overflow: 'auto', marginTop: '10px' } },
          h('div', { class: 'muted' }, `${api.fr ? 'Mot le plus long possible' : 'Longest possible word'}: ${up(Lex.display(longest, api.lang))}`),
          h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' } }, missed.slice(0, 120).map(w => h('span', { class: 'chip' }, Lex.display(w, api.lang)))));
        api.finish({ score, stars: UI.starsFor(ratio * 2.2), xp: 5 + found.size * 2, lines: [`${t('found')} ${found.size}/${all.size} (${Math.round(ratio * 100)}%)`], extra, again: () => play(n, secs, minL), menu });
      };
    };
    menu();
  },
});
