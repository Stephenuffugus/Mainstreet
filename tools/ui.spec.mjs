// Chapter 1 through the real UI, in a real browser. Evidence for the M2 exit conditions (HANDOFF 13) and the docs/playtest.md M2 checklist.
import { test, expect } from "@playwright/test";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const URL = "file://" + resolve(ROOT, "index.html");
// Under file:// WebKit logs a CORS error for the <link rel="manifest"> fetch; it does not happen over http and is not the game's doing.
const NOISE = /Access-Control-Allow-Origin|Failed to load resource/;
function watch(page) { const errors = []; page.on("pageerror", e => errors.push("pageerror: " + e.message)); page.on("console", m => { if (m.type() === "error" && !NOISE.test(m.text())) errors.push("console: " + m.text()); }); return errors; }
// R14: every advance now ends on the recap sheet; its one button (#recap-go) goes on to whatever arrive() opens next
async function passRecap(page) { await expect(page.locator(".screen.recap")).toBeVisible(); await page.locator("#recap-go").click(); }
async function skipShow(page) { await expect(page.locator(".screen.show")).toBeVisible(); await page.getByRole("button", { name: "Skip" }).click(); await passRecap(page); }

test("chapter 1 end to end: opening order, tray, confirm, show, Gazette, goal day, results", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await expect(page.locator("#s-title")).toBeVisible();
  await expect(page.locator("#build-stamp")).toContainText("build");
  await page.getByRole("button", { name: "Start chapter 1" }).click();
  await expect(page.getByText("These are pretend coins")).toBeVisible();                       // step 1
  await page.getByRole("button", { name: "Start exploring" }).click();
  await expect(page.getByText("Some for soon. Some to try growing.")).toBeVisible();          // step 2
  await expect(page.locator(".money").first()).toContainText("100");
  await expect(page.getByRole("button", { name: "Next season" })).toBeDisabled();
  await page.getByRole("button", { name: "Put 30 in my Jar" }).click();                       // step 3
  await expect(page.locator(".band.soon")).toContainText("Soon 30");
  await page.locator(".shop-face").click();                                                   // step 4: tap the Bakery
  await expect(page.locator(".share-grid")).toBeVisible();
  await expect(page.getByText("A share is one tiny piece of this business. Each one costs 10 right now.")).toBeVisible();
  await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();                          // step 5
  await expect(page.locator(".tray")).toContainText("+1 share Rise & Shine Bakery");
  await expect(page.getByText("1 share for 10 coins. 60 coins stay in your wallet.")).toBeVisible();
  await expect(page.locator(".money").nth(1)).toContainText("60");
  await expect(page.locator(".own")).toContainText("1 share");
  // refresh mid-stop: the tray and the draft come back exactly
  await page.reload();
  await expect(page.locator(".tray")).toContainText("+1 share Rise & Shine Bakery");
  await expect(page.locator(".band.soon")).toContainText("Soon 30");
  await expect(page.locator(".money").nth(1)).toContainText("60");
  await page.getByRole("button", { name: "Next season" }).click();                            // step 6
  await expect(page.locator(".sheet")).toContainText("Buy 1 share of Rise & Shine Bakery for 10 coins");
  await page.locator("#go").click();
  await expect(page.locator(".receipt")).toContainText("You own 1 share.");                  // step 7 receipt
  await skipShow(page);
  await expect(page.getByText("Same share. A different price.")).toBeVisible();              // step 8
  await expect(page.locator(".price strong")).toContainText("11");
  await expect(page.locator(".tray")).toHaveCount(0);                                        // undo is gone after a commit
  await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click(); await skipShow(page);
  await expect(page.getByText("Prices fell, from 11 to 9.")).toBeVisible();               // step 9 (FT1)
  await expect(page.locator(".price strong")).toContainText("9");
  await expect(page.locator(".steppers").getByRole("button", { name: "Sell 1 share" })).toBeEnabled(); // buy and sell both available at a drop
  await expect(page.locator(".steppers").getByRole("button", { name: "Buy 1 share" })).toBeEnabled();
  await page.getByRole("button", { name: "Review my plan" }).click();
  await expect(page.locator(".screen.plan")).toBeVisible();
  await page.getByRole("button", { name: "Keep my plan" }).click();
  await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click(); await skipShow(page);
  await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click(); await skipShow(page);
  await expect(page.locator(".masthead")).toContainText("Gazette");                          // year recap
  await expect(page.locator(".money-story")).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Your goal day has arrived")).toBeVisible();                   // E21
  await page.getByRole("button", { name: "Buy it from my Jar" }).click();
  await expect(page.locator(".screen.results")).toBeVisible();
  await expect(page.locator(".lead")).toContainText("You planned for this!");
  await expect(page.locator(".stamps")).toContainText("Pulled money to the goal in time");      // rc5: stamps read as moves
  await expect(page.locator(".stamps")).toContainText("Checked the plan when prices fell");
  await expect(page.locator(".stamp-row").filter({ hasText: "Spread out" })).toContainText("Coming later");
  await page.getByRole("button", { name: "Show details" }).click();
  await expect(page.getByText(/Plan Practice \d+ of 100/)).toBeVisible();
  await page.locator(".deco").nth(1).click();
  await page.getByRole("button", { name: "Save and stop" }).click();
  await expect(page.locator("#s-title")).toBeVisible();
  await expect(page.locator(".chapter.done")).toContainText("A Little Piece");
  expect(errors, errors.join("\n")).toEqual([]);
});

test("an accidental tap on a stepper changes the tray, never the ledger; Clear plan empties it", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click();
  await page.getByRole("button", { name: "Start exploring" }).click();
  await page.getByRole("button", { name: "Put 30 in my Jar" }).click();
  await page.locator(".shop-face").click();
  const plus = page.locator(".steppers").getByRole("button", { name: "Buy 1 share" });
  await plus.click(); await plus.click(); await plus.click();
  await expect(page.locator(".tray li")).toHaveCount(4);
  await expect(page.locator(".own")).toContainText("3 shares");
  const committed = await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.pos.BAKE || 0);
  expect(committed).toBe(0);
  await page.getByRole("button", { name: "Show plan" }).click();                           // the tray is one line until opened (second play, 11 Oct)
  await page.getByRole("button", { name: "Undo +1 share Rise & Shine Bakery (−10)" }).first().click();
  await expect(page.locator(".own")).toContainText("2 shares");
  await page.getByRole("button", { name: "Clear plan" }).click();
  await expect(page.locator(".tray")).toHaveCount(0);
  await expect(page.locator(".money").nth(1)).toContainText("100");
  expect(errors, errors.join("\n")).toEqual([]);
});

test("the show and skipping it never change a number", async ({ page }) => {
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click();
  await page.getByRole("button", { name: "Start exploring" }).click();
  await page.getByRole("button", { name: "Put 30 in my Jar" }).click();
  await page.locator(".shop-face").click();
  await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  await page.getByRole("button", { name: "Next season" }).click();
  await page.locator("#go").click();
  const during = await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.history.map(h => h.nw));
  await skipShow(page);
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.history.map(h => h.nw));
  expect(after).toEqual(during);
  expect(after.length).toBe(4);
});

