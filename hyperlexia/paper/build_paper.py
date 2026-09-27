#!/usr/bin/env python3
"""Build the hyperlexia review as print-ready HTML (then print_pdf.js -> PDF)."""
import re
import os
from html import escape
from refs import R
from charts import C, SEQ, svg, t, hbar, grouped_hbar, forest, stacked100, vbar, dotrange
import content as K

HERE = os.path.dirname(os.path.abspath(__file__))
REF = {r['key']: r for r in R}

# ------------------------------------------------------------------ figures
FIG = {}


def fig(name, body, caption, cls=''):
    FIG[name] = (body, caption, cls)


fig('decades', vbar(['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'],
                    [2, 3, 22, 6, 14, 7, 6], h=140, ymax=25, ticks=(0, 5, 10, 15, 20, 25),
                    note='Records per decade'),
    'Records with <i>hyperlexia</i> in the title indexed in Europe PMC, by decade (n = 60; the 2020s run to September 2026). The 1980s were the most active decade; recent output is concentrated in Montréal groups.')


def flow_svg():
    W = 340
    o = []

    def box(x, y, w, h, lines, fill='#ffffff', stroke=C['axis']):
        o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" fill="{fill}" stroke="{stroke}"/>')
        for i, ln in enumerate(lines):
            o.append(t(x + w / 2, y + 13 + i * 11, ln, 8.8 if i == 0 else 8, 'middle', C['ink'], 700 if i == 0 else 400))

    def arrow(x, y1, y2):
        o.append(f'<line x1="{x}" y1="{y1}" x2="{x}" y2="{y2 - 5}" stroke="{C["ink2"]}" stroke-width="1.2"/>')
        o.append(f'<path d="M{x - 4},{y2 - 7} L{x},{y2} L{x + 4},{y2 - 7}" fill="{C["ink2"]}"/>')
    box(4, 6, 106, 40, ['Europe PMC', '"hyperlexia OR', 'hyperlexic" · n = 236'])
    box(117, 6, 106, 40, ['Targeted searches', 'comprehension, music,', 'bilingual, 2e · n = 26'])
    box(230, 6, 106, 40, ['Grey literature', 'clinical & educational', 'web · n = 8'])
    arrow(57, 46, 96)
    o.append(t(62, 66, '− 149 mention', 7.6, 'start', C['orange'], 700))
    o.append(t(62, 76, 'only in full text', 7.6, 'start', C['orange']))
    o.append(t(62, 86, '− 1 correction', 7.6, 'start', C['orange']))
    box(4, 96, 106, 40, ['Hyperlexia records', 'term in title/abstract', 'n = 86'])
    arrow(57, 136, 160)
    arrow(170, 46, 160)
    arrow(283, 46, 160)
    box(4, 160, 332, 40, ['Sources synthesised · n = 120', '86 hyperlexia records (70 with abstracts, 16 bibliographic only)', '+ 24 targeted studies + 2 framework papers + 8 web sources'], fill='#eef4fc', stroke=C['blue'])
    return svg(W, 206, ''.join(o))


fig('flow', flow_svg(), 'Source identification and selection. Unlike a formal systematic review, no records were excluded for quality; every hyperlexia record was retained and summarised (Appendix A).')


def svr_svg():
    W, H = 340, 250
    x0, x1, y0, y1 = 44, 330, 214, 14
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    o = []
    quads = [
        (x0, y1, 'Dyslexic profile', 'weak decoding · good language', '#fdf0ea'),
        (mx, y1, 'Good reader', 'strong decoding · good language', '#eaf7f1'),
        (x0, my, '"Garden-variety" poor reader', 'weak decoding · weak language', C['neutral']),
        (mx, my, 'Hyperlexic profile', 'strong decoding · weak language', '#eef4fc'),
    ]
    for (qx, qy, a, b, fill) in quads:
        o.append(f'<rect x="{qx:.1f}" y="{qy:.1f}" width="{mx - x0 - 2:.1f}" height="{my - y1 - 2:.1f}" rx="4" fill="{fill}"/>')
        ty = qy + 24 if qy <= y1 + 1 else qy + (my - y1) - 28
        o.append(t(qx + (mx - x0) / 2, ty, a, 9, 'middle', C['ink'], 700))
        o.append(t(qx + (mx - x0) / 2, ty + 12, b, 7.8, 'middle', C['ink2']))
    # dashed arrow: goal of comprehension teaching (hyperlexic -> good reader)
    cx = mx + (x1 - mx) / 2
    o.append(f'<line x1="{cx:.1f}" y1="{my + 34:.1f}" x2="{cx:.1f}" y2="{my - 26:.1f}" stroke="{C["blue"]}" stroke-width="2" stroke-dasharray="4 3"/>')
    o.append(f'<path d="M{cx - 5:.1f},{my - 20:.1f} L{cx:.1f},{my - 29:.1f} L{cx + 5:.1f},{my - 20:.1f}" fill="{C["blue"]}"/>')
    o.append(t(cx + 6, my + 1, 'comprehension', 7.6, 'start', C['blue'], 700))
    o.append(t(cx + 6, my + 10, 'teaching', 7.6, 'start', C['blue'], 700))
    o.append(f'<line x1="{x0}" y1="{y0}" x2="{x1}" y2="{y0}" stroke="{C["ink2"]}"/><line x1="{x0}" y1="{y0}" x2="{x0}" y2="{y1}" stroke="{C["ink2"]}"/>')
    o.append(t((x0 + x1) / 2, y0 + 14, 'Decoding (word recognition) →', 8.6, 'middle', C['ink'], 700))
    o.append(f'<text x="14" y="{(y0 + y1) / 2}" font-size="8.6" font-weight="700" fill="{C["ink"]}" text-anchor="middle" transform="rotate(-90 14 {(y0 + y1) / 2})">Language comprehension →</text>')
    o.append(t(x1, y0 + 27, 'RC = D × LC  (Gough &amp; Tunmer, 1986)', 7.8, 'end', C['muted'], italic=True))
    return svg(W, 246, ''.join(o))


