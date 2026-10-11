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
// R17: chapter 1 is a guided walk (docs/plans/CH1-WALK-IN-2026-10-11.md). walkCh1 performs it by its real controls: Start chapter 1 and Come in (0), Next on the money row (1),
// Next on the goal chip (2), Put 30 in my Jar then Next (3), the bakery tile (4), plus `shares` times then Next (5), Next on the plan tray (6), My Plan then the Clerk's Back to town (7),
// Next season (8), which opens the confirm sheet (step 9); the caller taps Go (#go). `from` and `to` run part of it: the walk stops when it is AT step `to`. `each(step)` runs on arrival at every step.
async function walkCh1(page, opts = {}) {
  const { from = 0, to = 9, shares = 1, each = null } = opts, card = page.locator(".walk-card"), next = () => card.getByRole("button", { name: "Next", exact: true }).click();
  const at = async n => { await expect(page.locator(".walk-layer")).toHaveAttribute("data-step", String(n)); if (each) await each(n); };
  const steps = [
    async () => { if (!(await page.getByRole("button", { name: "Come in" }).count())) await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Come in" }).click(); },
    async () => { await at(1); await next(); },
    async () => { await at(2); await next(); },
    async () => { await at(3); await card.getByRole("button", { name: "Put 30 in my Jar" }).click(); await expect(card).toContainText("is safe"); await next(); },
    async () => { await at(4); await page.locator(".shop-face").click(); },
    async () => { await at(5); for (let i = 0; i < shares; i++) await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click(); await next(); },
    async () => { await at(6); await next(); },
    async () => { await at(7); await page.getByRole("button", { name: "My Plan" }).click(); await page.locator(".screen.plan .plan-clerk").getByRole("button", { name: "Back to town" }).click(); },
    async () => { await at(8); await page.getByRole("button", { name: "Next season" }).click(); }
  ];
  for (let i = from; i < Math.min(to, 9); i++) await steps[i]();
  if (to >= 1 && to <= 9) await at(to);
}

test("chapter 1 end to end: the walk in, tray, confirm, show, Gazette, goal day, results", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await expect(page.locator("#s-title")).toBeVisible();
  await expect(page.locator("#build-stamp")).toContainText("build");
  await page.getByRole("button", { name: "Start chapter 1" }).click();
  await expect(page.locator(".cold-open")).toContainText("I am the Town Clerk. One shop is open this year, Bram\u2019s bakery");   // the Clerk at the door
  await page.getByRole("button", { name: "Come in" }).click();
  await expect(page.locator(".walk-card")).toContainText("Here are your coins: 100, all pretend.");                    // step 1, the money row
  await expect(page.locator(".money").first()).toContainText("100");
  await expect(page.getByRole("button", { name: "Next season" })).toBeDisabled();
  await walkCh1(page, { from: 1, to: 5 });                                                     // the goal chip, the Jar, the bakery
  await expect(page.locator(".band.soon")).toContainText("Soon 30");
  await expect(page.locator(".share-grid")).toBeVisible();
  await expect(page.locator(".walk-card")).toContainText("A share costs 10 right now.");    // step 5, the share card
  await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  await expect(page.locator(".tray")).toContainText("+1 share Rise & Shine Bakery");
  await expect(page.locator(".money").nth(1)).toContainText("60");
  await expect(page.locator(".own")).toContainText("1 share");
  // refresh mid walk: the tray, the draft and the step come back exactly
  await page.reload();
  await expect(page.locator(".walk-layer")).toHaveAttribute("data-step", "5");
  await expect(page.locator(".tray")).toContainText("+1 share Rise & Shine Bakery");
  await expect(page.locator(".band.soon")).toContainText("Soon 30");
  await expect(page.locator(".money").nth(1)).toContainText("60");
  await page.locator(".walk-card").getByRole("button", { name: "Next", exact: true }).click();
  await walkCh1(page, { from: 6 });                                                            // the tray, My Plan, Next season
  await expect(page.locator(".sheet")).toContainText("Buy 1 share of Rise & Shine Bakery for 10 coins");
  await expect(page.locator(".sheet .walk-card")).toContainText("Tap Go to spring.");        // step 9, the Clerk on the confirm sheet
  await page.locator("#go").click();
  await expect(page.locator(".receipt")).toContainText("You own 1 share.");                  // the receipt
  await skipShow(page);
  await expect(page.locator(".walk-layer")).toHaveCount(0);                                  // the walk is done
  await expect(page.getByText("Same share. A different price.")).toBeVisible();              // the spring stop guide
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
  await walkCh1(page, { to: 5 });
  const plus = page.locator(".steppers").getByRole("button", { name: "Buy 1 share" });
  await plus.click(); await plus.click(); await plus.click();                              // step 5 takes as many as the wallet allows
  await expect(page.locator(".tray li")).toHaveCount(4);
  await expect(page.locator(".own")).toContainText("3 shares");
  const committed = await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.pos.BAKE || 0);
  expect(committed).toBe(0);
  await page.locator(".walk-card").getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator(".tray")).toHaveClass(/open/);                                  // R17 step 6 lights the tray and opens it, so its Undo buttons show
  await page.getByRole("button", { name: "Undo +1 share Rise & Shine Bakery (−10)" }).first().click();
  await expect(page.locator(".own")).toContainText("2 shares");
  await page.getByRole("button", { name: "Clear plan" }).click();
  await expect(page.locator(".tray")).toHaveCount(0);
  await expect(page.locator(".money").nth(1)).toContainText("100");
  expect(errors, errors.join("\n")).toEqual([]);
});

test("the show and skipping it never change a number", async ({ page }) => {
  await page.goto(URL);
  await walkCh1(page);
  await page.locator("#go").click();
  const during = await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.history.map(h => h.nw));
  await skipShow(page);
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.history.map(h => h.nw));
  expect(after).toEqual(during);
  expect(after.length).toBe(4);
});

