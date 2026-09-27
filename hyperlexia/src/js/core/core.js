'use strict';
/* ============================ utilities ============================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(e.dataset, v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat(Infinity)) {
    if (c == null || c === false) continue;
    e.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return e;
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hashStr(s) { let h1 = 1779033703; for (let i = 0; i < s.length; i++) { h1 = Math.imul(h1 ^ s.charCodeAt(i), 3432918353); h1 = h1 << 13 | h1 >>> 19; } return h1 >>> 0; }
const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
function rngFor(seedStr) { return mulberry32(hashStr(seedStr)); }
let RNG = Math.random;
const rand = (n, r = RNG) => Math.floor(r() * n);
const pick = (arr, r = RNG) => arr[Math.floor(r() * arr.length)];
function shuffle(arr, r = RNG) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function sample(arr, n, r = RNG) { return shuffle(arr, r).slice(0, n); }
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\u0153/g, 'oe').replace(/\u00e6/g, 'ae');
const up = s => s.toLocaleUpperCase('fr-CA');
const fmt = n => n.toLocaleString(Store.s.lang === 'fr' ? 'fr-CA' : 'en-CA');
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* ============================ storage ============================ */
const Store = {
  key: 'lexiverse.v1',
  s: null,
  defaults() {
    return { name: '', lang: 'en', sound: true, music: false, relaxed: false, xp: 0, badges: {}, games: {}, streak: { last: '', count: 0 }, langsUsed: {}, created: Date.now(), plays: 0 };
  },
  load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(this.key) || 'null'); } catch (e) { s = null; }
    this.s = Object.assign(this.defaults(), s || {});
  },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.s)); } catch (e) { /* private mode */ } },
  game(id) { if (!this.s.games[id]) this.s.games[id] = { plays: 0, best: 0, stars: 0, data: {} }; return this.s.games[id]; },
};
Store.load();

