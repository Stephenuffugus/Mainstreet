// MAINSTREET test suite (HANDOFF section 14). Node, no dependencies. Usage: node tools/test.mjs [--write-fixtures]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { loadEngine, purityViolations, ROOT } from "./lib.mjs";
const { ENGINE: E, PARAMS, CONTENT, STRINGS, engineSource } = loadEngine();
const WRITE = process.argv.includes("--write-fixtures");
let pass = 0, fail = 0; const failures = [];
function t(name, fn) { try { const r = fn(); if (r === false) throw new Error("returned false"); pass++; } catch (e) { fail++; failures.push(name + ": " + (e && e.message || e)); } }
const eq = (a, b, msg) => { if (a !== b) throw new Error((msg || "") + " expected " + JSON.stringify(b) + " got " + JSON.stringify(a)); };
const near = (a, b, tol, msg) => { if (!(Math.abs(a - b) <= tol)) throw new Error((msg || "") + " |" + a + " - " + b + "| > " + tol); };
const deep = (a, b, msg) => eq(JSON.stringify(a), JSON.stringify(b), msg);
const ok = (c, msg) => { if (!c) throw new Error(msg || "assertion failed"); };
const { sfc32, cyrb128, POLICIES, fundingPlan } = E._internals;
const M = (id, seed, extra) => E.createMarket({ scenarioId: id, seed, ...(extra || {}) });
const jar = s => s.jar.soon + s.jar.buffer + s.jar.saved;
const nw = (s, m) => s.wallet + jar(s) + E.invested(s, m, s.t);

/* ---------------- conservation laws ---------------- */
function checkLaws(s) {
  const h = s.history;
  for (let k = 1; k < h.length; k++) {
    const a = h[k - 1], b = h[k], ta = a.tot, tb = b.tot;
    const rhs = (tb.contributionsIn - ta.contributionsIn) + (tb.jarInterest - ta.jarInterest) + (tb.dividendsCash - ta.dividendsCash) + (tb.sellProceeds - ta.sellProceeds) + (tb.liquidationPaid - ta.liquidationPaid) - (tb.buySpend - ta.buySpend) - (tb.reinvestSpend - ta.reinvestSpend) - (tb.goalSpending - ta.goalSpending) - (tb.costSpending - ta.costSpending);
    eq((b.wallet + b.jar) - (a.wallet + a.jar), rhs, "cash law t=" + b.t);
    const ids = new Set([...Object.keys(a.pos), ...Object.keys(b.pos), ...Object.keys(b.flow.buy), ...Object.keys(b.flow.sell), ...Object.keys(b.flow.reinv), ...Object.keys(b.flow.liq)]);
    for (const id of ids) eq((b.pos[id] || 0), (a.pos[id] || 0) + (b.flow.buy[id] || 0) + (b.flow.reinv[id] || 0) - (b.flow.sell[id] || 0) - (b.flow.liq[id] || 0), "share law " + id + " t=" + b.t);
    for (const v of [b.wallet, b.jar]) ok(Number.isSafeInteger(v) && v >= 0, "non-negative safe integer t=" + b.t);
  }
}
const SEEDS = ["Maple Hollow 7", "Pebble Creek 3", "Willow Bend 41", "Harbor Lane 12", "Clover Field 9"];
for (const ch of CONTENT.chapters) for (const seed of SEEDS.slice(0, 2)) {
  const m = M(ch.id, seed);
  for (const pol of ["ada", "bo", "cass", "dev", "planner"]) t(`laws ${ch.id} ${seed} ${pol}`, () => checkLaws(E.runPolicy(m, pol).state));
  t(`laws ${ch.id} ${seed} random`, () => checkLaws(E.runPolicy(m, "random", { rng: sfc32(...cyrb128("bot|" + ch.id + seed)) }).state));
}


