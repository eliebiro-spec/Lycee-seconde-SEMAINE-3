/* views/router.js — routeur minimal par hash + état applicatif. */
(function (R) {
  'use strict';
  const { el } = R.util;
  R.views = {};

  const app = {
    week: null, state: null,
    init() {
      app.week = R.data.current();
      app.state = R.store.load(app.week.key);
      app.persistent = R.store.isPersistent();
    },
    save() { R.store.save(app.week.key, app.state); },
    reload() { app.state = R.store.load(app.week.key); },

    // Lance une session (demande confirmation si une session est déjà en pause)
    async startSession(mode, opts) {
      if (app.state.session && !(opts && opts.replace)) {
        const ok = await R.ui.confirm({ title: 'Remplacer la session en cours ?', text: 'Ta session en pause sera abandonnée (tes réponses déjà données restent comptées).', ok: 'Nouvelle session', cancel: 'Annuler' });
        if (!ok) return false;
      }
      const sess = R.session.create(app.week, app.state, mode, opts);
      if (!sess) return false;
      app.state.session = sess;
      app.save();
      location.hash = '#/session';
      return true;
    },

    async resetAll() {
      const ok = await R.ui.confirm({
        title: 'Réinitialiser ma progression ?',
        text: 'Toute ta progression (notions, historique, série) sera effacée sur cet appareil. Cette action est définitive.',
        ok: 'Tout effacer', cancel: 'Annuler', danger: true,
      });
      if (!ok) return false;
      app.state = R.store.reset(app.week.key);
      app.save();
      const same = location.hash === '#/' || location.hash === '';
      location.hash = '#/';
      if (same) R.router.render();
      return true;
    },
  };
  R.app = app;

  const ROUTES = {
    '': 'home', home: 'home', matieres: 'subjects', matiere: 'subject', session: 'session',
    fin: 'summary', progres: 'progress', travail: 'worked', faibles: 'weak', dev: 'preview',
  };

  let cleanup = null;
  R.router = {
    render() {
      const root = document.getElementById('view');
      if (cleanup) { try { cleanup(); } catch (e) { /* ignore */ } cleanup = null; }
      root.innerHTML = '';
      const parts = (location.hash || '#/').replace(/^#\/?/, '').split('/');
      const name = ROUTES[parts[0]] || 'home';
      const view = R.views[name];
      document.body.dataset.view = name;
      const ret = view(root, parts.slice(1));
      if (typeof ret === 'function') cleanup = ret;
      if (name !== 'session') window.scrollTo(0, 0);
    },
    start() {
      window.addEventListener('hashchange', R.router.render);
      R.router.render();
    },
  };

  // Petits blocs partagés
  R.views.topbar = function (title, backHref) {
    return el('div', { class: 'topbar' },
      el('a', { class: 'icon-btn', href: backHref || '#/', 'aria-label': 'Retour' }, '←'),
      el('h1', { class: 'topbar-title' }, title));
  };
})((window.R = window.R || {}));
