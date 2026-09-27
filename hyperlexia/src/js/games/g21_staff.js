'use strict';
registerGame({
  id: 'staff', n: 21, cat: 'music', colors: ['#ffffff', '#9b7bff'],
  glyph: `<g stroke="#fff" stroke-width="2.5">${[30, 40, 50, 60, 70].map(y => `<line x1="12" x2="88" y1="${y}" y2="${y}"/>`).join('')}</g>
    <ellipse cx="34" cy="65" rx="6" ry="4.5" transform="rotate(-20 34 65)"/><ellipse cx="52" cy="55" rx="6" ry="4.5" transform="rotate(-20 52 55)"/><ellipse cx="70" cy="45" rx="6" ry="4.5" transform="rotate(-20 70 45)"/>
    <text x="50" y="92" font-size="13" text-anchor="middle" fill="#fff">CAFE</text>`,
  name: { en: 'Staff Speller', fr: 'Portée magique' },
  tag: { en: 'Notes on the staff spell secret words. Learn letters ↔ solfège too.', fr: 'Les notes sur la portée épellent des mots secrets. Lettres ↔ solfège !' },
  how: {
    en: '<p><b>Word staff</b>: each note is a letter (A–G). Read them and type the word — then hear it played. <b>Note sprint</b>: name notes as fast as you can by clicking the keyboard. <b>Letters ↔ solfège</b>: English musicians say C D E F G A B, French musicians say do ré mi fa sol la si — master both. Bass-clef mode for experts.</p>',
    fr: '<p><b>Mots sur la portée</b> : chaque note est une lettre (A–G). Lis-les et tape le mot — puis écoute-le. <b>Sprint de notes</b> : nomme les notes le plus vite possible en cliquant le clavier. <b>Lettres ↔ solfège</b> : les anglophones disent C D E F G A B, les francophones do ré mi fa sol la si — maîtrise les deux. Clé de fa pour experts.</p>',
  },
  why: {
    en: 'Staff notation is a second orthography that maps symbols to pitches — the same kind of structure veridical mapping links to hyperlexia and absolute pitch (Mottron et al., 2013; Bouvet et al., 2014). Absolute pitch occurs in 5–11% of autistic people (Romani et al., 2021), so music reading can be a real strength.',
    fr: 'La portée est une deuxième orthographe qui relie des symboles à des hauteurs — le même genre de structure que la correspondance véridique relie à l’hyperlexie et à l’oreille absolue (Mottron et al., 2013; Bouvet et al., 2014). L’oreille absolue touche 5 à 11 % des personnes autistes (Romani et al., 2021).',
  },
  start(api) {
    const WORDS = api.fr ? ['CAFE', 'BEBE', 'FADE', 'FACADE', 'DECADE', 'BAGAGE', 'DECEDE', 'CEDE', 'BAC', 'BEC', 'FEE', 'ABBE', 'BABA', 'GAFFE', 'AGACE', 'DEGAGE', 'EFFACE', 'CAGE', 'AGE', 'DECA']
      : ['CAB', 'BAG', 'BED', 'BEAD', 'CAFE', 'FACE', 'FADE', 'DEAF', 'DEED', 'FEED', 'BEEF', 'BADGE', 'CAGE', 'AGED', 'EGG', 'EBB', 'ACE', 'ADD', 'AGE', 'BEE', 'DAD', 'CABBAGE', 'BAGGAGE', 'FACADE', 'DECADE', 'ACCEDE', 'EFFACE', 'DEFACE', 'BEADED', 'FACED', 'FADED'];
    const DISPLAY = { CAFE: 'CAFÉ', BEBE: 'BÉBÉ', FACADE: api.fr ? 'FAÇADE' : 'FACADE', DECADE: api.fr ? 'DÉCADE' : 'DECADE', DECEDE: 'DÉCÉDÉ', CEDE: 'CÉDÉ', FEE: 'FÉE', ABBE: 'ABBÉ', AGACE: 'AGACÉ', DEGAGE: 'DÉGAGÉ', EFFACE: api.fr ? 'EFFACÉ' : 'EFFACE', AGE: api.fr ? 'ÂGE' : 'AGE', DECA: 'DÉCA' };
    const LET = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const toMidi = (word, clef) => { const lo = clef === 'treble' ? 62 : 43, hi = clef === 'treble' ? 79 : 60; return word.split('').map(ch => { const opts = []; for (let m = lo; m <= hi; m++) if (m % 12 === LET[ch]) opts.push(m); return pick(opts); }); };
    const nm = m => api.fr ? Music.name(m, 'fr') : Music.name(m, 'en');
    const menu = () => UI.menu(api, {
      options: [
        { icon: '🎼', name: { en: 'Word staff (treble)', fr: 'Mots sur la portée (clé de sol)' }, desc: { en: '10 hidden words', fr: '10 mots cachés' }, go: () => words('treble') },
        { icon: '𝄢', name: { en: 'Word staff (bass clef)', fr: 'Mots sur la portée (clé de fa)' }, desc: { en: 'Expert reading', fr: 'Lecture experte' }, go: () => words('bass') },
        { icon: '⚡', name: { en: 'Note sprint', fr: 'Sprint de notes' }, desc: { en: '60 seconds, click the key', fr: '60 secondes, clique la touche' }, go: () => sprint() },
        { icon: '🔁', name: { en: 'Letters ↔ solfège', fr: 'Lettres ↔ solfège' }, desc: { en: 'C = do, D = ré…', fr: 'do = C, ré = D…' }, go: () => solf() },
      ],
    });
    const words = clef => {
      const list = sample(WORDS, 10); let qi = 0, score = 0, good = 0;
      const root = api.clear(); const wrap = h('div', { class: 'gwrap', style: { maxWidth: '900px' } }); root.appendChild(wrap);
      const next = () => {
        if (qi >= list.length) return api.finish({ score, stars: UI.starsFor(good / list.length), xp: 10 + good * 2, lines: [`${good}/${list.length}`], again: () => words(clef), menu });
        const w = list[qi], ms = toMidi(w, clef); let tries = 0;
        wrap.innerHTML = '';
        const staff = h('div', { class: 'center', html: Music.staffSVG(ms, { clef }) });
        const inp = h('input', { class: 'field mono', style: { fontSize: '30px', width: '260px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '6px' }, maxlength: w.length });
        const res = h('div');
        const play = () => ms.forEach((m, i) => api.after(i * 320, () => { Sound.piano(m, 0.9, 0.3); staff.innerHTML = Music.staffSVG(ms, { clef, hl: i }); api.after(300, () => staff.innerHTML = Music.staffSVG(ms, { clef, hl: -1, labels: res.childElementCount ? w.split('') : null })); }));
        const go = () => {
          if (inp.disabled) return;
          const v = norm(inp.value).toUpperCase(); tries++;
          if (v === w) { inp.disabled = true; good++; score += tries === 1 ? 120 : 60; api.sfx('good'); api.xp(3, inp); res.appendChild(h('div', { class: 'fb good', style: { marginTop: '10px' } }, `🎵 ${DISPLAY[w] || w}`, h('div', null, h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: () => { qi++; next(); } }, t('next') + ' →')))); staff.innerHTML = Music.staffSVG(ms, { clef, labels: w.split('') }); api.after(300, play); }
          else if (tries >= 3) { inp.disabled = true; api.sfx('bad'); res.appendChild(h('div', { class: 'fb bad', style: { marginTop: '10px' } }, `${DISPLAY[w] || w}`, h('div', null, h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: () => { qi++; next(); } }, t('next') + ' →')))); staff.innerHTML = Music.staffSVG(ms, { clef, labels: w.split('') }); }
          else { api.sfx('bad'); inp.classList.add('shake'); setTimeout(() => inp.classList.remove('shake'), 400); }
          api.hud([[t('score'), score], ['✔', `${good}/${list.length}`]]);
        };
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
        wrap.append(h('div', { class: 'muted center' }, `${qi + 1}/${list.length} — ${api.fr ? 'Quel mot ces notes épellent-elles ? (lettres A à G)' : 'What word do these notes spell? (letters A–G)'}`), staff,
          h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '12px' } }, inp, h('button', { class: 'btn primary', onclick: go }, t('submit')), h('button', { class: 'btn', onclick: play }, '🔊')),
          h('div', { class: 'center muted', style: { marginTop: '6px', fontSize: '13px' } }, clef === 'treble' ? (api.fr ? 'Clé de sol : lignes E G B D F (mi sol si ré fa), interlignes F A C E (fa la do mi).' : 'Treble clef: lines E G B D F, spaces F A C E.') : (api.fr ? 'Clé de fa : lignes G B D F A (sol si ré fa la), interlignes A C E G (la do mi sol).' : 'Bass clef: lines G B D F A, spaces A C E G.')), res);
        setTimeout(() => inp.focus(), 30); api.hud([[t('score'), score], ['✔', `${good}/${list.length}`]]);
      };
      next();
    };
    const sprint = () => {
      let score = 0, good = 0, bad = 0, left = api.relaxed ? 9999 : 60, target, over = false, streak = 0;
      const root = api.clear();
      const staff = h('div', { class: 'center' });
      const lab = h('div', { class: 'center', style: { fontSize: '20px', minHeight: '30px', fontWeight: 800 } });
      const kb = Music.keyboard({ from: 60, to: 84, label: null, onNote: m => { if (over) return; Sound.piano(m, 0.8, 0.3); judge(m); } });
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: '980px' } }, staff, lab, h('div', { style: { marginTop: '12px' } }, kb.el),
        h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '10px' } }, h('button', { class: 'btn', onclick: () => end() }, '🏁 ' + t('done')))));
      const nextT = () => { let m; do { m = 62 + rand(18); } while (Music.isBlack(m) || m === target); target = m; staff.innerHTML = Music.staffSVG([m], { w: 260 }); };
      const judge = m => {
        if (m % 12 === target % 12 && Math.abs(m - target) <= 12) { good++; streak++; score += 20 + streak * 2; lab.textContent = `✅ ${nm(target)}`; lab.style.color = 'var(--good)'; if (m !== target) score -= 5; nextT(); }
        else { bad++; streak = 0; lab.textContent = `❌ ${nm(m)} ≠ ?`; lab.style.color = 'var(--bad)'; api.sfx('bad'); }
        hud();
      };
      const hud = () => api.hud([[t('score'), score], ['✔', good], ['✖', bad], [t('time'), api.relaxed ? '∞' : left + 's']]);
      const end = () => { if (over) return; over = true; api.finish({ score, stars: good >= 40 ? 3 : good >= 25 ? 2 : good >= 10 ? 1 : 0, xp: 5 + good, lines: [`${good} ${api.fr ? 'notes' : 'notes'} · ${bad} ${api.fr ? 'erreurs' : 'misses'}`], again: sprint, menu }); };
      if (!api.relaxed) api.every(1000, () => { if (over) return; left--; hud(); if (left <= 0) end(); });
      nextT(); hud();
    };
    const solf = () => {
      let qi = 0, score = 0, good = 0; const N = 16;
      const root = api.clear(); const wrap = h('div', { class: 'gwrap', style: { maxWidth: '820px' } }); root.appendChild(wrap);
      const letters = Object.keys(Music.LETTER_TO_SOLF);
      const next = () => {
        if (qi >= N) return api.finish({ score, stars: UI.starsFor(good / N), xp: 6 + good, lines: [`${good}/${N}`], again: solf, menu });
        const L2 = pick(letters), toS = Math.random() < 0.5;
        const ask = toS ? L2 : Music.LETTER_TO_SOLF[L2], correct = toS ? Music.LETTER_TO_SOLF[L2] : L2;
        const opts = shuffle(toS ? Object.values(Music.LETTER_TO_SOLF) : letters);
        wrap.innerHTML = '';
        const box = h('div', { class: 'row', style: { justifyContent: 'center', gap: '8px', marginTop: '16px' } });
        opts.forEach(o => box.appendChild(h('button', { class: 'btn lg', style: { minWidth: '76px' }, onclick: e => { [...box.children].forEach(b => b.disabled = true); const ok = o === correct; if (ok) { good++; score += 60; api.sfx('good'); } else { api.sfx('bad'); e.currentTarget.classList.add('bad'); } Sound.piano(60 + LET[L2], 1, 0.3); api.after(ok ? 450 : 1100, () => { qi++; next(); }); api.hud([[t('score'), score], ['✔', `${good}/${N}`]]); } }, o)));
        wrap.append(h('div', { class: 'card center fadein' }, h('div', { class: 'muted' }, toS ? (api.fr ? 'Lettre anglaise → solfège ?' : 'Letter name → solfège?') : (api.fr ? 'Solfège → lettre anglaise ?' : 'Solfège → letter name?')), h('div', { style: { fontSize: '84px', fontWeight: 900 } }, ask), h('div', { html: Music.staffSVG([60 + LET[L2]], { w: 220 }) })), box);
        api.hud([[t('score'), score], ['✔', `${good}/${N}`]]);
      };
      next();
    };
    menu();
  },
});
