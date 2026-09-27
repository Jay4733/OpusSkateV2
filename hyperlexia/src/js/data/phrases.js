'use strict';
// Wheel of Words puzzles: category | phrase | meaning (optional)
const PHRASES_SRC = {
en: `Proverb|ACTIONS SPEAK LOUDER THAN WORDS|What you do shows more about you than what you say.
Proverb|DON'T JUDGE A BOOK BY ITS COVER|Don't judge someone or something only by appearance.
Proverb|THE EARLY BIRD CATCHES THE WORM|People who start early get the best chances.
Proverb|PRACTICE MAKES PERFECT|Repeating something is how you master it.
Proverb|BETTER LATE THAN NEVER|Doing something late is better than not doing it at all.
Proverb|EVERY CLOUD HAS A SILVER LINING|Even a bad situation has something good in it.
Proverb|TWO HEADS ARE BETTER THAN ONE|Solving a problem together works better than alone.
Proverb|ROME WASN'T BUILT IN A DAY|Great achievements take time and patience.
Proverb|LOOK BEFORE YOU LEAP|Think about the consequences before you act.
Proverb|A PICTURE IS WORTH A THOUSAND WORDS|An image can explain more than a long description.
Proverb|WHERE THERE'S A WILL THERE'S A WAY|If you are determined, you will find a solution.
Proverb|SLOW AND STEADY WINS THE RACE|Consistent effort beats rushing.
Proverb|KNOWLEDGE IS POWER|The more you know, the more you can do.
Proverb|ALL THAT GLITTERS IS NOT GOLD|Something attractive on the outside may not be valuable.
Idiom|BREAK THE ICE|Say or do something to make people feel relaxed at first meeting.
Idiom|A PIECE OF CAKE|Something very easy.
Idiom|UNDER THE WEATHER|Feeling a little sick.
Idiom|HIT THE BOOKS|Study hard.
Idiom|SPILL THE BEANS|Reveal a secret.
Idiom|ONCE IN A BLUE MOON|Very rarely.
Idiom|COST AN ARM AND A LEG|Be very expensive.
Idiom|THE BALL IS IN YOUR COURT|It is your turn to decide or act.
Idiom|CALL IT A DAY|Stop working on something for now.
Idiom|LET THE CAT OUT OF THE BAG|Reveal a secret, often by accident.
Idiom|BACK TO SQUARE ONE|Start again from the beginning after a failure.
Idiom|PULLING YOUR LEG|Joking or teasing you — not serious.
Idiom|ON CLOUD NINE|Extremely happy.
Idiom|BITE OFF MORE THAN YOU CAN CHEW|Try to do more than you are able to handle.
Idiom|THE TIP OF THE ICEBERG|A small visible part of a much bigger problem.
Science|THE SPEED OF LIGHT
Science|BLACK HOLE
Science|THE PERIODIC TABLE
Science|OBSERVABLE UNIVERSE
Science|THEORY OF RELATIVITY
Science|DOUBLE HELIX
Science|TOTAL SOLAR ECLIPSE
Music|MOONLIGHT SONATA
Music|GRAND PIANO
Music|MIDDLE C
Music|TREBLE CLEF
Music|CIRCLE OF FIFTHS
Music|ABSOLUTE PITCH
Music|STANDING OVATION
Numbers|PRIME NUMBER
Numbers|THE GOLDEN RATIO
Numbers|SCIENTIFIC NOTATION
Numbers|ONE NONILLION
Numbers|POWERS OF TEN
Quote|TO BE OR NOT TO BE
Quote|I THINK THEREFORE I AM`,
fr: `Proverbe|L'HABIT NE FAIT PAS LE MOINE|L'apparence ne dit pas qui est vraiment une personne.
Proverbe|PETIT À PETIT L'OISEAU FAIT SON NID|Avec de la patience et des efforts réguliers, on arrive au but.
Proverbe|APRÈS LA PLUIE LE BEAU TEMPS|Les moments difficiles finissent par passer.
Proverbe|C'EST EN FORGEANT QU'ON DEVIENT FORGERON|On apprend en pratiquant.
Proverbe|RIEN NE SERT DE COURIR IL FAUT PARTIR À POINT|Mieux vaut commencer à temps que de se dépêcher à la fin.
Proverbe|QUI VIVRA VERRA|On saura avec le temps.
Proverbe|VOULOIR C'EST POUVOIR|Avec de la volonté, on peut réussir.
Proverbe|MIEUX VAUT TARD QUE JAMAIS|Faire quelque chose en retard vaut mieux que ne pas le faire.
Proverbe|L'UNION FAIT LA FORCE|Ensemble, on est plus forts.
Proverbe|TOUT VIENT À POINT À QUI SAIT ATTENDRE|La patience finit par être récompensée.
Proverbe|LES ABSENTS ONT TOUJOURS TORT|Ceux qui ne sont pas là ne peuvent pas se défendre.
Expression québécoise|LÂCHE PAS LA PATATE|N'abandonne pas, continue tes efforts !
Expression québécoise|ATTACHE TA TUQUE AVEC DE LA BROCHE|Prépare-toi, ça va brasser !
Expression québécoise|IL PLEUT À BOIRE DEBOUT|Il pleut très fort.
Expression québécoise|AVOIR DE L'EAU DANS LA CAVE|Porter un pantalon trop court.
Expression québécoise|ÊTRE AUX OISEAUX|Être très heureux, ravi.
Expression québécoise|SE TIRER UNE BÛCHE|Prendre une chaise et s'asseoir.
Expression québécoise|ÊTRE VITE SUR SES PATINS|Réagir rapidement, avoir l'esprit vif.
Expression québécoise|ACCOUCHE QU'ON BAPTISE|Dis-le enfin, va droit au but !
Expression québécoise|AVOIR LA BROUE DANS LE TOUPET|Être très occupé, débordé.
Expression québécoise|C'EST DE VALEUR|C'est dommage.
Expression québécoise|FAIRE LA BABOUNE|Bouder, faire la moue.
Expression québécoise|COGNER DES CLOUS|Somnoler, s'endormir assis.
Expression québécoise|PARLER À TRAVERS SON CHAPEAU|Dire des choses sans savoir de quoi on parle.
Expression québécoise|AVOIR LES DEUX PIEDS DANS LA MÊME BOTTINE|Être maladroit ou manquer d'initiative.
Expression québécoise|SE FAIRE PASSER UN SAPIN|Se faire avoir, se faire tromper.
Expression québécoise|TIRER LA PIPE|Taquiner quelqu'un pour rire.
Expression québécoise|NE PAS ÊTRE SORTI DU BOIS|Avoir encore bien des difficultés devant soi.
Expression québécoise|IL N'Y A PAS LE FEU AU LAC|Rien ne presse, on a le temps.
Expression|CASSER LA GLACE|Briser le silence pour mettre les gens à l'aise.
Expression|AVOIR LA TÊTE DANS LES NUAGES|Être distrait, rêveur.
Expression|POSER UN LAPIN|Ne pas venir à un rendez-vous.
Science|LA VITESSE DE LA LUMIÈRE
Science|UN TROU NOIR
Science|LE TABLEAU PÉRIODIQUE
Science|LE SYSTÈME SOLAIRE
Science|LA VOIE LACTÉE
Science|LA DOUBLE HÉLICE
Musique|SONATE AU CLAIR DE LUNE
Musique|PIANO À QUEUE
Musique|CLÉ DE SOL
Musique|OREILLE ABSOLUE
Musique|CERCLE DES QUINTES
Musique|ORCHESTRE SYMPHONIQUE
Nombres|NOMBRE PREMIER
Nombres|LE NOMBRE D'OR
Nombres|NOTATION SCIENTIFIQUE
Nombres|UN NONILLION
Nombres|LES PUISSANCES DE DIX
Citation|JE PENSE DONC JE SUIS
Citation|L'ESSENTIEL EST INVISIBLE POUR LES YEUX`,
};
const PHRASES = {};
for (const l in PHRASES_SRC) PHRASES[l] = PHRASES_SRC[l].trim().split('\n').map(s => { const [c, p, m] = s.split('|'); return { c, p, m: m || '' }; });