/* ---------------- art slots: everything the app can ask for exists in art/manifest.json ---------------- */
t("every art slot the app can request exists in art/manifest.json", () => {
  const files = new Set(JSON.parse(readFileSync(resolve(ROOT, "art/manifest.json"), "utf8")).files.map(f => f.name));
  const slots = new Set(["stall-normal", "stall-ab", "plate-sky", "plate-ground", "card-back", "tree-ground"]);
  for (const a of PARAMS.assets) { const id = a.id.toLowerCase(); for (const st of ["open", "busy", "quiet", "special"]) slots.add(`shop-${id}-${st}`); for (const pose of ["neutral", "talking", "busy"]) slots.add(`keeper-${a.keeper}-${pose}`); }
  for (const id of CONTENT.freePlay && CONTENT.freePlay.closureCandidates || ["TOYS", "ROBO"]) slots.add(`shop-${id.toLowerCase()}-closed`);
  for (const sc of CONTENT.chapters) { if (sc.closure && sc.closure.candidates) for (const id of sc.closure.candidates) slots.add(`shop-${id.toLowerCase()}-closed`); for (const n of sc.neighbors || []) { for (const pose of ["neutral", "talking"]) slots.add(`neighbor-${n}-${pose}`); slots.add(`house-${n}`); } if (sc.id !== "free") slots.add(`frame-${sc.id}`); }
  for (const g of Object.keys(CONTENT.goals)) slots.add(`goal-${g}`);
  for (const fam of ["plants", "bunting", "murals", "benches", "paths", "pinwheels"]) for (const n of [1, 2, 3]) slots.add(`deco-${fam}-${n}`);
  for (const d of ["goal-fit", "readiness", "spread", "follow-through", "cost"]) slots.add(`stamp-${d}`);
  for (const k of ["oak", "cherry"]) for (let st = 1; st <= 5; st++) slots.add(`tree-${k}-${st}`);
  for (const seed of SEEDS) { const m = M("free", seed, { preset: "late-storm" }); const r = E.advance(E.createRun({ market: m }), m, 36); for (const f of r.frames) slots.add(`weather-${f.weather}`); }
  const missing = [...slots].filter(s => !files.has(s + ".webp"));
  eq(missing.length, 0, "missing art for: " + missing.join(", "));
  ok(slots.size >= 100, "slot enumeration looks complete: " + slots.size);
});

/* ---------------- buy lossless, sell < 1 cc, 1000 cycles ---------------- */
for (const q of [800, 5000, 11200]) t(`buy lossless at quote ${q}`, () => {
  for (let X = 1; X <= 20000; X++) { const msh = E.mshForCash(X, q); if (msh <= 0) continue; const spend = E.posValue(msh, q); ok(spend <= X, "spend <= X"); eq(E.posValue(msh, q), spend, "value equals spend"); }
  let wallet = 1000000, msh = 0, lost = 0; for (let i = 0; i < 1000; i++) { const b = E.mshForCash(1234, q); wallet -= E.posValue(b, q); msh += b; wallet += E.posValue(msh, q); msh = 0; } lost = 1000000 - wallet; ok(lost >= 0 && lost < 1000, "1000 cycles lose under 1000 cc and never gain: lost " + lost);
});

/* ---------------- total-return convention (R06) ---------------- */
t("total return compounds at drift plus yield; price at the closed form (noise, events and moods off)", () => {
  const m = M("ch4", "tr", { _test: { noNoise: true, noEvents: true, flatMood: true } });
  m.assets.forEach((a, i) => {
    let sh = 1, expP = 1; for (let tt = 1; tt <= m.T; tt++) { const G = m.G[i][tt]; near(G, 1 + a.driftM + a.yieldM, 1e-12, a.id + " G"); const D = G * m.prices[i][tt - 1] - m.prices[i][tt]; if (D > 1e-12) sh *= 1 + D / m.prices[i][tt]; const payM = PARAMS.divMonths.includes(((tt - 1) % 12) + 1); expP *= (G - (payM && a.yield > 0 ? a.yield / 4 : 0)); }
    const total = sh * m.prices[i][m.T] / m.prices[i][0], expTotal = Math.pow(1 + a.driftM + a.yieldM, m.T);
    near(total / expTotal, 1, 1e-9, a.id + " total return path"); near(m.prices[i][m.T] / m.prices[i][0] / expP, 1, 1e-9, a.id + " price closed form");
    const yrs = m.T / 12; near(Math.pow(total, 1 / yrs) - 1, Math.pow(1 + a.driftM + a.yieldM, 12) - 1, 1e-9, a.id + " total CAGR is monthly-compounded drift plus yield");
  });
});

