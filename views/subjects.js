/* views/subjects.js — choix d'une matière, détail d'une matière, points faibles */
(function (R) {
  'use strict';
  const { el } = R.util;
  const M = R.mastery;

  // Bloc « matière » réutilisé par « Mes progrès » et le détail d'une matière
  R.views.subjectBlock = function (subj, opts) {
    opts = opts || {};
    const { week, state } = R.app;
    const now = R.util.now();
    const st = M.summarize(week, state, now, (s) => s.subject === subj.id);
    const pct = Math.round(st.progress * 100);
    const block = el('section', { class: 'card sblock', style: '--accent:' + subj.color });
    block.append(el('div', { class: 'sblock-head' },
      el('span', { class: 'ico' }, subj.icon),
      el('h2', null, subj.label + ' — ' + pct + ' %')));
    block.append(R.ui.bar(pct, subj.color));

    week.modules.filter((m) => m.subject === subj.id).forEach((mod) => {
      const skills = week.skills.filter((s) => s.module === mod.id);
      const status = M.groupStatus(week, state, skills.map((s) => s.id));
      const open = !!(opts.openAll);
      const row = el('div', { class: 'mod' });
      const head = el('button', { class: 'mod-head', type: 'button', 'aria-expanded': String(open) },
        el('span', { class: 'dot' }, R.ui.dot(status)),
        el('span', { class: 'mod-name' }, mod.label),
        el('span', { class: 'chev' }, '›'));
      const list = el('div', { class: 'mod-list' });
      list.hidden = !open;
      skills.forEach((s) => {
        const sst = state.skills[s.id];
        list.append(el('button', { class: 'skill-row', type: 'button', onclick: () => R.app.startSession('skill', { skillIds: [s.id], n: 5, title: s.label }) },
          el('span', { class: 'dot' }, R.ui.dot(M.status(sst))),
          el('span', { class: 'skill-name' }, s.label),
          el('span', { class: 'skill-due' }, M.dueLabel(sst, now)),
          el('span', { class: 'go' }, '▶')));
      });
      list.append(el('button', { class: 'btn ghost sm', type: 'button', onclick: () => R.app.startSession('skill', { skillIds: skills.map((s) => s.id), n: 8, title: mod.label }) }, 'Réviser ce module'));
      head.addEventListener('click', () => {
        list.hidden = !list.hidden;
        head.setAttribute('aria-expanded', String(!list.hidden));
        row.classList.toggle('open', !list.hidden);
      });
      if (open) row.classList.add('open');
      row.append(head, list);
      block.append(row);
    });
    return block;
  };

  R.views.subjects = function (root) {
    const { week, state } = R.app;
    const wrap = el('div', { class: 'view' }, R.views.topbar('Réviser une matière'));
    wrap.append(el('div', { class: 'subj-list' }, week.subjects.map((s) => {
      const st = M.summarize(week, state, R.util.now(), (x) => x.subject === s.id);
      const pct = Math.round(st.progress * 100);
      return el('a', { class: 'subj-row', href: '#/matiere/' + s.id, style: '--accent:' + s.color },
        el('span', { class: 'ico' }, s.icon),
        el('span', { class: 'col' }, el('span', { class: 'nm' }, s.label), R.ui.bar(pct, s.color)),
        el('span', { class: 'pc' }, pct + ' %'));
    })));
    root.append(wrap);
  };

  R.views.subject = function (root, params) {
    const { week } = R.app;
    const subj = week._idx.subject[params[0]];
    if (!subj) { location.hash = '#/matieres'; return; }
    const wrap = el('div', { class: 'view', style: '--accent:' + subj.color }, R.views.topbar(subj.icon + ' ' + subj.label, '#/matieres'));
    wrap.append(el('button', { class: 'cta small', type: 'button', onclick: () => R.app.startSession('subject', { subject: subj.id, title: subj.label }) },
      el('span', { class: 'cta-main' }, 'Réviser ' + subj.label), el('span', { class: 'cta-sub' }, '≈ 5–8 min · questions variées')));
    wrap.append(R.views.subjectBlock(subj, { openAll: false }));
    root.append(wrap);
  };

  // ───────── Mes points faibles ─────────
  R.views.weak = function (root) {
    const { week, state } = R.app;
    const now = R.util.now();
    const weak = week.skills.filter((s) => M.isWeak(state.skills[s.id], now))
      .sort((a, b) => (M.status(state.skills[a.id]) === 'red' ? 0 : 1) - (M.status(state.skills[b.id]) === 'red' ? 0 : 1));
    const wrap = el('div', { class: 'view' }, R.views.topbar('Mes points faibles'));
    if (!weak.length) {
      wrap.append(el('div', { class: 'card empty' }, el('b', null, 'Rien à signaler pour l’instant ✓'),
        el('p', { class: 'muted' }, 'Ici apparaissent les notions échouées, réussies avec hésitation, ou échouées puis réussies récemment.'),
        el('a', { class: 'btn primary', href: '#/' }, 'Retour à l’accueil')));
      root.append(wrap); return;
    }
    wrap.append(el('button', { class: 'cta small', type: 'button', onclick: () => R.app.startSession('weak', { skillIds: weak.map((s) => s.id), title: 'Mes points faibles', n: 10 }) },
      el('span', { class: 'cta-main' }, '🔴 Réviser mes points faibles'), el('span', { class: 'cta-sub' }, weak.length + ' notion' + (weak.length > 1 ? 's' : ''))));
    const list = el('div', { class: 'card list' });
    weak.forEach((s) => {
      const subj = week._idx.subject[s.subject];
      const st = state.skills[s.id];
      list.append(el('button', { class: 'skill-row big', type: 'button', style: '--accent:' + subj.color, onclick: () => R.app.startSession('skill', { skillIds: [s.id], n: 5, title: s.label }) },
        el('span', { class: 'dot' }, R.ui.dot(M.status(st))),
        el('span', { class: 'col' }, el('span', { class: 'skill-name' }, subj.icon + ' ' + s.label), el('span', { class: 'skill-due' }, M.weakReason(st, now))),
        el('span', { class: 'go' }, '▶')));
    });
    wrap.append(list);
    root.append(wrap);
  };
})((window.R = window.R || {}));
