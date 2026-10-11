// Generates docs/art/ASSET-LIST.md (repo mirror) and an HTML copy for the Drive doc from one data table.
// Usage: node tools/asset_list.mjs [outHtmlPath]
import { writeFileSync } from "node:fs";
const SHOPS = [
  ["lemn","Lemon Lane","lemonade stand: striped awning, big glass jug on the counter, lemon crate","Lou the lemur"],
  ["bake","Rise & Shine Bakery","bakery: round window, bread basket by the door, chimney","Bram the badger"],
  ["toys","Toy Box","toy shop: tall display window, a kite above the door","Ottilie the otter"],
  ["bike","Spoke Bikes","bike shop: bike rack out front, wheel-shaped sign","Hop the hare"],
  ["paws","Paws Pet Care","pet care: kennel-style door, paw-print sign, water bowl","Hazel the hedgehog"],
  ["robo","Robo Lab","robot lab: round antenna on the roof, gadget in the window","Fen the fox"],
];
const STATE_DESC = {
  open:"base building, no customers, door open, daytime",
  busy:"overlay: a queue of three small paper animals at the door, an OPEN sign swung out, a crate being carried in",
  quiet:"overlay: empty forecourt, a cat asleep on the step, a broom against the wall (calm, not sad)",
  special:"overlay: the news cue for this shop (see Prompts doc), e.g. sun umbrellas and a long lemonade queue, flour sacks, a trend window, path-opening bunting, a full appointment board, a gadget demo",
  closed:"base variant: boards over the window, a cheerful NEW PROJECT banner, no keeper (keeper lives in the portrait)",
};
const rows = [];
let n = 0;
const add = (batch, file, group, desc, lane, note="") => rows.push({ n: ++n, batch, file, group, desc, lane, note, status: "LISTED" });
for (const [id, name, look] of SHOPS) {
  const first = id === "bake" ? "M2" : "M3";
  for (const st of ["open","busy","quiet"]) add(first, `shop-${id}-${st}.webp`, `Storefront, ${name}`, `${look}. ${STATE_DESC[st]}`, "Meshy to Blender", st==="open" ? "base render" : "overlay render, same camera");
  add("M4", `shop-${id}-special.webp`, `Storefront, ${name}`, `${look}. ${STATE_DESC.special}`, "Meshy to Blender", "overlay render");
  if (id === "toys" || id === "robo") add("M4", `shop-${id}-closed.webp`, `Storefront, ${name}`, `${look}. ${STATE_DESC.closed}`, "Meshy to Blender", "only Toy Box and Robo Lab can close at launch");
}
const KEEPERS = [["lou","lemur","Lemon Lane"],["bram","badger","Rise & Shine Bakery"],["ottilie","otter","Toy Box"],["hop","hare","Spoke Bikes"],["hazel","hedgehog","Paws Pet Care"],["fen","fox","Robo Lab"]];
const POSE = { neutral:"standing, apron, friendly, hands at sides", talking:"one paw raised, mouth open mid-sentence", busy:"holding the tools of the trade (tray, jug, kite, wrench, brush, screwdriver)" };
for (const [id, animal, shop] of KEEPERS) for (const p of ["neutral","talking","busy"]) add(id==="bram"?"M2":"M3", `keeper-${id}-${p}.webp`, `Keeper, ${shop}`, `paper-craft ${animal}, ${POSE[p]}; waist-up portrait framing`, "Meshy to Blender (character camera)", "");
const NEIGH = [["ada","owl","cardigan, calm, a small basket","M3"],["bo","tortoise","scarf, a lidded jar under one arm","M3"],["cass","magpie","a folded newspaper under one wing","M4"],["dev","goat","flat cap, one small pennant","M3"]];
for (const [id, animal, props, b] of NEIGH) {
  for (const p of ["neutral","talking"]) add(b, `neighbor-${id}-${p}.webp`, `Neighbor, ${id[0].toUpperCase()+id.slice(1)}`, `paper-craft ${animal}, ${props}; ${p==="neutral"?"standing, relaxed":"one hand raised, mid-sentence"}; face never reacts to money`, "Meshy to Blender (character camera)", "");
  add(b, `house-${id}.webp`, `House, ${id[0].toUpperCase()+id.slice(1)}`, `small paper-craft cottage, one door, one window, same footprint as the other three houses; color variant per neighbor`, "Meshy to Blender", "same footprint so the bottom row aligns");
}
add("M3","stall-normal.webp","Basket stall","market stall with a striped roof showing six small shop tiles on its board","Meshy to Blender","");
add("M4","stall-ab.webp","Basket stall","same stall with two tags, A and B, hanging from the roof (tags are shapes, text added live)","Meshy to Blender","");
add("M2","weather-sun.webp","Weather overlay","full-width transparent plate: a paper sun, two small clouds, warm light","2D lane","still frame under reduced motion");
add("M3","weather-rain.webp","Weather overlay","full-width transparent plate: grey paper clouds, diagonal rain lines","2D lane","");
add("M4","weather-snow.webp","Weather overlay","full-width transparent plate: soft clouds, paper snowflakes","2D lane","");
add("M2","plate-ground.webp","Plate","the street ground: warm cream cardstock with faint grain and a cut-paper curb line, tileable horizontally","2D lane","");
add("M2","plate-sky.webp","Plate","the sky: pale paper gradient, tileable horizontally","2D lane","");
const GOALS = [["art-supplies","a jar of brushes, paints and a sketchbook","M2"],["nature-trip","a rucksack, a map and a pair of binoculars","M3"],["bicycle","a small red bicycle with a basket","M3"],["project-kit","a wooden box of gears, wires and a notebook","M4"],["camp-week","a tent, a lantern and a rolled sleeping bag","M4"],["big-project","a sealed wooden crate with a question-mark tag (the child names it)","M4"]];
for (const [s, d, b] of GOALS) add(b, `goal-${s}.webp`, "Goal picture", `paper cut-out illustration: ${d}; neutral, no family-income implications`, "2D lane", "");
const DECO = [["plants","planter",["a fern","a lemon sapling","marigolds"],"M3"],["bunting","bunting string blown sideways by wind",["triangles","circles","leaves"],"M5"],["murals","mural board",["a sun","a bicycle","a town map"],"M5"],["benches","park bench",["plain","with a cat asleep on it","with an open book"],"M5"],["paths","path tile",["stone","brick","wood"],"M5"],["pinwheels","paper pinwheel on a stick",["red","blue","striped"],"M5"]];
for (const [f, base, vs, b] of DECO) vs.forEach((v, i) => add(b, `deco-${f}-${i+1}.webp`, `Decoration, ${f}`, `paper-craft ${base}: ${v} (variant ${i+1} of 3)`, "either lane", "deterministic choices, no rarity"));
for (const c of [1,2,3,4,5,6]) add("M5", `frame-ch${c}.webp`, "Scrapbook frame", `paper scrapbook page frame for chapter ${c}: torn edges, tape corners, a theme corner (${["a bread roll","six shop tiles","a jar","a payment envelope","a storm cloud passing","two baskets"][c-1]}); text stays live`, "2D lane", "");
for (const s of ["goal-fit","readiness","spread","follow-through","cost"]) add("M5", `stamp-${s}.webp`, "Stamp", `round paper stamp mark for ${s.replace("-"," ")}: ${({"goal-fit":"a target with a jar","readiness":"an umbrella","spread":"six dots in a ring","follow-through":"an open notebook","cost":"a pair of scales"})[s]}; no text`, "2D lane", "earned mark on the scrapbook page");
add("M5","card-back.webp","Album","the back of a town card: cream cardstock, a small MAINSTREET crest shape, no text","2D lane","the 40 card faces reuse existing sprites");
for (const k of ["oak","cherry"]) for (const st of [1,2,3,4,5]) add("M4", `tree-${k}-${st}.webp`, `Garden tree, ${k}`, `paper-craft ${k} tree at growth stage ${st} of 5 (${["sapling","small","medium","tall","broad"][st-1]}); same base footprint`, "Meshy to Blender", "time machine only");
add("M4","tree-ground.webp","Garden","flat paper ground tile for the two gardens","2D lane","");
add("M5","icon-192.png","PWA icon","the MAINSTREET mark: a paper storefront silhouette on cream, 192 px PNG","2D lane","to icons/");
add("M5","icon-512.png","PWA icon","same mark, 512 px PNG, maskable safe zone","2D lane","to icons/");
add("M5","portal-thumb-source.png","Portal thumbnail","square key art: the street with three shops and two neighbors, source size; the fleet resizes to 480 px / 150 KB","2D lane","not shipped in the game");

