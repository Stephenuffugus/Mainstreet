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
await page.getByRole('button', { name: 'Start exploring' }).click(); await shot('3-town-step2');
await page.getByRole('button', { name: 'Put 30 in my Jar' }).click(); await page.locator('.shop-face').click(); await page.locator('.steppers').getByRole('button', { name: 'Buy 1 share' }).click(); await shot('4-town-tray');
await page.getByRole('button', { name: 'Next season' }).click(); await shot('5-confirm');
await page.locator('#go').click(); await page.waitForTimeout(1300); await shot('6-show');
await page.getByRole('button', { name: 'Skip' }).click(); await shot('7-town-spring');
for (let i = 0; i < 3; i++) { await page.getByRole('button', { name: 'Next season' }).click(); await page.locator('#go').click(); await page.getByRole('button', { name: 'Skip' }).click(); if (i === 0) await shot('8-town-drop'); }
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
  await p2.getByRole('button', { name: 'Skip' }).click(); await shot2('17-ch2-gazette');
  await p2.getByRole('button', { name: 'Continue' }).click();
  for (let i = 0; i < 2; i++) { await p2.getByRole('button', { name: 'Next year' }).click(); await p2.locator('#go').click(); await p2.getByRole('button', { name: 'Skip' }).click(); if (await p2.locator('.screen.gazette').count()) await p2.getByRole('button', { name: 'Continue' }).click(); }
  if (await p2.locator('.screen.decision').count()) await p2.getByRole('button', { name: /^Buy it/ }).click();
  await shot2('18-ch2-results');
  await p2.getByRole('button', { name: 'Scrapbook' }).click(); await shot2('19-scrapbook');
  await b2.close();
})();
console.log('chapter 2 shots done');
