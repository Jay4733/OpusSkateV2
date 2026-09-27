'use strict';
// Proofreader passages. Errors marked [wrong|right|ruleKey].
const PROOF = {
en: {
  texts: [
    'Yesterday [their|there|hom] was a concert at school. Everyone brought [they’re|their|con] instruments, and [its|it’s|con] going to happen again next month. I can’t wait to [here|hear|hom] the orchestra again.',
    'The robotics team will [loose|lose|conf] points if the robot [brakes|breaks|hom] down. [Your|You’re|con] going to need spare parts. The judges will not [except|accept|conf] late entries.',
    'Mozart wrote [to|too|hom] many pieces to count. His music had a huge [affect|effect|conf] on later composers. [Than|Then|conf] Beethoven came along and changed everything.',
    'I [could of|could have|gram] finished the puzzle, but I ran out of time. The answer was [alot|a lot|spell] easier [then|than|conf] I thought. [Whose|Who’s|con] turn is it now?',
    'The [principle|principal|conf] announced a snow day. [Weather|Whether|conf] or not the buses run, school is closed. Everyone [were|was|agr] thrilled.',
    'The Milky Way [contain|contains|agr] billions of stars. Each of the planets [have|has|agr] its own orbit. Astronomers [recieve|receive|spell] new data every night.',
    'My sister and [me|I|pro] went to the sugar shack. We ate [to|too|hom] much maple taffy. It was the best [desert|dessert|conf] ever.',
    'Our team [definately|definitely|spell] deserved to win. [There|They’re|con] practising every day. Between you and [I|me|pro], the goalie was amazing.',
  ],
  rules: {
    hom: 'Homophones sound the same but have different meanings — the meaning decides the spelling (there = place, their = belonging to them, hear = with ears, too = also / excessively).',
    con: 'Contractions use an apostrophe for missing letters: it’s = it is, you’re = you are, who’s = who is, they’re = they are. Possessives (its, your, whose, their) have no apostrophe.',
    conf: 'Commonly confused words: lose (not win) / loose (not tight); accept (receive) / except (excluding); affect (verb) / effect (noun); then (time) / than (comparison); principal (school head) / principle (rule); whether (if) / weather (rain); dessert (sweet) / desert (sand).',
    gram: '“Could of” is a mishearing of “could’ve” — write could have.',
    agr: 'The verb agrees with its subject: everyone was, each has, the Milky Way contains (singular subjects).',
    spell: 'Spelling patterns: definitely (contains “finite”), receive (i before e except after c), a lot is two words.',
    pro: 'Use “I” as a subject (My sister and I went) and “me” after a preposition (between you and me).',
  },
},
fr: {
  texts: [
    'Julie a oublié [ces|ses|cs] livres sur la table de la bibliothèque. Elle [à|a|aa] dû revenir les chercher [a|à|aa] midi.',
    'Mes amis [on|ont|onont] joué au hockey samedi. [Ont|On|onont] a gagné trois à deux. Le gardien [et|est|etest] très fier de son match.',
    'Les pianistes [son|sont|sonsont] prêts pour le récital. Chacun apporte [sont|son|sonsont] cahier de musique. [S’est|C’est|cest] le grand soir !',
    'Nous avons [manger|mangé|ere] de la tire d’érable à la cabane. Il faut [goûté|goûter|ere] ça au moins une fois. [Ou|Où|ouou] est ma tuque ?',
    'Les élèves ont rangé [leur|leurs|leur] instruments. Le prof [leurs|leur|leur] a dit merci. Il [ce|se|cese] lève toujours très tôt.',
    'Il reste [peut|peu|peupeut] de temps au match. On [peu|peut|peupeut] encore gagner. [Quant|Quand|quand] la cloche sonne, tout le monde s’arrête.',
    'La nuit, les étoiles [brille|brillent|acc] dans le ciel. La Voie lactée [contiennent|contient|acc] des milliards d’étoiles. Les astronomes les [observe|observent|acc] chaque soir.',
    'Ma sœur [est|et|etest] moi sommes allés au concert. La salle était [plaine|pleine|orth]. Nous [somme|sommes|orth] rentrés tard, mais heureux.',
  ],
  rules: {
    cs: '« ses » = les siens (à elle, à lui); « ces » = ceux-là, qu’on montre. Julie a oublié SES livres (les siens).',
    aa: '« a » est le verbe avoir (on peut dire « avait »); « à » est une préposition (à midi, à la maison).',
    onont: '« ont » est le verbe avoir (on peut dire « avaient »); « on » est un pronom (on peut dire « il »).',
    etest: '« est » est le verbe être (on peut dire « était »); « et » relie deux éléments (et puis).',
    sonsont: '« sont » est le verbe être (on peut dire « étaient »); « son » veut dire « le sien ».',
    cest: '« c’est » = cela est; « s’est » accompagne un verbe pronominal (il s’est levé).',
    ere: 'Remplace par « vendre / vendu » : après « avoir », le participe passé en -é (avons mangé → avons vendu); après « il faut », l’infinitif en -er (il faut goûter → il faut vendre).',
    ouou: '« où » indique un lieu ou un moment; « ou » veut dire « ou bien ».',
    leur: '« leurs » devant un nom pluriel (leurs instruments); « leur » devant un verbe est toujours invariable (le prof leur a dit).',
    cese: '« se » accompagne un verbe pronominal (il se lève); « ce » montre quelque chose (ce livre).',
    peupeut: '« peut » est le verbe pouvoir (on peut dire « pouvait »); « peu » veut dire « pas beaucoup ».',
    quand: '« quand » = lorsque (le temps); « quant à » = en ce qui concerne.',
    acc: 'Le verbe s’accorde avec son sujet : les étoiles brillENT, la Voie lactée contienT, les astronomes observENT.',
    orth: 'Orthographe : « pleine » (remplie, féminin de plein); « nous sommes » (verbe être).',
  },
},
};
