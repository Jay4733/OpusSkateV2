'use strict';
/* ============================ registry ============================ */
const GAMES = [];
function registerGame(g) { GAMES.push(g); }
const CATS = ['words', 'meaning', 'social', 'numbers', 'music'];

function iconSVG(g, size = 84, uid = '') {
  const id = 'gi' + g.id + uid;
  return `<svg class="gicon" viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g.colors[0]}"/><stop offset="1" stop-color="${g.colors[1]}"/></linearGradient>
  <radialGradient id="${id}s" cx=".3" cy=".2" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
  <rect x="3" y="3" width="94" height="94" rx="24" fill="url(#${id})"/><rect x="3" y="3" width="94" height="94" rx="24" fill="url(#${id}s)"/>
  <rect x="3.5" y="3.5" width="93" height="93" rx="23.5" fill="none" stroke="#fff" stroke-opacity=".35"/>
  <g fill="#fff" stroke="none" font-family="Segoe UI, Arial, sans-serif" font-weight="900">${g.glyph}</g></svg>`;
}
const LOGO = `<svg class="logo" viewBox="0 0 100 100"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#37e2ff"/><stop offset=".5" stop-color="#9b7bff"/><stop offset="1" stop-color="#ff4fd8"/></linearGradient></defs>
<circle cx="50" cy="50" r="44" fill="none" stroke="url(#lg)" stroke-width="6"/><ellipse cx="50" cy="50" rx="46" ry="14" fill="none" stroke="#ffc545" stroke-width="3" transform="rotate(-25 50 50)"/>
<text x="50" y="63" text-anchor="middle" font-size="40" font-weight="900" fill="#fff" font-family="Georgia,serif">Lx</text></svg>`;

/* ============================ progress logic ============================ */
const Progress = {
  addXP(n) {
    const before = levelFromXP(Store.s.xp);
    Store.s.xp += Math.max(0, Math.round(n));
    const after = levelFromXP(Store.s.xp);
    Store.save(); App.refreshPlayer();
    if (after > before) {
      Sound.sfx('level'); FX.confetti(160);
      FX.toast(`${t('levelUp')} ${t('level')} ${after} · ${levelTitle(after)}`, '🆙');
      if (after >= 5) this.badge('lv5'); if (after >= 10) this.badge('lv10'); if (after >= 20) this.badge('lv20');
    }
  },
  badge(id) {
    if (Store.s.badges[id]) return;
    const b = BADGES.find(x => x.id === id); if (!b) return;
    Store.s.badges[id] = Date.now(); Store.save();
    setTimeout(() => { Sound.sfx('great'); FX.toast(`${isFR() ? 'Badge débloqué' : 'Badge unlocked'} : ${L(b.n)}`, b.i); }, 400);
  },
  touchStreak() {
    const today = todayKey(), st = Store.s.streak;
    if (st.last === today) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yk = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
    st.count = st.last === yk ? st.count + 1 : 1; st.last = today; Store.save();
    if (st.count >= 3) this.badge('streak3'); if (st.count >= 7) this.badge('streak7');
  },
  played(id) {
    const gs = Store.game(id); gs.plays++; Store.s.plays++;
    Store.s.langsUsed[Store.s.lang] = 1; Store.save();
    this.touchStreak(); this.badge('first');
    const tried = Object.values(Store.s.games).filter(x => x.plays > 0).length;
    if (tried >= 10) this.badge('explorer'); if (tried >= GAMES.length) this.badge('completionist');
    if (Object.keys(Store.s.langsUsed).length >= 2) this.badge('polyglot');
  },
  checkStars() { if (Object.values(Store.s.games).filter(x => x.stars >= 3).length >= 10) this.badge('threestars'); },
};

