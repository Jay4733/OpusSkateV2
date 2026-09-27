'use strict';
registerGame({
  id: 'wheel', n: 2, cat: 'meaning', colors: ['#ffc545', '#ff4f7b'],
  glyph: `<circle cx="50" cy="52" r="32" fill="none" stroke="#fff" stroke-width="6"/>
    <g stroke="#fff" stroke-width="3">${[0, 45, 90, 135].map(a => `<line x1="50" y1="52" x2="${50 + 30 * Math.cos(a * Math.PI / 180)}" y2="${52 + 30 * Math.sin(a * Math.PI / 180)}"/><line x1="50" y1="52" x2="${50 - 30 * Math.cos(a * Math.PI / 180)}" y2="${52 - 30 * Math.sin(a * Math.PI / 180)}"/>`).join('')}</g>
    <circle cx="50" cy="52" r="8"/><path d="M42 12h16l-8 12z"/>`,
  name: { en: 'Wheel of Words', fr: 'Roue des mots' },
  tag: { en: 'Spin, guess letters and out-solve two bots on proverbs, idioms and big ideas.', fr: 'Fais tourner la roue et bats deux robots sur des proverbes et des expressions québécoises.' },
  how: {
    en: '<p><b>Spin</b> the wheel, then pick a consonant: you earn the wedge value for every time it appears. <b>Buy a vowel</b> for 250. <b>Solve</b> when you know the phrase. BANKRUPT empties your round money; LOSE A TURN passes to the next player. Three rounds — the round winner banks their money. After each puzzle, a meaning card explains the proverb or idiom.</p>',
    fr: '<p><b>Tourne</b> la roue, puis choisis une consonne : tu gagnes la valeur de la case pour chaque apparition. <b>Achète une voyelle</b> pour 250. <b>Résous</b> quand tu connais la phrase. FAILLITE vide ta cagnotte de la manche; PERD SON TOUR passe au joueur suivant. Trois manches. Après chaque énigme, une carte explique le proverbe ou l’expression.</p>',
  },
  why: {
    en: 'Hyperlexic readers excel at recognising words from partial letter cues (Cobrinik, 1982). The game turns that into phrase-level reading, then explains each idiom or proverb explicitly, because figurative language is often read literally (Martelle & Namazi, 2022).',
    fr: 'Les lecteurs hyperlexiques reconnaissent très bien les mots à partir d’indices partiels (Cobrinik, 1982). Le jeu transforme cette force en lecture de phrases, puis explique chaque expression, car le langage figuré est souvent pris au pied de la lettre (Martelle et Namazi, 2022).',
  },
  start(api) {
    const W = [800, 350, 450, 700, 'BK', 600, 500, 300, 650, 'LT', 400, 550, 900, 300, 'BK', 500, 1000, 450, 350, 600];
    const WCOL = ['#ff4f7b', '#ffc545', '#37e2ff', '#9dff5b', '#111', '#9b7bff', '#ff8f3d', '#3dffc5', '#4d9bff', '#fff', '#ff4fd8', '#ffc545', '#37e2ff', '#9dff5b', '#111', '#ff8f3d', '#e8e8e8', '#9b7bff', '#4d9bff', '#ff4f7b'];
    const VOW = 'aeiou', CONS = 'bcdfghjklmnpqrstvwxyz';
    const lbl = v => v === 'BK' ? (api.fr ? 'FAILLITE' : 'BANKRUPT') : v === 'LT' ? (api.fr ? 'PERD SON TOUR' : 'LOSE A TURN') : String(v);
    let S;
    const menu = () => UI.menu(api, {
      options: [
        { icon: '🎡', name: { en: '3-round game vs bots', fr: 'Partie de 3 manches' }, desc: { en: 'You vs BYTE and ECHO', fr: 'Toi contre OCTET et ÉCHO' }, go: () => newGame(3) },
        { icon: '⚡', name: { en: 'Quick round', fr: 'Manche éclair' }, desc: { en: 'One puzzle', fr: 'Une seule énigme' }, go: () => newGame(1) },
        { icon: '🧘', name: { en: 'Solo practice', fr: 'Pratique solo' }, desc: { en: 'No bots, no pressure', fr: 'Sans robots, sans pression' }, go: () => newGame(3, true) },
      ],
    });
    const newGame = (rounds, solo) => {
      const pool = shuffle(PHRASES[api.lang]);
      S = { rounds, round: 0, pool, solo, players: [{ name: Store.s.name || (api.fr ? 'Toi' : 'You'), round: 0, total: 0 }] };
      if (!solo) S.players.push({ name: api.fr ? 'OCTET' : 'BYTE', round: 0, total: 0, bot: 0.55 }, { name: api.fr ? 'ÉCHO' : 'ECHO', round: 0, total: 0, bot: 0.45 });
      buildUI(); nextRound();
    };
    let boardEl, wheelCv, ctx, ctrl, msgEl, scoreEl, catEl, lettersEl, rot = 0, spinning = false;
    const buildUI = () => {
      const root = api.clear();
      catEl = h('div', { class: 'chip sel', style: { fontSize: '15px' } });
      boardEl = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', padding: '14px', borderRadius: '18px', background: 'linear-gradient(180deg,#0f3d2e,#0a2a20)', border: '3px solid #2fb36a', boxShadow: '0 0 30px rgba(47,179,106,.35)' } });
      wheelCv = h('canvas', { width: 380, height: 380, style: { width: '100%', maxWidth: '380px' } });
      ctx = wheelCv.getContext('2d');
      scoreEl = h('div', { class: 'row', style: { gap: '8px' } });
      msgEl = h('div', { class: 'fb info', style: { minHeight: '46px' } });
      lettersEl = h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '5px' } });
      ctrl = h('div', { class: 'row' });
      root.appendChild(h('div', { class: 'gwrap' },
        h('div', { class: 'row', style: { justifyContent: 'center', marginBottom: '10px' } }, catEl),
        boardEl,
        h('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(260px,380px) 1fr', gap: '18px', marginTop: '16px', alignItems: 'start' }, class: 'wheel-grid' },
          h('div', { style: { position: 'relative' } }, wheelCv),
          h('div', { class: 'col' }, scoreEl, msgEl, ctrl, lettersEl))));
      if (innerWidth < 760) root.querySelector('.wheel-grid').style.gridTemplateColumns = '1fr';
      drawWheel();
    };
    const drawWheel = () => {
      const c = ctx, R = 180, cx = 190, cy = 190, n = W.length, a = Math.PI * 2 / n;
      c.clearRect(0, 0, 380, 380);
      c.save(); c.translate(cx, cy);
      c.beginPath(); c.arc(0, 0, R + 6, 0, 7); c.fillStyle = '#ffc545'; c.fill();
      for (let i = 0; i < n; i++) {
        const s = rot + i * a;
        c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, R, s, s + a); c.closePath(); c.fillStyle = WCOL[i]; c.fill();
        c.strokeStyle = '#0b1020'; c.lineWidth = 2; c.stroke();
        c.save(); c.rotate(s + a / 2); c.textAlign = 'right'; c.textBaseline = 'middle';
        const dark = ['#111'].includes(WCOL[i]);
        c.fillStyle = dark ? '#fff' : '#111';
        const L2 = lbl(W[i]);
        c.font = `900 ${L2.length > 5 ? 11 : 17}px Segoe UI, Arial`;
        c.fillText(L2, R - 10, 0);
        c.restore();
        c.beginPath(); c.arc(Math.cos(s) * (R - 3), Math.sin(s) * (R - 3), 3, 0, 7); c.fillStyle = '#fff'; c.fill();
      }
      c.beginPath(); c.arc(0, 0, 26, 0, 7); c.fillStyle = '#0b1020'; c.fill(); c.lineWidth = 4; c.strokeStyle = '#ffc545'; c.stroke();
      c.fillStyle = '#ffc545'; c.font = '900 13px Segoe UI'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('LX', 0, 1);
      c.restore();
      c.beginPath(); c.moveTo(cx - 14, 2); c.lineTo(cx + 14, 2); c.lineTo(cx, 30); c.closePath(); c.fillStyle = '#fff'; c.fill(); c.strokeStyle = '#ff4f7b'; c.lineWidth = 3; c.stroke();
    };
    const wedgeAt = () => { const n = W.length, a = Math.PI * 2 / n; let ang = (-Math.PI / 2 - rot) % (Math.PI * 2); if (ang < 0) ang += Math.PI * 2; return Math.floor(ang / a) % n; };
    const spin = () => new Promise(res => {
      spinning = true; let v = 16 + Math.random() * 9, last = wedgeAt();
      api.sfx('whoosh');
      const stop = api.loop(dt => {
        rot += v * dt; v *= Math.pow(0.35, dt); v -= 0.6 * dt;
        const w = wedgeAt(); if (w !== last) { last = w; api.sfx('tick'); }
        drawWheel();
        if (v <= 0.15) { stop(); spinning = false; res(W[wedgeAt()]); }
      });
    });
    // ---------------- puzzle ----------------
    const letters = () => new Set(norm(S.puz.p).replace(/[^a-z]/g, '').split(''));
    const count = l => norm(S.puz.p).split('').filter(c => c === l).length;
    const remainingCons = () => [...letters()].filter(l => CONS.includes(l) && !S.guessed.has(l));
    const remainingVow = () => [...letters()].filter(l => VOW.includes(l) && !S.guessed.has(l));
    const revealedFrac = () => { const all = norm(S.puz.p).replace(/[^a-z]/g, ''); return all.split('').filter(c => S.guessed.has(c)).length / all.length; };
    const renderBoard = (flash) => {
      boardEl.innerHTML = '';
      const words = S.puz.p.split(' '); const lines = []; let line = '';
      for (const w of words) { if ((line + ' ' + w).trim().length > 14) { lines.push(line.trim()); line = w; } else line += ' ' + w; }
      lines.push(line.trim());
      for (const ln of lines) {
        const r = h('div', { style: { display: 'flex', gap: '4px' } });
        for (const ch of ln) {
          const n = norm(ch);
          if (ch === ' ') { r.appendChild(h('div', { style: { width: Math.max(10, Math.min(22, Math.floor((Math.min(innerWidth, 1100) - 70) / 24))) + 'px' } })); continue; }
          const isL = /[a-z]/.test(n), shown = !isL || S.guessed.has(n) || S.solvedShow;
          const tw = Math.max(18, Math.min(38, Math.floor((Math.min(innerWidth, 1100) - 70) / 14) - 4));
          const tile = h('div', { style: { width: tw + 'px', height: Math.round(tw * 1.26) + 'px', borderRadius: '6px', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: Math.round(tw * 0.68) + 'px', color: '#0b1020', background: shown ? '#fff' : 'linear-gradient(180deg,#f4f4f4,#cfd8d3)', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.15)', transition: 'background .3s' } }, shown ? ch : '');
          if (!shown) tile.style.background = '#e8f1ec';
          if (flash && n === flash) { tile.style.background = '#37e2ff'; tile.classList.add('bounce'); }
          r.appendChild(tile);
        }
        boardEl.appendChild(r);
      }
      catEl.textContent = '🏷️ ' + S.puz.c;
    };
    const renderScores = () => {
      scoreEl.innerHTML = '';
      S.players.forEach((p, i) => scoreEl.appendChild(h('div', { class: 'stat grow', style: { padding: '8px 12px', outline: i === S.turn ? '2px solid var(--amber)' : 'none', background: i === S.turn ? 'rgba(255,197,69,.12)' : '' } },
        h('div', { style: { fontWeight: 800 } }, (p.bot ? '🤖 ' : '🧑 ') + p.name), h('div', { class: 'mono', style: { fontSize: '20px', fontWeight: 900 } }, '$' + fmt(p.round)), h('div', { class: 'muted', style: { fontSize: '12px' } }, `${api.fr ? 'Banque' : 'Bank'} $${fmt(p.total)}`))));
      api.hud([[t('round'), `${S.round}/${S.rounds}`], ['$', fmt(S.players[0].total + S.players[0].round)]]);
    };
    const say = (m, cls = 'info') => { msgEl.className = 'fb ' + cls; msgEl.textContent = m; };
    const nextRound = () => {
      S.round++; S.puz = S.pool[(S.round - 1) % S.pool.length]; S.guessed = new Set(); S.solvedShow = false;
      S.players.forEach(p => p.round = 0); S.turn = (S.round - 1) % S.players.length;
      renderBoard(); renderScores(); turn();
    };
    const human = () => !S.players[S.turn].bot;
    const renderLetters = (mode) => {
      lettersEl.innerHTML = '';
      const set = mode === 'vowel' ? VOW : CONS;
      for (const l of (CONS + VOW)) {
        const b = h('button', { class: 'btn sm', style: { width: '38px', fontWeight: 900, opacity: S.guessed.has(l) ? .25 : 1 }, disabled: !mode || !set.includes(l) || S.guessed.has(l) || !human(), onclick: () => guess(l, mode === 'vowel') }, l.toUpperCase());
        lettersEl.appendChild(b);
      }
    };
    const renderCtrl = (phase) => {
      ctrl.innerHTML = '';
      if (!human() || phase === 'wait') return;
      const p = S.players[S.turn];
      if (phase === 'action') {
        ctrl.append(
          h('button', { class: 'btn hot lg', disabled: !remainingCons().length, onclick: humanSpin }, '🎡 ' + (api.fr ? 'Tourner' : 'Spin')),
          h('button', { class: 'btn lg', disabled: p.round < 250 || !remainingVow().length, onclick: () => { say(api.fr ? 'Choisis une voyelle (250 $).' : 'Pick a vowel ($250).'); renderLetters('vowel'); } }, '🅰️ ' + (api.fr ? 'Voyelle 250 $' : 'Vowel $250')),
          h('button', { class: 'btn primary lg', onclick: solvePrompt }, '💡 ' + (api.fr ? 'Résoudre' : 'Solve')));
      }
    };
    const turn = () => {
      renderScores();
      const p = S.players[S.turn];
      if (p.bot) { renderCtrl('wait'); renderLetters(null); say(`🤖 ${p.name} ${api.fr ? 'réfléchit…' : 'is thinking…'}`); api.after(900, botTurn); }
      else { say(api.fr ? 'À toi ! Tourne, achète une voyelle ou résous.' : 'Your turn! Spin, buy a vowel, or solve.'); renderCtrl('action'); renderLetters(null); }
    };
    const pass = () => { S.turn = (S.turn + 1) % S.players.length; api.after(700, turn); };
    const applyWedge = v => {
      const p = S.players[S.turn];
      if (v === 'BK') { p.round = 0; api.sfx('lose'); say(`💥 ${lbl('BK')} — ${p.name}`, 'bad'); renderScores(); pass(); return false; }
      if (v === 'LT') { api.sfx('bad'); say(`⏭️ ${lbl('LT')} — ${p.name}`, 'bad'); pass(); return false; }
      S.wedge = v; return true;
    };
    const humanSpin = async () => {
      if (spinning) return; renderCtrl('wait');
      const v = await spin();
      if (applyWedge(v)) { say(`${api.fr ? 'Tu es tombé sur' : 'You landed on'} $${v}. ${api.fr ? 'Choisis une consonne.' : 'Pick a consonant.'}`); renderLetters('cons'); }
    };
    const guess = (l, vowel) => {
      const p = S.players[S.turn];
      if (S.guessed.has(l)) return;
      if (vowel) p.round -= 250;
      S.guessed.add(l); renderLetters(null);
      const n = count(l);
      renderBoard(l);
      if (n) {
        if (!vowel) p.round += S.wedge * n;
        api.sfx(n > 1 ? 'great' : 'good');
        say(`${n} × ${l.toUpperCase()}${vowel ? '' : ` = $${fmt(S.wedge * n)}`}!`, 'good');
        renderScores();
        if (revealedFrac() >= 1) { api.after(500, () => winRound(S.turn)); return; }
        if (p.bot) api.after(1000, botTurn); else renderCtrl('action');
      } else {
        api.sfx('bad'); say(`${api.fr ? 'Aucun' : 'No'} ${l.toUpperCase()}.`, 'bad'); renderScores(); pass();
      }
    };
    const solvePrompt = () => {
      renderCtrl('wait');
      const inp = h('input', { class: 'field', style: { flex: 1, fontSize: '18px', textTransform: 'uppercase' }, placeholder: api.fr ? 'Écris toute la phrase…' : 'Type the whole phrase…' });
      const go = () => {
        const ok = norm(inp.value).replace(/[^a-z]/g, '') === norm(S.puz.p).replace(/[^a-z]/g, '');
        if (ok) winRound(S.turn); else { api.sfx('bad'); say(api.fr ? 'Ce n’est pas ça !' : 'That’s not it!', 'bad'); pass(); }
      };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
      ctrl.append(inp, h('button', { class: 'btn primary', onclick: go }, t('submit')), h('button', { class: 'btn', onclick: () => renderCtrl('action') }, '✕'));
      setTimeout(() => inp.focus(), 30);
    };
    const botTurn = async () => {
      if (S.over) return;
      const p = S.players[S.turn];
      const frac = revealedFrac();
      if ((frac > 0.55 && Math.random() < frac * 0.8) || (!remainingCons().length && !remainingVow().length)) {
        say(`🤖 ${p.name}: “${api.fr ? 'Je veux résoudre' : 'I’d like to solve'}!”`); api.after(900, () => winRound(S.turn)); return;
      }
      if (p.round >= 250 && remainingVow().length && (Math.random() < 0.35 || !remainingCons().length)) {
        const order = 'eaiou'.split('').filter(v => !S.guessed.has(v));
        const l = Math.random() < p.bot ? (order.find(v => remainingVow().includes(v)) || order[0]) : order[0];
        say(`🤖 ${p.name} ${api.fr ? 'achète' : 'buys'} ${l.toUpperCase()}`); api.after(700, () => guess(l, true)); return;
      }
      if (!remainingCons().length) { say(`🤖 ${p.name}: ${api.fr ? 'je résous !' : 'solving!'}`); api.after(900, () => winRound(S.turn)); return; }
      const v = await spin();
      if (!applyWedge(v)) return;
      const freq = (api.fr ? 'srtnlcdmpvqfbghjxyzkw' : 'tnsrhldcmfpgwybvkxjqz').split('').filter(c => !S.guessed.has(c));
      const inP = freq.filter(c => remainingCons().includes(c));
      const l = (inP.length && Math.random() < p.bot) ? inP[0] : freq[Math.floor(Math.random() * Math.min(4, freq.length))];
      say(`🤖 ${p.name}: $${v} — “${l.toUpperCase()}”`); api.after(800, () => guess(l, false));
    };
    const winRound = i => {
      const p = S.players[i]; S.solvedShow = true; renderBoard();
      p.round = Math.max(p.round, 1000); p.total += p.round;
      renderScores(); renderCtrl('wait'); renderLetters(null);
      const youWon = !p.bot;
      api.sfx(youWon ? 'win' : 'lose'); if (youWon) { api.confetti(120); api.xp(15, boardEl); }
      msgEl.className = 'fb ' + (youWon ? 'good' : 'info');
      msgEl.innerHTML = '';
      msgEl.append(h('div', null, `${youWon ? '🏆' : '🤖'} ${p.name} ${api.fr ? 'remporte la manche' : 'wins the round'} (+$${fmt(p.round)})`));
      if (S.puz.m) msgEl.append(h('div', { style: { marginTop: '6px', fontWeight: 500 } }, h('b', null, '📖 ' + t('meaningOf') + ' : '), S.puz.m));
      ctrl.append(h('button', { class: 'btn primary lg', onclick: () => { if (S.round >= S.rounds) endGame(); else nextRound(); } }, S.round >= S.rounds ? '🏁 ' + t('done') : '→ ' + t('next')));
    };
    const endGame = () => {
      S.over = true;
      const me = S.players[0], best = Math.max(...S.players.map(p => p.total)), won = me.total >= best;
      const stars = S.solo ? UI.starsFor(me.total / (S.rounds * 3000)) : won ? 3 : me.total > 0 ? 1 : 0;
      api.finish({ score: me.total, stars, xp: 10 + (won ? 20 : 5), title: won ? t('victory') : (api.fr ? 'Belle partie !' : 'Good game!'), lines: S.players.map(p => `${p.bot ? '🤖' : '🧑'} ${p.name}: $${fmt(p.total)}`), again: () => newGame(S.rounds, S.solo), menu });
    };
    api.key(e => {
      if (!S || !human() || spinning || S.over) return;
      const k = norm(e.key);
      if (/^[a-z]$/.test(k)) { const btn = [...lettersEl.children].find(b => b.textContent.toLowerCase() === k && !b.disabled); if (btn) btn.click(); }
      if (e.key === ' ' && ctrl.querySelector('.btn.hot:not(:disabled)')) { e.preventDefault(); humanSpin(); }
    });
    menu();
  },
});
