/* MatchQuestion — touche un élément à gauche, puis son correspondant à droite. */
(function (R) {
  'use strict';
  const { el, rich, shuffle } = R.util;

  R.components.register('MatchQuestion', 'match', {
    mount(host, item, ctl) {
      const pairs = item.pairs;
      const rights = shuffle(pairs.map((p, i) => ({ text: p[1], orig: i })));
      const link = {}; // gauche -> index dans rights
      let sel = null, locked = false;

      host.append(R.ui.promptEl(item.prompt, 'small'));
      const cols = el('div', { class: 'match' });
      const L = el('div', { class: 'match-col' }), Rr = el('div', { class: 'match-col' });
      cols.append(L, Rr);
      host.append(cols);

      const rightOwner = (ri) => Object.keys(link).find((l) => link[l] === ri);

      function render() {
        L.innerHTML = ''; Rr.innerHTML = '';
        pairs.forEach((p, li) => {
          const has = link[li] != null;
          L.append(el('button', { type: 'button', disabled: locked, class: 'mbtn' + (has ? ' linked p' + li : '') + (sel === li ? ' sel' : ''), onclick: () => clickL(li), html: rich(p[0]) }));
        });
        rights.forEach((r, ri) => {
          const owner = rightOwner(ri);
          Rr.append(el('button', { type: 'button', disabled: locked, class: 'mbtn' + (owner != null ? ' linked p' + owner : ''), onclick: () => clickR(ri), html: rich(r.text) }));
        });
        ctl.setAction('Valider', validate, Object.keys(link).length !== pairs.length);
      }
      function clickL(li) {
        if (locked) return;
        if (link[li] != null) { delete link[li]; sel = li; }
        else sel = sel === li ? null : li;
        render();
      }
      function clickR(ri) {
        if (locked) return;
        const owner = rightOwner(ri);
        if (sel == null) { if (owner != null) { delete link[owner]; render(); } return; }
        if (owner != null) delete link[owner];
        link[sel] = ri; sel = null;
        render();
      }
      function validate() {
        if (locked || Object.keys(link).length !== pairs.length) return;
        locked = true;
        let mistakes = 0;
        pairs.forEach((p, li) => { if (rights[link[li]].orig !== li) mistakes++; });
        ctl.submit({ correct: mistakes === 0, partial: false, mistakes, noConfidence: true, answerText: '', correctList: pairs.map((p) => p[0] + '  =  ' + p[1]) });
      }
      render();

      return {
        reveal() {
          [...L.children].forEach((b, li) => { b.disabled = true; b.classList.add(rights[link[li]].orig === li ? 'ok' : 'bad'); });
          [...Rr.children].forEach((b, ri) => { b.disabled = true; const o = rightOwner(ri); b.classList.add(o != null && rights[ri].orig === Number(o) ? 'ok' : 'bad'); });
        },
        destroy() {},
        auto(wantCorrect) {
          pairs.forEach((p, li) => {
            let ri = rights.findIndex((r) => r.orig === li);
            if (!wantCorrect) ri = rights.findIndex((r) => r.orig === (li + 1) % pairs.length);
            link[li] = ri;
          });
          render(); validate();
        },
      };
    },
  });
})((window.R = window.R || {}));