fig('svr', svr_svg(), 'The Simple View of Reading as a map of reader profiles (conceptual, not data). Hyperlexia occupies the strong-decoding / weak-language quadrant; intervention aims to move language comprehension upward while preserving decoding.')

fig('prev', dotrange([
    ('Hyperlexia in autistic children|(systematic review, range)', None, 6, 21, '6–21%', C['blue']),
    ('Early hyperlexic traits, autistic|preschoolers (n = 155)', 9, None, None, '9%', C['blue']),
    ('Hyperlexia profile, autistic|6–9-year-olds (US national)', 9, None, None, '9%', C['blue']),
    ('Hyperlexic / poor comprehender,|autistic 8-year-olds (n = 53)', 18.9, None, None, '19%', C['blue']),
    ('Hyperlexic-like style, girls|with ADHD (n = 36)', 27.8, None, None, '28%', C['blue']),
    ('Intense letter interest, autistic|children < 7 y (two methods)', None, 20, 37, '20–37%', C['blue']),
    ('Hyperlexic case reports that|involve autism (N = 82)', 84, None, None, '84%', C['blue']),
], label_w=150),
    'Reported rates across studies. Rows measure different constructs and must not be compared as a trend: rows 1–5 are hyperlexic reading profiles, row 6 is <i>interest</i> in letters, and row 7 is the share of published hyperlexia cases that are autistic. Sources: Ostrolenk 2017; Solazzo 2021; Wei 2015; Åsberg Johnels 2019a,b; Ostrolenk 2024.')

fig('interest', grouped_hbar(['Letters', 'Numbers'],
                             [('Autistic (n = 391)', C['blue'], [20, 17]),
                              ('Non-autistic clinical (n = 310)', C['orange'], [3, 2])],
                             xmax=25, ticks=(0, 5, 10, 15, 20, 25), unit='%', label_w=60),
    'Children under 7 whose clinical report described an <i>intense or exclusive</i> interest in letters or numbers (Ostrolenk et al., 2024, Study 1).')

fig('or', forest([('Greater interest in letters', 2.78, 1.55, 5.17, '2.78 [1.55–5.17]'),
                  ('Greater interest in numbers', 3.49, 1.85, 6.96, '3.49 [1.85–6.96]')],
                 xmin=0.5, xmax=10, ticks=(0.5, 1, 2, 5, 10), ref=1, log=True, label_w=118, est_w=78,
                 left_note='lower odds', right_note='higher odds in autism'),
    'Adjusted odds ratios (95% CI, log scale) for a greater level of interest in autistic vs non-autistic clinical children, controlling for age and assessing clinician (Ostrolenk et al., 2024).')

fig('age', grouped_hbar(['Letters', 'Numbers'],
                        [('Autistic', C['blue'], [30, 30]),
                         ('Non-autistic clinical', C['orange'], [36, 36]),
                         ('Typically developing', C['aqua'], [28.5, 30])],
                        xmax=40, ticks=(0, 10, 20, 30, 40), fmt=lambda v: f'{v:g}', unit=' mo', label_w=60),
    'Median age (months) at which interest in letters and in numbers emerged, caregiver interview (n = 138 autistic, 99 clinical, 76 typical). Autistic and typical children did not differ; the clinical group was later (letters HR = 0.73, p = .029; numbers HR = 0.63, p = .002).')

fig('lang', stacked100([('Autistic (138)', [24, 37, 13, 26]),
                        ('Clinical (99)', [2, 6, 23, 69]),
                        ('Typical (76)', [0, 3, 5, 92])],
                       ['No oral language', 'Isolated words', '3-word sentences', 'Sentences with verbs'],
                       ['#86b6ef', '#5598e7', '#1c5cab', '#104281'], label_w=80),
    'Most complex oral language reported by caregivers in the same cohort. Letter interest emerged on schedule even though 61% of autistic children had no speech or single words only.')


