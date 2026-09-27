'use strict';
// Conversation Quest scenarios. step: [npcLine, [[reply, npcReaction, delta(-1..2), tip], ...]]
const CONVO = {
en: [
  { title: 'The new lab partner', icon: '🧪', npc: 'Aiden', av: '🧑🏽‍🔬', bg: ['#0f3d4a', '#12234d'], steps: [
    ['Hey… I think Ms. Chen put us together for the lab. I’m Aiden.', [
      ['“Hi Aiden, I’m {me}. Have you done this kind of lab before?”', 'Aiden relaxes. “Once, in my old school. Not great at the math part though.”', 2, 'Introduce yourself and ask a question — it gives the other person an easy way to keep talking.'],
      ['“Okay.”', 'Aiden nods and looks at his notebook. The silence feels a bit long.', 0, 'One-word replies can feel like you don’t want to talk, even if you do.'],
      ['“Did you know the Milky Way has hundreds of billions of stars?”', 'Aiden blinks. “Uh… cool? What does that have to do with the lab?”', -1, 'Fun facts are great, but first connect to what the other person just said.']]],
    ['He points at the worksheet. “Do you get step 3? I’m kind of lost.”', [
      ['“Yeah — want me to show you how I’d set it up?”', '“That would help a lot, thanks.”', 2, 'Offering help (instead of just doing it) respects the other person.'],
      ['“It’s super easy, obviously.”', 'Aiden’s face falls. “Right. Obviously.”', -1, 'Saying something is “easy” can make someone who is struggling feel bad.'],
      ['Silently finish step 3 yourself.', 'Aiden watches, unsure if he should do something.', 0, 'Working alone in a pair task can leave your partner feeling left out.']]],
    ['While you work, Aiden says: “I’m new here. I don’t really know anyone yet.”', [
      ['“That sounds hard. Want to sit with me and my friends at lunch?”', 'He smiles for real. “Seriously? Yeah, I’d like that.”', 2, 'He shared a feeling. Reflect it (“that sounds hard”), then offer something.'],
      ['“Everyone here is nice, you’ll be fine.”', '“I guess…” He doesn’t sound convinced.', 0, 'Reassurance is kind, but it can skip over how the person feels.'],
      ['“Okay. Anyway, pass the beaker.”', 'Aiden goes quiet.', -1, 'Changing the subject right after someone opens up can feel like you didn’t hear them.']]],
    ['The bell rings. Aiden packs up. “Thanks for today.”', [
      ['“No problem — see you tomorrow, partner!”', '“See you!” He waves on his way out.', 2, 'A warm closing line sets up the next conversation.'],
      ['Leave without answering.', 'He looks around, then leaves alone.', -1, 'Not answering a thank-you can seem cold.'],
      ['“Yep.”', 'He nods and leaves.', 0, 'Short but fine — adding a “see you tomorrow” would make it warmer.']]]] },
  { title: 'After the recital', icon: '🎹', npc: 'Ms. Diaz', av: '👩🏻‍🏫', bg: ['#3a1450', '#101a3d'], steps: [
    ['You just played your recital piece. Your teacher smiles: “That was lovely — especially the slow middle part!”', [
      ['“Thank you! I practised that part a lot.”', '“It shows. Your phrasing was beautiful.”', 2, 'Accepting a compliment with “thank you” is the simplest good response.'],
      ['“No, it was terrible. I messed up bar 12.”', '“Oh… well, I really enjoyed it.” She looks a little awkward.', -1, 'Rejecting a compliment can make the other person feel wrong for saying it.'],
      ['“I know.”', 'She laughs a little. “Confident! Good.”', 0, '“I know” can sound boastful; “thank you” is safer.']]],
    ['A younger student, Léo, comes up: “How do you not get nervous?”', [
      ['“I do get nervous! I breathe slowly and focus on the first notes.”', 'Léo looks relieved. “Oh — so it’s normal?”', 2, 'Being honest about feelings helps others feel less alone.'],
      ['“I never get nervous.”', '“Oh.” Léo looks even more worried about his turn.', -1, 'Pretending to be perfect can make others feel worse.'],
      ['“You just have to practise.”', '“Okay…” Léo still looks scared.', 0, 'True, but it answers the skill, not the feeling he asked about.']]],
    ['Your friend Maya says: “I wish I could play like you.”', [
      ['“Thanks! Want me to show you the first few bars sometime?”', 'Maya beams. “Yes! Saturday?”', 2, 'Turning a compliment into an invitation builds friendship.'],
      ['“Well, I’ve practised way more than you.”', 'Maya’s smile fades.', -1, 'Comparisons can sound like put-downs, even when they are facts.'],
      ['“Thanks.”', 'Maya smiles.', 1, 'A simple thank-you works well.']]],
    ['Your dad hugs you: “I’m so proud of you.”', [
      ['“Thanks, Dad. That means a lot.”', 'He squeezes your shoulder.', 2, 'Naming how the words made you feel deepens the moment.'],
      ['“Can we go? It’s loud here.”', '“Sure, let’s go.” He sounds a bit disappointed.', 0, 'It’s okay to need a quiet space — saying “thanks” first helps.'],
      ['Say nothing and check your phone.', 'He waits, then lets go.', -1, 'Ignoring a hug and kind words can feel hurtful.']]]] },
  { title: 'The project argument', icon: '🌋', npc: 'Tom', av: '🧑🏼', bg: ['#4a1f0f', '#221044'], steps: [
    ['Tom: “I don’t want to do volcanoes. Black holes are way cooler.”', [
      ['“I get it — black holes are cool. Can we list pros and cons of both?”', '“Okay… that’s fair.”', 2, 'Acknowledge the other view, then suggest a fair method.'],
      ['“We voted. You lost. Deal with it.”', 'Tom crosses his arms. “Wow. Okay.”', -1, 'Even when you are right, harsh wording escalates conflict.'],
      ['“Whatever, do what you want.”', 'Tom shrugs. Nothing gets decided.', 0, 'Giving up avoids conflict now but can make you resentful later.']]],
    ['Tom: “Volcanoes are so basic. Every group does them.”', [
      ['“True. What if we do volcanoes on other planets? Like Olympus Mons on Mars?”', 'Tom’s eyes light up. “Wait, that’s actually awesome.”', 2, 'Finding a creative middle ground lets both people win.'],
      ['“You’re basic.”', '“Seriously?”', -1, 'Insults turn a disagreement about ideas into a fight about people.'],
      ['“Basic is fine.”', '“Hmm.” Tom isn’t convinced.', 0, 'This defends your idea but doesn’t address his worry.']]],
    ['Tom: “Okay, but I want to do the space part.”', [
      ['“Deal. I’ll do the geology part and we’ll build the model together.”', '“Perfect.” He writes it down.', 2, 'Clear roles prevent future arguments.'],
      ['“No, I want the space part.”', 'Tom sighs loudly.', -1, 'Compromise means giving something too.'],
      ['“We’ll see.”', 'Tom looks unsure what that means.', 0, 'Vague answers can cause confusion later.']]],
    ['At the end, Tom says: “Sorry I got annoyed earlier.”', [
      ['“It’s okay. I got a bit annoyed too. I think our idea is great now.”', '“Yeah, it really is.” He grins.', 2, 'Accepting an apology and sharing your part repairs the relationship.'],
      ['“You should be sorry.”', 'Tom goes quiet.', -1, 'Rubbing it in can undo an apology.'],
      ['“Okay.”', 'Tom nods.', 1, 'Fine — adding something warm would be even better.']]]] },
  { title: 'A friend after the game', icon: '🏒', npc: 'Priya', av: '👧🏾', bg: ['#0c3350', '#0a1a33'], steps: [
    ['Priya’s hockey team just lost the final. She’s sitting alone. “I missed the last shot.”', [
      ['“That must feel awful. Do you want to talk about it or just sit for a bit?”', 'She sighs. “Maybe just sit for a bit.”', 2, 'Asking what someone needs respects that people cope differently.'],
      ['“It’s just a game.”', '“Not to me,” she says quietly.', -1, 'Minimising something important to someone can hurt.'],
      ['“You should have passed instead.”', 'Priya looks away, eyes wet.', -1, 'Advice about mistakes feels like blame right after a loss.']]],
    ['After a while she says: “Everyone probably thinks I’m useless now.”', [
      ['“I don’t think that. You scored two goals this season that won games.”', 'She looks up. “You remember that?”', 2, 'Specific, true facts are more comforting than general praise.'],
      ['“Yeah, some people might.”', 'Priya’s face crumples.', -1, 'Honesty is important, but not when it confirms a painful fear without evidence.'],
      ['“Don’t think like that.”', '“Easier said than done.”', 0, 'Telling someone how not to feel rarely works.']]],
    ['Priya wipes her eyes. “Thanks for staying.”', [
      ['“Of course. Want to grab a hot chocolate?”', 'She smiles a little. “Yeah. Okay.”', 2, 'A small, kind plan can help someone move forward.'],
      ['“No problem, I have to go.”', '“Oh. Okay, bye.”', 0, 'Leaving is fine — saying when you can talk again helps.'],
      ['“You’re welcome, I’m a great friend.”', 'She laughs a tiny bit. “Sure.”', 0, 'A joke can lighten things — careful it doesn’t shift attention to you.']]]] },
  { title: 'Job interview at the music store', icon: '🎸', npc: 'Mr. Gagnon', av: '👨🏻‍🦳', bg: ['#2f2208', '#1b1036'], steps: [
    ['“Welcome! So, why do you want to work at Le Coin Musical?”', [
      ['“I’ve played piano for years, and I’d love to help customers find the right instrument.”', '“Good answer — passion and service.”', 2, 'Link your strength to what the job needs.'],
      ['“I need money.”', 'He chuckles. “Honest. Anything else?”', 0, 'True, but interviews reward showing interest in the work itself.'],
      ['Talk for five minutes about the history of the piano.', 'He glances at the clock. “Interesting… let’s move on.”', -1, 'Keep answers to about 30–60 seconds; watch for signs the listener is done.']]],
    ['“A customer is upset because a guitar they bought is broken. What do you do?”', [
      ['“I’d apologise, listen to what happened, and check what our return policy allows.”', '“Exactly what we do.”', 2, 'Listening first calms an upset person.'],
      ['“Tell them it’s probably their fault.”', 'He frowns. “Hmm.”', -1, 'Blaming customers escalates conflict.'],
      ['“Call you right away.”', '“Sometimes, yes. But what would you say first?”', 1, 'Getting help is good; showing you can handle the first step is better.']]],
    ['“Do you have any questions for me?”', [
      ['“Yes — what does a normal shift look like?”', '“Great question.” He explains happily.', 2, 'Asking a question shows genuine interest.'],
      ['“No.”', '“Okay then.”', 0, 'It’s fine, but one prepared question makes a strong impression.'],
      ['“How much do the other employees earn?”', '“That’s… private.”', -1, 'Some questions are considered too personal in an interview.']]],
    ['He stands and holds out his hand. “Thanks for coming in.”', [
      ['Shake his hand: “Thank you for your time. I hope to hear from you!”', '“You will.” He smiles.', 2, 'A clear thank-you and hopeful closing is professional.'],
      ['Wave and leave.', 'He lowers his hand slowly.', 0, 'A handshake or a verbal thank-you is expected here.'],
      ['“So did I get the job?”', 'He laughs. “We’ll call you this week.”', 0, 'It’s normal to wait for their decision.']]]] },
  { title: 'Making weekend plans', icon: '🎮', npc: 'Noah', av: '🧑🏻', bg: ['#123d2a', '#0f1840'], steps: [
    ['You want to invite Noah to try the new rhythm game. He’s at his locker.', [
      ['“Hey Noah! I got a new rhythm game — want to come over Saturday and try it?”', '“Oh cool! What kind of music is in it?”', 2, 'A specific invitation (what, when) is easy to answer.'],
      ['“Do you maybe possibly want to hang out sometime or not?”', '“Uh… maybe?”', 0, 'Vague invitations get vague answers.'],
      ['Wait for him to invite you.', 'Noah closes his locker and leaves.', -1, 'Sometimes you need to make the first move.']]],
    ['Noah: “Saturday I can’t, I have a family thing.”', [
      ['“No worries! How about Sunday afternoon?”', '“Sunday works!”', 2, 'A “no” to a time is not a “no” to you — offer another option.'],
      ['“Fine. Forget it then.”', '“Oh… okay.” He looks surprised.', -1, 'Taking a scheduling conflict as rejection can end a friendship before it starts.'],
      ['“Why? What family thing?”', '“Just… a family thing.” He shifts.', 0, 'Pushing for private details can feel intrusive.']]],
    ['Sunday, Noah loses three rounds in a row and laughs: “I’m so bad at this!”', [
      ['“You’re getting better! Want me to show you the timing trick?”', '“Yes, please!”', 2, 'Encouragement plus help keeps the fun going.'],
      ['“Yeah, you really are.”', 'His laugh stops.', -1, 'When someone jokes about themselves, agreeing can sting.'],
      ['Keep playing without saying anything.', 'He keeps trying, a bit quieter.', 0, 'A kind word would make it more fun for both.']]]] },
],
fr: [
  { title: 'Le nouveau partenaire de labo', icon: '🧪', npc: 'Aiden', av: '🧑🏽‍🔬', bg: ['#0f3d4a', '#12234d'], steps: [
    ['Salut… Je pense que Mme Chen nous a mis ensemble pour le labo. Moi, c’est Aiden.', [
      ['« Salut Aiden, moi c’est {me}. As-tu déjà fait ce genre de labo ? »', 'Aiden se détend. « Une fois, à mon ancienne école. Je suis pas fort en maths, par contre. »', 2, 'Te présenter et poser une question donne à l’autre une façon facile de continuer.'],
      ['« OK. »', 'Aiden hoche la tête et regarde son cahier. Le silence est un peu long.', 0, 'Une réponse d’un mot peut donner l’impression que tu ne veux pas parler.'],
      ['« Savais-tu que la Voie lactée compte des centaines de milliards d’étoiles ? »', 'Aiden cligne des yeux. « Euh… cool ? Quel rapport avec le labo ? »', -1, 'Les faits fascinants, c’est super, mais relie-toi d’abord à ce que l’autre vient de dire.']]],
    ['Il montre la feuille. « Comprends-tu l’étape 3 ? Je suis un peu perdu. »', [
      ['« Oui — veux-tu que je te montre comment je la ferais ? »', '« Ça m’aiderait vraiment, merci. »', 2, 'Offrir de l’aide (au lieu de tout faire) respecte l’autre.'],
      ['« C’est super facile, voyons. »', 'Aiden baisse les yeux. « Ouin. Facile. »', -1, 'Dire que c’est « facile » peut blesser quelqu’un qui a de la difficulté.'],
      ['Faire l’étape 3 seul, sans rien dire.', 'Aiden regarde, sans savoir quoi faire.', 0, 'Travailler seul dans un travail d’équipe peut exclure ton partenaire.']]],
    ['Pendant le travail, Aiden dit : « Je suis nouveau. Je connais pas vraiment personne. »', [
      ['« Ça doit être difficile. Veux-tu dîner avec moi et mes amis ? »', 'Il sourit pour vrai. « Sérieux ? Oui, j’aimerais ça. »', 2, 'Il a partagé une émotion : reflète-la (« ça doit être difficile »), puis propose quelque chose.'],
      ['« Tout le monde est fin ici, ça va bien aller. »', '« J’imagine… » Il n’a pas l’air convaincu.', 0, 'Rassurer, c’est gentil, mais ça peut sauter par-dessus l’émotion.'],
      ['« OK. Bon, passe-moi le bécher. »', 'Aiden devient silencieux.', -1, 'Changer de sujet juste après une confidence donne l’impression de ne pas avoir écouté.']]],
    ['La cloche sonne. Aiden range ses affaires. « Merci pour aujourd’hui. »', [
      ['« Pas de quoi — à demain, partenaire ! »', '« À demain ! » Il te salue en sortant.', 2, 'Une phrase de fin chaleureuse prépare la prochaine conversation.'],
      ['Partir sans répondre.', 'Il regarde autour de lui, puis part seul.', -1, 'Ne pas répondre à un merci peut sembler froid.'],
      ['« Ouais. »', 'Il hoche la tête et part.', 0, 'Court mais correct — « à demain » serait plus chaleureux.']]]] },
  { title: 'Après le récital', icon: '🎹', npc: 'Mme Diaz', av: '👩🏻‍🏫', bg: ['#3a1450', '#101a3d'], steps: [
    ['Tu viens de jouer ta pièce. Ton enseignante sourit : « C’était magnifique — surtout la partie lente du milieu ! »', [
      ['« Merci ! J’ai beaucoup pratiqué ce passage. »', '« Ça paraît. Ton phrasé était superbe. »', 2, 'Accepter un compliment avec « merci », c’est la réponse la plus simple.'],
      ['« Non, c’était poche. J’ai raté la mesure 12. »', '« Oh… moi, j’ai adoré. » Elle semble mal à l’aise.', -1, 'Refuser un compliment peut donner l’impression à l’autre d’avoir eu tort.'],
      ['« Je sais. »', 'Elle rit un peu. « Confiant ! Tant mieux. »', 0, '« Je sais » peut sembler vantard; « merci » est plus sûr.']]],
    ['Un plus jeune, Léo, s’approche : « Comment tu fais pour pas être nerveux ? »', [
      ['« Je suis nerveux aussi ! Je respire lentement et je me concentre sur les premières notes. »', 'Léo a l’air soulagé. « Ah — c’est normal, alors ? »', 2, 'Être honnête sur ses émotions aide les autres à se sentir moins seuls.'],
      ['« Je suis jamais nerveux. »', '« Ah. » Léo a l’air encore plus inquiet.', -1, 'Faire semblant d’être parfait peut faire sentir les autres moins bons.'],
      ['« Faut juste pratiquer. »', '« OK… » Léo a encore peur.', 0, 'C’est vrai, mais ça répond à la technique, pas à l’émotion.']]],
    ['Ton amie Maya dit : « J’aimerais tellement jouer comme toi. »', [
      ['« Merci ! Veux-tu que je te montre les premières mesures un moment donné ? »', 'Maya rayonne. « Oui ! Samedi ? »', 2, 'Transformer un compliment en invitation bâtit l’amitié.'],
      ['« Ben, j’ai pratiqué pas mal plus que toi. »', 'Le sourire de Maya disparaît.', -1, 'Les comparaisons peuvent sonner comme des critiques, même si ce sont des faits.'],
      ['« Merci. »', 'Maya sourit.', 1, 'Un simple merci fonctionne bien.']]],
    ['Ton père te serre dans ses bras : « Je suis tellement fier de toi. »', [
      ['« Merci, papa. Ça me touche. »', 'Il te serre l’épaule.', 2, 'Nommer ce que les mots te font ressentir approfondit le moment.'],
      ['« On peut partir ? C’est bruyant ici. »', '« Bien sûr, on y va. » Il semble un peu déçu.', 0, 'C’est correct d’avoir besoin de calme — dire merci d’abord aide.'],
      ['Ne rien dire et regarder ton cell.', 'Il attend, puis te lâche.', -1, 'Ignorer un câlin et des mots gentils peut blesser.']]]] },
  { title: 'La chicane de projet', icon: '🌋', npc: 'Tom', av: '🧑🏼', bg: ['#4a1f0f', '#221044'], steps: [
    ['Tom : « J’veux pas faire les volcans. Les trous noirs, c’est ben plus cool. »', [
      ['« Je comprends — les trous noirs, c’est cool. On fait une liste des pour et des contre ? »', '« OK… c’est juste. »', 2, 'Reconnaître l’autre point de vue, puis proposer une méthode juste.'],
      ['« On a voté. T’as perdu. Accepte-le. »', 'Tom croise les bras. « Wow. OK. »', -1, 'Même quand tu as raison, des mots durs font monter le conflit.'],
      ['« Bof, fais ce que tu veux. »', 'Tom hausse les épaules. Rien n’est décidé.', 0, 'Abandonner évite le conflit, mais peut te frustrer plus tard.']]],
    ['Tom : « Les volcans, c’est tellement ordinaire. Tout le monde fait ça. »', [
      ['« Vrai. Et si on faisait les volcans sur d’autres planètes ? Comme Olympus Mons sur Mars ? »', 'Les yeux de Tom s’illuminent. « Attends, c’est vraiment malade. »', 2, 'Trouver un compromis créatif fait gagner les deux.'],
      ['« C’est toi qui es ordinaire. »', '« Sérieux ? »', -1, 'Les insultes transforment un désaccord d’idées en chicane de personnes.'],
      ['« Ordinaire, c’est correct. »', '« Hum. » Tom n’est pas convaincu.', 0, 'Ça défend ton idée, mais ça ne répond pas à son inquiétude.']]],
    ['Tom : « OK, mais moi, je veux la partie sur l’espace. »', [
      ['« Marché conclu. Je fais la géologie et on construit la maquette ensemble. »', '« Parfait. » Il l’écrit.', 2, 'Des rôles clairs évitent les chicanes futures.'],
      ['« Non, moi je veux l’espace. »', 'Tom soupire fort.', -1, 'Un compromis, c’est aussi donner quelque chose.'],
      ['« On verra. »', 'Tom ne sait pas trop ce que ça veut dire.', 0, 'Les réponses vagues créent de la confusion.']]],
    ['À la fin, Tom dit : « Désolé de m’être fâché tantôt. »', [
      ['« C’est correct. Moi aussi, j’étais un peu fâché. Je trouve notre idée géniale maintenant. »', '« Ouais, elle l’est vraiment. » Il sourit.', 2, 'Accepter des excuses et reconnaître ta part répare la relation.'],
      ['« T’es mieux d’être désolé. »', 'Tom devient silencieux.', -1, 'En remettre peut annuler des excuses.'],
      ['« OK. »', 'Tom hoche la tête.', 1, 'Correct — un mot chaleureux serait encore mieux.']]]] },
  { title: 'Une amie après le match', icon: '🏒', npc: 'Priya', av: '👧🏾', bg: ['#0c3350', '#0a1a33'], steps: [
    ['L’équipe de hockey de Priya vient de perdre la finale. Elle est assise seule. « J’ai raté le dernier tir. »', [
      ['« Ça doit être tellement plate. Veux-tu en parler ou juste t’asseoir un peu ? »', 'Elle soupire. « Juste m’asseoir un peu, peut-être. »', 2, 'Demander ce dont l’autre a besoin respecte sa façon de vivre les choses.'],
      ['« C’est juste une game. »', '« Pas pour moi », dit-elle doucement.', -1, 'Minimiser quelque chose d’important pour l’autre peut blesser.'],
      ['« T’aurais dû faire une passe. »', 'Priya détourne les yeux, les yeux mouillés.', -1, 'Les conseils sur l’erreur ressemblent à un blâme juste après une défaite.']]],
    ['Après un moment : « Tout le monde doit penser que je suis nulle, là. »', [
      ['« Moi, je pense pas ça. T’as compté deux buts gagnants cette saison. »', 'Elle lève les yeux. « Tu t’en souviens ? »', 2, 'Des faits précis et vrais réconfortent plus que des compliments vagues.'],
      ['« Ouin, peut-être certains. »', 'Le visage de Priya s’effondre.', -1, 'L’honnêteté compte, mais pas pour confirmer une peur sans preuve.'],
      ['« Pense pas comme ça. »', '« Facile à dire. »', 0, 'Dire à quelqu’un comment ne pas se sentir fonctionne rarement.']]],
    ['Priya s’essuie les yeux. « Merci d’être resté. »', [
      ['« Voyons, c’est normal. On va se chercher un chocolat chaud ? »', 'Elle sourit un peu. « Oui. OK. »', 2, 'Un petit plan gentil aide à passer à autre chose.'],
      ['« Pas de trouble, faut que j’y aille. »', '« Ah. OK, bye. »', 0, 'Partir, c’est correct — dire quand tu peux lui reparler aide.'],
      ['« De rien, je suis un super ami. »', 'Elle rit un tout petit peu. « C’est ça. »', 0, 'Une blague peut alléger, mais attention de ne pas ramener l’attention sur toi.']]]] },
  { title: 'Entrevue au magasin de musique', icon: '🎸', npc: 'M. Gagnon', av: '👨🏻‍🦳', bg: ['#2f2208', '#1b1036'], steps: [
    ['« Bienvenue ! Alors, pourquoi veux-tu travailler au Coin Musical ? »', [
      ['« Je joue du piano depuis des années et j’aimerais aider les clients à trouver le bon instrument. »', '« Bonne réponse — passion et service. »', 2, 'Relie ta force à ce que le travail demande.'],
      ['« J’ai besoin d’argent. »', 'Il rit. « Honnête. Autre chose ? »', 0, 'Vrai, mais en entrevue, on veut voir ton intérêt pour le travail lui-même.'],
      ['Parler cinq minutes de l’histoire du piano.', 'Il regarde l’horloge. « Intéressant… passons à autre chose. »', -1, 'Garde tes réponses autour de 30 à 60 secondes; surveille les signes que l’autre a fini d’écouter.']]],
    ['« Un client est fâché parce que la guitare qu’il a achetée est brisée. Que fais-tu ? »', [
      ['« Je m’excuse, j’écoute ce qui s’est passé et je vérifie notre politique de retour. »', '« Exactement ce qu’on fait. »', 2, 'Écouter d’abord calme une personne fâchée.'],
      ['« Je lui dis que c’est sûrement de sa faute. »', 'Il fronce les sourcils. « Hum. »', -1, 'Blâmer le client fait monter le conflit.'],
      ['« Je vous appelle tout de suite. »', '« Parfois, oui. Mais que dirais-tu en premier ? »', 1, 'Demander de l’aide, c’est bien; montrer que tu peux gérer la première étape, c’est mieux.']]],
    ['« As-tu des questions pour moi ? »', [
      ['« Oui — à quoi ressemble un quart de travail normal ? »', '« Excellente question. » Il explique avec plaisir.', 2, 'Poser une question montre un intérêt sincère.'],
      ['« Non. »', '« Bon, d’accord. »', 0, 'C’est correct, mais une question préparée fait bonne impression.'],
      ['« Combien gagnent les autres employés ? »', '« C’est… privé. »', -1, 'Certaines questions sont trop personnelles en entrevue.']]],
    ['Il se lève et tend la main. « Merci d’être venu. »', [
      ['Lui serrer la main : « Merci pour votre temps. J’espère avoir de vos nouvelles ! »', '« Tu en auras. » Il sourit.', 2, 'Un merci clair et une fin positive, c’est professionnel.'],
      ['Faire un signe de la main et partir.', 'Il baisse lentement la main.', 0, 'Une poignée de main ou un merci est attendu ici.'],
      ['« Pis, j’ai-tu la job ? »', 'Il rit. « On t’appelle cette semaine. »', 0, 'C’est normal d’attendre leur décision.']]]] },
  { title: 'Des plans pour la fin de semaine', icon: '🎮', npc: 'Noah', av: '🧑🏻', bg: ['#123d2a', '#0f1840'], steps: [
    ['Tu veux inviter Noah à essayer le nouveau jeu de rythme. Il est à son casier.', [
      ['« Salut Noah ! J’ai un nouveau jeu de rythme — veux-tu venir samedi l’essayer ? »', '« Cool ! Y’a quelle sorte de musique dedans ? »', 2, 'Une invitation précise (quoi, quand) est facile à accepter.'],
      ['« Veux-tu peut-être, genre, faire de quoi un moment donné ou pas ? »', '« Euh… peut-être ? »', 0, 'Les invitations vagues reçoivent des réponses vagues.'],
      ['Attendre qu’il t’invite.', 'Noah ferme son casier et part.', -1, 'Parfois, il faut faire le premier pas.']]],
    ['Noah : « Samedi, je peux pas, j’ai un truc de famille. »', [
      ['« Pas grave ! Dimanche après-midi, ça te va ? »', '« Dimanche, parfait ! »', 2, 'Un « non » à une date n’est pas un « non » à toi — propose une autre option.'],
      ['« Bon. Laisse faire d’abord. »', '« Oh… OK. » Il a l’air surpris.', -1, 'Voir un conflit d’horaire comme un rejet peut mettre fin à une amitié avant qu’elle commence.'],
      ['« Pourquoi ? C’est quoi, le truc de famille ? »', '« Juste… un truc de famille. » Il est mal à l’aise.', 0, 'Insister pour des détails privés peut sembler envahissant.']]],
    ['Dimanche, Noah perd trois parties de suite et rit : « Chu tellement poche ! »', [
      ['« Tu t’améliores ! Veux-tu que je te montre le truc du timing ? »', '« Oui, s’il te plaît ! »', 2, 'Encourager et aider garde le plaisir.'],
      ['« Ouais, t’es vraiment poche. »', 'Son rire s’arrête.', -1, 'Quand quelqu’un se moque de lui-même, être d’accord peut blesser.'],
      ['Continuer de jouer sans rien dire.', 'Il continue, un peu plus silencieux.', 0, 'Un mot gentil rendrait ça plus agréable pour les deux.']]]] },
],
};
