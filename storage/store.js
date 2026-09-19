/* storage/store.js — progression locale (localStorage, avec repli mémoire).
 * Aucun compte, aucun serveur, aucune donnée envoyée. */
(function (R) {
  'use strict';
  const mem = {};
  let persistent = true;

  function lsGet(k) {
    try { return window.localStorage.getItem(k); } catch (e) { persistent = false; return mem[k] || null; }
  }
  function lsSet(k, v) {
    try { window.localStorage.setItem(k, v); } catch (e) { persistent = false; mem[k] = v; }
  }
  function lsDel(k) {
    try { window.localStorage.removeItem(k); } catch (e) { persistent = false; }
    delete mem[k];
  }

  function blank() {
    return { v: 1, skills: {}, items: {}, history: {}, session: null, lastSummary: null, createdAt: R.util.now() };
  }

  R.store = {
    key: (weekKey) => 'revisions:' + weekKey,
    isPersistent() {
      // vérifie réellement l'écriture
      try { window.localStorage.setItem('__t', '1'); window.localStorage.removeItem('__t'); } catch (e) { persistent = false; }
      return persistent;
    },
    load(weekKey) {
      const raw = lsGet(this.key(weekKey));
      if (!raw) return blank();
      try {
        const s = JSON.parse(raw);
        if (!s || s.v !== 1) return blank();
        return Object.assign(blank(), s);
      } catch (e) { return blank(); }
    },
    save(weekKey, state) {
      lsSet(this.key(weekKey), JSON.stringify(state));
    },
    reset(weekKey) {
      lsDel(this.key(weekKey));
      return blank();
    },
  };
})((window.R = window.R || {}));
