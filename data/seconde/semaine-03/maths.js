/* Mathématiques — M01 Pair/impair · M02 Multiples · M03 Diviseurs · M04 Démonstration et divisibilité */
R.data.addItems('seconde/semaine-03', [
  // ───────── M01 · Écrire pair / impair ─────────
  {
    id: 'm-parite-def-001', subject: 'maths', module: 'M01', skill: 'm-parite-def', type: 'mcq', difficulty: 1,
    prompt: 'Un entier **n est pair** lorsqu’il peut s’écrire…',
    answers: ['n = 2k, avec k entier', 'n = 2k + 1, avec k entier', 'n = k + 2, avec k entier', 'n = 2 + k², avec k entier'], correct: 0,
    feedbacks: { 1: 'n = 2k + 1 est la forme d’un nombre IMPAIR.' },
    explanation: 'Un nombre pair est un multiple de 2 : n = 2k. Un nombre impair s’écrit n = 2k + 1.',
  },
  {
    id: 'm-parite-def-002', subject: 'maths', module: 'M01', skill: 'm-parite-def', type: 'tf', difficulty: 2,
    prompt: 'Pour tout entier k, le nombre 2k + 3 est impair.',
    correct: true,
    explanation: '2k + 3 = 2(k + 1) + 1, qui est de la forme 2m + 1 avec m = k + 1 : il est impair.',
  },
  {
    id: 'm-parite-def-003', subject: 'maths', module: 'M01', skill: 'm-parite-def', type: 'mcq', difficulty: 2,
    prompt: 'Lequel de ces nombres est **impair pour toute valeur entière de k** ?',
    answers: ['2k + 1', '2k + 2', '3k', 'k + 1'], correct: 0,
    feedbacks: { 1: '2k + 2 = 2(k + 1) est toujours pair.', 2: '3k est pair quand k est pair, impair quand k est impair : ça dépend de k.', 3: 'k + 1 est pair quand k est impair : ça dépend de k.' },
    explanation: '2k + 1 est de la forme « pair + 1 » : il est impair quel que soit k. Les autres dépendent de k ou sont toujours pairs.',
  },

  // ───────── M01 · Somme de pairs / impairs ─────────
  {
    id: 'm-parite-somme-001', subject: 'maths', module: 'M01', skill: 'm-parite-somme', type: 'mcq', difficulty: 1,
    prompt: 'La somme de deux nombres **impairs** est…',
    answers: ['paire', 'impaire'], correct: 0, shuffle: false,
    explanation: 'Deux nombres impairs s’écrivent 2a + 1 et 2b + 1. Leur somme vaut 2(a + b + 1), donc elle est paire.',
  },
  {
    id: 'm-parite-somme-002', subject: 'maths', module: 'M01', skill: 'm-parite-somme', type: 'number', difficulty: 2,
    prompt: 'Complète la démonstration :\n(2a + 1) + (2b + 1) = 2a + 2b + 2 = 2(a + b + **?**)',
    answer: 1,
    explanation: '2a + 2b + 2 = 2(a + b + 1). Comme a + b + 1 est un entier, la somme est un multiple de 2 : elle est paire.',
  },
  {
    id: 'm-parite-somme-003', subject: 'maths', module: 'M01', skill: 'm-parite-somme', type: 'mcq', difficulty: 1,
    prompt: 'n est un entier **pair** et m est un entier **impair**.\nLa somme n + m est…',
    answers: ['paire', 'impaire'], correct: 1, shuffle: false,
    explanation: 'n = 2a et m = 2b + 1, donc n + m = 2(a + b) + 1 : elle est impaire.',
  },

  // ───────── M01 · Produit de pairs / impairs ─────────
  {
    id: 'm-parite-produit-001', subject: 'maths', module: 'M01', skill: 'm-parite-produit', type: 'mcq', difficulty: 1,
    prompt: 'Le produit de deux nombres **impairs** est…',
    answers: ['pair', 'impair'], correct: 1, shuffle: false,
    explanation: '(2a + 1)(2b + 1) = 4ab + 2a + 2b + 1 = 2(2ab + a + b) + 1 : le produit est impair.',
  },
  {
    id: 'm-parite-produit-002', subject: 'maths', module: 'M01', skill: 'm-parite-produit', type: 'mcq', difficulty: 2,
    prompt: 'Le produit d’un nombre **pair** et d’un nombre **impair** est…',
    answers: ['pair', 'impair'], correct: 0, shuffle: false,
    explanation: '2a × (2b + 1) = 2 × [a(2b + 1)] : c’est un multiple de 2, donc un nombre pair.',
  },
  {
    id: 'm-parite-produit-003', subject: 'maths', module: 'M01', skill: 'm-parite-produit', type: 'tf', difficulty: 3,
    prompt: 'Le produit de deux nombres pairs est toujours un multiple de 4.',
    correct: true,
    explanation: '2a × 2b = 4ab : c’est bien un multiple de 4.',
  },

  // ───────── M02 · Écrire des multiples consécutifs ─────────
  {
    id: 'm-mult-ecriture-001', subject: 'maths', module: 'M02', skill: 'm-mult-ecriture', type: 'mcq', difficulty: 1,
    prompt: 'Comment écrire **trois multiples consécutifs de 7** à partir d’un entier n ?',
    answers: ['7n ; 7(n + 1) ; 7(n + 2)', '7n ; 7n + 1 ; 7n + 2', '7n ; 14n ; 21n', 'n ; n + 1 ; n + 2'], correct: 0,
    feedbacks: { 1: '7n + 1 n’est pas un multiple de 7 : il faut multiplier par 7 tout le facteur (n + 1).', 2: '7n, 14n, 21n sont des multiples de 7 mais pas des multiples consécutifs.', 3: 'n, n + 1, n + 2 sont des entiers consécutifs, pas des multiples de 7.' },
    explanation: 'Deux multiples consécutifs de 7 sont 7n et 7(n + 1), puis 7(n + 2) : on avance de 7 à chaque fois.',
  },
  {
    id: 'm-mult-ecriture-002', subject: 'maths', module: 'M02', skill: 'm-mult-ecriture', type: 'mcq', difficulty: 2,
    prompt: 'Quatre multiples consécutifs de 5 : le plus petit est 5n.\nLe **plus grand** s’écrit…',
    answers: ['5(n + 3)', '5n + 3', '5(n + 4)', '5n × 3'], correct: 0,
    explanation: 'Les quatre multiples sont 5n, 5(n + 1), 5(n + 2), 5(n + 3) : le plus grand est 5(n + 3).',
  },
  {
    id: 'm-mult-ecriture-003', subject: 'maths', module: 'M02', skill: 'm-mult-ecriture', type: 'mcq', difficulty: 2,
    prompt: '7n + 7(n + 1) + 7(n + 2) s’écrit aussi…',
    answers: ['21n + 21', '21n + 3', '7n + 21', '21n + 9'], correct: 0,
    explanation: '7n + 7n + 7 + 7n + 14 = 21n + 21.',
  },

  // ───────── M02 · Mettre en équation et résoudre ─────────
  {
    id: 'm-mult-resolution-001', subject: 'maths', module: 'M02', skill: 'm-mult-resolution', type: 'mcq', difficulty: 2,
    prompt: 'Trois multiples consécutifs de 4 ont pour somme 132.\nQuelle équation traduit le problème ?',
    answers: ['4n + 4(n + 1) + 4(n + 2) = 132', '4n + (n + 1) + (n + 2) = 132', '4n + 4n + 4n = 132', '4n + 5n + 6n = 132'], correct: 0,
    feedbacks: { 2: '4n + 4n + 4n donnerait trois fois le MÊME nombre, pas trois multiples consécutifs.' },
    explanation: 'Les trois multiples sont 4n, 4(n + 1) et 4(n + 2) : leur somme vaut 132.',
  },
  {
    id: 'm-mult-resolution-002', subject: 'maths', module: 'M02', skill: 'm-mult-resolution', type: 'number', difficulty: 2,
    prompt: 'Quatre multiples consécutifs de 7 ont pour somme 406.\nQuel est le **plus petit** ?',
    answer: 91, hint: '7n + 7(n + 1) + 7(n + 2) + 7(n + 3) = 406',
    explanation: '28n + 42 = 406, donc 28n = 364 et n = 13. Le plus petit est 7 × 13 = 91 (91 + 98 + 105 + 112 = 406).',
    verify: { kind: 'consecutive-multiples', k: 7, count: 4, sum: 406, ask: 'min' },
  },
  {
    id: 'm-mult-resolution-003', subject: 'maths', module: 'M02', skill: 'm-mult-resolution', type: 'number', difficulty: 2,
    prompt: 'Trois multiples consécutifs de 5 ont pour somme 105.\nQuel est le **plus petit** ?',
    answer: 30, hint: '5n + 5(n + 1) + 5(n + 2) = 105',
    explanation: '15n + 15 = 105, donc n = 6. Le plus petit est 5 × 6 = 30 (30 + 35 + 40 = 105).',
    verify: { kind: 'consecutive-multiples', k: 5, count: 3, sum: 105, ask: 'min' },
  },
  {
    id: 'm-mult-resolution-004', subject: 'maths', module: 'M02', skill: 'm-mult-resolution', type: 'number', difficulty: 3,
    prompt: 'Trois multiples consécutifs de 8 ont pour somme 264.\nQuel est le **plus grand** ?',
    answer: 96, hint: 'Cherche d’abord n avec 8n + 8(n + 1) + 8(n + 2) = 264.',
    explanation: '24n + 24 = 264, donc n = 10. Les multiples sont 80, 88, 96 : le plus grand est 96.',
    verify: { kind: 'consecutive-multiples', k: 8, count: 3, sum: 264, ask: 'max' },
  },
  {
    id: 'm-mult-resolution-005', subject: 'maths', module: 'M02', skill: 'm-mult-resolution', type: 'tf', difficulty: 3,
    prompt: 'Il existe quatre multiples consécutifs de 7 dont la somme vaut 400.',
    correct: false,
    explanation: '28n + 42 = 400 donne 28n = 358, soit n ≈ 12,79 : ce n’est pas un entier. Aucun n entier ne convient.',
    verify: { kind: 'consecutive-multiples-none', k: 7, count: 4, sum: 400 },
  },
  {
    id: 'm-mult-resolution-006', subject: 'maths', module: 'M02', skill: 'm-mult-resolution', type: 'order', difficulty: 3, sansAide: true, noChallenge: false,
    prompt: '🧠 **Sans aide** — Reconstruis la résolution : quatre multiples consécutifs de 7 dont la somme vaut 406.',
    items: [
      'Notons 7n le plus petit ; les suivants sont 7(n + 1), 7(n + 2) et 7(n + 3).',
      '7n + 7(n + 1) + 7(n + 2) + 7(n + 3) = 406',
      '28n + 42 = 406',
      '28n = 364, donc n = 13',
      'Les multiples sont 91, 98, 105 et 112.',
    ],
    distractors: ['On cherche n tel que 7n = 406.'],
    explanation: 'On nomme les inconnues, on écrit l’équation, on réduit, on résout (n = 13), puis on revient aux multiples : 91, 98, 105, 112.',
  },

  // ───────── M03 · Trouver les diviseurs ─────────
  {
    id: 'm-div-liste-001', subject: 'maths', module: 'M03', skill: 'm-div-liste', type: 'mcq', difficulty: 1,
    prompt: 'Quels sont **tous** les diviseurs de 24 ?',
    answers: ['1, 2, 3, 4, 6, 8, 12, 24', '1, 2, 4, 6, 8, 12, 24', '2, 3, 4, 6, 8, 12', '1, 2, 3, 4, 6, 12, 24'], correct: 0,
    feedbacks: { 1: 'Il manque 3 (24 = 3 × 8).', 2: 'Il manque 1 et 24 : ils divisent tous les deux 24.', 3: 'Il manque 8 (24 = 8 × 3).' },
    explanation: '24 = 1×24 = 2×12 = 3×8 = 4×6 : ses diviseurs sont 1, 2, 3, 4, 6, 8, 12 et 24.',
  },
  {
    id: 'm-div-liste-002', subject: 'maths', module: 'M03', skill: 'm-div-liste', type: 'number', difficulty: 2,
    prompt: 'Combien **30** a-t-il de diviseurs ?',
    answer: 8, hint: 'Cherche les paires : 30 = 1 × 30 = 2 × 15 = …',
    explanation: '30 = 1×30 = 2×15 = 3×10 = 5×6 : les diviseurs sont 1, 2, 3, 5, 6, 10, 15, 30, soit 8 diviseurs.',
    verify: { kind: 'divisor-count', n: 30 },
  },
  {
    id: 'm-div-liste-003', subject: 'maths', module: 'M03', skill: 'm-div-liste', type: 'mcq', difficulty: 1,
    prompt: 'Lequel de ces nombres est un diviseur de **36** ?',
    answers: ['9', '8', '7', '5'], correct: 0,
    feedbacks: { 1: '36 ÷ 8 = 4,5 : pas un entier.', 2: '36 ÷ 7 n’est pas un entier.', 3: '36 ÷ 5 = 7,2 : pas un entier.' },
    explanation: '36 = 9 × 4 : 9 est un diviseur de 36. Les autres ne divisent pas 36 exactement.',
  },

  // ───────── M03 · Contre-exemple et exemples ─────────
  {
    id: 'm-contre-exemple-001', subject: 'maths', module: 'M03', skill: 'm-contre-exemple', type: 'tf', difficulty: 2,
    prompt: 'La somme de deux diviseurs de 24 est un diviseur de 24.',
    correct: false,
    explanation: 'Contre-exemple : 3 et 4 divisent 24, mais 3 + 4 = 7 ne divise pas 24. **Un seul contre-exemple suffit pour montrer qu’une proposition universelle est fausse.**',
  },
  {
    id: 'm-contre-exemple-002', subject: 'maths', module: 'M03', skill: 'm-contre-exemple', type: 'mcq', difficulty: 2,
    prompt: 'Quel couple de diviseurs de 24 montre que « la somme de deux diviseurs de 24 est un diviseur de 24 » est **fausse** ?',
    answers: ['3 et 4', '2 et 6', '4 et 8', '1 et 2'], correct: 0,
    feedbacks: { 1: '2 + 6 = 8, et 8 divise 24 : ce couple ne contredit pas la proposition.', 2: '4 + 8 = 12, et 12 divise 24 : pas un contre-exemple.', 3: '1 + 2 = 3, et 3 divise 24 : pas un contre-exemple.' },
    explanation: '3 + 4 = 7 et 7 ne divise pas 24 : c’est un contre-exemple. Il suffit d’un seul pour réfuter la proposition.',
  },
  {
    id: 'm-contre-exemple-003', subject: 'maths', module: 'M03', skill: 'm-contre-exemple', type: 'number', difficulty: 2,
    prompt: 'Proposition : « Tout diviseur de 24 est pair. »\nDonne un **contre-exemple** (un diviseur de 24 qui n’est pas pair).',
    answers: [1, 3], hint: 'Regarde la liste des diviseurs de 24 : 1, 2, 3, 4, 6, 8, 12, 24.',
    explanation: '1 et 3 divisent 24 et sont impairs : chacun suffit à montrer que la proposition est fausse.',
  },
  {
    id: 'm-contre-exemple-004', subject: 'maths', module: 'M03', skill: 'm-contre-exemple', type: 'mcq', difficulty: 1,
    prompt: 'Pour montrer qu’une proposition du type « pour tous les nombres… » est **fausse**, il suffit de…',
    answers: ['trouver un seul contre-exemple', 'tester dix exemples qui marchent', 'faire une démonstration avec 2k + 1', 'trouver deux exemples qui marchent'], correct: 0,
    feedbacks: { 1: 'Des exemples qui marchent ne prouvent rien : le suivant peut ne pas marcher.' },
    explanation: 'Un seul contre-exemple suffit pour montrer qu’une proposition universelle est fausse.',
  },
  {
    id: 'm-contre-exemple-005', subject: 'maths', module: 'M03', skill: 'm-contre-exemple', type: 'mcq', difficulty: 2,
    prompt: 'Tu testes « la somme de deux impairs est paire » avec 3 + 5, 7 + 9 et 11 + 13 : ça marche à chaque fois.\nCela **démontre-t-il** la propriété ?',
    answers: ['Non : des exemples ne suffisent pas, il faut une démonstration', 'Oui : trois exemples suffisent', 'Oui : sauf si on trouve mieux'], correct: 0,
    explanation: 'Des exemples qui marchent ne prouvent pas qu’une propriété est vraie pour tous les nombres. Il faut raisonner avec 2a + 1 et 2b + 1.',
  },
  {
    id: 'm-contre-exemple-006', subject: 'maths', module: 'M03', skill: 'm-contre-exemple', type: 'tf', difficulty: 2,
    prompt: 'La somme de deux diviseurs de 20 est un diviseur de 20.',
    correct: false,
    explanation: 'Contre-exemple : 5 et 10 divisent 20, mais 5 + 10 = 15 ne divise pas 20 (1 + 2 = 3 aussi convient).',
  },
  {
    id: 'm-contre-exemple-007', subject: 'maths', module: 'M03', skill: 'm-contre-exemple', type: 'tf', difficulty: 3,
    prompt: 'Tout multiple de 4 est un nombre pair.',
    correct: true,
    explanation: 'Un multiple de 4 s’écrit 4k = 2 × (2k) : c’est un multiple de 2. Ici on démontre avec k, on ne se contente pas d’exemples.',
  },

  // ───────── M04 · Sens de « divisible par » ─────────
  {
    id: 'm-divisibilite-001', subject: 'maths', module: 'M04', skill: 'm-divisibilite', type: 'mcq', difficulty: 2,
    prompt: '« n² − 1 est divisible par 8 » signifie que…',
    answers: ['n² − 1 = 8m, avec m entier', 'n² − 1 est plus petit que 8', 'n est divisible par 8', 'n² − 1 = 8 + m, avec m entier'], correct: 0,
    explanation: 'Être divisible par 8, c’est être un multiple de 8 : n² − 1 = 8m pour un entier m.',
  },
  {
    id: 'm-divisibilite-002', subject: 'maths', module: 'M04', skill: 'm-divisibilite', type: 'number', difficulty: 1,
    prompt: 'n = 7 est impair.\nCalcule (7² − 1) ÷ 8.',
    answer: 6, hint: '7² = 49',
    explanation: '7² − 1 = 48 et 48 ÷ 8 = 6 : sur cet exemple, n² − 1 est bien multiple de 8. Mais un exemple ne démontre pas la propriété !',
    verify: { kind: 'expr', value: (49 - 1) / 8 },
  },
  {
    id: 'm-divisibilite-003', subject: 'maths', module: 'M04', skill: 'm-divisibilite', type: 'number', difficulty: 1,
    prompt: 'n = 5 est impair et n ≥ 3.\nCalcule 5² − 1.',
    answer: 24,
    explanation: '5² − 1 = 25 − 1 = 24 = 8 × 3 : c’est bien un multiple de 8.',
    verify: { kind: 'expr', value: 25 - 1 },
  },

  // ───────── M04 · Démonstration guidée ─────────
  {
    id: 'm-demo-guidee-001', subject: 'maths', module: 'M04', skill: 'm-demo-guidee', type: 'proof', difficulty: 3,
    prompt: 'Démontrer que si **n est impair** et n ≥ 3, alors **n² − 1 est divisible par 8**.',
    steps: [
      {
        q: 'Comment écrire un nombre impair n ?',
        answers: ['n = 2k + 1', 'n = 2k', 'n = k + 2'], correct: 0,
        feedbacks: { 1: 'n = 2k est un nombre pair.', 2: 'k + 2 ne dit rien sur la parité de n.' },
        line: 'n = 2k + 1, avec k entier',
      },
      {
        q: 'On remplace n dans n² − 1. On obtient :',
        answers: ['(2k + 1)² − 1', '2k² + 1 − 1', '(2k)² − 1'], correct: 0,
        feedbacks: { 1: 'C’est tout le nombre 2k + 1 qui est mis au carré.', 2: 'On remplace n par 2k + 1, pas par 2k.' },
        line: 'n² − 1 = (2k + 1)² − 1',
      },
      {
        q: 'On développe (2k + 1)² − 1 :',
        answers: ['4k² + 4k', '4k²', '4k² + 4k + 1'], correct: 0,
        feedbacks: { 1: 'Tu as oublié le double produit 2 × 2k × 1 = 4k.', 2: 'Tu as oublié de soustraire 1 : (2k + 1)² − 1 = 4k² + 4k + 1 − 1.' },
        line: '= 4k² + 4k + 1 − 1 = 4k² + 4k',
      },
      {
        q: 'On factorise 4k² + 4k :',
        answers: ['4k(k + 1)', '4(k² + 1)', '2k(2k + 1)'], correct: 0,
        feedbacks: { 1: '4(k² + 1) = 4k² + 4 : ce n’est pas 4k² + 4k.', 2: '2k(2k + 1) = 4k² + 2k : ce n’est pas 4k² + 4k.' },
        line: '= 4k(k + 1)',
      },
      {
        q: 'Pourquoi 4k(k + 1) est-il un multiple de 8 ?',
        answers: ['k(k + 1) est pair : c’est un produit de deux entiers consécutifs', 'Parce que 4 est un multiple de 8', 'Parce que k est toujours pair'], correct: 0,
        feedbacks: { 1: '4 n’est pas un multiple de 8 : il faut un facteur 2 de plus.', 2: 'k n’est pas toujours pair (k = 1, par exemple).' },
        line: 'k(k + 1) = 2m (l’un des deux entiers est pair), donc n² − 1 = 4 × 2m = 8m ✓',
      },
    ],
    explanation: 'n = 2k + 1, donc n² − 1 = 4k² + 4k = 4k(k + 1). Comme k et k + 1 sont consécutifs, l’un est pair : k(k + 1) = 2m, donc n² − 1 = 8m.',
  },
  {
    id: 'm-demo-guidee-002', subject: 'maths', module: 'M04', skill: 'm-demo-guidee', type: 'proof', difficulty: 2,
    prompt: 'Démontrer que la **somme de deux nombres impairs est paire**.',
    steps: [
      {
        q: 'Comment écrire deux nombres impairs quelconques ?',
        answers: ['2a + 1 et 2b + 1', '2a + 1 et 2a + 1', '2a et 2b + 1'], correct: 0,
        feedbacks: { 1: 'Avec la même lettre a, les deux nombres seraient égaux : on veut deux impairs quelconques, donc deux lettres.', 2: '2a est pair.' },
        line: 'Deux impairs : 2a + 1 et 2b + 1',
      },
      {
        q: 'Leur somme vaut :',
        answers: ['2a + 2b + 2', '2a + 2b + 1', '4ab + 1'], correct: 0,
        feedbacks: { 1: 'Il y a deux « + 1 » : 1 + 1 = 2.', 2: '4ab + 1 serait un produit, pas une somme.' },
        line: '(2a + 1) + (2b + 1) = 2a + 2b + 2',
      },
      {
        q: 'On factorise 2a + 2b + 2 :',
        answers: ['2(a + b + 1)', '2(a + b) + 1', '2(a + b + 2)'], correct: 0,
        feedbacks: { 1: '2(a + b) + 1 = 2a + 2b + 1 : ce n’est pas la même expression.', 2: '2(a + b + 2) = 2a + 2b + 4.' },
        line: '= 2(a + b + 1)',
      },
      {
        q: 'Conclusion : 2(a + b + 1) est…',
        answers: ['un nombre pair, car a + b + 1 est un entier', 'un nombre impair', 'pair seulement si a et b sont pairs'], correct: 0,
        feedbacks: { 1: 'C’est un multiple de 2 : il est pair.', 2: 'Le résultat est pair quels que soient a et b.' },
        line: 'a + b + 1 est un entier : la somme est paire ✓',
      },
    ],
    explanation: '(2a + 1) + (2b + 1) = 2(a + b + 1), un multiple de 2 : la somme de deux impairs est paire.',
  },
  {
    id: 'm-demo-guidee-003', subject: 'maths', module: 'M04', skill: 'm-demo-guidee', type: 'proof', difficulty: 2,
    prompt: 'Démontrer que si **n est impair**, alors **n² est impair**.',
    steps: [
      {
        q: 'Comment écrire un nombre impair n ?',
        answers: ['n = 2k + 1', 'n = 2k', 'n = k + 1'], correct: 0,
        feedbacks: { 1: 'n = 2k est un nombre pair.', 2: 'k + 1 ne dit rien sur la parité de n.' },
        line: 'n = 2k + 1, avec k entier',
      },
      {
        q: 'Alors n² = (2k + 1)² =',
        answers: ['4k² + 4k + 1', '4k² + 1', '2k² + 1'], correct: 0,
        feedbacks: { 1: 'Tu as oublié le double produit 2 × 2k × 1 = 4k.', 2: 'Le carré de 2k est 4k², pas 2k².' },
        line: 'n² = (2k + 1)² = 4k² + 4k + 1',
      },
      {
        q: 'On veut la forme 2 × (entier) + 1. On écrit :',
        answers: ['4k² + 4k + 1 = 2(2k² + 2k) + 1', '4k² + 4k + 1 = 2(2k² + 4k) + 1', '4k² + 4k + 1 = 2(k² + 2k) + 1'], correct: 0,
        feedbacks: { 1: '2(2k² + 4k) + 1 = 4k² + 8k + 1.', 2: '2(k² + 2k) + 1 = 2k² + 4k + 1.' },
        line: '= 2(2k² + 2k) + 1',
      },
      {
        q: 'Conclusion : 2k² + 2k est un entier, donc n² est…',
        answers: ['impair', 'pair'], correct: 0,
        feedbacks: { 1: 'n² = 2m + 1 avec m entier : c’est la forme d’un impair.' },
        line: 'n² = 2m + 1 avec m = 2k² + 2k : n² est impair ✓',
      },
    ],
    explanation: 'n = 2k + 1 donne n² = 4k² + 4k + 1 = 2(2k² + 2k) + 1, de la forme 2m + 1 : n² est impair.',
  },

  // ───────── M04 · Démonstration sans aide ─────────
  {
    id: 'm-demo-sans-aide-001', subject: 'maths', module: 'M04', skill: 'm-demo-sans-aide', type: 'order', difficulty: 3, sansAide: true,
    prompt: '🧠 **Sans aide** — Ordonne la démonstration de « n impair ⇒ n² − 1 divisible par 8 ». Deux lignes sont fausses.',
    items: [
      'Soit n un entier impair : n = 2k + 1 avec k entier.',
      'Alors n² − 1 = (2k + 1)² − 1.',
      'n² − 1 = 4k² + 4k + 1 − 1 = 4k² + 4k.',
      'n² − 1 = 4k(k + 1).',
      'k et k + 1 sont consécutifs : l’un est pair, donc k(k + 1) = 2m.',
      'Ainsi n² − 1 = 4 × 2m = 8m : n² − 1 est divisible par 8.',
    ],
    distractors: ['Avec n = 3 : 3² − 1 = 8, donc c’est vrai pour tout n.', 'Soit n un entier pair : n = 2k.'],
    explanation: 'Une démonstration part d’un n quelconque (2k + 1), calcule, factorise, puis conclut. Tester n = 3 ne démontre rien, et n doit être impair.',
  },
  {
    id: 'm-demo-sans-aide-002', subject: 'maths', module: 'M04', skill: 'm-demo-sans-aide', type: 'order', difficulty: 3, sansAide: true,
    prompt: '🧠 **Sans aide** — Ordonne la démonstration de « la somme de deux impairs est paire ». Deux lignes sont fausses.',
    items: [
      'Deux nombres impairs quelconques s’écrivent 2a + 1 et 2b + 1.',
      'Leur somme vaut (2a + 1) + (2b + 1) = 2a + 2b + 2.',
      'On factorise : 2a + 2b + 2 = 2(a + b + 1).',
      'a + b + 1 est un entier, donc la somme est un multiple de 2 : elle est paire.',
    ],
    distractors: ['Prenons 3 + 5 = 8 : la somme est paire, donc c’est démontré.', 'Deux nombres impairs s’écrivent 2a + 1 et 2a + 1.'],
    explanation: 'Deux lettres différentes (a et b) pour deux impairs quelconques, un calcul, une factorisation, une conclusion. Un exemple comme 3 + 5 ne démontre rien.',
  },
]);
