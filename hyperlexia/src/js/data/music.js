'use strict';
// Shared music helpers (note names, staff, keyboard) + public-domain melodies.
const Music = {
  EN: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
  FR: ['do', 'do♯', 'ré', 'ré♯', 'mi', 'fa', 'fa♯', 'sol', 'sol♯', 'la', 'la♯', 'si'],
  LETTER_TO_SOLF: { C: 'do', D: 'ré', E: 'mi', F: 'fa', G: 'sol', A: 'la', B: 'si' },
  name(m, lang, oct = false) { const n = (lang === 'fr' ? this.FR : this.EN)[((m % 12) + 12) % 12]; return oct && lang !== 'fr' ? n + (Math.floor(m / 12) - 1) : n; },
  parse(s) { const mm = s.match(/^([A-G])(#|b)?(-?\d)$/); const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[mm[1]]; return base + (mm[2] === '#' ? 1 : mm[2] === 'b' ? -1 : 0) + (+mm[3] + 1) * 12; },
  isBlack: m => [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12),
  // diatonic index for staff placement (natural notes)
  dia(m) { const pc = ((m % 12) + 12) % 12, oct = Math.floor(m / 12) - 1; const d = { 0: 0, 1: 0, 2: 1, 3: 1, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6 }[pc]; return oct * 7 + d; },
  staffSVG(notes, { clef = 'treble', w = 520, hl = -1, labels = null } = {}) {
    const top = 50, gap = 14, bottomLine = top + gap * 4;
    const ref = clef === 'treble' ? this.dia(this.parse('E4')) : this.dia(this.parse('G2'));
    let s = `<svg viewBox="0 0 ${w} 170" width="100%" style="max-width:${w}px"><rect width="${w}" height="170" rx="14" fill="#fbf7ec"/>`;
    for (let i = 0; i < 5; i++) s += `<line x1="16" x2="${w - 16}" y1="${top + i * gap}" y2="${top + i * gap}" stroke="#2b2b2b" stroke-width="1.6"/>`;
    s += clef === 'treble' ? `<text x="20" y="${top + 50}" font-size="64" fill="#1b1b1b" font-family="Segoe UI Symbol, Noto Music, Apple Symbols, serif">𝄞</text>` : `<text x="22" y="${top + 34}" font-size="46" fill="#1b1b1b" font-family="Segoe UI Symbol, Noto Music, Apple Symbols, serif">𝄢</text>`;
    const x0 = 90, dx = Math.min(64, (w - x0 - 20) / Math.max(1, notes.length));
    notes.forEach((m, i) => {
      const x = x0 + i * dx + dx / 2, st = this.dia(m) - ref, y = bottomLine - st * (gap / 2);
      for (let l = -2; l >= st; l -= 2) s += `<line x1="${x - 14}" x2="${x + 14}" y1="${bottomLine - l * gap / 2}" y2="${bottomLine - l * gap / 2}" stroke="#2b2b2b" stroke-width="1.6"/>`;
      for (let l = 10; l <= st; l += 2) s += `<line x1="${x - 14}" x2="${x + 14}" y1="${bottomLine - l * gap / 2}" y2="${bottomLine - l * gap / 2}" stroke="#2b2b2b" stroke-width="1.6"/>`;
      const col = i === hl ? '#ff4f7b' : '#141414';
      s += `<ellipse cx="${x}" cy="${y}" rx="8.5" ry="6.5" transform="rotate(-20 ${x} ${y})" fill="${col}"/>`;
      s += st < 4 ? `<line x1="${x + 7.5}" x2="${x + 7.5}" y1="${y}" y2="${y - 38}" stroke="${col}" stroke-width="1.8"/>` : `<line x1="${x - 7.5}" x2="${x - 7.5}" y1="${y}" y2="${y + 38}" stroke="${col}" stroke-width="1.8"/>`;
      if (this.isBlack(m)) s += `<text x="${x - 24}" y="${y + 6}" font-size="20" fill="${col}">♯</text>`;
      if (labels && labels[i]) s += `<text x="${x}" y="160" font-size="16" text-anchor="middle" font-weight="800" fill="#6b2bff" font-family="Segoe UI, Arial">${labels[i]}</text>`;
    });
    return s + '</svg>';
  },
  // Piano keyboard DOM component. opts: from, to (midi), onNote(m), label('en'|'fr'|null), keymap {midi: key}
  keyboard({ from = 60, to = 83, onNote, label = null, keymap = null, height = 150 } = {}) {
    const whites = []; for (let m = from; m <= to; m++) if (!this.isBlack(m)) whites.push(m);
    const el = h('div', { style: { position: 'relative', height: height + 'px', width: '100%', maxWidth: whites.length * 52 + 'px', margin: '0 auto', userSelect: 'none', touchAction: 'none' } });
    const ww = 100 / whites.length, keys = {};
    whites.forEach((m, i) => { const k = h('div', { dataset: { m }, style: { position: 'absolute', left: i * ww + '%', width: `calc(${ww}% - 2px)`, top: 0, bottom: 0, background: 'linear-gradient(180deg,#fff,#e8e8ee)', borderRadius: '0 0 8px 8px', boxShadow: 'inset 0 -6px 0 #cfcfd8', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '8px', color: '#445', fontSize: '12px', fontWeight: 800, transition: 'background .08s' } }, label ? this.name(m, label) : '', keymap && keymap[m] ? h('span', { class: 'kbdkey', style: { marginTop: '3px', color: '#223' } }, keymap[m]) : null); el.appendChild(k); keys[m] = k; });
    for (let m = from; m <= to; m++) if (this.isBlack(m)) {
      const wi = whites.indexOf(m - 1); if (wi < 0) continue;
      const k = h('div', { dataset: { m }, style: { position: 'absolute', left: `calc(${(wi + 1) * ww}% - ${ww * 0.32}%)`, width: ww * 0.62 + '%', top: 0, height: '62%', background: 'linear-gradient(180deg,#333,#0c0c12)', borderRadius: '0 0 6px 6px', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '4px', color: '#ccd', fontSize: '10px', fontWeight: 700 } }, label ? this.name(m, label) : '', keymap && keymap[m] ? h('span', { style: { fontSize: '10px', color: '#ffc545' } }, keymap[m]) : null);
      el.appendChild(k); keys[m] = k;
    }
    const press = m => { const k = keys[m]; if (!k) return; k.style.background = this.isBlack(m) ? 'linear-gradient(180deg,#6b5bff,#2a1f8a)' : 'linear-gradient(180deg,#c9f4ff,#37e2ff)'; setTimeout(() => k.style.background = this.isBlack(m) ? 'linear-gradient(180deg,#333,#0c0c12)' : 'linear-gradient(180deg,#fff,#e8e8ee)', 160); };
    el.addEventListener('pointerdown', e => { const t2 = e.target.closest('[data-m]'); if (!t2) return; const m = +t2.dataset.m; press(m); onNote && onNote(m); });
    return { el, keys, press, flash(m, color, ms = 500) { const k = keys[m]; if (!k) return; const old = k.style.background; k.style.background = color; setTimeout(() => k.style.background = this.isBlack ? old : old, ms); } };
  },
  // tracker-style computer keyboard map (two octaves + 3) starting at base C
  trackerMap(base) {
    const low = { z: 0, s: 1, x: 2, d: 3, c: 4, v: 5, g: 6, b: 7, h: 8, n: 9, j: 10, m: 11 };
    const high = { q: 12, 2: 13, w: 14, 3: 15, e: 16, r: 17, 5: 18, t: 19, 6: 20, y: 21, 7: 22, u: 23, i: 24, 9: 25, o: 26, 0: 27, p: 28 };
    const map = {}, rev = {}; for (const [k, v] of Object.entries({ ...low, ...high })) { map[k] = base + v; rev[base + v] = k.toUpperCase(); }
    return { map, rev };
  },
};
// Songs: "NOTE:beats" tokens; lyrics per note (optional, per language)
const SONGS = [
  { id: 'ode', name: { en: 'Ode to Joy — Beethoven', fr: 'Hymne à la joie — Beethoven' }, bpm: 100, lvl: 1,
    n: 'E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 E4:1.5 D4:0.5 D4:2 E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 D4:1.5 C4:0.5 C4:2 D4:1 D4:1 E4:1 C4:1 D4:1 E4:0.5 F4:0.5 E4:1 C4:1 D4:1 E4:0.5 F4:0.5 E4:1 D4:1 C4:1 D4:1 G3:2 E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 D4:1.5 C4:0.5 C4:2' },
  { id: 'jacques', name: { en: 'Are You Sleeping (Frère Jacques)', fr: 'Frère Jacques' }, bpm: 110, lvl: 1,
    n: 'C4:1 D4:1 E4:1 C4:1 C4:1 D4:1 E4:1 C4:1 E4:1 F4:1 G4:2 E4:1 F4:1 G4:2 G4:0.5 A4:0.5 G4:0.5 F4:0.5 E4:1 C4:1 G4:0.5 A4:0.5 G4:0.5 F4:0.5 E4:1 C4:1 C4:1 G3:1 C4:2 C4:1 G3:1 C4:2',
    ly: { fr: 'Frè re Jac ques Frè re Jac ques Dor mez vous? Dor mez vous? Son nez les ma ti nes Son nez les ma ti nes Ding dang dong. Ding dang dong.', en: 'Are you sleep ing, Are you sleep ing, Bro ther John? Bro ther John? Mor ning bells are ring ing, Mor ning bells are ring ing, Ding dang dong. Ding dang dong.' } },
  { id: 'lune', name: { en: 'Au clair de la lune (French folk)', fr: 'Au clair de la lune' }, bpm: 100, lvl: 1,
    n: 'C4:1 C4:1 C4:1 D4:1 E4:2 D4:2 C4:1 E4:1 D4:1 D4:1 C4:4 C4:1 C4:1 C4:1 D4:1 E4:2 D4:2 C4:1 E4:1 D4:1 D4:1 C4:4 D4:1 D4:1 D4:1 D4:1 A3:2 A3:2 D4:1 C4:1 B3:1 A3:1 G3:4 C4:1 C4:1 C4:1 D4:1 E4:2 D4:2 C4:1 E4:1 D4:1 D4:1 C4:4',
    ly: { fr: 'Au clair de la lu ne, mon a mi Pier rot, Prê te- moi ta plu me pour é crire un mot. Ma chan del l’est mor te, je n’ai plus de feu. Ou vre- moi ta por te pour l’a mour de Dieu.' } },
  { id: 'twinkle', name: { en: 'Twinkle, Twinkle, Little Star', fr: 'Ah ! vous dirai-je, maman' }, bpm: 100, lvl: 1,
    n: 'C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2 F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2 G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2 G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2 C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2 F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2',
    ly: { en: 'Twin kle, twin kle, lit tle star, How I won der what you are! Up a bove the world so high, Like a dia mond in the sky. Twin kle, twin kle, lit tle star, How I won der what you are!', fr: 'Ah\u00a0! vous di rai- je, ma man, Ce qui cau se mon tour ment\u00a0? Pa pa veut que je rai sonne Comme u ne gran de per sonne\u00a0; Moi, je dis que les bon bons Va lent mieux que la rai son.' } },
  { id: 'minuet', name: { en: 'Minuet in G — Petzold', fr: 'Menuet en sol — Petzold' }, bpm: 120, lvl: 2,
    n: 'D5:1 G4:0.5 A4:0.5 B4:0.5 C5:0.5 D5:1 G4:1 G4:1 E5:1 C5:0.5 D5:0.5 E5:0.5 F#5:0.5 G5:1 G4:1 G4:1 C5:1 D5:0.5 C5:0.5 B4:0.5 A4:0.5 B4:1 C5:0.5 B4:0.5 A4:0.5 G4:0.5 F#4:1 G4:0.5 A4:0.5 B4:0.5 G4:0.5 A4:3' },
  { id: 'elise', name: { en: 'Für Elise (opening) — Beethoven', fr: 'La lettre à Élise (début) — Beethoven' }, bpm: 150, lvl: 2,
    n: 'E5:0.5 D#5:0.5 E5:0.5 D#5:0.5 E5:0.5 B4:0.5 D5:0.5 C5:0.5 A4:1.5 C4:0.5 E4:0.5 A4:0.5 B4:1.5 E4:0.5 G#4:0.5 B4:0.5 C5:1.5 E4:0.5 E5:0.5 D#5:0.5 E5:0.5 D#5:0.5 E5:0.5 B4:0.5 D5:0.5 C5:0.5 A4:1.5 C4:0.5 E4:0.5 A4:0.5 B4:1.5 E4:0.5 C5:0.5 B4:0.5 A4:3' },
  { id: 'morning', name: { en: 'Morning Mood — Grieg', fr: 'Au matin — Grieg' }, bpm: 110, lvl: 2,
    n: 'G4:0.5 E4:0.5 D4:0.5 C4:0.5 D4:0.5 E4:0.5 G4:0.5 E4:0.5 D4:0.5 C4:0.5 D4:0.5 E4:0.5 D4:0.5 E4:0.5 G4:0.5 E4:0.5 G4:0.5 A4:0.5 E4:0.5 A4:0.5 G4:0.5 E4:0.5 D4:0.5 C4:2' },
  { id: 'greensleeves', name: { en: 'Greensleeves (traditional)', fr: 'Greensleeves (traditionnel)' }, bpm: 110, lvl: 2,
    n: 'A4:1 C5:2 D5:1 E5:1.5 F5:0.5 E5:1 D5:2 B4:1 G4:1.5 A4:0.5 B4:1 C5:2 A4:1 A4:1.5 G#4:0.5 A4:1 B4:2 G#4:1 E4:2 A4:1 C5:2 D5:1 E5:1.5 F5:0.5 E5:1 D5:2 B4:1 G4:1.5 A4:0.5 B4:1 C5:1.5 B4:0.5 A4:1 G#4:1.5 F#4:0.5 G#4:1 A4:3' },
  { id: 'mountain', name: { en: 'In the Hall of the Mountain King — Grieg', fr: 'Dans l’antre du roi de la montagne — Grieg' }, bpm: 130, lvl: 3,
    n: 'A3:0.5 B3:0.5 C4:0.5 D4:0.5 E4:0.5 C4:0.5 E4:1 D#4:0.5 B3:0.5 D#4:1 D4:0.5 A#3:0.5 D4:1 A3:0.5 B3:0.5 C4:0.5 D4:0.5 E4:0.5 C4:0.5 E4:0.5 A4:0.5 G4:0.5 E4:0.5 C4:0.5 E4:0.5 G4:2' },
  { id: 'korobeiniki', name: { en: 'Korobeiniki (Russian folk)', fr: 'Korobeïniki (air russe)' }, bpm: 140, lvl: 3,
    n: 'E5:1 B4:0.5 C5:0.5 D5:1 C5:0.5 B4:0.5 A4:1 A4:0.5 C5:0.5 E5:1 D5:0.5 C5:0.5 B4:1.5 C5:0.5 D5:1 E5:1 C5:1 A4:1 A4:2 D5:1.5 F5:0.5 A5:1 G5:0.5 F5:0.5 E5:1.5 C5:0.5 E5:1 D5:0.5 C5:0.5 B4:1 B4:0.5 C5:0.5 D5:1 E5:1 C5:1 A4:1 A4:2' },
];
SONGS.forEach(s => {
  let t0 = 0;
  s.notes = s.n.split(' ').map(tok => { const [nm, b] = tok.split(':'); const o = { m: Music.parse(nm), t: t0, d: +b }; t0 += +b; return o; });
  s.beats = t0;
  s.lyr = {}; if (s.ly) for (const l in s.ly) s.lyr[l] = s.ly[l].split(' ');
});
