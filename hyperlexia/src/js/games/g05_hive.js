'use strict';
registerGame({
  id: 'hive', n: 5, cat: 'words', colors: ['#ffc545', '#ff8f1f'],
  glyph: (() => { const hex = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => `${cx + r * Math.cos(Math.PI / 3 * i)},${cy + r * Math.sin(Math.PI / 3 * i)}`).join(' '); return `<polygon points="${hex(50, 50, 14)}" fill="#fff"/>` + [0, 1, 2, 3, 4, 5].map(i => `<polygon points="${hex(50 + 25 * Math.cos(Math.PI / 3 * i + Math.PI / 6), 50 + 25 * Math.sin(Math.PI / 3 * i + Math.PI / 6), 12)}" fill="#fff" fill-opacity=".6"/>`).join('') + '<text x="50" y="56" font-size="16" text-anchor="middle" fill="#ff8f1f">A</text>'; })(),
  name: { en: 'Spelling Hive', fr: 'Ruche à mots' },
  tag: { en: 'Seven letters, one golden centre. Find every word — and the pangram.', fr: 'Sept lettres, un centre doré. Trouve tous les mots — et le pangramme.' },
  how: {
    en: '<p>Make words of <b>4+ letters</b> using the hive letters (letters can repeat). Every word <b>must use the centre letter</b>. 4-letter words = 1 point; longer words = 1 point per letter. A <b>pangram</b> uses all seven letters: +7 bonus. Click a found word to see its meaning when available. Climb the ranks to <b>Genius</b>.</p>',
    fr: '<p>Forme des mots de <b>4 lettres ou plus</b> avec les lettres de la ruche (répétitions permises). Chaque mot <b>doit contenir la lettre centrale</b>. Mot de 4 lettres = 1 point; plus long = 1 point par lettre. Un <b>pangramme</b> utilise les sept lettres : +7. Accents ignorés. Clique un mot trouvé pour voir son sens.</p>',
  },
  why: {
    en: 'Turns orthographic fluency into vocabulary depth: players generate many related words and meet their meanings. Semantic knowledge explained 57% of comprehension variance in autistic readers (Brown et al., 2013).',
    fr: 'Transforme l’aisance orthographique en profondeur de vocabulaire : on génère des mots et on découvre leur sens. Les connaissances sémantiques expliquent 57 % de la compréhension chez les lecteurs autistes (Brown et al., 2013).',
  },
  start(api) {
    const RANKS = [[0, { en: 'Beginner', fr: 'Débutant' }], [0.02, { en: 'Good start', fr: 'Bon départ' }], [0.05, { en: 'Moving up', fr: 'En progrès' }], [0.08, { en: 'Good', fr: 'Bien' }], [0.15, { en: 'Solid', fr: 'Solide' }], [0.25, { en: 'Nice', fr: 'Très bien' }], [0.4, { en: 'Great', fr: 'Excellent' }], [0.5, { en: 'Amazing', fr: 'Épatant' }], [0.7, { en: 'Genius', fr: 'Génie' }], [1, { en: 'Queen Bee', fr: 'Reine des abeilles' }]];
    const mask = w => { let m = 0; for (const ch of w) m |= 1 << (ch.charCodeAt(0) - 97); return m; };
    const bits = m => { let n = 0; while (m) { n += m & 1; m >>= 1; } return n; };
    let WL = null;
    const words = () => {
      if (WL && WL.lang === api.lang) return WL;
      const lx = Lex.get(api.lang), list = [];
      for (let L2 = 4; L2 <= 12; L2++) for (const w of (lx.byLen[L2] || [])) if (!w.includes('s')) list.push([w, mask(w)]);
      const pans = list.filter(([w, m]) => bits(m) === 7 && lx.rank.get(w) < 20000);
      return (WL = { lang: api.lang, list, pans });
    };
    const build = r => {
      const { list, pans } = words();
      for (let tries = 0; tries < 400; tries++) {
        const [pw, pm] = pick(pans, r);
        const letters = [...new Set(pw)];
        const order = shuffle(letters, r);
        for (const center of order) {
          const cb = 1 << (center.charCodeAt(0) - 97);
          const valid = list.filter(([w, m]) => (m & ~pm) === 0 && (m & cb)).map(x => x[0]);
          const lo = api.lang === 'fr' ? 15 : 20;
          if (valid.length >= lo && valid.length <= 80) return { letters: order.filter(c => c !== center), center, words: valid, id: `${letters.sort().join('')}-${center}` };
        }
      }
      return null;
    };
    const menu = () => UI.menu(api, {
      options: [
        { icon: '📅', name: { en: 'Daily hive', fr: 'Ruche du jour' }, desc: { en: 'Same puzzle for everyone today', fr: 'La même pour tout le monde aujourd’hui' }, go: () => play(build(rngFor(`hive-${todayKey()}-${api.lang}`))) },
        { icon: '🎲', name: { en: 'Random hive', fr: 'Ruche au hasard' }, desc: { en: 'A fresh puzzle', fr: 'Une nouvelle énigme' }, go: () => play(build(Math.random)) },
      ],
    });
    const play = P => {
      if (!P) { api.toast('…'); return; }
      const D = api.data; D.p = D.p || {};
      const key = `${api.lang}:${P.id}`;
      const found = new Set(D.p[key] || []);
      const score = w => (w.length === 4 ? 1 : w.length) + (new Set(w).size === 7 ? 7 : 0);
      const maxScore = P.words.reduce((a, w) => a + score(w), 0);
      let cur = '', outer = P.letters.slice();
      const root = api.clear();
      const wrap = h('div', { class: 'gwrap', style: { display: 'grid', gridTemplateColumns: 'minmax(280px,420px) 1fr', gap: '24px', alignItems: 'start' } });
      if (innerWidth < 800) wrap.style.gridTemplateColumns = '1fr';
      const inputEl = h('div', { class: 'mono', style: { fontSize: '34px', fontWeight: 900, textAlign: 'center', minHeight: '46px', letterSpacing: '3px', textTransform: 'uppercase' } });
      const msg = h('div', { style: { textAlign: 'center', minHeight: '26px', fontWeight: 700 } });
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 300 300'); svg.style.width = '100%'; svg.style.maxWidth = '340px'; svg.style.display = 'block'; svg.style.margin = '0 auto';
      const rankEl = h('div'), foundEl = h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } }), defEl = h('div'), hintEl = h('div', { class: 'hidden' });
      const left = h('div', { class: 'col' }, inputEl, msg, svg,
        h('div', { class: 'row', style: { justifyContent: 'center' } },
          h('button', { class: 'btn', onclick: () => { cur = cur.slice(0, -1); paint(); } }, '⌫'),
          h('button', { class: 'btn', onclick: () => { outer = shuffle(outer); drawHive(); api.sfx('whoosh'); } }, '🔀 ' + t('shuffle')),
          h('button', { class: 'btn primary', onclick: () => submit() }, '⏎ ' + t('submit'))));
      const right = h('div', { class: 'col' }, rankEl,
        h('div', { class: 'panel' }, h('div', { class: 'row' }, h('b', null, `${t('found')} `), h('span', { class: 'muted', id: 'hivecount' }), h('span', { class: 'spacer' }), h('button', { class: 'btn sm', onclick: () => { hintEl.classList.toggle('hidden'); renderHints(); } }, '💡 ' + t('hint'))), h('div', { style: { marginTop: '8px' } }, foundEl)),
        defEl, hintEl);
      wrap.append(left, right); root.appendChild(wrap);
      const hex = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => `${cx + r * Math.cos(Math.PI / 3 * i)},${cy + r * Math.sin(Math.PI / 3 * i)}`).join(' ');
      const drawHive = () => {
        svg.innerHTML = '';
        const cells = [[150, 150, P.center, true]];
        outer.forEach((l, i) => { const a = Math.PI / 3 * i + Math.PI / 6; cells.push([150 + 92 * Math.cos(a), 150 + 92 * Math.sin(a), l, false]); });
        for (const [x, y, l, c] of cells) {
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.style.cursor = 'pointer';
          const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
          poly.setAttribute('points', hex(x, y, 50)); poly.setAttribute('fill', c ? '#ffc545' : 'rgba(255,255,255,.12)'); poly.setAttribute('stroke', c ? '#fff3c4' : 'rgba(255,255,255,.25)'); poly.setAttribute('stroke-width', '2');
          const tx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          tx.setAttribute('x', x); tx.setAttribute('y', y + 12); tx.setAttribute('text-anchor', 'middle'); tx.setAttribute('font-size', '34'); tx.setAttribute('font-weight', '900'); tx.setAttribute('fill', c ? '#2a1600' : '#fff'); tx.setAttribute('font-family', 'Segoe UI, Arial');
          tx.textContent = l.toUpperCase();
          g.append(poly, tx);
          g.addEventListener('pointerdown', () => { add(l); poly.setAttribute('fill', c ? '#ffe08a' : 'rgba(255,255,255,.3)'); setTimeout(() => poly.setAttribute('fill', c ? '#ffc545' : 'rgba(255,255,255,.12)'), 120); });
          svg.appendChild(g);
        }
      };
      const paint = () => { inputEl.innerHTML = ''; for (const ch of cur) inputEl.appendChild(h('span', { style: { color: ch === P.center ? '#ffc545' : [...P.letters].includes(ch) ? '#fff' : 'var(--ink3)' } }, ch)); };
      const add = l => { cur += l; api.sfx('type'); paint(); };
      const say = (m, bad) => { msg.textContent = m; msg.style.color = bad ? 'var(--bad)' : 'var(--good)'; api.after(1400, () => { if (msg.textContent === m) msg.textContent = ''; }); };
      const pts = () => [...found].reduce((a, w) => a + score(w), 0);
      const rank = () => { const r = pts() / maxScore; let cur2 = RANKS[0]; for (const rk of RANKS) if (r >= rk[0]) cur2 = rk; return cur2; };
      const renderRank = () => {
        const r = pts() / maxScore, rk = rank();
        rankEl.innerHTML = '';
        rankEl.append(h('div', { class: 'row' }, h('b', { style: { fontSize: '20px' } }, '🐝 ' + L(rk[1])), h('span', { class: 'spacer' }), h('span', { class: 'mono' }, `${pts()} / ${maxScore}`)),
          h('div', { style: { position: 'relative', height: '16px', marginTop: '8px' } }, h('div', { class: 'progress' }, h('i', { style: { width: `${Math.min(100, r * 100)}%` } })),
            ...RANKS.slice(1).map(([p, n]) => h('div', { title: L(n), style: { position: 'absolute', left: `calc(${p * 100}% - 5px)`, top: '0', width: '10px', height: '10px', borderRadius: '50%', background: r >= p ? '#ffc545' : 'rgba(255,255,255,.25)' } }))));
        $('#hivecount', root).textContent = `${found.size} / ${P.words.length}`;
        foundEl.innerHTML = '';
        [...found].sort().forEach(w => { const pan = new Set(w).size === 7; foundEl.appendChild(h('button', { class: 'chip' + (pan ? ' sel' : ''), onclick: () => showDef(w) }, (pan ? '⭐ ' : '') + Lex.display(w, api.lang))); });
        api.hud([[t('score'), pts()], [api.fr ? 'Rang' : 'Rank', L(rk[1])]]);
        if (r >= 0.7) api.badge('queenbee');
        api.stars(r >= 0.7 ? 3 : r >= 0.4 ? 2 : r >= 0.15 ? 1 : 0); api.record(pts());
      };
      const showDef = w => {
        const d = Lex.define(w, api.lang);
        defEl.innerHTML = '';
        defEl.appendChild(d ? UI.definition(d) : h('div', { class: 'fb info' }, api.fr ? `📖 « ${Lex.display(w, api.lang)} » — invente une phrase qui l’utilise !` : `📖 “${Lex.display(w, api.lang)}” — make up a sentence that uses it!`));
      };
      const renderHints = () => {
        if (hintEl.classList.contains('hidden')) return;
        const rem = P.words.filter(w => !found.has(w));
        const lens = [...new Set(P.words.map(w => w.length))].sort((a, b) => a - b);
        const starts = [...new Set(P.words.map(w => w[0]))].sort();
        const tbl = h('table', { class: 'simple mono' }, h('tr', null, h('th', null, ''), ...lens.map(l => h('th', null, l)), h('th', null, 'Σ')),
          ...starts.map(s => h('tr', null, h('th', null, s.toUpperCase()), ...lens.map(l => h('td', null, rem.filter(w => w[0] === s && w.length === l).length || '·')), h('td', null, rem.filter(w => w[0] === s).length))));
        const two = {}; rem.forEach(w => { const k = w.slice(0, 2); two[k] = (two[k] || 0) + 1; });
        hintEl.innerHTML = '';
        hintEl.append(h('div', { class: 'panel' }, h('b', null, api.fr ? 'Mots restants (1re lettre × longueur)' : 'Words left (first letter × length)'), tbl,
          h('div', { class: 'mono', style: { marginTop: '8px', fontSize: '13px' } }, Object.entries(two).sort().map(([k, n]) => `${k.toUpperCase()}-${n}`).join('  ')),
          h('div', { class: 'muted', style: { marginTop: '6px' } }, `${api.fr ? 'Pangrammes restants' : 'Pangrams left'}: ${rem.filter(w => new Set(w).size === 7).length}`)));
      };
      const submit = () => {
        const w = cur; cur = ''; paint();
        if (w.length < 4) return say(t('tooShort'), true), api.sfx('bad');
        if (!w.includes(P.center)) return say(api.fr ? 'Lettre centrale manquante' : 'Missing centre letter', true), api.sfx('bad');
        if ([...w].some(ch => ch !== P.center && !P.letters.includes(ch))) return say(api.fr ? 'Mauvaises lettres' : 'Bad letters', true), api.sfx('bad');
        if (found.has(w)) return say(t('already'), true), api.sfx('bad');
        if (!P.words.includes(w)) return say(t('notWord'), true), api.sfx('bad');
        const before = rank();
        found.add(w); D.p[key] = [...found]; api.save();
        const s = score(w), pan = new Set(w).size === 7;
        say(pan ? `PANGRAM! +${s}` : `+${s}`); api.sfx(pan ? 'great' : 'good');
        if (pan) api.confetti(120);
        api.xp(pan ? 10 : Math.max(1, s / 2), inputEl);
        renderRank(); renderHints(); showDef(w);
        if (rank() !== before) { api.toast(`🐝 ${L(rank()[1])}!`, '⬆️'); api.sfx('level'); }
      };
      api.key(e => {
        if (e.ctrlKey || e.metaKey) return;
        if (e.key === 'Enter') { e.preventDefault(); submit(); }
        else if (e.key === 'Backspace') { e.preventDefault(); cur = cur.slice(0, -1); paint(); }
        else if (e.key === ' ') { e.preventDefault(); outer = shuffle(outer); drawHive(); }
        else if (e.key.length === 1) { const c = norm(e.key); if (/^[a-z]$/.test(c)) add(c); }
      });
      drawHive(); paint(); renderRank();
    };
    menu();
  },
});
