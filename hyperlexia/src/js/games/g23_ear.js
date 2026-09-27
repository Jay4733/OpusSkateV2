'use strict';
registerGame({
  id: 'ear', n: 23, cat: 'music', colors: ['#9dff5b', '#0e6b8f'],
  glyph: `<path d="M58 18 a24 24 0 0 0 -34 22 c0 12 8 16 10 24 c2 8 -2 16 8 18 c8 2 12 -4 12 -10" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    <path d="M46 40 a8 8 0 0 1 14 4" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <path d="M70 34 q8 12 0 24 M78 28 q12 18 0 36" fill="none" stroke="#9dff5b" stroke-width="4" stroke-linecap="round"/>`,
  name: { en: 'Ear Trainer', fr: 'Oreille d’or' },
  tag: { en: 'Perfect-pitch challenge, intervals, chord moods and melody echo.', fr: 'Défi d’oreille absolue, intervalles, humeurs des accords et écho mélodique.' },
  how: {
    en: '<p><b>Perfect pitch</b>: hear a note, click its key — no reference note! <b>Intervals</b>: name the distance between two notes (with song mnemonics). <b>Chord moods</b>: hear a chord and pick its quality <i>and</i> its feeling — bright, sad, tense, dreamy. <b>Melody echo</b>: repeat a growing melody.</p>',
    fr: '<p><b>Oreille absolue</b> : écoute une note et clique sa touche — sans note de référence ! <b>Intervalles</b> : nomme la distance entre deux notes (avec des chansons repères). <b>Humeurs des accords</b> : écoute un accord et choisis sa qualité <i>et</i> son émotion — lumineux, triste, tendu, rêveur. <b>Écho</b> : répète une mélodie qui s’allonge.</p>',
  },
  why: {
    en: 'Autistic children recognise emotions in music with a relative advantage, while matching peers on faces and voices (Sivathasan et al., 2023) — so chord moods are a bridge to emotion vocabulary. Enhanced pitch discrimination and absolute pitch (5–11%) are documented strengths (Romani et al., 2021; Heaton et al., 2008).',
    fr: 'Les enfants autistes reconnaissent les émotions dans la musique avec un avantage relatif, tout en égalant leurs pairs pour les visages et les voix (Sivathasan et al., 2023) — les humeurs des accords servent de pont vers le vocabulaire émotionnel. La discrimination des hauteurs et l’oreille absolue (5 à 11 %) sont des forces documentées (Romani et al., 2021).',
  },
  start(api) {
    const D = api.data;
    const INT = [[1, { en: 'minor 2nd', fr: 'seconde mineure' }, { en: 'Jaws theme / Für Elise', fr: 'Les dents de la mer / Lettre à Élise' }], [2, { en: 'major 2nd', fr: 'seconde majeure' }, { en: 'Frère Jacques', fr: 'Frère Jacques' }], [3, { en: 'minor 3rd', fr: 'tierce mineure' }, { en: 'Greensleeves', fr: 'Greensleeves' }], [4, { en: 'major 3rd', fr: 'tierce majeure' }, { en: 'Oh When the Saints', fr: 'Oh When the Saints' }], [5, { en: 'perfect 4th', fr: 'quarte juste' }, { en: 'Here Comes the Bride', fr: 'La Marseillaise (« Allons »)' }], [6, { en: 'tritone', fr: 'triton' }, { en: 'The Simpsons theme', fr: 'Les Simpson' }], [7, { en: 'perfect 5th', fr: 'quinte juste' }, { en: 'Twinkle, Twinkle', fr: 'Ah ! vous dirai-je, maman' }], [8, { en: 'minor 6th', fr: 'sixte mineure' }, { en: 'The Entertainer (3rd→4th note)', fr: 'The Entertainer' }], [9, { en: 'major 6th', fr: 'sixte majeure' }, { en: 'My Bonnie Lies Over the Ocean', fr: 'My Bonnie' }], [12, { en: 'octave', fr: 'octave' }, { en: 'Somewhere Over the Rainbow', fr: 'Over the Rainbow' }]];
    const CH = [['maj', [0, 4, 7], { en: 'Major', fr: 'Majeur' }, { en: 'bright, happy', fr: 'lumineux, joyeux' }], ['min', [0, 3, 7], { en: 'Minor', fr: 'Mineur' }, { en: 'sad, serious', fr: 'triste, sérieux' }], ['dim', [0, 3, 6], { en: 'Diminished', fr: 'Diminué' }, { en: 'tense, spooky', fr: 'tendu, inquiétant' }], ['aug', [0, 4, 8], { en: 'Augmented', fr: 'Augmenté' }, { en: 'dreamy, unsettled', fr: 'rêveur, étrange' }], ['dom7', [0, 4, 7, 10], { en: 'Dominant 7th', fr: 'Septième de dominante' }, { en: 'bluesy, wants to resolve', fr: 'bluesy, veut se résoudre' }], ['maj7', [0, 4, 7, 11], { en: 'Major 7th', fr: 'Septième majeure' }, { en: 'soft, jazzy', fr: 'doux, jazzy' }], ['sus4', [0, 5, 7], { en: 'Suspended 4th', fr: 'Quarte suspendue' }, { en: 'open, waiting', fr: 'ouvert, en attente' }]];
    const menu = () => UI.menu(api, {
      options: [
        { icon: '🎯', name: { en: 'Perfect pitch · white keys', fr: 'Oreille absolue · touches blanches' }, desc: { en: 'C to B, no reference', fr: 'Do à si, sans référence' }, go: () => pitch(false) },
        { icon: '🎯', name: { en: 'Perfect pitch · all 12', fr: 'Oreille absolue · 12 notes' }, desc: { en: 'Includes sharps', fr: 'Avec les dièses' }, go: () => pitch(true) },
        { icon: '↕️', name: { en: 'Intervals', fr: 'Intervalles' }, desc: { en: 'With song mnemonics', fr: 'Avec des chansons repères' }, go: () => intervals() },
        { icon: '🎭', name: { en: 'Chord moods', fr: 'Humeurs des accords' }, desc: { en: 'Quality + emotion words', fr: 'Qualité + mots d’émotion' }, go: () => chords() },
        { icon: '🔁', name: { en: 'Melody echo', fr: 'Écho mélodique' }, desc: { en: 'How long can you go?', fr: 'Jusqu’où iras-tu ?' }, go: () => echo() },
      ],
      extra: h('div', { class: 'muted center' }, `${api.fr ? 'Meilleure série' : 'Best streak'}: ${D.streak || 0} · ${api.fr ? 'Écho record' : 'Echo record'}: ${D.echo || 0}`),
    });
    let streak = 0;
    const streakUp = ok => { if (ok) { streak++; if (streak > (D.streak || 0)) { D.streak = streak; api.save(); } if (streak >= 10) api.badge('ear'); } else streak = 0; };
    const round = (N, ask, onEnd) => {
      let qi = 0, score = 0, good = 0; streak = 0;
      const root = api.clear(); const wrap = h('div', { class: 'gwrap', style: { maxWidth: '980px' } }); root.appendChild(wrap);
      const hud = () => api.hud([[t('score'), score], [t('streak'), streak], ['#', `${Math.min(qi + 1, N)}/${N}`]]);
      const next = () => {
        if (qi >= N) return onEnd(score, good, N);
        wrap.innerHTML = '';
        ask(wrap, (ok, pts = 100) => { if (ok) { good++; score += pts + streak * 10; api.sfx('good'); } else api.sfx('bad'); streakUp(ok); hud(); }, () => { qi++; next(); });
        hud();
      };
      next();
    };
    const nextBtn = go => h('button', { class: 'btn primary', style: { marginTop: '10px' }, onclick: go }, t('next') + ' →');
    const pitch = all => round(12, (wrap, mark, next) => {
      let m; do { m = 60 + rand(12); } while (!all && Music.isBlack(m));
      let answered = false;
      const res = h('div');
      const kb = Music.keyboard({ from: 60, to: 71, label: null, onNote: x => { Sound.piano(x, 0.8, 0.28); if (answered) return; answered = true; const ok = x === m; mark(ok, 150); kb.flash(m, 'linear-gradient(180deg,#b8ffd3,#3ddc84)', 1500); res.appendChild(h('div', { class: 'fb ' + (ok ? 'good' : 'bad'), style: { marginTop: '10px' } }, `${ok ? '✅' : '❌'} ${Music.name(m, 'en')} / ${Music.name(m, 'fr')}`, h('div', null, nextBtn(next)))); } });
      wrap.append(h('div', { class: 'card center' }, h('div', { style: { fontSize: '60px' } }, '🎧'), h('div', { class: 'muted' }, api.fr ? 'Quelle note entends-tu ?' : 'Which note do you hear?'), h('button', { class: 'btn lg', style: { marginTop: '10px' }, onclick: () => Sound.piano(m, 1.4, 0.32) }, '🔊 ' + (api.fr ? 'Réécouter' : 'Replay'))), h('div', { style: { marginTop: '14px' } }, kb.el), res);
      api.after(300, () => Sound.piano(m, 1.4, 0.32));
    }, (score, good, N) => api.finish({ score, stars: UI.starsFor(good / N), xp: 6 + good * 2, lines: [`${good}/${N}`], again: () => pitch(all), menu }));
    const intervals = () => round(12, (wrap, mark, next) => {
      const [semi, name, song] = pick(INT), lo = 55 + rand(10), up2 = Math.random() < 0.75;
      const a = lo, b = up2 ? lo + semi : lo - semi;
      const playI = () => { Sound.piano(a, 0.9, 0.3); api.after(650, () => Sound.piano(b, 1.1, 0.3)); };
      const opts = shuffle([[semi, name], ...sample(INT.filter(x => x[0] !== semi), 3).map(x => [x[0], x[1]])]);
      const box = h('div', { class: 'choices' }), res = h('div');
      opts.forEach(([s2, n2]) => box.appendChild(h('button', { class: 'choice', style: { textAlign: 'center', fontWeight: 800 }, onclick: e => { [...box.children].forEach(x => x.disabled = true); const ok = s2 === semi; if (!ok) e.currentTarget.classList.add('wrong'); else e.currentTarget.classList.add('right'); mark(ok); res.appendChild(h('div', { class: 'fb ' + (ok ? 'good' : 'info'), style: { marginTop: '10px' } }, `${L(name)} (${semi} ${api.fr ? 'demi-tons' : 'semitones'}) ${up2 ? '↗' : '↘'} — 🎵 ${L(song)}`, h('div', null, nextBtn(next)))); } }, L(n2))));
      wrap.append(h('div', { class: 'card center' }, h('div', { style: { fontSize: '54px' } }, '↕️'), h('div', { class: 'muted' }, api.fr ? 'Quel intervalle entends-tu ?' : 'Which interval do you hear?'), h('button', { class: 'btn lg', style: { marginTop: '10px' }, onclick: playI }, '🔊 ' + (api.fr ? 'Réécouter' : 'Replay'))), h('div', { style: { marginTop: '14px' } }, box), res);
      api.after(300, playI);
    }, (score, good, N) => api.finish({ score, stars: UI.starsFor(good / N), xp: 6 + good * 2, lines: [`${good}/${N}`], again: intervals, menu }));
    const chords = () => round(10, (wrap, mark, next) => {
      const [id, iv, name, mood] = pick(CH), root0 = 55 + rand(8);
      const playC = () => { Sound.chord(iv.map(x => root0 + x), 1.8, 0.2, 0.03); };
      const moods = shuffle([mood, ...sample(CH.filter(c => c[0] !== id), 3).map(c => c[3])]);
      const names = shuffle([name, ...sample(CH.filter(c => c[0] !== id), 3).map(c => c[2])]);
      let pickN = null, pickM = null; const res = h('div');
      const b1 = h('div', { class: 'row', style: { justifyContent: 'center' } }), b2 = h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '8px' } });
      const done = () => { if (!pickN || !pickM) return; [...b1.children, ...b2.children].forEach(x => x.disabled = true); const ok1 = pickN === name, ok2 = pickM === mood; mark(ok1 && ok2, ok1 && ok2 ? 150 : 0); if (!(ok1 && ok2) && (ok1 || ok2)) api.sfx('pop'); res.appendChild(h('div', { class: 'fb ' + (ok1 && ok2 ? 'good' : 'info'), style: { marginTop: '10px' } }, `${L(name)} — ${L(mood)}`, h('div', null, nextBtn(next)))); };
      names.forEach(n2 => b1.appendChild(h('button', { class: 'btn', onclick: e => { pickN = n2; [...b1.children].forEach(x => x.classList.remove('on')); e.currentTarget.classList.add('on'); done(); } }, L(n2))));
      moods.forEach(m2 => b2.appendChild(h('button', { class: 'btn', onclick: e => { pickM = m2; [...b2.children].forEach(x => x.classList.remove('on')); e.currentTarget.classList.add('on'); done(); } }, '💭 ' + L(m2))));
      wrap.append(h('div', { class: 'card center' }, h('div', { style: { fontSize: '54px' } }, '🎭'), h('div', { class: 'muted' }, api.fr ? 'Quel accord ? Quelle humeur ?' : 'Which chord? Which mood?'), h('button', { class: 'btn lg', style: { marginTop: '10px' }, onclick: playC }, '🔊 ' + (api.fr ? 'Réécouter' : 'Replay'))),
        h('div', { class: 'muted center', style: { marginTop: '12px' } }, api.fr ? 'Qualité :' : 'Quality:'), b1, h('div', { class: 'muted center', style: { marginTop: '10px' } }, api.fr ? 'Émotion :' : 'Emotion:'), b2, res);
      api.after(300, playC);
    }, (score, good, N) => api.finish({ score, stars: UI.starsFor(good / N), xp: 6 + good * 3, lines: [`${good}/${N}`], again: chords, menu }));
    const echo = () => {
      const PENTA = [60, 62, 64, 67, 69, 72], COLS = ['#ff4f7b', '#ffc545', '#9dff5b', '#37e2ff', '#9b7bff', '#ff4fd8'];
      let seq = [], pos = 0, listening = false, best = 0;
      const root = api.clear();
      const msg = h('div', { class: 'center', style: { fontSize: '22px', fontWeight: 800, minHeight: '34px' } });
      const pads = PENTA.map((m, i) => h('button', { style: { width: '120px', height: '120px', borderRadius: '24px', border: '0', background: COLS[i], opacity: .55, fontSize: '22px', fontWeight: 900, color: '#0b1020', whiteSpace: 'pre-line', transition: 'opacity .1s, transform .1s' }, onclick: () => press(i) }, `${Music.name(m, 'en')}\n${Music.name(m, 'fr')}`));
      root.appendChild(h('div', { class: 'gwrap center', style: { maxWidth: '760px' } }, msg, h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,120px)', gap: '14px', justifyContent: 'center', marginTop: '14px' } }, pads), h('div', { style: { marginTop: '16px' } }, h('button', { class: 'btn', onclick: menu }, t('menu')))));
      const light = i => { pads[i].style.opacity = 1; pads[i].style.transform = 'scale(1.06)'; Sound.piano(PENTA[i], 0.6, 0.3); setTimeout(() => { pads[i].style.opacity = .55; pads[i].style.transform = ''; }, 320); };
      const playSeq = () => { listening = false; msg.textContent = api.fr ? '🎧 Écoute…' : '🎧 Listen…'; seq.forEach((i, k) => api.after(500 + k * 520, () => light(i))); api.after(500 + seq.length * 520, () => { listening = true; pos = 0; msg.textContent = api.fr ? '🎹 À toi !' : '🎹 Your turn!'; }); };
      const grow = () => { seq.push(rand(PENTA.length)); api.hud([[api.fr ? 'Longueur' : 'Length', seq.length], [t('best'), D.echo || 0]]); playSeq(); };
      const press = i => {
        if (!listening) return; light(i);
        if (i !== seq[pos]) { listening = false; api.sfx('lose'); best = seq.length - 1; if (best > (D.echo || 0)) { D.echo = best; api.save(); } api.after(600, () => api.finish({ score: best * 50, stars: best >= 10 ? 3 : best >= 7 ? 2 : best >= 4 ? 1 : 0, xp: 5 + best * 2, lines: [`${api.fr ? 'Mélodie la plus longue' : 'Longest melody'}: ${best}`], again: echo, menu })); return; }
        pos++;
        if (pos >= seq.length) { listening = false; msg.textContent = '✅'; api.after(600, grow); }
      };
      grow();
    };
    menu();
  },
});
