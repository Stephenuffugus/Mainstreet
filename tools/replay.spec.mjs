// Golden fixtures replayed in real browser engines. Run: npx playwright test tools/replay.spec.mjs
import { test, expect } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(ROOT, "index.html"), "utf8");
const pick = id => html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)</script>`))[1];
const fixtures = readdirSync(resolve(ROOT, "tools/fixtures")).filter(f => f.endsWith(".json")).sort().map(f => JSON.parse(readFileSync(resolve(ROOT, "tools/fixtures", f), "utf8")));
test("golden fixtures replay identically in this browser engine", async ({ page }, info) => {
  await page.goto("file://" + resolve(ROOT, "tools/replay.html"));
  await page.addScriptTag({ content: pick("content") });
  await page.addScriptTag({ content: pick("engine") });
  const results = await page.evaluate(fx => window.MS_REPLAY.run(fx), fixtures);
  await page.evaluate(r => window.MS_REPLAY.show(r), results);
  console.log(`replay.html [${info.project.name}]: ` + results.map(r => `${r.name}:${r.pass ? "PASS" : "FAIL"}`).join(" "));
  for (const r of results) expect(r.pass, `${r.name} ${r.diff}`).toBe(true);
  expect(results.length).toBe(8);
});
