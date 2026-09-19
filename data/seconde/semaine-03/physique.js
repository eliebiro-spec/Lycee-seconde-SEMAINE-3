/* Physique-Chimie — PC01 Composition des mélanges · PC02 Changements d'état (niveau introductif) */
R.data.addItems('seconde/semaine-03', [
  // ───────── PC01 · Volume ou masse totale ─────────
  {
    id: 'pc-total-001', subject: 'physique', module: 'PC01', skill: 'pc-total', type: 'number', difficulty: 1,
    prompt: 'Un mélange contient **30 mL** de sirop et **120 mL** d’eau.\nQuel est le volume total ?',
    answer: 150, unit: 'mL',
    explanation: '30 + 120 = 150 mL : le volume total est la somme des volumes de tous les constituants.',
    verify: { kind: 'sum', terms: [30, 120] },
  },
  {
    id: 'pc-total-002', subject: 'physique', module: 'PC01', skill: 'pc-total', type: 'number', difficulty: 1,
    prompt: 'Une boisson contient **45 mL** de jus et **155 mL** d’eau.\nQuel est le volume total ?',
    answer: 200, unit: 'mL',
    explanation: '45 + 155 = 200 mL : on additionne les volumes des constituants.',
    verify: { kind: 'sum', terms: [45, 155] },
  },
  {
    id: 'pc-total-003', subject: 'physique', module: 'PC01', skill: 'pc-total', type: 'number', difficulty: 1,
    prompt: 'Une solution contient **12 g** de sel et **188 g** d’eau.\nQuelle est la masse totale de la solution ?',
    answer: 200, unit: 'g',
    explanation: '12 + 188 = 200 g : la masse totale est la somme des masses des constituants.',
    verify: { kind: 'sum', terms: [12, 188] },
  },
  {
    id: 'pc-total-004', subject: 'physique', module: 'PC01', skill: 'pc-total', type: 'number', difficulty: 2,
    prompt: 'Un mélange de **250 mL** contient **60 mL** de sirop ; le reste est de l’eau.\nQuel volume d’eau contient-il ?',
    answer: 190, unit: 'mL', hint: 'Volume total − volume de sirop.',
    explanation: '250 − 60 = 190 mL : le volume d’eau est le volume total moins celui du sirop.',
    verify: { kind: 'diff', a: 250, b: 60 },
  },

  // ───────── PC01 · Composition volumique ─────────
  {
    id: 'pc-volumique-001', subject: 'physique', module: 'PC01', skill: 'pc-volumique', type: 'number', difficulty: 1,
    prompt: 'Le volume total du mélange est **150 mL**, dont **30 mL** de sirop.\nQuelle proportion du volume total représente le sirop ?',
    answer: 20, unit: '%',
    explanation: '30 ÷ 150 = 0,20 soit 20 %. Proportion = volume du constituant ÷ volume total.',
    verify: { kind: 'percent', part: 30, total: 150 },
  },
  {
    id: 'pc-volumique-002', subject: 'physique', module: 'PC01', skill: 'pc-volumique', type: 'number', difficulty: 1,
    prompt: 'Une boisson de **200 mL** contient **50 mL** de jus.\nQuelle est la proportion de jus, en volume ?',
    answer: 25, unit: '%',
    explanation: '50 ÷ 200 = 0,25 soit 25 %.',
    verify: { kind: 'percent', part: 50, total: 200 },
  },
  {
    id: 'pc-volumique-003', subject: 'physique', module: 'PC01', skill: 'pc-volumique', type: 'mcq', difficulty: 1,
    prompt: 'Compléter la formule :\nproportion en volume = V(sirop) ÷ ___',
    answers: ['V total du mélange', 'V(eau)', 'V(sirop) × 100', '1 000 mL'], correct: 0,
    feedbacks: { 1: 'On divise par le volume de TOUT le mélange (sirop + eau), pas seulement par l’eau.' },
    explanation: 'La proportion compare une partie au tout : V(constituant) ÷ V total du mélange.',
  },
  {
    id: 'pc-volumique-004', subject: 'physique', module: 'PC01', skill: 'pc-volumique', type: 'number', difficulty: 2,
    prompt: '**20 mL** de sirop sont mélangés à **80 mL** d’eau.\nQuelle proportion de sirop, en volume ?',
    answer: 20, unit: '%', hint: 'Attention : quel est le volume total ?',
    explanation: 'Volume total : 20 + 80 = 100 mL, donc 20 ÷ 100 = 20 %. (20 ÷ 80 serait faux : on divise par le total.)',
    verify: { kind: 'percent', part: 20, total: 100 },
  },

  // ───────── PC01 · Composition massique ─────────
  {
    id: 'pc-massique-001', subject: 'physique', module: 'PC01', skill: 'pc-massique', type: 'mcq', difficulty: 1,
    prompt: '« **12 g** de sel dans **400 g** de solution ». Quelle grandeur exprime la proportion de sel ?',
    answers: ['La composition massique', 'La composition volumique', 'Le volume total'], correct: 0,
    explanation: 'Ce sont des masses (g) : on parle de composition massique = m(sel) ÷ m totale.',
  },
  {
    id: 'pc-massique-002', subject: 'physique', module: 'PC01', skill: 'pc-massique', type: 'number', difficulty: 2,
    prompt: '**9 g** de sel sont dissous dans **291 g** d’eau.\nQuelle est la composition massique en sel ?',
    answer: 3, unit: '%', hint: 'Commence par calculer la masse totale.',
    explanation: 'Masse totale : 9 + 291 = 300 g, donc 9 ÷ 300 = 0,03 soit 3 %.',
    verify: { kind: 'percent', part: 9, total: 300 },
  },
  {
    id: 'pc-massique-003', subject: 'physique', module: 'PC01', skill: 'pc-massique', type: 'number', difficulty: 1,
    prompt: 'Un mélange contient **15 g** de sucre et **85 g** d’eau.\nComposition massique en sucre ?',
    answer: 15, unit: '%',
    explanation: 'Masse totale : 100 g, donc 15 ÷ 100 = 15 %.',
    verify: { kind: 'percent', part: 15, total: 100 },
  },
  {
    id: 'pc-massique-004', subject: 'physique', module: 'PC01', skill: 'pc-massique', type: 'number', difficulty: 3,
    prompt: 'Un mélange de **400 g** contient **5 %** de sel en masse.\nQuelle masse de sel contient-il ?',
    answer: 20, unit: 'g', hint: 'Proportion × masse totale.',
    explanation: '5 % de 400 g : 0,05 × 400 = 20 g.',
    verify: { kind: 'of', rate: 0.05, total: 400 },
  },

  // ───────── PC01 · Unités et grandeurs ─────────
  {
    id: 'pc-unites-001', subject: 'physique', module: 'PC01', skill: 'pc-unites', type: 'number', difficulty: 2,
    prompt: 'Un mélange contient **150 mL** de sirop et **0,35 L** d’eau.\nQuel est le volume total, en **mL** ?',
    answer: 500, unit: 'mL', hint: '0,35 L = … mL',
    explanation: '0,35 L = 350 mL, donc 150 + 350 = 500 mL. On additionne toujours dans la même unité.',
    verify: { kind: 'sum', terms: [150, 350] },
  },
  {
    id: 'pc-unites-002', subject: 'physique', module: 'PC01', skill: 'pc-unites', type: 'mcq', difficulty: 1,
    prompt: 'Une composition (massique ou volumique) s’exprime…',
    answers: ['sans unité, souvent en %', 'en grammes', 'en millilitres', 'en litres par gramme'], correct: 0,
    explanation: 'C’est un rapport de deux grandeurs de même unité (g ÷ g ou mL ÷ mL) : les unités se simplifient.',
  },
  {
    id: 'pc-unites-003', subject: 'physique', module: 'PC01', skill: 'pc-unites', type: 'tf', difficulty: 2,
    prompt: 'Un constituant peut représenter plus de 100 % du volume total du mélange.',
    correct: false,
    explanation: 'Un constituant est une partie du mélange : sa proportion est comprise entre 0 % et 100 %.',
  },

  // ───────── PC02 · Noms des changements d'état ─────────
  {
    id: 'pc-etats-noms-001', subject: 'physique', module: 'PC02', skill: 'pc-etats-noms', type: 'match', difficulty: 1,
    prompt: 'Associe chaque changement d’état à son nom.',
    pairs: [
      ['solide → liquide', 'fusion'],
      ['liquide → solide', 'solidification'],
      ['liquide → gaz', 'vaporisation'],
      ['gaz → liquide', 'liquéfaction / condensation'],
    ],
    explanation: 'solide → liquide : fusion · liquide → solide : solidification · liquide → gaz : vaporisation · gaz → liquide : liquéfaction (ou condensation).',
  },
  {
    id: 'pc-etats-noms-002', subject: 'physique', module: 'PC02', skill: 'pc-etats-noms', type: 'flashcard', difficulty: 1,
    prompt: 'Comment s’appelle le passage de l’état **liquide** à l’état **solide** ?',
    back: 'La **solidification**.',
    explanation: 'liquide → solide : solidification.',
  },
  {
    id: 'pc-etats-noms-003', subject: 'physique', module: 'PC02', skill: 'pc-etats-noms', type: 'tf', difficulty: 2,
    prompt: 'La vaporisation est le passage de l’état gazeux à l’état liquide.',
    correct: false,
    explanation: 'C’est l’inverse : la vaporisation est le passage de liquide à gaz. Gaz → liquide, c’est la liquéfaction (condensation).',
  },
  {
    id: 'pc-etats-noms-004', subject: 'physique', module: 'PC02', skill: 'pc-etats-noms', type: 'text', difficulty: 2,
    prompt: 'Écris le nom du changement d’état :\n**solide → liquide**',
    accept: ['fusion', 'la fusion'], placeholder: 'Le nom du changement…',
    explanation: 'solide → liquide : la fusion.',
  },

  // ───────── PC02 · Reconnaître le changement (situations et schémas) ─────────
  {
    id: 'pc-etats-sens-001', subject: 'physique', module: 'PC02', skill: 'pc-etats-sens', type: 'mcq', difficulty: 1,
    prompt: 'Un glaçon fond dans un verre.\nQuel changement d’état est-ce ?',
    answers: ['La fusion', 'La solidification', 'La vaporisation', 'La liquéfaction'], correct: 0,
    explanation: 'Le glaçon passe de solide à liquide : c’est la fusion.',
  },
  {
    id: 'pc-etats-sens-002', subject: 'physique', module: 'PC02', skill: 'pc-etats-sens', type: 'mcq', difficulty: 2,
    prompt: 'De la buée se forme sur un miroir : la vapeur d’eau (gaz) devient de l’eau liquide.\nQuel est ce changement ?',
    answers: ['La liquéfaction (condensation)', 'La vaporisation', 'La fusion', 'La solidification'], correct: 0,
    explanation: 'gaz → liquide : c’est la liquéfaction, aussi appelée condensation.',
  },
  {
    id: 'pc-etats-sens-003', subject: 'physique', module: 'PC02', skill: 'pc-etats-sens', type: 'mcq', difficulty: 1,
    prompt: 'Complète le schéma : quel nom sur la flèche « ? »',
    figure: { kind: 'chain', nodes: ['solide', 'liquide'], arrows: ['?'] },
    answers: ['fusion', 'solidification', 'vaporisation'], correct: 0,
    explanation: 'La flèche va de solide vers liquide : c’est la fusion.',
  },
  {
    id: 'pc-etats-sens-004', subject: 'physique', module: 'PC02', skill: 'pc-etats-sens', type: 'mcq', difficulty: 2,
    prompt: 'Complète le schéma : quel nom sur la flèche « ? »',
    figure: { kind: 'chain', nodes: ['gaz', 'liquide', 'solide'], arrows: ['?', 'solidification'] },
    answers: ['liquéfaction', 'vaporisation', 'fusion'], correct: 0,
    explanation: 'La flèche va de gaz vers liquide : c’est la liquéfaction (condensation). Ensuite, liquide → solide, c’est la solidification.',
  },
  {
    id: 'pc-etats-sens-005', subject: 'physique', module: 'PC02', skill: 'pc-etats-sens', type: 'mcq', difficulty: 2,
    prompt: 'Complète le schéma : quel nom sur la flèche « ? »',
    figure: { kind: 'chain', nodes: ['solide', 'liquide', 'gaz'], arrows: ['fusion', '?'] },
    answers: ['vaporisation', 'liquéfaction', 'solidification'], correct: 0,
    explanation: 'La flèche va de liquide vers gaz : c’est la vaporisation.',
  },
]);
