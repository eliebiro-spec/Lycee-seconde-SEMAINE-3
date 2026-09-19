#!/usr/bin/env node
/* build.js — assemble l'application en UN seul fichier HTML autonome (fonctionne hors ligne, ouvrable
 * directement depuis un téléphone ou une clé USB). Usage : node build.js  ->  dist/revisions-semaine-03.html */
const fs = require('fs');
const path = require('path');
const root = __dirname;
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// Ordre de chargement (les données se déclarent avant que l'application ne démarre).
// Pour ajouter une semaine : créer data/seconde/semaine-04/ et ajouter ses fichiers ici.
const DATA_FILES = [
  'data/seconde/semaine-03/meta.js',
  'data/seconde/semaine-03/physique.js',
  'data/seconde/semaine-03/maths.js',
  'data/seconde/semaine-03/espagnol.js',
  'data/seconde/semaine-03/anglais.js',
  'data/seconde/semaine-03/francais.js',
];
const CORE = [
  'engine/util.js', 'data/registry.js', 'storage/store.js',
  'engine/mastery.js', 'engine/selector.js', 'engine/session.js',
  'components/common.js', 'components/MCQQuestion.js', 'components/NumberInputQuestion.js', 'components/OrderQuestion.js',
  'components/MatchQuestion.js', 'components/SelfAssessment.js', 'components/FlashcardQuestion.js',
  'components/SpeakingCard.js', 'components/GuidedProof.js',
  'views/router.js', 'views/home.js', 'views/subjects.js', 'views/session.js', 'views/summary.js',
];
// Les fichiers de données doivent venir juste après registry.js
const ORDER = [].concat(CORE.slice(0, 2), DATA_FILES, CORE.slice(2), ['views/app.js']);

module.exports = { ORDER, root };

if (require.main === module) {
  const js = ORDER.map((f) => '/* ── ' + f + ' ── */\n' + read(f)).join('\n\n');
  if (js.includes('</script')) throw new Error('"</script" trouvé dans le code : à échapper');
  const html = read('index.template.html').replace('/*__CSS__*/', () => read('styles/app.css')).replace('/*__JS__*/', () => js);
  fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
  const out = path.join(root, 'dist', 'revisions-semaine-03.html');
  fs.writeFileSync(out, html);
  console.log('OK', out, (html.length / 1024).toFixed(0) + ' Ko');
}
