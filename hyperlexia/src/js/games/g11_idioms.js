'use strict';
registerGame({
  id: 'idioms', n: 11, cat: 'meaning', colors: ['#ff8f3d', '#8a2be2'],
  glyph: `<circle cx="42" cy="42" r="22" fill="none" stroke="#fff" stroke-width="7"/><path d="M58 58 L82 82" stroke="#fff" stroke-width="10" stroke-linecap="round"/>
    <text x="42" y="50" font-size="22" text-anchor="middle">?!</text>`,
  name: { en: 'Idiom Detective', fr: 'Détective des expressions' },
  tag: { en: 'Literal or figurative? Crack English idioms and expressions québécoises.', fr: 'Au sens propre ou figuré ? Perce les expressions québécoises et anglaises.' },
  how: {
    en: '<p>Each case file shows an expression and a “crime-scene photo” of what it would mean <i>literally</i>. Choose what the speaker <b>really</b> means — watch out for the literal trap! Every answer opens an evidence card with the meaning and an example. Between clues, interrogations ask: literal or figurative?</p>',
    fr: '<p>Chaque dossier montre une expression et une « photo de la scène » de son sens <i>littéral</i>. Choisis ce que la personne veut <b>vraiment</b> dire — attention au piège du sens propre ! Chaque réponse ouvre une fiche avec le sens et un exemple. Entre les indices, un interrogatoire : sens propre ou figuré ?</p>',
  },
  why: {
    en: 'Figurative language is a hallmark difficulty in autism — idioms tend to be read literally, and comprehension improves with explicit teaching, context and familiarity (Martelle & Namazi, 2022). Neuroimaging shows reduced left-temporal recruitment for figurative meaning (Cheng et al., 2026), so explicit practice matters.',
    fr: 'Le langage figuré est une difficulté typique en autisme — les expressions sont souvent prises au pied de la lettre, et la compréhension s’améliore avec l’enseignement explicite, le contexte et la familiarité (Martelle et Namazi, 2022). L’imagerie montre un moindre recrutement temporal gauche pour le sens figuré (Cheng et al., 2026).',
  },
  start(api) {
    const D = api.data; D.correct = D.correct || 0;
    const RANKS = [{ en: 'Rookie', fr: 'Recrue' }, { en: 'Constable', fr: 'Agent' }, { en: 'Detective', fr: 'Enquêteur' }, { en: 'Inspector', fr: 'Inspecteur' }, { en: 'Chief Inspector', fr: 'Inspecteur en chef' }];
    const rank = () => L(RANKS[Math.min(4, Math.floor(D.correct / 15))]);
    const menu = () => UI.menu(api, {
      sub: `${api.fr ? 'Grade' : 'Rank'}: ${rank()} · ${D.correct} ${api.fr ? 'expressions résolues' : 'idioms solved'}`,
      options: [
        { icon: '🇬🇧', name: { en: 'English idioms case', fr: 'Dossier : expressions anglaises' }, desc: { en: '10 idioms + interrogations', fr: '10 expressions + interrogatoires' }, go: () => play('en') },
        { icon: '⚜️', name: { en: 'Expressions québécoises case', fr: 'Dossier : expressions québécoises' }, desc: { en: '10 expressions (in French)', fr: '10 expressions + interrogatoires' }, go: () => play('fr') },
        { icon: '🔀', name: { en: 'Bilingual mixed case', fr: 'Dossier bilingue' }, desc: { en: '5 + 5, both languages', fr: '5 + 5, deux langues' }, go: () => play('mix') },
      ],
    });
    const play = deck => {
      let items = deck === 'mix' ? shuffle([...sample(IDIOMS.en, 5).map(x => ({ ...x, lang: 'en' })), ...sample(IDIOMS.fr, 5).map(x => ({ ...x, lang: 'fr' }))]) : sample(IDIOMS[deck], 10).map(x => ({ ...x, lang: deck }));
      let i = 0, score = 0, correct = 0, streak = 0;
      const root = api.clear();
      const wrap = h('div', { class: 'gwrap', style: { maxWidth: '860px' } });
      root.appendChild(wrap);
      const hud = () => api.hud([[t('score'), score], [t('streak'), streak], ['📁', `${Math.min(i + 1, items.length)}/${items.length}`]]);
      const folder = (kids) => h('div', { class: 'fadein', style: { position: 'relative', background: 'linear-gradient(180deg,#e9d8a6,#d8c285)', color: '#2b2110', borderRadius: '6px 18px 18px 18px', padding: '22px', boxShadow: '0 16px 40px rgba(0,0,0,.45)', marginTop: '22px' } },
        h('div', { style: { position: 'absolute', top: '-20px', left: '0', background: '#d8c285', padding: '4px 18px', borderRadius: '10px 10px 0 0', fontWeight: 900, letterSpacing: '.1em', fontSize: '13px' } }, (api.fr ? 'DOSSIER N° ' : 'CASE FILE #') + String(1000 + i * 7 + correct).padStart(4, '0')), ...kids);
      const next = () => {
        if (i >= items.length) return end();
        if (i > 0 && i % 4 === 0 && !items[i].interrogated) { items[i].interrogated = true; return interrogate(); }
        const it = items[i];
        const opts = shuffle([it.m, ...it.w]);
        wrap.innerHTML = '';
        const optBox = h('div', { class: 'choices', style: { marginTop: '14px' } });
        wrap.appendChild(folder([
          h('div', { class: 'row', style: { alignItems: 'flex-start', gap: '20px' } },
            h('div', { style: { background: '#fff', padding: '10px 10px 26px', transform: 'rotate(-3deg)', boxShadow: '0 6px 14px rgba(0,0,0,.3)', minWidth: '140px', textAlign: 'center' } },
              h('div', { style: { fontSize: '56px', lineHeight: 1.2, background: '#dfe9f3', padding: '12px', borderRadius: '2px' } }, it.e),
              h('div', { style: { fontSize: '11px', color: '#555', marginTop: '6px', fontFamily: 'var(--mono)' } }, api.fr ? 'SENS LITTÉRAL ?' : 'LITERAL SCENE?')),
            h('div', { class: 'grow' },
              h('div', { style: { fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '.1em', color: '#7a5d1c' } }, it.lang === 'fr' ? 'SUSPECT QUÉBÉCOIS' : 'ENGLISH SUSPECT'),
              h('div', { style: { fontSize: '30px', fontWeight: 900, fontFamily: 'Georgia, serif', lineHeight: 1.15, margin: '6px 0' } }, `“${it.x}”`),
              h('div', { style: { fontSize: '16px' } }, api.fr ? 'Que veut vraiment dire le suspect ?' : 'What does the suspect really mean?'))),
          optBox]));
        opts.forEach(o => optBox.appendChild(h('button', { class: 'choice', style: { background: 'rgba(255,255,255,.55)', color: '#2b2110', borderColor: 'rgba(0,0,0,.15)' }, onclick: e => answer(o, e.currentTarget, optBox, it) }, o)));
        hud();
      };
      const answer = (o, btn, box, it) => {
        const ok = o === it.m;
        [...box.children].forEach(b => { b.disabled = true; if (b.textContent === it.m) b.classList.add('right'); });
        if (ok) { correct++; streak++; score += 100 + streak * 10; D.correct++; api.save(); api.sfx('good'); api.xp(4, btn); if (D.correct >= 20) api.badge('idioms'); }
        else { streak = 0; btn.classList.add('wrong'); api.sfx('bad'); }
        const literalTrap = !ok && it.w.indexOf(o) === 0;
        wrap.appendChild(h('div', { class: 'fb ' + (ok ? 'good' : 'bad') + ' fadein', style: { marginTop: '14px' } },
          h('div', { style: { fontSize: '18px', fontWeight: 800 } }, ok ? (api.fr ? '✅ Affaire classée !' : '✅ Case closed!') : literalTrap ? (api.fr ? '🪤 Piège du sens littéral !' : '🪤 Literal trap!') : (api.fr ? '❌ Mauvaise piste.' : '❌ Wrong lead.')),
          h('div', { style: { marginTop: '6px' } }, h('b', null, (api.fr ? 'Sens réel : ' : 'Real meaning: ')), it.m),
          h('div', { style: { marginTop: '4px', fontStyle: 'italic' } }, '💬 ', it.ex),
          h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn primary', onclick: () => { i++; next(); } }, t('next') + ' →'))));
        hud();
      };
      const interrogate = () => {
        const pool = deck === 'mix' ? [...LITFIG.en, ...LITFIG.fr] : LITFIG[deck];
        const qs = sample(pool, 3); let k = 0;
        const ask = () => {
          if (k >= qs.length) { next(); return; }
          const [s, ans] = qs[k];
          wrap.innerHTML = '';
          const fb = h('div');
          wrap.appendChild(h('div', { class: 'panel fadein', style: { marginTop: '20px', textAlign: 'center', border: '1px solid rgba(255,143,61,.5)' } },
            h('div', { style: { fontSize: '14px', letterSpacing: '.12em', color: 'var(--amber)', fontWeight: 800 } }, `🔦 ${api.fr ? 'INTERROGATOIRE' : 'INTERROGATION'} ${k + 1}/3`),
            h('div', { style: { fontSize: '24px', fontWeight: 700, margin: '16px 0', fontFamily: 'Georgia, serif' } }, `“${s}”`),
            h('div', { class: 'row', style: { justifyContent: 'center' } },
              h('button', { class: 'btn lg', onclick: () => res('L') }, '📷 ' + (api.fr ? 'Sens propre (littéral)' : 'Literal')),
              h('button', { class: 'btn lg', onclick: () => res('F') }, '🎭 ' + (api.fr ? 'Sens figuré' : 'Figurative'))), fb));
          const res = v => {
            const ok = v === ans;
            if (ok) { score += 50; api.sfx('good'); } else api.sfx('bad');
            [...wrap.querySelectorAll('.btn.lg')].forEach(b => b.disabled = true);
            fb.appendChild(h('div', { class: 'fb ' + (ok ? 'good' : 'bad'), style: { marginTop: '12px' } }, ok ? t('correct') : t('wrong'), ' ', ans === 'L' ? (api.fr ? 'Ici, les mots veulent dire exactement ce qu’ils disent.' : 'Here the words mean exactly what they say.') : (api.fr ? 'Ici, l’expression a un sens imagé.' : 'Here the expression has a non-literal meaning.'),
              h('div', { style: { marginTop: '8px' } }, h('button', { class: 'btn primary', onclick: () => { k++; ask(); } }, t('next') + ' →'))));
            hud();
          };
        };
        ask();
      };
      const end = () => {
        const stars = correct >= 9 ? 3 : correct >= 7 ? 2 : correct >= 4 ? 1 : 0;
        api.finish({ score, stars, xp: 10 + correct * 2, title: `${correct}/${items.length} ${api.fr ? 'affaires résolues' : 'cases solved'}`, lines: [`${api.fr ? 'Grade' : 'Rank'}: ${rank()}`], again: () => play(deck), menu });
      };
      next();
    };
    menu();
  },
});