test("keyboard only: the walk in by Tab and Enter (each step opens on the Clerk's button, only the lit control is in the Tab order), Next season, confirm, skip the show", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  const label = () => page.evaluate(() => { const a = document.activeElement; return a && a !== document.body && a !== document.documentElement ? ((a.getAttribute("aria-label") || a.textContent) || "").trim() : ""; });
  async function pressUntil(name, exact) { for (let i = 0; i < 60; i++) { await page.keyboard.press("Tab"); const t = await label(); if (exact ? t === name : t.startsWith(name)) { await page.keyboard.press("Enter"); return; } } throw new Error("not reachable by Tab: " + name); }
  await pressUntil("Start chapter 1"); await pressUntil("Come in");
  expect(await label()).toBe("Next");                                                          // step 1 opens on the Clerk's button
  const reached = new Set(); for (let i = 0; i < 12; i++) { await page.keyboard.press("Tab"); reached.add(await label()); }
  expect([...reached].filter(t => t && t !== "Next")).toEqual([]);                             // nothing else on the Town is in the Tab order (the money row has no controls)
  await page.locator(".walk-card #walk-go").focus(); await page.keyboard.press("Enter");          // 1
  expect(await label()).toBe("Next"); await page.keyboard.press("Enter");                         // 2
  expect(await label()).toBe("Put 30 in my Jar"); await page.keyboard.press("Enter");             // 3
  expect(await label()).toBe("Next"); await page.keyboard.press("Enter");
  await pressUntil("Rise & Shine Bakery");                                                         // 4: no button, the lit tile is reachable by Tab
  await pressUntil("Buy 1 share");                                                                 // 5
  await expect(page.locator(".tray")).toContainText("+1 share");
  await pressUntil("Next", true);
  expect(await label()).toBe("Next"); await page.keyboard.press("Enter");                         // 6
  await pressUntil("My Plan");                                                                     // 7
  await pressUntil("Back to town");                                                                // the Clerk's card on My Plan
  await pressUntil("Next season");                                                                 // 8
  await pressUntil("Go to spring"); await pressUntil("Skip"); await pressUntil("Back to town");
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
      if (await page.getByText("Your goal day has arrived").count()) { const buy = page.getByRole("button", { name: /^Buy it|^Sell .+ and buy it$/ }); if (await buy.count()) await buy.click(); else await page.getByRole("button", { name: "Postpone my goal" }).click(); continue; }
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
  await page.evaluate(() => { MS.newRun("ch5", "Clover Field 14"); MS.go("town"); });   // DECK4 re-keyed every town again: in this one Toy Box closes at month 20, the slump starts at 26 and a surprise cost comes at 28
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
  await walkCh1(page, { to: 6, each: async n => noOverflow("walk step " + n) }); await noOverflow("town");
  await walkCh1(page, { from: 6, each: async n => noOverflow("walk step " + n) }); await noOverflow("confirm sheet"); await page.locator("#go").click(); await expect(page.locator(".screen.show")).toBeVisible(); await noOverflow("show"); await page.getByRole("button", { name: "Skip" }).click(); await expect(page.locator(".screen.recap")).toBeVisible(); await noOverflow("recap"); await page.locator("#recap-go").click();
  for (let i = 0; i < 3; i++) { await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click(); await page.getByRole("button", { name: "Skip" }).click(); await page.locator("#recap-go").click(); }
  await expect(page.locator(".masthead")).toBeVisible(); await noOverflow("gazette"); await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /^Buy it/ }).click(); await expect(page.locator(".screen.results")).toBeVisible(); await noOverflow("results");
  await page.getByRole("button", { name: "My Plan" }).click(); await noOverflow("plan");
  await ctx.close();
});
test("export and import: a town file round-trips; a crafted file is refused and renders nothing", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await walkCh1(page, { to: 4 });                                                            // the Jar holds 30; the walk waits at the bakery
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
  await expect(page.locator(".walk-layer")).toHaveAttribute("data-step", "4");               // the walk step came with the town file
  // crafted file: HTML strings, __proto__, oversized numbers (the walk blocks the Town's Home button, so go home directly)
  await page.evaluate(() => MS.go("home")); await page.getByRole("button", { name: "Settings" }).click();
  const crafted = JSON.stringify({ app: "mainstreet", kind: "town-file", engineVersion: parsed.engineVersion, contentVersion: parsed.contentVersion, save: Object.assign(JSON.parse(JSON.stringify(parsed.save)), { seed: "<img src=x onerror=alert(1)>", checkpoint: Object.assign(parsed.save.checkpoint, { wallet: 1e300, __proto__: { polluted: true } }) }) });
  await page.locator("#import-file").setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from(crafted) });
  await expect(page.getByText("That file is not a MAINSTREET town file.")).toBeVisible();
  expect(await page.evaluate(() => ({}).polluted)).toBeUndefined();
  expect(await page.locator("img[src='x']").count()).toBe(0);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("recovery: a damaged save is kept aside, the backup can be tried, the player can start new", async ({ page }) => {
  await page.goto(URL);
  await walkCh1(page, { to: 4 });
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
  await p1.goto(URL); await p1.getByRole("button", { name: "Start chapter 1" }).click(); await p1.getByRole("button", { name: "Come in" }).click();
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
  await expect(page.getByText("I am the Town Clerk")).toBeVisible();
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
test("focus: a screen change lands on the heading, a walk step lands on the Clerk's button, an in-screen action keeps focus on its control, a sheet takes focus", async ({ page }) => {
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click();
  expect(await page.evaluate(() => /^H[12]$/.test(document.activeElement.tagName) || document.activeElement.getAttribute("role") === "heading")).toBe(true);
  await page.getByRole("button", { name: "Come in" }).click();
  expect(await page.evaluate(() => document.activeElement.id)).toBe("walk-go");                 // R17: a walk step opens with the Clerk's button focused
  await walkCh1(page, { from: 1, to: 5 });
  const buy = page.locator(".steppers").getByRole("button", { name: "Buy 1 share" });
  await buy.focus(); await page.keyboard.press("Enter");
  await expect(page.locator(".own")).toContainText("1 share");
  expect(await page.evaluate(() => document.activeElement.getAttribute("aria-label") || document.activeElement.textContent.trim())).toBe("Buy 1 share");
  await page.locator(".walk-card").getByRole("button", { name: "Next", exact: true }).click();
  await walkCh1(page, { from: 6 });
  expect(await page.evaluate(() => !!document.activeElement.closest('[role="dialog"]'))).toBe(true);
});
test("sound: on by default for a fresh device (rc10), a saved choice wins, an old unchosen off turns on, the Settings toggle persists, a show with sound on raises no errors", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  expect(await page.evaluate(() => MS.S.options.sound)).toBe(true);
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.locator("#opt-sound")).toBeChecked();
  await page.locator("#opt-sound").uncheck();                                                   // a choice: off
  expect(await page.evaluate(() => [MS.S.options.sound, JSON.parse(localStorage.getItem("ms:settings")).options.soundChosen])).toEqual([false, true]);
  await page.reload();
  expect(await page.evaluate(() => MS.S.options.sound)).toBe(false);                            // the device that chose keeps its choice
  await page.evaluate(() => localStorage.setItem("ms:settings", JSON.stringify({ options: { sound: false }, progress: {} })));   // what rc9 saved for everyone, chosen or not
  await page.reload();
  expect(await page.evaluate(() => MS.S.options.sound)).toBe(true);                             // nobody chose it, so the new default applies
  await page.getByRole("button", { name: "Settings" }).click();
  await page.locator("#opt-sound").uncheck(); await page.locator("#opt-sound").check();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:settings")).options)).toMatchObject({ sound: true, soundChosen: true });
  await page.getByRole("button", { name: "Home" }).click();
  await walkCh1(page); await page.locator("#go").click(); await skipShow(page);
  await expect(page.locator(".screen.town")).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});
test("blocked storage: with localStorage throwing, Home says it is playing without saving, play continues, Export is still offered", async ({ page }) => {
  await page.addInitScript(() => { const bad = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); }, key() { return null; }, clear() {}, get length() { return 0; } }; Object.defineProperty(window, "localStorage", { get: () => bad }); });
  await page.goto(URL);
  await walkCh1(page, { to: 4 });
  await expect(page.locator(".band.soon")).toContainText("Soon 30");
  await expect(page.getByText("Playing without saving on this device.")).toBeVisible();      // the banner appears once a save has failed
  await page.evaluate(() => MS.go("home")); await page.getByRole("button", { name: "Settings" }).click();   // the walk blocks the Town's Home button
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
  await walkCh1(page); await page.locator("#go").click(); await skipShow(page);
  const before = await page.evaluate(() => JSON.stringify([MS.S.draft.t, MS.S.draft.wallet, MS.S.draft.totals]));
  await page.evaluate(() => { Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await page.waitForTimeout(1200);
  await page.evaluate(() => { Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true }); document.dispatchEvent(new Event("visibilitychange")); });
  expect(await page.evaluate(() => JSON.stringify([MS.S.draft.t, MS.S.draft.wallet, MS.S.draft.totals]))).toBe(before);
});
test("update banner: shows on Home only, never on the Town, never when embedded", async ({ page }) => {
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click(); await page.getByRole("button", { name: "Come in" }).click();
  await page.evaluate(() => { MS.S.ui.updateReady = { waiting: { postMessage() {} } }; MS.render(); });
  await expect(page.getByText("A new version is ready.")).toHaveCount(0);
  await page.evaluate(() => MS.go("home"));                                                      // the walk blocks the Town's Home button
  await expect(page.getByText("A new version is ready.")).toBeVisible();
  await page.goto(URL + "?embed=1");
  await page.evaluate(() => { MS.S.ui.updateReady = { waiting: { postMessage() {} } }; MS.go("home"); });
  await expect(page.getByText("A new version is ready.")).toHaveCount(0);
});
// rc9: records every month the show paints (its caption, its news cards, whether an object leaked into the text, and when), from the frame on screen now
async function watchShow(page) {
  await expect(page.locator(".screen.show")).toBeVisible();
  await page.evaluate(() => {
    const h = document.querySelector(".screen.show h2.month"), snap = () => ({ month: h.textContent, cap: document.querySelector(".show-cap").textContent, news: document.querySelectorAll(".screen.show .news strong").length, leak: document.body.innerText.includes("[object"), at: performance.now() });
    const rec = window.__show = [snap()];
    new MutationObserver(() => { if (h.textContent !== rec[rec.length - 1].month) rec.push(snap()); }).observe(h, { childList: true, characterData: true, subtree: true });
  });
}
test("reduced motion: the year show steps by itself on a 900 ms timer (no per month button, no ×2), Skip still works, and the numbers are identical", async ({ page }) => {
  const errors = watch(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(URL);
  await walkCh1(page);
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.history.map(h => h.nw));
  await page.locator("#go").click();
  await watchShow(page);
  await expect(page.getByRole("button", { name: "Next month" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "×2" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Skip" })).toBeVisible();
  const during = await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.history.map(h => h.nw));
  await expect(page.locator(".screen.recap")).toBeVisible({ timeout: 8000 });                    // nobody tapped: the three months played and the recap came
  const rec = await page.evaluate(() => window.__show);
  expect(rec.length).toBe(3);
  for (let i = 2; i < rec.length; i++) { const gap = rec[i].at - rec[i - 1].at; expect(gap).toBeGreaterThan(800); expect(gap).toBeLessThan(1600); }
  await page.locator("#recap-go").click(); await expect(page.locator(".screen.town")).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.history.map(h => h.nw))).toEqual(during);
  expect(during.slice(0, before.length)).toEqual(before);
  // the next season: Skip mid show leaves every number as it was
  await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click();
  await watchShow(page);
  const mid = await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.history.map(h => h.nw));
  await page.getByRole("button", { name: "Skip" }).click(); await passRecap(page);
  await expect(page.locator(".screen.town")).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint.history.map(h => h.nw))).toEqual(mid);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("town screen answers what you own, what you spent and what is left", async ({ page }) => {
  await page.goto(URL);
  await walkCh1(page, { to: 5 }); await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  await expect(page.locator(".money-row")).toContainText("Wallet");
  await expect(page.locator(".money-row")).toContainText("Spent");
  await expect(page.locator(".money-row")).toContainText("Jar");
  await expect(page.locator(".own")).toContainText("1 share");
});

