/* GuidedProof — démonstration en micro-étapes. À chaque étape, un choix ; la ligne du raisonnement s'affiche
 * quand l'étape est réussie. Le nombre d'erreurs décide du résultat (0 : solide, 1 : hésitant, 2+ : à refaire). */
(function (R) {
  'use strict';
  const { el, rich, shuffle } = R.util;

  R.components.register('GuidedProof', 'proof', {
    mount(host, item, ctl) {
      const steps = item.steps;
      let si = 0, mistakes = 0, locked = false, tid = null, finished = false;

      host.append(el('div', { class: 'proof-goal' }, el('span', { class: 'tag' }, 'À démontrer'), el('div', { html: rich(item.prompt) })));
      const lines = el('ol', { class: 'proof-lines', 'aria-label': 'Raisonnement construit' });
      const stepBox = el('div', { class: 'proof-step' });
      host.append(lines, stepBox);

      function showStep() {
        locked = false;
        stepBox.innerHTML = '';
        const s = steps[si];
        const order = shuffle(s.answers.map((_, i) => i));
        stepBox.append(el('div', { class: 'proof-q' }, el('span', { class: 'proof-n' }, (si + 1) + '/' + steps.length), el('span', { html: rich(s.q) })));
        const box = el('div', { class: 'choices' });
        const fb = el('div', { class: 'proof-fb', role: 'status' });
        order.forEach((ai, pos) => {
          const b = el('button', { class: 'choice', type: 'button', onclick: () => choose(ai, b, fb) },
            el('span', { class: 'k' }, String(pos + 1)), el('span', { class: 't', html: rich(s.answers[ai]) }));
          b.dataset.i = ai;
          box.append(b);
        });
        stepBox.append(box, fb);
        ctl.clearAction();
      }

      function choose(ai, btn, fb) {
        if (locked) return;
        const s = steps[si];
        if (ai !== s.correct) {
          mistakes++;
          btn.classList.add('wrong'); btn.disabled = true;
          fb.textContent = (s.feedbacks && s.feedbacks[ai]) || 'Pas encore : relis l’étape.';
          return;
        }
        locked = true;
        btn.classList.add('correct');
        stepBox.querySelectorAll('.choice').forEach((b) => (b.disabled = true));
        fb.textContent = '';
        lines.append(el('li', { class: 'line', html: rich(s.line) }));
        tid = setTimeout(() => {
          si++;
          if (si < steps.length) showStep(); else finish();
        }, 550);
      }

      function finish() {
        finished = true;
        stepBox.innerHTML = '';
        stepBox.append(el('div', { class: 'proof-done' }, '✓ Démonstration terminée'));
        ctl.submit({ correct: mistakes < 2, partial: mistakes === 1, mistakes, noConfidence: true, answerText: '', correctText: '' });
      }

      const off = R.ui.keys((e) => {
        if (!/^[1-9]$/.test(e.key) || locked || finished || e.ctrlKey || e.metaKey) return;
        const b = stepBox.querySelectorAll('.choice:not([disabled])')[+e.key - 1];
        if (b) b.click();
      });

      showStep();
      return {
        reveal() {},
        destroy() { off(); if (tid) clearTimeout(tid); },
        auto(wantCorrect) {
          const run = () => {
            if (finished) return;
            const s = steps[si];
            if (!wantCorrect && si < 2) {
              const wrong = [...stepBox.querySelectorAll('.choice')].find((b) => +b.dataset.i !== s.correct);
              if (wrong) wrong.click();
            }
            const good = [...stepBox.querySelectorAll('.choice')].find((b) => +b.dataset.i === s.correct);
            if (good) good.click();
          };
          const loop = setInterval(() => { if (finished) clearInterval(loop); else if (!locked) run(); }, 40);
        },
      };
    },
  });
})((window.R = window.R || {}));
