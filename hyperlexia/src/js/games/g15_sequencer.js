'use strict';
registerGame({
  id: 'sequencer', n: 15, cat: 'meaning', colors: ['#37e2ff', '#0a8f6a'],
  glyph: `${[0, 1, 2, 3].map(i => `<rect x="${18 + i * 4}" y="${18 + i * 17}" width="${48}" height="13" rx="4" fill="#fff" fill-opacity="${1 - i * .15}"/><text x="${24 + i * 4}" y="${28 + i * 17}" font-size="10" fill="#0a8f6a">${i + 1}</text>`).join('')}
    <path d="M78 20 v56 m-6 -8 l6 8 l6 -8" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  name: { en: 'Story Sequencer', fr: 'Chrono-récit' },
  tag: { en: 'Rebuild scrambled stories, map their structure, link causes to effects.', fr: 'Remets les histoires en ordre, trace leur structure, relie causes et effets.' },
  how: {
    en: '<p><b>Sequence</b>: drag the cards (or use ▲▼) into the right order — words like <i>first, then, however, in the end</i> are clues. Next, build the <b>story map</b>: tag each sentence as Setting, Character, Problem, Event or Resolution. <b>Cause &amp; effect</b>: click a cause, then the effect it produced.</p>',
    fr: '<p><b>Ordre</b> : glisse les cartes (ou utilise ▲▼) dans le bon ordre — les mots comme <i>d’abord, puis, cependant, finalement</i> sont des indices. Ensuite, bâtis la <b>carte du récit</b> : étiquette chaque phrase (Lieu, Personnage, Problème, Événement, Solution). <b>Cause et effet</b> : clique une cause, puis son effet.</p>',
  },
  why: {
    en: 'Narrative structure and causal links are what hold paragraphs together — exactly where hyperlexic comprehension tends to fail. Growth in narrative retelling predicted reading comprehension in autistic youth (McIntyre et al., 2020), and graphic organisers are among the most effective supports (El Zein et al., 2014; Lee et al., 2025).',
    fr: 'La structure du récit et les liens de cause relient les paragraphes — là où la compréhension hyperlexique flanche. La progression en rappel de récit prédit la compréhension chez les jeunes autistes (McIntyre et al., 2020), et les organisateurs graphiques sont parmi les soutiens les plus efficaces (El Zein et al., 2014; Lee et al., 2025).',
  },
  start(api) {
    const LBL = { S: ['📍', { en: 'Setting', fr: 'Lieu/moment' }, '#9dff5b'], C: ['🧑', { en: 'Character', fr: 'Personnage' }, '#37e2ff'], P: ['⚠️', { en: 'Problem', fr: 'Problème' }, '#ff5d73'], E: ['➡️', { en: 'Event', fr: 'Événement' }, '#ffc545'], R: ['✅', { en: 'Resolution', fr: 'Solution' }, '#b98cff'] };
    const menu = () => UI.menu(api, {
      options: [
        ...STORIES[api.lang].map((s, i) => ({ icon: s.i, name: s.t, desc: { en: 'Sequence + story map', fr: 'Ordre + carte du récit' }, go: () => seq(i) })),
        { icon: '🔗', name: { en: 'Cause & effect', fr: 'Cause et effet' }, desc: { en: 'Match 6 pairs', fr: 'Relie 6 paires' }, go: () => causes() },
      ],
    });
    const seq = si => {
      const st = STORIES[api.lang][si];
      let order = shuffle(st.s.map((x, i) => i));
      while (order.every((v, i) => v === i)) order = shuffle(order);
      let tries = 0, dragI = null;
      const root = api.clear();
      const list = h('div', { class: 'col', style: { gap: '8px' } });
      const res = h('div');
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: '860px' } },
        h('div', { class: 'row' }, h('span', { style: { fontSize: '30px' } }, st.i), h('div', { class: 'gtitle', style: { margin: 0 } }, st.t), h('span', { class: 'spacer' }), h('button', { class: 'btn sm', onclick: menu }, t('menu'))),
        h('p', { class: 'muted' }, api.fr ? 'Remets les phrases dans l’ordre de l’histoire. Repère les mots-liens !' : 'Put the sentences in story order. Watch for linking words!'),
        list, h('div', { class: 'row', style: { marginTop: '12px' } }, h('button', { class: 'btn primary lg', onclick: () => check() }, '✔️ ' + t('check'))), res));
      const CONN = /\b(at first|first|then|next|later|finally|in the end|however|when|two days later|one sunny morning|d’abord|puis|ensuite|finalement|cependant|quand|deux jours plus tard|un matin ensoleillé|lentement|slowly|inside|à l’intérieur)\b/gi;
      const draw = (marks) => {
        list.innerHTML = '';
        order.forEach((si2, pos) => {
          const txt = escapeHtml(st.s[si2][1]).replace(CONN, m => `<b style="color:var(--amber)">${m}</b>`);
          const card = h('div', { draggable: 'true', class: 'fadein', style: { display: 'flex', gap: '10px', alignItems: 'center', padding: '12px 14px', borderRadius: '14px', background: marks ? (marks[pos] ? 'rgba(61,220,132,.16)' : 'rgba(255,93,115,.14)') : 'var(--panel2)', border: '1px solid ' + (marks ? (marks[pos] ? 'var(--good)' : 'var(--bad)') : 'var(--line)'), cursor: 'grab', fontSize: '17px' } },
            h('span', { class: 'mono', style: { color: 'var(--ink3)', minWidth: '22px' } }, pos + 1), h('span', { class: 'grow', html: txt }),
            h('button', { class: 'btn sm', onclick: () => mv(pos, -1) }, '▲'), h('button', { class: 'btn sm', onclick: () => mv(pos, 1) }, '▼'));
          card.addEventListener('dragstart', () => { dragI = pos; card.style.opacity = .5; });
          card.addEventListener('dragend', () => card.style.opacity = 1);
          card.addEventListener('dragover', e => e.preventDefault());
          card.addEventListener('drop', e => { e.preventDefault(); if (dragI == null || dragI === pos) return; const [x] = order.splice(dragI, 1); order.splice(pos, 0, x); dragI = null; api.sfx('click'); draw(); });
          list.appendChild(card);
        });
      };
      const mv = (pos, d) => { const np = pos + d; if (np < 0 || np >= order.length) return; [order[pos], order[np]] = [order[np], order[pos]]; api.sfx('click'); draw(); };
      const check = () => {
        tries++;
        const marks = order.map((v, i) => v === i);
        draw(marks);
        api.hud([[api.fr ? 'Essais' : 'Tries', tries], ['✔', `${marks.filter(Boolean).length}/${marks.length}`]]);
        if (marks.every(Boolean)) { api.sfx('great'); api.xp(8, list); res.innerHTML = ''; res.appendChild(h('div', { class: 'fb good', style: { marginTop: '10px' } }, api.fr ? '✅ Parfait ! Maintenant, la carte du récit.' : '✅ Perfect! Now build the story map.', h('div', null, h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: () => map(st, tries) }, (api.fr ? 'Carte du récit' : 'Story map') + ' →')))); }
        else { api.sfx('bad'); res.innerHTML = ''; res.appendChild(h('div', { class: 'fb info', style: { marginTop: '10px' } }, api.fr ? 'Les cartes en vert sont à la bonne place. Regarde les mots-liens en or.' : 'Green cards are in the right place. Use the gold linking words.')); }
      };
      draw(); api.hud([[api.fr ? 'Essais' : 'Tries', 0]]);
    };
    const map = (st, tries) => {
      const root = api.clear();
      const tags = st.s.map(() => null);
      const rows = h('div', { class: 'col', style: { gap: '8px' } });
      const organiser = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '6px', marginTop: '14px' } });
      const res = h('div');
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: '980px' } },
        h('div', { class: 'gtitle' }, `🗺️ ${api.fr ? 'Carte du récit' : 'Story map'} — ${st.t}`),
        h('p', { class: 'muted' }, api.fr ? 'Pour chaque phrase, choisis son rôle dans l’histoire.' : 'For each sentence, choose its role in the story.'), rows, organiser,
        h('div', { class: 'row', style: { marginTop: '12px' } }, h('button', { class: 'btn primary lg', onclick: () => check() }, '✔️ ' + t('check'))), res));
      const draw = marks => {
        rows.innerHTML = '';
        st.s.forEach(([lab, txt], i) => rows.appendChild(h('div', { class: 'panel', style: { padding: '10px', borderColor: marks ? (marks[i] ? 'var(--good)' : 'var(--bad)') : 'var(--line)' } },
          h('div', { style: { marginBottom: '6px' } }, txt),
          h('div', { class: 'row', style: { gap: '6px' } }, Object.entries(LBL).map(([k, [ic, nm, col]]) => h('button', { class: 'chip', style: tags[i] === k ? { background: col, color: '#0b1020', fontWeight: 800 } : {}, onclick: () => { tags[i] = k; api.sfx('click'); draw(); } }, `${ic} ${L(nm)}`))))));
        organiser.innerHTML = '';
        Object.entries(LBL).forEach(([k, [ic, nm, col]]) => organiser.appendChild(h('div', { style: { borderTop: `4px solid ${col}`, background: 'var(--panel)', borderRadius: '10px', padding: '8px', minHeight: '90px', fontSize: '12px' } }, h('b', null, `${ic} ${L(nm)}`), ...st.s.filter((_, i) => tags[i] === k).map(([, tx]) => h('div', { style: { marginTop: '4px', color: 'var(--ink2)' } }, '• ' + tx.slice(0, 60) + (tx.length > 60 ? '…' : ''))))));
      };
      const check = () => {
        const marks = st.s.map(([lab], i) => tags[i] === lab);
        draw(marks);
        const n = marks.filter(Boolean).length, all = marks.length;
        if (n === all) {
          api.finish({ score: 400 - (tries - 1) * 40, stars: tries === 1 ? 3 : tries <= 3 ? 2 : 1, xp: 18, title: api.fr ? 'Récit reconstruit !' : 'Story rebuilt!', lines: [`${api.fr ? 'Essais pour l’ordre' : 'Sequence tries'}: ${tries}`], again: () => seq((STORIES[api.lang].indexOf(st) + 1) % STORIES[api.lang].length), menu });
        } else { api.sfx('bad'); res.innerHTML = ''; res.appendChild(h('div', { class: 'fb info', style: { marginTop: '10px' } }, `${n}/${all} ✔ — ` + (api.fr ? 'Indice : le problème est ce qui complique la situation; la solution règle le problème.' : 'Hint: the problem is what goes wrong; the resolution fixes it.'))); }
      };
      draw();
    };
    const causes = () => {
      const pairs = sample(CAUSES[api.lang], 6);
      const effects = shuffle(pairs.map((p, i) => ({ txt: p[1], i })));
      const links = {}; let selC = null, checked = false;
      const root = api.clear();
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.position = 'absolute'; svg.style.inset = '0'; svg.style.pointerEvents = 'none'; svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
      const colL = h('div', { class: 'col', style: { gap: '10px' } }), colR = h('div', { class: 'col', style: { gap: '10px' } });
      const area = h('div', { style: { position: 'relative', display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: '0' } }, colL, h('div'), colR, svg);
      const res = h('div');
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: '980px' } }, h('div', { class: 'gtitle' }, '🔗 ' + (api.fr ? 'Cause et effet' : 'Cause & effect')),
        h('p', { class: 'muted' }, api.fr ? 'Clique une cause (à gauche), puis l’effet qu’elle a produit (à droite).' : 'Click a cause (left), then the effect it produced (right).'), area,
        h('div', { class: 'row', style: { marginTop: '14px' } }, h('button', { class: 'btn primary lg', onclick: () => check() }, '✔️ ' + t('check')), h('button', { class: 'btn', onclick: menu }, t('menu'))), res));
      const cEls = pairs.map((p, i) => { const e = h('button', { class: 'choice', onclick: () => { if (checked) return; selC = i; api.sfx('click'); paint(); } }, '⚡ ' + p[0]); colL.appendChild(e); return e; });
      const eEls = effects.map((ef, j) => { const e = h('button', { class: 'choice', onclick: () => { if (checked || selC == null) return; for (const k in links) if (links[k] === j) delete links[k]; links[selC] = j; selC = null; api.sfx('pop'); paint(); } }, '🎯 ' + ef.txt); colR.appendChild(e); return e; });
      const paint = (marks) => {
        cEls.forEach((e, i) => { e.style.outline = selC === i ? '2px solid var(--cyan)' : ''; });
        svg.innerHTML = '';
        const ar = area.getBoundingClientRect();
        for (const i in links) {
          const a = cEls[i].getBoundingClientRect(), b = eEls[links[i]].getBoundingClientRect();
          const ln = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const x1 = a.right - ar.left, y1 = a.top + a.height / 2 - ar.top, x2 = b.left - ar.left, y2 = b.top + b.height / 2 - ar.top;
          ln.setAttribute('d', `M${x1},${y1} C${x1 + 40},${y1} ${x2 - 40},${y2} ${x2},${y2}`);
          ln.setAttribute('stroke', marks ? (marks[i] ? '#3ddc84' : '#ff5d73') : '#37e2ff'); ln.setAttribute('stroke-width', '3'); ln.setAttribute('fill', 'none');
          svg.appendChild(ln);
        }
      };
      const check = () => {
        if (Object.keys(links).length < pairs.length) { res.innerHTML = ''; res.appendChild(h('div', { class: 'fb info' }, api.fr ? 'Relie toutes les causes d’abord.' : 'Link every cause first.')); return; }
        checked = true;
        const marks = {}; let n = 0; for (const i in links) { marks[i] = effects[links[i]].i === +i; if (marks[i]) n++; }
        paint(marks);
        api.after(700, () => api.finish({ score: n * 70, stars: n === 6 ? 3 : n >= 4 ? 2 : n >= 2 ? 1 : 0, xp: 5 + n * 2, lines: [`${n}/6 ${api.fr ? 'liens corrects' : 'correct links'}`], again: causes, menu }));
      };
      api.on(window, 'resize', () => paint());
      paint();
    };
    menu();
  },
});
