// Dev only. Walks chapter 1 at phone width and saves one PNG per screen. Usage: node tools/shots.mjs <outDir> [width height]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = (process.argv[2] || 'docs/shots') + '/', W = +(process.argv[3] || 412), H = +(process.argv[4] || 915);
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const shot = n => page.screenshot({ path: OUT + n + '.png', fullPage: true });
await page.goto('file://' + resolve(ROOT, 'index.html')); await shot('1-home');
await page.getByRole('button', { name: 'Start chapter 1' }).click(); await shot('2-intro');
// R17: chapter 1 opens with the Clerk's walk (docs/plans/CH1-WALK-IN-2026-10-11.md); /tmp/ms-build/shoot5.mjs shoots each step at the viewport
const walkNext = () => page.locator('.walk-card').getByRole('button', { name: 'Next', exact: true }).click();
await page.getByRole('button', { name: 'Come in' }).click(); await shot('3-town-walk1');
await walkNext(); await walkNext(); await page.locator('.walk-card').getByRole('button', { name: 'Put 30 in my Jar' }).click(); await walkNext(); await page.locator('.shop-face').click(); await page.locator('.steppers').getByRole('button', { name: 'Buy 1 share' }).click(); await walkNext(); await shot('4-town-tray');
await walkNext(); await page.getByRole('button', { name: 'My Plan' }).click(); await page.locator('.plan-clerk').getByRole('button', { name: 'Back to town' }).click();
await page.getByRole('button', { name: 'Next season' }).click(); await shot('5-confirm');
await page.locator('#go').click(); await page.waitForTimeout(1300); await shot('6-show');
await page.getByRole('button', { name: 'Skip' }).click(); await shot('6b-recap-winter'); await page.locator('#recap-go').click(); await shot('7-town-spring');
for (let i = 0; i < 3; i++) { await page.getByRole('button', { name: 'Next season' }).click(); if (i === 0) await shot('7b-confirm-spring'); await page.locator('#go').click(); await page.getByRole('button', { name: 'Skip' }).click(); if (i === 0) await shot('8a-recap-spring'); if (i === 2) await shot('8c-recap-autumn'); await page.locator('#recap-go').click(); if (i === 0) await shot('8-town-drop'); if (i === 1) await shot('8b-town-autumn'); }
await shot('9-gazette'); await page.getByRole('button', { name: 'Continue' }).click(); await shot('10-goalday');
await page.getByRole('button', { name: 'Buy it from my Jar' }).click(); await shot('11-results');
await page.getByRole('button', { name: 'My Plan' }).click(); await shot('12-plan');
await b.close(); console.log('shots written to', OUT);
// chapter 2 and 3 screens
await (async () => {
  const b2 = await chromium.launch(); const p2 = await b2.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const shot2 = n => p2.screenshot({ path: OUT + n + '.png', fullPage: true });
  await p2.goto('file://' + resolve(ROOT, 'index.html'));
  await p2.evaluate(() => { MS.newRun('ch2', 'Pebble Creek 3'); MS.go('town'); }); await shot2('13-ch2-intro');
  await p2.getByRole('button', { name: 'Start exploring' }).click(); await shot2('14-ch2-town');
  await p2.locator('.tile.stall').click(); await p2.locator('.steppers').getByRole('button', { name: 'Buy 1 share' }).click(); await shot2('15-ch2-stall');
  await p2.getByRole('button', { name: 'Next year' }).click(); await p2.locator('#go').click(); await p2.waitForTimeout(2600); await shot2('16-ch2-show');
  await p2.getByRole('button', { name: 'Skip' }).click(); await shot2('16b-ch2-recap'); await p2.locator('#recap-go').click(); await shot2('17-ch2-gazette');
  await p2.getByRole('button', { name: 'Continue' }).click();
  for (let i = 0; i < 2; i++) { if (await p2.locator('#pull-keep').count()) await p2.locator('#pull-keep').click(); await p2.getByRole('button', { name: 'Next year' }).click(); await p2.locator('#go').click(); await p2.getByRole('button', { name: 'Skip' }).click(); await p2.locator('#recap-go').click(); if (await p2.locator('.screen.gazette').count()) await p2.getByRole('button', { name: 'Continue' }).click(); }
  if (await p2.locator('.screen.decision').count()) { if (await p2.getByRole('button', { name: /^Buy it/ }).count()) await p2.getByRole('button', { name: /^Buy it/ }).click(); else await p2.getByRole('button', { name: 'Postpone my goal' }).click(); }
  await shot2('18-ch2-results');
  await p2.getByRole('button', { name: 'Scrapbook' }).click(); await shot2('19-scrapbook');
  await b2.close();
})();
console.log('chapter 2 shots done');
// chapters 4 to 6: plan controls, the slump and closure, the fee lab, the time machine
await (async () => {
  const b3 = await chromium.launch(); const p = await b3.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const shot3 = n => p.screenshot({ path: OUT + n + '.png', fullPage: true });
  const settle = async () => { for (let k = 0; k < 8; k++) { if (await p.locator('.screen.town').count() || await p.locator('.screen.results').count()) { if (await p.locator('#pull-keep').count()) await p.locator('#pull-keep').click(); return; } if (await p.locator('.screen.gazette').count()) { await p.getByRole('button', { name: 'Continue' }).click(); continue; } if (await p.locator('.screen.decision').count()) { if (await p.getByText('Your goal day has arrived').count()) { if (await p.getByRole('button', { name: /^Buy it/ }).count()) await p.getByRole('button', { name: /^Buy it/ }).click(); else await p.getByRole('button', { name: 'Postpone my goal' }).click(); } else await p.getByRole('button', { name: /^Pay from my (Buffer|wallet|Saved)/ }).first().click(); continue; } await p.waitForTimeout(100); } };
  const adv = async () => { await p.getByRole('button', { name: /^(Next year|Continue year)$/ }).click(); await p.locator('#go').click(); await p.getByRole('button', { name: 'Skip' }).click(); await p.locator('#recap-go').click(); await settle(); };
  await p.goto('file://' + resolve(ROOT, 'index.html'));
  await p.evaluate(() => { MS.newRun('ch4', 'Harbor Lane 12'); MS.go('town'); }); await p.getByRole('button', { name: 'Start exploring' }).click();
  await p.locator('.tile').nth(1).click(); for (let i = 0; i < 4; i++) await p.locator('.steppers').getByRole('button', { name: 'Buy 1 share' }).click();
  await p.getByRole('button', { name: 'My Plan' }).click(); await p.locator('#route-select').selectOption('BASKET'); await p.getByRole('button', { name: 'Keep my plan' }).click(); await adv();
  await p.getByRole('button', { name: 'My Plan' }).click(); await shot3('20-ch4-plan');
  await p.locator("input[name=reinvest][value='1']").check(); await p.getByRole('button', { name: 'Keep my plan' }).click();
  for (let i = 0; i < 6; i++) { if (await p.locator('.screen.results').count()) break; await adv(); }
  await shot3('21-ch4-results'); await p.getByRole('button', { name: 'Try one change' }).click(); await p.locator('#tm-select').selectOption('start-early'); await shot3('22-timemachine');
  /* DECK4: in Clover Field 14 the Toy Box closes at month 20 and the slump starts at 26 */
  await p.evaluate(() => { MS.newRun('ch5', 'Clover Field 14'); MS.go('town'); }); await p.getByRole('button', { name: 'Start exploring' }).click();
  await p.locator('.tile').nth(2).click(); await p.locator('.steppers').getByRole('button', { name: 'Buy 1 share' }).click();
  for (let i = 0; i < 4; i++) { await adv(); const t = await p.evaluate(() => MS.S.draft.t); if (t === 26) await shot3('23-ch5-slump'); if (t === 20) { await p.locator('.tile').nth(2).click(); await shot3('24-ch5-closing'); } }
  await p.evaluate(() => { MS.newRun('ch6', 'Lantern Row 5'); MS.go('town'); }); await p.getByRole('button', { name: 'Start exploring' }).click(); await shot3('25-ch6-lab');
  await p.getByRole('button', { name: 'Read the cost card' }).first().click(); await p.getByRole('button', { name: 'Read the cost card' }).first().click(); await shot3('26-ch6-lab-read');
  await p.getByRole('button', { name: 'Choose Basket A' }).click(); await shot3('27-ch6-town');
  await b3.close();
})();
console.log('chapter 4 to 6 shots done');
// M5: free play, scrapbook page, settings, debug
await (async () => {
  const b5 = await chromium.launch(); const p = await b5.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const shot5 = n => p.screenshot({ path: OUT + n + '.png', fullPage: true });
  await p.goto('file://' + resolve(ROOT, 'index.html'));
  await p.evaluate(() => { MS.S.progress.completedChapters = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6']; MS.render(); });
  await p.getByRole('button', { name: 'Free play' }).click(); await shot5('28-freeplay');
  await p.getByRole('button', { name: 'Settings' }).catch?.(() => {});
  await p.goto('file://' + resolve(ROOT, 'index.html')); await p.getByRole('button', { name: 'Settings' }).click(); await shot5('29-settings');
  await p.goto('file://' + resolve(ROOT, 'index.html') + '?debug=1');
  await p.evaluate(() => { MS.newRun('ch5', 'Clover Field 9'); MS.S.ui.intro = false; MS.go('debug'); }); await shot5('30-debug');
  await p.goto('file://' + resolve(ROOT, 'index.html')); await p.evaluate(() => { MS.newRun('ch2', 'Pebble Creek 3'); MS.S.ui.intro = false; MS.go('town'); });
  for (let i = 0; i < 3; i++) { await p.getByRole('button', { name: /^(Next year|Continue year)$/ }).click(); await p.locator('#go').click(); await p.getByRole('button', { name: 'Skip' }).click(); await p.locator('#recap-go').click(); for (let k = 0; k < 6; k++) { if (await p.locator('.screen.town').count() || await p.locator('.screen.results').count()) break; if (await p.locator('.screen.gazette').count()) { await p.getByRole('button', { name: 'Continue' }).click(); continue; } if (await p.locator('.screen.decision').count()) { if (await p.getByRole('button', { name: /^Buy it/ }).count()) await p.getByRole('button', { name: /^Buy it/ }).click(); else await p.getByRole('button', { name: 'Postpone my goal' }).click(); continue; } await p.waitForTimeout(100); } }
  await p.locator('.deco').nth(0).click(); await p.getByRole('button', { name: 'I reached my goal on the day I planned.' }).click().catch(() => {});
  await p.getByRole('button', { name: 'Scrapbook' }).click(); await shot5('31-scrapbook-page');
  await b5.close();
})();
console.log('M5 shots done');
// Phase A (R15, R16): the Clerk's cold open, the check-in, Spread out, the pull card, the confirm sheet with the pull, the recap line, Results naming the move
await (async () => {
  const b6 = await chromium.launch(); const p = await b6.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const shot6 = n => p.screenshot({ path: OUT + n + '.png', fullPage: true });
  const settle6 = async () => { for (let k = 0; k < 10; k++) { if (await p.locator('.screen.town').count() || await p.locator('.screen.results').count()) return; if (await p.locator('.screen.recap').count()) { await p.locator('#recap-go').click(); continue; } if (await p.locator('.screen.gazette').count()) { await p.getByRole('button', { name: 'Continue' }).click(); continue; } if (await p.locator('.screen.decision').count()) { if (await p.getByRole('button', { name: /^Buy it/ }).count()) await p.getByRole('button', { name: /^Buy it/ }).click(); else await p.getByRole('button', { name: 'Postpone my goal' }).click(); continue; } await p.waitForTimeout(100); } };
  const adv6 = async () => { await p.getByRole('button', { name: /^(Next year|Continue year)$/ }).click(); await p.locator('#go').click(); await p.getByRole('button', { name: 'Skip' }).click(); await settle6(); };
  await p.goto('file://' + resolve(ROOT, 'index.html'));
  await p.evaluate(() => { MS.newRun('ch2', 'Maple Hollow 7'); MS.go('town'); }); await shot6('40-ch2-coldopen');
  await p.getByRole('button', { name: 'Start exploring' }).click(); await shot6('41-ch2-checkin-start');
  await p.locator('.tile').nth(1).click(); for (let i = 0; i < 5; i++) await p.locator('.steppers').getByRole('button', { name: 'Buy 1 share' }).click(); await shot6('42-ch2-checkin-one-shop');
  await p.locator('[data-move=spread] button').click(); await shot6('43-ch2-spread-queued');
  await adv6(); await shot6('44-ch2-town-year1');
  await adv6(); await shot6('45-ch2-pull-card');
  await p.locator('#pull-all').click(); await shot6('46-ch2-pull-queued');
  await p.getByRole('button', { name: 'Next year' }).click(); await shot6('47-ch2-confirm-pull');
  await p.locator('#go').click(); await p.getByRole('button', { name: 'Skip' }).click(); await shot6('48-ch2-recap-pull');
  await settle6(); await shot6('49-ch2-results');
  await b6.close();
  // one viewport (412 by 780, not the full page): the Town with the check-in showing and the pinned footer in view
  const b7 = await chromium.launch(); const q = await b7.newPage({ viewport: { width: 412, height: 780 }, deviceScaleFactor: 1 });
  await q.goto('file://' + resolve(ROOT, 'index.html'));
  await q.evaluate(() => { MS.newRun('ch2', 'Maple Hollow 7'); MS.S.ui.intro = false; MS.go('town'); });
  await q.locator('.tile').nth(1).click(); for (let i = 0; i < 5; i++) await q.locator('.steppers').getByRole('button', { name: 'Buy 1 share' }).click(); await q.locator('.tile').nth(1).click();
  await q.locator('.clerk').evaluate(e => e.scrollIntoView({ block: 'center' })); await q.screenshot({ path: OUT + '50-ch2-checkin-viewport-412x780.png' });
  await b7.close();
})();
console.log('phase A shots done');
