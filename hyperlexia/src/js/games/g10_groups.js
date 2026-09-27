'use strict';
registerGame({
  id: 'groups', n: 10, cat: 'meaning', colors: ['#b98cff', '#3b2a9e'],
  glyph: `${[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => `<rect x="${14 + c * 19}" y="${14 + r * 19}" width="16" height="16" rx="3" fill="${['#ffd84a', '#7ee06a', '#6fb7ff', '#d59bff'][r]}"/>`).join('')).join('')}`,
  name: { en: 'Four Groups', fr: 'Quatre groupes' },
  tag: { en: 'Sixteen words, four hidden connections. Beware the red herrings.', fr: 'Seize mots, quatre liens cachés. Attention aux pièges !' },
  how: {
    en: '<p>Select <b>four words</b> that share a connection and press Submit. Find all four groups before making <b>four mistakes</b>. Groups range from 🟨 straightforward to 🟪 tricky (hidden words, homophones, anagrams). Some words seem to fit two groups — only one arrangement works. Each solved group explains the link.</p>',
    fr: '<p>Sélectionne <b>quatre mots</b> qui ont un lien et valide. Trouve les quatre groupes avant <b>quatre erreurs</b>. Du 🟨 plus simple au 🟪 plus rusé (mots cachés, homophones, anagrammes). Certains mots semblent aller dans deux groupes — une seule solution fonctionne.</p>',
  },
  why: {
    en: 'Categorising words by meaning, multiple meanings and sound-alikes trains semantic flexibility — the layer beyond decoding. Low-verbal fluent readers often miss that context changes a word\'s meaning (Snowling & Frith, 1986).',
    fr: 'Classer les mots selon le sens, les sens multiples et les homophones entraîne la souplesse sémantique — ce qui va au-delà du décodage. Les lecteurs fluides mais moins verbaux ratent souvent que le contexte change le sens d’un mot (Snowling et Frith, 1986).',
  },
  start(api) {
    const COL = { 1: ['#ffd84a', '#2a2300'], 2: ['#7ee06a', '#0d2a05'], 3: ['#6fb7ff', '#04203d'], 4: ['#d59bff', '#240a3d'] };
    const D = api.data; D.done = D.done || {};
    const menu = () => {
      const P = GROUPS[api.lang];
      UI.menu(api, {
        options: [
          { icon: '▶️', name: { en: 'Next unsolved puzzle', fr: 'Prochaine énigme' }, desc: { en: `${P.filter((_, i) => D.done[api.lang + i]).length}/${P.length} solved`, fr: `${P.filter((_, i) => D.done[api.lang + i]).length}/${P.length} résolues` }, go: () => { const i = P.findIndex((_, k) => !D.done[api.lang + k]); play(i < 0 ? rand(P.length) : i); } },
          { icon: '🎲', name: { en: 'Random puzzle', fr: 'Énigme au hasard' }, desc: { en: 'Any of them', fr: 'N’importe laquelle' }, go: () => play(rand(P.length)) },
        ],
        extra: h('div', { class: 'row', style: { flexWrap: 'wrap', gap: '6px' } }, P.map((_, i) => h('button', { class: 'chip' + (D.done[api.lang + i] ? ' sel' : ''), onclick: () => play(i) }, `#${i + 1} ${D.done[api.lang + i] ? '✓' : ''}`))),
      });
    };
    const play = idx => {
      const puz = GROUPS[api.lang][idx];
      let remaining = shuffle(puz.flatMap(g => g.words.map(w => ({ w, g }))));
      let sel = [], mistakes = 0, solved = [], guesses = [];
      const root = api.clear();
      const solvedEl = h('div', { class: 'col', style: { gap: '8px' } });
      const gridEl = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' } });
      const msg = h('div', { style: { minHeight: '26px', textAlign: 'center', fontWeight: 700 } });
      const dots = h('div', { class: 'row', style: { justifyContent: 'center' } });
      const subBtn = h('button', { class: 'btn primary', onclick: () => submit() }, t('submit'));
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: '760px' } },
        h('div', { class: 'row', style: { marginBottom: '10px' } }, h('span', { class: 'chip sel' }, `${api.fr ? 'Énigme' : 'Puzzle'} #${idx + 1}`), h('span', { class: 'spacer' }), h('button', { class: 'btn sm', onclick: menu }, t('menu'))),
        solvedEl, gridEl, msg,
        h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '6px' } }, h('span', { class: 'muted' }, t('mistakes') + ':'), dots),
        h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '12px' } },
          h('button', { class: 'btn', onclick: () => { remaining = shuffle(remaining); render(); api.sfx('whoosh'); } }, '🔀 ' + t('shuffle')),
          h('button', { class: 'btn', onclick: () => { sel = []; render(); } }, t('clear')), subBtn)));
      const groupBar = g => h('div', { class: 'fadein', style: { background: COL[g.lv][0], color: COL[g.lv][1], borderRadius: '14px', padding: '12px', textAlign: 'center' } },
        h('div', { style: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.06em' } }, g.name), h('div', { style: { fontWeight: 600 } }, g.words.join(' · ')));
      const render = () => {
        gridEl.innerHTML = '';
        remaining.forEach(it => {
          const on = sel.includes(it);
          const fs = it.w.length > 10 ? 13 : it.w.length > 7 ? 15 : 17;
          gridEl.appendChild(h('button', { style: { height: '72px', borderRadius: '12px', border: '0', fontWeight: 900, fontSize: fs + 'px', letterSpacing: '.02em', background: on ? '#5a5e82' : 'rgba(255,255,255,.88)', color: on ? '#fff' : '#161a33', transition: 'transform .1s, background .15s', transform: on ? 'scale(.96)' : '' }, onclick: () => { if (on) sel = sel.filter(x => x !== it); else if (sel.length < 4) sel.push(it); api.sfx('click'); render(); } }, it.w));
        });
        dots.innerHTML = ''; for (let i = 0; i < 4; i++) dots.appendChild(h('span', { style: { width: '14px', height: '14px', borderRadius: '50%', background: i < 4 - mistakes ? '#9b7bff' : 'rgba(255,255,255,.15)' } }));
        subBtn.disabled = sel.length !== 4;
        api.hud([[t('found'), `${solved.length}/4`], [t('mistakes'), `${mistakes}/4`]]);
      };
      const submit = () => {
        if (sel.length !== 4) return;
        const key = sel.map(s => s.w).sort().join('|');
        if (guesses.includes(key)) { msg.textContent = api.fr ? 'Déjà essayé !' : 'Already guessed!'; return; }
        guesses.push(key);
        const g = sel[0].g;
        if (sel.every(s => s.g === g)) {
          solved.push(g); remaining = remaining.filter(x => x.g !== g); sel = [];
          solvedEl.appendChild(groupBar(g)); api.sfx(g.lv >= 3 ? 'great' : 'good'); msg.textContent = '';
          api.xp(3 + g.lv * 2, solvedEl);
          if (solved.length === 4) return end(true);
        } else {
          mistakes++; api.sfx('bad');
          const counts = {}; sel.forEach(s => counts[s.g.name] = (counts[s.g.name] || 0) + 1);
          msg.textContent = Math.max(...Object.values(counts)) === 3 ? (api.fr ? 'Presque ! Il en manque un.' : 'One away!') : (api.fr ? 'Non…' : 'Not a group.');
          gridEl.classList.remove('shake'); void gridEl.offsetWidth; gridEl.classList.add('shake');
          if (mistakes >= 4) return end(false);
        }
        render();
      };
      const end = won => {
        puz.filter(g => !solved.includes(g)).sort((a, b) => a.lv - b.lv).forEach(g => solvedEl.appendChild(groupBar(g)));
        remaining = []; render();
        if (won) { D.done[api.lang + idx] = 1; api.save(); }
        const stars = !won ? 0 : mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
        api.after(900, () => api.finish({ score: won ? 400 - mistakes * 75 : solved.length * 60, stars, xp: won ? 20 : 5, title: won ? (api.fr ? 'Liens trouvés !' : 'All connections found!') : t('gameover'), lines: puz.map(g => `${['', '🟨', '🟩', '🟦', '🟪'][g.lv]} ${g.name}: ${g.words.join(', ')}`), again: () => play((idx + 1) % GROUPS[api.lang].length), menu }));
      };
      render();
    };
    menu();
  },
});
