// Chapter 1 through the real UI, in a real browser. Evidence for the M2 exit conditions (HANDOFF 13) and the docs/playtest.md M2 checklist.
import { test, expect } from "@playwright/test";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const URL = "file://" + resolve(ROOT, "index.html");
// Under file:// WebKit logs a CORS error for the <link rel="manifest"> fetch; it does not happen over http and is not the game's doing.
const NOISE = /Access-Control-Allow-Origin|Failed to load resource/;
function watch(page) { const errors = []; page.on("pageerror", e => errors.push("pageerror: " + e.message)); page.on("console", m => { if (m.type() === "error" && !NOISE.test(m.text())) errors.push("console: " + m.text()); }); return errors; }
async function skipShow(page) { await expect(page.locator(".screen.show")).toBeVisible(); await page.getByRole("button", { name: "Skip" }).click(); }

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
  await expect(page.getByText("A share is one tiny piece of this business. Tap plus to buy one.")).toBeVisible();
  await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();                          // step 5
  await expect(page.locator(".tray")).toContainText("+1 share Rise & Shine Bakery");
  await expect(page.getByText("Buy 1 share for 10 coins. You keep 60 in your wallet.")).toBeVisible();
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
  await expect(page.getByText("Prices fell. Check when you need this money.")).toBeVisible(); // step 9 (FT1)
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
  await expect(page.locator(".stamps")).toContainText("Goal fit");
  await expect(page.locator(".stamps")).toContainText("Follow-through");
  await expect(page.locator(".stamp-row").filter({ hasText: "Spread" })).toContainText("Coming later");
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
  await pressUntil("Next season"); await pressUntil("Go to spring"); await pressUntil("Skip");
  await expect(page.locator(".screen.town")).toBeVisible(); await expect(page.locator(".price strong")).toContainText("11");
  expect(errors, errors.join("\n")).toEqual([]);
});

/* ---- M3 journeys: chapters 2 and 3 ---- */
async function advanceOnce(page) {
  const next = page.getByRole("button", { name: /^(Next year|Continue year|Next season)$/ });
  await next.click(); await page.locator("#go").click(); await skipShow(page);
}
async function settle(page, onCost) {
  // after a show: handle whatever screen arrived, until the town or the results page is showing
  for (let i = 0; i < 6; i++) {
    if (await page.locator(".screen.town").count()) return "town";
    if (await page.locator(".screen.results").count()) return "results";
    if (await page.locator(".screen.gazette").count()) { await page.getByRole("button", { name: "Continue" }).click(); continue; }
    if (await page.locator(".screen.decision").count()) {
      if (await page.getByText("Your goal day has arrived").count()) { await page.getByRole("button", { name: /^Buy it/ }).click(); continue; }
      await onCost(page); continue;
    }
    await page.waitForTimeout(100);
  }
  throw new Error("did not settle");
}
test("chapter 2: six shops, the Basket, Ada and Dev; no trading is ever required; results compare the plans", async ({ page }) => {
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
  await page.evaluate(() => { MS.newRun("ch5", "Clover Field 9"); MS.go("town"); });
  await expect(page.getByText("This is Cass.")).toBeVisible();
  await page.getByRole("button", { name: "Start exploring" }).click();
  await expect(page.locator(".house")).toHaveCount(4);
  await page.locator(".tile.stall").click();
  await page.locator(".steppers").getByRole("button", { name: "More" }).click();
  await page.getByRole("button", { name: /^Buy with half my wallet/ }).click();
  await page.locator(".tile").nth(2).click();                                          // Toy Box, which closes in this town
  await page.locator(".steppers").getByRole("button", { name: "Buy 1 share" }).click();
  const seen = await playThrough(page, null, async (p, acc) => { await readHint(p, acc); if (await p.locator(".tile").nth(2).locator(".ph").filter({ hasText: "shop-toys-closed" }).count()) acc.push("TILE_CLOSED"); });
  expect(seen.join(" | ")).toMatch(/Many families are spending less/);
  expect(seen.join(" | ")).toMatch(/Toy Box is closing/);
  expect(seen.join(" | ")).toMatch(/Toy Box has closed\. You got (about )?\d+ coins back/);
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
  await expect(page.locator(".stamp-row").filter({ hasText: "Cost awareness" })).toContainText("You read both cost cards before choosing.");
  await page.getByRole("button", { name: "Try one change" }).click();
  await page.locator("#tm-select").selectOption("fee");
  await expect(page.getByText(/Basket B, 1.5 of every 100 coins a year/)).toBeVisible();
  await page.getByRole("checkbox", { name: "Show what it can buy" }).check();
  await expect(page.locator(".gardens .garden")).toHaveCount(2);
  expect(errors, errors.join("\n")).toEqual([]);
});
