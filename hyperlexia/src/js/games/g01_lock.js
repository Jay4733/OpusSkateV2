'use strict';
registerGame({
  id: 'lock', n: 1, cat: 'words', colors: ['#37e2ff', '#2754ff'],
  glyph: `<path d="M33 44v-9a17 17 0 0 1 34 0v9" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
    <rect x="22" y="43" width="56" height="42" rx="9"/>
    <g fill="#2754ff" font-size="15"><text x="30" y="70">L</text><text x="45" y="70">E</text><text x="60" y="70">X</text></g>`,
  name: { en: 'Lexicon Lock', fr: 'Cadenas lexical' },
  tag: { en: 'Crack the hidden word in six tries — then learn what it means.', fr: 'Perce le mot caché en six essais — puis découvre son sens.' },
  how: {
    en: '<p>Type a real word and press Enter. Tiles turn <b style="color:#2fb36a">green</b> (right letter, right spot), <b style="color:#d6a520">gold</b> (in the word, wrong spot) or grey (not in the word). Solve it in 6 tries. <b>Hard mode</b>: every hint you discover must be reused. Choose 4–7 letters in Endless mode.</p>',
    fr: '<p>Tape un vrai mot et appuie sur Entrée. Les tuiles deviennent <b style="color:#2fb36a">vertes</b> (bonne lettre, bonne place), <b style="color:#d6a520">dorées</b> (lettre présente, mauvaise place) ou grises (absente). Six essais. <b>Mode difficile</b> : chaque indice découvert doit être réutilisé. Les accents ne comptent pas.</p>',
  },
  why: {
    en: 'Uses the orthographic strength of hyperlexic readers (pattern deduction on letters), then always closes with a meaning card — because semantic knowledge, not decoding, drives comprehension (Brown et al., 2013).',
    fr: 'Mise sur la force orthographique des lecteurs hyperlexiques (déduction sur les lettres), puis se termine toujours par une carte de sens — car c’est la connaissance sémantique, pas le décodage, qui soutient la compréhension (Brown et al., 2013).',
  },
  start(api) {
    const D = api.data; D.stats = D.stats || {}; D.daily = D.daily || {};
    const st = () => (D.stats[api.lang] = D.stats[api.lang] || { played: 0, wins: 0, streak: 0, max: 0, dist: [0, 0, 0, 0, 0, 0] });
    let hard = !!D.hard;
    const answerPool = len => {
      const lx = Lex.get(api.lang);
      const gl = lx.gloss.map(g => norm(g.w)).filter(w => w.length === len && /^[a-z]+$/.test(w));
      const bad = api.lang === 'en' ? w => /[^s]s$/.test(w) || /(ed|ing)$/.test(w) : w => /[sxz]$/.test(w) || /(ent|ait|ais|ions|iez|era|ira|rai)$/.test(w);
      const common = (lx.byLen[len] || []).slice(0, len <= 4 ? 900 : 1800).filter(w => !bad(w));
      return { gl, common };
    };
    const pickAnswer = (len, r) => { const { gl, common } = answerPool(len); return (gl.length && r() < 0.55) ? pick(gl, r) : pick(common, r); };

    const menu = () => {
      const dk = `${todayKey()}_${api.lang}`;
      const s = st();
      UI.menu(api, {
        options: [
          { icon: '📅', name: { en: 'Daily lock', fr: 'Cadenas du jour' }, desc: D.daily[dk] ? { en: `Done today: ${D.daily[dk]}`, fr: `Fait aujourd’hui : ${D.daily[dk]}` } : { en: 'Same word for everyone today · 5 letters', fr: 'Le même mot pour tous aujourd’hui · 5 lettres' }, go: () => play(5, true) },
          { icon: '♾️', name: { en: 'Endless · 5 letters', fr: 'Sans fin · 5 lettres' }, desc: { en: `Streak ${s.streak} · best ${s.max}`, fr: `Série ${s.streak} · record ${s.max}` }, go: () => play(5) },
          { icon: '4️⃣', name: { en: 'Endless · 4 letters', fr: 'Sans fin · 4 lettres' }, desc: { en: 'Quick and punchy', fr: 'Rapide et nerveux' }, go: () => play(4) },
          { icon: '6️⃣', name: { en: 'Endless · 6 letters', fr: 'Sans fin · 6 lettres' }, desc: { en: 'Tougher search space', fr: 'Plus de possibilités' }, go: () => play(6) },
          { icon: '7️⃣', name: { en: 'Endless · 7 letters', fr: 'Sans fin · 7 lettres' }, desc: { en: 'Expert territory', fr: 'Territoire d’expert' }, go: () => play(7) },
          { icon: hard ? '🔒' : '🔓', name: { en: `Hard mode: ${hard ? 'ON' : 'OFF'}`, fr: `Mode difficile : ${hard ? 'OUI' : 'NON'}` }, desc: { en: 'Revealed hints must be reused (+50% score)', fr: 'Les indices doivent être réutilisés (+50 %)' }, go: () => { hard = !hard; D.hard = hard; api.save(); menu(); } },
        ],
        extra: statsBox(),
      });
    };
    const statsBox = () => {
      const s = st(), max = Math.max(1, ...s.dist);
      return h('div', { class: 'panel' },
        h('div', { class: 'row' }, ...[[s.played, t('gamesPlayed')], [s.played ? Math.round(100 * s.wins / s.played) + '%' : '—', api.fr ? 'Victoires' : 'Win rate'], [s.streak, t('streak')], [s.max, t('best')]].map(([v, l]) => h('div', { class: 'stat grow' }, h('div', { class: 'v' }, v), h('div', { class: 'l' }, l)))),
        h('div', { style: { marginTop: '10px' } }, s.dist.map((n, i) => h('div', { class: 'row', style: { gap: '6px', margin: '3px 0' } }, h('span', { class: 'mono', style: { width: '14px' } }, i + 1),
          h('div', { style: { height: '18px', width: `${8 + 88 * n / max}%`, background: 'linear-gradient(90deg,#2fb36a,#37e2ff)', borderRadius: '5px', fontSize: '12px', fontWeight: 800, color: '#04220f', padding: '0 6px', textAlign: 'right' } }, n)))));
    };

    const play = (len, daily = false) => {
      const r = daily ? rngFor(`lock-${todayKey()}-${api.lang}`) : Math.random;
      const answer = pickAnswer(len, r);
      const rows = 6;
      let row = 0, cur = '', over = false, hintUsed = false;
      const known = { green: {}, present: new Set() };
      const keyState = {};
      const root = api.clear();
      const wrap = h('div', { class: 'gwrap', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' } });
      const board = h('div', { style: { display: 'grid', gap: '6px' } });
      const tiles = [];
      for (let i = 0; i < rows; i++) {
        const rEl = h('div', { style: { display: 'grid', gridTemplateColumns: `repeat(${len},auto)`, gap: '6px' } });
        tiles.push([]);
        for (let j = 0; j < len; j++) { const tEl = h('div', { class: 'tile', style: { transition: 'transform .3s, background .2s' } }); tiles[i].push(tEl); rEl.appendChild(tEl); }
        board.appendChild(rEl);
      }
      const msg = h('div', { style: { minHeight: '26px', fontWeight: 700 } });
      const info = h('div', { style: { maxWidth: '640px', width: '100%' } });
      const kb = UI.keyboard(k => onKey(k));
      const hintBtn = h('button', { class: 'btn sm', onclick: () => hint() }, '💡 ' + t('hint'));
      wrap.append(h('div', { class: 'row' }, h('span', { class: 'chip' }, daily ? '📅 ' + t('daily') : '♾️ ' + t('endless')), h('span', { class: 'chip' }, `${len} ${api.fr ? 'lettres' : 'letters'}`), hard ? h('span', { class: 'chip sel' }, '🔒 ' + t('hard')) : null, hintBtn), board, msg, kb, info);
      root.appendChild(wrap);
      api.hud([[t('streak'), st().streak], [t('best'), st().max]]);

      const paint = () => { for (let j = 0; j < len; j++) { const tEl = tiles[row][j]; tEl.textContent = cur[j] || ''; tEl.style.borderColor = cur[j] ? 'rgba(255,255,255,.45)' : ''; } };
      const say = (m, bad) => { msg.textContent = m; msg.style.color = bad ? 'var(--bad)' : 'var(--ink)'; if (bad) { board.children[row].classList.remove('shake'); void board.offsetWidth; board.children[row].classList.add('shake'); } };
      const onKey = k => {
        if (over) return;
        if (k === 'Enter') return submit();
        if (k === 'Backspace') { cur = cur.slice(0, -1); paint(); return; }
        const c = norm(k);
        if (/^[a-z]$/.test(c) && cur.length < len) { cur += c; api.sfx('type'); paint(); }
      };
      api.key(e => { if (e.ctrlKey || e.metaKey || e.altKey) return; if (e.key === 'Enter' || e.key === 'Backspace') { e.preventDefault(); onKey(e.key); } else if (e.key.length === 1) onKey(e.key); });

      const score = guess => {
        const res = Array(len).fill('x'), cnt = {};
        for (let i = 0; i < len; i++) if (guess[i] === answer[i]) res[i] = 'g'; else cnt[answer[i]] = (cnt[answer[i]] || 0) + 1;
        for (let i = 0; i < len; i++) if (res[i] !== 'g' && cnt[guess[i]]) { res[i] = 'y'; cnt[guess[i]]--; }
        return res;
      };
      const submit = () => {
        if (cur.length < len) return say(t('tooShort'), true);
        if (!Lex.valid(cur, api.lang) && cur !== answer) { api.sfx('bad'); return say(t('notWord'), true); }
        if (hard) {
          for (const i in known.green) if (cur[i] !== known.green[i]) { api.sfx('bad'); return say(api.fr ? `La lettre ${up(known.green[i])} doit être en position ${+i + 1}` : `Letter ${up(known.green[i])} must be in position ${+i + 1}`, true); }
          for (const c of known.present) if (!cur.includes(c)) { api.sfx('bad'); return say(api.fr ? `Le mot doit contenir ${up(c)}` : `Guess must contain ${up(c)}`, true); }
        }
        const res = score(cur), guess = cur, rIdx = row;
        res.forEach((s, i) => {
          const tEl = tiles[rIdx][i];
          api.after(i * 260, () => {
            tEl.style.transform = 'rotateX(90deg)'; api.sfx('flip');
            api.after(150, () => {
              tEl.style.transform = ''; tEl.style.borderColor = 'transparent';
              tEl.style.background = s === 'g' ? '#2fb36a' : s === 'y' ? '#d6a520' : 'rgba(255,255,255,.08)';
              const rank = { x: 0, y: 1, g: 2 }, c = guess[i];
              if (!keyState[c] || rank[s] > rank[keyState[c]]) keyState[c] = s;
              const kbtn = kb.querySelector(`[data-k="${c}"]`); if (kbtn) kbtn.className = keyState[c];
            });
          });
          if (s === 'g') known.green[i] = guess[i]; if (s === 'y') known.present.add(guess[i]);
        });
        const won = guess === answer;
        row++; cur = '';
        api.after(len * 260 + 250, () => {
          if (won) finish(true, rIdx + 1);
          else if (row >= rows) finish(false, rows);
          else say('');
        });
        if (won || row >= rows) over = true;
      };
      const hint = () => {
        if (over || hintUsed) return;
        const idx = [...Array(len).keys()].filter(i => !(i in known.green));
        if (!idx.length) return;
        const i = pick(idx); hintUsed = true; known.green[i] = answer[i]; hintBtn.disabled = true;
        say((api.fr ? 'Indice : position ' : 'Hint: position ') + (i + 1) + ' = ' + up(answer[i]));
        api.sfx('pop');
      };
      const finish = (won, n) => {
        const s = st(); s.played++;
        const word = Lex.display(answer, api.lang);
        if (won) {
          s.wins++; s.streak++; s.max = Math.max(s.max, s.streak); s.dist[n - 1]++;
          if (n <= 3) api.badge('wordsmith');
          board.children[n - 1].classList.add('bounce');
        } else s.streak = 0;
        if (daily) D.daily[`${todayKey()}_${api.lang}`] = won ? `${n}/6` : 'X/6';
        api.save();
        const pts = won ? Math.round((7 - n) * 100 * (len / 5) * (hard ? 1.5 : 1) * (hintUsed ? 0.6 : 1) + s.streak * 10) : 0;
        const def = Lex.define(answer, api.lang);
        info.innerHTML = '';
        info.append(h('div', { class: 'fb ' + (won ? 'good' : 'bad') }, won ? `🔓 ${up(word)} — ${n}/6` : `🔒 ${api.fr ? 'Le mot était' : 'The word was'} ${up(word)}`),
          def ? UI.definition(def) : h('div', { class: 'fb info' }, api.fr ? `📖 Défi : écris une phrase avec « ${word} » dans ta tête, ou cherche-le dans le dictionnaire.` : `📖 Challenge: use “${word}” in a sentence in your head, or look it up.`),
          h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '10px' } },
            !daily ? h('button', { class: 'btn primary', onclick: () => play(len) }, '↻ ' + t('next')) : null,
            h('button', { class: 'btn', onclick: menu }, t('menu'))));
        api.xp(won ? 10 + (7 - n) * 5 : 3, board);
        if (won) { api.sfx('win'); api.confetti(90); api.record(pts); api.stars(n <= 2 ? 3 : n <= 4 ? 2 : 1); } else api.sfx('lose');
        api.hud([[t('streak'), s.streak], [t('best'), s.max]]);
      };
    };
    menu();
  },
});
