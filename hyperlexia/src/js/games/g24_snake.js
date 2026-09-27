'use strict';
registerGame({
  id: 'snake', n: 24, cat: 'words', colors: ['#9dff5b', '#0f7a3a'],
  glyph: `<path d="M22 72 Q22 52 40 52 H60 Q76 52 76 36 Q76 22 62 22 H48" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round"/>
    <circle cx="46" cy="22" r="8"/><circle cx="43" cy="19" r="2" fill="#0f7a3a"/><text x="30" y="92" font-size="14">W</text><text x="62" y="92" font-size="14" fill-opacity=".6">O</text>`,
  name: { en: 'Definition Snake', fr: 'Serpent des définitions' },
  tag: { en: 'Read the clue, then eat the letters of the answer in order.', fr: 'Lis l’indice, puis mange les lettres de la réponse dans l’ordre.' },
  how: {
    en: '<p>A definition appears above the board. Steer the snake (arrows, WASD, swipe or the pad) to eat the letters of the answer <b>in the right order</b>. Wrong letter = lose a life. Finish the word to grow, score and unlock the next clue. Avoid walls and your own tail (walls wrap in relaxed mode). After two mistakes, the first letters appear.</p>',
    fr: '<p>Une définition apparaît au-dessus. Dirige le serpent (flèches, WASD, glisser ou boutons) pour manger les lettres de la réponse <b>dans l’ordre</b>. Mauvaise lettre = une vie perdue. Termine le mot pour grandir et passer au suivant. Évite les murs et ta queue (les murs se traversent en mode détente).</p>',
  },
  why: {
    en: 'Every round starts from meaning and ends in spelling — retrieval from definition to word, the direction that builds comprehension (Macdonald et al., 2022), wrapped in a fast arcade game.',
    fr: 'Chaque manche part du sens et se termine par l’orthographe — passer de la définition au mot, la direction qui bâtit la compréhension (Macdonald et al., 2022), dans un jeu d’arcade rapide.',
  },
  start(api) {
    const narrow = innerWidth < 700, C = narrow ? 13 : 22, R = narrow ? 16 : 15, S = 30;
    const menu = () => UI.menu(api, {
      options: [
        { icon: '🐍', name: { en: 'Classic', fr: 'Classique' }, desc: { en: 'Speed rises with each word', fr: 'La vitesse augmente à chaque mot' }, go: () => play(null) },
        ...['mus', 'sci', 'num', 'emo', 'lang'].map(c => ({ icon: { mus: '🎼', sci: '🔭', num: '🔢', emo: '💗', lang: '📚' }[c], name: CAT_NAMES[c], desc: { en: 'Themed clues', fr: 'Indices thématiques' }, go: () => play(c) })),
      ],
      extra: h('div', { class: 'muted center' }, `${t('best')}: ${fmt(api.best)}`),
    });
    const play = cat => {
      const pool = Lex.get(api.lang).gloss.filter(g => /^[a-z]{3,8}$/.test(norm(g.w)) && (!cat || g.c === cat));
      const root = api.clear();
      const clue = h('div', { class: 'fb info', style: { fontSize: '18px', minHeight: '50px' } });
      const slots = h('div', { class: 'row', style: { justifyContent: 'center', gap: '4px', margin: '8px 0' } });
      const cv = h('canvas', { class: 'game', width: C * S, height: R * S, style: { width: '100%', maxWidth: C * S + 'px' } });
      const dpad = h('div', { class: 'dpad' }, h('span'), h('button', { onclick: () => turn(0, -1) }, '▲'), h('span'), h('button', { onclick: () => turn(-1, 0) }, '◀'), h('button', { onclick: () => turn(0, 1) }, '▼'), h('button', { onclick: () => turn(1, 0) }, '▶'));
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: C * S + 40 + 'px' } }, clue, slots, cv, dpad));
      const c = cv.getContext('2d');
      let snake = [{ x: 3, y: 7 }, { x: 2, y: 7 }, { x: 1, y: 7 }], dir = { x: 1, y: 0 }, nextDir = dir, items = [], word, entry, idx = 0, score = 0, lives = 3, wrongs = 0, words = 0, tick = 0, over = false, flash = 0, parts = [], ready = 1.6;
      const period = () => Math.max(0.065, 0.16 - words * 0.008) / (api.relaxed ? 0.65 : 1);
      const free = () => { let p; do { p = { x: rand(C), y: rand(R) }; } while (snake.some(s => s.x === p.x && s.y === p.y) || items.some(i => i.x === p.x && i.y === p.y)); return p; };
      const newWord = () => {
        entry = pick(pool); word = norm(entry.w); idx = 0; wrongs = 0; items = [];
        const letters = [...word];
        letters.forEach(l => items.push({ ...free(), l }));
        for (let i = 0; i < 4 + Math.min(4, words); i++) { let l; do { l = Lex.randLetter(api.lang); } while (letters.includes(l)); items.push({ ...free(), l }); }
        paintClue();
      };
      const paintClue = () => {
        clue.innerHTML = ''; clue.append(h('b', null, '📖 '), entry.d, h('span', { class: 'muted' }, ` (${word.length})`));
        slots.innerHTML = '';
        [...word].forEach((l, i) => slots.appendChild(h('div', { class: 'tile', style: { width: '40px', height: '44px', fontSize: '22px', background: i < idx ? '#2fb36a' : 'rgba(255,255,255,.08)' } }, i < idx || (wrongs >= 2 && i < 2) ? l.toUpperCase() : '')));
      };
      const turn = (x, y) => { if (dir.x === -x && dir.y === -y) return; nextDir = { x, y }; };
      api.key(e => { const k = e.key.toLowerCase(); const m = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] }[k]; if (m) { e.preventDefault(); turn(...m); } });
      let sx = 0, sy = 0;
      cv.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      cv.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return; if (Math.abs(dx) > Math.abs(dy)) turn(Math.sign(dx), 0); else turn(0, Math.sign(dy)); });
      const die = () => { lives--; api.sfx('boom'); flash = 0.4; if (lives <= 0) return end(); snake = [{ x: 3, y: 7 }, { x: 2, y: 7 }, { x: 1, y: 7 }]; dir = nextDir = { x: 1, y: 0 }; ready = 1.4; };
      const step = () => {
        dir = nextDir;
        let hd = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (hd.x < 0 || hd.y < 0 || hd.x >= C || hd.y >= R) { if (api.relaxed) hd = { x: (hd.x + C) % C, y: (hd.y + R) % R }; else return die(); }
        if (snake.some(s => s.x === hd.x && s.y === hd.y)) return die();
        snake.unshift(hd);
        const it = items.find(i => i.x === hd.x && i.y === hd.y);
        if (it) {
          if (it.l === word[idx]) {
            items = items.filter(i => i !== it); idx++; score += 20; api.sfx('coin');
            for (let k = 0; k < 12; k++) parts.push({ x: hd.x * S + S / 2, y: hd.y * S + S / 2, vx: (Math.random() - .5) * 200, vy: (Math.random() - .5) * 200, t: .5 });
            if (idx >= word.length) { words++; score += 50 + word.length * 15; api.sfx('great'); api.xp(4); api.toast(`${up(Lex.display(word, api.lang))} — ${entry.d}`, '🐍'); newWord(); } else paintClue();
            return;
          } else { items = items.filter(i => i !== it); items.push({ ...free(), l: it.l }); wrongs++; api.sfx('bad'); flash = 0.25; lives--; paintClue(); if (lives <= 0) return end(); }
        }
        snake.pop();
      };
      const draw = () => {
        c.fillStyle = '#04110a'; c.fillRect(0, 0, C * S, R * S);
        c.strokeStyle = 'rgba(157,255,91,.05)'; for (let x = 0; x <= C; x++) { c.beginPath(); c.moveTo(x * S, 0); c.lineTo(x * S, R * S); c.stroke(); } for (let y = 0; y <= R; y++) { c.beginPath(); c.moveTo(0, y * S); c.lineTo(C * S, y * S); c.stroke(); }
        for (const it of items) { c.fillStyle = 'rgba(255,255,255,.1)'; c.beginPath(); c.arc(it.x * S + S / 2, it.y * S + S / 2, S / 2 - 2, 0, 7); c.fill(); c.fillStyle = '#fff'; c.font = `900 ${S * 0.6}px Segoe UI`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(it.l.toUpperCase(), it.x * S + S / 2, it.y * S + S / 2 + 1); }
        snake.forEach((s, i) => { const g = 1 - i / (snake.length + 4); c.fillStyle = `rgba(${60 + 97 * g},${200 + 55 * g},${80 + 11 * g},1)`; const pad = i ? 3 : 1; c.beginPath(); c.roundRect ? c.roundRect(s.x * S + pad, s.y * S + pad, S - pad * 2, S - pad * 2, 8) : c.rect(s.x * S + pad, s.y * S + pad, S - pad * 2, S - pad * 2); c.fill(); });
        const hd = snake[0]; c.fillStyle = '#04110a'; c.beginPath(); c.arc(hd.x * S + S / 2 + dir.x * 6 - dir.y * 5, hd.y * S + S / 2 + dir.y * 6 - dir.x * 5, 3, 0, 7); c.arc(hd.x * S + S / 2 + dir.x * 6 + dir.y * 5, hd.y * S + S / 2 + dir.y * 6 + dir.x * 5, 3, 0, 7); c.fill();
        parts.forEach(p => { c.globalAlpha = Math.max(0, p.t * 2); c.fillStyle = '#9dff5b'; c.fillRect(p.x, p.y, 3, 3); }); c.globalAlpha = 1;
        if (flash > 0) { c.fillStyle = `rgba(255,93,115,${flash})`; c.fillRect(0, 0, C * S, R * S); }
      };
      const end = () => { over = true; api.finish({ score, stars: words >= 10 ? 3 : words >= 6 ? 2 : words >= 3 ? 1 : 0, xp: 5 + words * 3, lines: [`${words} ${api.fr ? 'mots' : 'words'}`], again: () => play(cat), menu }); };
      newWord();
      api.loop(dt => {
        if (over) return;
        tick += dt; flash = Math.max(0, flash - dt); parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.t -= dt; }); parts = parts.filter(p => p.t > 0);
        if (ready > 0) { ready -= dt; tick = 0; } else while (tick >= period()) { tick -= period(); step(); if (over) break; }
        draw();
        if (ready > 0) { c.fillStyle = 'rgba(4,17,10,.55)'; c.fillRect(0, 0, C * S, R * S); c.fillStyle = '#9dff5b'; c.font = '900 48px Segoe UI'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(api.fr ? 'PRÊT ?' : 'READY?', C * S / 2, R * S / 2); c.font = '600 18px Segoe UI'; c.fillText(api.fr ? 'Lis l’indice, puis va vers la 1re lettre' : 'Read the clue, then find letter 1', C * S / 2, R * S / 2 + 44); }
        api.hud([[t('score'), score], ['❤', lives], [api.fr ? 'Mots' : 'Words', words]]);
      });
    };
    menu();
  },
});