/* ---------------- dividends ---------------- */
t("dividend: holder value after plus cash equals total-return value within 1 cc per share", () => {
  const m = M("ch4", "div", { _test: { noEvents: true } }); const i = 1; // BAKE
  let checked = 0; for (let tt = 1; tt <= m.T; tt++) if (m.divCC[i][tt] > 0) { const before = m.prices[i][tt - 1] * m.G[i][tt] * 100; const after = E.posValue(1000, m.quotes[i][tt]) + Math.floor(1000 * m.divCC[i][tt] / 1000); near(after, before, 1.5, "t=" + tt); checked++; }
  ok(checked >= 10, "checked " + checked);
});
t("dividend suspended: no cash, price follows P × G (E18 factor 0 or G below 0.7)", () => {
  let found = 0;
  for (let k = 0; k < 40 && found < 2; k++) { const m = M("ch4", "e18-" + k); if (!m.e18 || m.e18.factor !== 0) continue; found++; const i = m.scenario.assetIdx[m.e18.id];
    for (let tt = m.e18.t; tt < m.e18.t + 12 && tt <= m.T; tt++) { eq(m.divCC[i][tt], 0, "no cash at t=" + tt); near(m.prices[i][tt], m.prices[i][tt - 1] * m.G[i][tt], 1e-9, "P = P × G at t=" + tt); } }
  ok(found >= 1, "found a factor-0 E18 market");
});
t("dividend halved by E18: cash halves for 12 months", () => {
  let found = 0; for (let k = 0; k < 60 && !found; k++) { const m = M("ch4", "e18h-" + k); if (!m.e18 || m.e18.factor !== 0.5) continue; found = 1; const i = m.scenario.assetIdx[m.e18.id], a = m.assets[i];
    for (let tt = m.e18.t; tt < m.e18.t + 12 && tt <= m.T; tt++) if (m.divCC[i][tt] > 0) eq(m.divCC[i][tt], Math.round(m.quotes[i][tt - 1] * a.yield * 0.5 / 4), "halved at t=" + tt); }
  ok(found, "found a factor-0.5 E18 market");
});
t("reinvest on converts cash to shares once at the ex quote; contributionsIn unchanged", () => {
  const m = M("ch4", "reinv"); const s = E.createRun({ market: m }); const mut = E._mut;
  mut.applyMut(s, { type: "REINVEST", on: true }, m); mut.applyMut(s, { type: "BUY", id: "BAKE", msh: 5000 }, m);
  const c0 = s.totals.contributionsIn; mut.advanceMut(s, m, 12);
  const h = s.history; let paid = 0, reinvMsh = 0; for (let k = 1; k < h.length; k++) { paid += h[k].tot.dividendsCash - h[k - 1].tot.dividendsCash; reinvMsh += h[k].flow.reinv.BAKE || 0; }
  ok(paid > 0 && reinvMsh > 0, "paid " + paid + " reinv " + reinvMsh); eq(s.totals.contributionsIn - c0, 12 * 1000, "contributions unchanged by reinvestment");
  near(s.totals.reinvestSpend, s.totals.dividendsCash, 60, "cash converted (rounding under 1 cc per payment per holding plus residue)");
});
t("basket NAV equals the sum of its holdings' total-return paths times the fee factor between rebalances", () => {
  const m = M("ch4", "nav"), f = m.funds.BASKET, e = f.expense; const starts = []; for (let tt = 1; tt < m.T; tt++) if (((tt - 1) % 12) + 1 === 1 && tt > 1) starts.push(tt);
  for (const t0 of starts) { const t1 = Math.min(m.T, t0 + 11); let sum = 0; for (let i = 0; i < m.assets.length; i++) { let tr = 1; for (let tt = t0 + 1; tt <= t1; tt++) tr *= m.G[i][tt]; sum += f.w[t0][i] * tr; } near(f.nav[t1] / f.nav[t0], sum * Math.pow(1 - e / 12, t1 - t0), 1e-9, "year from " + t0); }
});
t("look-through: basket plus bakery counts bakery once at look-through weight; works for BASKET_A and BASKET_B", () => {
  const m = M("ch6", "lt"); const s = E.createRun({ market: m }); const mut = E._mut; mut.applyMut(s, { type: "VIEW_COST", id: "BASKET_A" }, m); mut.applyMut(s, { type: "CHOOSE_BASKET", id: "BASKET_A" }, m);
  mut.applyMut(s, { type: "BUY", id: "BASKET_A", msh: 10000 }, m); mut.applyMut(s, { type: "BUY", id: "BASKET_B", msh: 5000 }, m); mut.applyMut(s, { type: "BUY", id: "BAKE", msh: 3000 }, m);
  const ex = E.exposure(s, m, 0); const vA = E.posValue(10000, m.funds.BASKET_A.navQ[0]), vB = E.posValue(5000, m.funds.BASKET_B.navQ[0]), vK = E.posValue(3000, m.quotes[1][0]);
  const expected = (vA * m.funds.BASKET_A.w[0][1] + vB * m.funds.BASKET_B.w[0][1] + vK) / (vA + vB + vK); near(ex.company[1], expected, 1e-12); near(ex.company.reduce((a, b) => a + b, 0), 1, 1e-12);
});
t("matched fee lab: B never above A; ratio equals the compounded fee gap", () => {
  for (const seed of SEEDS) { const m = M("ch6", seed), A = m.funds.BASKET_A, B = m.funds.BASKET_B; for (let tt = 0; tt <= m.T; tt++) { ok(B.nav[tt] <= A.nav[tt] + 1e-12, "B above A at " + tt); near(B.nav[tt] / A.nav[tt], Math.pow((1 - 0.015 / 12) / (1 - 0.002 / 12), tt), 1e-9, "ratio at " + tt); } }
});