test("the year show renders news cards as elements: twelve months under reduced motion never print an object", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(URL);
  await page.evaluate(() => { MS.S.options.showSpeed = 10; MS.newRun("ch2", "Pebble Creek 3"); MS.S.ui.intro = false; MS.go("town"); });  // the test speed: 50 ms a month
  await page.getByRole("button", { name: /^(Next year|Continue year)$/ }).click(); await page.locator("#go").click();
  await watchShow(page);
  await expect(page.locator(".screen.recap")).toBeVisible({ timeout: 10000 });
  const rec = await page.evaluate(() => window.__show);
  expect(rec.length).toBe(12);
  for (const r of rec) expect(r.leak).toBe(false);
  expect(rec.reduce((n, r) => n + r.news, 0)).toBeGreaterThan(0);
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
  // rc10: sound is on for a fresh device, yet nothing sounds and no audio context exists before the first tap, even when the game asks for a sound
  expect(await page.evaluate(() => { MS.tick(); MS.chime(); return MS.sfx.state(); })).toEqual({ on: true, armed: false, ctx: false, played: [] });
  await page.getByRole("button", { name: /Music off/ }).click();
  expect(await page.evaluate(() => MS.sfx.state().armed)).toBe(true);
  await expect(page.getByRole("button", { name: /Music on/ })).toBeVisible();
  await expect.poll(() => page.evaluate(() => MS.music.state().track)).toBe("Calm Street");
  if (browserName === "chromium") await expect.poll(() => page.evaluate(() => MS.music.state().playing)).toBe(true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:settings")).options.music)).toBe(true);
  await walkCh1(page);
  expect(await page.evaluate(() => MS.sfx.state())).toMatchObject({ armed: true, ctx: true });     // the walk's moves made the context, after the taps
  expect(await page.evaluate(() => MS.sfx.state().played)).toEqual(expect.arrayContaining(["paper", "rise"]));   // a paper tick per move, the rise when goal fit lit
  expect(await page.evaluate(() => MS.music.state().track)).toBe("Calm Street");               // same feel, no switch
  for (let i = 0; i < 4; i++) { if (i) await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click(); await page.getByRole("button", { name: "Skip" }).click(); await page.locator("#recap-go").click(); }
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
async function ch1Bought(page, n) {                                                             // R17: the walk with n shares, waiting at Next season (step 8)
  await page.goto(URL);
  await walkCh1(page, { shares: n, to: 8 });
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
  await watchShow(page);
  expect(await page.evaluate(() => window.__show[0].cap)).toBe("Busy at the bakery. Bram says, “Every tray gone by ten. Good day for bread.”");
  await page.evaluate(() => { MS.S.options.showSpeed = 10; MS.newRun("ch2", "Pebble Creek 3"); MS.S.ui.intro = false; MS.go("town"); });
  await page.getByRole("button", { name: /^(Next year|Continue year)$/ }).click(); await page.locator("#go").click();
  await watchShow(page);
  await expect(page.locator(".screen.recap")).toBeVisible({ timeout: 10000 });
  const caps = (await page.evaluate(() => window.__show)).map(r => r.cap);
  expect(caps.length).toBe(12);
  expect(new Set(caps).size).toBeGreaterThan(1);
  for (const c of caps) expect(c).toMatch(/^(Busy at .+\.|A busy month on the street\.|A quiet month on the street\.)$/);
  expect(caps.slice(1).some((c, i) => c !== caps[i])).toBe(true);                                // it changes from one frame to the next
  expect(errors, errors.join("\n")).toEqual([]);
});
test("R14 chapter 1 guide: the stops at 3, 6 and 9 months say what moved, from what to what, and what to do next", async ({ page }) => {
  const errors = watch(page);
  await ch1Bought(page, 1);
  await advanceOnce(page);
  await expect(page.locator(".hint.clerk .eyebrow")).toHaveText("The Town Clerk");             // R17: the stop guides carry the Clerk's eyebrow and border, not "Practice year"
  await expect(page.locator(".hint")).toContainText("You bought 1 share last stop. Same share. A different price. The bakery went from 10 to 11, so each share is worth 11 now. Buy more, sell some, or keep them, then tap Next season.");   // rc10
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
  await expect(clerk).toContainText("Your nature trip costs 210 coins and is due in 3 years. You have 200 coins. Saving alone gets you 200. The rest has to grow.");
  await expect(clerk).toContainText("This year, try spreading out. Ada puts her coins in the Town Basket, a little of every shop. Dev picks one shop. Watch both.");
  expect(await page.evaluate(() => CONTENT.chapters.find(c => c.id === "ch2").goal.amount)).toBe(210);   // DECK3
  await page.evaluate(() => { MS.newRun("ch4", "Harbor Lane 12"); MS.go("town"); });
  await expect(page.locator(".cold-open")).toContainText("Your project kit costs 850 coins and is due in 5 years. You have 150 coins, and 10 coins arrive each month. Saving alone gets you about 797. The rest has to grow.");
  await page.evaluate(() => { MS.newRun("ch3", "Willow Bend 41"); MS.go("town"); });                    // rc7 (DECK4): 190, which saving reaches only if the surprise cost is small
  await expect(page.locator(".cold-open")).toContainText("Saving alone gets you about 212. That is enough unless a big surprise cost comes first.");
  await expect(page.locator(".cold-open")).toContainText("between 15 and 30 coins");
  await page.evaluate(() => { MS.newRun("ch6", "Lantern Row 5"); MS.go("town"); });
  await expect(page.locator(".cold-open")).toContainText("Your big project costs 1500 coins today and is due in 10 years. Its price rises with everyday prices.");
  await expect(page.locator(".cold-open")).toContainText("and by then your big project will cost more than that. The rest has to grow.");
  await page.evaluate(() => { MS.newRun("ch1", "Maple Hollow 7"); MS.go("town"); });                    // R17: chapter 1's intro is the Clerk at the door
  await expect(page.locator(".clerk")).toHaveCount(1);
  await expect(page.locator(".cold-open")).toContainText("Welcome to Maple Hollow 7. I am the Town Clerk. One shop is open this year, Bram\u2019s bakery, and you have a year to learn how owning a piece of it works. Come in, I will show you around.");
  await expect(page.locator(".cold-open").locator(".eyebrow")).toHaveText("The Town Clerk");
  await page.evaluate(() => MS.go("home")); await expect(page.locator("#s-title")).toBeVisible(); await expect(page.locator(".clerk")).toHaveCount(0);   // Home: no Clerk
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
  await expect(page.locator(".doing-clerk")).toContainText("One shop carries your whole plan. Spreading out is a move.");   // rc10: the strip's line says it,
  await expect(spread).toHaveClass(/told/); await expect(spread.locator("p")).toHaveCount(0);                             // so the row is its button alone
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
  await expect(checkin.locator(".react")).toHaveText("The Basket holds a little of every shop. One shop’s bad year matters less now.");   // rc10: the Clerk reacts where Spread out was tapped
  await expect(page.locator(".doing-clerk")).toContainText("Steady. Nothing needs doing this stop.");
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
  await expect(page.locator("[data-move=pull]")).toContainText("Your nature trip is 2 years away. Your Jar holds 0 of 210 for it. Prices could fall before then.");
  await advanceOnce(page); expect(await settle(page, async () => {}, { keepPull: true })).toBe("town");    // month 24: the goal fit checkpoint
  const sheet = page.locator(".sheet");
  await expect(sheet).toContainText("Your nature trip is due in 1 year. You need 210 more in the Jar. Selling shares now turns today’s price into coins; keeping them means waiting to see.");
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

/* ---- rc7, the proud pass: durations in years, the Gazette after a recap, the town on Home, chapters 3 and 5 at 190 and 800. docs/plans/PHASE-B-PROUD-PASS-2026-10-11.md ---- */
test("rc7 durations: whole years read as years on the chapter 2 intro, the cold open and the goal chip; signed amounts never print a minus zero; Home is a 48 px button", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.newRun("ch2", "Pebble Creek 3"); MS.go("town"); });
  await expect(page.locator(".intro .goal-chip")).toContainText("210 coins, in 3 years. You start with 200 coins.");
  await expect(page.locator(".cold-open")).toContainText("Your nature trip costs 210 coins and is due in 3 years.");
  await expect(page.locator(".screen.intro")).not.toContainText("months");
  await page.getByRole("button", { name: "Start exploring" }).click();
  await expect(page.locator(".town .goal-chip")).toContainText("210 coins · in 3 years");
  const home = page.locator(".town-head").getByRole("button", { name: "Home" });
  expect((await home.boundingBox()).height).toBeGreaterThanOrEqual(48);                       // .btn.small is 48 px now
  await expect(page.locator(".town-links").getByRole("button")).toHaveCount(2);               // chapter 2 keeps its row: Scrapbook and Time machine
  await advanceOnce(page); expect(await settle(page, async () => {})).toBe("town");
  await expect(page.locator(".town .goal-chip")).toContainText("210 coins · in 2 years");
  expect(await page.evaluate(() => [1, 11, 12, 13, 24, 36, 60, 120].map(MS.fmt.durationWord))).toEqual(["1 month", "11 months", "1 year", "13 months", "2 years", "3 years", "5 years", "10 years"]);
  expect(await page.evaluate(() => [-30, -49, 0, 30, -100, 250].map(MS.fmt.signed))).toEqual(["0", "0", "0", "0", "−1", "+3"]);
  expect(await page.evaluate(() => [-30, -50, 0].map(MS.fmt.signedAmt))).toEqual(["0", "−0.5", "0"]);
  expect(await page.evaluate(() => [0, -0.004, 0.004, 0.12, -0.08].map(MS.fmt.pct))).toEqual(["0%", "0%", "0%", "+12%", "−8%"]);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("rc7 Gazette after a recap: chapter 2 drops the Your money panel and keeps the masthead, the neighbors and one thing to notice; chapter 1's year end Gazette keeps it; chapter 1's lone Scrapbook sits beside Home", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.newRun("ch2", "Pebble Creek 3"); MS.S.ui.intro = false; MS.go("town"); });
  await page.getByRole("button", { name: "Next year" }).click(); await page.locator("#go").click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page.locator(".screen.recap").getByRole("heading", { name: "Your money" })).toBeVisible();   // the recap shows the money
  await page.locator("#recap-go").click();
  const gaz = page.locator(".screen.gazette");
  await expect(gaz.locator(".masthead")).toContainText("Gazette");
  await expect(gaz.getByRole("heading", { name: "Your money" })).toHaveCount(0);
  await expect(gaz.locator(".money-story")).toHaveCount(0);
  await expect(gaz.getByRole("heading", { name: "Your neighbors" })).toBeVisible();
  await expect(gaz.getByRole("heading", { name: "One thing to notice" })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator(".screen.town")).toBeVisible();
  // chapter 1: four seasons, each with a seasonal recap, then the year end Gazette with its money panel
  await page.evaluate(() => { MS.newRun("ch1", "Maple Hollow 7"); MS.S.ui.intro = false; MS.S.ui.walk = "done"; MS.go("town"); });
  await expect(page.locator(".town-links")).toHaveCount(0);
  await expect(page.locator(".town-head").getByRole("button", { name: "Scrapbook" })).toBeVisible();
  await expect(page.locator(".town-head").getByRole("button", { name: "Home" })).toBeVisible();
  for (let i = 0; i < 4; i++) { await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click(); await skipShow(page); }
  await expect(page.locator(".screen.gazette .masthead")).toContainText("Gazette");
  await expect(page.locator(".screen.gazette").getByRole("heading", { name: "Your money" })).toBeVisible();
  await expect(page.locator(".money-story")).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});