test("keyboard only: start, jar, pick the shop, buy, next season, confirm, skip the show", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  async function pressUntil(label) { for (let i = 0; i < 60; i++) { await page.keyboard.press("Tab"); const t = await page.evaluate(() => { const a = document.activeElement; return a ? ((a.getAttribute("aria-label") || a.textContent) || "").trim() : ""; }); if (t.startsWith(label)) { await page.keyboard.press("Enter"); return; } } throw new Error("not reachable by Tab: " + label); }
  await pressUntil("Start chapter 1"); await pressUntil("Start exploring"); await pressUntil("Put 30 in my Jar"); await pressUntil("Rise & Shine Bakery"); await pressUntil("Buy 1 share");
  await expect(page.locator(".tray")).toContainText("+1 share");
  await pressUntil("Next season"); await pressUntil("Go to spring"); await pressUntil("Skip"); await pressUntil("Back to town");
  await expect(page.locator(".screen.town")).toBeVisible(); await expect(page.locator(".price strong")).toContainText("11");
  expect(errors, errors.join("\n")).toEqual([]);
});

/* ---- M3 journeys: chapters 2 and 3 ---- */
async function advanceOnce(page) {
  const next = page.getByRole("button", { name: /^(Next year|Continue year|Next season)$/ });
  await next.click(); await page.locator("#go").click(); await skipShow(page);
}
async function settle(page, onCost, opts) {
  // after a show: handle whatever screen arrived, until the town or the results page is showing
  // rc5 (DECK3): goals sit above what saving alone reaches, so goal day can be short (then the goal is postponed), and the pull card opens itself at the goal fit checkpoint (closed here with "Keep growing" unless the journey wants it)
  for (let i = 0; i < 6; i++) {
    if (await page.locator(".screen.town").count()) { if (!(opts && opts.keepPull) && await page.locator("#pull-keep").count()) await page.locator("#pull-keep").click(); return "town"; }
    if (await page.locator(".screen.results").count()) return "results";
    if (await page.locator(".screen.recap").count()) { await page.locator("#recap-go").click(); continue; }
    if (await page.locator(".screen.gazette").count()) { await page.getByRole("button", { name: "Continue" }).click(); continue; }
    if (await page.locator(".screen.decision").count()) {
      if (await page.getByText("Your goal day has arrived").count()) { if (await page.getByRole("button", { name: /^Buy it/ }).count()) await page.getByRole("button", { name: /^Buy it/ }).click(); else await page.getByRole("button", { name: "Postpone my goal" }).click(); continue; }
      await onCost(page); continue;
    }
    await page.waitForTimeout(100);
  }
  throw new Error("did not settle");
}
test("chapter 2: six shops, the Basket, Ada and Dev; the chapter can be finished without trading; results compare the plans", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.newRun("ch2", "Pebble Creek 3"); MS.go("town"); });
  await expect(page.getByText("Different Shops")).toBeVisible();
  await expect(page.getByText("This is Ada.")).toBeVisible();
  await expect(page.getByText("This is Dev.")).toBeVisible();
  await page.getByRole("button", { name: "Start exploring" }).click();
  await expect(page.locator(".tile")).toHaveCount(7);
  await expect(page.locator(".house")).toHaveCount(2);
  await page.locator(".tile.stall").click();
  await expect(page.locator(".panel")).toContainText("Six shops in one town");
  await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  await page.locator(".tile").first().click();
  await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  await expect(page.locator(".tray li")).toHaveCount(2);
  await page.getByRole("button", { name: "My Plan" }).click();
  await expect(page.getByText("Where your invested money sits")).toBeVisible();
  await page.getByRole("button", { name: "Keep my plan" }).click();
  await advanceOnce(page);
  await expect(page.locator(".masthead")).toContainText("Gazette");
  await expect(page.locator(".gaz-nb")).toHaveCount(2);
  await page.getByRole("button", { name: "Continue" }).click();
  await advanceOnce(page); expect(await settle(page, async () => {})).toBe("town");
  await advanceOnce(page); expect(await settle(page, async () => {})).toBe("results");
  await expect(page.getByText("Every plan on this town")).toBeVisible();
  await expect(page.locator(".cols li")).toHaveCount(3);
  await expect(page.locator(".cols")).toContainText("Ada");
  await expect(page.locator(".cols")).toContainText("Dev");
  await expect(page.locator(".cols li").first()).toContainText(/You paid for your nature trip\.|Your nature trip has to wait\./);   // rc5: each plan says whether its goal was bought
  await expect(page.getByRole("button", { name: /Next chapter: Ready for Rain/ })).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});
test("chapter 3: the surprise cost arrives, every funding path is offered, the Buffer pays it, Bo paid from his jar", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.newRun("ch3", "Willow Bend 41"); MS.go("town"); });
  await expect(page.getByText(/A surprise cost may come this chapter: 15 to 30 coins/)).toBeVisible();
  await expect(page.getByText("This is Bo.")).toBeVisible();
  await page.getByRole("button", { name: "Start exploring" }).click();
  await expect(page.locator(".house")).toHaveCount(3);
  await page.getByRole("button", { name: "My Plan" }).click();
  const bufIn = page.getByRole("button", { name: "Put 5 coins in Buffer" });
  await bufIn.click(); await bufIn.click(); await bufIn.click(); await bufIn.click();
  await expect(page.locator(".band-row").filter({ hasText: "Buffer" })).toContainText("20");
  await page.getByRole("button", { name: "Keep my plan" }).click();
  await expect(page.locator(".band.buffer")).toContainText("Buffer 20");
  let paid = false;
  for (let i = 0; i < 5 && !paid; i++) {
    await advanceOnce(page);
    const where = await settle(page, async p => {
      await expect(p.getByText(/Your backpack strap broke/)).toBeVisible();
      await expect(p.getByRole("button", { name: /^Pay from my Buffer/ })).toBeVisible();
      await expect(p.getByRole("button", { name: /^Pay from my wallet/ })).toBeVisible();
      await expect(p.getByText("Bo pays surprise costs from his jar.")).toBeVisible();
      await p.getByRole("button", { name: /^Pay from my Buffer/ }).click(); paid = true;
    });
    if (where === "results") break;
  }
  expect(paid).toBe(true);
  await expect(page.locator(".hint")).toContainText(/You paid \d+ coins for a new backpack strap from your Buffer/);
  await expect(page.getByRole("button", { name: "Continue year" })).toBeVisible();
  // the payment sits in the plan tray until "Continue year" commits it (HANDOFF 5: decision choices take the same path)
  expect(await page.evaluate(() => MS.S.draft.totals.costSpending)).toBeGreaterThan(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.totals.costSpending)).toBe(0);
  await advanceOnce(page); await settle(page, async () => {});
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.totals.costSpending)).toBeGreaterThan(0);
  expect(errors, errors.join("\n")).toEqual([]);
});