/* ---------------- actions ---------------- */
t("wallet and jar transfers leave net worth and contributionsIn unchanged", () => {
  const m = M("ch3", "xfer"); const s = E.createRun({ market: m }); const n0 = nw(s, m), c0 = s.totals.contributionsIn;
  const s1 = E.applyAction(s, { type: "JAR_IN", band: "soon", cc: 3000 }, m), s2 = E.applyAction(s1, { type: "EARMARK", from: "soon", to: "buffer", cc: 1000 }, m), s3 = E.applyAction(s2, { type: "JAR_OUT", band: "buffer", cc: 500 }, m);
  eq(nw(s3, m), n0); eq(s3.totals.contributionsIn, c0); eq(s3.jar.soon, 2000); eq(s3.jar.buffer, 500); eq(s3.wallet, 20000 - 2500);
});
t("goal purchase: cash falls once, goalSpending rises once, score unchanged", () => {
  const m = M("ch1", "goal"); const s = E.createRun({ market: m }); const mut = E._mut; mut.applyMut(s, { type: "JAR_IN", band: "soon", cc: 3000 }, m); mut.applyMut(s, { type: "BUY", id: "BAKE", msh: 1000 }, m);
  for (const to of [3, 6, 9, 12]) mut.advanceMut(s, m, to);
  ok(s.queue.some(q => q.id === "E21" && !q.resolved), "E21 pending"); const before = E.scorePlanPractice(s, m).total, w0 = s.wallet + jar(s);
  mut.applyMut(s, { type: "FUND_GOAL" }, m); eq(s.totals.goalSpending, 3000); eq(w0 - (s.wallet + jar(s)), 3000); eq(s.goal.status, "funded"); eq(E.scorePlanPractice(s, m).total, before);
  mut.finishMut(s, m); eq(s.ended, true);
});
t("contribution: contributionsIn rises by exactly the contribution each month; the year panel labels it as added", () => {
  const m = M("ch4", "contrib"); const s = E.createRun({ market: m }); const mut = E._mut; mut.applyMut(s, { type: "ROUTE", to: "BASKET" }, m); mut.advanceMut(s, m, 12);
  for (let k = 1; k < s.history.length; k++) eq(s.history[k].tot.contributionsIn - s.history[k - 1].tot.contributionsIn, 1000, "t=" + k);
  eq(E.yearPanel(s, m, 1).money.added, 12000);
});
t("overspend, oversell, zero quote, negative, NaN: errors and an untouched draft", () => {
  const m = M("ch2", "bad"); const s = E.createRun({ market: m }); const snapshot = JSON.stringify(s);
  const bad = [{ type: "BUY", id: "LEMN", cc: 99999999 }, { type: "SELL", id: "LEMN", msh: 1 }, { type: "BUY", id: "LEMN", msh: -5 }, { type: "BUY", id: "LEMN", msh: NaN }, { type: "BUY", id: "NOPE", cc: 100 }, { type: "JAR_IN", band: "buffer", cc: 100 }, { type: "JAR_OUT", band: "soon", cc: 1 }, { type: "FUND_COST" }, { type: "POSTPONE" }, { type: "BUY", id: "LEMN", cc: 0 }, null, { type: "WHAT" }];
  for (const a of bad) ok(E.validateAction(s, a, m).ok === false, "should reject " + JSON.stringify(a));
  eq(JSON.stringify(s), snapshot, "draft untouched");
});
t("pending tray: replayPending equals sequential applies; undo restores the prior draft; an invalid pending commits nothing", () => {
  const m = M("ch2", "tray"); const cp = E.createRun({ market: m }); const pend = [{ type: "BUY", id: "BAKE", msh: 2000 }, { type: "BUY", id: "BASKET", cc: 5000 }, { type: "JAR_IN", band: "soon", cc: 1000 }];
  let seq = cp; for (const a of pend) seq = E.applyAction(seq, a, m); const d = E.replayPending(cp, pend, m); deep(d, seq);
  deep(E.replayPending(cp, pend.slice(0, -1), m), E.applyAction(E.applyAction(cp, pend[0], m), pend[1], m), "undo");
  const before = JSON.stringify(cp); let threw = false; try { E.replayPending(cp, [...pend, { type: "SELL", id: "ROBO", msh: 1 }], m); } catch (e) { threw = true; } ok(threw); eq(JSON.stringify(cp), before);
});
t("closure: suspended at announcement, paid once next month, removed, funds redistribute, no resurrection", () => {
  let found = 0; for (let k = 0; k < 60 && !found; k++) { const m = M("ch5", "close-" + k); if (!m.closure) continue; found = 1; const c = m.closure, i = m.scenario.assetIdx[c.id];
    const s = E.createRun({ market: m }); const mut = E._mut; mut.applyMut(s, { type: "BUY", id: c.id, msh: 2000 }, m); mut.applyMut(s, { type: "BUY", id: "BASKET", msh: 3000 }, m);
    while (s.t < c.announceT) { mut.advanceMut(s, m, Math.min(E.nextStop(s, m.scenario), c.announceT)); for (const q of s.queue) if (q.required && !q.resolved) { if (q.id === "E20") mut.applyMut(s, { type: "FUND_COST" }, m); } }
    eq(s.t, c.announceT); eq(E.validateAction(s, { type: "BUY", id: c.id, msh: 1 }, m).code, "CLOSED"); eq(E.validateAction(s, { type: "SELL", id: c.id, msh: 1 }, m).code, "CLOSED");
    const held = s.pos[c.id]; mut.advanceMut(s, m, c.announceT + 1); eq(s.totals.liquidationPaid, E.posValue(held, c.liqQuote)); eq(s.pos[c.id], undefined);
    near(m.funds.BASKET.w[c.announceT + 1][i], 0, 1e-12, "fund weight zero"); ok(m.funds.BASKET.nav[c.announceT + 1] > 0);
    for (let tt = c.announceT + 1; tt <= m.T; tt++) eq(m.quotes[i][tt], c.liqQuote, "frozen quote"); }
  ok(found, "found a closure market");
});
t("zero wealth: summaries and score render", () => {
  const m = M("ch2", "zero"); const s = E.createRun({ market: m }); s.wallet = 0; const sum = E.summarizeRun(s, m); eq(sum.netWorth, 0); ok(sum.exposure === null); ok(E.scorePlanPractice(s, m).total === null || typeof E.scorePlanPractice(s, m).total === "number");
});

