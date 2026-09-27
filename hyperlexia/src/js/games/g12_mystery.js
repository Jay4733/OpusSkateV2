'use strict';
registerGame({
  id: 'mystery', n: 12, cat: 'meaning', colors: ['#6b4cff', '#0f1a4a'],
  glyph: `<path d="M24 40 Q50 18 76 40 L72 46 Q50 34 28 46Z"/><rect x="30" y="44" width="40" height="8" rx="4"/>
    <circle cx="40" cy="64" r="8" fill="none" stroke="#fff" stroke-width="4"/><circle cx="60" cy="64" r="8" fill="none" stroke="#fff" stroke-width="4"/><path d="M48 64h4" stroke="#fff" stroke-width="4"/>`,
  name: { en: 'Mystery Files', fr: 'Dossiers mystère' },
  tag: { en: 'Read the case, answer who-what-why — then click the sentence that proves it.', fr: 'Lis le dossier, réponds qui-quoi-pourquoi — puis clique la phrase qui le prouve.' },
  how: {
    en: '<p>Read the case file. For each question (WHO, WHAT, WHERE, WHEN, WHY, HOW or INFER), choose an answer. Then <b>prove it</b>: click the sentence(s) in the file that support your answer and press <b>Submit evidence</b>. Answers earn points; correct evidence earns more. Your notebook fills up as you go.</p>',
    fr: '<p>Lis le dossier. Pour chaque question (QUI, QUOI, OÙ, QUAND, POURQUOI, COMMENT ou DÉDUIRE), choisis une réponse. Ensuite, <b>prouve-le</b> : clique la ou les phrases du dossier qui appuient ta réponse, puis <b>Soumettre la preuve</b>. Ton carnet d’enquête se remplit au fur et à mesure.</p>',
  },
  why: {
    en: 'Comprehension in hyperlexia breaks down above the sentence level (Goldberg & Rothermel, 1984) and on questions needing context and inference (Loukusa et al., 2018). Answering wh-questions, then locating textual evidence, mirrors question-generation and scaffolding methods that improved comprehension (El Zein et al., 2014; Ng & Chia, 2014).',
    fr: 'En hyperlexie, la compréhension flanche au-delà de la phrase (Goldberg et Rothermel, 1984) et quand il faut déduire à partir du contexte (Loukusa et al., 2018). Répondre aux questions puis trouver la preuve dans le texte reprend les méthodes de questionnement et d’étayage qui ont amélioré la compréhension (El Zein et al., 2014; Ng et Chia, 2014).',
  },
  start(api) {
    const WH = { who: ['👤', { en: 'WHO', fr: 'QUI' }, '#ff4fd8'], what: ['❓', { en: 'WHAT', fr: 'QUOI' }, '#37e2ff'], where: ['📍', { en: 'WHERE', fr: 'OÙ' }, '#9dff5b'], when: ['🕒', { en: 'WHEN', fr: 'QUAND' }, '#ffc545'], why: ['💡', { en: 'WHY', fr: 'POURQUOI' }, '#ff8f3d'], how: ['⚙️', { en: 'HOW', fr: 'COMMENT' }, '#4d9bff'], infer: ['🧠', { en: 'INFER', fr: 'DÉDUIRE' }, '#b98cff'] };
    const D = api.data; D.closed = D.closed || {};
    const menu = () => UI.menu(api, {
      options: MYSTERIES[api.lang].map((m, i) => ({ icon: m.icon, name: m.title, desc: D.closed[api.lang + i] ? { en: `✓ Closed · ${D.closed[api.lang + i]}★`, fr: `✓ Classé · ${D.closed[api.lang + i]}★` } : { en: `${m.q.length} questions`, fr: `${m.q.length} questions` }, go: () => play(i) })),
    });
    const play = ci => {
      const M = MYSTERIES[api.lang][ci];
      let qi = 0, score = 0, ansOK = 0, evOK = 0, phase = 'answer';
      let evSel = new Set();
      const root = api.clear();
      const textEl = h('div', { class: 'col', style: { gap: '6px' } });
      const qEl = h('div');
      const notes = h('div', { class: 'col', style: { gap: '6px' } });
      const sents = M.s.map((s, i) => {
        const el = h('div', { style: { padding: '8px 10px', borderRadius: '10px', border: '1px solid transparent', cursor: 'default', fontSize: '17px', lineHeight: 1.5, transition: 'background .15s, border-color .15s' } }, h('span', { class: 'mono', style: { color: 'var(--ink3)', fontSize: '12px', marginRight: '8px' } }, String(i + 1).padStart(2, '0')), s);
        el.addEventListener('click', () => { if (phase !== 'evidence') return; if (evSel.has(i)) evSel.delete(i); else evSel.add(i); api.sfx('click'); paintSents(); });
        textEl.appendChild(el); return el;
      });
      const paintSents = (reveal) => sents.forEach((el, i) => {
        const q = M.q[qi];
        el.style.cursor = phase === 'evidence' ? 'pointer' : 'default';
        el.style.background = reveal ? (q.ev.includes(i) ? 'rgba(61,220,132,.18)' : evSel.has(i) ? 'rgba(255,93,115,.16)' : '') : evSel.has(i) ? 'rgba(55,226,255,.18)' : '';
        el.style.borderColor = reveal ? (q.ev.includes(i) ? 'var(--good)' : evSel.has(i) ? 'var(--bad)' : 'transparent') : evSel.has(i) ? 'var(--cyan)' : phase === 'evidence' ? 'rgba(255,255,255,.12)' : 'transparent';
      });
      root.appendChild(h('div', { class: 'gwrap' },
        h('div', { class: 'row', style: { marginBottom: '10px' } }, h('span', { style: { fontSize: '28px' } }, M.icon), h('div', { class: 'gtitle', style: { margin: 0 } }, M.title), h('span', { class: 'spacer' }), h('button', { class: 'btn sm', onclick: menu }, t('menu'))),
        h('div', { style: { display: 'grid', gridTemplateColumns: innerWidth < 900 ? '1fr' : '1.25fr 1fr', gap: '18px', alignItems: 'start' } },
          h('div', { class: 'panel', style: { background: 'linear-gradient(180deg,rgba(233,216,166,.1),rgba(233,216,166,.04))' } }, h('div', { class: 'muted', style: { fontSize: '12px', letterSpacing: '.12em', marginBottom: '6px' } }, api.fr ? '📄 DOSSIER' : '📄 CASE FILE'), textEl),
          h('div', { class: 'col' }, qEl, h('div', { class: 'panel' }, h('b', null, '📓 ' + (api.fr ? 'Carnet d’enquête' : 'Detective notebook')), h('div', { style: { marginTop: '8px' } }, notes))))));
      const hud = () => api.hud([[t('score'), score], ['❓', `${Math.min(qi + 1, M.q.length)}/${M.q.length}`], [t('evidence'), evOK]]);
      const showQ = () => {
        if (qi >= M.q.length) return end();
        phase = 'answer'; evSel = new Set(); paintSents();
        const q = M.q[qi], [ic, lab, col] = WH[q.t];
        const opts = shuffle(q.o);
        qEl.innerHTML = '';
        const box = h('div', { class: 'choices', style: { gridTemplateColumns: '1fr' } });
        opts.forEach(o => box.appendChild(h('button', { class: 'choice', onclick: e => pickAns(o, e.currentTarget, box) }, o)));
        qEl.appendChild(h('div', { class: 'card fadein' },
          h('span', { class: 'chip', style: { background: col, color: '#0b1020', fontWeight: 900 } }, `${ic} ${L(lab)}`),
          h('div', { style: { fontSize: '20px', fontWeight: 800, margin: '10px 0' } }, q.q), box));
        hud();
      };
      const pickAns = (o, btn, box) => {
        if (phase !== 'answer') return;
        const q = M.q[qi];
        const ok = o === q.o[0];
        [...box.children].forEach(b => { b.disabled = true; if (b.textContent === q.o[0]) b.classList.add('right'); });
        if (ok) { ansOK++; score += 100; api.sfx('good'); } else { btn.classList.add('wrong'); api.sfx('bad'); }
        phase = 'evidence'; paintSents();
        const need = q.min || q.ev.length;
        qEl.firstChild.appendChild(h('div', { class: 'fb info fadein', style: { marginTop: '12px' } },
          h('div', null, ok ? '✅ ' : '❌ ', ok ? t('correct') : (api.fr ? 'La bonne réponse est en vert.' : 'The right answer is in green.')),
          h('div', { style: { marginTop: '6px', fontWeight: 800 } }, '🔎 ' + (api.fr ? `Prouve-le : clique ${need > 1 ? `au moins ${need} phrases` : 'la phrase'} du dossier qui le montre${need > 1 ? 'nt' : ''}.` : `Prove it: click ${need > 1 ? `at least ${need} sentences` : 'the sentence'} in the file that show${need > 1 ? '' : 's'} it.`)),
          h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: e => { e.currentTarget.disabled = true; judge(); } }, '📌 ' + (api.fr ? 'Soumettre la preuve' : 'Submit evidence'))));
      };
      const judge = () => {
        const q = M.q[qi], need = q.min || q.ev.length;
        const hits = [...evSel].filter(i => q.ev.includes(i)).length, extra = [...evSel].filter(i => !q.ev.includes(i)).length;
        const good = hits >= need && extra <= 1;
        phase = 'review'; paintSents(true);
        if (good) { evOK++; score += 100 + (extra ? 0 : 25); api.sfx('great'); api.xp(4, qEl); } else if (hits) { score += 40; api.sfx('pop'); } else api.sfx('bad');
        notes.appendChild(h('div', { class: 'fadein', style: { fontSize: '14px' } }, `${WH[q.t][0]} `, h('b', null, q.q + ' '), q.o[0], ' ', h('span', { class: 'muted' }, `(${api.fr ? 'phrases' : 'lines'} ${q.ev.map(x => x + 1).join(', ')})`)));
        qEl.firstChild.appendChild(h('div', { class: 'fb ' + (good ? 'good' : hits ? 'info' : 'bad'), style: { marginTop: '10px' } },
          good ? (api.fr ? '🧾 Preuve solide !' : '🧾 Solid evidence!') : hits ? (api.fr ? '🧾 Preuve partielle — les phrases clés sont en vert.' : '🧾 Partial evidence — the key lines are in green.') : (api.fr ? '🧾 Ces phrases ne le prouvent pas. Regarde celles en vert.' : '🧾 Those lines don’t prove it. Look at the green ones.'),
          h('div', null, h('button', { class: 'btn primary', style: { marginTop: '8px' }, onclick: () => { qi++; showQ(); } }, (qi + 1 >= M.q.length ? (api.fr ? 'Clore le dossier' : 'Close the case') : t('next')) + ' →'))));
        hud();
      };
      const end = () => {
        const n = M.q.length, ratio = (ansOK + evOK) / (2 * n);
        const stars = ratio >= 0.95 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.4 ? 1 : 0;
        D.closed[api.lang + ci] = Math.max(D.closed[api.lang + ci] || 0, stars); api.save();
        if (evOK === n) api.badge('detective');
        qEl.innerHTML = '';
        qEl.appendChild(h('div', { style: { fontSize: '44px', fontWeight: 950, color: 'var(--bad)', border: '6px solid var(--bad)', borderRadius: '12px', padding: '8px 18px', transform: 'rotate(-8deg)', display: 'inline-block', letterSpacing: '.08em', margin: '10px' }, class: 'bounce' }, api.fr ? 'CLASSÉ' : 'CLOSED'));
        api.finish({ score, stars, xp: 15 + evOK * 3, title: M.title, lines: [`${api.fr ? 'Réponses' : 'Answers'}: ${ansOK}/${n} · ${t('evidence')}: ${evOK}/${n}`], again: () => play((ci + 1) % MYSTERIES[api.lang].length), menu });
      };
      showQ();
    };
    menu();
  },
});