def model_svg():
    W, H = 340, 236
    o = []
    cols = [(8, 'STRENGTHS', C['blue'], ['Orthographic memory', 'Pattern detection', 'Pitch perception', 'Number systems', 'Print motivation']),
            (122, 'BRIDGES', C['aqua'], ['Write it out', 'Word ↔ picture/definition', 'Question scaffolds', 'Graphic organisers', 'Music ↔ emotion']),
            (236, 'TARGETS', C['orange'], ['Vocabulary depth', 'Paragraph meaning', 'Inference', 'Figurative language', 'Social pragmatics'])]
    for (x, head, col, items) in cols:
        o.append(t(x + 48, 14, head, 8.6, 'middle', col, 700))
        for i, it in enumerate(items):
            y = 22 + i * 38
            o.append(f'<rect x="{x}" y="{y}" width="96" height="28" rx="6" fill="#fff" stroke="{col}" stroke-width="1.6"/>')
            o.append(t(x + 48, y + 17, it, 7.9, 'middle', C['ink'], 700 if False else 400))
    for i in range(5):
        y = 36 + i * 38
        for xa in (104, 218):
            o.append(f'<line x1="{xa + 1}" y1="{y}" x2="{xa + 15}" y2="{y}" stroke="{C["ink2"]}" stroke-width="1.2"/>')
            o.append(f'<path d="M{xa + 13},{y - 3} L{xa + 18},{y} L{xa + 13},{y + 3}" fill="{C["ink2"]}"/>')
    o.append(t(170, 222, 'Veridical mapping (Mottron 2013) links the strengths; teaching supplies the bridges.', 7.6, 'middle', C['muted'], italic=True))
    return svg(W, 230, ''.join(o))


fig('model', model_svg(), 'A strength-to-target model synthesised from the reviewed literature (conceptual). Perception-first strengths are routed through print-based bridges toward the comprehension skills that lag.')

fig('brown', hbar([('Semantic knowledge', 57, None), ('Decoding skill', 55, None)], xmax=100,
                  ticks=(0, 25, 50, 75, 100), unit='%', label_w=100),
    'Variance in reading comprehension explained by single predictors across 36 studies of autistic readers (Brown et al., 2013). Overall comprehension difference: g = −0.7 SD; socially loaded texts were harder than non-social ones.')

fig('wei', hbar([('Higher-achieving', 39, None), ('Lower-achieving', 32, None),
                 ('Hypercalculia', 20, None), ('Hyperlexia', 9, None)], xmax=50,
                ticks=(0, 10, 20, 30, 40, 50), unit='%', label_w=100),
    'Reading/maths achievement profiles in a nationally representative US sample of autistic children aged 6–9 (Wei et al., 2015). All four profiles lost ground in passage comprehension over time.')

fig('asberg', hbar([('Poor readers', 25, '25 (47%)'), ('Skilled readers', 18, '18 (34%)'),
                    ('Hyperlexic / poor comprehenders', 10, '10 (19%)')], xmax=30,
                   ticks=(0, 10, 20, 30), label_w=140),
    'Reading profiles at age 8 in a Swedish population cohort of autistic children identified by screening before age 3 (n = 53; Åsberg Johnels et al., 2019b). Oral-language weakness at 3 predicted the hyperlexic profile.')


def mcgill_svg():
    W = 340
    o = []
    x0, x1 = 20, 320
    mid = (x0 + x1) / 2
    o.append(f'<rect x="{x0}" y="30" width="{mid - x0 - 2}" height="26" rx="5" fill="{C["neutral"]}"/>')
    o.append(f'<rect x="{mid}" y="30" width="{x1 - mid}" height="26" rx="5" fill="{C["blue"]}"/>')
    o.append(t((x0 + mid) / 2, 47, '6-week no-intervention baseline', 8.6, 'middle', C['ink'], 700))
    o.append(t((mid + x1) / 2, 47, '6-week tablet intervention', 8.6, 'middle', '#ffffff', 700))
    for x, lab in [(x0, 'T1'), (mid, 'T2'), (x1, 'T3')]:
        o.append(f'<line x1="{x}" y1="22" x2="{x}" y2="64" stroke="{C["ink"]}" stroke-width="1.4"/>')
        o.append(t(x, 16, lab, 8.4, 'middle', C['ink'], 700))
    o.append(t(mid, 78, 'Assessments: reading comprehension · receptive & expressive language', 7.8, 'middle', C['ink2']))
    # groups
    groups = [('ASD + hyperlexia', 8, C['blue']), ('ASD without hyperlexia', 7, C['orange']), ('Typically developing', 15, C['aqua'])]
    y = 96
    for name, n, col in groups:
        o.append(t(x0 + 118, y + 9, name, 8.4, 'end', C['ink']))
        for k in range(n):
            o.append(f'<circle cx="{x0 + 128 + k * 11}" cy="{y + 6}" r="4.2" fill="{col}"/>')
        o.append(t(x0 + 128 + n * 11 + 2, y + 9, f'n = {n}', 8.2, 'start', C['ink'], 700))
        y += 18
    o.append(t(mid, y + 10, 'Content: word-, phrase- and sentence-level comprehension via word–picture matching', 7.6, 'middle', C['muted'], italic=True))
    return svg(W, y + 16, ''.join(o))


