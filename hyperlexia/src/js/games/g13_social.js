'use strict';
registerGame({
  id: 'social', n: 13, cat: 'social', colors: ['#3dffc5', '#ff4fd8'],
  glyph: `<rect x="14" y="22" width="48" height="34" rx="12"/><path d="M24 56 L22 68 L36 56Z"/><rect x="40" y="42" width="46" height="32" rx="12" fill-opacity=".7"/><path d="M76 74 L80 84 L66 74Z" fill-opacity=".7"/>
    <circle cx="30" cy="39" r="3" fill="#ff4fd8"/><circle cx="38" cy="39" r="3" fill="#ff4fd8"/><circle cx="46" cy="39" r="3" fill="#ff4fd8"/><text x="63" y="63" font-size="14" text-anchor="middle" fill="#0b7a60">🙂</text>`,
  name: { en: 'Social Signals', fr: 'Signaux sociaux' },
  tag: { en: 'Decode group chats, faces, tone and sarcasm — the hidden layer of language.', fr: 'Décode les textos, les visages, le ton et le sarcasme — la couche cachée du langage.' },
  how: {
    en: '<p>Four missions: <b>💬 Group chats</b> — read a conversation and decide how someone feels and what a kind reply would be. <b>🙂 Faces</b> — read the expression and match it to a situation. <b>🎭 Tone meter</b> — sincere or sarcastic? <b>📶 Feelings ladder</b> — order emotion words from mild to intense. Every answer explains the clue.</p>',
    fr: '<p>Quatre missions : <b>💬 Textos de groupe</b> — lis une conversation et devine ce que ressent quelqu’un et quelle réponse serait gentille. <b>🙂 Visages</b> — lis l’expression. <b>🎭 Ton</b> — sincère ou sarcastique ? <b>📶 Échelle des émotions</b> — classe les mots du plus doux au plus intense. Chaque réponse explique l’indice.</p>',
  },
  why: {
    en: 'Autistic readers comprehend highly social texts less well than non-social ones (Brown et al., 2013), and inferences requiring mind-reading are the hardest (Loukusa et al., 2018). Written chats let a hyperlexic teen analyse social cues in print, their strongest channel, and the feelings ladders build precise emotion vocabulary.',
    fr: 'Les lecteurs autistes comprennent moins bien les textes très sociaux (Brown et al., 2013), et les inférences qui demandent de lire les pensées sont les plus difficiles (Loukusa et al., 2018). Les textos écrits permettent d’analyser les indices sociaux à l’écrit, le canal le plus fort, et les échelles bâtissent un vocabulaire émotionnel précis.',
  },
  start(api) {
    const S = () => SOCIAL[api.lang];
    let score = 0, good = 0, total = 0;
    const menu = () => { score = 0; good = 0; total = 0; UI.menu(api, {
      options: [
        { icon: '🎲', name: { en: 'Mixed session', fr: 'Séance mélangée' }, desc: { en: 'A bit of everything', fr: 'Un peu de tout' }, go: () => session(['chat', 'face', 'tone', 'ladder', 'chat', 'tone', 'face', 'chat']) },
        { icon: '💬', name: { en: 'Group chats', fr: 'Textos de groupe' }, desc: { en: 'Feelings & replies', fr: 'Émotions et réponses' }, go: () => session(['chat', 'chat', 'chat', 'chat', 'chat']) },
        { icon: '🙂', name: { en: 'Faces', fr: 'Visages' }, desc: { en: 'Read the expression', fr: 'Lis l’expression' }, go: () => session(Array(8).fill('face')) },
        { icon: '🎭', name: { en: 'Tone meter', fr: 'Détecteur de ton' }, desc: { en: 'Sincere or sarcastic?', fr: 'Sincère ou sarcastique ?' }, go: () => session(Array(8).fill('tone')) },
        { icon: '📶', name: { en: 'Feelings ladder', fr: 'Échelle des émotions' }, desc: { en: 'Mild → intense', fr: 'Doux → intense' }, go: () => session(Array(5).fill('ladder')) },
      ] }); };
    const face = (emo, size = 200) => {
      const P = { happy: { b: [-4, 0], e: 1, m: 'M70 128 Q100 158 130 128', blush: .35 }, sad: { b: [10, -8], e: .7, m: 'M72 142 Q100 120 128 142', tear: 1 }, angry: { b: [-12, 10], e: .6, m: 'M74 138 Q100 124 126 138', red: 1 },
        surprised: { b: [-16, 0], e: 1.4, m: 'O' }, scared: { b: [-10, -8], e: 1.35, m: 'M72 136 Q86 128 100 136 Q114 144 128 136', sweat: 1 }, disgusted: { b: [2, 8], e: .75, m: 'M72 136 Q90 128 104 138 Q116 146 128 132', nose: 1 },
        confused: { b: [-12, 6], e: 1, m: 'M76 134 Q90 128 100 136 Q112 142 124 132', q: 1 }, bored: { b: [0, 0], e: .35, m: 'M78 136 L124 136', tilt: 1 }, embarrassed: { b: [2, -6], e: .8, m: 'M84 134 Q100 142 116 134', blush: .8, sweat: 1, look: 1 } }[emo];
      const eyeH = 10 * P.e, lookX = P.look ? 5 : 0;
      const brow = (x, dir) => { const inner = dir * P.b[1]; return `<path d="M${x - 16} ${72 + P.b[0] + (dir > 0 ? inner : 0)} L${x + 16} ${72 + P.b[0] + (dir < 0 ? inner : 0)}" stroke="#3b2410" stroke-width="7" stroke-linecap="round"/>`; };
      return `<svg viewBox="0 0 200 200" width="${size}" height="${size}"><defs><radialGradient id="fg${emo}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="${P.red ? '#ffb199' : '#ffe28a'}"/><stop offset="1" stop-color="${P.red ? '#ff7a59' : '#f6b73c'}"/></radialGradient></defs>
        <g transform="${P.tilt ? 'rotate(-10 100 100)' : ''}"><circle cx="100" cy="100" r="86" fill="url(#fg${emo})"/>
        ${P.blush ? `<ellipse cx="58" cy="118" rx="16" ry="9" fill="#ff5d73" opacity="${P.blush}"/><ellipse cx="142" cy="118" rx="16" ry="9" fill="#ff5d73" opacity="${P.blush}"/>` : ''}
        ${brow(70, 1)}${brow(130, -1)}
        <ellipse cx="${70 + lookX}" cy="95" rx="${P.e > 1.2 ? 12 : 9}" ry="${eyeH}" fill="#2b1a08"/><ellipse cx="${130 + lookX}" cy="95" rx="${P.e > 1.2 ? 12 : 9}" ry="${eyeH}" fill="#2b1a08"/>
        ${P.e > 1.2 ? `<circle cx="${73 + lookX}" cy="91" r="3" fill="#fff"/><circle cx="${133 + lookX}" cy="91" r="3" fill="#fff"/>` : ''}
        ${P.m === 'O' ? '<ellipse cx="100" cy="140" rx="14" ry="18" fill="#5a1f10"/>' : `<path d="${P.m}" stroke="#5a1f10" stroke-width="7" fill="none" stroke-linecap="round"/>`}
        ${P.tear ? '<path d="M64 108 Q60 122 64 128 Q70 122 64 108Z" fill="#4db6ff"/>' : ''}
        ${P.sweat ? '<path d="M156 58 Q150 72 156 78 Q162 72 156 58Z" fill="#4db6ff"/>' : ''}
        ${P.nose ? '<path d="M92 112 Q100 106 108 112" stroke="#8a4a1a" stroke-width="3" fill="none"/>' : ''}
        ${P.q ? '<text x="160" y="50" font-size="40" font-weight="900" fill="#9b7bff">?</text>' : ''}</g></svg>`;
    };
    const session = plan => {
      let k = 0; score = 0; good = 0; total = 0;
      const root = api.clear();
      const wrap = h('div', { class: 'gwrap', style: { maxWidth: '900px' } });
      root.appendChild(wrap);
      const hud = () => api.hud([[t('score'), score], ['✔', `${good}/${total}`], ['🎯', `${Math.min(k + 1, plan.length)}/${plan.length}`]]);
      const used = { chat: shuffle(S().chats), tone: shuffle(S().tone), ladder: shuffle(S().ladders), face: shuffle(Object.keys(S().faces)) };
      const nextBtn = () => h('button', { class: 'btn primary', style: { marginTop: '10px' }, onclick: () => { k++; step(); } }, t('next') + ' →');
      const mark = (ok, el) => { total++; if (ok) { good++; score += 100; api.sfx('good'); api.xp(3, el); } else api.sfx('bad'); hud(); };
      const choiceSet = (opts, correct, onDone) => {
        const box = h('div', { class: 'choices', style: { gridTemplateColumns: '1fr' } });
        shuffle(opts).forEach(o => box.appendChild(h('button', { class: 'choice', onclick: e => { [...box.children].forEach(b => { b.disabled = true; if (b.textContent === correct) b.classList.add('right'); }); const ok = o === correct; if (!ok) e.currentTarget.classList.add('wrong'); mark(ok, e.currentTarget); onDone(ok); } }, o)));
        return box;
      };
      const step = () => {
        wrap.innerHTML = ''; hud();
        if (k >= plan.length) return end();
        const kind = plan[k];
        if (kind === 'chat') return chat(used.chat.shift() || pick(S().chats));
        if (kind === 'tone') return tone(used.tone.shift() || pick(S().tone));
        if (kind === 'ladder') return ladder(used.ladder.shift() || pick(S().ladders));
        return faceQ(used.face.shift() || pick(Object.keys(S().faces)));
      };
      const chat = c => {
        const phone = h('div', { style: { width: '100%', maxWidth: '380px', margin: '0 auto', background: '#0b0f22', border: '10px solid #1c2344', borderRadius: '36px', padding: '14px', minHeight: '360px', boxShadow: '0 20px 50px rgba(0,0,0,.5)' } },
          h('div', { class: 'center', style: { fontWeight: 800, paddingBottom: '8px', borderBottom: '1px solid var(--line)', marginBottom: '8px' } }, c.title));
        const qBox = h('div', { class: 'col', style: { marginTop: '14px' } });
        wrap.append(h('div', { style: { display: 'grid', gridTemplateColumns: innerWidth < 820 ? '1fr' : '400px 1fr', gap: '20px', alignItems: 'start' } }, phone, qBox));
        const me = c.m[0][0];
        let i = 0;
        const addMsg = () => {
          if (i >= c.m.length) return ask(0);
          const [who, txt] = c.m[i];
          const typing = h('div', { style: { alignSelf: 'flex-start', background: '#1f2750', borderRadius: '16px', padding: '8px 12px', margin: '4px 0', width: '54px' }, html: '<span class="dots">•••</span>' });
          phone.appendChild(typing);
          api.after(api.relaxed ? 700 : 550, () => {
            typing.remove();
            const mine = who === me;
            phone.appendChild(h('div', { class: 'fadein', style: { display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start', margin: '6px 0' } },
              h('div', { style: { fontSize: '11px', color: 'var(--ink3)', margin: '0 6px' } }, who),
              h('div', { style: { background: mine ? 'linear-gradient(135deg,#37e2ff,#4d9bff)' : '#262f5e', color: mine ? '#04122a' : '#fff', borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '9px 13px', maxWidth: '85%', fontSize: '15px' } }, txt)));
            api.sfx('pop'); i++; api.after(350, addMsg);
          });
        };
        const ask = qi => {
          if (qi >= c.qs.length) { qBox.appendChild(nextBtn()); return; }
          const [q, opts, ex] = c.qs[qi];
          qBox.appendChild(h('div', { class: 'card fadein' }, h('div', { style: { fontSize: '18px', fontWeight: 800, marginBottom: '8px' } }, q), choiceSet(opts, opts[0], ok => {
            qBox.appendChild(h('div', { class: 'fb ' + (ok ? 'good' : 'info') + ' fadein' }, '💡 ', ex));
            api.after(500, () => ask(qi + 1));
          })));
        };
        addMsg();
      };
      const tone = ([ctx, line, ans]) => {
        const res = h('div');
        wrap.append(h('div', { class: 'card center fadein', style: { marginTop: '20px' } },
          h('div', { class: 'muted' }, (api.fr ? 'Situation : ' : 'Situation: ') + ctx),
          h('div', { style: { fontSize: '30px', fontWeight: 800, margin: '18px 0', fontFamily: 'Georgia, serif' } }, line),
          h('div', { class: 'row', style: { justifyContent: 'center' } },
            h('button', { class: 'btn lg', onclick: e => go('S', e) }, '💚 ' + (api.fr ? 'Sincère' : 'Sincere')),
            h('button', { class: 'btn lg', onclick: e => go('X', e) }, '🙃 ' + (api.fr ? 'Sarcastique' : 'Sarcastic'))), res));
        const go = (v, e) => {
          if (res.childElementCount) return;
          const ok = v === ans; mark(ok, e.currentTarget);
          const meter = h('div', { style: { height: '14px', borderRadius: '9px', background: 'linear-gradient(90deg,#3ddc84,#ffc545,#ff5d73)', position: 'relative', margin: '14px auto 4px', maxWidth: '420px' } },
            h('div', { style: { position: 'absolute', top: '-6px', left: ans === 'S' ? '8%' : '86%', width: '26px', height: '26px', borderRadius: '50%', background: '#fff', border: '3px solid #0b1020', transition: 'left .6s' } }));
          res.append(meter, h('div', { class: 'row', style: { justifyContent: 'space-between', maxWidth: '420px', margin: '0 auto', fontSize: '12px', color: 'var(--ink3)' } }, h('span', null, api.fr ? 'sincère' : 'sincere'), h('span', null, api.fr ? 'sarcastique' : 'sarcastic')),
            h('div', { class: 'fb ' + (ok ? 'good' : 'info'), style: { marginTop: '10px' } }, ans === 'X' ? (api.fr ? '🙃 Sarcastique : les mots sont positifs, mais la situation est mauvaise — le sens réel est le contraire.' : '🙃 Sarcastic: the words are positive but the situation is bad — the real meaning is the opposite.') : (api.fr ? '💚 Sincère : les mots et la situation vont dans le même sens.' : '💚 Sincere: the words match the situation.')), nextBtn());
        };
      };
      const ladder = words => {
        const order = [];
        const slots = h('div', { class: 'row', style: { justifyContent: 'center', gap: '8px', margin: '16px 0' } });
        const pool = h('div', { class: 'row', style: { justifyContent: 'center', gap: '8px' } });
        const res = h('div');
        const draw = () => {
          slots.innerHTML = ''; pool.innerHTML = '';
          for (let i = 0; i < 4; i++) slots.appendChild(h('div', { style: { minWidth: '130px', height: `${50 + i * 12}px`, borderRadius: '12px', border: '2px dashed var(--line)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '18px', background: order[i] ? `rgba(255,${200 - i * 45},${120 - i * 30},.25)` : '' } }, order[i] || (i + 1)));
          shuffledW.filter(w => !order.includes(w)).forEach(w => pool.appendChild(h('button', { class: 'btn lg', onclick: () => { order.push(w); api.sfx('click'); draw(); if (order.length === 4) check(); } }, w)));
        };
        const shuffledW = shuffle(words);
        const check = () => {
          const ok = order.every((w, i) => w === words[i]); mark(ok, slots);
          res.append(h('div', { class: 'fb ' + (ok ? 'good' : 'info') }, ok ? t('correct') : (api.fr ? 'Ordre attendu : ' : 'Expected order: ') + words.join(' → ')), nextBtn());
        };
        wrap.append(h('div', { class: 'card center fadein', style: { marginTop: '20px' } },
          h('div', { style: { fontSize: '20px', fontWeight: 800 } }, api.fr ? '📶 Classe du plus doux au plus intense' : '📶 Order from mildest to most intense'),
          slots, pool, h('div', { style: { marginTop: '8px' } }, h('button', { class: 'btn sm', onclick: () => { order.length = 0; draw(); } }, t('clear'))), res));
        draw();
      };
      const faceQ = emo => {
        const names = S().faces, scenes = S().scenes;
        const opts = [names[emo], ...sample(Object.keys(names).filter(x => x !== emo), 3).map(x => names[x])];
        const res = h('div');
        wrap.append(h('div', { class: 'card fadein', style: { marginTop: '20px' } },
          h('div', { style: { display: 'grid', gridTemplateColumns: innerWidth < 700 ? '1fr' : '240px 1fr', gap: '20px', alignItems: 'center' } },
            h('div', { class: 'center', html: face(emo, 220) }),
            h('div', null, h('div', { style: { fontSize: '20px', fontWeight: 800, marginBottom: '10px' } }, api.fr ? 'Quelle émotion montre ce visage ?' : 'Which emotion does this face show?'),
              choiceSet(opts, names[emo], ok => res.append(h('div', { class: 'fb info', style: { marginTop: '10px' } }, '🎬 ', api.fr ? 'Situation possible : ' : 'A situation that could cause it: ', scenes[emo]), nextBtn())), res))));
      };
      const end = () => {
        const r = total ? good / total : 0;
        api.finish({ score, stars: UI.starsFor(r), xp: 10 + good * 2, lines: [`${good}/${total} ${api.fr ? 'bonnes lectures' : 'signals read correctly'}`], again: () => session(plan), menu });
      };
      step();
    };
    menu();
  },
});
