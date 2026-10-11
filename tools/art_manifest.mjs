// Rewrites art/manifest.json from the files in art/. Dev only; the output ships.
// Usage: node tools/art_manifest.mjs
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "art");
const files = readdirSync(dir).filter(f => /\.(webp|png)$/i.test(f)).sort()
  .map(name => ({ name, bytes: statSync(join(dir, name)).size }));
const total = files.reduce((s, f) => s + f.bytes, 0);
const over = files.filter(f => f.bytes > 40 * 1024).map(f => f.name);
writeFileSync(join(dir, "manifest.json"), JSON.stringify({ generated: new Date().toISOString().slice(0, 10), count: files.length, totalBytes: total, files }, null, 1) + "\n");
console.log(`${files.length} files, ${(total / 1024).toFixed(0)} KB total${over.length ? `; over 40 KB: ${over.join(", ")}` : ""}`);
if (total > 2 * 1024 * 1024) { console.error("art/ exceeds the 2 MB budget"); process.exit(1); }
