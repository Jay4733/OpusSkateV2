'use strict';
registerGame({
  id: 'ladder', n: 7, cat: 'words', colors: ['#4d9bff', '#1b2f9e'],
  glyph: `<rect x="28" y="12" width="7" height="76" rx="3"/><rect x="65" y="12" width="7" height="76" rx="3"/>
    ${[22, 40, 58, 76].map(y => `<rect x="33" y="${y}" width="34" height="6" rx="3"/>`).join('')}
    <text x="50" y="18" font-size="11" text-anchor="middle">WARM</text><text x="50" y="97" font-size="11" text-anchor="middle">COLD</text>`,
  name: { en: 'Word Ladder', fr: 'Échelle de mots' },
  tag: { en: 'COLD → WARM, one letter at a time. Can you match par?', fr: 'Change une lettre à la fois pour atteindre le sommet.' },
  how: {
    en: '<p>Change <b>exactly one letter</b> to make a new real word, rung by rung, until you reach the goal word. <b>Par</b> is the shortest possible path. The thermometer shows how many steps you still need from your current word. Undo anytime; a hint reveals the next rung on a shortest path.</p>',
    fr: '<p>Change <b>une seule lettre</b> pour former un nouveau vrai mot, barreau par barreau, jusqu’au mot du sommet. La <b>normale</b> est le chemin le plus court possible. Le thermomètre indique combien d’étapes il reste. Accents ignorés.</p>',
  },
  why: {
    en: 'Deliberate letter-by-letter manipulation strengthens orthographic and phonological representations while demanding planning and flexibility — pitched as a genuine challenge for a twice-exceptional teen (Reis & Renzulli, 2025).',
    fr: 'Manipuler les lettres une à une renforce les représentations orthographiques et phonologiques tout en exigeant planification et souplesse — un vrai défi pour un ado doublement exceptionnel (Reis et Renzulli, 2025).',
  },
  start(api) {
    const G = {};
    const graph = len => {
      const key = api.lang + len; if (G[key]) return G[key];
      const lx = Lex.get(api.lang), words = (lx.byLen[len] || []).slice(0, len === 3 ? 900 : 3500);
      const set = new Set(words), buckets = new Map();
      for (const w of words) for (let i = 0; i < len; i++) { const k = w.slice(0, i) + '*' + w.slice(i + 1); if (!buckets.has(k)) buckets.set(k, []); buckets.get(k).push(w); }
      const adj = w => { const out = new Set(); for (let i = 0; i < len; i++) for (const x of (buckets.get(w.slice(0, i) + '*' + w.slice(i + 1)) || [])) if (x !== w) out.add(x); return [...out]; };
      return (G[key] = { words, set, adj });
    };
    const bfs = (g, from) => { const dist = new Map([[from, 0]]), prev = new Map(), q = [from]; while (q.length) { const w = q.shift(); for (const x of g.adj(w)) if (!dist.has(x)) { dist.set(x, dist.get(w) + 1); prev.set(x, w); q.push(x); } } return { dist, prev }; };
    const puzzle = (len, dmin, dmax) => {
      const g = graph(len);
      for (let tries = 0; tries < 200; tries++) {
        const cut = Math.max(60, Math.floor(g.words.length * 0.35));
        const s = pick(g.words.slice(0, Math.min(1200, cut)));
        const { dist } = bfs(g, s);
        const cands = [...dist.entries()].filter(([w, d]) => d >= dmin && d <= dmax && g.words.indexOf(w) < Math.min(1600, cut)).map(x => x[0]);
        if (cands.length) return { start: s, goal: pick(cands), g };
      }
      return null;
    };
    const menu = () => UI.menu(api, {
      options: [
        { icon: '🟢', name: { en: '3 letters · short climb', fr: '3 lettres · petite échelle' }, desc: { en: 'Par 3–4', fr: 'Normale 3–4' }, go: () => play(3, 3, 4) },
        { icon: '🟡', name: { en: '4 letters · classic', fr: '4 lettres · classique' }, desc: { en: 'Par 4–5', fr: 'Normale 4–5' }, go: () => play(4, 4, 5) },
        { icon: '🟠', name: { en: '4 letters · long', fr: '4 lettres · longue' }, desc: { en: 'Par 6–8', fr: 'Normale 6–8' }, go: () => play(4, 6, 8) },
        { icon: '🔴', name: { en: '5 letters · summit', fr: '5 lettres · sommet' }, desc: { en: 'Par 4–7', fr: 'Normale 4–7' }, go: () => play(5, 4, 7) },
      ],
    });
    const play = (len, dmin, dmax) => {
      const P = puzzle(len, dmin, dmax); if (!P) { api.toast('…'); return menu(); }
      const { g, start, goal } = P;
      const fromGoal = bfs(g, goal).dist;
      const par = fromGoal.get(start);
      let chain = [start], hints = 0;
      const root = api.clear();
      const ladder = h('div', { class: 'col', style: { gap: '6px', alignItems: 'center' } });
      const inp = h('input', { class: 'field mono', maxlength: len, style: { fontSize: '28px', width: `${len * 40 + 30}px`, textAlign: 'center', letterSpacing: '8px', textTransform: 'uppercase' }, dataset: { gamekeys: '1' } });
      const msg = h('div', { style: { minHeight: '26px', fontWeight: 700, textAlign: 'center' } });
      const thermo = h('div', { style: { width: '26px', height: '260px', borderRadius: '14px', background: 'rgba(255,255,255,.08)', border: '1px solid var(--line)', position: 'relative', overflow: 'hidden' } }, h('div', { style: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(0deg,#4d9bff,#ff4f7b)', transition: 'height .5s' } }));
      const distLbl = h('div', { class: 'mono center' });
      const defEl = h('div');
      root.appendChild(h('div', { class: 'gwrap' },
        h('div', { class: 'row', style: { justifyContent: 'center', gap: '28px', alignItems: 'flex-start' } },
          h('div', { class: 'col', style: { alignItems: 'center' } }, thermo, distLbl),
          h('div', { class: 'col', style: { alignItems: 'center', minWidth: '300px' } }, ladder, inp, msg,
            h('div', { class: 'row', style: { justifyContent: 'center' } },
              h('button', { class: 'btn primary', onclick: () => submit() }, '⏎ ' + t('submit')),
              h('button', { class: 'btn', onclick: () => { if (chain.length > 1) { chain.pop(); render(); api.sfx('whoosh'); } } }, '↶ ' + (api.fr ? 'Annuler' : 'Undo')),
              h('button', { class: 'btn', onclick: () => hint() }, '💡 ' + t('hint')),
              h('button', { class: 'btn', onclick: menu }, t('menu'))), defEl))));
      const tileRow = (w, style) => h('div', { style: { display: 'flex', gap: '4px' } }, w.split('').map((ch, i) => h('div', { class: 'tile', style: Object.assign({ width: '42px', height: '46px', fontSize: '24px' }, style || {}, (style && style.diffAt === i) ? { background: '#37e2ff', color: '#061024' } : {}) }, Lex.display(w, api.lang)[i] || ch)));
      const render = () => {
        ladder.innerHTML = '';
        ladder.appendChild(h('div', { class: 'row' }, h('span', null, '🏁'), tileRow(goal, { background: 'linear-gradient(180deg,#ff4f7b,#ff8f3d)', borderColor: 'transparent' })));
        ladder.appendChild(h('div', { class: 'muted', style: { fontSize: '13px' } }, `⋮ ${par} ${api.fr ? 'étapes (normale)' : 'steps (par)'} ⋮`));
        for (let k = chain.length - 1; k >= 0; k--) {
          const w = chain[k], prev = chain[k - 1];
          const diff = prev ? [...w].findIndex((c, i) => c !== prev[i]) : -1;
          ladder.appendChild(h('div', { class: 'row fadein' }, h('span', null, k === chain.length - 1 ? '🧗' : '▫️'), tileRow(w, { diffAt: diff, background: k === 0 ? 'rgba(77,155,255,.35)' : undefined })));
        }
        const d = fromGoal.get(chain[chain.length - 1]);
        const pct = d == null ? 0 : 100 * (1 - d / Math.max(par, 1));
        thermo.firstChild.style.height = clamp(pct, 4, 100) + '%';
        distLbl.textContent = d == null ? '∅' : `${d} ${api.fr ? 'à faire' : 'to go'}`;
        api.hud([[t('moves'), chain.length - 1], [api.fr ? 'Normale' : 'Par', par]]);
        inp.value = ''; setTimeout(() => inp.focus(), 20);
      };
      const say = (m, bad) => { msg.textContent = m; msg.style.color = bad ? 'var(--bad)' : 'var(--good)'; };
      const submit = () => {
        const w = norm(inp.value).replace(/[^a-z]/g, ''), last = chain[chain.length - 1];
        if (w.length !== len) return say(t('tooShort'), true);
        const diffs = [...w].filter((c, i) => c !== last[i]).length;
        if (diffs !== 1) { api.sfx('bad'); return say(api.fr ? 'Change exactement une lettre.' : 'Change exactly one letter.', true); }
        if (!g.set.has(w) && !Lex.valid(w, api.lang)) { api.sfx('bad'); return say(t('notWord'), true); }
        if (chain.includes(w)) { api.sfx('bad'); return say(t('already'), true); }
        chain.push(w); api.sfx('good'); say('');
        const d = Lex.define(w, api.lang); defEl.innerHTML = ''; if (d) defEl.appendChild(UI.definition(d));
        render();
        if (w === goal) win();
      };
      const hint = () => {
        const last = chain[chain.length - 1], d = fromGoal.get(last);
        if (d == null) { say(api.fr ? 'Impasse : annule un pas.' : 'Dead end: undo a step.', true); return; }
        const next = g.adj(last).find(x => fromGoal.get(x) === d - 1);
        if (next) { hints++; inp.value = next.toUpperCase(); say(api.fr ? 'Indice placé — valide-le !' : 'Hint placed — submit it!'); api.sfx('pop'); }
      };
      const win = () => {
        const steps = chain.length - 1;
        const stars = hints ? 1 : steps <= par ? 3 : steps <= par + 2 ? 2 : 1;
        api.finish({ score: Math.max(10, (len * 40 + par * 30) - (steps - par) * 20 - hints * 40), stars, xp: 10 + par * 3, title: steps <= par ? (api.fr ? 'Normale atteinte !' : 'Par achieved!') : t('solved'), lines: [`${chain.map(w => up(Lex.display(w, api.lang))).join(' → ')}`, `${t('moves')}: ${steps} · ${api.fr ? 'normale' : 'par'} ${par}`], again: () => play(len, dmin, dmax), menu });
      };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
      render();
    };
    menu();
  },
});
