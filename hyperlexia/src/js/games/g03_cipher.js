'use strict';
registerGame({
  id: 'cipher', n: 3, cat: 'numbers', colors: ['#3dffc5', '#1e6bff'],
  glyph: `<circle cx="50" cy="50" r="33" fill="none" stroke="#fff" stroke-width="5"/><circle cx="50" cy="50" r="20" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 3"/>
    <g font-size="11" text-anchor="middle"><text x="50" y="25">A</text><text x="75" y="54">D</text><text x="50" y="82">G</text><text x="25" y="54">J</text></g>
    <text x="50" y="57" font-size="18" text-anchor="middle">?</text>`,
  name: { en: 'Cipher Station', fr: 'Station Chiffre' },
  tag: { en: 'Crack Caesar, Atbash, rail-fence, pigpen, substitution and Vigenère codes.', fr: 'Casse les codes César, Atbash, grille, francs-maçons, substitution et Vigenère.' },
  how: {
    en: '<p>Each mission hides a true fact. <b>Shift ciphers</b>: drag the slider until the preview makes sense, then lock it in. <b>Cryptograms</b>: type your guess under a symbol — it fills every matching symbol. Use the <b>frequency chart</b>: the most common letters in English are E, T, A, O. <b>Vigenère</b>: solve the riddle to find the key word.</p>',
    fr: '<p>Chaque mission cache un fait vrai. <b>Décalages</b> : glisse le curseur jusqu’à ce que l’aperçu ait du sens. <b>Cryptogrammes</b> : tape ta lettre sous un symbole — toutes les cases identiques se remplissent. Utilise le <b>graphique de fréquences</b> : en français, les lettres les plus fréquentes sont E, A, S, I, N. <b>Vigenère</b> : résous la devinette pour trouver la clé.</p>',
  },
  why: {
    en: 'Codes are orthographic systems — exactly the kind of structure that veridical mapping makes easy for hyperlexic minds (Mottron et al., 2013). Every decoded message is a fact to understand, and the Vigenère riddles require inference to find the key.',
    fr: 'Les codes sont des systèmes orthographiques — le genre de structure que la « correspondance véridique » rend facile pour les esprits hyperlexiques (Mottron et al., 2013). Chaque message décodé est un fait à comprendre, et les devinettes de Vigenère exigent de l’inférence.',
  },
  start(api) {
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const clean = s => norm(s.replace(/[’]/g, "'")).toUpperCase();
    const shiftCh = (c, k) => A.includes(c) ? A[(A.indexOf(c) + k + 26) % 26] : c;
    const caesar = (p, k) => p.split('').map(c => shiftCh(c, k)).join('');
    const atbash = p => p.split('').map(c => A.includes(c) ? A[25 - A.indexOf(c)] : c).join('');
    const vig = (p, key, dir = 1) => { let j = 0; return p.split('').map(c => { if (!A.includes(c)) return c; const k = A.indexOf(key[j++ % key.length]); return shiftCh(c, dir * k); }).join(''); };
    const railEnc = (s, n) => { const rails = Array.from({ length: n }, () => []); let r = 0, d = 1; for (const c of s) { rails[r].push(c); if (n > 1) { if (r === 0) d = 1; else if (r === n - 1) d = -1; r += d; } } return rails.flat().join(''); };
    const railDec = (s, n) => { const len = s.length, pat = []; let r = 0, d = 1; for (let i = 0; i < len; i++) { pat.push(r); if (n > 1) { if (r === 0) d = 1; else if (r === n - 1) d = -1; r += d; } } const counts = Array(n).fill(0); pat.forEach(x => counts[x]++); const rails = []; let pos = 0; for (let i = 0; i < n; i++) { rails.push(s.slice(pos, pos + counts[i]).split('')); pos += counts[i]; } return pat.map(x => rails[x].shift()).join(''); };
    const MISSIONS = [
      { type: 'caesar', max: 30 }, { type: 'caesar', max: 45 }, { type: 'atbash', max: 40 }, { type: 'rail', max: 40 },
      { type: 'subst', max: 34 }, { type: 'pigpen', max: 34 }, { type: 'vig', max: 40 }, { type: 'subst', max: 50 },
      { type: 'rail', max: 60 }, { type: 'pigpen', max: 50 }, { type: 'vig', max: 60 }, { type: 'subst', max: 70 },
    ];
    const TYPES = {
      caesar: { en: 'Caesar shift', fr: 'Décalage de César' }, atbash: { en: 'Atbash mirror', fr: 'Miroir Atbash' }, rail: { en: 'Rail fence', fr: 'Grille en zigzag' },
      subst: { en: 'Substitution', fr: 'Substitution' }, pigpen: { en: 'Pigpen symbols', fr: 'Chiffre des francs-maçons' }, vig: { en: 'Vigenère', fr: 'Vigenère' },
    };
    const D = api.data; D.solved = D.solved || 0; D.mission = D.mission || {};
    const menu = () => {
      const m = D.mission[api.lang] || 0;
      UI.menu(api, {
        options: [
          { icon: '🎯', name: { en: `Campaign · mission ${Math.min(m + 1, 12)}/12`, fr: `Campagne · mission ${Math.min(m + 1, 12)}/12` }, desc: { en: 'Progressive difficulty', fr: 'Difficulté progressive' }, go: () => mission(Math.min(m, 11), true) },
          ...Object.keys(TYPES).map(k => ({ icon: { caesar: '🔁', atbash: '🪞', rail: '〰️', subst: '🔤', pigpen: '#️⃣', vig: '🗝️' }[k], name: TYPES[k], desc: { en: 'Free play', fr: 'Jeu libre' }, go: () => play({ type: k, max: 55 }, false) })),
        ],
      });
    };
    const mission = (i, camp) => play(MISSIONS[i], camp, i);
    let hints = 0, t0 = 0;
    const play = (spec, camp, idx) => {
      const facts = FACTS[api.lang].filter(f => f.length <= spec.max);
      const fact = pick(facts.length ? facts : FACTS[api.lang]);
      const P = clean(fact);
      hints = 0; t0 = Date.now();
      const root = api.clear();
      const wrap = h('div', { class: 'gwrap' });
      root.appendChild(wrap);
      wrap.appendChild(h('div', { class: 'row' }, h('span', { class: 'chip sel' }, '🔐 ' + L(TYPES[spec.type])), camp ? h('span', { class: 'chip' }, `Mission ${idx + 1}/12`) : null, h('span', { class: 'spacer' }),
        h('button', { class: 'btn sm', onclick: () => hint() }, '💡 ' + t('hint')), h('button', { class: 'btn sm', onclick: menu }, t('menu'))));
      api.hud([[api.fr ? 'Résolus' : 'Solved', D.solved]]);
      let hint = () => { };
      const solved = () => {
        D.solved++; if (camp) D.mission[api.lang] = Math.max(D.mission[api.lang] || 0, Math.min(idx + 1, 12)); api.save();
        if (D.solved >= 5) api.badge('codebreaker');
        const secs = (Date.now() - t0) / 1000;
        const base = { caesar: 100, atbash: 120, rail: 150, subst: 250, pigpen: 220, vig: 260 }[spec.type];
        const score = Math.round(base * (P.length / 30) * Math.max(0.4, 1 - hints * 0.2) + (api.relaxed ? 0 : Math.max(0, 120 - secs)));
        const stars = hints === 0 ? 3 : hints <= 2 ? 2 : 1;
        api.stars(stars); api.record(score);
        api.xp(15 + stars * 5);
        api.sfx('win'); api.confetti(120);
        wrap.appendChild(h('div', { class: 'fb good fadein', style: { marginTop: '14px', fontSize: '18px' } }, '🔓 ', fact));
        wrap.appendChild(h('div', { class: 'row', style: { marginTop: '10px' } },
          camp && idx < 11 ? h('button', { class: 'btn primary', onclick: () => mission(idx + 1, true) }, `→ Mission ${idx + 2}`) : h('button', { class: 'btn primary', onclick: () => play(spec, camp, idx) }, '↻ ' + t('next')),
          h('button', { class: 'btn', onclick: menu }, t('menu')), h('span', { class: 'chip' }, `${t('score')} ${score}`), h('span', { class: 'stars', html: '★'.repeat(stars) })));
      };
      if (spec.type === 'caesar' || spec.type === 'rail') hint = sliderMode(wrap, spec, P, solved);
      else if (spec.type === 'vig') hint = vigMode(wrap, P, solved);
      else hint = cryptoMode(wrap, spec, P, solved);
    };
    // ---------- frequency chart ----------
    const freqChart = (C) => {
      const cnt = {}; for (const c of C) if (A.includes(c)) cnt[c] = (cnt[c] || 0) + 1;
      const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
      const max = top.length ? top[0][1] : 1;
      const lang = Object.entries(Lex.freqTable(api.lang)).sort((a, b) => b[1] - a[1]).map(x => x[0].toUpperCase());
      return h('div', { class: 'panel', style: { marginTop: '12px' } },
        h('div', { class: 'muted', style: { fontSize: '13px', marginBottom: '6px' } }, api.fr ? '📊 Fréquence des symboles du message (à gauche = plus fréquent)' : '📊 Symbol frequency in the message (left = most common)'),
        h('div', { style: { display: 'flex', gap: '3px', alignItems: 'flex-end', height: '70px' } }, top.map(([c, n]) => h('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' } },
          h('div', { style: { width: '100%', height: `${8 + 50 * n / max}px`, background: 'linear-gradient(180deg,#3dffc5,#1e6bff)', borderRadius: '4px 4px 0 0' } }), h('div', { class: 'mono', style: { fontSize: '12px' } }, c)))),
        h('div', { class: 'mono', style: { fontSize: '12px', marginTop: '6px', color: 'var(--ink2)' } }, (api.fr ? 'Français, du plus au moins fréquent : ' : 'English, most to least common: ') + lang.slice(0, 12).join(' ')));
    };
    // ---------- slider (caesar / rail) ----------
    const sliderMode = (wrap, spec, P, solved) => {
      const isRail = spec.type === 'rail';
      const key = isRail ? 2 + rand(3) : 1 + rand(25);
      const noSp = P.replace(/[^A-Z]/g, '');
      const C = isRail ? railEnc(noSp, key) : caesar(P, key);
      const shown = isRail ? C.match(/.{1,5}/g).join(' ') : C;
      const prev = h('div', { class: 'mono', style: { fontSize: '22px', letterSpacing: '2px', padding: '14px', borderRadius: '14px', background: 'rgba(55,226,255,.08)', border: '1px dashed rgba(55,226,255,.4)', minHeight: '60px', wordBreak: 'break-word' } });
      const val = h('b', { class: 'mono', style: { fontSize: '26px', color: 'var(--cyan)' } });
      const sl = h('input', { type: 'range', min: isRail ? 2 : 0, max: isRail ? 6 : 25, value: isRail ? 2 : 0, style: { width: '100%' } });
      const wheel = h('div', { class: 'mono', style: { display: 'grid', gridTemplateColumns: 'repeat(26,1fr)', gap: '1px', fontSize: '12px', textAlign: 'center', marginTop: '6px' } });
      const upd = () => {
        const k = +sl.value; val.textContent = isRail ? `${k} ${api.fr ? 'rails' : 'rails'}` : `−${k}`;
        prev.textContent = isRail ? railDec(C, k) : caesar(C, -k);
        if (!isRail) { wheel.innerHTML = ''; for (let i = 0; i < 26; i++) wheel.appendChild(h('div', { style: { background: 'rgba(255,255,255,.06)', borderRadius: '3px', padding: '2px 0' } }, h('div', { style: { color: 'var(--ink3)' } }, A[i]), h('div', { style: { color: 'var(--mint)', fontWeight: 800 } }, A[(i - k + 26) % 26]))); }
        api.sfx('tick');
      };
      sl.addEventListener('input', upd);
      const lock = h('button', { class: 'btn primary lg', onclick: () => {
        const ok = isRail ? railDec(C, +sl.value) === noSp : caesar(C, -sl.value) === P;
        if (ok) { lock.disabled = true; sl.disabled = true; solved(); } else { api.sfx('bad'); prev.classList.remove('shake'); void prev.offsetWidth; prev.classList.add('shake'); }
      } }, '🔒 ' + (api.fr ? 'Verrouiller' : 'Lock in'));
      wrap.append(
        h('div', { class: 'muted', style: { margin: '14px 0 6px' } }, api.fr ? 'Message intercepté :' : 'Intercepted message:'),
        h('div', { class: 'mono', style: { fontSize: '24px', letterSpacing: '3px', color: 'var(--amber)', wordBreak: 'break-word' } }, shown),
        h('div', { class: 'row', style: { margin: '14px 0 6px' } }, h('span', null, isRail ? (api.fr ? 'Nombre de rails : ' : 'Number of rails: ') : (api.fr ? 'Décalage : ' : 'Shift: ')), val),
        sl, isRail ? h('div', { class: 'muted', style: { fontSize: '13px' } }, api.fr ? 'Le texte a été écrit en zigzag sur plusieurs lignes, puis lu ligne par ligne (espaces retirés).' : 'The text was written in a zigzag across several rows, then read row by row (spaces removed).') : wheel,
        h('div', { class: 'muted', style: { margin: '12px 0 6px' } }, api.fr ? 'Aperçu décodé :' : 'Decoded preview:'), prev,
        h('div', { class: 'row', style: { marginTop: '10px' } }, lock),
        isRail ? null : freqChart(C));
      upd();
      return () => { hints++; if (isRail) { FX.toast(api.fr ? `Essaie ${key - 1} ou ${key}…` : `Try ${key - 1} or ${key}…`, '💡'); } else { const top = Object.entries([...C].reduce((o, c) => (A.includes(c) && (o[c] = (o[c] || 0) + 1), o), {})).sort((a, b) => b[1] - a[1])[0][0]; FX.toast(api.fr ? `Le symbole le plus fréquent, ${top}, est sûrement E.` : `The most common symbol, ${top}, is probably E.`, '💡'); } };
    };
    // ---------- vigenère ----------
    const vigMode = (wrap, P, solved) => {
      const [key, riddle] = pick(VIG_KEYS[api.lang]);
      const C = vig(P, key, 1);
      const prev = h('div', { class: 'mono', style: { fontSize: '20px', letterSpacing: '2px', padding: '12px', borderRadius: '12px', background: 'rgba(55,226,255,.08)', minHeight: '54px' } }, '…');
      const inp = h('input', { class: 'field mono', style: { fontSize: '22px', textTransform: 'uppercase', width: '220px', letterSpacing: '4px' }, maxlength: 10, placeholder: '?'.repeat(key.length) });
      inp.addEventListener('input', () => { const k = clean(inp.value).replace(/[^A-Z]/g, ''); prev.textContent = k ? vig(C, k, -1) : '…'; if (k === key) { inp.disabled = true; solved(); } });
      const table = h('div', { class: 'mono hidden', style: { fontSize: '11px', lineHeight: 1.15, overflowX: 'auto', marginTop: '8px' } }, A.split('').map((r, i) => h('div', { style: { whiteSpace: 'pre', color: i % 2 ? 'var(--ink2)' : 'var(--ink)' } }, caesar(A, i).split('').join(' '))));
      wrap.append(
        h('div', { class: 'muted', style: { margin: '14px 0 6px' } }, api.fr ? 'Message intercepté :' : 'Intercepted message:'),
        h('div', { class: 'mono', style: { fontSize: '22px', letterSpacing: '3px', color: 'var(--amber)', wordBreak: 'break-word' } }, C),
        h('div', { class: 'fb info', style: { margin: '14px 0' } }, `🧩 ${api.fr ? 'Devinette de la clé' : 'Key riddle'} (${key.length} ${api.fr ? 'lettres' : 'letters'}) : “${riddle}”`),
        h('div', { class: 'row' }, h('span', null, '🗝️ ' + (api.fr ? 'Clé : ' : 'Key: ')), inp, h('button', { class: 'btn sm', onclick: () => table.classList.toggle('hidden') }, api.fr ? 'Carré de Vigenère' : 'Vigenère square')),
        table,
        h('div', { class: 'muted', style: { margin: '12px 0 6px' } }, api.fr ? 'Aperçu (chaque lettre de la clé décale une lettre du message) :' : 'Preview (each key letter shifts one message letter):'), prev);
      setTimeout(() => inp.focus(), 50);
      let hi = 0;
      return () => { hints++; hi = Math.min(key.length, hi + 1); inp.placeholder = key.slice(0, hi) + '?'.repeat(key.length - hi); FX.toast((api.fr ? 'La clé commence par ' : 'The key starts with ') + key.slice(0, hi), '💡'); };
    };
    // ---------- cryptogram (atbash / subst / pigpen) ----------
    const pigSVG = (ch) => {
      const i = A.indexOf(ch); let body = '', dot = false;
      const L2 = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
      if (i < 18) {
        const j = i % 9; dot = i >= 9; const r = Math.floor(j / 3), c = j % 3;
        if (r > 0) body += L2(4, 4, 28, 4); if (r < 2) body += L2(4, 28, 28, 28); if (c > 0) body += L2(4, 4, 4, 28); if (c < 2) body += L2(28, 4, 28, 28);
      } else {
        const j = (i - 18) % 4; dot = i >= 22;
        body += [L2(4, 4, 16, 28) + L2(16, 28, 28, 4), L2(4, 4, 28, 16) + L2(28, 16, 4, 28), L2(28, 4, 4, 16) + L2(4, 16, 28, 28), L2(4, 28, 16, 4) + L2(16, 4, 28, 28)][j];
      }
      return `<svg viewBox="0 0 32 32" width="30" height="30"><g stroke="#ffc545" stroke-width="3" stroke-linecap="round">${body}</g>${dot ? '<circle cx="16" cy="16" r="3.2" fill="#ffc545"/>' : ''}</svg>`;
    };
    const cryptoMode = (wrap, spec, P, solved) => {
      let map = {};
      if (spec.type === 'atbash') A.split('').forEach((c, i) => map[c] = A[25 - i]);
      else if (spec.type === 'pigpen') A.split('').forEach(c => map[c] = c);
      else { let perm; do { perm = shuffle(A.split('')); } while (perm.some((c, i) => c === A[i])); A.split('').forEach((c, i) => map[c] = perm[i]); }
      const inv = {}; for (const k in map) inv[map[k]] = k;
      const C = P.split('').map(c => map[c] || c).join('');
      const guess = {};
      const cells = [];
      const board = h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '14px 18px', marginTop: '14px' } });
      C.split(' ').forEach(word => {
        const w = h('div', { style: { display: 'flex', gap: '3px' } });
        for (const sym of word) {
          if (!A.includes(sym)) { w.appendChild(h('div', { style: { alignSelf: 'flex-end', fontSize: '22px', fontWeight: 900 } }, sym)); continue; }
          const inp = h('input', { class: 'mono', maxlength: 1, dataset: { s: sym }, style: { width: '30px', height: '34px', textAlign: 'center', fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', background: 'rgba(0,0,0,.35)', border: '1px solid var(--line)', borderRadius: '6px', color: 'var(--ink)', padding: 0 } });
          const top = h('div', { style: { height: '32px', display: 'grid', placeItems: 'center', fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 800, color: 'var(--amber)' }, html: spec.type === 'pigpen' ? pigSVG(sym) : sym });
          w.appendChild(h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' } }, top, inp));
          cells.push(inp);
          inp.addEventListener('focus', () => { cells.forEach(c => c.style.boxShadow = c.dataset.s === sym ? '0 0 0 2px #37e2ff' : ''); inp.select(); });
          inp.addEventListener('keydown', e => {
            const i = cells.indexOf(inp);
            if (e.key === 'ArrowRight') { cells[Math.min(cells.length - 1, i + 1)].focus(); e.preventDefault(); }
            else if (e.key === 'ArrowLeft') { cells[Math.max(0, i - 1)].focus(); e.preventDefault(); }
            else if (e.key === 'Backspace') { delete guess[sym]; refresh(); e.preventDefault(); }
            else if (/^[a-zA-ZÀ-ÿ]$/.test(e.key)) {
              e.preventDefault(); const L3 = norm(e.key).toUpperCase(); guess[sym] = L3; api.sfx('type'); refresh();
              for (let k = 1; k <= cells.length; k++) { const nx = cells[(i + k) % cells.length]; if (!guess[nx.dataset.s]) { nx.focus(); break; } }
              check();
            }
          });
        }
        board.appendChild(w);
      });
      const refresh = () => {
        const used = {}; for (const s in guess) used[guess[s]] = (used[guess[s]] || 0) + 1;
        cells.forEach(c => { const g = guess[c.dataset.s] || ''; c.value = g; c.style.color = g && used[g] > 1 ? 'var(--bad)' : 'var(--ink)'; });
      };
      const check = () => { if (Object.keys(inv).every(s => !C.includes(s) || guess[s] === inv[s])) { cells.forEach(c => { c.disabled = true; c.style.background = 'rgba(61,220,132,.25)'; }); solved(); } };
      const extra = spec.type === 'atbash'
        ? h('div', { class: 'fb info', style: { marginTop: '12px' } }, api.fr ? '🪞 Atbash : l’alphabet est retourné comme dans un miroir — A↔Z, B↔Y, C↔X…' : '🪞 Atbash flips the alphabet like a mirror — A↔Z, B↔Y, C↔X…')
        : spec.type === 'pigpen'
          ? h('div', { class: 'panel', style: { marginTop: '12px' } }, h('div', { class: 'muted', style: { marginBottom: '6px' } }, api.fr ? 'Clé du chiffre (clique pour l’afficher)' : 'Cipher key (click to show)'),
            (() => { const k = h('div', { class: 'hidden', style: { display: 'grid', gridTemplateColumns: 'repeat(13,1fr)', gap: '4px' } }, A.split('').map(c => h('div', { style: { textAlign: 'center' } }, h('div', { html: pigSVG(c) }), h('div', { class: 'mono', style: { fontSize: '12px' } }, c)))); const b = h('button', { class: 'btn sm', onclick: () => { k.classList.toggle('hidden'); if (!k.classList.contains('hidden')) { k.style.display = 'grid'; hints++; } } }, api.fr ? 'Afficher la clé (compte comme indice)' : 'Show key (counts as a hint)'); return h('div', null, b, k); })())
          : null;
      wrap.append(h('div', { class: 'muted', style: { marginTop: '12px' } }, api.fr ? 'Tape une lettre sous chaque symbole. Les lettres en double apparaissent en rouge.' : 'Type a letter under each symbol. Duplicate letters turn red.'), board, extra, spec.type === 'subst' ? freqChart(C) : null);
      setTimeout(() => cells[0] && cells[0].focus(), 60);
      return () => {
        const un = Object.keys(inv).filter(s => C.includes(s) && guess[s] !== inv[s]);
        if (!un.length) return; hints++;
        const byF = un.sort((a, b) => C.split(a).length - C.split(b).length).reverse();
        const s = byF[0]; guess[s] = inv[s]; refresh(); check(); api.sfx('pop');
      };
    };
    menu();
  },
});
