'use strict';
// Bilingual glossary: word | category | definition. Used for meaning cards, crossword clues,
// Definition Snake, Word Invaders bosses and Lexicon Lock answers.
const GLOSSARY_SRC = {
en: `piano|mus|Keyboard instrument whose hammers strike strings
chord|mus|Three or more notes sounded together
tempo|mus|The speed of a piece of music
rhythm|mus|Pattern of long and short sounds in time
melody|mus|A sequence of notes heard as a tune
harmony|mus|Notes combined to support a melody
octave|mus|Interval of eight notes; double the frequency
sonata|mus|Composition for one or two instruments, often in movements
opera|mus|Drama set to music and sung on stage
choir|mus|Organized group of singers
scale|mus|Notes arranged in order by pitch
pitch|mus|How high or low a sound is
treble|mus|The highest part or clef in music
lyric|mus|The words of a song
ballad|mus|Slow song that tells a story
concerto|mus|Work for soloist and orchestra
symphony|mus|Large work for full orchestra
violin|mus|Four-stringed instrument played with a bow
cello|mus|Large bowed string instrument held between the knees
flute|mus|Woodwind played by blowing across a hole
organ|mus|Keyboard instrument that pushes air through pipes
forte|mus|Italian marking meaning loud
allegro|mus|Italian marking meaning fast and lively
adagio|mus|Italian marking meaning slow
staccato|mus|Notes played short and detached
legato|mus|Notes played smoothly and connected
encore|mus|Extra piece performed at the audience's request
duet|mus|Piece for two performers
solo|mus|Piece or passage for one performer
quartet|mus|Group of four musicians
fugue|mus|Piece in which a theme is imitated by several voices
waltz|mus|Dance in triple time
anthem|mus|Solemn song of a nation or group
metronome|mus|Device that ticks a steady beat
conductor|mus|Person who directs an orchestra
pedal|mus|Foot lever that sustains piano notes
ensemble|mus|Group of musicians performing together
crescendo|mus|Gradual increase in loudness
overture|mus|Orchestral introduction to an opera
prelude|mus|Short introductory piece
cadence|mus|Chord progression that ends a phrase
interval|mus|Distance in pitch between two notes
sharp|mus|Symbol that raises a note by a semitone
flat|mus|Symbol that lowers a note by a semitone
atom|sci|Smallest unit of a chemical element
orbit|sci|Curved path of a body around a star or planet
comet|sci|Icy body that grows a glowing tail near the Sun
galaxy|sci|Huge system of stars, gas and dust
planet|sci|Large body that orbits a star
nebula|sci|Cloud of gas and dust in space
photon|sci|Particle of light
quasar|sci|Extremely bright core of a distant galaxy
gravity|sci|Force that pulls masses toward each other
magnet|sci|Object that attracts iron
fossil|sci|Remains of an ancient organism preserved in rock
prism|sci|Glass shape that splits light into colours
laser|sci|Narrow beam of intense light
enzyme|sci|Protein that speeds up a chemical reaction
neuron|sci|Nerve cell that carries signals
genome|sci|Complete set of an organism's genes
lunar|sci|Relating to the Moon
solar|sci|Relating to the Sun
eclipse|sci|When one body blocks light from another
meteor|sci|Streak of light from a space rock burning up
oxygen|sci|Gas that we breathe to live
carbon|sci|Element found in all living things
energy|sci|Capacity to do work
friction|sci|Force that resists sliding
velocity|sci|Speed in a given direction
molecule|sci|Group of atoms bonded together
crystal|sci|Solid with a regular repeating structure
volcano|sci|Mountain that can erupt lava
glacier|sci|Slow-moving river of ice
climate|sci|Long-term pattern of weather
species|sci|Group of similar organisms that can interbreed
hypothesis|sci|Testable explanation proposed before an experiment
prime|num|Number divisible only by 1 and itself
digit|num|Any single numeral from 0 to 9
ratio|num|Comparison of two quantities by division
angle|num|Space between two lines that meet
radius|num|Distance from a circle's centre to its edge
vector|num|Quantity with size and direction
matrix|num|Rectangular grid of numbers
integer|num|Whole number, positive, negative or zero
decimal|num|Number system based on ten
fraction|num|Part of a whole, like three quarters
infinity|num|Quantity without end
googol|num|Ten to the power of one hundred
billion|num|In English, a thousand million
trillion|num|In English, a million million
nonillion|num|In English, ten to the thirtieth power
exponent|num|Small raised number showing a power
cube|num|Number multiplied by itself three times
median|num|Middle value in an ordered list
average|num|Sum divided by how many values there are
theorem|num|Statement proven true by logic
equation|num|Statement that two expressions are equal
symmetry|num|Balance of matching parts on each side
sequence|num|Ordered list that follows a rule
factor|num|Number that divides another exactly
cipher|num|Secret method of writing a message
binary|num|Number system that uses only 0 and 1
algebra|num|Maths that uses letters for unknown numbers
polygon|num|Flat shape with straight sides
noun|lang|Word that names a person, place or thing
verb|lang|Word that expresses an action or state
adverb|lang|Word that describes a verb
syllable|lang|Unit of sound in a word
vowel|lang|Letter such as a, e, i, o or u
idiom|lang|Phrase whose meaning is not literal
metaphor|lang|Saying something is something else to compare
simile|lang|Comparison using like or as
synonym|lang|Word with the same meaning as another
antonym|lang|Word with the opposite meaning
homophone|lang|Word that sounds like another but differs in meaning
prefix|lang|Letters added to the start of a word
suffix|lang|Letters added to the end of a word
alphabet|lang|Set of letters used to write a language
grammar|lang|Rules for building sentences
dialect|lang|Regional variety of a language
fable|lang|Short story with a moral, often with animals
novel|lang|Long written work of fiction
poem|lang|Writing arranged in lines with rhythm
rhyme|lang|Words with matching end sounds
stanza|lang|Group of lines in a poem
author|lang|Person who writes a book
glossary|lang|List of terms with their meanings
lexicon|lang|The vocabulary of a language
anagram|lang|Word made by rearranging another word's letters
palindrome|lang|Word that reads the same backward
acronym|lang|Word formed from initial letters
irony|lang|Meaning the opposite of what is said
sarcasm|lang|Mocking irony, often said with a certain tone
riddle|lang|Puzzling question with a clever answer
myth|lang|Traditional story explaining the world
legend|lang|Old story believed to have some truth
chapter|lang|Main division of a book
quote|lang|Words repeated from someone else
thesis|lang|Main argument of an essay
inference|lang|Conclusion drawn from clues, not stated directly
context|lang|Surrounding words that clarify meaning
anxious|emo|Worried about what might happen
calm|emo|Peaceful and not upset
proud|emo|Pleased about an achievement
jealous|emo|Wanting what someone else has
curious|emo|Eager to know or learn
grateful|emo|Thankful for something received
lonely|emo|Sad because of being alone
nervous|emo|Tense before something important
excited|emo|Very enthusiastic and eager
furious|emo|Extremely angry
relieved|emo|Glad that a worry has ended
embarrassed|emo|Awkward and self-conscious in front of others
confident|emo|Sure of one's abilities
empathy|emo|Understanding how someone else feels
sincere|emo|Honest and genuine
frustrated|emo|Upset at being unable to succeed
hopeful|emo|Expecting something good
awkward|emo|Uncomfortable in a social situation
bored|emo|Tired of having nothing interesting to do
disappointed|emo|Sad that something was not as hoped
pixel|tech|Tiny dot of colour on a screen
robot|tech|Machine that performs tasks automatically
server|tech|Computer that provides data to others
laptop|tech|Portable computer
cursor|tech|Moving marker on a screen
browser|tech|Program for viewing websites
network|tech|Connected group of computers
algorithm|tech|Step-by-step procedure to solve a problem
password|tech|Secret word used to log in
emoji|tech|Small picture used in messages
avatar|tech|Picture that represents a user
gadget|tech|Small clever device
drone|tech|Remotely piloted flying machine
circuit|tech|Closed path for electric current
battery|tech|Device that stores electrical energy
signal|tech|Electronic message sent over a distance
byte|tech|Unit of data made of eight bits
glitch|tech|Sudden small malfunction
upload|tech|To send a file to a server
forest|nat|Large area covered with trees
maple|nat|Tree whose sap makes syrup
river|nat|Large natural stream of water
canyon|nat|Deep valley with steep sides
island|nat|Land surrounded by water
desert|nat|Very dry region with little rain
thunder|nat|Loud sound that follows lightning
blizzard|nat|Severe snowstorm with strong wind
harbor|nat|Sheltered place where ships dock
bridge|nat|Structure built to cross a gap
castle|nat|Large fortified building
lantern|nat|Portable lamp with a protective case
compass|nat|Instrument that points north
journey|nat|Long trip from one place to another
puzzle|nat|Problem designed to test ingenuity
treasure|nat|Hidden collection of valuable things
museum|nat|Building that displays important objects
library|nat|Place where books can be borrowed
recipe|nat|Instructions for preparing food
marathon|nat|Running race of about forty-two kilometres
hockey|nat|Game played on ice with sticks and a puck
poutine|qc|Québec dish of fries, cheese curds and gravy
toque|qc|Knitted winter hat (tuque)
loonie|qc|Canadian one-dollar coin
sugar|nat|Sweet substance from cane, beets or maple sap`,
fr: `piano|mus|Instrument à clavier dont les marteaux frappent des cordes
accord|mus|Plusieurs notes jouées ensemble
tempo|mus|Vitesse d'exécution d'une pièce musicale
rythme|mus|Organisation des durées dans le temps
mélodie|mus|Suite de notes formant un air
harmonie|mus|Combinaison de sons qui accompagne une mélodie
octave|mus|Intervalle de huit notes
sonate|mus|Pièce pour un ou deux instruments, souvent en mouvements
opéra|mus|Drame mis en musique et chanté
chorale|mus|Groupe organisé de chanteurs
gamme|mus|Suite de notes rangées par hauteur
portée|mus|Cinq lignes sur lesquelles on écrit les notes
clé|mus|Signe qui fixe le nom des notes sur la portée
soupir|mus|Silence d'une durée d'une noire
refrain|mus|Partie d'une chanson qui revient
ballade|mus|Chanson lente qui raconte une histoire
concerto|mus|Œuvre pour soliste et orchestre
symphonie|mus|Grande œuvre pour orchestre
violon|mus|Instrument à quatre cordes joué avec un archet
violoncelle|mus|Grand instrument à cordes tenu entre les genoux
flûte|mus|Instrument à vent en bois ou en métal
orgue|mus|Instrument à clavier qui souffle de l'air dans des tuyaux
forte|mus|Indication italienne qui signifie fort
allegro|mus|Indication qui signifie rapide et gai
adagio|mus|Indication qui signifie lent
staccato|mus|Notes jouées courtes et détachées
legato|mus|Notes jouées liées et sans coupure
rappel|mus|Morceau joué en plus à la demande du public
duo|mus|Pièce pour deux interprètes
solo|mus|Passage joué par un seul musicien
quatuor|mus|Ensemble de quatre musiciens
fugue|mus|Pièce où un thème est imité par plusieurs voix
valse|mus|Danse à trois temps
hymne|mus|Chant solennel d'une nation ou d'un groupe
métronome|mus|Appareil qui bat une mesure régulière
chef|mus|Personne qui dirige un orchestre
pédale|mus|Levier au pied qui prolonge le son du piano
ensemble|mus|Groupe de musiciens qui jouent ensemble
crescendo|mus|Augmentation progressive du volume
ouverture|mus|Introduction orchestrale d'un opéra
prélude|mus|Courte pièce d'introduction
cadence|mus|Suite d'accords qui termine une phrase musicale
intervalle|mus|Distance de hauteur entre deux notes
dièse|mus|Signe qui hausse une note d'un demi-ton
bémol|mus|Signe qui baisse une note d'un demi-ton
solfège|mus|Étude des notes do, ré, mi, fa, sol, la, si
atome|sci|Plus petite partie d'un élément chimique
orbite|sci|Trajectoire courbe autour d'un astre
comète|sci|Astre glacé qui forme une queue près du Soleil
galaxie|sci|Immense système d'étoiles, de gaz et de poussière
planète|sci|Grand corps qui tourne autour d'une étoile
nébuleuse|sci|Nuage de gaz et de poussière dans l'espace
photon|sci|Particule de lumière
quasar|sci|Noyau extrêmement lumineux d'une galaxie lointaine
gravité|sci|Force qui attire les masses entre elles
aimant|sci|Objet qui attire le fer
fossile|sci|Reste d'un être ancien conservé dans la roche
prisme|sci|Objet de verre qui décompose la lumière
laser|sci|Faisceau de lumière très intense et étroit
enzyme|sci|Protéine qui accélère une réaction chimique
neurone|sci|Cellule nerveuse qui transmet des signaux
génome|sci|Ensemble des gènes d'un être vivant
lunaire|sci|Qui concerne la Lune
solaire|sci|Qui concerne le Soleil
éclipse|sci|Quand un astre cache la lumière d'un autre
météore|sci|Trait lumineux d'une roche qui brûle dans l'air
oxygène|sci|Gaz que nous respirons pour vivre
carbone|sci|Élément présent dans tous les êtres vivants
énergie|sci|Capacité de produire un travail
vitesse|sci|Distance parcourue par unité de temps
molécule|sci|Groupe d'atomes liés ensemble
cristal|sci|Solide à structure régulière et répétée
volcan|sci|Montagne qui peut cracher de la lave
glacier|sci|Masse de glace qui avance lentement
climat|sci|Temps qu'il fait en moyenne sur une longue durée
espèce|sci|Groupe d'êtres vivants semblables
hypothèse|sci|Explication proposée avant une expérience
premier|num|Se dit d'un nombre divisible seulement par 1 et lui-même
chiffre|num|Signe de 0 à 9 qui sert à écrire les nombres
ratio|num|Rapport entre deux quantités
angle|num|Écart entre deux droites qui se rencontrent
rayon|num|Distance du centre d'un cercle à son bord
vecteur|num|Grandeur qui a une longueur et une direction
matrice|num|Tableau rectangulaire de nombres
entier|num|Nombre sans partie décimale
décimal|num|Système de numération en base dix
fraction|num|Partie d'un tout, comme trois quarts
infini|num|Qui n'a pas de fin
gogol|num|Dix à la puissance cent
milliard|num|Mille millions
billion|num|En français, un million de millions
nonillion|num|En français, dix à la puissance cinquante-quatre
exposant|num|Petit nombre en haut qui indique une puissance
cube|num|Nombre multiplié trois fois par lui-même
médiane|num|Valeur du milieu d'une liste ordonnée
moyenne|num|Somme divisée par le nombre de valeurs
théorème|num|Énoncé démontré par la logique
équation|num|Égalité qui contient une inconnue
symétrie|num|Équilibre de parties identiques de chaque côté
suite|num|Liste ordonnée qui suit une règle
diviseur|num|Nombre qui en divise un autre exactement
binaire|num|Système qui n'utilise que 0 et 1
algèbre|num|Mathématiques qui utilisent des lettres pour les inconnues
polygone|num|Figure plane à côtés droits
nom|lang|Mot qui désigne une personne, un lieu ou une chose
verbe|lang|Mot qui exprime une action ou un état
adverbe|lang|Mot qui modifie un verbe
syllabe|lang|Groupe de sons prononcés d'une seule émission de voix
voyelle|lang|Lettre comme a, e, i, o, u ou y
expression|lang|Groupe de mots au sens figuré
métaphore|lang|Image qui compare sans utiliser comme
synonyme|lang|Mot de même sens qu'un autre
antonyme|lang|Mot de sens contraire
homophone|lang|Mot qui se prononce comme un autre mais s'écrit autrement
préfixe|lang|Élément placé au début d'un mot
suffixe|lang|Élément placé à la fin d'un mot
alphabet|lang|Ensemble des lettres d'une langue
grammaire|lang|Règles pour construire des phrases
dialecte|lang|Variété régionale d'une langue
fable|lang|Court récit avec une morale
roman|lang|Long récit de fiction en prose
poème|lang|Texte écrit en vers
rime|lang|Retour du même son à la fin des vers
strophe|lang|Groupe de vers dans un poème
auteur|lang|Personne qui écrit un livre
lexique|lang|Ensemble des mots d'une langue
anagramme|lang|Mot formé en changeant l'ordre des lettres d'un autre
palindrome|lang|Mot qui se lit dans les deux sens
acronyme|lang|Sigle qui se prononce comme un mot
ironie|lang|Dire le contraire de ce qu'on pense
sarcasme|lang|Ironie mordante
devinette|lang|Question amusante qui cache une réponse
mythe|lang|Récit traditionnel qui explique le monde
légende|lang|Vieux récit mêlant réel et merveilleux
chapitre|lang|Division principale d'un livre
citation|lang|Paroles reprises de quelqu'un d'autre
inférence|lang|Conclusion tirée d'indices non écrits
contexte|lang|Ce qui entoure un mot et aide à le comprendre
anxieux|emo|Inquiet de ce qui pourrait arriver
calme|emo|Paisible et tranquille
fier|emo|Content de ce qu'on a accompli
jaloux|emo|Qui veut ce que quelqu'un d'autre possède
curieux|emo|Qui veut savoir ou apprendre
reconnaissant|emo|Qui dit merci du fond du cœur
seul|emo|Sans compagnie
nerveux|emo|Tendu avant un moment important
emballé|emo|Très enthousiaste
furieux|emo|Extrêmement fâché
soulagé|emo|Content qu'une inquiétude soit finie
gêné|emo|Mal à l'aise devant les autres
confiant|emo|Sûr de ses capacités
empathie|emo|Capacité de comprendre ce que ressent autrui
sincère|emo|Honnête et vrai
frustré|emo|Contrarié de ne pas réussir
déçu|emo|Triste que ce ne soit pas comme espéré
tanné|emo|Au Québec : qui en a assez
pixel|tech|Minuscule point de couleur sur un écran
robot|tech|Machine qui accomplit des tâches seule
serveur|tech|Ordinateur qui fournit des données à d'autres
portable|tech|Ordinateur qu'on peut transporter
curseur|tech|Repère mobile sur un écran
navigateur|tech|Logiciel pour consulter des sites web
réseau|tech|Ensemble d'ordinateurs reliés
algorithme|tech|Suite d'étapes pour résoudre un problème
courriel|tech|Au Québec : message électronique
clavarder|tech|Au Québec : discuter en ligne par écrit
avatar|tech|Image qui représente un utilisateur
drone|tech|Petit appareil volant piloté à distance
circuit|tech|Chemin fermé du courant électrique
batterie|tech|Appareil qui stocke l'énergie électrique
signal|tech|Message électronique transmis à distance
octet|tech|Unité de données de huit bits
bogue|tech|Erreur dans un programme
forêt|nat|Grande étendue couverte d'arbres
érable|nat|Arbre dont la sève donne du sirop
rivière|nat|Cours d'eau naturel
canyon|nat|Vallée profonde aux parois abruptes
île|nat|Terre entourée d'eau
désert|nat|Région très sèche
tonnerre|nat|Bruit qui suit l'éclair
tempête|nat|Vents violents avec pluie ou neige
havre|nat|Abri où les bateaux accostent
pont|nat|Ouvrage qui permet de traverser
château|nat|Grand bâtiment fortifié
lanterne|nat|Lampe portative protégée
boussole|nat|Instrument qui indique le nord
voyage|nat|Déplacement vers un lieu lointain
casse-tête|nat|Au Québec : puzzle
trésor|nat|Ensemble caché d'objets précieux
musée|nat|Lieu où l'on expose des objets importants
bibliothèque|nat|Lieu où l'on emprunte des livres
recette|nat|Instructions pour préparer un plat
marathon|nat|Course d'environ quarante-deux kilomètres
hockey|nat|Sport joué sur glace avec une rondelle
poutine|qc|Frites, fromage en grains et sauce brune
tuque|qc|Bonnet de laine pour l'hiver
dépanneur|qc|Petite épicerie de quartier ouverte tard
bleuet|qc|Petit fruit bleu du Québec
huard|qc|Oiseau aquatique; aussi la pièce d'un dollar
magasiner|qc|Faire les magasins
motoneige|qc|Véhicule pour rouler sur la neige
cégep|qc|Collège entre le secondaire et l'université
traversier|qc|Bateau qui fait traverser un fleuve
érablière|qc|Forêt d'érables exploitée pour le sirop
patinoire|qc|Surface glacée pour patiner
sirop|qc|Liquide sucré, comme celui d'érable
banquise|nat|Étendue de glace flottante`,
};
const GLOSSARY = {};
for (const lang in GLOSSARY_SRC) {
  GLOSSARY[lang] = GLOSSARY_SRC[lang].trim().split('\n').map(line => {
    const [w, c, d] = line.split('|');
    return { w: w.trim(), c: c.trim(), d: d.trim() };
  });
}
