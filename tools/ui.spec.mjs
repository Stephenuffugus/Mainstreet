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