/* ---------------- neighbors ---------------- */
t("neighbors pay the same costs; Ada and Bo satisfy the laws; Dev's pick is stable; Cass moves at most once per stop; neighbors never read the child's state", () => {
  for (const seed of SEEDS.slice(0, 3)) { const m = M("ch5", seed), m2 = M("ch5", seed); eq(m.devPick, m2.devPick, "dev pick stable");
    const runs = {}; for (const id of m.scenario.neighbors) runs[id] = E.runPolicy(m, id);
    const costs = m.lifeCosts.reduce((a, c) => a + c.cc, 0); for (const id in runs) { const tt = runs[id].state.totals; eq(tt.costSpending + tt.costUnmet, costs, id + " paid or reported every cost"); }
    checkLaws(runs.ada.state); checkLaws(runs.bo.state); checkLaws(runs.cass.state); checkLaws(runs.dev.state);
    const stops = new Set(runs.cass.moves.map(x => x.t)); eq(stops.size, runs.cass.moves.length, "one move per stop");
    const nb1 = E.neighborLedgers(m); const alt = E.runPolicy(m2, "random", { rng: sfc32(...cyrb128("x")) }); const nb2 = E.neighborLedgers(m2); deep(nb1.ada.nw, nb2.ada.nw, "ada independent of the child"); deep(nb1.cass.nw, nb2.cass.nw, "cass independent"); }
});
t("Bo pays the chapter 3 cost from the jar in every fixture seed", () => {
  for (const seed of SEEDS) { const m = M("ch3", seed); const r = E.runPolicy(m, "bo"); eq(r.state.totals.costUnmet, 0); eq(r.state.totals.sellProceeds, 0, "no sale"); ok(r.state.totals.costSpending > 0); }
});