/* ============================ i18n ============================ */
const T = {
  play: { en: 'Play', fr: 'Jouer' }, back: { en: 'Back', fr: 'Retour' }, start: { en: 'Start', fr: 'Commencer' },
  next: { en: 'Next', fr: 'Suivant' }, again: { en: 'Play again', fr: 'Rejouer' }, menu: { en: 'Menu', fr: 'Menu' },
  score: { en: 'Score', fr: 'Score' }, level: { en: 'Level', fr: 'Niveau' }, lives: { en: 'Lives', fr: 'Vies' }, time: { en: 'Time', fr: 'Temps' },
  best: { en: 'Best', fr: 'Record' }, streak: { en: 'Streak', fr: 'Série' }, hint: { en: 'Hint', fr: 'Indice' }, check: { en: 'Check', fr: 'Vérifier' },
  correct: { en: 'Correct!', fr: 'Exact !' }, wrong: { en: 'Not quite.', fr: 'Pas tout à fait.' }, howto: { en: 'How to play', fr: 'Comment jouer' },
  why: { en: 'Why this helps', fr: 'Pourquoi ça aide' }, close: { en: 'Close', fr: 'Fermer' }, skip: { en: 'Skip', fr: 'Passer' },
  submit: { en: 'Submit', fr: 'Valider' }, clear: { en: 'Clear', fr: 'Effacer' }, shuffle: { en: 'Shuffle', fr: 'Mélanger' },
  done: { en: 'Done', fr: 'Terminé' }, reveal: { en: 'Reveal', fr: 'Révéler' }, round: { en: 'Round', fr: 'Manche' },
  gameover: { en: 'Game over', fr: 'Partie terminée' }, victory: { en: 'Victory!', fr: 'Victoire !' }, newbest: { en: 'New record!', fr: 'Nouveau record !' },
  all: { en: 'All games', fr: 'Tous les jeux' }, words: { en: 'Word craft', fr: 'Mots' }, meaning: { en: 'Meaning & inference', fr: 'Sens et inférence' },
  social: { en: 'Social & emotions', fr: 'Social et émotions' }, numbers: { en: 'Numbers & codes', fr: 'Nombres et codes' }, music: { en: 'Music', fr: 'Musique' },
  relaxed: { en: 'Relaxed mode', fr: 'Mode détente' }, relaxedDesc: { en: 'No timers, gentler speed', fr: 'Sans chrono, vitesse douce' },
  sound: { en: 'Sound', fr: 'Son' }, parents: { en: 'Parents & educators', fr: 'Parents et éducateurs' }, profile: { en: 'Profile', fr: 'Profil' },
  badges: { en: 'Badges', fr: 'Badges' }, gamesPlayed: { en: 'Games played', fr: 'Parties jouées' }, xp: { en: 'XP', fr: 'XP' },
  daily: { en: 'Daily', fr: 'Du jour' }, endless: { en: 'Endless', fr: 'Sans fin' }, easy: { en: 'Easy', fr: 'Facile' }, medium: { en: 'Medium', fr: 'Moyen' }, hard: { en: 'Hard', fr: 'Difficile' }, expert: { en: 'Expert', fr: 'Expert' },
  meaningOf: { en: 'Meaning', fr: 'Sens' }, example: { en: 'Example', fr: 'Exemple' }, found: { en: 'Found', fr: 'Trouvés' },
  notWord: { en: 'Not in word list', fr: 'Pas dans la liste' }, tooShort: { en: 'Too short', fr: 'Trop court' }, already: { en: 'Already found', fr: 'Déjà trouvé' },
  yourName: { en: 'Your call sign', fr: 'Ton nom de code' }, welcome: { en: 'Welcome to the Lexiverse', fr: 'Bienvenue dans le Lexivers' },
  mistakes: { en: 'Mistakes', fr: 'Erreurs' }, stars: { en: 'Stars', fr: 'Étoiles' }, played: { en: 'played', fr: 'parties' },
  new: { en: 'NEW', fr: 'NOUVEAU' }, pause: { en: 'Pause', fr: 'Pause' }, resume: { en: 'Resume', fr: 'Reprendre' }, quit: { en: 'Quit', fr: 'Quitter' },
  accuracy: { en: 'Accuracy', fr: 'Précision' }, evidence: { en: 'Evidence', fr: 'Preuve' }, wave: { en: 'Wave', fr: 'Vague' }, combo: { en: 'Combo', fr: 'Combo' },
  solved: { en: 'Solved', fr: 'Résolu' }, moves: { en: 'Moves', fr: 'Coups' }, levelUp: { en: 'Level up!', fr: 'Niveau supérieur !' },
};
const t = k => (T[k] ? T[k][Store.s.lang] || T[k].en : k);
const L = o => (o == null ? '' : typeof o === 'string' ? o : (o[Store.s.lang] ?? o.en ?? ''));
const isFR = () => Store.s.lang === 'fr';

/* ============================ levels & badges ============================ */
const LEVEL_TITLES = [
  { en: 'Letter Scout', fr: 'Éclaireur des lettres' }, { en: 'Glyph Hunter', fr: 'Chasseur de glyphes' }, { en: 'Word Ranger', fr: 'Ranger des mots' },
  { en: 'Syntax Knight', fr: 'Chevalier de la syntaxe' }, { en: 'Cipher Adept', fr: 'Adepte du chiffre' }, { en: 'Semantic Sage', fr: 'Sage sémantique' },
  { en: 'Lexicon Master', fr: 'Maître du lexique' }, { en: 'Polyglot Prodigy', fr: 'Prodige polyglotte' }, { en: 'Nonillion Navigator', fr: 'Navigateur des nonillions' },
  { en: 'Legend of the Lexiverse', fr: 'Légende du Lexivers' },
];
const levelFromXP = xp => Math.floor(Math.sqrt(xp / 60)) + 1;
const xpForLevel = lv => 60 * (lv - 1) * (lv - 1);
const levelTitle = lv => L(LEVEL_TITLES[Math.min(LEVEL_TITLES.length - 1, Math.floor((lv - 1) / 3))]);

