/* views/session.js — une question à la fois : réponse -> (confiance) -> feedback -> suite.
 * La session est enregistrée après chaque réponse : on peut la quitter et la reprendre. */
(function (R) {
  'use strict';
  const { el, rich, firstSentence, shuffle } = R.util;
  const M = R.mastery;
  const SES = R.session;

  R.views.session = function (root, params, previewOpts) {
    const app = R.app, week = app.week, state = app.state;
    const preview = !!previewOpts;
    let sess = preview ? previewOpts.session : state.session;
    if (!sess) { location.hash = '#/'; return; }

    // ── Structure fixe
    const closeBtn = el('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Mettre en pause' }, '✕');
    const barFill = el('i');
    const count = el('div', { class: 's-count' });
    const tag = el('div', { class: 's-tag' });
    const hintBtn = el('button', { class: 'hint-btn', type: 'button' }, '💡 Indice');
    const hintBox = el('div', { class: 'hint-box', hidden: true });
    const body = el('div', { class: 's-body' });
    const card = el('div', { class: 's-card' }, el('div', { class: 's-tagrow' }, tag, hintBtn), hintBox, body);
    const panel = el('div', { class: 's-panel' });
    const main = el('main', { class: 's-main' }, card, panel);
    const action = el('button', { class: 'btn primary s-action', type: 'button' }, 'Valider');
    const foot = el('footer', { class: 's-foot' }, action);
    const section = el('section', { class: 'session' },
      el('header', { class: 's-head' }, closeBtn, el('div', { class: 'bar s-bar' }, barFill), count), main, foot);
    root.append(section);

    // ── État de la question courante
    let entry, item, skill, subj, inst = null, res = null, conf = null, hintUsed = false, answered = false, actionFn = null, offConf = null, timer = null;

    const ctl = {
      challenge: !!sess.challenge,
      setAction(label, fn, disabled) {
        actionFn = fn; action.textContent = label; action.disabled = !!disabled; action.style.visibility = 'visible';
      },
      clearAction() { actionFn = null; action.style.visibility = 'hidden'; action.disabled = true; },
      submit: onSubmit,
      selfAssess: onSelf,
    };
    action.addEventListener('click', () => { if (actionFn && !action.disabled) actionFn(); });

    closeBtn.addEventListener('click', async () => {
      if (preview) { location.hash = '#/'; return; }
      const ok = await R.ui.confirm({ title: 'Faire une pause ?', text: 'Ta session est enregistrée : tu pourras la reprendre depuis l’accueil.', ok: 'Faire une pause', cancel: 'Continuer' });
      if (ok) location.hash = '#/';
    });

    const offEnter = R.ui.keys((e) => {
      if (e.key !== 'Enter' || e.ctrlKey || e.metaKey) return;
      const tg = (document.activeElement || {}).tagName;
      if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'BUTTON') return;
      if (actionFn && !action.disabled) { e.preventDefault(); actionFn(); }
    });

    function cleanQuestion() {
      if (inst && inst.destroy) inst.destroy();
      inst = null;
      if (offConf) { offConf(); offConf = null; }
      if (timer) { clearTimeout(timer); timer = null; }
      const c = section.querySelector('.conf'); if (c) c.remove();
    }

    // ── Affichage d'une question
    function renderQuestion() {
      cleanQuestion();
      if (sess.pos >= sess.queue.length) return finish();
      entry = sess.queue[sess.pos];
      item = week._idx.item[entry.itemId];
      skill = week._idx.skill[item.skill];
      subj = week._idx.subject[item.subject];
      res = null; conf = null; hintUsed = false; answered = false;
      body.className = 's-body t-' + item.type;

      section.style.setProperty('--accent', subj.color);
      const idx = Math.min(sess.pos + 1, sess.queue.length);
      count.textContent = idx + '/' + sess.queue.length;
      barFill.style.width = Math.round((sess.pos / sess.queue.length) * 100) + '%';
      tag.innerHTML = '';
      tag.append(el('span', { class: 'sd' }), subj.icon + ' ' + subj.short + ' · ' + skill.label);
      panel.innerHTML = '';
      body.innerHTML = '';
      hintBox.hidden = true; hintBox.textContent = '';
      const hasHint = !!item.hint && !sess.challenge;
      hintBtn.hidden = !hasHint;
      hintBtn.textContent = item.type === 'speaking' ? '💡 Aide' : '💡 Indice';
      hintBtn.disabled = false;
      ctl.clearAction();

      const comp = R.components.byType[item.type];
      inst = comp.mount(body, item, ctl);
      card.classList.remove('enter'); void card.offsetWidth; card.classList.add('enter');
      main.scrollTop = 0;
      if (sess.challenge) tag.append(el('span', { class: 'chip-mini' }, 'Défi'));
    }

    hintBtn.addEventListener('click', () => {
      if (answered || !item.hint) return;
      hintUsed = true;
      hintBox.hidden = false;
      hintBox.innerHTML = rich(item.hint);
      hintBtn.disabled = true;
    });

    // ── 1. Réponse soumise par le composant
    function onSubmit(r) {
      if (answered) return;
      answered = true; res = r;
      hintBtn.disabled = true;
      ctl.clearAction();
      if (entry.ask && !r.noConfidence) showConfidence(); else afterConfidence(null);
    }

    // ── 2. Métacognition : « Tu étais sûr(e) ? » (avant de révéler la correction)
    function showConfidence() {
      panel.innerHTML = '';
      const set = [['sure', 'Sûr(e)'], ['unsure', 'Pas totalement'], ['guess', 'J’ai deviné']];
      const box = el('div', { class: 'conf' }, el('div', { class: 'assess-title' }, 'Tu étais sûr(e) de ta réponse ?'),
        el('div', { class: 'conf-btns' }, set.map(([k, t], i) => el('button', { class: 'btn choice-lg conf-' + k, type: 'button', 'data-conf': k, onclick: () => pick(k) }, el('span', null, t)))));
      section.append(box); // feuille en bas d'écran : n'ajoute aucune hauteur à la question
      let done = false;
      const pick = (k) => { if (done) return; done = true; if (offConf) { offConf(); offConf = null; } box.remove(); afterConfidence(k); };
      offConf = R.ui.keys((e) => { if (/^[1-3]$/.test(e.key) && !e.ctrlKey && !e.metaKey) pick(set[+e.key - 1][0]); });
    }

    // ── 3. Révélation (+ « Pourquoi ? » éventuel)
    function afterConfidence(c) {
      conf = c;
      panel.innerHTML = '';
      inst.reveal(res);
      body.classList.add('answered', res.correct ? 'ok' : 'ko');
      if (res.correct && !res.partial && item.why) showWhy(); else finalize(false, null);
    }

    function showWhy() {
      const w = item.why;
      const order = shuffle(w.answers.map((_, i) => i));
      const box = el('div', { class: 'fb ok why' }, el('div', { class: 'fb-title' }, '✓ Exact.'), el('div', { class: 'assess-title' }, w.q),
        el('div', { class: 'choices' }, order.map((ai, pos) => el('button', { class: 'choice', type: 'button', 'data-i': ai, onclick: () => pick(ai) }, el('span', { class: 'k' }, String(pos + 1)), el('span', { class: 't', html: rich(w.answers[ai]) })))));
      panel.append(box);
      let done = false;
      const pick = (ai) => {
        if (done) return; done = true;
        if (offConf) { offConf(); offConf = null; }
        finalize(ai !== w.correct, ai !== w.correct ? w.answers[w.correct] : null);
      };
      offConf = R.ui.keys((e) => { if (/^[1-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && order[+e.key - 1] != null) pick(order[+e.key - 1]); });
      box.scrollIntoView && box.scrollIntoView({ block: 'nearest' });
    }

    // ── 4. Enregistrement + feedback explicatif
    function finalize(whyWrong, whyAnswer) {
      const outcome = SES.outcomeOf(res, conf, hintUsed, whyWrong);
      const before = sess.queue.length;
      if (!preview) {
        SES.answer(week, state, sess, { outcome, conf, hint: hintUsed });
        sess.pos++;
        app.save();
      }
      const retryScheduled = !preview && sess.queue.length > before;
      showFeedback(outcome, whyWrong, whyAnswer, retryScheduled);
    }

    function showFeedback(outcome, whyWrong, whyAnswer, retryScheduled) {
      panel.innerHTML = '';
      const ok = res.correct;
      const cls = !ok ? 'no' : outcome === 'solid' ? 'ok' : 'ok shaky';
      const box = el('div', { class: 'fb ' + cls, role: 'status' });
      const isProof = item.type === 'proof';
      box.append(el('div', { class: 'fb-title' }, ok ? (isProof ? '✓ Démonstration réussie.' : '✓ Exact.') : 'Pas encore.'));

      if (ok) {
        if (outcome === 'shaky') {
          let why = 'Juste, mais fragile : cette notion reviendra.';
          if (res.partial) why = 'Juste, avec une hésitation : cette notion reviendra.';
          else if (conf === 'guess') why = 'Tu avais deviné : c’est juste, mais on la retravaille bientôt.';
          else if (conf === 'unsure') why = 'Juste, mais tu n’étais pas totalement sûr(e) : elle reviendra.';
          else if (hintUsed) why = 'Juste, avec un indice : elle reviendra.';
          else if (whyWrong) why = 'La réponse est juste, mais pas la raison : relis l’explication.';
          box.append(el('p', { class: 'fb-meta' }, why));
        }
        if (res.note) box.append(el('p', { class: 'fb-note', html: rich(res.note) }));
        if (whyWrong && whyAnswer) box.append(el('p', null, 'Le « pourquoi » attendu : ', el('b', null, whyAnswer)));
        const full = item.explanation || '';
        const short = item.short || firstSentence(full);
        box.append(el('p', { class: 'fb-text', html: rich(short) }));
        if (full && full.startsWith(short) && full.length > short.length + 2) {
          box.append(el('details', { class: 'more' }, el('summary', null, 'En savoir plus'), el('p', { html: rich(full.slice(short.length).trim()) })));
        }
      } else {
        if (res.note) box.append(el('p', { class: 'fb-note', html: rich(res.note) }));
        if (res.feedback) box.append(el('p', { class: 'fb-text', html: rich(res.feedback) }));
        if (res.correctList) {
          box.append(el('div', { class: 'fb-label' }, item.type === 'match' ? 'Les bonnes associations' : 'Le bon ordre'),
            el(item.type === 'match' ? 'ul' : 'ol', { class: 'fb-list' }, res.correctList.map((t) => el('li', { html: rich(t) }))));
        } else if (res.correctText) {
          box.append(el('p', { class: 'fb-answer' }, 'Bonne réponse : ', el('b', { html: rich(res.correctText) })));
        }
        box.append(el('p', { class: 'fb-text', html: rich(item.explanation || '') }));
        if (conf === 'sure') box.append(el('p', { class: 'fb-meta' }, 'Tu étais sûr(e) : c’est justement ce genre d’erreur qu’il est utile de repérer.'));
      }

      if (!preview) {
        const sst = state.skills[skill.id];
        const stt = M.status(sst);
        let when = M.dueLabel(sst, R.util.now());
        if (outcome === 'fail') when = retryScheduled ? 'elle revient dans quelques questions' : 'elle reviendra à la prochaine session';
        else if (outcome === 'shaky') when = retryScheduled ? 'elle revient plus tard dans la session' : 'elle reviendra à la prochaine session';
        box.append(el('div', { class: 'skill-pill' }, R.ui.dot(stt) + ' ' + skill.label + ' · ' + when));
      }
      panel.append(box);

      const last = sess.pos >= sess.queue.length;
      ctl.setAction(last ? 'Terminer' : 'Continuer', next, false);
      action.focus({ preventScroll: true });
      main.scrollTop = main.scrollHeight;
      box.scrollIntoView && box.scrollIntoView({ block: 'nearest' });
    }

    // ── Cartes auto-évaluées (flashcard, speaking) : pas de feedback supplémentaire
    function onSelf(level) {
      if (answered) return;
      answered = true;
      const map = { easy: ['solid', 'sure', true], hesitant: ['shaky', 'unsure', true], hard: ['fail', 'unsure', false] };
      let [outcome, c] = map[level];
      if (hintUsed && outcome === 'solid') outcome = 'shaky';
      res = { correct: outcome !== 'fail' };
      const before = sess.queue.length;
      if (!preview) {
        SES.answer(week, state, sess, { outcome, conf: c, hint: hintUsed });
        sess.pos++;
        app.save();
      }
      panel.innerHTML = '';
      ctl.clearAction();
      const msg = level === 'easy' ? '🟢 Noté : bien récupéré.' : level === 'hesitant' ? '🟠 Noté : ça reviendra pour consolider.' : '🔴 Noté : on y revient bientôt.';
      panel.append(el('div', { class: 'fb self ' + (outcome === 'fail' ? 'no' : outcome === 'shaky' ? 'ok shaky' : 'ok'), role: 'status' },
        el('div', { class: 'fb-title' }, msg),
        !preview && sess.queue.length > before ? el('p', { class: 'fb-meta' }, 'Une variante reviendra dans la session.') : null));
      timer = setTimeout(next, 750);
    }

    function next() {
      if (preview) { location.hash = '#/'; return; }
      if (sess.pos >= sess.queue.length) return finish();
      renderQuestion();
    }

    function finish() {
      cleanQuestion();
      if (preview) { location.hash = '#/'; return; }
      state.lastSummary = SES.summarize(week, state, sess);
      state.session = null;
      app.save();
      location.hash = '#/fin';
    }

    renderQuestion();
    R.debug = R.debug || {};
    R.debug.current = () => ({ inst, ctl, item, sess });

    // Nettoyage à la sortie de la vue
    const api = function () { cleanQuestion(); offEnter(); };
    api.ctl = ctl;
    return api;
  };
})((window.R = window.R || {}));
