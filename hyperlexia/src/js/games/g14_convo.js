'use strict';
registerGame({
  id: 'convo', n: 14, cat: 'social', colors: ['#ff4fd8', '#ffc545'],
  glyph: `<circle cx="34" cy="38" r="12"/><path d="M16 74 Q34 50 52 74Z"/><circle cx="66" cy="38" r="12" fill-opacity=".75"/><path d="M48 74 Q66 50 84 74Z" fill-opacity=".75"/>
    <path d="M38 16 h24 a6 6 0 0 1 6 6 v6 a6 6 0 0 1 -6 6 h-12 l-6 5 v-5 h-6 a6 6 0 0 1 -6 -6 v-6 a6 6 0 0 1 6 -6Z" fill="#fff"/><text x="50" y="29" font-size="9" text-anchor="middle" fill="#ff4fd8">hi!</text>`,
  name: { en: 'Conversation Quest', fr: 'Quête de conversation' },
  tag: { en: 'Branching teen scenarios: choose your words, watch the connection grow.', fr: 'Des scénarios d’ados : choisis tes mots et fais grandir la connexion.' },
  how: {
    en: '<p>Read what the other person says, then choose your reply. Each choice changes the <b>Connection</b> meter and unlocks a written <b>pragmatics tip</b> explaining why it works (or doesn’t). At the end you get a <b>script card</b> of the best replies to keep.</p>',
    fr: '<p>Lis ce que l’autre personne dit, puis choisis ta réponse. Chaque choix change la jauge de <b>Connexion</b> et débloque un <b>conseil</b> écrit qui explique pourquoi ça marche (ou pas). À la fin, tu reçois une <b>fiche-script</b> des meilleures réponses.</p>',
  },
  why: {
    en: 'Written prompts rapidly increased appropriate verbal responses in a hyperlexic child and generalised to real settings (Kistner et al., 1988). Social scripts and pragmatic coaching are core supports (And Next Comes L; Stein et al., 2015). Here every social rule is written down — the channel hyperlexic teens process best.',
    fr: 'Des consignes écrites ont rapidement augmenté les réponses verbales appropriées d’un enfant hyperlexique, avec généralisation (Kistner et al., 1988). Les scripts sociaux et l’entraînement pragmatique sont des soutiens clés (Stein et al., 2015). Ici, chaque règle sociale est écrite — le canal que les ados hyperlexiques traitent le mieux.',
  },
  start(api) {
    const D = api.data; D.best = D.best || {};
    const menu = () => UI.menu(api, {
      options: CONVO[api.lang].map((s, i) => ({ icon: s.icon, name: s.title, desc: D.best[api.lang + i] != null ? { en: `Best connection: ${D.best[api.lang + i]}%`, fr: `Meilleure connexion : ${D.best[api.lang + i]} %` } : { en: `With ${s.npc}`, fr: `Avec ${s.npc}` }, go: () => play(i) })),
    });
    const play = si => {
      const S = CONVO[api.lang][si];
      const me = Store.s.name || (api.fr ? 'moi' : 'me');
      let k = 0, conn = 0, script = [];
      const max = S.steps.length * 2;
      const root = api.clear();
      const stage = h('div', { style: { position: 'relative', borderRadius: '24px', overflow: 'hidden', minHeight: '520px', background: `linear-gradient(160deg,${S.bg[0]},${S.bg[1]})`, border: '1px solid var(--line)', padding: '20px', display: 'flex', flexDirection: 'column' } });
      const meter = h('div', { class: 'progress', style: { height: '14px' } }, h('i', { style: { width: '0%', background: 'linear-gradient(90deg,#ff4fd8,#ffc545)' } }));
      const avatar = h('div', { style: { fontSize: '110px', lineHeight: 1, textAlign: 'center', transition: 'transform .3s', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.4))' } }, S.av);
      const mood = h('div', { style: { position: 'absolute', top: '70px', right: 'calc(50% - 90px)', fontSize: '34px' } }, '');
      const log = h('div', { class: 'col', style: { gap: '8px', flex: 1, marginTop: '14px' } });
      const choices = h('div', { class: 'col', style: { gap: '8px', marginTop: '12px' } });
      stage.append(h('div', { class: 'row' }, h('b', null, `${S.icon} ${S.title}`), h('span', { class: 'spacer' }), h('span', { class: 'muted' }, api.fr ? 'Connexion' : 'Connection'), h('div', { style: { width: '180px' } }, meter)),
        h('div', { style: { position: 'relative', marginTop: '10px' } }, avatar, mood, h('div', { class: 'center', style: { fontWeight: 800 } }, S.npc)), log, choices);
      root.appendChild(h('div', { class: 'gwrap', style: { maxWidth: '820px' } }, stage));
      const bubble = (who, text, mine, extra) => h('div', { class: 'fadein', style: { alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '86%', background: mine ? 'linear-gradient(135deg,#37e2ff,#9b7bff)' : 'rgba(255,255,255,.1)', color: mine ? '#061024' : 'var(--ink)', border: mine ? '0' : '1px solid var(--line)', borderRadius: '16px', padding: '10px 14px', fontSize: '17px' } }, h('div', { style: { fontSize: '11px', opacity: .7, fontWeight: 700 } }, who), text, extra || null);
      const hud = () => { meter.firstChild.style.width = `${clamp(conn / max * 100, 0, 100)}%`; api.hud([[api.fr ? 'Connexion' : 'Connection', `${Math.round(clamp(conn / max * 100, 0, 100))}%`], ['💬', `${Math.min(k + 1, S.steps.length)}/${S.steps.length}`]]); };
      const step = () => {
        if (k >= S.steps.length) return end();
        const [line, opts] = S.steps[k];
        log.innerHTML = ''; choices.innerHTML = '';
        log.appendChild(bubble(S.npc, line.replace('{me}', me), false));
        api.sfx('pop');
        shuffle(opts).forEach(o => choices.appendChild(h('button', { class: 'choice', onclick: () => choose(o) }, o[0].replace('{me}', me))));
        hud();
      };
      const choose = ([reply, react, delta, tip]) => {
        choices.innerHTML = '';
        conn += delta;
        const best = S.steps[k][1].reduce((a, b) => b[2] > a[2] ? b : a);
        script.push([S.steps[k][0], best[0]]);
        log.appendChild(bubble(me, reply.replace('{me}', me), true));
        api.after(500, () => {
          log.appendChild(bubble(S.npc, react, false));
          mood.textContent = delta >= 2 ? '💖' : delta === 1 ? '🙂' : delta === 0 ? '😐' : '💢';
          avatar.style.transform = delta >= 2 ? 'scale(1.08) translateY(-6px)' : delta < 0 ? 'scale(.94) rotate(-4deg)' : '';
          api.sfx(delta >= 2 ? 'good' : delta < 0 ? 'bad' : 'pop');
          if (delta >= 2) api.xp(3, avatar);
          log.appendChild(h('div', { class: 'fb ' + (delta >= 2 ? 'good' : delta < 0 ? 'bad' : 'info') + ' fadein' }, '💡 ', tip));
          log.appendChild(h('button', { class: 'btn primary', style: { alignSelf: 'flex-end' }, onclick: () => { k++; mood.textContent = ''; avatar.style.transform = ''; step(); } }, t('next') + ' →'));
          hud();
        });
      };
      const end = () => {
        const pct = Math.round(clamp(conn / max * 100, 0, 100));
        D.best[api.lang + si] = Math.max(D.best[api.lang + si] || 0, pct); api.save();
        if (pct >= 100) api.badge('social');
        const card = h('div', { style: { textAlign: 'left', marginTop: '12px', background: 'rgba(255,255,255,.06)', borderRadius: '12px', padding: '12px', maxHeight: '240px', overflow: 'auto' } },
          h('b', null, '📝 ' + (api.fr ? 'Fiche-script à garder' : 'Script card to keep')),
          ...script.map(([q, a]) => h('div', { style: { marginTop: '8px', fontSize: '14px' } }, h('div', { class: 'muted' }, q.replace('{me}', me)), h('div', null, '→ ', a.replace('{me}', me)))));
        api.finish({ score: pct * 10, stars: pct >= 95 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0, xp: 10 + Math.round(pct / 10), title: `${api.fr ? 'Connexion' : 'Connection'} ${pct}%`, extra: card, again: () => play(si), menu });
      };
      step();
    };
    menu();
  },
});