const BADGES = [
  { id: 'first', i: '🚀', n: { en: 'Lift-off', fr: 'Décollage' }, d: { en: 'Play your first game', fr: 'Joue ta première partie' } },
  { id: 'explorer', i: '🧭', n: { en: 'Explorer', fr: 'Explorateur' }, d: { en: 'Try 10 different games', fr: 'Essaie 10 jeux différents' } },
  { id: 'completionist', i: '🌌', n: { en: 'Whole Lexiverse', fr: 'Tout le Lexivers' }, d: { en: 'Play all 25 games', fr: 'Joue aux 25 jeux' } },
  { id: 'polyglot', i: '🗣️', n: { en: 'Polyglot', fr: 'Polyglotte' }, d: { en: 'Play in English and in French', fr: 'Joue en anglais et en français' } },
  { id: 'streak3', i: '🔥', n: { en: 'On Fire', fr: 'En feu' }, d: { en: '3-day streak', fr: 'Série de 3 jours' } },
  { id: 'streak7', i: '☄️', n: { en: 'Unstoppable', fr: 'Inarrêtable' }, d: { en: '7-day streak', fr: 'Série de 7 jours' } },
  { id: 'lv5', i: '⭐', n: { en: 'Rising Star', fr: 'Étoile montante' }, d: { en: 'Reach level 5', fr: 'Atteins le niveau 5' } },
  { id: 'lv10', i: '🌟', n: { en: 'Supernova', fr: 'Supernova' }, d: { en: 'Reach level 10', fr: 'Atteins le niveau 10' } },
  { id: 'lv20', i: '👑', n: { en: 'Lexicon Royalty', fr: 'Royauté du lexique' }, d: { en: 'Reach level 20', fr: 'Atteins le niveau 20' } },
  { id: 'wordsmith', i: '🔐', n: { en: 'Lock Picker', fr: 'Crocheteur' }, d: { en: 'Crack a Lexicon Lock in 3 guesses or fewer', fr: 'Ouvre un Cadenas lexical en 3 essais ou moins' } },
  { id: 'codebreaker', i: '🕵️', n: { en: 'Codebreaker', fr: 'Casseur de codes' }, d: { en: 'Solve 5 ciphers', fr: 'Résous 5 chiffrements' } },
  { id: 'detective', i: '🔎', n: { en: 'Detective', fr: 'Détective' }, d: { en: 'Close a mystery case with all evidence', fr: 'Ferme un dossier avec toutes les preuves' } },
  { id: 'idioms', i: '🎭', n: { en: 'Figure of Speech', fr: 'Figure de style' }, d: { en: 'Solve 20 idioms or expressions', fr: 'Résous 20 expressions' } },
  { id: 'nonillion', i: '🔢', n: { en: 'Nonillionaire', fr: 'Nonillionnaire' }, d: { en: 'Name a nonillion in both scales', fr: 'Nomme un nonillion dans les deux échelles' } },
  { id: 'pianist', i: '🎹', n: { en: 'Virtuoso', fr: 'Virtuose' }, d: { en: 'Get 3 stars on a Pianissimo song', fr: 'Obtiens 3 étoiles sur une chanson' } },
  { id: 'ear', i: '👂', n: { en: 'Golden Ear', fr: "Oreille d'or" }, d: { en: '10 correct in a row in Ear Trainer', fr: "10 bonnes réponses de suite à l'oreille" } },
  { id: 'queenbee', i: '🐝', n: { en: 'Genius Hive', fr: 'Ruche géniale' }, d: { en: 'Reach Genius in Spelling Hive', fr: 'Atteins Génie dans la Ruche' } },
  { id: 'social', i: '💬', n: { en: 'Signal Reader', fr: 'Lecteur de signaux' }, d: { en: 'Finish a Conversation Quest with full connection', fr: 'Termine une Quête avec connexion maximale' } },
  { id: 'typist', i: '⌨️', n: { en: 'Laser Typist', fr: 'Dactylo laser' }, d: { en: 'Reach wave 10 in Word Invaders', fr: 'Atteins la vague 10 des Envahisseurs' } },
  { id: 'threestars', i: '🏆', n: { en: 'Triple Crown', fr: 'Triple couronne' }, d: { en: 'Earn 3 stars in 10 games', fr: 'Obtiens 3 étoiles dans 10 jeux' } },
];