fig('mcgill', mcgill_svg(), 'Design of the McGill parent-supported tablet intervention (Macdonald, Luk &amp; Quintin, 2022; N = 30). Reading-comprehension gains were significantly larger for ASD + hyperlexia than for typical peers (p = .023).')

fig('cochrane', forest([
    ('Symptom severity reduction*', 0.83, 0.24, 1.41, '0.83 [0.24, 1.41]'),
    ('Quality of life', 0.28, 0.06, 0.49, '0.28 [0.06, 0.49]'),
    ('Social interaction', 0.26, -0.05, 0.57, '0.26 [−0.05, 0.57]'),
    ('Non-verbal communication', 0.26, -0.03, 0.55, '0.26 [−0.03, 0.55]'),
    ('Verbal communication', 0.30, -0.18, 0.78, '0.30 [−0.18, 0.78]')],
    xmin=-0.5, xmax=1.5, ticks=(-0.5, 0, 0.5, 1, 1.5), ref=0, label_w=118, est_w=80,
    left_note='favours control', right_note='favours music therapy'),
    'Music therapy vs placebo therapy or standard care, standardised mean differences (95% CI) immediately post-intervention (Geretsegger et al., 2022; Cochrane). *Reported as SMD −0.83; sign reversed so that right = benefit. Global improvement: RR 1.22 [1.06, 1.40]; certainty moderate for severity, quality of life and global improvement, low/very low for the rest.')

fig('bilingual', hbar([('Vocabulary', 62, None), ('Morphology', 49, None)], xmax=100,
                      ticks=(0, 25, 50, 75, 100), unit='%', label_w=80),
    'Variance explained by the current amount of exposure to a language in school-age children with and without autism in Montréal (n = 30 autistic, 47 typical; Gonzalez-Barrero &amp; Nadig, 2018). Exposure mattered as much for autistic children as for typical ones.')

# ------------------------------------------------------------------ tables
TAB = {}


def table(name, head, rows, caption, widths=None, cls=''):
    col = ''.join(f'<col style="width:{w}"/>' for w in widths) if widths else ''
    h = ''.join(f'<th>{x}</th>' for x in head)
    b = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
    TAB[name] = (f'<table class="{cls}"><colgroup>{col}</colgroup><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table>', caption)


table('defs', ['Source', 'Definition / emphasis'], [
    ['Silberberg &amp; Silberberg 1967 [[c:silberberg1967]]', 'Specific word-recognition skill far above other abilities in young children.'],
    ['Elliott &amp; Needleman 1976 [[c:elliott1976]]', 'A distinct syndrome.'],
    ['Richman &amp; Kitchell 1981; Cohen 1987, 1997 [[c:richman1981,cohen1987,cohen1997]]', 'Variant or subgroup of developmental language disorder, not dyslexia.'],
    ['Snowling &amp; Frith 1986 [[c:snowling1986]]', '"True" hyperlexia = failure to build large units of meaning in low-verbal fluent readers.'],
    ['Nation 1999 [[c:nation1999]]', 'Tail of normal variation in reading components plus compulsive print exposure.'],
    ['Grigorenko et al. 2003 [[c:grigorenko2003]]', 'Superability: unexpected single-word reading in a developmental disorder.'],
    ['Ostrolenk et al. 2017 [[c:ostrolenk2017]]', 'Reading > comprehension or IQ; early and untaught; strong orientation to print; usually with a neurodevelopmental condition.'],
    ['Zhang &amp; Joshi 2019 [[c:zhang2019]]', 'Good decoding with poor listening and reading comprehension (Simple View).'],
    ['Practice literature [[c:meaningfulspeech]]', 'A learning style, frequently with gestalt language processing.'],
], 'How the definition of hyperlexia has evolved.', widths=['38%', '62%'])