/* ---- M4 journeys: chapters 4, 5 and 6, and the time machine ---- */
async function playThrough(page, onCost, onTown) {
  const seen = [];
  for (let i = 0; i < 14; i++) {
    if (await page.locator(".screen.results").count()) break;
    if (onTown) await onTown(page, seen);
    await advanceOnce(page);
    const where = await settle(page, onCost || (async p => { await p.getByRole("button", { name: /^Pay from my (Buffer|wallet|Saved)/ }).first().click(); }));
    if (where === "results") break;
  }
  return seen;
}
const readHint = async (page, seen) => { if (await page.locator(".hint").count()) seen.push(await page.locator(".hint").innerText()); };
test("chapter 4: practice coins, routing, dividends and the Reinvest toggle, the E18 stop, the time machine", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.newRun("ch4", "Harbor Lane 12"); MS.go("town"); });
  await expect(page.getByText(/adds 10 practice coins every month/)).toBeVisible();
  await page.getByRole("button", { name: "Start exploring" }).click();
  await page.locator(".tile").nth(1).click();                                           // the Bakery pays owners four times a year
  for (let i = 0; i < 4; i++) await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  await page.getByRole("button", { name: "My Plan" }).click();
  await page.locator("#route-select").selectOption("BASKET");
  await expect(page.locator("#route-select")).toHaveValue("BASKET");
  await expect(page.locator("input[name=reinvest]")).toHaveCount(0);                 // offered at month 12
  await page.getByRole("button", { name: "Keep my plan" }).click();
  await advanceOnce(page); expect(await settle(page, async () => {})).toBe("town");
  await page.getByRole("button", { name: "My Plan" }).click();
  await expect(page.locator("input[name=reinvest]")).toHaveCount(2);
  await page.locator("input[name=reinvest][value='1']").check();
  await page.getByRole("button", { name: "Keep my plan" }).click();
  const seen = await playThrough(page, null, readHint);
  expect(seen.join(" | ")).toMatch(/sharing less money with owners/);               // E18 stop
  await expect(page.locator(".screen.results")).toBeVisible();
  await expect(page.getByText(/Shops shared \d+ coins with you this chapter/)).toBeVisible();
  await expect(page.getByText(/You added 600\./)).toBeVisible();
  await page.getByRole("button", { name: "Try one change" }).click();
  await expect(page.locator(".gardens .garden")).toHaveCount(2);
  await page.locator("#tm-select").selectOption("start-early");
  await expect(page.getByText("Practice coins start arriving in month 25")).toBeVisible();
  await expect(page.getByRole("button", { name: "+ 1 year" })).toBeDisabled();            // the slider starts at the last year
  await page.getByRole("button", { name: "\u2212 1 year" }).click();
  await expect(page.locator(".garden .small").first()).toContainText("Year 4");
  await page.getByRole("button", { name: "Save to scrapbook" }).click();
  await expect(page.getByRole("status")).toContainText("Saved to your scrapbook.");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator(".screen.results")).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});
test("chapter 5: the slump stop, a closure on the street, Cass on the street, costs paid", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.newRun("ch5", "Clover Field 3"); MS.go("town"); });   // DECK3 re-keyed every town: this one has a closure (Toy Box) and the slump
  await expect(page.getByText("This is Cass.")).toBeVisible();
  await page.getByRole("button", { name: "Start exploring" }).click();
  await expect(page.locator(".house")).toHaveCount(4);
  await page.locator(".tile.stall").click();
  await page.locator(".steppers").getByRole("button", { name: "More" }).click();
  await page.getByRole("button", { name: /^Buy with half my wallet/ }).click();
  const cl = await page.evaluate(() => { const m = MS.S.market; return { id: m.closure.id, idx: m.scenario.assetIdx[m.closure.id], name: PARAMS.assets.find(a => a.id === m.closure.id).name, t: m.closure.announceT }; });
  await page.locator(".tile").nth(cl.idx).click();                                     // the shop that closes in this town
  await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  const seen = await playThrough(page, null, async (p, acc) => { await readHint(p, acc); if (await p.locator(".tile").nth(cl.idx).locator(".ph").filter({ hasText: "shop-" + cl.id.toLowerCase() + "-closed" }).count()) acc.push("TILE_CLOSED"); });
  expect(seen.join(" | ")).toMatch(/Many families are spending less/);
  expect(seen.join(" | ")).toContain(cl.name + " is closing");
  expect(seen.join(" | ")).toMatch(new RegExp(cl.name + " has closed\\. You got (about )?\\d+ coins back"));
  expect(seen).toContain("TILE_CLOSED");
  await expect(page.locator(".screen.results")).toBeVisible();
  await expect(page.locator(".cols")).toContainText("Cass");
  const liq = await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.totals.liquidationPaid);
  expect(liq).toBeGreaterThan(0);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("chapter 6: the fee lab, two baskets on the street, rising prices, the indexed goal, the lab result", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.newRun("ch6", "Lantern Row 5"); MS.go("town"); });
  await page.getByRole("button", { name: "Start exploring" }).click();
  await expect(page.getByText("Two baskets charge different fees")).toBeVisible();
  await page.getByRole("button", { name: "Read the cost card" }).first().click();
  await page.getByRole("button", { name: "Read the cost card" }).first().click();
  await expect(page.getByText("Basket A keeps 0.2 of every 100 coins each year.")).toBeVisible();
  await expect(page.getByText("Basket B keeps 1.5 of every 100 coins each year.")).toBeVisible();
  await page.getByRole("button", { name: "Choose Basket A" }).click();
  await expect(page.locator(".screen.town")).toBeVisible();
  await expect(page.locator(".tile.stall")).toHaveCount(2);
  await page.locator(".tile.stall").first().click();
  await page.locator(".steppers").getByRole("button", { name: "More" }).click();
  await page.getByRole("button", { name: /^Buy with half my wallet/ }).click();
  await page.getByRole("button", { name: "My Plan" }).click();
  await expect(page.getByText(/Your money could buy what/)).toBeVisible();
  await page.locator("#route-select").selectOption("BASKET_A");
  await page.getByRole("button", { name: "Keep my plan" }).click();
  const seen = await playThrough(page, null, readHint);
  await expect(page.locator(".screen.results")).toBeVisible();
  await expect(page.getByText(/On the same shops, Basket A ended at/)).toBeVisible();
  await expect(page.locator(".stamp-row").filter({ hasText: "Read the cost card" })).toContainText("You read both cost cards before choosing.");
  await page.getByRole("button", { name: "Try one change" }).click();
  await page.locator("#tm-select").selectOption("fee");
  await expect(page.getByText(/Basket B, 1.5 of every 100 coins a year/)).toBeVisible();
  await page.getByRole("checkbox", { name: "Show what it can buy" }).check();
  await expect(page.locator(".gardens .garden")).toHaveCount(2);
  expect(errors, errors.join("\n")).toEqual([]);
});

/* ---- M5 journeys: free play, overflow sweep, export and import, recovery, the two-tab lock, offline after install ---- */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
let server = null, base = "";
test.beforeAll(async () => {
  server = createServer(async (req, res) => {
    let path = decodeURIComponent(new globalThis.URL(req.url, "http://x").pathname); if (path.endsWith("/")) path += "index.html";
    try { const data = await readFile(resolve(ROOT, "." + path)); const ext = path.split(".").pop();
      res.writeHead(200, { "content-type": ({ html: "text/html", js: "text/javascript", json: "application/json", webmanifest: "application/manifest+json", png: "image/png", webp: "image/webp" })[ext] || "application/octet-stream", "cache-control": "no-cache" }); res.end(data); }
    catch { res.writeHead(404); res.end(); }
  });
  await new Promise(r => server.listen(0, "127.0.0.1", r)); base = "http://127.0.0.1:" + server.address().port + "/";
});
test.afterAll(() => { if (server) server.close(); });

