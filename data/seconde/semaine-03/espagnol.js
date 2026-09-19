/* Espagnol — E01 SER / ESTAR · E02 Le sens change
 * SER : identité, origine, nationalité, profession, caractéristique, matière, possession, heure.
 * ESTAR : localisation, état temporaire, résultat d'une action, action en cours (estar + gérondif). */
R.data.addItems('seconde/semaine-03', [
  // ───────── E01 · Choisir SER ou ESTAR ─────────
  {
    id: 'es-choix-001', subject: 'espagnol', module: 'E01', skill: 'e-choix', type: 'mcq', difficulty: 1,
    prompt: 'Mi madre ___ profesora.',
    answers: ['SER', 'ESTAR'], correct: 0, shuffle: false,
    explanation: 'Une profession se dit avec SER : Mi madre **es** profesora.',
  },
  {
    id: 'es-choix-002', subject: 'espagnol', module: 'E01', skill: 'e-choix', type: 'mcq', difficulty: 1,
    prompt: 'Nosotros ___ de Colombia.',
    answers: ['SER', 'ESTAR'], correct: 0, shuffle: false,
    explanation: 'L’origine se dit avec SER : Nosotros **somos** de Colombia.',
  },
  {
    id: 'es-choix-003', subject: 'espagnol', module: 'E01', skill: 'e-choix', type: 'mcq', difficulty: 1,
    prompt: 'Madrid ___ en España.',
    answers: ['SER', 'ESTAR'], correct: 1, shuffle: false,
    explanation: 'La localisation se dit avec ESTAR : Madrid **está** en España.',
  },
  {
    id: 'es-choix-004', subject: 'espagnol', module: 'E01', skill: 'e-choix', type: 'mcq', difficulty: 1,
    prompt: 'Hoy Lucía ___ muy cansada.',
    answers: ['SER', 'ESTAR'], correct: 1, shuffle: false,
    explanation: 'Un état temporaire (aujourd’hui) se dit avec ESTAR : Hoy Lucía **está** muy cansada.',
  },
  {
    id: 'es-choix-005', subject: 'espagnol', module: 'E01', skill: 'e-choix', type: 'mcq', difficulty: 1,
    prompt: 'Esta mesa ___ de madera.',
    answers: ['SER', 'ESTAR'], correct: 0, shuffle: false,
    explanation: 'La matière se dit avec SER : Esta mesa **es** de madera.',
  },
  {
    id: 'es-choix-006', subject: 'espagnol', module: 'E01', skill: 'e-choix', type: 'mcq', difficulty: 1,
    prompt: '___ las tres y media.',
    answers: ['SER', 'ESTAR'], correct: 0, shuffle: false,
    explanation: 'L’heure se dit avec SER (au pluriel sauf « una ») : **Son** las tres y media.',
  },
  {
    id: 'es-choix-007', subject: 'espagnol', module: 'E01', skill: 'e-choix', type: 'mcq', difficulty: 1,
    prompt: 'Este libro ___ de Ana.',
    answers: ['SER', 'ESTAR'], correct: 0, shuffle: false,
    explanation: 'La possession se dit avec SER : Este libro **es** de Ana.',
  },
  {
    id: 'es-choix-008', subject: 'espagnol', module: 'E01', skill: 'e-choix', type: 'mcq', difficulty: 2,
    prompt: 'Alguien ha cerrado la puerta : la puerta ___ cerrada.',
    answers: ['SER', 'ESTAR'], correct: 1, shuffle: false,
    explanation: 'Le résultat d’une action se dit avec ESTAR : la puerta **está** cerrada (elle a été fermée).',
  },
  {
    id: 'es-choix-009', subject: 'espagnol', module: 'E01', skill: 'e-choix', type: 'mcq', difficulty: 1,
    prompt: 'Ellos ___ franceses.',
    answers: ['SER', 'ESTAR'], correct: 0, shuffle: false,
    explanation: 'La nationalité se dit avec SER : Ellos **son** franceses.',
  },
  {
    id: 'es-choix-010', subject: 'espagnol', module: 'E01', skill: 'e-choix', type: 'mcq', difficulty: 1,
    prompt: 'Mis amigos ___ muy simpáticos.',
    answers: ['SER', 'ESTAR'], correct: 0, shuffle: false,
    explanation: 'Une caractéristique se dit avec SER : Mis amigos **son** muy simpáticos.',
  },
  {
    id: 'es-choix-011', subject: 'espagnol', module: 'E01', skill: 'e-choix', type: 'mcq', difficulty: 1,
    prompt: '¿Dónde ___ mis llaves?',
    answers: ['SER', 'ESTAR'], correct: 1, shuffle: false,
    explanation: 'La localisation se dit avec ESTAR : ¿Dónde **están** mis llaves?',
  },
  {
    id: 'es-choix-012', subject: 'espagnol', module: 'E01', skill: 'e-choix', type: 'mcq', difficulty: 2,
    prompt: 'Yo ___ estudiando en la biblioteca.',
    answers: ['SER', 'ESTAR'], correct: 1, shuffle: false,
    explanation: 'Une action en cours se dit avec ESTAR + gérondif : Yo **estoy** estudiando.',
  },

  // ───────── E01 · Conjuguer SER et ESTAR ─────────
  {
    id: 'es-conj-001', subject: 'espagnol', module: 'E01', skill: 'e-conjugaison', type: 'text', difficulty: 1,
    prompt: 'Conjugue **SER** au présent :\n**yo** → ___', accept: ['soy'], placeholder: 'yo…',
    explanation: 'SER : yo **soy**, tú eres, él/ella es, nosotros somos, vosotros sois, ellos son.',
    verify: { kind: 'conj', verb: 'ser', person: 'yo' },
  },
  {
    id: 'es-conj-002', subject: 'espagnol', module: 'E01', skill: 'e-conjugaison', type: 'text', difficulty: 1,
    prompt: 'Conjugue **SER** au présent :\n**nosotros** → ___', accept: ['somos'], placeholder: 'nosotros…',
    explanation: 'SER : nosotros **somos**.',
    verify: { kind: 'conj', verb: 'ser', person: 'nosotros' },
  },
  {
    id: 'es-conj-003', subject: 'espagnol', module: 'E01', skill: 'e-conjugaison', type: 'text', difficulty: 2,
    prompt: 'Conjugue **ESTAR** au présent :\n**tú** → ___', accept: ['estás'], placeholder: 'tú…',
    explanation: 'ESTAR : yo estoy, tú **estás**, él/ella está, nosotros estamos, vosotros estáis, ellos están.',
    verify: { kind: 'conj', verb: 'estar', person: 'tú' },
  },
  {
    id: 'es-conj-004', subject: 'espagnol', module: 'E01', skill: 'e-conjugaison', type: 'text', difficulty: 2,
    prompt: 'Conjugue **ESTAR** au présent :\n**nosotros** → ___', accept: ['estamos'], placeholder: 'nosotros…',
    explanation: 'ESTAR : nosotros **estamos**.',
    verify: { kind: 'conj', verb: 'estar', person: 'nosotros' },
  },
  {
    id: 'es-conj-005', subject: 'espagnol', module: 'E01', skill: 'e-conjugaison', type: 'text', difficulty: 2,
    prompt: 'Conjugue **SER** au présent :\n**vosotros** → ___', accept: ['sois'], placeholder: 'vosotros…',
    explanation: 'SER : vosotros **sois** (sans accent).',
    verify: { kind: 'conj', verb: 'ser', person: 'vosotros' },
  },
  {
    id: 'es-conj-006', subject: 'espagnol', module: 'E01', skill: 'e-conjugaison', type: 'text', difficulty: 2,
    prompt: 'Conjugue **ESTAR** au présent :\n**él / ella** → ___', accept: ['está'], placeholder: 'él…',
    explanation: 'ESTAR : él/ella **está**. Attention à l’accent : sans lui, « esta » veut dire « cette ».',
    verify: { kind: 'conj', verb: 'estar', person: 'él' },
  },
  {
    id: 'es-conj-007', subject: 'espagnol', module: 'E01', skill: 'e-conjugaison', type: 'text', difficulty: 2,
    prompt: 'Complète avec le bon verbe **SER** :\nTú ___ mi mejor amigo.', accept: ['eres'], placeholder: 'Le verbe…',
    explanation: 'L’identité / la relation se dit avec SER : Tú **eres** mi mejor amigo.',
    verify: { kind: 'conj', verb: 'ser', person: 'tú' },
  },
  {
    id: 'es-conj-008', subject: 'espagnol', module: 'E01', skill: 'e-conjugaison', type: 'text', difficulty: 2,
    prompt: 'Complète avec le bon verbe **ESTAR** :\nMis padres ___ en casa.', accept: ['están'], placeholder: 'Le verbe…',
    explanation: 'La localisation se dit avec ESTAR : Mis padres **están** en casa.',
    verify: { kind: 'conj', verb: 'estar', person: 'ellos' },
  },
  {
    id: 'es-conj-009', subject: 'espagnol', module: 'E01', skill: 'e-conjugaison', type: 'text', difficulty: 3,
    prompt: 'Complète avec **SER** ou **ESTAR** conjugué :\n¿Qué hora ___? — ___ las cinco.', accept: ['es son', 'es, son'], placeholder: 'Deux verbes…',
    explanation: '« ¿Qué hora **es**? — **Son** las cinco. » L’heure se dit avec SER (verbe au pluriel pour « las cinco »).',
  },

  // ───────── E01 · ESTAR + gérondif ─────────
  {
    id: 'es-ger-001', subject: 'espagnol', module: 'E01', skill: 'e-gerondif', type: 'text', difficulty: 2,
    prompt: 'Action en cours : écris **estar + gérondif**.\nEllos ___ (hablar) por teléfono.', accept: ['están hablando'], placeholder: 'estar + gérondif',
    explanation: 'Ellos **están hablando** : estar conjugué + gérondif (hablar → hablando).',
    verify: { kind: 'gerund', person: 'ellos', inf: 'hablar' },
  },
  {
    id: 'es-ger-002', subject: 'espagnol', module: 'E01', skill: 'e-gerondif', type: 'text', difficulty: 2,
    prompt: 'Action en cours : écris **estar + gérondif**.\nYo ___ (comer) una manzana.', accept: ['estoy comiendo'], placeholder: 'estar + gérondif',
    explanation: 'Yo **estoy comiendo** (comer → comiendo : les verbes en -er et -ir font -iendo).',
    verify: { kind: 'gerund', person: 'yo', inf: 'comer' },
  },
  {
    id: 'es-ger-003', subject: 'espagnol', module: 'E01', skill: 'e-gerondif', type: 'text', difficulty: 3,
    prompt: 'Action en cours : écris **estar + gérondif**.\nNosotros ___ (trabajar) hoy.', accept: ['estamos trabajando'], placeholder: 'estar + gérondif',
    explanation: 'Nosotros **estamos trabajando** (trabajar → trabajando : -ar donne -ando).',
    verify: { kind: 'gerund', person: 'nosotros', inf: 'trabajar' },
  },
  {
    id: 'es-ger-004', subject: 'espagnol', module: 'E01', skill: 'e-gerondif', type: 'text', difficulty: 3,
    prompt: 'Action en cours : écris **estar + gérondif**.\nTú ___ (escribir) un mensaje.', accept: ['estás escribiendo'], placeholder: 'estar + gérondif',
    explanation: 'Tú **estás escribiendo** (escribir → escribiendo).',
    verify: { kind: 'gerund', person: 'tú', inf: 'escribir' },
  },

  // ───────── E02 · Le sens change ─────────
  {
    id: 'es-sens-001', subject: 'espagnol', module: 'E02', skill: 'e-sens', type: 'mcq', difficulty: 2,
    prompt: 'El pastel ___ rico.',
    answers: ['ES', 'ESTÁ'], correct: 1, shuffle: false,
    why: { q: 'Pourquoi ? Avec ESTAR, « rico » veut dire…', answers: ['délicieux', 'riche (qui a de l’argent)'], correct: 0 },
    explanation: '**estar rico** = être délicieux (à la dégustation) ; **ser rico** = être riche. El pastel **está** rico.',
  },
  {
    id: 'es-sens-002', subject: 'espagnol', module: 'E02', skill: 'e-sens', type: 'mcq', difficulty: 2,
    prompt: 'Ese empresario ___ rico : tiene tres casas.',
    answers: ['ES', 'ESTÁ'], correct: 0, shuffle: false,
    why: { q: 'Pourquoi ? Avec SER, « rico » veut dire…', answers: ['riche (qui a de l’argent)', 'délicieux'], correct: 0 },
    explanation: '**ser rico** = être riche. Ese empresario **es** rico : c’est une caractéristique, pas un goût.',
  },
  {
    id: 'es-sens-003', subject: 'espagnol', module: 'E02', skill: 'e-sens', type: 'mcq', difficulty: 2,
    prompt: 'Ana ___ lista : resuelve todos los problemas de matemáticas.',
    answers: ['ES', 'ESTÁ'], correct: 0, shuffle: false,
    why: { q: 'Pourquoi ? Avec SER, « listo » veut dire…', answers: ['intelligent(e), malin(e)', 'prêt(e)'], correct: 0 },
    explanation: '**ser listo** = être intelligent ; **estar listo** = être prêt. Ana **es** lista : c’est une qualité.',
  },
  {
    id: 'es-sens-004', subject: 'espagnol', module: 'E02', skill: 'e-sens', type: 'mcq', difficulty: 2,
    prompt: '¿___ listos? Nos vamos ya.',
    answers: ['SON', 'ESTÁIS'], correct: 1, shuffle: false,
    why: { q: 'Pourquoi ? Avec ESTAR, « listo » veut dire…', answers: ['prêt(e)', 'intelligent(e)'], correct: 0 },
    explanation: '**estar listo** = être prêt (état du moment) : ¿**Estáis** listos? Nos vamos ya.',
  },
  {
    id: 'es-sens-005', subject: 'espagnol', module: 'E02', skill: 'e-sens', type: 'mcq', difficulty: 2,
    prompt: 'Marta ___ muy atenta en clase : escucha todo.',
    answers: ['ES', 'ESTÁ'], correct: 1, shuffle: false,
    why: { q: 'Pourquoi ? Avec ESTAR, « atento » veut dire…', answers: ['attentif (concentré)', 'attentionné (gentil)'], correct: 0 },
    explanation: '**estar atento** = être attentif ; **ser atento** = être attentionné, poli. Marta **está** atenta : elle est concentrée.',
  },
  {
    id: 'es-sens-006', subject: 'espagnol', module: 'E02', skill: 'e-sens', type: 'mcq', difficulty: 2,
    prompt: 'Mi abuela siempre ___ muy atenta con nosotros : nos llama, nos cuida.',
    answers: ['ES', 'ESTÁ'], correct: 0, shuffle: false,
    why: { q: 'Pourquoi ? Avec SER, « atento » veut dire…', answers: ['attentionné(e)', 'attentif (concentré)'], correct: 0 },
    explanation: '**ser atento** = être attentionné (une façon d’être). Mi abuela **es** muy atenta con nosotros.',
  },
  {
    id: 'es-sens-007', subject: 'espagnol', module: 'E02', skill: 'e-sens', type: 'match', difficulty: 2,
    prompt: 'Associe chaque expression à son sens.',
    pairs: [
      ['ser listo', 'être intelligent'],
      ['estar listo', 'être prêt'],
      ['ser rico', 'être riche'],
      ['estar rico', 'être délicieux'],
    ],
    explanation: 'Avec SER on décrit une manière d’être : ser listo (intelligent), ser rico (riche). Avec ESTAR on décrit un état du moment : estar listo (prêt), estar rico (délicieux).',
  },
  {
    id: 'es-sens-008', subject: 'espagnol', module: 'E02', skill: 'e-sens', type: 'mcq', difficulty: 2,
    prompt: 'Que veut dire « **estar atento** » ?',
    answers: ['être attentif', 'être attentionné', 'être riche', 'être prêt'], correct: 0,
    explanation: '**estar atento** = être attentif (concentré) ; **ser atento** = être attentionné (poli, gentil).',
  },
  {
    id: 'es-sens-009', subject: 'espagnol', module: 'E02', skill: 'e-sens', type: 'mcq', difficulty: 3,
    prompt: 'Comment dire « Il est **prêt** » ?',
    answers: ['Está listo.', 'Es listo.', 'Está rico.', 'Es atento.'], correct: 0,
    feedbacks: { 1: 'Es listo = il est intelligent.' },
    explanation: '« Il est prêt » = **Está listo**. « Es listo » = il est intelligent.',
  },
]);
