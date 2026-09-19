/* engine/session.js — vie d'une session : création, enregistrement des réponses,
 * réapparition des erreurs, résumé de fin. Tout est sérialisable (session reprenable). */
(function (R) {
  'use strict';
  const U = R.util;
  const M = R.mastery;
  const S = R.selector;

  const MODES = {
    express: { n: 10, title: 'Réactivation express' },
    subject: { n: 10, title: 'Réviser une matière' },
    weak: { n: 10, title: 'Mes points faibles' },
    challenge: { n: 8, title: 'Défi mémoire', challenge: true },
    skill: { n: 6, title: 'Micro-session ciblée' },
    errors: { n: 8, title: 'Réactiver mes erreurs' },
  };

  const SES = {
    MODES,

    create(week, state, mode, opts) {
      opts = opts || {};
      const def = MODES[mode] || MODES.express;
      const queue = S.build(week, state, Object.assign({ mode, n: def.n, challenge: !!def.challenge }, opts));
      if (!queue.length) return null;
      return {
        id: U.uid(), mode, title: opts.title || def.title, challenge: !!def.challenge,
        queue, pos: 0, answered: [], retries: {}, shakyRetries: {},
        startedAt: U.now(), opts: { subject: opts.subject || null, skillIds: opts.skillIds || null },
      };
    },

    outcomeOf(res, conf, hintUsed, whyWrong) {
      if (!res.correct) return 'fail';
      if (res.partial || hintUsed || conf === 'guess' || conf === 'unsure' || whyWrong) return 'shaky';
      return 'solid';
    },

    // Enregistre une réponse et programme les réapparitions dans la session.
    answer(week, state, sess, data) {
      const now = U.now();
      const entry = sess.queue[sess.pos];
      const item = week._idx.item[entry.itemId];
      const st = M.record(state, entry.skillId, entry.itemId, data.outcome, { conf: data.conf }, now);
      sess.answered.push({ itemId: entry.itemId, skillId: entry.skillId, outcome: data.outcome, conf: data.conf || null, hint: !!data.hint, retry: !!entry.retry });

      // Réapparition : erreur -> dans ~3 questions ; hésitation -> dans ~6 questions (une fois)
      const sk = entry.skillId;
      const noRepeat = item.type === 'speaking'; // trop long : reprogrammé pour la prochaine session (dueAt = maintenant)
      if (!noRepeat && data.outcome === 'fail' && (sess.retries[sk] || 0) < 2) {
        const seen = new Set(sess.answered.map((a) => a.itemId));
        sess.queue.forEach((e) => seen.add(e.itemId)); // évite de reprendre une question déjà prévue
        let alt = S.pickItem(week, state, sk, seen, { challenge: sess.challenge });
        if (!alt) alt = S.pickItem(week, state, sk, new Set([entry.itemId]), { challenge: sess.challenge });
        if (alt) {
          sess.retries[sk] = (sess.retries[sk] || 0) + 1;
          const at = Math.min(sess.queue.length, sess.pos + 1 + 3);
          sess.queue.splice(at, 0, S.makeEntry(alt, { ask: S.askConfidence(alt, sess.challenge), retry: true }));
        }
      } else if (!noRepeat && data.outcome === 'shaky' && !entry.retry && (sess.shakyRetries[sk] || 0) < 1 && !sess.challenge) {
        const seen = new Set(sess.answered.map((a) => a.itemId));
        sess.queue.forEach((e) => seen.add(e.itemId));
        const alt = S.pickItem(week, state, sk, seen, {});
        if (alt) {
          sess.shakyRetries[sk] = 1;
          const at = Math.min(sess.queue.length, sess.pos + 1 + 6);
          sess.queue.splice(at, 0, S.makeEntry(alt, { ask: S.askConfidence(alt, false), retry: true }));
        }
      }
      return st;
    },

    // Résumé de fin de session (par notion)
    summarize(week, state, sess) {
      const bySkill = {};
      sess.answered.forEach((a) => {
        const r = bySkill[a.skillId] || (bySkill[a.skillId] = { skillId: a.skillId, outcomes: [] });
        r.outcomes.push(a.outcome);
      });
      const skills = Object.values(bySkill).map((r) => {
        const last = r.outcomes[r.outcomes.length - 1];
        let res;
        if (last === 'fail') res = 'red';
        else if (r.outcomes.some((o) => o !== 'solid')) res = 'orange';
        else res = 'green';
        return { skillId: r.skillId, result: res };
      });
      const count = (k) => skills.filter((s) => s.result === k).length;
      const now = U.now();
      const priority = skills
        .filter((s) => s.result !== 'green')
        .sort((a, b) => (a.result === 'red' ? 0 : 1) - (b.result === 'red' ? 0 : 1))
        .map((s) => s.skillId);
      const dues = week.skills.map((s) => state.skills[s.id]).filter((st) => st && st.attempts && st.dueAt != null).map((st) => st.dueAt);
      const nextDue = dues.length ? Math.min.apply(null, dues) : null;
      return {
        title: sess.title,
        questions: sess.answered.length,
        notions: skills.length,
        green: count('green'), orange: count('orange'), red: count('red'),
        priority: priority.slice(0, 4),
        errorSkillIds: skills.filter((s) => s.result !== 'green').map((s) => s.skillId),
        nextDue, at: now,
      };
    },
  };

  R.session = SES;
})((window.R = window.R || {}));
