/* SpeakingCard — cartes d'expression orale (30 s), sans enregistrement.
 *   mode "think" (A01) : 30 s pour construire mentalement -> aide (structures) -> auto-évaluation
 *   mode "speak" (A03) : 30 s à voix haute -> auto-évaluation
 * Un seul chrono actif à la fois (nettoyé à chaque changement d'étape). */
(function (R) {
  'use strict';
  const { el, rich } = R.util;
  const SECONDS = 30;

  R.components.register('SpeakingCard', 'speaking', {
    mount(host, item, ctl) {
      const think = item.mode === 'think';
      const seconds = item.seconds || SECONDS;
      let timerId = null, assess = null, stage = 0;
      const stop = () => { if (timerId) { clearInterval(timerId); timerId = null; } };

      const head = el('div', { class: 'speak-head' }, think ? '💭 EXPRESSION RAPIDE' : '🎙️ SPEAK FOR 30 SECONDS');
      host.append(head, R.ui.promptEl(item.prompt, 'card en'));
      const zone = el('div', { class: 'speak-zone' });
      host.append(zone);

      function intro() {
        stage = 0; zone.innerHTML = '';
        zone.append(el('div', { class: 'nudge' }, think ? 'Tu as 30 secondes pour construire ta réponse dans ta tête.' : 'Parle 30 secondes, à voix haute. Pas besoin d’enregistrer.'));
        ctl.setAction('▶ Démarrer les 30 secondes', start, false);
      }

      function start() {
        stage = 1; stop(); zone.innerHTML = '';
        const R_ = 46, C = 2 * Math.PI * R_;
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 110 110'); svg.setAttribute('class', 'ring'); svg.setAttribute('aria-hidden', 'true');
        const bg = document.createElementNS(svgNS, 'circle');
        ['cx', 'cy'].forEach((a) => bg.setAttribute(a, 55)); bg.setAttribute('r', R_); bg.setAttribute('class', 'ring-bg');
        const fg = document.createElementNS(svgNS, 'circle');
        ['cx', 'cy'].forEach((a) => fg.setAttribute(a, 55)); fg.setAttribute('r', R_); fg.setAttribute('class', 'ring-fg');
        fg.setAttribute('stroke-dasharray', C); fg.setAttribute('stroke-dashoffset', 0);
        fg.setAttribute('transform', 'rotate(-90 55 55)');
        svg.append(bg, fg);
        const num = el('div', { class: 'ring-num', 'aria-live': 'off' }, String(seconds));
        zone.append(el('div', { class: 'ring-wrap' }, svg, num));
        const end = R.util.now() + seconds * 1000;
        const tick = () => {
          const left = Math.max(0, end - R.util.now());
          num.textContent = String(Math.ceil(left / 1000));
          fg.setAttribute('stroke-dashoffset', String(C * (1 - left / (seconds * 1000))));
          if (left <= 0) finishTimer();
        };
        timerId = setInterval(tick, 200);
        tick();
        ctl.setAction('Passer le chrono', finishTimer, false);
      }

      function finishTimer() {
        stop();
        if (think && !ctl.challenge) helpStage(); else assessStage();
      }

      function helpStage() {
        stage = 2; zone.innerHTML = '';
        zone.append(el('div', { class: 'help-box' }, el('div', { class: 'help-title' }, 'Pour t’aider, quelques structures :'),
          el('ul', null, (item.help || []).map((h) => el('li', { html: rich(h) })))));
        zone.append(el('div', { class: 'nudge' }, 'Dis maintenant ta réponse à voix haute, en t’appuyant (ou pas) sur ces débuts de phrases.'));
        ctl.setAction('J’ai formulé ma réponse', assessStage, false);
      }

      function assessStage() {
        stop(); stage = 3; zone.innerHTML = '';
        ctl.clearAction();
        if (item.explanation) zone.append(el('div', { class: 'back-note', html: rich(item.explanation) }));
        assess = R.components.SelfAssessment.mount(host, { set: 'speak', title: 'Comment ça s’est passé ?' }, (lv) => ctl.selfAssess(lv));
        const a = host.querySelector('.assess');
        if (a && a.scrollIntoView) a.scrollIntoView({ block: 'nearest' });
      }

      intro();
      return {
        reveal() {},
        destroy() { stop(); if (assess) assess.destroy(); },
        auto(wantCorrect) { finishTimer(); if (stage !== 3) assessStage(); assess.auto(wantCorrect ? 'easy' : 'hard'); },
        _stage: () => stage,
        _skipTo: (s) => { if (s === 1) start(); else if (s === 2) helpStage(); else if (s === 3) assessStage(); },
      };
    },
  });
})((window.R = window.R || {}));