/* ---------------- scoring and abuse ---------------- */
t("opening a cost card 100 times or the plan 100 times earns the same credit as once", () => {
  const m = M("ch6", "ca"); const s = E.createRun({ market: m }); const mut = E._mut; for (let i = 0; i < 100; i++) { mut.applyMut(s, { type: "VIEW_COST", id: "BASKET_A" }, m); mut.applyMut(s, { type: "VIEW_COST", id: "BASKET_B" }, m); mut.applyMut(s, { type: "VIEW_PLAN" }, m); }
  mut.applyMut(s, { type: "CHOOSE_BASKET", id: "BASKET_B" }, m); mut.applyMut(s, { type: "BUY", id: "BASKET_B", cc: 10000 }, m); mut.advanceMut(s, m, 12);
  eq(s.opps.CA6.passed, true, "credit once, even for the higher-fee basket"); const s2 = E.createRun({ market: m }); mut.applyMut(s2, { type: "VIEW_COST", id: "BASKET_A" }, m); mut.applyMut(s2, { type: "VIEW_COST", id: "BASKET_B" }, m); mut.applyMut(s2, { type: "CHOOSE_BASKET", id: "BASKET_B" }, m); mut.applyMut(s2, { type: "BUY", id: "BASKET_B", cc: 10000 }, m); mut.advanceMut(s2, m, 12); eq(E.scorePlanPractice(s2, m).total, E.scorePlanPractice(s, m).total);
});
t("a planned withdrawal for the goal never erases earlier credit", () => {
  const m = M("ch1", "wd"); const s = E.createRun({ market: m }); const mut = E._mut; mut.applyMut(s, { type: "JAR_IN", band: "soon", cc: 3000 }, m); for (const to of [3, 6, 9, 12]) mut.advanceMut(s, m, to);
  const before = JSON.stringify(s.opps); mut.applyMut(s, { type: "FUND_GOAL" }, m); mut.finishMut(s, m); eq(JSON.stringify(s.opps), before); eq(s.opps.GF1a.passed, true); eq(s.opps.GF1b.passed, true);
});
t("two identical action sequences on two different seeds earn identical scores (chapter 1 script)", () => {
  const run = seed => { const m = M("ch1", seed); return E.scorePlanPractice(E.runPolicy(m, "planner").state, m).total; }; eq(run("a"), run("b"));
});
t("a random clicker scores below Ada on the same seeds; a cash-only planner in chapter 3 scores 100", () => {
  let ada = 0, rnd = 0; for (const seed of SEEDS) { const m = M("ch3", seed); ada += E.scorePlanPractice(E.runPolicy(m, "planner").state, m).total; rnd += E.scorePlanPractice(E.runPolicy(m, "random", { rng: sfc32(...cyrb128("r" + seed)) }).state, m).total; } ok(rnd < ada, "random " + rnd + " < plan follower " + ada);
  const cashOnly = { atStop(c, s) { E._internals.POLICIES.planner.atStop === undefined; POLICIES.bo.atStop(c, s); E.validateAction(s, { type: "VIEW_PLAN" }, c.m).ok && E._mut.applyMut(s, { type: "VIEW_PLAN" }, c.m); }, decide: POLICIES.bo.decide };
  for (const seed of SEEDS) { const m = M("ch3", seed); eq(E.scorePlanPractice(E.runPolicy(m, cashOnly).state, m).total, 100, seed); }
});
t("neighbors, decorations and album never change the score", () => {
  const m = M("ch2", "deco"); const s = E.createRun({ market: m }); const mut = E._mut; mut.applyMut(s, { type: "BUY", id: "BASKET", cc: 10000 }, m); mut.advanceMut(s, m, 12); const a = E.scorePlanPractice(s, m).total;
  mut.applyMut(s, { type: "DECORATE", family: "plants", n: 2 }, m); mut.applyMut(s, { type: "DISCOVERY", text: "x" }, m); E.neighborLedgers(m); eq(E.scorePlanPractice(s, m).total, a);
});

