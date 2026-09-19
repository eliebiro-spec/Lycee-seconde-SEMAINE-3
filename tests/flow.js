/* tests/flow.js — parcours complet (Playwright) : accueil, session express, entrelacement, réapparition des erreurs,
 * persistance après rechargement, reprise, espacement dans le temps, modes, réinitialisation. */
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.join(__dirname, '..', 'dist', 'revisions-semaine-03.html');

let fails = 0, passes = 0;
const check = (cond, msg) => { if (cond) passes++; else { fails++; console.log('  ✗', msg); } };

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // ───────── Accueil
  const home = await page.evaluate(() => ({
    title: document.querySelector('.home-title').innerText, sub: document.querySelector('.home-sub').innerText,
    subjects: [...document.querySelectorAll('.subj-card .nm')].map((n) => n.textContent),
    cta: document.querySelector('.cta').innerText, hasHisto: /histoire/i.test(document.body.innerText),
    ind: [...document.querySelectorAll('.progress-card .ind .n')].map((n) => n.textContent),
    footer: document.querySelector('.foot').textContent,
    modes: [...document.querySelectorAll('.mode')].map((m) => m.innerText.replace(/\n/g, ' ')),
  }));
  check(/Révisions/.test(home.title) && /Semaine 3/.test(home.title), 'titre Révisions / Semaine 3');
  check(home.sub === 'Classe de Seconde', 'sous-titre');
  check(JSON.stringify(home.subjects) === JSON.stringify(['Physique-Chimie', 'Mathématiques', 'Espagnol', 'Anglais Euro', 'Français']), 'cinq matières : ' + home.subjects);
  check(!home.hasHisto, 'pas d’Histoire-Géographie');
  check(/Réactivation express/.test(home.cta) && /5–10 min/.test(home.cta), 'bouton principal');
  check(home.modes.length === 4, 'modes secondaires');

  // ───────── Session express
  await page.click('.cta');
  await page.waitForFunction(() => document.body.dataset.view === 'session' && document.querySelector('.s-body'));
  const q0 = await page.evaluate(() => R.app.state.session.queue.map((e) => ({ id: e.itemId, s: e.subject, k: e.skillId })));
  check(q0.length >= 8 && q0.length <= 10, 'session express : ' + q0.length + ' questions');
  const subjSet = new Set(q0.map((e) => e.s));
  check(subjSet.size >= 4, 'au moins 4 matières mélangées : ' + [...subjSet]);
  let adjacent = 0; for (let i = 1; i < q0.length; i++) if (q0[i].s === q0[i - 1].s) adjacent++;
  check(adjacent === 0, 'entrelacement : aucune matière deux fois de suite (' + adjacent + ')');
  check(new Set(q0.map((e) => e.k)).size === q0.length, 'une compétence par question au départ');

  async function answerCurrent(good, conf) {
    const before = await page.evaluate(() => R.debug.current().sess.pos);
    await page.evaluate((g) => R.debug.current().inst.auto(g), good);
    for (let i = 0; i < 80; i++) {
      await page.waitForTimeout(60);
      const st = await page.evaluate(() => ({
        conf: !!document.querySelector('.conf'), why: !!document.querySelector('.fb.why'), fb: !!document.querySelector('.fb:not(.why):not(.self)'),
        self: !!document.querySelector('.fb.self'), hash: location.hash, pos: (R.debug.current() || {}).sess ? R.debug.current().sess.pos : -1,
      }));
      if (st.hash !== '#/session') return 'end';
      if (st.conf) { await page.click('.conf [data-conf="' + (conf || 'sure') + '"]'); continue; }
      if (st.why) { await page.click('.fb.why .choice >> nth=0'); continue; }
      if (st.fb) {
        const label = await page.textContent('.s-action');
        await page.click('.s-action');
        await page.waitForTimeout(80);
        return label;
      }
      if (st.self) { await page.waitForFunction((b) => location.hash !== '#/session' || R.debug.current().sess.pos !== b || document.querySelector('.s-card .assess') === null, before, { timeout: 4000 }).catch(() => {}); await page.waitForTimeout(900); return 'self'; }
    }
    return 'timeout';
  }

  // Q1 : on échoue volontairement -> une variante doit revenir quelques questions plus tard
  const first = await page.evaluate(() => { const c = R.debug.current(); return { id: c.item.id, skill: c.item.skill, type: c.item.type }; });
  await answerCurrent(false, 'sure');
  const afterFail = await page.evaluate((sk) => ({ st: R.app.state.skills[sk], q: R.app.state.session.queue.map((e) => ({ id: e.itemId, k: e.skillId, r: e.retry })), pos: R.app.state.session.pos }), first.skill);
  check(afterFail.st.errors === 1 && afterFail.st.lastOutcome === 'fail', 'erreur enregistrée : ' + JSON.stringify(afterFail.st.lastOutcome));
  const retryIdx = afterFail.q.findIndex((e, i) => i >= afterFail.pos && e.k === first.skill && e.r);
  check(retryIdx >= 0 && retryIdx - afterFail.pos <= 4, 'variante de l’erreur programmée dans la session (offset ' + (retryIdx - afterFail.pos) + ')');
  check(retryIdx >= 0 && afterFail.q[retryIdx].id !== first.id, 'la variante est une autre question');
  check(await page.evaluate((sk) => R.mastery.status(R.app.state.skills[sk]), first.skill) === 'red', 'statut rouge après erreur');

  // Persistance : rechargement en cours de session -> reprise
  const posBefore = afterFail.pos;
  await page.reload();
  await page.waitForFunction(() => document.body.dataset.view);
  const back = await page.evaluate(() => ({ view: document.body.dataset.view, pos: R.debug.current() ? R.debug.current().sess.pos : -1 }));
  check(back.view === 'session' && back.pos === posBefore, 'rechargement sur la session : reprise à la bonne question (' + back.pos + ' = ' + posBefore + ')');
  await page.evaluate(() => { location.hash = '#/'; });
  await page.waitForFunction(() => document.body.dataset.view === 'home');
  const resume = await page.evaluate(() => ({ resume: !!document.querySelector('.resume'), txt: (document.querySelector('.resume') || {}).innerText }));
  check(resume.resume, 'carte « Session en cours » sur l’accueil : ' + (resume.txt || '').replace(/\n/g, ' '));
  await page.click('.resume .btn.primary');
  await page.waitForFunction(() => document.body.dataset.view === 'session' && document.querySelector('.s-body'));
  const posResumed = await page.evaluate(() => R.debug.current().sess.pos);
  check(posResumed === posBefore, 'bouton Reprendre : bonne question (' + posResumed + ' = ' + posBefore + ')');

  // Terminer la session : alterner bonnes réponses / une hésitation
  let guard = 0, n = 0;
  while ((await page.evaluate(() => location.hash)) === '#/session' && guard++ < 40) {
    n++;
    await answerCurrent(n % 4 !== 0, n % 3 === 0 ? 'unsure' : 'sure');
  }
  check((await page.evaluate(() => location.hash)) === '#/fin', 'session terminée -> écran de fin');
  const sum = await page.evaluate(() => ({ txt: document.querySelector('.summary').innerText, btns: [...document.querySelectorAll('.sum-actions .btn')].map((b) => b.textContent) }));
  check(/Session terminée ✓/.test(sum.txt) && /notions? récupérées?/.test(sum.txt), 'résumé : « Session terminée » + notions récupérées');
  check(/🟢/.test(sum.txt) && /🟠/.test(sum.txt) && /🔴/.test(sum.txt), 'résumé : 3 compteurs');
  check(/À revoir en priorité/.test(sum.txt), 'résumé : À revoir en priorité');
  check(sum.btns[0] === 'Terminer' && sum.btns.includes('Réactiver mes erreurs maintenant'), 'boutons de fin : ' + sum.btns);
  console.log('   résumé :', sum.txt.replace(/\n+/g, ' | ').slice(0, 200));

  // Logique d'espacement (moteur)
  const engine = await page.evaluate(() => {
    const M = R.mastery, DAY = 864e5, t0 = 1_800_000_000_000;
    const st = { skills: {}, items: {}, history: {} };
    const rec = (o, t) => M.record(st, 'sk', 'it', o, {}, t);
    const out = {};
    rec('solid', t0); out.s1 = [M.status(st.skills.sk), Math.round((st.skills.sk.dueAt - t0) / DAY)];
    rec('solid', t0 + 3600e3); out.sameDay = [M.status(st.skills.sk), st.skills.sk.streak];
    rec('solid', t0 + 2 * DAY); out.s2 = [M.status(st.skills.sk), st.skills.sk.streak, Math.round((st.skills.sk.dueAt - (t0 + 2 * DAY)) / DAY)];
    rec('solid', t0 + 6 * DAY); out.s3 = [M.status(st.skills.sk), st.skills.sk.streak, Math.round((st.skills.sk.dueAt - (t0 + 6 * DAY)) / DAY)];
    rec('shaky', t0 + 13 * DAY); out.shaky = [M.status(st.skills.sk), st.skills.sk.streak];
    rec('fail', t0 + 14 * DAY); out.fail = [M.status(st.skills.sk), st.skills.sk.streak, st.skills.sk.dueAt === t0 + 14 * DAY];
    const st2 = { skills: {}, items: {}, history: {} };
    M.record(st2, 'g', 'i', 'shaky', { conf: 'guess' }, t0); out.guess = [M.status(st2.skills.g), st2.skills.g.streak, st2.skills.g.guessed];
    return out;
  });
  check(engine.s1[0] === 'orange' && engine.s1[1] === 2, 'une seule bonne réponse sûre : 🟠, retour +2 j ' + engine.s1);
  check(engine.sameDay[0] === 'orange' && engine.sameDay[1] === 1, 'deux réussites le même jour ne comptent pas comme espacées ' + engine.sameDay);
  check(engine.s2[0] === 'green' && engine.s2[1] === 2 && engine.s2[2] === 4, 'deux réussites espacées : 🟢 +4 j ' + engine.s2);
  check(engine.s3[0] === 'green' && engine.s3[2] === 7, 'trois réussites espacées : +7 j ' + engine.s3);
  check(engine.shaky[0] === 'orange' && engine.shaky[1] === 2, 'réussite hésitante : 🟠 ' + engine.shaky);
  check(engine.fail[0] === 'red' && engine.fail[1] === 0 && engine.fail[2], 'erreur : 🔴 streak 0, à réactiver tout de suite ' + engine.fail);
  check(engine.guess[0] === 'orange' && engine.guess[1] === 0 && engine.guess[2] === 1, 'bonne réponse devinée : jamais acquise ' + engine.guess);

  // Retour à l'accueil : historique, série, priorités
  await page.click('.sum-actions .btn.primary');
  await page.waitForFunction(() => document.body.dataset.view === 'home');
  const home2 = await page.evaluate(() => ({ prog: document.querySelector('.progress-card .big').textContent, ind: [...document.querySelectorAll('.progress-card .ind .n')].map((n) => n.textContent), recap: document.querySelector('.recap').innerText.replace(/\n/g, ' '), streak: (document.querySelector('.streak') || {}).innerText }));
  check(/\d+ %/.test(home2.prog) && home2.prog !== '0 %', 'progression > 0 % : ' + home2.prog);
  check(!!home2.streak, 'série affichée : ' + home2.streak);
  console.log('   accueil :', JSON.stringify(home2));

  // Persistance après fermeture (nouveau contexte = même localStorage impossible ; on recharge)
  const snap = await page.evaluate(() => JSON.stringify(R.app.state.skills));
  await page.reload();
  const snap2 = await page.evaluate(() => JSON.stringify(R.app.state.skills));
  check(snap === snap2 && snap.length > 50, 'progression conservée après rechargement');

  // ───────── Voyage dans le temps : le lendemain, les erreurs reviennent en priorité
  const redSkills = await page.evaluate(() => R.app.week.skills.filter((s) => R.mastery.status(R.app.state.skills[s.id]) === 'red').map((s) => s.id));
  await page.evaluate(() => { R.setClock(() => Date.now() + 86400000); });
  const q1 = await page.evaluate(() => {
    const s = R.session.create(R.app.week, R.app.state, 'express');
    return s.queue.map((e) => e.skillId);
  });
  const redInQ = redSkills.filter((k) => q1.includes(k)).length;
  check(redSkills.length === 0 || redInQ === Math.min(redSkills.length, q1.length), 'lendemain : toutes les notions rouges reprogrammées (' + redInQ + '/' + redSkills.length + ')');
  const dueNow = await page.evaluate(() => R.app.week.skills.filter((s) => R.mastery.isDue(R.app.state.skills[s.id], R.util.now())).length);
  check(dueNow > 0, 'lendemain : des notions à récupérer (' + dueNow + ')');
  await page.evaluate(() => { R.setClock(() => Date.now()); });

  // ───────── Défi mémoire : pas d'indices, pas de QCM/VF/démonstration guidée
  await page.evaluate(() => { R.app.state.session = null; R.app.save(); location.hash = '#/'; });
  await page.waitForFunction(() => document.body.dataset.view === 'home');
  await page.click('.mode >> nth=2');
  await page.waitForFunction(() => document.body.dataset.view === 'session' && document.querySelector('.s-body'));
  const ch = await page.evaluate(() => ({ types: R.app.state.session.queue.map((e) => R.app.week._idx.item[e.itemId].type), ask: R.app.state.session.queue.filter((e) => e.ask).length, n: R.app.state.session.queue.length, hint: document.querySelector('.hint-btn').hidden }));
  check(!ch.types.some((t) => ['mcq', 'tf', 'proof'].includes(t)), 'défi : ni QCM, ni V/F, ni démonstration guidée : ' + ch.types);
  check(ch.hint, 'défi : pas de bouton d’indice');
  check(ch.ask === ch.types.filter((t) => ['number', 'text'].includes(t)).length, 'défi : estimation de confiance sur chaque réponse à saisir');

  // ───────── Matière + compétence ciblées
  await page.evaluate(() => { R.app.state.session = null; R.app.save(); location.hash = '#/matiere/espagnol'; });
  await page.waitForSelector('.cta.small');
  await page.click('.cta.small');
  await page.waitForFunction(() => document.body.dataset.view === 'session' && document.querySelector('.s-body'));
  const sj = await page.evaluate(() => R.app.state.session.queue.map((e) => e.subject));
  check(sj.every((s) => s === 'espagnol') && sj.length >= 6, 'session « matière » : ' + sj.length + ' questions d’espagnol');
  const skq = await page.evaluate(() => R.app.state.session.queue.map((e) => e.skillId));
  let sameAdj = 0; for (let i = 1; i < skq.length; i++) if (skq[i] === skq[i - 1]) sameAdj++;
  check(sameAdj === 0, 'entrelacement des compétences dans une matière');

  // ───────── Points faibles
  await page.evaluate(() => { R.app.state.session = null; R.app.save(); location.hash = '#/faibles'; });
  await page.waitForFunction(() => document.body.dataset.view === 'weak');
  const weak = await page.evaluate(() => ({ rows: document.querySelectorAll('.skill-row.big').length, exp: R.app.week.skills.filter((s) => R.mastery.isWeak(R.app.state.skills[s.id], R.util.now())).length }));
  check(weak.rows === weak.exp, 'points faibles : ' + weak.rows + ' notions listées');

  // ───────── Progrès + ce que j'ai travaillé
  await page.evaluate(() => { location.hash = '#/progres'; });
  await page.waitForFunction(() => document.body.dataset.view === 'progress');
  const prog = await page.evaluate(() => ({ heads: [...document.querySelectorAll('.sblock-head h2')].map((h) => h.textContent), hist: document.querySelector('.hist-row') ? document.querySelector('.hist-row').innerText.replace(/\n/g, ' ') : '' }));
  check(prog.heads.length === 5 && prog.heads.every((h) => /— \d+ %/.test(h)), 'progrès : 5 matières avec % : ' + prog.heads);
  check(/Aujourd’hui/.test(prog.hist), 'historique : ' + prog.hist);
  await page.click('.mod-head >> nth=2');
  await page.click('.mod-list:not([hidden]) .skill-row >> nth=0');
  await page.waitForFunction(() => document.body.dataset.view === 'session' && document.querySelector('.s-body'));
  const micro = await page.evaluate(() => ({ n: R.app.state.session.queue.length, ks: new Set(R.app.state.session.queue.map((e) => e.skillId)).size }));
  check(micro.ks === 1 && micro.n >= 3, 'clic sur une compétence : micro-session ciblée (' + micro.n + ' questions)');
  await page.evaluate(() => { R.app.state.session = null; R.app.save(); location.hash = '#/travail'; });
  await page.waitForFunction(() => document.body.dataset.view === 'worked');
  const worked = await page.evaluate(() => document.querySelector('.view').innerText);
  check(/Composition des mélanges · Changements d’état/.test(worked) && /Identity · Self-image · Oral interaction/.test(worked) && /Paragraphe interprétatif · Argumentation · Autoportrait poétique · Blason/.test(worked) && /Pairs\/impairs · Multiples · Diviseurs · Divisibilité · Démonstration/.test(worked) && /SER \/ ESTAR · Changements de sens/.test(worked), '« Ce que j’ai travaillé » conforme au brief');

  // ───────── Réinitialisation avec confirmation
  await page.evaluate(() => { location.hash = '#/progres'; });
  await page.waitForFunction(() => document.body.dataset.view === 'progress');
  await page.click('.danger-ghost');
  await page.waitForSelector('.modal');
  await page.click('.modal .btn.ghost'); // annuler
  check(await page.evaluate(() => Object.keys(R.app.state.skills).length > 0), 'annuler la réinitialisation conserve la progression');
  await page.click('.danger-ghost');
  await page.click('.modal .btn.danger');
  await page.waitForFunction(() => document.body.dataset.view === 'home');
  check(await page.evaluate(() => Object.keys(R.app.state.skills).length === 0 && !localStorage.getItem('revisions:seconde/semaine-03').includes('"attempts"')), 'réinitialisation confirmée : progression effacée');

  check(errors.length === 0, 'aucune erreur JS : ' + errors.slice(0, 3));
  await browser.close();
  console.log(`\nflow : ${passes} contrôles OK, ${fails} échec(s)`);
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
