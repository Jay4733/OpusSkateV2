'use strict';
registerGame({
  id: 'sequence', n: 19, cat: 'numbers', colors: ['#37e2ff', '#ff4fd8'],
  glyph: `<text x="50" y="44" font-size="15" text-anchor="middle">1 1 2 3 5</text><text x="50" y="68" font-size="15" text-anchor="middle">A C F J ?</text>
    <path d="M18 80 Q34 70 50 80 T82 80" fill="none" stroke="#fff" stroke-width="3"/>`,
  name: { en: 'Sequence Lab', fr: 'Labo des suites' },
  tag: { en: 'Find the hidden rule in numbers, letters and words.', fr: 'Trouve la règle cachée dans les nombres, les lettres et les mots.' },
  how: {
    en: '<p>Study the sequence and type the <b>next term</b> (a number or a letter). Rules get trickier as you level up: steps, multiples, squares, primes, Fibonacci, letter jumps, look-and-say… Use 🔍 to reveal the differences row (costs points). Three lives.</p>',
    fr: '<p>Observe la suite et tape le <b>prochain terme</b> (nombre ou lettre). Les règles se corsent avec les niveaux : sauts, multiples, carrés, nombres premiers, Fibonacci, sauts de lettres, « lis-et-dis »… 🔍 affiche les différences (coûte des points). Trois vies.</p>',
  },
  why: {
    en: 'Enhanced pattern detection is a core autistic strength in the Enhanced Perceptual Functioning model (Mottron et al., 2006), with stronger engagement of perceptual brain regions (Samson et al., 2012). Explaining each rule afterwards links the pattern to words.',
    fr: 'La détection de régularités est une force autistique centrale selon le modèle du fonctionnement perceptif amélioré (Mottron et al., 2006), avec un plus grand engagement des régions perceptives (Samson et al., 2012). Chaque règle est ensuite expliquée en mots.',
  },
  start(api) {
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    const NUMW = { en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'], fr: ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze'] };
    const F = api.fr;
    const gens = [
      [1, () => { const a = rand(20) + 1, d = rand(9) + 2; return { seq: [0, 1, 2, 3, 4].map(i => a + d * i), ans: a + d * 5, rule: F ? `On ajoute ${d} à chaque fois.` : `Add ${d} each time.` }; }],
      [1, () => { const a = rand(60) + 40, d = rand(7) + 3; return { seq: [0, 1, 2, 3, 4].map(i => a - d * i), ans: a - d * 5, rule: F ? `On enlève ${d} à chaque fois.` : `Subtract ${d} each time.` }; }],
      [2, () => { const a = rand(3) + 1, r = rand(2) + 2; return { seq: [0, 1, 2, 3, 4].map(i => a * r ** i), ans: a * r ** 5, rule: F ? `On multiplie par ${r}.` : `Multiply by ${r}.` }; }],
      [2, () => { const s = rand(4) + 1; return { seq: [0, 1, 2, 3, 4].map(i => (s + i) ** 2), ans: (s + 5) ** 2, rule: F ? 'Les carrés parfaits (n × n).' : 'Perfect squares (n × n).' }; }],
      [2, () => { const s = rand(4) + 1; return { seq: [0, 1, 2, 3, 4].map(i => { const n = s + i; return n * (n + 1) / 2; }), ans: (s + 5) * (s + 6) / 2, rule: F ? 'Nombres triangulaires : on ajoute 1 de plus à chaque fois.' : 'Triangular numbers: add one more each time.' }; }],
      [3, () => { const s = rand(3) + 1; return { seq: [0, 1, 2, 3].map(i => (s + i) ** 3), ans: (s + 4) ** 3, rule: F ? 'Les cubes (n × n × n).' : 'Cubes (n × n × n).' }; }],
      [3, () => { let a = rand(3) + 1, b = rand(3) + 1; const q = [a, b]; for (let i = 0; i < 4; i++) q.push(q[q.length - 1] + q[q.length - 2]); return { seq: q.slice(0, 6), ans: q[4] + q[5], rule: F ? 'Chaque terme est la somme des deux précédents (comme Fibonacci).' : 'Each term is the sum of the two before it (Fibonacci-style).' }; }],
      [3, () => { const s = rand(10); return { seq: primes.slice(s, s + 5), ans: primes[s + 5], rule: F ? 'Les nombres premiers.' : 'Prime numbers.' }; }],
      [3, () => { const a = rand(5) + 1, b = rand(4) + 2, c = rand(3) + 2; const q = [a]; for (let i = 0; i < 5; i++) q.push(i % 2 ? q[q.length - 1] * c : q[q.length - 1] + b); return { seq: q.slice(0, 5), ans: q[5], rule: F ? `On alterne : +${b}, puis ×${c}.` : `Alternate: +${b}, then ×${c}.` }; }],
      [4, () => { const a = rand(5) + 1, d = rand(3) + 1, dd = rand(2) + 1; const q = [a]; let step = d; for (let i = 0; i < 5; i++) { q.push(q[q.length - 1] + step); step += dd; } return { seq: q.slice(0, 5), ans: q[5], rule: F ? `Les écarts augmentent de ${dd} à chaque fois.` : `The gaps grow by ${dd} each time.` }; }],
      [2, () => { const s = rand(6), d = rand(3) + 2; const idx = [0, 1, 2, 3, 4].map(i => s + d * i); if (idx[4] + d > 25) return null; return { seq: idx.map(i => A[i]), ans: A[s + d * 5], rule: F ? `On saute ${d} lettres dans l’alphabet.` : `Jump ${d} letters in the alphabet.` }; }],
      [3, () => { const s = rand(3); const q = [s]; for (let i = 1; i <= 5; i++) q.push(q[i - 1] + i); if (q[5] > 25) return null; return { seq: q.slice(0, 5).map(i => A[i]), ans: A[q[5]], rule: F ? 'Sauts de lettres de +1, +2, +3, +4…' : 'Letter jumps of +1, +2, +3, +4…' }; }],
      [4, () => ({ seq: ['1', '11', '21', '1211', '111221'], ans: '312211', rule: F ? '« Lis-et-dis » : on décrit le terme précédent (un 1 → 11, deux 1 → 21…).' : 'Look-and-say: describe the previous term aloud (one 1 → 11, two 1s → 21…).' })],
      [4, () => { const s = rand(5) + 1; const w = NUMW[api.lang]; return { seq: [0, 1, 2, 3, 4].map(i => `${w[s + i]}`), ans: String(norm(w[s + 5]).length), q2: true, rule: F ? 'Combien de lettres a le prochain nombre écrit en lettres ?' : 'How many letters does the next number word have?' }; }],
      [3, () => { const s = rand(4); const q = [0, 1, 2, 3, 4].map(i => 2 ** (s + i)); return { seq: q, ans: 2 ** (s + 5), rule: F ? 'Les puissances de 2 — la base du binaire !' : 'Powers of 2 — the basis of binary!' }; }],
      [4, () => { const q = [1, 2, 6, 24, 120]; return { seq: q, ans: 720, rule: F ? 'Factorielles : 1×2×3×4×5×6.' : 'Factorials: 1×2×3×4×5×6.' }; }],
      [2, () => { const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']; const s = rand(2); return { seq: notes.slice(s, s + 5), ans: notes[s + 5], rule: F ? 'La gamme de do majeur en notation anglaise (C=do, D=ré…).' : 'The C major scale in letter names.' }; }],
    ];
    const gen = lv => { const pool = gens.filter(g => g[0] <= lv); for (let i = 0; i < 20; i++) { const g = pick(pool)[1](); if (g) return g; } return gens[0][1](); };
    const menu = () => UI.menu(api, {
      options: [
        { icon: '🧬', name: { en: 'Endless lab (3 lives)', fr: 'Labo sans fin (3 vies)' }, desc: { en: 'Levels unlock harder rules', fr: 'Les niveaux débloquent des règles plus dures' }, go: () => play(1) },
        { icon: '🎓', name: { en: 'Expert start', fr: 'Départ expert' }, desc: { en: 'All rule types from the start', fr: 'Toutes les règles dès le début' }, go: () => play(4) },
      ],
      extra: h('div', { class: 'muted center' }, `${t('best')}: ${fmt(api.best)}`),
    });
    const play = startLv => {
      let lv = startLv, score = 0, lives = 3, streak = 0, solved = 0;
      const root = api.clear(); const wrap = h('div', { class: 'gwrap', style: { maxWidth: '900px' } }); root.appendChild(wrap);
      const hud = () => api.hud([[t('score'), score], [t('level'), lv], ['❤', lives], [t('streak'), streak]]);
      const next = () => {
        if (lives <= 0) return api.finish({ score, stars: solved >= 20 ? 3 : solved >= 12 ? 2 : solved >= 5 ? 1 : 0, xp: 5 + solved * 2, lines: [`${solved} ${F ? 'suites résolues' : 'sequences solved'} · ${t('level')} ${lv}`], again: () => play(startLv), menu });
        const q = gen(lv); let hinted = false;
        wrap.innerHTML = '';
        const tiles = h('div', { class: 'row', style: { justifyContent: 'center', gap: '10px', margin: '20px 0' } }, ...q.seq.map((v, i) => h('div', { class: 'tile fadein', style: { width: 'auto', minWidth: '64px', padding: '0 12px', height: '70px', fontSize: String(v).length > 5 ? '18px' : '28px', background: 'linear-gradient(180deg,rgba(55,226,255,.2),rgba(255,79,216,.15))', animationDelay: i * 0.08 + 's' } }, v)), h('div', { class: 'tile', style: { width: '74px', height: '70px', fontSize: '30px', borderStyle: 'dashed', color: 'var(--amber)' } }, '?'));
        const diff = h('div', { class: 'mono center muted', style: { minHeight: '24px' } });
        const inp = h('input', { class: 'field mono', style: { fontSize: '28px', width: '220px', textAlign: 'center', textTransform: 'uppercase' } });
        const res = h('div');
        wrap.append(h('div', { class: 'center muted' }, q.q2 ? (F ? 'Tape le nombre de lettres du prochain nombre' : 'Type the letter count of the next number word') : (F ? 'Quel est le prochain terme ?' : 'What comes next?')), tiles, diff,
          h('div', { class: 'row', style: { justifyContent: 'center' } }, inp, h('button', { class: 'btn primary', onclick: () => go() }, t('submit')), h('button', { class: 'btn', onclick: () => { if (hinted) return; hinted = true; score = Math.max(0, score - 20); const nums = q.seq.map(Number); diff.textContent = nums.every(n => !isNaN(n)) ? (F ? 'Différences : ' : 'Differences: ') + nums.slice(1).map((n, i) => (n - nums[i] >= 0 ? '+' : '') + (n - nums[i])).join('  ') : (typeof q.seq[0] === 'string' && q.seq[0].length === 1 ? (F ? 'Rangs : ' : 'Positions: ') + q.seq.map(c => A.indexOf(c) + 1).join(', ') : (F ? 'Pense aux lettres de chaque mot.' : 'Think about the letters in each word.')); hud(); } }, '🔍')), res);
        setTimeout(() => inp.focus(), 30);
        const go = () => {
          if (inp.disabled) return;
          const v = inp.value.trim().toUpperCase(); if (!v) return;
          inp.disabled = true;
          const ok = v === String(q.ans).toUpperCase();
          if (ok) { streak++; solved++; score += 50 * lv + streak * 10 - (hinted ? 20 : 0); api.sfx('good'); api.xp(2 + lv, inp); if (solved % 4 === 0) { lv++; api.sfx('level'); api.toast(`${t('level')} ${lv}!`, '🧬'); } }
          else { lives--; streak = 0; api.sfx('bad'); }
          res.appendChild(h('div', { class: 'fb ' + (ok ? 'good' : 'bad'), style: { marginTop: '12px' } }, `${ok ? '✅' : '❌'} ${F ? 'Réponse' : 'Answer'}: ${q.ans} — ${q.rule}`, h('div', null, h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: next }, t('next') + ' →'))));
          hud();
        };
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') { if (inp.disabled) next(); else go(); } });
        hud();
      };
      next();
    };
    menu();
  },
});
