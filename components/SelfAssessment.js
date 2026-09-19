/* SelfAssessment — « Comment ça s'est passé ? » (3 boutons) */
(function (R) {
  'use strict';
  const { el } = R.util;

  const SETS = {
    recall: [['🟢', 'Je savais'], ['🟠', 'J’ai hésité'], ['🔴', 'Je ne savais pas']],
    write: [['🟢', 'Ma version était proche'], ['🟠', 'Quelques écarts'], ['🔴', 'Très différente']],
    speak: [['🟢', 'Facile'], ['🟠', 'Quelques hésitations'], ['🔴', 'Difficile']],
  };
  const LEVELS = ['easy', 'hesitant', 'hard'];

  R.components.SelfAssessment = {
    SETS,
    // returns { el, destroy }
    mount(host, opts, onPick) {
      const labels = SETS[opts.set || 'recall'];
      let done = false;
      const pick = (lv) => { if (done) return; done = true; onPick(lv); };
      const box = el('div', { class: 'assess' },
        el('div', { class: 'assess-title' }, opts.title || 'Comment ça s’est passé ?'),
        el('div', { class: 'assess-btns' }, labels.map(([em, t], i) => el('button', { class: 'choice-lg lv-' + LEVELS[i], type: 'button', 'data-lv': LEVELS[i], onclick: () => pick(LEVELS[i]) },
          el('span', { class: 'em' }, em), el('span', { class: 'tx' }, t)))));
      host.append(box);
      const off = R.ui.keys((e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const tag = (document.activeElement || {}).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        if (/^[1-3]$/.test(e.key)) pick(LEVELS[+e.key - 1]);
      });
      return { el: box, destroy: off, auto: (lv) => pick(lv) };
    },
  };
})((window.R = window.R || {}));
