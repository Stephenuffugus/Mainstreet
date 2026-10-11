#!/usr/bin/env node
/* Splits index.html into editable parts under src/ (ignored by git). Edit there, then `node tools/join.mjs`.
   Parts: src/shell.html (the page with placeholders), src/styles.css, src/content.js, src/engine.js, src/app.js.
   The split is verbatim, so split followed by join reproduces index.html byte for byte.                      */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), ".."), SRC = resolve(ROOT, "src");
mkdirSync(SRC, { recursive: true });
let html = readFileSync(resolve(ROOT, "index.html"), "utf8");
const parts = [["styles.css", /<style>([\s\S]*?)<\/style>/], ["content.js", /<script id="content">([\s\S]*?)<\/script>/], ["engine.js", /<script id="engine">([\s\S]*?)<\/script>/], ["app.js", /<script id="app">([\s\S]*?)<\/script>/]];
for (const [name, re] of parts) {
  const m = html.match(re); if (!m) { console.error("block not found for " + name); process.exit(1); }
  writeFileSync(resolve(SRC, name), m[1]);
  html = html.replace(re, (whole) => whole.replace(m[1], "<!--@@" + name + "@@-->"));
}
writeFileSync(resolve(SRC, "shell.html"), html);
console.log("split into src/: " + parts.map(p => p[0]).join(", ") + ", shell.html");
