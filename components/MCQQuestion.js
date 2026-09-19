/* MCQQuestion + TrueFalseQuestion */
(function (R) {
  'use strict';
  const { el, rich, shuffle } = R.util;

  // Les réponses sont mélangées à l'affichage (sauf shuffle:false) pour éviter de mémoriser une position.
  function mountChoices(host, item, ctl, opts) {
    const answers = opts.answers;
    const order = answers.map((_, i) => i);
    if (opts.shuffle !== false) order.splice(0, order.length, ...shuffle(order));
    let locked = false, picked = null;

    if (item.figure) host.append(R.ui.figure(item.figure));
    host.append(R.ui.promptEl(item.prompt, opts.promptClass));
    const box = el('div', { class: 'choices' + (opts.cols ? ' cols' + opts.cols : '') });
    const btns = {};
    order.forEach((ai, pos) => {
      const b = el('button', { class: 'choice', type: 'button', 'data-i': ai, onclick: () => pick(ai) },
        el('span', { class: 'k' }, opts.keyLabels ? opts.keyLabels[pos] : String(pos + 1)),
        el('span', { class: 't', html: rich(answers[ai]) }));
      btns[ai] = b; box.append(b);
    });
    host.append(box);

    function pick(ai) {
      if (locked) return;
      locked = true; picked = ai;
      btns[ai].classList.add('picked');
      Object.values(btns).forEach((b) => (b.disabled = true));
      ctl.submit(opts.evaluate(ai));
    }

    const off = R.ui.keys((e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (document.activeElement || {}).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      let pos = -1;
      if (opts.keyMap) { pos = opts.keyMap(e.key.toLowerCase(), order); }
      else if (/^[1-9]$/.test(e.key)) pos = order[parseInt(e.key, 10) - 1];
      if (pos != null && pos >= 0 && btns[pos] && !locked) pick(pos);
    });

    return {
      reveal(res) {
        Object.keys(btns).forEach((k) => {
          const b = btns[k];
          b.disabled = true;
          const idx = Number(k);
          if (idx === opts.correctIdx) b.classList.add('correct');
          else if (idx === picked) b.classList.add('wrong');
          else b.classList.add('dim');
        });
      },
      destroy() { off(); },
      auto(wantCorrect) {
        const wrong = order.find((i) => i !== opts.correctIdx);
        pick(wantCorrect ? opts.correctIdx : wrong);
      },
    };
  }

  R.components.register('MCQQuestion', 'mcq', {
    mount(host, item, ctl) {
      return mountChoices(host, item, ctl, {
        answers: item.answers, shuffle: item.shuffle, correctIdx: item.correct,
        evaluate: (ai) => ({
          correct: ai === item.correct,
          answerText: item.answers[ai], correctText: item.answers[item.correct],
          feedback: item.feedbacks && item.feedbacks[ai],
        }),
      });
    },
  });

  // Vrai / Faux : l'énoncé est présenté comme une citation
  R.components.register('TrueFalseQuestion', 'tf', {
    mount(host, item, ctl) {
      const inst = mountChoices(host, Object.assign({}, item, { prompt: item.prompt }), ctl, {
        answers: ['Vrai', 'Faux'], shuffle: false, cols: 2, promptClass: 'statement', keyLabels: ['V', 'F'],
        keyMap: (k) => (k === 'v' || k === '1' ? 0 : k === 'f' || k === '2' ? 1 : -1),
        correctIdx: item.correct ? 0 : 1,
        evaluate: (ai) => ({
          correct: (ai === 0) === item.correct,
          answerText: ai === 0 ? 'Vrai' : 'Faux', correctText: item.correct ? 'Vrai' : 'Faux',
        }),
      });
      host.insertBefore(el('div', { class: 'kicker' }, 'Vrai ou faux ?'), host.firstChild);
      return inst;
    },
  });
})((window.R = window.R || {}));
