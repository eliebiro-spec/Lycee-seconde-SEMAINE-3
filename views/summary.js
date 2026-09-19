/* views/summary.js — fin de session · views/progress.js — Mes progrès · Ce que j'ai travaillé */
(function (R) {
  'use strict';
  const { el, DAY } = R.util;
  const M = R.mastery;

  R.views.summary = function (root) {
    const { week, state } = R.app;
    const s = state.lastSummary;
    if (!s) { location.hash = '#/'; return; }
    const now = R.util.now();
    const wrap = el('div', { class: 'view summary' });
    wrap.append(el('div', { class: 'sum-head' }, el('div', { class: 'check' }, '✓'), el('h1', null, 'Session terminée ✓'),
      el('p', { class: 'sum-big' }, s.notions + ' notion' + (s.notions > 1 ? 's' : '') + ' récupérée' + (s.notions > 1 ? 's' : ''))));
    wrap.append(el('div', { class: 'card ind3' },
      el('div', { class: 'ind' }, el('span', { class: 'n' }, '🟢 ' + s.green), el('span', { class: 'l' }, 'solide' + (s.green > 1 ? 's' : ''))),
      el('div', { class: 'ind' }, el('span', { class: 'n' }, '🟠 ' + s.orange), el('span', { class: 'l' }, 'à consolider')),
      el('div', { class: 'ind' }, el('span', { class: 'n' }, '🔴 ' + s.red), el('span', { class: 'l' }, 'à réactiver'))));

    if (s.priority.length) {
      const list = el('ul', { class: 'prio' });
      s.priority.forEach((id) => {
        const sk = week._idx.skill[id], sub = week._idx.subject[sk.subject];
        list.append(el('li', { style: '--accent:' + sub.color }, el('span', { class: 'dot' }, R.ui.dot(M.status(state.skills[id]))), el('span', null, el('b', null, sub.short), ' — ' + R.util.lowerFirst(sk.label))));
      });
      wrap.append(el('section', { class: 'card' }, el('h2', { class: 'h2' }, 'À revoir en priorité'), list));
    } else {
      wrap.append(el('section', { class: 'card' }, el('p', { class: 'muted' }, 'Tout ce que tu as récupéré est solide. Les notions reviendront à intervalles espacés pour vérifier qu’elles tiennent.')));
    }

    const streak = M.dayStreak(state, now);
    const today = (state.history[R.util.dayKey(now)] || { count: 0 }).count;
    const bits = [];
    if (today) bits.push('⚡ ' + today + ' réactivation' + (today > 1 ? 's' : '') + ' aujourd’hui');
    if (streak) bits.push('🔥 ' + streak + ' jour' + (streak > 1 ? 's' : '') + ' de suite');
    if (bits.length) wrap.append(el('p', { class: 'sum-line' }, bits.join('  ·  ')));
    if (s.nextDue) {
      const d = Math.ceil((s.nextDue - now) / DAY);
      wrap.append(el('p', { class: 'sum-line muted' }, 'Prochaine réactivation conseillée : ' + (d <= 0 ? 'dès maintenant.' : d === 1 ? 'demain.' : 'dans ' + d + ' jours.')));
    }

    const actions = el('div', { class: 'sum-actions' });
    actions.append(el('a', { class: 'btn primary', href: '#/' }, 'Terminer'));
    if (s.errorSkillIds.length) {
      actions.append(el('button', { class: 'btn ghost', type: 'button', onclick: () => R.app.startSession('errors', { skillIds: s.errorSkillIds, n: 8, title: 'Réactiver mes erreurs' }) }, 'Réactiver mes erreurs maintenant'));
    }
    wrap.append(actions);
    root.append(wrap);
  };

  // ───────── Mes progrès ─────────
  R.views.progress = function (root) {
    const { week, state } = R.app;
    const now = R.util.now();
    const wrap = el('div', { class: 'view' }, R.views.topbar('Mes progrès'));
    const all = M.summarize(week, state, now);
    const streak = M.dayStreak(state, now);
    const total = M.totalReactivations(state);

    wrap.append(el('div', { class: 'card stats3' },
      el('div', null, el('b', { class: 'big' }, '🔥 ' + streak), el('span', { class: 'l' }, 'jour' + (streak > 1 ? 's' : '') + ' de suite')),
      el('div', null, el('b', { class: 'big' }, '⚡ ' + total), el('span', { class: 'l' }, 'réactivation' + (total > 1 ? 's' : ''))),
      el('div', null, el('b', { class: 'big' }, '🧠 ' + all.green), el('span', { class: 'l' }, 'consolidée' + (all.green > 1 ? 's' : '')))));

    week.subjects.forEach((s) => wrap.append(R.views.subjectBlock(s, { openAll: false })));

    // Historique
    const hist = el('section', { class: 'card' }, el('h2', { class: 'h2' }, 'Historique'));
    const days = Object.keys(state.history).sort().reverse().slice(0, 7);
    if (!days.length) hist.append(el('p', { class: 'muted' }, 'Ton historique apparaîtra après ta première réactivation.'));
    const fmt = (k) => {
      if (k === R.util.dayKey(now)) return 'Aujourd’hui';
      if (k === R.util.dayKey(now - DAY)) return 'Hier';
      const [y, m, d] = k.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    };
    days.forEach((k) => hist.append(el('div', { class: 'hist-row' }, el('span', null, fmt(k)), el('b', null, state.history[k].count + ' réactivation' + (state.history[k].count > 1 ? 's' : '')))));
    wrap.append(hist);

    wrap.append(el('button', { class: 'btn danger-ghost', type: 'button', onclick: () => R.app.resetAll() }, 'Réinitialiser ma progression'));
    root.append(wrap);
  };

  // ───────── Ce que j'ai travaillé ─────────
  R.views.worked = function (root) {
    const { week } = R.app;
    const wrap = el('div', { class: 'view' }, R.views.topbar('Ce que j’ai travaillé'));
    wrap.append(el('p', { class: 'lead' }, 'Cette semaine · ' + week.levelLabel));
    week.worked.forEach((w) => {
      const s = week._idx.subject[w.subject];
      wrap.append(el('section', { class: 'card worked', style: '--accent:' + s.color }, el('h2', null, s.icon + ' ' + s.label), el('p', null, w.text)));
    });
    wrap.append(el('footer', { class: 'foot' }, 'Propulsé par Elie Biro'));
    root.append(wrap);
  };

  // ───────── Aperçu d'une question (développement / tests) : #/dev/<id>[/ask] ─────────
  R.views.preview = function (root, params) {
    const { week } = R.app;
    const item = week._idx.item[params[0]];
    if (!item) { location.hash = '#/'; return; }
    const session = { mode: 'preview', title: 'Aperçu', challenge: false, pos: 0, answered: [], retries: {}, shakyRetries: {}, queue: [{ itemId: item.id, skillId: item.skill, subject: item.subject, ask: params[1] === 'ask', retry: false }] };
    return R.views.session(root, [], { session });
  };
})((window.R = window.R || {}));
