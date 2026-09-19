/* FlashcardQuestion — rappel actif : on essaie d'abord, on découvre ensuite, on s'auto-évalue.
 * item.input = true : l'élève écrit (ou dit) sa version avant de voir la proposition. */
(function (R) {
  'use strict';
  const { el, rich } = R.util;

  R.components.register('FlashcardQuestion', 'flashcard', {
    mount(host, item, ctl) {
      let assess = null;
      host.append(R.ui.promptEl(item.prompt, 'card'));
      const zone = el('div', { class: 'flash-zone' });
      host.append(zone);
      let ta = null;
      if (item.input) {
        ta = el('textarea', { class: 'field area', rows: 3, placeholder: 'Ta version… (tu peux aussi la dire à voix haute)', 'aria-label': 'Ta version', spellcheck: 'false', autocapitalize: 'off' });
        zone.append(ta);
      } else {
        zone.append(el('div', { class: 'nudge' }, 'Essaie de te dire la réponse dans ta tête avant de la voir.'));
      }
      ctl.setAction(item.input ? 'Voir la proposition' : 'Je me suis répondu(e) — voir la réponse', reveal, false);

      function reveal() {
        ctl.clearAction();
        host.classList.add('revealed');
        if (ta) { if (!ta.value.trim()) ta.remove(); else { ta.readOnly = true; ta.rows = 2; } }
        zone.append(el('div', { class: 'back' }, el('div', { class: 'back-label' }, item.input ? 'Une proposition' : 'La réponse'), el('div', { class: 'back-text', html: rich(item.back) })));
        if (item.input && item.explanation) zone.append(el('div', { class: 'back-note', html: rich(item.explanation) }));
        assess = R.components.SelfAssessment.mount(host, { set: item.input ? 'write' : 'recall', title: 'Comment ça s’est passé ?' }, (lv) => ctl.selfAssess(lv));
        const foot = host.querySelector('.assess');
        if (foot && foot.scrollIntoView) foot.scrollIntoView({ block: 'nearest' });
      }

      return {
        reveal() {},
        destroy() { if (assess) assess.destroy(); },
        auto(wantCorrect) { reveal(); assess.auto(wantCorrect ? 'easy' : 'hard'); },
      };
    },
  });
})((window.R = window.R || {}));
