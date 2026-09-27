# Hyperlexia research + Lexiverse game arcade

Two deliverables live here:

| File | What it is |
|---|---|
| **`Hyperlexia.pdf`** | A 17-page scientific-paper-style narrative review of hyperlexia: every Europe PMC record that mentions hyperlexia in its title or abstract (86 records, 1967–2025) plus 24 related studies, 2 framework papers and 8 clinical/educational sources (120 in total). 15 charts re-plot the published numbers; Appendix A summarises the unique contribution of every source. |
| **`Lexiverse.html`** | A single, self-contained HTML file (no internet needed) with **25 bilingual games** (English / français québécois) built on the review's findings. Open it in any modern browser — desktop, tablet or phone. |

## The games

| # | Game | Category | Targets |
|---|---|---|---|
| 1 | Lexicon Lock / Cadenas lexical | Word craft | Wordle-style deduction + meaning card |
| 2 | Wheel of Words / Roue des mots | Meaning | Proverbs, idioms, expressions québécoises vs two bots |
| 3 | Cipher Station / Station Chiffre | Numbers & codes | Caesar, Atbash, rail fence, pigpen, substitution, Vigenère |
| 4 | Word Invaders / Envahisseurs de mots | Word craft | Typing shooter; bosses show only a definition |
| 5 | Spelling Hive / Ruche à mots | Word craft | 7-letter honeycomb, pangrams, ranks |
| 6 | Grid Blitz / Blitz de grille | Word craft | Boggle-style search with full solver |
| 7 | Word Ladder / Échelle de mots | Word craft | One-letter changes, par scoring |
| 8 | Letter Cascade / Cascade de lettres | Word craft | Falling-letter arcade |
| 9 | Crossword Forge / Forge à mots croisés | Meaning | Generated crosswords from definitions |
| 10 | Four Groups / Quatre groupes | Meaning | Connections-style semantic categories |
| 11 | Idiom Detective / Détective des expressions | Meaning | Literal vs figurative language |
| 12 | Mystery Files / Dossiers mystère | Meaning | Wh-questions + click the evidence sentence |
| 13 | Social Signals / Signaux sociaux | Social | Group chats, faces, tone/sarcasm, emotion ladders |
| 14 | Conversation Quest / Quête de conversation | Social | Branching teen scenarios with written pragmatics tips |
| 15 | Story Sequencer / Chrono-récit | Meaning | Story order, story maps, cause → effect |
| 16 | Proofreader Pro / Correcteur pro | Meaning | Homophones & agreement where meaning decides spelling |
| 17 | Root Lab / Labo des racines | Word craft | Greek/Latin roots shared by EN and FR |
| 18 | Nonillion Navigator / Navigateur de nonillions | Numbers & codes | Short vs long scale, cosmic magnitudes, counting machine |
| 19 | Sequence Lab / Labo des suites | Numbers & codes | Number/letter pattern rules |
| 20 | Signal Decoder / Décodeur de signaux | Numbers & codes | Morse (with tap keying), Braille, NATO, Greek, binary |
| 21 | Staff Speller / Portée magique | Music | Notes that spell words; letters ↔ solfège |
| 22 | Pianissimo | Music | Falling-note piano with karaoke lyrics |
| 23 | Ear Trainer / Oreille d'or | Music | Absolute pitch, intervals, chord moods, melody echo |
| 24 | Definition Snake / Serpent des définitions | Word craft | Eat the letters of the defined word |
| 25 | Grammar Racer / Course grammaticale | Meaning | Steer into the gate with the right word |

Every game has a **“Why this helps”** note citing the research, a help screen, both languages, and works in
**relaxed mode** (🌿: no timers, gentler speed). Progress, XP, streaks, badges and a daily mission are saved in the
browser's local storage on that device only.

## Rebuilding

```bash
# 1. (optional) regenerate word lists — needs `pip install wordfreq` and the npm packages
#    word-list and an-array-of-french-words unpacked into DICTS_DIR
python3 tools/make_wordlists.py DICTS_DIR src/js/data/words.js

# 2. bundle src/ into the single file
python3 tools/build_games.py            # -> Lexiverse.html

# 3. rebuild the paper (needs Playwright's Chromium)
cd paper && python3 build_paper.py && NODE_PATH=$(npm root -g) node print_pdf.js
```

## Testing (Playwright + Chromium)

```bash
NODE_PATH=$(npm root -g) node tools/smoke.js /tmp/shots        # open every game in EN and FR
NODE_PATH=$(npm root -g) node tools/monkey.js 40 fr            # random clicks/keys in every mode
NODE_PATH=$(npm root -g) node tools/functional.js en           # plays core loops correctly and asserts outcomes
NODE_PATH=$(npm root -g) node tools/shots.js /tmp/mid fr       # mid-game screenshots for visual review
NODE_PATH=$(npm root -g) node tools/mobile.js /tmp/mob         # iPhone-sized touch screenshots
```

*The review is an AI-compiled literature synthesis for family and educator use; it is not peer-reviewed and not medical advice.*
