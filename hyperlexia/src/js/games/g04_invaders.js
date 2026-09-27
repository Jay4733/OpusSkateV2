'use strict';
registerGame({
  id: 'invaders', n: 4, cat: 'words', colors: ['#ff4fd8', '#5b2bff'],
  glyph: `<path d="M50 14 L64 34 L78 30 L70 50 L78 64 L50 56 L22 64 L30 50 L22 30 L36 34Z"/><rect x="47" y="60" width="6" height="22" rx="3"/>
    <text x="50" y="47" font-size="13" text-anchor="middle" fill="#5b2bff">abc</text><circle cx="50" cy="88" r="4"/>`,
  name: { en: 'Word Invaders', fr: 'Envahisseurs de mots' },
  tag: { en: 'Type to blast word-ships. Bosses only show a definition — name the word!', fr: 'Tape pour détruire les vaisseaux-mots. Les boss n’affichent qu’une définition !' },
  how: {
    en: '<p>Type the word on a ship to lock on and fire. Finish words before they reach your shields. <b>Golden ships</b> are power-ups (❄️ freeze, 💣 bomb, 🛡️ shield). Every 4th wave a <b>mothership</b> shows only a <i>definition</i>: type the word it defines. Accents are optional. Esc = pause.</p>',
    fr: '<p>Tape le mot d’un vaisseau pour le verrouiller et tirer. Finis les mots avant qu’ils touchent tes boucliers. Les <b>vaisseaux dorés</b> sont des bonus (❄️ gel, 💣 bombe, 🛡️ bouclier). Toutes les 4 vagues, un <b>vaisseau-mère</b> n’affiche qu’une <i>définition</i> : tape le mot défini. Accents facultatifs. Échap = pause.</p>',
  },
  why: {
    en: 'Builds typing automaticity with words the player already decodes easily, then the boss rounds force retrieval from meaning to word — the semantic link that predicts comprehension (Brown et al., 2013; Macdonald et al., 2022).',
    fr: 'Développe l’automatisme de frappe avec des mots faciles à décoder, puis les boss obligent à passer du sens au mot — le lien sémantique qui prédit la compréhension (Brown et al., 2013; Macdonald et al., 2022).',
  },
  start(api) {
    const Wd = 960, Ht = 600;
    let S = null;
    const menu = () => UI.menu(api, {
      options: [
        { icon: '🚀', name: { en: 'Campaign', fr: 'Campagne' }, desc: { en: 'Waves grow faster; bosses every 4 waves', fr: 'Vagues de plus en plus rapides' }, go: () => play(1) },
        { icon: '🧠', name: { en: 'Boss rush', fr: 'Défilé de boss' }, desc: { en: 'Only definition bosses', fr: 'Seulement des boss-définitions' }, go: () => play(1, true) },
        { icon: '🐢', name: { en: 'Training', fr: 'Entraînement' }, desc: { en: 'Slow ships, short words', fr: 'Vaisseaux lents, mots courts' }, go: () => play(1, false, true) },
      ],
      extra: h('div', { class: 'muted center' }, `${t('best')}: ${fmt(api.best)} · ${api.fr ? 'Vague max' : 'Best wave'}: ${api.data.wave || 0}`),
    });
    const pool = (minL, maxL) => {
      const lx = Lex.get(api.lang), out = [];
      for (let L2 = minL; L2 <= maxL; L2++) out.push(...(lx.byLen[L2] || []).slice(0, 1400));
      return out;
    };
    const glossWords = () => Lex.get(api.lang).gloss.filter(g => /^[a-z]+$/.test(norm(g.w)) && norm(g.w).length >= 4);
    const play = (wave, bossRush, training) => {
      const root = api.clear();
      const cv = h('canvas', { class: 'game', width: Wd, height: Ht, style: { width: '100%', maxWidth: Wd + 'px', aspectRatio: `${Wd}/${Ht}` } });
      const input = h('div', { class: 'mono center', style: { fontSize: '22px', minHeight: '32px', color: 'var(--cyan)', marginTop: '8px' } });
      const touch = matchMedia('(pointer:coarse)').matches;
      const kb = touch ? UI.keyboard(k => onKey(k), { enter: false }) : null;
      root.appendChild(h('div', { class: 'gwrap' }, cv, input, kb));
      const c = cv.getContext('2d');
      S = { wave, bossRush, training, score: 0, lives: 5, combo: 1, enemies: [], parts: [], lasers: [], target: null, spawnLeft: 0, spawnT: 0, freeze: 0, t: 0, typed: 0, wrong: 0, start: performance.now(), paused: false, over: false, stars: Array.from({ length: 120 }, () => ({ x: Math.random() * Wd, y: Math.random() * Ht, z: Math.random() })), boss: null, msg: '', msgT: 0 };
      startWave();
      const stop = api.loop(dt => { if (!S.paused && !S.over) update(dt); draw(c); });
      api.onExit(stop);
      api.key(e => {
        if (e.key === 'Escape') { S.paused = !S.paused; return; }
        if (e.key === 'Backspace') { e.preventDefault(); if (S.boss && S.boss.buf) { S.boss.buf = S.boss.buf.slice(0, -1); } return; }
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { e.preventDefault(); onKey(e.key); }
      });
      if (!touch) setTimeout(() => cv.focus(), 30);
    };
    const speedMul = () => (S.training ? 0.55 : 1) * (api.relaxed ? 0.6 : 1);
    const startWave = () => {
      S.msg = `${t('wave')} ${S.wave}`; S.msgT = 2;
      const bossWave = S.bossRush || S.wave % 4 === 0;
      if (bossWave) { spawnBoss(); S.spawnLeft = S.bossRush ? 0 : 3 + Math.floor(S.wave / 4); }
      else S.spawnLeft = 6 + S.wave * 2;
      S.spawnT = 0.5;
    };
    const spawnBoss = () => {
      const g = pick(glossWords());
      S.boss = { g, n: norm(g.w), x: Wd / 2, y: -80, buf: '', hp: 1, miss: 0, t: 0 };
    };
    const spawn = () => {
      const w = S.wave, tr = S.training;
      const [a, b] = tr ? [3, 5] : w < 3 ? [3, 5] : w < 6 ? [4, 7] : w < 10 ? [5, 9] : [6, 12];
      const cand = pool(a, b).filter(x => !S.enemies.some(e => e.n[0] === x[0]));
      const n = pick(cand.length ? cand : pool(a, b));
      const power = Math.random() < 0.08 ? pick(['freeze', 'bomb', 'shield']) : null;
      S.enemies.push({ n, word: Lex.display(n, api.lang), x: 60 + Math.random() * (Wd - 120), y: -20, vy: (18 + w * 3.2 + Math.random() * 10) * speedMul() * (power ? 1.25 : 1), idx: 0, power, wob: Math.random() * 6 });
    };
    const onKey = raw => {
      if (!S || S.over || S.paused) return;
      const ch = norm(raw); if (!/^[a-z]$/.test(ch)) return;
      if (S.boss && S.boss.y > 40 && (!S.target || S.target.idx === 0)) {
        const b = S.boss; const exp = b.n[b.buf.length];
        const small = !S.target && S.enemies.find(e => e.n[0] === ch);
        if (exp === ch && !small) { b.buf += ch; S.typed++; api.sfx('laser'); S.lasers.push({ x: b.x, y: b.y, t: 0.12 }); if (b.buf === b.n) killBoss(); return; }
        if (!small) { S.wrong++; b.miss++; S.combo = 1; api.sfx('bad'); b.shake = 0.3; return; }
      }
      if (!S.target) {
        const cand = S.enemies.filter(e => e.n[0] === ch).sort((p, q) => q.y - p.y);
        if (!cand.length) { S.wrong++; S.combo = 1; api.sfx('bad'); return; }
        S.target = cand[0];
      }
      const e = S.target;
      if (e.n[e.idx] === ch) {
        e.idx++; S.typed++; api.sfx('laser'); S.lasers.push({ x: e.x, y: e.y, t: 0.1 });
        if (e.idx >= e.n.length) kill(e);
      } else { S.wrong++; S.combo = 1; api.sfx('bad'); }
      input.textContent = S.target ? S.target.n.slice(0, S.target.idx) : '';
    };
    const boom = (x, y, col, n = 30) => { for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = 40 + Math.random() * 220; S.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: 0.6 + Math.random() * 0.5, col }); } };
    const kill = e => {
      S.enemies = S.enemies.filter(x => x !== e); S.target = null; input.textContent = '';
      const pts = e.n.length * 10 * S.combo; S.score += pts; S.combo = Math.min(8, S.combo + 0.25);
      boom(e.x, e.y, e.power ? '#ffc545' : '#ff4fd8'); api.sfx('boom');
      if (e.power === 'freeze') { S.freeze = 5; S.msg = api.fr ? '❄️ GEL !' : '❄️ FREEZE!'; S.msgT = 1.5; }
      if (e.power === 'bomb') { S.enemies.forEach(x => { boom(x.x, x.y, '#ffc545'); S.score += x.n.length * 5; }); S.enemies = []; S.msg = '💣 BOOM!'; S.msgT = 1.5; }
      if (e.power === 'shield') { S.lives = Math.min(7, S.lives + 1); S.msg = api.fr ? '🛡️ BOUCLIER +1' : '🛡️ SHIELD +1'; S.msgT = 1.5; }
    };
    const killBoss = () => {
      const b = S.boss; S.boss = null; boom(b.x, b.y, '#37e2ff', 120); api.sfx('great'); api.confetti(80);
      const pts = 300 + b.n.length * 30 - b.miss * 20; S.score += Math.max(100, pts) * Math.ceil(S.combo);
      S.defCard = { w: b.g.w, d: b.g.d, t: 4 };
      api.xp(8);
    };
    const update = dt => {
      S.t += dt;
      const fz = S.freeze > 0 ? 0.25 : 1; S.freeze = Math.max(0, S.freeze - dt);
      S.spawnT -= dt;
      if (S.spawnLeft > 0 && S.spawnT <= 0 && S.enemies.length < 6 + Math.floor(S.wave / 2)) { spawn(); S.spawnLeft--; S.spawnT = Math.max(0.55, 2.1 - S.wave * 0.12) / speedMul(); }
      for (const e of S.enemies) { e.y += e.vy * dt * fz; e.wob += dt * 2; e.x += Math.sin(e.wob) * 12 * dt; }
      const hit = S.enemies.filter(e => e.y > Ht - 70);
      hit.forEach(e => { S.lives--; boom(e.x, Ht - 60, '#ff5d73', 40); api.sfx('boom'); if (S.target === e) { S.target = null; input.textContent = ''; } S.combo = 1; });
      S.enemies = S.enemies.filter(e => e.y <= Ht - 70);
      if (S.boss) {
        const b = S.boss; b.t += dt; b.y = Math.min(170, b.y + 40 * dt); b.x = Wd / 2 + Math.sin(b.t * 0.6) * 220; b.shake = Math.max(0, (b.shake || 0) - dt);
        if (b.t > (api.relaxed || S.training ? 90 : 45)) { S.lives -= 2; boom(b.x, b.y, '#ff5d73', 80); S.defCard = { w: b.g.w, d: b.g.d, t: 4, missed: true }; S.boss = null; api.sfx('lose'); }
      }
      for (const p of S.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96; p.t -= dt; }
      S.parts = S.parts.filter(p => p.t > 0);
      S.lasers.forEach(l => l.t -= dt); S.lasers = S.lasers.filter(l => l.t > 0);
      S.msgT -= dt; if (S.defCard) { S.defCard.t -= dt; if (S.defCard.t <= 0) S.defCard = null; }
      if (S.lives <= 0) return gameOver();
      if (!S.spawnLeft && !S.enemies.length && !S.boss) { S.wave++; S.score += 50 * S.wave; api.sfx('coin'); startWave(); }
      const mins = (performance.now() - S.start) / 60000;
      api.hud([[t('score'), fmt(S.score)], [t('wave'), S.wave], ['❤', S.lives], [t('combo'), '×' + S.combo.toFixed(2)], ['WPM', Math.round(S.typed / 5 / Math.max(mins, 0.1))]]);
    };
    const draw = c => {
      c.fillStyle = '#050814'; c.fillRect(0, 0, Wd, Ht);
      for (const s of S.stars) { s.y += (8 + s.z * 30) * 0.016; if (s.y > Ht) { s.y = 0; s.x = Math.random() * Wd; } c.fillStyle = `rgba(255,255,255,${0.2 + s.z * 0.6})`; c.fillRect(s.x, s.y, 1 + s.z * 1.5, 1 + s.z * 1.5); }
      // shields / city
      c.fillStyle = 'rgba(55,226,255,.12)'; c.fillRect(0, Ht - 60, Wd, 60);
      for (let i = 0; i < S.lives; i++) { c.fillStyle = '#37e2ff'; c.beginPath(); c.arc(30 + i * 26, Ht - 30, 9, 0, 7); c.fill(); }
      // turret
      c.fillStyle = '#9b7bff'; c.beginPath(); c.moveTo(Wd / 2 - 30, Ht - 20); c.lineTo(Wd / 2, Ht - 70); c.lineTo(Wd / 2 + 30, Ht - 20); c.fill();
      for (const l of S.lasers) { c.strokeStyle = `rgba(55,226,255,${l.t * 8})`; c.lineWidth = 3; c.beginPath(); c.moveTo(Wd / 2, Ht - 70); c.lineTo(l.x, l.y); c.stroke(); }
      // enemies
      for (const e of S.enemies) {
        const tgt = e === S.target;
        c.save(); c.translate(e.x, e.y);
        c.fillStyle = e.power ? '#ffc545' : tgt ? '#ff4fd8' : '#b04cff';
        c.shadowColor = c.fillStyle; c.shadowBlur = tgt ? 20 : 8;
        c.beginPath(); c.moveTo(0, 16); c.lineTo(-22, -8); c.lineTo(-8, -4); c.lineTo(0, -16); c.lineTo(8, -4); c.lineTo(22, -8); c.closePath(); c.fill();
        c.shadowBlur = 0;
        c.font = '800 20px ui-monospace, Menlo, monospace'; c.textAlign = 'center';
        const wd = c.measureText(e.word).width;
        c.fillStyle = 'rgba(5,8,20,.8)'; c.fillRect(-wd / 2 - 6, 20, wd + 12, 26);
        const done = e.word.slice(0, e.idx), rest = e.word.slice(e.idx);
        const dw = c.measureText(done).width;
        c.textAlign = 'left'; c.fillStyle = '#37e2ff'; c.fillText(done, -wd / 2, 40); c.fillStyle = e.power ? '#ffc545' : '#fff'; c.fillText(rest, -wd / 2 + dw, 40);
        if (e.power) { c.font = '18px sans-serif'; c.fillText({ freeze: '❄️', bomb: '💣', shield: '🛡️' }[e.power], wd / 2 + 8, 40); }
        c.restore();
      }
      if (S.boss) {
        const b = S.boss, sx = b.shake ? (Math.random() - 0.5) * 10 : 0;
        c.save(); c.translate(b.x + sx, b.y);
        const gr = c.createLinearGradient(-120, 0, 120, 0); gr.addColorStop(0, '#37e2ff'); gr.addColorStop(1, '#9b7bff');
        c.fillStyle = gr; c.shadowColor = '#37e2ff'; c.shadowBlur = 30;
        c.beginPath(); c.ellipse(0, 0, 120, 34, 0, 0, 7); c.fill(); c.shadowBlur = 0;
        c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(0, -18, 50, 22, 0, Math.PI, 0); c.fill();
        c.restore();
        // definition panel
        const def = b.g.d; c.font = '600 18px Segoe UI, Arial'; c.textAlign = 'center';
        const lines = wrapText(c, '“' + def + '”', 560);
        const py = Math.max(10, b.y - 120);
        c.fillStyle = 'rgba(5,8,20,.85)'; c.fillRect(Wd / 2 - 300, py - 4, 600, lines.length * 24 + 50);
        c.strokeStyle = '#37e2ff'; c.strokeRect(Wd / 2 - 300, py - 4, 600, lines.length * 24 + 50);
        c.fillStyle = '#cdf6ff'; lines.forEach((ln, i) => c.fillText(ln, Wd / 2, py + 20 + i * 24));
        const slots = b.n.split('').map((ch, i) => i < b.buf.length ? ch.toUpperCase() : (b.miss >= 3 && i < Math.min(2, b.n.length) ? ch.toUpperCase() : '_')).join(' ');
        c.font = '900 24px ui-monospace, Menlo, monospace'; c.fillStyle = '#ffc545'; c.fillText(slots, Wd / 2, py + lines.length * 24 + 34);
      }
      for (const p of S.parts) { c.globalAlpha = Math.max(0, p.t * 1.6); c.fillStyle = p.col; c.fillRect(p.x, p.y, 3, 3); }
      c.globalAlpha = 1;
      if (S.msgT > 0) { c.font = '900 44px Segoe UI, Arial'; c.textAlign = 'center'; c.fillStyle = `rgba(255,255,255,${Math.min(1, S.msgT)})`; c.fillText(S.msg, Wd / 2, Ht / 2); }
      if (S.defCard) {
        c.font = '700 18px Segoe UI, Arial'; c.textAlign = 'center';
        c.fillStyle = S.defCard.missed ? 'rgba(255,93,115,.9)' : 'rgba(61,220,132,.9)';
        c.fillRect(Wd / 2 - 320, Ht - 130, 640, 44);
        c.fillStyle = '#04110a'; c.fillText(`📖 ${up(S.defCard.w)} — ${S.defCard.d}`.slice(0, 80), Wd / 2, Ht - 102);
      }
      if (S.freeze > 0) { c.fillStyle = 'rgba(120,200,255,.08)'; c.fillRect(0, 0, Wd, Ht); }
      if (S.paused) { c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(0, 0, Wd, Ht); c.fillStyle = '#fff'; c.font = '900 40px Segoe UI'; c.textAlign = 'center'; c.fillText('⏸ ' + t('pause') + ' — Esc', Wd / 2, Ht / 2); }
    };
    const wrapText = (c, text, max) => { const words = text.split(' '), lines = []; let line = ''; for (const w of words) { const test = line ? line + ' ' + w : w; if (c.measureText(test).width > max && line) { lines.push(line); line = w; } else line = test; } lines.push(line); return lines; };
    const gameOver = () => {
      S.over = true;
      const mins = (performance.now() - S.start) / 60000, wpm = Math.round(S.typed / 5 / Math.max(mins, 0.1)), acc = Math.round(100 * S.typed / Math.max(1, S.typed + S.wrong));
      if (S.wave > (api.data.wave || 0)) { api.data.wave = S.wave; api.save(); }
      if (S.wave >= 10) api.badge('typist');
      api.finish({ score: S.score, stars: S.wave >= 10 ? 3 : S.wave >= 6 ? 2 : S.wave >= 3 ? 1 : 0, xp: 5 + S.wave * 3, lines: [`${t('wave')} ${S.wave} · ${wpm} WPM · ${t('accuracy')} ${acc}%`], again: () => play(1, S.bossRush, S.training), menu });
    };
    menu();
  },
});
