'use strict';
registerGame({
  id: 'roots', n: 17, cat: 'words', colors: ['#9dff5b', '#3b7bff'],
  glyph: `<path d="M38 14 h24 v6 h-4 v22 l18 32 a8 8 0 0 1 -7 12 h-38 a8 8 0 0 1 -7 -12 l18 -32 v-22 h-4Z" fill="#fff"/>
    <path d="M30 70 l12 -20 h16 l12 20 a4 4 0 0 1 -3 6 h-34 a4 4 0 0 1 -3 -6Z" fill="#3b7bff" fill-opacity=".7"/><circle cx="45" cy="64" r="3" fill="#9dff5b"/><circle cx="55" cy="58" r="2" fill="#9dff5b"/>`,
  name: { en: 'Root Lab', fr: 'Labo des racines' },
  tag: { en: 'Fuse Greek and Latin roots into words that work in English AND French.', fr: 'Fusionne des racines grecques et latines en mots qui marchent en français ET en anglais.' },
  how: {
    en: '<p><b>Build</b>: read the definition, then click the root tubes in order to synthesise the word. <b>Decode</b>: see a word and work out its meaning from its roots. <b>Invent</b>: mix any roots to coin a brand-new word and read its meaning. Every result shows the English and French forms.</p>',
    fr: '<p><b>Construire</b> : lis la définition, puis clique les éprouvettes de racines dans l’ordre. <b>Décoder</b> : trouve le sens d’un mot grâce à ses racines. <b>Inventer</b> : mélange des racines pour créer un mot tout neuf. Chaque résultat montre la forme française et anglaise.</p>',
  },
  why: {
    en: 'Morphology was the weakest metalinguistic skill in a hyperlexic reader (Luo & Su, 2023), yet roots carry meaning directly. Because English and French share these roots, each one learned pays off in both languages — and bilingual vocabulary grows with exposure (Gonzalez-Barrero & Nadig, 2018).',
    fr: 'La morphologie était l’habileté métalinguistique la plus faible chez un lecteur hyperlexique (Luo et Su, 2023), alors que les racines portent directement le sens. Comme le français et l’anglais partagent ces racines, chacune rapporte dans les deux langues (Gonzalez-Barrero et Nadig, 2018).',
  },
  start(api) {
    const W = w => api.fr ? w.fr : w.en, Def = w => api.fr ? w.dfr : w.den, RM = r => ROOTS[r][api.lang];
    const tube = (r, extra = {}) => h('button', Object.assign({ style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '8px 10px 10px', borderRadius: '10px 10px 22px 22px', border: '2px solid rgba(255,255,255,.35)', background: 'linear-gradient(180deg,rgba(255,255,255,.08) 0%,rgba(255,255,255,.08) 40%,rgba(157,255,91,.35) 41%,rgba(59,123,255,.45) 100%)', minWidth: '84px', color: 'var(--ink)', fontWeight: 900 } }, extra), h('span', { style: { fontSize: '17px' } }, r), h('span', { style: { fontSize: '11px', color: 'var(--ink2)', fontWeight: 600 } }, RM(r)));
    const menu = () => UI.menu(api, {
      options: [
        { icon: '⚗️', name: { en: 'Build words', fr: 'Construire des mots' }, desc: { en: '10 definitions to synthesise', fr: '10 définitions à synthétiser' }, go: () => build() },
        { icon: '🔬', name: { en: 'Decode words', fr: 'Décoder des mots' }, desc: { en: 'Meaning from the roots', fr: 'Le sens par les racines' }, go: () => decode() },
        { icon: '🧪', name: { en: 'Invent a word', fr: 'Inventer un mot' }, desc: { en: 'Creative sandbox', fr: 'Bac à sable créatif' }, go: () => invent() },
      ],
    });
    const reaction = (el) => { const r = el.getBoundingClientRect(); for (let i = 0; i < 3; i++) setTimeout(() => api.burst(r.left + r.width / 2, r.top + r.height / 2, ['#9dff5b', '#37e2ff', '#ffc545'][i], 20), i * 120); };
    const build = () => {
      const qs = sample(ROOTWORDS, 10); let qi = 0, score = 0, good = 0;
      const next = () => {
        if (qi >= qs.length) return api.finish({ score, stars: UI.starsFor(good / qs.length), xp: 10 + good * 2, lines: [`${good}/${qs.length}`], again: build, menu });
        const q = qs[qi]; let sel = [], tries = 0;
        const all = Object.keys(ROOTS);
        const tray = shuffle([...new Set([...q.r, ...sample(all.filter(x => !q.r.includes(x)), 7)])]);
        const root = api.clear();
        const flask = h('div', { class: 'row', style: { minHeight: '84px', justifyContent: 'center', padding: '14px', borderRadius: '20px', border: '2px dashed rgba(157,255,91,.5)', background: 'rgba(157,255,91,.05)' } });
        const res = h('div');
        const trayEl = h('div', { class: 'row', style: { justifyContent: 'center', gap: '10px' } });
        root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: '900px' } },
          h('div', { class: 'card center' }, h('div', { class: 'muted' }, `⚗️ ${qi + 1}/${qs.length} — ${api.fr ? 'Synthétise le mot qui veut dire :' : 'Synthesise the word that means:'}`), h('div', { style: { fontSize: '26px', fontWeight: 800, margin: '10px 0' } }, `“${Def(q)}”`), h('div', { class: 'muted' }, `${q.r.length} ${api.fr ? 'racines' : 'roots'}`)),
          h('div', { style: { margin: '16px 0 8px' } }, flask), trayEl,
          h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '14px' } }, h('button', { class: 'btn', onclick: () => { sel = []; paint(); } }, t('clear')), h('button', { class: 'btn primary lg', onclick: () => check() }, '🔥 ' + (api.fr ? 'Réaction !' : 'React!'))), res));
        const paint = () => { flask.innerHTML = ''; sel.forEach((r, i) => flask.appendChild(tube(r, { onclick: () => { sel.splice(i, 1); paint(); } }))); if (!sel.length) flask.appendChild(h('span', { class: 'muted' }, api.fr ? 'Clique des racines ci-dessous…' : 'Click roots below…')); trayEl.innerHTML = ''; tray.forEach(r => trayEl.appendChild(tube(r, { onclick: () => { if (sel.length < 4) { sel.push(r); api.sfx('pop'); paint(); } } }))); };
        const check = () => {
          tries++;
          const ok = sel.join('+') === q.r.join('+');
          if (ok) {
            good++; score += tries === 1 ? 100 : 50; api.sfx('great'); reaction(flask); api.xp(4, flask);
            res.innerHTML = ''; res.appendChild(h('div', { class: 'fb good fadein', style: { marginTop: '12px', fontSize: '18px' } }, h('div', null, '🧪 ', h('b', null, q.en), ' 🇬🇧  ·  ', h('b', null, q.fr), ' ⚜️'), h('div', { class: 'muted', style: { marginTop: '4px' } }, q.r.map(r => `${r} (${RM(r)})`).join(' + ')), h('button', { class: 'btn primary', style: { marginTop: '10px' }, onclick: () => { qi++; next(); } }, t('next') + ' →')));
          } else {
            api.sfx('bad'); flask.classList.add('shake'); setTimeout(() => flask.classList.remove('shake'), 400);
            if (tries >= 2) { res.innerHTML = ''; res.appendChild(h('div', { class: 'fb info', style: { marginTop: '12px' } }, (api.fr ? 'Indice : commence par ' : 'Hint: start with ') + `“${q.r[0]}” (${RM(q.r[0])})`)); }
            if (tries >= 4) { res.innerHTML = ''; res.appendChild(h('div', { class: 'fb bad', style: { marginTop: '12px' } }, `${q.en} / ${q.fr} = ${q.r.join(' + ')}`, h('div', null, h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: () => { qi++; next(); } }, t('next') + ' →')))); }
          }
          api.hud([[t('score'), score], ['✔', `${good}/${qs.length}`]]);
        };
        paint(); api.hud([[t('score'), score], ['✔', `${good}/${qs.length}`]]);
      };
      next();
    };
    const decode = () => {
      const qs = sample(ROOTWORDS, 10); let qi = 0, score = 0, good = 0;
      const next = () => {
        if (qi >= qs.length) return api.finish({ score, stars: UI.starsFor(good / qs.length), xp: 10 + good * 2, lines: [`${good}/${qs.length}`], again: decode, menu });
        const q = qs[qi];
        const opts = shuffle([q, ...sample(ROOTWORDS.filter(x => x !== q), 3)]);
        const root = api.clear();
        const res = h('div');
        const box = h('div', { class: 'choices', style: { gridTemplateColumns: '1fr' } });
        root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: '860px' } },
          h('div', { class: 'card center' }, h('div', { class: 'muted' }, `🔬 ${qi + 1}/${qs.length}`), h('div', { style: { fontSize: '44px', fontWeight: 900, letterSpacing: '.03em', margin: '6px 0' } }, W(q)),
            h('div', { class: 'row', style: { justifyContent: 'center', gap: '10px' } }, q.r.map(r => h('div', { class: 'chip', style: { fontSize: '16px' } }, h('b', null, r), ' = ?')))),
          h('p', { class: 'muted center' }, api.fr ? 'Que veut dire ce mot ?' : 'What does this word mean?'), box, res));
        opts.forEach(o => box.appendChild(h('button', { class: 'choice', onclick: e => {
          [...box.children].forEach(b => { b.disabled = true; if (b.textContent === Def(q)) b.classList.add('right'); });
          const ok = o === q; if (ok) { good++; score += 100; api.sfx('good'); api.xp(3, e.currentTarget); } else { e.currentTarget.classList.add('wrong'); api.sfx('bad'); }
          res.appendChild(h('div', { class: 'fb ' + (ok ? 'good' : 'info'), style: { marginTop: '10px' } }, q.r.map(r => `${r} = ${RM(r)}`).join('  ·  '), h('div', null, `🇬🇧 ${q.en}  ·  ⚜️ ${q.fr}`), h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: () => { qi++; next(); } }, t('next') + ' →')));
          api.hud([[t('score'), score], ['✔', `${good}/${qs.length}`]]);
        } }, Def(o))));
      };
      next();
    };
    const invent = () => {
      let sel = [];
      const root = api.clear();
      const out = h('div', { style: { minHeight: '120px' } });
      const trayEl = h('div', { class: 'row', style: { justifyContent: 'center', gap: '8px' } });
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: '980px' } }, h('div', { class: 'gtitle center' }, '🧪 ' + (api.fr ? 'Invente un mot' : 'Invent a word')),
        h('p', { class: 'muted center' }, api.fr ? 'Choisis 2 ou 3 racines. La machine fabrique le mot et sa définition.' : 'Pick 2 or 3 roots. The machine builds the word and its definition.'), out, trayEl,
        h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '14px' } }, h('button', { class: 'btn', onclick: () => { sel = []; paint(); } }, t('clear')), h('button', { class: 'btn', onclick: menu }, t('menu')))));
      const paint = () => {
        out.innerHTML = '';
        if (sel.length >= 2) {
          const word = sel.join('').replace(/([aeiou])\1/g, '$1');
          const real = ROOTWORDS.find(w => w.r.join('+') === sel.join('+'));
          const meaning = sel.map(RM).join(' + ');
          out.appendChild(h('div', { class: 'card center fadein' }, h('div', { style: { fontSize: '40px', fontWeight: 900, background: 'linear-gradient(90deg,#9dff5b,#37e2ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } }, real ? W(real) : word),
            h('div', { style: { fontSize: '18px', marginTop: '6px' } }, real ? `✅ ${api.fr ? 'Vrai mot !' : 'Real word!'} ${Def(real)}` : `✨ ${api.fr ? 'Mot inventé' : 'Invented word'} : “${meaning}”`),
            h('div', { class: 'muted', style: { marginTop: '6px' } }, real ? `🇬🇧 ${real.en} · ⚜️ ${real.fr}` : (api.fr ? 'Écris une phrase qui l’utiliserait !' : 'Write a sentence that would use it!'))));
          if (real) { api.sfx('great'); reaction(out); api.data.inv = api.data.inv || {}; if (!api.data.inv[real.en]) { api.data.inv[real.en] = 1; api.save(); api.xp(5); } } else api.sfx('pop');
        } else out.appendChild(h('div', { class: 'center muted', style: { paddingTop: '40px' } }, sel.length ? sel.join(' + ') + ' + …' : '…'));
        trayEl.innerHTML = '';
        Object.keys(ROOTS).forEach(r => trayEl.appendChild(tube(r, { onclick: () => { if (sel.length >= 3) sel = []; sel.push(r); paint(); } })));
      };
      paint();
    };
    menu();
  },
});
