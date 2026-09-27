'use strict';
registerGame({
  id: 'racer', n: 25, cat: 'meaning', colors: ['#ff4f7b', '#2a2f9e'],
  glyph: `<path d="M30 88 L44 30 H56 L70 88Z" fill="#fff" fill-opacity=".25"/><path d="M49 36 v8 M49 52 v10 M49 70 v12" stroke="#fff" stroke-width="3"/>
    <rect x="32" y="62" width="36" height="20" rx="6"/><rect x="36" y="54" width="28" height="12" rx="5" fill-opacity=".8"/><circle cx="38" cy="84" r="4" fill="#2a2f9e"/><circle cx="62" cy="84" r="4" fill="#2a2f9e"/>
    <text x="50" y="22" font-size="12" text-anchor="middle">their?</text>`,
  name: { en: 'Grammar Racer', fr: 'Course grammaticale' },
  tag: { en: 'Race through the gate with the word that fits the sentence.', fr: 'Fonce dans la porte qui contient le bon mot.' },
  how: {
    en: '<p>A sentence with a blank appears at the top. Three gates race toward you — steer (← → or A D, or tap the sides) into the lane whose word completes the sentence correctly. Right gates give a boost; wrong gates cost a shield. Finish 15 sentences as fast as you can.</p>',
    fr: '<p>Une phrase à trou apparaît en haut. Trois portes arrivent — dirige-toi (← → ou A D, ou touche les côtés) vers la voie dont le mot complète la phrase. La bonne porte donne un turbo; la mauvaise coûte un bouclier. Termine 15 phrases le plus vite possible.</p>',
  },
  why: {
    en: 'Choosing between their/there/they’re or a/à forces sentence-level meaning, not just decoding — the step from word to sentence comprehension that the McGill tablet program trained (Macdonald et al., 2022), and that context-based reading relies on (Snowling & Frith, 1986).',
    fr: 'Choisir entre a/à ou ses/ces oblige à comprendre la phrase, pas seulement à décoder — le passage du mot à la phrase travaillé par le programme de McGill (Macdonald et al., 2022) et la lecture en contexte (Snowling et Frith, 1986).',
  },
  start(api) {
    const Wd = 900, Ht = 560;
    const menu = () => UI.menu(api, {
      options: [
        { icon: '🏁', name: { en: 'Grand Prix · 15 sentences', fr: 'Grand Prix · 15 phrases' }, desc: { en: 'Speed builds as you go', fr: 'La vitesse augmente' }, go: () => play(15, 1) },
        { icon: '🚀', name: { en: 'Turbo league', fr: 'Ligue turbo' }, desc: { en: 'Starts fast', fr: 'Commence vite' }, go: () => play(15, 1.5) },
        { icon: '🚲', name: { en: 'Practice lap', fr: 'Tour de pratique' }, desc: { en: 'Slow, 8 sentences', fr: 'Lent, 8 phrases' }, go: () => play(8, 0.6) },
      ],
      extra: h('div', { class: 'muted center' }, `${t('best')}: ${fmt(api.best)}`),
    });
    const play = (N, spd0) => {
      const qs = sample(RACER[api.lang], N);
      const root = api.clear();
      const sent = h('div', { class: 'center', style: { fontSize: '26px', fontWeight: 800, minHeight: '40px', marginBottom: '8px' } });
      const cv = h('canvas', { class: 'game', width: Wd, height: Ht, style: { width: '100%', maxWidth: Wd + 'px' } });
      const res = h('div', { class: 'center', style: { minHeight: '28px', fontWeight: 700, marginTop: '6px' } });
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: Wd + 40 + 'px' } }, sent, cv, res, h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '8px' } }, h('button', { class: 'btn lg', onclick: () => steer(-1) }, '◀'), h('button', { class: 'btn lg', onclick: () => steer(1) }, '▶'))));
      const c = cv.getContext('2d');
      let lane = 1, carX = 1, qi = 0, gateZ = 1, speed = 0.18 * spd0 * (api.relaxed ? 0.65 : 1), shields = 3, score = 0, good = 0, boost = 0, stripe = 0, over = false, opts = [], ans = 0, shake = 0, t0 = performance.now(), feedbackT = 0;
      const load = () => { const q = qs[qi]; opts = shuffle([q.a, ...q.w]); ans = opts.indexOf(q.a); gateZ = 1; sent.innerHTML = escapeHtml(q.s).replace('___', '<span style="color:#ffc545;border-bottom:3px solid #ffc545;padding:0 18px">?</span>'); };
      const steer = d => { lane = clamp(lane + d, 0, 2); api.sfx('tick'); };
      api.key(e => { const k = e.key.toLowerCase(); if (k === 'arrowleft' || k === 'a') { e.preventDefault(); steer(-1); } if (k === 'arrowright' || k === 'd') { e.preventDefault(); steer(1); } });
      cv.addEventListener('pointerdown', e => { const r = cv.getBoundingClientRect(); steer(e.clientX - r.left < r.width / 2 ? -1 : 1); });
      const proj = (lx, z) => { const horizon = 150, y = horizon + (Ht - horizon) * (1 - z) ** 2.2, w = 60 + (Wd * 1.3 - 60) * (1 - z) ** 2.2; return { x: Wd / 2 + lx * w / 3, y, w }; };
      load();
      const stop = api.loop(dt => {
        if (over) return;
        const v = speed * (1 + qi * 0.05) * (boost > 0 ? 1.8 : 1);
        gateZ -= v * dt; stripe = (stripe + v * dt * 6) % 1; boost = Math.max(0, boost - dt); shake = Math.max(0, shake - dt); feedbackT = Math.max(0, feedbackT - dt);
        carX += (lane - carX) * Math.min(1, dt * 10);
        if (gateZ <= 0) {
          const q = qs[qi], ok = lane === ans;
          if (ok) { good++; score += 100 + Math.round(boost * 50); boost = 1.2; api.sfx('coin'); res.textContent = `✅ ${q.s.replace('___', q.a)}`; res.style.color = 'var(--good)'; }
          else { shields--; shake = 0.5; api.sfx('boom'); res.textContent = `❌ ${q.s.replace('___', q.a)}`; res.style.color = 'var(--bad)'; }
          feedbackT = 1.5; qi++;
          if (qi >= N || shields <= 0) return end();
          load();
        }
        // draw
        const sx = shake ? (Math.random() - .5) * 14 : 0;
        c.save(); c.translate(sx, 0);
        const sky = c.createLinearGradient(0, 0, 0, 150); sky.addColorStop(0, '#12062e'); sky.addColorStop(1, '#ff4f7b'); c.fillStyle = sky; c.fillRect(-20, 0, Wd + 40, 150);
        c.fillStyle = '#ffc545'; c.beginPath(); c.arc(Wd / 2, 150, 60, Math.PI, 0); c.fill();
        c.fillStyle = '#1a0f3d'; for (let i = 0; i < 18; i++) { const bw = 30 + (i * 37) % 40, bh = 30 + (i * 53) % 70; c.fillRect(i * 52 - 10, 150 - bh, bw, bh); }
        c.fillStyle = '#0a0a1c'; c.fillRect(-20, 150, Wd + 40, Ht);
        const top = proj(0, 1), bot = proj(0, 0);
        c.fillStyle = '#1d1f3b'; c.beginPath(); c.moveTo(Wd / 2 - top.w / 2, top.y); c.lineTo(Wd / 2 + top.w / 2, top.y); c.lineTo(Wd / 2 + bot.w / 2, bot.y); c.lineTo(Wd / 2 - bot.w / 2, bot.y); c.fill();
        for (let k = 0; k < 14; k++) { const z1 = ((k + stripe) / 14), z2 = z1 + 0.035; for (const lx of [-0.5, 0.5]) { const a = proj(lx, z1), b = proj(lx, z2); c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = Math.max(1, 6 * (1 - z1)); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); } }
        c.strokeStyle = '#ff4fd8'; c.lineWidth = 3; c.beginPath(); c.moveTo(Wd / 2 - top.w / 2, top.y); c.lineTo(Wd / 2 - bot.w / 2, bot.y); c.moveTo(Wd / 2 + top.w / 2, top.y); c.lineTo(Wd / 2 + bot.w / 2, bot.y); c.stroke();
        // gates
        if (gateZ > 0) {
          for (let i = 0; i < 3; i++) {
            const p = proj(i - 1, gateZ), gw = p.w / 3.4, gh = gw * 0.55;
            c.fillStyle = ['rgba(55,226,255,.85)', 'rgba(255,197,69,.85)', 'rgba(157,255,91,.85)'][i];
            c.fillRect(p.x - gw / 2, p.y - gh, gw, gh);
            c.fillStyle = '#0b1020'; c.font = `900 ${Math.max(10, gh * 0.42)}px Segoe UI`; c.textAlign = 'center'; c.textBaseline = 'middle';
            c.fillText(opts[i], p.x, p.y - gh / 2);
          }
        }
        // car
        const cp = proj(carX - 1, 0.05);
        c.save(); c.translate(cp.x, Ht - 70);
        c.fillStyle = boost > 0 ? '#37e2ff' : '#ff4f7b'; c.shadowColor = c.fillStyle; c.shadowBlur = 25;
        c.beginPath(); c.moveTo(-60, 30); c.lineTo(-48, -10); c.lineTo(48, -10); c.lineTo(60, 30); c.closePath(); c.fill();
        c.shadowBlur = 0; c.fillStyle = '#0b1020'; c.fillRect(-36, -30, 72, 24); c.fillStyle = '#9b7bff'; c.fillRect(-32, -26, 64, 16);
        c.fillStyle = '#111'; c.fillRect(-62, 18, 18, 20); c.fillRect(44, 18, 18, 20);
        if (boost > 0) { c.fillStyle = '#ffc545'; c.beginPath(); c.moveTo(-20, 32); c.lineTo(0, 32 + 30 * Math.random() + 20); c.lineTo(20, 32); c.fill(); }
        c.restore(); c.restore();
        api.hud([[t('score'), score], ['🛡️', shields], ['#', `${Math.min(qi + 1, N)}/${N}`], [t('time'), Math.floor((performance.now() - t0) / 1000) + 's']]);
      });
      api.onExit(stop);
      const end = () => {
        over = true;
        const secs = (performance.now() - t0) / 1000;
        api.finish({ score: score + (shields > 0 ? shields * 100 : 0), stars: shields <= 0 ? 0 : good === N ? 3 : good >= N * 0.75 ? 2 : 1, xp: 8 + good * 2, lines: [`${good}/${N} · ${Math.round(secs)} s`], again: () => play(N, spd0), menu });
      };
    };
    menu();
  },
});