/* ============================ game API ============================ */
function makeAPI(g, root, hudEl) {
  const cleanups = [], timers = new Set(), rafs = new Set();
  const gs = Store.game(g.id);
  const api = {
    g, root, hudEl,
    get lang() { return Store.s.lang; }, get fr() { return isFR(); }, get relaxed() { return Store.s.relaxed; },
    L, t, sfx: n => Sound.sfx(n), piano: (m, d, v, w) => Sound.piano(m, d, v, w), Sound,
    data: gs.data, save() { Store.save(); },
    hud(items) { hudEl.innerHTML = ''; items.forEach(([k, v]) => hudEl.appendChild(h('div', { class: 'h' }, k + ' ', h('b', null, v)))); },
    xp(n, el) { if (n <= 0) return; Progress.addXP(n); if (el) FX.floatAt(el, `+${Math.round(n)} XP`, '#9dff5b'); },
    record(score, key = 'best') { const cur = key === 'best' ? gs.best : (gs.data[key] || 0); if (score > cur) { if (key === 'best') gs.best = score; else gs.data[key] = score; Store.save(); return cur > 0; } return false; },
    get best() { return gs.best; },
    stars(n) { if (n > gs.stars) { gs.stars = n; Store.save(); Progress.checkStars(); } },
    badge: id => Progress.badge(id),
    confetti: (n, x, y) => FX.confetti(n, x, y), burst: (x, y, c, n) => FX.burst(x, y, c, n), toast: (m, i) => FX.toast(m, i), float: (el, txt, c) => FX.floatAt(el, txt, c),
    clear() { root.innerHTML = ''; return root; },
    on(target, ev, fn, opt) { target.addEventListener(ev, fn, opt); cleanups.push(() => target.removeEventListener(ev, fn, opt)); },
    key(fn) { const f = e => { if (document.querySelector('.modal-back')) return; if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) && !e.target.dataset.gamekeys) return; fn(e); }; api.on(document, 'keydown', f); return f; },
    after(ms, fn) { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; },
    every(ms, fn) { const id = setInterval(fn, ms); timers.add(id); return id; },
    stop(id) { clearTimeout(id); clearInterval(id); timers.delete(id); },
    loop(fn) {
      let last = performance.now(), alive = true, id;
      const step = now => { if (!alive) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; if (!document.hidden) fn(dt, now); id = requestAnimationFrame(step); rafs.add(id); };
      id = requestAnimationFrame(step); rafs.add(id);
      return () => { alive = false; cancelAnimationFrame(id); };
    },
    onExit(fn) { cleanups.push(fn); },
    help() { App.helpModal(g); },
    finish({ score = 0, stars = 0, title, lines = [], again, menu, xp = 0, extra }) {
      const isBest = score > 0 && api.record(score);
      api.stars(stars);
      if (xp) Progress.addXP(xp);
      if (stars >= 2 || isBest) FX.confetti(stars >= 3 ? 200 : 110);
      Sound.sfx(stars >= 1 ? 'win' : 'lose');
      const starRow = h('div', { class: 'stars', html: [1, 2, 3].map(i => i <= stars ? '★' : '<span class="off">★</span>').join('') });
      modal(close => [
        h('div', { class: 'result' },
          h('div', { style: { fontSize: '22px', fontWeight: 800 } }, title || (stars ? t('victory') : t('gameover'))),
          h('div', { class: 'big' }, fmt(score)), starRow,
          isBest ? h('div', { class: 'chip sel', style: { margin: '8px auto' } }, '🏆 ' + t('newbest')) : null,
          xp ? h('div', { class: 'muted' }, `+${xp} XP`) : null,
          ...lines.map(l => h('div', { class: 'muted', style: { marginTop: '6px' } }, l)),
          extra || null,
          h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '18px' } },
            again ? h('button', { class: 'btn primary lg', onclick: () => { close(); again(); } }, '↻ ' + t('again')) : null,
            h('button', { class: 'btn lg', onclick: () => { close(); menu ? menu() : App.closeGame(); } }, menu ? t('menu') : '⌂ ' + t('back'))))
      ], { noClose: true });
    },
    cleanup() { cleanups.splice(0).forEach(f => { try { f(); } catch (e) { console.error(e); } }); timers.forEach(id => { clearTimeout(id); clearInterval(id); }); timers.clear(); rafs.forEach(id => cancelAnimationFrame(id)); rafs.clear(); },
  };
  return api;
}

