/* OrderQuestion — touche les éléments dans l'ordre : chaque élément choisi reçoit son numéro sur place
 * (une seule liste = peu de hauteur). Les leurres, s'il y en a, ne doivent pas être choisis. */
(function (R) {
  'use strict';
  const { el, rich, shuffle } = R.util;

  R.components.register('OrderQuestion', 'order', {
    mount(host, item, ctl) {
      const target = item.items;
      const all = target.concat(item.distractors || []);
      const chips = shuffle(all.map((t, i) => ({ id: i, text: t })));
      let seq = []; // ids choisis, dans l'ordre
      let locked = false;

      const pool = el('div', { class: 'pool', role: 'group', 'aria-label': 'Éléments à ordonner' });
      const clear = el('button', { class: 'linkbtn', type: 'button', onclick: () => { if (!locked) { seq = []; render(); } } }, 'Effacer');
      host.append(el('div', { class: 'order-head' }, R.ui.promptEl(item.prompt, 'small'), clear), pool);

      const textOf = (id) => all[id];
      const eq = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
      const orderCorrect = () => {
        const t = seq.map(textOf);
        if (eq(t, target)) return true;
        return (item.altOrders || []).some((perm) => eq(t, perm.map((i) => target[i])));
      };

      function toggle(id) {
        if (locked) return;
        const at = seq.indexOf(id);
        if (at >= 0) seq.splice(at, 1); else seq.push(id);
        render();
      }

      function render() {
        pool.innerHTML = '';
        chips.forEach((c) => {
          const at = seq.indexOf(c.id);
          pool.append(el('button', { class: 'chip' + (at >= 0 ? ' in' : ''), type: 'button', 'data-id': c.id, disabled: locked, 'aria-pressed': String(at >= 0), onclick: () => toggle(c.id) },
            el('span', { class: 'num' }, at >= 0 ? String(at + 1) : ''), el('span', { class: 'tx', html: rich(c.text) })));
        });
        clear.style.visibility = seq.length && !locked ? 'visible' : 'hidden';
        ctl.setAction('Valider', validate, seq.length !== target.length);
      }

      function validate() {
        if (locked || seq.length !== target.length) return;
        locked = true;
        const ok = orderCorrect();
        const t = seq.map(textOf);
        let mistakes = 0;
        t.forEach((x, i) => { if (x !== target[i]) mistakes++; });
        ctl.submit({ correct: ok, mistakes: ok ? 0 : mistakes, noConfidence: true, answerText: t.join(' / '), correctList: target });
      }

      render();
      return {
        reveal(res) {
          [...pool.children].forEach((b) => {
            b.disabled = true;
            const id = +b.dataset.id, at = seq.indexOf(id);
            if (at < 0) { b.classList.add('dim'); return; }
            b.classList.add(res.correct || textOf(id) === target[at] ? 'ok' : 'bad');
          });
          clear.style.visibility = 'hidden';
        },
        destroy() {},
        auto(wantCorrect) {
          const ids = target.map((t) => all.indexOf(t));
          seq = wantCorrect ? ids : ids.slice().reverse();
          render(); validate();
        },
      };
    },
  });
})((window.R = window.R || {}));