test("rc7 Home shows the town: six storefront images under the hook line, decorative, one row at 412 and two rows at 320", async ({ page }) => {
  const errors = watch(page);
  await page.setViewportSize({ width: 412, height: 915 });
  await page.goto(base);                                                                       // over http, so the art loads
  const strip = page.locator(".home-street");
  await expect(strip).toHaveAttribute("aria-hidden", "true");
  await expect(strip.locator("img")).toHaveCount(6);
  expect(await strip.locator("img").evaluateAll(a => a.map(i => i.getAttribute("src")))).toEqual(["lemn", "bake", "toys", "bike", "paws", "robo"].map(k => "art/shop-" + k + "-open.webp"));
  await expect.poll(() => strip.locator("img").evaluateAll(a => a.every(i => i.complete && i.naturalWidth > 0))).toBe(true);
  expect(await strip.locator("img").evaluateAll(a => a.every(i => i.getAttribute("alt") === ""))).toBe(true);
  expect(Math.round((await strip.locator("img").first().boundingBox()).height)).toBe(56);
  expect(await page.evaluate(() => { const t = document.querySelector(".home .tag").getBoundingClientRect(), s = document.querySelector(".home-street").getBoundingClientRect(); return s.top >= t.bottom; })).toBe(true);
  const rows = () => strip.locator("img").evaluateAll(a => new Set(a.map(i => Math.round(i.getBoundingClientRect().top))).size);
  expect(await rows()).toBe(1);
  await page.setViewportSize({ width: 320, height: 568 });
  expect(await rows()).toBe(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("rc7 the stake for chapters 3 and 5 (DECK4): the cold opens name 190 and 800", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  expect(await page.evaluate(() => [ENGINE.VERSION.content, CONTENT.chapters.find(c => c.id === "ch3").goal.amount, CONTENT.chapters.find(c => c.id === "ch5").goal.amount])).toEqual(["DECK4", 190, 800]);
  await page.evaluate(() => { MS.newRun("ch3", "Willow Bend 41"); MS.go("town"); });
  await expect(page.locator(".cold-open")).toContainText("Your bicycle costs 190 coins and is due in 3 years. You have 200 coins. Saving alone gets you about 212. That is enough unless a big surprise cost comes first.");
  await expect(page.locator(".intro .goal-chip")).toContainText("190 coins, in 3 years.");
  await page.evaluate(() => { MS.newRun("ch5", "Clover Field 14"); MS.go("town"); });
  await expect(page.locator(".cold-open")).toContainText("Your week at camp costs 800 coins and is due in 5 years. You have 300 coins, and 10 coins arrive each month. Saving alone gets you about 963, enough for this goal.");
  await expect(page.locator(".intro .goal-chip")).toContainText("800 coins, in 5 years.");
  expect(errors, errors.join("\n")).toEqual([]);
});

/* ---- R17 (Stephen's fourth note, 2026-10-11): chapter 1 is a guided walk. The Clerk lights one piece of the Town at a time. docs/plans/CH1-WALK-IN-2026-10-11.md ---- */
// where the lit control is, where the card is, and where the ring is, at the step on screen now
async function walkGeometry(page) {
  return page.evaluate(() => {
    const layer = document.querySelector(".walk-layer"); if (!layer) return null;
    const step = +layer.dataset.step, q = x => document.querySelector(x), R = e => e.getBoundingClientRect();
    let t, own;
    if (step === 5) { const a = R(q(".town .share-card")), b = R(q(".town .panel .panel-head")); t = { left: Math.min(a.left, b.left), top: Math.min(a.top, b.top), right: Math.max(a.right, b.right), bottom: Math.max(a.bottom, b.bottom) }; own = q(".town .panel"); }
    else { own = q({ 1: ".town .money-row", 2: ".town .goal-chip", 3: ".town .money.jar", 4: ".town .shop-face", 6: ".town .tray", 7: "#town-plan", 8: "#town-next", 9: ".town .sheet" }[step]); t = R(own); }
    const cardEl = step === 9 ? null : q(".walk-card"), card = cardEl ? R(cardEl) : null, ring = q(".walk-ring"), rg = R(ring);
    const over = !!card && card.left < t.right && t.left < card.right && card.top < t.bottom && t.top < card.bottom;
    const ringOff = step === 9 ? (ring.hidden ? 0 : 99) : Math.max(Math.abs(rg.left - (t.left - 8)), Math.abs(rg.top - (t.top - 8)), Math.abs(rg.right - (t.right + 8)), Math.abs(rg.bottom - (t.bottom + 8)));
    const center = document.elementFromPoint((t.left + t.right) / 2, (t.top + t.bottom) / 2);
    return { step, over, ringOff: Math.round(ringOff), hits: !!(center && own.contains(center)), inView: t.top >= -1 && t.bottom <= innerHeight + 1, cardInView: !card || (card.top >= 0 && card.bottom <= innerHeight + 1), cardScrolls: !!cardEl && cardEl.scrollHeight > cardEl.clientHeight + 1, text: cardEl ? cardEl.querySelector(".walk-text").textContent : q(".sheet .walk-card .walk-text").textContent };
  });
}
test("R17 the walk in: the Clerk at the door, the money row lit first with the 100 coins, each step's words in order, Next season off until step 8, Go ends the walk", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.getByRole("button", { name: "Start chapter 1" }).click();
  await expect(page.locator(".screen.intro h2")).toHaveText("A Little Piece");
  await expect(page.locator(".screen.intro .cold-open .eyebrow")).toHaveText("The Town Clerk");
  await expect(page.locator(".screen.intro")).not.toContainText("These are pretend coins");        // the old practice line is gone
  await page.getByRole("button", { name: "Come in" }).click();
  const card = page.locator(".walk-card"), texts = [];
  await expect(page.locator(".walk-layer")).toHaveAttribute("data-step", "1");
  await expect(card.locator(".eyebrow")).toHaveText("The Town Clerk");
  await expect(card).toContainText("Here are your coins: 100, all pretend. Wallet is what you can spend right now. Jar is money you keep safe. Spent is what you have paid for so far.");
  const g1 = await walkGeometry(page); expect(g1.ringOff).toBeLessThanOrEqual(1); expect(g1.over).toBe(false);   // the ring sits on the money row
  expect((await card.locator("#walk-go").boundingBox()).height).toBeGreaterThanOrEqual(48);
  await expect(card.locator(".walk-skip")).toHaveCount(0);                                          // a first timer has no skip
  await expect(page.locator(".hint")).toHaveCount(0);                                               // no stop guide under the walk
  await walkCh1(page, { from: 1, each: async n => {
    const g = await walkGeometry(page); texts.push(g.text);
    if (n < 8) await expect(page.locator("#town-next")).toBeDisabled(); else if (n === 8) await expect(page.locator("#town-next")).toBeEnabled();
    if (n < 5) await expect(page.locator(".town .panel")).toHaveCount(0);                            // the bakery opens when the Clerk asks for the tap
    if (n === 5) { await expect(card.locator("#walk-go")).toHaveCount(0); await expect(page.locator(".steppers").getByRole("button", { name: "More" })).toHaveCount(0); await expect(page.locator(".steppers").getByRole("button", { name: "Buy 1 share" })).toBeEnabled(); }
  } });
  expect(texts).toEqual([
    "Here are your coins: 100, all pretend. Wallet is what you can spend right now. Jar is money you keep safe. Spent is what you have paid for so far.",
    "This year you are saving for one thing: art supplies, 30 coins, due in 1 year. The bar fills as your Jar fills.",
    "Goal money goes in the Jar first, so a quiet month at the bakery cannot touch it. Put 30 in now.",
    "This is the bakery. A business is split into tiny pieces called shares. Own one and you own a tiny piece of the shop. Tap the bakery.",
    "A share costs 10 right now. Plus buys one, minus sells one. Try one, three or seven. More shares means more of your money moves with the price.",
    "That bought nothing yet. It went into your plan, here at the bottom. A plan is what you will do before time moves. Undo takes a line back. Nothing is spent until you say go.",
    "My Plan shows the shape of your money: what is in the Jar, what is in shares, what is still free. Open it.",
    "Time moves only when you tap Next season. Three months pass. The bakery has busy days and quiet days and its price moves. Your shares move with it. Your Jar does not. Tap it when you are ready.",
    "The last look before time moves: your plan in words, then the two ways it could go. Tap Go to spring."]);
  for (const t of texts) { expect(t).not.toMatch(/[–—!←-⇿▲▼]/); expect(t).not.toMatch(/\b(win|wins|beat|profit|bonus)\b/i); }
  await page.locator("#go").click(); await skipShow(page);
  await expect(page.locator(".walk-layer")).toHaveCount(0);
  expect(await page.evaluate(() => [MS.S.ui.walk, JSON.parse(localStorage.getItem("ms:save")).ui.walk])).toEqual(["done", "done"]);
  await expect(page.locator(".steppers").getByRole("button", { name: "More" })).toBeEnabled();     // More is back after the walk
  expect(errors, errors.join("\n")).toEqual([]);
});
test("R17 taps outside the lit control do nothing: the goal chip, Home and the bakery are dead during step 1; the hole passes taps through to the lit control", async ({ page }) => {
  const errors = watch(page);
  await page.setViewportSize({ width: 412, height: 915 });                                        // his phone: the whole Town top and the bakery are on screen
  await page.goto(URL);
  await walkCh1(page, { to: 1 });
  const mid = b => [b.x + b.width / 2, b.y + b.height / 2];
  const chip = mid(await page.locator(".town .goal-chip").boundingBox());
  expect(await page.evaluate(([x, y]) => document.elementFromPoint(x, y).className, chip)).toContain("walk-block");
  await page.mouse.click(...chip);
  await page.mouse.click(...mid(await page.locator(".town-head").getByRole("button", { name: "Home" }).boundingBox()));
  await page.mouse.click(...mid(await page.locator(".shop-face").boundingBox()));
  await expect(page.locator(".screen.town")).toBeVisible();
  await expect(page.locator(".walk-layer")).toHaveAttribute("data-step", "1");
  await expect(page.locator(".town .panel")).toHaveCount(0);
  expect(await page.evaluate(() => MS.S.ui.walk)).toBe(1);
  const row = mid(await page.locator(".town .money-row").boundingBox());                            // inside the hole the money row itself is under the finger
  expect(await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y).closest(".money-row"), row)).toBe(true);
  await walkCh1(page, { from: 1, to: 4 });
  await page.locator("#town-plan").scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));   // the walk re-measures on the frame after a scroll, before a finger can land
  const plan = mid(await page.locator("#town-plan").boundingBox());
  expect(await page.evaluate(([x, y]) => document.elementFromPoint(x, y).className, plan)).toContain("walk-block");
  await page.mouse.click(...plan);                                                                    // at step 4 My Plan is dimmed and dead
  await expect(page.locator(".screen.town")).toBeVisible();
  await expect(page.locator(".walk-layer")).toHaveAttribute("data-step", "4");
  await page.locator(".shop-face").click();                                                           // the lit tile takes the tap (Playwright checks the tile is what receives it)
  await expect(page.locator(".walk-layer")).toHaveAttribute("data-step", "5");
  expect(errors, errors.join("\n")).toEqual([]);
});
test("R17 step 7 opens My Plan with the Clerk's card, Back to town returns to step 8; every chapter keeps the card, with the Buffer line only where there is a Buffer", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await walkCh1(page, { to: 7 });
  await page.getByRole("button", { name: "My Plan" }).click();
  const clerk = page.locator(".screen.plan .plan-clerk");
  await expect(clerk.locator(".eyebrow")).toHaveText("The Town Clerk");
  await expect(clerk).toContainText("Your plan is the shape of your money. Soon is money for your goal. Saved is extra you set aside. Shares are the pieces of shops you own. Move coins between them here any time before time moves; nothing is spent until you confirm.");
  await expect(clerk).not.toContainText("Buffer");
  expect(await page.evaluate(() => MS.S.ui.walk)).toBe(8);
  await clerk.getByRole("button", { name: "Back to town" }).click();
  await expect(page.locator(".walk-layer")).toHaveAttribute("data-step", "8");
  await expect(page.locator(".walk-card")).toContainText("Time moves only when you tap Next season.");
  await expect(page.locator("#town-next")).toBeEnabled();
  await page.evaluate(() => { MS.newRun("ch3", "Willow Bend 41"); MS.S.ui.intro = false; MS.go("plan"); });
  await expect(page.locator(".plan-clerk")).toContainText("Soon is money for your goal. Buffer is for surprises. Saved is extra you set aside.");
  await expect(page.locator(".plan-clerk").getByRole("button")).toHaveCount(0);                    // outside the walk the card has no button
  await page.evaluate(() => { MS.newRun("ch2", "Pebble Creek 3"); MS.S.ui.intro = false; MS.go("plan"); });
  await expect(page.locator(".plan-clerk")).toContainText("Your plan is the shape of your money.");
  await expect(page.locator(".plan-clerk")).not.toContainText("Buffer");
  expect(errors, errors.join("\n")).toEqual([]);
});
test("R17 a saved run mid walk comes back at the same step after a reload, with the tray and the Jar", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  const step = () => page.locator(".walk-layer");
  await walkCh1(page, { to: 2 });
  await page.reload(); await expect(step()).toHaveAttribute("data-step", "2");
  await walkCh1(page, { from: 2, to: 3 });
  await page.locator(".walk-card").getByRole("button", { name: "Put 30 in my Jar" }).click();
  await page.reload(); await expect(step()).toHaveAttribute("data-step", "3");
  await expect(page.locator(".walk-card")).toContainText("30 is safe. The other 70 are free to try growing.");   // the half done step reads from the plan
  await expect(page.locator(".band.soon")).toContainText("Soon 30");
  await page.locator(".walk-card").getByRole("button", { name: "Next", exact: true }).click(); await page.locator(".shop-face").click();
  await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click(); await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).ui.walk)).toBe(5);
  await page.reload(); await expect(step()).toHaveAttribute("data-step", "5");
  await expect(page.locator(".own")).toContainText("2 shares");
  await expect(page.locator(".walk-card").getByRole("button", { name: "Next", exact: true })).toBeVisible();
  await walkCh1(page, { from: 5, to: 7, shares: 0 });
  await page.getByRole("button", { name: "My Plan" }).click(); await expect(page.locator(".screen.plan")).toBeVisible();
  await page.reload(); await expect(step()).toHaveAttribute("data-step", "8");                       // a reload on My Plan lands on the Town at Next season
  await page.getByRole("button", { name: "Next season" }).click(); await expect(step()).toHaveAttribute("data-step", "9");
  await page.reload(); await expect(step()).toHaveAttribute("data-step", "8");                       // the sheet is not saved, so the walk waits at Next season again
  await page.getByRole("button", { name: "Next season" }).click();
  await page.locator(".sheet").getByRole("button", { name: "Back to town" }).click(); await expect(step()).toHaveAttribute("data-step", "8");
  expect(errors, errors.join("\n")).toEqual([]);
});
test("R17 a player who finished chapter 1 sees Skip the walk; it ends the walk and stays ended after a reload", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.S.progress.completedChapters = ["ch1"]; MS.render(); });
  await page.getByRole("button", { name: "Play again: A Little Piece" }).click();
  await page.getByRole("button", { name: "Come in" }).click();
  const skip = page.locator(".walk-card").getByRole("button", { name: "Skip the walk" });
  await expect(skip).toBeVisible();
  expect((await skip.boundingBox()).height).toBeGreaterThanOrEqual(48);
  await skip.click();
  await expect(page.locator(".walk-layer")).toHaveCount(0);
  await expect(page.locator("#town-next")).toBeEnabled();
  await expect(page.locator(".town .panel")).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).ui.walk)).toBe("done");
  await page.reload();
  await expect(page.locator(".screen.town")).toBeVisible();
  await expect(page.locator(".walk-layer")).toHaveCount(0);
  expect(errors, errors.join("\n")).toEqual([]);
});
for (const [w, h] of [[412, 915], [320, 568]]) test(`R17 at ${w}x${h}: at every step the card never covers the lit control, the ring sits on it after scrolling, both are in view and the card text is whole`, async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const page = await ctx.newPage(); const errors = watch(page);
  await page.goto(URL);
  const seen = [];
  await walkCh1(page, { each: async n => {
    const g = await walkGeometry(page); seen.push(n);
    expect(g.step).toBe(n);
    expect(g.over, "the card covers the lit control at step " + n).toBe(false);
    expect(g.ringOff, "the ring is off the control at step " + n).toBeLessThanOrEqual(1);
    expect(g.hits, "a tap at the control's center misses it at step " + n).toBe(true);
    expect(g.inView, "the lit control is out of view at step " + n).toBe(true);
    expect(g.cardInView, "the card is out of view at step " + n).toBe(true);
    expect(g.cardScrolls, "the card text is cut at step " + n).toBe(false);
  } });
  expect(seen).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  expect(errors, errors.join("\n")).toEqual([]);
  await ctx.close();
});