const byBatch = {}; for (const r of rows) (byBatch[r.batch] ??= []).push(r);
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const hdr = ["#","Batch","File","Group","What to make","Lane","Note","Status"];
const key = r => [r.n, r.batch, r.file, r.group, r.desc, r.lane, r.note, r.status];
let md = `# MAINSTREET asset list\n\nGenerated by \`node tools/asset_list.mjs\` on 2026-10-11. One row per file. Naming is the contract with the code (HANDOFF section 10, docs/ART-BRIEF.md). Sprites are 512 px WebP with alpha, under 40 KB, named by slot, dropped into \`art/\`; then \`node tools/art_manifest.mjs\`. Status: LISTED, DROPPED, CUT, WIRED, DEPLOYED (the fleet's ledger words).\n\nTotals: ${rows.length} files. By batch: ${Object.entries(byBatch).map(([b,a])=>`${b} ${a.length}`).join(", ")}.\n\n`;
let html = `<h1>MAINSTREET asset list</h1><p>Generated 2026-10-11 from <code>tools/asset_list.mjs</code> in the Mainstreet repo (mirror: <code>docs/art/ASSET-LIST.md</code>). One row per file. Naming is the contract with the code. Sprites are 512 px WebP with alpha, under 40 KB, named by slot, dropped into <code>art/</code>; then run <code>node tools/art_manifest.mjs</code>. Status words: LISTED, DROPPED, CUT, WIRED, DEPLOYED.</p><p><b>Totals:</b> ${rows.length} files. By batch: ${Object.entries(byBatch).map(([b,a])=>`${b} ${a.length}`).join(", ")}.</p>`;
for (const b of ["M2","M3","M4","M5"]) {
  const a = byBatch[b]; const title = {M2:"M2, first playable (Bakery only)",M3:"M3, town loop (six shops, Ada, Bo, Dev)",M4:"M4, time and uncertainty (Cass, closures, garden)",M5:"M5, finish (decorations, frames, stamps, icons)"}[b];
  md += `## ${title}\n\n| ${hdr.join(" | ")} |\n| ${hdr.map(()=>"---").join(" | ")} |\n` + a.map(r => `| ${key(r).map(x=>String(x).replace(/\|/g,"/")).join(" | ")} |`).join("\n") + "\n\n";
  html += `<h2>${title}</h2><table border="1" cellpadding="4" style="border-collapse:collapse"><tr>${hdr.map(h=>`<th>${h}</th>`).join("")}</tr>` + a.map(r => `<tr>${key(r).map(x=>`<td>${esc(x)}</td>`).join("")}</tr>`).join("") + `</table>`;
}
writeFileSync(new URL("../docs/art/ASSET-LIST.md", import.meta.url), md);
const out = process.argv[2]; if (out) writeFileSync(out, html);
const csvOut = process.argv[3]; if (csvOut) { const q = v => `"${String(v).replace(/"/g, '""')}"`; writeFileSync(csvOut, [hdr, ...rows.map(key)].map(r => r.map(q).join(",")).join("\n") + "\n"); }
console.log(`${rows.length} rows; ${Object.entries(byBatch).map(([b,a])=>`${b}:${a.length}`).join(" ")}`);
