// Strategy bots over many seeds. Usage:
//   node tools/harness.mjs --seeds 10000 [--family free|ch2..ch6|all] [--preset standard] [--heldout] [--report docs/calibration.md]
//   --due prints each policy's net worth at the goal's due month (before goal day spending), p10 / p25 / p35 / p50 / p90, nominal and real, plus
//   the saving only total (start + every contribution + Jar interest, nothing invested, no surprise costs). This is the stake rule's input (docs/decisions.md, DECK3).
//   --goal ch2=230,ch3=240 overrides chapter goal amounts (coins, month 0 purchasing power when indexed) for this run only, to test candidates.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEngine, ROOT } from "./lib.mjs";
const { ENGINE: E, PARAMS, CONTENT } = loadEngine();
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
/* v1 design totals (drift + yield as first written in HANDOFF section 4). DECK2 moved each drift by the measured free-play gap so the realized mean lands here; the difference is the cost of authored moods and events. */
const DESIGN = { LEMN: 0.070, BAKE: 0.080, TOYS: 0.075, BIKE: 0.080, PAWS: 0.075, ROBO: 0.090 };
const N = +arg("--seeds", 1000), FAMILY = arg("--family", arg("--chapter", "free")), PRESET = arg("--preset", "standard"), HELDOUT = process.argv.includes("--heldout"), REPORT = arg("--report", null);
const families = FAMILY === "all" ? ["free", "ch2", "ch3", "ch4", "ch5", "ch6"] : [FAMILY];
const { sfc32, cyrb128 } = E._internals;
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(p * (s.length - 1))]; };
const POLS = arg("--policies", "ada,bo,cass,dev,random,planner").split(",");
const DUE = process.argv.includes("--due");
const GOALS = arg("--goal", ""); if (GOALS) for (const kv of GOALS.split(",")) { const [id, v] = kv.split("="); const ch = CONTENT.chapters.find(c => c.id === id); if (!ch || !(+v > 0)) throw new Error("bad --goal " + kv); ch.goal.amount = +v; }
/* The saving only total: every coin kept in the Jar from month 0, contributions added each month before interest accrues (HANDOFF 5 tick order), no surprise costs. */
function savingOnly(ch) { let cc = ch.start * 100; for (let t = 1; t <= ch.goal.due; t++) { cc += (ch.contrib || 0) * 100; if (ch.jarRate > 0) cc += Math.floor(cc * ch.jarRate / 12); } return cc / 100; }
const t0 = Date.now(); const out = [];
for (const fam of families) {
  const R = {}; for (const p of POLS) R[p] = { nom: [], real: [], gain: [], dd: [], goal: 0, belowAda: 0, score: [], moves: [], due: [], dueReal: [] };
  const drift = PARAMS.assets.map(() => []), arith = PARAMS.assets.map(() => []); let slumpRuns = 0, closures = 0, costs = 0, T = 0; const idxDue = [];
  for (let k = 0; k < N; k++) {
    const seed = (HELDOUT ? "v" : "h") + "|" + fam + "|" + k;
    const m = E.createMarket({ scenarioId: fam, seed, preset: fam === "free" ? PRESET : undefined }); T = m.T;
    if (m.slumps.length) slumpRuns++; if (m.closure) closures++; costs += m.lifeCosts.length;
    m.assets.forEach((a, i) => { let g = 1, sum = 0, n = 0; for (let tt = 1; tt <= m.T; tt++) if (tt < m.closedFrom[i]) { g *= m.G[i][tt]; sum += m.G[i][tt] - 1; n++; } drift[i].push(Math.pow(g, 12 / n) - 1); arith[i].push(sum / n * 12); });
    const res = {};
    for (const p of POLS) {
      const r = E.runPolicy(m, p, p === "random" ? { rng: sfc32(...cyrb128("bot|" + seed)) } : undefined), s = r.state;
      const sum = E.summarizeRun(s, m); res[p] = sum.netWorth;
      if (DUE && fam !== "free" && p === POLS[0]) idxDue.push(m.index[m.scenario.goal.due]);
      if (DUE && fam !== "free") { const dT = m.scenario.goal.due; R[p].due.push(r.nw[dT] / 100); R[p].dueReal.push(r.nw[dT] / m.index[dT] / 100); }
      R[p].nom.push(sum.netWorth / 100); R[p].real.push(sum.real / 100); R[p].gain.push(sum.money.result / 100);
      let pk = 0, dd = 0; for (const h of s.history) { pk = Math.max(pk, h.nw); if (pk > 0) dd = Math.max(dd, 1 - h.nw / pk); } R[p].dd.push(dd);
      if (s.goal.status === "funded") R[p].goal++; const sc = sum.score.total; if (sc !== null) R[p].score.push(sc); R[p].moves.push(r.moves.length);
    }
    for (const p of POLS) if (res.ada !== undefined && res[p] < res.ada) R[p].belowAda++;
  }
  const lines = [];
  lines.push(`### ${fam}${fam === "free" ? " (" + PRESET + ")" : ""}, ${N} seeds, ${HELDOUT ? "held-out" : "tuning"} set, ${T} months`);
  lines.push(``, `| Policy | Nominal p10 / p50 / p90 (coins) | Real p10 / p50 / p90 | Investment gain p50 | Max drawdown p50 / p90 | Goal funded | Below Ada | Plan Practice p10 / p50 / p90 | Moves p50 |`, `| --- | --- | --- | --- | --- | --- | --- | --- | --- |`);
  for (const p of POLS) { const r = R[p]; const f = a => [.1, .5, .9].map(x => q(a, x).toFixed(0)).join(" / ");
    lines.push(`| ${p} | ${f(r.nom)} | ${f(r.real)} | ${q(r.gain, .5).toFixed(0)} | ${(q(r.dd, .5) * 100).toFixed(0)}% / ${(q(r.dd, .9) * 100).toFixed(0)}% | ${(100 * r.goal / N).toFixed(0)}% | ${p === "ada" ? "" : (100 * r.belowAda / N).toFixed(0) + "%"} | ${r.score.length ? [.1, .5, .9].map(x => q(r.score, x)).join(" / ") : "n/a"} | ${q(r.moves, .5)} |`); }
  lines.push(``, `Slump in ${(100 * slumpRuns / N).toFixed(0)}% of runs · closures ${closures} · surprise costs per run ${(costs / N).toFixed(2)}`, ``);
  lines.push(`| Shop | Design total return, yearly (HANDOFF 4, v1) | drift + yield (the DECK2 knob) | Realized arithmetic mean | Gap to design (points) | Realized geometric (median growth) |`, `| --- | --- | --- | --- | --- | --- |`);
  PARAMS.assets.forEach((a, i) => { const mean = arith[i].reduce((x, y) => x + y, 0) / arith[i].length, geo = drift[i].reduce((x, y) => x + y, 0) / drift[i].length, knob = a.drift + a.yield, target = DESIGN[a.id]; lines.push(`| ${a.id} | ${(target * 100).toFixed(2)}% | ${(knob * 100).toFixed(2)}% | ${(mean * 100).toFixed(2)}% | ${((mean - target) * 100).toFixed(2)} | ${(geo * 100).toFixed(2)}% |`); });
  if (DUE && fam !== "free") { const ch = CONTENT.chapters.find(c => c.id === fam), so = savingOnly(ch), P = [.1, .25, .35, .5, .9];
    lines.push(`Stake (--due): goal ${ch.goal.amount}${ch.goal.indexed ? " (month 0 coins, indexed)" : ""} due month ${ch.goal.due}; saving only ${so.toFixed(2)} coins nominal${ch.goal.indexed ? `, ${(so / (idxDue.reduce((x, y) => x + y, 0) / idxDue.length)).toFixed(2)} in month 0 coins (nominal ÷ mean index ${(idxDue.reduce((x, y) => x + y, 0) / idxDue.length).toFixed(4)}; index p10 / p50 / p90 ${[.1, .5, .9].map(x => q(idxDue, x).toFixed(3)).join(" / ")})` : ""}`, ``, `| Policy | Net worth at due month, nominal p10 / p25 / p35 / p50 / p90 | Real p10 / p25 / p35 / p50 / p90 | Goal funded |`, `| --- | --- | --- | --- |`);
    for (const p of POLS) { const r = R[p]; const f = a => P.map(x => q(a, x).toFixed(0)).join(" / "); lines.push(`| ${p} | ${f(r.due)} | ${f(r.dueReal)} | ${(100 * r.goal / N).toFixed(1)}% |`); }
    lines.push(``); }
  out.push(lines.join("\n")); console.log(lines.join("\n")); console.log();
}
const secs = ((Date.now() - t0) / 1000).toFixed(1); console.log(`harness: ${N} seeds × ${families.length} famil${families.length > 1 ? "ies" : "y"} in ${secs} s`);
if (REPORT && process.argv.includes("--append")) {
  const path = resolve(ROOT, REPORT); writeFileSync(path, readFileSync(path, "utf8") + "\n" + `Appended by \`node tools/harness.mjs --seeds ${N} --family ${FAMILY} --preset ${PRESET}${HELDOUT ? " --heldout" : ""}\` in ${secs} s.\n\n` + out.join("\n\n") + "\n"); console.log("appended to", REPORT);
} else if (REPORT) {
  const path = resolve(ROOT, REPORT); let md = readFileSync(path, "utf8"); const marker = "## Finished engine (M6)";
  const head = md.includes(marker) ? md.slice(0, md.indexOf(marker)) : md + "\n";
  md = head + marker + "\n\n" + `Engine ${E.VERSION.engine} · Content ${E.VERSION.content} · Rubric ${E.VERSION.rubric} · generated ${new Date().toISOString().slice(0, 10)} by \`node tools/harness.mjs --seeds ${N} --family ${FAMILY}${HELDOUT ? " --heldout" : ""}\` in ${secs} s on this machine. Seeds follow the rule \`${HELDOUT ? "v" : "h"}|<family>|<k>\`. Realized total return is the mean annualized product of monthly factors with events included; the gap compares the arithmetic mean of monthly simple returns (times 12) with drift plus yield, which is what the drift parameter means; the geometric column is the median-style growth that variance drag pulls below it (HANDOFF 4). "Investment gain" is the ledger's market change plus interest, not final divided by initial wealth.\n\n` + out.join("\n\n") + "\n";
  writeFileSync(path, md); console.log("report written to", REPORT);
}
