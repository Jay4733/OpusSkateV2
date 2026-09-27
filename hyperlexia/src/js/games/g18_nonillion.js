'use strict';
registerGame({
  id: 'nonillion', n: 18, cat: 'numbers', colors: ['#ffc545', '#6b2bff'],
  glyph: `<text x="50" y="50" font-size="30" text-anchor="middle">10</text><text x="72" y="32" font-size="16" text-anchor="middle">30</text>
    <text x="50" y="78" font-size="13" text-anchor="middle" letter-spacing="1">NONILLION</text><circle cx="18" cy="20" r="3"/><circle cx="84" cy="84" r="2"/><circle cx="86" cy="14" r="2"/>`,
  name: { en: 'Nonillion Navigator', fr: 'Navigateur de nonillions' },
  tag: { en: 'Name colossal numbers, swap English ↔ French scales, weigh the universe.', fr: 'Nomme des nombres colossaux, passe de l’échelle française à l’anglaise, pèse l’univers.' },
  how: {
    en: '<p><b>Name it</b>: identify powers of ten by name. <b>Scale swap</b>: English uses the <i>short scale</i> (billion = 10⁹), French uses the <i>long scale</i> (milliard = 10⁹, billion = 10¹²) — convert between them! <b>Cosmic compare</b>: which real quantity is bigger? <b>Zero count</b>: type how many zeros. <b>Counting machine</b>: watch a counter race to a googol.</p>',
    fr: '<p><b>Nomme-le</b> : identifie les puissances de dix. <b>Échange d’échelles</b> : le français utilise l’<i>échelle longue</i> (milliard = 10⁹, billion = 10¹²), l’anglais l’<i>échelle courte</i> (billion = 10⁹) — convertis ! <b>Comparaison cosmique</b> : quelle quantité réelle est la plus grande ? <b>Compte les zéros</b>. <b>Machine à compter</b> : regarde un compteur filer jusqu’au gogol.</p>',
  },
  why: {
    en: 'Numbers travel with letters in hyperlexia: autistic children had 3.49× the odds of an intense interest in numbers (Ostrolenk et al., 2024), and 20% of one national autistic sample had a hypercalculia profile (Wei et al., 2015). Naming numbers in two languages turns that passion into precise vocabulary and bilingual reasoning.',
    fr: 'Les nombres accompagnent les lettres en hyperlexie : les enfants autistes avaient 3,49 fois plus de chances d’un intérêt intense pour les nombres (Ostrolenk et al., 2024), et 20 % d’un échantillon national avaient un profil d’hypercalculie (Wei et al., 2015). Nommer les nombres en deux langues transforme cette passion en vocabulaire précis.',
  },
  start(api) {
    const EN = ['', '', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quattuordecillion', 'quindecillion', 'sexdecillion', 'septendecillion', 'octodecillion', 'novemdecillion', 'vigintillion'];
    const enName = p => (p % 3 === 0 && p >= 6 && p <= 63) ? EN[p / 3] : null;
    const FRB = ['', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'décillion'];
    const frName = p => { if (p < 6 || p > 60 || p % 3) return null; const n = Math.floor(p / 6); if (p % 6 === 0) return FRB[n]; return n === 1 ? 'milliard' : FRB[n].replace(/illion$/, 'illiard'); };
    const nameP = (p, lang = api.lang) => lang === 'fr' ? frName(p) : enName(p);
    const sup = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹⁻'['0123456789-'.indexOf(c)]).join('');
    const pow = p => `10${sup(p)}`;
    const digits = p => { const s = '1' + '0'.repeat(p); const sep = api.fr ? ' ' : ','; return s.replace(/\B(?=(\d{3})+(?!\d))/g, sep); };
    const D = api.data; D.non = D.non || {};
    const menu = () => UI.menu(api, {
      options: [
        { icon: '🏷️', name: { en: 'Name it', fr: 'Nomme-le' }, desc: { en: '12 numbers, rising difficulty', fr: '12 nombres, de plus en plus grands' }, go: () => quiz('name') },
        { icon: '🔁', name: { en: 'Scale swap EN ↔ FR', fr: 'Échange d’échelles FR ↔ EN' }, desc: { en: 'Short vs long scale', fr: 'Échelle longue vs courte' }, go: () => quiz('swap') },
        { icon: '🌌', name: { en: 'Cosmic compare', fr: 'Comparaison cosmique' }, desc: { en: 'Higher or lower?', fr: 'Plus grand ou plus petit ?' }, go: () => cosmic() },
        { icon: '0️⃣', name: { en: 'Zero count', fr: 'Compte les zéros' }, desc: { en: 'Type the number of zeros', fr: 'Tape le nombre de zéros' }, go: () => quiz('zeros') },
        { icon: '🎰', name: { en: 'Counting machine', fr: 'Machine à compter' }, desc: { en: 'Race a counter to a googol', fr: 'Fais filer un compteur jusqu’au gogol' }, go: () => machine() },
      ],
      extra: scaleTable(),
    });
    function scaleTable() {
      const rows = []; for (let p = 6; p <= 60; p += 3) rows.push(h('tr', null, h('td', { class: 'mono' }, pow(p)), h('td', null, enName(p) || '—'), h('td', null, frName(p) || '—')));
      return h('details', { class: 'panel' }, h('summary', { style: { cursor: 'pointer', fontWeight: 800 } }, api.fr ? '📜 Table des échelles (anglais court / français long)' : '📜 Scale table (English short / French long)'),
        h('table', { class: 'simple', style: { marginTop: '8px' } }, h('tr', null, h('th', null, api.fr ? 'Puissance' : 'Power'), h('th', null, api.fr ? 'Anglais' : 'English'), h('th', null, api.fr ? 'Français' : 'French')), rows),
        h('p', { class: 'muted' }, api.fr ? 'Règle : anglais n-illion = 10^(3n+3); français n-illion = 10^(6n), n-illiard = 10^(6n+3).' : 'Rule: English n-illion = 10^(3n+3); French n-illion = 10^(6n), n-illiard = 10^(6n+3).'));
    }
    const quiz = kind => {
      let qi = 0, score = 0, good = 0, streak = 0; const N = 12;
      const root = api.clear(); const wrap = h('div', { class: 'gwrap', style: { maxWidth: '900px' } }); root.appendChild(wrap);
      const hud = () => api.hud([[t('score'), score], [t('streak'), streak], ['#', `${Math.min(qi + 1, N)}/${N}`]]);
      const next = () => {
        if (qi >= N) return api.finish({ score, stars: UI.starsFor(good / N), xp: 10 + good * 2, lines: [`${good}/${N}`], again: () => quiz(kind), menu });
        wrap.innerHTML = '';
        const maxP = Math.min(api.fr ? 60 : 33, 9 + qi * (api.fr ? 5 : 3));
        const ps = []; for (let p = 6; p <= maxP; p += 3) if (nameP(p)) ps.push(p);
        let prompt, big, opts, correct, explain, typed = false, key = null;
        if (kind === 'name') {
          const p = pick(ps); correct = nameP(p);
          const showDigits = Math.random() < 0.5;
          prompt = api.fr ? 'Comment s’appelle ce nombre ?' : 'What is this number called?';
          big = showDigits ? digits(p) : `${pow(p)}`;
          const allP = []; for (let x = 6; x <= (api.fr ? 60 : 33); x += 3) if (nameP(x) && x !== p) allP.push(x);
          const near = allP.sort((a, b) => Math.abs(a - p) - Math.abs(b - p)).slice(0, 5);
          opts = shuffle([correct, ...sample(near, 3).map(x => nameP(x))]);
          explain = `${pow(p)} = ${digits(p)} = ${correct}`;
        } else if (kind === 'swap') {
          const ok = []; for (let p = 9; p <= 60; p += 3) if (enName(p) && frName(p)) ok.push(p);
          const pool = ok.filter(p => p <= (qi < 4 ? 18 : qi < 8 ? 36 : 60));
          const p = pick(pool); const dirENtoFR = Math.random() < 0.5;
          const from = dirENtoFR ? enName(p) : frName(p), to = dirENtoFR ? frName(p) : enName(p);
          prompt = dirENtoFR ? (api.fr ? `Un « ${from} » anglais, c’est quoi en français ?` : `An English “${from}” is what in French?`) : (api.fr ? `Un « ${from} » français, c’est quoi en anglais ?` : `A French “${from}” is what in English?`);
          big = `🇬🇧 ${dirENtoFR ? from : '?'}  ⇄  ⚜️ ${dirENtoFR ? '?' : from}`;
          correct = to; const others = pool.concat(ok).filter(x => x !== p).map(x => dirENtoFR ? frName(x) : enName(x));
          opts = shuffle([...new Set([correct, from, ...sample(others, 4)])].filter(Boolean).slice(0, 4)); if (!opts.includes(correct)) opts[0] = correct;
          explain = `${pow(p)} : 🇬🇧 ${enName(p)} = ⚜️ ${frName(p)}`;
          if (from === 'nonillion') key = dirENtoFR ? 'en' : 'fr';
        } else {
          const p = pick(ps); typed = true; correct = String(p);
          prompt = api.fr ? `Combien de zéros dans un ${nameP(p)} ?` : `How many zeros in a ${nameP(p)}?`;
          big = `1 ${nameP(p)}`; explain = `${digits(p)} → ${p} ${api.fr ? 'zéros' : 'zeros'}`;
        }
        const res = h('div');
        const card = h('div', { class: 'card center fadein' }, h('div', { class: 'muted' }, prompt),
          h('div', { class: 'mono', style: { fontSize: big.length > 40 ? '20px' : '42px', fontWeight: 900, margin: '14px 0', wordBreak: 'break-all', background: 'linear-gradient(90deg,#ffc545,#ff4fd8,#9b7bff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } }, big));
        wrap.appendChild(card);
        const judge = (ok, el) => {
          if (ok) { good++; streak++; score += 100 + streak * 10; api.sfx('good'); api.xp(3, el); if (key) { D.non[key] = 1; api.save(); if (D.non.en && D.non.fr) api.badge('nonillion'); } }
          else { streak = 0; api.sfx('bad'); }
          res.appendChild(h('div', { class: 'fb ' + (ok ? 'good' : 'bad'), style: { marginTop: '10px' } }, (ok ? '✅ ' : '❌ ') + explain, h('div', null, h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: () => { qi++; next(); } }, t('next') + ' →'))));
          hud();
        };
        if (typed) {
          const inp = h('input', { class: 'field mono', type: 'number', style: { fontSize: '26px', width: '160px', textAlign: 'center' } });
          inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !inp.disabled) { inp.disabled = true; judge(inp.value.trim() === correct, inp); } });
          card.appendChild(h('div', { class: 'row', style: { justifyContent: 'center' } }, inp, h('button', { class: 'btn primary', onclick: () => { if (!inp.disabled) { inp.disabled = true; judge(inp.value.trim() === correct, inp); } } }, t('submit'))));
          setTimeout(() => inp.focus(), 30);
        } else {
          const box = h('div', { class: 'choices' });
          opts.forEach(o => box.appendChild(h('button', { class: 'choice', style: { textAlign: 'center', fontSize: '20px', fontWeight: 800 }, onclick: e => { [...box.children].forEach(b => { b.disabled = true; if (b.textContent === correct) b.classList.add('right'); }); if (o !== correct) e.currentTarget.classList.add('wrong'); judge(o === correct, e.currentTarget); } }, o)));
          card.appendChild(box);
        }
        card.appendChild(res); hud();
      };
      next();
    };
    const COSMIC = [
      [{ en: 'Piano keys', fr: 'Touches d’un piano' }, 88, '88'],
      [{ en: 'Seconds in a day', fr: 'Secondes dans une journée' }, 8.64e4, '8.64 × 10⁴'],
      [{ en: 'Seconds in a year', fr: 'Secondes dans une année' }, 3.16e7, '≈ 3.16 × 10⁷'],
      [{ en: 'People on Earth', fr: 'Humains sur Terre' }, 8.1e9, '≈ 8.1 × 10⁹'],
      [{ en: 'Neurons in a human brain', fr: 'Neurones dans un cerveau humain' }, 8.6e10, '≈ 8.6 × 10¹⁰'],
      [{ en: 'Stars in the Milky Way', fr: 'Étoiles dans la Voie lactée' }, 2e11, '≈ 1–4 × 10¹¹'],
      [{ en: 'Cells in a human body', fr: 'Cellules dans un corps humain' }, 3.5e13, '≈ 3–4 × 10¹³'],
      [{ en: 'Seconds since the Big Bang', fr: 'Secondes depuis le Big Bang' }, 4.35e17, '≈ 4.35 × 10¹⁷'],
      [{ en: 'Grains of sand on Earth’s beaches (estimate)', fr: 'Grains de sable des plages (estimation)' }, 7.5e18, '≈ 7.5 × 10¹⁸'],
      [{ en: 'Stars in the observable universe (estimate)', fr: 'Étoiles de l’univers observable (estimation)' }, 1e23, '≈ 10²²–10²⁴'],
      [{ en: 'Water molecules in a 250 mL glass', fr: 'Molécules d’eau dans un verre de 250 mL' }, 8.4e24, '≈ 8.4 × 10²⁴'],
      [{ en: 'Atoms in a human body', fr: 'Atomes dans un corps humain' }, 7e27, '≈ 7 × 10²⁷'],
      [{ en: 'Ways to shuffle a deck of 52 cards (52!)', fr: 'Façons de mélanger 52 cartes (52!)' }, 8.07e67, '≈ 8.07 × 10⁶⁷'],
      [{ en: 'Atoms in the observable universe', fr: 'Atomes dans l’univers observable' }, 1e80, '≈ 10⁸⁰'],
      [{ en: 'A googol', fr: 'Un gogol' }, 1e100, '10¹⁰⁰'],
      [{ en: 'Possible chess games (Shannon number)', fr: 'Parties d’échecs possibles (nombre de Shannon)' }, 1e120, '≈ 10¹²⁰'],
      [{ en: 'Orders of all 88 piano keys (88!)', fr: 'Façons d’ordonner les 88 touches (88!)' }, 1.86e134, '≈ 1.86 × 10¹³⁴'],
    ];
    const cosmic = () => {
      let qi = 0, score = 0, streak = 0, best = 0; const N = 12;
      const root = api.clear(); const wrap = h('div', { class: 'gwrap', style: { maxWidth: '980px' } }); root.appendChild(wrap);
      const next = () => {
        if (qi >= N) return api.finish({ score, stars: best >= 10 ? 3 : best >= 6 ? 2 : best >= 3 ? 1 : 0, xp: 10 + score / 50, lines: [`${api.fr ? 'Meilleure série' : 'Best streak'}: ${best}`], again: cosmic, menu });
        let [a, b] = sample(COSMIC, 2);
        if (Math.abs(Math.log10(a[1]) - Math.log10(b[1])) < 0.3) b = COSMIC[(COSMIC.indexOf(a) + 4) % COSMIC.length];
        wrap.innerHTML = '';
        const res = h('div');
        const card = (x, other) => h('button', { class: 'card fadein', style: { flex: 1, minHeight: '200px', cursor: 'pointer', textAlign: 'center', fontSize: '22px', fontWeight: 800, border: '1px solid var(--line)' }, onclick: e => {
          if (res.childElementCount) return;
          const ok = x[1] >= other[1];
          if (ok) { streak++; best = Math.max(best, streak); score += 100 + streak * 20; api.sfx('good'); } else { streak = 0; api.sfx('bad'); }
          wrap.querySelectorAll('.vals').forEach(v => v.classList.remove('hidden'));
          const mag = Math.round(Math.log10(Math.max(a[1], b[1]) / Math.min(a[1], b[1])));
          res.appendChild(h('div', { class: 'fb ' + (ok ? 'good' : 'bad'), style: { marginTop: '12px' } }, `${ok ? '✅' : '❌'} ${api.fr ? 'Écart' : 'Difference'}: ≈ 10${sup(mag)} ${api.fr ? 'fois' : 'times'}`, h('div', null, h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: () => { qi++; next(); } }, t('next') + ' →'))));
          api.hud([[t('score'), score], [t('streak'), streak], ['#', `${qi + 1}/${N}`]]);
        } }, L(x[0]), h('div', { class: 'vals hidden mono', style: { marginTop: '14px', fontSize: '26px', color: 'var(--amber)' } }, x[2]));
        wrap.append(h('div', { class: 'gtitle center' }, api.fr ? 'Lequel est le plus grand ?' : 'Which is bigger?'), h('div', { class: 'row', style: { alignItems: 'stretch', gap: '16px', marginTop: '10px' } }, card(a, b), h('div', { style: { alignSelf: 'center', fontSize: '28px', fontWeight: 900 } }, 'VS'), card(b, a)), res);
        api.hud([[t('score'), score], [t('streak'), streak], ['#', `${qi + 1}/${N}`]]);
      };
      next();
    };
    const machine = () => {
      const root = api.clear();
      let exp = 0, speed = 1.5, running = true;
      const disp = h('div', { class: 'mono', style: { fontSize: '26px', fontWeight: 900, wordBreak: 'break-all', lineHeight: 1.35, minHeight: '120px', padding: '16px', borderRadius: '16px', background: '#04060f', border: '1px solid var(--line)', color: '#9dff5b', textShadow: '0 0 12px rgba(157,255,91,.6)' } });
      const nameEl = h('div', { style: { fontSize: '22px', fontWeight: 800, marginTop: '10px' } });
      const sl = h('input', { type: 'range', min: 0.2, max: 6, step: 0.1, value: speed, style: { width: '100%' }, oninput: e => speed = +e.target.value });
      const jumps = [6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 54, 60, 100];
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: '980px' } }, h('div', { class: 'gtitle' }, '🎰 ' + (api.fr ? 'Machine à compter' : 'Counting machine')), disp, nameEl,
        h('div', { class: 'row', style: { marginTop: '12px' } }, h('span', null, api.fr ? 'Vitesse (ordres de grandeur / s)' : 'Speed (orders of magnitude / s)'), h('div', { class: 'grow' }, sl),
          h('button', { class: 'btn', onclick: e => { running = !running; e.currentTarget.textContent = running ? '⏸' : '▶'; } }, '⏸'), h('button', { class: 'btn', onclick: () => exp = 0 }, '↺')),
        h('div', { class: 'row', style: { marginTop: '10px' } }, jumps.map(p => h('button', { class: 'chip', onclick: () => { exp = p; api.sfx('coin'); } }, p === 100 ? (api.fr ? 'gogol' : 'googol') : pow(p)))), h('div', { class: 'row', style: { marginTop: '12px' } }, h('button', { class: 'btn', onclick: menu }, t('menu')))));
      let lastName = '';
      api.loop(dt => {
        if (running && exp < 100) exp = Math.min(100, exp + speed * dt);
        const p = Math.floor(exp), frac = exp - p;
        const lead = Math.floor(Math.pow(10, frac) * 1000) / 1000;
        const s = (lead.toFixed(3).replace('.', '') + '0'.repeat(Math.max(0, p))).slice(0, p + 1);
        disp.textContent = s.replace(/\B(?=(\d{3})+(?!\d))/g, api.fr ? ' ' : ',');
        const g = Math.floor(p / 3) * 3;
        const en = p >= 100 ? 'googol' : enName(g) || (p < 6 ? '—' : `10^${p}`), fr = p >= 100 ? 'gogol' : frName(g) || (p < 6 ? '—' : `10^${p}`);
        const txt = `≈ ${pow(p)} · 🇬🇧 ${en} · ⚜️ ${fr}`;
        if (txt !== lastName) { nameEl.textContent = txt; lastName = txt; if (p % 3 === 0 && p >= 6) api.sfx('tick'); }
        api.hud([[api.fr ? 'Chiffres' : 'Digits', p + 1]]);
      });
    };
    menu();
  },
});