test("free play: unlocked after chapter 6, a preset and a typed town name, the name round-trips, four neighbors", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await expect(page.getByText("Free play opens after chapter 6.")).toBeVisible();
  await page.evaluate(() => { MS.S.progress.completedChapters = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6"]; MS.render(); });
  await page.getByRole("button", { name: "Free play" }).click();
  await page.getByRole("radio", { name: /Early Storm/ }).check();
  await page.locator("#town-name").fill("  maple   hollow 7!! ");
  await page.locator("#free-start").click();
  await expect(page.getByText("Maple Hollow 7").first()).toBeVisible();
  await expect(page.getByText(/Early Storm: A slump begins in the first year/)).toBeVisible();
  await page.getByRole("button", { name: "Start exploring" }).click();
  await expect(page.locator(".house")).toHaveCount(4);
  await expect(page.locator(".town-title")).toContainText("Maple Hollow 7");
  const seed = await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).seed);
  expect(seed).toBe("Maple Hollow 7");
  await advanceOnce(page); expect(await settle(page, async p => { await p.getByRole("button", { name: /^Pay from my/ }).first().click(); })).toBe("town");
  const hint = await page.locator(".hint").count() ? await page.locator(".hint").innerText() : "";
  expect(hint + (await page.evaluate(() => MS.S.market.moods.slice(1, 13).join("")))).toMatch(/S|spending less/);
  expect(errors, errors.join("\n")).toEqual([]);
});
for (const [w, h] of [[412, 915], [375, 667], [320, 568]]) test(`no horizontal overflow at ${w}x${h} on Home, intro, Town, the sheet, the show, the Gazette and Results`, async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const page = await ctx.newPage();
  const noOverflow = async label => { const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); expect(over, label + " overflows by " + over + "px at " + w).toBeLessThanOrEqual(0); };
  await page.goto(URL); await noOverflow("home");
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await noOverflow("intro");
  await page.getByRole("button", { name: "Start exploring" }).click(); await page.getByRole("button", { name: "Put 30 in my Jar" }).click(); await page.locator(".shop-face").click(); await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click(); await noOverflow("town");
  await page.getByRole("button", { name: "Next season" }).click(); await noOverflow("confirm sheet"); await page.locator("#go").click(); await expect(page.locator(".screen.show")).toBeVisible(); await noOverflow("show"); await page.getByRole("button", { name: "Skip" }).click(); await expect(page.locator(".screen.recap")).toBeVisible(); await noOverflow("recap"); await page.locator("#recap-go").click();
  for (let i = 0; i < 3; i++) { await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click(); await page.getByRole("button", { name: "Skip" }).click(); await page.locator("#recap-go").click(); }
  await expect(page.locator(".masthead")).toBeVisible(); await noOverflow("gazette"); await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /^Buy it/ }).click(); await expect(page.locator(".screen.results")).toBeVisible(); await noOverflow("results");
  await page.getByRole("button", { name: "My Plan" }).click(); await noOverflow("plan");
  await ctx.close();
});
test("export and import: a town file round-trips; a crafted file is refused and renders nothing", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Start exploring" }).click(); await page.getByRole("button", { name: "Put 30 in my Jar" }).click();
  // the download itself cannot be observed headless, so capture the anchor the exporter creates
  await page.goto(URL + "?debug=1");
  await expect(page.getByText("Export JSON")).toBeVisible();
  const json = await page.evaluate(() => { let captured = null; const orig = document.body.appendChild.bind(document.body); document.body.appendChild = n => { if (n.tagName === "A" && n.download) { captured = decodeURIComponent(n.href.split(",")[1]); return n; } return orig(n); }; const btns = [...document.querySelectorAll("main.debug button")]; btns.find(b => b.textContent === "Export JSON").click(); document.body.appendChild = orig; return captured; });
  const parsed = JSON.parse(json); expect(parsed.app).toBe("mainstreet"); expect(parsed.save.seed.length).toBeGreaterThan(0);
  // wipe and import through Settings
  await page.evaluate(() => { localStorage.removeItem("ms:save"); });
  await page.goto(URL); await page.getByRole("button", { name: "Settings" }).click();
  await page.locator("#import-file").setInputFiles({ name: "town.json", mimeType: "application/json", buffer: Buffer.from(json) });
  await expect(page.getByText("Replace my current town with the imported one?")).toBeVisible();
  await page.getByRole("button", { name: "Yes, replace it" }).click();
  await expect(page.locator(".screen.town")).toBeVisible();
  await expect(page.locator(".band.soon")).toContainText("Soon 30");
  // crafted file: HTML strings, __proto__, oversized numbers
  await page.getByRole("button", { name: "Home" }).click(); await page.getByRole("button", { name: "Settings" }).click();
  const crafted = JSON.stringify({ app: "mainstreet", kind: "town-file", engineVersion: parsed.engineVersion, contentVersion: parsed.contentVersion, save: Object.assign(JSON.parse(JSON.stringify(parsed.save)), { seed: "<img src=x onerror=alert(1)>", checkpoint: Object.assign(parsed.save.checkpoint, { wallet: 1e300, __proto__: { polluted: true } }) }) });
  await page.locator("#import-file").setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from(crafted) });
  await expect(page.getByText("That file is not a MAINSTREET town file.")).toBeVisible();
  expect(await page.evaluate(() => ({}).polluted)).toBeUndefined();
  expect(await page.locator("img[src='x']").count()).toBe(0);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("recovery: a damaged save is kept aside, the backup can be tried, the player can start new", async ({ page }) => {
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Start exploring" }).click(); await page.getByRole("button", { name: "Put 30 in my Jar" }).click();
  await page.evaluate(() => { localStorage.setItem("ms:save", "{not json"); });
  await page.reload();
  await expect(page.getByText("A saved town could not be read")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("ms:save:bad"))).toBe("{not json");
  await page.getByRole("button", { name: "Try the backup" }).click();
  await expect(page.locator(".screen.town")).toBeVisible();                     // the backup is the save from one step earlier: the town is back, the last queued action may not be
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).scenarioId)).toBe("ch1");
});
test("two tabs: the second tab is read-only until it takes over, then the first goes read-only", async ({ browser }) => {
  const ctx = await browser.newContext(); const p1 = await ctx.newPage();
  await p1.goto(URL); await p1.getByRole("button", { name: "Start chapter 1" }).click(); await p1.getByRole("button", { name: "Start exploring" }).click();
  const p2 = await ctx.newPage(); await p2.goto(URL);
  await expect(p2.getByText("This town is open in another tab")).toBeVisible();
  await p2.getByRole("button", { name: "Take over" }).click();
  await expect(p2.getByText("This town is open in another tab")).toHaveCount(0);
  await expect(p1.getByText("This town is open in another tab")).toBeVisible({ timeout: 10000 });
  await ctx.close();
});
test("offline after install: once the worker has cached the game, it loads and plays with the network off", async ({ browser }) => {
  const ctx = await browser.newContext(); const page = await ctx.newPage();
  await page.goto(base + "index.html");
  // install finished (every precached sprite included), activated, and the page is controlled
  await page.waitForFunction(() => navigator.serviceWorker.getRegistration().then(r => !!(r && r.active && r.active.state === "activated" && !r.installing && !r.waiting)), null, { timeout: 30000 });
  await page.waitForFunction(() => caches.match("index.html", { ignoreSearch: true }).then(r => !!r), null, { timeout: 20000 });
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 20000 });
  await ctx.setOffline(true);
  await page.reload();
  await expect(page.locator("#s-title")).toBeVisible();
  await page.getByRole("button", { name: "Start chapter 1" }).click();
  await expect(page.getByText("These are pretend coins")).toBeVisible();
  await ctx.close();
});