table('types', ['Type', 'Who', 'Key features', 'Course and support'], [
    ['1', 'Typically developing early readers', 'Reads very early, comprehension usually good', 'Gap closes as peers learn to read; no treatment needed [[c:pennington1987]]'],
    ['2', 'Autistic children', 'Letter/number fascination in infancy as a splinter skill; strong memory (dates, plates, scripts); social and language difficulties', 'Persistent; specialised education, speech and occupational therapy'],
    ['3', 'Early readers with "autistic-like" traits', 'Interactive, affectionate, better eye contact; language and peer difficulties', 'Traits fade; mainstream classroom; good outcomes [[c:transmitter]]'],
], "Treffert's three types of hyperlexia [[c:treffert2011,treffertcenter]].", widths=['7%', '22%', '38%', '33%'])

table('conds', ['Condition', 'Hyperlexia evidence'], [
    ['Autism', 'Most common context; 6–21% of autistic children [[c:ostrolenk2017]]'],
    ['ADHD (girls)', '10 of 36 with hyperlexic-like style; more autistic features [[c:asberg2019a]]'],
    ['22q11.2 deletion', '&gt; 2/3 read above IQ expectations [[c:tobia2018]]'],
    ['Turner syndrome', 'Reading above age and IQ with good comprehension [[c:temple1996]]'],
    ['Prader-Willi', 'Case report [[c:burd1989]]'],
    ['West syndrome', 'Kanji, numbers, Roman letters read at 3 y [[c:ichiba1990]]'],
    ['Tuberous sclerosis', 'Non-speaking girl with hyperlexia and hypercalculia [[c:pacheva2014]]'],
    ['Tourette + PDD', 'Chance co-occurrence p = 3.39 × 10<sup>−12</sup> [[c:burd1988]]'],
    ['Language disorder / SLI', 'Hyperlexia as SLI subgroup [[c:cohen1997,richman1981]]'],
    ['Acquired (adults)', 'Frontal/cingulate lesions, encephalopathy (Box 1)'],
], 'Conditions in which hyperlexia has been reported.', widths=['30%', '70%'])

table('interv', ['Study', 'Design · N', 'Approach', 'Outcome'], [
    ['Kistner 1988 [[c:kistner1988]]', 'Single case', 'Written prompts for speech', 'Rapid gains in appropriate verbal responses; maintained and generalised'],
    ['Ng &amp; Chia 2014 [[c:ng2014]]', 'Repeated baseline–intervention', 'Scaffolding Interrogative Method', 'Comprehension age ↑ without reading-age change'],
    ['Macdonald 2022 [[c:macdonald2022]]', 'Baseline vs intervention · 30', 'Tablet word–picture matching, parent-supported', 'Comprehension ↑ for ASD+HPL vs TD (p = .023); receptive language ↑'],
    ['El Zein 2014 [[c:elzein2014]]', 'Synthesis · 12 studies', 'Question generation, organisers, prediction, cueing', 'Improved comprehension'],
    ['Lee 2025 [[c:lee2025]]', 'Meta-analysis · 5 SCED', 'Pictorial/graphic representation', 'Tau-U = 0.85'],
    ['Solis 2021 [[c:solis2021]]', 'Single-case · 5 adolescents', 'Vocabulary + main idea with text choice', 'Upward, stable trends; valued choice'],
    ['Stein 2015 [[c:stein2015]]', 'Case · 1', 'Floortime + pragmatic group SLT', 'Friendships and sociability improved'],
    ['Geretsegger 2022 [[c:geretsegger2022]]', 'Cochrane · 26 studies', 'Music therapy', 'Global improvement RR 1.22'],
], 'Intervention evidence relevant to hyperlexic learners.', widths=['22%', '22%', '28%', '28%'])

table('scale', ['Name', 'English (short scale)', 'French / Québec (long scale)'], [
    ['million', '10<sup>6</sup>', '10<sup>6</sup>'],
    ['milliard', '—', '10<sup>9</sup>'],
    ['billion', '10<sup>9</sup>', '10<sup>12</sup>'],
    ['billiard', '—', '10<sup>15</sup>'],
    ['trillion', '10<sup>12</sup>', '10<sup>18</sup>'],
    ['quadrillion', '10<sup>15</sup>', '10<sup>24</sup>'],
    ['quintillion', '10<sup>18</sup>', '10<sup>30</sup>'],
    ['sextillion', '10<sup>21</sup>', '10<sup>36</sup>'],
    ['septillion', '10<sup>24</sup>', '10<sup>42</sup>'],
    ['octillion', '10<sup>27</sup>', '10<sup>48</sup>'],
    ['<b>nonillion</b>', '<b>10<sup>30</sup></b>', '<b>10<sup>54</sup></b>'],
    ['decillion', '10<sup>33</sup>', '10<sup>60</sup>'],
    ['rule for <i>n</i>-illion', '10<sup>3n+3</sup>', '10<sup>6n</sup> (and <i>n</i>-illiard = 10<sup>6n+3</sup>)'],
], 'Large-number names in the two languages of the intended player.', widths=['30%', '30%', '40%'])

