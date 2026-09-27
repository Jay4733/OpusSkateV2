'use strict';
// Grammar Racer: sentence with ___ | correct | wrong | wrong
const RACER_SRC = {
en: `___ going to the concert tonight.|They're|Their|There
The band packed ___ instruments.|their|there|they're
Put the keyboard over ___.|there|their|they're
___ the best pianist in the class.|You're|Your|Yore
Is this ___ sheet music?|your|you're|yore
The dog wagged ___ tail.|its|it's|its'
___ raining cats and dogs.|It's|Its|Its'
I have ___ many notes to learn.|too|to|two
She has ___ tickets for the show.|two|too|to
We walked ___ the music school.|to|too|two
He practised more ___ his brother.|than|then|that
First we tune, ___ we play.|then|than|them
Don't ___ your concert ticket!|lose|loose|loss
This guitar string is ___.|loose|lose|lost
Loud music can ___ your hearing.|affect|effect|afect
The echo ___ was amazing.|effect|affect|efect
I ___ your apology.|accept|except|expect
Everyone came ___ Leo.|except|accept|expect
___ turn is it?|Whose|Who's|Whos
___ ready for the quiz?|Who's|Whose|Whos
I don't know ___ it will snow.|whether|weather|wether
The ___ is cold today.|weather|whether|wether
The ___ closed the school.|principal|principle|principel
Honesty is my main ___.|principle|principal|principel
We ate ___ after dinner.|dessert|desert|desart
The Sahara is a huge ___.|desert|dessert|dessart
I could ___ helped you.|have|of|off
My friend and ___ went skating.|I|me|myself
Between you and ___, it was easy.|me|I|myself
Each of the stars ___ its own light.|has|have|having
Neither of the answers ___ correct.|is|are|be`,
fr: `Il ___ un piano à queue.|a|à|as
Je vais ___ l'école à pied.|à|a|as
Veux-tu du thé ___ du café ?|ou|où|oû
___ est ma tuque ?|Où|Ou|Oû
Julie range ___ livres dans son sac.|ses|ces|c'est
Regarde ___ étoiles là-bas !|ces|ses|sait
___ l'heure de partir.|C'est|S'est|Ses
Il ___ levé très tôt.|s'est|c'est|sait
Mon frère ___ moi jouons du piano.|et|est|ai
La salle ___ pleine.|est|et|ait
Ils ___ gagné le match.|ont|on|om
___ va au cinéma ce soir.|On|Ont|Om
Mes amis ___ en retard.|sont|son|sons
Il a perdu ___ cahier.|son|sont|sons
Nous avons ___ de la tire d'érable.|mangé|manger|mangez
Il faut ___ ce morceau chaque jour.|pratiquer|pratiqué|pratiquez
Elles ont ___ toute la soirée.|dansé|danser|dansez
Le prof ___ a donné un devoir.|leur|leurs|l'heure
Ils ont pris ___ manteaux.|leurs|leur|l'heure
Il ___ souvient de tout.|se|ce|ceux
___ livre est génial.|Ce|Se|Ceux
Il reste ___ de temps.|peu|peut|peux
Il ___ venir demain.|peut|peu|peux
Je ___ t'aider.|peux|peut|peu
___ il neige, on patine.|Quand|Quant|Qu'en
___ à moi, je reste ici.|Quant|Quand|Qu'en
La nuit, les étoiles ___.|brillent|brille|brilles
Nous ___ allés au concert.|sommes|somme|sont
Tu ___ le meilleur joueur !|es|est|et
C'est ___ belle chanson !|une|un|unes`,
};
const RACER = {};
for (const l in RACER_SRC) RACER[l] = RACER_SRC[l].trim().split('\n').map(x => { const [s, a, b, c] = x.split('|'); return { s, a, w: [b, c] }; });
