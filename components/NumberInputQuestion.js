/* NumberInputQuestion + TextInputQuestion */
(function (R) {
  'use strict';
  const { el, parseNum, clean, norm } = R.util;

  function fieldRow(item, ctl, cfg) {
    const input = el('input', {
      class: 'field', type: 'text', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false',
      inputmode: cfg.inputmode, enterkeyhint: 'done', placeholder: item.placeholder || cfg.placeholder || '', 'aria-label': 'Ta réponse',
    });
    if (cfg.lang) input.setAttribute('lang', cfg.lang);
    const err = el('div', { class: 'field-err', role: 'alert' });
    const row = el('div', { class: 'answer-row' }, input, item.unit ? el('span', { class: 'unit' }, item.unit) : null);
    return { input, err, row };
  }

  function mountField(host, item, ctl, cfg) {
    host.append(R.ui.promptEl(item.prompt));
    const { input, err, row } = fieldRow(item, ctl, cfg);
    host.append(row, err);
    let locked = false;

    function update() { ctl.setAction('Valider', submit, !input.value.trim()); }
    function submit() {
      if (locked || !input.value.trim()) return;
      const r = cfg.evaluate(input.value);
      if (r.invalid) { err.textContent = r.invalid; return; }
      err.textContent = '';
      locked = true; input.readOnly = true;
      ctl.submit(r);
    }
    input.addEventListener('input', () => { err.textContent = ''; update(); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    update();
    setTimeout(() => { try { input.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 60);

    return {
      reveal(res) { input.classList.add(res.correct ? 'ok' : 'bad'); },
      destroy() {},
      auto(wantCorrect) { input.value = wantCorrect ? cfg.sample : cfg.wrongSample; input.dispatchEvent(new Event('input')); submit(); },
    };
  }

  R.components.register('NumberInputQuestion', 'number', {
    mount(host, item, ctl) {
      const answers = item.answers || [item.answer];
      const tol = item.tolerance || 0;
      const fmt = (n) => String(n).replace('.', ',') + (item.unit ? ' ' + item.unit : '');
      return mountField(host, item, ctl, {
        inputmode: 'decimal', placeholder: 'Ta réponse',
        sample: String(answers[0]), wrongSample: String(answers[0] + 7),
        evaluate(txt) {
          const n = parseNum(txt);
          if (n === null) return { invalid: 'Écris un seul nombre (par exemple 12 ou 0,5).' };
          const ok = answers.some((a) => Math.abs(a - n) <= tol + 1e-9);
          return { correct: ok, answerText: fmt(n), correctText: answers.length > 1 ? 'par exemple ' + fmt(answers[0]) : fmt(answers[0]) };
        },
      });
    },
  });

  R.components.register('TextInputQuestion', 'text', {
    mount(host, item, ctl) {
      const accepts = item.accept;
      return mountField(host, item, ctl, {
        inputmode: 'text', lang: item.subject === 'espagnol' ? 'es' : 'fr', placeholder: 'Ta réponse',
        sample: accepts[0], wrongSample: 'zzz',
        evaluate(txt) {
          const exact = accepts.some((a) => clean(a) === clean(txt));
          const loose = accepts.some((a) => norm(a) === norm(txt));
          const res = { correct: exact || loose, answerText: txt.trim(), correctText: accepts[0] };
          if (!exact && loose) res.note = 'Attention aux accents : écris « ' + accepts[0] + ' ».';
          return res;
        },
      });
    },
  });
})((window.R = window.R || {}));
