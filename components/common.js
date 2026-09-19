/* components/common.js — helpers d'interface partagés + registre des composants de questions.
 *
 * Contrat d'un composant de question :
 *   Comp.mount(host, item, ctl) -> { reveal(result), destroy(), auto(wantCorrect) }
 *   ctl.submit({ correct, partial?, mistakes?, answerText?, correctText?, feedback?, note?, noConfidence? })
 *   ctl.selfAssess('easy'|'hesitant'|'hard')       (cartes auto-évaluées)
 *   ctl.setAction(label, fn, disabled) / ctl.clearAction()
 *   ctl.challenge (bool)
 */
(function (R) {
  'use strict';
  const { el, rich } = R.util;

  R.components = { byType: {} };

  R.ui = {
    STATUS: {
      new: { icon: '⚪', label: 'À découvrir' },
      green: { icon: '🟢', label: 'Acquis' },
      orange: { icon: '🟠', label: 'À consolider' },
      red: { icon: '🔴', label: 'À réactiver' },
    },
    dot(status) { return R.ui.STATUS[status].icon; },

    bar(value, color) {
      const b = el('div', { class: 'bar' }, el('i', { style: 'width:' + Math.max(0, Math.min(100, value)) + '%;' + (color ? 'background:' + color : '') }));
      return b;
    },

    // Fenêtre de confirmation (Promise<boolean>)
    confirm(opts) {
      return new Promise((resolve) => {
        const root = document.getElementById('modal-root');
        const done = (v) => { root.innerHTML = ''; document.removeEventListener('keydown', onKey); resolve(v); };
        const onKey = (e) => { if (e.key === 'Escape') done(false); };
        const ok = el('button', { class: 'btn ' + (opts.danger ? 'danger' : 'primary'), type: 'button', onclick: () => done(true) }, opts.ok || 'OK');
        const cancel = el('button', { class: 'btn ghost', type: 'button', onclick: () => done(false) }, opts.cancel || 'Annuler');
        const box = el('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': opts.title },
          el('h2', null, opts.title), opts.text ? el('p', null, opts.text) : null,
          el('div', { class: 'modal-actions' }, cancel, ok));
        const back = el('div', { class: 'modal-back', onclick: (e) => { if (e.target === back) done(false); } }, box);
        root.innerHTML = '';
        root.append(back);
        document.addEventListener('keydown', onKey);
        (opts.danger ? cancel : ok).focus();
      });
    },

    figure(fig) {
      if (fig.kind !== 'chain') return el('div');
      const ICON = { solide: '🧊', liquide: '💧', gaz: '☁️' };
      const row = el('div', { class: 'chain', role: 'img', 'aria-label': fig.nodes.join(' → ') });
      fig.nodes.forEach((n, i) => {
        row.append(el('div', { class: 'chain-node' }, el('span', { class: 'ico' }, ICON[n] || ''), el('span', null, n.toUpperCase())));
        if (i < fig.arrows.length) {
          const a = fig.arrows[i];
          row.append(el('div', { class: 'chain-arrow' + (a === '?' ? ' q' : '') }, el('span', { class: 'lab' }, a), el('span', { class: 'ar' }, '→')));
        }
      });
      return row;
    },

    promptEl(text, cls) { return el('div', { class: 'prompt ' + (cls || ''), html: rich(text) }); },

    // Écouteur clavier nettoyable
    keys(handler) {
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    },
  };

  R.components.register = function (name, type, comp) {
    R.components[name] = comp;
    R.components.byType[type] = comp;
  };
})((window.R = window.R || {}));