GAMES = [
    ('Lexicon Lock', 'Cadenas lexical', 'Deduce a hidden 5-letter word in 6 tries', 'Orthographic reasoning; meaning card after each word', 'P2, P8 · orthographic asset [[c:kennedy2003,cobrinik1982]]'),
    ('Wheel of Words', 'Roue des mots', 'Spin, guess letters, solve proverbs &amp; expressions', 'Phrase-level meaning from partial print; idiom explained on solve', 'P3, P6 [[c:cobrinik1982,martelle2022]]'),
    ('Cipher Station', 'Station Chiffre', 'Crack Caesar, Atbash, Vigenère &amp; substitution codes with frequency charts', 'Systemising, letter-pattern mapping', 'P7 · veridical mapping [[c:mottron2013,ostrolenk2024]]'),
    ('Word Invaders', 'Envahisseurs de mots', 'Type words to blast ships; bosses need the word that fits a definition', 'Automaticity → semantic retrieval', 'P2 [[c:macdonald2022,brown2013]]'),
    ('Spelling Hive', 'Ruche à mots', 'Build words from 7 letters around a centre letter', 'Orthography + vocabulary depth (definitions)', 'P2 [[c:brown2013]]'),
    ('Grid Blitz', 'Blitz de grille', 'Trace words in a letter grid against the clock', 'Rapid orthographic search in both lexicons', 'P8 [[c:gonzalez2018]]'),
    ('Word Ladder', 'Échelle de mots', 'Change one letter at a time from start to goal', 'Orthographic manipulation, planning', 'P2, P9'),
    ('Letter Cascade', 'Cascade de lettres', 'Clear falling letters by spelling words', 'Speed, flexibility, task-switching', 'P9 [[c:ober2021]]'),
    ('Crossword Forge', 'Forge à mots croisés', 'Solve generated crosswords from clues', 'Definition → word retrieval', 'P2 [[c:brown2013,sorenson2021]]'),
    ('Four Groups', 'Quatre groupes', 'Sort 16 words into 4 hidden categories', 'Semantic categories, multiple meanings', 'P2, P6 [[c:snowling1986]]'),
    ('Idiom Detective', 'Détective des expressions', 'Crack literal vs figurative meanings (English idioms &amp; expressions québécoises)', 'Figurative language, context', 'P6 [[c:martelle2022,cheng2026]]'),
    ('Mystery Files', 'Dossiers mystère', 'Read case files, answer wh-questions, click the evidence', 'Paragraph inference with proof', 'P3, P4 [[c:goldberg1984,loukusa2018,ng2014]]'),
    ('Social Signals', 'Signaux sociaux', 'Decode feelings, tone and sarcasm in chats and scenes', 'Emotion vocabulary, pragmatics', 'P5, P6 [[c:brown2013,sivathasan2023]]'),
    ('Conversation Quest', 'Quête de conversation', 'Choose replies in branching teen scenarios', 'Written social scripts', 'P1, P6 [[c:kistner1988,stein2015]]'),
    ('Story Sequencer', 'Chrono-récit', 'Rebuild scrambled stories and cause-effect chains', 'Narrative structure', 'P3, P5 [[c:mcintyre2020,lee2025]]'),
    ('Proofreader Pro', 'Correcteur pro', 'Find errors where meaning decides spelling', 'Homophones, agreement, context', 'P2 [[c:snowling1986]]'),
    ('Root Lab', 'Labo des racines', 'Build words from Greek/Latin roots shared by EN and FR', 'Morphology, cross-language transfer', 'P2, P8 [[c:luo2023,gonzalez2018]]'),
    ('Nonillion Navigator', 'Navigateur de nonillions', 'Name, convert and compare huge numbers; short vs long scale', 'Hypernumeracy as a bridge to language', 'P7, P8 [[c:ostrolenk2024,wei2015]]'),
    ('Sequence Lab', 'Labo des suites', 'Find the rule in number/letter sequences', 'Pattern detection', 'P7 [[c:mottron2006,samson2012]]'),
    ('Signal Decoder', 'Décodeur de signaux', 'Learn Morse, Braille, NATO, Greek and binary', 'New orthographies', 'P7 [[c:ichiba1990,rossello2025]]'),
    ('Staff Speller', 'Portée magique', 'Read notes on the staff that spell words; letters ↔ solfège', 'Music notation as orthography', 'P7, P8 [[c:bouvet2014,romani2021]]'),
    ('Pianissimo', 'Pianissimo', 'Play falling-note melodies with scrolling lyrics', 'Music strength, reading-while-singing', 'P7 [[c:quintin2019,geretsegger2022]]'),
    ('Ear Trainer', "Oreille d'or", 'Identify notes, intervals and chord moods', 'Pitch perception, music-emotion words', 'P5, P7 [[c:romani2021,sivathasan2023]]'),
    ('Definition Snake', 'Serpent des définitions', 'Eat letters in order to spell the word a clue defines', 'Definition → spelling', 'P2 [[c:macdonald2022]]'),
    ('Grammar Racer', 'Course grammaticale', 'Steer into the lane with the word that fits', 'Sentence-level meaning', 'P3 [[c:snowling1986,macdonald2022]]'),
]
table('games', ['#', 'Game (EN / FR)', 'What the player does', 'Skill targeted', 'Principle · evidence'],
      [[str(i + 1), f'<b>{g[0]}</b><br/><span class="fr">{g[1]}</span>', g[2], g[3], g[4]] for i, g in enumerate(GAMES)],
      'The 25-game suite and the evidence each game draws on.', widths=['4%', '19%', '29%', '24%', '24%'], cls='small breakable')

