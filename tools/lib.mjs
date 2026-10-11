// Shared loader for the dev tools: extracts <script id="engine"> and <script id="content"> from index.html
// and evaluates them in a fresh vm context, exactly as a browser would, with no DOM.
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export function readIndex() { return readFileSync(resolve(ROOT, "index.html"), "utf8"); }
export function extract(html, id) {
  const m = html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)</script>`));
  if (!m) throw new Error(`no <script id="${id}"> in index.html`);
  return m[1];
}
export function loadEngine(html = readIndex()) {
  const ctx = vm.createContext({ console, BigInt, Number, Math, Array, Object, JSON, Error, TypeError, RangeError, Int32Array, Float64Array, Uint32Array, String, Boolean, globalThis: undefined });
  ctx.globalThis = ctx;
  vm.runInContext(extract(html, "content"), ctx, { filename: "content.js" });
  vm.runInContext(extract(html, "engine"), ctx, { filename: "engine.js" });
  if (!ctx.ENGINE) throw new Error("engine did not set globalThis.ENGINE");
  return { ENGINE: ctx.ENGINE, PARAMS: ctx.PARAMS, CONTENT: ctx.CONTENT, STRINGS: ctx.STRINGS, engineSource: extract(html, "engine"), contentSource: extract(html, "content") };
}
// The purity list from HANDOFF section 14. Matched against the engine source only.
export const BANNED = ["Math.random", "Date", "document", "window", "localStorage", "fetch", "setTimeout", "**", "Math.pow", "Math.exp", "Math.log", "Math.sqrt", "Math.sin", "Math.cos", "toFixed", "toLocale", "Intl", "parseFloat", "requestAnimationFrame", "navigator", "performance", "async", "Promise", "Number('", 'Number("'];
export function purityViolations(src) {
  const stripped = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  return BANNED.filter(b => stripped.includes(b));
}