/* ---------- shared UI builders for games ---------- */
const UI = {
  menu(api, { title, sub, options, extra }) {
    const g = api.g, root = api.clear();
    const wrap = h('div', { class: 'menu fadein' },
      h('div', { class: 'mhead' }, h('div', { html: iconSVG(g, 96, 'm') }), h('div', null, h('div', { class: 'gtitle' }, title || L(g.name)), h('p', { class: 'gsub' }, sub || L(g.tag)))),
      h('div', { class: 'opts' }, options.map(o => h('button', { class: 'opt', onclick: () => { Sound.sfx('click'); o.go(); } }, h('b', null, o.icon ? o.icon + ' ' : '', L(o.name)), h('span', null, L(o.desc || ''))))),
      extra || null,
      h('div', { class: 'why' }, h('b', null, '🧠 ' + t('why') + ' — '), L(g.why)));
    root.appendChild(h('div', { class: 'gwrap' }, wrap));
    return wrap;
  },
  keyboard(onKey, { enter = true, back = true, extraRow } = {}) {
    const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    const kb = h('div', { class: 'kb' });
    rows.forEach((r, i) => {
      const row = h('div', { class: 'kr' });
      if (i === 2 && enter) row.appendChild(h('button', { class: 'wide', dataset: { k: 'Enter' }, onclick: () => onKey('Enter') }, '⏎'));
      r.split('').forEach(c => row.appendChild(h('button', { dataset: { k: c }, onclick: () => onKey(c) }, c)));
      if (i === 2 && back) row.appendChild(h('button', { class: 'wide', dataset: { k: 'Backspace' }, onclick: () => onKey('Backspace') }, '⌫'));
      kb.appendChild(row);
    });
    if (extraRow) kb.appendChild(extraRow);
    return kb;
  },
  definition(entry) {
    if (!entry) return null;
    return h('div', { class: 'fb info fadein' }, h('b', null, `📖 ${up(entry.w)} `), h('span', { class: 'muted' }, `(${L(CAT_NAMES[entry.c] || {})}) `), '— ', entry.d);
  },
  starsFor(ratio) { return ratio >= 0.9 ? 3 : ratio >= 0.65 ? 2 : ratio >= 0.35 ? 1 : 0; },
};

