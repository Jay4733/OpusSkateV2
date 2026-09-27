'use strict';
registerGame({
  id: 'signals', n: 20, cat: 'numbers', colors: ['#ff8f3d', '#1f6fff'],
  glyph: `<g>${[[20, 30, 8], [34, 30, 20], [60, 30, 8]].map(([x, y, w]) => `<rect x="${x}" y="${y - 4}" width="${w}" height="8" rx="4"/>`).join('')}</g>
    ${[[24, 52], [32, 52], [24, 60], [32, 68]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5"/>`).join('')}<circle cx="32" cy="60" r="3.5" fill-opacity=".3"/><circle cx="24" cy="68" r="3.5" fill-opacity=".3"/>
    <text x="64" y="68" font-size="22" text-anchor="middle">Ω</text><text x="50" y="88" font-size="10" text-anchor="middle">01000001</text>`,
  name: { en: 'Signal Decoder', fr: 'Décodeur de signaux' },
  tag: { en: 'Master Morse, Braille, NATO, Greek and binary — five new ways to write.', fr: 'Maîtrise le morse, le braille, l’OTAN, le grec et le binaire — cinq nouvelles écritures.' },
  how: {
    en: '<p>Pick a system. <b>Chart</b>: learn it (Morse letters beep when clicked). <b>Drill</b>: 15 quick matches against the clock. <b>Decode</b>: translate hidden words. <b>Morse tap</b>: key letters with the spacebar or the big button — short press = dot, long press = dash.</p>',
    fr: '<p>Choisis un système. <b>Tableau</b> : apprends-le (les lettres morse sonnent). <b>Entraînement</b> : 15 associations rapides. <b>Décoder</b> : traduis des mots cachés. <b>Morse au doigt</b> : tape les lettres avec la barre d’espace ou le gros bouton — court = point, long = trait.</p>',
  },
  why: {
    en: 'Hyperlexic reading has been documented across many scripts — Chinese and Japanese characters, Kannada, Spanish, Catalan (Ichiba, 1990; Luo & Su, 2023; Rosselló et al., 2025). New writing systems feed the fascination with symbols while training attention, memory and — with Morse — listening.',
    fr: 'La lecture hyperlexique a été observée dans de nombreuses écritures — caractères chinois et japonais, kannada, espagnol, catalan (Ichiba, 1990; Luo et Su, 2023; Rosselló et al., 2025). Les nouveaux systèmes nourrissent la fascination pour les symboles tout en entraînant l’attention, la mémoire et — avec le morse — l’écoute.',
  },
  start(api) {
    const MORSE = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..' };
    const BR = { A: '1', B: '12', C: '14', D: '145', E: '15', F: '124', G: '1245', H: '125', I: '24', J: '245' };
    'KLMNOPQRST'.split('').forEach((c, i) => BR[c] = BR['ABCDEFGHIJ'[i]] + '3');
    'UVXYZ'.split('').forEach((c, i) => BR[c] = BR['ABCDE'[i]] + '36'); BR.W = '2456';
    const NATO = { A: 'Alfa', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliett', K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango', U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu' };
    const GREEK = [['Α', 'α', 'alpha'], ['Β', 'β', 'beta'], ['Γ', 'γ', 'gamma'], ['Δ', 'δ', 'delta'], ['Ε', 'ε', 'epsilon'], ['Ζ', 'ζ', 'zeta'], ['Η', 'η', 'eta'], ['Θ', 'θ', 'theta'], ['Ι', 'ι', 'iota'], ['Κ', 'κ', 'kappa'], ['Λ', 'λ', 'lambda'], ['Μ', 'μ', 'mu'], ['Ν', 'ν', 'nu'], ['Ξ', 'ξ', 'xi'], ['Ο', 'ο', 'omicron'], ['Π', 'π', 'pi'], ['Ρ', 'ρ', 'rho'], ['Σ', 'σ', 'sigma'], ['Τ', 'τ', 'tau'], ['Υ', 'υ', 'upsilon'], ['Φ', 'φ', 'phi'], ['Χ', 'χ', 'chi'], ['Ψ', 'ψ', 'psi'], ['Ω', 'ω', 'omega']];
    const GWORDS = [['ΚΟΣΜΟΣ', 'kosmos', { en: 'order, universe', fr: 'ordre, univers' }], ['ΛΟΓΟΣ', 'logos', { en: 'word, reason', fr: 'parole, raison' }], ['ΦΩΣ', 'phos', { en: 'light', fr: 'lumière' }], ['ΧΡΟΝΟΣ', 'chronos', { en: 'time', fr: 'temps' }], ['ΨΥΧΗ', 'psyche', { en: 'mind, soul', fr: 'esprit, âme' }],
      ['ΗΛΙΟΣ', 'helios', { en: 'sun', fr: 'soleil' }], ['ΑΡΜΟΝΙΑ', 'harmonia', { en: 'harmony', fr: 'harmonie' }], ['ΡΥΘΜΟΣ', 'rhythmos', { en: 'rhythm', fr: 'rythme' }], ['ΑΣΤΗΡ', 'aster', { en: 'star', fr: 'étoile' }], ['ΘΕΑΤΡΟΝ', 'theatron', { en: 'theatre', fr: 'théâtre' }], ['ΜΑΘΗΜΑ', 'mathema', { en: 'lesson, learning', fr: 'leçon, savoir' }], ['ΓΕΩΓΡΑΦΙΑ', 'geographia', { en: 'earth-writing (geography)', fr: 'écriture de la terre (géographie)' }]];
    const bin = c => c.charCodeAt(0).toString(2).padStart(8, '0');
    const brSVG = (code, s = 46) => { const pos = { 1: [0, 0], 2: [0, 1], 3: [0, 2], 4: [1, 0], 5: [1, 1], 6: [1, 2] }; let o = ''; for (let k = 1; k <= 6; k++) { const [c, r] = pos[k]; o += `<circle cx="${12 + c * 20}" cy="${10 + r * 20}" r="7" fill="${code.includes(String(k)) ? '#ffc545' : 'rgba(255,255,255,.12)'}"/>`; } return `<svg viewBox="0 0 44 64" width="${s * 0.7}" height="${s}">${o}</svg>`; };
    const beep = (code, when0 = 0) => { let tt = when0; const u = 0.08; for (const ch of code) { Sound.tone(660, ch === '.' ? u : u * 3, 'sine', 0.18, tt); tt += (ch === '.' ? u : u * 3) + u; } return tt + u * 2; };
    const playWord = w => { let tt = 0; for (const c of w) { if (MORSE[c]) tt = beep(MORSE[c], tt); } };
    const SYS = {
      morse: { name: { en: 'Morse code', fr: 'Code morse' }, icon: '📡', show: c => h('span', { class: 'mono', style: { fontSize: '26px', letterSpacing: '4px' } }, MORSE[c].replace(/\./g, '•').replace(/-/g, '—')) },
      braille: { name: { en: 'Braille', fr: 'Braille' }, icon: '⠃', show: c => h('span', { html: brSVG(BR[c]) }) },
      nato: { name: { en: 'NATO alphabet', fr: 'Alphabet OTAN' }, icon: '🎙️', show: c => h('span', { style: { fontSize: '22px', fontWeight: 800 } }, NATO[c]) },
      greek: { name: { en: 'Greek alphabet', fr: 'Alphabet grec' }, icon: 'Ω', show: null },
      binary: { name: { en: 'Binary (ASCII)', fr: 'Binaire (ASCII)' }, icon: '💻', show: c => h('span', { class: 'mono', style: { fontSize: '22px' } }, bin(c)) },
    };
    const menu = () => UI.menu(api, {
      options: [
        ...Object.entries(SYS).map(([k, s]) => ({ icon: s.icon, name: s.name, desc: { en: 'Chart · drill · decode', fr: 'Tableau · entraînement · décodage' }, go: () => sysMenu(k) })),
        { icon: '👆', name: { en: 'Morse tap', fr: 'Morse au doigt' }, desc: { en: 'Key letters with your spacebar', fr: 'Tape avec la barre d’espace' }, go: () => tap() },
      ],
    });
    const sysMenu = k => UI.menu(api, { title: L(SYS[k].name), options: [
      { icon: '📋', name: { en: 'Chart', fr: 'Tableau' }, desc: { en: 'Learn the system', fr: 'Apprends le système' }, go: () => chart(k) },
      { icon: '⏱️', name: { en: 'Drill (15)', fr: 'Entraînement (15)' }, desc: { en: 'Fast matching', fr: 'Associations rapides' }, go: () => drill(k) },
      { icon: '🔓', name: { en: 'Decode words', fr: 'Décoder des mots' }, desc: { en: 'Translate hidden words', fr: 'Traduis des mots cachés' }, go: () => decode(k) },
      { icon: '←', name: { en: 'Back', fr: 'Retour' }, go: menu }] });
    const chart = k => {
      const root = api.clear();
      const grid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: '8px' } });
      if (k === 'greek') GREEK.forEach(([U, l, n]) => grid.appendChild(h('div', { class: 'panel center' }, h('div', { style: { fontSize: '34px', fontWeight: 900 } }, `${U} ${l}`), h('div', { class: 'muted' }, n))));
      else Object.keys(MORSE).forEach(c => grid.appendChild(h('button', { class: 'panel center', style: { cursor: 'pointer' }, onclick: () => { if (k === 'morse') beep(MORSE[c]); else api.sfx('click'); } }, h('div', { style: { fontSize: '26px', fontWeight: 900 } }, c), SYS[k].show(c))));
      root.appendChild(h('div', { class: 'gwrap' }, h('div', { class: 'row' }, h('div', { class: 'gtitle' }, L(SYS[k].name)), h('span', { class: 'spacer' }), h('button', { class: 'btn', onclick: () => sysMenu(k) }, t('back'))),
        k === 'braille' ? h('p', { class: 'muted' }, api.fr ? 'Louis Braille a inventé ce système à 15 ans, en 1824. Les lettres K–T ajoutent le point 3 aux lettres A–J.' : 'Louis Braille invented this system at 15, in 1824. Letters K–T add dot 3 to letters A–J.') : null,
        k === 'nato' ? h('p', { class: 'muted' }, api.fr ? 'Utilisé par les pilotes et les radios du monde entier — oui, Q se dit « Quebec » !' : 'Used by pilots and radio operators worldwide — yes, Q is “Quebec”!') : null, grid));
    };
    const drill = k => {
      let qi = 0, score = 0, good = 0; const N = 15, t0 = Date.now();
      const root = api.clear(); const wrap = h('div', { class: 'gwrap', style: { maxWidth: '820px' } }); root.appendChild(wrap);
      const next = () => {
        if (qi >= N) { const secs = (Date.now() - t0) / 1000; return api.finish({ score: score + (api.relaxed ? 0 : Math.max(0, Math.round(150 - secs) * 2)), stars: good === N ? 3 : good >= 11 ? 2 : good >= 6 ? 1 : 0, xp: 6 + good, lines: [`${good}/${N} · ${Math.round(secs)} s`], again: () => drill(k), menu: () => sysMenu(k) }); }
        wrap.innerHTML = '';
        let prompt, opts, correct, render;
        if (k === 'greek') { const g = pick(GREEK); prompt = h('div', { style: { fontSize: '80px', fontWeight: 900 } }, `${g[0]} ${g[1]}`); correct = g[2]; opts = shuffle([g[2], ...sample(GREEK.filter(x => x !== g), 3).map(x => x[2])]); render = o => o; }
        else { const c = pick(Object.keys(MORSE)); const toCode = Math.random() < 0.5; if (toCode) { prompt = h('div', { style: { fontSize: '80px', fontWeight: 900 } }, c); correct = c; opts = shuffle([c, ...sample(Object.keys(MORSE).filter(x => x !== c), 3)]); render = o => SYS[k].show(o); } else { prompt = SYS[k].show(c); correct = c; opts = shuffle([c, ...sample(Object.keys(MORSE).filter(x => x !== c), 3)]); render = o => o; if (k === 'morse') beep(MORSE[c]); } }
        const box = h('div', { class: 'choices', style: { gridTemplateColumns: 'repeat(2,1fr)' } });
        opts.forEach(o => { const b = h('button', { class: 'choice', style: { textAlign: 'center', minHeight: '76px', fontSize: '22px', fontWeight: 800 }, onclick: () => { const ok = o === correct; if (ok) { good++; score += 50; api.sfx('good'); } else { api.sfx('bad'); b.classList.add('wrong'); } [...box.children].forEach(x => x.disabled = true); api.after(ok ? 250 : 800, () => { qi++; next(); }); api.hud([[t('score'), score], ['✔', `${good}/${N}`], ['#', `${qi + 1}/${N}`]]); } }); const r = render(o); b.append(r instanceof Node ? r : document.createTextNode(r)); box.appendChild(b); });
        wrap.append(h('div', { class: 'card center fadein' }, prompt), h('div', { style: { marginTop: '14px' } }, box));
        api.hud([[t('score'), score], ['✔', `${good}/${N}`], ['#', `${qi + 1}/${N}`]]);
      };
      next();
    };
    const decode = k => {
      let qi = 0, score = 0, good = 0; const N = 6;
      const words = Lex.get(api.lang).gloss.map(g => norm(g.w).toUpperCase()).filter(w => /^[A-Z]{3,6}$/.test(w));
      const root = api.clear(); const wrap = h('div', { class: 'gwrap', style: { maxWidth: '900px' } }); root.appendChild(wrap);
      const next = () => {
        if (qi >= N) return api.finish({ score, stars: UI.starsFor(good / N), xp: 6 + good * 3, lines: [`${good}/${N}`], again: () => decode(k), menu: () => sysMenu(k) });
        wrap.innerHTML = '';
        const res = h('div');
        if (k === 'greek') {
          const g = pick(GWORDS); const opts = shuffle([g, ...sample(GWORDS.filter(x => x !== g), 3)]);
          const box = h('div', { class: 'choices' });
          opts.forEach(o => box.appendChild(h('button', { class: 'choice', onclick: e => { [...box.children].forEach(b => b.disabled = true); const ok = o === g; if (ok) { good++; score += 100; api.sfx('good'); } else { e.currentTarget.classList.add('wrong'); api.sfx('bad'); } res.appendChild(h('div', { class: 'fb ' + (ok ? 'good' : 'info'), style: { marginTop: '10px' } }, `${g[0]} = ${g[1]} = ${L(g[2])}`, h('div', null, h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: () => { qi++; next(); } }, t('next') + ' →')))); } }, L(o[2]))));
          wrap.append(h('div', { class: 'card center fadein' }, h('div', { class: 'muted' }, api.fr ? 'Que veut dire ce mot grec ancien ?' : 'What does this Ancient Greek word mean?'), h('div', { style: { fontSize: '54px', fontWeight: 900, letterSpacing: '.08em', margin: '14px 0' } }, g[0]), h('div', { class: 'muted' }, api.fr ? 'Astuce : translittère lettre par lettre.' : 'Tip: transliterate letter by letter.')), box, res);
        } else {
          const w = pick(words);
          const code = h('div', { class: 'row', style: { justifyContent: 'center', gap: '14px', margin: '14px 0' } }, w.split('').map(c => h('div', { class: 'panel center', style: { padding: '10px 12px' } }, SYS[k].show(c))));
          const inp = h('input', { class: 'field mono', style: { fontSize: '26px', width: '220px', textAlign: 'center', textTransform: 'uppercase' } });
          const go = () => { if (inp.disabled) return; inp.disabled = true; const ok = norm(inp.value).toUpperCase() === w; if (ok) { good++; score += 100 + w.length * 10; api.sfx('good'); } else api.sfx('bad'); const d = Lex.define(w, api.lang); res.appendChild(h('div', { class: 'fb ' + (ok ? 'good' : 'bad'), style: { marginTop: '10px' } }, `${ok ? '✅' : '❌'} ${w}${d ? ' — ' + d.d : ''}`, h('div', null, h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: () => { qi++; next(); } }, t('next') + ' →')))); };
          inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
          wrap.append(h('div', { class: 'card center fadein' }, h('div', { class: 'muted' }, api.fr ? 'Décode le mot :' : 'Decode the word:'), code,
            k === 'morse' ? h('button', { class: 'btn', onclick: () => playWord(w) }, '🔊 ' + (api.fr ? 'Écouter' : 'Listen')) : null,
            h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '10px' } }, inp, h('button', { class: 'btn primary', onclick: go }, t('submit')))), res);
          setTimeout(() => inp.focus(), 30);
        }
        api.hud([[t('score'), score], ['✔', `${good}/${N}`], ['#', `${qi + 1}/${N}`]]);
      };
      next();
    };
    const tap = () => {
      let target = pick(Object.keys(MORSE)), keyed = '', down = 0, score = 0, streak = 0, gapT = null, osc = null;
      const root = api.clear();
      const tgt = h('div', { style: { fontSize: '90px', fontWeight: 900 } });
      const hintEl = h('div', { class: 'mono muted', style: { fontSize: '22px', minHeight: '30px' } });
      const cur = h('div', { class: 'mono', style: { fontSize: '40px', minHeight: '54px', color: 'var(--amber)', letterSpacing: '6px' } });
      const key = h('button', { style: { width: '180px', height: '180px', borderRadius: '50%', border: '6px solid #ffc545', background: 'radial-gradient(circle at 35% 30%,#ffe08a,#ff8f3d)', boxShadow: '0 12px 30px rgba(0,0,0,.5)', fontSize: '22px', fontWeight: 900, color: '#3a1800', touchAction: 'none' } }, 'TAP');
      let showHint = true;
      root.appendChild(h('div', { class: 'gwrap center', style: { maxWidth: '700px' } }, h('div', { class: 'muted' }, api.fr ? 'Tape cette lettre en morse (court = •, long = —) :' : 'Key this letter in Morse (short = •, long = —):'), tgt, hintEl, cur, key,
        h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '14px' } }, h('button', { class: 'btn sm', onclick: e => { showHint = !showHint; paint(); } }, api.fr ? 'Afficher/masquer le code' : 'Show/hide code'), h('button', { class: 'btn sm', onclick: menu }, t('menu'))),
        h('p', { class: 'muted' }, api.fr ? 'Barre d’espace ou gros bouton. Une pause de 0,8 s valide la lettre.' : 'Spacebar or the big button. Pause 0.8 s to submit the letter.')));
      const paint = () => { tgt.textContent = target; hintEl.textContent = showHint ? MORSE[target].replace(/\./g, '•').replace(/-/g, '—') : '?'; cur.textContent = keyed.replace(/\./g, '•').replace(/-/g, '—'); api.hud([[t('score'), score], [t('streak'), streak]]); };
      const start = () => { if (down) return; down = performance.now(); clearTimeout(gapT); Sound.init(); if (Store.s.sound && Sound.ctx) { osc = Sound.ctx.createOscillator(); const g = Sound.ctx.createGain(); g.gain.value = 0.15; osc.frequency.value = 660; osc.connect(g); g.connect(Sound.master); osc.start(); } key.style.transform = 'scale(.94)'; };
      const end = () => {
        if (!down) return; const d = performance.now() - down; down = 0; key.style.transform = '';
        if (osc) { try { osc.stop(); } catch (e) { } osc = null; }
        keyed += d < 220 ? '.' : '-'; paint();
        gapT = setTimeout(submit, 800);
      };
      const submit = () => {
        const ok = keyed === MORSE[target];
        if (ok) { streak++; score += 50 + streak * 10; api.sfx('good'); api.xp(2, key); if (streak % 5 === 0) showHint = false; target = pick(Object.keys(MORSE)); }
        else { streak = 0; api.sfx('bad'); cur.classList.add('shake'); setTimeout(() => cur.classList.remove('shake'), 400); showHint = true; }
        keyed = ''; paint(); api.record(score);
      };
      key.addEventListener('pointerdown', e => { e.preventDefault(); start(); });
      key.addEventListener('pointerup', end); key.addEventListener('pointerleave', end);
      api.key(e => { if (e.code === 'Space') { e.preventDefault(); if (e.type === 'keydown' && !e.repeat) start(); } });
      api.on(document, 'keyup', e => { if (e.code === 'Space') { e.preventDefault(); end(); } });
      api.onExit(() => { clearTimeout(gapT); if (osc) try { osc.stop(); } catch (e) { } });
      paint();
    };
    menu();
  },
});
