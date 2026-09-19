const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.join(__dirname, '..', 'dist', 'revisions-semaine-03.html');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h, name] of [[360, 700, 'm360'], [1280, 860, 'desk']]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: w < 700, isMobile: w < 700 });
    const page = await ctx.newPage();
    await page.goto(url);
    await page.evaluate(() => {
      localStorage.clear();
      const st = R.app.state, now = Date.now(), D = 864e5, M = R.mastery;
      const sk = R.app.week.skills;
      sk.forEach((s, i) => {
        const r = i % 5;
        if (r === 0) { M.record(st, s.id, 'x' + i, 'solid', {}, now - 6 * D); M.record(st, s.id, 'x' + i, 'solid', {}, now - 3 * D); }
        else if (r === 1) M.record(st, s.id, 'x' + i, 'shaky', {conf:'unsure'}, now - D);
        else if (r === 2) M.record(st, s.id, 'x' + i, 'fail', {}, now - 2 * D);
        else if (r === 3) M.record(st, s.id, 'x' + i, 'solid', {}, now - D);
      });
      R.app.save();
    });
    await page.reload();
    await page.screenshot({ path: `/tmp/shots/${name}-home.png`, fullPage: true });
    const shot = async (hash, file, act) => {
      await page.evaluate((h) => { location.hash = h; }, hash);
      await page.waitForTimeout(250);
      if (act) await act();
      await page.screenshot({ path: `/tmp/shots/${name}-${file}.png` });
    };
    await shot('#/dev/m-contre-exemple-002', 'mcq');
    await shot('#/dev/m-contre-exemple-002/ask', 'conf', async () => { await page.evaluate(() => R.debug.current().inst.auto(false)); await page.waitForTimeout(300); });
    await shot('#/dev/m-contre-exemple-002/ask', 'fb-wrong', async () => { await page.evaluate(() => R.debug.current().inst.auto(false)); await page.waitForTimeout(200); await page.click('.conf [data-conf="sure"]'); await page.waitForTimeout(300); });
    await shot('#/dev/pc-volumique-004', 'number');
    await shot('#/dev/pc-etats-sens-004', 'chain');
    await shot('#/dev/m-demo-guidee-001', 'proof', async () => { await page.click('.choice >> nth=0'); await page.waitForTimeout(300); });
    await shot('#/dev/m-demo-sans-aide-001', 'order', async () => { for (const i of [0,1,2]) { await page.click('.chip >> nth=' + i); } });
    await shot('#/dev/es-sens-007', 'match', async () => { await page.click('.match-col:nth-child(1) .mbtn >> nth=0'); await page.click('.match-col:nth-child(2) .mbtn >> nth=1'); });
    await shot('#/dev/es-sens-001', 'why', async () => { await page.evaluate(() => R.debug.current().inst.auto(true)); await page.waitForTimeout(300); });
    await shot('#/dev/an-expr-001', 'speak1', async () => { await page.click('.s-action'); await page.waitForTimeout(1300); });
    await shot('#/dev/an-expr-001', 'speak2', async () => { await page.click('.s-action'); await page.click('.s-action'); await page.waitForTimeout(200); });
    await shot('#/dev/an-reform-003', 'flash', async () => { await page.fill('textarea', 'On social media we show only our best'); await page.click('.s-action'); await page.waitForTimeout(200); });
    await shot('#/progres', 'progress', async () => { await page.click('.mod-head >> nth=3'); });
    await page.evaluate(() => { R.app.state.session = null; });
    await shot('#/faibles', 'weak');
    await shot('#/matiere/maths', 'subject');
    await ctx.close();
  }
  await browser.close();
})();
