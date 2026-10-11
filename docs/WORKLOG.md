# WORKLOG, MAINSTREET

One box per exit condition. Tick a box only with the command and its result pasted on the line beneath it. Find the first unticked box; that is the current task. Never skip ahead. (Format borrowed from the studio's pixelmeba build directive.)

## M0 Reconcile
- [x] `HANDOFF.md` v2, `STATUS.md`, `docs/` (decisions, WORKLOG, FLEET, ART-BRIEF, playtest, calibration, the three relay inputs), `tools/calibrate-v1.js`, `tools/setup.sh`, `tools/art_manifest.mjs`, `tools/render_sprites.py`, `package.json`, `.gitignore` written (Fable, 2026-10-11)
- [x] Repo skeleton: `index.html` with the three script sections stubbed and `#s-title`, `sw.js`, `manifest.webmanifest`, `icons/`, `art/`, `tools/fixtures/` (Fable, 2026-10-11)
- [x] `node tools/calibrate-v1.js` reproduces the v1 table
      evidence: 2026-10-11, town 0.85 / 2.17 / 5.17, slump runs 0.6822, pi 0.676 / 0.279 / 0.045; pasted into docs/calibration.md
- [x] M0 committed on `main` with message `M0: reconcile, packet v2 and skeleton` (Fable, 2026-10-11, on Stephen's "start the build")
- [x] `bash tools/setup.sh` run; `npx playwright --version` answers; engines named in STATUS.md
      evidence: 2026-10-11, Version 1.64.0, engines: chromium, webkit
- [ ] GitHub Pages enabled (`main`, root); `https://stephenuffugus.github.io/Mainstreet/` serves the stub with the build stamp
      blocked 2026-10-11: the Codespace token gets 403 on the Pages API; Stephen flips it in Settings → Pages
- [ ] Tag `m0`

## M1 Trustworthy core
- [x] `<script id="engine">` complete: PRNG with five streams, PARAMS, market generation with `scripted`/`off`/`noSlump`/`authored`/`full` modes, tick order, draft and pending, neighbors (Ada, Bo, Cass, Dev), scoring
      evidence: index.html engine block, 2026-10-11; node tools/test.mjs 126 pass
- [x] `<script id="content">` complete: chapters, 24 cards with `expectedDirection` and `keeperLine`, presets, opportunities, town-name lists, STRINGS
      evidence: content block; schema test passes for all 24 cards
- [x] `tools/test.mjs`: cash law and share law hold on every tick of every fixture
      evidence: laws checked for 7 scenarios × 2 seeds × 6 policies, 0 violations
- [x] Total-return convention test (noise off): price at drift, price plus reinvested payments at drift plus yield, within 0.1 pt, every asset
      evidence: exact identity within 1e-9 for all six shops (monthly-compounded drift plus yield; see decisions.md)
- [x] Buy lossless at quotes 8, 50, 112 coins; 1,000 cycles lose under 1,000 cc and never gain
      evidence: exhaustive X up to 200 coins at quotes 800, 5000, 11200 cc
- [x] Dividend, suspension, reinvest, Basket internal dividend, look-through (incl. BASKET_A/B), matched fee lab, transfers, goal purchase, contribution, invalid actions, pending tray, closure, neighbor tests, zero wealth, undo: all pass
      evidence: node tools/test.mjs 2026-10-11, 126 pass / 0 fail
- [x] Content tests: card directions (E08 regression), schema completeness, E20 variants, keeper lines, no dashes, town names round-trip
      evidence: in the same run
- [x] Scoring and abuse tests pass; random clicker scores below Ada; Bo scores 100 in chapter 3
      evidence: random 5-seed sum below planner; cash-only planner scores 100 on all 5 chapter 3 seeds (after the funding-order fix, decisions.md)
- [x] Eight golden fixtures written (quote hash, mood path, cards, Dev's pick, final totals for the child plan and all four neighbors)
      evidence: tools/fixtures/*.json, 8 files
- [x] `tools/replay.html` prints PASS for all fixtures in Node and two browser engines via `npx playwright test tools/replay.spec.mjs` (name the engines)
      evidence: npx playwright test, 2026-10-11: chromium 8/8 PASS, webkit 8/8 PASS
- [x] Purity grep passes with the full banned list (HANDOFF section 14)
      evidence: purityViolations() empty
- [x] `node tools/harness.mjs --seeds 10000` with four neighbors finishes under 90 s
      evidence: node tools/harness.mjs --seeds 10000 --family free --policies ada,bo,cass,dev: 58.4 s
- [x] Tag `m1`
      evidence: git tag m1 on the M1 commit

## M2 First playable
- [ ] Home with `#s-title`, build stamp, Continue, "← All Sky Wolf games" (embed block in place)
- [ ] Town with the Bakery, share card, steppers, plan tray, confirm sheet with concrete label
- [ ] Season show (3 months) with skip and reduced-motion strip; never changes a number (test by driving the store with and without rendering)
- [ ] Gazette for chapter 1 (no neighbors), My Plan, Results with stamps "so far" and final
- [ ] Save after every tray change and commit; refresh mid-chapter restores tray and state exactly
- [ ] Opening order in HANDOFF section 8 followed step for step; `docs/playtest.md` M2 checklist complete
- [ ] Placeholders labeled with slot names wherever art is missing; `art/manifest.json` swap works with the M2 batch
- [ ] Tag `m2`

## Fun gate (R12)
- [ ] Penny plays chapter 1 on the reference device; observations recorded in `docs/playtest.md`
- [ ] Penny sees the six-shop street with Ada and Dev (built or paper); asked "do you want to keep going?"; answer recorded
- [ ] Stephen's call recorded in `docs/decisions.md`: proceed to M3, or fix first (what)

## M3 Town loop
- [ ] Chapters 2 and 3 playable end to end
- [ ] Six shops, Basket stall, look-through exposure, Spread and Readiness scoring
- [ ] Keeper lines (three idle each plus card lines) wired to activity state and the year's cards
- [ ] Year show with activity overlays from `G` thresholds, news cues, neighbor coin bars
- [ ] Gazette with Ada, Bo and Dev in fixed order; chapter 2 ending shows child, Ada, Dev on the same market
- [ ] Cost decision with every funding path; Bo pays from the jar in every fixture; "Goal postponed" path records a ledger entry
- [ ] Album collects shop cards, news cards and neighbor cards
- [ ] Fixtures extended to chapters 2 and 3; all tests green
- [ ] Tag `m3`

## M4 Time and uncertainty
- [ ] Chapters 4 to 6 playable; dividends, Reinvest toggle, contributions and routing
- [ ] Authored slump with E13/E14/E15; E12 and E19 variants; Cass joins in chapter 5 and makes at least one move in every chapter 5 fixture
- [ ] Inflation index and "what it can buy"; indexed goal; E23 in the Gazette
- [ ] Fee lab with both cost cards; Basket B never finishes above Basket A on identical holdings
- [ ] Time machine: two gardens, per-chapter experiments, "Try Ada's plan" / "Try Dev's plan", labeled assumptions, save to scrapbook
- [ ] Results reconciles to the cent on every fixture; every neighbor finishes below another on at least one fixture seed
- [ ] `node tools/harness.mjs --chapter 5 --seeds 2000` green
- [ ] Tag `m4`

## M5 Finish and access
- [ ] Scrapbook pages (decoration, discovery pick, year strip, stamps, neighbors' notes); album complete with 40 cards and the "some stories only happen in some towns" line; decoder; saved experiments
- [ ] Free play: presets, New town, Replay this town, Type a town name (normalization, invalid characters)
- [ ] Settings, Grown-ups (incl. origin line, iPhone note, versions), read-aloud with local voices only
- [ ] PWA: manifest, `sw.js` precaching `art/manifest.json` files, update banner standalone only, embed guards; airplane-mode run passes on the Pages URL after install
- [ ] Export/Import per HANDOFF section 11; crafted-JSON import rejected or sanitized
- [ ] Two-tab lock with 20 s staleness; every state in HANDOFF section 8 reachable and tested
- [ ] Keyboard and TalkBack complete chapter 1, queue and clear a trade, confirm a year
- [ ] No horizontal overflow at 412×915, 375×667, 320×568 after the first tap
- [ ] Performance budgets measured on the reference device and recorded in STATUS.md; `art/manifest.json` total recorded
- [ ] Debug panel: seed or town name, jump, ×10, mood ribbon, event log, force a card, neighbor ledgers, 1,000 sims, export JSON
- [ ] Tag `m5`

## M6 Playtest and release candidate
- [ ] `node tools/harness.mjs --seeds 10000 --report docs/calibration.md` on held-out seeds; report complete per HANDOFF section 14, including every neighbor's distribution and Cass's move count
- [ ] Any asset more than 0.5 pt from drift plus yield adjusted, recorded, rerun
- [ ] Five to eight children playtested; notes in `docs/playtest.md`; release blockers checked; product gates reported as counts
- [ ] Known limitations in Grown-ups and release notes
- [ ] Fleet handoff written per `docs/FLEET.md` ("earn moments: none, by design")
- [ ] Fleet checks pass: overflow probe, SW cache scope, no dashes, build stamp, `ready`/`close` in a frame, zero requests during play
- [ ] Portal card `beta:true` live; thumbnail delivered
- [ ] Tag `v1.0.0-rc1`; STATUS.md says what shipped and what did not
