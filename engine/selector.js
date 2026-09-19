/* engine/selector.js — choix des questions.
 * Priorités (mode express) : 1) échouées  2) hésitantes  3) pas vues / échues  4) quelques réussies pour vérifier le maintien.
 * Entrelacement : on évite deux questions de suite de la même matière (ou de la même compétence dans un mode « une matière »).
 */
(function (R) {
  'use strict';
  const U = R.util;
  const M = R.mastery;

  const DEFAULT_WEIGHT = { mcq: 1, tf: 0.8, number: 1, text: 1, match: 1.5, order: 1.5, flashcard: 1, proof: 2.5, speaking: 3 };
  function weightOf(item) {
    if (item.weight != null) return item.weight;
    if (item.type === 'flashcard' && item.input) return 2;
    return DEFAULT_WEIGHT[item.type] || 1;
  }

  function priority(st, now) {
    const status = M.status(st);
    if (status === 'new') return { score: 60, reason: 'new' };
    if (status === 'red') return { score: 100 + Math.min(10, (now - (st.lastFailAt || now)) / U.DAY), reason: 'red' };
    if (st.lastOutcome === 'shaky') return { score: 80, reason: 'shaky' };
    if (M.isDue(st, now)) return { score: 55 + Math.min(10, (now - st.dueAt) / U.DAY), reason: 'due' };
    if (status === 'orange') return { score: 35, reason: 'orange' };
    return { score: 10, reason: 'maintain' };
  }

  function targetDifficulty(status) {
    return status === 'green' ? 3 : status === 'orange' ? 2 : 1;
  }

  const S = {
    weightOf,
    priority,

    skillInfos(week, state, now, skillFilter) {
      return week.skills.filter(skillFilter || (() => true)).map((skill) => {
        const st = state.skills[skill.id];
        const p = priority(st, now);
        return { skill, st, status: M.status(st), score: p.score, reason: p.reason };
      });
    },

    // Choisit l'item le moins vu / le plus adapté d'une compétence.
    pickItem(week, state, skillId, exclude, opts) {
      opts = opts || {};
      const st = state.skills[skillId];
      const target = targetDifficulty(M.status(st));
      let pool = week.items.filter((i) => i.skill === skillId && !exclude.has(i.id));
      if (opts.challenge) pool = pool.filter((i) => !i.noChallenge && i.type !== 'mcq' && i.type !== 'tf' && i.type !== 'proof');
      if (opts.maxWeight != null) pool = pool.filter((i) => weightOf(i) <= opts.maxWeight);
      if (!pool.length) return null;
      const key = (i) => {
        const it = state.items[i.id] || { seen: 0, last: 0 };
        return [it.seen, Math.abs((i.difficulty || 1) - target), it.last || 0, Math.random()];
      };
      pool.sort((a, b) => {
        const ka = key(a), kb = key(b);
        for (let n = 0; n < ka.length; n++) if (ka[n] !== kb[n]) return ka[n] - kb[n];
        return 0;
      });
      return pool[0];
    },

    // Entrelacement : jamais deux fois de suite la même clé (matière ou compétence) si c'est possible.
    // On privilégie la priorité pédagogique, mais aussi les clés les plus nombreuses pour ne pas se retrouver coincé.
    interleave(entries, keyFn) {
      const rest = entries.slice();
      const remaining = {};
      rest.forEach((e) => { const k = keyFn(e); remaining[k] = (remaining[k] || 0) + 1; });
      const out = [];
      while (rest.length) {
        const last = out.length ? keyFn(out[out.length - 1]) : null;
        const last2 = out.length > 1 ? keyFn(out[out.length - 2]) : null;
        let best = -1, bestScore = -Infinity;
        rest.forEach((e, i) => {
          const k = keyFn(e);
          if (k === last) return;
          const score = e.p + 25 * remaining[k] - (k === last2 ? 15 : 0);
          if (score > bestScore) { bestScore = score; best = i; }
        });
        if (best < 0) best = 0; // plus le choix : même clé que la précédente
        const e = rest.splice(best, 1)[0];
        remaining[keyFn(e)]--;
        out.push(e);
      }
      return out;
    },

    askConfidence(item, challenge) {
      if (item.type === 'mcq' || item.type === 'tf') return challenge ? true : Math.random() < 0.6;
      if (item.type === 'number' || item.type === 'text') return challenge ? true : Math.random() < 0.35;
      return false;
    },

    makeEntry(item, extra) {
      return Object.assign({ itemId: item.id, skillId: item.skill, subject: item.subject, ask: false, retry: false }, extra || {});
    },

    /**
     * opts: { mode, n, subject?, skillIds?, challenge?, budget? }
     */
    build(week, state, opts) {
      const now = U.now();
      const n = opts.n || 10;
      const budget = opts.budget || Math.round(n * 1.5);
      const focused = !!(opts.subject || opts.skillIds);
      const filter = (s) => (opts.skillIds ? opts.skillIds.indexOf(s.id) >= 0 : opts.subject ? s.subject === opts.subject : true);
      const infos = S.skillInfos(week, state, now, filter);
      infos.forEach((o) => { o.p = o.score + Math.random() * 8; });
      infos.sort((a, b) => b.p - a.p);

      const used = new Set();
      const cnt = {}, subj = {};
      const picks = [];
      let weight = 0;
      let cap = focused ? Infinity : Math.max(2, Math.ceil(n * 0.3));

      const tryAdd = (o, force) => {
        const w0 = weight;
        const item = S.pickItem(week, state, o.skill.id, used, { challenge: opts.challenge, maxWeight: force ? null : Math.max(1, budget - w0) });
        if (!item) return false;
        if (picks.length && weight + weightOf(item) > budget + 0.01 && !force) return false;
        used.add(item.id);
        cnt[o.skill.id] = (cnt[o.skill.id] || 0) + 1;
        subj[o.skill.subject] = (subj[o.skill.subject] || 0) + 1;
        weight += weightOf(item);
        picks.push({ item, p: o.p, skillId: o.skill.id, subject: o.skill.subject, reason: o.reason });
        return true;
      };

      // 4) maintien : quelques notions déjà solides (mode express uniquement)
      if (opts.mode === 'express') {
        const greens = infos.filter((o) => o.status === 'green');
        const others = infos.length - greens.length;
        const keep = Math.min(greens.length, n >= 10 ? 2 : 1, Math.max(0, infos.length - others > 0 ? 2 : 0));
        if (greens.length && others >= n - keep) {
          const dueFirst = greens.slice().sort((a, b) => (M.isDue(b.st, now) - M.isDue(a.st, now)) || (Math.random() - 0.5));
          dueFirst.slice(0, keep).forEach((o) => tryAdd(o));
        }
      }

      for (let round = 1; round <= 5 && picks.length < n; round++) {
        for (const o of infos) {
          if (picks.length >= n) break;
          if ((cnt[o.skill.id] || 0) >= round) continue;
          if (opts.mode === 'express' && o.status === 'green' && round === 1 && picks.some((p) => p.skillId === o.skill.id)) continue;
          if ((subj[o.skill.subject] || 0) >= cap) continue;
          tryAdd(o);
        }
        if (round === 1) cap = Infinity;
      }
      if (!picks.length) {
        // dernier recours : ignorer le budget de temps
        for (const o of infos) { if (picks.length >= n) break; tryAdd(o, true); }
      }

      const keyFn = focused ? (e) => e.skillId : (e) => e.subject;
      const ordered = S.interleave(picks, keyFn);
      return ordered.map((p) => S.makeEntry(p.item, { ask: S.askConfidence(p.item, opts.challenge), reason: p.reason }));
    },
  };

  R.selector = S;
})((window.R = window.R || {}));
