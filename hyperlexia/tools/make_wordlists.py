#!/usr/bin/env python3
"""Build frequency-ordered, dictionary-checked, profanity-filtered EN/FR word lists.

Inputs (npm packages, see README): word-list (EN), an-array-of-french-words (FR);
frequencies from the `wordfreq` Python package. Output: src/data/words.js
"""
import json, re, sys, os
from wordfreq import top_n_list

DICTS = sys.argv[1]
OUT = sys.argv[2]
N = 50000

EN_EXACT = set('''ass asses asshole assholes arse arsehole bastard bastards bitch bitches bitchy bollocks boob boobs
cock cocks crap crappy cum damn damned dick dicks dickhead dildo fag fags faggot horny jizz nazi nazis penis penises
piss pissed pissing porn porno pussy pussies rape raped rapes raping rapist rapists retard retarded sex sexes sexy
sexual sexually sexuality slut sluts suicide suicides tit tits titty titties twat vagina wank wanker whore whores
anal anus orgasm erection nude nudes naked kinky hooker hookers cocaine heroin meth weed stoned drunk
killer murder murdered murderer genocide gay gays lesbian'''.split())
EN_PREFIX = ('fuck', 'shit', 'cunt', 'nigg', 'masturb', 'orgas', 'wank', 'bullshit', 'motherf', 'porn', 'whor', 'slutt', 'dildo', 'jizz', 'pedoph')
FR_EXACT = set('''con cons conne connes connard connards connasse connasses connerie conneries cul culs bite bites
couille couilles chier chie chié chiant chiante chiants chiantes chiotte chiottes putain putains pute putes
salaud salauds foutre foutu foutue foutus foutues nique niquer niqué baise baiser baisé baisée baises baisent
pédé pédés tapette tapettes gouine gouines nègre nègres négro bougnoule bordel bordels bander sucer suce
sexe sexes sexy sexuel sexuelle sexuels sexuelles sexualité porno viol viols violer violé violée violeur violeurs
suicide suicides suicider tabarnak tabarnac tabernacle câlice calice câlisse câlisse ciboire ostie hostie hosties
crisse criss sacrament esti viarge calvaire maudit maudite maudits maudites nazi nazis drogue drogues cocaïne
héroïne pénis vagin nu nue nus nues meurtre meurtres meurtrier tuer'''.split())
FR_PREFIX = ('merd', 'encul', 'salop', 'branl', 'pornogr', 'pédoph', 'masturb', 'orgasm')


def ok(w, lang):
    ex, pre = (EN_EXACT, EN_PREFIX) if lang == 'en' else (FR_EXACT, FR_PREFIX)
    return w not in ex and not w.startswith(pre)


def build(lang, dic, pat):
    out = []
    for w in top_n_list(lang, N):
        if re.match(pat, w) and w in dic and 3 <= len(w) <= 12 and ok(w, lang):
            out.append(w)
    return out


en_dict = set(open(os.path.join(DICTS, 'word-list-4.1.0/package/words.txt')).read().split())
fr_dict = set(json.load(open(os.path.join(DICTS, 'an-array-of-french-words-2.0.0/package/index.json'))))
en = build('en', en_dict, r'^[a-z]+$')
fr = build('fr', fr_dict, r'^[a-zàâäçéèêëîïôöùûüÿœ]+$')
with open(OUT, 'w') as f:
    f.write('// Frequency-ordered word lists (most common first), 3-12 letters.\n')
    f.write('// Sources: wordfreq (frequency), word-list (EN), an-array-of-french-words (FR). Profanity removed.\n')
    f.write('const WORDLIST = {\n  en: "' + ' '.join(en) + '",\n  fr: "' + ' '.join(fr) + '"\n};\n')
print(len(en), len(fr), os.path.getsize(OUT))
