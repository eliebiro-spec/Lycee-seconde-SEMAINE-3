/* tests/validate-data.js — vérifie la banque de questions : structure, références, réponses, calculs,
 * conjugaisons espagnoles. Lance : node tests/validate-data.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { ORDER, root } = require('../build.js');

const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
// données + registre + util uniquement
['engine/util.js', 'data/registry.js'].concat(ORDER.filter((f) => f.startsWith('data/seconde'))).forEach((f) => {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });
});
const R = sandbox.R;
const week = R.data.weeks['seconde/semaine-03'];

let errors = 0, checks = 0;
const fail = (id, msg) => { errors++; console.log('  ✗', id, '—', msg); };
const ok = (cond, id, msg) => { checks++; if (!cond) fail(id, msg); };

const subjects = new Set(week.subjects.map((s) => s.id));
const modules = new Map(week.modules.map((m) => [m.id, m]));
const skills = new Map(week.skills.map((s) => [s.id, s]));
const ids = new Set();
const TYPES = ['mcq', 'tf', 'number', 'text', 'order', 'match', 'flashcard', 'speaking', 'proof'];
const SELF = ['flashcard', 'speaking'];

// ─── référentiels indépendants ───
const CONJ = {
  ser: { yo: 'soy', 'tú': 'eres', 'él': 'es', nosotros: 'somos', vosotros: 'sois', ellos: 'son' },
  estar: { yo: 'estoy', 'tú': 'estás', 'él': 'está', nosotros: 'estamos', vosotros: 'estáis', ellos: 'están' },
};
const gerund = (inf) => inf.replace(/ar$/, 'ando').replace(/(er|ir)$/, 'iendo');

week.items.forEach((it) => {
  const id = it.id;
  ok(!ids.has(id), id, 'id dupliqué'); ids.add(id);
  ok(TYPES.includes(it.type), id, 'type inconnu ' + it.type);
  ok(subjects.has(it.subject), id, 'matière inconnue');
  ok(modules.has(it.module) && modules.get(it.module).subject === it.subject, id, 'module incohérent');
  ok(skills.has(it.skill) && skills.get(it.skill).subject === it.subject && skills.get(it.skill).module === it.module, id, 'compétence incohérente');
  ok(typeof it.prompt === 'string' && it.prompt.length > 3, id, 'énoncé manquant');
  ok([1, 2, 3].includes(it.difficulty), id, 'difficulté manquante');
  if (!SELF.includes(it.type)) ok(typeof it.explanation === 'string' && it.explanation.length > 10, id, 'explication manquante');
  ok(id.split('-')[0] !== undefined && /^[a-z0-9-]+$/.test(id), id, 'format d’id');

  if (it.type === 'mcq') {
    ok(Array.isArray(it.answers) && it.answers.length >= 2 && it.answers.length <= 4, id, 'answers 2..4');
    ok(Number.isInteger(it.correct) && it.correct >= 0 && it.correct < it.answers.length, id, 'correct hors bornes');
    ok(new Set(it.answers).size === it.answers.length, id, 'réponses dupliquées');
    if (it.feedbacks) Object.keys(it.feedbacks).forEach((k) => ok(+k !== it.correct && +k < it.answers.length, id, 'feedback sur bonne réponse ou hors bornes'));
    if (it.why) ok(it.why.answers.length >= 2 && it.why.correct < it.why.answers.length && it.why.q, id, 'why invalide');
  }
  if (it.type === 'tf') ok(typeof it.correct === 'boolean', id, 'tf correct booléen');
  if (it.type === 'number') {
    const a = it.answers || [it.answer];
    ok(a.every((x) => typeof x === 'number' && isFinite(x)), id, 'answer numérique');
  }
  if (it.type === 'text') ok(Array.isArray(it.accept) && it.accept.length, id, 'accept manquant');
  if (it.type === 'order') {
    ok(it.items.length >= 3, id, 'order items');
    ok(new Set(it.items.concat(it.distractors || [])).size === it.items.length + (it.distractors || []).length, id, 'order doublons');
    (it.altOrders || []).forEach((p) => ok(p.length === it.items.length && new Set(p).size === p.length, id, 'altOrders'));
  }
  if (it.type === 'match') {
    ok(it.pairs.length >= 2 && it.pairs.length <= 4, id, 'match 2..4 paires (couleurs)');
    ok(new Set(it.pairs.map((p) => p[1])).size === it.pairs.length, id, 'match doublons');
  }
  if (it.type === 'flashcard') ok(typeof it.back === 'string', id, 'back manquant');
  if (it.type === 'speaking') ok(['think', 'speak'].includes(it.mode) && (it.mode === 'speak' || it.help.length >= 3), id, 'speaking');
  if (it.type === 'proof') {
    ok(it.steps.length >= 3, id, 'proof étapes');
    it.steps.forEach((s, i) => {
      ok(s.correct < s.answers.length && s.line && s.q, id, 'étape ' + (i + 1));
      Object.keys(s.feedbacks || {}).forEach((k) => ok(+k !== s.correct, id, 'étape ' + (i + 1) + ' feedback sur bonne réponse'));
    });
  }

  // ─── vérifications de contenu ───
  const v = it.verify;
  if (v) {
    let expected = null;
    if (v.kind === 'sum') expected = v.terms.reduce((a, b) => a + b, 0);
    if (v.kind === 'diff') expected = v.a - v.b;
    if (v.kind === 'percent') expected = (v.part / v.total) * 100;
    if (v.kind === 'of') expected = v.rate * v.total;
    if (v.kind === 'expr') expected = v.value;
    if (v.kind === 'divisor-count') { expected = 0; for (let d = 1; d <= v.n; d++) if (v.n % d === 0) expected++; }
    if (v.kind === 'consecutive-multiples') {
      // brute force : cherche n entier tel que k*n + ... + k*(n+count-1) = sum
      let found = null;
      for (let n = 0; n < 10000; n++) {
        let s = 0; for (let i = 0; i < v.count; i++) s += v.k * (n + i);
        if (s === v.sum) { found = n; break; }
      }
      ok(found !== null, id, 'aucune solution entière');
      expected = v.ask === 'min' ? v.k * found : v.k * (found + v.count - 1);
    }
    if (v.kind === 'consecutive-multiples-none') {
      let found = false;
      for (let n = 0; n < 10000; n++) { let s = 0; for (let i = 0; i < v.count; i++) s += v.k * (n + i); if (s === v.sum) found = true; }
      ok(it.correct === found, id, 'existence : attendu ' + found);
      expected = null;
    }
    if (v.kind === 'conj') {
      const target = CONJ[v.verb][v.person];
      ok(it.accept.includes(target), id, 'conjugaison attendue ' + target + ' vs ' + it.accept);
    }
    if (v.kind === 'gerund') {
      const aux = CONJ.estar[v.person];
      ok(it.accept.includes(aux + ' ' + gerund(v.inf)), id, 'gérondif attendu ' + aux + ' ' + gerund(v.inf) + ' vs ' + it.accept);
    }
    if (expected !== null) {
      const a = (it.answers || [it.answer])[0];
      ok(Math.abs(a - expected) < 1e-9, id, 'valeur attendue ' + expected + ' mais données=' + a);
    }
  }
});

// ─── vérifications ciblées d'énoncés (indépendantes des données) ───
const item = (id) => week.items.find((i) => i.id === id);
const divs = (n) => { const r = []; for (let d = 1; d <= n; d++) if (n % d === 0) r.push(d); return r; };
const isDiv = (n, d) => n % d === 0;
// M03 : la somme de deux diviseurs de 24 n'est pas toujours un diviseur (3 + 4)
ok(!isDiv(24, 3 + 4) && isDiv(24, 3) && isDiv(24, 4), 'm-contre-exemple-001', '3 + 4');
const c2 = item('m-contre-exemple-002');
c2.answers.forEach((a, i) => {
  const [x, y] = a.split(' et ').map(Number);
  const isCounter = isDiv(24, x) && isDiv(24, y) && !isDiv(24, x + y);
  ok(isCounter === (i === c2.correct), c2.id, 'couple ' + a);
});
ok(divs(24).join(', ') === item('m-div-liste-001').answers[item('m-div-liste-001').correct], 'm-div-liste-001', 'liste diviseurs de 24');
ok([1, 3].every((d) => isDiv(24, d) && d % 2 === 1) && divs(24).filter((d) => d % 2).every((d) => item('m-contre-exemple-003').answers.includes(d)), 'm-contre-exemple-003', 'contre-exemples impairs');
const s36 = item('m-div-liste-003'); s36.answers.forEach((a, i) => ok(isDiv(36, +a) === (i === s36.correct), s36.id, 'diviseur de 36 : ' + a));
// somme de deux diviseurs de 20 : contre-exemple 5+10
ok(!isDiv(20, 15) && isDiv(20, 5) && isDiv(20, 10), 'm-contre-exemple-006', '5 + 10');
// Tout multiple de 3 n'est pas multiple de 6 (9) ; tout multiple de 4 est pair (vérif. empirique)
ok([...Array(200).keys()].every((k) => (4 * k) % 2 === 0), 'm-contre-exemple-007', 'multiple de 4 pair');
// n² − 1 divisible par 8 pour tout impair testé (empirique) + calculs de l'énoncé
ok([...Array(500).keys()].every((k) => ((2 * k + 1) ** 2 - 1) % 8 === 0), 'm-demo', 'n² − 1 / 8');
ok((7 * 7 - 1) / 8 === 6 && 5 * 5 - 1 === 24, 'm-divisibilite', 'calculs');
// parité : vérif. empirique des règles
const par = (n) => n % 2;
let rules = true;
for (let a = 0; a < 40; a++) for (let b = 0; b < 40; b++) {
  if (par(a) === 1 && par(b) === 1 && par(a + b) !== 0) rules = false;
  if (par(a) === 0 && par(b) === 1 && par(a + b) !== 1) rules = false;
  if (par(a) === 1 && par(b) === 1 && par(a * b) !== 1) rules = false;
  if (par(a) === 0 && par(b) === 1 && par(a * b) !== 0) rules = false;
  if (par(a) === 0 && par(b) === 0 && (a * b) % 4 !== 0) rules = false;
}
ok(rules, 'm-parite', 'règles de parité');
// développements : (2k+1)² − 1 = 4k² + 4k = 4k(k+1) ; (2k+1)² = 4k²+4k+1 = 2(2k²+2k)+1 ; 21n+21
let algebra = true;
for (let k = -20; k <= 20; k++) {
  if ((2 * k + 1) ** 2 - 1 !== 4 * k * k + 4 * k) algebra = false;
  if (4 * k * k + 4 * k !== 4 * k * (k + 1)) algebra = false;
  if ((2 * k + 1) ** 2 !== 2 * (2 * k * k + 2 * k) + 1) algebra = false;
  if (7 * k + 7 * (k + 1) + 7 * (k + 2) !== 21 * k + 21) algebra = false;
  if (7 * k + 7 * (k + 1) + 7 * (k + 2) + 7 * (k + 3) !== 28 * k + 42) algebra = false;
  if ((2 * k + 1) + (2 * k + 3) !== 2 * (2 * k + 2)) algebra = false;
  if ((2 * k + 3) % 2 === 0) algebra = false;
  // distracteurs de la démo (doivent être FAUX)
  if ((2 * k + 1) ** 2 - 1 === 4 * k * k && k !== 0) algebra = false;
  if (2 * (2 * k * k + 4 * k) + 1 === 4 * k * k + 4 * k + 1 && k !== 0) algebra = false;
  if (2 * (k * k + 2 * k) + 1 === 4 * k * k + 4 * k + 1 && k !== 0) algebra = false;
  if (2 * k * (2 * k + 1) === 4 * k * k + 4 * k && k !== 0) algebra = false;
  if (4 * (k * k + 1) === 4 * k * k + 4 * k && k !== 0 && k !== 1) algebra = false; // égalité fortuite en k = 1 seulement
}
ok(algebra, 'm-algebre', 'identités algébriques');
// M02 : équation 4n + 4(n+1) + 4(n+2) = 132 -> n = 10 ; 8 : n = 10
ok(4 * 10 + 4 * 11 + 4 * 12 === 132, 'm-mult-resolution-001', '40+44+48');
ok(91 + 98 + 105 + 112 === 406 && 30 + 35 + 40 === 105 && 80 + 88 + 96 === 264, 'm-mult', 'sommes de multiples');
// Physique : proportions
const pcs = [['pc-volumique-001', 30, 150, 20], ['pc-volumique-002', 50, 200, 25], ['pc-massique-002', 9, 300, 3], ['pc-massique-003', 15, 100, 15], ['pc-volumique-004', 20, 100, 20]];
pcs.forEach(([id, p, t, r]) => ok(Math.abs((p / t) * 100 - r) < 1e-9 && item(id).answer === r, id, 'proportion'));
ok(0.05 * 400 === 20 && 250 - 60 === 190 && 150 + 350 === 500, 'pc', 'autres calculs');

// ─── couverture ───
const per = {};
week.items.forEach((i) => (per[i.subject] = (per[i.subject] || 0) + 1));
const target = { physique: [15, 25], maths: [25, 40], espagnol: [25, 40], anglais: [15, 22], francais: [20, 30] };
Object.keys(target).forEach((s) => ok(per[s] >= target[s][0] && per[s] <= target[s][1], s, 'nombre d’items ' + per[s] + ' hors ' + target[s]));
week.skills.forEach((s) => ok(week.items.filter((i) => i.skill === s.id).length >= 2, s.id, 'moins de 2 items (pas de variante possible)'));
ok(!week.subjects.find((s) => /histoire/i.test(s.label)), 'meta', 'Histoire-Géographie ne doit pas figurer');

// Variation des positions de bonne réponse (QCM)
const pos = {};
week.items.filter((i) => i.type === 'mcq' && i.shuffle !== false && i.answers.length >= 3).forEach((i) => (pos[i.correct] = (pos[i.correct] || 0) + 1));

console.log('\nItems par matière :', per, '· total', week.items.length);
console.log('Types :', week.items.reduce((a, i) => ((a[i.type] = (a[i.type] || 0) + 1), a), {}));
console.log('Contrôles exécutés :', checks, '· échecs :', errors);
process.exit(errors ? 1 : 0);