test("embed protocol: framed with ?embed=1 the game posts ready, registers no worker, and the exit button posts close", async ({ page }) => {
  await page.goto(base + "tools/replay.html");                      // any same-server page as the parent
  await page.setContent(`<!doctype html><html><body><script>window.__msgs = []; window.addEventListener("message", e => window.__msgs.push(e.data));</script><iframe id="f" src="${base}index.html?embed=1" style="width:412px;height:915px"></iframe></body></html>`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__msgs.some(m => m && m.sws === "ready"), null, { timeout: 15000 });
  const frame = page.frameLocator("#f");
  await expect(frame.locator("#s-title")).toBeVisible();
  const reg = await page.frames()[1].evaluate(() => navigator.serviceWorker.getRegistration().then(r => !!r));
  expect(reg).toBe(false);
  await frame.getByRole("button", { name: "← All Sky Wolf games" }).click();
  await page.waitForFunction(() => window.__msgs.some(m => m && m.sws === "close"), null, { timeout: 5000 });
  const msgs = await page.evaluate(() => window.__msgs.map(m => m && m.sws));
  expect(msgs.filter(m => m === "close").length).toBe(1);
  expect(msgs.every(m => m === "ready" || m === "close")).toBe(true);                // nothing else leaves the frame: no earn messages
});

/* ---- M7 journeys: focus, sound, the remaining manual checklist items ---- */
test("focus: a screen change lands on the heading, an in-screen action keeps focus on its control, a sheet takes focus", async ({ page }) => {
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Start exploring" }).click();
  expect(await page.evaluate(() => /^H[12]$/.test(document.activeElement.tagName) || document.activeElement.getAttribute("role") === "heading")).toBe(true);
  await page.getByRole("button", { name: "Put 30 in my Jar" }).click();
  await page.locator(".shop-face").click();
  const buy = page.locator(".steppers").getByRole("button", { name: "Buy 1 share" });
  await buy.focus(); await page.keyboard.press("Enter");
  await expect(page.locator(".own")).toContainText("1 share");
  expect(await page.evaluate(() => document.activeElement.getAttribute("aria-label") || document.activeElement.textContent.trim())).toBe("Buy 1 share");
  await page.getByRole("button", { name: "Next season" }).click();
  expect(await page.evaluate(() => !!document.activeElement.closest('[role="dialog"]'))).toBe(true);
});
test("sound: off by default, the Settings toggle persists, a show with sound on raises no errors", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  expect(await page.evaluate(() => MS.S.options.sound)).toBe(false);
  await page.getByRole("button", { name: "Settings" }).click();
  await page.locator("#opt-sound").check();
  expect(await page.evaluate(() => MS.S.options.sound)).toBe(true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:settings")).options.sound)).toBe(true);
  await page.getByRole("button", { name: "Home" }).click();
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Start exploring" }).click(); await page.getByRole("button", { name: "Put 30 in my Jar" }).click(); await page.locator(".shop-face").click(); await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  await advanceOnce(page);
  await expect(page.locator(".screen.town")).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});