/* ---- rc9: delivery, the show, and restart (docs/plans/DELIVERY-AND-RESTART-2026-10-11.md) ---- */
test("rc9 the show: every storefront and weather image is in place and decoded at the first frame, and stays complete as the months change (over http)", async ({ page }) => {
  const errors = watch(page);
  await page.goto(base);
  await page.waitForFunction(() => Object.keys(MS.S.art).length > 0);                          // the art manifest loaded
  await page.evaluate(() => { MS.newRun("ch2", "Pebble Creek 3"); MS.S.ui.intro = false; MS.go("town"); });
  await page.getByRole("button", { name: /^(Next year|Continue year)$/ }).click(); await page.locator("#go").click();
  await page.waitForFunction(() => { const st = document.querySelector(".screen.show .stage"); return st && !st.classList.contains("waiting"); }, null, { timeout: 5000 });
  const first = await page.evaluate(() => [...document.querySelectorAll(".screen.show .stage img")].map(i => ({ src: i.getAttribute("src"), ok: i.complete && i.naturalWidth > 0 })));
  expect(first.filter(x => /\/shop-/.test(x.src)).length).toBe(6);                             // the six storefronts are images, not placeholders
  for (const x of first) expect(x.ok, x.src + " is not decoded at the first frame").toBe(true);
  // through the next months: at every frame change every image on the stage is complete, and the nodes are kept (no blank rebuild)
  await page.evaluate(() => { const h = document.querySelector(".screen.show h2.month"), stage = document.querySelector(".screen.show .stage"), box = stage.querySelector(".show-shops"); window.__imgs = [];
    new MutationObserver(() => window.__imgs.push({ all: [...stage.querySelectorAll("img")].every(i => i.complete && i.naturalWidth > 0), n: stage.querySelectorAll("img").length, kept: stage.querySelector(".show-shops") === box })).observe(h, { childList: true, characterData: true, subtree: true }); });
  await page.waitForFunction(() => window.__imgs.length >= 4, null, { timeout: 10000 });
  const seen = await page.evaluate(() => window.__imgs.slice(0, 4));
  for (const x of seen) { expect(x.all).toBe(true); expect(x.n).toBe(first.length); expect(x.kept).toBe(true); }
  await page.getByRole("button", { name: "Skip" }).click(); await passRecap(page);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("rc9 Home: a finished chapter's row is a 48 px Play again button; with no town in progress it starts at once, with one it asks first and Keep my town keeps it", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await page.evaluate(() => { MS.S.progress.completedChapters = ["ch1"]; MS.render(); });
  const again = page.getByRole("button", { name: "Play again: A Little Piece" });
  await expect(again).toContainText("Play again");
  expect((await again.boundingBox()).height).toBeGreaterThanOrEqual(48);
  // a town in progress (chapter 2), then Home: Continue stays on top
  await page.getByRole("button", { name: "Start chapter 2" }).click();
  await page.evaluate(() => MS.go("home"));
  await expect(page.locator(".home-actions .btn").first()).toHaveText("Continue");
  const run0 = await page.evaluate(() => MS.S.run.runId);
  await again.click();
  const ask = page.getByRole("alertdialog", { name: "This ends your current town. Start chapter 1 again?" });
  await expect(ask).toBeVisible();
  for (const b of await ask.getByRole("button").all()) expect((await b.boundingBox()).height).toBeGreaterThanOrEqual(48);
  expect(await page.evaluate(() => MS.S.run.runId)).toBe(run0);                                // one tap changes nothing
  await ask.getByRole("button", { name: "Keep my town" }).click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  expect(await page.evaluate(() => [MS.S.run.runId, MS.S.run.scenarioId])).toEqual([run0, "ch2"]);
  // ask again and say yes: a new chapter 1 town, the walk from the door, Skip the walk offered
  await again.click(); await page.getByRole("button", { name: "Yes, start again" }).click();
  expect(await page.evaluate(r => [MS.S.run.runId !== r, MS.S.run.scenarioId, MS.S.ui.walk], run0)).toEqual([true, "ch1", 0]);
  await page.getByRole("button", { name: "Come in" }).click();
  await expect(page.locator(".walk-card").getByRole("button", { name: "Skip the walk" })).toBeVisible();
  // with no town in progress (the chapter finished), Play again starts at once
  await page.evaluate(() => { MS.S.run = null; MS.S.market = null; MS.S.draft = null; MS.go("home"); });
  await again.click();
  await expect(page.getByRole("button", { name: "Come in" })).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});
test("rc9 Start over: two taps, Keep everything keeps everything, Yes clears the town and every chapter, page and card, keeps the options, and Home says chapter 1 is next", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await expect(page.getByRole("button", { name: "Start over", exact: true })).toHaveCount(0);   // a new player has nothing to clear
  await page.evaluate(() => { const p = MS.S.progress; p.completedChapters = ["ch1", "ch2"]; p.album.shops.push("BAKE"); p.album.cards.push("E1"); MS.S.options.textSize = 1.15; MS.newRun("ch3", "Pebble Creek 3"); MS.go("home"); });
  const over = page.getByRole("button", { name: "Start over", exact: true });
  expect((await over.boundingBox()).height).toBeGreaterThanOrEqual(48);
  await over.click();
  const ask = page.getByRole("alertdialog", { name: "This clears every chapter, page and card on this device. Start over?" });
  await expect(ask).toBeVisible();
  await ask.getByRole("button", { name: "Keep everything" }).click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  expect(await page.evaluate(() => [!!MS.S.run, MS.S.progress.completedChapters.length, !!localStorage.getItem("ms:save")])).toEqual([true, 2, true]);
  await over.click();
  await page.getByRole("button", { name: "Yes, start over" }).click();
  await expect(page.locator("#s-title")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Start chapter 1" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Play again/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Scrapbook \(0 of 40\)/ })).toBeVisible();
  const stored = await page.evaluate(() => ({ save: localStorage.getItem("ms:save"), bak: localStorage.getItem("ms:save:bak"), settings: JSON.parse(localStorage.getItem("ms:settings")) }));
  expect(stored.save).toBe(null); expect(stored.bak).toBe(null);
  expect(stored.settings.progress.completedChapters).toEqual([]); expect(stored.settings.progress.album.shops).toEqual([]);
  expect(stored.settings.options.textSize).toBe(1.15);
  await page.reload();
  await expect(page.getByRole("button", { name: "Start chapter 1" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue" })).toHaveCount(0);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("rc9 an update that takes over reloads the page at once on the Town, and waits for the next arrival while the show plays (over http)", async ({ page }) => {
  const errors = watch(page);
  await page.goto(base);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30000 });  // a first visit is claimed and never reloads
  await page.evaluate(() => { window.__mark = 1; });
  await walkCh1(page); await page.locator("#go").click(); await skipShow(page);
  await expect(page.locator(".screen.town")).toBeVisible();
  expect(await page.evaluate(() => window.__mark)).toBe(1);
  // on the Town with no sheet open: a takeover reloads now
  const takeover = () => page.evaluate(() => { setTimeout(() => { MS.S.ui.updateReady = {}; navigator.serviceWorker.dispatchEvent(new Event("controllerchange")); }, 0); });
  await Promise.all([page.waitForEvent("load"), takeover()]);
  await expect(page.locator(".screen.town")).toBeVisible();
  expect(await page.evaluate(() => window.__mark)).toBe(undefined);
  // during the show: no reload until the recap's button calls arrive()
  await page.evaluate(() => { window.__mark = 2; });
  await page.getByRole("button", { name: "Next season" }).click(); await page.locator("#go").click();
  await expect(page.locator(".screen.show")).toBeVisible();
  await takeover(); await page.waitForTimeout(300);
  expect(await page.evaluate(() => [window.__mark, MS.S.screen])).toEqual([2, "show"]);
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page.locator(".screen.recap")).toBeVisible();
  expect(await page.evaluate(() => [window.__mark, MS.S.ui.reloadWhenIdle])).toEqual([2, true]);
  const t = await page.evaluate(() => MS.S.draft.t);
  await Promise.all([page.waitForEvent("load"), page.locator("#recap-go").click()]);
  await expect(page.locator(".screen.town")).toBeVisible();
  expect(await page.evaluate(() => [window.__mark, MS.S.draft.t])).toEqual([undefined, t]);       // reloaded into the same saved town
  expect(errors, errors.join("\n")).toEqual([]);
});

/* rc9: the worker's fetch handler in a stub scope (Node, no browser). The stub clock runs 30 times fast, so the 3 s page wait is 100 ms. */
import { runInNewContext } from "node:vm";
import { readFileSync } from "node:fs";
function stubWorker(fetchImpl, cached = {}) {
  const SW = "https://lucidwinds.com/satellites/mainstreet/sw.js", key = u => { const x = new globalThis.URL(typeof u === "string" ? u : u.url, SW); return x.origin + x.pathname; };
  const store = new Map(Object.entries(cached).map(([k, v]) => [key(k), v])), puts = [], calls = [], handlers = {};
  const cache = { match: async r => store.get(key(r)), put: async (r, res) => { puts.push(key(r)); store.set(key(r), res); }, add: async () => {}, keys: async () => [] };
  const scope = { console, URL: globalThis.URL, Response, Promise, clearTimeout, setTimeout: (fn, ms) => setTimeout(fn, ms / 30),
    Request: function (r, init) { return Object.assign({}, r, init); }, fetch: r => { calls.push(r); return fetchImpl(r); },
    caches: { open: async () => cache, match: async r => store.get(key(r)), keys: async () => [], delete: async () => true },
    clients: { claim: async () => {} }, location: new globalThis.URL(SW) };
  scope.self = scope; scope.addEventListener = (t, fn) => { (handlers[t] ||= []).push(fn); }; scope.skipWaiting = async () => {};
  runInNewContext(readFileSync(resolve(ROOT, "sw.js"), "utf8"), scope);
  const request = (url, mode = "navigate") => { const waits = []; let answer = null; const t0 = Date.now();
    handlers.fetch[0]({ request: { url, method: "GET", mode }, respondWith: p => { answer = Promise.resolve(p); }, waitUntil: p => waits.push(p) });
    return answer.then(async r => ({ r, ms: Date.now() - t0, done: await Promise.all(waits) })); };
  return { request, puts, calls, store };
}
test("rc9 worker: a page request is network first (revalidated) and refreshes the cache; offline, a server error or a hung network answer from the cached page; with nothing cached a hung network still settles; other files stay cache first", async () => {
  const PAGE = "https://lucidwinds.com/satellites/mainstreet/";
  // the network answers: the fresh page, asked past the HTTP cache, and stored for the next open
  let w = stubWorker(async () => new Response("fresh page", { status: 200 }), { [PAGE]: new Response("old page") });
  let a = await w.request(PAGE + "?pi=1");
  expect(await a.r.text()).toBe("fresh page");
  expect(w.calls[0].cache).toBe("no-cache");
  expect(w.puts).toContain(PAGE);
  expect(await w.store.get(PAGE).text()).toBe("fresh page");
  // offline: the cached page
  w = stubWorker(async () => { throw new TypeError("Failed to fetch"); }, { [PAGE]: new Response("cached page") });
  expect(await (await w.request(PAGE)).r.text()).toBe("cached page");
  // offline with only index.html cached: the folder's own address falls back to the game's page
  w = stubWorker(async () => { throw new TypeError("Failed to fetch"); }, { [PAGE + "index.html"]: new Response("cached index") });
  expect(await (await w.request(PAGE + "?seed=x")).r.text()).toBe("cached index");
  // a server error: the cached page
  w = stubWorker(async () => new Response("down", { status: 503 }), { [PAGE]: new Response("cached page") });
  expect(await (await w.request(PAGE)).r.text()).toBe("cached page");
  // a hung network: the cached page after the wait (3 s, 100 ms on the stub clock), never a hang
  w = stubWorker(() => new Promise(() => {}), { [PAGE]: new Response("cached page") });
  a = await w.request(PAGE);
  expect(await a.r.text()).toBe("cached page");
  expect(a.ms).toBeLessThan(1000);
  // nothing cached and a hung network: it still settles, as a network error, once the longest wait runs out
  w = stubWorker(() => new Promise(() => {}), {});
  a = await w.request(PAGE);
  expect(a.r.type).toBe("error");
  // a sprite stays cache first: no network call when it is cached
  w = stubWorker(async () => new Response("net"), { [PAGE + "art/shop-bake-open.webp"]: new Response("cached sprite") });
  expect(await (await w.request(PAGE + "art/shop-bake-open.webp", "no-cors")).r.text()).toBe("cached sprite");
  expect(w.calls.length).toBe(0);
});

/* ---- rc10: how am I doing, and the game reacts (docs/plans/HOW-AM-I-DOING-2026-10-11.md) ---- */
async function skipWalk(page) {                                                                 // chapter 1 again with Skip the walk: no Jar, the bakery open, at month 0
  await page.evaluate(() => { MS.S.progress.completedChapters = ["ch1"]; MS.render(); });
  await page.getByRole("button", { name: "Play again: A Little Piece" }).click();
  await page.getByRole("button", { name: "Come in" }).click();
  await page.locator(".walk-card").getByRole("button", { name: "Skip the walk" }).click();
  await expect(page.locator(".walk-layer")).toHaveCount(0);
}
const plus = page => page.locator(".steppers").getByRole("button", { name: "Buy 1 share" });
test("rc10 (1) goal day never strands a short player: the pull card at month 9, then the Clerk names the sale and Sell 3 shares and buy it funds the goal; with even the shares short the Clerk says so and offers the date and the amount", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await skipWalk(page);
  for (let i = 0; i < 10; i++) await plus(page).click();       // all 100 coins in shares, no Jar, an empty wallet (with 7 shares the wallet's 30 pays the goal by itself)
  await advanceOnce(page); await advanceOnce(page); await advanceOnce(page);
  const sheet = page.locator(".sheet");                          // month 9, chapter 1's goal fit checkpoint: the pull card, once
  await expect(sheet).toContainText("Your art supplies are due in 3 months. You need 30 more in the Jar.");
  await expect(sheet).toContainText("you can undo it before Next season.");
  await page.locator("#pull-keep").click();
  await advanceOnce(page);
  await page.getByRole("button", { name: "Continue" }).click(); // the year end Gazette
  await expect(page.getByText("Your goal day has arrived")).toBeVisible();
  const clerk = page.locator(".screen.decision .goal-clerk");
  await expect(clerk.locator(".eyebrow")).toHaveText("The Town Clerk");
  await expect(clerk).toContainText("Your art supplies cost 30. Your Jar holds 0 and your wallet 0. Your shares are worth 105. Selling 3 shares at today’s prices pays the rest and leaves you 7 shares.");
  const sell = page.getByRole("button", { name: "Sell 3 shares and buy it" });
  expect((await sell.boundingBox()).height).toBeGreaterThanOrEqual(48);
  await expect(page.getByRole("button", { name: "Postpone my goal" })).toBeVisible();
  await sell.click();
  await expect(page.locator(".screen.results")).toBeVisible();
  await expect(page.locator(".lead")).toContainText("Your art supplies are here.");
  await expect(page.locator(".screen.results")).toContainText("Your art supplies were bought on goal day.");
  await expect(page.locator(".screen.results")).toContainText("You ended the year with 7 shares.");
  const cp = await page.evaluate(() => JSON.parse(localStorage.getItem("ms:save")).checkpoint);
  expect([cp.goal.status, cp.pos.BAKE, cp.wallet]).toEqual(["funded", 7000, 150]);           // three shares at 10.5 paid 31.5; 1.5 stays in the wallet
  await expect(page.locator("#toast")).not.toHaveClass(/on/);                                  // never a stamp toast on Results
  // even the shares short: the goal raised past everything through an engine legal GOAL_REVISE, five shares held
  await page.evaluate(() => { MS.newRun("ch1", "Maple Hollow 7"); MS.S.ui.intro = false; MS.S.ui.walk = "done"; MS.queue({ type: "GOAL_REVISE", amount: 50000 }); for (let i = 0; i < 5; i++) MS.queue({ type: "BUY", id: "BAKE", msh: 1000 }); MS.go("town"); });
  for (let i = 0; i < 4; i++) { await advanceOnce(page); if (await page.locator("#pull-keep").count()) await page.locator("#pull-keep").click(); }
  if (await page.locator(".screen.gazette").count()) await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Your goal day has arrived")).toBeVisible();
  await expect(page.locator(".screen.decision .goal-clerk")).toContainText("Your shares are worth 52.5, not enough with your Jar and wallet. You can move the date, or change the amount to what you have. Both are allowed.");
  await expect(page.getByRole("button", { name: /^Buy it|and buy it$/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Review my plan" })).toHaveCount(0);             // the two options follow, nothing that sends the player away
  await expect(page.locator(".screen.decision .opts .btn")).toHaveText(["Postpone my goal", "Change amount to what I have"]);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("rc10 (2) the doing strip: 30 of 30 ready after the walk's Jar step, goal fit lights with a 2.5 s toast; a stamp's line on a tap; checking the plan at the drop lights follow through", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await walkCh1(page, { to: 3 });
  const strip = page.locator(".town .doing"), toast = page.locator("#toast");
  await expect(strip).toHaveAttribute("aria-label", "How you’re doing");
  await expect(strip.locator("[data-row=goal]")).toContainText("0 of 30 ready · due in 1 year");
  await expect(strip.locator("[data-row=shares]")).toContainText("No shares yet.");
  await expect(strip.locator(".stamp-btn")).toHaveCount(2);                                    // chapter 1: goal fit and follow through only
  await expect(strip.locator(".stamp-btn.lit")).toHaveCount(0);
  await expect(strip.locator(".stamp-btn[data-dim=followThrough]")).toContainText("later");
  for (const b of await strip.locator(".stamp-btn").all()) expect((await b.boundingBox()).height).toBeGreaterThanOrEqual(48);
  await page.locator(".walk-card").getByRole("button", { name: "Put 30 in my Jar" }).click();
  await expect(strip.locator("[data-row=goal]")).toContainText("30 of 30 ready · due in 1 year");
  await expect(strip.locator("[data-row=goal] .ok")).toHaveText("✓");
  await expect(toast).toHaveAttribute("role", "status");
  await expect(toast).toHaveClass(/\bon\b/);
  await expect(toast).toContainText("Stamp: Pulled money to the goal in time");
  expect((await toast.boundingBox()).y).toBeLessThan(40);                                        // at the top
  await expect(strip.locator(".stamp-btn.lit")).toHaveAttribute("data-dim", "goalFit");
  const t0 = Date.now(); await expect(toast).not.toHaveClass(/\bon\b/, { timeout: 4000 }); expect(Date.now() - t0).toBeLessThan(3000);
  await page.locator(".walk-card").getByRole("button", { name: "Next", exact: true }).click();
  await walkCh1(page, { from: 4 }); await page.locator("#go").click(); await skipShow(page);
  await expect(strip.locator(".stamp-btn.lit")).toHaveCount(1);                                // still lit at month 3, and no second toast
  await expect(toast).not.toHaveClass(/\bon\b/);
  await strip.locator(".stamp-btn[data-dim=followThrough]").click();
  await expect(page.locator(".stamp-pop")).toHaveText("Checked the plan when prices fell");
  await page.locator(".town-title").click();                                                     // the next tap closes it
  await expect(page.locator(".stamp-pop")).toHaveCount(0);
  await advanceOnce(page);                                                                       // month 6, prices fell
  await expect(strip.locator(".stamp-btn[data-dim=followThrough]")).not.toHaveClass(/lit/);
  await page.getByRole("button", { name: "Review my plan" }).click(); await page.getByRole("button", { name: "Keep my plan" }).click();
  await expect(toast).toContainText("Stamp: Checked the plan when prices fell");
  await expect(strip.locator(".stamp-btn.lit")).toHaveCount(2);
  expect(errors, errors.join("\n")).toEqual([]);
});
test("rc10 (3) the shares row shows the change since you bought after the first season, from the engine's ledger", async ({ page }) => {
  const errors = watch(page);
  await ch1Bought(page, 3);
  const row = page.locator(".town .doing [data-row=shares]"), line = page.locator(".town .doing-clerk");
  await expect(row).toContainText("30 now · 0 since you bought");                              // a move in the tray is at today's price on both sides
  await page.locator("#town-next").click(); await page.locator("#go").click(); await skipShow(page);
  await expect(row).toContainText("33 now · +3 since you bought");
  await expect(row.locator(".up")).toHaveCount(1);
  await expect(line).toContainText("On track: your Jar is ready and your shares are up 3.");
  await advanceOnce(page);                                                                       // 11 to 9
  await expect(row).toContainText("27 now · −3 since you bought");
  await expect(line).toContainText("Your shares are down 3. You still own them, and your Jar did not move.");
  expect(errors, errors.join("\n")).toEqual([]);
});
test("rc10 (4) a queued move gets the Clerk's reaction where it was made: buys by how much of the wallet, a sell, a Jar move, the Basket; gone after an undo and at the next stop", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await skipWalk(page);
  const react = page.locator(".town .panel .panel-react");
  await expect(react).toHaveCount(0);
  await plus(page).click();
  await expect(react.locator(".eyebrow")).toHaveText("The Town Clerk");
  await expect(react).toContainText("1 share of Rise & Shine Bakery. A little of your free coins are at work; if the price dips, they dip. Your Jar is safe.");
  for (let i = 0; i < 3; i++) await plus(page).click();
  await expect(react).toContainText("4 shares of Rise & Shine Bakery. Some of your free coins are at work;");
  for (let i = 0; i < 3; i++) await plus(page).click();
  await expect(react).toContainText("7 shares of Rise & Shine Bakery. Most of your free coins are at work; if the price dips, they dip. Your Jar is safe.");
  await expect(react).toBeInViewport();                                                          // under the steppers the player just tapped
  await page.locator(".steppers").getByRole("button", { name: "Sell 1 share" }).click();
  await expect(react).toContainText("1 share sold at 10. The coins are back in your wallet.");
  await page.locator(".tray").getByRole("button", { name: "Show plan" }).click();
  await page.locator(".tray li").last().getByRole("button", { name: /^Undo/ }).click();
  await expect(react).toHaveCount(0);                                                            // an undo takes the reaction back
  await advanceOnce(page);
  await expect(page.locator(".panel-react")).toHaveCount(0);                                     // the next stop: the guide again, naming the buy
  await expect(page.locator(".hint.clerk")).toContainText("You bought 7 shares last stop. Same share. A different price.");
  await advanceOnce(page); await advanceOnce(page);                                              // month 9: the pull card; Move 30 to my Jar
  await page.locator("#pull-all").click();
  await expect(page.locator(".hint.clerk .react")).toHaveText("30 in the Jar. That money is out of the market now.");
  await expect(page.locator("#toast")).toContainText("Stamp: Pulled money to the goal in time");  // goal fit is credited at month 9
  await page.evaluate(() => { MS.newRun("ch2", "Maple Hollow 7"); MS.S.ui.intro = false; MS.go("town"); });
  await page.locator(".tile.stall").click(); await plus(page).click();
  await expect(page.locator(".panel[data-shop=BASKET] .panel-react")).toContainText("The Basket holds a little of every shop. One shop’s bad year matters less now.");
  expect(errors, errors.join("\n")).toEqual([]);
});
test("rc10 (6) the Clerk's line at every stop, in order: Watch the Jar with the goal within a year and Soon short, then one shop, then up or down, then steady", async ({ page }) => {
  const errors = watch(page);
  await page.goto(URL);
  await skipWalk(page);
  const line = page.locator(".town .doing-clerk");
  await expect(line).toContainText("Watch the Jar: 0 of 30 ready with 1 year to go.");           // chapter 1: due in a year, Soon empty
  await page.evaluate(() => { MS.newRun("ch2", "Maple Hollow 7"); MS.S.ui.intro = false; MS.go("town"); });
  await expect(line).toContainText("Steady.");                                                   // a move is offered below, so not "nothing needs doing"
  await expect(line).not.toContainText("Nothing needs doing");
  await expect(page.locator(".clerk.checkin [data-move=spread]")).toContainText("You hold no shares right now.");
  await page.locator(".tile").nth(1).click(); await plus(page).click(); await plus(page).click();
  await expect(line).toContainText("One shop carries your whole plan. Spreading out is a move.");
  await advanceOnce(page); expect(await settle(page, async () => {})).toBe("town");
  await expect(line).toContainText("One shop carries your whole plan.");                          // still one shop, due in 2 years
  await advanceOnce(page); expect(await settle(page, async () => {})).toBe("town");             // month 24: due in 1 year, Soon empty, the pull card closed
  await expect(line).toContainText("Watch the Jar: 0 of 210 ready with 1 year to go.");
  await expect(page.locator(".clerk.checkin [data-move=pull]")).toHaveClass(/told/);              // the line says it, the row is its button
  await expect(page.locator(".clerk.checkin [data-move=pull]").getByRole("button", { name: "Pull toward my goal" })).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});
