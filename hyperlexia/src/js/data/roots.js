'use strict';
// Greek & Latin roots shared by English and French.  id | EN meaning | FR meaning
const ROOTS_SRC = `tele|far|loin
phone|sound|son
scope|look at|regarder
micro|small|petit
bio|life|vie
logy|study of|étude de
geo|earth|terre
auto|self|soi-même
graph|write, draw|écrire, tracer
photo|light|lumière
therm|heat|chaleur
meter|measure|mesure
chrono|time|temps
hydro|water|eau
phobia|fear of|peur de
astro|star|étoile
nomy|laws of|lois de
poly|many|plusieurs
gon|angle|angle
mono|one|un
logue|speech|discours
sym|together|ensemble
port|carry|porter
able|can be|qui peut être
omni|all|tout
herbi|plant|plante
carni|flesh|chair
vore|eat|manger
sub|under|sous
marine|sea|mer
cardio|heart|cœur
kilo|thousand|mille
gram|written, weight|écrit, poids
centi|hundredth|centième
tri|three|trois
bi|two|deux
cycle|circle, wheel|cercle, roue
philo|love of|amour de
sophy|wisdom|sagesse
pathy|feeling|sentiment
arachno|spider|araignée
tone|tone, pitch|ton
glot|tongue, language|langue
homo|same|même
xylo|wood|bois
mega|great, large|grand
penta|five|cinq
hexa|six|six`;
// EN word | FR word | roots (+) | EN definition | FR definition
const ROOTWORDS_SRC = `telephone|téléphone|tele+phone|A device that carries sound far away|Appareil qui transporte le son au loin
telescope|télescope|tele+scope|An instrument to look at far-away things|Instrument pour regarder ce qui est loin
microscope|microscope|micro+scope|An instrument to look at very small things|Instrument pour regarder ce qui est tout petit
biology|biologie|bio+logy|The study of life|L’étude de la vie
geology|géologie|geo+logy|The study of the earth and its rocks|L’étude de la terre et de ses roches
autograph|autographe|auto+graph|A signature written by the person themself|Signature écrite par la personne elle-même
photograph|photographie|photo+graph|An image drawn with light|Image tracée avec la lumière
thermometer|thermomètre|therm+meter|A tool that measures heat|Outil qui mesure la chaleur
chronometer|chronomètre|chrono+meter|A device that measures time precisely|Appareil qui mesure le temps avec précision
hydrophobia|hydrophobie|hydro+phobia|A fear of water|Peur de l’eau
astronomy|astronomie|astro+nomy|The science of the laws of the stars|Science des lois des étoiles
polygon|polygone|poly+gon|A shape with many angles|Figure qui a plusieurs angles
monologue|monologue|mono+logue|A speech by one person|Discours d’une seule personne
symphony|symphonie|sym+phone|Many sounds played together by an orchestra|Des sons joués ensemble par un orchestre
microphone|microphone|micro+phone|A device that captures small sounds|Appareil qui capte les petits sons
portable|portable|port+able|Something that can be carried|Qui peut être porté
omnivore|omnivore|omni+vore|An animal that eats everything|Animal qui mange de tout
herbivore|herbivore|herbi+vore|An animal that eats plants|Animal qui mange des plantes
carnivore|carnivore|carni+vore|An animal that eats meat|Animal qui mange de la chair
submarine|sous-marin|sub+marine|A vessel that travels under the sea|Navire qui circule sous la mer
cardiology|cardiologie|cardio+logy|The study of the heart|L’étude du cœur
kilogram|kilogramme|kilo+gram|A weight of one thousand grams|Poids de mille grammes
centimeter|centimètre|centi+meter|One hundredth of a metre|Un centième de mètre
tricycle|tricycle|tri+cycle|A vehicle with three wheels|Véhicule à trois roues
bicycle|bicyclette|bi+cycle|A vehicle with two wheels|Véhicule à deux roues
philosophy|philosophie|philo+sophy|The love of wisdom|L’amour de la sagesse
geography|géographie|geo+graph|Writing and drawing about the earth|Description écrite et tracée de la terre
biography|biographie|bio+graph|The written story of a life|Récit écrit d’une vie
autobiography|autobiographie|auto+bio+graph|The story of your life written by yourself|Récit de sa propre vie écrit par soi-même
telepathy|télépathie|tele+pathy|Feeling another’s thoughts from far away|Ressentir les pensées d’autrui à distance
sympathy|sympathie|sym+pathy|Feeling together with someone|Ressentir avec quelqu’un
chronology|chronologie|chrono+logy|The study of the order of events in time|L’étude de l’ordre des événements dans le temps
arachnophobia|arachnophobie|arachno+phobia|A fear of spiders|Peur des araignées
monotone|monotone|mono+tone|Staying on one single pitch|Qui reste sur un seul ton
polyglot|polyglotte|poly+glot|A person who speaks many languages|Personne qui parle plusieurs langues
homophone|homophone|homo+phone|A word with the same sound as another|Mot qui a le même son qu’un autre
microbiology|microbiologie|micro+bio+logy|The study of very small living things|L’étude des tout petits êtres vivants
geometry|géométrie|geo+meter|Measuring the earth and shapes|La mesure de la terre et des formes
xylophone|xylophone|xylo+phone|An instrument whose wooden bars make sound|Instrument dont les lames de bois font du son
megaphone|mégaphone|mega+phone|A device that makes sound large|Appareil qui rend le son très grand
pentagon|pentagone|penta+gon|A shape with five angles|Figure à cinq angles
hexagon|hexagone|hexa+gon|A shape with six angles|Figure à six angles
photophobia|photophobie|photo+phobia|Sensitivity to or fear of light|Sensibilité ou peur de la lumière`;
const ROOTS = {}; ROOTS_SRC.split('\n').forEach(l => { const [id, en, fr] = l.split('|'); ROOTS[id] = { id, en, fr }; });
const ROOTWORDS = ROOTWORDS_SRC.split('\n').map(l => { const [en, fr, r, den, dfr] = l.split('|'); return { en, fr, r: r.split('+'), den, dfr }; });
