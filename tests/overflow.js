/* tests/overflow.js — Playwright : aucune question ne doit déborder de l'écran (360×600, 360×740, 430×932, desktop). */
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.join(__dirname, '..', 'dist', 'revisions-semaine-03.html');
const VIEWPORTS = (process.env.VP ? JSON.parse(process.env.VP) : [[360, 640], [360, 740], [430, 932], [1280, 800]]);

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const problems = [];
  let pageErrors = [];
  for (const [w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 700, isMobile: w < 700 });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => pageErrors.push(w + ': ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(w + ' console: ' + m.text()); });
    await page.goto(url);
    const ids = await page.evaluate(() => R.app.week.items.map((i) => i.id));
    const over = async (tag) => {
      const r = await page.evaluate(() => {
        const m = document.querySelector('.s-main'); const s = document.querySelector('.session');
        const hsc = document.documentElement.scrollWidth > window.innerWidth + 1;
        return { over: m.scrollHeight - m.clientHeight, hScroll: hsc, sess: s.scrollHeight - s.clientHeight };
      });
      if (r.over > 1 || r.hScroll || r.sess > 1) problems.push(`${w}x${h} ${tag}: overflow=${r.over}px hscroll=${r.hScroll}`);
    };
    for (const id of ids) {
      const type = await page.evaluate((id) => R.app.week._idx.item[id].type, id);
      for (const mode of (['mcq', 'tf', 'number', 'text'].includes(type) ? ['', '/ask'] : [''])) {
        await page.evaluate((h) => { location.hash = h; }, '#/dev/' + id + mode);
        await page.waitForSelector('.s-body *');
        await page.waitForTimeout(40);
        await over(id + mode + ' [question]');
        if (type === 'flashcard') { await page.click('.s-action'); await page.waitForTimeout(30); await over(id + ' [revealed]'); }
        if (type === 'speaking') {
          await page.click('.s-action'); await page.waitForTimeout(40); await over(id + ' [timer]');
          await page.click('.s-action'); await page.waitForTimeout(40); await over(id + ' [after timer]');
          const t = await page.evaluate(() => document.querySelector('.s-action').style.visibility);
          if (t !== 'hidden') { await page.click('.s-action'); await page.waitForTimeout(40); await over(id + ' [assess]'); }
        }
        if (type === 'flashcard' || type === 'speaking') continue;
        // mauvaise réponse (feedback le plus long) puis bonne réponse
        for (const good of [false, true]) {
          await page.evaluate((h) => { location.hash = h; }, '#/dev/' + id + mode + (good ? '' : ''));
          await page.evaluate(() => { const c = R.debug.current(); if (!c) return; });
          await page.waitForTimeout(30);
          await page.evaluate((g) => R.debug.current().inst.auto(g), good);
          if (type === 'proof') await page.waitForFunction(() => document.querySelector('.fb'), null, { timeout: 8000 }).catch(() => {});
          else await page.waitForTimeout(60);
          if (mode === '/ask' && await page.$('.conf')) { await over(id + mode + ' [confidence]'); await page.click('.conf-btns button >> nth=1'); await page.waitForTimeout(40); }
          await over(id + mode + (good ? ' [feedback ok]' : ' [feedback ko]'));
        }
      }
    }
    await ctx.close();
  }
  await browser.close();
  console.log(problems.length ? problems.join('\n') : 'Aucun débordement');
  console.log('Erreurs JS :', pageErrors.length ? pageErrors.slice(0, 10) : 'aucune');
  process.exit(problems.length || pageErrors.length ? 1 : 0);
})();
