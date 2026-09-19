/* Français — F01 Paragraphe interprétatif / argumentatif · F02 Connecteurs · F03 Autoportrait poétique · F04 Le blason
 * Les textes et vers cités ci-dessous sont des exemples inventés pour l'entraînement (aucune œuvre extérieure). */
R.data.addItems('seconde/semaine-03', [
  // ───────── F01 · Structure du paragraphe ─────────
  {
    id: 'fr-structure-001', subject: 'francais', module: 'F01', skill: 'f-structure', type: 'order', difficulty: 1,
    prompt: 'Remets les éléments d’un paragraphe interprétatif dans l’ordre.',
    items: [
      'Point de départ (le texte, l’idée de départ)',
      'Interprétation (ce que je comprends)',
      'Argument (pourquoi je le pense)',
      'Citation ou référence précise',
      'Analyse (ce que la citation montre)',
    ],
    altOrders: [[0, 1, 2, 4, 3]], // analyse avant citation : accepté aussi
    explanation: 'On part du texte, on propose une interprétation, on l’appuie par un argument, on cite précisément, puis on analyse la citation.',
  },
  {
    id: 'fr-structure-002', subject: 'francais', module: 'F01', skill: 'f-structure', type: 'order', difficulty: 2,
    prompt: 'Remets les phrases de ce paragraphe dans le bon ordre.',
    items: [
      'Dans cet autoportrait, le poète ne se contente pas de donner son identité.',
      'On peut interpréter le texte comme la volonté de montrer ce qu’il ressent plutôt que ce qu’il paraît.',
      'En effet, il choisit des images empruntées à la nature.',
      'Le vers « Je suis un ciel d’orage » en est un exemple précis.',
      'Cette image montre que ses émotions sont fortes et changeantes, comme le temps.',
    ],
    explanation: 'Point de départ → interprétation → argument (« En effet ») → citation → analyse (« Cette image montre… »). L’analyse vient après la citation qu’elle explique.',
  },
  {
    id: 'fr-structure-003', subject: 'francais', module: 'F01', skill: 'f-structure', type: 'mcq', difficulty: 2,
    prompt: 'Que **manque-t-il** à ce paragraphe ?\n« Dans cet autoportrait, le poète se présente par des images. On peut y lire son désir de montrer ses émotions plutôt que son apparence. En effet, il choisit des images de la nature. »',
    answers: ['Une citation précise, puis son analyse', 'Une interprétation', 'Un point de départ', 'Un connecteur'], correct: 0,
    feedbacks: { 1: 'L’interprétation est là : « On peut y lire son désir… ».', 3: 'Il y a un connecteur : « En effet ».' },
    explanation: 'L’argument annonce des images de la nature, mais aucune n’est citée : il manque une citation précise et son analyse.',
  },
  {
    id: 'fr-structure-004', subject: 'francais', module: 'F01', skill: 'f-structure', type: 'mcq', difficulty: 2,
    prompt: 'Que **manque-t-il** à ce paragraphe ?\n« Le poète évoque sa timidité par des images de silence. Le vers « Ma voix se cache dans mes poches » en est un exemple. »',
    answers: ['L’analyse : expliquer ce que cette image montre', 'Un point de départ', 'Une deuxième citation', 'Une conclusion sur un autre texte'], correct: 0,
    explanation: 'Une citation ne parle pas d’elle-même : il faut expliquer ce qu’elle montre (par exemple : la timidité est traitée comme quelque chose qu’on cache).',
  },
  {
    id: 'fr-structure-005', subject: 'francais', module: 'F01', skill: 'f-structure', type: 'mcq', difficulty: 3,
    prompt: 'Que **manque-t-il** à ce paragraphe ?\n« Le poète évoque sa timidité par des images de silence. Cela montre qu’il a du mal à se dire. »',
    answers: ['Une citation ou une référence précise au texte', 'Un connecteur d’opposition', 'Un point de départ', 'Une deuxième interprétation'], correct: 0,
    explanation: 'L’idée n’est appuyée par aucune référence précise au texte : on ne peut pas vérifier ce qu’avance le paragraphe.',
  },

  // ───────── F01 · Affirmation, argument, exemple, analyse ─────────
  {
    id: 'fr-analyse-001', subject: 'francais', module: 'F01', skill: 'f-analyse', type: 'mcq', difficulty: 1,
    prompt: '« Le poète utilise beaucoup d’images. »\nCette phrase est surtout…',
    answers: ['une affirmation', 'un exemple', 'une analyse', 'une citation'], correct: 0,
    explanation: 'Elle avance une idée, sans la justifier ni la prouver : c’est une affirmation.',
  },
  {
    id: 'fr-analyse-002', subject: 'francais', module: 'F01', skill: 'f-analyse', type: 'mcq', difficulty: 2,
    prompt: '« Ces images permettent de suggérer ses émotions sans les nommer. »\nCette phrase est surtout…',
    answers: ['un argument', 'une affirmation', 'un exemple', 'une analyse'], correct: 0,
    feedbacks: { 1: 'Une affirmation avance une idée ; ici, la phrase explique POURQUOI cette idée est juste.' },
    explanation: 'Elle donne une raison qui soutient l’idée précédente : c’est un argument.',
  },
  {
    id: 'fr-analyse-003', subject: 'francais', module: 'F01', skill: 'f-analyse', type: 'mcq', difficulty: 2,
    prompt: '« Par exemple, au vers 3, il écrit : « Mon rire est pareil à une cascade. » »\nCette phrase est surtout…',
    answers: ['un exemple', 'un argument', 'une analyse', 'une affirmation'], correct: 0,
    explanation: 'Elle cite le texte : c’est un exemple (une référence précise qui appuie l’idée).',
  },
  {
    id: 'fr-analyse-004', subject: 'francais', module: 'F01', skill: 'f-analyse', type: 'mcq', difficulty: 3,
    prompt: '« Cette comparaison montre que son rire est vif, sonore, difficile à retenir. »\nCette phrase est surtout…',
    answers: ['une analyse', 'un exemple', 'une affirmation', 'un argument'], correct: 0,
    feedbacks: { 1: 'Un exemple cite le texte ; ici, on explique ce que la citation montre.' },
    explanation: 'Elle explique ce que la citation révèle (« Cette comparaison montre que… ») : c’est une analyse.',
  },
  {
    id: 'fr-analyse-005', subject: 'francais', module: 'F01', skill: 'f-analyse', type: 'mcq', difficulty: 2,
    prompt: 'Paragraphe faible : « Le poète parle de lui. Il utilise des images. C’est beau. »\nQue faire **en priorité** pour l’améliorer ?',
    answers: ['Ajouter une citation précise et l’analyser', 'Ajouter des phrases qui disent la même chose', 'Ajouter des adjectifs comme « magnifique »', 'Le raccourcir'], correct: 0,
    feedbacks: { 2: '« Magnifique » exprime un avis, il n’explique pas comment le texte fonctionne.' },
    explanation: '« C’est beau » est un avis, pas une analyse. Il faut une référence précise au texte, puis expliquer ce qu’elle montre.',
  },
  {
    id: 'fr-analyse-006', subject: 'francais', module: 'F01', skill: 'f-analyse', type: 'flashcard', input: true, difficulty: 3,
    prompt: 'Améliore cette phrase faible :\n« Ce vers est beau. »\n(Écris ou dis ta version, en expliquant ce que le vers montre.)',
    back: 'Par exemple : « Le vers « Mon rire est pareil à une cascade » (v. 3) suggère un rire vif et incontrôlable : cette comparaison montre que le poète se dévoile sans retenue. »',
    explanation: 'Une phrase améliorée cite précisément, puis explique l’effet ou le sens de l’image.',
  },

  // ───────── F02 · Connecteurs (choisis en contexte) ─────────
  {
    id: 'fr-connecteurs-001', subject: 'francais', module: 'F02', skill: 'f-connecteurs', type: 'mcq', difficulty: 1,
    prompt: 'Le poète parle de son apparence. ___, il évoque ses émotions.',
    answers: ['De plus', 'Pourtant', 'Donc', 'Par exemple'], correct: 0,
    explanation: '« De plus » ajoute une idée (**addition**) à celle qui précède.',
  },
  {
    id: 'fr-connecteurs-002', subject: 'francais', module: 'F02', skill: 'f-connecteurs', type: 'mcq', difficulty: 1,
    prompt: 'Il semble sûr de lui. ___, ses images révèlent une grande fragilité.',
    answers: ['Pourtant', 'De plus', 'Car', 'Enfin'], correct: 0,
    explanation: '« Pourtant » marque une **opposition** : les images contredisent l’impression donnée.',
  },
  {
    id: 'fr-connecteurs-003', subject: 'francais', module: 'F02', skill: 'f-connecteurs', type: 'mcq', difficulty: 2,
    prompt: 'Il choisit des images de la nature ___ il veut suggérer ses émotions plutôt que les nommer.',
    answers: ['car', 'donc', 'mais', 'par exemple'], correct: 0,
    explanation: '« Car » introduit la **cause** : la raison pour laquelle il choisit ces images.',
  },
  {
    id: 'fr-connecteurs-004', subject: 'francais', module: 'F02', skill: 'f-connecteurs', type: 'mcq', difficulty: 2,
    prompt: 'Ses images sont très variées ; ___, l’autoportrait ne se réduit pas à une fiche d’identité.',
    answers: ['par conséquent', 'cependant', 'en effet', 'par exemple'], correct: 0,
    feedbacks: { 2: '« En effet » introduit une explication (cause), pas une conséquence.' },
    explanation: '« Par conséquent » introduit la **conséquence** de ce qui vient d’être dit.',
  },
  {
    id: 'fr-connecteurs-005', subject: 'francais', module: 'F02', skill: 'f-connecteurs', type: 'mcq', difficulty: 1,
    prompt: 'Le poète utilise des comparaisons. ___, « Mon rire est pareil à une cascade ».',
    answers: ['Par exemple', 'Pourtant', 'Donc', 'Enfin'], correct: 0,
    explanation: '« Par exemple » introduit une **illustration** de l’idée qui précède.',
  },
  {
    id: 'fr-connecteurs-006', subject: 'francais', module: 'F02', skill: 'f-connecteurs', type: 'mcq', difficulty: 2,
    prompt: '___, cet autoportrait dit moins ce que le poète est que ce qu’il ressent.',
    answers: ['En conclusion', 'Par exemple', 'Cependant', 'De plus'], correct: 0,
    explanation: '« En conclusion » (ou « pour conclure ») ouvre la **conclusion**, à la fin du raisonnement.',
  },

  // ───────── F03 · Autoportrait poétique ─────────
  {
    id: 'fr-autoportrait-001', subject: 'francais', module: 'F03', skill: 'f-autoportrait', type: 'mcq', difficulty: 1,
    prompt: 'Un autoportrait poétique, c’est plutôt…',
    answers: ['se dire soi-même par des images et des sensations', 'une liste : nom, âge, adresse', 'le récit de sa journée', 'le portrait de quelqu’un d’autre'], correct: 0,
    feedbacks: { 1: 'Une fiche d’identité donne des faits ; l’autoportrait poétique cherche à faire voir et ressentir.' },
    explanation: 'Un autoportrait poétique ne se réduit pas à une fiche d’identité : il se dit par des images, des comparaisons, des sensations.',
  },
  {
    id: 'fr-autoportrait-002', subject: 'francais', module: 'F03', skill: 'f-autoportrait', type: 'mcq', difficulty: 1,
    prompt: 'Quelle formulation est la **plus poétique** ?',
    answers: ['Mes yeux sont deux châtaignes tombées d’un automne.', 'J’ai les yeux marron.', 'Mes yeux sont de couleur marron.', 'On dit que j’ai de beaux yeux.'], correct: 0,
    explanation: 'La première fait voir les yeux grâce à une image (châtaignes, automne) au lieu de simplement les décrire.',
  },
  {
    id: 'fr-autoportrait-003', subject: 'francais', module: 'F03', skill: 'f-autoportrait', type: 'mcq', difficulty: 2,
    prompt: 'Quelle phrase contient une **comparaison** ?',
    answers: ['Mon rire est pareil à une cascade.', 'Je ris souvent en classe.', 'J’ai ri toute la journée.', 'Le rire est bon pour la santé.'], correct: 0,
    explanation: '« pareil à » rapproche deux éléments (mon rire / une cascade) : c’est une comparaison, comme avec « comme » ou « semblable à ».',
  },
  {
    id: 'fr-autoportrait-004', subject: 'francais', module: 'F03', skill: 'f-autoportrait', type: 'mcq', difficulty: 2,
    prompt: 'Transforme « Je suis timide. » en une formulation **plus évocatrice**.',
    answers: ['Ma voix se cache dans mes poches.', 'Je suis très, très timide.', 'Je suis timide, c’est vrai.', 'Ma timidité est grande.'], correct: 0,
    explanation: 'La première fait sentir la timidité par une image (une voix qui se cache) au lieu de la nommer.',
  },
  {
    id: 'fr-autoportrait-005', subject: 'francais', module: 'F03', skill: 'f-autoportrait', type: 'mcq', difficulty: 3,
    prompt: '« Mes pensées sont des oiseaux qui ne se posent jamais. »\nQue dit cette image du poète ?',
    answers: ['Ses pensées sont nombreuses et toujours en mouvement', 'Il aime observer les oiseaux', 'Il pense rarement', 'Il a peur des oiseaux'], correct: 0,
    explanation: 'Les oiseaux qui ne se posent jamais évoquent des pensées en mouvement permanent : l’image dit quelque chose du caractère.',
  },
  {
    id: 'fr-autoportrait-006', subject: 'francais', module: 'F03', skill: 'f-autoportrait', type: 'flashcard', input: true, difficulty: 3,
    prompt: '✍️ Écris **deux vers** qui commencent par « Je suis… » et contiennent une image ou une comparaison.',
    back: 'Par exemple :\n« Je suis une fenêtre entrouverte\nOù le vent hésite à entrer. »',
    explanation: 'Vérifie : commence-t-il par « Je suis » ? Y a-t-il une image ou une comparaison ? Dit-il autre chose qu’un fait d’identité ?',
  },

  // ───────── F04 · Le blason ─────────
  {
    id: 'fr-blason-001', subject: 'francais', module: 'F04', skill: 'f-blason', type: 'mcq', difficulty: 1,
    prompt: 'Le blason est…',
    answers: ['un poème qui décrit et célèbre une partie ou une caractéristique', 'un récit qui raconte une histoire', 'un texte qui critique quelqu’un', 'une fiche d’identité'], correct: 0,
    explanation: 'Un blason décrit et célèbre (fait l’éloge de) une partie ou une caractéristique.',
  },
  {
    id: 'fr-blason-002', subject: 'francais', module: 'F04', skill: 'f-blason', type: 'tf', difficulty: 1,
    prompt: 'Un blason décrit et célèbre une partie ou une caractéristique.',
    correct: true,
    explanation: 'Décrire et célébrer une partie ou une caractéristique : c’est le cœur du blason.',
  },
  {
    id: 'fr-blason-003', subject: 'francais', module: 'F04', skill: 'f-blason', type: 'mcq', difficulty: 2,
    prompt: 'Lequel de ces textes ressemble à un **blason** ?',
    answers: ['« Ô ma main, petite reine agile, tu écris, tu caresses, tu sais tout dire ! »', '« Je m’appelle Léa, j’ai quinze ans, j’habite à Lille. »', '« Hier, il pleuvait : nous sommes rentrés tôt. »'], correct: 0,
    feedbacks: { 1: 'C’est une fiche d’identité : des faits, sans célébration.', 2: 'C’est un récit : il raconte, il ne célèbre pas une partie.' },
    explanation: 'Le premier texte s’adresse à une partie (la main), la décrit et la célèbre : c’est ce que fait un blason.',
  },
  {
    id: 'fr-blason-004', subject: 'francais', module: 'F04', skill: 'f-blason', type: 'mcq', difficulty: 2,
    prompt: 'Quelle est la différence principale entre un **blason** et un **autoportrait poétique** ?',
    answers: ['Le blason célèbre une partie ou une caractéristique ; l’autoportrait se dit soi-même à travers des images', 'Le blason est toujours en prose', 'L’autoportrait ne parle jamais de soi', 'Il n’y a aucune différence'], correct: 0,
    explanation: 'Le blason met une partie ou une caractéristique à l’honneur ; l’autoportrait poétique dit la personne avec des images.',
  },
  {
    id: 'fr-blason-005', subject: 'francais', module: 'F04', skill: 'f-blason', type: 'flashcard', input: true, difficulty: 2,
    prompt: 'Explique en une phrase ce qu’est un blason.',
    back: 'Un blason est un poème qui décrit et célèbre une partie ou une caractéristique.',
    explanation: 'Ta phrase doit contenir : décrire, célébrer, une partie ou une caractéristique.',
  },
]);