# ------------------------------------------------------------------ appendix


def short_author(cite):
    head = re.sub('<[^>]+>', '', cite).split('. ')[0]
    parts = [p.strip() for p in head.split(',') if p.strip()]
    sur = lambda p: p.split(' ')[0] if ' ' in p else p
    if not parts:
        return head
    if len(parts) == 1:
        return sur(parts[0])
    if len(parts) == 2 and 'et al' not in parts[1]:
        return f'{sur(parts[0])} &amp; {sur(parts[1])}'
    return f'{sur(parts[0])} et al.'


DESIGN = dict(case='Case / series', group='Group study', review='Review', meta='Meta-analysis',
              theory='Theory / commentary', acquired='Acquired (adult)', animal='Animal model', web='Web source')
CATORDER = dict(core=0, background=1, targeted=1, web=2)


def appendix_rows():
    rows = sorted(R, key=lambda r: (CATORDER[r['cat']], r['year'] or 9999, r['key']))
    out, last = [], None
    for r in rows:
        cat = {'core': 'A1 · Records on hyperlexia (Europe PMC title/abstract)',
               'background': 'A2 · Related literature (targeted searches and frameworks)',
               'targeted': 'A2 · Related literature (targeted searches and frameworks)',
               'web': 'A3 · Clinical and educational sources'}[r['cat']]
        if cat != last:
            out.append(f'<tr class="grp"><td colspan="5">{cat}</td></tr>')
            last = cat
        flag = '' if r['abs'] else ' <span class="flag">†</span>'
        who = short_author(r['cite']) if r['cat'] != 'web' else re.sub('<[^>]+>', '', r['cite']).split('.')[0]
        out.append(f'<tr><td>[[c:{r["key"]}]]</td><td>{r["year"] or "n.d."}</td><td>{who}{flag}</td>'
                   f'<td>{DESIGN[r["design"]]}<br/><span class="n">{r["n"]}</span></td><td>{r["summary"]}</td></tr>')
    return ''.join(out)


GLOSSARY = [
    ('Decoding', 'Turning print into pronunciation (reading aloud), with or without understanding.'),
    ('Orthographic processing', 'Recognising written word forms and spelling patterns as visual units.'),
    ('Phonological awareness', 'Awareness of the sound units of speech (syllables, phonemes).'),
    ('Simple View of Reading', 'Reading comprehension = decoding × language comprehension.'),
    ('Pragmatics', 'Using language in social context: tone, turn-taking, implied meaning.'),
    ('Gestalt language processing', 'Acquiring language in whole chunks (scripts) before analysing single words.'),
    ('Enhanced Perceptual Functioning', 'Model in which perception has a stronger, more autonomous role in autistic cognition.'),
    ('Veridical mapping', 'Perceptual detection of structural correspondences (e.g., letters ↔ sounds, pitch ↔ note names).'),
    ('Hypercalculia / hypernumeracy', 'Precocious fascination with and skill in numbers.'),
    ('Absolute pitch', 'Naming a musical note without a reference tone.'),
    ('Short vs long scale', 'Large-number naming systems: English billion = 10<sup>9</sup>; French billion = 10<sup>12</sup>.'),
    ('Twice-exceptional (2e)', 'Gifted and also neurodivergent or disabled.'),
    ('OR / HR / RR', 'Odds, hazard and risk ratios; 1 means no difference.'),
    ('SMD / g', 'Standardised mean difference; about 0.2 small, 0.5 medium, 0.8 large.'),
    ('Tau-U', 'Single-case effect size combining trend and non-overlap; 0.85 is large.'),
    ('SCED', 'Single-case experimental design.'),
    ('ALE', 'Activation likelihood estimation, a neuroimaging meta-analysis method.'),
]

# ------------------------------------------------------------------ assemble
CSS = open(os.path.join(HERE, 'paper.css')).read()


