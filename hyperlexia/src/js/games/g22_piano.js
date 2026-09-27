'use strict';
registerGame({
  id: 'piano', n: 22, cat: 'music', colors: ['#ff4fd8', '#170a3d'],
  glyph: `<rect x="14" y="54" width="72" height="32" rx="4" fill="#fff"/>${[27, 41, 59, 73].map(x => `<rect x="${x - 4}" y="54" width="8" height="18" rx="2" fill="#170a3d"/>`).join('')}
    ${[20, 34, 48, 62, 76].map(x => `<line x1="${x + 3}" y1="54" x2="${x + 3}" y2="86" stroke="#170a3d" stroke-width="1"/>`).join('')}
    <rect x="22" y="14" width="10" height="26" rx="3" fill="#37e2ff"/><rect x="46" y="24" width="10" height="16" rx="3" fill="#ffc545"/><rect x="66" y="8" width="10" height="32" rx="3" fill="#9dff5b"/>`,
  name: { en: 'Pianissimo', fr: 'Pianissimo' },
  tag: { en: 'Falling-note piano game with real melodies and karaoke lyrics.', fr: 'Jeu de piano à notes tombantes, vraies mélodies et paroles karaoké.' },
  how: {
    en: '<p>Notes fall toward the keyboard — press the matching key when they reach the glowing line. Use your <b>computer keyboard</b> (tracker layout: bottom row Z X C V B N M = C D E F G A B, top row Q W E R T Y U = next octave, number keys = sharps), or click/tap the keys. <b>Perform</b> judges your timing; <b>Learn</b> waits for you; <b>Listen</b> plays the song for you. Lower the tempo anytime.</p>',
    fr: '<p>Les notes tombent vers le clavier — appuie sur la bonne touche quand elles touchent la ligne lumineuse. Utilise ton <b>clavier d’ordinateur</b> (rangée du bas Z X C V B N M = do ré mi fa sol la si, rangée du haut Q W E R T Y U = octave suivante, chiffres = dièses), ou clique/touche les touches. <b>Performance</b> juge ton rythme; <b>Apprentissage</b> t’attend; <b>Écoute</b> joue la pièce pour toi.</p>',
  },
  why: {
    en: 'Music is a relative strength in autism — pitch perception, musical memory and music-evoked emotion (Quintin, 2019) — and music therapy shows moderate-certainty benefits for global improvement and quality of life (Geretsegger et al., 2022). Reading lyrics while playing links print, sound and rhythm.',
    fr: 'La musique est une force relative en autisme — perception des hauteurs, mémoire musicale et émotions (Quintin, 2019) — et la musicothérapie montre des bienfaits de certitude modérée (Geretsegger et al., 2022). Lire les paroles en jouant relie l’écrit, le son et le rythme.',
  },
  start(api) {
    const D = api.data; D.song = D.song || {};
    let tempo = D.tempo || 100, labels = D.labels || (api.fr ? 'fr' : 'en');
    const menu = () => UI.menu(api, {
      options: [
        ...SONGS.map(s => ({ icon: '★'.repeat(s.lvl), name: s.name, desc: { en: `${D.song[s.id] ? '⭐'.repeat(D.song[s.id]) : 'Not played'} · ${s.notes.length} notes${s.lyr[api.lang] ? ' · lyrics' : ''}`, fr: `${D.song[s.id] ? '⭐'.repeat(D.song[s.id]) : 'Pas encore jouée'} · ${s.notes.length} notes${s.lyr[api.lang] || s.lyr.fr ? ' · paroles' : ''}` }, go: () => songMenu(s) })),
        { icon: '🎹', name: { en: 'Free play', fr: 'Jeu libre' }, desc: { en: 'Explore the piano, see note names', fr: 'Explore le piano et le nom des notes' }, go: () => free() },
      ],
      extra: h('div', { class: 'panel row' }, h('span', null, '⏱️ Tempo'), h('input', { type: 'range', min: 50, max: 130, step: 5, value: tempo, oninput: e => { tempo = +e.target.value; D.tempo = tempo; api.save(); e.target.nextSibling.textContent = tempo + '%'; } }), h('span', { class: 'mono' }, tempo + '%'),
        h('span', { class: 'spacer' }), h('span', null, api.fr ? 'Noms :' : 'Names:'), h('div', { class: 'seg' }, ...['en', 'fr', 'none'].map(v => h('button', { class: labels === v ? 'sel' : '', onclick: () => { labels = v; D.labels = v; api.save(); menu(); } }, v === 'en' ? 'C D E' : v === 'fr' ? 'do ré mi' : '—')))),
    });
    const songMenu = s => UI.menu(api, { title: L(s.name), options: [
      { icon: '🎯', name: { en: 'Perform', fr: 'Performance' }, desc: { en: 'Timing is judged', fr: 'Le rythme est évalué' }, go: () => play(s, 'perform') },
      { icon: '🐢', name: { en: 'Learn', fr: 'Apprentissage' }, desc: { en: 'Notes wait for you', fr: 'Les notes t’attendent' }, go: () => play(s, 'learn') },
      { icon: '🎧', name: { en: 'Listen', fr: 'Écoute' }, desc: { en: 'Hear it first', fr: 'Écoute-la d’abord' }, go: () => play(s, 'listen') },
      { icon: '←', name: { en: 'Back', fr: 'Retour' }, go: menu }] });
    const setup = (from, to, base) => {
      const whites = []; for (let m = from; m <= to; m++) if (!Music.isBlack(m)) whites.push(m);
      const W = Math.min(1000, innerWidth - 40), kw = W / whites.length;
      const geo = {};
      whites.forEach((m, i) => geo[m] = { x: i * kw, w: kw, black: false });
      for (let m = from; m <= to; m++) if (Music.isBlack(m)) { const wi = whites.indexOf(m - 1); if (wi >= 0) geo[m] = { x: (wi + 1) * kw - kw * 0.3, w: kw * 0.6, black: true }; }
      return { W, geo, whites };
    };
    const drawKeys = (c, G, y, H, pressed, keymap) => {
      const lbl = m => labels === 'none' ? '' : Music.name(m, labels);
      for (const m in G.geo) { const g = G.geo[m]; if (g.black) continue; c.fillStyle = pressed[m] ? '#37e2ff' : '#f3f3f7'; c.fillRect(g.x + 1, y, g.w - 2, H); c.fillStyle = '#556'; c.font = '700 12px Segoe UI'; c.textAlign = 'center'; c.fillText(lbl(+m), g.x + g.w / 2, y + H - 26); if (keymap[m]) { c.fillStyle = '#9aa'; c.fillText(keymap[m], g.x + g.w / 2, y + H - 10); } }
      for (const m in G.geo) { const g = G.geo[m]; if (!g.black) continue; c.fillStyle = pressed[m] ? '#9b7bff' : '#121218'; c.fillRect(g.x, y, g.w, H * 0.6); c.fillStyle = '#ffc545'; c.font = '700 10px Segoe UI'; c.textAlign = 'center'; if (keymap[m]) c.fillText(keymap[m], g.x + g.w / 2, y + H * 0.6 - 8); }
    };
    const play = (s, mode) => {
      const ms = s.notes.map(n => n.m), lo = Math.min(...ms), hi = Math.max(...ms);
      const base = Math.floor(lo / 12) * 12, from = base, to = Math.max(hi, base + 16);
      const G = setup(from, to);
      const { map, rev } = Music.trackerMap(base);
      const H = 440, KH = 120, hitY = H - KH - 4;
      const root = api.clear();
      const cv = h('canvas', { class: 'game', width: G.W, height: H });
      const lyr = h('div', { class: 'center', style: { fontSize: '26px', fontWeight: 800, minHeight: '40px', marginTop: '8px', letterSpacing: '.02em' } });
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: G.W + 40 + 'px' } }, h('div', { class: 'row', style: { marginBottom: '8px' } }, h('b', null, L(s.name)), h('span', { class: 'chip' }, { perform: api.fr ? 'Performance' : 'Perform', learn: api.fr ? 'Apprentissage' : 'Learn', listen: api.fr ? 'Écoute' : 'Listen' }[mode]), h('span', { class: 'spacer' }), h('button', { class: 'btn sm', onclick: () => songMenu(s) }, t('menu'))), cv, lyr));
      const c = cv.getContext('2d');
      const spb = 60 / (s.bpm * tempo / 100), pxps = 190;
      const notes = s.notes.map((n, i) => ({ ...n, i, time: n.t * spb, dur: n.d * spb, hit: null }));
      const ly = s.lyr[api.lang] || s.lyr.fr || s.lyr.en || null;
      let now = -3 * spb, score = 0, combo = 0, maxCombo = 0, perfect = 0, good = 0, miss = 0, over = false;
      const pressed = {};
      const judgeTxt = [];
      const nextUnhit = () => notes.find(n => !n.hit);
      const hitKey = m => {
        if (over) return;
        pressed[m] = 0.12; Sound.piano(m, 1, 0.3);
        if (mode === 'listen') return;
        const cand = notes.filter(n => !n.hit && n.m === m && Math.abs(n.time - now) < 0.3).sort((a, b) => Math.abs(a.time - now) - Math.abs(b.time - now))[0];
        if (mode === 'learn') { const nu = nextUnhit(); if (nu && nu.m === m && nu.time - now < 0.35) { nu.hit = 'perfect'; perfect++; combo++; score += 100; maxCombo = Math.max(maxCombo, combo); pop(nu, api.fr ? 'Bravo' : 'Nice', '#9dff5b'); } else if (nu) { combo = 0; } return; }
        if (!cand) { combo = 0; return; }
        const err = Math.abs(cand.time - now);
        if (err < 0.09) { cand.hit = 'perfect'; perfect++; score += 100 + combo * 2; pop(cand, 'Perfect', '#9dff5b'); }
        else if (err < 0.2) { cand.hit = 'good'; good++; score += 60 + combo; pop(cand, 'Good', '#37e2ff'); }
        else { cand.hit = 'good'; good++; score += 30; pop(cand, 'OK', '#ffc545'); }
        combo++; maxCombo = Math.max(maxCombo, combo);
      };
      const pop = (n, txt, col) => { const g = G.geo[n.m]; if (g) judgeTxt.push({ x: g.x + g.w / 2, y: hitY - 20, txt, col, t: 0.7 }); };
      api.key(e => { if (e.repeat || e.ctrlKey || e.metaKey) return; const m = map[e.key.toLowerCase()]; if (m != null && G.geo[m]) { e.preventDefault(); hitKey(m); } if (e.key === 'Escape') songMenu(s); });
      cv.addEventListener('pointerdown', e => {
        const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * (cv.width / r.width), y = (e.clientY - r.top) * (cv.height / r.height);
        if (y < hitY) return;
        let best = null; for (const m in G.geo) { const g = G.geo[m]; if (x >= g.x && x <= g.x + g.w && (g.black ? y < hitY + KH * 0.6 : true)) { if (!best || g.black) best = +m; } }
        if (best != null) hitKey(best);
      });
      const stop = api.loop(dt => {
        if (!over) {
          if (mode === 'learn') { const nu = nextUnhit(); if (!nu || now < nu.time) now = Math.min(now + dt, nu ? nu.time : now + dt); }
          else now += dt;
          if (mode === 'listen') notes.forEach(n => { if (!n.hit && now >= n.time) { n.hit = 'perfect'; Sound.piano(n.m, Math.max(0.4, n.dur * 1.2), 0.3); pressed[n.m] = Math.min(0.3, n.dur); } });
          if (mode === 'perform') notes.forEach(n => { if (!n.hit && now - n.time > 0.3) { n.hit = 'miss'; miss++; combo = 0; pop(n, 'Miss', '#ff5d73'); } });
          if (notes.every(n => n.hit) && now > notes[notes.length - 1].time + 1) finish();
        }
        for (const k in pressed) { pressed[k] -= dt; if (pressed[k] <= 0) delete pressed[k]; }
        judgeTxt.forEach(j => { j.t -= dt; j.y -= 30 * dt; });
        // draw
        c.fillStyle = '#060818'; c.fillRect(0, 0, G.W, H);
        for (const m in G.geo) { const g = G.geo[m]; if (!g.black) { c.fillStyle = 'rgba(255,255,255,.03)'; c.fillRect(g.x, 0, 1, hitY); } }
        const cols = ['#37e2ff', '#ff4fd8', '#ffc545', '#9dff5b', '#9b7bff'];
        for (const n of notes) {
          const g = G.geo[n.m]; if (!g) continue;
          const yb = hitY - (n.time - now) * pxps, len = Math.max(10, n.dur * pxps - 4);
          if (yb < -10 || yb - len > hitY + 40) continue;
          if (n.hit === 'miss') c.globalAlpha = 0.25; else if (n.hit && mode !== 'listen') c.globalAlpha = 0.15;
          c.fillStyle = cols[n.m % 5]; c.shadowColor = c.fillStyle; c.shadowBlur = 12;
          const r = 6, x = g.x + 3, w = g.w - 6, y = yb - len;
          c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + len, r); c.arcTo(x + w, y + len, x, y + len, r); c.arcTo(x, y + len, x, y, r); c.arcTo(x, y, x + w, y, r); c.fill();
          c.shadowBlur = 0; c.globalAlpha = 1;
          if (labels !== 'none' && len > 18) { c.fillStyle = '#061024'; c.font = '800 11px Segoe UI'; c.textAlign = 'center'; c.fillText(Music.name(n.m, labels), g.x + g.w / 2, yb - 6); }
        }
        const gl = c.createLinearGradient(0, hitY - 3, 0, hitY + 3); gl.addColorStop(0, 'rgba(55,226,255,0)'); gl.addColorStop(.5, '#37e2ff'); gl.addColorStop(1, 'rgba(55,226,255,0)');
        c.fillStyle = gl; c.fillRect(0, hitY - 3, G.W, 6);
        drawKeys(c, G, hitY + 4, KH, pressed, rev);
        judgeTxt.forEach(j => { if (j.t > 0) { c.globalAlpha = Math.min(1, j.t * 2); c.fillStyle = j.col; c.font = '900 18px Segoe UI'; c.textAlign = 'center'; c.fillText(j.txt, j.x, j.y); c.globalAlpha = 1; } });
        if (now < 0) { c.fillStyle = '#fff'; c.font = '900 64px Segoe UI'; c.textAlign = 'center'; c.fillText(Math.ceil(-now / spb), G.W / 2, hitY / 2); }
        // lyrics
        if (ly) { const cur = notes.findIndex(n => n.time + n.dur > now); const i0 = Math.max(0, cur - 4); lyr.innerHTML = ly.slice(i0, i0 + 10).map((w, k) => `<span style="color:${i0 + k === cur ? '#ffc545' : i0 + k < cur ? '#7e89b8' : '#eef2ff'};margin:0 3px">${escapeHtml(w)}</span>`).join(''); }
        const total = notes.length;
        api.hud([[t('score'), fmt(score)], [t('combo'), combo], ['🎯', `${Math.round(100 * (perfect + good) / Math.max(1, perfect + good + miss))}%`], ['♪', `${notes.filter(n => n.hit).length}/${total}`]]);
      });
      api.onExit(stop);
      const finish = () => {
        if (over) return; over = true;
        if (mode === 'listen') { songMenu(s); return; }
        const acc = (perfect + good) / notes.length, pf = perfect / notes.length;
        const stars = mode === 'learn' ? (acc >= 1 ? 2 : 1) : acc >= 0.9 && pf >= 0.5 ? 3 : acc >= 0.75 ? 2 : acc >= 0.5 ? 1 : 0;
        D.song[s.id] = Math.max(D.song[s.id] || 0, stars); api.save();
        if (stars >= 3) api.badge('pianist');
        api.finish({ score, stars, xp: 10 + Math.round(acc * 20), title: L(s.name), lines: [`Perfect ${perfect} · Good ${good} · Miss ${miss} · ${t('combo')} ${maxCombo}`, `${t('accuracy')}: ${Math.round(acc * 100)}%`], again: () => play(s, mode), menu: () => songMenu(s) });
      };
    };
    const free = () => {
      const root = api.clear();
      const big = h('div', { class: 'center', style: { fontSize: '64px', fontWeight: 950, minHeight: '80px' } });
      const sub = h('div', { class: 'center muted', style: { fontSize: '18px', minHeight: '26px' } });
      const { map, rev } = Music.trackerMap(48);
      const kb = Music.keyboard({ from: 48, to: 76, label: labels === 'none' ? null : labels, keymap: rev, height: 180, onNote: m => show(m) });
      const staff = h('div', { class: 'center' });
      const show = m => { Sound.piano(m, 1.4, 0.32); kb.press(m); big.textContent = `${Music.name(m, 'en', true)} · ${Music.name(m, 'fr')}`; sub.textContent = `MIDI ${m} · ${(440 * Math.pow(2, (m - 69) / 12)).toFixed(2)} Hz`; staff.innerHTML = Music.staffSVG([m], { w: 240, clef: m < 60 ? 'bass' : 'treble' }); };
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: '1100px' } }, big, sub, staff, h('div', { style: { marginTop: '12px' } }, kb.el), h('p', { class: 'muted center' }, api.fr ? 'Utilise la souris ou le clavier (Z à M, Q à P, chiffres pour les dièses).' : 'Use the mouse or keyboard (Z–M, Q–P, number keys for sharps).'), h('div', { class: 'center' }, h('button', { class: 'btn', onclick: menu }, t('menu')))));
      api.key(e => { if (e.repeat || e.ctrlKey || e.metaKey) return; const m = map[e.key.toLowerCase()]; if (m != null && m <= 76) { e.preventDefault(); show(m); } });
    };
    menu();
  },
});