test("blocked storage: with localStorage throwing, Home says it is playing without saving, play continues, Export is still offered", async ({ page }) => {
  await page.addInitScript(() => { const bad = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); }, key() { return null; }, clear() {}, get length() { return 0; } }; Object.defineProperty(window, "localStorage", { get: () => bad }); });
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Start exploring" }).click(); await page.getByRole("button", { name: "Put 30 in my Jar" }).click();
  await expect(page.locator(".band.soon")).toContainText("Soon 30");
  await expect(page.getByText("Playing without saving on this device.")).toBeVisible();      // the banner appears once a save has failed
  await page.getByRole("button", { name: "Home" }).click(); await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByRole("button", { name: "Export my town" })).toBeVisible();
});
test("exit: with no history the title button replaces the page with the portal; with a portal referrer it steps back", async ({ page }) => {
  await page.route("https://lucidwinds.com/**", r => r.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Portal stub</title><h1>Portal</h1>" }));
  await page.goto(base + "index.html");
  await page.getByRole("button", { name: "← All Sky Wolf games" }).click();
  await page.waitForURL("https://lucidwinds.com/portal/");
  await page.goto("https://lucidwinds.com/portal/");
  await page.goto(base + "index.html", { referer: "https://lucidwinds.com/portal/" });
  await page.getByRole("button", { name: "← All Sky Wolf games" }).click();
  await page.waitForURL("https://lucidwinds.com/portal/");
  await expect(page.locator("h1")).toHaveText("Portal");
});
test("hidden page: nothing advances and nothing repeats while the page is hidden", async ({ page }) => {
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Start exploring" }).click(); await page.getByRole("button", { name: "Put 30 in my Jar" }).click(); await page.locator(".shop-face").click(); await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  await advanceOnce(page);
  const before = await page.evaluate(() => JSON.stringify([MS.S.draft.t, MS.S.draft.wallet, MS.S.draft.totals]));
  await page.evaluate(() => { Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await page.waitForTimeout(1200);
  await page.evaluate(() => { Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  expect(await page.evaluate(() => JSON.stringify([MS.S.draft.t, MS.S.draft.wallet, MS.S.draft.totals]))).toBe(before);
});
test("update banner: shows on Home only, never on the Town, never when embedded", async ({ page }) => {
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Start exploring" }).click();
  await page.evaluate(() => { MS.S.ui.updateReady = { waiting: { postMessage() {} } }; MS.render(); });
  await expect(page.getByText("A new version is ready.")).toHaveCount(0);
  await page.getByRole("button", { name: "Home" }).click();
  await expect(page.getByText("A new version is ready.")).toBeVisible();
  await page.goto(URL + "?embed=1");
  await page.evaluate(() => { MS.S.ui.updateReady = { waiting: { postMessage() {} } }; MS.go("home"); });
  await expect(page.getByText("A new version is ready.")).toHaveCount(0);
});
test("reduced motion: the year show is a strip of still frames stepped by tap, never on a timer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Start exploring" }).click(); await page.getByRole("button", { name: "Put 30 in my Jar" }).click(); await page.locator(".shop-face").click(); await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click();
  await expect(page.locator(".screen.show")).toBeVisible();
  const next = page.getByRole("button", { name: "Next month" }); await expect(next).toBeVisible();
  const first = await page.locator(".screen.show h2.month").innerText();
  await page.waitForTimeout(1300);
  expect(await page.locator(".screen.show h2.month").innerText()).toBe(first);
  await next.click();
  expect(await page.locator(".screen.show h2.month").innerText()).not.toBe(first);
  await page.getByRole("button", { name: "Skip" }).click();
  await passRecap(page);
  await expect(page.locator(".screen.town")).toBeVisible();
});
test("town screen answers what you own, what you spent and what is left", async ({ page }) => {
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Start exploring" }).click(); await page.getByRole("button", { name: "Put 30 in my Jar" }).click();
  await page.locator(".shop-face").click(); await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  await expect(page.locator(".money-row")).toContainText("Wallet");
  await expect(page.locator(".money-row")).toContainText("Spent");
  await expect(page.locator(".money-row")).toContainText("Jar");
  await expect(page.locator(".own")).toContainText("1 share");
});

test("the year show renders news cards as elements: stepping twelve months under reduced motion never prints an object", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(URL);
  await page.evaluate(() => { MS.newRun("ch2", "Pebble Creek 3"); MS.S.ui.intro = false; MS.go("town"); });
  await page.getByRole("button", { name: /^(Next year|Continue year)$/ }).click(); await page.locator("#go").click();
  await expect(page.locator(".screen.show")).toBeVisible();
  let news = 0;
  for (let i = 0; i < 12; i++) {
    expect(await page.evaluate(() => document.body.innerText.includes("[object"))).toBe(false);
    news += await page.locator(".news strong").count();
    const next = page.getByRole("button", { name: /^(Next month|Continue)$/ }); if (await next.count()) await next.click(); else break;
  }
  expect(news).toBeGreaterThan(0);
});

/* ---- M8: music, assigned by feel; routed silent audio so no song needs to exist in the repo ---- */
function silentWav(seconds = 1) { const rate = 8000, n = rate * seconds, b = Buffer.alloc(44 + n); b.write("RIFF", 0); b.writeUInt32LE(36 + n, 4); b.write("WAVE", 8); b.write("fmt ", 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate, 28); b.writeUInt16LE(1, 32); b.writeUInt16LE(8, 34); b.write("data", 36); b.writeUInt32LE(n, 40); b.fill(128, 44); return b; }
async function routeMusic(page) {
  await page.route("**/music/manifest.json", r => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ tracks: [{ file: "calm.wav", title: "Calm Street", feel: "calm", loop: true }, { file: "bright.wav", title: "Bright Morning", feel: "bright", loop: true }], map: { default: "calm", gazette: "bright", "show-sun": "bright" } }) }));
  await page.route("**/music/*.wav", r => r.fulfill({ status: 200, contentType: "audio/wav", body: silentWav() }));
}
test("music: off by default, nothing plays before a tap, the Home toggle starts it, the feel follows the screen", async ({ page, browserName }) => {
  const errors = watch(page); await routeMusic(page);
  await page.goto(base + "index.html");
  await expect(page.getByRole("button", { name: /Music off/ })).toBeVisible();
  expect(await page.evaluate(() => MS.music.state())).toMatchObject({ available: true, on: false, track: null, playing: false });
  await page.getByRole("button", { name: /Music off/ }).click();
  await expect(page.getByRole("button", { name: /Music on/ })).toBeVisible();
  await expect.poll(() => page.evaluate(() => MS.music.state().track)).toBe("Calm Street");
  if (browserName === "chromium") await expect.poll(() => page.evaluate(() => MS.music.state().playing)).toBe(true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:settings")).options.music)).toBe(true);
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Start exploring" }).click(); await page.getByRole("button", { name: "Put 30 in my Jar" }).click();
  await page.locator(".shop-face").click(); await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  expect(await page.evaluate(() => MS.music.state().track)).toBe("Calm Street");               // same feel, no switch
  for (let i = 0; i < 4; i++) { await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click(); await page.getByRole("button", { name: "Skip" }).click(); await page.locator("#recap-go").click(); }
  await expect(page.locator(".masthead")).toBeVisible();
  await expect.poll(() => page.evaluate(() => MS.music.state().feel)).toBe("bright");
  await expect.poll(() => page.evaluate(() => MS.music.state().track)).toBe("Bright Morning");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator(".screen.decision")).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});