def assemble():
    abstract = ''.join(f'<p><b>{h}.</b> {b}</p>' for h, b in K.ABSTRACT)
    body = K.BODY
    # place figures / tables with numbers in order of placement
    fnum, tnum = {}, {}
    for m in re.finditer(r'\[\[(fig|tab):(\w+)\]\]', body):
        kind, name = m.groups()
        d = fnum if kind == 'fig' else tnum
        if name not in d:
            d[name] = len(d) + 1

    def place(m):
        kind, name = m.groups()
        if kind == 'fig':
            b, cap, cls = FIG[name]
            return f'<figure class="{cls}" id="fig-{name}">{b}<figcaption><b>Figure {fnum[name]}.</b> {cap}</figcaption></figure>'
        b, cap = TAB[name]
        brk = ' breakable' if 'breakable' in b[:40] else ''
        return f'<div class="tbl{brk}" id="tab-{name}"><div class="tcap"><b>Table {tnum[name]}.</b> {cap}</div>{b}</div>'
    body = re.sub(r'\[\[(fig|tab):(\w+)\]\]', place, body)
    body = re.sub(r'\[\[figref:(\w+)\]\]', lambda m: f'Fig. {fnum[m.group(1)]}', body)
    body = re.sub(r'\[\[tabref:(\w+)\]\]', lambda m: f'Table {tnum[m.group(1)]}', body)
    for w in ('Appendix A',):
        pass
    app = f'''<section class="appendix"><h2 class="nobreak">Appendix A · Annotated evidence table (all {len(R)} sources)</h2>
<p class="appnote">Every source consulted, with its design, sample and unique contribution. † = abstract not indexed; summarised from the bibliographic record. Numbers in the first column match the reference list.</p>
<table class="app"><colgroup><col style="width:5%"/><col style="width:6%"/><col style="width:15%"/><col style="width:13%"/><col style="width:61%"/></colgroup>
<thead><tr><th>Ref</th><th>Year</th><th>Source</th><th>Design · n</th><th>Unique contribution</th></tr></thead><tbody>{appendix_rows()}</tbody></table>
<h2>Appendix B · Glossary</h2><table class="gloss"><tbody>{''.join(f'<tr><td><b>{a}</b></td><td>{b}</td></tr>' for a, b in GLOSSARY)}</tbody></table></section>'''
    doc = body + '§§APP§§' + app
    # citation numbering by first appearance
    order = []
    for m in re.finditer(r'\[\[c:([\w,]+)\]\]', doc):
        for k in m.group(1).split(','):
            if k not in REF:
                raise SystemExit(f'unknown ref {k}')
            if k not in order:
                order.append(k)
    for r in R:
        if r['key'] not in order:
            order.append(r['key'])
    num = {k: i + 1 for i, k in enumerate(order)}

    def cite(m):
        ns = sorted({num[k] for k in m.group(1).split(',')})
        parts, i = [], 0
        while i < len(ns):
            j = i
            while j + 1 < len(ns) and ns[j + 1] == ns[j] + 1:
                j += 1
            parts.append(f'{ns[i]}–{ns[j]}' if j - i >= 2 else (f'{ns[i]}, {ns[j]}' if j == i + 1 else f'{ns[i]}'))
            i = j + 1
        return f'<span class="cite">[{", ".join(parts)}]</span>'
    doc = re.sub(r'\[\[c:([\w,]+)\]\]', cite, doc)
    body_html, app_html = doc.split('§§APP§§')
    refs = ''.join(f'<li value="{num[k]}">{REF[k]["cite"]}</li>' for k in order)
    stats = dict(src=len(R), figs=len(fnum), tabs=len(tnum) + 2, hl=sum(1 for r in R if r['cat'] == 'core'))
    html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<title>Hyperlexia in Children and Adolescents — Narrative Review</title><style>{CSS}</style></head><body>
<header class="masthead"><div class="jrnl">NARRATIVE REVIEW <span>·</span> OPEN RESEARCH COMPILATION <span>·</span> VOL. 1 (2026)</div>
<h1>{K.TITLE}</h1><div class="subtitle">{K.SUBTITLE}</div>
<div class="authors">Research compilation prepared with Claude (Anthropic AI research assistant) for family and educator use</div>
<div class="meta"><span>Compiled 27 September 2026</span><span>{stats["src"]} sources</span><span>{stats["hl"]} hyperlexia records</span><span>{stats["figs"]} figures</span><span>{stats["tabs"]} tables</span><span>Languages of evidence: EN, FR, ES, PT, IT, JA, ZH</span></div>
<div class="abstract"><div class="abs-h">Abstract</div>{abstract}<p class="kw"><b>Keywords:</b> {K.KEYWORDS}</p></div>
<div class="disclaimer">Not peer-reviewed; not medical advice. Numbers are reproduced from the cited publications. Assessment and therapy decisions belong with qualified clinicians.</div>
</header>
<main class="cols">{body_html}
<h2 class="refs-h">References</h2><ol class="refs">{refs}</ol></main>
{app_html}
</body></html>'''
    return html


if __name__ == '__main__':
    out = os.path.join(HERE, 'hyperlexia_paper.html')
    open(out, 'w').write(assemble())
    print('wrote', out)
