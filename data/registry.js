/* data/registry.js — registre des contenus.
 *
 * Organisation : /data/<niveau>/<semaine>/  (ex. /data/seconde/semaine-03/)
 *   meta.js       -> R.data.defineWeek({...})  (titre, matières, modules, microcompétences, « ce que j'ai travaillé »)
 *   <matiere>.js  -> R.data.addItems(weekKey, [...])  (banque de questions, données pures)
 *
 * Ajouter une semaine 4 = créer /data/seconde/semaine-04/ avec les mêmes fichiers
 * et les ajouter à la liste DATA_FILES de build.js. Le moteur n'a pas à changer :
 * la progression est stockée par semaine (clé "revisions:<niveau>/<semaine>").
 */
(function (R) {
  'use strict';
  const weeks = {};
  R.data = {
    weeks,
    defineWeek(w) {
      weeks[w.key] = Object.assign({ modules: [], skills: [], items: [], worked: [], subjects: [] }, w);
    },
    addItems(key, items) {
      weeks[key].items.push(...items);
    },
    // Semaine active : ?semaine=... sinon la plus récente
    current() {
      const keys = Object.keys(weeks).sort();
      let k = keys[keys.length - 1];
      try {
        const q = new URLSearchParams(location.search).get('semaine');
        if (q && weeks['seconde/' + q]) k = 'seconde/' + q;
      } catch (e) { /* ignore */ }
      const w = weeks[k];
      if (!w._idx) {
        w._idx = { item: {}, skill: {}, subject: {}, module: {} };
        w.items.forEach((i) => (w._idx.item[i.id] = i));
        w.skills.forEach((s) => (w._idx.skill[s.id] = s));
        w.subjects.forEach((s) => (w._idx.subject[s.id] = s));
        w.modules.forEach((m) => (w._idx.module[m.id] = m));
      }
      return w;
    },
  };
})((window.R = window.R || {}));
