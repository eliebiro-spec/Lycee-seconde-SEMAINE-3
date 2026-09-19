/* Anglais Euro — « How much of me do I let you see? »
 * Identity · self-image · appearance · what we show / hide · authenticity.
 * Activités orientées expression orale (pas de QCM de vocabulaire). */
R.data.addItems('seconde/semaine-03', [
  // ───────── A01 · Expression rapide (30 s pour préparer, puis une aide de structures) ─────────
  {
    id: 'an-expr-001', subject: 'anglais', module: 'A01', skill: 'a-expression', type: 'speaking', mode: 'think', difficulty: 1,
    prompt: 'What do you want people to see about you?',
    help: ['I want people to see that I am…', 'I’d like them to notice…', 'What matters to me is…', 'I try to show…'],
    explanation: 'Une réponse possible : « I want people to see that I am curious and honest. I try to show it by asking questions and by saying what I really think. »',
  },
  {
    id: 'an-expr-002', subject: 'anglais', module: 'A01', skill: 'a-expression', type: 'speaking', mode: 'think', difficulty: 2,
    prompt: 'Is there something about you that you prefer to keep private? Why?',
    help: ['There are things I keep to myself, such as…', 'I prefer not to show… because…', 'I only share it with…', 'It’s not that I’m hiding, it’s just that…'],
    explanation: 'Une réponse possible : « There are things I keep to myself, such as my worries. I only share them with close friends because I need to trust people first. »',
  },
  {
    id: 'an-expr-003', subject: 'anglais', module: 'A01', skill: 'a-expression', type: 'speaking', mode: 'think', difficulty: 2,
    prompt: 'Does your appearance say something about who you are?',
    help: ['The way I dress shows…', 'At first sight, people might think…', 'But in fact, I am…', 'I choose my clothes to…'],
    explanation: 'Une réponse possible : « The way I dress shows a bit of my mood. At first sight people might think I’m shy, but in fact I’m quite talkative when I know people. »',
  },
  {
    id: 'an-expr-004', subject: 'anglais', module: 'A01', skill: 'a-expression', type: 'speaking', mode: 'think', difficulty: 2,
    prompt: 'Do you behave differently online and in real life?',
    help: ['Online, I tend to…', 'In real life, I…', 'The main difference is…', 'People only see…'],
    explanation: 'Une réponse possible : « Online, I tend to show only the best moments. In real life, I’m more spontaneous. The main difference is that people only see what I choose to post. »',
  },
  {
    id: 'an-expr-005', subject: 'anglais', module: 'A01', skill: 'a-expression', type: 'speaking', mode: 'think', difficulty: 3,
    prompt: 'What does it mean to be authentic?',
    help: ['Being authentic means…', 'To me, it’s about…', 'It’s not always easy to… because…', 'You can be authentic and still…'],
    explanation: 'Une réponse possible : « Being authentic means being yourself even when it’s not easy. To me, it’s about not pretending to be someone else to please people. »',
  },
  {
    id: 'an-expr-006', subject: 'anglais', module: 'A01', skill: 'a-expression', type: 'speaking', mode: 'think', difficulty: 3,
    prompt: 'Can a photo really show who you are?',
    help: ['A photo shows only…', 'It can’t show…', 'On the other hand…', 'What people don’t see is…'],
    explanation: 'Une réponse possible : « A photo shows only one moment. It can’t show my thoughts or my personality. On the other hand, it can show how I feel that day. »',
  },

  // ───────── A02 · Reformulation (idée en français → production en anglais → proposition) ─────────
  {
    id: 'an-reform-001', subject: 'anglais', module: 'A02', skill: 'a-reformulation', type: 'flashcard', input: true, difficulty: 1,
    prompt: 'Dis (ou écris) en anglais :\n« Je ne montre pas toujours ce que je ressens vraiment. »',
    back: 'I don’t always show what I really feel.',
    explanation: 'D’autres formulations sont possibles, par exemple : « I don’t always show my true feelings. »',
  },
  {
    id: 'an-reform-002', subject: 'anglais', module: 'A02', skill: 'a-reformulation', type: 'flashcard', input: true, difficulty: 1,
    prompt: 'Dis (ou écris) en anglais :\n« Les gens jugent souvent sur les apparences. »',
    back: 'People often judge by appearances.',
    explanation: 'Variante : « People often judge you on your appearance. »',
  },
  {
    id: 'an-reform-003', subject: 'anglais', module: 'A02', skill: 'a-reformulation', type: 'flashcard', input: true, difficulty: 2,
    prompt: 'Dis (ou écris) en anglais :\n« Sur les réseaux sociaux, on montre seulement le meilleur de soi-même. »',
    back: 'On social media, we only show the best version of ourselves.',
    explanation: 'Variante : « On social media, people only show their best side. »',
  },
  {
    id: 'an-reform-004', subject: 'anglais', module: 'A02', skill: 'a-reformulation', type: 'flashcard', input: true, difficulty: 2,
    prompt: 'Dis (ou écris) en anglais :\n« Être authentique, c’est oser être soi-même. »',
    back: 'Being authentic means daring to be yourself.',
    explanation: 'Variante : « To be authentic is to dare to be yourself. »',
  },
  {
    id: 'an-reform-005', subject: 'anglais', module: 'A02', skill: 'a-reformulation', type: 'flashcard', input: true, difficulty: 2,
    prompt: 'Dis (ou écris) en anglais :\n« Ce que les autres voient n’est pas toujours ce que je suis. »',
    back: 'What others see is not always who I am.',
    explanation: 'Variante : « What people see isn’t always the real me. »',
  },
  {
    id: 'an-reform-006', subject: 'anglais', module: 'A02', skill: 'a-reformulation', type: 'flashcard', input: true, difficulty: 2,
    prompt: 'Dis (ou écris) en anglais :\n« Parfois, j’ai peur d’être jugé(e). »',
    back: 'Sometimes I’m afraid of being judged.',
    explanation: 'Variante : « Sometimes I’m scared of being judged. »',
  },
  {
    id: 'an-reform-007', subject: 'anglais', module: 'A02', skill: 'a-reformulation', type: 'flashcard', input: true, difficulty: 3,
    prompt: 'Dis (ou écris) en anglais :\n« Je cache ma timidité derrière un grand sourire. »',
    back: 'I hide my shyness behind a big smile.',
    explanation: 'Variante : « I hide how shy I am behind a big smile. »',
  },
  {
    id: 'an-reform-008', subject: 'anglais', module: 'A02', skill: 'a-reformulation', type: 'flashcard', input: true, difficulty: 3,
    prompt: 'Dis (ou écris) en anglais :\n« L’image que j’ai de moi change d’un jour à l’autre. »',
    back: 'The image I have of myself changes from day to day.',
    explanation: 'Variante : « My self-image changes from one day to the next. »',
  },

  // ───────── A03 · Speaking cards (30 secondes, sans enregistrement) ─────────
  {
    id: 'an-speak-001', subject: 'anglais', module: 'A03', skill: 'a-speaking', type: 'speaking', mode: 'speak', difficulty: 1,
    prompt: 'What is the difference between who you are and what people see?',
    hint: 'Try: “People see… but in reality, I am…”',
  },
  {
    id: 'an-speak-002', subject: 'anglais', module: 'A03', skill: 'a-speaking', type: 'speaking', mode: 'speak', difficulty: 1,
    prompt: 'Describe one thing you show to everyone and one thing you hide.',
    hint: 'Try: “Everybody knows that I… but I rarely show…”',
  },
  {
    id: 'an-speak-003', subject: 'anglais', module: 'A03', skill: 'a-speaking', type: 'speaking', mode: 'speak', difficulty: 2,
    prompt: 'Is your self-image the same as the image other people have of you? Why?',
    hint: 'Try: “I see myself as… whereas others think I am…”',
  },
  {
    id: 'an-speak-004', subject: 'anglais', module: 'A03', skill: 'a-speaking', type: 'speaking', mode: 'speak', difficulty: 2,
    prompt: 'Is it always good to be completely authentic? Give your opinion.',
    hint: 'Try: “In my opinion… / On the one hand… on the other hand…”',
  },
  {
    id: 'an-speak-005', subject: 'anglais', module: 'A03', skill: 'a-speaking', type: 'speaking', mode: 'speak', difficulty: 2,
    prompt: 'Describe how you look and explain what it says (or doesn’t say) about you.',
    hint: 'Try: “I usually wear… which shows that…”',
  },
  {
    id: 'an-speak-006', subject: 'anglais', module: 'A03', skill: 'a-speaking', type: 'speaking', mode: 'speak', difficulty: 3,
    prompt: 'Have you ever hidden a part of yourself to fit in? What happened?',
    hint: 'Try: “Once, I didn’t say… because I was afraid that…”',
  },
]);
