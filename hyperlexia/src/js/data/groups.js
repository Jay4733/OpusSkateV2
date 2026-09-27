'use strict';
// Four Groups puzzles. Each line: level|category|w1,w2,w3,w4 ; puzzles separated by blank lines.
const GROUPS_SRC = {
en: `1|Prime numbers|TWO,THREE,SEVEN,ELEVEN
2|Italian tempo markings|ALLEGRO,ADAGIO,LARGO,PRESTO
3|Things that have a key|LOCK,MAP,CIPHER,TYPEWRITER
4|Keyboard instruments|PIANO,ORGAN,HARPSICHORD,CELESTA

1|Planets|MARS,VENUS,SATURN,MERCURY
2|Chemical elements|IRON,GOLD,NEON,CARBON
3|___ bar|CHOCOLATE,CROW,SAND,HANDLE
4|Hidden number words|OFTEN,CANINE,WEIGHT,STONE

1|Punctuation marks|COMMA,COLON,PERIOD,HYPHEN
2|Units of time|SECOND,MINUTE,DECADE,CENTURY
3|Anagrams of each other|LISTEN,SILENT,ENLIST,TINSEL
4|Sound like letters|SEA,TEA,EYE,WHY

1|Shapes|CIRCLE,SQUARE,TRIANGLE,HEXAGON
2|In a symphony orchestra|VIOLIN,OBOE,TIMPANI,TUBA
3|Palindromes|LEVEL,RADAR,CIVIC,KAYAK
4|Start with a solfège syllable|DOLPHIN,REMEDY,MIRROR,SOLID

1|Feelings|ANXIOUS,PROUD,JEALOUS,RELIEVED
2|Big numbers|BILLION,TRILLION,GOOGOL,NONILLION
3|___board|KEY,SKATE,CHESS,SNOW
4|Silent first letter|KNIFE,GNOME,WRAP,HONEST

1|Computer words|PIXEL,BYTE,CURSOR,SERVER
2|Greek letters|ALPHA,DELTA,SIGMA,OMEGA
3|___fish|SWORD,STAR,JELLY,CAT
4|Canadiana|LOONIE,TOQUE,POUTINE,MAPLE

1|Weather|THUNDER,BLIZZARD,DRIZZLE,HAIL
2|Literary devices|METAPHOR,SIMILE,IRONY,HYPERBOLE
3|You can break it (idioms)|RECORD,ICE,PROMISE,NEWS
4|Reversed, they spell a new word|STRESSED,DRAWER,PARTS,LIVE

1|Maths results|SUM,PRODUCT,DIFFERENCE,QUOTIENT
2|Composers|BACH,MOZART,CHOPIN,DEBUSSY
3|___line|DEAD,HEAD,PUNCH,TIME
4|Spelled only with note letters A–G|CABBAGE,BADGE,FACADE,DECADE

1|Space objects|COMET,NEBULA,QUASAR,ASTEROID
2|Parts of a book|CHAPTER,INDEX,GLOSSARY,PREFACE
3|Things you can crack|CODE,JOKE,SMILE,EGG
4|Hidden animals|SCATTER,BEARD,CANTEEN,GOATEE

1|Hockey words|PUCK,GOALIE,RINK,FACEOFF
2|Programming languages|PYTHON,JAVA,RUBY,SWIFT
3|Snakes|COBRA,VIPER,BOA,ADDER
4|Anagrams of number words|EON,NET,THERE,EVENS

1|Happy|CHEERFUL,JOYFUL,ELATED,CONTENT
2|Sad|GLOOMY,MISERABLE,DOWNCAST,BLUE
3|Colours of the rainbow|RED,GREEN,VIOLET,INDIGO
4|Angry|FURIOUS,LIVID,IRATE,CROSS

1|Dog breeds|POODLE,BEAGLE,BOXER,HUSKY
2|Sports equipment|HELMET,RACKET,PADDLE,STICK
3|___word|PASS,BUZZ,CROSS,KEY
4|Hidden body parts|CHARM,LEARN,WHIP,CHINA`,
fr: `1|Nombres premiers|DEUX,TROIS,CINQ,SEPT
2|Indications de tempo|ALLEGRO,ADAGIO,LARGO,PRESTO
3|Instruments à cordes|VIOLON,HARPE,GUITARE,VIOLONCELLE
4|Commencent par une note de musique|DORMIR,RÉGAL,MIROIR,SOLEIL

1|Planètes|MARS,VÉNUS,SATURNE,MERCURE
2|Jours de la semaine|LUNDI,MARDI,MERCREDI,JEUDI
3|Éléments chimiques|FER,OR,NÉON,CARBONE
4|Nombre caché dedans|HUÎTRE,CENTAURE,MILLEFEUILLE,SIXTINE

1|Ponctuation|VIRGULE,POINT,TIRET,GUILLEMETS
2|Unités de temps|SECONDE,MINUTE,DÉCENNIE,SIÈCLE
3|Anagrammes l’un de l’autre|CRÂNE,NACRE,RANCE,ÉCRAN
4|Se prononcent comme une lettre|THÉ,CAS,AILE,HACHE

1|Formes|CERCLE,CARRÉ,TRIANGLE,HEXAGONE
2|Dans l’orchestre|HAUTBOIS,TIMBALES,TUBA,CONTREBASSE
3|Palindromes|RADAR,KAYAK,ÉTÉ,SOLOS
4|Mots d’expressions québécoises|TUQUE,BOTTINE,PATATE,SAPIN

1|Émotions|ANXIEUX,FIER,JALOUX,SOULAGÉ
2|Grands nombres|MILLIARD,BILLION,GOGOL,NONILLION
3|___ de neige|BONHOMME,BANC,BOULE,TEMPÊTE
4|Commencent par un h muet|HEURE,HIVER,HOMME,HABIT

1|Informatique|PIXEL,OCTET,CURSEUR,SERVEUR
2|Lettres grecques|ALPHA,DELTA,SIGMA,OMÉGA
3|Bien de chez nous (Québec)|DÉPANNEUR,POUTINE,BLEUET,HUARD
4|Un animal caché dedans|CHATEAU,RATURE,COQUILLE,LOUPE

1|Météo|TONNERRE,BRUINE,GRÊLE,VERGLAS
2|Figures de style|MÉTAPHORE,COMPARAISON,IRONIE,HYPERBOLE
3|Casser ___ (expressions)|GLACE,OREILLES,CROÛTE,PIPE
4|Sans la 1re lettre, un autre mot|CRIME,TRAME,FOURS,SEAU

1|Résultats d’opérations|SOMME,PRODUIT,DIFFÉRENCE,QUOTIENT
2|Compositeurs|BACH,MOZART,CHOPIN,DEBUSSY
3|Écrits seulement avec les lettres A à G|CAFÉ,BÉBÉ,FADE,BAGAGE
4|Sens québécois particulier|CHAR,BLONDE,CHUM,MAGASINER

1|Objets célestes|COMÈTE,NÉBULEUSE,QUASAR,ASTÉROÏDE
2|Parties d’un livre|CHAPITRE,INDEX,GLOSSAIRE,PRÉFACE
3|Ça se déchiffre ou se résout|CODE,ÉNIGME,MYSTÈRE,ÉQUATION
4|Homophones (même son « vèr »)|VERT,VERRE,VERS,VER

1|Sports d’hiver|HOCKEY,SKI,PATIN,CURLING
2|Langages de programmation|PYTHON,JAVA,RUBY,SWIFT
3|Serpents|COBRA,VIPÈRE,BOA,COULEUVRE
4|Homophones (même son « sin »)|SAIN,SAINT,SEIN,CEINT

1|Joie|JOYEUX,RAVI,ENCHANTÉ,HEUREUX
2|Tristesse|MORNE,ABATTU,CHAGRINÉ,MÉLANCOLIQUE
3|Colère|FURIEUX,IRRITÉ,EXASPÉRÉ,FÂCHÉ
4|Peur|EFFRAYÉ,TERRIFIÉ,INQUIET,ÉPOUVANTÉ

1|Races de chiens|CANICHE,BEAGLE,BOXER,HUSKY
2|Équipement sportif|CASQUE,RAQUETTE,PAGAIE,BÂTON
3|Mots-___|CROISÉS,CLÉS,VALISES,DIÈSE
4|Une partie du corps cachée|CHAPEAU,BRASSERIE,PIÉDESTAL,DOIGTÉ`,
};
const GROUPS = {};
for (const l in GROUPS_SRC) GROUPS[l] = GROUPS_SRC[l].trim().split(/\n\s*\n/).map(block => block.trim().split('\n').map(line => { const [lv, name, ws] = line.split('|'); return { lv: +lv, name, words: ws.split(',') }; }));
