'use strict';
/* ============================ lexicon ============================ */
const Lex = {
  _c: {},
  get(lang = Store.s.lang) {
    if (this._c[lang]) return this._c[lang];
    const words = WORDLIST[lang].split(' ');
    const set = new Set(), disp = new Map(), rank = new Map(), byLen = {};
    words.forEach((w, i) => {
      const n = norm(w);
      if (!/^[a-z]+$/.test(n)) return;
      if (!disp.has(n)) { disp.set(n, w); rank.set(n, i); }
      set.add(n);
      (byLen[n.length] = byLen[n.length] || []).push(n);
    });
    for (const k in byLen) byLen[k] = Array.from(new Set(byLen[k]));
    const gl = (GLOSSARY[lang] || []);
    const gmap = new Map();
    gl.forEach(g => { const n = norm(g.w); gmap.set(n, g); if (/^[a-z]+$/.test(n)) { set.add(n); if (!disp.has(n)) disp.set(n, g.w); } });
    return (this._c[lang] = { words, set, disp, rank, byLen, gloss: gl, gmap });
  },
  valid(w, lang) { return this.get(lang).set.has(norm(w)); },
  display(n, lang) { return this.get(lang).disp.get(norm(n)) || n; },
  define(w, lang) { return this.get(lang).gmap.get(norm(w)) || null; },
  common(len, count, lang) { return (this.get(lang).byLen[len] || []).slice(0, count); },
  // glossary entries filtered by normalized letter length / category
  glossWhere(lang, f) { return this.get(lang).gloss.filter(f); },
  letterFreq: {
    en: 'e12.7 t9.1 a8.2 o7.5 i7.0 n6.7 s6.3 h6.1 r6.0 d4.3 l4.0 c2.8 u2.8 m2.4 w2.4 f2.2 g2.0 y2.0 p1.9 b1.5 v1.0 k0.8 j0.15 x0.15 q0.1 z0.07',
    fr: 'e14.7 a7.6 i7.5 s7.9 n7.1 t7.2 r6.6 u6.3 l5.5 o5.8 d3.7 c3.3 m3.0 p3.0 v1.8 q1.4 f1.1 b0.9 g0.9 h0.7 j0.5 x0.4 y0.3 z0.1 k0.05 w0.05',
  },
  freqTable(lang) { const o = {}; this.letterFreq[lang].split(' ').forEach(p => { o[p[0]] = parseFloat(p.slice(1)); }); return o; },
  randLetter(lang, r = RNG) {
    const f = this.freqTable(lang); let tot = 0; for (const k in f) tot += f[k];
    let x = r() * tot; for (const k in f) { x -= f[k]; if (x <= 0) return k; } return 'e';
  },
};
const CAT_NAMES = {
  mus: { en: 'Music', fr: 'Musique' }, sci: { en: 'Science & space', fr: 'Science et espace' }, num: { en: 'Numbers & math', fr: 'Nombres et maths' },
  lang: { en: 'Language', fr: 'Langue' }, emo: { en: 'Feelings', fr: 'Émotions' }, tech: { en: 'Technology', fr: 'Technologie' },
  nat: { en: 'World & nature', fr: 'Monde et nature' }, qc: { en: 'Québec', fr: 'Québec' },
};
