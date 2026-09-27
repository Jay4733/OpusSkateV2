'use strict';
registerGame({
  id: 'proof', n: 16, cat: 'meaning', colors: ['#ff5d73', '#ffb13d'],
  glyph: `<rect x="20" y="16" width="52" height="68" rx="6"/><g stroke="#ff5d73" stroke-width="4" stroke-linecap="round"><line x1="28" y1="32" x2="62" y2="32"/><line x1="28" y1="46" x2="56" y2="46"/><line x1="28" y1="60" x2="62" y2="60"/></g>
    <ellipse cx="44" cy="46" rx="16" ry="9" fill="none" stroke="#b30024" stroke-width="3"/><path d="M62 70 L84 48 L90 54 L68 76 L60 78Z" fill="#ffe08a" stroke="#fff" stroke-width="2"/>`,
  name: { en: 'Proofreader Pro', fr: 'Correcteur pro' },
  tag: { en: 'Spot the errors where meaning decides the spelling — then fix them.', fr: 'Repère les fautes où le sens décide de l’orthographe — puis corrige-les.' },
  how: {
    en: '<p>Each passage hides several errors: homophones (there/their), contractions (it’s/its), confused words (affect/effect), agreement and spelling. <b>Click a word</b> you think is wrong, then choose the correction. Clicking a correct word costs a point (false alarm). A rule card explains every fix.</p>',
    fr: '<p>Chaque texte cache plusieurs fautes : homophones (a/à, ou/où, ses/ces), et/est, son/sont, on/ont, -er/-é, accords… <b>Clique un mot</b> fautif, puis choisis la correction. Cliquer un mot correct coûte un point (fausse alerte). Une fiche explique chaque règle.</p>',
  },
  why: {
    en: 'Hyperlexic readers notice print forms instantly — this game turns that into meaning-checking: the correct spelling depends on the sentence’s meaning, the same skill low-verbal fluent readers lacked when pronouncing homographs from context (Snowling & Frith, 1986).',
    fr: 'Les lecteurs hyperlexiques remarquent instantanément la forme des mots — ce jeu transforme ce talent en vérification du sens : la bonne orthographe dépend du sens de la phrase, l’habileté même qui manquait aux lecteurs fluides mais moins verbaux (Snowling et Frith, 1986).',
  },
  start(api) {
    const CONF = api.lang === 'fr' ? [['a', 'à'], ['ou', 'où'], ['ces', 'ses', 'c’est', 's’est'], ['et', 'est'], ['son', 'sont'], ['on', 'ont'], ['leur', 'leurs'], ['ce', 'se'], ['peu', 'peut', 'peux'], ['quand', 'quant', 'qu’en']]
      : [['there', 'their', 'they’re'], ['its', 'it’s'], ['your', 'you’re'], ['to', 'too', 'two'], ['then', 'than'], ['lose', 'loose'], ['accept', 'except'], ['affect', 'effect'], ['whose', 'who’s'], ['hear', 'here']];
    const menu = () => UI.menu(api, {
      options: [
        { icon: '📝', name: { en: 'Proofreading shift (5 texts)', fr: 'Quart de correction (5 textes)' }, desc: { en: 'Timed unless relaxed mode', fr: 'Chronométré sauf en mode détente' }, go: () => shift(sample(PROOF[api.lang].texts, 5)) },
        { icon: '📚', name: { en: 'All 8 texts', fr: 'Les 8 textes' }, desc: { en: 'The full edition', fr: 'L’édition complète' }, go: () => shift(shuffle(PROOF[api.lang].texts)) },
      ],
    });
    const shift = texts => {
      let ti = 0, score = 0, found = 0, total = 0, falseA = 0;
      const t0 = Date.now();
      const root = api.clear();
      const page = h('div', { style: { background: '#fbf7ec', color: '#231f16', borderRadius: '14px', padding: '26px 30px', fontFamily: 'Georgia, serif', fontSize: '22px', lineHeight: 1.9, boxShadow: '0 16px 40px rgba(0,0,0,.4)', position: 'relative' } });
      const pop = h('div', { class: 'hidden', style: { position: 'absolute', zIndex: 5, background: '#16204a', color: '#fff', borderRadius: '12px', padding: '8px', display: 'flex', gap: '6px', boxShadow: '0 10px 30px rgba(0,0,0,.4)', fontFamily: 'var(--font)', fontSize: '16px' } });
      const rules = h('div', { class: 'col', style: { gap: '6px', marginTop: '14px' } });
      const bar = h('div', { class: 'row', style: { marginTop: '12px' } });
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: '900px' } }, h('div', { style: { position: 'relative' } }, page, pop), bar, rules));
      const hud = () => api.hud([[t('score'), score], ['🔎', `${found}/${total}`], [api.fr ? 'Fausses alertes' : 'False alarms', falseA], [t('time'), api.relaxed ? '∞' : Math.floor((Date.now() - t0) / 1000) + 's']]);
      const load = () => {
        if (ti >= texts.length) return end();
        const raw = texts[ti];
        const segs = raw.split(/(\[[^\]]+\])/).filter(Boolean);
        page.innerHTML = ''; rules.innerHTML = ''; bar.innerHTML = '';
        let errs = 0, fixed = 0;
        page.appendChild(h('div', { class: 'mono', style: { fontSize: '12px', color: '#8a7a55', marginBottom: '6px' } }, `${api.fr ? 'ÉPREUVE' : 'PROOF'} ${ti + 1}/${texts.length}`));
        const para = h('div'); page.appendChild(para);
        for (const sg of segs) {
          if (sg.startsWith('[')) {
            const [wrong, right, rule] = sg.slice(1, -1).split('|');
            errs++; total++;
            const w = h('span', { dataset: { err: '1' }, style: { cursor: 'pointer', borderRadius: '4px', padding: '0 2px' } }, wrong);
            w.addEventListener('click', e => { e.stopPropagation(); if (w.dataset.done) return; openPop(w, wrong, right, rule); });
            para.appendChild(w); para.appendChild(document.createTextNode(' '));
          } else {
            sg.trim().split(/\s+/).filter(Boolean).forEach(tok => {
              const w = h('span', { style: { cursor: 'pointer', borderRadius: '4px', padding: '0 2px' } }, tok);
              w.addEventListener('click', e => { e.stopPropagation(); if (w.dataset.done) return; falseA++; score = Math.max(0, score - 10); api.sfx('bad'); w.style.background = 'rgba(255,93,115,.25)'; w.classList.add('shake'); setTimeout(() => { w.style.background = ''; w.classList.remove('shake'); }, 500); hud(); });
              para.appendChild(w); para.appendChild(document.createTextNode(' '));
            });
          }
        }
        const openPop = (w, wrong, right, rule) => {
          const set = CONF.find(s => s.some(x => norm(x) === norm(wrong) || norm(x) === norm(right)));
          let opts = [wrong, right];
          if (set) set.forEach(x => { if (opts.length < 3 && !opts.some(o => norm(o) === norm(x))) opts.push(x.charAt(0) === x.charAt(0) && wrong[0] === wrong[0].toUpperCase() ? x[0].toUpperCase() + x.slice(1) : x); });
          opts = shuffle(opts);
          pop.innerHTML = ''; pop.classList.remove('hidden');
          const pr = page.parentNode.getBoundingClientRect(), wr = w.getBoundingClientRect();
          pop.style.left = Math.max(0, wr.left - pr.left - 20) + 'px'; pop.style.top = (wr.bottom - pr.top + 6) + 'px';
          opts.forEach(o => pop.appendChild(h('button', { class: 'btn sm', onclick: e => {
            e.stopPropagation(); pop.classList.add('hidden');
            if (o === right) {
              w.dataset.done = 1; w.textContent = right; w.style.background = 'rgba(61,220,132,.3)'; w.style.textDecoration = 'underline wavy #1c9d58';
              found++; fixed++; score += 100; api.sfx('good'); api.xp(3, w);
              rules.appendChild(h('div', { class: 'fb good fadein' }, h('b', null, `${wrong} → ${right} : `), PROOF[api.lang].rules[rule]));
              if (fixed === errs) done();
            } else if (o === wrong) { api.sfx('pop'); }
            else { score = Math.max(0, score - 20); api.sfx('bad'); w.classList.add('shake'); setTimeout(() => w.classList.remove('shake'), 400); }
            hud();
          } }, o)));
        };
        const done = () => {
          api.sfx('great');
          bar.appendChild(h('button', { class: 'btn primary lg', onclick: () => { ti++; load(); } }, (ti + 1 >= texts.length ? t('done') : t('next')) + ' →'));
        };
        bar.appendChild(h('button', { class: 'btn', onclick: () => { const left = [...para.children].find(s => s.dataset.err && !s.dataset.done); if (left) { score = Math.max(0, score - 30); left.style.boxShadow = '0 0 0 3px #ffc545'; api.sfx('pop'); setTimeout(() => left.style.boxShadow = '', 1500); hud(); } } }, '💡 ' + t('hint')),
          h('span', { class: 'muted' }, `${api.fr ? 'Fautes dans ce texte' : 'Errors in this text'}: ${errs}`));
        hud();
      };
      api.on(document, 'click', () => pop.classList.add('hidden'));
      if (!api.relaxed) api.every(1000, hud);
      const end = () => {
        const secs = (Date.now() - t0) / 1000;
        const acc = found / Math.max(1, found + falseA);
        const bonus = api.relaxed ? 0 : Math.max(0, Math.round(300 - secs));
        api.finish({ score: score + bonus, stars: falseA === 0 ? 3 : acc >= 0.8 ? 2 : 1, xp: 10 + found, lines: [`${found}/${total} ${api.fr ? 'fautes corrigées' : 'errors fixed'} · ${falseA} ${api.fr ? 'fausses alertes' : 'false alarms'}`, api.relaxed ? '' : `${Math.round(secs)} s`], again: () => shift(sample(PROOF[api.lang].texts, texts.length === 8 ? 8 : 5)), menu });
      };
      load();
    };
    menu();
  },
});