/* ---------------- content ---------------- */
t("every shock card's sign matches expectedDirection (E08 regression)", () => {
  for (const c of CONTENT.cards) if (c.kind === "shock") for (const k in c.eligibleAssets) { const sign = Math.sign(c.eligibleAssets[k] * c.companyEffect.mean); eq(sign > 0 ? "up" : "down", c.expectedDirection[k], c.id + " " + k); }
});
t("every card has every schema field, null explicit", () => {
  const F = ["id", "kind", "chapterMin", "headline", "shortExplanation", "visualCue", "accessibilityText", "keeperLine", "learningPoint", "eligibleAssets", "expectedDirection", "season", "cooldownMonths", "prerequisites", "regimeEffect", "companyEffect", "durationMonths", "informationTiming", "decisionRequired", "variants"];
  for (const c of CONTENT.cards) for (const f of F) ok(f in c, c.id + " missing " + f); eq(CONTENT.cards.length, 24);
});
t("E20 variant headlines avoid the chapter's goal noun", () => {
  const nouns = { ch3: ["bike", "bicycle"], ch5: ["camp"], ch6: ["project"] }; const v = CONTENT.cards.find(c => c.id === "E20").variants;
  for (const ch of CONTENT.chapters) { if (!ch.lifeCost || !ch.lifeCost.variant) continue; const head = v[ch.lifeCost.variant].toLowerCase(); for (const n of nouns[ch.id] || []) ok(!head.includes(n), ch.id + " variant mentions " + n); }
});
t("keepers: three idle lines each; every shock card has a keeper line for its first asset; no money talk", () => {
  for (const k in STRINGS.keepers) for (const f of ["busy", "normal", "quiet"]) ok(STRINGS.keepers[k][f].length > 5, k + " " + f);
  const banned = /\b(price|share|buy|sell)\b|\d+ coins/i;
  for (const c of CONTENT.cards) { if (c.kind !== "shock") continue; const first = Object.keys(c.eligibleAssets)[0]; ok(c.keeperLine && (c.keeperLine[first] || c.keeperLine.ALL || c.keeperLine.ANY), c.id + " keeper line"); for (const k in c.keeperLine) ok(!banned.test(c.keeperLine[k]), c.id + " money talk: " + c.keeperLine[k]); }
  for (const k in STRINGS.keepers) for (const f of ["busy", "normal", "quiet"]) ok(!banned.test(STRINGS.keepers[k][f]), k + " money talk");
});
t("no em or en dash in any player string; exclamation marks only on goal day and chapter end", () => {
  const walk = (o, path, out) => { if (typeof o === "string") out.push([path, o]); else if (Array.isArray(o)) o.forEach((v, i) => walk(v, path + "[" + i + "]", out)); else if (o && typeof o === "object") for (const k in o) walk(o[k], path + "." + k, out); return out; };
  const all = [...walk(STRINGS, "STRINGS", []), ...walk(CONTENT.cards.map(c => ({ headline: c.headline, shortExplanation: c.shortExplanation, learningPoint: c.learningPoint, keeperLine: c.keeperLine, variants: c.variants })), "cards", [])];
  for (const [p, s] of all) { ok(!/[–—]/.test(s), "dash in " + p + ": " + s); if (/!/.test(s)) ok(/goalFunded|chapterEnd/.test(p), "exclamation in " + p + ": " + s); }
});
t("town names: both lists have at least 24 entries and a name round-trips", () => { ok(CONTENT.townNames.adj.length >= 24 && CONTENT.townNames.noun.length >= 24); eq(E.normalizeTownName("  maple   hollow 7 "), "Maple Hollow 7"); eq(E.normalizeTownName("Maple Hollow 7"), "Maple Hollow 7"); const m = M("free", "Maple Hollow 7"); eq(m.townName, "Maple Hollow 7"); });