test("music: with no tracks there are no music controls and Settings says so", async ({ page }) => {
  const errors = watch(page);
  await page.goto(base + "index.html");
  await expect(page.getByRole("button", { name: /Music/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByText("No music files in this build yet.")).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});
test("music: the arcade's host-music message mutes and unmutes; Settings shows the volume and what is playing", async ({ page, browserName }) => {
  await routeMusic(page);
  await page.goto(base + "index.html");
  await page.getByRole("button", { name: /Music off/ }).click();
  await expect.poll(() => page.evaluate(() => MS.music.state().track)).toBe("Calm Street");
  await page.evaluate(() => window.postMessage({ sws: "host-music", on: true }, "*"));
  await expect.poll(() => page.evaluate(() => MS.music.state().muted)).toBe(true);
  expect(await page.evaluate(() => MS.music.state().playing)).toBe(false);
  await page.evaluate(() => window.postMessage({ sws: "host-music", on: false }, "*"));
  await expect.poll(() => page.evaluate(() => MS.music.state().muted)).toBe(false);
  if (browserName === "chromium") await expect.poll(() => page.evaluate(() => MS.music.state().playing)).toBe(true);
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.locator("#opt-music")).toBeChecked();
  await page.locator("#opt-music-vol").fill("20");
  expect(await page.evaluate(() => MS.S.options.musicVolume)).toBe(20);
  await expect(page.locator("#now-playing")).toContainText("Now playing: Calm Street");
});

/* ---- R14 (Stephen's first play, 2026-10-11): it must explain itself. Before, during and after every advance, and a guide at every chapter 1 stop ---- */
async function ch1Bought(page, n) {
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Start exploring" }).click(); await page.getByRole("button", { name: "Put 30 in my Jar" }).click();
  await page.locator(".shop-face").click();
  for (let i = 0; i < n; i++) await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
}
test("R14 recap: after the first season it says the price went from 10 to 11 and the share is still yours; a reload falls through to the town; the year end goes on to the Gazette", async ({ page }) => {
  const errors = watch(page);
  await ch1Bought(page, 1);
  await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click();
  await page.getByRole("button", { name: "Skip" }).click();
  const recap = page.locator(".screen.recap");
  await expect(recap).toBeVisible();
  await expect(recap.locator("h2")).toHaveText("Winter is done");
  await expect(recap).toContainText("Rise & Shine Bakery: from 10 to 11 a share.");
  await expect(recap).toContainText("Your 1 share of Rise & Shine Bakery: from 10 to 11 coins.");
  await expect(recap).toContainText("Still yours: 1 share.");
  await expect(recap).toContainText("3 busy months at the bakery.");
  await expect(recap).toContainText("From 100 to 101.");
  await expect(recap).toContainText("Jar 30 for your art supplies");
  await expect(recap.locator(".teach")).toHaveText("A share\u2019s price is what someone would pay for it right now. Today that is 11.");
  expect(await recap.innerText()).not.toMatch(/[–—!←-⇿▲▼]/);  // no dashes, no exclamation marks, no arrows or triangles: it reads aloud
  await expect(page.locator("#recap-go")).toHaveText("Back to town");
  await page.reload();                                                                          // the recap is never saved; a reload lands on the town with the stop's guide
  await expect(page.locator(".screen.town")).toBeVisible();
  await expect(page.locator(".hint")).toContainText("from 10 to 11");
  for (let i = 0; i < 3; i++) { await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click(); await page.getByRole("button", { name: "Skip" }).click(); if (i < 2) await passRecap(page); }
  await expect(recap.locator("h2")).toHaveText("Autumn is done");
  await expect(recap).toContainText("Prices barely moved. That happens too.");
  await expect(page.locator("#recap-go")).toHaveText("Continue");                            // the Gazette comes next, not the town
  await page.locator("#recap-go").click();
  await expect(page.locator(".masthead")).toContainText("Gazette");
  expect(errors, errors.join("\n")).toEqual([]);
});
test("R14 recap after a drop: the price fell, the shares did not; the busy-means-up story is never told", async ({ page }) => {
  const errors = watch(page);
  await ch1Bought(page, 2);
  await advanceOnce(page);
  await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click(); await page.getByRole("button", { name: "Skip" }).click();
  const recap = page.locator(".screen.recap");
  await expect(recap.locator("h2")).toHaveText("Spring is done");
  await expect(recap).toContainText("from 11 to 9 a share.");
  await expect(recap).toContainText("Your 2 shares of Rise & Shine Bakery: from 22 to 18 coins.");
  await expect(recap).toContainText("Still yours: 2 shares.");
  await expect(recap.locator(".teach")).toHaveText("Prices fell. Check when you need this money. You still own the same 2 shares.");
  expect(await recap.innerText()).not.toMatch(/busy.{0,40}(means|so).{0,20}(rise|higher|up)/i);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("R14 confirm sheet: the two futures in the player's own numbers, from the live quote; with nothing held it says prices cannot change your money", async ({ page }) => {
  const errors = watch(page);
  await ch1Bought(page, 3);
  await expect(page.getByText("3 shares for 30 coins. 40 coins stay in your wallet.")).toBeVisible();   // the guide follows the tray
  await page.getByRole("button", { name: "Next season" }).click();
  const fut = page.locator(".sheet .futures");
  await expect(fut).toContainText(/If the bakery.s price goes from 10 to 11, your 3 shares would be worth 33\. If it goes to 9, they would be worth 27\./);
  await expect(fut).toContainText("Either way you still own 3 shares, and your Jar keeps 30 for your art supplies.");
  await expect(fut).toContainText("Nobody knows which way prices go. That is why the money you need soon stays in the Jar.");
  await page.locator("#go").click(); await skipShow(page);
  await page.getByRole("button", { name: "Next season" }).click();
  await expect(fut).toContainText("goes from 11 to about 12, your 3 shares would be worth about 36");       // the next season starts from the live quote, 11
  await page.locator(".sheet").getByRole("button", { name: "Back to town" }).click();
  const minus = page.locator(".steppers").getByRole("button", { name: "Sell 1 share" });
  await minus.click(); await minus.click(); await minus.click();
  await page.getByRole("button", { name: "Next season" }).click();
  await expect(fut).toContainText("You hold no shares, so prices will not change your money this season.");
  expect(errors, errors.join("\n")).toEqual([]);
});
test("R14 show captions: every month has a line; one shop speaks through its keeper; on a street the line follows the month", async ({ page }) => {
  const errors = watch(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ch1Bought(page, 1);
  await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click();
  await expect(page.locator(".show-cap")).toHaveText("Busy at the bakery. Bram says, “Every tray gone by ten. Good day for bread.”");
  await page.evaluate(() => { MS.newRun("ch2", "Pebble Creek 3"); MS.S.ui.intro = false; MS.go("town"); });
  await page.getByRole("button", { name: /^(Next year|Continue year)$/ }).click(); await page.locator("#go").click();
  const caps = [];
  for (let i = 0; i < 12; i++) {
    caps.push(await page.locator(".show-cap").innerText());
    const next = page.getByRole("button", { name: /^(Next month|Continue)$/ }); if ((await next.innerText()) === "Continue") break; await next.click();
  }
  expect(caps.length).toBe(12);
  expect(new Set(caps).size).toBeGreaterThan(1);
  for (const c of caps) expect(c).toMatch(/^(Busy at .+\.|A busy month on the street\.|A quiet month on the street\.)$/);
  expect(caps.slice(1).some((c, i) => c !== caps[i])).toBe(true);                                // it changes from one frame to the next
  expect(errors, errors.join("\n")).toEqual([]);
});
test("R14 chapter 1 guide: the stops at 3, 6 and 9 months say what moved, from what to what, and what to do next", async ({ page }) => {
  const errors = watch(page);
  await ch1Bought(page, 1);
  await expect(page.locator(".hint .eyebrow")).toHaveText("Practice year");
  await advanceOnce(page);
  await expect(page.locator(".hint")).toContainText("Same share. A different price. The bakery’s price went from 10 to 11, so each share you own is worth 11 now.");
  await expect(page.locator(".hint")).toContainText("Try one, then tap Next season.");
  await advanceOnce(page);
  await expect(page.locator(".hint")).toContainText("Prices fell, from 11 to 9. Your share is worth less today, but you still own it. Selling now gives you 9 coins for it.");
  await expect(page.locator(".hint")).toContainText("Your art supplies money is safe in the Jar either way.");
  await expect(page.locator(".hint").getByRole("button", { name: "Review my plan" })).toBeVisible();
  await advanceOnce(page);
  await expect(page.locator(".hint")).toContainText("Prices came part way back, from 9 to 10.5. Next stop is goal day.");
  await expect(page.locator(".hint")).toContainText("Your 30 coins for art supplies have waited in the Jar all year.");
  await expect(page.locator(".price strong")).toHaveText("10.5");                             // the town shows the same 10.5 the guide says
  expect(errors, errors.join("\n")).toEqual([]);
});
test("R14 chapter 1 results: the year in prices, as one story", async ({ page }) => {
  const errors = watch(page);
  await ch1Bought(page, 1);
  for (let i = 0; i < 4; i++) { await advanceOnce(page); }
  await expect(page.locator(".masthead")).toBeVisible(); await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Buy it from my Jar" }).click();
  const card = page.locator(".card").filter({ hasText: "Your year in prices" });
  await expect(card).toContainText("You bought 1 share at 10 and kept it all year.");
  await expect(card).toContainText("The price was 11 in spring, 9 in summer, 10.5 in autumn and 10.5 in winter.");
  await expect(card).toContainText("Your shares ended worth 10.5.");
  await expect(card).toContainText("Your art supplies were bought from the Jar on goal day.");
  expect(errors, errors.join("\n")).toEqual([]);
});

/* ---- Phase A (R15, R16): the Town Clerk, the check-in, the pull card, the stake. docs/plans/PHASE-A-MOVES-AND-STAKE-2026-10-11.md ---- */
test("phase A cold open: the Clerk names the stake (goal, start, what saving alone reaches) and the chapter's move, from the content numbers", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.newRun("ch2", "Maple Hollow 7"); MS.go("town"); });
  const clerk = page.locator(".cold-open");
  await expect(clerk.locator(".eyebrow")).toHaveText("The Town Clerk");
  await expect(clerk).toContainText("Your nature trip costs 210 coins and is due in 36 months. You have 200 coins. Saving alone gets you 200. The rest has to grow.");
  await expect(clerk).toContainText("This year, try spreading out. Ada puts her coins in the Town Basket, a little of every shop. Dev picks one shop. Watch both.");
  expect(await page.evaluate(() => CONTENT.chapters.find(c => c.id === "ch2").goal.amount)).toBe(210);   // DECK3
  await page.evaluate(() => { MS.newRun("ch4", "Harbor Lane 12"); MS.go("town"); });
  await expect(page.locator(".cold-open")).toContainText("Your project kit costs 850 coins and is due in 60 months. You have 150 coins, and 10 coins arrive each month. Saving alone gets you about 797. The rest has to grow.");
  await page.evaluate(() => { MS.newRun("ch3", "Willow Bend 41"); MS.go("town"); });                    // chapter 3 kept its goal: the Clerk says saving reaches it
  await expect(page.locator(".cold-open")).toContainText("Saving alone gets you about 212, enough for this goal.");
  await expect(page.locator(".cold-open")).toContainText("between 15 and 30 coins");
  await page.evaluate(() => { MS.newRun("ch6", "Lantern Row 5"); MS.go("town"); });
  await expect(page.locator(".cold-open")).toContainText("Your big project costs 1500 coins today and is due in 120 months. Its price rises with everyday prices.");
  await expect(page.locator(".cold-open")).toContainText("and by then your big project will cost more than that. The rest has to grow.");
  await page.evaluate(() => { MS.newRun("ch1", "Maple Hollow 7"); MS.go("town"); });                    // chapter 1 keeps its practice intro, no Clerk
  await expect(page.locator(".clerk")).toHaveCount(0);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("phase A check-in: Spread out shows when one shop is held, queues a Basket buy into the open tray, and Undo takes it back", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.newRun("ch2", "Maple Hollow 7"); MS.S.ui.intro = false; MS.go("town"); });
  const checkin = page.locator(".clerk.checkin"), spread = checkin.locator("[data-move=spread]");
  await expect(checkin.locator(".eyebrow")).toHaveText("The Town Clerk");
  await expect(spread).toContainText("You hold no shares right now.");
  await page.locator(".tile").nth(1).click();
  await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  await expect(spread).toContainText("You hold one shop, Rise & Shine Bakery. One shop’s bad year would be your whole year.");
  const btn = spread.getByRole("button", { name: "Spread out" });
  expect((await btn.boundingBox()).height).toBeGreaterThanOrEqual(48);
  await btn.click();
  await expect(page.locator(".tray")).toHaveClass(/open/);
  const line = page.locator(".tray li").last();
  await expect(line).toContainText("Town Basket Fund");
  await expect(line).toBeInViewport();
  await expect(page.locator(".panel[data-shop=BASKET]")).toBeVisible();
  expect(await page.evaluate(() => MS.S.draft.wallet)).toBe(9000);                                  // half of the 180 left in the wallet
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.pos.BASKET || 0)).toBe(0);   // the tray, never the ledger
  await expect(spread).toHaveCount(0);
  await expect(checkin).toContainText("Nothing needs doing this year. Keep going.");
  await line.getByRole("button", { name: /^Undo/ }).click();
  await expect(spread).toHaveCount(1);
  expect(await page.evaluate(() => MS.S.draft.wallet)).toBe(18000);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("phase A pull card: at chapter 2's goal fit checkpoint it opens for a player holding shares with an empty Jar; Move queues sells and a Jar in; the confirm sheet lists them; after the advance Soon holds the amount; Results names the moves", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.newRun("ch2", "Maple Hollow 7"); MS.S.ui.intro = false; MS.go("town"); });
  await page.locator(".tile.stall").click();
  await page.locator(".steppers").getByRole("button", { name: "More" }).click();
  await page.getByRole("button", { name: /^Buy with all my wallet/ }).click();
  await advanceOnce(page); expect(await settle(page, async () => {}, { keepPull: true })).toBe("town");    // month 12: the row, not the card
  await expect(page.locator("#pull-all")).toHaveCount(0);
  await expect(page.locator("[data-move=pull]")).toContainText("Your nature trip is 24 months away. Your Jar holds 0 of 210 for it. Prices could fall before then.");
  await advanceOnce(page); expect(await settle(page, async () => {}, { keepPull: true })).toBe("town");    // month 24: the goal fit checkpoint
  const sheet = page.locator(".sheet");
  await expect(sheet).toContainText("Your nature trip is due in 12 months. You need 210 more in the Jar. Selling shares now turns today’s price into coins; keeping them means waiting to see.");
  await expect(page.locator("#pull-keep")).toHaveText("Keep growing, ask me next stop");
  await page.locator("#pull-all").click();                                                             // "Move 210 to my Jar now"
  await expect(page.locator(".tray li")).toHaveCount(2);
  await expect(page.locator(".tray li").first()).toContainText("Town Basket Fund");
  await expect(page.locator(".tray li").last()).toContainText("Put 210 in my Jar (Soon)");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.jar.soon)).toBe(0);   // nothing commits until Next year
  await page.getByRole("button", { name: "Next year" }).click();
  await expect(sheet).toContainText(/Sell \d+ shares of Town Basket Fund/);
  await expect(sheet).toContainText("Put 210 coins in your Jar");
  await page.locator("#go").click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page.locator(".screen.recap")).toContainText("You moved 210 to your Jar for your nature trip.");
  await page.locator("#recap-go").click();
  if (await page.locator(".screen.gazette").count()) await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Your goal day has arrived")).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.jar.soon)).toBe(21000);
  await page.getByRole("button", { name: "Buy it from my Jar" }).click();
  await expect(page.locator(".screen.results")).toBeVisible();
  const closing = page.locator(".closing-card");
  await expect(closing.locator(".eyebrow")).toHaveText("The Town Clerk");
  await expect(closing).toContainText("You pulled money toward your goal in time. You spread your money out.");
  await expect(page.locator(".stamp-row").filter({ hasText: "Pulled money to the goal in time" })).toContainText("You kept money ready for your nature trip and used it for that.");
  await expect(page.locator(".stamp-row").filter({ hasText: "Spread out" })).toContainText("spread across shops");
  expect(errors, errors.join("\n")).toEqual([]);
});
test("phase A closing card: a player who made no move hears so, the goal is postponed on a short goal day, and each plan says whether its goal was bought", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.newRun("ch2", "Maple Hollow 7"); MS.S.ui.intro = false; MS.go("town"); });
  for (let i = 0; i < 3; i++) { await advanceOnce(page); if (await settle(page, async () => {}) === "results") break; }
  await expect(page.locator(".screen.results")).toBeVisible();
  await expect(page.locator(".lead")).toContainText("You moved the date, and that is allowed.");          // 200 coins in the wallet cannot pay 210
  await expect(page.locator(".closing-card")).toContainText("You kept everything where it was. Next town, try one move.");
  await expect(page.locator(".cols li").first()).toContainText("Your nature trip has to wait.");
  await expect(page.locator(".cols li").nth(1)).toContainText(/Ada .*(She paid for her nature trip\.|Her nature trip has to wait\.)/);
  expect(errors, errors.join("\n")).toEqual([]);
});
