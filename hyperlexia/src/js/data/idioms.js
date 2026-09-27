'use strict';
// expression | literal emoji | real meaning | wrong1 ; wrong2 ; wrong3 | example sentence (figurative use)
const IDIOMS_SRC = {
en: `It's raining cats and dogs|🌧️🐱🐶|It is raining very hard.|Pets are falling from the sky.;The weather keeps changing.;Animals are fighting outside.|Take an umbrella — it's raining cats and dogs!
Break the ice|🔨🧊|Do or say something to make people feel relaxed when they first meet.|Smash frozen water with a hammer.;End a friendship.;Cool down a drink.|Maya told a funny story to break the ice with her new classmates.
A piece of cake|🍰|Something very easy.|A small dessert.;A reward for good work.;Something sweet but unhealthy.|The spelling test was a piece of cake.
Under the weather|🌦️🧍|Feeling a little sick.|Standing outside in the rain.;Working as a weather reporter.;Feeling very happy.|Leo stayed home because he was feeling under the weather.
Spill the beans|🫘💦|Reveal a secret.|Make a mess while cooking.;Waste food.;Tell a lie.|Don't spill the beans about the surprise party!
Once in a blue moon|🌙💙|Very rarely.|Every night.;Once a month.;When the moon changes colour.|My cousin visits only once in a blue moon.
Cost an arm and a leg|💰💪🦵|Be very expensive.|Need a painful operation.;Be very cheap.;Be a dangerous job.|That grand piano costs an arm and a leg.
Hit the books|📚👊|Study hard.|Punch a pile of books.;Throw books away.;Read very fast.|Exams are next week, so it's time to hit the books.
Let the cat out of the bag|🐈👜|Reveal a secret by accident.|Free a trapped pet.;Go shopping.;Lose your bag.|Sam let the cat out of the bag about Mom's gift.
The ball is in your court|🎾🏟️|It is your turn to decide or act.|You won the tennis match.;You must go play outside.;Someone threw a ball at you.|I've apologized — now the ball is in your court.
Bite off more than you can chew|😮🍔|Take on more than you can handle.|Eat too fast.;Be very hungry.;Talk with your mouth full.|Joining four clubs at once was biting off more than he could chew.
On cloud nine|☁️9️⃣|Extremely happy.|Flying in an airplane.;Daydreaming in class.;Very confused.|She was on cloud nine after her piano exam.
Pull someone's leg|🦵🤲|Joke with or tease someone.|Help someone stand up.;Hurt someone.;Trip someone.|Relax, I'm just pulling your leg!
Hit the nail on the head|🔨📍|Say exactly the right thing.|Do carpentry.;Hurt your thumb.;Be stubborn.|You hit the nail on the head: the problem is the password.
Beat around the bush|🌳🥁|Avoid saying something directly.|Work in the garden.;Play drums outside.;Search carefully.|Stop beating around the bush and tell me what happened.
Get cold feet|🦶🥶|Become nervous and hesitate before something important.|Need warmer socks.;Catch a cold.;Walk in the snow.|He got cold feet right before his recital.
The tip of the iceberg|🧊🏔️|A small visible part of a much bigger problem.|A sharp piece of ice.;The best part of something.;A sign that winter is coming.|The broken screen was just the tip of the iceberg.
Get the ball rolling|⚽➡️|Start an activity or process.|Play soccer.;Stop a game.;Go downhill.|Let's get the ball rolling on our science project.
Butterflies in your stomach|🦋🫃|A nervous, fluttery feeling.|You ate something strange.;You feel sick.;You love nature.|I always get butterflies in my stomach before a test.
Barking up the wrong tree|🐕🌳|Looking for an answer in the wrong place.|A dog chasing a squirrel.;Talking too loudly.;Climbing the wrong tree.|If you think I took your charger, you're barking up the wrong tree.
See eye to eye|👁️↔️👁️|Agree with someone.|Stare at someone.;Be the same height.;Wear the same glasses.|My sister and I don't always see eye to eye.
A blessing in disguise|🎁🎭|Something that seems bad but turns out to be good.|A surprise party.;A costume.;A secret present.|Missing the bus was a blessing in disguise — I met my best friend.
Add fuel to the fire|⛽🔥|Make a bad situation worse.|Cook dinner.;Help someone.;Stay warm.|Yelling back only added fuel to the fire.
Burn the midnight oil|🕛🛢️|Work or study late into the night.|Waste energy.;Start a fire.;Wake up very early.|She burned the midnight oil to finish her essay.
Throw in the towel|🏳️🧺|Give up.|Do the laundry.;Dry off after a shower.;Clean the kitchen.|Don't throw in the towel — you're almost there!
Steal the show|🎭⭐|Get the most attention and praise.|Rob a theatre.;Ruin a performance.;Leave the show early.|The young pianist stole the show.
Face the music|🎼😬|Accept the consequences of what you did.|Go to a concert.;Turn toward the orchestra.;Sing very loudly.|He broke the window, so now he has to face the music.
Music to my ears|🎶👂|Very welcome news.|A new song.;A noise that is too loud.;New headphones.|No homework this weekend? That's music to my ears!
Play it by ear|🎹👂|Decide what to do as things happen, without a plan.|Play piano without sheet music (the literal origin).;Refuse to listen.;Play very loudly.|We don't know the weather, so let's play it by ear.
Strike a chord|🎸⚡|Make someone feel emotional or connected.|Hit a guitar.;Start a fight.;Play a wrong note.|Her speech about friendship really struck a chord with me.
Ring a bell|🔔|Sound familiar.|Call someone on the phone.;Announce dinner.;Win a prize.|That name rings a bell — have we met?
In the same boat|🚤👥|In the same difficult situation as others.|Going fishing together.;Travelling on a ferry.;Sharing a bedroom.|We all forgot the homework, so we're in the same boat.
Break a leg|🦵🎭|Good luck! (said to performers)|Get hurt on stage.;Dance badly.;Run very fast.|Break a leg at your recital tonight!
Let off steam|💨🚂|Release anger or energy.|Cook vegetables.;Take a shower.;Start a train.|After the exam, we played basketball to let off steam.
Get out of hand|🖐️➡️|Become out of control.|Drop something.;Stop holding hands.;Finish a task.|The party got out of hand when the music got too loud.
Hang in there|🧗|Don't give up during a hard time.|Climb a wall.;Wait in a line.;Stay on the phone.|Hang in there — the hard part is almost over.
The last straw|🥤🐫|The final problem that makes you lose patience.|The final drink.;A fair choice.;Something cheap.|When my brother read my diary, that was the last straw.
Sit tight|🪑|Wait patiently without doing anything.|Sit on a tiny chair.;Wear tight clothes.;Sit up straight.|Sit tight — the results come out tomorrow.
Keep an eye on|👁️|Watch someone or something carefully.|Hold an eyeball.;Close one eye.;Ignore something.|Can you keep an eye on my bag for a minute?
Hit the road|🛣️👊|Leave or start a journey.|Punch the ground.;Have an accident.;Repair a street.|It's getting late — we should hit the road.`,
fr: `Il pleut à boire debout|🌧️🧍🥤|Il pleut très fort.|On boit la pluie debout.;Il pleut un tout petit peu.;Il fait soif dehors.|Prends ton parapluie, il pleut à boire debout !
Lâche pas la patate|✊🥔|N’abandonne pas, continue !|Tiens bien ta patate.;Mange tes légumes.;Ne laisse pas tomber la nourriture.|Il te reste un examen : lâche pas la patate !
Attache ta tuque avec de la broche|🧶🪢|Prépare-toi, ça va brasser !|Il fait froid, habille-toi.;Répare ton bonnet.;Sois élégant.|Le prof arrive avec une surprise… attache ta tuque avec de la broche !
Avoir de l’eau dans la cave|👖💧|Porter un pantalon trop court.|Avoir un sous-sol inondé.;Avoir soif.;Être triste.|Tu as grandi ! T’as de l’eau dans la cave.
Être aux oiseaux|🐦😊|Être très heureux, ravi.|Observer des oiseaux.;Être dans la lune.;Avoir peur.|Elle était aux oiseaux après son récital.
Se tirer une bûche|🪵🪑|Prendre une chaise, s’asseoir.|Couper du bois.;Faire un feu.;S’en aller.|Tire-toi une bûche, on va jaser !
Être vite sur ses patins|⛸️💨|Réagir vite, avoir l’esprit vif.|Patiner très vite.;Être pressé.;Être maladroit.|Il a trouvé la réponse avant tout le monde : il est vite sur ses patins.
Accouche qu’on baptise !|👶⛪|Dis-le enfin, va droit au but !|Parler d’un bébé.;Aller à l’église.;Se dépêcher de partir.|Ça fait dix minutes que tu tournes autour du pot : accouche qu’on baptise !
Avoir la broue dans le toupet|🍺💇|Être très occupé, débordé.|Avoir les cheveux mouillés.;Boire trop.;Être fâché.|Avec trois projets à remettre, j’ai la broue dans le toupet.
C’est de valeur|💎|C’est dommage.|C’est cher.;C’est précieux.;C’est rare.|Tu ne peux pas venir ? C’est de valeur !
Faire la baboune|🐵😤|Bouder.|Faire le singe.;Faire rire.;Faire une grimace pour s’amuser.|Arrête de faire la baboune, on ira au parc demain.
Cogner des clous|🔨😴|Somnoler, s’endormir assis.|Faire de la menuiserie.;Être fâché.;Travailler très fort.|En plein cours de maths, Hugo cognait des clous.
Parler à travers son chapeau|🎩🗣️|Parler de quelque chose sans le connaître.|Parler tout bas.;Parler en cachette.;Parler poliment.|Il n’a jamais joué du piano : il parle à travers son chapeau.
Avoir les deux pieds dans la même bottine|👢🦶|Être maladroit ou manquer d’initiative.|Avoir froid aux pieds.;Marcher vite.;Porter de petites bottes.|Bouge-toi un peu, t’as les deux pieds dans la même bottine !
Se faire passer un sapin|🌲🤥|Se faire avoir, se faire tromper.|Recevoir un arbre de Noël.;Se perdre en forêt.;Gagner un prix.|Il a payé trop cher : il s’est fait passer un sapin.
Tirer la pipe|😜|Taquiner quelqu’un pour rire.|Fumer.;Tirer sur un objet.;Se fâcher.|Fâche-toi pas, je te tire la pipe !
Ne pas être sorti du bois|🌲🌲🚶|Avoir encore bien des difficultés devant soi.|Être perdu en forêt.;Aimer la nature.;Rester à la maison.|Il reste trois examens : on n’est pas sortis du bois !
Il n’y a pas le feu au lac|🔥🏞️|Rien ne presse, on a le temps.|Le lac est gelé.;Il fait froid.;Il ne faut pas se baigner.|Prends ton temps, il n’y a pas le feu au lac.
Casser la glace|🔨🧊|Briser le silence pour mettre les gens à l’aise.|Briser un glaçon.;Tomber sur la glace.;Refroidir une boisson.|Sam a raconté une blague pour casser la glace.
Avoir la tête dans les nuages|🧑☁️|Être distrait, rêveur.|Être dans un avion.;Être très grand.;Avoir froid.|Il a oublié son sac : il a la tête dans les nuages.
Poser un lapin|🐇📍|Ne pas venir à un rendez-vous.|Offrir un lapin.;Déposer un animal.;Arriver en avance.|Mon ami m’a posé un lapin : il n’est jamais venu.
Avoir un chat dans la gorge|🐈😮|Être enroué, avoir la voix rauque.|Avoir avalé un chat.;Avoir faim.;Être nerveux.|Excusez-moi, j’ai un chat dans la gorge.
Coûter les yeux de la tête|👀💸|Coûter très cher.|Être dangereux pour les yeux.;Avoir mal aux yeux.;Être gratuit.|Ce piano à queue coûte les yeux de la tête.
Mettre les pieds dans le plat|🦶🍽️|Faire une gaffe en abordant un sujet délicat.|Marcher dans la nourriture.;Cuisiner.;Mettre la table.|Il a mis les pieds dans le plat en parlant de la surprise.
Avoir le cœur sur la main|❤️✋|Être très généreux.|Être en amour.;Avoir mal au cœur.;Être prudent.|Ma grand-mère a le cœur sur la main.
Tomber dans les pommes|🍎😵|S’évanouir.|Cueillir des pommes.;Tomber d’un arbre.;Aimer les fruits.|Il faisait si chaud qu’elle est tombée dans les pommes.
Donner sa langue au chat|👅🐈|Renoncer à trouver la réponse.|Nourrir son chat.;Se taire.;Mentir.|Je ne trouve pas la devinette, je donne ma langue au chat.
Avoir la chienne|🐕😨|Avoir peur.|Avoir un chien.;Être fâché.;Être fatigué.|J’avais la chienne avant de jouer devant tout le monde.
Être dans la lune|🌙🧑|Être distrait.|Être astronaute.;Dormir.;Être heureux.|Désolé, j’étais dans la lune, peux-tu répéter ?
Avoir le motton|🥲|Avoir une boule d’émotion dans la gorge, être ému.|Avoir faim.;Avoir froid.;Être en colère.|À la fin du film, j’avais le motton.
Chanter la pomme|🎤🍎|Faire la cour à quelqu’un.|Chanter faux.;Chanter une chanson sur les fruits.;Se vanter.|Il chante la pomme à sa voisine depuis des semaines.
C’est tiguidou|👍|C’est parfait, tout va bien.|C’est drôle.;C’est bizarre.;C’est fini.|On se voit à 18 h ? C’est tiguidou !
Avoir du front tout le tour de la tête|😏|Être effronté, avoir beaucoup de culot.|Avoir un grand front.;Être intelligent.;Avoir chaud.|Il a pris la dernière part sans demander : il a du front tout le tour de la tête !
Mettre la switch à off|🔌|Se détendre, arrêter de penser.|Éteindre la lumière.;Dormir.;Réparer un appareil.|Après les examens, je mets la switch à off.
Passer la nuit sur la corde à linge|🧺🌙|Ne pas dormir de la nuit.|Faire la lessive.;Dormir dehors.;Faire de l’acrobatie.|Le bébé pleurait : on a passé la nuit sur la corde à linge.
Il y a de l’eau dans le gaz|💧⛽|Il y a de la tension, une dispute se prépare.|Le moteur est brisé.;Il pleut.;La cuisine est inondée.|Mes deux amis ne se parlent plus : il y a de l’eau dans le gaz.
Être sur le piton|🔘⚡|Être en pleine forme, prêt à tout.|Être assis sur un bouton.;Être au sommet d’une montagne.;Être pressé.|Après une bonne nuit, je suis sur le piton !
Faire la pluie et le beau temps|🌧️☀️|Décider de tout, avoir beaucoup d’influence.|Prédire la météo.;Changer d’humeur.;Aimer l’été.|Dans ce club, c’est elle qui fait la pluie et le beau temps.
Avoir les yeux plus grands que la panse|👀🍽️|Se servir plus qu’on peut manger, viser trop gros.|Avoir de grands yeux.;Avoir faim.;Voir très loin.|Trois assiettes ? T’as les yeux plus grands que la panse !
Donner un coup de main|🤝|Aider quelqu’un.|Frapper quelqu’un.;Saluer.;Applaudir.|Peux-tu me donner un coup de main pour déménager le piano ?`,
};
const LITFIG = {
  en: [['Careful — you’ll spill the beans all over the counter.', 'L'], ['Leo spilled the beans about the surprise party.', 'F'], ['The ship had to break the ice to reach the harbour.', 'L'], ['Ana told a joke to break the ice with her new classmates.', 'F'],
    ['He grabbed a piece of cake from the fridge.', 'L'], ['The quiz was a piece of cake.', 'F'], ['The pianist turned to face the music stand.', 'L'], ['He broke the vase, so now he has to face the music.', 'F'],
    ['She rang the bell at the front door.', 'L'], ['That name rings a bell.', 'F'], ['The campers added fuel to the fire to stay warm.', 'L'], ['Yelling back just added fuel to the fire.', 'F'],
    ['My feet are cold because my boots are wet.', 'L'], ['She got cold feet right before the recital.', 'F'], ['All five friends sat in the same boat on the lake.', 'L'], ['We all failed the quiz, so we’re in the same boat.', 'F']],
  fr: [['Le bateau devait casser la glace pour avancer sur le fleuve.', 'L'], ['Sam a raconté une blague pour casser la glace.', 'F'], ['Le petit a mis les pieds dans le plat de spaghettis !', 'L'], ['Il a mis les pieds dans le plat en parlant de la surprise.', 'F'],
    ['Le tuyau a fui : il y a de l’eau dans la cave !', 'L'], ['Ton pantalon est trop court, t’as de l’eau dans la cave.', 'F'], ['Le menuisier cogne des clous dans la planche.', 'L'], ['En plein cours, Hugo cognait des clous.', 'F'],
    ['On a marché deux heures : on n’est pas sortis du bois avant midi.', 'L'], ['Il reste trois examens : on n’est pas sortis du bois !', 'F'], ['Le chat a sauté et il est tombé dans les pommes du panier.', 'L'], ['Il faisait si chaud qu’elle est tombée dans les pommes.', 'F'],
    ['Le magicien a posé un lapin sur la table.', 'L'], ['Mon ami m’a posé un lapin : il n’est jamais venu.', 'F'], ['Grand-papa se tire une bûche du tas de bois pour le foyer.', 'L'], ['Tire-toi une bûche, on va jaser !', 'F']],
};
const IDIOMS = {};
for (const l in IDIOMS_SRC) IDIOMS[l] = IDIOMS_SRC[l].trim().split('\n').map(s => { const [x, e, m, w, ex] = s.split('|'); return { x, e, m, w: w.split(';'), ex }; });
