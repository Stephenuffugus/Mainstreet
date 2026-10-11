#!/usr/bin/env node
/* Rebuilds index.html from src/ (see tools/split.mjs). Syntax-checks every script block first and refuses to write a broken page.
   `node tools/join.mjs --check` only compares and exits 1 if index.html differs from what src/ would produce.           */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), ".."), SRC = resolve(ROOT, "src");
if (!existsSync(resolve(SRC, "shell.html"))) { console.error("no src/shell.html; run node tools/split.mjs first"); process.exit(2); }
let html = readFileSync(resolve(SRC, "shell.html"), "utf8");
for (const name of ["styles.css", "content.js", "engine.js", "app.js"]) {
  const body = readFileSync(resolve(SRC, name), "utf8");
  if (name.endsWith(".js")) { try { new Function(body); } catch (e) { console.error("syntax error in src/" + name + ": " + e.message); process.exit(1); } }
  const ph = "<!--@@" + name + "@@-->"; if (!html.includes(ph)) { console.error("placeholder missing in shell.html: " + ph); process.exit(1); }
  html = html.replace(ph, () => body);
}
const contentAt = html.indexOf('<script id="content">'), engineAt = html.indexOf('<script id="engine">');
if (!(contentAt >= 0 && engineAt > contentAt)) { console.error("the content block must come before the engine block"); process.exit(1); }
const current = readFileSync(resolve(ROOT, "index.html"), "utf8");
if (process.argv.includes("--check")) { if (current !== html) { console.error("index.html differs from src/; run node tools/join.mjs"); process.exit(1); } console.log("index.html matches src/"); process.exit(0); }
writeFileSync(resolve(ROOT, "index.html"), html);
console.log("index.html written (" + html.length + " bytes)" + (current === html ? ", unchanged" : ""));
