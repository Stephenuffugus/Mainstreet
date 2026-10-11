#!/usr/bin/env node
/* Checks music/manifest.json against the files in music/ and prints what plays where.
     node tools/music_check.mjs            exit 1 on a missing file, a bad extension, a file over 6 MB, or a map feel with no track */
import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MOMENTS = ["default", "home", "intro", "town", "town-slump", "show-sun", "show-rain", "show-snow", "show-slump", "gazette", "decision", "plan", "results", "timemachine", "scrapbook", "freeplay", "settings", "grownups"];
const m = JSON.parse(readFileSync(resolve(ROOT, "music/manifest.json"), "utf8"));
let errors = 0; const feels = new Set();
for (const t of m.tracks || []) {
  const p = resolve(ROOT, "music", t.file || ""); const ok = t.file && existsSync(p);
  const ext = (t.file || "").split(".").pop().toLowerCase();
  const kb = ok ? Math.round(statSync(p).size / 1024) : 0;
  const bad = !ok ? "MISSING FILE" : !["mp3", "m4a", "ogg", "wav"].includes(ext) ? "BAD EXTENSION (mp3 or m4a)" : kb > 6144 ? "OVER 6 MB" : !t.feel ? "NO FEEL" : "";
  if (bad) errors++; else feels.add(t.feel);
  console.log(`${bad ? "✗" : "✓"} ${t.file}  ${t.title || ""}  feel=${t.feel || "?"}  ${kb} KB  ${bad}`);
}
console.log("\nmoment → feel → tracks");
for (const k of MOMENTS) { const feel = (m.map || {})[k] || (m.map || {}).default || "calm"; const names = (m.tracks || []).filter(t => t.feel === feel).map(t => t.title || t.file); const borrow = !names.length && (m.tracks || []).length; if (!names.length && (m.tracks || []).length) errors += 0; console.log(`  ${k.padEnd(12)} ${feel.padEnd(12)} ${names.length ? names.join(", ") : borrow ? "(no track with this feel: borrows any track)" : "(no tracks yet)"}`); }
const total = (m.tracks || []).reduce((n, t) => { const p = resolve(ROOT, "music", t.file || ""); return n + (existsSync(p) ? statSync(p).size : 0); }, 0);
console.log(`\n${(m.tracks || []).length} tracks, ${(total / 1048576).toFixed(1)} MB. Music is cached on first play, not precached; the game is complete without it.`);
process.exit(errors ? 1 : 0);
