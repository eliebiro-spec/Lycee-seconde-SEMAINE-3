/* views/home.js — écran d'accueil */
(function (R) {
  'use strict';
  const { el, DAY } = R.util;
  const M = R.mastery;

  function subjectStats(week, state, subjectId) {
    return M.summarize(week, state, R.util.now(), (s) => s.subject === subjectId);
  }

  R.views.subjectCard = function (week, state, subj) {
    const st = subjectStats(week, state, subj.id);
    const pct = Math.round(st.progress * 100);
    return el('a', { class: 'subj-card', href: '#/matiere/' + subj.id, style: '--accent:' + subj.color, 'aria-label': subj.label + ', ' + pct + ' %' },
      el('span', { class: 'ico' }, subj.icon),
      el('span', { class: 'nm' }, subj.label),
      R.ui.bar(pct, subj.color),
      el('span', { class: 'pc' }, pct + ' %'));
  };

  R.views.home = function (root) {
    const app = R.app, week = app.week, state = app.state;
    const now = R.util.now();
    const all = M.summarize(week, state, now);
    const pct = Math.round(all.progress * 100);
    const attempts = Object.values(state.skills).reduce((a, s) => a + s.attempts, 0);
    const streak = M.dayStreak(state, now);
    const weak = week.skills.filter((s) => M.isWeak(state.skills[s.id], now));
    const due = week.skills
      .filter((s) => M.isDue(state.skills[s.id], now))
      .sort((a, b) => ({ red: 0, orange: 1, green: 2 }[M.status(state.skills[a.id])] - { red: 0, orange: 1, green: 2 }[M.status(state.skills[b.id])]));

    const wrap = el('div', { class: 'view home' });

    // En-tête
    wrap.append(el('header', { class: 'home-head' },
      el('div', null,
        el('h1', { class: 'home-title' }, el('span', null, week.title), el('span', { class: 'week' }, week.weekLabel)),
        el('p', { class: 'home-sub' }, week.levelLabel)),
      streak > 0 ? el('div', { class: 'streak', title: 'Jours consécutifs de réactivation' }, '🔥 ', el('b', null, String(streak)), streak > 1 ? ' jours' : ' jour') : null));

    if (!app.persistent) wrap.append(el('div', { class: 'warn' }, 'Ton navigateur bloque l’enregistrement : la progression ne sera pas conservée à la fermeture (essaie hors navigation privée).'));

    // Disciplines
    wrap.append(el('div', { class: 'subj-grid' }, week.subjects.map((s) => R.views.subjectCard(week, state, s))));

    // Progression + indicateurs
    wrap.append(el('section', { class: 'card progress-card', 'aria-label': 'Progression de la semaine' },
      el('div', { class: 'row-between' }, el('span', { class: 'lbl' }, 'Progression de la semaine'), el('b', { class: 'big' }, pct + ' %')),
      R.ui.bar(pct),
      el('div', { class: 'ind3' },
        el('div', { class: 'ind' }, el('span', { class: 'n' }, '🟢 ' + all.green), el('span', { class: 'l' }, 'Acquis')),
        el('div', { class: 'ind' }, el('span', { class: 'n' }, '🟠 ' + all.orange), el('span', { class: 'l' }, 'À consolider')),
        el('div', { class: 'ind' }, el('span', { class: 'n' }, '🔴 ' + all.red), el('span', { class: 'l' }, 'À réactiver'))),
      all.new ? el('div', { class: 'newline' }, '⚪ ' + all.new + ' notion' + (all.new > 1 ? 's' : '') + ' à découvrir') : null));

    // Session en cours ?
    if (state.session) {
      const s = state.session;
      wrap.append(el('section', { class: 'card resume' },
        el('div', null, el('b', null, 'Session en cours'), el('div', { class: 'muted' }, s.title + ' · ' + Math.min(s.pos + 1, s.queue.length) + '/' + s.queue.length)),
        el('div', { class: 'resume-btns' },
          el('button', { class: 'btn primary sm', type: 'button', onclick: () => { location.hash = '#/session'; } }, 'Reprendre'),
          el('button', { class: 'btn ghost sm', type: 'button', onclick: async () => {
            if (await R.ui.confirm({ title: 'Abandonner cette session ?', text: 'Les réponses déjà données restent comptées dans ta progression.', ok: 'Abandonner', cancel: 'Garder', danger: true })) { state.session = null; app.save(); R.router.render(); }
          } }, 'Abandonner'))));
    }

    // Que risques-tu d'oublier ?
    let msg;
    if (!attempts) {
      msg = el('div', { class: 'recap' }, el('b', null, 'Première réactivation'), el('span', null, 'On fait le point sur ce que tu as vraiment étudié cette semaine.'));
    } else if (due.length) {
      const names = due.slice(0, 3).map((s) => s.label);
      msg = el('div', { class: 'recap due' }, el('b', null, 'À récupérer maintenant'),
        el('span', null, names.join(' · ') + (due.length > 3 ? ' · +' + (due.length - 3) : '')));
    } else {
      const dues = week.skills.map((s) => state.skills[s.id]).filter((x) => x && x.dueAt).map((x) => x.dueAt);
      const next = dues.length ? Math.ceil((Math.min.apply(null, dues) - now) / DAY) : 0;
      msg = el('div', { class: 'recap ok' }, el('b', null, 'Tout est à jour ✓'), el('span', null, 'Prochaine réactivation conseillée ' + (next <= 1 ? 'demain.' : 'dans ' + next + ' jours.')));
    }
    wrap.append(msg);

    // Bouton principal
    const startExpress = () => app.startSession('express');
    wrap.append(el('button', { class: 'cta', type: 'button', onclick: startExpress },
      el('span', { class: 'cta-main' }, '⚡ Réactivation express'),
      el('span', { class: 'cta-sub' }, '5–10 min · recommandé')));

    // Autres modes
    const startMode = (mode, opts) => app.startSession(mode, opts);
    wrap.append(el('div', { class: 'modes' },
      el('a', { class: 'mode', href: '#/matieres' }, el('span', { class: 'mi' }, '🎯'), el('span', null, 'Réviser une matière')),
      el('a', { class: 'mode', href: '#/faibles' }, el('span', { class: 'mi' }, '🔴'), el('span', null, 'Mes points faibles'), weak.length ? el('span', { class: 'badge' }, String(weak.length)) : null),
      el('button', { class: 'mode', type: 'button', onclick: () => startMode('challenge') }, el('span', { class: 'mi' }, '🧠'), el('span', null, 'Défi mémoire'), el('span', { class: 'mode-sub' }, 'sans indice')),
      el('a', { class: 'mode', href: '#/progres' }, el('span', { class: 'mi' }, '📊'), el('span', null, 'Mes progrès'))));

    wrap.append(el('div', { class: 'home-links' }, el('a', { href: '#/travail' }, 'Ce que j’ai travaillé cette semaine')));
    wrap.append(el('footer', { class: 'foot' }, 'Propulsé par Elie Biro'));
    root.append(wrap);
  };
})((window.R = window.R || {}));