/* ---------------- M4: reconciliation, neighbors, variants ---------------- */
const FIX = [["ch1", "Maple Hollow 7"], ["ch2", "Pebble Creek 3"], ["ch3", "Willow Bend 41"], ["ch4", "Harbor Lane 12"], ["ch5", "Clover Field 9"], ["ch6", "Lantern Row 5"], ["free", "Sunny Crossing 2"], ["free", "Cedar Gate 19", "shops-can-close"]];
t("Results reconcile to the cent on every fixture: start + added + result − spent = end, and result = market change + interest", () => {
  for (const [id, seed, preset] of FIX) { const m = M(id, seed, preset ? { preset } : undefined); for (const pol of ["planner", ...m.scenario.neighbors]) { const st = E.runPolicy(m, pol).state, sum = E.summarizeRun(st, m), mo = sum.money;
    eq(mo.start + mo.added + mo.result - mo.spent, mo.end, id + " " + pol + " panel"); let yrs = 0, yres = 0; for (let y = 1; y * 12 <= st.t; y++) { const p = E.yearPanel(st, m, y); eq(p.money.start + p.money.added + p.money.result - p.money.spent, p.money.end, id + " " + pol + " year " + y); yres += p.money.result; yrs++; }
    const h0 = st.history[0], hN = st.history[st.t]; const resultFromHistory = (hN.nw - h0.nw) - hN.tot.contributionsIn + hN.tot.goalSpending + hN.tot.costSpending; near(yres, resultFromHistory, 0, id + " " + pol + " years sum"); } }
});
t("every neighbor finishes below another neighbor on at least one fixture seed", () => {
  const below = { ada: false, bo: false, cass: false, dev: false };
  for (const [id, seed, preset] of FIX) { const m = M(id, seed, preset ? { preset } : undefined); if (m.scenario.neighbors.length < 2) continue; const nws = {}; for (const n of m.scenario.neighbors) nws[n] = E.summarizeRun(E.runPolicy(m, n).state, m).netWorth; for (const n in nws) if (Object.keys(nws).some(o => o !== n && nws[o] > nws[n])) below[n] = true; }
  for (const n in below) ok(below[n], n + " never finishes below another neighbor on any fixture");
});
t("Cass makes at least one move in every chapter 5 fixture seed", () => { for (const seed of SEEDS) { const r = E.runPolicy(M("ch5", seed), "cass"); ok(r.moves.length >= 1, seed); } });
t("comparePlan: a scenario override keeps the same prices; variants obey their declaration", () => {
  const m = M("ch4", "tm"); const late = E.comparePlan(m, { policy: "ada", overrides: { contribStart: 25 } });
  deep(Array.from(late.market.quotes[0]), Array.from(m.quotes[0]), "same prices"); eq(late.state.totals.contributionsIn, 36 * 1000, "contributions start in month 25");
  const on = E.comparePlan(m, { policy: "ada" }), off = E.comparePlan(m, { policy: "ada", variant: { reinvest: false } });
  eq(on.state.reinvest, true); eq(off.state.reinvest, false); ok(off.state.totals.reinvestSpend === 0 && on.state.totals.reinvestSpend >= 0);
  const m5 = M("ch5", "Clover Field 9"); const sell = E.comparePlan(m5, { policy: "ada", variant: { slumpSell: true } }); ok(sell.moves.some(x => x.kind === "toJar"), "sold at the slump start"); ok(sell.moves.some(x => x.kind === "backIn"), "bought back later");
  const m6 = M("ch6", "Lantern Row 5"); const a = E.comparePlan(m6, { policy: "ada" }), b = E.comparePlan(m6, { policy: "ada", variant: { basket: "BASKET_B" } }); eq(a.state.basket, "BASKET_A"); eq(b.state.basket, "BASKET_B"); ok(E.summarizeRun(b.state, m6).netWorth <= E.summarizeRun(a.state, m6).netWorth, "the high-fee basket never wins on identical holdings");
  const m3 = M("ch3", "Willow Bend 41"); const nb = E.comparePlan(m3, { policy: "ada", variant: { noBuffer: true } }); eq(nb.state.history[1].jar, 0, "no buffer kept");
});
/* ---------------- determinism ---------------- */
t("purity grep", () => { const v = purityViolations(engineSource); eq(v.length, 0, "violations: " + v.join(", ")); });
t("replaying the same action log twice yields byte-identical results", () => { const m = M("ch5", "rep"); const a = JSON.stringify(E.runPolicy(m, "cass").state), b = JSON.stringify(E.runPolicy(M("ch5", "rep"), "cass").state); eq(a, b); });
t("frames never change the ledger: advancing with and without reading frames gives identical states", () => { const m = M("ch2", "fr"); const s = E.createRun({ market: m }); const r1 = E.advance(s, m, 12); const r2 = E.advance(s, m, 12); void r1.frames.length; deep(r1.state, r2.state); });
function fixtureOf(id, seed, preset) {
  const m = M(id, seed, preset ? { preset } : undefined);
  const qh = cyrb128(m.assets.map((a, i) => Array.from(m.quotes[i]).join(",")).join("|") + "|" + Object.keys(m.funds).map(f => Array.from(m.funds[f].navQ).join(",")).join("|")).join("-");
  const totals = {}; for (const pol of ["planner", ...m.scenario.neighbors]) { const st = E.runPolicy(m, pol).state; totals[pol] = { ...st.totals, nw: nw(st, m), goal: st.goal.status, score: E.scorePlanPractice(st, m).total }; }
  return { id, seed, preset: preset || "standard", marketId: m.id, versions: E.VERSION, townName: m.townName, quoteHash: qh, moods: m.moods.join(""), cards: m.cards.map(c => c.id + "@" + c.t + (c.forShop ? ":" + c.forShop : "") + (c.mag !== undefined ? ":" + Math.round(c.mag * 1e6) : "")), devPick: m.devPick, closure: m.closure ? { id: m.closure.id, t: m.closure.announceT, liqQuote: m.closure.liqQuote } : null, index: Math.round(m.index[m.T] * 1e9), totals };
}
const fixDir = resolve(ROOT, "tools/fixtures"); if (!existsSync(fixDir)) mkdirSync(fixDir);
for (const [id, seed, preset] of FIX) {
  const name = `${id}-${preset || "standard"}.json`, path = resolve(fixDir, name);
  t(`fixture ${name}`, () => { const got = fixtureOf(id, seed, preset); if (WRITE || !existsSync(path)) { writeFileSync(path, JSON.stringify(got, null, 1) + "\n"); return; } const want = JSON.parse(readFileSync(path, "utf8")); deep(got, want, name); });
}

console.log(`node tools/test.mjs: ${pass} pass / ${fail} fail`);
for (const f of failures) console.log("  FAIL " + f);
process.exit(fail ? 1 : 0);