/* ============================ app ============================ */
const App = {
  cur: null, api: null, filter: 'all',
  start() {
    RNG = Math.random;
    BG.start(); FX.init();
    document.documentElement.lang = Store.s.lang === 'fr' ? 'fr-CA' : 'en';
    this.render();
    if (!Store.s.name) this.welcome();
    addEventListener('hashchange', () => this.route());
    this.route();
  },
  route() {
    const id = location.hash.replace('#', '');
    const g = GAMES.find(x => x.id === id);
    if (g && (!this.cur || this.cur.id !== id)) this.openGame(g.id, true);
    else if (!g && this.cur) this.closeGame(true);
  },
  setLang(l) {
    Store.s.lang = l; Store.save(); Lex._c = Lex._c; document.documentElement.lang = l === 'fr' ? 'fr-CA' : 'en';
    if (this.cur) { const id = this.cur.id; this.closeGame(true); this.render(); this.openGame(id, true); } else this.render();
  },
  topbar() {
    const lv = levelFromXP(Store.s.xp), cur = xpForLevel(lv), nxt = xpForLevel(lv + 1);
    return h('div', { class: 'topbar' },
      h('div', { class: 'brand', html: LOGO + '<span>LEXIVERSE</span>' }),
      h('div', { class: 'spacer' }),
      h('div', { class: 'seg', title: 'Language / Langue' },
        h('button', { class: Store.s.lang === 'en' ? 'sel' : '', onclick: () => this.setLang('en') }, 'EN'),
        h('button', { class: Store.s.lang === 'fr' ? 'sel' : '', onclick: () => this.setLang('fr') }, 'FR-QC')),
      h('button', { class: 'btn icon', title: t('sound'), onclick: e => { Store.s.sound = !Store.s.sound; Store.save(); e.currentTarget.textContent = Store.s.sound ? '🔊' : '🔇'; Sound.sfx('click'); } }, Store.s.sound ? '🔊' : '🔇'),
      h('button', { class: 'btn icon' + (Store.s.relaxed ? ' on' : ''), title: t('relaxed') + ' — ' + t('relaxedDesc'), onclick: e => { Store.s.relaxed = !Store.s.relaxed; Store.save(); e.currentTarget.classList.toggle('on', Store.s.relaxed); FX.toast(`${t('relaxed')}: ${Store.s.relaxed ? 'ON' : 'OFF'} — ${t('relaxedDesc')}`, '🌿'); } }, '🌿'),
      h('div', { class: 'player', onclick: () => this.profile() },
        h('div', { class: 'avatar' }, (Store.s.name || '?').slice(0, 2).toUpperCase()),
        h('div', { class: 'hide-sm' }, h('div', { style: { fontWeight: 800, fontSize: '14px', lineHeight: 1.1 } }, Store.s.name || '—'),
          h('div', { style: { fontSize: '11px', color: 'var(--ink3)' } }, `${t('level')} ${lv} · ${levelTitle(lv)}`)),
        h('div', { class: 'xpbar' }, h('i', { id: 'xpfill', style: { width: `${clamp((Store.s.xp - cur) / (nxt - cur) * 100, 0, 100)}%` } }))));
  },
  refreshPlayer() { const tb = $('.topbar'); if (tb) tb.replaceWith(this.topbar()); },
  render() {
    const app = $('#app'); app.innerHTML = '';
    app.appendChild(this.topbar());
    const lv = levelFromXP(Store.s.xp);
    const tried = Object.values(Store.s.games).filter(x => x.plays > 0).length;
    const nb = Object.keys(Store.s.badges).length;
    const bigNums = isFR() ? ['10⁶ million', '10⁹ milliard', '10¹² billion', '10¹⁵ billiard', '10¹⁸ trillion', '10²⁴ quadrillion', '10³⁰ quintillion', '10⁵⁴ nonillion']
      : ['10⁶ million', '10⁹ billion', '10¹² trillion', '10¹⁵ quadrillion', '10¹⁸ quintillion', '10²¹ sextillion', '10²⁴ septillion', '10²⁷ octillion', '10³⁰ nonillion', '10³³ decillion'];
    app.appendChild(h('section', { class: 'hero' },
      h('div', { class: 'hero-main' },
        h('h1', null, h('span', { class: 'grad' }, 'LEXIVERSE')),
        h('p', null, isFR()
          ? `${GAMES.length} jeux où les lettres, les nombres et la musique deviennent des superpouvoirs. Décode, déduis, compose — en français et en anglais.`
          : `${GAMES.length} games where letters, numbers and music become superpowers. Decode, deduce, compose — in English and in French.`),
        h('div', { class: 'row' },
          h('button', { class: 'btn primary lg', onclick: () => { const pool = GAMES.filter(g => this.filter === 'all' || g.cat === this.filter); this.openGame(pick(pool, Math.random).id); } }, '🎲 ' + (isFR() ? 'Surprends-moi' : 'Surprise me')),
          h('button', { class: 'btn lg', onclick: () => this.parents() }, '🧠 ' + t('parents'))),
        h('div', { class: 'ticker' }, bigNums.join('  ·  '))),
      h('div', { class: 'hero-stats' },
        h('div', { class: 'stat' }, h('div', { class: 'v' }, lv), h('div', { class: 'l' }, `${t('level')} · ${levelTitle(lv)}`)),
        h('div', { class: 'stat' }, h('div', { class: 'v' }, fmt(Store.s.xp)), h('div', { class: 'l' }, 'XP')),
        h('div', { class: 'stat' }, h('div', { class: 'v' }, `🔥 ${Store.s.streak.count || 0}`), h('div', { class: 'l' }, isFR() ? 'Jours de suite' : 'Day streak')),
        h('div', { class: 'stat', style: { cursor: 'pointer' }, onclick: () => this.profile() }, h('div', { class: 'v' }, `${nb}/${BADGES.length}`), h('div', { class: 'l' }, `${t('badges')} · ${tried}/${GAMES.length} ${isFR() ? 'jeux essayés' : 'games tried'}`)))));
    const chips = h('div', { class: 'filters' }, ['all', ...CATS].map(c => h('button', { class: 'chip' + (this.filter === c ? ' sel' : ''), onclick: () => { this.filter = c; this.render(); } }, t(c))));
    app.appendChild(chips);
    const grid = h('div', { class: 'grid' });
    GAMES.filter(g => this.filter === 'all' || g.cat === this.filter).forEach(g => {
      const gs = Store.s.games[g.id];
      const card = h('button', { class: 'gcard fadein', style: { '--glow': g.colors[0] }, onclick: () => this.openGame(g.id), title: L(g.name) },
        h('div', { class: 'gnum' }, String(g.n).padStart(2, '0')),
        !gs || !gs.plays ? h('div', { class: 'newdot' }, t('new')) : null,
        h('div', { html: iconSVG(g) }),
        h('h3', null, L(g.name)),
        h('div', { class: 'fr' }, Store.s.lang === 'fr' ? g.name.en : g.name.fr),
        h('div', { class: 'tag' }, L(g.tag)),
        h('div', { class: 'meta' },
          h('span', { class: 'stars', html: [1, 2, 3].map(i => i <= (gs ? gs.stars : 0) ? '★' : '<span class="off">★</span>').join('') }),
          h('span', null, gs && gs.best ? `${t('best')} ${fmt(gs.best)}` : ''), h('span', { class: 'spacer' }), h('span', null, t(g.cat))));
      grid.appendChild(card);
    });
    app.appendChild(grid);
    app.appendChild(h('div', { class: 'footer' },
      isFR() ? 'Chaque jeu s’appuie sur la recherche sur l’hyperlexie (voir « Parents et éducateurs »). Progrès sauvegardés sur cet appareil seulement.'
        : 'Every game is grounded in hyperlexia research (see “Parents & educators”). Progress is saved on this device only.'));
  },
  openGame(id, fromHash) {
    const g = GAMES.find(x => x.id === id); if (!g) return;
    if (this.cur) this.closeGame(true);
    Sound.init();
    if (!fromHash && location.hash !== '#' + id) { history.pushState(null, '', '#' + id); }
    const hud = h('div', { class: 'hud' });
    const body = h('div', { class: 'gbody' });
    const scr = h('div', { class: 'gscreen' },
      h('div', { class: 'gbar' },
        h('button', { class: 'btn icon', title: t('back'), onclick: () => this.closeGame() }, '←'),
        h('div', { class: 'gt', html: iconSVG(g, 34, 'b') + `<span class="hide-sm">${escapeHtml(L(g.name))}</span>` }),
        hud,
        h('button', { class: 'btn icon', title: t('howto'), onclick: () => this.helpModal(g) }, '?'),
        h('button', { class: 'btn icon', title: t('sound'), onclick: e => { Store.s.sound = !Store.s.sound; Store.save(); e.currentTarget.textContent = Store.s.sound ? '🔊' : '🔇'; } }, Store.s.sound ? '🔊' : '🔇')),
      body);
    document.body.appendChild(scr);
    document.body.style.overflow = 'hidden';
    BG.paused = true;
    this.cur = g; this.scr = scr;
    this.api = makeAPI(g, body, hud);
    Progress.played(g.id);
    try { g.start(this.api); } catch (e) { console.error(e); body.appendChild(h('div', { class: 'gwrap' }, h('div', { class: 'fb bad' }, 'Error: ' + e.message))); }
  },
  closeGame(fromHash) {
    if (!this.cur) return;
    try { this.api.cleanup(); } catch (e) { console.error(e); }
    $$('.modal-back').forEach(m => m.remove());
    this.scr.remove(); this.cur = null; this.api = null;
    document.body.style.overflow = ''; BG.paused = false;
    if (!fromHash && location.hash) history.pushState(null, '', location.pathname + location.search);
    this.render();
  },
  helpModal(g) {
    modal(close => [
      h('div', { class: 'row' }, h('div', { html: iconSVG(g, 64, 'h') }), h('div', null, h('h2', null, L(g.name)), h('div', { class: 'muted' }, L(g.tag)))),
      h('h3', null, '🎮 ' + t('howto')), h('div', { html: L(g.how) }),
      h('h3', null, '🧠 ' + t('why')), h('div', { class: 'why' }, L(g.why)),
      h('div', { class: 'row', style: { justifyContent: 'flex-end', marginTop: '14px' } }, h('button', { class: 'btn primary', onclick: close }, t('close')))]);
  },
  welcome() {
    let name = '';
    modal(close => {
      const inp = h('input', { class: 'field', placeholder: isFR() ? 'ex. : NOVA, Pixel, Allegro…' : 'e.g. NOVA, Pixel, Allegro…', maxlength: 16, oninput: e => name = e.target.value, style: { width: '100%', fontSize: '20px' } });
      setTimeout(() => inp.focus(), 50);
      const go = () => { Store.s.name = (name || 'Nova').trim().slice(0, 16); Store.save(); close(); this.render(); FX.confetti(120); Sound.sfx('win'); };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
      return [
        h('div', { class: 'center' }, h('div', { html: LOGO.replace('class="logo"', 'width="90" height="90"') }), h('h2', null, t('welcome')),
          h('p', { class: 'muted' }, 'Choose your language · Choisis ta langue'),
          h('div', { class: 'seg', style: { margin: '6px auto 14px' } },
            h('button', { class: Store.s.lang === 'en' ? 'sel' : '', onclick: () => { Store.s.lang = 'en'; Store.save(); close(); this.render(); this.welcome(); } }, 'English'),
            h('button', { class: Store.s.lang === 'fr' ? 'sel' : '', onclick: () => { Store.s.lang = 'fr'; Store.save(); close(); this.render(); this.welcome(); } }, 'Français (QC)'))),
        h('label', { class: 'muted' }, t('yourName')), inp,
        h('div', { class: 'row', style: { justifyContent: 'flex-end', marginTop: '16px' } }, h('button', { class: 'btn primary lg', onclick: go }, '🚀 ' + t('start')))];
    }, { noClose: true });
  },
  profile() {
    const lv = levelFromXP(Store.s.xp);
    modal(close => {
      const nameIn = h('input', { class: 'field', value: Store.s.name, maxlength: 16, onchange: e => { Store.s.name = e.target.value.trim().slice(0, 16) || Store.s.name; Store.save(); this.refreshPlayer(); } });
      const rows = GAMES.map(g => { const gs = Store.s.games[g.id] || { plays: 0, best: 0, stars: 0 }; return h('tr', null, h('td', null, L(g.name)), h('td', null, gs.plays), h('td', null, gs.best ? fmt(gs.best) : '—'), h('td', { class: 'stars', html: '★'.repeat(gs.stars) + '<span class="off">' + '★'.repeat(3 - gs.stars) + '</span>' })); });
      return [
        h('div', { class: 'row' }, h('div', { class: 'avatar', style: { width: '64px', height: '64px', fontSize: '24px' } }, (Store.s.name || '?').slice(0, 2).toUpperCase()),
          h('div', { class: 'grow' }, h('h2', { style: { margin: 0 } }, `${t('level')} ${lv} · ${levelTitle(lv)}`), h('div', { class: 'muted' }, `${fmt(Store.s.xp)} XP · ${isFR() ? 'prochain niveau à' : 'next level at'} ${fmt(xpForLevel(lv + 1))} XP`))),
        h('div', { class: 'row', style: { margin: '12px 0' } }, h('label', { class: 'muted' }, t('yourName')), nameIn),
        h('h3', null, `🏅 ${t('badges')} (${Object.keys(Store.s.badges).length}/${BADGES.length})`),
        h('div', { class: 'badges' }, BADGES.map(b => h('div', { class: 'badge' + (Store.s.badges[b.id] ? '' : ' locked') }, h('div', { class: 'bi' }, b.i), h('b', null, L(b.n)), h('span', null, L(b.d))))),
        h('h3', null, '📊 ' + (isFR() ? 'Statistiques' : 'Stats')),
        h('table', { class: 'simple' }, h('thead', null, h('tr', null, h('th', null, isFR() ? 'Jeu' : 'Game'), h('th', null, t('gamesPlayed')), h('th', null, t('best')), h('th', null, t('stars')))), h('tbody', null, rows)),
        h('div', { class: 'row', style: { justifyContent: 'space-between', marginTop: '16px' } },
          h('button', { class: 'btn sm bad', onclick: () => { if (confirm(isFR() ? 'Effacer toute la progression ?' : 'Erase all progress?')) { const lang = Store.s.lang; Store.s = Store.defaults(); Store.s.lang = lang; Store.save(); close(); this.render(); this.welcome(); } } }, isFR() ? 'Réinitialiser' : 'Reset progress'),
          h('button', { class: 'btn primary', onclick: close }, t('close')))];
    }, { wide: true });
  },
  parents() {
    const fr = isFR();
    const facts = fr ? [
      ['6–21 %', 'des enfants autistes présentent une hyperlexie ; 84 % des cas publiés sont autistes (Ostrolenk et al., 2017).'],
      ['30 mois', 'âge médian où l’intérêt pour les lettres apparaît chez les enfants autistes — même âge qu’au développement typique (Ostrolenk et al., 2024, Montréal).'],
      ['57 %', 'de la compréhension en lecture s’explique par les connaissances sémantiques (Brown et al., 2013) : le sens, pas le décodage, est la cible.'],
      ['Tau-U 0,85', 'effet des représentations visuelles et graphiques sur la compréhension (Lee et al., 2025).'],
      ['RR 1,22', 'amélioration globale avec la musicothérapie (Cochrane, 2022) ; la musique est une force relative en autisme.'],
      ['62 %', 'du vocabulaire s’explique par l’exposition à la langue — le bilinguisme n’est pas nuisible (Gonzalez-Barrero et Nadig, 2018, Montréal).'],
    ] : [
      ['6–21%', 'of autistic children show hyperlexia; 84% of published cases are autistic (Ostrolenk et al., 2017).'],
      ['30 months', 'median age at which letter interest emerges in autistic children — the same age as in typical development (Ostrolenk et al., 2024, Montréal).'],
      ['57%', 'of reading-comprehension variance is explained by semantic knowledge (Brown et al., 2013): meaning, not decoding, is the target.'],
      ['Tau-U 0.85', 'effect of pictorial/graphic representations on comprehension (Lee et al., 2025).'],
      ['RR 1.22', 'global improvement with music therapy (Cochrane, 2022); music is a relative strength in autism.'],
      ['62%', 'of vocabulary variance is explained by language exposure — bilingualism is not harmful (Gonzalez-Barrero & Nadig, 2018, Montréal).'],
    ];
    const principles = fr ? [
      'P1 Commencer par l’écrit — les consignes écrites augmentent le langage fonctionnel (Kistner, 1988).',
      'P2 Relier le code au sens — chaque mot trouvé reçoit une définition.',
      'P3 Monter du mot à la phrase, puis au paragraphe — là où la compréhension flanche.',
      'P4 Répondre, puis prouver — cliquer la phrase qui prouve la réponse.',
      'P5 Rendre le sens visible — diagrammes, lignes du temps, jauges d’émotions.',
      'P6 Enseigner l’implicite explicitement — inférences, expressions, ton, sarcasme.',
      'P7 Miser sur les forces alliées — grands nombres, codes, notation musicale, oreille.',
      'P8 Deux langues, statut égal — tout le contenu en anglais et en français québécois.',
      'P9 Défi et choix — niveau d’un bon élève de 17 ans, libre choix, mode détente sans chrono.',
    ] : [
      'P1 Lead with print — written prompts increase functional language (Kistner, 1988).',
      'P2 Bridge code to meaning — every word found comes with a definition.',
      'P3 Climb from words to sentences to paragraphs — where comprehension breaks down.',
      'P4 Ask, then prove — click the sentence that proves the answer.',
      'P5 Make meaning visible — diagrams, timelines, emotion meters.',
      'P6 Teach the implicit explicitly — inference, idioms, tone, sarcasm.',
      'P7 Harness allied strengths — big numbers, codes, staff notation, ear training.',
      'P8 Two languages, equal status — all content in English and Québec French.',
      'P9 Challenge and choice — pitched at a strong 17-year-old, free choice, untimed relaxed mode.',
    ];
    modal(close => [
      h('h2', null, '🧠 ' + t('parents')),
      h('p', null, fr ? 'L’hyperlexie : lecture précoce, souvent autodidacte, qui dépasse la compréhension, avec une forte attirance pour l’écrit. Ce n’est pas la lecture qui pose problème, mais la construction du sens : vocabulaire, inférence, langage figuré et social. Ces jeux misent sur les forces (lettres, nombres, musique, deux langues) pour travailler ces cibles.'
        : 'Hyperlexia: precocious, often self-taught reading that outpaces comprehension, with an intense attraction to print. The challenge is not reading but meaning-making: vocabulary depth, inference, figurative and social language. These games use the strengths (letters, numbers, music, two languages) to train those targets.'),
      h('div', { class: 'badges', style: { gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))' } }, facts.map(([v, d]) => h('div', { class: 'badge', style: { textAlign: 'left' } }, h('div', { style: { fontSize: '26px', fontWeight: 900, fontFamily: 'var(--mono)', color: 'var(--cyan)' } }, v), h('span', { style: { fontSize: '13px', color: 'var(--ink2)' } }, d)))),
      h('h3', null, fr ? 'Neuf principes de conception' : 'Nine design principles'),
      h('ul', null, principles.map(p => h('li', null, p))),
      h('h3', null, fr ? 'Chaque jeu et sa cible' : 'Every game and its target'),
      h('table', { class: 'simple' }, h('tbody', null, GAMES.map(g => h('tr', null, h('td', { style: { width: '32%' } }, h('b', null, L(g.name))), h('td', null, L(g.why)))))),
      h('p', { class: 'muted', style: { fontSize: '13px', marginTop: '12px' } }, fr ? 'Sources complètes : revue « Hyperlexia.pdf » (120 sources). Ceci n’est pas un avis médical ; l’évaluation et la thérapie relèvent de professionnels qualifiés.'
        : 'Full sources: the “Hyperlexia.pdf” review (120 sources). Not medical advice; assessment and therapy belong with qualified professionals.'),
      h('div', { class: 'row', style: { justifyContent: 'flex-end' } }, h('button', { class: 'btn primary', onclick: close }, t('close')))], { wide: true });
  },
};
