/* engine/mastery.js — état de maîtrise + répétition espacée légère.
 *
 * Résultat d'une réponse ("outcome") :
 *   fail  : erreur                                  -> 🔴 revient vite
 *   shaky : juste mais hésitant / deviné / indice   -> 🟠 revient à la prochaine session
 *   solid : juste et sûr(e), sans aide              -> espacement : +2 j, +4 j, +7 j
 *
 * Statut d'une microcompétence :
 *   new    : jamais vue
 *   red    : dernière réponse fausse
 *   orange : dernière réponse fragile, OU une seule récupération sûre
 *   green  : au moins deux récupérations sûres ESPACÉES (≥ ~1 jour d'écart)
 * Une seule bonne réponse ne suffit donc jamais à « acquérir » une notion.
 */
(function (R) {
  'use strict';
  const U = R.util;
  const DAY = U.DAY;
  const SPACING_MS = 18 * 3600 * 1000; // deux réussites comptent comme "espacées" à partir de 18 h d'écart
  const INTERVAL_DAYS = { 1: 2, 2: 4, 3: 7 };

  function blank() {
    return {
      attempts: 0, successes: 0, errors: 0,
      lastAttempt: null, lastConfidence: null, lastSuccessNoHelp: null,
      lastOutcome: null, streak: 0, streakAt: null, dueAt: null,
      everFailed: false, lastFailAt: null, overconfident: 0, guessed: 0,
    };
  }

  const M = {
    blank,

    status(st) {
      if (!st || !st.attempts) return 'new';
      if (st.lastOutcome === 'fail') return 'red';
      if (st.lastOutcome === 'shaky') return 'orange';
      return st.streak >= 2 ? 'green' : 'orange';
    },

    // Score 0..1 utilisé pour les pourcentages de progression
    score(st) {
      const s = M.status(st);
      if (s === 'new') return 0;
      if (s === 'red') return 0.1;
      if (s === 'orange') return st.lastOutcome === 'shaky' ? 0.3 : 0.5;
      return st.streak >= 3 ? 1 : 0.85;
    },

    isDue(st, now) {
      return !!(st && st.attempts && st.dueAt != null && st.dueAt <= now);
    },

    // Notions à ne pas laisser dormir : rouges / hésitantes / échues
    isWeak(st, now) {
      if (!st || !st.attempts) return false;
      const s = M.status(st);
      if (s === 'red') return true;
      if (st.lastOutcome === 'shaky') return true;
      if (st.everFailed && st.lastFailAt && now - st.lastFailAt < 7 * DAY && s !== 'red') return true; // échouée puis réussie récemment
      return false;
    },

    weakReason(st, now) {
      const s = M.status(st);
      if (s === 'red') return 'Échouée';
      if (st.lastOutcome === 'shaky') return st.lastConfidence === 'guess' ? 'Réussie au hasard' : 'Réussie avec hésitation';
      return 'Échouée puis réussie récemment';
    },

    record(state, skillId, itemId, outcome, extra, now) {
      extra = extra || {};
      const st = state.skills[skillId] || (state.skills[skillId] = blank());
      st.attempts++;
      st.lastAttempt = now;
      st.lastOutcome = outcome;
      if (extra.conf) st.lastConfidence = extra.conf;

      if (outcome === 'fail') {
        st.errors++;
        st.streak = 0; st.streakAt = null;
        st.everFailed = true; st.lastFailAt = now;
        st.dueAt = now;
        if (extra.conf === 'sure') st.overconfident++;
      } else {
        st.successes++;
        if (outcome === 'shaky') {
          if (extra.conf === 'guess') st.guessed++;
          st.streak = Math.max(0, st.streak - 1);
          if (st.streak === 0) st.streakAt = null;
          st.dueAt = now; // à la prochaine session
        } else {
          st.lastSuccessNoHelp = now;
          if (st.streak === 0 || st.streakAt == null || now - st.streakAt >= SPACING_MS) {
            st.streak++;
            st.streakAt = now;
          }
          const days = INTERVAL_DAYS[Math.min(st.streak, 3)];
          st.dueAt = Math.max(st.dueAt && st.dueAt > now ? st.dueAt : 0, now + days * DAY);
        }
      }

      // mémoire par item (pour varier les questions)
      const it = state.items[itemId] || (state.items[itemId] = { seen: 0, last: null, ok: 0 });
      it.seen++; it.last = now;
      if (outcome !== 'fail') it.ok++;

      // historique quotidien
      const dk = U.dayKey(now);
      const h = state.history[dk] || (state.history[dk] = { count: 0, ok: 0 });
      h.count++;
      if (outcome !== 'fail') h.ok++;
      return st;
    },

    // Série de jours consécutifs avec au moins une réactivation
    dayStreak(state, now) {
      let n = 0;
      let t = now;
      if (!state.history[U.dayKey(t)]) t -= DAY; // pas encore aujourd'hui : on regarde depuis hier
      while (state.history[U.dayKey(t)]) { n++; t -= DAY; }
      return n;
    },

    totalReactivations(state) {
      return Object.values(state.history).reduce((a, h) => a + h.count, 0);
    },

    dueLabel(st, now) {
      if (!st || !st.attempts) return 'Pas encore vu';
      if (st.dueAt == null || st.dueAt <= now) return 'À revoir maintenant';
      const d = Math.ceil((st.dueAt - now) / DAY);
      if (d <= 1) return 'À revoir demain';
      return 'À revoir dans ' + d + ' j';
    },

    // Agrégats
    summarize(week, state, now, filter) {
      const skills = week.skills.filter(filter || (() => true));
      const out = { green: 0, orange: 0, red: 0, new: 0, total: skills.length, progress: 0 };
      let sum = 0;
      skills.forEach((s) => {
        const st = state.skills[s.id];
        out[M.status(st)]++;
        sum += M.score(st);
      });
      out.progress = skills.length ? sum / skills.length : 0;
      return out;
    },

    // Statut agrégé d'un groupe de compétences (module)
    groupStatus(week, state, skillIds) {
      const sts = skillIds.map((id) => M.status(state.skills[id]));
      if (sts.every((s) => s === 'new')) return 'new';
      if (sts.includes('red')) return 'red';
      if (sts.every((s) => s === 'green')) return 'green';
      return 'orange';
    },
  };

  R.mastery = M;
})((window.R = window.R || {}));
